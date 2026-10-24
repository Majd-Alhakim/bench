// Spike S0-1 (throwaway): can the Agent SDK run on the user's own `claude login`, with per-agent isolation?
// Usage: node run.mjs   (writes out/results.json; never reads or prints credentials)
import { query, createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const CLAUDE = process.env.CLAUDE_BIN ?? path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");
const CWD = path.join(tmpdir(), "bench-spike-s0-1");
mkdirSync(CWD, { recursive: true });

// ADR-0002: an API key in the env would silently switch billing to the API. Strip it.
const { ANTHROPIC_API_KEY: _drop, ...cleanEnv } = process.env;

const spikeTools = () =>
  createSdkMcpServer({
    name: "bench_spike",
    version: "0.0.1",
    tools: [tool("whoami", "Returns the agent id the runner assigned.", { note: z.string().optional() }, async () => ({ content: [{ type: "text", text: "agent-a" }] }))],
  });

function isolated(model) {
  return {
    model,
    pathToClaudeCodeExecutable: CLAUDE,
    cwd: CWD,
    env: cleanEnv,
    settingSources: [],
    strictMcpConfig: true,
    mcpServers: { bench_spike: spikeTools() },
    tools: ["Read"],
    skills: [],
    persistSession: false,
    maxTurns: 1,
    systemPrompt: "You are a spike test agent. Answer in one word.",
  };
}

const baseline = (model) => ({ model, pathToClaudeCodeExecutable: CLAUDE, cwd: CWD, env: cleanEnv, persistSession: false, maxTurns: 1 });

async function run(label, prompt, options, { usage = false } = {}) {
  const t0 = Date.now();
  const q = query({ prompt, options });
  const out = { label, model: options.model };
  for await (const m of q) {
    if (m.type === "system" && m.subtype === "init") {
      out.init = {
        apiKeySource: m.apiKeySource,
        claude_code_version: m.claude_code_version,
        model: m.model,
        tools: m.tools,
        mcp_servers: m.mcp_servers,
        skills: m.skills,
        plugins: (m.plugins ?? []).map((p) => p.name),
        agents: m.agents,
      };
      if (usage) {
        try {
          const u = await q.usage_EXPERIMENTAL_MAY_CHANGE_DO_NOT_RELY_ON_THIS_API_YET({ skipBehaviors: true });
          out.planUsage = { subscription_type: u.subscription_type, rate_limits_available: u.rate_limits_available, rate_limits: u.rate_limits };
        } catch (e) {
          out.planUsage = { error: String(e?.message ?? e) };
        }
      }
    }
    if (m.type === "assistant") out.text = (m.message?.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("").slice(0, 80);
    if (m.type === "result") {
      out.result = { subtype: m.subtype, is_error: m.is_error, num_turns: m.num_turns, total_cost_usd: m.total_cost_usd, usage: m.usage, modelUsage: m.modelUsage };
    }
  }
  out.wall_ms = Date.now() - t0;
  return out;
}

const results = { started: new Date().toISOString(), apiKeyInParentEnv: Boolean(process.env.ANTHROPIC_API_KEY), runs: [] };
const log = (r) => {
  results.runs.push(r);
  const i = r.init ?? {};
  console.log(`${r.label}: model=${i.model} apiKeySource=${i.apiKeySource} mcp=${(i.mcp_servers ?? []).map((s) => s.name).join("|") || "-"} skills=${(i.skills ?? []).length} plugins=${(i.plugins ?? []).length} tools=${(i.tools ?? []).length} cost=$${r.result?.total_cost_usd} wall=${r.wall_ms}ms text=${JSON.stringify(r.text)}`);
};

log(await run("baseline-haiku (no isolation)", "Say ok.", baseline("claude-haiku-5-5")));
log(await run("isolated-haiku", "Say ok.", isolated("claude-haiku-5-5"), { usage: true }));
log(await run("isolated-opus", "Say ok.", isolated("claude-opus-5-5")));

const tPar = Date.now();
const par = await Promise.all([1, 2, 3].map((n) => run(`parallel-${n}`, "Say ok.", isolated("claude-haiku-5-5"))));
par.forEach(log);
results.parallel_wall_ms = Date.now() - tPar;
log(await run("after-parallel usage", "Say ok.", isolated("claude-haiku-5-5"), { usage: true }));

mkdirSync("out", { recursive: true });
writeFileSync("out/results.json", JSON.stringify(results, null, 2));
console.log(`parallel wall: ${results.parallel_wall_ms}ms; wrote out/results.json`);
