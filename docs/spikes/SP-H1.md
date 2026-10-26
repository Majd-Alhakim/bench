# Spike SP-H1: the hook attach path (plugin + native guard, fail-closed, on Windows)

**Date:** 2026-10-26 · **Branch:** `spike/SP-H1` · **Code:** [`spikes/SP-H1/`](../../spikes/SP-H1/) (throwaway)
**Setup:**
- **PC:** Windows 11 Home 26300, Intel Xe laptop, Defender real-time protection on, Smart App Control off. Git Bash present, Windows PowerShell 5.1 (no PowerShell 7).
- **Claude Code:** 2.1.310 (npm package, the native win32-x64 binary) and 2.1.303 (the founder's native install, run read-only). Each ran in an **isolated profile** (`CLAUDE_CONFIG_DIR` = `%TEMP%\eucas-spikes\profile`) inside throwaway git repos under `%TEMP%`.
- **Model calls:** none. A loopback stand-in for the Messages API (`mock-api.mjs`, set through `ANTHROPIC_BASE_URL` and a dummy key in the spike's own env only) plays scripted tool calls, so real hooks fire on real tool calls. **0 tokens, no login, nothing installed in the founder's profile.**
- **Guard:** a 301 KB Rust exe ([`guard/`](../../spikes/SP-H1/guard/)) shipped as a user-scope plugin from a local `directory` marketplace, in exec form, with `onFailure: "block"` on PreToolUse and PermissionRequest.

**Verdict so far: GO with limits. Two bar items are still open and need the founder: the managed-tier precedence (admin, approval asked) and events in the desktop app and VS Code (manual check).** No fail-open path was found: every crash, hang, bad exit and missing exe blocked the call. That is the core of the attach architecture, and it holds on both CLI builds. The limits below change the design in small ways; none needs a re-plan.

## Results against the GO bar

| GO bar item | Result |
|---|---|
| All fail-closed cases block | ✅ **72 / 72** injected faults blocked: panic (exit 101), abort, hang (killed at the 10 s timeout), exit 1, exit 2, missing exe. Covered: CLI 2.1.310 and 2.1.303, the Bash tool and the PowerShell tool, and three hook forms (exec, default shell, `shell: "powershell"`). A PermissionRequest panic or hang becomes an explicit deny ("blocking because onFailure is block"). |
| p95 ≤ 50 ms (Defender on) | ✅ As Claude Code times its own hooks (debug log), over 300 calls in one session: **PreToolUse p50 25 / p95 33 / p99 44 / max 48 ms**; PostToolUse p95 34 ms. Inside the guard: p95 0.55 ms. Spawned directly with Node: warm p95 43.6 ms under load. **Cold first run of a newly written exe: 130–196 ms** (Defender scans the new file once). |
| Managed hooks survive lower-scope disables | ⏳ **Open: needs admin.** `CLAUDE_CODE_MANAGED_SETTINGS_PATH` is ignored outside Anthropic's eval harness (the CLI still reads `C:\Program Files\ClaudeCode\managed-settings.json`), so it is not a test seam, and it is not a bypass either. The admin test ([`admin/lock-test.ps1`](../../spikes/SP-H1/admin/lock-test.ps1)) is ready and waits for the founder's approval. |

## Answers to the spike's questions

| Question | Answer |
|---|---|
| Do events fire in the terminal? | ✅ Headless (`-p`) and **interactive TUI** (run in a terminal tab): SessionStart, UserPromptSubmit, PreToolUse (deny shown), PostToolUse, Stop, SessionEnd, ConfigChange, PermissionRequest. |
| …in the desktop app's local sessions and VS Code? | ⏳ **Manual check** (founder): a throwaway folder that enables the spike plugin at **project** scope is ready (`%TEMP%\eucas-spikes\host-check`), and the guard now logs `CLAUDE_CODE_ENTRYPOINT`. Evidence so far: the desktop app runs its own bundled CLI (**2.1.308**, at `%APPDATA%\Claude\claude-code\2.1.308\…\claude.exe`), and this very session (a desktop local session) has the founder's user-scope plugins loaded. |
| `onFailure: "block"` on crash, hang, exit 1, missing exe? | ✅ All block, with both Git Bash tools and the PowerShell tool, on both CLI builds (table above). Exit 0 with non-JSON stdout is treated as **no opinion** (the call runs), so the guard must never print anything but hook JSON. |
| Git Bash present and absent | Present: ✅. **Absent: couldn't be simulated without admin.** The CLI checks `C:\Program Files\Git\bin\bash.exe` directly, whatever `PATH` or `CLAUDE_CODE_GIT_BASH_PATH` say. The PowerShell tool path (what a PC without Git Bash gets) was tested instead (`CLAUDE_CODE_USE_POWERSHELL_TOOL=1`). The CI canary job with Git removed covers the rest (ADR-0014). |
| PowerShell 5.1 and 7 | 5.1 ✅. PowerShell 7 isn't installed here, so it's left to CI. Exec form uses no shell at all. **A shell-form hook breaks under `shell: "powershell"`**: Claude Code rewrites `${CLAUDE_PLUGIN_ROOT}` to `${env:CLAUDE_PLUGIN_ROOT}/bin/...`, PowerShell fails to parse it, and with `onFailure: "block"` that blocks **every** tool call. **Rule: exec form only.** |
| Native and npm installs | 2.1.303 native and 2.1.310 npm behave the same in every case. The npm package now ships the same native binary. |
| Does a running session pick up a newly installed plugin? | ❌ **No.** A plugin installed mid-session never fired in that session (3 turns, 3 s apart; `/reload-plugins` exists in the TUI only). **Hooks written into a settings file are hot-reloaded** within about 3 s. |
| Can a plugin ship the main `statusLine`? | ❌ **No.** Not from the plugin's `settings.json` and not from a `settings` block in `plugin.json` (0 status-line calls in the TUI). From user `settings.json` it works (2 calls, our text shown). ADR-0007's fallback applies: user settings with a backup, restored on uninstall. |
| Which managed source does the CLI read? | Code and debug log: `C:\Program Files\ClaudeCode\managed-settings.json`, plus `HKLM\SOFTWARE\Policies\ClaudeCode` value `Settings` (`HKCU\…\Policies` too). Which wins when both exist: ⏳ admin test. |
| Do managed hooks survive a project `disableAllHooks` and `--settings`? | ⏳ Admin test (cases ready: project, local and user `disableAllHooks`, `--settings`, `--setting-sources project`, `--bare`, a managed deny rule with hooks off, the limits guard crashing). |
| Can the agent edit `~/.claude/settings.json` despite deny rules? | **Partly.** With `Edit(…settings.json)` and `Write(…)` deny rules, Claude Code held Edit, Write, `echo >`, `sed -i` and PowerShell `Add-Content` (its own path checks catch shell redirects too). **`node -e "fs.writeFileSync(…)"` got through.** Any interpreter can, so user-scope limits are detectable, not enforceable. That is why the lock lives in the managed tier. |
| Which signal shows "tool ran, no check" fastest? | With only PreToolUse broken: the plugin's **PostToolUse fires about 60 ms after the tool starts** (median of 10). The **transcript** shows the tool_use only together with its result, about 250 ms after start for a short tool and only at the end for a long one. With every plugin hook off (`disableAllHooks`), the transcript tail is the only signal. |

### CR-010 fallback (limits at user scope, no admin): detection
Four ways the user-scope plugin gets switched off, each in a long-lived session ([`detect-disable.mjs`](../../spikes/SP-H1/detect-disable.mjs)):

| How | What the app sees | Enforced? |
|---|---|---|
| The repo ships `.claude/settings.json` with `disableAllHooks` | **No hook events at all.** The transcript has the tool_use lines (2 of 2). | ❌ The push ran |
| The agent writes `disableAllHooks` into `.claude/settings.local.json` with Write | Claude Code asked for permission (headless: denied) | ✅ Still guarded |
| The agent turns the plugin off in user settings with `node -e` | **`ConfigChange` fires** at the next turn. The running session **stays guarded** (plugins don't unload). | ✅ This session, ❌ the next ones |
| `disableAllHooks` appears in user settings mid-session | **`ConfigChange` fires as the last hook event**, then nothing | ❌ The push ran |

**Detection rule for the design:** a `config-change` event, a session with transcript activity but no `session-start` / `check` events, or a tool_use without a matching check → "not guarded" within the heartbeat window. All three can be computed from data the app already reads (ADR-0009 events plus transcript metadata).

## Findings for the design
1. **Exec form only, never shell form** (the PowerShell rewrite bricks it). Add a contract test that every hook in `hooks.json` has `args`.
2. **A `directory` marketplace runs the plugin in place:** `CLAUDE_PLUGIN_ROOT` is the marketplace folder, not the plugin cache, even though `plugin install` also copies it to the cache. The guard therefore lives at `%LOCALAPPDATA%\Eucas\marketplace\eucas\bin\`, and deleting that folder makes every session fail closed. ADR-0007's "copied into the plugin cache, so the guard never depends on the app folder" is **not true for a directory source**. Either keep the marketplace folder as part of the install (and say so in Repair), or test a `git` / `url` source that is copied (not done here).
3. **Installs need a session restart.** First run should list sessions that started before the install as "not guarded until restarted" (or offer `/reload-plugins` in the TUI). Managed-tier and settings-file hooks don't have this problem (hot-reloaded).
4. **The status line can't come from the plugin.** Use the user-settings path with a recorded backup (ADR-0007 already allows it).
5. **Version per host:** the desktop app bundles its own CLI (2.1.308, below the 2.1.310 Windows floor) while the terminal has 2.1.303. The "verified for x.y" badge has to be per host and per session, read from SessionStart or the status line, not from `claude --version`.
6. **Unsigned v0.1 (CR-010):**
   - An unsigned guard with a Mark-of-the-Web (zone 3) **runs normally** when Claude Code starts it (16 ms, no prompt). SmartScreen only gates Explorer launches.
   - **Smart App Control blocks unsigned executables.** It's off on this PC, but new Windows 11 installs ship it in evaluation or on, and an unsigned guard there means every tool call fails closed. **First run must read `HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy\VerifiedAndReputablePolicyState` (0 off, 1 on, 2 evaluation) and refuse to install the guard when it isn't 0** until v0.1 is signed.
   - The cold first-run cost (130–196 ms, Defender scanning) recurs after every guard update.
7. `garbage stdout + exit 0` = no opinion: the guard must write JSON or nothing (add a fuzz test that stdout is always valid JSON or empty).
8. Every Claude Code host on Windows names its process `claude.exe`, including the desktop app's main process. Identify hosts by path, not by name.

## Not covered here (and why)
- **Admin precedence** (file vs HKLM vs both, lower-scope disables, the ACL against a normal user): scripts ready, waiting for the founder's approval (one UAC prompt, `--spike-only` guard, everything removed in a `finally`, 15-minute auto-remove).
- **Desktop app and VS Code events:** manual checklist ([G6-MANUAL-CHECKLIST](G6-MANUAL-CHECKLIST.md)). Screen control was stopped at the founder's request, and the founder's real profile is never touched.
- **No Git Bash, PowerShell 7:** need admin or a clean machine. Covered by the CI canary matrix.

## Reproduce
```bash
cd spikes/SP-H1
node matrix.mjs              # 108 runs: CLI × tool × hook form × fault
node hook-latency.mjs 300    # p50/p95 as Claude Code times the hook
node settings-tamper.mjs     # deny rules vs ways to edit user settings
node late-install.mjs        # plugin and settings hooks added mid-session
node detect-disable.mjs      # CR-010 detection cases
node signal-race.mjs 10      # PostToolUse vs transcript latency
```
They need the isolated profile set up as in `smoke.mjs` (marketplace in `%TEMP%\eucas-spikes\marketplace`, plugin installed with `CLAUDE_CONFIG_DIR` pointing at the scratch profile). They never use the real `~/.claude`.
