# UX research: the Eucas companion

| Date | Author | Status | Decision this informs |
|---|---|---|---|
| 2026-10-26 | Lead UX researcher (Claude), `ux-designer` role standards | Draft for the lead UI designer and the client; no gate yet | How the companion looks and behaves at a glance, how it earns trust, and how its first run gets you to value in under 5 minutes |

**Deliverables in this folder:** this file (findings, patterns, trust principles, handoff) · [onboarding-flow.md](onboarding-flow.md) (the first run, screen by screen) · [ia-and-flows.md](ia-and-flows.md) (surfaces, map, core flows, Pro moments) · [references/](references/README.md) (Refero and Mobbin links, two style captures).

**Inputs.** The companion brief from the parent session (25–26 Oct); the [BRAND](../../ui/brand/BRAND.md), [DESIGN-SYSTEM](../../ui/system/DESIGN-SYSTEM.md) and [tokens](../../ui/system/tokens.css); the skills `ui-ux-guide` and `premium-craft`. The four research files below were written on 25–26 Oct in another session's worktree and **are not merged into `dev` yet**; the links here point to where they will live (`docs/research/…`). Until they merge, they are at `.claude/worktrees/orb-gooey-voice-effects-0f58ba/docs/research/`.
- [competitive-brief-companion-2026-10-25.md](../../../research/competitive-brief-companion-2026-10-25.md) (about 30 competitors) — cited as **CB**
- [strategy-2026-10-26-premortem.md](../../../research/strategy-2026-10-26-premortem.md) — **PM**
- [teardowns/eucas-premortem-execution.md](../../../research/teardowns/eucas-premortem-execution.md) — **EX** (finding numbers F1…)
- [teardowns/eucas-premortem-trust.md](../../../research/teardowns/eucas-premortem-trust.md) — **TR** (finding numbers F1…)

**Method.** Evidence first. Sources: vendor docs and help centres, Microsoft Learn, NN/g, GitHub READMEs and issues, the Refero MCP (screens, flows, styles) and the Mobbin MCP (screens). Every new source below was **seen 2026-10-26**. Each finding is marked **O** (observed on the source) or **I** (our inference). Quotes are under 15 words. Nothing was installed, logged into or decompiled.
- The `refero-design` skill is **not installed** here; the Refero MCP worked without it. Nothing was installed.
- **Coverage gap:** Refero and Mobbin cover web and iOS only. Neither has desktop agent managers (Conductor, episko, Superset, agent view) or any Windows tray UI. Those findings come from vendor docs, so they describe behaviour and copy, not pixels. Recommendation: the UI designer captures 3–4 real screenshots of agent view, the Claude desktop Code tab, Warp's agent notifications and a Windows 11 tray flyout (Volume, Wi-Fi, PowerToys) on the founder's machine before hi-fi.

---

## 1. Research questions

| # | Question | Answered in |
|---|---|---|
| RQ1 | What do premium agent managers, tray utilities, usage meters, guards and inboxes do that makes them feel good? | §2 |
| RQ2 | How do they show "something needs you", status at a glance, calm vs alert? | §2.2, §2.3 |
| RQ3 | What makes people trust a tool that watches or guards their work? | §3, §4 |
| RQ4 | How do comparable tools onboard, and what gets a dev tool to value in under 5 minutes? | §5, [onboarding-flow.md](onboarding-flow.md) |
| RQ5 | What is specific to Windows (tray, toasts, UAC, SmartScreen, materials)? | §2.3, §3.4 |

---

## 2. What makes these tools feel good

### 2.1 The reference set

