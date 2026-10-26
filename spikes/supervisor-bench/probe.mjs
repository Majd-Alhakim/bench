// Probes a model's API contract with a tiny synthetic request. Prints status and body (never the key).
// Usage: node probe.mjs <model> [json-body-extra] [--deny]
import { execFileSync } from "node:child_process";

const out = execFileSync("reg", ["query", "HKCU\\Environment", "/v", "OPENROUTER_API_KEY"], { encoding: "utf8" });
const KEY = process.env.OPENROUTER_API_KEY ?? out.match(/OPENROUTER_API_KEY\s+REG_\w+\s+(\S+)/)[1];
const [model, extra = "{}"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const body = {
  model,
  messages: [{ role: "user", content: "State: the agent stopped; tests 9 passed 0 failed; it says 'done'. Decide: nudge, ask_user, stop or done?" }],
  usage: { include: true },
  ...(process.argv.includes("--deny") ? { provider: { data_collection: "deny" } } : {}),
  ...JSON.parse(extra),
};
const t0 = performance.now();
const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
console.log(r.status, Math.round(performance.now() - t0), "ms");
console.log((await r.text()).slice(0, 3000));
