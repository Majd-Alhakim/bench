# Backlog: the Eucas companion v0.1

**Status:** draft for **Gate 6** (2026-10-26) · **Owner:** PM · **Phase:** 6 ([LIFECYCLE](../process/LIFECYCLE.md)) · nothing here is approved until you approve G6.
**Built from:** [SRS v1.0](../requirements/SRS.md) (189 FRs, 118 NFRs), [PRD v0.6](../requirements/PRD.md) epics E17–E28, [BUILD-PLAN](../architecture/companion/BUILD-PLAN.md), the [spike reports](../spikes/) and the approved design ([UX](../design/ux/companion/), [UI](../design/ui/companion/DESIGN.md)).

## 1. What's in this folder

| File | What | Who wrote it |
|---|---|---|
| this file | totals, the sprint plan over two lanes, spike blocks | PM |
| [story-map.md](story-map.md) | every build story → PRD stories, UC, priority, Definition of Ready / Done, coverage check | `product-manager` |
| [tasks-lane-a.md](tasks-lane-a.md) | guard and core stories split into tasks: traces, files, acceptance criteria, tests, estimate | `tech-lead` |
| [tasks-lane-b.md](tasks-lane-b.md) | app and server stories, plus the new LY-1 "learns you" and NA-1 "safety without an account", split the same way | `tech-lead` |
| [github-issues.md](github-issues.md) | issue drafts: 3 spikes, 34 stories, 13 Sprint 1 tasks (title, labels, milestone, body). **Not created on GitHub** | generated from the task files |
| [G6-DECISIONS.md](G6-DECISIONS.md) | what you decide at Gate 6, each with a recommendation | PM + tech lead |
| [../sprints/sprint-01/README.md](../sprints/sprint-01/README.md) | Sprint 1 in detail | PM + tech lead |

"Lane A / lane B" in the two task-file names is the split the tech leads wrote by. **§4 below decides which lane runs each story**; where a task file's own sprint or lane notes differ (tasks-lane-a §2), §4 wins.

## 2. Totals

| | Stories | Tasks | Days |
|---|---|---|---|
| BUILD-PLAN (2026-10-26) | 32 | — | 48.25 |
| Tech-lead re-estimate of those stories | 32 | 138 | 54.5 |
| + LY-1 "learns you" (UC-67; PRD 27.7, 27.9, "That was wrong") | 1 | 8 | 3.0 |
| + Windows 10 22H2 VM pass (G3-5), in Q-1 | — | (in Q-1) | 1.0 |
| Backlog v0.1 before the no-account decision | 33 | 146 | 58.5 |
| + NA-1 "no account: safety and a small supervisor taste" (founder, 2026-10-26, with the addendum) | 1 | 11 | 5.25 |
| **Backlog v0.1** | **34** | **157** | **63.75** |

Every task is ≤ 1 day, traces to at least one SRS FR or NFR, and names its files, acceptance criteria, test approach, estimate, dependencies, spike and trace event. **Where the +15.5 days over BUILD-PLAN come from** (per-story tables at the end of each task file):
- **Guard and core, +2.75:**
  - the Windows 10 VM pass (G3-5), in Q-1: +1;
  - the SQLite store, migrations and retention, which no story owned, in H-1: +0.5;
  - +0.25 each in G-1 (PowerShell `-EncodedCommand`), G-3 (pipe-server identity check), G-4 (Repair and Off for 15 minutes), G-5 (the S-1 loopback, moved from C-1), A-1 (embedded-guard build order) and SUP-1 (the receipts UI);
  - C-1: −0.25.
- **App and server, +4.5:**
  - R-1: +1.75, for the 10 library safety rules (G3-7) and rulebook tamper restore;
  - +0.5 each in U-1 (the Playwright harness), N-1 (the toast fallback and the sounds) and P-1 (the block Why? page, removing log export, the gooey switch);
  - N-0: +0.75, for the gooey peek (DESIGN §5.1) and the eight-face eye grammar with its state mapping and repo scan (founder, 2026-10-26);
  - +0.25 each in O-1 and W-1.
