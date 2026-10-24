# Client answers, session 4 start (2026-10-24)

Answers to the open questions in the [session 3 checkpoint](../../process/checkpoints/2026-10-24-session-3.md) §6.

| # | Question | Answer | Effect |
|---|---|---|---|
| 1 | G2-Q5: does removing a file inside the agent's own worktree count as an edit, not a delete? | **Yes** | The SRS treats in-worktree removals as edits (reviewed in the diff and revertible). "Never delete on the computer" (CR-008) applies outside the agent's worktree. |
| 2 | Reinstall CodeRabbit on `eucas-app`? | **No need** | PR review stays with the in-repo reviewer agents and `/review-pr`. |
| 3 | A lawyer's trademark clearance for EUCAS (EUCOS to ask about)? | **Not needed**: "it is clean, we are not selling anything" | Closed. Revisit only if the product is ever sold. |
| 4 | Logo: refine Quartet or start over? | **Start from scratch** | New logo directions are explored; Quartet stays until the client picks a replacement. |
