# Competitive brief: the Eucas companion (2026-10-25)

**Decision this informs:** what the Eucas companion gives away, what it charges for, and how it positions itself. The companion is the first slice of Eucas: it plugs into the Claude Code sessions people already run (monetization grilling, Q20–Q31).

**Relation to the 21 Oct brief:** [competitive-brief.md](competitive-brief.md) covers "AI teammate" products (Grok Bot, Muse, Cue, Dots, OpenClaw). This one covers a different field: **tools that manage, watch or guard coding-agent sessions**.

**Method:** two read-only teardowns (reverse-engineer agents) using public evidence: product sites, pricing pages, GitHub, changelogs, docs, Product Hunt and HN. [V] means verified on a primary page, [S] means a secondary source. The field changes weekly, so re-check before acting.

## 1. The one-line picture

**Anthropic is the main competitor, and the rest of the field is crowded, cheap and fragile.** Claude Code now ships, free, an agent view with needs-input, notifications, automatic worktrees and crash supervision [V], auto mode with destructive-action blocks [V], usage warnings and auto-resume [V], cloud Routines, and a Projects beta with a coordinator and shared memory [S]. Around it sit more than 15 managers, mostly free or about €5/month, several of them abandoned or shut down. **What nobody does:** hard safety limits enforced outside the model, user-written rules turned into hooks, a warning when two sessions touch the same files, and budgets per task that pause work.

## 2. Agent managers

| Product | Price | Windows | Licence / traction | Covers | Weakness |
|---|---|---|---|---|---|
| **Claude Code agent view + agent teams** (Anthropic) | Free with the CLI [V] | Yes [V] | Official | Needs input / ready-for-review groups, notifications, a worktree per session, crash supervisor, `--json` state; teams have `TeammateIdle` hooks that can keep a teammate working | Research preview; teams don't work in `-p` or the SDK and can't resume; no split panes in Windows Terminal [V] |
| **Claude Code Routines / Projects beta** | With the plan [S] | n/a (cloud) | Official | Laptop-closed runs; a coordinator, parallel cloud threads and shared memory (Projects, 17 Sep) | Research preview; merge conflicts left to the user [S] |
| **Conductor** | Free local; Pro **$50/mo** (cloud); Teams $60/user [V] | **No** | Closed; $22M Series A [S] | Worktrees, merge checks, a "resolve conflicts" button, cloud workspaces | Mac only; $50 for cloud |
| **episko** | Free [V] | **Yes** | MIT, 19 stars, active (v0.37, 22 Oct) [V] | "N need you" count, Allow/Deny from the GUI, spend per day and project, **5-hour and weekly limit forecast**, temporary hooks per launch [V] | No auto-approve rules; tiny traction |
| **VibeHandler** | Free up to 3 agents, **€5/mo** Pro [S] | Yes | 0 upvotes [S] | Many agents, a "conductor" agent, sessions survive reboots | **Same pricing shape as ours, with no traction** |
| **Abralo** | Free; ~$19/mo remote mentioned [S] | Yes | Closed | Limit alerts, tokens per agent, needs-attention view | No worktrees yet; freezes; unverifiable privacy |
| **Maestro** | Free | Build-from-source guide | AGPL, ~3.5k stars [V] | Playbooks, worktrees with PR, live cost, spoken alerts, phone remote | Complex power-user UI |
| **Pane** | Free | **First-class** | AGPL [V] | Invisible worktrees, rebase/merge shortcuts, status dots, an orchestrator chat | No cost or approval features |
| **Superset** (YC) | Free + cloud | **No** | ELv2, ~15.5k stars [V] | Worktrees, diff review, waiting-on-you, cloud, iOS | Being renamed; no Windows |
| **Claude Squad** | Free | No (tmux) | AGPL, 8.7k stars [V]; "abandoned?" issues | Worktrees, a global yolo auto-accept | No Windows, notifications or cost |
| **opcode** (ex-Claudia) | Free | — | AGPL, 22.4k stars [V] | Usage dashboard, custom agents | **No release binaries** |
| **Vibe Kanban** | Free | Partial | Apache-2.0, 28.5k stars | Worktrees, PR/merge | **Company shut down 10 Apr 2026** [S]: no business model on free users |
| **Crystal** | — | — | MIT, 3.1k stars | — | **Deprecated Feb 2026**, replaced by Nimbalyst [V] |
| **Herd**, **CodeAgentSwarm** | Free / unknown | Yes | Small | Worktrees + PR panel; notifications + kanban | Little traction |
| **Cursor 3 agents window** | $20–200/mo + background agents [S] | Yes | Closed | Up to 8 agents, worktrees, cloud VMs | Cursor-only; billing anger (Trustpilot) |
| **OpenAI Codex app** | With ChatGPT Plus+ [S] | Yes (since 6 Mar) | Closed | Threads, worktrees, automations, cloud | Codex-only |
| **Warp (Oz)**, **Zed 1.0** | Credits / free | Yes | Closed / open | Agent management view; parallel threads hosting `claude` | General tools, not agent supervisors |

Others to watch: Paseo, herdr, cmux, Orca, Sculptor [S].

## 3. Point tools

