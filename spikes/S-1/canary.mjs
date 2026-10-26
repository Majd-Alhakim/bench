// S-1: the local canary through the real Claude Code hook path with no model turn. A loopback stand-in for the
// Messages API (ANTHROPIC_BASE_URL + a dummy key, both only in the canary's own env) plays one scripted tool call,
// `git push origin main`, in a throwaway repo; the guard must deny it with a receipt. Reports tokens and any traffic
// that left the machine.
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, session, setMode, freshRepo, firstToolResult, SPIKE } from "../SP-H1/lib.mjs";

const runs = Number(process.argv[2] ?? 20);
const dbg = join(SPIKE, "canary-debug.log");
await startMock();
setMode([]);
const out = [];
for (let i = 0; i < runs; i++) {
  freshRepo();
  rmSync(dbg, { force: true });
  const s = await session([{ tool: "Bash", input: { command: "git push origin main", description: "Eucas canary" } }, { text: "canary done" }], {
    args: ["--debug-file", dbg, "--max-turns", "3"],
  });
  const result = s.events.find((e) => e.type === "result");
  const receipt = (firstToolResult(s)?.content ?? "").match(/receipt (eucas-spike-\d+)/)?.[1];
  const log = readFileSync(dbg, "utf8");
  const hosts = [...new Set([...log.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map((m) => m[1]).filter((h) => !/^(127\.0\.0\.1|localhost)$/.test(h)))];
  out.push({ ms: s.wallMs, receipt: Boolean(receipt), tokensIn: result?.usage?.input_tokens ?? 0, tokensOut: result?.usage?.output_tokens ?? 0, costUsd: result?.total_cost_usd ?? 0, hostsInDebugLog: hosts.join(" ") || "-" });
}
console.table(out);
const ms = out.map((o) => o.ms).sort((a, b) => a - b);
console.log({ runs, denied: out.filter((o) => o.receipt).length, p50ms: ms[Math.floor(runs / 2)], p95ms: ms[Math.floor(runs * 0.95)], tokens: out.reduce((a, o) => a + o.tokensIn + o.tokensOut, 0), mockOtherCalls: s_other() });
function s_other() {
  try {
    return readFileSync(join(SPIKE, "mock-log.jsonl"), "utf8").split("\n").filter((l) => l.includes('"other"')).length;
  } catch {
    return 0;
  }
}
stopMock();