- **LY-1 "learns you", new: +3.**
- **NA-1 "no account: safety and a small supervisor taste", new: +5.25** (founder decisions 2026-10-26: setup can finish without an account; addendum: no-account users also get a small supervisor taste). No account = the four limits, the tripwire, and about 10 supervised decisions per install:
  - NA-1.1 the account-state gate in the core; its test: no account makes only supervisor-taste calls, none once the taste is used up (0.5);
  - NA-1.2 the no-account tray fallback menu (0.25);
  - NA-1.3 setup without an account: step 6 "Continue without an account" → 8 What is sent → 9 Pip is watching (no account) with the flight, plus the declined-UAC variant (0.5);
  - NA-1.4 sign up later (from the minimal panel or the tray), re-entering setup steps 6–9 (0.5);
  - NA-1.5 sign out and delete → the no-account state (0.5);
  - NA-1.6 the e2e: fresh install, no account, offline → a push to the default branch is blocked and a mass delete trips; online → taste calls only, none after it's used up (0.5);
  - NA-1.7 the trial starts at sign-up, **pending founder answer (b)** (0.25);
  - NA-1.8 Worker: a random install ID and a signed install token, per-IP limit (0.5);
  - NA-1.9 Worker: the anonymous supervisor-taste route, the per-install budget and the global daily spend cap (0.5);
  - NA-1.10 core: the taste counter, the used-up state, no calls after it (0.5);
  - NA-1.11 the minimal notch and minimal panel (needs you, protection, taste meter, Create an account) and the "taste used up" state, **pending founder answer (a)**, now recommended over tray only (0.75).
  - **Revised, not re-estimated:** O-1 (constraint; O-1.6 no longer waits offline; O-1.7 no `trial/start`), AC-2 (the signed-out panel is gone; signed out = no account), AC-2.4 (adopts a no-account Euca, an assumption), U-1.3 / U-1.4 (per-state tray menu), N-0.4 (the notch also shows with no account), W-1.4 (no ProLine or telemetry with no account), C-1.1 and SUP-1.7 (through the gate), Q-1.2 (includes NA-1.6).

**Open questions from the no-account decisions** (none blocks Sprints 1–4):
- **(a)** The no-account surface: the minimal notch and panel (recommended by the addendum) or tray only. Blocks NA-1.11 (Sprint 10). Tray only would drop NA-1.11 (−0.75 d) and add a toast-policy change to NA-1.2 (+0.25 d).
- **(b)** When the trial starts: at sign-up (recommended) or at the end of setup. Blocks NA-1.7 (Sprint 6). The taste never counts against the trial.
- **(c)** The taste size: about **10 supervised decisions per install, in total** (recommended), or 5 or 25. A config value; blocks nothing but NA-1.9's acceptance.
- ~~**NA-Q1** (PM): with no account, may the update check and the signed config still run?~~ **Answered (PM, 2026-10-26): yes.** `/v1/updates` and `/v1/config` carry no user data (FR-184 headers only) and keep the guard patched and C-1's verified list current; no bundled list needed.
- **NA-Q2** (UX): whether the invite reads "Create an account" or "Sign in" after a sign-out; the sign-out "what keeps working" copy.
- **NA-Q3** (founder): the taste is per install, so after a sign-out the install's remaining taste continues (a used-up taste stays used up). Derived, flagged.
- **Assumption to confirm:** the Euca made at step 2 in a no-account setup is the one in the minimal notch, and it carries over when you create an account.
- **Docs to correct (owners, after G6):** BRD §10 #57 revised and #65 (a) partly superseded (PM, with the founder's quotes, old text struck); SRS FR-020, FR-144 (if (b)), FR-155, NFR-090 and the "fully offline / nothing leaves this PC" wording for no account (PM); ADR-0011 (trial start, the taste) and ADR-0017 (an install row without an account) (tech lead).



