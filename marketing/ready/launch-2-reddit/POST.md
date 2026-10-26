# Launch L+1 · Reddit

| | |
|---|---|
| **Where** | r/ClaudeCode (standalone post if its rules allow launches, otherwise the weekly showcase thread); r/ClaudeAI ("Built with Claude" megathread, or the main feed with flair if your karma allows); r/SideProject |
| **When** | L+1 (Wednesday) 17:00 Doha; one subreddit per hour, never the same text in two |
| **Media** | `../media/videos/V1-h.mp4` as native video. **Before launch:** re-record these cuts from the shipped app in the same motion style (`marketing/shorts/src/mg`); keep Pip's faces as listed. |
| **Link** | r/ClaudeCode `https://eucas.app/?utm_source=reddit-claudecode&utm_medium=community&utm_campaign=launch` · r/ClaudeAI `https://eucas.app/?utm_source=reddit-claudeai&utm_medium=community&utm_campaign=launch` · r/SideProject `https://eucas.app/?utm_source=reddit-sideproject&utm_medium=community&utm_campaign=launch` |
| **Rules check** | Reddit's rules pages couldn't be read from this machine (blocked), so this comes from 2026 secondary sources. Read the sidebar, the rules and the pinned posts before posting. |

**Before you post:** read it once out loud and change anything that doesn't sound like you. You post by hand; nothing here is posted for you.

## r/ClaudeCode · title

```text
I built a Windows notch that watches your Claude Code sessions. It's out today, free, and here's what it can't do
```

## r/ClaudeCode · body

```text
In [month] I ran a 7-day demand test for this, and [N] of you joined the waitlist. The first build is out.

What it does:
- Shows which session is waiting, and for what, in one glance.
- Never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.
- Stops a session that starts deleting files in bulk, and shows what went and how to get it back.
- Lets you write rules ("let the tests run in web-app"), scoped to a folder, so the safe prompts stop.
- A supervisor answers the prompts your rules can't settle, within your rules. It runs on an open model, not on your Claude plan, and only sees the waiting session's last message with code, paths and secrets removed.

What it can't do: hooks only see tool calls. If the agent writes a script and runs it, the script's deletes don't pass through a hook. That's why there's a file-system tripwire on top, why Eucas never auto-approves interpreters or package installers, and why it tells you the moment its hook stops firing. If you need a hard boundary, use a container.

No account needed for the four limits and the bulk-delete stop. A free account adds rules, usage and the supervisor in full for 14 days.

Download and source: https://eucas.app/?utm_source=reddit-claudecode&utm_medium=community&utm_campaign=launch. Tell me what breaks.
```

## r/ClaudeAI · showcase

Same facts, framed as how it was built with Claude: the design-to-build process, one prompt that mattered, and the numbers. Link: `https://eucas.app/?utm_source=reddit-claudeai&utm_medium=community&utm_campaign=launch`.

## r/SideProject

```text
The result of my demand test, [X] weeks later: it's built

[N] people joined the waitlist in 7 days, so I built it. Here's what it does, what it can't do, and the numbers since: [installs, weekly users, what broke].

https://eucas.app/?utm_source=reddit-sideproject&utm_medium=community&utm_campaign=launch
```
