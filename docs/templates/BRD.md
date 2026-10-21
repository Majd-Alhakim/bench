# Business Requirements Document (BRD): <Product>

| Field | Value |
|---|---|
| Status | Draft / In Review / Approved / Baselined |
| Version | 0.1 |
| Owner | Business Analyst |
| Approver | Client |
| Sources | Interview notes `docs/requirements/interviews/*.md` |

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | YYYY-MM-DD | BA | First draft |

## 1. Purpose and business context
Why this product exists, the problem (from the Phase 0 problem statement), and the business objectives (measurable).

## 2. Scope
- **In scope:** …
- **Out of scope:** …
- **Assumptions:** …
- **Constraints:** (platform, budget, legal, subscription limits, timeline)
- **Dependencies:** (Claude Code, connectors, OS)

## 3. Stakeholders and user roles
| Role | Description | Goals | Permissions |
|---|---|---|---|
| e.g. Owner (client) | … | … | … |
| e.g. Main agent | system actor | … | … |

## 4. Definitions and glossary
| Term | Definition |
|---|---|
| Agent | … |
| Global memory | … |

## 5. Business process overview
Current state ("as-is") vs. target state ("to-be"). A diagram or numbered flow.

## 6. Use cases

Index:
| ID | Name | Primary actor | Priority (MoSCoW) |
|---|---|---|---|
| UC-01 | … | … | Must |

### UC-01: <Verb + object, e.g. "Create an agent">
| Field | Content |
|---|---|
| **Description** | One paragraph: what the actor achieves and why |
| **Actors** | Primary: … · Secondary: … (system actors included) |
| **Trigger** | What starts it |
| **Preconditions** | What must be true before it starts |
| **Postconditions** | Success: … · Failure: … (system state guaranteed after) |
| **Priority** | Must / Should / Could / Won't (this release) |
| **Frequency** | e.g. several times a day |

**Main flow**
1. Actor …
2. System …
3. …

**Alternative flows**
- **A1 (at step 2):** If …, then … and return to step 3.

**Exceptions**
- **E1 (at step n):** If <error>, the system <shows / logs / rolls back>, and the use case ends in <state>.

**Validations / business rules**
- **BR-01:** e.g. agent name is 1–40 characters and unique.

**Non-functional notes** (performance, security, privacy, accessibility) relevant to this use case.

**Acceptance criteria (draft)**: Given/When/Then, refined later in stories.

**Notes / open questions**: decisions pending, with the person who will answer.

**States** (if the use case moves an entity through a lifecycle): state diagram or table `State → Event → Next state`.

(repeat per use case)

## 7. Business rules catalogue
| ID | Rule | Applies to (UC) |
|---|---|---|

## 8. Data requirements
Entities, key fields, ownership, retention, and what leaves the device.

## 9. Reporting and visibility needs
What the client must be able to see (traces, costs, memory…).

## 10. Open issues
| # | Question | Owner | Due |
|---|---|---|---|

## 11. Sign-off
| Name | Role | Decision | Date |
|---|---|---|---|
| Client | Approver | | |
