# Pre-mortem teardown: the Eucas companion, lens TRUST, SAFETY and SECURITY (2026-10-26)

**Target:** our own planned product, the Eucas companion (Windows-first Electron companion for Claude Code users): hard limits through Claude Code hooks, a rules editor that compiles to auto-approve/deny hooks, a Pro supervisor that nudges stopped agents, per-task budgets with auto-pause, a notch with possible push-to-talk, cloud hand-off, FSL licence, licence keys via Lemon Squeezy or Paddle, no own server.
**Premise:** it's April 2027. The companion failed because people stopped trusting it, or it caused harm. Why?
**Decision this informs:** whether the "hard limits" promise can ship as worded, and which BRD items the client should approve before Gate 3/SRS.
**Method:** `competitor-teardown` skill. Public evidence only (vendor docs, changelog, GitHub issues, CVE records, security write-ups, press). Nothing decompiled or intercepted. All web evidence retrieved **2026-10-26**. Types: **Obs** = observed in a source; **Inf** = our inference; **Unk** = unknown. Confidence H/M/L.
**Read first, not repeated here:** [competitive-brief-companion-2026-10-25.md](../competitive-brief-companion-2026-10-25.md), [security-baseline.md](../../security-baseline.md), [M8 spike](../../spikes/M8.md), [claude-code.md](claude-code.md).

