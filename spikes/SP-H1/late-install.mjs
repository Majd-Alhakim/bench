// Does a session that is already running pick up a plugin installed after it started?
// One long-lived headless session (stream-json input); the plugin is installed between its first and second prompt.
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, cleanEnv, freshRepo, repoDir, CLI, SPIKE, GUARD_LOG, PORT } from "./lib.mjs";

const SCRIPT = join(SPIKE, "mock-script.json");
const plugin = (...a) => spawnSync(CLI, ["plugin", ...a], { env: cleanEnv(), encoding: "utf8" }).stdout.trim().split("\n").at(-1);
const guardSubs = () => (existsSync(GUARD_LOG) ? readFileSync(GUARD_LOG, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l).sub) : []);

async function run(label, change) {
  await startMock();
  freshRepo();
  console.log(label, "| before:", plugin("uninstall", "eucas@eucas-spike", "--scope", "user"));
  const sentinel = (n) => ({ tool: "Bash", input: { command: `echo ${n} > ran${n}.txt`, description: "s" } });
  writeFileSync(SCRIPT, JSON.stringify([sentinel(1), { text: "one" }, sentinel(2), { text: "two" }, sentinel(3), { text: "three" }]));
  await fetch(`http://127.0.0.1:${PORT}/__reload`, { headers: { connection: "close" } });
  rmSync(GUARD_LOG, { force: true });

  const child = spawn(CLI, ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--allowedTools", "Bash", "--no-session-persistence"], {
    cwd: repoDir(),
    env: cleanEnv(),
    windowsHide: true,
  });
  let buf = "";
  const results = [];
  child.stdout.on("data", (d) => {
    buf += d;
    for (const line of buf.split("\n").slice(0, -1)) if (line.includes('"type":"result"')) results.push(line);
    buf = buf.split("\n").at(-1);
  });
  const ask = async (text) => {
    const n = results.length;
    child.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content: text } }) + "\n");
    while (results.length === n) await new Promise((r) => setTimeout(r, 100));
  };
  await ask("first");
  console.log("  turn 1 guard events:", guardSubs().join(",") || "none");
  console.log("  change:", change());
  rmSync(GUARD_LOG, { force: true });
  await ask("second");
  console.log("  turn 2 guard events:", guardSubs().join(",") || "none");
  rmSync(GUARD_LOG, { force: true });
  await new Promise((r) => setTimeout(r, 3000));
  await ask("third");
  console.log("  turn 3 (3 s later) guard events:", guardSubs().join(",") || "none");
  child.stdin.end();
  await new Promise((r) => child.on("exit", r));
  stopMock();
}

await run("install mid-session", () => plugin("install", "eucas@eucas-spike", "--scope", "user"));

// Same question for a hook written straight into user settings.json (the D-4 (b) fallback path).
const userSettings = join(SPIKE, "profile", "settings.json");
const original = readFileSync(userSettings, "utf8");
await run("user settings hook added mid-session", () => {
  const s = JSON.parse(readFileSync(userSettings, "utf8"));
  s.hooks = { PreToolUse: [{ matcher: "*", hooks: [{ type: "command", command: join(SPIKE, "limits", "eucas-guard.exe"), args: ["pre-tool-use"], timeout: 10 }] }] };
  writeFileSync(userSettings, JSON.stringify(s, null, 1));
  return "hook written to user settings";
});
writeFileSync(userSettings, original);
plugin("install", "eucas@eucas-spike", "--scope", "user");