## 3. Spike blocks

| Spike | Cost | When | Tasks it blocks (build) | Tasks it gates (acceptance only) |
|---|---|---|---|---|
| **SP-ST2** native notch accessibility and keyboard | 0.5 d | Sprint 0; GO needed before **Sprint 2** (U-1.6) | U-1.6 · N-0.5 (keyboard peek) · N-0.6 (UIA provider) · N-0.7 (`RegisterHotKey`) · N-0.8 (gooey peek) | Q-1.2 (how Narrator and keyboard are checked) |
| **SP-AC1** sign-in deliverability | 0.25 d | Sprint 0; with **P9** done before **Sprint 4** | AC-1.4 (`EmailSender`, default provider) | R1.4 (staging code-send smoke) |
| **SP-SUP2** supervisor launch gate | 2 d + labelling | alongside the build (recorder installed; 50 of ≥ 300 moments on 26 Oct) | none: building is never blocked | SUP-1.4, SUP-1.5, SUP-1.7, SUP-3.2, W-1.3, BU-1.1, BU-1.2, SUP-2.1, SUP-2.2, NA-1.9, NA-1.10, R1.3 (stable channel). **v0.1 launches only once it passes** (SRS G3-1) |

## 4. Sprint plan

3-day, goal-boxed sprints. Two Claude developer lanes, each in its own worktree; you review. Rules (tech lead):
- In one sprint, the two lanes never touch the same files.
- Every dependency is in an earlier sprint, or earlier in the same lane.
- Each lane carries at most 3.25 days.

Before Sprint 1, S1-1 pre-creates every module file and splits copy, error codes and IPC contracts per domain, so later stories never edit a shared `mod` list or one big copy file.

| Sprint | Goal (one sentence you can check at the demo) | Lane A | Lane B | A / B days |
|---|---|---|---|---|
| **0** (now, before G6) | The last unknowns are closed | SP-ST2 · SP-AC1 | You: P9 (Cloudflare Email on `eucas.app`, Workers Paid, D1); the recorder keeps recording | 0.75 |
| **1** | The repo builds green on Windows and Ubuntu, the guard's parser turns bash, PowerShell and cmd commands into the exact calls and paths it will judge, and the hidden panel shows live state in under 150 ms | S1-1 → G-1 | U-1.1, .2, .3, .5 (after S1-1) | 3.25 / 1.5 |
| **2** | A real tool call is blocked by a guard that fails closed, and the Worker serves signed config | G-2 → G-3 | U-1.4, U-1.6 → W-1 → SUP-3 | 3.0 / 3.25 |
| **3** | The plugin installs through Claude Code, the limits are locked at admin level with one Windows prompt, and your Euca shows its eight faces in the notch | G-4 → A-1 | N-0 | 3.0 / 3.25 |
| **4** | Every session is seen within 2 s, the bypass suite blocks every bad merge, and the server can sign you in and keep your budget | G-5 → H-1 | AC-1 → BU-1 | 3.25 / 2.75 |
| **5** | It proves itself after a Claude Code update, explains itself in one button, warns about same-file edits, you can sign in from the app, and with no account it never reads or sends your account; the per-user installer builds | C-1 → D-1 → F-1 → **R1.1 → R1.2** | AC-2 → ME-1 → **NA-1.1** | 3.25 / 3.25 |
| **6** | It stops a mass delete; the panel has its header, Settings and Usage; the supervisor endpoint answers; your trial starts when you create your account | T-1 → SUP-2 → **R1.4** | P-1 → L-1 → **NA-1.7** | 3.25 / 3.25 |
| **7** | What needs you shows on the notch and in the panel, with sounds; your rules, the 10 library rules among them, work with a dry run; signed releases build; the server can register an install without an account | N-1 → **R1.3** → **NA-1.8** | R-1 | 3.25 / 3.25 |
| **8** | Pip answers what your rules already answer and shows exactly what it sent; a finished branch becomes a PR; you can lock your rules | M-1 → A-2 | SUP-1 | 3.25 / 3.25 |
| **9** | Setup makes your Euca, locks the limits, signs you in and protects you in about 5 minutes; with no account, Pip can answer about 10 times and then stops calling; Pip starts learning what you allow | **NA-1.9 → NA-1.10 → NA-1.2** → LY-1.1–LY-1.4 (+0.5 d buffer) | O-1 | 2.75 / 3.25 |
| **10** | Pip shows what it learned, you can describe a rule in plain words, and you can finish setup without an account, see Pip in a minimal notch and panel, sign up later, and sign out to the no-account state | LY-1.5–LY-1.8 → R-2 | **NA-1.11 → NA-1.3 → NA-1.4 → NA-1.5 → NA-1.6** (+0.5 d buffer) | 3.25 / 2.75 |
| **11** | Hardened and ready for the first outside user: performance, accessibility, the full e2e set (the no-account path among them), and the checklist on Windows 10 and 11 | Q-1 | Fixes from Q-1; your Windows 10 VM | 2.5 / — |

