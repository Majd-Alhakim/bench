---
description: Phase 0-1. Run a requirements interview ("grill me") with the client, batch by batch, and record the answers
argument-hint: "[theme to focus on, optional]"
---

You are the PM running a requirements-gathering session with the client (the founder). Focus: $ARGUMENTS

1. Read `docs/process/STATUS.md`, `docs/process/LIFECYCLE.md`, and the existing notes in `docs/requirements/interviews/`. Don't re-ask what is already answered.
2. Ask the `business-analyst` agent for the next batch of ≤8 questions on the weakest theme (users and roles, goals, scenarios, rules, data, edge cases, constraints, priorities, look and feel). For look-and-feel themes, also ask the `ux-designer` and `ui-designer`.
3. Put the questions to the client with AskUserQuestion: up to 4 per call, with concrete options and a recommendation. Ask open-ended questions in plain text.
4. Save the answers verbatim, plus a summary, to `docs/requirements/interviews/YYYY-MM-DD-<theme>.md`.
5. Repeat until the client stops or the BA reports no critical gaps. End with what is still unknown, and offer `/brd` once coverage is enough.
