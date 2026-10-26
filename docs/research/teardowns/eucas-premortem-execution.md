# Pre-mortem teardown: the Eucas companion (lens: first-run value, UX, solo execution)

| Date | Author | Product under review | Decision this informs | Status |
|---|---|---|---|---|
| 2026-10-26 | Reverse Engineer (Claude) | **Our own** planned "Eucas companion" (CR-010 proposal: companion first) | Whether CR-010 is credible as a ~2-week v0.1, and what that v0.1 must contain | Draft for the PM and BA; nothing here changes the BRD |

**Method.** The `competitor-teardown` skill, pointed at our own plan as a pre-mortem: *it is about May 2027, six months after launch, and the companion failed; why?* Evidence is public only (official Claude Code docs, GitHub repos and issues, release notes, vendor pages, secondary blogs) plus our own repo. Nothing was decompiled, intercepted or extracted. Every claim is an **Observation (O)**, **Inference (I)** or **Unknown (U)**.

**Builds on, does not repeat:** [competitive-brief-companion-2026-10-25.md](../competitive-brief-companion-2026-10-25.md) (the market map), [claude-code.md](claude-code.md), spikes [S0-1](../../spikes/S0-1.md), [M8](../../spikes/M8.md), [SP-B1](../../spikes/SP-B1.md), the [notch design](../../design/ux/2026-10-25-atlas-notch-design.md), [PRD v0.4](../../requirements/PRD.md) (sprint plan, E16) and the [dogfooding note](../2026-10-25-dogfooding-one-agent-runs-a-team.md).

**Important framing fact:** the spikes so far tested the **Agent SDK runner** (the full team app). The companion is a different architecture: it **attaches to sessions the user runs** through hooks and the status line. None of S0-1, M8 or SP-B1 tested that path. M8's guard ran as a hook inside *our* SDK process, not inside a user's own `claude` session on a machine with or without Git Bash.

---

## 0. The blunt version

1. **As specified (hooks + rules compiler + ledger/forecast + same-file warning + guided merge + inbox + notch + licence keys + signing + auto-update + Windows testing) this is not a 2-week product for one person who is in Sprint 0 with zero app code.** It is 2 to 3 products. Shipping all of it in 2 weeks means shipping a *safety* tool with untested edge cases, which is worse than shipping nothing.
2. **The first 5 minutes are empty as designed.** A companion that waits for live sessions and asks you to write rules has no "aha" on install. The fix exists and is cheap: read the user's *own* local session history (what ccusage does with zero setup) and show a 7-day retro with **suggested** rules and **past** same-file collisions.
3. **The safety promise is the most fragile part, not the strongest.** Hooks fail open by default; Windows hooks failed open as recently as Claude Code v2.1.309/310 (22 to 23 Oct 2026). A user's own `ask`/`deny` rules silently override our "auto-approve". Corporate `allowManagedHooksOnly` turns the whole product off without telling it. A tool that says "hard limits" and is wrong once is dead.
4. **Attach is realistic; "manage" is not.** Hooks can watch, warn, deny and annotate every session the user starts anywhere. They cannot create a worktree for a session the companion didn't start, pause an idle session, or inject a nudge into a session waiting for the user. Promise "watch and guard", not "run".
5. **The notch is for the founder and the showcase video, not for this buyer in v0.1.** It is the single largest risk item (native keyboard hook, which antivirus treats like a keylogger; click-through windows; full-screen detection) for the smallest activation gain. Tray count + Windows toast gets 90% of the value.
6. **Never meter safety.** "3 sessions free" on a hooks product means session #4 is *unprotected*. That is an ethical and reputational trap. Meter history, budgets and the supervisor instead.

**Lens verdict: SERIOUS, FIXABLE**, on one condition: cut v0.1 to the scope in section 5. Shipped as currently described, it is **fatal** on this lens.

---

## 1. Finding ledger

Accessed dates are 2026-10-26 unless noted. "CC" = Claude Code.

