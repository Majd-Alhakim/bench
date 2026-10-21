---
description: Phase 1. Have the BA draft or update the BRD from the interview notes
---

1. Brief the `business-analyst` agent:
   - inputs: `docs/requirements/interviews/*`, `docs/PRODUCT-MODEL.md`, `docs/VISION.md`
   - template: `docs/templates/BRD.md`
   - output: `docs/requirements/BRD.md` (status Draft; bump the version if it already exists)
2. Review it yourself:
   - every use case has all its fields
   - IDs are stable
   - nothing is invented
   - assumptions are marked
3. Show the client a short summary and the open questions. Set the status to `In Review`, in the doc and in STATUS.md. Approval happens with `/gate G1`.