- **The schedule:**
  - 11 sprints, about **33 working days** elapsed: **unchanged** by the no-account work (2026-10-26);
  - 63.75 of 66 lane-days are planned, so 2.25 are slack (was 7.5): 1.5 of it is lane B waiting for S1-1 in Sprint 1, and lane B's Sprint 11 is kept for Q-1 fixes. The re-plan buffers left under the 3.25 cap are small: lane A 0.25 in Sprints 2 and 3, 0.5 in Sprint 9, 0.75 in Sprint 11; lane B 0.5 in Sprints 4 and 10.
  - **What moved to fit NA-1 (no scope cut, no sprint added):**
    - R1 (1.75) leaves lane A's Sprint 9 and is split earlier, where its dependencies (U-1, W-1, AC-1) are long done: R1.1 and R1.2 to Sprint 5, R1.4 to Sprint 6, R1.3 to Sprint 7. This uses lane A's old buffers in Sprints 5, 6 and 7.
    - LY-1 (3.0) is split over lane A's Sprints 9 (LY-1.1–LY-1.4) and 10 (LY-1.5–LY-1.8).
    - R-2 (1.75) moves from lane B to lane A in Sprint 10, freeing lane B's Sprint 10 for the no-account UI and setup path.
    - NA-1.1 fills lane B's Sprint 5 gap; NA-1.7 fills lane B's Sprint 6; NA-1.8 takes the rest of lane A's Sprint 7; NA-1.9, NA-1.10 and NA-1.2 go first in lane A's Sprint 9; NA-1.11, NA-1.3, NA-1.4, NA-1.5 and NA-1.6 take lane B's Sprint 10; Q-1 stays alone in Sprint 11.
  - **The risk this adds:** the buffers drop from 7.5 to 2.25 lane-days, and the no-account setup path lands in Sprint 10, one sprint before hardening. If a lane slips by more than half a day in Sprints 9–10, the fallback is a **12th sprint** (+3 working days, 36 in all), decided at the day-6 re-plan or the Sprint 8 review, never a cut.
- **The re-plans:**
  - The **day-6 re-plan** (end of Sprint 2) checks actuals against these numbers.
  - The **Sprint 5 review** checks SP-SUP2's pace toward 300 moments.
  - If a lane slips, sequence, don't cut. F-1 or L-1 move to v0.1.1 only with your OK.
