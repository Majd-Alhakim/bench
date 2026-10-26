// Runs one real headless Claude Code session per Shelfie task (the user's own login, Sonnet) and saves the stream.
import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { WORK, OUT, TASKS, TASKS2 } from "./config.mjs";

const RAW = join(OUT, "raw");
mkdirSync(RAW, { recursive: true });

const ALLOWED = [
  "Read", "Edit", "Write", "Glob", "Grep",
  "Bash(npm test:*)", "Bash(npm run:*)", "Bash(npx vitest:*)", "Bash(npx tsc:*)", "Bash(npm install:*)",
  "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)", "Bash(ls:*)",
];
// The guard's deterministic rules: secrets files are off limits.
const DISALLOWED = ["Read(./.env)", "Edit(./.env)", "Write(./.env)"];

const env = { ...process.env };
delete env.ANTHROPIC_API_KEY; // subscription only, never API billing
delete env.OPENROUTER_API_KEY;

const round = process.argv.includes("--round2") ? 2 : 1;

function sessionId(id) {
  const first = JSON.parse(readFileSync(join(RAW, `${id}.jsonl`), "utf8").split("\n")[0]);
  return first.e.session_id;
}

function run(task) {
  return new Promise((resolve) => {
    const args = [
      ...(task.resume ? ["--resume", sessionId(task.id)] : []),
      "-p", task.prompt,
      "--output-format", "stream-json", "--verbose",
      "--model", "sonnet",
      "--max-turns", "40",
      "--setting-sources", "project",
      "--strict-mcp-config",
      "--allowedTools", ...ALLOWED,
      "--disallowedTools", ...DISALLOWED,
    ];
    const started = Date.now();
    const out = createWriteStream(join(RAW, round === 2 && task.resume ? `${task.id}-r2.jsonl` : `${task.id}.jsonl`));
    const child = spawn("claude", args, { cwd: join(WORK, task.id), env, stdio: ["ignore", "pipe", "pipe"] });
    // Wall-clock stamp per line so we can derive real timings later.
    let buf = "";
    child.stdout.on("data", (d) => {
      buf += d;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (line) out.write(JSON.stringify({ t: Date.now() - started, e: JSON.parse(line) }) + "\n");
      }
    });
    child.stderr.on("data", (d) => process.stderr.write(`[${task.id}] ${d}`));
    const kill = setTimeout(() => child.kill(), 20 * 60 * 1000);
    child.on("close", (code) => {
      clearTimeout(kill);
      out.end();
      console.log(`${task.id}: exit ${code} after ${Math.round((Date.now() - started) / 1000)} s`);
      resolve();
    });
  });
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
await Promise.all((round === 2 ? TASKS2 : TASKS).filter((t) => !only.length || only.includes(t.id)).map(run));
