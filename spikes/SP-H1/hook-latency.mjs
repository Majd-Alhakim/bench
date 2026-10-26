// p50/p95 of the guard as Claude Code itself times it ("Hooks: PreToolUse [...] finished ... (N ms)" in the debug
// log), over many tool calls in one session, with Defender on. Also the guard's own start-to-exit view.
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, session, setMode, freshRepo, SPIKE } from "./lib.mjs";

const N = Number(process.argv[2] ?? 200);
const dbg = join(SPIKE, "latency-debug.log");
await startMock();
freshRepo();
setMode([]);
rmSync(dbg, { force: true });
const turns = Array.from({ length: N }, (_, i) => ({ tool: "Bash", input: { command: `echo ${i}`, description: "n" } }));
const s = await session([...turns, { text: "done" }], { args: ["--allowedTools", "Bash", "--debug-file", dbg], timeoutMs: 600_000 });
const per = (event) =>
  readFileSync(dbg, "utf8")
    .split("\n")
    .filter((l) => l.includes(`Hooks: ${event}`) && l.includes("eucas-guard") && l.includes("finished"))
    .map((l) => Number(l.match(/\((\d+)ms\)/)?.[1]))
    .filter((n) => !Number.isNaN(n));
const stats = (xs) => {
  const a = [...xs].sort((x, y) => x - y);
  const q = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  return { n: a.length, p50: q(0.5), p95: q(0.95), p99: q(0.99), max: a.at(-1) };
};
console.log("session wall ms:", s.wallMs);
console.log("PreToolUse as timed by Claude Code:", stats(per("PreToolUse")));
console.log("PostToolUse as timed by Claude Code:", stats(per("PostToolUse")));
console.log("guard internal ms:", stats(s.guard.filter((g) => g.sub === "pre-tool-use").map((g) => g.elapsed_us / 1000)));
stopMock();