| Need | Free tools today | What's still open |
|---|---|---|
| Token and cost ledger | **ccusage** (MIT, 19.2k stars), **Claude-Code-Usage-Monitor** (MIT, 8.8k, burn rate and forecast), the status line's `rate_limits` and `cost` fields, `/usage` [V] | Nothing per task or per handoff |
| Plan-limit display on Windows | About 7 free tray apps (e.g. jens-duttke, MIT, signed). Most **read `.credentials.json` and an undocumented OAuth endpoint** [V] | A route that respects ADR-0002 (the status line) |
| Blocking destructive commands | **Auto mode** (default since v2.1.283) blocks force-push, `reset --hard`, deleting pre-existing files and more, but **allows pushing to the default branch** [V]; DCG hook; deny rules | Limits no mode can override, including never push to main, never send, never pay. Hooks have been **failing open on Windows** (fixes in 2.1.300/309/310) [V]; the Windows sandbox is **alpha** [V] |
| Auto-approve rules | Native allow, deny and ask settings [V] | A **GUI where users write rules** that compiles to hooks and covers all their sessions |
| "Needs you" alerts | Native mobile push via Remote Control [V]; ntfy, Telegram and Slack bridges [S] | A presence-aware inbox across sessions (most bridges need hooks set up in every project) |
| Conflicts between parallel agents | **Clash** (MIT, 65 stars, "ask" on overlapping edits, no Windows story) [V]; Switchman, git-kura [S] | Every manager isolates with worktrees, but **nobody warns before two sessions collide** |
| Budgets and guardrails | `--max-budget-usd` / `--max-turns` for **headless runs only** [V]; budgetclaw, cc-kill-switch [S]. Request #66048 (interactive dollar cap) closed as stale, not rejected [V] | **Budgets per task across interactive sessions, pausing before the plan limit** |
| Keep-going loops | Native `/goal` (one session, no budget cap) [V]; the Ralph-loop plugin [S] | A supervisor that follows rules and a budget, across sessions |

## 4. What this means for the companion

**Can't be sold, because it's free elsewhere, often from Anthropic:** a basic ledger, plan-limit display, notifications, auto-resume, simple keep-going loops, blocking destructive commands, and laptop-closed runs themselves (Routines are Anthropic's; Eucas only wraps them). These are table stakes, so they stay free.

**The free hero (nobody has it):**
1. **Hard safety limits enforced outside the model**, failing closed on Windows: never delete, never push to main, never pay, never send. Auto mode allows pushing to main, and hooks have failed open on Windows.
2. **A rules editor**: plain rules the user writes, compiled to Claude Code hooks across all sessions.
3. **A warning when two sessions touch the same files, with the conflict explained in plain words.**

**Pro, the gaps people would pay for:**
- **Budgets per task across sessions, with auto-pause before the plan limit** (native caps are headless-only; #66048 shows demand).
- **A supervisor that nudges agents within rules and a budget, across sessions** (`/goal` is single-session with no budget).
- Unlimited sessions, plus full history and export (weak on its own).
- Laptop-closed work through Routines, as beta. Conductor charges $50/month for laptop-closed work, Mac only.

**Change to Q29:** episko gives a **usage-limit forecast** away free on Windows. A forecast alone can't be Pro, so move it to Free and keep **budgets with auto-pause** in Pro.

**Warnings from the field:**
- **VibeHandler** has our exact pricing shape (free up to 3, €5 Pro) and has no traction. Pricing isn't the wedge; **safety plus rules plus Windows-first** has to be.
- **Vibe Kanban** (28.5k stars) shut down on free users. Free features must lead somewhere people pay.
- **Claude Code Projects** (a coordinator, parallel threads, shared memory) overlaps the *later* full team app. Eucas must sit **on top of** Anthropic's features (read `claude agents --json`, use hooks and Routines), not next to them.

## 5. Proposed BRD items (from the teardowns; need client approval)

- **P1.** The ledger and forecast read only the status line's `rate_limits` and `cost` fields, **never `.credentials.json` or the OAuth usage endpoint** (ADR-0002).
- **P2.** Safety hooks **fail closed on Windows**, with tests for a missing Git Bash or PowerShell.
- **P3.** **"Never push to the default branch"** is a hard limit (auto mode allows it).
- **P4.** The Free hero is hard limits plus the rules editor plus the same-file warning. The usage forecast moves to Free; Pro is budgets with auto-pause, the budget-capped cross-session supervisor, unlimited sessions, history and export, and laptop-closed beta.
- **P5.** Pro's nudges must say how they differ from `/goal`: across sessions, capped by budget, logged.
- **P6.** Read Anthropic's own state (`claude agents --json`, Notification and `TeammateIdle` hooks) rather than rebuilding it.

## 6. Steal / Avoid / Beat

- **Steal:** episko's "N need you" count and forecast; agent view's state groups; Conductor's merge-readiness checks; Clash's "ask" on overlapping edits; budgetclaw's lockfile so a paused session can't be quietly relaunched; presence-aware notifications (`CLAUDE_CLIENT_PRESENCE_FILE`).
- **Avoid:** reading credentials (the tray apps); shipping without binaries (opcode); closed source with unverifiable privacy claims (Abralo); a business that rests on paid cloud alone (Vibe Kanban); hard-coded guesses at plan token limits.
- **Beat:** safety and rules on **Windows first**; conflicts warned about before they happen and explained; budgets per task that actually stop the work.

## 7. Open unknowns

Conductor's Windows plans · official docs for Projects and Routines caps · whether agent view is on every plan · CodeAgentSwarm's pricing · whether Clash runs on Windows · the cost of the `/goal` evaluator · whether Anthropic plans interactive budget caps.

**Key sources:** conductor.build/pricing · episko.dev · github.com/respeak-io/episko · vibekanban.com/shutdown · code.claude.com/docs/en/agent-view · code.claude.com/docs/en/agent-teams · code.claude.com/docs/en/permission-modes · code.claude.com/docs/en/statusline · code.claude.com/docs/en/goal · github.com/anthropics/claude-code/issues/66048 · github.com/ryoppippi/ccusage · github.com/clash-sh/clash · github.com/anthropic-experimental/sandbox-runtime · the Claude Code CHANGELOG. Full source lists are in the two teardown reports from this session.
