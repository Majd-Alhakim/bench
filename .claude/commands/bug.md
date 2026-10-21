---
description: Triage a bug. Reproduce it, set severity, link it to a story, and assign a developer agent to fix it with a failing test first
argument-hint: "<bug description or issue number>"
---

Bug: $ARGUMENTS

1. Create or read the bug issue, using the bug form fields. Reproduce the bug, or ask for whatever information is missing.
2. Set the severity (S1 blocker … S4 cosmetic) and link the story, use case or test case. S1 and S2 go into the current sprint; the rest go to the backlog for the PM to prioritize.
3. Assign a `developer` agent: branch `fix/<issue>-<slug>`, regression test first, PR with `Closes #N`. Then run `/qa` on the fix.
