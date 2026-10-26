// Non-elevated half of the admin-lock test. Starts lock-test.ps1 elevated (the founder sees one UAC prompt), and in
// each phase (file, registry, both) runs spike sessions that try every lower-scope way to switch the managed hook off.
// Only spike sessions (isolated profile, mock API, EUCAS_SPIKE_DIR set) are affected; the guard is --spike-only.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { startMock, stopMock, session, setMode, freshRepo, repoDir, firstToolResult, SPIKE, PROFILE } from "../lib.mjs";

const flags = join(SPIKE, "admin-flags");
rmSync(flags, { recursive: true, force: true });
mkdirSync(flags, { recursive: true });
const script = fileURLToPath(new URL("./lock-test.ps1", import.meta.url));
spawn("powershell.exe", ["-NoProfile", "-Command", `Start-Process powershell.exe -Verb RunAs -WindowStyle Hidden -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','"${script}"','-SpikeDir','"${SPIKE}"'`], { stdio: "ignore" }).on("exit", (code) => {
  // Start-Process fails when the UAC prompt is declined: nothing was written, so stop here.
  if (code !== 0) writeFileSync(join(flags, "refused.txt"), "UAC prompt declined; nothing was written.");
});

const userSettingsPath = join(PROFILE, "settings.json");
const userOriginal = readFileSync(userSettingsPath, "utf8");
const writeUser = (extra = {}) => writeFileSync(userSettingsPath, JSON.stringify({ ...JSON.parse(userOriginal), enabledPlugins: { "eucas@eucas-spike": false }, ...extra }, null, 1));
const push = { tool: "Bash", input: { command: "git push origin main", description: "push" } };
const denyOnly = { tool: "Bash", input: { command: "git push eucas-spike-remote main", description: "push" } };
const cases = [
  { name: "managed hook alone" },
  { name: "project disableAllHooks", project: { disableAllHooks: true } },
  { name: "local disableAllHooks", local: { disableAllHooks: true } },
  { name: "user disableAllHooks", user: { disableAllHooks: true } },
  { name: "--settings disableAllHooks", args: ["--settings", JSON.stringify({ disableAllHooks: true })] },
  { name: "--settings hooks:{} + allow push", args: ["--settings", JSON.stringify({ hooks: {}, permissions: { allow: ["Bash(git push origin main)"] } })] },
  { name: "project allow push", project: { permissions: { allow: ["Bash(git push origin main)"] } } },
  { name: "--bare", args: ["--bare"] },
  { name: "--setting-sources project", args: ["--setting-sources", "project"] },
  { name: "managed deny rule, hooks off by project", project: { disableAllHooks: true, permissions: { allow: ["Bash(git push eucas-spike-remote main)"] } }, turn: denyOnly },
  { name: "managed guard crashes", mode: ["pre-tool-use=panic"], turn: { tool: "Bash", input: { command: "echo ran > ran.txt", description: "s" } } },
];

const out = join(SPIKE, "managed-real.txt");
writeFileSync(out, "");
const say = (s) => (console.log(s), appendFileSync(out, s + "\n"));
const waitFor = async (f, ms = 20 * 60_000) => {
  const end = Date.now() + ms;
  while (!existsSync(join(flags, f))) {
    if (existsSync(join(flags, "error.txt")) || existsSync(join(flags, "refused.txt")) || Date.now() > end) return false;
    await new Promise((r) => setTimeout(r, 300));
  }
  return true;
};

await startMock();
for (const phase of ["file", "registry", "both"]) {
  if (!(await waitFor(`${phase}.ready`))) break;
  say(`\n== phase: ${phase}`);
  // A normal user must not be able to change the managed source.
  try {
    appendFileSync("C:\\Program Files\\ClaudeCode\\managed-settings.json", " ");
    say("user write to managed-settings.json: ALLOWED (bad)");
  } catch (e) {
    say(`user write to managed-settings.json: ${e.code}`);
  }
  for (const c of cases) {
    const repo = freshRepo();
    mkdirSync(join(repo, ".claude"), { recursive: true });
    if (c.project) writeFileSync(join(repo, ".claude", "settings.json"), JSON.stringify(c.project));
    if (c.local) writeFileSync(join(repo, ".claude", "settings.local.json"), JSON.stringify(c.local));
    writeUser(c.user ?? {});
    setMode(c.mode ?? []);
    const turn = c.turn ?? push;
    const s = await session([turn, { text: "done" }], { args: ["--allowedTools", "Bash", ...(c.args ?? [])] });
    const tr = firstToolResult(s)?.content ?? "(no tool result)";
    const ran = c.mode ? existsSync(join(repoDir(), "ran.txt")) : !/off limits|denied|deny|hook error|permission|blocked/i.test(tr);
    say(`${c.name.padEnd(44)} ${ran ? "RAN    " : "BLOCKED"} guard=[${s.guard.map((g) => g.sub).join(",")}] ${tr.replace(/\s+/g, " ").slice(0, 110)}`);
  }
  writeFileSync(join(flags, `${phase}.done`), "done");
}
writeFileSync(userSettingsPath, userOriginal);
setMode([]);
stopMock();
await waitFor("removed.json", 60_000);
say(`\nremoval: ${existsSync(join(flags, "removed.json")) ? readFileSync(join(flags, "removed.json"), "utf8") : "NOT CONFIRMED"}`);
for (const f of ["error.txt", "refused.txt"]) if (existsSync(join(flags, f))) say(`${f}: ${readFileSync(join(flags, f), "utf8")}`);
