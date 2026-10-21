---
description: Commit on a feature branch, push, and open a PR using the template
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git switch:*), Bash(git push:*), Bash(git branch:*), Bash(gh pr create:*), Read
---

## Context
- Branch: !`git branch --show-current`
- Status: !`git status --short`

## Task
1. If on `main`, create a branch first (`feat/ fix/ chore/ docs/ spike/` + backlog id + slug). Never commit to `main`.
2. Make sure `/review-pr` has been run on non-trivial changes and its findings are fixed.
3. Commit with a Conventional Commit message (`type(scope): summary`), ending with the Co-Authored-By trailer.
4. Push with `-u` and open the PR with `gh pr create`, filling in `.github/pull_request_template.md` (backlog id, how it was tested, checklist).
5. Print the PR URL. Do not merge: merging waits for green CI and the founder's OK.
