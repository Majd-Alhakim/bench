# Software Requirements Specification (SRS): <Product>

| Status | Version | Owners | Approver | Upstream |
|---|---|---|---|---|
| Draft | 0.1 | BA (functional), Tech Lead (non-functional) | Client | BRD vX.Y, PRD vX.Y |

Audience: developers, designers and QA. Every requirement is **testable** and traces back to a use case.

## 1. System overview
Context diagram and the main components (link ARCHITECTURE.md / ADRs).

## 2. Functional requirements
| ID | Requirement ("The system shall …") | Use case | Priority | Acceptance / verification |
|---|---|---|---|---|
| FR-001 | … | UC-01 | Must | Test: … |

Group by feature area (Agents, Memory, Connectors, Groups, Handoffs, Approvals, Usage…).

## 3. Non-functional requirements
| ID | Category | Requirement (measurable) | Verification |
|---|---|---|---|
| NFR-001 | Performance | First token visible < 2 s after send (p95, local) | Benchmark |
| NFR-0xx | Security | … | Security review / tests |
| NFR-0xx | Privacy | … | |
| NFR-0xx | Reliability | … | |
| NFR-0xx | Usability / accessibility | WCAG 2.2 AA contrast, full keyboard use | Audit |
| NFR-0xx | Portability | Windows 11, macOS 14+, Ubuntu 22.04+ | CI matrix |
| NFR-0xx | Cost / usage | … | Ledger metrics |
| NFR-0xx | Maintainability | … | |

## 4. Interfaces
UI (link the design), IPC contracts, MCP tools, files on disk, external services.

## 5. Data model
Entities, fields, relationships, retention, migrations.

## 6. Constraints and compliance
Anthropic usage terms (ADR-0002), licenses, OS policies.

## 7. Traceability matrix
| Use case | FR / NFR | Epic / story | Test case |
|---|---|---|---|

## 8. Sign-off
| Client | Tech Lead | Date |
|---|---|---|
