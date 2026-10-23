# Product Requirements Document (PRD): Bench (codename)

| Status | Version | Date | Owner | Approver | Upstream |
|---|---|---|---|---|---|
| Draft | 0.3 | 2026-10-23 | Product Manager | Client | [BRD v1.2](BRD.md) (Baselined v1.2, pending client confirmation; 50 active use cases) + CR-001 – CR-008 + [G2 answers](interviews/2026-10-23-g2-answers.md) |

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-22 | PM | First draft (lean mode). No scope cut (D1); 46 use cases grouped into capability blocks and sequenced into five sprints over 14 days |
| 0.2 | 2026-10-23 | PM | Applied CR-001 – CR-007, grilling rounds 1 and 2, UX recommendations R1 – R11, UI feedback rounds 1 – 4, brand decisions, the Laws of UX audit and UI direction v0.7. Cross-checked against **BRD v1.1** (UC-48 – UC-51, BR-77 – BR-93, O6, V-22 – V-27; BR-52, AS-3 and V-16 retired). **Positioning:** Bench complements Claude. **Usage:** no cap and no pacing; the runaway-bug guard is the only automatic stop. **Automation:** only five kinds of thing need you (BR-86), plus the safety net (BR-90). **Sprints re-sequenced** with the riskiest work first; all 50 use cases placed. **Added:** epics and stories (Appendix A), the BRD cross-check (Appendix B), and the merged open questions for G2 (§11). ADR-0001 and the MIT licence are closed |
| 0.3 | 2026-10-23 | BA | Applied the client's **G2 answers** (G2-Q1 – Q12) and **CR-008**, cross-checked against **BRD v1.2**. **Drafts, not sends:** agents never send emails or publish posts; they save drafts in Gmail or the target app, and you send them. The 60 s send undo, the "Ask me before sending" switch and the wrong-email risk are gone, so §11 #6 is moot. **No deletes on the computer:** every delete is yours; the scratch area is withdrawn. **Browser agent** asks only before signing in to a site it hasn't signed in to before. **§11:** every question answered, with a "Client answer" column. Updated: §1, §5, §6 block E, §7, §8 (O3, O6), §9 (Sprint 3 exit, Sprint 5 goal, E13b, pull-forward), §9.1, §10, Appendix A (3.3, 4.9, 6.4, 11.1, 13.2, 13.3), Appendix B. Story 13.3 re-pointed to 5 (Sprint 5 ≈ 31 points). **No cut:** nothing left the scope; the drafts rule makes Sprint 5 lighter |

Lean mode: this PRD links to BRD IDs (UC, BR, O, V, S) and doesn't repeat them. Design references are routes in [`direction.html`](../design/ui/prototype/direction.html) v0.7.

## 1. Summary
Bench is a Windows-first desktop app where you run **a software delivery team of Claude agents** on your own Claude subscription. You talk to one main agent, **Atlas** by default (BR-01). Atlas routes work to named agents. Each agent has its own memory, connectors, skills and folder grants, and its model is picked per task (BR-81). The team commits, tests and merges on its own, and comes to you only for the five kinds of thing: **delete, pay, answer, decide, test** (BR-86). It never sends an email or publishes a post: it saves a draft, and you send it (BR-64, CR-008). Every step, token and memory note stays visible and editable (BRD S1 – S12).

**Positioning** (BRD §1): Bench complements Claude; it doesn't compete with it. It puts Claude Code and Cowork-style abilities (files, documents, a browser agent) in one place, organised as a team, for people who build software and want less switching between chats. It's a personal project, shared openly under MIT so others can customise it. It runs locally only (BR-76).

**Target:** Bench is **open-source ready 14 days after Gate 6** (O4), full scope, sequenced rather than cut.

## 2. Problem and evidence
- **Problem:** with one session, you route every role by hand, copy context between chats, and nobody remembers decisions. Agent-team products feel like a team, but you can't see what they did, what it cost or what they remember. They either ask too often ("botsitting") or act behind your back (BRD §1, §5.1).
- **Evidence:**
  - Interviews B1 – B7 and the 2026-10-22/23 rounds ([grilling](interviews/2026-10-23-grilling-round-1.md), [UI feedback](interviews/), [CR-001 – CR-007](change-requests/)).
  - Competitor gaps ([risk facts §2–§3](../research/risk-facts-2026-10-23.md), [strategy](../research/strategy-2026-10-22.md)):
    - Grok Bot agents share credentials and have no audit view.
    - Dots runs one agent per plan, and its memory is opaque.
    - Users complain about token burn, limits that hit mid-task, and about 6.4 h a week of botsitting.
  - Subscription use through the unmodified binary is allowed today for personal use ([risk facts §1](../research/risk-facts-2026-10-23.md), [ADR-0002](../adr/0002-auth-subscription-vs-api-key.md)).

## 3. Goals and non-goals
- **Goals:** BRD objectives **O1 – O6** (O3 revised in v1.1; O6 is the new head-to-head benchmark), plus the first-run targets (R10, UC-06). Targets are in §8.
- **Non-goals for v0.1** (BRD §2 Out of scope):
  - **Phone:** no phone app or phone notifications; they come first after v0.1.
  - **Cloud:** no cloud runner and no work while the laptop is closed. Agents run while Bench is open, in the tray (BR-76).
  - **Integrations and control:** no Cowork app integration. No control of desktop apps or of your real desktop; the browser only (BR-84). No "Publish to Claude Docs" (BR-83) and no embedded browser; both are v1.
  - **Bundled skills:** we don't bundle Anthropic's source-available docx/pptx skills (BR-85).
  - **Claude Code depth (Phase 2):** no interactive terminal, no diff review UI, no slash commands. The agent's screen shows its diff, files and terminal output read-only (§11 #11).
  - **Other exclusions:** multi-user, cloud sync, marketplace, non-Anthropic models, voice, separate OS windows (D-UI9), the 3D office, and the content pipeline (UC-39, retired). Also no usage caps or pacing.

## 4. Target users and personas
- **Primary persona: the founder.** BA by day, aspiring PM on personal projects, and a developer. You use Claude Code daily and want a team, not a chat. You're the only user in v0.1, the product owner and the human in the loop (BRD §3). Dark first (BR-88), calm screens, second-person voice (BR-87).
- **Secondary persona (after v0.1): a builder who clones the repo.** Has their own Claude subscription and `claude login`, and customises agents, skills and templates (BRD §1). v0.1 serves them only through O4: README, build from source and the guided first run (UC-06).
- UX detail: [UX package](../design/ux/README.md), [premium spec](../design/ux/premium/README.md).

## 5. Jobs to be done and key scenarios
| When … | you want to … | so you can … | Use cases |
|---|---|---|---|
| you install Bench | be guided to a working Claude Code login and a first answer quickly | start without setup pain (R10) | UC-06, UC-08 |
| you have an idea | pitch it to Atlas, approve a one-pager, have competitors torn down, and have the team run with it | go from idea to product without routing each role | UC-12, UC-43, UC-15, UC-51, UC-13, UC-16, UC-30, UC-31, UC-24 |
| you need a feature built | delegate it and have it committed, tested and merged by itself, then be asked only to test | get real code on `main`, with a revert if needed | UC-14, UC-32 – UC-34, UC-22, UC-24, UC-50 |
| you open Bench | talk to Atlas and see only what needs you (Decide · Test · Answer) | act on the few things that matter | UC-25, UC-23, UC-29 |
| something is running | watch any agent's screen, trace and tokens, and stop or redirect it | trust the work and never be surprised | UC-27, UC-28, UC-40, UC-41 |
| agents disagree or get stuck | have a timeboxed debate decide it, or have it escalate to you | get a decision memo, not a loop | UC-11, UC-17 |
| you shape a project's team | create a project by hand or through Atlas; add agents with a title and look; set links, connectors, skills and autonomy | have the right team for each project | UC-01 – UC-07, UC-35, UC-43, UC-47 |
| work piles up | have memory log, roll up, stay clean, stay searchable, and visibly learn your preferences | let agents get better over time | UC-18 – UC-21, UC-44 – UC-46 |
| a job needs the web or a document | have an agent use a browser (with Take over) or produce docs, slides or dashboards | get Cowork-style work done in the same team | UC-48, UC-49, UC-36 |
| chores recur | schedule any agent task as a routine; Atlas triages email and leaves reply drafts in Gmail for you to send | have personal work happen without you, safely | UC-36 – UC-38, UC-50 |
| you hit the plan limit | see work wait clearly and resume on its own at the reset | lose nothing and never get a surprise | UC-40 – UC-42 |

