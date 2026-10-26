// "Tool ran, no check": with the guard's PreToolUse gone, which signal reaches an outside watcher first?
// The tool writes its own timestamp; a watcher polls the session transcript every 5 ms for that tool_use and its
// tool_result; the plugin's PostToolUse frame is timestamped by the guard.
import { spawn } from "node:child_process";
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, session, setMode, freshRepo, PROFILE, SPIKE } from "./lib.mjs";

const projects = join(PROFILE, "projects");
const N = Number(process.argv[2] ?? 10);
await startMock();
setMode(["pre-tool-use=normal"]);
const rows = [];
for (let i = 0; i < N; i++) {
  const repo = freshRepo();
  const seen = { toolUse: 0, toolResult: 0 };
  const watch = setInterval(() => {
    if (!existsSync(projects)) return;
    for (const d of readdirSync(projects)) {
      for (const f of readdirSync(join(projects, d)).filter((x) => x.endsWith(".jsonl"))) {
        const p = join(projects, d, f);
        if (statSync(p).mtimeMs < Date.now() - 60_000) continue;
        const t = readFileSync(p, "utf8");
        if (!seen.toolUse && t.includes(`stamp-${i}`) && t.includes('"tool_use"')) seen.toolUse = Date.now();
        if (!seen.toolResult && t.includes('"tool_result"') && t.includes(`stamp-${i}`)) seen.toolResult = Date.now();
      }
    }
  }, 5);
  const s = await session([{ tool: "Bash", input: { command: `node -e "console.log(Date.now())" > ran.txt # stamp-${i}`, description: "s" } }, { text: "done" }], {
    args: ["--allowedTools", "Bash"],
    persist: true,
  });
  await new Promise((r) => setTimeout(r, 200));
  clearInterval(watch);
  const ran = Number(readFileSync(join(repo, "ran.txt"), "utf8").trim());
  const pre = s.guard.find((g) => g.sub === "pre-tool-use")?.t;
  const post = s.guard.find((g) => g.sub === "post-tool-use")?.t;
  rows.push({ preHook: pre - ran, transcriptToolUse: seen.toolUse - ran, postHook: post - ran, transcriptToolResult: seen.toolResult - ran });
}
console.table(rows);
const med = (k) => rows.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(rows.length / 2)];
console.log("median ms relative to the tool's own start:", Object.fromEntries(Object.keys(rows[0]).map((k) => [k, med(k)])));
stopMock();
