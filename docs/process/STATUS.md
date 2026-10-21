# Project Status

Single source of truth for where the project is in the [lifecycle](LIFECYCLE.md). Updated by the PM; gates are approved only by the client.

**Current phase:** 1 (requirements gathering in progress)
**Next step:** `/discovery` next theme (goals and key scenarios); then `/brd`

## Phase tracker

| # | Phase | Status | Artifacts | Gate |
|---|---|---|---|---|
| 0 | Problem & validation | 🟡 Mostly done (spikes S0-1..3 pending) | [VISION](../VISION.md), [competitive brief](../research/competitive-brief.md), [research](../research/) | G0 ⏳ |
| 1 | Requirements / BRD | 🟡 Interviews in progress ([users & roles](../requirements/interviews/2026-10-21-users-and-roles.md) ✅) | `docs/requirements/BRD.md` | G1 ⏳ |
| 2 | PRD | ⚪ Not started | `docs/requirements/PRD.md` | G2 ⏳ |
| 3 | SRS / specs | ⚪ Not started (ARCHITECTURE and ADRs exist as early input) | `docs/requirements/SRS.md` | G3 ⏳ |
| 4 | UX design | ⚪ Not started | `docs/design/ux/` | G4 ⏳ |
| 5 | UI design & brand (incl. **final name**) | ⚪ Not started | `docs/design/ui/` | G5 ⏳ |
| 6 | Backlog & Sprint 1 | ⚪ Not started ([BACKLOG](../BACKLOG.md) / [ROADMAP](../ROADMAP.md) are provisional) | GitHub Issues / board | G6 ⏳ |
| 7–10 | Delivery, QA, release, maintenance | ⚪ | — | — |

## Already decided (input to the phases above, not a substitute for them)
Product model (main agent + user-created agents, private and global memory, connectors per agent) · auth approach (ADR-0002) · cross-platform Electron stack (ADR-0001, *to confirm*) · repo conventions (ADR-0003) · engineering workflow (CLAUDE.md).
**Client decisions (2026-10-21):**
- Personal project: the client is the only user for now, so there is no outside validation.
- **Lean mode**: MVP-only documents, and the UX prototype comes early.
- **3-day sprints**, re-measured after Sprint 2.

**Not decided:** product name ("Bench" is only a codename), look and feel, avatars and animation, MVP scope.

## Gate log

| Date | Gate | Decision | Client comments |
|---|---|---|---|
| — | — | — | — |

## Change requests

| ID | Date | Summary | Impact | Status |
|---|---|---|---|---|
| — | — | — | — | — |
