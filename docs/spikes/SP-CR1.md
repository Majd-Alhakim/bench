# Spike SP-CR1: keep working while the laptop is closed, on Claude's own cloud

**Date:** 2026-10-25 · **Branch:** `spike/cloud-routines` · **Code:** [`spikes/cloud-routines/`](../../spikes/cloud-routines/) (throwaway)
**Setup:** Claude Code **2.1.303** (unmodified), signed in with `claude login` (claude.ai, **Max**). Every probe runs headless from an empty temp folder with `--strict-mcp-config`, `--setting-sources ""`, `ANTHROPIC_API_KEY` stripped, and one tool: `RemoteTrigger`. Docs below were read on **2026-10-25**.
**Origin:** the client's monetization grilling, 25 Oct: "laptop-closed" work matters; "yes do the spike it is important".

**Recommendation: GO with limits.** Eucas can hand a brief to a **cloud scheduled task** (formerly "routine") on your own account and read the result back, all through the unmodified `claude` CLI, without ever seeing your token. It only fits **repo work on GitHub**, it loses most of the per-Euca isolation, and the routines API is a research preview. So: an opt-in "Keep working in the cloud" for code tasks, not a general cloud runner. The live run proved the loop end to end in 14 s. The limits test then showed which fences hold. Tools can be fenced with `disallowed_tools` (not `allowed_tools`), and connectors only with `clear_mcp_connections` or an explicit list (not `[]`). Bash can push to GitHub as you, but the branch-protection test showed a ruleset on `main` holds. The VM's token is a placeholder, and Anthropic's proxy refuses API writes ("Branch protection").

## Results
| Question | Result |
|---|---|
| 1. A local app can start cloud work | ✅ through **scheduled tasks** (`RemoteTrigger` tool: create, run, list_runs, get_run_log). ❌ not through `claude --cloud`: *"Starting a new cloud session with --cloud is interactive only"* (run, finding 1) |
| 2. No token handling by Eucas | ✅ `claude -p --tools RemoteTrigger` listed the account's routines (0) in **6.5 s**, about **$0.0008** at API prices, Haiku. The CLI attaches the OAuth token in-process; Eucas only sees JSON. Never use the routine `/fire` token (finding 3) |
| 3. Limits | Fresh **GitHub clone** only, no local files; 4 vCPU / 16 GB / 30 GB VM; min schedule interval **1 hour**; **100** scheduled runs/hour/account, **30** run-now/API fires per task/hour; counts against your plan's usage; isolation is per task, not per Euca (findings 4–6) |
| 4. Terms | Allowed for personal use: it is you running your own Claude Code on your own login. Flags for before a public v0.1 (finding 7) |
| Live loop (create → fire → status → result) | ✅ Client-approved run, 25 Oct. Created a **disabled** routine over HTTP (`created_via: http_api`), ran it by hand once (a disabled routine still runs on `run`), then read it back. **14 s from fire to result:** sandbox 2 s, clone 3 s, Claude Code started at +6 s, answer `SPIKE-PROBE-OK 3 bash=yes` at +14 s. `get` → `last_run.status: SUCCEEDED`; `get_run_log` gave every tool call and result. Disabled again afterwards. The Haiku driver runs cost about **$0.006** in total at API prices; the cloud run itself counts against the plan (findings 2, 4) |

Read-only probe output:
```
## auth                         {"loggedIn":true,"authMethod":"claude.ai","subscriptionType":"max"}
## claude -p --cloud <new task> {"exit":1,"message":"Error: --cloud \"noop\" is not a cloud session ID or URL."}
## routines list                {"ok":true,"result":"Count: 0","costUsd":0.00079976,"ms":6513}
```
(With a description, the CLI is explicit: *"--cloud cannot be combined with --print. Starting a new cloud session with --cloud is interactive only."*)

