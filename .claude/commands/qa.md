---
description: Phase 8. QA a story or PR against its use case and acceptance criteria, then prepare client UAT
argument-hint: "<issue or PR number>"
---

Target: $ARGUMENTS

1. Brief the `qa-engineer` with the story, its UC/FR IDs, and the PR or build to test. Output: test cases in `docs/sprints/sprint-NN/qa/<story>.md`.
2. Have the `business-analyst` check the results against the requirements and list any gaps by ID.
3. File each bug as a GitHub issue using the bug form, and have the PM assign it to a `developer` agent.
4. If everything passes, give the client the UAT script for the testing build and record their verdict.
