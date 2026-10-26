# The launch kits (day L = the first runnable Windows build). Text follows marketing/drafts/launch-week.md.
from common import REDDIT_BLOCKED, head, u, write

GITHUB = "https://github.com/eucas-app/eucas"
RERECORD = ("**Before launch:** the media here are from the prototype and say \"Design preview\". Re-record the same shot lists "
            "from the shipped app (`marketing/shorts`, the same routes) and drop the label; keep Pip's faces as listed.")

WHAT = """- Shows which session is waiting, and for what, in one glance.
- Never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.
- Stops a session that starts deleting files in bulk, and shows what went and how to get it back.
- Lets you write rules ("let the tests run in web-app"), scoped to a folder, so the safe prompts stop.
- A supervisor answers the prompts your rules can't settle, within your rules. It runs on an open model, not on your Claude plan, and only sees the waiting session's last message with code, paths and secrets removed."""

CANT = ("What it can't do: hooks only see tool calls. If the agent writes a script and runs it, the script's deletes don't pass "
        "through a hook. That's why there's a file-system tripwire on top, why Eucas never auto-approves interpreters or package "
        "installers, and why it tells you the moment its hook stops firing. If you need a hard boundary, use a container.")


def build():
    L = "launch"
    write("launch-0-hn", head("Launch day L · Show HN",
        "news.ycombinator.com/submit, from an aged account with a comment history",
        "L (a Tuesday) 16:00–17:00 Doha (08:00–09:00 US Eastern)",
        "None on HN. The repo README starts with the V1 GIF",
        f"The URL field: `{GITHUB}` (the repo, not eucas.app). Inside the README, the site link is `{u('hn', 'community', L)}`",
        "HN: no landing or sign-up pages; it must run without signing up (the no-account taste covers this: check it on a clean Windows install first); never ask for votes or share the link in groups that would vote together.") + f"""
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
{WHAT}

{CANT}

Stack: Tauri and Rust. Windows 10 22H2 and 11. v0.1 isn't code-signed, so Windows will say "Unknown publisher".

Licence: fair source (FSL-1.1-MIT). The code is public on GitHub, so you can read exactly what it does. The name Eucas, Pip and its faces are trademarks.

No account needed for the four limits and the bulk-delete stop. Rules, usage and the supervisor need a free account; more supervisor help and budgets are Pro.

I'd love to hear where the guard is wrong. Especially: Windows path tricks I haven't covered.
```

## On the day

Stay in the thread 4–6 hours and answer every comment, short and factual. Answers to the usual questions ("just use a sandbox", "denylists are bypassable", "is this allowed by Anthropic's terms", "is it open source") are in `marketing/drafts/waitlist-week.md` → FAQ. If it gets no attention, you may repost once on another day.
""")

    write("launch-1-x", head("Launch day L · X thread (8 posts)",
        "X", "L 17:00 Doha, after the HN post is up",
        "Post 1: `../media/videos/V1-h.mp4`. Posts 2–6: the matching clips cut from V1/V2/V3 (or the images listed). " + RERECORD,
        f"Post 8: `{u('x', 'social', L)}`") + f"""
```text
1/ Eucas is out. A notch at the top of your Windows screen that watches your Claude Code sessions and taps you only when one needs you. Free.
```
```text
2/ One glance: which session is waiting, and for what. Nothing pops up and nothing steals your focus.
```
```text
3/ A delete, a push to your default branch, a send or a payment always comes to you. No rule can change that.
```
```text
4/ A session that starts deleting files in bulk is stopped. You see what went and how to get it back.
```
```text
5/ Say once what your sessions may do. The prompts you approve a hundred times a week stop.
```
```text
6/ What leaves your PC, word for word: only the waiting session's last message, trimmed, with code, paths and secrets removed, and only when your rules can't decide.
```
```text
7/ What it can't do: a script the agent writes and runs gets past any hook. That's why the tripwire exists, and why it tells you when it's off.
```
```text
8/ Windows 10 and 11. Claude Code in a terminal, the desktop app or VS Code. No account needed for the four limits. {u('x', 'social', L)}
```

Pip in posts 2–6: Toward you (2), none in the limits close-up (3), Concerned (4), Focused (5), Focused (6). Calm on the end card.
""")

    write("launch-2-reddit", head("Launch L+1 · Reddit",
        "r/ClaudeCode (standalone post if its rules allow launches, otherwise the weekly showcase thread); r/ClaudeAI (\"Built with Claude\" megathread, or the main feed with flair if your karma allows); r/SideProject",
        "L+1 (Wednesday) 17:00 Doha; one subreddit per hour, never the same text in two",
        "`../media/videos/V1-h.mp4` as native video. " + RERECORD,
        f"r/ClaudeCode `{u('reddit-claudecode', 'community', L)}` · r/ClaudeAI `{u('reddit-claudeai', 'community', L)}` · r/SideProject `{u('reddit-sideproject', 'community', L)}`",
        REDDIT_BLOCKED) + f"""
## r/ClaudeCode · title

```text
I built a Windows notch that watches your Claude Code sessions. It's out today, free, and here's what it can't do
```

## r/ClaudeCode · body

```text
In [month] I ran a 7-day demand test for this, and [N] of you joined the waitlist. The first build is out.

What it does:
{WHAT}

{CANT}

No account needed for the four limits and the bulk-delete stop. A free account adds rules, usage and the supervisor in full for 14 days.

Download and source: {u('reddit-claudecode', 'community', L)}. Tell me what breaks.
```

## r/ClaudeAI · showcase

Same facts, framed as how it was built with Claude: the design-to-build process, one prompt that mattered, and the numbers. Link: `{u('reddit-claudeai', 'community', L)}`.

## r/SideProject

```text
The result of my demand test, [X] weeks later: it's built

[N] people joined the waitlist in 7 days, so I built it. Here's what it does, what it can't do, and the numbers since: [installs, weekly users, what broke].

{u('reddit-sideproject', 'community', L)}
```
""")

    write("launch-3-linkedin", head("Launch L+1 · LinkedIn",
        "LinkedIn", "L+1 09:30 Doha",
        "`../media/images/li-d1.png` re-rendered from the shipped app (Pip: **Focused** over a real desktop)",
        f"No link in the post; reply with `{u('linkedin', 'social', L)}`") + """
```text
[X] weeks ago I said I'd only build Eucas if 100 people joined the waitlist in 7 days. [N] did. Today the first Windows build is out.

If you run Claude Code, Eucas is a notch at the top of your screen that watches your sessions and taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you.

Three things I learned building it alone:
1. [real lesson]
2. [real lesson]
3. [real lesson]

It's free to start. The link is in the comments.
```
""")

    write("launch-4-email", head("Launch L · The first-build email",
        "Resend, one email per person on the waitlist, each with that person's unsubscribe link and List-Unsubscribe headers",
        "L, the hour the HN post goes up", "None (plain text look, no tracking pixels)",
        f"`https://[download link]?utm_source=email&utm_medium=email&utm_campaign={L}`") + """
Use `marketing/drafts/emails.md` §4 as written, with [date], [N] and the download link filled in.
""")

    write("launch-5-producthunt", head("Launch L+7 · Product Hunt kit",
        "producthunt.com → Submit (you are the maker; no hunter needed)",
        "L+7 (a Tuesday) 11:01 Doha (00:01 US Pacific)",
        "Gallery `../media/images/ph-1.png` … `ph-6.png` (1270×760), thumbnail `../media/images/ph-thumb.png` (240×240), video `../media/videos/V4-h.mp4`. " + RERECORD,
        f"Website: `{u('producthunt', 'launchsite', L)}` · GitHub: `{GITHUB}`",
        "Never ask for upvotes (Product Hunt penalises it). Ask people to \"take a look and tell me what's missing\".") + f"""
| Field | Text |
|---|---|
| Name | Eucas |
| Tagline (≤ 60) | `A notch that watches your Claude Code sessions on Windows` |
| Description (≤ 260) | `Eucas lives in a notch at the top of your screen and watches the Claude Code sessions you already run. It taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you. Bulk deletes are stopped.` |
| Topics | Developer Tools, Artificial Intelligence, Windows, Productivity (skip the Open Source topic: Eucas is fair source) |
| Pricing | Free + paid (Pro $20/month; the first 200 keep $15/month for life) |

## Gallery (in this order)

| # | File | Caption | Pip |
|---|---|---|---|
| 1 | `V4-h.mp4` (the video slot) | Set up in a minute, step by step | Closed → Calm → Focused |
| 2 | `ph-1.png` | One glance: which session needs you | Toward you |
| 3 | `ph-2.png` | What each session is waiting for, in one panel | Toward you |
| 4 | `ph-3.png` | A delete, a push, a send or a payment always comes to you | none (the limits list) |
| 5 | `ph-4.png` | A session that deletes files in bulk is stopped | Concerned |
| 6 | `ph-5.png` | What leaves your PC, word for word | Focused |
| 7 | `ph-6.png` | Name your Euca | Calm |

## Maker's first comment

```text
Hi Product Hunt, I'm Majd. Eucas started as a 7-day demand test: 100 waitlist sign-ups or I wouldn't build it. [N] of you joined, so here it is.

If you run several Claude Code sessions on Windows, it's a notch that watches them and taps you only when one needs you. No account needed for the four limits and the bulk-delete stop. What I'd love to hear: which prompt you'd most like to stop seeing.
```
""")

    write("launch-6-newsletters", head("Launch L+2 · Newsletters",
        "Console.dev (email), Changelog News (form), The Rundown AI (free tool form)",
        "L+2 (Thursday)", "None",
        f"Console.dev `{u('console', 'newsletter', L)}` · Changelog `{u('changelog', 'newsletter', L)}` · The Rundown `{u('rundown', 'newsletter', L)}`") + f"""
## Console.dev · email to hello@console.dev

**Subject:** Eucas, a Windows companion for Claude Code sessions (v0.1, free tier)

```text
Hi, Eucas is a Windows app that watches the Claude Code sessions you already run: it never auto-approves a delete, a push to your default branch, a send or a payment, stops bulk deletes, and answers safe prompts within your rules so you get asked less. v0.1, individual sign-up, free tier, no account needed for the core limits, fair source with the code public on GitHub: {u('console', 'newsletter', L)}. Happy to answer anything.

Majd
```

## Changelog News · https://changelog.com/news/submit

It excludes commercial products and Eucas has a paid plan, so it may not qualify. If you submit: `{GITHUB}` with "A Windows notch that watches your Claude Code sessions; fair source."

## The Rundown AI · https://www.rundown.ai/submit

The free "recommend a tool" route only. One line: "Eucas: a Windows notch that watches your Claude Code sessions and holds deletes, pushes, sends and payments for your yes."
""")

    write("launch-7-awesome-claude-code", head("Launch L+14 · awesome-claude-code",
        "github.com/hesreallyhim/awesome-claude-code → the **web issue form** only (a PR or the `gh` CLI can get you restricted)",
        "L+14 or later", "None", f"`{GITHUB}`",
        "A human submits; the repo is older than 14 days with commits after day 1 (true since 24 Oct); sign-up or payment is a blocker, which the no-account taste avoids. One plain line, no emojis.") + """
| Field | Text |
|---|---|
| Name | Eucas |
| Description | `A Windows notch that shows which Claude Code session needs you, holds deletes, pushes to the default branch, sends and payments for your approval, and stops sessions that delete files in bulk. The core works without an account.` |
""")
