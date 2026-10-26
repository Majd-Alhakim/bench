// Installs the recorder into the isolated spike profile (scratch folders only), plays three mock sessions through the
// real CLI, prints the recorded moments, and uninstalls. Never touches the real ~/.claude or %LOCALAPPDATA%\Eucas.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { startMock, stopMock, session, setMode, freshRepo, SPIKE, PROFILE } from "../SP-H1/lib.mjs";

const T = join(SPIKE, "sup2test");
const env = { EUCAS_SUP2_HOME: join(T, "sup2-recorder"), EUCAS_SUP2_DIR: join(T, "recordings") };
rmSync(T, { recursive: true, force: true });
const here = (f) => fileURLToPath(new URL(`./recorder/${f}`, import.meta.url));
const run = (f, ...a) => console.log(spawnSync(process.execPath, [here(f), "--config-dir", PROFILE, ...a], { env: { ...process.env, ...env }, encoding: "utf8" }).stdout.trim());
const before = readFileSync(join(PROFILE, "settings.json"), "utf8");
run("install.mjs");

await startMock();
setMode([]);
const fail = { tool: "Bash", input: { command: `echo vitest run; echo "FAIL tests/search.test.ts > ranks"; echo " Tests  1 failed | 3 passed (4)"`, description: "t" } };
// Key-shaped values are assembled at runtime so no secret-like literal sits in the repo (gitleaks runs on PRs).
const finalText = [
  "Done! I fixed ranking in C:\\Users\\majdj\\shop\\src\\app.ts.",
  "```js",
  `const key = '${"sk-" + "live-abcdef1234567890xyz"}'`,
  "```",
  `I used GITHUB_TOKEN=${"gh" + "p_abcdefghijklmnop1234"} and emailed majd@example.com. Should I push to main?`,
].join("\n");
const sessions = [
  [{ tool: "Bash", input: { command: "git push origin main", description: "push" } }, { text: "The push was blocked by a guard. Do you want me to open a PR instead?" }],
  [fail, fail, fail, { text: "Same failure again. Trying another approach." }],
  [{ tool: "Bash", input: { command: "echo hi", description: "e" } }, { text: finalText }],
];
for (const turns of sessions) {
  freshRepo();
  await session(turns, { env, args: ["--allowedTools", "Bash"], persist: true });
}
await new Promise((r) => setTimeout(r, 3000)); // async hooks finish after the session exits
stopMock();
const dir = join(T, "recordings");
for (const f of existsSync(dir) ? readdirSync(dir).filter((x) => x.endsWith(".jsonl")) : [])
  for (const l of readFileSync(join(dir, f), "utf8").trim().split("\n")) {
    const m = JSON.parse(l);
    console.log(JSON.stringify({ id: m.id, trigger: m.signals.trigger, recent: m.signals.recent_tools, streak: m.signals.same_failure_streak, tests: m.signals.tests, permission: m.signals.permission, flags: m.signals.msg_flags, msg: m.last_message }));
  }
console.log("errors log:", existsSync(join(dir, "recorder-errors.log")) ? readFileSync(join(dir, "recorder-errors.log"), "utf8") : "none");
run("uninstall.mjs");
console.log("settings restored exactly:", readFileSync(join(PROFILE, "settings.json"), "utf8").replace(/\s/g, "") === before.replace(/\s/g, ""));
