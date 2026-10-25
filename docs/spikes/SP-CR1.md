# Spike SP-CR1: keep working while the laptop is closed, on Claude's own cloud

**Date:** 2026-10-25 · **Branch:** `spike/cloud-routines` · **Code:** [`spikes/cloud-routines/`](../../spikes/cloud-routines/) (throwaway)
**Setup:** Claude Code **2.1.303** (unmodified), signed in with `claude login` (claude.ai, **Max**). Every probe runs headless from an empty temp folder with `--strict-mcp-config`, `--setting-sources ""`, `ANTHROPIC_API_KEY` stripped, and one tool: `RemoteTrigger`. Docs below were read on **2026-10-25**.
**Origin:** the client's monetization grilling, 25 Oct: "laptop-closed" work matters; "yes do the spike it is important".

**Recommendation: GO with limits.** Eucas can hand a brief to a **cloud scheduled task** (formerly "routine") on your own account and read the result back, all through the unmodified `claude` CLI, without ever seeing your token. It only fits **repo work on GitHub**, it loses most of the per-Euca isolation, and the routines API is a research preview. So: an opt-in "Keep working in the cloud" for code tasks, not a general cloud runner.

## Results
| Question | Result |
|---|---|
| 1. A local app can start cloud work | ✅ through **scheduled tasks** (`RemoteTrigger` tool: create, run, list_runs, get_run_log). ❌ not through `claude --cloud`: *"Starting a new cloud session with --cloud is interactive only"* (run, finding 1) |
| 2. No token handling by Eucas | ✅ `claude -p --tools RemoteTrigger` listed the account's routines (0) in **6.5 s**, about **$0.0008** at API prices, Haiku. The CLI attaches the OAuth token in-process; Eucas only sees JSON. Never use the routine `/fire` token (finding 3) |
| 3. Limits | Fresh **GitHub clone** only, no local files; 4 vCPU / 16 GB / 30 GB VM; min schedule interval **1 hour**; **100** scheduled runs/hour/account, **30** run-now/API fires per task/hour; counts against your plan's usage; isolation is per task, not per Euca (findings 4–6) |
| 4. Terms | Allowed for personal use: it is you running your own Claude Code on your own login. Flags for before a public v0.1 (finding 7) |
| Live loop (create → fire → status → result) | ⏳ *Pending the client's OK to create one throwaway routine on their account; see "Not covered here".* |

Read-only probe output:
```
## auth                         {"loggedIn":true,"authMethod":"claude.ai","subscriptionType":"max"}
## claude -p --cloud <new task> {"exit":1,"message":"Error: --cloud \"noop\" is not a cloud session ID or URL."}
## routines list                {"ok":true,"result":"Count: 0","costUsd":0.00079976,"ms":6513}
```
(With a description, the CLI is explicit: *"--cloud cannot be combined with --print. Starting a new cloud session with --cloud is interactive only."*)

## 1. What exists today (docs read 2026-10-25)

