---
description: Review the current branch's diff against main using REVIEW.md, then fix the findings
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(gh pr view:*), Bash(gh pr diff:*), Read, Grep, Glob, Task
---

## Context
- Branch: !`git branch --show-current`
- Commits vs main: !`git log --oneline main..HEAD`
- Changed files: !`git diff --stat main...HEAD`

## Task
1. Read [REVIEW.md](../../REVIEW.md) and the full diff (`git diff main...HEAD`).
2. Run these reviewer agents in parallel on the diff: `code-quality-reviewer`, `security-code-reviewer`, `test-coverage-reviewer`.
3. Add the **spec axis** (the mattpocock-skills `code-review` approach): check the diff against the story's acceptance criteria and its constraint contract. Report any criterion that is unmet, partly met or untested.
   If the diff touches UI (renderer, styles, prototypes), also review it against the `ui-ux-guide` checklist and the `premium-craft` rubric (states and recovery, coherence, motion) with rendered screenshots.
4. Merge their findings. Drop any finding without a concrete failure scenario, and check each remaining one against the code yourself.
5. Report the confirmed findings, most severe first, as `file:line — problem — fix`.
6. If this is a self-review before a PR, fix the confirmed findings, then re-run `pnpm check:all` (once it exists).
