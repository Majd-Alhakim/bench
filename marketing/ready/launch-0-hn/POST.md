# Launch day L · Show HN

| | |
|---|---|
| **Where** | news.ycombinator.com/submit, from an aged account with a comment history |
| **When** | L (a Tuesday) 16:00–17:00 Doha (08:00–09:00 US Eastern) |
| **Media** | None on HN. The repo README starts with the V1 GIF |
| **Link** | The URL field: `https://github.com/eucas-app/eucas` (the repo, not eucas.app). Inside the README, the site link is `https://eucas.app/?utm_source=hn&utm_medium=community&utm_campaign=launch` |
| **Rules check** | HN: no landing or sign-up pages; it must run without signing up (the no-account taste covers this: check it on a clean Windows install first); never ask for votes or share the link in groups that would vote together. |

**Before you post:** read it once out loud and change anything that doesn't sound like you. You post by hand; nothing here is posted for you.

## Title

```text
Show HN: Eucas – a Windows notch that watches your Claude Code sessions
```

## First comment (post it right after submitting)

```text
Hi HN, I'm Majd, a solo developer in Doha.

I run several Claude Code sessions at once, and I kept losing time to two things: checking which one was waiting for me, and reading permission prompts for commands I'd approved a hundred times. Then this autumn four Windows users reported recursive deletes that reached their drive root (anthropics/claude-code issues 92593, 95426, 97660, 99193), and I wanted something on my own machine that I trusted.

Eucas is a small notch at the top of the screen. It watches the sessions you already run and taps you only when one needs you.

What it does:
- Shows which session is waiting, and for what, in one glance.
- Never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.
- Stops a session that starts deleting files in bulk, and shows what went and how to get it back.
- Lets you write rules ("let the tests run in web-app"), scoped to a folder, so the safe prompts stop.
- A supervisor answers the prompts your rules can't settle, within your rules. It runs on an open model, not on your Claude plan, and only sees the waiting session's last message with code, paths and secrets removed.

What it can't do: hooks only see tool calls. If the agent writes a script and runs it, the script's deletes don't pass through a hook. That's why there's a file-system tripwire on top, why Eucas never auto-approves interpreters or package installers, and why it tells you the moment its hook stops firing. If you need a hard boundary, use a container.

Stack: Tauri and Rust. Windows 10 22H2 and 11. v0.1 isn't code-signed, so Windows will say "Unknown publisher".

Licence: fair source (FSL-1.1-MIT). The code is public on GitHub, so you can read exactly what it does. The name Eucas, Pip and its faces are trademarks.

No account needed for the four limits and the bulk-delete stop. Rules, usage and the supervisor need a free account; more supervisor help and budgets are Pro.

I'd love to hear where the guard is wrong. Especially: Windows path tricks I haven't covered.
```

## On the day

Stay in the thread 4–6 hours and answer every comment, short and factual. Answers to the usual questions ("just use a sandbox", "denylists are bypassable", "is this allowed by Anthropic's terms", "is it open source") are in `marketing/drafts/waitlist-week.md` → FAQ. If it gets no attention, you may repost once on another day.