Live run (`--live`, then `--log <id>`), condensed from `get_run_log` and `get`:
```
create  HTTP 200 CREATE_TRIGGER_OUTCOME_CREATED  trig_015C2Gkc4MBzmwWTLbQTY9tm  (enabled:false, run_once_at 2027-10-25)
run     HTTP 200  session_id cse_01VfbcT2xhiD36nEwzJdSRHW
18:05:46 fired · :46 Allocating sandbox · :49 Cloning repository eucas-app/eucas · :52 No setup script · :54 init model=claude-haiku-5-5 cwd=/home/user/eucas
18:05:56 tool_use Bash: find docs/spikes -type f -name '*.md' | wc -l   -> 3
18:05:57 tool_use Bash: git status                                     -> On branch main … working tree clean
18:06:00 result: success turns=3 — SPIKE-PROBE-OK 3 bash=yes
get     last_run.status ROUTINE_RUN_STATUS_SUCCEEDED · allowed_tools ["Read","Glob","Grep"] · mcp_connections: 8 (none were sent)
update  enabled:false
```
Our first create attempt, with a body Claude guessed, was rejected four times (`One of job_config or session_request must be set`, then `Extra inputs are not permitted`); the working shape came from the `/schedule` skill (finding 2).

## Limits test (client-approved, 25 Oct, second routine)
One new disabled routine (`trig_01TYvquqHawNobqMzvdSzAGc`), Haiku, read-only prompts, run 6 times by hand (the first duration design was invalid, so it was rerun).

| Test | Setup | Result |
|---|---|---|
| Connector fence | create with `mcp_connections: []` | ❌ all 8 connectors attached anyway |
| | `update` with `clear_mcp_connections: true` | ✅ `mcp_connections: []`; the run had no claude.ai connectors |
| Tool fence (run A) | `disallowed_tools`: Bash, Write, Edit, WebFetch, WebSearch | ✅ none of them available (ToolSearch: "No matching deferred tools found"). Still present: GitHub MCP (~60 tools), Agent, Workflow, Artifact, PushNotification (it **sent a push** unasked), CronCreate, SendMessage, `add_repo` |
| Tool fence (run B) | also block `mcp__github`, PushNotification, Agent, Workflow, `add_repo` | ✅ all gone except `add_repo`, which needs its full name `mcp__claude-code-remote__add_repo` |
| Network (Default env, "Trusted") | `curl` from Bash | example.com → no response (blocked); registry.npmjs.org → 200; api.github.com → 200 |
| Start branch | `git fetch origin spike/cloud-routines` | ✅ works; the clone starts detached on `main`, so the prompt picks the branch |
| Secrets in the VM | env var **names** only | `GH_TOKEN`, `GITHUB_TOKEN`, `AWS_*`, `CLOUDSDK_AUTH_ACCESS_TOKEN`, `CLAUDE_CODE_MESSAGING_TOKEN` and more. Values not printed |
| Machine | `nproc`, `free`, `df` | 4 CPUs, 15 GB RAM, 30 GB free disk (matches the docs) |
| Concurrency | 3 × `run` back to back | ✅ all 3 accepted within 0.2 s, ran in parallel, each finished in ~26 s. No refusal at 3 |
| Duration (run C) | 3 × foreground `sleep 500` | ❌ not a run-time limit: Claude Code itself refuses long foreground sleeps ("Blocked: sleep 500 … use run_in_background"), so the agent ended after 14 s |
| Duration (run D) | one 25-min **background** job (heartbeat every 60 s), agent ends its turn and waits | ✅ **25/25 heartbeats, 19:35:50 → 19:59:50, no gaps.** The VM wasn't paused while the job ran with no turn active. The agent was woken at 20:00:50 to read the output and report. This is how a long build or test run behaves |
| Status after finish | `list_runs` | every finished run still shows `status: active, worker_status: idle`; "done" = idle + a `result` event in the log |

## Branch protection (client-approved, 25 Oct)
**Question:** can a cloud run's GitHub access (Bash: `git`, `gh`, `curl`) get past a ruleset on `main`?
**Setup:** new throwaway repo `Majd-Alhakim/eucas-cloud-push-probe` (README only). It had to be **public**, because GitHub refuses rulesets on private repos without Pro (*"Upgrade to GitHub Pro or make this repository public"*). Ruleset `protect-main` on the default branch: `deletion`, `non_fast_forward`, `pull_request` (1 approval), `bypass_actors: []`, `enforcement: active`. One routine (`trig_01PS4FWRsBgDRLXUfstmThx3`), only Bash and Read, connectors cleared, run once (`cse_0147Qsi7jgAcrJtPyk4GWQj3`, 90 s).

