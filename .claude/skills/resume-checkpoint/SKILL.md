---
name: resume-checkpoint
description: Start a fresh session from the latest saved checkpoint. Finds the newest docs/process/checkpoints file (via the memory pointer or git), reads it with CLAUDE.md, STATUS and memory, verifies what actually changed since (merged PRs, stashes, branches, newer decisions, stopped agents), re-syncs the local checkout, and briefs the client with status, changes and the first next step. Use at the start of a session when the client says "continue", "resume", "pick up from the checkpoint" or "read the latest checkpoint".
---

# Resume from the latest checkpoint

The counterpart of `/save-checkpoint`. **The checkpoint is a starting hypothesis, not the truth.** Work may have moved on since it was written (merges, decisions, other sessions), so verify before acting.

## 1. Find the latest checkpoint
1. The memory pointer: the "Latest checkpoint" line in `project-bench-inception.md` (it gives the path and branch).
2. Then confirm there's nothing newer anywhere:
```bash
git fetch -q origin --prune
MSYS_NO_PATHCONV=1 git log --all --format='%h %cs %d %s' -- docs/process/checkpoints | head
```
   Pick the newest by date and session number. If it's only on a branch, read it with `MSYS_NO_PATHCONV=1 git show <branch>:<path>`.

## 2. Read, in this order
1. The checkpoint, fully.
2. `CLAUDE.md` (it may have changed).
3. `docs/process/STATUS.md`.
4. The memory index and the files it points to that matter for the next steps.

## 3. Verify reality against the checkpoint
```bash
git branch --show-current; git status --short; git stash list
git log --oneline -10 origin/main
gh pr list --state all --limit 10 --json number,state,title,headRefName
```
- **Merged since:** PRs the checkpoint calls "open" that are now merged. Their branch work is in `main`.
- **Newer decisions:** files in `docs/requirements/interviews/`, `change-requests/`, `docs/adr/` and `docs/design/` committed after the checkpoint's commit (`git log <checkpoint-commit>..origin/main --name-only`).
- **Stopped agents:** background agents from the old session are gone. Check the paths the checkpoint names for partial output, and the stashes it lists.
- **Stale items:** e.g. a stash of work that a later merge superseded. **Flag them for the client; never drop or delete them yourself.**

## 4. Re-sync the local checkout
- If the working branch is merged, or the tree is behind: switch to `main` and `git pull --ff-only` (only if the tree is clean or the changes are deliberately stashed).
- Never force anything. If the tree is dirty with unknown changes, stop and ask.

## 5. Brief the client (short)
- **Where we are:** the phase, and what's merged or open (2–3 lines).
- **Changed since the checkpoint:** what you found in step 3.
- **Next step:** the checkpoint's step 1, adjusted for what changed.
- **Open questions** that are still unanswered, and any stale items that need their call.

Then rebuild the task list from the next steps. **Start step 1 without asking** only if the client has already approved it (it's in the checkpoint's decisions or the client's words) and it isn't outward-facing. Otherwise ask one short go-ahead question.

## Don't
- Don't trust "open/merged/passed" from the checkpoint without checking.
- Don't redo finished work. Check git and the docs first.
- Don't resume a stopped agent's task from its old brief without re-reading the current requirements (they may have changed since).
