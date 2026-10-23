# Client decisions: UX audit D1–D6 (2026-10-22)

The client's words: *"Accept the recommended answers for D1-D6. Fix the prototype with them plus the 32 must-fix findings, then I'll click through it."*

| # | Decision |
|---|---|
| D1 | **First-run defaults:** nothing is pre-selected. Gmail starts unticked; the client picks a template. |
| D2 | **"What needs me" order:** blocked work, then outward or reserved approvals, then meeting requests, then proposals, then FYI. |
| D3 | **"Always allow" scope:** a command pattern in one repo (e.g. `npm test` in Bench). The grant states its scope and where to revoke it. |
| D4 | **Cost per message:** tokens and % of the weekly limit. No dollar figure in the client's views. |
| D5 | **Usage limit reached:** no API-key nudge. Show when work resumes; API mode is mentioned only in Settings. |
| D6 | **Closing a review with unreviewed items:** the session closes; those items stay "In review" and are listed in the memo. |

Source: docs/design/ux/guide-audit.md §4. These feed the PRD/SRS as confirmed UX decisions.
