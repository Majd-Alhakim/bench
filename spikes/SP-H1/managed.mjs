// Managed-tier precedence, without admin: CLAUDE_CODE_MANAGED_SETTINGS_PATH points the CLI at a scratch policy folder
// holding a limits-only hook. Then every lower scope tries to switch hooks off. The plugin is disabled for these runs
// so any block can only come from the managed hook.
import { mkdirSync, writeFileSync, copyFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { startMock, stopMock, session, setMode, freshRepo, repoDir, firstToolResult, SPIKE, PROFILE } from "./lib.mjs";

const MANAGED = join(SPIKE, "managed");
const LIMITS = join(SPIKE, "limits");
mkdirSync(MANAGED, { recursive: true });
mkdirSync(LIMITS, { recursive: true });
copyFileSync(join(SPIKE, "target", "release", "eucas-guard.exe"), join(LIMITS, "eucas-guard.exe"));

const limitsHook = (extra = {}) => ({
  hooks: {
    PreToolUse: [{ matcher: "*", hooks: [{ type: "command", command: join(LIMITS, "eucas-guard.exe"), args: ["pre-tool-use"], timeout: 10, onFailure: "block" }] }],
  },
  permissions: { deny: ["Bash(git push * main)", "Bash(git push origin main)"] },
  ...extra,
});

const userSettingsPath = join(PROFILE, "settings.json");
const userSettings = JSON.parse(readFileSync(userSettingsPath, "utf8"));
const writeUser = (extra) => writeFileSync(userSettingsPath, JSON.stringify({ ...userSettings, enabledPlugins: { "eucas@eucas-spike": false }, ...extra }, null, 1));

const push = { tool: "Bash", input: { command: "git push origin main", description: "push" } };
const sentinel = { tool: "Bash", input: { command: "echo ran > ran.txt", description: "sentinel" } };

const cases = [
  { name: "managed hook alone", managed: limitsHook() },
  { name: "project disableAllHooks", managed: limitsHook(), project: { disableAllHooks: true } },
  { name: "local disableAllHooks", managed: limitsHook(), local: { disableAllHooks: true } },
  { name: "user disableAllHooks", managed: limitsHook(), user: { disableAllHooks: true } },
  { name: "--settings disableAllHooks", managed: limitsHook(), args: ["--settings", JSON.stringify({ disableAllHooks: true })] },
  { name: "--settings hooks:{} + allow push", managed: limitsHook(), args: ["--settings", JSON.stringify({ hooks: {}, permissions: { allow: ["Bash(git push origin main)"] } })] },
  { name: "project allow push", managed: limitsHook(), project: { permissions: { allow: ["Bash(git push origin main)"] } } },
  { name: "--bare", managed: limitsHook(), args: ["--bare"] },
  { name: "--setting-sources project", managed: limitsHook(), args: ["--setting-sources", "project"] },
  { name: "managed deny only (no hook), project disableAllHooks", managed: { permissions: limitsHook().permissions }, project: { disableAllHooks: true } },
  { name: "limits guard crashes (managed)", managed: limitsHook(), mode: ["pre-tool-use=panic"], turn: sentinel },
  { name: "managed allowManagedHooksOnly + plugin enabled", managed: limitsHook({ allowManagedHooksOnly: true }), pluginOn: true, turn: sentinel, mode: ["pre-tool-use=normal"] },
];

await startMock();
const env = { CLAUDE_CODE_MANAGED_SETTINGS_PATH: MANAGED };
for (const c of cases) {
  freshRepo();
  const repo = repoDir();
  rmSync(join(MANAGED, "managed-settings.json"), { force: true });
  writeFileSync(join(MANAGED, "managed-settings.json"), JSON.stringify(c.managed, null, 1));
  mkdirSync(join(repo, ".claude"), { recursive: true });
  if (c.project) writeFileSync(join(repo, ".claude", "settings.json"), JSON.stringify(c.project));
  if (c.local) writeFileSync(join(repo, ".claude", "settings.local.json"), JSON.stringify(c.local));
  writeUser({ ...(c.user ?? {}), ...(c.pluginOn ? { enabledPlugins: { "eucas@eucas-spike": true } } : {}) });
  setMode(c.mode ?? []);
  const turn = c.turn ?? push;
  const s = await session([turn, { text: "done" }], { env, args: ["--allowedTools", "Bash", ...(c.args ?? [])] });
  const tr = firstToolResult(s);
  const ran = turn === sentinel ? existsSync(join(repo, "ran.txt")) : !/off limits|denied|deny|hook error|permission/i.test(tr?.content ?? "");
  const who = s.guard.map((g) => g.sub).join(",");
  console.log(`${c.name.padEnd(52)} ${ran ? "RAN    " : "BLOCKED"} guard=[${who}] ${(tr?.content ?? "(no tool result)").replace(/\s+/g, " ").slice(0, 140)}`);
}
writeUser({ enabledPlugins: { "eucas@eucas-spike": true } });
setMode([]);
stopMock();
