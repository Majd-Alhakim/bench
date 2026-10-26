# Project Status

Single source of truth for where the project is in the [lifecycle](LIFECYCLE.md). Updated by the PM; gates are approved only by the client.

**Current phase:** 6 (backlog and Sprint 1), **G6 approved 2026-10-26**, lean mode. G0–G6 approved. Sprint 0 (SP-ST2, SP-AC1, P9) runs in the waitlist week; Sprint 1 starts on day 8 after the page goes live, only with ≥ 100 sign-ups (G6-3a).
**Next step:** put the landing page live (starts the demand test), then Sprint 0. G6 approved [the companion v0.1 backlog](../backlog/README.md):
- 34 stories and 156 tasks, each traced to SRS FR/NFR ids;
- 63.0 build days in 11 three-day sprints over two lanes (58.5 before NA-1: no account = Free without memory, a 10-decision supervisor taste and 1 own rule, founder 2026-10-26);
- [Sprint 1](../sprints/sprint-01/README.md);
- [the decisions and your answers](../backlog/G6-DECISIONS.md).

**G6 conditions:** SP-ST2 must be GO before Sprint 2 (5a). SP-AC1 and P9 must be done before Sprint 4 (5a). The build starts on day 8 after the page goes live, and only if the waitlist has ≥ 100 sign-ups (3a). The launch waits for SP-SUP2 to pass (6a; recorder installed, 50 of ≥ 300 moments). The GitHub Issues are created (7a): [50 issues](https://github.com/eucas-app/eucas/issues?q=is%3Aissue+label%3Acompanion), #100–#150, in the [Sprint 0–11 milestones](https://github.com/eucas-app/eucas/milestones). BRD §10 #56–#65 are all answered (2026-10-26).

*Earlier:* CR-011 and CR-012 are applied in **BRD v1.5 / PRD v0.6** (your Euca in the notch and one panel; the supervisor meter, never dollars; the trial and taste; the supervisor always on for everyone; a Eucas account for everyone); companion SRS v1.0 approved at G3 (2026-10-26).

## Phase tracker

| # | Phase | Status | Artifacts | Gate |
|---|---|---|---|---|
| 0 | Problem & validation | ✅ Spikes S0-1, SP-B1, M8 GO (2026-10-24); S0-2, S0-3 in Sprint 1 | [VISION](../VISION.md), [research](../research/), [risk facts](../research/risk-facts-2026-10-23.md) | G0 ✅ 2026-10-24 |
| 1 | Requirements / BRD | ✅ v1.0 baselined; **v1.5** applies CR-001…012 (CR-010: companion first, UC-54–UC-64, BR-98–BR-119; team app deferred; CR-011/012: the notch and panel, meter, trial and taste, accounts, UC-65–UC-67, BR-120–BR-129, supervisor always on); open items §10 #56–#58, #60–#63 | [BRD](../requirements/BRD.md), [interviews](../requirements/interviews/) | G1 ✅ 2026-10-22 |
| 2 | PRD | ✅ **v0.6** (CR-010: companion v0.1 first, about 5 spike + 32 build days (28 + 4 added 2026-10-26), epics E17–E26, kill criteria §8.2, Pro waitlist; CR-011/012: epics E27–E28, supervisor in v0.1, build to be re-estimated; the v0.4 team-app plan follows), G2 questions answered; open questions §11.1 | [PRD](../requirements/PRD.md), [G2 answers](../requirements/interviews/2026-10-23-g2-answers.md) | G2 ✅ 2026-10-23 |
| 3 | SRS / specs | ✅ Companion v0.1 SRS **v1.0** baselined (189 FRs, 118 NFRs, interfaces, data model, traceability; 7 G3 answers applied: supervisor on from launch, no export in What Pip knows, learns-you from structured events, $10/day spend cap, Windows 10 22H2 (tested in a VM) + 11, proposed numbers, 10 library rules) | [SRS](../requirements/SRS.md) | G3 ✅ 2026-10-26 |
| 4 | UX design | ✅ Premium spec, Laws of UX audit; flows proven in prototype v0.8.2 | [UX premium](../design/ux/premium/README.md), [Laws of UX audit](../design/ux/laws-of-ux-audit.md) | G4 ✅ 2026-10-24 |
| 5 | UI design & brand | ✅ Brand decided (Quartet logo, Porcelain/Ink/Cobalt, Instrument Sans, sounds, dark first); hi-fi prototype **v0.8.2** (review rounds 5–7 applied); **name: Eucas** (one agent is a Euca) | [DIRECTION](../design/ui/DIRECTION.md), [prototype](../design/ui/prototype/direction.html), [brand](../design/ui/brand/BRAND.md), [system](../design/ui/system/DESIGN-SYSTEM.md) | G5 ✅ 2026-10-24 |
| 6 | Backlog & Sprint 1 | ✅ Companion v0.1 backlog approved (34 stories, 156 tasks, 63.0 d, 11 sprints), Sprint 1 planned, GitHub Issues created (#100–#150); ADR-0007–0018 accepted | [backlog](../backlog/README.md), [Sprint 1](../sprints/sprint-01/README.md), [G6 decisions](../backlog/G6-DECISIONS.md) | G6 ✅ 2026-10-26 (with conditions) |
| 7–10 | Delivery, QA, release, maintenance | ⚪ | — | — |

## Already decided (input to the phases above)
Product model · auth (ADR-0002) · **Electron accepted (ADR-0001)** · repo conventions (ADR-0003) · engineering workflow and skills (premium-craft, engineering-craft, ui-ux-guide).
- Personal project, shared openly and customisable · lean mode · 3-day sprints · **companion first (CR-010)**; the 14-day full-scope target now applies to the team app only · licence **fair source, FSL-1.1-MIT** (CR-010; was MIT); the name, Pip and the brand are all rights reserved in `TRADEMARKS.md` (founder, 2026-10-26). Never "open source".
- Positioning: Eucas complements Claude (software workspace with an agent team); no usage caps or pacing; models picked per task; local only; no phone in v0.1.
- Design: calm, chat-first Home with Atlas; dark first (charcoal) + light; copy removal test; second-person voice.

**Product name:** **Eucas** (2026-10-24, [decision](../requirements/interviews/2026-10-24-product-name.md)); the codename "Bench" was replaced in the living docs on 2026-10-26 (CR-010).

## Gate log

| Date | Gate | Decision | Client comments |
|---|---|---|---|
| 2026-10-22 | G1 (BRD) | **Approved**: BRD v0.5 baselined as v1.0 | "yes". Remaining detail assumptions are carried into the PRD/SRS as defaults |
| 2026-10-23 | G2 (PRD) | **Approved with changes**: PRD v0.3, BRD v1.2 | Accepted 8 recommendations; changed Q3 (browser asks only at first sign-in), Q4 (model auto by complexity, changeable), Q5 (agents never delete on the computer), Q6 (drafts only, never send or post). Recorded as CR-008 |
| 2026-10-24 | G0 (Problem & feasibility) | **Approved (go)** on spikes S0-1, SP-B1 and M8 ([reports](../spikes/)) | "Approve G0: go on S0-1, SP-B1 and M8. Record it and move on." S0-2 and S0-3 run in Sprint 1 |
| 2026-10-24 | G4 (UX) + G5 (UI) | **Approved** on prototype v0.8.2 | "Approve G4 (UX) and G5 (UI) on prototype v0.8.2." After three review rounds the same day: [UF5](../requirements/interviews/2026-10-24-ui-feedback-5.md) (titles and agent card, growing composer, drag-to-split, memory graph, scrollbars, fresh install), [UF6](../requirements/interviews/2026-10-24-ui-feedback-6.md) (left \| right split rules, pane borders, welcome copy), [UF7](../requirements/interviews/2026-10-24-ui-feedback-7.md) (compact panes) |
| 2026-10-26 | G3 (SRS) | **Approved**: companion v0.1 SRS v0.2, baselined as v1.0 | "Approve G3 on SRS v0.2. Record it and move on." G3 answers: supervisor "on from launch"; no export and learns-you "yes"; spend cap and numbers "okay lets do this", "approve the numbers"; "Keep Windows 10 in v0.1 and test it in a free Windows 10 virtual machine on my PC."; library rules "yes" |
| 2026-10-26 | G6 (Backlog & Sprint 1) | **Approved with conditions**: companion v0.1 backlog (34 stories, 157 tasks, 63.75 d, 11 sprints), Sprint 1, ADR-0007–0018 accepted | "Accept Gate 6": every recommendation in [G6-DECISIONS](../backlog/G6-DECISIONS.md) (1a–7a). Conditions: SP-ST2 GO before Sprint 2; SP-AC1 and P9 done before Sprint 4; the build starts on day 8 after the page goes live, only with ≥ 100 waitlist sign-ups; the launch waits for SP-SUP2 to pass |

## Change requests

| ID | Date | Summary | Status |
|---|---|---|---|
| [CR-001](../requirements/change-requests/CR-001.md) | 2026-10-22 | Manual projects, team per project, animated avatars | Approved |
| [CR-002](../requirements/change-requests/CR-002.md) | 2026-10-22 | Built-in Reverse Engineer + teardown before BRD approval | Approved |
| [CR-003](../requirements/change-requests/CR-003.md) | 2026-10-22 | Strategy moves M1–M11 (M4 replaced by CR-006) | Approved |
| [CR-004](../requirements/change-requests/CR-004.md) | 2026-10-22 | Local deliverables + opt-in browser agent | Approved |
| [CR-005](../requirements/change-requests/CR-005.md) | 2026-10-22 | Built-in skill library per role (+ engineering-craft, 2026-10-23) | Approved |
| [CR-006](../requirements/change-requests/CR-006.md) | 2026-10-22 | Routines can do anything the agent can | Approved |
| [CR-007](../requirements/change-requests/CR-007.md) | 2026-10-23 | Only what matters needs you; merge and commit are automatic (send part replaced by CR-008) | Approved |
| [CR-008](../requirements/change-requests/CR-008.md) | 2026-10-23 | Drafts, not sends; no deletes on the computer; browser asks only at sign-in | Approved |
| [CR-009](../requirements/change-requests/CR-009.md) | 2026-10-25 | The Atlas notch and local voice input in v0.1 (epic E16, N0–N10 in Sprints 3–5; spike + ADR-0004/5/6 before G6; N8/N9 checked at the day-6 re-plan) | Approved (option A) |
| [CR-010](../requirements/change-requests/CR-010.md) | 2026-10-26 | Companion first (guards and supervises existing Claude Code sessions); Pro $20, first 200 at $15 for life, with a provider-hosted open-model supervisor; FSL; Tauri + Rust (ADR-0007–0015); spikes only before G6; landing page and waitlist first | Approved (option A); applied in BRD v1.4 and PRD v0.5 |
| [CR-011](../requirements/change-requests/CR-011.md) | 2026-10-26 | Your Euca, an agentsitter created at setup, lives in the notch; a panel with needs-you, Settings, Rules and Usage (no main window); a visible supervisor meter (never dollars); a 14-day trial plus a monthly taste on Free; a design approval gate | Approved (option A); applied in BRD v1.5 and PRD v0.6 |
| [CR-012](../requirements/change-requests/CR-012.md) | 2026-10-26 | Everyone signs in with a Eucas account (email + one-time code, no password); the account holds only email, plan, budget and device count | Approved; applied in BRD v1.5 and PRD v0.6 |