## 6. Scope: no cut, capability blocks
**Client decisions D1 (2026-10-22) and the 14-day full scope:** all **50 active use cases** in BRD v1.2 are in v0.1; CR-008 changes how some behave, not what is in scope. MoSCoW: everything listed is **Must**; the Won'ts are the §3 non-goals. Work is grouped into blocks and **sequenced** by risk and dependency (§9).

| Block | Capability | Use cases | Key rules and v1.1 additions | Sprint |
|---|---|---|---|---|
| **0** | Feasibility spikes (go/no-go) | — | S0-1 subscription runner, S0-2 router economics, S0-3 in-process MCP, SP-B1 browser agent, M8 shell containment | 1, day 1 (or earlier, in Phase 0) |
| **A** | Install, Atlas chat, glass box, usage, runaway guard | UC-08, 27, 28, 40, 41, 42 | Guided first run and sign-in check (UC-06 part, R10, M6) · API-key plan B (BR-80) · version pin and contract test (M9, SRS) · runaway guard (BR-79, V-26) · pre-run estimate (BR-93) · context trace (BR-78) · dark first, sounds (BR-88, BR-89) | 1 |
| **B** | Team, projects, autonomy, safe execution | UC-01 – 04, 06, 09, 22, 23, 29, 32, 33, 35, 43 | Manual projects and a team per project (CR-001) · avatars and titles (BR-92, BR-12) · Atlas's profile (BR-01) · model per task (BR-81) · approval ladder and reviewer check (BR-82) · five kinds (BR-86) · notifications and sounds (BR-40, BR-89) · skill library (BR-85) · containment, worktree, snapshot (M8, M10: NFR notes in UC-32 – UC-34) | 2 |
| **C** | Memory, context, routines, browser agent | UC-18 – 21, 25, 38, 44 – 46, **49** | Context meter (BR-78, V-22) · checkpoint (BR-66) · intelligence layer (R6, R7) · routines that can do anything (BR-49, BR-93) · tray, keep-awake, catch-up (BR-76) · **browser agent (BR-84, V-24)** | 3 |
| **D** | Delivery department (scenario #1), automation, deliverables | UC-05, 07, 10 – 17, 24, 26, 30, 31, 34, **48, 50, 51** | **Teardown (BR-77, V-27)** · **rich deliverables (BR-83, V-23)** · auto-merge after CI and the reviewer check, with revert, and the **digest (BR-82, BR-90, V-25)** · Ready to test (BR-86) · mentions and replies in team chat (BR-91) · R11 | 4 |
| **E** | Integrations, loans, release | UC-36, 37, 47 (+ UC-50's drafts in the digest) | **Gmail drafts:** triage, labels, archiving, and replies saved in Gmail's drafts for you to send; no agent sends (BR-15, BR-48, BR-64, BR-65, BR-90; CR-008) · **benchmark (O6)** · O4 checklist and Windows installer (§11 #8) | 5 |

**Coverage check:** 6 + 13 + 10 + 18 + 3 = **50 use cases**. Placement notes:
- **UC-41** ("monitor usage and stop runaway loops") moves to Sprint 1 with the meter and the runaway guard.
- **UC-43** moves to Sprint 2, because CR-001 makes the project the container of the team.
- **UC-05** (links) moves to Sprint 4, where team-to-team work starts.
- **UC-06** is split: the guided first run lands in Sprint 1, and the day-1 team template in Sprint 2 (it's counted there).
- **UC-50** is counted in Sprint 4 (merge revert and the digest); listing Gmail drafts in the digest lands with Gmail in Sprint 5. (The v0.2 email undo is withdrawn, CR-008.)

The open-source work (README, clean-clone CI build, secret scan, licence check) runs as a **continuous lane from Sprint 1**.

## 7. Experience principles
| Principle | What it means in the product | How we check it |
|---|---|---|
| **Calm command** (C7, premium spec) | Home is the chat with Atlas. One question, one action. Panels closed by default; less on screen; dark first (BR-88) | Hierarchy test per screen; the Laws of UX standing rules ([audit §3](../design/ux/laws-of-ux-audit.md)) |
| **Only what matters needs you** (BR-86) | A ticket exists only for the five kinds. Everything else is automatic and shows in the trace and in "Decided by Atlas" (V-25) | Ticket kinds outside the five = 0 (QA check every sprint) |
| **Glass box** | Every run, tool call, file, merge, email draft, memory note and token can be seen with Look inside; automatic merges have Revert (BR-90) | Any action at a demo traces to its run (UC-28, V-05 – V-07) |
| **Safety net, not gates** (BR-90) | End-of-day digest of automatic actions and new drafts, one-click revert of merges; the reviewer check before merges (BR-82). Nothing irreversible leaves or disappears without you: emails and posts are drafts, deletes are yours (CR-008) | Every automatic merge appears in the digest with Revert; every new draft is listed; agents' Sent count = 0 |
| **No cap, no surprise** (O3, BR-79, BR-93) | Agents run as much as the work needs. At the limit, work waits and resumes by itself. Only a runaway bug is stopped. Costs show before a click as tokens and % of week (UXA-D4) | Limit pauses resume with nothing lost; the runaway guard has 0 misses in tests |
| **Files are the source of truth** | Agents, org, memory and checkpoints are Markdown/YAML, Obsidian-compatible | Editing a file on disk changes Bench's behaviour (BR-67, BR-68) |
| **A team that feels alive and knows you** | Shape characters with eyes show status (BR-92). Handoffs travel. Applied chips and the Ledger show learning. Three sounds (BR-89) | Visible at every sprint demo; reduced motion respected |

## 8. Success metrics
| # | Metric (target) | Type | How it is measured |
|---|---|---|---|
| O2 | **≥ 10 tasks/week** accepted without redo | **North star** | Tasks entering *Accepted* per ISO week (UC-24), shown in V-09 |
| O1 | Daily use for 14 days in a row, from the MVP prerelease (day 12) | Input | Days with ≥ 1 client session (BRD §10.1 #9) |
| R10a | Atlas's **first reply < 3 min** from first launch | First run | Local timestamps from first launch to Atlas's first reply. Measured on a clean Windows profile with Claude Code installed but not signed in (UC-06) |
| R10b | **First finished task < 5 min** from first launch | First run | First launch to the first task Done, on a local file with no connectors (M6, UC-06) |
| O6 | **Head-to-head benchmark run and published** (v0.1 DoD) | Delivery | Bench's team vs one Claude Code session on 3 tasks from Bench's own backlog. Bench wins if it matches or beats acceptance with fewer of your hands-on minutes; scored on acceptance, hands-on minutes, wall time and % of the week (§11 #7, G2-Q7). Results go in the README |
| O3 (safety) | **Zero** destructive actions (including any delete on the computer) or payments without you; **zero** emails or posts sent by an agent; **100 %** of automatic actions and new drafts logged in the digest, with Revert on merges (BR-90, CR-008) | Guardrail | Approval log, outward-actions log and digest (V-11, V-12, V-25), reconciled against the trace and Gmail's Sent folder |
| O3 (usage) | Usage visible live and before big runs (BR-93); **every limit pause resumes after the reset with nothing lost** (BR-50); **zero runaway loops left unstopped** (BR-79) | Guardrail | Meter and pause records (UC-40 – UC-42); guard events (V-26); fault-injection tests in CI. The 30 % line is shown on the meter as information only (§11 #2, G2-Q2) |
| — | Tokens per accepted task (trend down) | Guardrail | Ledger tokens for accepted tasks' runs, divided by accepted tasks (V-09) |
| — | Tickets per accepted task (trend down) *(proposed)* | Guardrail | What needs you tickets per accepted task; measures BR-86 in practice |
| O4 | Open-source ready on **day 14 after G6** | Delivery | The checklist passes: MIT licence (done), README (install, `claude login` prerequisite, build), clean-clone build in CI, secret scan clean, third-party licence check (BR-85, no AGPL code), no "Claude Code" naming (ADR-0002), terms re-checked (BR-80) |
| O5 | Products Bench builds: full working product in **14 days** | Outcome | Project start vs. client acceptance (BR-35), shown as project age in V-09 |
| — | Build velocity (points and tokens per accepted story) | Delivery health | Sprint reviews; re-plan on day 6 |

## 9. Release plan (re-sequenced)
Build start = G6 approval = **day 1**. There are five goal-boxed sprints: four of 3 days, then a 2-day release sprint on days 13 – 14. Each sprint runs **parallel developer agents in lanes** (one task = one branch = one PR). The lane count, 3 – 5, comes from the S0-1 measurement and the usage meter. Each sprint opens with planning on its first morning and closes with a demo and retro on its last day.

The order is **riskiest first**. The subscription runner, shell containment, version pinning and browser feasibility are settled on day 1. The permission engine (BR-82) ships before any automation, and the safety net (BR-90) ships with the automation it protects.

| Sprint | Days | Goal (you can verify it at the demo) | Epics (Appendix A) | Use cases | Exit criteria |
|---|---|---|---|---|---|
| **1: Feasible, installable, visible** | 1 – 3 | "On a clean Windows profile Bench guides me to a signed-in Claude Code, Atlas wakes and answers in under 3 minutes, I see every step and token in Look inside and the week ring, I stop a run mid-way, and a run waits at the limit and resumes by itself." | E0 spikes · E1 foundation and install · E2 Atlas chat · E3 glass box, usage, runaway guard | UC-08, 27, 28, 40, 41, 42 | Spike reports S0-1, S0-2, S0-3, SP-B1 and M8 in `docs/spikes/` with your go/no-go (closes G0) · CC version pinned, with a green contract test in CI · R10a measured · runaway guard fires in a fault-injection test · CI green on windows + ubuntu · README skeleton |
| **2: The team, safely** | 4 – 6 | "I create a project by hand with its own team, add an agent with a title and a look from one sentence, it edits and tests in a granted folder inside its jail on its own worktree, and only the five kinds of thing reach me in What needs you." | E4 team and projects · E5 autonomy and What needs you · E6 safe execution · E7 connectors and skills | UC-01 – 04, 06, 09, 22, 23, 29, 32, 33, 35, 43 | Isolation tests pass (agent A can't reach B's folders, connectors or skills) · containment blocks out-of-jail paths and non-allowed commands · reviewer check and circuit breaker work in tests · overlay shows only the five kinds · **re-plan checkpoint (day 6)** |
| **3: Memory, context, routines, browser** | 7 – 9 | "An agent's work lands in memory by itself and I find it by keyword, by meaning and in the graph; an agent restarts cleanly after a checkpoint; a routine runs on time from the tray; and a browser agent finishes a task on a site while I can take over." | E8 Bench Memory · E9 context and intelligence · E10 routines and runtime · E11a browser agent | UC-18 – 21, 25, 38, 44 – 46, 49 | Memory isolation tests pass (BR-69 single writer, scopes) · checkpoint has all 8 sections and the fresh session states its next step · a missed routine catches up · the browser agent asks only before signing in to a site it hasn't signed in to before, browses, clicks and types without asking, leaves sends and posts as drafts (§11 #3, G2-Q3), and Take over works · R10b measured |
| **4: Delivery department (MVP)** | 10 – 12 | "I pitch an idea to Atlas, approve the one-pager, and the team carries it through the teardown, the BA interview, the documents, stories on the dashboard, and code that merges by itself after CI and the reviewer check, then hands me a Ready to test ticket I try and accept." | E12 delivery department · E11b deliverables · E13a automation and safety net · moved in: 2.3 reply, 4.7 links, 4.10 @-mentions (they land with team chat routing) | UC-05, 07, 10 – 17, 24, 26, 30, 31, 34, 48, 50, 51 | Scenario #1 end to end on the **MVP prerelease installer** · every automatic merge has Revert, and the digest lists it · benchmark tasks and protocol frozen · dogfooding starts (O1 clock) |
| **5: Integrations and v0.1** | 13 – 14 | "Atlas triages my Gmail and leaves its replies in my Gmail drafts for me to send, a freelancer delivers a research report, a lead borrows an agent and merges it back, the benchmark results are in the README, and a clean clone builds and passes the open-source checklist." | E13b Gmail drafts (you send) · E14 research and loans · E15 release | UC-36, 37, 47 | No email sent by an agent (Gmail Sent check) · O6 benchmark published · O4 checklist passes · Windows installer (§11 #8) · terms re-checked (BR-80) · release notes · **G9 go/no-go** |

**Critical path:**
1. S0-1 (subscription runner).
2. The runner, trace and ledger (Sprint 1).
3. The permission engine: BR-82, M8 containment and M10 worktrees (Sprint 2).
4. The memory single writer and the checkpoint (Sprint 3).
5. The task board, handoff, session engine and auto-merge (Sprint 4).
6. Scenario #1 on the day-12 prerelease.
7. The benchmark and O4 (days 13 – 14).

Off the critical path, but risky: the browser agent (Sprint 3), Gmail (Sprint 5), loans (Sprint 5), and the curator and semantic search (Sprint 3).

**Pull-forward (decided, §11 #12, G2-Q12):** you already asked to run S0-1 early ([decisions-2](interviews/2026-10-22-decisions-2.md)), and you accepted running S0-1, SP-B1 and the M8 spike now, on `spike/` branches during Phase 0; G0 closes on their results. That takes day 1's risk out of the 14 days. Spikes aren't implementation, so this doesn't break the rule that nothing is built before Gate 6.

**Milestones and gates**
| Milestone | When | Gate |
|---|---|---|
| Feasibility | Before G6 (recommended) or Sprint 1 day 1 | Spike reports; your go/no-go closes G0. On failure, use the fallback in §10 |
| Re-plan checkpoint | Day 6 | Velocity and tokens per story vs. the remaining plan. If the trend misses day 14, the PM brings options (more lanes, re-sequencing, a later date). **No cut without a change request** |
| MVP prerelease | Day 12 | Scenario #1 end to end; UAT on the prerelease; dogfooding and O1 start |
| v0.1, open-source ready | Day 14 | O4 checklist and O6 benchmark; G9 |
| After v0.1 | — | Phone notifications, the embedded browser and Publish to Claude Docs, Claude Code depth (Phase 2), macOS/Linux packages |

### 9.1 Top 10 by value vs. effort vs. risk
| # | Item | Why it's here |
|---|---|---|
| 1 | S0-1 subscription runner spike | Everything runs on it; it's the riskiest assumption (AS-1). Cheap (≤ 1 day) |
| 2 | M9 version pin and contract test | Claude Code ships about 6 releases a week. A small story that protects #1 every day after |
| 3 | M8 shell containment spike | BR-49 and BR-86 make unattended writes normal, so this has to work before agents act on their own. Win 11 Home has no sandbox |
| 4 | SP-B1 browser agent spike | You accepted 1 – 2 days of risk; finding out on day 1 instead of day 9 limits it |
| 5 | Runner, Look inside and ledger | The glass box is the product's core; every later feature emits trace events into it |
| 6 | Usage meter and pause/resume at the limit | With no cap, a graceful wait is the only usage protection, and it runs every week |
| 7 | Runaway-bug guard (BR-79) | Small effort; prevents the week-burning cascade seen in the field (risk facts §1d) |
| 8 | Guided install and first run (UC-06) | The first impression, and the only path for people who clone the repo (O4, R10) |
| 9 | Permission engine: presets, ladder, reviewer check (BR-82) | Auto-merge is only safe on top of it, and it enforces "drafts only" and "no deletes" (CR-008) |
| 10 | What needs you overlay (BR-86) | Your main surface after the chat; it carries the "only what matters" promise |

## 10. Risks, assumptions and dependencies
| Risk / assumption | Impact | Likelihood | Mitigation / test |
|---|---|---|---|
| **Subscription policy and volume.** Anthropic moved third-party harnesses off subscriptions once (Apr 2026), then paused it. A no-cap, many-agent Bench looks like the pattern it acted against ([risk facts §1](../research/risk-facts-2026-10-23.md)) | High | Medium | ADR-0002 rules (no login, no tokens, strip `ANTHROPIC_API_KEY`). One responder by default. Idle agents use no tokens. Schedules ≥ 1 h and event triggers, with no 24/7 polling. Runaway guard (BR-79). API-key plan B (BR-80). Terms re-checked each release |
| **S0-1 fails** (no subscription auth via the SDK, or no per-agent isolation) | High | Low – Med | API-key mode becomes the agents' default (Max monthly API credits can fund it); you decide the economics. S0-3 failure → out-of-process MCP server. S0-2 failure → digest-only router |
| **Throughput limited by your own limits.** The developer agents building Bench share your subscription's 5-hour and weekly windows | High | High | Lanes sized from S0-1 and the meter. Sonnet for developers, Opus for design and review. A paused sprint's date doesn't move by itself; the PM proposes (R11). Re-plan on day 6 |
| **Automation errors:** a bad merge lands on `main` automatically (BR-86). **Revised v0.3:** a wrong email or post can no longer go out, because agents only save drafts and you send them; and nothing is deleted from the computer without you (CR-008) | High | Medium | Auto-merge stays off until BR-82's reviewer check and the CI gates ship (Sprint 2). Revert on every merge (M10 snapshots). The digest lists every automatic action and every new draft (BR-90). The permission engine blocks every send and every delete on the computer, with tests (BR-15, BR-58). Email and web content is data, never instructions (BR-20). Cost: you send each email by hand, and agents ask when a task needs a delete |
| **Shell containment on native Windows** (M8): no Windows Sandbox on Home | High | Medium | Day-1 spike: folder jail through `canUseTool` path checks, command allow-patterns, `disallowedTools`, a worktree per agent. Optional WSL2. Fallback: commands outside the allow-patterns become a question to you, at the cost of more tickets |
| **Browser agent** (UC-49): Playwright MCP under the SDK on Win 11 Home. With clicks and typing automatic (G2-Q3), a page can try to steer the agent | Medium | Medium | SP-B1 on day 1 (pulled forward, G2-Q12). Isolated profile per agent (BR-84). Page content is data (BR-20); sign-in to a new site, payments, deletes and sends still stop for you (BR-57, BR-58, BR-64). If it slips, it ships in v0.1.1 (about day 16) and day 14 holds (§11 #10, G2-Q10) |
| **Scope density and your review time:** 50 UCs plus the UI in 14 days, with one reviewer | High | Medium | Prototype v0.7 is the design reference. Demo slots of about 1 h on days 3, 6, 9, 12 and 14, at fixed times (§11 #9, G2-Q9). Ready to test in batches. The open-source lane runs from Sprint 1 |
| **Claude Code version churn** breaks the stream format or login | Medium | High | M9: pinned version and a contract test in CI; deliberate upgrades |
| **Benchmark** needs a working Bench and real usage late in the plan | Medium | Medium | Freeze the 3 tasks and the protocol at G6. Run on the day-12 prerelease. Publish whatever the result |
| **Licence contamination** (vendored skills, AGPL references) | Medium | Low | BR-85 packaging rules; licence check in CI and in O4 |
| Dependencies: Claude Code installed and signed in (guided, UC-06); Git/Node for development work; ADR-0001 Electron (accepted) | High | Low | Onboarding checks in Sprint 1 |

## 11. Open questions for G2
One merged list: the PM's questions plus BRD v1.1 §10 #36 – #40. Each had a recommendation.

**All 12 G2 questions are answered** *(G2-Q1 – G2-Q12, [g2-answers](interviews/2026-10-23-g2-answers.md))*. You accepted eight as recommended and answered four in your own words (#3 – #6). #4 matches the recommendation; #3, #5 and #6 changed the plan and are recorded in [CR-008](change-requests/CR-008.md). CR-008 opens three smaller questions in BRD v1.2 §10 #41 – #43 (the CEO's urgent email to you, where drafts show, Bench's own housekeeping); they're relayed separately and don't block G2.

| # | Question | Recommendation | Client answer | Source | Owner |
|---|---|---|---|---|---|
| 1 | Do **creating permanent agents or projects** and **deploy/release** still need you? (BR-86 doesn't name them; it also assumes that approving a proposal or a BRD counts as an "undecided decision") | **Yes, both stay with you**, and proposal/BRD approvals count as decisions | **As recommended.** Both stay with you; approving a proposal or a BRD is BR-86 kind 4 *(G2-Q1)* | BRD #36, BR-86 (4) | Client |
| 2 | With no cap and no pacing, does the **30 % target** survive in any form? | **Only as an information line on the usage meter; it never defers work** | **As recommended.** Information line on the meter only *(G2-Q2)* | BRD #37 (= PM Q1) | Client |
| 3 | The browser agent asks before clicks, typing and new sites (CR-004), but CR-007 made most things automatic. Keep that default? | **Ask before new sites and typing; act on clicks within sites you've allowed** | **Changed:** *"Only before logging in new websites."* It asks only before signing in to a site it hasn't signed in to before; browsing, clicks and typing are automatic; payments and deletes still need you; sends and posts stay drafts *(G2-Q3, CR-008)* | BRD #38 | Client |
| 4 | Models are picked automatically. Can you **pin a model** per agent? | **Automatic by default, with an optional pin per agent** | **As recommended:** *"Models are auto picked based on the complexity the agent is going to do, and can be optionally changed"* *(G2-Q4)* | BRD #39 (= PM Q3) | Client |
| 5 | What is an agent's **scratch area** (where it may delete without asking)? | **Files it created for its current task on its own branch or worktree, plus its own temp folder** | **Changed:** *"never delete files from computer by itself or delete a project or an app or major files."* No scratch area; every delete is yours (BR-58). PM reading `[confirm]`: removing a file in the agent's own worktree as part of a code change is an edit *(G2-Q5, CR-008)* | BRD #40 | Client |
| 6 | Should the **independent reviewer check also run before every automatic email or post**? (BR-82 runs it only before merges and the five client actions) | **Yes:** sends are the one automatic action that can't be reverted after 60 s | **Moot:** *"draft and add them to draft in email or the app that will post at only it never send or post alone."* Agents never send or post; they save drafts and you send. The 60 s undo is withdrawn *(G2-Q6, CR-008)* | PM, cross-check | Client / BA |
| 7 | Benchmark (O6): which 3 tasks, and what counts as a win? | **3 tasks from Bench's own backlog; Bench wins if it matches or beats acceptance and uses fewer of your hands-on minutes**; scored on acceptance, hands-on minutes, wall time and % of week | **As recommended** *(G2-Q7)* | PM, O6 | Client |
| 8 | Day 14: a Windows installer only, with macOS/Linux building in CI? | **Yes;** package the other OSes after v0.1 | **As recommended** *(G2-Q8)* | PM | Client |
| 9 | Can you hold about 1 h for the demo and UAT on days 3, 6, 9, 12 and 14? | **Yes**, at fixed times | **As recommended** *(G2-Q9)* | PM | Client |
| 10 | If the browser agent slips, do we ship it in v0.1.1 (about day 16) or move day 14? | **Keep day 14 and ship the browser agent in v0.1.1.** It's sequenced, not cut; you decide | **As recommended:** keep day 14; a slipped browser agent ships in v0.1.1. Sequenced, not cut *(G2-Q10)* | PM | Client |
| 11 | Does the agent's full screen show diff, files and terminal output **read-only**, with the interactive terminal and diff review in Phase 2? | **Yes** | **As recommended** *(G2-Q11)* | PM | Client |
| 12 | Run spikes S0-1, SP-B1 and M8 now, before G6, and close G0 on their results? | **Yes** | **As recommended** *(G2-Q12)* | PM | Client |

## 12. Sign-off
| Client | Decision | Date |
|---|---|---|
| | | |

---

## Appendix A. Epics and stories (drafts)
These are drafts using the `user_story.yml` fields; the PM creates the issues after G6.
- **Points** are ≤ 8 each; anything bigger is split. They aren't calibrated yet: about 81 / 86 / 79 / 75 / 31 points for Sprints 1 – 5 (Sprint 5 was 34 before drafts-only, CR-008). The front-loading is deliberate (risk first), and the day-6 re-plan rebalances against measured velocity.
- **Acceptance criteria** use G/W/T, short for Given/When/Then.
- **Design references** are routes in `direction.html` v0.7.
- **Every story also meets the DoD:** it emits trace events, it's visible in Look inside, and it has isolation tests where it touches memory or connectors.

### E0. Feasibility spikes (Sprint 1, day 1, or earlier) · `spike/` branches, timeboxed
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 0.1 | As the PM, I want to know if `query()` runs on your `claude login` with per-agent isolation, so the runner design holds | G no API key W a script runs Haiku and Opus T both answer; `system/init` lists only the MCP servers and skills passed (`strictMcpConfig`, `settingSources: []`); 3 parallel runs record rate-limit % and `resets_at`; context usage is readable for BR-78 | AS-1, BR-54, BR-78, ADR-0002 | 3 |
| 0.2 | As the PM, I want router economics measured, so group chat stays cheap | G 4 agents × 20 turns W broadcast vs rules + router + digest T token table in `docs/spikes/S0-2.md` | UC-10, BR-38 | 3 |
| 0.3 | As the tech lead, I want the in-process Bench MCP proven, so handoff and memory tools work | G agents A and B W A calls `handoff` / `ask_agent` T B answers in its own session; a memory read derives the agent id from the runner, not from an argument | UC-13, BR-69 | 3 |
| 0.4 | As the tech lead, I want `@playwright/mcp` proven under the SDK on Win 11 Home (SP-B1) | G one agent, a 10-step task on a test site W run headed with its own profile T screenshots in the stream, `canUseTool` pauses for Take over, tokens and wall time recorded | UC-49, BR-84 | 5 |
| 0.5 | As the tech lead, I want native-Windows shell containment proven (M8) | G an agent jailed to one folder W it tries an out-of-jail path, a non-allowed command and a symlink escape T all three are blocked and traced; overhead measured | UC-33 (M8 NFR note) | 5 |

### E1. Foundation and install (Sprint 1; the open-source lane continues to Sprint 5)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 1.1 | As a developer agent, I want the scaffold and CI from ADR-0003, so every lane builds the same way | G a clean clone W `pnpm bootstrap && pnpm check:all` T green on windows + ubuntu CI; module-boundary lint rules active | ADR-0001, ADR-0003, O4 | 5 |
| 1.2 | As you, I want first run to find or help install Claude Code and check sign-in, without Bench touching credentials | G Claude Code missing or signed out W first run T a copyable install/`claude login` command and **Check again**; Bench never reads `~/.claude/.credentials.json` (test) · `#first-run` | UC-06, BR-54 | 5 |
| 1.3 | As you, I want `ANTHROPIC_API_KEY` ignored unless API-key mode is on, and API-key mode as an opt-in in Settings › Account | G the env var is set W an agent runs T it isn't passed; the first-run note shows only when the var exists; API-key mode is off by default; its key is in the OS keychain; no API nudge at the limit | BR-80, BR-54, §8.5 | 3 |
| 1.4 | As the tech lead, I want the Claude Code version pinned and a contract test for login and the stream format (M9) | G the pinned version W CI runs T the contract test passes; an unpinned upgrade fails CI | M9 (engineering rule; SRS) | 3 |
| 1.5 | As you, I want dark by default, plus Light and Match system, in the brand type, with the three sounds | G first launch T a dark charcoal theme; Settings › Appearance switches live; Instrument Sans and JetBrains Mono bundled; sounds on with a mute; nothing plays before your first input · `#settings` | BR-88, BR-89, BR-87 | 5 |
| 1.6 | As a person cloning the repo, I want the README, the licence check and the secret scan from day 1 (O4 lane) | G any PR W CI runs T gitleaks and the third-party licence check pass; the README covers install, the `claude login` prerequisite and the build | O4, BR-85 | 3 |

### E2. Atlas chat (Sprint 1; 2.3 in Sprint 4)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 2.1 | As you, I want first run to name Atlas and pick its look, with Atlas waking as the live preview | G step 3 W I change the name, shape or colour T the face repaints with a blink; the model is Automatic (not asked); step 4 preselects "Just Atlas for now" · `#first-run-name` | UC-06, BR-01, BR-81, BR-92 | 5 |
| 2.2 | As you, I want Home to be the chat with Atlas, streaming, with Stop always there | G Home W I send T "Sent" within 400 ms, a thinking line, a streamed reply; Stop ends the run mid-way and keeps the partial result · `#home` | UC-08, UC-27 | 5 |
| 2.3 | As you, I want to reply to a whole message or to selected words in any chat | G a message W hover/R/right-click › Reply, or select text › Reply T the preview joins the composer; the sent quote jumps back to the original (or the exact words) · `#reply-selection`, `#reply-sent` | UC-08 – UC-10, BR-91 | 5 |
| 2.4 | As you, I want each message to show its receipt (time · tokens · % of your week · Look inside) | G any agent message T the receipt shows on the latest message per sender and on hover for the rest; no dollar figure (UXA-D4) | UC-28, BR-39, V-07 | 2 |

### E3. Glass box, usage and runaway guard (Sprint 1)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 3.1 | As the system, I want an agent runner that wraps `query()` with per-agent options and SQLite persistence and resume | G an agent file W a run starts T model, systemPrompt, mcpServers + `strictMcpConfig`, tools, skills, `settingSources: []`, cwd and resume are applied; a session resumes after restart | UC-08, ARCHITECTURE | 8 |
| 3.2 | As you, I want Look inside on any run: steps, tool calls, files, the memory, skills and connectors loaded this turn, the model and why, and tokens | G a finished run W Look inside T every step with its tokens and what was loaded · `#trace` | UC-28, V-06, BR-78, BR-81 | 5 |
| 3.3 | As you, I want the week ring and the Usage page with the 5-hour and weekly windows, the forecast, per-agent use, and the pre-run estimate before big runs | G runs this week T used %, `resets_at` and the forecast; per agent for information only; the estimate never blocks (BR-93); a 30 % line for information only, never deferring work (§11 #2, G2-Q2) · `#usage` | UC-40, UC-41, V-08, BR-93 | 5 |
| 3.4 | As you, I want work to wait at the limit and resume by itself, told by Atlas | G the limit is hit W runs are active T they're saved and paused; Atlas leads with "your week is used up… resume Mon 09:00; nothing is lost"; they resume after `resets_at`; extra usage is never turned on, and there's no silent API fallback · `#usage-limit`, `#limit-reset` | UC-42, BR-50, BR-80 | 5 |
| 3.5 | As you, I want a runaway bug stopped automatically, never a throttle | G an agent spawns > 20 helpers in a minute or loops on the same step W the guard trips T that agent and its helpers stop, its work is saved, Atlas tells you why, and V-26 shows the event; other agents continue | UC-41, BR-79, V-26 | 3 |

### E4. Team and projects (Sprint 2; 4.7 and 4.10 in Sprint 4)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 4.1 | As you, I want to create a project by hand (name, goal, team preselected "Product + Dev team · Atlas recommends") or through Atlas | G New project W I fill Name and Create T the project, its team chat, the dashboard shell and its own agent copies with personal names exist · `#new-project` | UC-43, BR-62, BR-12 | 5 |
| 4.2 | As you, I want each project to have its own team tree, plus a company level with Atlas and your own agents | G a project W I open Team T its tree with leads, members and live states; the company level lists only Atlas, your agents and the projects | UC-01, BR-02, BR-03, V-03 | 5 |
| 4.3 | As you, I want to create an agent from one sentence, with an editable name, an optional title and a look (colour × shape, unique in the project) | G New agent W Atlas drafts it T I rename it in place, add a title, change its shape or colour (used pairs dimmed); Create saves it · `#new-agent` | UC-02, BR-08, BR-12, BR-92 | 5 |
| 4.4 | As you, I want every agent's face or name to open its panel on Settings › Profile, with one settings component for all agents, Atlas included | G any chat W I click the face or name T the panel opens on Profile; Atlas's profile says what makes it special and that it can't be paused or deleted; settings save as you go, with Undo · `#atlas-profile`, `#agent-settings` | UC-04, UC-03, BR-01 | 5 |
| 4.5 | As you, I want the agent panel closed by default: screen preview and routines, settings behind the gear | G an agent chat T chat only; the screen icon opens a 360 px panel; empty states are one line · `#agent-panel`, `#agent-screen` | UC-27, V-05 | 3 |
| 4.6 | As you, I want agent lifecycle (pause, archive, duplicate without memory, delete), with open tasks returning to the lead | G an agent with open tasks W I pause it T its tasks go to its lead; delete is yours only and asks once | UC-03, BR-09, BR-10, BR-58 | 3 |
| 4.7 | As you, I want links between agents and teams (leads by default; members may ask questions) | G a team → team link W a member asks across it T it's a question, not a task; tasks go through the leads | UC-05, BR-06 | 3 |
| 4.8 | As you, I want the day-1 team template and direct chat with any agent (logged for its lead) | G first project W created from the template T the default delivery team exists; I can message any agent and its lead sees it | UC-06, UC-09, BR-07 | 3 |
| 4.9 | As you, I want each task's model picked automatically by its complexity (light → Haiku/Sonnet, heavy → Opus), and to change an agent's model if I want | G a task W it starts T the model is chosen and shown with its reason in the receipt and trace; G I set an agent's model in Settings › Model T every task uses it until I set it back to Automatic (§11 #4, G2-Q4) | BR-81, `config/models.yaml` | 3 |
| 4.10 | As you, I want an @-mention picker in every composer | G `@` W I pick an agent T a pill in the draft and a chip in the message; a mention-only draft can't be sent · `#team-mention` | UC-08 – UC-10, BR-91 | 3 |

### E5. Autonomy and What needs you (Sprint 2)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 5.1 | As you, I want the presets **Ask every time · Trusted (default) · Autonomous**, with per-tool overrides and grants | G a new agent T Trusted edits, commits, tests and opens PRs in granted folders; "Always asks you" lists the five kinds, locked · `#agent-settings-autonomy` | UC-22, BR-16, BR-86 | 5 |
| 5.2 | As the system, I want a 4-level approval ladder per action type, and an independent reviewer check agents can't edit, with a circuit breaker after repeated denials | G a merge W the reviewer check fails T the merge is blocked and traced; after 3 denials of the same kind, the agent stops asking and its lead is told | UC-22, UC-23, UC-33, BR-82, BR-14 | 8 |
| 5.3 | As you, I want What needs you as an overlay over any screen, grouped **Decide · Test · Answer**, with "Decided by Atlas" (Undo/Revert) | G tickets W I open the count or Atlas's "Show them" T only the five kinds, the top one open, one blue button; resolving a ticket anywhere clears it everywhere; FYI is a quiet line in Atlas's chat, not counted · `#needs` | UC-23, UC-25, V-01, BR-36, BR-86 | 8 |
| 5.4 | As you, I want notifications by grammar: needs you = toast + one repeat + sound; done = badge + sound; handoff = sound | G a new ticket W I'm on another screen T one toast, one repeat, the needs-you sound; mute in Settings | UC-29, BR-40, BR-89 | 3 |
| 5.5 | As you, I want a standing-grant suggestion after 3 identical allows (never for destructive or payment actions) | G I allowed the same pattern 3 times T a one-time suggestion that states the scope and where to revoke it | UC-22, UC-23 (R7, UXA-D3) | 2 |
| 5.6 | As you, I want payments never done by an agent: anything that costs money becomes a Decide ticket with its price | G an agent needs a paid service W it asks T a payment ticket; no setting can lift this | BR-57, BR-86 | 2 |

### E6. Safe execution (Sprint 2)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 6.1 | As you, I want to grant folders and repos per agent | G a grant W the agent reads or writes outside it T blocked and traced; isolation test A ↛ B | UC-32, BR-43 | 3 |
| 6.2 | As an agent, I want to edit files and run commands inside my jail, with command allow-patterns (M8) | G Trusted W an allowed command runs in the jail T it runs without asking; a non-allowed or out-of-jail one is blocked or becomes a question | UC-33 (M8 NFR note), BR-17 | 8 |
| 6.3 | As the system, I want a git worktree per developer agent and a per-turn snapshot (M10), so any turn and any merge can be reverted | G a developer turn W it ends T a snapshot exists; Revert restores it, including shell edits | UC-33, UC-34, UC-50 (M10 NFR note) | 5 |
| 6.4 | As you, I want every delete on the computer (files, folders, projects, apps) to come to me, showing the file count and "can't be undone from Bench" | G an agent wants to delete `e2e/legacy/` T a Decide ticket with Delete N files / Keep them; keeping saves a lesson; G it wants to delete a file it created itself T the same ticket (no scratch area, §11 #5, G2-Q5); G a code change on its branch removes a file in its own worktree T it's part of the commit, no ticket `[confirm, CR-008 PM reading]` · `#approval-denied` | BR-58, BR-86, CR-008 | 2 |

### E7. Connectors and skills (Sprint 2)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 7.1 | As you, I want each agent to get only the connectors, plugins and skills ticked for it, from your Claude Code inventory | G an agent with GitHub only W it runs T `system/init` shows only GitHub (isolation test) | UC-35, BR-47 | 5 |
| 7.2 | As you, I want the built-in skill library, with role defaults and a switch per agent, shipped with its licences and pinned | G a new Developer T its default skills include `engineering-craft`; each skill can be switched off; NOTICE files ship; no hooks, installers or `@latest` | UC-02, UC-35, BR-85 | 5 |

### E8. Bench Memory (Sprint 3)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 8.1 | As the system, I want notes on disk, the index and the single writer, with provenance | G any write W from an agent, the curator or the app T it goes through the single writer, which checks the scope and records the source; disk edits are re-indexed | UC-18, BR-67 – BR-70 | 8 |
| 8.2 | As an agent, I want memory tools (search, read, build_context, recent, write) that take my id from the runner | G agent A W it searches T it never sees B's private notes (isolation test); notes are data, never instructions | UC-45, BR-69, BR-71 | 5 |
| 8.3 | As you, I want work logs written automatically and the lazy roll-up | G a task finishes T a work-log line with no LLM call; a lead re-summarises only when asked and the log changed | UC-18, UC-19, BR-24 – BR-26 | 3 |
| 8.4 | As you, I want global-memory writes as proposals, with Atlas approving preference notes about you by default, each with Undo and Forget | G an agent learns a preference T Atlas approves it, and it's listed with Undo/Forget | UC-20, BR-27 (R6) | 3 |
| 8.5 | As you, I want the memory browser: editor, backlinks, graph, filters, stale flags | G Memory W I open a note T backlinks and the graph; "Your team knows N things about how you work" · `#memory` | UC-21, UC-44, V-10 | 8 |
| 8.6 | As you, I want local semantic search, hybrid with full text, with nothing leaving the device | G a query by meaning T relevant notes appear; no network call for indexing | UC-45, BR-72 | 5 |
| 8.7 | As the system, I want the curator to dedupe, merge and flag stale notes without deleting | G duplicates W the curator runs T they're merged within one scope, the originals archived; its cost shows as a system line | UC-46, BR-73, V-20 | 5 |

### E9. Context and intelligence (Sprint 3)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 9.1 | As you, I want a context meter per agent (in the panel, and in the chat from 60 %) and a New session button | G an agent at 61 % T the meter shows in the chat; New session starts fresh through the checkpoint | UC-27, BR-78, V-22 | 3 |
| 9.2 | As an agent, I want the context checkpoint: threshold, natural breakpoint, 90 % ceiling, 8-section check, fresh session | G the threshold (80 % default) is reached W at the next breakpoint T the checkpoint has all 8 sections; the fresh session states its next step; the old transcript is archived · `#agent-checkpoint` | BR-66, UC-42 A3, §8.6 | 8 |
| 9.3 | As you, I want visible learning: the Ledger, Applied chips, learned lines with Undo, and Markdown export | G an agent applies a lesson T an Applied chip with its source; the Ledger counts tick | UC-20, UC-21 (intelligence layer) | 5 |

### E10. Routines and runtime (Sprint 3)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 10.1 | As you, I want a routine to be any task the agent can do, on a schedule, under its own autonomy | G "every weekday at 08:00 …" W I save T a parsed draft, a Read-only / Can edit files badge from its permissions, the pre-run estimate; the five kinds still wait for you | UC-38, BR-49, BR-93, V-14 | 5 |
| 10.2 | As you, I want Bench in the tray, the PC kept awake while work is queued, and missed routines caught up | G the window is closed and work is queued T the PC doesn't sleep; a run missed while off runs at the next launch; Quit stops everything | UC-38, BR-76, §10.1 #10 | 5 |
| 10.3 | As you, I want the morning status from Atlas when you first open Bench in the day | G first open of the day T one Atlas message: what moved and what needs you, with Show them | UC-25, V-02, BR-26 | 3 |

### E11. Browser agent and deliverables (11a: Sprint 3 · 11b: Sprint 4)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 11.1 | As you, I want an opt-in browser per agent with its own isolated profile that asks me only before signing in to a site it hasn't signed in to before | G browser on for one agent W it navigates to a new site, clicks and types T it doesn't ask, and every step is traced; W it reaches the sign-in of a site it never signed in to T it asks first; W a form would send or post T it stops and leaves a draft (§11 #3, G2-Q3, CR-008); other agents have no browser tools (isolation); no unattended routine use without your opt-in | UC-49, BR-84, BR-64 | 8 |
| 11.2 | As you, I want Take over / I'm done, a live view, and screenshots kept locally for 30 days | G a login page W the agent asks for Take over T you type credentials yourself; the agent continues from your changes after I'm done; screenshots expire after 30 days · `#agent-takeover` | UC-49, BR-84, V-24 | 5 |
| 11.3 | As you, I want agents to produce docs, slides, designs and dashboards as local files, rendered live in the panel and exported to PDF/PPTX | G an agent writes a deck T it renders live in the screen view; Export makes a PDF/PPTX; MIT/Apache renderers only | UC-48, BR-83, V-23 | 8 |

### E12. Delivery department (Sprint 4)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 12.1 | As you, I want to pitch an idea to Atlas and approve or reject a one-pager before a project is created | G an idea W Atlas understands it T a one-pager Decide ticket; approve → project preview → Create | UC-12, BR-61, V-19 | 5 |
| 12.2 | As you, I want group chats and the project team chat, where the router picks one responder, an @-mention picks who, and a reply goes to the agent you replied to | G team chat W I reply to Karim T Karim answers with no "Bench picked" line; an @-mention overrides · `#reply`, `#team` | UC-10, BR-41, BR-91 | 5 |
| 12.3 | As you, I want timeboxed debates (5 min, the highest rank decides, memo kept, transcript archived) | G a disagreement T a debate line on Home with Watch, and a memo at the end; an undecided debate becomes a Decide ticket | UC-11, BR-59, BR-60, BR-86 | 5 |
| 12.4 | As you, I want the Reverse Engineer to tear down named competitors before the BRD comes to you (skippable per project) | G a BRD draft W the teardown runs (≤ 3 products, Sonnet) T a finding ledger, Steal/Avoid/Beat and proposed items; public evidence only | UC-51, BR-77, V-27 | 5 |
| 12.5 | As you, I want BA interview sessions and requirement documents in the project folder | G "The BA wants to meet you" (an Answer ticket) W the session runs T notes are saved and the documents produced | UC-30, UC-15, BR-42 | 5 |
| 12.6 | As the PM agent, I want epics, stories and tasks, with a sprint, on the project dashboard | G approved documents T a backlog and a sprint on the dashboard, with a fixed layout; a paused sprint's date doesn't move by itself (R11) · `#project-bench` | UC-16, UC-26, BR-63 | 8 |
| 12.7 | As an agent, I want structured handoffs down the tree and escalation after 2 failed attempts | G a handoff T the receiver gets the brief, never the transcript; 2 failures → lead → a Decide ticket if still unresolved | UC-13, UC-14, UC-17, BR-29, BR-34 | 5 |
| 12.8 | As you, I want a Ready to test ticket with how to test in ≤ 3 steps, then accept or reject | G a merged piece of work T Start testing; my notes become feedback; accept → Accepted (O2); reject → back with my comment · `#ready-to-test` | UC-24, UC-31, BR-31, BR-86 | 5 |
| 12.9 | As you, I want freelancers and a write lock per folder | G two writers on a folder T one writes and the other queues; your own edits pause the agent (BR-45, BR-46); freelancers show under their hirer | UC-07, UC-34, BR-13, BR-44 | 5 |

### E13. Automation and safety net (13a: Sprint 4 · 13b: Sprint 5)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 13.1 | As you, I want commits, pushes, PRs and merges to `main` to happen by themselves once CI is green and the reviewer check passes, with Revert | G a PR W CI green and the reviewer check passes T it merges; a quiet line in the chat and in "Decided by Atlas" with Revert; Revert restores `main` | UC-14, UC-50, BR-82, BR-90, BR-58 | 8 |
| 13.2 | As you, I want an end-of-day digest of every automatic action and every new draft | G a day with automatic actions and drafts T one digest message from Atlas, each item with Look inside, Revert on merges, and each draft with where it's saved (CR-008) | UC-50, BR-90, V-25 | 3 |
| 13.3 | As you, I want Atlas to triage Gmail and leave its replies in my Gmail drafts, never sending them | G triage finds 4 emails needing a reply W it runs T 4 drafts are in Gmail's Drafts, nothing is in Sent, each draft is logged with full text, recipient and agent (V-12) and listed in the digest; no setting, grant or Deputy decision can make an agent send (§11 #6, G2-Q6, CR-008) | UC-37, UC-50, BR-15, BR-48, BR-64, BR-65, BR-90 | 5 |

### E14. Research and loans (Sprint 5)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 14.1 | As a lead, I want a freelancer to produce a research report | G a research request T a report with sources in the documents folder; its usage shows under the hirer | UC-36, BR-13, BR-53 | 3 |
| 14.2 | As a lead, I want to borrow an agent as a loan copy and merge it back | G a loan approved by the owning lead T checkpoint (save only), copy, tasks, merge-back, delete; no duplicates | UC-47, BR-74, BR-75, V-21 | 8 |

### E15. Release v0.1 (Sprint 5)
| ID | Story | Acceptance criteria | Traces | Pts |
|---|---|---|---|---|
| 15.1 | As you, I want the head-to-head benchmark run and published | G the 3 frozen tasks W run by Bench and by one Claude Code session T a results table in the README, scored per §11 #7 | O6 | 5 |
| 15.2 | As you, I want the O4 checklist passed and a Windows installer | G a clean clone T it builds in CI; the checklist is green; the installer works on a clean profile; terms re-checked | O4, BR-80 | 5 |
| 15.3 | As QA, I want the security and hardening pass, with Playwright e2e for onboarding, chat and the What needs you overlay | G the release candidate T e2e green; the security baseline checklist is done | security-baseline, CLAUDE.md testing | 5 |

---

## Appendix B. Cross-check with BRD v1.1 (re-checked against v1.2)
The draft PRD v0.2 used placeholder labels BA-1 – BA-24. Each one now maps to a BRD v1.1 ID, or stays open as noted. **v0.3:** re-checked against BRD v1.2 (CR-008 and G2 answers); the status column says where an item changed.

| Was | Now (BRD v1.1) | Status |
|---|---|---|
| BA-1 terminology | BR-01 (main agent, default name Atlas), BR-87 (second-person voice) | Covered |
| BA-2 five kinds | BR-86; BR-14, 15, 17, 36, 58 revised; AS-7, AS-8; V-01, V-12 | Covered. BR-86 (4) confirmed (G2-Q1, BRD v1.2); every delete on the computer is kind (1) (CR-008) |
| BA-3 automatic sending | **Replaced by drafts only** (BRD v1.2: BR-15, BR-48, BR-64, BR-65 revised; the "Ask me before sending" switch withdrawn) | Covered by CR-008: agents never send; you send from the draft |
| BA-4 safety net | BR-90 (revised v1.2: digest with new drafts, merge revert; send undo withdrawn), **UC-50** (renamed), V-25 | Covered |
| BA-5 ladder and reviewer check | BR-82 | Covered. The reviewer check before automatic sends is **moot**: there are no automatic sends (§11 #6, G2-Q6) |
| BA-6 runaway guard | BR-79, UC-41 (renamed), V-26 | Covered |
| BA-7 no cap | O3 revised; BR-52, AS-3, V-16 retired; BR-93 | Covered; the 30 % line is information only (§11 #2, G2-Q2) |
| BA-8 model per task | BR-81 (revised v1.2) | Covered; Automatic by complexity, optionally changed per agent (§11 #4, G2-Q4) |
| BA-9 keep-awake, catch-up | BR-76 revised | Covered |
| BA-10 guided install, API-key mode | UC-06 (renamed "First run"), BR-80 | Covered |
| BA-11 benchmark | **O6** (scoring added in BRD v1.2) | Covered; scoring decided (§11 #7, G2-Q7) |
| BA-12 routines | BR-49 revised, BR-93, V-14 | Covered |
| BA-13 projects, avatars, titles | UC-43, BR-12, BR-92 | Covered |
| BA-14 teardown | **UC-51**, BR-77, V-27 | Covered |
| BA-15 skill library | BR-85 | Covered |
| BA-16 deliverables, browser | **UC-48**, **UC-49**, BR-83, BR-84 (revised v1.2), V-23, V-24 | Covered; the browser asks only before signing in to a new site (§11 #3, G2-Q3) |
| BA-17 context visibility | BR-78, V-22 | Covered |
| BA-18 M8, M9, M10 | NFR notes in UC-32 – UC-34 and UC-50; M9 is an engineering rule with no BRD change | Covered (the SRS sets the NFRs) |
| BA-19 notifications, sounds, no phone | BR-40 revised, BR-89; §2 Out of scope | Covered |
| BA-20 mentions and replies | BR-91 | Covered |
| BA-21 R6, R7, R11 | UC-20, UC-22/23, UC-16 (no new BR) | Covered |
| BA-22 first-run targets, M6 | UC-06 | Covered |
| BA-23 dark first, positioning | BR-88; BRD §1 Positioning | Covered |
| BA-24 checkpoint threshold (70 % vs 80 %) | BR-66 keeps the 80 % default (50 – 85 %) | **Not covered in the BRD; it's a design fix.** The Laws of UX audit and prototype copy say "the 70 % checkpoint" and should be corrected to the agent's threshold (80 % by default). Story 9.2 uses 80 % |

**BRD/PRD conflicts found** (status in v0.3):
1. **Reviewer check before automatic sends.** BR-82 runs it only before merges and the five client actions, so automatic emails and posts passed with no independent check. → §11 #6. **Resolved (moot):** agents never send (G2-Q6, CR-008).
2. **Browser asking default vs CR-007.** BR-84 kept "ask on clicks, typing and new sites". → §11 #3 (BRD #38). **Resolved:** asks only before signing in to a new site (G2-Q3, BR-84 revised v1.2).
3. **Creating agents and projects, and deploy/release.** BR-58 still reserves them, but BR-86 doesn't list them among the five kinds. → §11 #1 (BRD #36). **Resolved:** both stay with you; proposal and BRD approvals are kind 4 (G2-Q1). How creating agents and deploying reach you inside the five kinds is a BRD v1.2 assumption (BR-86).
4. **Checkpoint threshold.** The prototype and audit say 70 %; BR-66 says 80 %. A design copy fix (above).
5. **UC-41's sprint.** The draft placed it in Sprint 3. The rename to "stop runaway loops" (BR-79) and the meter tie it to Sprint 1, so it moved there.
