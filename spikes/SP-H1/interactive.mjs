// Interactive (TUI) session in a real terminal: which hook events fire, and does the status line run?
// Usage: node interactive.mjs [plugin|user]  (where the statusLine comes from). Kills the session after 20 s.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, cleanEnv, freshRepo, setMode, CLI, SPIKE, PROFILE, GUARD_LOG, PORT } from "./lib.mjs";

const where = process.argv[2] ?? "plugin";
const KEY = "sk-ant-mock-not-a-real-key";
const repo = freshRepo();
setMode([]);
const cfgPath = join(PROFILE, ".claude.json");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
delete cfg.oauthAccount;
cfg.hasCompletedOnboarding = true;
cfg.theme = "dark";
cfg.customApiKeyResponses = { approved: [KEY.slice(-20)], rejected: [] };
cfg.projects = { ...(cfg.projects ?? {}), [repo.replaceAll("\\", "/")]: { hasTrustDialogAccepted: true, hasCompletedProjectOnboarding: true } };
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));

const settingsPath = join(PROFILE, "settings.json");
const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
const guard = join(SPIKE, "marketplace", "eucas", "bin", "eucas-guard.exe").replaceAll("\\", "/");
if (where === "user") settings.statusLine = { type: "command", command: `${guard} status-line` };
else delete settings.statusLine;
writeFileSync(settingsPath, JSON.stringify(settings, null, 1));
rmSync(join(SPIKE, "status-line.jsonl"), { force: true });
rmSync(GUARD_LOG, { force: true });

await startMock();
writeFileSync(join(SPIKE, "mock-script.json"), JSON.stringify([{ tool: "Bash", input: { command: "git push origin main", description: "push" } }, { text: "Blocked, as expected." }]));
await fetch(`http://127.0.0.1:${PORT}/__reload`, { headers: { connection: "close" } });

const child = spawn(CLI, ["spike: push to main", "--allowedTools", "Bash"], { cwd: repo, env: cleanEnv(), stdio: "inherit" });
setTimeout(() => child.kill(), 20_000);
await new Promise((r) => child.on("exit", r));
stopMock();
const subs = existsSync(GUARD_LOG) ? readFileSync(GUARD_LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
const sl = existsSync(join(SPIKE, "status-line.jsonl")) ? readFileSync(join(SPIKE, "status-line.jsonl"), "utf8").trim().split("\n").length : 0;
const out = { statusLineFrom: where, events: subs.map((g) => `${g.sub}:${g.decision}`), statusLineCalls: sl };
writeFileSync(join(SPIKE, `interactive-${where}.json`), JSON.stringify(out, null, 1));
console.log("\n\nRESULT", JSON.stringify(out));
