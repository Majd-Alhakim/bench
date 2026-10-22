---
description: Competitor teardown, run before the BRD is baselined (and on demand). The reverse-engineer agent tears down named products from public evidence and proposes BRD items
argument-hint: "<product(s) to tear down, or blank for the standard competitor set>"
---

Targets: $ARGUMENTS (if blank, use the competitors in `docs/research/competitive-brief.md`)

1. Load the `competitor-teardown` skill. Brief the `reverse-engineer` agent, one per product in parallel, with: the targets, the decision this informs (the current BRD), existing research to build on, and output paths under `docs/research/teardowns/`.
2. Review each teardown. Check that every claim is typed (Observation, Inference or Unknown) and has a source and date, that nothing breaks the legal boundary, and that the checklist is closed.
3. Merge the results into the teardown index and a strategy delta. Ask the `business-analyst` to turn the accepted recommendations into **proposed** BRD items (marked "from teardown").
4. Present to the client: the top Steal/Avoid/Beat items and the proposed BRD items. Only items the client approves enter the BRD. Then continue to `/gate G1`.