| # | Attempt | Exact result | Stopped by |
|---|---|---|---|
| 0 | Token facts | `GH_TOKEN` and `GITHUB_TOKEN` are both a **placeholder** (`proxy-injected_…`, 14 chars), not a GitHub token. `gh auth status`: *"The token in GH_TOKEN is invalid."* `curl` through the proxy: `X-Accepted-Github-Permissions: metadata=read`, `X-Oauth-Scopes:` empty. The real credential is attached server-side by Anthropic's proxy | n/a |
| 1 | `git push origin HEAD:main` (new commit) | `remote: error: GH013: Repository rule violations found for refs/heads/main … Changes must be made through a pull request … ! [remote rejected]` | **GitHub ruleset** |
| 2 | `git push --force origin HEAD:main` | *"denied by the Claude Code auto mode classifier. Reason: [Git Destructive]"*, never sent | **Cloud classifier** (GitHub not reached) |
| 3 | REST: create blob, `PATCH …/git/refs/heads/main` | `HTTP 403` *"Write access to this GitHub API path is not permitted through this proxy."* (both calls) | **Anthropic GitHub proxy** |
| 4 | Open a PR, then `gh pr merge --merge` / `--admin` | `gh pr create`: *"GitHub GraphQL is not available from Claude Code sessions"*. REST `POST /pulls`: same proxy 403. The merges were *"denied … Reason: [Merge Without Review]"* | **Proxy + classifier** (no PR exists) |
| 5 | Delete main (`git push --delete`, `DELETE …/refs/heads/main`) | *"denied … Reason: [Git Destructive]"*, never sent | **Cloud classifier** |
| 6 | Control: push new branch `probe/ok` | ✅ pushed (`af16b2f`) | allowed, as expected |

`git ls-remote` afterwards: `main` still at `e8ef238` (Initial commit). Only `probe/ok` was added.

**Verdict: yes, a protected `main` held against the cloud.** There are three layers, and only the first two are real security boundaries:
1. **Anthropic's GitHub proxy.** No usable token exists in the VM (it can't be leaked or reused), REST writes and GraphQL are refused, and only `git push` goes through.
2. **GitHub's ruleset.** It rejected the one write that reached GitHub.
3. **The cloud's auto-mode classifier.** It stopped force-push, delete and merge-without-review before they were sent. That's helpful, but it's a model judgement, not a boundary. Those three were **not tested against GitHub itself**. The same ruleset blocks them by design (`non_fast_forward`, `deletion`, `pull_request`), but this run didn't prove it.

