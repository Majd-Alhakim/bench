# Interview: Goals and key scenarios (batch 4)

- **Date:** 2026-10-21
- **Interviewer:** PM, with questions prepared by the BA
- **Client:** founder
- **Status:** multiple-choice answers recorded; open answers (Q3, Q4 numbers) pending

## Answers

| # | Question | Answer (verbatim where free text) |
|---|---|---|
| Q1 | Real work in month 1 | *"Mainly help me with my day to day work as BA and building my personal projects as an Aspiring Product manager"*, plus **Software development** and **Research & planning**. |
| Q2 | MVP scenarios | **All four groups:** Morning status · Delegate a feature · Group debate · Inbox / research / routines. |
| Q6 | Real files and commands | **Full Claude Code access.** Agents edit repos the client points them to and run git/npm/tests; risky actions go behind approvals. |
| Q8 | Bench vs Claude Code | **Replace it.** |
| Q8b | Phase the replacement? | **Phase it.** MVP = delegation and coordination with full file access (the client keeps Claude Code meanwhile). v1 adds Claude Code depth (diff review, terminal, commands), then Bench replaces it. |
| Q7 | MVP extras | **All Must:** research reports, Gmail inbox triage, scheduled routines, content pipeline. |
| Q4 | Success after 2 weeks | **All four:** daily habit · a concrete deliverable · accepted work · cost under control. Numbers and the named deliverable are pending. |
| Q5 | Day-1 org tree | **Product + Dev teams:** CEO → Product team (lead PM, BA, UX/UI) and Dev team (tech lead, developer, QA); research via freelancers. |

## Summary (BA interpretation)
- **Primary goals:** support the client's day job as a **business analyst** (requirements, documents, research), their path as an **aspiring PM** (personal projects end to end), and **software development**.
- **MVP scenarios (all Must):**
  1. Morning status and "what needs me"
  2. Delegating a feature to the Dev team, with real repo access
  3. Group debate
  4. Research reports
  5. Gmail inbox triage (read, sort, draft for approval)
  6. Scheduled routines
  7. Content pipeline
- **Scope impact (flagged by the PM):** Gmail and the scheduler move into the MVP, about **+2 sprints** compared with the provisional roadmap. The client accepted this by choosing them as Must.
- **Access:** full Claude Code-style file and shell access, scoped per agent, with approvals. The rule for two agents writing to the same folder is still open.
- **Claude Code replacement:** phased. The MVP is delegation-first; v1 reaches Claude Code depth.
- **The day-1 tree mirrors this project's own delivery team**, so Bench can be dogfooded on building Bench.

## Pending (asked in plain text)
- Q3: a walkthrough of scenario #1, and the 4 exception rules.
- Q4: the numbers N (accepted tasks per week), X% (limit left) and the named day-14 deliverable.
- Q6 follow-up: two writers in the same folder (queue vs. parallel git branches).
- Q8 edge case: the client edits a folder while an agent works in it (pause vs. warn).
