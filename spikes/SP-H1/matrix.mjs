// Fail-closed matrix: for each CLI build, shell setup and hook form, inject a guard fault into PreToolUse and check
// whether the tool still ran. "Blocked" means the sentinel file was not written.
import { existsSync, readFileSync, renameSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { startMock, stopMock, session, setMode, freshRepo, firstToolResult, PROFILE, repoDir, SPIKE } from "./lib.mjs";

const installPath = () =>
  JSON.parse(readFileSync(join(PROFILE, "plugins", "installed_plugins.json"), "utf8")).plugins["eucas@eucas-spike"][0].installPath;
// A `directory` marketplace is run in place (CLAUDE_PLUGIN_ROOT = the source folder), so change both copies.
const ROOTS = () => [installPath(), join(SPIKE, "marketplace", "eucas")];

/** Rewrites the installed plugin's hooks.json: exec form (args, no shell) or shell form (one command string). */
export function writeHooks(form) {
  const exe = "${CLAUDE_PLUGIN_ROOT}/bin/eucas-guard.exe";
  const h = (sub, block, matcher) => ({
    ...(matcher ? { matcher } : {}),
    hooks: [
      {
        type: "command",
        ...(form === "exec" ? { command: exe, args: [sub] } : { command: `${exe} ${sub}` }),
        ...(form === "shell-powershell" ? { shell: "powershell" } : {}),
        timeout: 10,
        ...(block ? { onFailure: "block" } : {}),
      },
    ],
  });
  const hooks = {
    hooks: {
      PreToolUse: [h("pre-tool-use", true, "*")],
      PermissionRequest: [h("permission-request", true, "*")],
      PostToolUse: [h("post-tool-use", false, "*")],
      Stop: [h("stop", false)],
      Notification: [h("notification", false)],
      UserPromptSubmit: [h("user-prompt-submit", false)],
      SessionStart: [h("session-start", false)],
      SessionEnd: [h("session-end", false)],
      ConfigChange: [h("config-change", false)],
    },
  };
  for (const root of ROOTS()) writeFileSync(join(root, "hooks", "hooks.json"), JSON.stringify(hooks, null, 1));
}

const CLIS = {
  "npm-2.1.310": join(SPIKE, "cc-npm", "node_modules", "@anthropic-ai", "claude-code-win32-x64", "claude.exe"),
  "native-2.1.303": join(homedir(), ".local", "bin", "claude.exe"),
};
// Git Bash can't be hidden without admin (the CLI checks C:\Program Files\Git\bin\bash.exe directly, whatever PATH
// says), so the second setup is the PowerShell tool, the one a PC without Git Bash gets.
const SHELLS = {
  bashTool: {},
  powershellTool: { CLAUDE_CODE_USE_POWERSHELL_TOOL: "1" },
};
const FAULTS = ["baseline", "deny", "panic", "abort", "hang", "exit1", "exit2", "garbage", "missing"];

const sentinelTurn = (tools, fault) =>
  fault === "deny"
    ? tools.includes("PowerShell")
      ? { tool: "PowerShell", input: { command: "Set-Content ran.txt ran; Remove-Item -Recurse -Force .\nothing", description: "limit" } }
      : { tool: "Bash", input: { command: "echo ran > ran.txt; rm -rf ./nothing", description: "limit" } }
    : tools.includes("Bash") && !tools.includes("PowerShell")
    ? { tool: "Bash", input: { command: "echo ran > ran.txt", description: "sentinel" } }
    : { tool: "PowerShell", input: { command: "Set-Content -Path ran.txt -Value ran", description: "sentinel" } };

const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
await startMock();
const rows = [];
for (const [cliName, cli] of Object.entries(CLIS)) {
  if (!existsSync(cli)) continue;
  for (const [shellName, env] of Object.entries(SHELLS)) {
    // Ask the CLI which shell tool it offers in this setup.
    freshRepo();
    setMode([]);
    writeHooks("exec");
    process.env.SPIKE_CLI = cli;
    const probe = await session([{ text: "probe" }], { env: { ...env }, args: [] });
    const tools = probe.mock.find((m) => m.main)?.tools ?? [];
    for (const form of ["exec", "shell-default", "shell-powershell"]) {
      writeHooks(form);
      for (const fault of FAULTS) {
        const id = `${cliName}/${shellName}/${form}/${fault}`;
        if (only && !only.test(id)) continue;
        freshRepo();
        setMode(["baseline", "missing", "deny"].includes(fault) ? [] : [`pre-tool-use=${fault}`]);
        const exes = ROOTS().map((r) => join(r, "bin", "eucas-guard.exe"));
        if (fault === "missing") for (const exe of exes) renameSync(exe, exe + ".bak");
        try {
          const s = await session([sentinelTurn(tools, fault), { text: "done" }], {
            env: { ...env },
            args: ["--allowedTools", "Bash", "PowerShell"],
          });
          const ran = existsSync(join(repoDir(), "ran.txt"));
          const tr = firstToolResult(s);
          rows.push({ id, tools: tools.join("+"), ran, blocked: !ran, wallMs: s.wallMs, result: tr?.content?.slice(0, 400) ?? "(none)" });
          console.log(`${id.padEnd(40)} tools=${tools.join("+").padEnd(16)} ${ran ? "RAN    " : "BLOCKED"} ${String(s.wallMs).padStart(6)}ms  ${(tr?.content ?? "").slice(0, 110).replace(/\s+/g, " ")}`);
        } finally {
          if (fault === "missing") for (const exe of exes) renameSync(exe + ".bak", exe);
        }
      }
    }
  }
}
writeHooks("exec");
setMode([]);
writeFileSync(join(SPIKE, "matrix-results.json"), JSON.stringify(rows, null, 1));
stopMock();