### Q1. Time to first value and onboarding

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F1 | ccusage starts with one command, `npx ccusage@latest`, no setup step; it "reads local usage data from coding agent CLIs" and shows a daily table of past usage. 19.2k stars | O | [github.com/ryoppippi/ccusage](https://github.com/ryoppippi/ccusage) | H | README only |
| F2 | ccusage's popularity rests on **value from data that already exists**: the first run shows your history, not an empty dashboard | I | F1 | M | — |
| F3 | episko is a launcher (sessions start from "+ Session"), writes "a throwaway `--settings` file" per launch so "nothing in `~/.claude` is modified", and **also discovers Claude sessions in other terminals, read-only**. Windows supported; "SmartScreen may warn on first run". 19 stars | O | [github.com/respeak-io/episko](https://github.com/respeak-io/episko) | H | README; no first-run screen described |
| F4 | episko chose zero global footprint over coverage: its rules/permissions only apply to sessions it launched | I | F3 | M | — |
| F5 | CC's own agent view (`claude agents`) groups sessions into Working / **Needs input** / Idle / Completed / Failed, sends notifications, and gives each background session a worktree; interactive sessions in other terminals "don't appear until you background them". Research preview | O | [code.claude.com/docs/en/agent-view](https://code.claude.com/docs/en/agent-view) | H | First 100k chars of page |
| F6 | The Claude desktop app's **Code tab on Windows** already runs parallel sessions (Ctrl+N, side by side) with optional worktrees under `.claude/worktrees/` | O | [code.claude.com/docs/en/desktop](https://code.claude.com/docs/en/desktop) (via search summary) | M | Search summary of official docs, page not fully read |
| F7 | The free "needs you" baseline the companion competes with on day 1 is therefore: agent view + desktop app + Remote Control phone push, all free | I | F5, F6, brief §3 | H | — |
| F8 | No rigorous public dataset on dev-tool activation was found. Compiled indicative ranges: first-session activation 15 to 45%, month-2 retention 65 to 90%; one source targets first value in under 15 min | O (weak) | [artisangrowthstrategies.com/benchmarks/devtools](https://www.artisangrowthstrategies.com/benchmarks/devtools), [count.co TTFV](https://count.co/metric/time-to-first-value) | L | One web search; vendor blogs only |
| F9 | A widely repeated claim (TTV under 5 min gives 65% activation vs 12%) could not be traced to its original source | U | [usetandem.ai](https://usetandem.ai/blog/activation-rate-vs-time-to-value) | L | Not verified at ChartMogul |
| F10 | As designed, the companion's first screen after install has no data: the ledger needs a status-line run, the inbox needs a session to ask something, the same-file warning needs two live sessions editing one file, and rules need the user to write them | I | The CR-010 feature list; F12, F16 | H | — |
| F11 | Session transcripts are local files and every hook and status-line call gets a `transcript_path`; reading the user's **own** transcripts locally is the same evidence ccusage uses | O / I | [hooks](https://code.claude.com/docs/en/hooks), [statusline](https://code.claude.com/docs/en/statusline) (`transcript_path`), F1 | H / M | The transcript format itself is not documented as stable (U, see Q5) |

### Q2. Setup friction

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F12 | Hooks can live in `~/.claude/settings.json` (all projects), `.claude/settings.json` (committed), `.claude/settings.local.json` (gitignored), managed policy, a **plugin's `hooks/hooks.json`**, skill or subagent frontmatter. Entries **merge** across levels; matching hooks run **in parallel** | O | [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) | H | First 100k of 282k chars |
| F13 | Writing hooks into a project's committed `.claude/settings.json` puts Eucas into the user's git diff and onto their teammates' machines | I | F12 | H | — |
| F14 | **Hooks fail open by default:** "when a hook fails or times out, Claude Code still carries out the action"; a timed-out PreToolUse "doesn't block". `"onFailure": "block"` (CC v2.1.295+) makes command/http hooks fail closed | O | [hooks](https://code.claude.com/docs/en/hooks) | H | — |
| F15 | **Windows hook fail-open bugs fixed in the last week:** v2.1.309 "PreToolUse and PermissionRequest hooks with `"shell": "powershell"` failed open when Git for Windows wasn't installed" and exit code 2 didn't block in PowerShell; v2.1.310 a hook let a tool call through "when Git Bash is missing and the hook command is only quoted strings" | O | [github.com/anthropics/claude-code/releases](https://github.com/anthropics/claude-code/releases) (v2.1.309, 22 Oct; v2.1.310, 23 Oct) | H | Last 10 releases only |
| F16 | Earlier Windows hook regressions: hooks stopped in 2.1.47 when execution moved to Git Bash (#28964); hooks not firing with a native `claude.exe` ahead of an npm install on PATH (#25577); not invoked from `settings.local.json`-only config (#50243); not invoked on 2.1.119 (#53254); an "open" 2.1.240 report traced to `allowManagedHooksOnly` (#88896, third-party mirror) | O (S) | [#25577](https://github.com/anthropics/claude-code/issues/25577), [claudeissues.com mirrors](https://claudeissues.com/issue/28964-bug-some-hooks-stopped-working-in-version-2-1-47-on-windows) | M | Search results and a third-party issue mirror; individual threads not all opened |
| F17 | Hook shell on Windows: shell form runs in **Git Bash, or PowerShell when Git Bash isn't installed**; `shell: "bash" | "powershell"`; exec form "requires `command` to resolve to a real executable such as a `.exe`"; `.cmd`/`.bat` shims need shell form or `node <script>` | O | [hooks](https://code.claude.com/docs/en/hooks) | H | — |
| F18 | Git Bash eats backslashes: a `C:\Users\...` path in a status-line command "fails without a visible error"; use forward slashes | O | [statusline § Windows configuration](https://code.claude.com/docs/en/statusline) | H | — |
| F19 | Hook types include `command`, `http`, `mcp_tool`, `prompt`, `agent`; default timeout 600 s for command/http | O | [hooks](https://code.claude.com/docs/en/hooks) | H | — |
| F20 | An `http` hook to a localhost endpoint in the running app avoids shells, quoting and per-call process start; if the app is not running it fails (open by default, or blocks every session if `onFailure: block`) | I | F14, F19 | M | Not tested |
| F21 | Running a hook as Electron-as-Node (`ELECTRON_RUN_AS_NODE`) on every tool call would add a full runtime start per call, across every parallel session | I | Electron architecture; F12 (parallel hooks) | M | Not measured; measure in a spike |
| F22 | **Precedence:** "PreToolUse hook decisions don't bypass permission rules"; a user's matching `deny` blocks and a matching `ask` "still prompts even when the hook returned allow". Rules order is deny, ask, allow | O | [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) | H | — |
| F23 | Consequence: the rules editor's "auto-approve" will **silently not work** for any call the user already has an `ask` rule for, and the user's own allow rules can't weaken our deny. Good for limits, bad for the "approve" half | I | F22 | H | — |
| F24 | Native `permissions.deny` is enforced deny-first and does not depend on a hook process running; but "a deny rule doesn't match the same program by path or inside `sh -c`" | O | [permissions](https://code.claude.com/docs/en/permissions) | H | — |
| F25 | `allowManagedHooksOnly` (managed settings) blocks "your user, project, local, and plugin hooks" and narrows `statusLine` to managed settings; `disableAllHooks` exists at every level | O | [hooks](https://code.claude.com/docs/en/hooks) | H | — |
| F26 | **One `statusLine` per settings scope**: a `statusLine` object with one `command` in user or project settings | O | [statusline](https://code.claude.com/docs/en/statusline) | H | — |
| F27 | The companion's ledger via the status line therefore **replaces** whatever status line the user already has (ccstatusline, ccusage's statusline, their own) unless it wraps and chains it | I | F26 | H | — |
| F28 | `rate_limits` appears "only for claude.ai Pro and Max subscribers ... and only after the first API response in the session"; windows can be "independently absent" | O | [statusline](https://code.claude.com/docs/en/statusline) | H | — |
| F29 | The status line only runs while a session is active and debounces at 300 ms; it can "go quiet when the main session is idle" unless `refreshInterval` is set | O | [statusline](https://code.claude.com/docs/en/statusline) | H | — |
| F30 | Plugins can ship hooks, skills, agents, MCP servers and "a hooks module" (a **mod**) that can "draw panes and add commands"; user-scope plugins apply to the terminal, the desktop app's local sessions and VS Code ("all three read the same settings files"); `claude plugin disable` turns it off cleanly | O | [code.claude.com/docs/en/plugins](https://code.claude.com/docs/en/plugins) | H | Overview page only |
| F31 | Whether a plugin can ship the **main** `statusLine` (docs only confirm `subagentStatusLine` from a plugin's `settings.json`) | U | [statusline](https://code.claude.com/docs/en/statusline) | — | Plugin manifest reference not read |
| F32 | Since v2.1.301 the permission prompt for a plugin hook's `ask` "shows where the hook came from", so a plugin is attributable in the UI; a raw settings.json hook is less so | O | [releases](https://github.com/anthropics/claude-code/releases) | H | — |
| F33 | Windows MAX_PATH is 260; Git for Windows' `core.longpaths` is off by default and needs the `LongPathsEnabled` registry key; "scripted git commands may still fail" | O | [gitforwindows.org long paths](https://gitforwindows.org/git-cannot-create-a-file-or-directory-with-a-long-path) | H | Not worktree-specific |
| F34 | Worktrees under `<repo>/.claude/worktrees/<name>/` add a prefix to every path, so deep `node_modules` trees hit MAX_PATH sooner. Developer Mode matters only for symlinks; pnpm and git worktrees don't need it on Windows (pnpm uses junctions) | I | F33, F6 | M | Not tested |
| F35 | Electron hello-world installers are about 60 to 150 MB on Windows vs a few MB for Tauri; one measurement 62.5 MB | O (S) | [dolthub.com 2025-11-13](https://dolthub.com/blog/2025-11-13-electron-vs-tauri), [levminer.com](https://www.levminer.com/blog/tauri-vs-electron) | M | Blogs, unclear method |
| F36 | Bundling local Moonshine/Whisper models (notch voice, CR-009) adds tens to hundreds of MB on top | I | Notch design §4; model sizes not measured here | M | — |
| F37 | SmartScreen: Electron docs point to Azure **Artifact Signing**; community reports say new signed apps can still warn for days while reputation builds; EV no longer gives instant reputation (third-party claim). **Eligibility is limited to certain countries** | O (S) | [devclass 2026-01-14](https://devclass.com/2026/01/14/code-signing-windows-apps-may-be-easier-and-more-secure-with-new-azure-artifact-service/), [codenote.net 2026](https://codenote.net/en/posts/windows-desktop-app-code-signing-distribution-japan-2026/), [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5855805/artifact-signing-account-with-public-trust-certifi) | M | Microsoft docs not read directly |
| F38 | Whether the founder is eligible for Artifact Signing (country, individual vs organisation) | U | — | — | Needs the founder's own check |

### Q3. Attach vs start-through

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F39 | Hook edits in settings files "are normally picked up automatically by the file watcher", so user-level hooks reach **already-running** sessions | O | [hooks](https://code.claude.com/docs/en/hooks) | M | "normally"; not tested on Windows |
| F40 | Every hook gets `session_id`, `transcript_path`, `cwd` (which "follows Claude into worktrees"), `permission_mode`, and for tool events `tool_name` and `tool_input` | O | [hooks](https://code.claude.com/docs/en/hooks) | H | — |
| F41 | So with user-scope hooks the companion can **observe and guard every session** the user starts anywhere (terminal, desktop app Code tab, VS Code): list sessions, see edits per file, deny calls, see Notification/Stop events | I | F12, F30, F39, F40 | H | Excluding cloud sessions (F30: cloud sessions don't load local plugins) |
| F42 | Stop hooks can block stopping (exit 2 or `decision: block`, "continues the conversation") or stop entirely (`continue: false`). That is the **only** "nudge" lever, and only at the moment the agent tries to stop | O / I | [hooks](https://code.claude.com/docs/en/hooks) | H / M | — |
| F43 | No documented way was found for an outside process to inject a prompt into an idle interactive session, or to pause one between tool calls other than denying its next call | U | hooks, agent-view docs (partial) | — | Docs only; `claude --bg` / agent view dispatch not explored in full |
| F44 | Worktrees for sessions the user started can't be created by the companion; CC's own bg sessions already get one (`worktree.bgIsolation`); the companion can only **warn** and suggest `claude --worktree` | I | F5, F6 | H | — |
| F45 | `claude agents --json --all` exposes state, pid, `waitingFor` for background sessions; the docs warn `~/.claude/jobs/` is "not a stable interface" | O | [agent-view](https://code.claude.com/docs/en/agent-view) | H | — |
| F46 | Answering a permission prompt from the companion (inbox or notch) means a PermissionRequest/PreToolUse hook that **waits** for the app's answer while the terminal also shows a prompt; race behaviour between the two is undocumented | U | F19 (600 s timeout); episko claims "Allow/Deny from the GUI" (brief) | — | Needs a spike on our own build |

### Q4 and Q5. Build and maintain

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F47 | Repo state: Sprint 0, "No app code yet"; target commands only | O | [CLAUDE.md](../../../CLAUDE.md) | H | — |
| F48 | The approved PRD plans ~395 points in 14 days and needs **about 28 points a day** from **3 to 5 parallel developer-agent lanes**; the PRD itself rates "scope density and your review time" High impact; throughput is capped by the founder's own subscription windows (High/High) | O | [PRD §9, §10](../../requirements/PRD.md) | H | — |
| F49 | The "2 weeks" in both plans is calibrated on agent lanes, not on one person; points "aren't calibrated yet" | O | PRD Appendix A | H | — |
| F50 | CC released v2.1.301 to v2.1.310 between 15 and 23 Oct: **about 8 releases a week**; four of them touched hooks or Windows hook behaviour | O | [releases](https://github.com/anthropics/claude-code/releases) | H | Last 10 releases |
| F51 | claude-squad (AGPL, 8.7k stars): issue #250 "Project Seems Abandoned" (12 Feb 2026); maintainer: both work full-time jobs and "don't have as much time to commit"; maintain "with a focus on bug fixes" | O | [claude-squad#250](https://github.com/smtg-ai/claude-squad/issues/250) | H | — |
| F52 | opcode (22.4k stars): "Release Executables Will Be Published Soon"; no releases; 268 open issues; build from source with Rust + Bun | O | [github.com/winfunc/opcode](https://github.com/winfunc/opcode) | H | — |
| F53 | Crystal: "has been deprecated and replaced by Nimbalyst" (Feb 2026); reason not stated | O | [github.com/stravu/crystal](https://github.com/stravu/crystal) | H | — |
| F54 | Vibe Kanban (28.5k stars) shut down 10 Apr 2026 | O (S) | brief §2 | M | From the 25 Oct brief |
| F55 | Pattern: stars don't keep a solo or tiny-team agent tool alive; distribution (binaries) and maintenance time do | I | F51 to F54 | M | — |
| F56 | Lemon Squeezy (Stripe-owned) charges 5% + 50c with surcharges (international +1.5%, subscriptions +0.5%); one example reaches 8.6% on a $20 sale; on $10/mo, fees are roughly 11 to 13% | O (S) / I | [dodopayments review](https://dodopayments.com/blogs/lemonsqueezy-review), [swell.is](https://www.swell.is/content/lemon-squeezy-pricing) | M | Competitor blogs; official page not read |

### Q6. The notch

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F57 | The notch needs a global hold/tap detector: Electron's `globalShortcut` gives press only, so ADR-0004 considers a **low-level keyboard hook** (uiohook-napi) or key polling; the PRD flags "signing/antivirus" | O | [PRD §9](../../requirements/PRD.md), [notch design §7](../../design/ux/2026-10-25-atlas-notch-design.md) | H | — |
| F58 | An unsigned, new Electron app with a global keyboard hook is the profile antivirus heuristics treat as a keylogger | I | F37, F57 | M | No AV test done |
| F59 | Windows has no hardware notch; the design puts a floating always-on-top shape at the **top centre**, which is where maximised browsers keep their tab strip and apps their title bar | O / I | Notch design §4 | H / M | — |
| F60 | Four of the notch's risky parts (hold vs tap, drops on click-through windows, call detection, speech runtime) are listed as Medium to High risks in the PRD | O | PRD §10 (Notch 1 to 5) | H | — |
| F61 | The buyer (developers running several CC sessions) already has terminal bells, CC's Notification hook, agent view notifications and Remote Control phone push; a further always-visible surface is novel but not a missing need | I | F5, F7, brief §3 | M | No user research with this audience |
| F62 | The notch was born from the **full team app** (Atlas, ideas, drops, quick talk), not from the companion's job; only "answer what needs you" (§1 moment 3) maps to the companion | O | Notch design §1 | H | — |

---

## 2. Probable architecture of a realistic companion (INFERENCE)

```mermaid
flowchart LR
  subgraph User's own sessions (anywhere)
    T1[claude in terminal] --- T2[desktop app Code tab] --- T3[VS Code]
  end
  P[Eucas Claude Code plugin, user scope<br/>hooks.json + onFailure: block for limits] -->|loaded by every local session| T1 & T2 & T3
  D[native permissions.deny rules<br/>hard limits that need no process] -.->|deny-first, cannot be overridden by hooks| T1 & T2 & T3
  T1 & T2 & T3 -->|PreToolUse / PostToolUse / Notification / Stop<br/>http hook to localhost| A[Eucas tray app, Electron]
  T1 & T2 & T3 -->|statusLine wrapper: calls the user's old status line, passes its output through, tees JSON| A
  H[(~/.claude transcripts, read-only, local)] -->|first-run 7-day retro| A
  A --> I[Inbox + tray count + Windows toast]
  A --> L[Ledger: per session/project, plan % forecast]
  A --> W[Same-file warning: file -> sessions map]
  A --> R[Rules: suggested from history, one click]
```

Two layers on purpose: **hard limits** that must hold when the app is closed or crashed go into native `deny` rules and fail-closed command hooks with a tiny native executable (no shell, no Electron start); **everything else** (ledger, inbox, same-file map, suggested rules) goes through a fast http hook that can fail open safely because it is advisory.

---

## 3. Answers to the six questions

### Q1. Time to first value
- **As designed, the first 5 minutes show nothing** (F10). The user installs, sees an empty ledger, an empty inbox and a blank rules editor. The "aha" needs two live sessions colliding or an agent asking something, which may take hours. With dev-tool first-session activation at 15 to 45% even when value is quick (F8, weak), an empty first run puts us at the bottom of that range.
- **The fix is the ccusage move (F1, F2, F11):** on first run, read the user's last 7 days of their own transcripts locally and show a **"Your week with Claude Code"** retro within 60 seconds:
  - tokens and plan share per project and session;
  - **past** moments two sessions edited the same file within minutes of each other ("this would have warned you 4 times");
  - risky commands that already ran (`git push` to the default branch, `rm -rf`, `reset --hard`);
  - the commands you approved by hand most often ("you clicked Allow on `pnpm test` 212 times") turned into **one-click suggested rules**.
  That makes the rules editor an *accept* screen, not a *write* screen. Nobody in the brief's field does this (I, M).
- Comparables: ccusage = instant value from history; episko = launcher, value when you start a session through it; agent view = value only for backgrounded sessions (F1, F3, F5).

### Q2. Setup friction
- **Use a Claude Code plugin at user scope, never project settings** (F12, F13, F30, F32). Project writes pollute repos and teammates; a plugin is attributable in prompts, merges with the user's hooks, and uninstalls cleanly. Fallback when plugins are blocked: user `settings.json` with a backup and an exact restore.
- **Status line is a collision** (F26, F27). Wrap: save the user's existing `statusLine.command`, call it, print its output, tee the JSON to the app. Never replace silently. If plugins can ship the main status line (F31, Unknown), still wrap.
- **Fail-closed has two failure faces** (F14, F20): fail open and the safety claim is a lie; fail closed on an advisory hook and closing the app freezes every session. Split as in section 2.
- **Minimum CC version for safety claims:** below v2.1.310 on Windows, hooks have known fail-open paths (F15). The app must read `version` from the status line JSON or hook input and say "limits not guaranteed on this version" rather than show a green shield.
- **Your auto-approve can silently do nothing** (F22, F23). Detect the user's existing `ask`/`deny` rules and show the conflict in the rule card.
- **Managed machines** (F25): detect `allowManagedHooksOnly` and say "your organisation blocks Eucas" on screen instead of failing silently (#88896 shows users blame the tool).
- **Windows specifics:** Git Bash present vs absent changes the shell (F17); backslashes vanish in Git Bash (F18); a `.cmd` shim isn't valid exec form (F17); a native `claude.exe` and an npm install on PATH have broken hooks before (F16). Use exec form with a tiny `.exe` or an http hook; write all paths with forward slashes; test the matrix in section 5.
- **Worktrees:** long paths (F33, F34). Out of v0.1 anyway (section 5). Developer Mode isn't needed for worktrees.
- **Install:** Electron is 60 to 150 MB before models (F35, F36); SmartScreen warnings for days even when signed (F37); Artifact Signing eligibility is Unknown for the founder (F38). A "small companion" that is a 120 MB installer with a blue SmartScreen wall reads as the opposite.

### Q3. Attach or start through?
- **Attach is realistic and should be the only mode in v0.1** (F39 to F41). User-scope hooks reach every local session, including ones already running, the desktop app and VS Code. That keeps the promise "plugs into the sessions you already run".
- **What attach can't do** (F42 to F46): create worktrees for those sessions, pause an idle session, nudge a session that is waiting for the user, or reliably answer a terminal prompt from outside. The supervisor's "nudge" works only at the Stop moment; budgets "auto-pause" only by denying the next tool call.
- **UX consequence:** promise **watch, warn, guard**. Drop "manage", "run" and "guided merge" from v0.1 copy. A launcher mode (episko-style `--settings` per launch) can come later for people who want worktrees and pause, and it is exactly where Anthropic's agent view is going, which argues for not building it at all.

### Q4. Is 2 weeks realistic?
**No, not for the listed scope.** Evidence: zero app code (F47); the 2-week figure was calibrated on 3 to 5 agent lanes at ~28 points a day (F48, F49); the founder's review time was already the PRD's top scope risk; hooks behaviour on Windows changed four times in nine days (F50). Rough solo effort, inference only:

| Item | Days (solo + agents, inference) | Keep in v0.1? |
|---|---|---|
| Plugin + hook binary/http bridge + fail-closed limits + Windows matrix tests | 3 to 4 | **Yes** |
| First-run 7-day retro from transcripts | 1.5 | **Yes** |
| Inbox (Notification/Stop) + tray count + Windows toast | 1 | **Yes** |
| Same-file warning (live, from PostToolUse) | 1 | **Yes** |
| Ledger + plan forecast via status-line wrapper | 1.5 | **Yes, simple** |
| Rule suggestions + 5 templates (no free-text compiler) | 1.5 | **Yes, templates only** |
| Installer, Artifact Signing, auto-update | 1.5 to 3 | **Yes**, signing may slip (F38) |
| Plain-text rules compiler (LLM or parser) | 3+ | No |
| Guided merge (rebase, test, PR) | 3+ | No |
| Notch (window, key hook ADR, AV, full-screen detection) | 4 to 6 | No |
| Licence keys, Pro gating, payments | 2 | No (waitlist only) |
| Budgets with auto-pause, supervisor, history, Routines | 5+ | No |

The "yes" column already fills 12 to 15 working days for one person. Anything more is wishful.

### Q5. Maintenance
- About **8 CC releases a week** (F50), with hook semantics on Windows changing inside a week. A hooks product inherits every one of those changes. Without a daily contract test against the latest CC (the PRD's M9, rewritten for hooks rather than the SDK), the first user report is how the founder finds out.
- **Support load:** every user has a different mix of Git Bash, PowerShell, CC install type, existing hooks, status line and managed settings. With 5 hours a week of business time, about 10 broken-setup issues a week consume all of it (I). A built-in **Doctor** that produces a redacted report (versions, shells, hook sources, conflicts) is the cheapest support tool there is.
- **Bus factor 1.** The field shows what happens: claude-squad slowed to bug fixes when maintainers had day jobs (F51); opcode never shipped binaries despite 22.4k stars (F52); Crystal was replaced (F53); Vibe Kanban shut down (F54). Survivors keep the surface tiny (ccusage: one command, read-only). A read-mostly companion with a small hook surface is maintainable; a launcher + merge + notch + payments product is not.

### Q6. The notch
- **For this audience in v0.1: noise with cost.** It solves the full team app's "hand Atlas an idea" job (F62), not the companion's job. It occupies the top-centre strip where developers keep browser tabs and title bars (F59). It needs the riskiest native dependency in the plan (F57) and invites antivirus flags on an unsigned new app (F58). The audience already has several "needs you" channels (F61).
- **Where it is delight:** the founder's own use, the showcase video and build-in-public posts (it is distinctive). Keep it as an **opt-in experiment after v0.1**, behind a setting, turned on only if retention data says the inbox is used and people ask for an ambient surface.
- **Visual identity:** keep the eyes/Atlas character in the tray icon and the app; it differentiates against a field of grey terminal tools. Don't let it carry the first run; the retro does that.

---

## 4. Failure modes

| # | Failure | How it happens | Likelihood | Kills users? | Kills buyers? | Early warning signal | Prevention or fix | Fixable? |
|---|---|---|---|---|---|---|---|---|
| 1 | **Empty first run** | Install, see blank ledger/inbox/rules, close, never return | High | Yes | Yes | Low share of installs reaching "first protected session"; uninstall within a day | 7-day retro from local transcripts + suggested rules on first launch (F1, F11) | yes |
| 2 | **Safety claim proven false** | A hard limit fails open on Windows (old CC, no Git Bash, quoting) and an agent pushes to main or deletes; someone posts it | Medium | Yes | **Yes, permanently** | Any "it let X through" issue; CC release notes mentioning hook fail-open | Native `deny` + fail-closed tiny `.exe` hooks; minimum CC version check; red "not guaranteed" state; matrix tests in CI on every CC release | partly |
| 3 | **Everything freezes when the app is closed** | Advisory hooks set to fail closed; app crashes or isn't started at login | Medium | Yes | Yes | "Claude hangs / every tool blocked" reports | Only limits fail closed and they need no app; advisory http hooks fail open | yes |
| 4 | **Status line clobbered** | Companion overwrites the user's custom status line | High (for power users) | Yes | Yes | Issues titled "my statusline disappeared" | Wrap and chain the existing command; exact restore on uninstall | yes |
| 5 | **Repo pollution** | Hooks written into committed `.claude/settings.json`; teammates get Eucas hooks that point at a missing app | Medium | Yes | Yes (teams) | Hooks showing in PR diffs | User-scope plugin only; never write project settings | yes |
| 6 | **Rules silently ignored** | The user's `ask`/`deny` rules override the companion's allow (F22) | High | Yes (trust erodes) | Partly | "I made a rule and it still asks me" | Detect conflicts and show them on the rule card | yes |
| 7 | **Silent no-op on managed machines** | `allowManagedHooksOnly` / `disableAllHooks` block every hook | Medium (work laptops) | Yes | Yes (teams) | Sessions seen = 0 after install | Detect and say so on screen at install | partly (can't override policy) |
| 8 | **Hook latency** | Hook runs a heavy runtime per call across parallel sessions | Medium | Yes | No | Users notice slower tool calls | http hook to the running app, or a tiny native exe; measure in the spike | yes |
| 9 | **CC update breaks it weekly** | ~8 releases a week; a hook field, shell or precedence change | High | Yes | Yes | Contract test red; spike in issues after a CC release | Daily CI against latest CC; version gate; fast patch release path | partly |
| 10 | **SmartScreen / antivirus wall** | New unsigned or new-reputation app; worse with a global keyboard hook | High (first weeks) | Yes | Yes | Download vs first-launch gap; "Windows protected your PC" reports | Artifact Signing (check eligibility, F38); no keyboard hook in v0.1; a winget / `npx` path | partly |
| 11 | **"Companion" is a 150 MB app** | Electron + models + notch | Medium | Partly | No | Comments about size/RAM | No voice models in v0.1; idle at near-zero CPU; consider a plugin-only tier | partly |
| 12 | **Promise mismatch on attach** | Copy says "manage, pause, worktrees, merge"; attach can only watch and deny | High (if copy unchanged) | Yes | Yes | "It can't pause my session" | Promise "watch, warn, guard"; launcher later or never | yes |
| 13 | **Scope death march** | Founder tries the full CR-010 list in 2 weeks; ships late and buggy, or not at all; the full team app plan (PRD) is still pending in parallel | **High** | n/a | n/a | Day 5 with no installable build; more than one epic "in progress" | Section 5 cut; one product at a time; CR-010 explicitly parks the team app | yes |
| 14 | **Support swamps the founder** | Every user's setup differs; 5 h/week | High | Indirectly | Yes | > 3 h/week on issues for 3 weeks | Doctor report; issue template; known-good matrix; refuse unsupported setups clearly | partly |
| 15 | **Anthropic ships the hero** | Agent view or permissions UI adds rule suggestions or overlap warnings | Medium to High within 6 months | Yes | Yes | CC release notes, docs | Stay on top of native features (read their state); differentiate on cross-session + Windows + plain explanations; keep the build small so a pivot is cheap | partly |
| 16 | **Notch annoys** | Always-on-top shape over tab strips; animations while working | Medium | Partly | No | Setting toggled off; issues | Out of v0.1; opt-in later | yes |
| 17 | **Paywall on session count leaves sessions unprotected** | Free tier = 3 sessions; session 4 runs without limits | Medium | Yes (trust) | Yes (story) | "Session 4 deleted my files" | Never meter safety; meter history, budgets, supervisor | yes |
| 18 | **Transcript format changes** | Retro and ledger depend on an undocumented JSONL format | Medium | Partly | No | Parse errors after a CC release | Parse defensively with zod; degrade to "no history" not crash; same contract test | yes |
| 19 | **Vibe-coded safety code** | Agent-written hook logic without adversarial tests; a bypass (`sh -c`, path tricks, F24) is found publicly | Medium | Yes | Yes | Bypass reports | Port M8's 15 deterministic tests + bypass corpus; tests before features (CLAUDE.md rule) | yes |
| 20 | **Auto-update stuck** | Unsigned or broken updater leaves users on a version incompatible with new CC | Medium | Yes | Partly | Version spread in Doctor reports | Ship the updater in v0.1; also show "update available" from GitHub releases | yes |

---

## 5. A credible 2-week v0.1 cut

**Positioning for v0.1:** *"See what your Claude Code sessions did this week, and stop the ones about to hurt you."* Free, open source, Windows first. No Pro, no paywall.

**In (12 to 15 working days, solo with agents):**
1. **Day 0 to 1 spike (before G6, like S0-1):** a user-scope plugin with a PreToolUse hook as (a) tiny native exe and (b) http hook to a running app, `onFailure: block`, on CC 2.1.310+ with Git Bash present and absent, PowerShell 5.1 and 7, native and npm installs. Measure latency per call. Verify: file watcher picks up hooks in running sessions; hook allow vs user `ask` rule; the status-line wrapper chains an existing status line. **Go/no-go on this.**
2. **Install:** signed installer if Artifact Signing is available to the founder; otherwise publish unsigned with an honest SmartScreen note and a `winget`/zip path. Auto-update from GitHub Releases.
3. **First run (the aha):** the 7-day retro from local transcripts (tokens and plan share per project, past same-file overlaps, risky commands that ran, most-approved commands) with **one-click suggested rules**. Read-only, local, nothing leaves the machine.
4. **Hard limits** (always on, free, every session): never push to the default branch, never force-push, never `reset --hard`/delete outside git, plus whatever the founder's CR-008 rules need; written as native `deny` rules where expressible and fail-closed native hooks for the rest; a red banner when the CC version is below the known-good minimum.
5. **Rules:** five templates plus the suggested ones. No free-text compiler.
6. **Live same-file warning** across sessions, explained in one plain sentence, as a toast and in the app.
7. **Inbox:** "N need you" from Notification and Stop events; tray count; Windows toast; click opens the right terminal or session where possible, otherwise names it.
8. **Ledger and forecast:** per session and project from the status-line wrapper; 5-hour and weekly forecast (free, matching episko).
9. **Doctor:** one button, redacted report (versions, shell, hook sources, conflicts, managed policy).
10. **Exact uninstall:** removes the plugin and restores the status line and any settings it touched.

**Out of v0.1 (sequenced, each needs its own CR):**
- The notch, quick talk, local voice models (CR-009's E16) for the companion.
- Guided merge (rebase, test, PR).
- A launcher mode, worktree creation, pause/resume of interactive sessions.
- The free-text rules compiler.
- Pro: budgets with auto-pause, the supervisor, unlimited sessions, history beyond 7 days, Routines; licence keys and payments. Ship a **Pro waitlist link** to measure intent instead.
- macOS and Linux packages.

---

## 6. Kill criteria

Decide these **before** building; the PM writes them into CR-010.

| When | Kill or stop signal | Action |
|---|---|---|
| End of the day-0/1 spike | A hard limit can't be made fail-closed on current CC on Windows with Git Bash both present and absent, or hook overhead > 150 ms per call | Drop "hard limits" from the promise; ship a watch-only retro + inbox, or stop CR-010 |
| Day 5 of the build | No installable build that the founder runs on his own sessions | Cut to retro + limits + inbox only |
| Day 14 | Founder doesn't keep it running on his own machine for 10 of the next 14 days (dogfood, as O1) | Don't launch publicly |
| 30 days after launch | Fewer than 30% of installers reach "first protected session" (opt-in ping or Doctor counts), or fewer than 20% of activated users still active in week 2 | Stop feature work; fix first run or stop |
| 30 days after launch | Support > 3 h/week for 3 weeks in a row | Freeze features; narrow supported setups |
| Any time | A public, reproducible safety bypass that can't be fixed within 72 h | Pull the "hard limits" claim from the site and the app until fixed |
| Any time | CC ships native cross-session overlap warnings **and** rule suggestions | Pivot to Windows-first explanations and budgets, or wind down |
| 60 days after launch | Fewer than 2% of activated users join the Pro waitlist | Don't build Pro; keep it a free OSS tool and return to the team app |

---

## 7. Lens verdict

**Serious, fixable.** The idea survives this lens only as a **small, attach-only, read-mostly** v0.1 with an instant retro and honest safety claims. The currently described scope fails it on three counts that are each fatal alone: no first-run value, a safety promise that hooks can't keep by default on Windows, and a solo build plan that assumes agent-lane velocity on a product that has never been built.

---

## 8. Steal / Avoid / Beat / Parity

- **Steal:** ccusage's zero-setup history read (first-run retro); episko's "N need you" count, forecast and its read-only discovery of external sessions; agent view's state names (Working / Needs input / Idle / Done / Failed); CC's own `onFailure: block` and plugin packaging; the permission prompt's hook attribution.
- **Avoid:** episko's launcher-only coverage (our hooks cover all sessions); opcode's no-binaries; claude-squad's maintainer drift (keep the surface small); writing to project settings; replacing the status line; metering safety; a keyboard hook in a new unsigned app.
- **Beat:** the first 60 seconds (retro with suggested rules nobody else offers); limits that say plainly when they are *not* guaranteed (CC version, managed policy, conflicts); Windows-first testing across Git Bash/PowerShell/install type.
- **Parity:** needs-you count and toast, plan-limit forecast, per-session tokens, a clean uninstall.

---

## 9. Proposed BRD items (from teardown, needs client approval)

Each is a proposal for the BA and PM to bring to the client. None is in the BRD.

| ID | Proposed item | Rationale | Evidence |
|---|---|---|---|
| PT-1 | **The companion's first run shows a 7-day retro from the user's own local session history** (tokens, plan share, past same-file overlaps, risky commands, most-approved commands), read-only and local. *From teardown, needs client approval.* | Only way to an "aha" in under 5 minutes; also a privacy decision the client must make | F1, F2, F10, F11 |
| PT-2 | **Rules start as one-click suggestions from history plus five templates**; the free-text compiler moves after v0.1. *From teardown, needs client approval.* | Writing rules from a blank page is the drop-off point; the compiler is 3+ days of risky work | F10, Q4 table |
| PT-3 | **Hooks ship as a Claude Code plugin at user scope; the companion never writes project settings.** *From teardown, needs client approval.* | Clean merge, attribution, uninstall; no repo pollution | F12, F13, F30, F32 |
| PT-4 | **Hard limits are native `deny` rules plus fail-closed native hooks that need no running app; advisory hooks fail open.** *From teardown, needs client approval.* | Fail-open by default; closing the app must not freeze sessions | F14, F15, F20, F24 |
| PT-5 | **Safety status is honest:** the app shows "limits not guaranteed" below a known-good CC version, under managed hook policy, or when the user's rules conflict. *From teardown, needs client approval.* | Recent Windows fail-open bugs; managed policy blocks hooks; `ask` overrides hook allow | F15, F16, F22, F25 |
| PT-6 | **The status line is wrapped and chained, never replaced**, and restored exactly on uninstall. *From teardown, needs client approval.* | One status line per scope; power users already have one | F26, F27 |
| PT-7 | **Safety is never metered.** Free covers unlimited sessions for limits, inbox and same-file warnings; paid tiers meter history, budgets and the supervisor. *From teardown, needs client approval.* (Changes the "up to 3 sessions free" plan.) | A session cap on a guard leaves sessions unprotected | §4 row 17 |
| PT-8 | **v0.1 is attach-only; copy promises "watch, warn, guard"**; launcher mode, worktree creation, pause and guided merge are post-v0.1 CRs. *From teardown, needs client approval.* | Hooks can't create worktrees or pause idle sessions they didn't start | F41 to F46 |
| PT-9 | **The notch is out of the companion's v0.1** and returns as an opt-in experiment gated by retention data. *From teardown, needs client approval.* (Interacts with CR-009, approved for the team app.) | Highest-risk item, smallest activation gain, AV risk | F57 to F62 |
| PT-10 | **A Doctor report and a CC-latest contract test in daily CI** are v0.1 Musts. *From teardown, needs client approval.* | ~8 CC releases a week; solo support budget | F50, §3 Q5 |
| PT-11 | **Kill criteria in section 6 are written into CR-010 before building.** *From teardown, needs client approval.* | Pre-commit to stopping rules while the decision is cheap | §6 |
| PT-12 | **A day-0/1 hooks spike before G6** (plugin, fail-closed exe vs http, Git Bash present/absent, latency, file-watcher pickup, status-line chaining). *From teardown, needs client approval.* | None of the existing spikes covers the attach path | Framing fact, F15 to F21 |

---

## 10. Strategy delta (vs the 25 Oct companion brief)

1. **The wedge moves from "rules editor" to "first-run retro that writes your rules for you".** The brief's free hero (limits + rules + same-file) stands, but it can't be felt on day 1 without history.
2. **"Hard limits enforced outside the model" needs a caveat in all copy:** enforced by Claude Code's own deny rules and fail-closed hooks, guaranteed only on known-good versions and without managed hook policy.
3. **Pricing:** drop "up to 3 sessions free"; meter value features, not protection (PT-7). Pro stays a waitlist until the kill criteria in §6 are passed.
4. **CR-010's "2 weeks" is credible only for the §5 cut.** The full team app's 14-day plan and the companion can't both be "current"; CR-010 should park the team app explicitly.
5. **Watch Anthropic's mods/plugin surface** (a mod can "draw panes and add commands", F30): it may become the cheapest UI for the companion inside the terminal, and also the way Anthropic ships our hero.

---

## 11. Checklist close and open unknowns

| Question | Status |
|---|---|
| Q1 Time to first value | Answered (comparables observed; activation numbers weak) |
| Q2 Setup friction | Answered for hooks, status line, precedence, managed policy, Windows shells; partly for installer/signing |
| Q3 Attach vs start | Answered for capability; partly for answering prompts remotely (U) |
| Q4 2-week realism | Answered (inference on effort; observed plan assumptions) |
| Q5 Maintenance | Answered |
| Q6 Notch | Answered (inference; no user research with this audience) |

**Open unknowns and what resolves them:**
- **U1 (F31)** Can a plugin ship the main `statusLine`? Read the plugin manifest reference; test in the spike.
- **U2 (F43)** Is there any supported way to inject a prompt into, or pause, an interactive session from outside? Read the rest of the agent-view and CLI docs; ask in Anthropic's public issue tracker.
- **U3 (F46)** How does a waiting PermissionRequest hook race with the terminal prompt? Spike on our own build.
- **U4 (F38)** Is the founder eligible for Azure Artifact Signing, and what does it cost today? The founder checks the Azure portal.
- **U5** Hook latency per call for an exe vs http hook across 3 to 5 parallel sessions on Windows. Measure in the spike.
- **U6** Transcript JSONL stability across CC releases. Track ccusage's changelog for format fixes; add the contract test.
- **U7 (F39)** Does the file watcher pick up a newly installed **plugin's** hooks in running sessions, or only settings edits? Spike.
- **U8 (F58)** Do Defender or common AV products flag an Electron app with uiohook-napi? Only relevant if the notch returns; test on a clean VM.
- **U9** Real activation and retention for this audience. Only resolvable after launch, with an opt-in ping or Doctor counts.

**Sources:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) · [statusline](https://code.claude.com/docs/en/statusline) · [permissions](https://code.claude.com/docs/en/permissions) · [plugins](https://code.claude.com/docs/en/plugins) · [agent-view](https://code.claude.com/docs/en/agent-view) · [desktop](https://code.claude.com/docs/en/desktop) · [claude-code releases](https://github.com/anthropics/claude-code/releases) · [claude-code#25577](https://github.com/anthropics/claude-code/issues/25577) · [claudeissues.com #28964](https://claudeissues.com/issue/28964-bug-some-hooks-stopped-working-in-version-2-1-47-on-windows) · [ccusage](https://github.com/ryoppippi/ccusage) · [episko](https://github.com/respeak-io/episko) · [claude-squad#250](https://github.com/smtg-ai/claude-squad/issues/250) · [opcode](https://github.com/winfunc/opcode) · [crystal](https://github.com/stravu/crystal) · [gitforwindows long paths](https://gitforwindows.org/git-cannot-create-a-file-or-directory-with-a-long-path) · [devclass Artifact Signing](https://devclass.com/2026/01/14/code-signing-windows-apps-may-be-easier-and-more-secure-with-new-azure-artifact-service/) · [codenote.net SmartScreen 2026](https://codenote.net/en/posts/windows-desktop-app-code-signing-distribution-japan-2026/) · [dolthub Electron vs Tauri](https://dolthub.com/blog/2025-11-13-electron-vs-tauri) · [artisangrowthstrategies devtools benchmarks](https://www.artisangrowthstrategies.com/benchmarks/devtools) · [dodopayments Lemon Squeezy review](https://dodopayments.com/blogs/lemonsqueezy-review)
