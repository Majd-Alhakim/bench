# Product Requirements Document (PRD): Bench (codename)

| Status | Version | Date | Owner | Approver | Upstream |
|---|---|---|---|---|---|
| Draft | 0.1 | 2026-10-22 | Product Manager | Client | [BRD v1.0](BRD.md) (Baselined, G1 2026-10-22) |

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-22 | PM | First draft (lean mode). No scope cut (D1); 46 use cases grouped into capability blocks and sequenced into five sprints over 14 days |

Lean mode: this PRD links to BRD IDs (UC, BR, O, V, S) and does not repeat them. BRD §10.1 defaults carry over unchanged. We revisit them against the prototype.

## 1. Summary
Bench is a Windows-first desktop app where the founder runs **a full delivery department of Claude agents** on their own Claude subscription. It has a CEO agent, an org tree of named agents with their own models, memory and connectors, group and meeting sessions, and delegation from idea to delivered product. Every step, token and file stays visible and editable (BRD §1, S1–S10). The founder is the only user. We build Bench now because the founder's day job (BA), personal projects (aspiring PM) and development work are bottlenecked on one-session-at-a-time Claude use. The target is **open-source ready 14 days after build start (G6)** (O4).

## 2. Problem and evidence
- **Problem:** with one session, the founder routes every role by hand, copies context between chats, and nobody remembers decisions. Multi-agent products feel like a team, but you can't see what they did, why, or what it cost (BRD §1, §5.1; [VISION §2](../VISION.md)).
- **Evidence:** interviews B1–B7 ([users and roles](interviews/2026-10-21-users-and-roles.md), [goals and scenarios](interviews/2026-10-21-goals-and-scenarios.md), [BRD open issues](interviews/2026-10-22-brd-open-issues.md)). Competitor gaps: no model per bot, hidden memory, shared connectors, surprise cost ([competitive brief §2–§5](../research/competitive-brief.md)). Token economics: route, filter and externalize instead of broadcasting ([multi-agent efficiency](../research/multi-agent-efficiency.md)). Memory: just-in-time retrieval of small linked notes ([memory vault](../research/memory-vault.md)). Subscription auth is allowed through the unmodified Claude Code binary ([auth research](../research/anthropic-repos-and-auth.md), [ADR-0002](../adr/0002-auth-subscription-vs-api-key.md)).

## 3. Goals and non-goals
- **Goals:** BRD objectives **O1–O5**. Targets and measurements are in §8.
- **Non-goals (this release):** everything in BRD §2 "Out of scope". In particular, Claude Code depth (diff review UI, integrated terminal, slash commands) and the mobile companion are **Phase 2**. The content pipeline (UC-39, retired) can come later as a project template. Multi-user, cloud sync, marketplace, non-Anthropic models and voice are also out.

## 4. Target users and personas
- **Primary and only persona:** the **founder**: BA by day, aspiring PM on personal projects, and a developer. Owner of the business; the CEO agent runs it for them (BRD §3).
- UX personas and journeys: `docs/design/ux/` (Phase 4, drafted in parallel with this PRD).

## 5. Jobs to be done and key scenarios
| When … | I want to … | so I can … | Use cases |
|---|---|---|---|
| I have an idea | pitch it to the CEO and approve a one-pager before a team runs with it | get from idea to delivered product without routing each role | UC-12, UC-43, UC-13, UC-15, UC-16, UC-30, UC-31, UC-24 |
| I need a feature built | delegate it to the Dev team with scoped repo access and approvals | get real code on a branch and a PR | UC-14, UC-32, UC-33, UC-34, UC-22, UC-23 |
| I open Bench in the morning | see status and "what needs me" (approvals, flagged emails, drafts) | act on only what needs me | UC-25, UC-19, UC-23, UC-37, UC-29 |
| something is running | watch any agent, its trace and its cost, and stop or redirect it | trust the work and never be surprised | UC-27, UC-28, UC-40, UC-26 |
| agents disagree or get stuck | hold a timeboxed debate, or have it escalate to me | get a decision with a memo, not a loop | UC-11, UC-17 |
| I shape my company | build the tree, create agents, set links, connectors and autonomy | have the right team at the cheapest capable model | UC-01–UC-07, UC-35, UC-47 |
| work accumulates | have memory log, roll up, stay clean and stay searchable | let agents get smarter and cheaper over time | UC-18–UC-21, UC-44–UC-46 |
| I use my subscription for everything | keep ≥ 30 % weekly headroom, with work pausing safely at the limit | keep Bench from crowding out my normal Claude use | UC-40–UC-42 |
| chores recur | run routines, research reports and Gmail triage in the background | let personal work happen without me | UC-36–UC-38 |