**So Bash does not need to be off in the cloud to protect `main`**, as long as the target branches carry a ruleset with no bypass. eucas-app/eucas already has one on `main`/`staging`/`dev`. What Bash can still do is push **any unprotected branch** as you. Rule for Eucas: cloud runs push only to `claude/…` or the Euca's own branch, every branch that matters gets a ruleset, and Eucas checks the ruleset over the API before it enables cloud hand-off for a repo. Keep Bash off for cloud Eucas whose task doesn't need it. On a **private repo on a free GitHub plan** there is no ruleset at all, so there the only protections are the proxy (git pushes are allowed) and the classifier. **Cloud hand-off with Bash should be refused for repos without branch rules.**

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
2. **The create/update body is not documented** (`body: {[k: string]: unknown}`). A guessed body failed four times; the working shape is in the `/schedule` skill: `name`, **one of `cron_expression` or `run_once_at`** (there's no "API only" form here, so use a far-off `run_once_at` with `enabled: false`), and `job_config.ccr` = `environment_id`, `session_context` (`model`, `sources[].git_repository.url`, `allowed_tools`) and `events[]` carrying the prompt as a user message. Eucas should build that body itself (not let a model guess it), validate the `get` response with zod, and pin a tested Claude Code version (M9 already re-checks each upgrade). Treat a shape change as "cloud unavailable", not a crash. Read status from `get` → `last_run.status`; `list_runs` still said `active` after the run had finished, because the session stays open.
3. **No tokens, ever.** `RemoteTrigger` "adds the OAuth token in-process and never exposes" it. The `/fire` token (`sk-ant-oat01-…`) is a credential Eucas would have to store: that's forbidden by ADR-0002 and the [legal page](https://code.claude.com/docs/en/legal-and-compliance) ("may not collect, store, or intermediate Claude.ai credentials or session tokens"). Use `run`, not `/fire`. Don't automate `/web-setup` either (it sends your `gh` token to your Claude account; that's yours to choose).
4. **Isolation moves from Eucas to the routine.** In the cloud none of Eucas's per-run options exist: no `strictMcpConfig`, `tools`/`disallowedTools`, `skills`, `plugins`, `settingSources: []`, and our PreToolUse jail (M8) doesn't run. What a run reaches is:
   - **Connectors:** the claude.ai connectors on the task. **Proven live:** leaving out `mcp_connections` attached all 8 of the account's connectors (Vercel and Cloudflare, which can make changes, included). **Sending `mcp_connections: []` did the same.** Only an `update` with **`clear_mcp_connections: true`** removed them, and a run then had no claude.ai connectors. So Eucas must send the Euca's explicit subset, or clear them when it has none, and re-check with `get` before each `run`. Treat a mismatch as a hard stop.
   - **Tools:** **proven live:** `allowed_tools` doesn't restrict (Bash ran with only Read/Glob/Grep allowed), but **`disallowed_tools` does**. With Bash, Write and Edit on it, the run had none of them. A server prefix works too (`mcp__github` removed all of GitHub's tools), but a short name doesn't: `add_repo` stayed until we used its full name `mcp__claude-code-remote__add_repo`. **The cloud adds tools of its own** that Eucas must block by name: about 60 `mcp__github__*` tools, Agent, Workflow, Artifact, SendMessage, SendUserFile, CronCreate, ScheduleWakeup, Monitor and **PushNotification**. In the first fence run, the agent sent a push to the founder's phone without being asked. **Bash is the gap, but a bounded one:** `GH_TOKEN`/`GITHUB_TOKEN` are placeholders, and Anthropic's proxy attaches the real credential, allows `git push`, and refuses REST writes and GraphQL. So a Euca allowed Bash can push branches as you, and only GitHub's branch rules stop it on the branches that matter (see "Branch protection"). Keep Bash off for Eucas that don't need it.
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

## Left on the client's account (delete when you like)
At [claude.ai/code/routines](https://claude.ai/code/routines): the routine **"SP-CR1 probe (delete me)"** (`trig_015C2Gkc4MBzmwWTLbQTY9tm`), **disabled**. It has a placeholder run date of 2027-10-25, but it can't fire while disabled. Its one run session, `cse_01VfbcT2xhiD36nEwzJdSRHW`, is in the claude.ai/code sidebar. Neither the tool nor the CLI can delete routines; it's one click on that page.

Second routine, from the limits test: **"SP-CR1 limits probe (delete me)"** (`trig_01TYvquqHawNobqMzvdSzAGc`), disabled, with its 6 run sessions (`cse_01Mye24Tki5GEW2NiU6NjMaC`, `cse_014L3NxxAM9GnjeATWMrL1pm`, `cse_017GLQ9wZm3KMkPyjxnxUvf4`, `cse_013w8RPHD6URPiGES4b2DYWB`, `cse_01VvshXByMrGDBWsU29sxvdG`, `cse_01Ef7CDzGUFn7C1RThViNgm9`). Run A also sent one push notification to the founder's phone.

Branch-protection test: the public repo **`Majd-Alhakim/eucas-cloud-push-probe`** (with branch `probe/ok` and ruleset `protect-main`; no PR was created), and the routine **"SP-CR1 push probe (delete me)"** (`trig_01PS4FWRsBgDRLXUfstmThx3`, disabled) with its one session `cse_0147Qsi7jgAcrJtPyk4GWQj3`. Delete the repo at its *Settings → Danger zone*.

## Not covered here
- Force-push, deletion and merge without review **against GitHub itself**: the cloud classifier stopped all three before they were sent. A quick follow-up: run the same pushes on the probe repo with the classifier out of the way (for example from a local clone; the ruleset has no bypass, so it applies to the owner too).
- `git push` to a **private** repo the GitHub App can reach (the probe had to be public for the ruleset).
- A run over an hour, and the org's "cloud sessions running at once" limit above 3.
- The GitHub App vs bundle path for this repo (routines cloned it fine either way).
- Self-hosted environments (Team/Enterprise only) and Managed Agents (API key only).