| Product | Category | What it's best at (O) | Source |
|---|---|---|---|
| **Claude Code agent view** | Agent manager (official) | Six session states: Working (animated), Needs input (yellow), Idle (dimmed), Completed (green), Failed (red), Stopped (grey); groups Pinned · Ready for review · Needs input · Working · Completed; the row shows the agent's actual question; the terminal tab title reads like "2 awaiting input"; a notification on needs-input, finish or fail | [code.claude.com/docs/en/agent-view](https://code.claude.com/docs/en/agent-view) |
| **Claude desktop app, Code tab** | Agent manager (official) | Sidebar of parallel sessions with group and sort; an OS notification when a session you aren't viewing finishes; permission cards with Allow once · Always allow · Deny | [code.claude.com/docs/en/desktop](https://code.claude.com/docs/en/desktop) |
| **Warp agent notifications** | Terminal with agents | Agent states Blocked (yellow, needs you) · working · failed · succeeded · canceled; notification kinds Complete · Request · Error; in-app toasts, **at most 2 visible**; a bell "mailbox" with Unread and Errors filters; tab badges; OS notification only when backgrounded | [docs.warp.dev/agents/capabilities/agent-notifications](https://docs.warp.dev/agents/capabilities/agent-notifications/) |
| **Superset** | Agent manager | An orange sidebar dot on workspaces that need attention; state read from terminal output and git, plus a `superset-notify` command | [mintlify.com/superset-sh/superset/concepts/agents](https://www.mintlify.com/superset-sh/superset/concepts/agents) (mirror of their docs) |
| **episko** | Agent manager, the closest competitor (Windows, free, MIT) | Live state per session (thinking, editing, waiting on permission, done, failed); sessions that need you rise to the top; Allow · Deny · "In terminal"; 5-hour and weekly forecast; no cloud; SmartScreen guidance "More info → Run anyway" in the README | [github.com/respeak-io/episko](https://github.com/respeak-io/episko) |
| **Conductor** | Agent manager (Mac) | One workspace, branch and diff per task; Mac-first ("Get Conductor running on your Mac"); status UI not documented | [conductor.build/docs](https://www.conductor.build/docs/) |
| **Little Snitch 5** | Guard (network) | Starts in **Silent Mode–Allow** for new users and suggests Alert Mode "after a week or two"; every alert offers a rule lifetime (Once creates no rule) and scope; a Network Monitor logs everything for later; a "Research Assistant" explains why a connection happens | [help.obdev.at/littlesnitch5/intro-opmodes](https://help.obdev.at/littlesnitch5/intro-opmodes), [alert-overview](https://help.obdev.at/littlesnitch5/alert-overview), [ra-overview](https://help.obdev.at/littlesnitch5/ra-overview) |
| **1Password Watchtower** | Guard (credentials) | Says plainly that checks run on the device; only a 5-character hash prefix ever leaves it | [support.1password.com/watchtower-privacy](https://support.1password.com/watchtower-privacy/) |
| **ccusage** | Usage meter | Zero setup (`npx ccusage@latest`); value from history already on disk: daily, weekly, monthly, session and 5-hour `blocks` views | [github.com/ryoppippi/ccusage](https://github.com/ryoppippi/ccusage) |
| **Claude settings › Usage** | Usage meter (official) | "Current session" and "Weekly limits" bars, each with "Resets Tue 5:00 AM" and "% used", plus "Last updated: just now" with refresh | [Mobbin](https://mobbin.com/screens/ea02c392-d84c-4ce0-81bb-66d7bda183b3) |
| **Luma AI credits** | Usage meter | Turns a percentage into work left ("around 597 images or 14 videos") | [Mobbin](https://mobbin.com/screens/933c13eb-cc70-4012-b1e2-17d426415ed4) |
| **Linear** (changelog style) | Calm dark chrome | Depth from tone steps and 1 px borders, almost no shadows; headings at medium weight; one mono for dates and code | [references/style-linear-changelog.md](references/style-linear-changelog.md) |
| **Warp** (site style) | Calm dark chrome | Near-monochrome; **one** accent with one job; the product UI is the hero; slow, weighty state transitions (0.4 s) | [references/style-warp.md](references/style-warp.md) |
| **Raycast (Windows)** | Keyboard-first utility | Onboarding introduces the core features and lets you pick the global hotkey (Alt+Space suggested) | [manual.raycast.com/windows/settings](https://manual.raycast.com/windows/settings) (search-result snippets; steps and permissions not documented there) |
| **PowerToys** | Windows utility suite | After install, an overview window introduces each utility; update toasts are optional | [learn.microsoft.com/windows/powertoys/install](https://learn.microsoft.com/en-us/windows/powertoys/install) |
| **Tailscale (Windows)** | Tray utility | Tells you the icon may be in the overflow ("select the up arrow"); right-click for status and Log in | [tailscale.com/kb/1022/install-windows](https://tailscale.com/kb/1022/install-windows) |
| **Bartender / CleanShot X** | Menu-bar utilities (Mac) | Ask only for the permissions they need, at first use, and say what they don't do with them (Bartender: "does not record the screen"); CleanShot has essentially no setup | [macbartender.com/Bartender5/PermissionInfo](https://www.macbartender.com/Bartender5/PermissionInfo/), [techradar review](https://www.techradar.com/reviews/cleanshot-x-for-mac-review) |
| **AI-agent dashboards** (Relevance AI, Gumloop, Cofounder, Deel) | Inbox / approvals | Tabs with counts ("To review 4"), amber "Pending approval" pills with a glyph; Cofounder's small floating Inbox card with its "Desktop alerts" toggle; Deel's "Approve all your pending (71)" | [references](references/README.md) |

Not covered with evidence (Unknown): the Cursor agents window and the Codex app's status and approval UI (docs had no detail; [learn.chatgpt.com/docs/app](https://learn.chatgpt.com/docs/app) confirms Codex runs on Windows); Arc; EarTrumpet, Flow Launcher, Everything and ShareX tray states.

### 2.2 Findings: density, calm vs alert, "needs you", progressive disclosure

1. **O:** The official vocabulary is already set: agent view uses Working · Needs input · Idle · Completed · Failed · Stopped, colour-coded yellow for needs input, and puts the agent's actual question in the row (agent view docs). Warp and Superset use the same yellow/orange-for-you convention (Warp docs, Superset docs). **I:** Eucas should reuse these words (with its own voice: "Needs you") so users don't learn a second vocabulary for the same sessions. Inventing new state names would fail Jakob's law in the exact place users already have a model.
2. **O:** Warp caps visible toasts at 2 and keeps the rest in a mailbox with Unread and Errors filters (Warp docs). Microsoft: notifications "are an interruption; ensure that they are worth it," and every notification should be ignorable ([notification area guidance](https://learn.microsoft.com/en-us/windows/win32/shell/notification-area)). NN/g: batch more than 5 into one, and passive notifications "can easily be missed" so they must not carry must-know information ([push notifications](https://www.nngroup.com/articles/push-notification/), [notification types](https://www.nngroup.com/articles/indicators-validations-notifications/)). **I:** a strict toast budget plus a persistent count (tray badge) is the calm-but-reliable pair: toasts for "now", the count for "don't forget". Policy in [ia-and-flows §1.2](ia-and-flows.md).
3. **O:** Little Snitch starts silent, watches, then suggests stricter alerting after a week or two (Little Snitch op modes). **I:** that is the Eucas arc exactly: the retro is "what a week of watching would have shown", and rules are suggested from history instead of asked for up front.
4. **O:** The best usage meters state the reset as a time and the data freshness ("Resets Tue 5:00 AM", "Last updated: just now"; Claude settings), and translate percent into work left (Luma). The weaker ones colour the bar red and pin an upgrade pill to it (Rox, [Refero](https://refero.design/pages/332bb354-d2fc-459d-b563-5388e5a65222)). **I:** Eucas's forecast gives one time ("around 15:10"), its basis on hover, and work left; money and limits are never alarm-red (BRAND tone "Factual, never alarming").
5. **O:** NN/g: progressive disclosure works with the core options first and at most 2 levels ([progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)). **I:** three depths are enough for Eucas: tray icon (one glance), popover (one click), main window (one more). Nothing important should be 3 levels down; the Protection log entry for a block is reachable in 2 clicks from its toast.
6. **O:** Linear and Warp reach "premium" on dark with almost no colour: tone-stepped surfaces, hairlines, two weights, one accent with one job (style captures). **I:** this confirms the existing system's direction (one Cobalt per screen, amber only for needs-you) rather than asking for anything new; the risk is adding colour for states, which the rule "never colour alone" already guards.

### 2.3 Findings: tray and menu-bar patterns on Windows

1. **O:** Windows 11 puts **new tray icons in the overflow by default**; only the user can promote one (Settings › Personalization › Taskbar › Other system tray icons, or drag since 22621.1344). Microsoft says to ask before adding a non-transient icon and to offer a way to remove it ([notification area](https://learn.microsoft.com/en-us/windows/win32/shell/notification-area); [elevenforum](https://www.elevenforum.com/t/hide-or-show-icons-in-taskbar-corner-overflow-menu-in-windows-11.415/), secondary). Tailscale's install doc tells users to look under the up-arrow. **I:** an "is it on?" signal hidden in the overflow is invisible. First run must **offer** to keep the icon visible, show exactly how, and never assume it's visible. Designed in [onboarding screen 6](onboarding-flow.md).
2. **O:** Microsoft: the notification area "is not for critical information that must be acted on immediately"; left-click shows status, right-click shows a shortcut menu; provide a tooltip; open popups next to the click (`CalculatePopupWindowPosition`). Toast title max 48 characters, body max 200 (same source). **I:** critical states (guard off, tripwire stop) need a toast and the popover, not just an icon change. The tray icon is the passive layer; toasts and the popover are the active ones. Copy drafts in [ia-and-flows](ia-and-flows.md) are sized to 48/200.
3. **O:** Toast guidance: notifications "should not be noisy"; an app can send a toast straight to Notification Center without a banner, detect Focus sessions, open the app in the toast's context, and clear stale notifications ([app notifications UX](https://learn.microsoft.com/en-us/windows/apps/develop/notifications/app-notifications/app-notifications-ux-guidance)). **I:** low-priority events (same-file in different worktrees, "done and waiting" for short runs) go silently to Notification Center; resolved needs-you items clear their toast.
4. **O:** Fluent materials: **Mica** for long-lived base surfaces; **Acrylic** only for transient, light-dismiss surfaces such as flyouts ([materials](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/materials)). **I:** the tray popover is a flyout, so it behaves like one (light-dismiss on click-away or Esc, anchored to the tray). Whether it *looks* Acrylic is a UI call: our BRAND rejected glass as a signature, so a solid raised surface that only *behaves* like a flyout is the safer reading. Flagged for the UI designer, not decided here.
5. **O:** The macOS menu-bar references (Bartender, CleanShot X) ask for permissions at first use with a plain reason. **I:** the Windows equivalent of a permission ask is the UAC prompt and the notifications switch; both are explained a sentence before they appear (onboarding screens 4 and 6).

---

## 3. What makes people trust a tool that watches or guards their work

### 3.1 Evidence from incidents and vendor responses

| Incident / statement | What happened (O) | What it teaches (I) | Source |
|---|---|---|---|
| Replit, Jul 2025 | Agent deleted a production database during a code freeze; the CEO called it "unacceptable and should never be possible"; Replit shipped dev/prod separation, one-click restore and a planning-only mode, apologised and refunded | After an incident, users want **separation, restore and a way to see the plan before it runs**, not reassurance | [tomshardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-coding-platform-goes-rogue-during-code-freeze-and-deletes-entire-company-database-replit-ceo-apologizes-after-ai-engine-says-it-made-a-catastrophic-error-in-judgment-and-destroyed-all-production-data); TR F49 |
| Google Antigravity, Dec 2025 | "Turbo mode" (run anything not blocklisted) deleted a user's D: drive with `rmdir /q`, past the Recycle Bin; recovery failed (single-user report) | A blocklist is not a safety model; the damage is irreversible on Windows when it skips the Recycle Bin | [techradar](https://www.techradar.com/ai-platforms-assistants/googles-antigravity-ai-deleted-a-developers-drive-and-then-apologized); TR F50 |
| Cursor denylist, 2025 | Bypassed with Base64, subshells and scripts; deprecated in 1.3 for an allowlist; CVE-2025-54131 (allowlist bypass via backticks / `$()`) | Pattern matching "catches common forms"; it doesn't "prevent". Exact allowlists beat denylists | [backslash.security](https://www.backslash.security/blog/cursor-ai-security-flaw-autorun-denylist); TR F27 |
| Claude Code on Windows, Sep–Oct 2026 | Four users lost 116–600 GB via path aliasing; in two cases deletes kept running 5–45 min after "stopped" | "Stopped" must be verified, not announced | TR F18 |
| Anthropic's own wording | Auto mode "does not guarantee safety"; for a hard guarantee use a deny rule; hooks fail open by default unless `onFailure: "block"`; exit 1 is not a block | Even the platform owner doesn't call its gates a boundary. Eucas can't claim more than the platform gives it | [permission-modes](https://code.claude.com/docs/en/permission-modes), [hooks](https://code.claude.com/docs/en/hooks), [security](https://code.claude.com/docs/en/security) ("no system is completely immune") |
| Tailscale #14126 | A user reports a silent failure: no tray error when the control plane was unreachable | The worst trust failure of a background tool is **looking fine while not working** | [github.com/tailscale/tailscale/issues/14126](https://github.com/tailscale/tailscale/issues/14126) |
| Microsoft Recall, 2024 | A local plaintext activity store caused a backlash; it became opt-in, encrypted, behind Windows Hello | Reading user activity locally is still judged by what's kept and who can read it | TR F41 |
| Defender real-time protection | Can be turned off temporarily and comes back on by itself; while off, files aren't scanned | A safe "off" is temporary, says what's not covered, and returns on its own | [support.microsoft.com](https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app) |

### 3.2 Trust principles for Eucas

Each principle is something the UI must make visible, not a policy hidden in docs.

1. **Prove it's on; never just say it.** The heartbeat is evidence ("checked 2 s ago" = a real tool call was checked 2 s ago), not a timer. Idle sessions say "idle", not a fake tick. A session that runs tools without our hook firing turns **Not guarded** within one tool call. (Tailscale #14126; TR PM-T3.)
2. **Show the proof once, early.** The canary (a harmless push to `main` in a throwaway repo, blocked live) in first run, and again silently after every Claude Code update, with "Verified for Claude Code x.y.z". (TR PM-T3, PM-T11.)
3. **Promise only what Eucas controls.** The one "never" is about Eucas's own behaviour (§4.2). About the agent, the language is "blocks the known ways", "catches common forms", and an always-present "What Eucas can't see" list. (TR §6; Cursor; Anthropic's own wording.)
4. **Every block is a receipt.** Each block, warning, tripwire and guard change is a log row: time, session, what (mono), why in plain words, which rule or limit decided. Filterable and exportable. (Stripe security history pattern; Little Snitch Network Monitor.)
5. **No override button on a limit.** If a limit could be clicked through, "no rule can change that" would be false. The log offers **Copy command** so you can run it yourself, outside the agent. The deny message to the agent tells it to hand back to you, so it stops looking for another route (TR F35).
6. **"Stopped" is verified.** The tripwire stops the process tree, checks it's no longer running, and keeps counting if deletes continue; it never shows "stopped" while the count moves (TR F18).
7. **Local, and said so plainly.** One sentence at the moment of reading: counts, not text; nothing leaves this PC; a "What Eucas reads" list with exact paths and what is never read (`.credentials.json`, tokens, prompt text stored). (1Password Watchtower; Recall; ADR-0002; TR PM-T9.)
8. **Name the weaker states, permanently.** "Not verified for 2.1.297", "user level, weaker", "Blocked by your organisation" stay visible on the status card until fixed; they never collapse into green. (EX PT-5.)
9. **Recovery beats reassurance.** After a stop: what was deleted, how to get it back (File History, OneDrive, git), whichever is on. (Replit's restore; recovery paradox in premium-craft.)
10. **Reversible setup.** Every file Eucas touches is listed with a link at install, and **Remove Eucas** restores them exactly, ending "Claude Code is exactly as it was on 26 Oct". (EX PT-6.)
11. **A safe "off" is temporary.** The only off switch offered in a crisis (our guard failing closed and blocking everything) lasts 15 minutes and comes back by itself, like Defender's real-time protection.
12. **Never meter safety.** The guard, heartbeat, tripwire, same-file warning and needs-you inbox cover every session on the free plan (EX PT-7). See decision D-1.

### 3.3 First-impression trust signals

| Signal | Where | Rule |
|---|---|---|
| Signed installer and signed UAC prompt | Download, onboarding screen 4 | UAC is grey for a verified publisher, **yellow for unsigned** ([UAC how it works](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/how-it-works)). A yellow prompt on a safety tool is a bad first impression, so signing matters for the UAC moment, not only SmartScreen. **v0.1 ships unsigned** (CR-010, founder 2026-10-26): the prompt is yellow, "Unknown publisher", so the sentence before it says so and tells you to check that it names `eucas-elevate.exe` from Eucas's folder |
| SmartScreen expectation set before it happens | Download page | Say it will appear, show the real dialog and "More info → Run anyway", and say how to check the published SHA-256 (CR-010, founder 2026-10-26; was "check the signature"; episko does the SmartScreen part in its README) |
| No account, no login | Whole first run | Eucas inherits Claude Code; never reads credentials (ADR-0002) |
| Open source, threat model and bypass test suite published | Website, About | FSL is source-available, not OSI open source; say "source available" and link the code (TR F40) |
| The first screen shows your data, not a pitch | Onboarding screens 1–3 | The retro |
| Exact files touched, with links | Onboarding screen 4, Settings | Checklist rows with Look inside |
| An honest gap list | Onboarding screen 4, Rules › Limits, Protection | Always present, collapsed |

### 3.4 Windows trust facts that shape the plan

- **O:** SmartScreen marks files without reputation as higher risk ([SmartScreen](https://learn.microsoft.com/en-us/windows/security/operating-system-security/virus-and-threat-protection/microsoft-defender-smartscreen/)). EV certificates have not bypassed SmartScreen since 2024. **Azure Artifact Signing** is about $9.99/month, and **individuals are eligible only in the USA and Canada**; "initial warnings expected" while reputation builds. **SignPath Foundation** offers free signing for qualifying open-source projects ([code-signing options](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)).
- **I:** If the founder isn't in the US or Canada, Artifact Signing as an individual is out (it resolves open unknown U4 in EX for that case). Realistic routes: SignPath (once the repo is public and qualifies; FSL may or may not qualify, to check), an organisation account, or an OV certificate. Either way, **early users will see SmartScreen**, so its moment is designed (onboarding screen 0). Decision D-3, **resolved (CR-010, founder 2026-10-26): v0.1 is unsigned.** Installer SHA-256s are published on the site; updates are signed with the updater's key, so tampered updates are rejected; the elevate helper is checked against a pinned SHA-256 built into the app. Authenticode comes once revenue covers it.

---

## 4. Honest safety wording

### 4.1 Words to use and avoid

| Use | Avoid | Why |
|---|---|---|
| "Eucas never auto-approves…" | "Eucas never lets the agent…" | Only the first is fully in our control (TR §6) |
| "blocks the known ways to…", "catches common forms of…" | "prevents", "stops all", "guarantees", "100 %" | Pattern checks are bypassable (Cursor, TR F21) |
| "Guard on · checked 2 s ago" | "Protected" as a permanent badge | Evidence with a timestamp, not a claim |
| "Not guarded", "Not verified for 2.1.297" | Hiding the state or showing grey | Weaker states must be named |
| "Eucas stopped bench" (after verifying) | "Stopping…" left on screen while deletes continue | Verified stop only |
| "Blocked by Eucas" | "Denied", "Error" | Says who and that it was deliberate |
| "If you meant it, run it yourself in a terminal." | "Allow anyway" | No rule, and no button, can change a limit |

### 4.2 The fixed strings (store once, reuse everywhere)

- **The promise:** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."
- **The guard:** "Eucas checks every tool call in your Claude Code sessions on this PC, stops when it's unsure, tells you the moment it isn't running, and stops a session that starts mass-deleting."
- **The gap:** "Eucas sees tool calls, not what a program does once it runs, and nothing in the cloud. Keep git and backups on."
- **The privacy line:** "Eucas keeps counts, never the text of your prompts or files, and nothing leaves this PC."

"Push to your default branch" is used instead of "push to main" in the interface, because repos differ; "main" is fine in marketing headlines.

---

## 5. Onboarding: evidence and activation

| Source | Observation (O) | Inference for Eucas (I) |
|---|---|---|
| Claude Code quickstart | 7 steps; login on first `claude`; a workspace trust dialog in untrusted folders ([quickstart](https://code.claude.com/docs/en/quickstart), [security](https://code.claude.com/docs/en/security)) | Users have just been through a trust prompt; ours should feel like the same family: one clear question, one reason |
| Claude Code status line | `/statusline` writes a script and updates settings; `rate_limits.five_hour` / `seven_day` with `used_percentage` and `resets_at` appear only for Pro and Max and only after the first API response ([statusline](https://code.claude.com/docs/en/statusline)) | The forecast has a designed "no data yet" state; API-key users get tokens and cost, not plan % |
| ccusage | Zero setup, history on disk | The retro bar: value from existing logs with no configuration |
| episko | First run: add a project folder, "+ Session", accept Claude's trust prompt; SmartScreen advice in README | Its value starts only when you launch through it; ours starts from history, before any session |
| Little Snitch | Silent first, alert later | Watch, then suggest |
| PowerToys | An overview window after install | Avoid the tour; show the user's own data instead |
| 1Password | Emergency Kit saved at account creation | A one-time, explicit "keep this" moment is accepted when it protects you. Eucas's analogue is the canary result, which stays in Protection as the first entry |
| NN/g onboarding | "tutorials didn't improve task performance"; long promotional onboarding gets skipped ([mobile onboarding](https://www.nngroup.com/articles/mobile-app-onboarding/)) | No tour, no feature carousel |
| NN/g empty states | Show system status (don't show "no records" while loading), contextual help, a direct next step ([empty states](https://www.nngroup.com/articles/empty-state-interface-design/)) | Every empty state in [ia-and-flows §5](ia-and-flows.md) has one |
| NN/g push | Ask for notification permission after the user has seen value ([push](https://www.nngroup.com/articles/push-notification/)) | The notifications step comes last (screen 6), after the retro and the proof |
| Reforge (secondary) | Setup moment → aha moment → habit moment; teams stop at setup ([innertrends](https://innertrends.com/data-analyses/identify-the-habit-moment-the-key-to-long-term-retention)) | Aha = the retro, placed **before** setup (the hooks install); habit = glancing at the tray heartbeat |
| Refero: Factory, Airtable | 19 and 28 screens before value; Airtable asks for payment inside onboarding | Our 5 screens, no account, no payment |
| Activation benchmarks | Dev-tool first-session activation 15–45 % (weak, vendor blogs; EX F8); the "under 5 min = 65 %" claim is untraceable (EX F9) | Don't cite a number to the client; measure our own (onboarding §4) |

**Empty states to avoid (from the evidence):** an empty ledger before any session; a blank rules editor; an inbox that says "No items"; a dashboard of zero-value charts (Chargetrip on [Refero](https://refero.design/pages/4abd4a1b-821a-43a8-a8d6-114251f8cbde)); a "Welcome to your dashboard" tour. Each is replaced in the flows by the retro, suggestions or templates, "You're all caught up. 3 sessions are guarded.", and the canary.

---

## 6. Patterns: steal, avoid, beat

| | Pattern | From | Where in Eucas |
|---|---|---|---|
| **Steal** | Agent view's state words and yellow-for-you; the agent's question in the row | Claude Code agent view | Session rows, needs-you card |
| **Steal** | Toast budget (≤ 2 visible) + a mailbox with filters | Warp | Toast policy; Today |
| **Steal** | Watch silently first, then suggest rules from history | Little Snitch | Retro → suggested rules |
| **Steal** | Rule lifetime and scope at the moment of the decision ("Once" makes no rule) | Little Snitch | Needs-you card: Allow once vs add a rule |
| **Steal** | "Checked locally" stated where the reading happens | 1Password Watchtower | Onboarding screen 1, "What Eucas reads" |
| **Steal** | Reset time + freshness on every meter; work left, not just % | Claude Usage, Luma | Usage meters and forecast |
| **Steal** | Zero-setup value from history | ccusage | The retro |
| **Steal** | Undo toast after every triage action | Jace AI ([Refero](https://refero.design/pages/141b9b34-309d-463f-a2ff-b400ef320699)) | Needs-you, rules |
| **Steal** | Filterable, exportable security log with expandable rows | Stripe security history | Protection log |
| **Steal** | A small floating inbox card with its alerts toggle on it | Cofounder (Mobbin) | Tray popover's needs-you section |
| **Avoid** | Bulk "Approve all your pending (71)" | Deel (Mobbin) | Never: approvals are one at a time; limits are never asked |
| **Avoid** | Red bars and an upgrade pill glued to usage | Rox (Refero) | Usage stays factual; Pro never on a limit |
| **Avoid** | 19–28-step onboarding, payment inside it | Factory, Airtable | 5 screens, no account |
| **Avoid** | Coach-mark tours | Mapbox, PowerToys overview | The retro instead |
| **Avoid** | Silent failure with a calm icon | Tailscale #14126 | Heartbeat + Not guarded within one call |
| **Avoid** | A blocklist "turbo" mode | Antigravity | Exact allowlists; runners never pre-ticked |
| **Avoid** | Launcher-only coverage (only sessions it started) | episko | Hooks at user scope cover every local session |
| **Beat** | The first 60 seconds: your own week, with rules written for you | nobody in CB | Onboarding screens 2–3 |
| **Beat** | A guard that proves it's running (heartbeat + canary per Claude Code release) | nobody in CB | Protection |
| **Beat** | Weaker states named, never green | nobody in CB | Status card, tray |
| **Beat** | Same-file warning explained in one plain sentence, before the merge | Clash only asks, no Windows story (CB) | Same-file flow |
| **Beat** | Windows-first: tray pinning, Focus-aware toasts, UAC explained, SmartScreen designed | episko only partly | Onboarding 0, 4, 6 |

---

## 7. Decisions for the client

The UX doesn't resolve these; they're flagged per the `ux-designer` role.

| # | Decision | Options | Recommendation | Why |
|---|---|---|---|---|
| D-1 | "Up to 3 sessions free" vs "never meter safety" | (a) cap everything at 3; (b) cap only the session details and ledger, guard everything; (c) no session cap, meter history and budgets only | **(b) for now, (c) if possible** | A cap on a guard leaves session 4 unprotected (EX PT-7); (b) keeps the brief's shape without that trap |
| D-2 | Pro moments before Pro exists | (a) hide them; (b) waitlist line; (c) checkout | **(b)** | A waitlist measures intent (EX kill criteria). Amended (CR-010, founder 2026-10-26): Pro can charge once it is built; only the cloud beta waits for Anthropic's written OK (was "PM: no paid tier before Anthropic's written OK") |
| D-3 | Code signing route | Artifact Signing (if eligible) · SignPath (OSS) · OV certificate · organisation account | **Resolved (CR-010, founder 2026-10-26): unsigned v0.1**; published SHA-256s, signed updates; Authenticode once revenue covers it | Individuals: USA and Canada only (Microsoft Learn) |
| D-4 | Admin prompt in first run | (a) ask for UAC (stronger limits); (b) user level only | **Resolved (CR-010, founder 2026-10-26):** the four limits are always on and can never be switched off; per limit you choose Locked (admin, managed settings) or Not locked (user scope, labelled). Chosen in first-run "Choose your rules" (onboarding screen 3b), before the UAC step; changing the locked set later asks for admin again | Only admin-written managed settings are out of the agent's reach (TR F16–F17) |
| D-5 | The canary costs tokens? | Hook-only synthetic call (free) vs a real model turn (~400 tokens) | Hook-only if spike S-1 shows it exercises the real path | Proof shouldn't cost the user's plan |

## 8. Open questions for spikes (engineering)

| # | Question | Affects |
|---|---|---|
| S-1 | Can the canary call our hook with a synthetic tool call through the real Claude Code path, without a model turn? | Onboarding screen 5, cost line |
| S-2 | Can the app answer a waiting PermissionRequest hook without racing the terminal prompt (EX U3)? | "Allow once" on toasts and cards |
| S-3 | Does a newly installed plugin reach already-running sessions (EX U7)? | Onboarding edge N |
| S-4 | Can Eucas find and focus the right terminal tab or desktop-app session for "Open session"? | Needs-you primary action |
| S-5 | Heartbeat detection: which signal shows "tools ran but our hook didn't fire" fastest (transcript tail, status line, PostToolUse)? | Principle 1 |
| S-6 | Is there a Settings deep link to "Other system tray icons" on Windows 11 current builds? | Onboarding screen 6 |

---

## 9. Premium-craft rubric (whole companion UX package)

Scored on the UX deliverables (structure, states, copy, flows). Visual axes are scored on intent only: the UI designer owns them next.

| Axis | Level | Evidence | Blockers left |
|---|---|---|---|
| Copy | **Senior** | Second person, plain state names, numbers first, fixed honest strings (§4.2), every first-run line checked against the removal test | Final copy fit at hi-fi |
| Visuals | **Senior (intent)** | Emphasis only on needs-you and the one primary; reuse of existing components; no decoration specified | UI to prove at hi-fi |
| Color | **Senior (intent)** | One Cobalt per view; amber only for needs-you; red only for "not guarded" and tripwire; never colour alone | UI to prove |
| Type | **Senior (intent)** | Existing 6-step scale; ≤ 4 steps per view; mono only for commands, paths, times | UI to prove |
| Structure | **Senior** | Three depths (icon, popover, window); 6 sidebar items; hierarchy test stated per surface | — |
| States and recovery | **Senior → Staff** | State matrices for first run and every main surface; worst moments (canary not blocked, tripwire, guard off, fail-closed brick) designed first with cause, what's safe, next step | Validate with the founder |
| Motion and emotion | **Senior (intent)** | 3 pinned first-run moments (reveal, proof, first heartbeat), reduced-motion fallbacks; no confetti | UI to animate |
| Coherence | **Senior** | One needs-you card, one checklist, one heartbeat line, one log row, one vocabulary, one promise string ([ia-and-flows §5](ia-and-flows.md)) | Hour-long walk on the prototype |
| Intelligence | **Senior** | Suggestions from history, live rule counters, week-over-week retro, forecast learns pace; rules exportable | — |

No axis below Senior. **Not done here:** rendered screenshots at 1440×900 / 1280×800 (premium-craft gate 10). These deliverables are research and flows with no wireframes, so there was nothing to render; the gate applies to the UI designer's prototype.

---

## 10. Handoff to UI: what the lead UI designer must get right

1. **The heartbeat line is the product.** One component, used in the tray tooltip, the popover header, onboarding screen 6 and the Protection card. It shows a real timestamp and a real state word, and has distinct designs for Guarded, Idle, Not guarded, Not verified, user level (weaker) and Blocked by your organisation. It must never look green while unproven.
2. **The tray icon at 16 px, in six states** ([ia-and-flows §1.1](ia-and-flows.md)), legible on light and dark taskbars and in high contrast, with the state readable without colour (slash, count, "!", moon). Test it in the overflow flyout too.
3. **The popover is a flyout, not a mini-app:** anchored to the tray, light-dismiss on click-away and Esc, 380 px wide, sections that disappear when empty, at most one Cobalt (only when a needs-you card is present). Decide Acrylic vs solid against BRAND's "no glass signature" rule, and say why.
4. **One needs-you card** that works in the popover (compact), in Today (full) and as a toast landing. Command in mono, a one-line consequence, **Open session** as the primary. "Allow once" only if spike S-2 passes; design both versions.
5. **The block receipt:** the toast (≤ 48-character title, ≤ 200 body) and its log row. **No "Allow anyway"** anywhere. **Copy command** is the only escape, and it's visibly secondary.
6. **The tripwire card** is the one modal-weight moment: a live count that keeps updating until the deletes stop, then the verified "stopped at 14:02:31", then the restore steps. Design the "still deleting" state first.
7. **The retro's four cards and the suggested-rule row:** command (mono), scope, "you allowed it 212 times", the dry-run line, and the three disabled variants (conflicts with your own `ask` rule, runner program, would touch a limit). The reveal animation counts numbers once and settles; off under reduced motion.
8. **Meters:** reuse DESIGN-SYSTEM §11.16; add freshness ("updated 20 s ago"), the forecast sentence with one time, and the tokens-only and API-mode variants. No red for money or limits.
9. **The honest strings** (§4.2) are fixed copy. Fit layout to them, don't shorten them. The gap line is always reachable in one click wherever the promise appears.
10. **Windows-native details:** native right-click menu; Focus-aware toasts; the UAC moment framed by a sentence before it appears; the tray-pinning helper with a real Windows 11 illustration; title bar and window controls that feel like Windows 11, not macOS.
11. **Dark first, light as an option,** both from `tokens.css`. Check the tray icon and toasts against both Windows themes separately from the app's own theme (they follow the OS, not Eucas).
12. **Keyboard:** everything in the popover reachable with Tab and arrows, Esc closes, Enter acts on the focused card; `Ctrl+1…6` in the main window; visible focus everywhere.
13. **Capture real reference screenshots first** (agent view, desktop Code tab, Warp notifications, a Windows 11 tray flyout) on the founder's machine; Refero and Mobbin don't have them (see the coverage gap under Method).
14. **Render and look:** premium-craft gate 10 applies to your prototype: 1440×900 and 1280×800 for the main window, plus the popover at 100 %, 125 % and 150 % Windows scaling.
