# Day 2 · Dev.to article (the useful post)

| | |
|---|---|
| **Where** | dev.to → Create post. Tags: `claudecode`, `windows`, `ai`, `productivity` |
| **When** | Tuesday 15:00 Doha (07:00 US Eastern), before the Reddit post |
| **Media** | Cover: `../media/images/devto-d2.png` (1000×420). Pip: **Concerned**, no red marker |
| **Link** | Only in the last section: `https://eucas.app/?utm_source=devto&utm_medium=article&utm_campaign=waitlist-w1` |

**Before you post:** read it once out loud and change anything that doesn't sound like you. You post by hand; nothing here is posted for you.

## Title

```text
Claude Code deletes on Windows: what happened this autumn, and 7 things to do today
```

## Body (paste as Markdown)

````markdown
Between 7 September and 3 October 2026, four Windows users reported Claude Code recursive deletes that reached their profile or drive root. The losses ranged from 116 to 600 GB, including `.ssh` folders and CLI tokens. In at least one, the user says auto mode approved the command. ([summary](https://vibegraveyard.ai/story/claude-code-windows-path-alias-recursive-deletions/); issues [#92593](https://github.com/anthropics/claude-code/issues/92593), [#95426](https://github.com/anthropics/claude-code/issues/95426), [#97660](https://github.com/anthropics/claude-code/issues/97660), [#99193](https://github.com/anthropics/claude-code/issues/99193). These are user reports; as of 3 October none had a maintainer reply.)

None of them was a model "going rogue". Each was a path that meant one thing to the agent and another to Windows:

- **8.3 short names.** `C:/Users/ALEXAN~1` can be the same folder as `C:/Users/alexandra`. A path check that looks for one doesn't match the other.
- **MSYS and Git Bash translation.** `/c/Users/...`, `C:\Users\...` and `C:/Users/...` are the same place, and a backslash can be eaten on the way through.
- **Variables that expand to nothing.** In PowerShell, an unset variable becomes an empty string, so `rm -rf "$target/"` can become `rm -rf "/"` before bash ever runs.
- **Junctions.** A delete that follows an NTFS junction leaves the folder you meant and walks into one you didn't.
- **Nested shells.** In one report, a protected-path check caught PowerShell's `Remove-Item` but not `rm -rf` inside `bash -lc`.

In two of the reports, the delete kept running for 5 to 45 minutes after the agent said it had stopped it.

## What you can do today, with no new tool

1. **Turn on File History** (Control Panel › File History) or OneDrive backup for your user folder. It's the only step here that brings files back.
2. **Commit and push before a long session.** `git restore` can only bring back what git has seen.
3. **Don't use auto mode or `--dangerously-skip-permissions` in a folder that contains junctions or symlinks into other places**, and never from your home folder.
4. **Add deny rules for the obvious ones** in your Claude Code settings (`permissions.deny`), for example recursive `rm` and `Remove-Item -Recurse`. Check the permissions docs for your version's exact syntax. Know their limit: a deny rule matches the command text, so a script the agent writes and then runs gets past it.
5. **Run risky work somewhere it can't reach your profile**: WSL with the project inside the Linux filesystem, a dev container, or a separate Windows user.
6. **Watch Task Manager after you say stop.** If disk activity keeps going, end the process tree yourself.
7. **Keep your tokens out of your profile's blast radius** where you can, and know how to rotate them. Several of the reports lost `.ssh` and CLI credentials.

## What I'm building, briefly

I'm designing a Windows companion, Eucas, partly because of these reports. It never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. It also stops a session that starts deleting files in bulk and shows you what went and how to get it back. It can't promise that nothing bad ever happens, and nothing built on hooks can: see point 4. It isn't built yet; there's a waitlist at https://eucas.app/?utm_source=devto&utm_medium=article&utm_campaign=waitlist-w1, and the build only happens if enough people want it.

If you've hit one of these, what happened, and what would have caught it?
````

## Check before publishing

- Open the summary and each of the four issues: the numbers in the first paragraph must match.
- Check the File History path on your own Windows 11.
- Optional: cross-post to Hashnode with the canonical URL set to this Dev.to post, and its link changed to `https://eucas.app/?utm_source=hashnode&utm_medium=article&utm_campaign=waitlist-w1`.