## 6. Scope: no MVP cut, capability blocks
**Client decision D1 (2026-10-22): no scope cut.** All 46 active Must use cases are in the MVP (UC-47 is Must per the BRD index). Instead of cutting, we group the work into **capability blocks**. §9 orders them by dependency.

| Block | Capability (BRD S#) | Use cases | MVP | Later | Sprint | Why here |
|---|---|---|---|---|---|---|
| A | Glass-box skeleton: CEO chat, live view, trace, usage meter, pause at limit (S2, S7, S9) | UC-08, UC-27, UC-28, UC-40, UC-42 | All | — | 1 | Proves the riskiest assumption (A1/S0-1) and gives every later block its runner, trace and cost ledger |
| B | Team and guardrails: tree, agents, links, connectors, autonomy, approvals, file and shell access, notifications (S1, S4, S6) | UC-01–UC-06, UC-09, UC-22, UC-23, UC-29, UC-32, UC-33, UC-35 | All | — | 2 | Agents and safe execution must exist before memory, delegation or integrations |
| C | Bench Memory (all six layers) + context checkpoint + morning status + headroom guard + routines (S5, S7, S8, S9, S10) | UC-18–UC-21, UC-25, UC-38, UC-41, UC-44–UC-46 | All | — | 3 | Delegation writes work logs and roll-ups; the checkpoint (BR-66) and loans (UC-47) depend on it |
| D | Delegation, groups, scenario #1 (S2, S3, S4, S6, S7) | UC-07, UC-10–UC-17, UC-24, UC-26, UC-30, UC-31, UC-34, UC-43 | All | — | 4 | Composes blocks A–C. Three shared primitives: **session engine** (10, 11, 30, 31), **task board and handoff** (13, 14, 16, 17, 24, 26, 34, 07), **project template** (12, 43, 15) |
| E | Integrations and loans (S1, S8) + open-source readiness (O4) | UC-36, UC-37, UC-47 | All | — | 5 | Built on connectors (B), routines (C), checkpoint and merge-back (C) |
| — | Claude Code depth, mobile companion, content-pipeline template | — | — | Phase 2 / v1 | — | BRD §2 Out of scope |

Coverage check: 5 + 13 + 10 + 15 + 3 = **46 use cases**. The tray rule (BR-76) ships with UC-38. The checkpoint path of UC-42 (A3) ships in Sprint 3.

## 7. Experience principles
| Principle | What it means in the product | How we check it |
|---|---|---|
| **Glass box** | Every run, tool call, file, approval, token and cost can be seen and replayed. No hidden prompts | Any action at a demo can be traced to its run (UC-28, V-05–V-07) |
| **The CEO runs the business** | The CEO is the front door: intake, status, email, routing, Deputy, all within the reserved actions (BR-58), never paying (BR-57) | The client starts every flow in the CEO chat (UC-08, UC-12, UC-25) |
| **See-everything control** | The client can enter any chat, agent or dashboard, then stop, redirect, approve or reject | Stop and redirect work on any running agent (UC-27). "What needs me" is complete (V-01) |
| **Cheapest capable model** | Model per agent; routing, digests and the curator run on the cheap tier; checkpoint instead of bloated context | Tokens per accepted task trends down (V-09) |
| **Files are the source of truth** | Agents, org, memory and checkpoints are Markdown/YAML on disk, Obsidian-compatible; the index is rebuildable | Editing a file on disk changes Bench's behaviour (BR-67, BR-68) |
| **A delivery department that feels alive** | Who is working on what is visible live; agents notify, meet, debate and show work | Org view shows live states (V-03); "We have something to show you" arrives (UC-29, UC-31) |

## 8. Success metrics
| # | Metric (target) | Type | How it is measured |
|---|---|---|---|
| O2 | **≥ 10 tasks/week** accepted without redo | **North star** | Count of tasks entering *Accepted* per ISO week (UC-24), shown in the objectives view (V-09) |
| O1 | Daily use for 14 days in a row | Input | Days with ≥ 1 client session, from Bench's local session log (BRD §10.1 #9). Streak shown in V-09 |
| O3a | **≥ 30 %** of the weekly limit left free | Guardrail | Usage meter's weekly forecast and actuals (UC-40, UC-41, V-08, V-16) |
| O3b | **Zero** unapproved outward or destructive actions | Guardrail | Approval log and outward-actions log (V-11, V-12) reconciled against the trace. Any outward action without an approver entry counts as a breach |
| — | Tokens per accepted task (trend down) | Guardrail | Ledger tokens for an accepted task's runs, divided by the number of accepted tasks (V-09) |
| O4 | Bench open-source ready on **day 14 after G6** | Delivery | G6 date vs. the date the checklist passes: **licence file, README (install, `claude login` prerequisite, build), build from source on a clean clone in CI, secret scan clean, third-party licence check (no copied AGPL or unlicensed code), no "Claude Code" naming or branding (ADR-0002)** |
| O5 | Products Bench builds: full working product in **14 days** | Outcome | Project start date vs. the client accepting the product (BR-35). Shown as project age in V-09 |
| — | Build velocity (points and tokens per accepted story) | Delivery health | Sprint reviews (LIFECYCLE). Re-measured after Sprint 2 |

## 9. Release plan
Build start = G6 approval = **day 1**. Sprints are 3 days and goal-boxed. Sprint 5 is a 2-day release sprint that ends on day 14. Each sprint runs **parallel developer agents in lanes**: one task = one branch = one PR. Lane count (expected 3–5) is set from the S0-1 parallel-run measurement and the current weekly headroom. Day 1 morning of each sprint is planning; the last day is demo and retro.

| Sprint | Days | Demo goal (client-verifiable) | Use cases | Parallel lanes | Depends on |
|---|---|---|---|---|---|
| **1: Walking skeleton** | 1–3 | "On Windows I chat with the CEO, watch every tool call, token and the plan-usage meter live, stop it mid-run, and see a run pause and resume at the usage limit." | UC-08, 27, 28, 40, 42 | **Day 1: spikes S0-1, S0-2, S0-3 (go/no-go)** · scaffold + CI · onboarding (`claude login` detect) + agent runner · chat + live view · trace + ledger + meter | Spike results |
| **2: The team** | 4–6 | "I load the day-1 org, create an agent with its own model, connectors and folder, message it directly, and approve or deny its first risky command from the approval inbox." | UC-01–06, 09, 22, 23, 29, 32, 33, 35 | Tree + agent editor + lifecycle · links + template · autonomy + approval inbox + notifications · folder grants + file/shell · connector/skill inventory | S1 runner, ledger |
| **3: Bench Memory** | 7–9 | "An agent's work lands in team memory by itself, I find it by keyword and by meaning in the graph view, an agent restarts cleanly after a context checkpoint, and the CEO gives me the morning status and 'what needs me' on a routine." | UC-18–21, 25, 38, 41, 44–46 | Notes + index + memory tools (layers 1–3) · browser + graph (4) · curator (5) · semantic search (6) · checkpoint (BR-66) · routines/tray + headroom guard + morning status | S2 agents, tree |
| **4: Delivery department (MVP)** | 10–12 | "I pitch an idea to the CEO, approve the one-pager, and Bench carries it through BA interview, documents, stories on the project dashboard, a developer's branch and PR, and a review meeting where I accept or reject the work." | UC-07, 10–17, 24, 26, 30, 31, 34, 43 | Session engine (groups, debate, interview, review) · task board + handoff + escalation + accept/reject · project template + proposal + documents · dashboard · write lock + freelancers | S1–S3 |
| **5: Integrations and open-source release** | 13–14 | "The CEO triages my Gmail into 'send it or change it?' drafts, a freelancer delivers a research report, a lead borrows an agent and merges it back, and a clean clone builds from source and passes the O4 checklist." | UC-36, 37, 47 | Gmail triage · research report · agent loan + merge-back · O4 checklist + installer + hardening | S2 connectors, S3 routines + checkpoint |

**Milestones and gates**
| Milestone | When | Gate |
|---|---|---|
| Feasibility | Sprint 1, day 1 | Spike reports in `docs/spikes/`. The client gives go/no-go (closes G0). On failure we use the fallback in §10 |
| Re-plan checkpoint | End of Sprint 2 (day 6) | Velocity and tokens per story vs. the remaining plan. If the trend misses day 14, the PM brings options (more lanes, resequencing, a later date). **No cut without a client change request** |
| MVP (internal prerelease) | End of Sprint 4 (day 12) | Scenario #1 end to end. Client UAT on the prerelease installer. Dogfooding starts |
| v0.1, open-source ready | End of Sprint 5 (day 14) | O4 checklist passes. G9 go/no-go |
| Phase 2 / v1 | After v0.1 | Claude Code depth, then mobile (BRD §2) |

## 10. Risks, assumptions and dependencies
| Risk / assumption | Impact | Likelihood | Mitigation / test |
|---|---|---|---|
| **Throughput limited by usage limits**: parallel developer agents share the founder's subscription | High | High | Size lanes from S0-1 and the meter each morning. Developers use Sonnet and reserve Opus for design and review. Track tokens per accepted story. Re-plan at day 6 |
| **Client review bandwidth**: 5 demos plus UAT in 14 days, one reviewer | High | Medium | Fixed ~1 h demo slot on days 3, 6, 9, 12, 14. Every story's acceptance criteria are prepared before the demo. Accept and reject in batches. Stories wait in QA, not In Progress |
| **Subscription-policy risk** (ADR-0002): Anthropic can change enforcement without notice | High | Low–Med | Follow the ADR-0002 hard rules (no login, no tokens, strip API key). Re-check the legal page at each release. The API-key backend is the escape hatch |
| **Agent SDK feasibility** (A1; S0-1..3 not run): subscription auth, per-agent isolation, in-process MCP | High | Medium | Run the spikes on Sprint 1 day 1, before other lanes commit. Fallbacks: S0-1 → API-key backend (client decides the economics); S0-2 → one responder by default + digest-only router; S0-3 → Tech Lead proposes an out-of-process MCP server |
| Sprint 4 is the densest (15 use cases) | Medium | Medium | Build it on three shared primitives (§6 block D). Primitives start in Sprint 3 if lanes free up |
| Gmail + scheduler estimated at +2 sprints (BRD §2) | Medium | Medium | Scheduler moved earlier to Sprint 3. Gmail reuses the connector, approval and notification work from Sprint 2 |
| Open-source licence contamination (AGPL references such as basic-memory and opcode) | Medium | Low | Copy design only. Licence check in CI and in the O4 checklist |
| Dependencies: Claude Code installed and logged in; Git/Node on the machine; ADR-0001 stack confirmed | High | Low | Onboarding checks (Sprint 1). ADR-0001 confirmation is open question #1 |

## 11. Open questions
| # | Question | Owner |
|---|---|---|
| 1 | ADR-0001 (Electron) is still "Proposed, waiting for founder confirmation". Do you confirm it, so the Sprint 1 scaffold can start? | Client |
| 2 | Which open-source licence (e.g. MIT or Apache-2.0)? The Tech Lead must also confirm that depending on `@anthropic-ai/claude-agent-sdk` (Anthropic Commercial Terms, not bundled) is compatible with it | Client / Tech Lead |
| 3 | Does "open-source ready on day 14" need macOS and Linux builds, or Windows only, with the other OSes building in CI? | Client |
| 4 | Does the ≥ 30 % weekly-headroom target also limit the developer agents building Bench during the 14 days? It directly sets how many parallel lanes we can run | Client |
| 5 | Can you hold a ~1 h demo and UAT slot on days 3, 6, 9, 12 and 14? | Client |
| 6 | O1's 14-day daily-use window: does it start at the MVP prerelease (day 12), as proposed here? | Client |
| 7 | Spikes S0-1..3 run on Sprint 1 day 1, so build starts with G0 still open. Do you accept closing G0 on the spike results then? | Client |

## 12. Sign-off
| Client | Decision | Date |
|---|---|---|
| | | |
