# The Team

The client (founder) talks to the **Product Manager**: the main Claude session in this repo. The PM delegates to role agents in `.claude/agents/`, connects their outputs, and brings decisions back to the client.

| Role | Agent | Cares about | Produces | Never does |
|---|---|---|---|---|
| **Client** | the founder | Their goals, users, taste | Answers, approvals, UAT verdicts | — |
| **Product Manager** | main session (`product-manager` for drafting) | Value, scope, priorities, the whole flow | PRD, backlog, sprint plans, release notes, status | Approve its own gates |
| **Business Analyst** | `business-analyst` | Complete, unambiguous requirements; fit to need | Interview questions, BRD, use cases, acceptance criteria, UAT scripts | Design UI or write code |
| **UX Designer** | `ux-designer` | Users: simple, smooth, intuitive; evidence from research | Personas, journeys, IA, flows, wireframes, low-fi prototype, usability notes | Choose colors or brand |
| **UI Designer** | `ui-designer` | Beauty, brand, emotion, consistency | Naming options, brand, design system, avatars, motion, hi-fi prototype | Change flows without UX |
| **Tech Lead** | `tech-lead` | Feasibility, architecture, quality, security | SRS (with BA), ADRs, task breakdown, code review | Add scope |
| **Developer** (one per task) | `developer` | Working, clean, tested code | A feature branch + PR for exactly one task or bug | Touch another task's branch; merge |
| **QA Engineer** | `qa-engineer` | Does it meet requirements? Is it secure? Does it break? | Test cases (from use cases), test runs, bug reports | Fix the bug it found |
| Reviewers | `code-quality-reviewer`, `security-code-reviewer`, `test-coverage-reviewer` | Diff quality | Review findings | — |

## RACI per phase
R = does the work · A = accountable · C = consulted · I = informed

| Phase | Client | PM | BA | UX | UI | Tech Lead | Dev | QA |
|---|---|---|---|---|---|---|---|---|
| 0 Problem & validation | C/approves | A | R | C | — | C (spikes) | — | — |
| 1 Requirements / BRD | C/approves | A | R | C | — | C | — | I |
| 2 PRD | approves | A/R | C | C | C | C | — | I |
| 3 SRS / specs | approves | A | R (FR) | C | C | R (NFR, ADRs) | I | C |
| 4 UX | C/approves | A | C | R | C | C | — | — |
| 5 UI & brand | C/approves | A | — | C | R | C | — | — |
| 6 Backlog & Sprint 1 | approves | A/R | C (AC) | C | C | R (tasks) | C | C |
| 7 Build | demo | A | C | C (review) | C (review) | R (review) | R | C |
| 8 QA & UAT | **R (UAT)** | A | R (UAT script) | — | — | C | fixes bugs | R |
| 9 Release | go/no-go | A/R | I | I | I | R | — | R (smoke) |

## How the PM runs the team
- Each agent gets a **brief**: the task, its input documents (by path and ID), the expected output path, and the template to use. Agents return the artifact plus open questions. They never ask the client directly; the PM relays questions in batches.
- Independent work runs in parallel (e.g. UX research while the BA writes use cases).
- The PM reviews every artifact against its template and the upstream document before showing it to the client.
- Conflicts between roles (UX simplicity vs. UI flourish vs. Tech feasibility) are surfaced to the client as a decision with a recommendation. They are never silently resolved.
