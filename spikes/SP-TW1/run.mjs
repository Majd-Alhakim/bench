// One tripwire trial: three sessions in three folders under %TEMP%\eucas-spikes\tw1; session A mass-deletes, B and
// C don't. Reports stop latency, tree-gone time, overflows, survivors, and that B and C were left alone.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const [, , modeA = "rmdir", bufKb = "64", nA = "50000", threshold = "1000"] = process.argv;
const countOnly = Number(threshold) > Number(nA);
const SAFE = join(tmpdir(), "eucas-spikes", "tw1");
const ROOT = join(SAFE, `run-${Date.now()}`);
const TW = join(tmpdir(), "eucas-spikes", "tw-target", "release", "tripwire.exe");
mkdirSync(ROOT, { recursive: true });
const count = (d) => {
  let n = 0;
  const stack = [d];
  while (stack.length) {
    const x = stack.pop();
    if (!existsSync(x)) continue;
    for (const e of readdirSync(x, { withFileTypes: true })) e.isDirectory() ? stack.push(join(x, e.name)) : n++;
  }
  return n;
};
const t0 = Date.now();
spawnSync(TW, ["make", join(ROOT, "A"), nA]);
spawnSync(TW, ["make", join(ROOT, "B"), "2000"]);
spawnSync(TW, ["make", join(ROOT, "C"), "2000"]);
const madeMs = Date.now() - t0;

const sim = (name, mode) => spawn(process.execPath, [fileURLToPath(new URL("./session-sim.mjs", import.meta.url)), join(ROOT, name), mode], { stdio: "ignore" });
const A = sim("A", modeA), B = sim("B", "idle"), C = sim("C", "slow");
const w = spawn(TW, ["watch", ROOT, threshold, "10000", bufKb, `A=${A.pid},B=${B.pid},C=${C.pid}`]);
const events = [];
let buf = "";
w.stdout.on("data", (d) => {
  buf += d;
  const lines = buf.split("\n");
  buf = lines.pop();
  for (const l of lines) if (l.trim()) events.push(JSON.parse(l));
});
// Give the delete 2 s to start, then up to 30 s to trip, then 8 s to see deletes continue.
const deadline = Date.now() + 40_000;
// Count-only runs wait for folder A to be gone (plus 2 s for the last events) instead of a trip.
const finished = () => (countOnly ? !existsSync(join(ROOT, "A")) : events.some((e) => e.kind === "stopped"));
while (Date.now() < deadline + (countOnly ? 60_000 : 0) && !finished()) await new Promise((r) => setTimeout(r, 100));
await new Promise((r) => setTimeout(r, countOnly ? 2000 : 8000));
w.kill();
const alive = (p) => spawnSync("tasklist", ["/FI", `PID eq ${p.pid}`, "/NH"]).stdout.toString().includes(String(p.pid));
const out = {
  modeA, bufKb: Number(bufKb), filesA: Number(nA), madeMs,
  threshold: events.find((e) => e.kind === "threshold"),
  stopped: events.find((e) => e.kind === "stopped"),
  overflows: events.filter((e) => e.kind === "overflow").length,
  afterKillDeletes: events.filter((e) => e.kind === "after_kill_delete").reduce((a, e) => a + e.n, 0),
  lastAfterKillMs: events.filter((e) => e.kind === "after_kill_delete").at(-1)?.ms_after_kill ?? null,
  rekill: events.find((e) => e.kind === "rekill"),
  countedA: events.filter((e) => e.kind === "total").at(-1)?.deletes?.A ?? 0,
  survivorsA: count(join(ROOT, "A")),
  B: { files: count(join(ROOT, "B")), alive: alive(B) },
  C: { files: count(join(ROOT, "C")), alive: alive(C) },
  wrongTrips: events.filter((e) => e.kind === "threshold" && e.session !== "A").length,
};
console.log(JSON.stringify(out));
for (const p of [A, B, C]) p.kill();