| Mechanism | Laptop can close? | How a local app starts it | Brief + repo/files | Status and results back | Needs |
|---|---|---|---|---|---|
| **Cloud session** ([cloud docs](https://code.claude.com/docs/en/claude-code-on-the-web)) | ✅ "keeps running after you close your laptop" | `claude --cloud "task"`, **interactive only** (a TTY). Follow-ups are headless: `claude -p "msg" --cloud <session-id> --output-format json` → `{ok, session_id, url}` | Clones the repo's GitHub remote at the current branch; without the Claude GitHub App it **uploads a bundle** (<100 MB; on native Windows uncommitted edits upload as-is, whatever the file name) | Session page on claude.ai; a `claude/` branch it pushes; `--teleport` pulls it into a clean checkout | Pro, Max, Team, Enterprise premium; GitHub; org policy `allow_remote_sessions` |
| **Cloud scheduled task** (routine; [routines docs](https://code.claude.com/docs/en/routines), *research preview*) | ✅ "keep working when your laptop is closed" | `RemoteTrigger` tool in a headless CLI run: `create` (prompt, repos, environment, connectors, model, optional cron), `run` | Saved prompt = the brief (trusted); `run` text arrives in a `<routine-fire-payload>` block as **untrusted** data. Repos cloned fresh each run | `list_runs` (status, timestamps, link) and `get_run_log` (newest 200 events: tool calls, errors, final result) | Pro, Max, Team, Enterprise; GitHub access; Claude Code ≥ 2.1.227 for runs/logs |
| Routine **API trigger** `/fire` | ✅ | `POST /v1/claude_code/routines/{id}/fire` with a per-task bearer token shown **once** | `text` field | Returns `claude_code_session_id` + URL | Eucas would have to **store** the token. Don't (finding 3) |
| Routine **GitHub trigger** | ✅ | `create_webhook_trigger` | PR, release, issue events | As above | Claude GitHub App on the repo |
| Remote Control ([docs](https://code.claude.com/docs/en/remote-control)) | ❌ runs on your machine | `--remote-control` | Local | Phone/browser view of a local session | Machine on |
| Desktop scheduled tasks, `/loop`, `claude --bg` ([compare table](https://code.claude.com/docs/en/scheduled-tasks#compare-scheduling-options)) | ❌ "Requires machine on: Yes" | Local | Local files | Local | Machine on. This is what BR-76 already does |
| Agent SDK ([overview](https://code.claude.com/docs/en/agent-sdk/overview)) | ❌ "in a process you operate" | `query()` | Local | Local | It has no cloud of its own; it's how Eucas calls `RemoteTrigger` |
| Managed Agents ([platform](https://platform.claude.com/docs/en/managed-agents/overview)) | ✅ hosted | Claude API | Sandbox | API | **API key only**, billed per token; not your subscription. An option only in API mode |

## Findings for the design
1. **Routines are the only scriptable door.** Starting a cloud session needs a terminal (`--cloud` refuses `-p`). The desktop app and claude.ai can start them, but Eucas can't drive those. `RemoteTrigger` is a documented built-in tool ([tools reference](https://code.claude.com/docs/en/tools-reference), [SDK `RemoteTriggerInput`](https://code.claude.com/docs/en/agent-sdk/typescript#remotetrigger)), so Eucas can call it from `query()` with `tools: ['RemoteTrigger']`. **Shape:** one **routine per cloud-eligible Euca** ("Backend Euca, cloud"), with no schedule; each hand-off `update`s its saved prompt with the brief, then `run`s it. Each run is a new session.
2. **The create/update body is not documented** (`body: {[k: string]: unknown}`). `/schedule` builds it with Claude's help. Eucas should let a small Haiku run compose it, validate the returned JSON with zod, and pin a tested Claude Code version (M9 already re-checks each upgrade). Treat a shape change as "cloud unavailable", not a crash.
3. **No tokens, ever.** `RemoteTrigger` "adds the OAuth token in-process and never exposes" it. The `/fire` token (`sk-ant-oat01-…`) is a credential Eucas would have to store: that's forbidden by ADR-0002 and the [legal page](https://code.claude.com/docs/en/legal-and-compliance) ("may not collect, store, or intermediate Claude.ai credentials or session tokens"). Use `run`, not `/fire`. Don't automate `/web-setup` either (it sends your `gh` token to your Claude account; that's yours to choose).
4. **Isolation moves from Eucas to the routine.** In the cloud none of Eucas's per-run options exist: no `strictMcpConfig`, `tools`/`disallowedTools`, `skills`, `plugins`, `settingSources: []`, and our PreToolUse jail (M8) doesn't run. What a run reaches is:
   - **Connectors:** the claude.ai connectors on the task. **All of them are included by default**, so Eucas must send an explicit list on every create/update (the Euca's subset, often none) and re-check it with `get` before each `run`.
   - **Repo config:** the clone's `CLAUDE.md`, `.claude/settings.json` (hooks, permission rules), `.mcp.json`, `.claude/skills|agents|commands`. Your `~/.claude` is **not** read, and plugins never load ([what carries over](https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup)).
   - **Permissions:** auto mode (a classifier), not Eucas's approval gate. A run stops for a prompt only on ask rules or repeated blocks.
   - **Network:** the environment's allowlist (Default = "Trusted" package registries etc.).
   So the same task works in the cloud only if it's safe under those rules. **Private memory** and **global memory** live in the Bench home on your PC, so they go **in the brief** (the trusted saved prompt), trimmed to what the task needs. The cloud run never gets the rest. That keeps BR isolation (agent A can't read B's memory) because only A's brief is sent, but it is a copy leaving the machine: show it in the trace.
5. **Results come back as git + a log.** The run pushes a `claude/…` branch (the repo ruleset already blocks `main`/`staging`/`dev`). When Eucas next runs, it calls `list_runs` + `get_run_log`, writes the final result and tool calls into the trace as a **cloud run** (marked as such), fetches the branch into the Euca's worktree (M10), and proposes memory notes from the result the normal way (Atlas approves with Undo/Forget). Run logs are **untrusted data** (they quote repos and web pages). If a run waits on a permission prompt, it becomes a "What needs you" item with an *Open on claude.ai* link, since Eucas can't answer it.
6. **Cost and caps are yours.** Runs "draw down subscription usage the same way interactive sessions do", with no VM charge; parallel runs burn limits faster; the hourly caps have no overage. The pre-run estimate (BR-93) and the usage meter must count cloud runs. Bash commands default to 2 min (max 10, then 30 more in the background); an idle VM pauses and can be reclaimed, and a run that waits on you can expire.
7. **Terms.** Allowed: *"Nor does it prevent an end user from signing in to the unmodified Claude Code binary with their own Claude subscription"* ([legal](https://code.claude.com/docs/en/legal-and-compliance)); Eucas hosts nothing and never touches credentials. Flags:
   - The [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) says: *"Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK."* This is about **all** of Eucas (ADR-0002), not just this feature. It's fine for the founder's own use; **before a public v0.1 that advertises "use your subscription", get Anthropic's written OK** ([contact sales](https://www.anthropic.com/contact-sales)) or default shared builds to API mode.
   - Advertised limits "assume ordinary, individual usage". Many unattended cloud runs a night may not read as ordinary; cap them (below).
   - Routines are a **research preview** ("behavior, limits, and the API surface may change"), and "Anthropic reserves the right to … enforce … without prior notice". Build it behind a feature switch with a graceful "cloud unavailable" state.
   - No hosted Eucas server is involved, so the "vendor-hosted agents need written approval" rule doesn't apply.
8. **No hidden server is needed for status.** Eucas reads results when it's next open (or on its tray timer). There's no push channel from the cloud run to Eucas; `PushNotification` from inside the run can reach your phone if you want it.

## 2. Sketch: "Keep working while my laptop is closed"
- **Who qualifies:** a Euca whose task is **repo work on a GitHub repo** the Claude GitHub App or `/web-setup` can reach, needs no local files, no browser agent (BR-84), and no connector writes. Typical: finish a story's implementation, fix failing tests, write docs, research into a markdown file. Atlas itself never moves (it's your front door), and neither does anything that sends, posts or deletes (CR-008).
- **How you ask:** on a running or queued task, *Keep working in the cloud*. Or, when you quit Eucas or the PC is about to sleep with work queued, Atlas offers once: "3 tasks can keep going in the cloud overnight. Send them?" Never automatic.
- **What Eucas does:** composes the brief (task, acceptance criteria, the trimmed memory, branch to start from), pushes the Euca's branch, `update`s that Euca's cloud routine (prompt, repo, environment, **explicit connector list**, model tier), `get`s it back to check, then `run`s it. Trace: *"Sent to the cloud: brief (1.2k tokens), repo, 0 connectors"*.
- **Limits Eucas enforces:** at most N cloud runs a night (default 3), only one per Euca, shown in the usage meter as "cloud".
- **How it comes back:** on next open, Eucas reads `list_runs`/`get_run_log`, fetches the branch, adds the run to the Euca's trace and the task's timeline, and the Euca reviews its own diff before it goes to you as *Ready to review*.
- **The Atlas notch:** a cloud glyph by the eyes while any cloud run is out; when one finishes or waits for you, the usual small animation and marker (no pop-down, per the notch anti-goals). Hover: "Backend Euca finished in the cloud: 4 files, tests pass" or "Waiting for you on claude.ai". It reads this only while Eucas is running; nothing reaches the notch from the cloud by itself.

## 3. BRD/PRD items that would change (needs a change request)
- **BRD §2 "Own cloud runner: not built"** and **PRD §Scope "no work while the laptop is closed"**: keep "no cloud runner of our own", add "can hand repo work to your own Claude cloud scheduled tasks (opt-in)".
- **BR-76** (local only, tray, keep PC awake): add the cloud hand-off as the option when the PC will be off.
- **BR-49 / UC-38** (routines): a routine may run **in Eucas** (today) or **in your Claude cloud** (repo-only, isolation as finding 4).
- **New BR:** cloud hand-off rules: brief-only memory, explicit connector list, no outward actions, caps, untrusted run logs, feature switch.
- **New UC:** "Send a task to the cloud and get it back", with trace, notch and "What needs you" states; and an onboarding check (GitHub access, cloud environment, plan).
- **BR-93** (pre-run estimate) and the usage meter: include cloud runs.
- **ADR-0002:** add the routine `/fire` token to the never-store list, and the SDK-overview note above as an open policy risk for public release.

## Not covered here
- **The live loop on a real routine** (create → run → `list_runs` → `get_run_log` → disable). The probe has it behind `--live` / `--log <id>`, but it creates persistent configuration on the client's account, so it waits for the client's OK. Until then, the status/result path is from the docs, not a run.
- How long one run can work unattended in practice (no maximum session length is documented), concurrency under the org's "cloud sessions running at once" limit, and the GitHub App vs bundle path for this repo.
- Self-hosted environments (Team/Enterprise only) and Managed Agents (API key only).