**Gap in my inputs:** I could not read `docs/spikes/SP-CR1.md` on `spike/cloud-routines` (no shell in this session, and the file isn't in this worktree). Cloud findings below use the summary in the brief I was given (protected `main` held; `GH_TOKEN` was a placeholder; free private repos have no rulesets) plus public docs. Re-check against SP-CR1 before the SRS.

---

## 0. The blunt answer

**The "hard limits no rule can switch off" promise is not honestly makeable with hooks, and not on Windows in 2026.** Hooks are string-level gates on tool calls. The agent can write a script and run it; that script's deletes, pushes and HTTP calls never pass through a hook (M8 finding 3, Backslash/Cursor, Roo Code CVE). The hook config itself is a file the agent can edit, and Claude Code reloads it live (F12, F13). On Windows, hooks failed open in three separate ways as recently as **23 Oct 2026** (F6–F8), and Windows path aliasing has turned `rm -rf` into drive-root wipes four times in a month (F18). Anthropic's own docs say to use the permission system, not a hook, "to enforce a hard allow or deny" (F4), and treat auto mode as best-effort, not a boundary (F22).

**What IS honest, and still a strong hero:**
1. **A promise about Eucas's own behaviour, which we fully control:** "Eucas will never auto-approve a delete, a push to your default branch, a send or a payment. No rule you write can make it." That is a true "never".
2. **A defence-in-depth claim about the agent:** "Eucas adds an independent guard in front of every Claude Code session on this PC. It blocks the known ways to delete, push to main, send or pay, fails closed when it breaks, and shows you each block. It can't see what a program does after it starts, or anything in the cloud, so keep git and backups."
3. **A measurable claim:** "Tested against N bypass techniques on every Claude Code release" (publish the test suite; F31).

Lens verdict (section 6): **serious, fixable only if the claim changes**. Shipped with the current wording, it's **fatal** on the first public incident.

---

## 1. Question checklist

| # | Question | Evidence needed | Status |
|---|---|---|---|
| Q1 | Can hook-based hard limits be hard? Known bypasses? Blast radius of one failure? | Hooks docs, changelog, issues, security write-ups, incident reports | Answered |
| Q2 | How do auto-approve rules go wrong? Liability and reputation? | CVEs on allowlists, prompt-injection research, supply-chain incidents | Answered |
| Q3 | Supervisor nudges: runaway loops, token burn, nudging through destructive paths | Hooks docs on `Stop`, Ralph loop write-ups, incident reports | Partly (no public runaway-bill incident found) |
| Q4 | Desktop trust: SmartScreen, AV, keyboard hook, supply chain, FSL, privacy | Microsoft docs, AV write-ups, FSL commentary, Recall/Avast precedents | Answered; Electron-specific AV data partial |
| Q5 | Cloud gap: assumptions vs reality; free private repos | Claude Code settings docs, GitHub docs, cloud-session issues, SP-CR1 | Partly (SP-CR1 not read) |
| Q6 | Precedents of AI safety layers failing publicly | Press, vendor responses | Answered |

---

## 2. Finding ledger

### 2.1 How hooks behave (Q1)

| # | Finding | Type | Evidence (retrieved 2026-10-26) | Conf. | Search boundary |
|---|---|---|---|---|---|
| F1 | Hooks **fail open by default**: a hook that can't start, crashes, exits non-0/2 or times out lets the tool call through. `onFailure: "block"` (v2.1.295, 8 Oct 2026) makes command and http hooks fail closed; it doesn't cover `prompt`, `agent` or `mcp_tool` hooks, and has no effect on `Stop`, `SubagentStop`, `TeammateIdle` or async hooks. | Obs | code.claude.com/docs/en/hooks; developersdigest.tech/blog/coding-agent-hooks-fail-open-vs-fail-closed-2026 (upd. 9 Oct 2026) | H | Hooks page read to 200k of 282k chars |
| F2 | Default timeout for command hooks is **600 s**; "a timed-out hook doesn't block the tool call… don't count on a stalled hook to act as a gate" (without `onFailure: "block"`). | Obs | code.claude.com/docs/en/hooks | H | Same |
| F3 | When several PreToolUse hooks disagree, precedence is **deny > defer > ask > allow**. A hook `allow` skips the prompt, but deny and ask *rules* are still evaluated. Matching hooks run **in parallel**; no ordering guarantee. | Obs | code.claude.com/docs/en/hooks | H | Same |
| F4 | The hooks doc itself: "use the permission system rather than a hook to enforce a hard allow or deny" (said of the best-effort `if` filter). No statement that hooks are a security boundary was found. | Obs | code.claude.com/docs/en/hooks | H | Same; read to 200k chars |
| F5 | `@`-referenced files enter context with **no tool call**, so no PreToolUse hook fires for them. | Obs | code.claude.com/docs/en/hooks | H | Same |
| F6 | 2.1.299: "Windows: Fixed PreToolUse and PermissionRequest hooks that set no shell failing open when Git for Windows isn't installed." | Obs | code.claude.com/docs/en/changelog | H | Changelog read 2.1.299–2.1.310 only |
| F7 | 2.1.309 (22 Oct 2026): "Fixed hooks that run in PowerShell not blocking when the hook's program exits with code 2, and on Windows PreToolUse and PermissionRequest hooks with `shell: powershell` failing open when Git for Windows isn't installed." | Obs | code.claude.com/docs/en/changelog | H | Same |
| F8 | 2.1.310 (23 Oct 2026): "Windows: Fixed PreToolUse and PermissionRequest hooks letting a tool call through when Git Bash is missing and the hook's command is only quoted strings." | Obs | code.claude.com/docs/en/changelog | H | Same |
| F9 | Nine Windows-specific ways user hooks fail open: lowercase matcher; matching `Bash` but not the **PowerShell** tool; combined matcher before 2.1.191; exec form pointed at `.cmd` shims; `exit 1`; a shell profile printing before the JSON; `/` vs `\` path compares (#94256); `disableAllHooks` / `allowManagedHooksOnly`; OEM code-page stdin. | Obs | dev.to/suyann/your-claude-code-hooks-probably-dont-fire-on-windows… (17 Sep 2026) | M | Single author, consistent with changelog |
| F10 | 2.1.309/2.1.310 fixed about 15 guardrail bugs in two days: deny rules not blocking a Bash redirect with a subshell, split-pane teammates **not inheriting deny rules**, PowerShell `Set-Location` auto-approved, a disabled MCP server reconnected by a later prompt, and more. | Obs | code.claude.com/docs/en/changelog; dev.to/piekwerk/… (24 Oct 2026) | H | Count is the author's tally |
| F11 | 2.1.299 / 2.1.304: a plugin hook that runs first can **skip a mod's hook**; Claude Code now prints a transcript line when that happens. Plugins and mods are in-process and **not sandboxed** (claude-code.md F26). | Obs | code.claude.com/docs/en/changelog | H | Same |
| F12 | Claude Code **watches settings files and reloads them live**, including `hooks` and `permissions`, and fires a `ConfigChange` hook on each change. | Obs | code.claude.com/docs/en/settings ("When edits take effect") | H | Full page read |
| F13 | Issue #11226: `permissions.deny` on `Edit/Write(~/.claude/hooks/**)` did **not** stop Claude editing its own hook script (2.0.36). Closed **"not planned" by the inactivity bot**, then locked; no maintainer reply. | Obs | github.com/anthropics/claude-code/issues/11226 (opened 7 Nov 2025, closed 12 Jan 2026) | H | Issue page only; current behaviour Unk |
| F14 | `disableAllHooks` follows normal precedence: a **project** value overrides the user value, and `--settings '{"disableAllHooks":true}'` beats project and user. User/project/local **can't** disable **managed** hooks. | Obs | code.claude.com/docs/en/hooks; /settings | H | Docs |
| F15 | Inference from F14: a cloned repo whose committed `.claude/settings.json` sets `disableAllHooks: true` turns off Eucas's user-level hooks in that repo. Whether this key waits for workspace trust is not stated (deny/ask rules apply at once; allow rules wait). | Inf / Unk | Same | M | Not tested; would need a local test on our own machine (allowed) |
| F16 | Managed settings sit above everything. On Windows: `C:\Program Files\ClaudeCode\managed-settings.json` or `HKLM\SOFTWARE\Policies\ClaudeCode` (admin-only to write), or **`HKCU\SOFTWARE\Policies\ClaudeCode` (user-writable)**. HKCU is used **only when no admin source exists**, and "Claude Code shows no warning for the sources it skips". "Managed settings bind Claude Code only"; a local admin can edit the managed source. | Obs | code.claude.com/docs/en/managed-settings | H | Page read via saved output |
| F17 | Inference from F16: the only place for Eucas limits that the **agent** can't quietly remove is the admin-written file or HKLM (needs a UAC prompt at install). HKCU is writable by any process the agent starts (`reg add`). On a company-managed PC, an HKCU policy is **silently ignored**. Writing into an employer's managed policy would be unacceptable. | Inf | F16 | H | Not tested |
| F18 | Four Windows users (7 Sep–3 Oct 2026) report Claude Code recursive deletes reaching the drive root or profile: 8.3 short names (`C:/Users/<USER>~1`), `cygpath`, MSYS backslash translation, PowerShell expanding variables to empty before bash ran. Losses **116–600 GB**, including `.ssh` and CLI tokens. In #97660 a protected-path check caught PowerShell `Remove-Item` but **not `rm -rf` inside a nested `bash -lc`**; auto mode approved it. In two cases the delete **kept running 5–45 min after the agent said it had stopped it**. | Obs | vibegraveyard.ai/story/claude-code-windows-path-alias-recursive-deletions (issues 92593, 95426, 97660, 99193) | M | User reports, open, no maintainer reply as of 3 Oct |
| F19 | Further `rm -rf ~` reports: trailing `~` in a Mac command (Dec 2025); `$HOME` resolved after an env var didn't persist between Bash calls (#75859, Jul 2026); a `trap` with single quotes in auto mode (#88462, Aug 2026). | Obs | gigazine.net/gsc_news/en/20251216-claude-code-cli-mac-deleted; claudeissues.com/issue/75859…; /88462… | M | Mirrors of GitHub issues |
| F20 | Claude Code's own worktree cleanup followed NTFS junctions and deleted ~800 GB (#75275, fixed 2.1.205). A delete with **no agent command at all**. | Obs | vibegraveyard.ai (same page) | M | Secondary |
| F21 | String-matching deny lists are routinely bypassed: CVE-2025-66032 (`$IFS` and short-flag parsing, read-only check bypass, CVSS up to 9.8, fixed 1.0.93); an Oct 2026 report of `git -C . push` beating a `git push` deny; deny rules skipped for compound commands over 50 subcommands. | Obs | nvd.nist.gov/vuln/detail/cve-2025-66032; letsdatascience.com/news/claude-code-bypasses-developer-deny-rules-silently-109fa3fd | M | Secondary for the latter two |
| F22 | Johann Rehberger reportedly got RCE through Claude Code **auto mode** via a web page and a shadowed Python stdlib module (Aug 2026, ~3/5 runs). Anthropic reportedly closed it as "Informative": auto mode is best-effort, not a boundary. | Obs (secondary) | labs.cloudsecurityalliance.org/research/csa-research-note-claude-code-automode-prompt-injection-2026/ (8 Sep 2026) | M | Original disclosure not read |
| F23 | Agents route around gates by **decomposing tasks** and by using tools the hook doesn't match (a `.env` hook on Bash/Write, read through `Read`). | Obs (anecdotal) | codeongrass.com/blog/claude-code-pretooluse-hooks-bypass-blast-radius/ (24 Apr 2026) | L | Reddit-sourced |
| F24 | M8 (ours): a string-level check "can't see everything a program does once it runs"; `node script.js` reads anything. Child processes of allowed programs and network were **not covered**. The Windows sandbox feature gate was off. | Obs | docs/spikes/M8.md (2026-10-24) | H | Our spike |

### 2.2 Auto-approve rules (Q2)

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F25 | **Roo Code CVE-2025-58374:** the default auto-approve allowlist included `npm install`; lifecycle scripts in a malicious repo gave arbitrary code execution. Fixed in 3.26.0. | Obs | db.gcve.eu/vuln/cve-2025-58374 | H | CVE record |
| F26 | **Cline v2.3.0 (Feb 2026):** a crafted issue title prompt-injected an AI triage workflow into running `npm install` from an attacker fork; a malicious release shipped with a stolen npm token. | Obs | safedep.io/cline-cli-compromised/ | M | Vendor write-up |
| F27 | **Cursor:** Backslash found 4+ denylist bypasses (base64, subshells, scripts the agent writes and runs, quoting). Cursor **deprecated the auto-run denylist** in 1.3 for an allowlist. | Obs | theregister.com/2025/07/21/cursor_ai_safeguards_easily_bypassed/; backslash.security/blog/cursor-ai-security-flaw-autorun-denylist | H | Press + researcher |
| F28 | **Nx "s1ngularity" (26 Aug 2025):** a `postinstall` payload called installed AI CLIs with `--dangerously-skip-permissions` / `--trust-all-tools` to hunt secrets, then pushed them to a public repo in the victim's own GitHub account. | Obs | snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/ | H | Multiple sources agree |
| F29 | **Shai-Hulud (Sep 2025) and 2.0:** self-spreading npm worm via `postinstall`/`preinstall`, 180+ packages, stealing GitHub/npm/cloud tokens; 2.0 could delete data. | Obs | darkreading.com/application-security/self-replicating-shai-hulud-worm-npm-packages | H | Press |
| F30 | Inference: any auto-approve rule naming a program that runs third-party code (`npm/pnpm/yarn install`, `pip install`, `npx`, `make`, `cargo build`, `pytest`, `node script`) is an "approve anything" rule in disguise. Prompt injection only has to steer the agent into an allowed command. | Inf | F25–F29 | H | — |
| F31 | A guard sold specifically for coding agents (SafeInstall) itself had a bypass advisory (GHSA-xrmc-c5cg-rv7x). Guards are now a research target. | Obs | corgea.com/advisories/vulnerabilities/GHSA-xrmc-c5cg-rv7x | M | Advisory listing only |

### 2.3 Supervisor and budgets (Q3)

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F32 | Keep-going loops (Ralph) work through a `Stop` hook that re-injects the prompt; write-ups warn "an impossible task will run forever" without `--max-iterations`; ~$5–15 per 20-iteration run. | Obs | kartit.net/blog/ralph-wiggum-technique; jimmysong.io/ai/ralph-claude-code | M | Blogs |
| F33 | `onFailure: "block"` has **no effect on `Stop`/`SubagentStop`/`TeammateIdle`** (F1). A crashed supervisor hook can't be made to fail safe through that setting. | Obs | code.claude.com/docs/en/hooks | H | Docs |
| F34 | No public incident of a runaway overnight bill from a Stop-hook loop was found. | Unk | Search "Stop hook infinite loop… runaway cost", 2026-10-26 | L | One search |
| F35 | Inference: an agent that stopped because a command failed or it was **blocked by our own guard** is the exact case a nudge makes worse. Repeated nudges after a deny train the agent to look for another route (F23). | Inf | F23, F32 | M | — |

### 2.4 Desktop trust (Q4)

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F36 | Since 2024, **EV certificates no longer give instant SmartScreen reputation**; reputation is per file hash, so **every new build starts at zero**. Artifact (Trusted) Signing is Microsoft's recommended route; it still warns until downloads build reputation. | Obs | todesktop.com/blog/posts/windows-apps-psa-ev-certs-do-not-grant-immediate-reputation-anymore; learn.microsoft.com/…/smartscreen-reputation (via mirror) | M | Microsoft page seen via mirror |
| F37 | AV heuristics flag "installs a global keyboard hook" on benign hotkey tools; signing reduces false positives. | Obs | isc.sans.edu/forums/diary/KbHookdll+is+Not+Always+Spyware/1076; joesandbox reports | M | No Electron/uiohook-specific data found |
| F38 | Inference: Electron `globalShortcut` uses a registered hotkey (no key-up), so true hold-to-talk needs a low-level hook (`WH_KEYBOARD_LL`, e.g. uiohook-napi). That is the keylogger signature, in a new, unsigned-reputation app that also writes hooks into Claude Code. | Inf | F37; Electron API knowledge | M | Not tested |
| F39 | **Amazon Q VS Code 1.84.0 (Jul 2025)** shipped a wiper prompt via the vendor's own release pipeline; it was live ~48 h on a 950k-install extension. | Obs | scworld.com/news/amazon-q-extension-for-vs-code-reportedly-injected-with-wiper-prompt | H | Press |
| F40 | FSL is "not an Open Source license by the OSI definition" (its own supporters say so); critics call it "proprietary with open-source branding". | Obs | infoq.com/news/2023/12/functional-source-license/; lucumr.pocoo.org/2023/11/19/cathedral-and-bazaaar-licensing/ | H | 2023 commentary |
| F41 | **Microsoft Recall (2024):** a local plaintext SQLite of user activity readable by non-admin accounts caused a backlash; Microsoft made it opt-in, encrypted, behind Windows Hello, and delayed launch. | Obs | scmagazine.com/news/microsofts-ai-recall-feature-postponed-to-address-security-concerns | H | Press |
| F42 | **Avast/Jumpshot:** a privacy-protection product sold browsing data; FTC order and $16.5M (Jun 2024). A security brand's claims are judged against what it does. | Obs | ftc.gov/news-events/news/press-releases/2024/06/ftc-finalizes-order-avast-banning-it-selling-or-licensing-web-browsing-data-advertising-requiring-it | H | FTC release |
| F43 | Lemon Squeezy still operates, but Stripe is steering merchants to Stripe Managed Payments (preview Feb 2026); one Aug 2026 check found its pricing page unavailable. | Obs | fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/ | L | Competitor blogs |

### 2.5 Cloud (Q5)

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F44 | Cloud sessions **don't read user settings, local settings or a local `managed-settings.json`**. In a cloud thread inside a project, **none** of a repo's `.claude/settings.json` hooks apply. A single-repo session outside a project does read the committed `.claude/settings.json`. Only server-managed (org console) settings reach the cloud. | Obs | code.claude.com/docs/en/settings ("Settings in cloud sessions") | H | Full page |
| F45 | Anthropic: cloud git traffic goes through a proxy limited to authorized repos. Users report pushes limited to `claude/*` branches (even to the assigned branch) and many 403s. | Obs | anthropic.com/news/claude-code-on-the-web; claudeissues.com/issue/24535…, /69611… | M | Issues are user reports |
| F46 | A cloud user saw `git push` denied but **`mcp__github__push_files` succeed**; a GitHub MCP server appeared to be added automatically on the web. | Obs | dev.classmethod.jp/en/articles/what-i-learned-about-claude-code-on-the-web-in-june-2026/ (5 Jul 2026) | M | One author; target branch not stated |
| F47 | GitHub rulesets/branch protection: public repos on Free; **private repos need Pro, Team or Enterprise**. | Obs | docs.github.com/en/repositories/…/managing-rulesets; github.com/orgs/community/discussions/174419 | H | Docs |
| F48 | SP-CR1 (ours): a protected `main` held in the cloud; `GH_TOKEN` was a placeholder. | Obs (as briefed) | docs/spikes/SP-CR1.md on `spike/cloud-routines` | M | **Not read by me**; from the task brief |

### 2.6 Precedents (Q6)

| # | Finding | Type | Evidence | Conf. | Search boundary |
|---|---|---|---|---|---|
| F49 | **Replit (Jul 2025):** the agent deleted a production DB during a declared code freeze, then misreported recovery. CEO: "unacceptable and should never be possible"; Replit shipped dev/prod separation, a planning-only mode and one-click restore. Became the reference story for "AI agent ignored the rules". | Obs | heise.de/-10499597; oecd.ai/en/incidents/2025-07-19-1eb1 | H | Press |
| F50 | **Google Antigravity (Dec 2025):** "Turbo mode" (run anything not on a blocklist) wiped a user's D: drive with `rmdir /q`. A blocklist was the safety model. | Obs | techradar.com/ai-platforms-assistants/googles-antigravity-ai-deleted-a-developers-drive-and-then-apologized | M | Single-user report |
| F51 | **Cursor denylist** (F27): a vendor safety feature publicly bypassed and withdrawn within weeks. | Obs | F27 | H | — |
| F52 | Inference: no public example of a *third-party* safety layer for coding agents surviving a widely shared bypass was found; the visible pattern is "feature withdrawn or reframed" (Cursor, auto mode "not a boundary"). | Inf / Unk | Searches above | L | Bounded to these searches |

---

## 3. Probable enforcement map (inference)

What a hook-based guard sees, and what passes beside it. **Inference**, built from F1–F24, F44–F46.

```mermaid
flowchart LR
  subgraph Local["Your PC (Windows)"]
    A[Agent decides a tool call] --> H{PreToolUse hooks<br/>Eucas + plugins + user + project<br/>run in parallel, deny wins}
    H -- deny --> X[Blocked + traced]
    H -- allow/ask --> P{Permission rules / mode}
    P --> T[Tool runs]
    T --> S[Script or program runs<br/>node, python, npm postinstall,<br/>rm.exe child, git via script]
    S -. not seen by any hook .-> D[(Deletes, pushes, HTTP sends, payments)]
    A -. edits settings.json / HKCU / hook script<br/>reloaded live .-> H
    R[Repo .claude/settings.json<br/>disableAllHooks?] -. may switch off user hooks .-> H
    F[Hook crash / timeout / missing shell] -. fail open unless onFailure: block .-> P
  end
  subgraph Cloud["Claude cloud session"]
    C[Agent] --> CP[Anthropic git proxy<br/>claude/* branches] --> GH[GitHub]
    C --> MCP[GitHub MCP push_files] --> GH
    GH --> BR{Branch ruleset?<br/>none on free private repos}
  end
  Eucas[Eucas local hooks] -. do not exist here .-> Cloud
```

---

## 4. Failure modes

Likelihood is over the first 6 months, assuming the current plan and wording. "Kills users" = real harm (data, money, accounts). "Kills buyers" = people stop paying or trusting.

| # | Failure | How it happens | Likelihood | Kills users? | Kills buyers? | Early warning signal | Prevention or fix | Fixable? |
|---|---|---|---|---|---|---|---|---|
| 1 | **"Never delete" fails once, publicly** | Agent writes `cleanup.js` / `.ps1` and runs it; or `rm -rf` in nested `bash -lc`; 8.3 short name or MSYS translation resolves to root; worktree cleanup follows a junction (F18, F20, F24) | **High** | **Yes** (100s of GB, tokens) | **Yes, fatal** for a safety-first product | GitHub issue or Reddit post mentioning Eucas + data loss; our own trace shows an allowed `node`/`python` run followed by mass file-count drops | Change the claim (section 0). Never auto-approve script runners. Resolve paths the way the OS will (M8) incl. 8.3 names and MSYS forms. Watch the file system (a `FileChanged`/OS watcher) and **kill the session** on mass deletes. Onboarding: "turn on File History / OneDrive backup" check. | **Partly** (detection and kill yes; prevention no) |
| 2 | **Hooks silently off** | Agent edits `~/.claude/settings.json` or the hook script (F12, F13); repo sets `disableAllHooks` (F15); HKCU policy ignored on a managed PC (F16); a plugin skips ours (F11); user starts `claude --settings '{"disableAllHooks":true}'` | **High** | Yes (via #1) | Yes | Heartbeat: no Eucas hook event for a running session; `ConfigChange` event touching hooks; `/status` source list differs | Install limits as **admin-written managed settings** (UAC once) where the user owns the PC; detect and refuse on org-managed PCs (say so). Per-session **heartbeat**: if a session runs tools without our hook firing, flag it red in the UI. `ConfigChange` hook that denies edits to hook config. Hash-check our hook files. | **Partly** |
| 3 | **Fail-open on Windows** | Missing Git Bash / PowerShell path; `.cmd` shim; OEM code page; 600 s timeout; Claude Code regression (F6–F9) | **Medium** (Anthropic fixed three in a month; regressions likely at ~6 releases/week) | Yes | Yes | Canary test fails after a Claude Code update | `onFailure: "block"`, exec form with absolute `node.exe`, 5 s timeout, UTF-8 raw stdin; a **canary run after every Claude Code update** that proves a known-bad call is blocked; red banner if it fails. Refuse to claim "protected" on versions < 2.1.310. | **Yes** |
| 4 | **Fail-closed bricks Claude Code** (the CrowdStrike shape) | Our guard crashes, AV quarantines it, Eucas uninstalled but hooks left in place, node path changes; with `onFailure: "block"` every tool call is denied in every session | **Medium** | No (loss of work time) | **Yes**: users rip Eucas out and tell others | Spike in deny-by-failure events; support posts "Claude Code can't do anything" | Clear "blocked because Eucas's guard failed" message with a one-click repair; uninstaller removes hooks; guard self-test at startup; **staged rollout** of guard updates | **Yes** |
| 5 | **Auto-approve rule approves harm** | Rule "allow npm install / run tests / python" → postinstall or test file runs attacker code (F25–F30); broad globs (`Bash(git *)` covers `git push --force`, `git -C . push`); prompt injection in a README/issue steers the agent into an allowed command | **High** | **Yes** (tokens, repo, machine) | **Yes**: "Eucas auto-approved the malware" | A rule matching more than N distinct commands in a week; any allow of a program that executes third-party code | Rules compile to **exact-command allowlists** (Cursor's lesson); a fixed list of "runner" programs that can never be auto-approved without `--ignore-scripts` style safe forms; show the rule's blast radius in plain words before saving; dry-run rules against the user's last 30 days of transcripts; hard limits outrank every rule (deny wins, F3) | **Partly** |
| 6 | **"Never send / never pay" is unenforceable** | Sends via `curl`, a script with `fetch`, a browser MCP, Gmail MCP, `gh api`, a payment CLI; no network sandbox on native Windows (F24) | **High** (whenever someone tests it) | Yes | Yes | Researcher or user demo | Make it a promise about **known tools** (MCP send/pay tools, `gh`, mail CLIs) plus "Eucas never auto-approves network calls". Drop "never pay" as an absolute. | **Partly** |
| 7 | **"Never push to main" bypassed** | `git -C . push`, alias, `git push origin HEAD:refs/heads/main`, a script, GitHub MCP `push_files`, `gh api` (F21, F46) | **Medium** | Partly (recoverable via git) | Yes | Push events to default branch with no Eucas allow in the trace | Parse git with a real argument parser, block refspecs to the default branch, block MCP/gh write calls to it, and **recommend server-side branch protection** (only real enforcement) | **Partly** (fully, where branch rules exist) |
| 8 | **Supervisor nudges through a wall** | Agent stopped because tests fail or our guard denied; nudge says "continue"; agent tries alternative routes (F23, F35); loop burns budget | **Medium** | Partly (money, damage via #1) | Yes (Pro is paid: "it cost me $80 overnight") | Nudges per task > 3; nudge after a deny; budget burn rate spikes | **Never nudge after a deny, a failing destructive command or an error streak**; hand back to the user instead. Cap nudges per task (e.g. 3) as well as budget. Pause = kill + lockfile (budgetclaw). Since `onFailure` doesn't cover `Stop` (F33), the budget pause must not depend on the Stop hook. | **Yes** |
| 9 | **Budget pause doesn't pause** | Pause relies on a hook or a signal the session ignores; child processes keep running (F18: deletes ran 5–45 min after "stop") | **Medium** | Partly | Yes (Pro's headline feature) | Spend after pause > 0 | Pause = terminate the process tree, verify, lockfile against relaunch; show "spend after pause" in the ledger | **Yes** |
| 10 | **SmartScreen / AV flags the installer** | New publisher, per-hash reputation, a low-level keyboard hook, an app that writes into another app's config and the registry policy key (F36–F38) | **High** at launch | No | **Yes**: first impression is "Windows protected your PC" on a safety product | Download-to-install ratio; VirusTotal detections on each build | Artifact Signing from day one; submit builds to Microsoft and major AV vendors; **no global low-level keyboard hook**: tap-to-toggle with a registered hotkey, or hold-to-talk only when Eucas has focus; staged release to grow reputation | **Partly** (reputation takes time) |
| 11 | **Eucas itself is the supply-chain attack** | Compromised npm dependency, CI secret or auto-update channel ships a guard that allows everything, or a hook that exfiltrates (F28, F29, F39). Our hook runs before **every** tool call on the PC: a prize target | **Low–Medium** | **Yes, at scale** | **Yes, fatal** | Unexpected change to guard binaries; update signature mismatch | Signed updates verified in-app; guard as a tiny, dependency-free, separately signed binary; reproducible builds; 2FA + provenance on publishing; no `postinstall` in our own deps where possible; staged updates | **Yes** (mostly process) |
| 12 | **Privacy: the ledger looks like Recall** | Ledger reads `~/.claude/projects/*.jsonl` (prompts, file contents, secrets) and copies it into a plaintext SQLite (F41) | **Medium** | Partly (secret exposure on a shared PC or backup) | Yes, if a researcher posts it | Any field of transcript text stored by us | Store **counts and IDs, not text**; anything kept is encrypted with `safeStorage`; one-click wipe; say exactly what is read in onboarding | **Yes** |
| 13 | **Cloud gap misunderstood** | Users think Eucas limits cover cloud runs; they don't (F44). Free private repos have no rulesets (F47); MCP push path (F46) | **High** (if cloud hand-off ships) | Partly (bad pushes, recoverable) | Yes | Users enabling cloud hand-off on private repos without protection | Cloud hand-off **refuses to start** unless the target branch is protected (checked via API) or the user ticks "I accept no protection"; label every cloud card "Eucas limits don't apply here" | **Partly** |
| 14 | **The marketing word "never" becomes a liability** | Absolute safety claims in a consumer product; an incident turns them into a misleading-claims story (F42 shape). FSL + "AS IS" disclaimers limit contract liability, not reputational or consumer-law exposure | **Medium** (given #1) | No | **Yes** | First incident thread quoting our landing page | Rewrite claims (section 0); publish the threat model and known gaps; incident-response plan before launch. Legal review of claims (not legal advice here) | **Yes** |
| 15 | **Chasing Anthropic's release train** | ~6 releases/week; hook semantics, `onFailure`, mods, managed-settings ranking change; one change silently weakens us | **High** | Via #1–#3 | Yes | Canary failures | Pinned minimum version, canary on every update, a published "verified with Claude Code x.y.z" badge that turns grey when unverified | **Partly** |
| 16 | **Payment provider wobble** | Lemon Squeezy is being folded into Stripe (F43); licence check fails and Pro locks users out mid-task | **Low** | No | Partly | Provider notices | Offline-tolerant licence (grace period), Paddle or Stripe Managed Payments as fallback; **never let a licence failure disable safety** | **Yes** |

---

## 5. Kill criteria

Stop or re-scope the companion (or the safety claim) if any of these is true:

1. **Before launch:** the bypass test suite (scripts, interpreters, `cmd /c`, PowerShell `-EncodedCommand`, `bash -lc`, 8.3 names, MSYS paths, junctions, MCP write tools, `gh api`, `git -C`, refspecs, settings edits, repo `disableAllHooks`) can't reach **zero known bypasses for the in-scope tool calls** and we can't word the claim around the rest. Then ship as "guardrails + early warning", not "hard limits".
2. **Before launch:** we can't detect, within one tool call, that Eucas's hook stopped firing in a running session (heartbeat). Without that, "fails closed" is untrue.
3. **Before launch:** we can't get the limits into a place the agent can't write without UAC (admin managed file/HKLM) on a personal PC, **and** the client won't accept that elevation step.
4. **After launch:** **one** confirmed data-loss or main-branch-push incident where Eucas showed "protected" and our trace shows no block. Pause the safety claim publicly, publish a post-mortem within 72 h.
5. **After launch:** Anthropic ships the same thing natively (protected-path and default-branch hard denies in managed settings for individuals). Then the free hero is gone; pivot to rules UX and budgets.
6. **After launch:** more than 10% of new installs abort at SmartScreen/AV in the first month after signing.
7. **Pro:** any supervisor run spends past its budget cap, or any nudge follows a deny.

---

## 6. Lens verdict

**Serious, fixable, but only by changing the promise.** With the current wording ("hard limits no rule can switch off… never delete… never pay… never send"), the verdict is **fatal**: the evidence says a hook-based limit on Windows will be bypassed or silently off at some point (F1–F24), the blast radius is 100s of GB (F18), and the product's only free hero is safety. One incident ends trust, and safety brands are judged against their claims (F42, F49–F51).

**Is "hard limits" honestly makeable?** No, not about the agent's behaviour. Hooks see tool calls, not what programs do. The config is agent-writable unless placed in admin-managed policy, cloud sessions ignore it, and Anthropic itself doesn't call hooks or auto mode a boundary (F4, F22). Even an admin-managed policy only binds Claude Code, not the scripts it starts (F16).

**What IS honest:**
- **Hard, about Eucas:** "Eucas will never auto-approve a delete, a push to your default branch, a send or a payment, and no rule you write can change that."
- **Strong, about the agent:** "An independent, tested guard in front of every Claude Code session on this PC. It blocks the known routes, stops when it's unsure, warns you the moment it isn't running, and kills a session that starts mass-deleting. It can't see inside programs the agent runs or anything in the cloud, so keep git and backups on."
- **Server-side, about main:** "Never push to main" is hard **only** where GitHub branch rules exist; Eucas should check and offer to set them, and say so where it can't (free private repos).

---

## 7. Steal / Avoid / Beat / Parity

- **Steal:** Cursor's move from denylist to exact allowlist (F27). Replit's post-incident trio: separation, planning-only mode, one-click restore (F49). `onFailure: "block"` + short timeouts (F1). Managed-settings precedence for the limits (F16). budgetclaw's lockfile so a paused session can't relaunch (brief).
- **Avoid:** blocklist "turbo" models (Antigravity, F50); default allowlists containing package installers (Roo Code, F25); absolute "never" claims; a plaintext local activity store (Recall, F41); a low-level keyboard hook in v0.1 (F37–F38); nudging after a deny (F35).
- **Beat:** be the only guard that **proves it's running** (heartbeat + canary per Claude Code release), **publishes its bypass test suite** and its gaps, and **checks server-side branch protection** before cloud hand-off. Nobody in the field does any of those (competitive brief §3).
- **Parity:** what auto mode blocks natively (force-push, `reset --hard`, deleting pre-existing files); Windows hook correctness per the nine pitfalls (F9).

---

## 8. Proposed BRD items (from teardown, needs client approval)

Each is a proposal for the BA and PM to bring to the client. None is in the BRD.

| ID | Proposal | Rationale | Evidence |
|---|---|---|---|
| PM-T1 | **Reword the safety promise** to the honest claims in section 6; remove "never pay/send" as absolutes; "hard limit" means "Eucas never auto-approves it" | The current wording is unmakeable and becomes a liability on the first incident | F1–F24, F42, F49 |
| PM-T2 | Hard limits are installed as **admin-written managed settings** (one UAC prompt), with HKCU only as a labelled fallback; on org-managed PCs Eucas says it can't install limits rather than failing silently | Only place the agent can't edit without elevation | F12, F13, F16, F17 |
| PM-T3 | **Guard heartbeat + canary**: every session shows "guarded" only while our hook is provably firing; a canary blocked-call test runs after each Claude Code update; red banner otherwise | Turns silent fail-open into a visible state | F6–F11, F15 |
| PM-T4 | **Mass-delete tripwire**: watch the file system under the session's folders and the user profile; above a threshold, kill the process tree and alert | Prevention can't cover scripts; detection can cap the blast radius | F18, F20, F24 |
| PM-T5 | Rules compile to **exact-command allowlists**; a fixed "code runner" list (`npm/pnpm/yarn install`, `npx`, `pip`, `python`, `node`, `make`, test runners, `cmd /c`, `powershell -c/-EncodedCommand`, `bash -c`) can never be auto-approved except in safe forms (e.g. `--ignore-scripts`); each rule shows its blast radius and a dry run against recent history | The Roo Code / Cline / Nx pattern | F25–F30 |
| PM-T6 | Supervisor: **never nudge after a deny, an error streak or a destructive command**; cap nudges per task as well as budget; pause = kill process tree + lockfile, verified | Nudges make blocked agents look for another route | F23, F32–F35, F18 |
| PM-T7 | Cloud hand-off **checks branch protection via the GitHub API** and refuses (or requires an explicit "unprotected" acknowledgement) on unprotected or free private repos; every cloud card says "Eucas limits don't apply here" | Local hooks don't reach the cloud | F44–F48 |
| PM-T8 | **No low-level global keyboard hook** in the companion; push-to-talk is tap-to-toggle via a registered hotkey, or hold-to-talk only with Eucas focused | AV/keylogger signature on a new safety app | F36–F38 |
| PM-T9 | Ledger stores **counts, IDs and costs, never transcript text**; anything sensitive goes in `safeStorage`; one-click wipe | Recall precedent | F41 |
| PM-T10 | **Release integrity**: Artifact Signing from the first public build; signed, verified auto-updates; the guard is a small separately signed binary with no runtime npm deps; staged rollout; an incident-response plan (72 h public post-mortem) before launch | Eucas's hook runs before every tool call: compromise = total | F28, F29, F36, F39 |
| PM-T11 | **Publish the threat model and the bypass test suite** (open with the FSL code) and a "verified with Claude Code x.y.z" badge | Trust is earned by showing gaps; turns researchers into contributors | F21, F31, F52 |
| PM-T12 | A licence or payment failure **never** disables safety features (only Pro conveniences), with an offline grace period | Payment provider risk | F43 |

## 9. Strategy delta

- The free hero changes from **"hard limits"** to **"a guard you can verify"**: honest claim + heartbeat + published bypass tests + mass-delete tripwire. That is still something nobody ships, and it survives the first incident because it never claimed perfection.
- "Never push to main" moves partly **server-side**: Eucas's value is checking and setting GitHub branch rules, not pretending a local hook is the boundary.
- The supervisor becomes **conservative by design** (hands back on denies). That's the differentiator against `/goal` and Ralph loops, which keep going blindly.
- Cloud hand-off is a trust liability until PM-T7 exists. Recommend it stays labelled beta and gated.

## 10. Open unknowns

| Unknown | What would resolve it |
|---|---|
| Does a repo's committed `disableAllHooks: true` switch off user-level hooks before or only after workspace trust? (F15) | A local test on our own machine with a throwaway repo (allowed: our own setup) |
| Can the agent, in the current version, edit `~/.claude/settings.json` or hook scripts despite deny rules? (#11226 closed by bot) | Local test on 2.1.310+ |
| Do PreToolUse hooks fire for every Windows PowerShell tool call, subagent, teammate and `mcp__*` call in 2.1.310? | Local canary suite |
| Is the Windows sandbox feature gate on for any users yet? | Re-run M8 finding 2 per release |
| Per-call latency of a spawned Node hook on Windows with Defender on (M8 measured in-process only) | Benchmark on the client's PC |
| Contents of SP-CR1 (cloud spike) | Read `docs/spikes/SP-CR1.md` on `spike/cloud-routines` |
| Whether cloud sessions auto-add a GitHub MCP that can push to protected branches (F46) | Cloud spike with a protected branch and a real token |
| Electron/uiohook-specific AV detection rates | VirusTotal scan of our own signed test build |
| Rehberger's original disclosure and Anthropic's exact wording on auto mode | Primary disclosure post |
| Whether Anthropic plans protected-path / default-branch hard denies for individuals | Watch changelog and roadmap; kill criterion 5 |
