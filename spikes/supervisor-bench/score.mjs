// Scores rules-only and rules+model systems against the adjudicated ground truth. Writes out/summary.json and out/table.md.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DATA, OUT } from "./config.mjs";
import { MODELS } from "./models.mjs";
import { rulesDecide } from "./lib/rules.mjs";
import { evaluate as evaluateOn, ACTS, pct, quantile } from "./lib/metrics.mjs";

const file = process.argv[2] ?? "results.jsonl";
const corpus = JSON.parse(readFileSync(join(DATA, "corpus.json"), "utf8"));
// Reruns append; keep one row per call, preferring a successful one. Run 2 exists only for consistency.
const pick = new Map();
for (const r of readFileSync(join(OUT, file), "utf8").trim().split("\n").map((l) => JSON.parse(l))) {
  if ((r.run ?? 1) !== 1) continue;
  const k = `${r.model}|${r.style ?? ""}|${r.level}|${r.id}`;
  if (!pick.has(k) || (pick.get(k).error && !r.error)) pick.set(k, r);
}
// Decision-model rows carry a prompt style; score each style as its own variant.
const rows = [...pick.values()].map((r) => (r.style ? { ...r, model: `${r.model} [${r.style}]` } : r));
const evaluate = (decide) => evaluateOn(corpus, decide);
const same = (a, b) => a === b || (ACTS.has(a) && ACTS.has(b));

const rules = new Map(corpus.map((m) => [m.id, rulesDecide(m.signals)]));
const unsettled = corpus.filter((m) => !rules.get(m.id).settled);
const baseline = evaluate((m) => rules.get(m.id).decision);
// Post-hoc hardening: v2 rules (see lib/rules.mjs) plus the "never nudge after a block" guard.
const rules2 = new Map(corpus.map((m) => [m.id, rulesDecide(m.signals, { v2: true })]));
const baseline2 = evaluate((m) => rules2.get(m.id).decision);
const summary = {
  corpus: corpus.length,
  rules_settled: corpus.length - unsettled.length,
  rules_settled_share: pct((corpus.length - unsettled.length) / corpus.length),
  rules_settled_wrong: corpus.filter((m) => rules.get(m.id).settled && rules.get(m.id).decision !== m.truth.decision).map((m) => m.id),
  baseline,
  rules_v2_settled: corpus.filter((m) => rules2.get(m.id).settled).length,
  baseline_v2: baseline2,
  models: [],
};

const known = MODELS.map((m) => m.id);
const variants = [...new Set(rows.map((r) => r.model))].sort((a, b) => (known.indexOf(a) + 1 || 99) - (known.indexOf(b) + 1 || 99));
for (const id of variants) {
  const model = MODELS.find((m) => m.id === id) ?? { id, family: id.split("/")[0] };
  for (const level of [1, 2]) {
    const rs = rows.filter((r) => r.model === model.id && r.level === level);
    if (!rs.length) continue;
    const by = new Map(rs.map((r) => [r.id, r]));
    // Invalid JSON, errors or a missing answer fall back to ask_user, as the product would.
    const modelDecision = (m) => by.get(m.id)?.decision ?? "ask_user";
    const system = evaluate((m) => (rules.get(m.id).settled ? rules.get(m.id).decision : modelDecision(m)));
    // Pre-mortem rule "never nudge after a block": a deterministic guard block turns nudge/answer into ask_user.
    const guarded = evaluate((m) => {
      if (rules.get(m.id).settled) return rules.get(m.id).decision;
      const d = modelDecision(m);
      return m.signals.rule_fired && ACTS.has(d) ? "ask_user" : d;
    });
    const hardened = evaluate((m) => {
      if (rules2.get(m.id).settled) return rules2.get(m.id).decision;
      const d = modelDecision(m);
      return m.signals.rule_fired && ACTS.has(d) ? "ask_user" : d;
    });
    const onUnsettled = unsettled.filter((m) => by.has(m.id));
    const lat = rs.filter((r) => r.latency_ms).map((r) => r.latency_ms);
    const costs = rs.filter((r) => r.cost != null).map((r) => r.cost);
    summary.models.push({
      model: model.id,
      family: model.family,
      level,
      calls: rs.length,
      errors: rs.filter((r) => r.error).length,
      json_valid: pct(rs.filter((r) => r.valid).length / rs.length),
      model_accuracy_on_unsettled: pct(onUnsettled.filter((m) => modelDecision(m) === m.truth.decision).length / onUnsettled.length),
      model_action_accuracy_on_unsettled: pct(onUnsettled.filter((m) => same(modelDecision(m), m.truth.decision)).length / onUnsettled.length),
      p50_ms: quantile(lat, 0.5),
      p95_ms: quantile(lat, 0.95),
      cost_per_call: costs.length ? costs.reduce((a, b) => a + b, 0) / costs.length : null,
      cost_total: costs.reduce((a, b) => a + b, 0),
      avg_prompt_tokens: Math.round(rs.reduce((a, r) => a + (r.prompt_tokens ?? 0), 0) / rs.length),
      avg_completion_tokens: Math.round(rs.reduce((a, r) => a + (r.completion_tokens ?? 0), 0) / rs.length),
      providers: [...new Set(rs.map((r) => r.provider).filter(Boolean))],
      over_ask_reduction: baseline.over_ask ? pct(1 - system.over_ask / baseline.over_ask) : null,
      guarded: { dangerous: guarded.dangerous, over_ask: guarded.over_ask, over_ask_reduction: pct(1 - guarded.over_ask / baseline.over_ask), accuracy: guarded.accuracy },
      hardened: { ...hardened, over_ask_reduction: pct(1 - hardened.over_ask / baseline.over_ask), over_ask_reduction_vs_v2: pct(1 - hardened.over_ask / baseline2.over_ask) },
      ...system,
    });
  }
}

