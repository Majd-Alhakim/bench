# Delivery Lifecycle

How this project moves from idea to shipped product. It follows the classic BA → PM → design → delivery → QA → release flow, run with agile delivery and a human client.

- **Client:** the founder. Approves every gate, answers requirements questions, and does UAT.
- **Team:** Claude-run role agents. See [TEAM.md](TEAM.md).
- **Live status:** [STATUS.md](STATUS.md). Each phase has a command in `.claude/commands/`.

> Rule: **no phase starts until the previous gate is approved by the client** in STATUS.md, and nothing is *implemented* before Gate 6.

> **Lean mode (client decision, 2026-10-21):** "Seeing is believing."
> - Every document covers **only the MVP's use cases** and stays short: the BRD lists use cases, the PRD is 1–2 pages, and the SRS only holds requirements a developer or tester needs.
> - The **UX low-fi prototype comes early**: it is drafted right after the first BRD draft, in parallel with the PRD.
> - The documents are then corrected against what the client sees in the prototype. Documents are living until their gate; after that, changes go through a change request.
> - Out of scope for now: outside-user validation (no waitlist or public post). **The client is the only user** of this personal project.

## Phases and gates

| # | Phase | Owner (agent) | Output | Command | Gate (client approves) |
|---|---|---|---|---|---|
| 0 | **Problem & validation** | PM + BA | Problem statement, target users, competitors, feasibility spikes | `/discovery` | G0: "This is the problem, worth solving" |
| 1 | **Requirements gathering** | Business Analyst | Interview notes → **BRD** (roles, definitions, use cases) | `/discovery`, `/brd` | G1: BRD approved |
| 1b | **Competitor teardown** (before the BRD is baselined) | Reverse Engineer | Teardowns of competitors and reference products (public evidence only, REA method) → Steal/Avoid/Beat → **proposed** BRD items for the client | `/teardown` | Feeds G1: the client accepts or rejects the proposed items |
| 2 | **Product definition** | Product Manager | **PRD** (goals, scope, MVP cut, metrics, release plan) | `/prd` | G2: PRD approved |
| 3 | **Specification** | Tech Lead + BA | **SRS**: functional (FR) + non-functional (NFR) requirements, traceability to use cases; ADRs | `/specs` | G3: Specs approved |
| 4 | **UX design** | UX Designer | Personas, journeys, information architecture, user flows, **wireframes / clickable prototype** | `/design-ux` | G4: Flows and wireframes approved |
| 5 | **UI design & brand** | UI Designer | **Product name**, brand, design system (tokens, type, color, motion), agent avatars and animations, **hi-fi prototype** | `/design-ui` | G5: Name, look and feel approved |
| 6 | **Delivery readiness** | PM | Epics → user stories (with acceptance criteria) → prioritized backlog; Sprint 1 plan | `/plan-sprint` | G6: Backlog and Sprint 1 scope approved → **build starts** |
| 7 | **Agile delivery** (repeats) | PM, Tech Lead, Developers | Increments on feature branches → PRs → `main` | `/standup`, `/review-pr`, `/bug` | Sprint review demo |
| 8 | **QA & UAT** (each sprint) | QA + BA | Test cases from use cases, test runs, bugs; **UAT by the client** in the test environment | `/qa` | Stories accepted / rejected |
| 9 | **Release** | PM + Tech Lead | Release notes, installer through dev → test → prod ([deploy-checklist](../deploy-checklist.md)) | `/release` | G9: Go/no-go |
| 10 | **Maintenance** | Everyone | Bug triage, Dependabot, monitoring, change requests | `/bug`, `/change-request` | — |

Gates are recorded with date, decision and comments in [STATUS.md](STATUS.md) (command: `/gate`).

## Document lifecycle

Every requirements or design document moves through the same states, shown in its header:

`Draft` → `In Review` (client reading) → `Approved` (gate passed) → `Baselined` (frozen) → *changes only through a Change Request* (`/change-request` → impact analysis → client approval → new version).

Every document has a version table. Traceability chain: **Use case (BRD) → Requirement (SRS) → Epic/Story → Test case → Release**. Every ID is referenced downstream, so nothing gets built that nobody asked for, and nothing asked for gets lost.

## Agile delivery rules (Phase 7)

- **Sprint length: 3 days, goal-boxed** (client decision, 2026-10-21; human-speed 2-week sprints rejected). Re-measure after Sprints 1–2 and adjust in the retro.
  - Why 3 days: one task (branch, code, tests, CI, review, PR) takes an agent about 15–60 minutes. Coding is not the bottleneck. The real limits are: (1) the client's demo, UAT and approval time; (2) the Claude subscription's usage windows when several developer agents run in parallel; (3) CI time. Three days fits roughly 8–15 tasks, one demo and one retro.
  - Rhythm: Day 1 planning (morning) → build → Day 3 review + retro → the next sprint starts right away.
  - Velocity is tracked in points and in tokens per accepted story, so the usage limit is planned like team capacity.
- Ceremonies:
  - **Sprint planning** (`/plan-sprint`): PM proposes a sprint goal + stories from the top of the backlog. Tech Lead splits them into tasks. Client approves.
  - **Daily standup** (`/standup`): done / doing / blocked, read from the board and git activity.
  - **Sprint review** (`/sprint-review`): demo to the client, accept or reject each story.
  - **Retrospective** (inside `/sprint-review`): what went well, what to improve, one or two concrete action items carried into the next sprint.
- **Work item types:** Epic → User Story → Task; Bug; Spike; Change Request.
- **Board states (Kanban):** `Backlog` → `Ready` (meets Definition of Ready) → `In Progress` → `In Review` (PR open) → `QA` → `Done` (meets Definition of Done; client-accepted at review).
- **One task = one branch = one PR.** Developers never share a branch. Bugs get assigned to a developer agent, with a failing test first.
- **Definition of Ready:** has a use-case or requirement link, acceptance criteria (Given/When/Then), design reference if it has UI, estimate, no open blockers.
- **Definition of Done:** see [CLAUDE.md](../../CLAUDE.md) (branch + PR, reviewed, tests, CI green, QA passed, docs updated, client accepted).

## Environments ("regions")

| Stage | For Eucas (desktop app) | Who uses it |
|---|---|---|
| **Development** | `pnpm dev` on a feature branch, with a separate dev Eucas home folder (never real data) | Developer agents |
| **Testing** | CI build artifacts per PR, plus a **beta / prerelease** installer from `main` for QA and client UAT | QA agent, client |
| **Production** | Stable GitHub Release, with auto-update | Client (and later the public) |

## Where things live

| Artifact | Location |
|---|---|
| Discovery notes, BRD, PRD, SRS | `docs/requirements/` |
| UX and UI deliverables, prototypes | `docs/design/` |
| Templates | `docs/templates/` |
| Epics, stories, bugs | GitHub Issues (forms in `.github/ISSUE_TEMPLATE/`) on a GitHub Projects board. Fallback: `docs/BACKLOG.md` |
| Sprint plans, standups, reviews | `docs/sprints/sprint-NN/` |
| Decisions | `docs/adr/` |
