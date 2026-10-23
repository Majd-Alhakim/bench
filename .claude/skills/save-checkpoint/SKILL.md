---
name: save-checkpoint
description: Save a session checkpoint so a fresh session can continue exactly where this one stopped. Secures all work in git (commit, push, stash partial work), writes docs/process/checkpoints/<date>-session-<n>.md in the fixed 8-section format (BR-66), updates STATUS and memory, and gives the client the line to resume. Use when the client says "save a checkpoint", "save everything", "we're at X% context", "I'll start a new session", or when context passes ~80%.
---

# Save checkpoint

This is Bench's own context-checkpoint rule (BR-66), applied to our working sessions: **save at a natural breakpoint, in a fixed format, including what failed, then continue in a fresh session.** The next session runs `/resume-checkpoint`.

**Golden rule:** a checkpoint describes *verified* state. Run the commands; don't recall from memory. Nothing gets lost, and nothing gets deleted.

## 1. Reach a breakpoint
- Finish or pause the current step. Above ~90% context, checkpoint immediately, even mid-step.
- Running background agents (subagents, workflows, other sessions) **do not survive** the session. For each one, either wait for it to finish (if that's quick and the client agrees) or record exactly what it was doing and where its partial output is.

## 2. Secure the work in git (verify every step)
```bash
git status --short; git stash list; git branch --show-current
git log --oneline @{u}..HEAD 2>/dev/null   # unpushed commits
gh pr list --json number,title,headRefName,isDraft
```
- **Finished work:** commit on its feature branch (never `main`) with a Conventional Commit message, then push.
- **Partial work that's worth keeping:** `git stash push -m "<what>, <why stopped>, <date>" -- <paths>`. Name the stash in the checkpoint.
- **Agents editing the tree right now:** don't commit their files half-written. Stash them, or note them, after the agent stops.
- **Never** discard, `reset --hard`, drop a stash or delete a branch to "clean up". List anything stale under Open questions for the client.
- Confirm the tree is clean or deliberately stashed: `git status --short` prints nothing unexpected.

## 3. Write the checkpoint file
Path: `docs/process/checkpoints/YYYY-MM-DD-session-<n>.md` (n = the previous highest + 1). Keep it under ~150 lines, and **link to docs instead of copying them**.

```markdown
# Checkpoint: <session label> (<start date> → <end date>)
<one line: why the checkpoint was taken (e.g. 83% context) and what to read first>

## 1. Goal                 – the product goal and the current target, in 2–3 lines
## 2. Decisions            – each with its reason and source path (ADRs, interviews, CRs); quote the client verbatim when it matters
## 3. Files and branches   – table: PR | branch | contents | state (open / merged / draft), plus stashes and worktrees
## 4. Current step         – what was in progress, with exactly where its partial output is
## 5. Next steps           – an ordered list; step 1 must be runnable without any further questions
## 6. Open questions       – decisions only the client can make
## 7. Things tried that failed – each with the fix or workaround that worked
## 8. Mistakes and their fixes – the lessons, so they aren't repeated
## 9. Handover state       – merged/open summary, the exact first task, and any commands the next session needs (e.g. render/test commands, env quirks)
```

## 4. Update the pointers
- `docs/process/STATUS.md`: the current phase and next step, if they changed.
- **Memory:** in the project memory file (`project-bench-inception.md`), set the "Latest checkpoint" line to the new path **and the branch it's on**. Save any new durable lesson or client preference as its own memory file and add it to the MEMORY.md index.

## 5. Commit and hand over
- Commit the checkpoint (and the STATUS update) on the current working branch, or a `docs/` branch if you're on `main`, then push.
- Re-run `git status --short` and `git stash list` and check they match what the checkpoint says.
- Tell the client, briefly:
  - what was saved (the commits, PRs and stashes)
  - what's still open
  - how to resume: *"start a new session and run `/resume-checkpoint`"*

## Don't
- Don't put secrets, tokens or credential paths in the checkpoint.
- Don't claim something merged or passed without checking `gh`/git.
- Don't write a history novel. Decisions, state, next steps and lessons only.
