# Project Status

Single source of truth for where the project is in the [lifecycle](LIFECYCLE.md). Updated by the PM; gates are approved only by the client.

**Current phase:** 3 (SRS), lean mode. G0, G1, G2, **G4 and G5** approved (G4/G5 on prototype v0.8.2, 2026-10-24).
**Next step:** the SRS (`/specs`): BA functional requirements + tech-lead NFRs (M8 hook-based jail, M9 version pin, M10 worktrees, browser agent, runaway guard, safety net, the `claude auth status` onboarding check), then G3 → backlog and Sprint 1 → G6. Session 4 (2026-10-24/25): the Quartet logo refined ([lessons](../design/ui/brand/logo-lessons.md), BRAND §6) and a 51 s showcase video approved ([marketing/showcase](../../marketing/showcase/README.md)).

## Phase tracker

| # | Phase | Status | Artifacts | Gate |
|---|---|---|---|---|
| 0 | Problem & validation | ✅ Spikes S0-1, SP-B1, M8 GO (2026-10-24); S0-2, S0-3 in Sprint 1 | [VISION](../VISION.md), [research](../research/), [risk facts](../research/risk-facts-2026-10-23.md) | G0 ✅ 2026-10-24 |
| 1 | Requirements / BRD | ✅ v1.0 baselined; **v1.2** applies CR-001…008 + G2 answers; open items §10 #41–#43 | [BRD](../requirements/BRD.md), [interviews](../requirements/interviews/) | G1 ✅ 2026-10-22 |
| 2 | PRD | ✅ **v0.3** (5 × 3-day sprints, 51 UCs), G2 questions answered | [PRD](../requirements/PRD.md), [G2 answers](../requirements/interviews/2026-10-23-g2-answers.md) | G2 ✅ 2026-10-23 |
| 3 | SRS / specs | ⚪ Not started (ARCHITECTURE and ADRs exist as early input) | `docs/requirements/SRS.md` | G3 ⏳ |
| 4 | UX design | ✅ Premium spec, Laws of UX audit; flows proven in prototype v0.8.2 | [UX premium](../design/ux/premium/README.md), [Laws of UX audit](../design/ux/laws-of-ux-audit.md) | G4 ✅ 2026-10-24 |
| 5 | UI design & brand | ✅ Brand decided (Quartet logo, Porcelain/Ink/Cobalt, Instrument Sans, sounds, dark first); hi-fi prototype **v0.8.2** (review rounds 5–7 applied); **name: Eucas** (one agent is a Euca) | [DIRECTION](../design/ui/DIRECTION.md), [prototype](../design/ui/prototype/direction.html), [brand](../design/ui/brand/BRAND.md), [system](../design/ui/system/DESIGN-SYSTEM.md) | G5 ✅ 2026-10-24 |
| 6 | Backlog & Sprint 1 | ⚪ Not started (stories drafted in PRD v0.2 Appendix A) | GitHub Issues / board | G6 ⏳ |
| 7–10 | Delivery, QA, release, maintenance | ⚪ | — | — |

## Already decided (input to the phases above)
Product model · auth (ADR-0002) · **Electron accepted (ADR-0001)** · repo conventions (ADR-0003) · engineering workflow and skills (premium-craft, engineering-craft, ui-ux-guide).
- Personal project, shared openly and customisable · lean mode · 3-day sprints · **full scope, open-source ready 14 days after G6** · licence MIT.
- Positioning: Bench complements Claude (software workspace with an agent team); no usage caps or pacing; models picked per task; local only; no phone in v0.1.
- Design: calm, chat-first Home with Atlas; dark first (charcoal) + light; copy removal test; second-person voice.

**Product name:** **Eucas** (2026-10-24, [decision](../requirements/interviews/2026-10-24-product-name.md)); "Bench" stays the codename in the repo until the rename task.

## Gate log

| Date | Gate | Decision | Client comments |
|---|---|---|---|
| 2026-10-22 | G1 (BRD) | **Approved**: BRD v0.5 baselined as v1.0 | "yes". Remaining detail assumptions are carried into the PRD/SRS as defaults |
| 2026-10-23 | G2 (PRD) | **Approved with changes**: PRD v0.3, BRD v1.2 | Accepted 8 recommendations; changed Q3 (browser asks only at first sign-in), Q4 (model auto by complexity, changeable), Q5 (agents never delete on the computer), Q6 (drafts only, never send or post). Recorded as CR-008 |
| 2026-10-24 | G0 (Problem & feasibility) | **Approved (go)** on spikes S0-1, SP-B1 and M8 ([reports](../spikes/)) | "Approve G0: go on S0-1, SP-B1 and M8. Record it and move on." S0-2 and S0-3 run in Sprint 1 |
| 2026-10-24 | G4 (UX) + G5 (UI) | **Approved** on prototype v0.8.2 | "Approve G4 (UX) and G5 (UI) on prototype v0.8.2." After three review rounds the same day: [UF5](../requirements/interviews/2026-10-24-ui-feedback-5.md) (titles and agent card, growing composer, drag-to-split, memory graph, scrollbars, fresh install), [UF6](../requirements/interviews/2026-10-24-ui-feedback-6.md) (left \| right split rules, pane borders, welcome copy), [UF7](../requirements/interviews/2026-10-24-ui-feedback-7.md) (compact panes) |

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
