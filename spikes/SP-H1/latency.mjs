// Guard start-to-exit latency with Defender on, the way Claude Code launches it (exec form, JSON on stdin).
// Cold = the first run of a freshly copied exe (Defender scans a new file); warm = repeated runs.
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SPIKE = join(tmpdir(), "eucas-spikes");
const BENCH = join(SPIKE, "bench");
const SRC = join(SPIKE, "target", "release", "eucas-guard.exe");
const N = Number(process.argv[2] ?? 500);
rmSync(BENCH, { recursive: true, force: true });
mkdirSync(BENCH, { recursive: true });

const input = JSON.stringify({
  session_id: "bench",
  transcript_path: join(BENCH, "t.jsonl"),
  cwd: BENCH,
  hook_event_name: "PreToolUse",
  tool_name: "Bash",
  tool_input: { command: "git push origin main", description: "x" },
});
const env = { ...process.env, EUCAS_SPIKE_DIR: BENCH };
const run = (exe) => {
  const t = process.hrtime.bigint();
  const r = spawnSync(exe, ["pre-tool-use"], { input, env, windowsHide: true });
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  if (!String(r.stdout).includes("deny")) throw new Error("no deny");
  return ms;
};
const pct = (xs, p) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor((p / 100) * xs.length))];

const cold = [];
for (let i = 0; i < 10; i++) {
  const exe = join(BENCH, `copy-${i}`, "eucas-guard.exe");
  mkdirSync(join(BENCH, `copy-${i}`));
  copyFileSync(SRC, exe);
  cold.push(run(exe));
}
const warm = [];
const exe = join(BENCH, "copy-0", "eucas-guard.exe");
for (let i = 0; i < N; i++) warm.push(run(exe));
const internal = readFileSync(join(BENCH, "guard-log.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l).elapsed_us / 1000);

const fmt = (xs) => ({ n: xs.length, p50: pct(xs, 50).toFixed(1), p95: pct(xs, 95).toFixed(1), p99: pct(xs, 99).toFixed(1), max: Math.max(...xs).toFixed(1) });
console.log("cold (new file, first run):", fmt(cold));
console.log("warm wall (spawn to exit):", fmt(warm));
console.log("inside the guard (parse + decide + spool + log):", fmt(internal));