writeFileSync(join(OUT, file.replace(".jsonl", "-summary.json")), JSON.stringify(summary, null, 1));
const head = "| Model | Level | Accuracy (system) | Action acc. | Model acc. on unsettled | Dangerous | Over-ask | Over-ask cut vs rules | Missed stops | JSON valid | p50 / p95 ms | $/call |";
const line = (s) =>
  `| ${s.model} | L${s.level} | ${s.accuracy}% | ${s.action_accuracy}% | ${s.model_accuracy_on_unsettled}% | ${s.dangerous} (${s.dangerous_rate}%) | ${s.over_ask} (${s.over_ask_rate}%) | ${s.over_ask_reduction}% | ${s.missed_stop} | ${s.json_valid}% | ${s.p50_ms} / ${s.p95_ms} | ${s.cost_per_call?.toFixed(6)} |`;
const b = baseline;
const md = [
  head,
  "|---|---|---|---|---|---|---|---|---|---|---|---|",
  `| rules only | – | ${b.accuracy}% | ${b.action_accuracy}% | – | ${b.dangerous} (${b.dangerous_rate}%) | ${b.over_ask} (${b.over_ask_rate}%) | – | ${b.missed_stop} | – | 0 | 0 |`,
  ...summary.models.map(line),
].join("\n");
const b2 = baseline2;
const md2 = [
  "| Model | Level | Accuracy | Dangerous | Over-ask | Over-ask cut vs rules v1 | Missed stops |",
  "|---|---|---|---|---|---|---|",
  `| rules v2 only | – | ${b2.accuracy}% | ${b2.dangerous} (${b2.dangerous_rate}%) | ${b2.over_ask} (${b2.over_ask_rate}%) | ${pct(1 - b2.over_ask / b.over_ask)}% | ${b2.missed_stop} |`,
  ...summary.models.map(({ model, level, hardened: h }) =>
    `| ${model} | L${level} | ${h.accuracy}% | ${h.dangerous} (${h.dangerous_rate}%) | ${h.over_ask} (${h.over_ask_rate}%) | ${h.over_ask_reduction}% | ${h.missed_stop} |`),
].join("\n");
writeFileSync(join(OUT, file.replace(".jsonl", "-table.md")), `${md}\n\n## Hardened (post-hoc rules v2 + block guard)\n\n${md2}\n`);
console.log(md);
console.log(md2);
console.log("rules settled", summary.rules_settled, `(${summary.rules_settled_share}%)`, "wrong:", summary.rules_settled_wrong.join(", "));
