# Story map: the Eucas companion v0.1 (draft for Gate 6)

**Version:** v0.1 draft, 2026-10-26 · **Owner:** PM · **Status:** for your review at G6.
**Sources:** [PRD v0.6](../requirements/PRD.md) Appendix A (E17 – E28), [SRS v1.0](../requirements/SRS.md) §2.12, §2.15, §7, §9, Appendix B, [BUILD-PLAN](../architecture/companion/BUILD-PLAN.md) §1 – §5, [BRD v1.5](../requirements/BRD.md) §10, [answers 2026-10-26](../requirements/interviews/2026-10-26-v1.4-open-items.md).

Estimates are BUILD-PLAN focused build days (they win where the PRD's "Days" column differs). Lane A = guard and core, lane B = app and server. Every row also depends on P1 (the ADRs, decision 2 below); that isn't repeated per row.

## 1. Story map

| ID | Story (you can …) | PRD stories | UC | Priority | Est. (tech lead) | Lane | Sprint | DoR |
|---|---|---|---|---|---|---|---|---|
| S1-1 | (enabler) have one repo that builds, lints and checks the same way on every lane | 18.1 | — | Must | 1.5 | A | 1 | Ready |
| G-1 | trust that every command is judged the way it will actually run | 19.1 | UC-55, UC-56 | Must | 1.75 | A | 1 | Ready |
| U-1 | see Eucas start with Windows, as one instance, with a tray fallback and a panel that opens instantly | 18.2, 27.3 (shell) | UC-60 | Must | 2 | B | 1 – 2 | Needs AC restated: 18.2 still describes the popover and main window (only its v0.6 note is current) |
| G-2 | rely on the four limits and self-protection, which no rule can override | 19.2 | UC-55, UC-56 | Must | 1.5 | A | 2 | Ready |
| G-3 | rely on a guard that blocks when it crashes, hangs or goes missing | 19.3 | UC-55 | Must | 1.5 | A | 2 | Ready |
| N-0 | see your Euca in the notch, never in your way, readable by Narrator | 27.1, 27.2 (peek trigger), 27.10 (eye grammar) | UC-55, UC-60 | Must | 3 | B | 3 | **Needs SP-ST2** (not run) |
| G-4 | have every local session guarded without anything written into your repos | 19.4 | UC-55 | Must | 1.25 | A | 3 | Ready |
| A-1 | have the limits locked where no agent or repo can switch them off, with one Windows prompt | 19.6 | UC-54, UC-55, UC-57 | Must | 1.75 | A | 3 | Ready |
| W-1 | get signed config and updates, and join the Pro waitlist at the right moments | 18.3 | Pro moments (UC-58, UC-62, UC-64) | Must | 1.75 | B | 2 | Ready |
| SUP-3 | (enabler) know the supervisor never regresses on dangerous cases or leaks | 17.8, 25.3 | UC-63 | Must | 1 | B | 2 | Ready |
| G-5 | (enabler) know a red bypass suite blocks every merge | 19.5 | UC-55 | Must | 1.25 | A | 4 | Ready |
| H-1 | know within 2 s when a session isn't protected | 20.1 | UC-55, UC-60 | Must | 2 | A | 4 | Needs AC fix: 20.1 still fires a toast and says "Not guarded" (BR-108, SRS App. B #4) |
| AC-1 | sign in with email and a code, served by the Worker | 28.1, 27.6 (trial start route) | UC-65 | Must | 1.75 | B | 4 | **Needs SP-AC1 and P9** |
| BU-1 | have your supervisor help, trial and taste tracked per account, never overspent | 27.5, 27.6, 28.4 | UC-63, UC-66 | Must | 1 | B | 4 | Ready |
| C-1 | see Eucas prove itself after every Claude Code update | 20.2 | UC-55 | Must | 1.25 | A | 5 | Ready |
| D-1 | press one button to learn what's wrong and what to send | 24.2 | UC-61 | Must | 0.5 | A | 5 | Ready |
| F-1 | know when two sessions edit the same file | 23.2 | UC-59 | Must (v0.1.1 only with your OK) | 0.75 | A | 5 | Needs AC fix: 23.2 still sends a toast (BR-108) |
| AC-2 | sign in during setup, manage or delete your account, and keep each account's data apart | 28.2, 28.3, 28.4 | UC-54, UC-65 | Must | 2.25 | B | 5 | Needs tech-lead confirmation of SRS App. B B-2 (signing out offline: not allowed) |
| ME-1 | see how much supervisor help is left, never in dollars | 27.5 | UC-66 | Must | 0.5 | B | 5 | Ready |
| T-1 | have a session that starts mass-deleting stopped, with an honest count | 20.4 | UC-56 | Must | 2 | A | 6 | Ready |
| P-1 | see your Euca's header, Settings and the log of what it did | 20.3, 27.3 (header), 27.4 (Settings › Name and look) | UC-54, UC-55, UC-60 | Must | 1.5 | B | 6 | Needs AC fix: drop log export and the "Protection screen" (NFR-103, SRS App. B #13) |
| R1 | install without admin and get signed updates; check the installer's SHA-256 | 18.4 | UC-54, UC-55 | Must | 1.75 | A | 9 | Ready |
| N-1 | see what needs you as notch markers and a panel list, with Open session and Undo | 23.1, 27.2, 27.8 (Undo on Not now) | UC-60 | Must | 2 | A | 7 | Ready (23.1's v0.6 note + FR-106 – FR-115) |
| M-1 | have a finished branch updated, tested and opened as a PR, never merged into your default branch | 23.3 | UC-59 | Must | 1.75 | A | 8 | Ready |
| R-1 | turn your own approvals, templates and library rules into exact rules with a dry run | 21.1, 27.8 (Undo on rules) | UC-57 | Must | 3.25 | B | 7 | Needs: the 10 library rules (G3-7, FR-069) and "no rules export" (FR-080) in its scope; tech lead confirms 1.5 d still holds |
| R-2 | describe a rule in plain words and confirm the exact rule Eucas drafts | 21.2 | UC-57 | Must | 1.75 | B | 10 | Ready |
| SUP-2 | (enabler) have the Worker call the supervisor model safely and settle the cost | 25.3 | UC-63 | Must | 1 | A | 6 | Ready (model from SP-SUP2 via config; PRD §11.1 #10 doesn't block the build) |
| SUP-1 | have Pip answer what your rules already answer, ask you otherwise, and show exactly what it sent | 25.3, 27.8 (receipts, Why?), 27.11 | UC-63, UC-66 | Must | 3.25 | B | 8 | Ready to build; **release-gated on SP-SUP2** (50 of ≥ 300 moments) |
| L-1 | see your tokens and plan share live, and when you'll hit the limits | 22.1 | UC-58 | Must (v0.1.1 only with your OK) | 1.5 | B | 6 | Ready |
| A-2 | lock the four limits in setup and lock your own block rules later | 19.7 | UC-54, UC-57 | Must | 1.5 | A | 8 | Ready |
| O-1 | make your Euca, see your week, get protected, sign in and finish setup in about 5 minutes | 24.1, 27.4 (setup editor), 27.6 (trial start), 27.11 (setup step), 28.2 (step 6) | UC-54 | Must | 3.25 | B | 9 | Needs UX fix: setup step 8 still shows the old privacy line (SRS App. B B-1) |
| **LY-1** | have your Euca learn from what you allow, deny and answer, show what it knows, and let you forget it | 27.7, 27.8 ("That was wrong"), 27.9 (proposed, §2) | UC-67 | Must (FR-167, FR-172, FR-173 Should) | 3 | A | 10 | **Needs** a BUILD-PLAN row (files, tests, depends: R-1, N-1, SUP-1, AC-2) and a firm estimate (decision 5) |
| Q-1 | get a hardened build that's ready for the first outside user | 18.5 | all | Must | 2.5 | A | 11 | Needs the Windows 10 VM pass added (G3-5) |

**Totals:** the tech leads' estimate is **58.25 build days** over 146 tasks (BUILD-PLAN had 48.25; LY-1 3.0 and Windows 10 1.0 are inside). Lane and sprint follow the [sprint plan](README.md#4-sprint-plan) (11 sprints), which supersedes BUILD-PLAN §4. Some DoR notes below are already resolved in the task files (the 10 library rules in R-1, sounds in N-1, the Windows 10 VM pass in Q-1.4, B-2 confirmed in AC-2.3, LY-1 sized); the rest are document fixes listed in [G6-DECISIONS](G6-DECISIONS.md#documents-to-correct-after-g6-owners-not-decisions).

**Sprint 1 goal:** see [sprint-01](../sprints/sprint-01/README.md).

## 2. Coverage check

**PRD → build (E18 – E24, E27, E28).** Every story maps, except:

| PRD story | Gap | Proposal |
|---|---|---|
| **27.9** calm and worst moments (caught up, While you were away, Back to normal, the five worst moments) | No build story. BUILD-PLAN §3.1 lists "moments" among the unestimated CR-011 §7 items | Fold into LY-1; the tech lead estimates (decision 5) |
| **27.10** the three sounds (Needs you, Done, Stopped), mute, Focus | Eye grammar is in N-0; **sounds are in no story** | Add to N-1 (it owns the arrival events); tech lead re-estimates N-1 |
| **27.8** undo everywhere | Covered piecemeal (N-1, R-1, A-2, LY-1); no story owns the "what can't be undone says so" rule (FR-169) | Make FR-169 a constraint in every story's contract at `/plan-sprint`; QA checks it in Q-1 |

**Build → PRD.** No build story is an orphan. Two trace oddities to fix in the PRD: SUP-1, SUP-2 and SUP-3 trace to **25.3**, which still sits in the Pro epic (E25) marked "Pending"; and **SP-ST2** and **SP-AC1** are in BUILD-PLAN §2 but not in E17.

**Not in the 48 days, in v0.1 by your decisions:** Windows 10 support (G3-5, about 1 day) and LY-1 (2 – 3 days, PRD §11.1 #18).

**E17 spikes:** 17.1 – 17.6 done (SP-H1, SP-ST1, S-1, SP-TW1, S-4, S-6); 17.7 (S-2, Allow once) optional and not run, so no "Allow once" in v0.1 unless it runs (FR-122 is Won't); 17.8 (SP-SUP2) running alongside the build.

**E25 (Pro): out of the build except 25.3.**

| Story | In v0.1? | Owner | When |
|---|---|---|---|
| 25.1 Lemon Squeezy checkout, $20 / $15 for life | No (FR-178 Won't) | PM plans, tech lead builds | After v0.1; can charge once built (§11.1 #8) |
| 25.2 per-session budget | No (FR-177) | PM + tech lead | With Pro |
| 25.3 the supervisor | **Yes** (SUP-1, SUP-2, SUP-3, BU-1, ME-1) | Tech lead | v0.1, gated on SP-SUP2 |
| 25.4 every session's details, older weeks (no export) | No (FR-179) | PM + tech lead | With Pro |
| 25.5 cloud hand-off (beta) | No (FR-180) | Founder (Anthropic's written OK), then tech lead | After the OK |

**E26 (launch): none is app code.**

| Story | Owner | When |
|---|---|---|
| 26.1 landing page and waitlist (built in #64, **not deployed**) | Founder (deploy), PM (reads the result) | Before building (decision 3) |
| 26.2 download page: SmartScreen steps, SHA-256, "the supervisor can't be switched off" | PM drafts, founder publishes; hashes from R1 | Before launch |
| 26.3 the Anthropic email | Founder | When there is something real to show |
| 26.4 supporter tier | **Dropped** (FD-8); GitHub Sponsors link in the site and README | Founder, at launch |
| 26.5 Authenticode signing | Founder | Before launch if the waitlist is large; else the 10 % Smart App Control trigger |

## 3. Definition of Ready and Done (companion tasks)

**Ready** (a story moves to `Ready` on the board only when):
- It links a UC and the FR / NFR ids it implements (SRS §7).
- Its acceptance criteria are Given/When/Then and current (no superseded PRD text; struck text doesn't count).
- UI work names its approved design route (BR-128, FR-189).
- It has a BUILD-PLAN estimate ≤ 3 days, split into tasks of ≤ 1 day that name their files, tests and dependencies (`/plan-sprint`).
- Its dependencies are done or earlier in the same lane; any spike it names is at GO; no open question blocks it.
- It has a constraint contract (what it must never do, e.g. never read credentials, never merge into the default branch).

**Done** (CLAUDE.md, applied to the companion):
- One branch and one PR from `dev`; self-reviewed for bugs and slop.
- Tests pass, including the story's named tests; isolation tests for anything touching accounts, profiles or memory; `check:all` (ts + rust) green.
- CI green on the PR checks (windows + ubuntu + gitleaks; `guard-contract` and `plugin` once G-5 lands); secret scan clean.
- A trace or log event visible in the app.
- Docs and this map updated; any `shortcut:` comment goes to the debt ledger at the sprint review.
- QA passed and you accepted it at the sprint demo.

## 4. Decisions for you at Gate 6

Moved to [G6-DECISIONS.md](G6-DECISIONS.md), which merges these with the tech leads' questions and the final estimate.

## 5. Documents to correct (owners, not decisions)

- **PRD:** move 25.3 out of E25 into the v0.1 epics; add SP-ST2 and SP-AC1 to E17; fix 18.2, 20.1, 20.3 and 23.2 (toasts, export, popover; see DoR column); C3 → about 5:00 (SRS App. B #12). Owner: PM.
- **BUILD-PLAN:** add LY-1 and the Windows 10 day; fix §2's SP-SUP2 line (decision 4); drop export from P-1. Owner: tech lead.
- **STATUS.md:** still lists BRD #56 – #63 as open; all are answered (#65 too). Owner: PM.
