// Calls each model on the moments the rules could not settle, at both data levels, with a hard spend cap.
// Usage: node run-models.mjs [--pilot] [--only model-id,...]
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { DATA, OUT, HARD_STOP_USD } from "./config.mjs";
import { MODELS } from "./models.mjs";
import { rulesDecide } from "./lib/rules.mjs";
import { systemPrompt, userPrompt, RESPONSE_SCHEMA, DECISIONS } from "./lib/prompt.mjs";

const PILOT = process.argv.includes("--pilot");
const RUN = process.argv.includes("--repeat") ? 2 : 1; // second pass over the pilot set, for consistency
const onlyArg = process.argv[process.argv.indexOf("--only") + 1];
const ONLY = process.argv.includes("--only") ? onlyArg.split(",") : null;
// Extra candidates the client asked for; run only when named with --only.
const EXTRA = [{ id: "typesafe/jev-router", family: "Router (not open-weight)", size: "routes to other models", price: null, reasoning: null }];
const RESULTS = join(OUT, PILOT ? "pilot.jsonl" : "results.jsonl");
const LEDGER = join(OUT, "spend.json");
const CONCURRENCY = 4;
const TIMEOUT_MS = 30_000;

function apiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  // Set with setx, so read it from the user's registry environment. Never logged.
  const out = execFileSync("reg", ["query", "HKCU\\Environment", "/v", "OPENROUTER_API_KEY"], { encoding: "utf8" });
  const m = out.match(/OPENROUTER_API_KEY\s+REG_\w+\s+(\S+)/);
  if (!m) throw new Error("OPENROUTER_API_KEY not found");
  return m[1];
}
const KEY = apiKey();

// Spend ledger spans pilot and full runs so the cap is cumulative.
let spent = existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")).usd : 0;
const writeLedger = () => writeFileSync(LEDGER, JSON.stringify({ usd: spent }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The one retry/backoff helper: 3 retries on 429/5xx/timeouts. */
async function withRetry(fn) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= 3 || !err.retryable) throw err;
      await sleep(4000 * 2 ** attempt);
    }
  }
}

async function call(model, moment, level) {
  const body = {
    model: model.id,
    messages: [
      { role: "system", content: systemPrompt() },
      { role: "user", content: userPrompt(moment, level) },
    ],
    temperature: 0,
    max_tokens: 1500,
    response_format: RESPONSE_SCHEMA,
    provider: { zdr: true, data_collection: "deny", require_parameters: true, sort: "latency" },
    usage: { include: true },
    ...(model.reasoning === "low" ? { reasoning: { effort: "low", exclude: true } } : {}),
    ...(model.reasoning === "off" ? { reasoning: { enabled: false } } : {}),
  };
  const t0 = performance.now();
  const res = await withRetry(async () => {
    const ctl = AbortSignal.timeout(TIMEOUT_MS);
    let r;
    try {
      r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "X-Title": "eucas-supervisor-bench" },
        body: JSON.stringify(body),
        signal: ctl,
      });
    } catch (e) {
      throw Object.assign(new Error(`network: ${e.name}`), { retryable: true });
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.error) {
      const code = j.error?.code ?? r.status;
      throw Object.assign(new Error(`http ${code}: ${String(j.error?.message ?? "").slice(0, 160)}`), { retryable: code === 429 || code >= 500 });
    }
    return j;
  });
  const latency_ms = Math.round(performance.now() - t0);
  const content = res.choices?.[0]?.message?.content ?? "";
  let parsed = null;
  try {
    parsed = JSON.parse(content.replace(/^\s*```(json)?/i, "").replace(/```\s*$/, ""));
  } catch {}
  const valid = !!parsed && DECISIONS.includes(parsed.decision) && (!/^(nudge|answer_from_rules)$/.test(parsed.decision) || !!parsed.nudge_text?.trim());
  return {
    decision: valid ? parsed.decision : null,
    nudge_text: parsed?.nudge_text ?? null,
    reason: parsed?.reason ?? null,
    valid,
    raw: valid ? undefined : content.slice(0, 300),
    latency_ms,
    cost: res.usage?.cost ?? null,
    provider: res.provider ?? null,
    routed_model: res.model ?? null,
    prompt_tokens: res.usage?.prompt_tokens ?? null,
    completion_tokens: res.usage?.completion_tokens ?? null,
    reasoning_tokens: res.usage?.completion_tokens_details?.reasoning_tokens ?? null,
  };
}

const corpus = JSON.parse(readFileSync(join(DATA, "corpus.json"), "utf8"));
let moments = corpus.filter((m) => !rulesDecide(m.signals).settled);
if (PILOT) {
  // About 20, spread over situations.
  const by = Object.groupBy(moments, (m) => m.situation);
  moments = Object.values(by).flatMap((xs) => xs.filter((_, i) => i % Math.ceil(xs.length / 3) === 0)).slice(0, 20);
}

mkdirSync(OUT, { recursive: true });
const done = new Set(
  existsSync(RESULTS) ? readFileSync(RESULTS, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((r) => !r.error).map((r) => `${r.model}|${r.level}|${r.id}|${r.run ?? 1}`) : [],
);
console.log(`${moments.length} moments × ${ONLY?.length ?? MODELS.length} models × 2 levels; spent so far $${spent.toFixed(4)}`);

for (const model of [...MODELS, ...EXTRA].filter((m) => (ONLY ? ONLY.includes(m.id) : MODELS.includes(m)))) {
  const jobs = [1, 2].flatMap((level) => moments.map((m) => ({ m, level }))).filter((j) => !done.has(`${model.id}|${j.level}|${j.m.id}|${RUN}`));
  let i = 0;
  let modelCost = 0;
  // Space call starts for models with a provider rate limit.
  const gap = model.rpm ? 60_000 / model.rpm : 0;
  let nextStart = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const { m, level } = jobs[i++];
      if (gap) {
        const wait = Math.max(0, nextStart - Date.now());
        nextStart = Math.max(nextStart, Date.now()) + gap;
        await sleep(wait);
      }
      if (spent >= HARD_STOP_USD) throw new Error(`HARD STOP: spent $${spent.toFixed(4)} >= $${HARD_STOP_USD}`);
      let row;
      try {
        row = await call(model, m, level);
      } catch (err) {
        row = { error: err.message };
      }
      spent += row.cost ?? 0;
      modelCost += row.cost ?? 0;
      appendFileSync(RESULTS, JSON.stringify({ model: model.id, level, id: m.id, run: RUN, ...row }) + "\n");
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  writeLedger();
  console.log(`${model.id}: ${jobs.length} calls, $${modelCost.toFixed(4)}; cumulative $${spent.toFixed(4)}`);
}
writeLedger();