- **If actuals beat the estimates:** Q-1 starts in Sprint 10 and v0.1 ends in 10 sprints (30 days); with NA-1 in Sprint 10, this now needs both lanes about a day ahead by Sprint 9.
- **The supervisor switch:** its model path ships behind `killSwitches.supervisor`. Turning it on, and so the launch, waits for SP-SUP2, not for this schedule.
- **Changes from BUILD-PLAN §4:**
  - SUP-3 moves to Sprint 2 (lane B).
  - N-0 moves to Sprint 3, so U-1 finishes first and SP-ST2 has a sprint of margin.
  - W-1 moves to Sprint 2.
  - SUP-2 moves to Sprint 6.
  - R1 is split over Sprints 5–7 (was Sprint 9 in the first draft of this plan).
  - LY-1, NA-1 and Sprint 11 are new; LY-1 is split over Sprints 9–10; R-2 runs in lane A.
  - These moves follow the tech leads' dependency findings: M-1 needs N-1; A-2 needs R-1; R-1 needs P-1's switch.

### 4.1 Cross-lane dependencies to watch

| Needed | By | For |
|---|---|---|
| S1-1.4 merged | Sprint 1, day 2 | U-1 and G-1 start |
| U-1 merged (U-1.1–.3) | end of Sprint 1 | H-1 (Sprint 4), W-1 (Sprint 2) |
| SP-ST2 at GO | start of Sprint 2 | U-1.6, then N-0 in Sprint 3 |
| SP-AC1 + P9 done | start of Sprint 4 | AC-1 |
| H-1 merged | end of Sprint 4 | AC-2, C-1, F-1, T-1, P-1, L-1, N-1 |
| P-1.4 (gooey switch) merged | end of Sprint 6 | R-1 |
| N-1 and R-1 merged | end of Sprint 7 | M-1, A-2 (Sprint 8) |
| SUP-1 and A-2 merged | end of Sprint 8 | O-1 (Sprint 9), NA-1.10 (Sprint 9, lane A) |
| NA-1.1 merged | end of Sprint 5 | NA-1.2, NA-1.10 (Sprint 9) |
| NA-1.10 merged (lane A) | end of Sprint 9 | NA-1.11 (Sprint 10, lane B) |
| O-1 merged (lane B) and NA-1.2 merged (lane A) | end of Sprint 9 | NA-1.3, NA-1.5 (Sprint 10) |
| The design branch with `s-noacct-done`, `p-noacct`, `p-noacct-empty`, `t-noacct` merged | before Sprint 9 | NA-1.2, NA-1.3, NA-1.11 |
| Founder answers (a), (b), (c) | (b) before Sprint 6; (a) and (c) before Sprint 9 | NA-1.7; NA-1.11, NA-1.9 |

## 5. GitHub Issues

Drafted in [github-issues.md](github-issues.md) and approved at G6 (7a). The labels and the Sprint 0–11 milestones are on GitHub; the issues are next. Later sprints get their task issues at each `/plan-sprint`.

## 6. Requirement coverage

The task files cite **298 of the SRS's 307 FR/NFR ids**, and every id they cite exists in the SRS (checked by script). The other nine:

| Id | What | Where it lands |
|---|---|---|
| FR-017 | A paid canary turn if the hook-only test can't run (Could) | **Not built**: S-1 passed hook-only (ADR-0014). Won't in v0.1 |
| FR-181 | No supporter tier; GitHub Sponsors only | Launch note (E26), not app code |
| FR-186 | Never read Claude credentials, OAuth tokens, `.env` or key files | A non-negotiable in every lane B task (as NFR-068); add FR-186 to Q-1's file-access audit when Q-1 is planned |
| NFR-013 | Setup median ≈ 5:00 to the notch | O-1 (Sprint 9) e2e timing; the release checklist in Q-1 |
| NFR-020 | Worker non-model routes p95 ≤ 300 ms | W-1 / AC-1 Workers-pool tests; checked in Q-1 |
| NFR-048 | Worker availability ≥ 99.5 %, 5xx alert | OPERATIONS; the alert is set up with `deploy-api.yml` in R1 |
| NFR-113 | Infrastructure < $100/month | Founder, monthly bill (operations, not a task) |
| NFR-189 | Founder maintenance ≤ 5 h/week | Founder, weekly log (operations, not a task) |
| NFR-201 | Official, unmodified Claude Code only; no CLI shipped | R1's installer content check |
