---
description: Phase 3. Produce the SRS (functional + non-functional requirements) with traceability
---

Precondition: G2 is approved.

1. Run in parallel:
   - the `business-analyst` writes the functional requirements (FR) from the BRD use cases;
   - the `tech-lead` writes the NFRs, interfaces, data model and any ADRs.

   Template: `docs/templates/SRS.md`. Output: `docs/requirements/SRS.md`.
2. Merge the two. Every Must use case maps to at least one FR, and every FR is testable and traces back to a use case. Fill in the traceability matrix.
3. Present the summary and the decisions the client needs to make. Approval happens with `/gate G3`.
