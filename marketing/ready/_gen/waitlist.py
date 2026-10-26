# The 7-day waitlist sprint posts (days 1-8). Text follows marketing/drafts/waitlist-week.md, finalised.
from common import ARTICLE, REDDIT_BLOCKED, head, u, write


def build():
    # ---------- Day 1 ----------
    write("d1-dm", head("Day 1 · Direct messages (30 people)",
        "WhatsApp, LinkedIn messages, X DMs, Discord DMs: people you know who code",
        "Monday, from 10:00 Doha, one at a time through the day",
        "None (the link shows the site's own preview card)",
        f"`{u('dm', 'direct')}`") + f"""
## Who

Write the 30 names down before you start: colleagues, classmates, developer friends in Doha, anyone you've seen use Claude Code. Send one message at a time. Never paste the same message into a group.

## Message (change the first line for every person)

```text
Hi [name], [one line that's only for them: their project, the last time you talked].

I'm testing an idea before I build it, and you're exactly who it's for. If you run Claude Code, would you look at this for one minute? {u('dm', 'direct')}

It's a small notch at the top of your Windows screen that watches your Claude Code sessions and taps you only when one needs you. Deletes, pushes to your default branch, sends and payments always come to you.

The rule I set myself: if 100 people don't join the waitlist in 7 days, I don't build it. If it's useful to you, joining is the vote. If it isn't, I'd love to hear why.
```

Tick each name when sent. On day 7 you send one follow-up to those who didn't answer (`d7-dm-followup`), never a second one.
""")

    write("d1-linkedin", head("Day 1 · LinkedIn post",
        "Your LinkedIn profile (a post, not an article)",
        "Monday 09:30 Doha (your network is mostly in the Gulf)",
        "`../media/images/li-d1.png` (1200×1200). Pip: **Toward you** (a session waits)",
        f"**No link in the post** (LinkedIn cuts the reach of posts with links). If someone asks, reply with `{u('linkedin', 'social')}`") + """
## Text

```text
I'm running a test this week, and the result decides whether I build the thing.

If you use Claude Code, you know the routine. You start three sessions to go faster. Then you spend the day checking on them: which one is waiting for a yes, which one is about to run out of usage, whether two of them are editing the same file.

Eucas is my answer: a small notch at the top of your Windows screen. Your Euca lives in it, watches your sessions and taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you, and no rule can change that.

It isn't built yet. The design is done, and the picture is from the prototype.

The test: if 100 people join the waitlist by Sunday, I build it. If not, I don't, and I'll post what I learned either way.

If you run coding agents, ask me for the link in the comments. If you know someone who does, sending this to them helps more than a like.
```

Answer every comment within the hour for the first 3 hours.
""")

    write("d1-x", head("Day 1 · X announcement (4 posts)",
        "X, your account: post 1, then three replies to it",
        "Monday 17:00 Doha (09:00 US Eastern)",
        "Post 1: `../media/videos/V1-h.mp4` (landscape, 23.5 s, with music and Eucas's own sounds; captions burned in). Pip: Focused → Glance → Toward you → Pleased → Calm → Focused → Concerned → Pleased → Calm",
        f"Reply 2 only: `{u('x', 'social')}`") + f"""
## Post 1 (attach V1-h.mp4)

```text
You started three Claude Code sessions to go faster.

Now you spend the day checking on them.

I designed Eucas: a notch at the top of your Windows screen that watches them and taps you only when one needs you.

It isn't built yet. If 100 people join the waitlist in 7 days, I build it.
```

## Reply 1

```text
Four things always come to you: a delete, a push to your default branch, a send, a payment. No rule can change that.

If a session starts deleting files in bulk, it's stopped, and you see what went and how to get it back.
```

## Reply 2

```text
The waitlist: {u('x', 'social')}

Free to join. When Pro opens, the first 200 who pay keep $15/month for life, and the waitlist hears first.
```

## Reply 3

```text
I'll post the real count every evening this week. Day 1 starts now.
```

Pin post 1 for the week and put the same link in your X bio.

## Every evening this week, 22:00 Doha

Reply to post 1 with the count: "Day [d]: [N] of 100." Optional image: render `count-wide` with tonight's numbers (see `../INDEX.md`).
""")

    write("d1-indiehackers", head("Day 1 · Indie Hackers post",
        "indiehackers.com → a group such as Building in Public (read the group's rules first)",
        "Monday 18:00 Doha",
        "`../media/images/ih-d1.png` (1200×630). Pip: **Toward you**",
        f"`{u('ih', 'community')}`") + f"""
## Title

```text
I set myself a rule: 100 waitlist sign-ups in 7 days, or I don't build it
```

## Body

```text
I'm a solo developer in Doha. For the last few weeks I've been designing Eucas, a Windows companion for people who run several Claude Code sessions at once. It watches them from a notch at the top of the screen and taps you only when one needs you: a session waiting for a yes, a delete or push it shouldn't do without you, a usage limit coming, two sessions editing the same file.

Before I write the code, I'm testing demand with a waitlist. The rule: 100 sign-ups in 7 days, or I don't build it. Not "pivot", not "extend the deadline". Stop.

Why the hard line: I wrote a pre-mortem on this idea, and the most likely way it dies is that I spend weeks building something nobody asked for. A tool in this space with 19k GitHub stars earns about $100 a month in sponsorships. The bar for "people want this" has to be set before I'm attached to the code.

What I'll share here every day this week:
- visitors, sign-ups and conversion, by source;
- which channel worked and which didn't;
- the objections people raise.

The page: {u('ih', 'community')}

What would you change on it?
```
""")

    # ---------- Day 2 ----------
    write("d2-devto", head("Day 2 · Dev.to article (the useful post)",
        "dev.to → Create post. Tags: `claudecode`, `windows`, `ai`, `productivity`",
        "Tuesday 15:00 Doha (07:00 US Eastern), before the Reddit post",
        "Cover: `../media/images/devto-d2.png` (1000×420). Pip: **Concerned**, no red marker",
        f"Only in the last section: `{u('devto', 'article')}`") + f"""
## Title

```text
Claude Code deletes on Windows: what happened this autumn, and 7 things to do today
```

## Body (paste as Markdown)

````markdown
{ARTICLE}

## What I'm building, briefly

I'm designing a Windows companion, Eucas, partly because of these reports. It never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. It also stops a session that starts deleting files in bulk and shows you what went and how to get it back. It can't promise that nothing bad ever happens, and nothing built on hooks can: see point 4. It isn't built yet; there's a waitlist at {u('devto', 'article')}, and the build only happens if enough people want it.

If you've hit one of these, what happened, and what would have caught it?
````

## Check before publishing

- Open the summary and each of the four issues: the numbers in the first paragraph must match.
- Check the File History path on your own Windows 11.
- Optional: cross-post to Hashnode with the canonical URL set to this Dev.to post, and its link changed to `{u('hashnode', 'article')}`.
""")

    write("d2-reddit-claudecode", head("Day 2 · r/ClaudeCode discussion post",
        "reddit.com/r/ClaudeCode → Create post. Flair: Discussion (or the closest)",
        "Tuesday 17:00 Doha (09:00 US Eastern)",
        "None. Text only",
        f"**No link in the post.** Only if someone asks what you're building, reply once with `{u('reddit-claudecode', 'community')}`",
        REDDIT_BLOCKED + " Founders report a weekly showcase thread for promotion; this post promotes nothing, so it belongs in the main feed. If your karma is low, spend 20 minutes answering others there on day 1.") + f"""
## Title

```text
I read all four Windows recursive-delete reports from Sep–Oct. Here's the pattern, and what to set up today
```

## Body

````markdown
{ARTICLE}

I'm building a tool around this, but that's not the point of the post. The steps above work without it. If you've had a close call on Windows, what was the command?
````
""")

    write("d2-x", head("Day 2 · X post for the article",
        "X", "Tuesday 17:30 Doha, after the Reddit post",
        "`../media/images/x-d2.png` (1600×900). Pip: **Concerned**, no red marker",
        "The Dev.to article URL (the waitlist link is inside it)") + """
## Text

```text
Four Windows users reported Claude Code deletes reaching their drive root this autumn. 116 to 600 GB each.

I read all four. None was the model "going rogue". Each was a path that meant one thing to the agent and another to Windows.

The pattern, and 7 things you can set up today: [the Dev.to article URL]
```
""")

    # ---------- Day 3 ----------
    write("d3-reddit-claudeai", head("Day 3 · r/ClaudeAI showcase comment",
        "reddit.com/r/ClaudeAI: a **comment in the pinned \"Built with Claude\" showcase megathread**",
        "Wednesday 17:00 Doha",
        "`../media/gif/V1-h.gif` (silent) if the thread allows images in comments; otherwise none",
        f"`{u('reddit-claudeai', 'community')}`",
        REDDIT_BLOCKED + " Reported: showcases go in the megathread (Rule 7); a main-feed post needs roughly 50–100+ karma or is redirected. Follow the megathread's own format.") + f"""
## Comment

```markdown
**Eucas: a notch for your Claude Code sessions on Windows (design stage, waitlist)**

**What:** a small notch at the top of your screen that watches the Claude Code sessions you already run and taps you only when one needs you: waiting for a yes, a delete, a push to your default branch, a send or a payment (these always ask you), a usage limit coming, two sessions in one file.

**How it was made with Claude:** the whole design process ran as Claude Code sessions: requirements, a pre-mortem that changed the safety promise, a clickable prototype with 93 states, and the landing page. The supervisor model was picked from a test of 189 labelled moments: gpt-oss-120b gave 0% dangerous answers and asked 68% less than rules alone, in that test.

**Demo:** the clip is the real prototype. Nothing to install yet.

**Ask:** if 100 people join in 7 days, I build it. {u('reddit-claudeai', 'community')}. Honest criticism welcome, especially from Windows users.
```
""")

    write("d3-reddit-sideproject", head("Day 3 · r/SideProject post",
        "reddit.com/r/SideProject → Create post",
        "Wednesday 18:00 Doha",
        "`../media/images/sideproject-d3.png` (1600×900). Pip: **Toward you**",
        f"`{u('reddit-sideproject', 'community')}`",
        REDDIT_BLOCKED + " Self-promotion is welcome there; low-effort \"check this out\" posts, reposts and upvote-begging get removed.") + f"""
## Title

```text
Day 3 of a 7-day demand test: 100 waitlist sign-ups or I don't build it. [N] so far
```

## Body

```text
I'm a solo developer in Doha designing Eucas, a Windows companion for people who run several Claude Code sessions at once. It watches them from a notch at the top of the screen and taps you only when one needs you.

Before writing the code I set a rule: 100 waitlist sign-ups in 7 days, or I stop. No pivot, no extension.

Where the [N] came from so far: [your real breakdown from the evening query, e.g. "DMs 14, Dev.to 9, LinkedIn 6"].
What surprised me: [one honest line].

The page: {u('reddit-sideproject', 'community')}

Tell me what's unclear on it. I'll answer every comment.
```

Fill the [brackets] from tonight's query before posting. Never post a number you haven't checked.
""")

    write("d3-x", head("Day 3 · X post",
        "X", "Wednesday 17:00 Doha",
        "**Pending:** V2 is being remade as motion graphics after V1 is approved. Until it lands in `../media/videos`, post this text with `../media/stills/V1-panel.png` instead",
        f"In a reply: `{u('x', 'social')}`") + """
## Text

```text
You approved pnpm test 212 times this week.

Your Euca suggests a rule from what you approve by hand. Or you say it in plain words, and it drafts the rule, scoped to one folder.

Deletes, pushes, sends and payments still come to you.

Day 3: [N] of 100.
```

Checkpoint tonight: under 40 sign-ups means the fallback in `marketing/WAITLIST.md` §5 starts tomorrow.
""")

    # ---------- Day 4 ----------
    write("d4-x", head("Day 4 · X thread: what leaves your PC",
        "X", "Thursday 17:00 Doha",
        "Post 1: **Pending:** V3 is being remade as motion graphics after V1 is approved. Until it lands in `../media/videos`, post this text with `../media/stills/V1-end.png` instead",
        f"Post 6: `{u('x', 'social')}`") + f"""
## Thread

```text
1/ An AI supervisor watching your coding sessions. The first question you should ask: what does it see?

Here's the answer for Eucas, word for word.
```

```text
2/ Your rules decide first, in plain code on your machine. Only the moments they can't settle go any further.
```

```text
3/ When Eucas isn't sure, it sends the waiting session's last message, trimmed, with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC.
```

```text
4/ Your account holds your email, your plan and how much supervisor help you've used. Your Claude login stays yours: Eucas never sees or stores it.
```

```text
5/ Setup shows you this with a message from your own sessions. Settings always shows it too.
```

```text
6/ It isn't built yet. If 100 people join this week, it is. Day 4: [N] of 100. {u('x', 'social')}
```
""")

    write("d4-reddit-chatgptcoding", head("Day 4 · r/ChatGPTCoding weekly self-promotion thread",
        "reddit.com/r/ChatGPTCoding: **only** the pinned weekly self-promotion thread, as a comment",
        "Thursday 18:00 Doha",
        "None",
        f"`{u('reddit-chatgptcoding', 'community')}`",
        REDDIT_BLOCKED + " If there's no promotion thread this week, skip this slot.") + f"""
## Comment

```text
Eucas: a Windows notch that watches your Claude Code sessions and taps you only when one needs you. Deletes, pushes to your default branch, sends and payments always come to you. Claude Code first; Codex and Cursor depend on what the waitlist asks for (the form asks which agents you use). Design stage, demand test this week: {u('reddit-chatgptcoding', 'community')}
```
""")

    write("d4-discord", head("Day 4 · Discord",
        "One server where you're already a member, in its showcase or self-promotion channel only",
        "Thursday 19:00 Doha",
        "None",
        f"`{u('discord', 'community')}`",
        "Read the server's #rules first. Never post in a general channel or DM members you don't know.") + f"""
## Message

```text
Hi all. I've been designing a Windows companion for people who run several Claude Code sessions: a notch that taps you only when a session needs you. It's a design preview with a 7-day demand test (100 sign-ups or I don't build it). If you're on Windows, I'd value one honest reaction: {u('discord', 'community')}
```
""")

    # ---------- Day 5 ----------
    honest = """Day 5 of my demand test: [N] of 100.

What worked: [top source and its number].
What didn't: [the weakest channel, honestly].
What people asked most: [the top objection, and your answer].
[M] of them clicked "Join as a founding member" (the $15/month-for-life offer for the first 200).

Two days left."""
    write("d5-x", head("Day 5 · X: the honest count",
        "X", "Friday 17:00 Doha",
        "Render `count-wide` with tonight's numbers (command in `../INDEX.md`). Pip: **Focused** (the test is still running)",
        f"In a reply: `{u('x', 'social')}`") + f"""
## Text

```text
{honest}

If you run Claude Code on Windows and want this, the link is below. If you're on Mac, join anyway and tick macOS: it's how I decide what comes next.
```
""")
    write("d5-linkedin", head("Day 5 · LinkedIn: the honest count",
        "LinkedIn", "Friday 09:30 Doha",
        "Render `count-square` with tonight's numbers. Pip: **Focused**",
        f"No link in the post; reply with `{u('linkedin', 'social')}` when asked") + f"""
## Text

```text
{honest}

What I've learned so far: [one real lesson, in one or two sentences].

If you know someone who runs Claude Code on Windows, sending them this helps more than anything else.
```
""")
    write("d5-indiehackers", head("Day 5 · Indie Hackers update",
        "A comment on your day-1 Indie Hackers post (keeps the thread together)", "Friday 18:00 Doha",
        "Render `count-wide`", f"`{u('ih', 'community')}`") + f"""
## Comment

```text
{honest}

Visitors so far: [V] (Umami). Conversion: [N/V]%. The best-converting source was [source] at [x]%.
```
""")
    write("d5-email-youtubers", head("Day 5 · Emails to 3 small Claude Code YouTubers",
        "Email, to the business address on each channel's About page (never a DM on a platform that discourages it)",
        "Friday, any time", "One link to your V1 post on X", "None; this asks for nothing now") + """
## Who

Small channels are the realistic first ask (examples from the research: Daniel Ávila, Built With Claude). Pick 3 whose videos you've actually watched.

## Email

**Subject:** A Windows notch for Claude Code sessions: would it fit a video later?

```text
Hi [name],

Your video on [a specific video, and something real you took from it] is why I'm writing.

I'm a solo developer designing Eucas: a notch at the top of a Windows screen that watches your Claude Code sessions, taps you only when one needs you, and never auto-approves a delete, a push to your default branch, a send or a payment.

It's a design preview right now (a 30-second clip: [link to your V1 post]). I'm not asking for a video now. When the first Windows build is ready, may I send it to you early? No payment, no script, and honest criticism is welcome.

[Your name]
eucas.app
```
""")

    # ---------- Day 6 ----------
    write("d6-reddit-webdev", head("Day 6 · r/webdev Showoff Saturday",
        "reddit.com/r/webdev → Create post, **Saturday only**, with the Showoff Saturday flair",
        "Saturday 16:00 Doha",
        "`../media/images/webdev-d6.png` (the landing page's first screen, dark)",
        f"`{u('reddit-webdev', 'community')}`",
        REDDIT_BLOCKED + " Reported: projects only on Saturday; posts that read like ads get removed even then. This post is about how the page is built.") + f"""
## Title

```text
[Showoff Saturday] A notch on a web page: the eucas.app landing page reacts to the section you're reading
```

## Body

```text
The landing page for my (unbuilt) Windows app has a live notch at the top edge. Its eyes follow your pointer and blink, its state follows the section in view, and hovering it opens a peek that melts out of the notch with an SVG goo filter.

Stack: static HTML, CSS and a little JS on Cloudflare Workers, D1 for the waitlist, Turnstile, no framework. Happy to share how the goo effect and the scroll-linked states work.

{u('reddit-webdev', 'community')}
```
""")
    write("d6-reddit-claudecode-showcase", head("Day 6 · r/ClaudeCode weekly showcase thread",
        "reddit.com/r/ClaudeCode: a comment in this week's showcase thread (if there is one)",
        "Saturday 17:00 Doha",
        "None", f"`{u('reddit-claudecode', 'community')}`", REDDIT_BLOCKED) + f"""
## Comment

```text
Eucas: a notch at the top of your Windows screen that watches your Claude Code sessions and taps you only when one needs you. Deletes, pushes to your default branch, sends and payments always come to you; a session that starts deleting files in bulk is stopped. It's a design preview with a 7-day demand test (100 sign-ups or I don't build it), and today is day 6: {u('reddit-claudecode', 'community')}
```
""")
    write("d6-shorts", head("Day 6 · YouTube Shorts, TikTok, Instagram Reels",
        "Upload natively in each app (no cross-post links)", "Saturday, from 12:00 Doha, one per platform",
        "Vertical 1080×1920: `../media/videos/V1-v.mp4` now; V5 and V6 follow once V1 is approved. Add a quiet track from the platform's own library (the files are silent)",
        f"Description: YouTube `{u('yt', 'video')}`, TikTok `{u('tiktok', 'video')}` (bio link), Reels `{u('reels', 'video')}` (bio link)") + """
## V5 · title / caption

```text
Two Claude Code sessions, one file. Eucas warns you before one overwrites the other. Design preview; Windows waitlist at eucas.app
```

## V6 · title / caption

```text
Hit your usage limit halfway through? Eucas shows when you'll run out, with time to spare. Design preview; Windows waitlist at eucas.app
```

Tags (YouTube): `claude code`, `ai coding`, `windows`, `developer tools`. No hashtag walls.
""")

    # ---------- Day 7 ----------
    last = """Last day of my demand test: [N] of 100.

If you've been meaning to look: eucas.app. Free to join. When Pro opens, the first 200 who pay keep $15/month for life.

Tomorrow I'll post the result and what I decide, whichever way it goes."""
    write("d7-x", head("Day 7 · X: the last day", "X", "Sunday 17:00 Doha",
        "Render `count-wide` with tonight's numbers, or reuse `../media/videos/V1-s.mp4`", f"In a reply: `{u('x', 'social')}`") + f"""
```text
{last}
```
""")
    write("d7-linkedin", head("Day 7 · LinkedIn: the last day", "LinkedIn", "Sunday 09:30 Doha",
        "Render `count-square`", f"No link in the post; reply with `{u('linkedin', 'social')}`") + f"""
```text
{last.replace('eucas.app', 'the link in the comments')}
```
""")
    write("d7-dm-followup", head("Day 7 · One follow-up to day-1 DMs that got no answer",
        "The same chats as `d1-dm`", "Sunday, any time", "None", f"`{u('dm', 'direct')}`") + f"""
Send once, never twice.

```text
No pressure at all. Today's the last day of the test, so this is my one reminder: {u('dm', 'direct')}. Thanks either way.
```
""")

    # ---------- Day 8 ----------
    result = """The demand test is over. [N] people joined in 7 days.

Where they came from: [top three sources].
[x]% on Windows, [y]% on macOS, [z]% run 4 or more sessions at once.
[M] clicked the founding-member offer.
What I learned: [two honest lines].

What happens now: [build, with the next date / don't build, and what I'll do instead].

Thank you to everyone who joined, and to everyone who told me why they didn't."""
    write("d8-result", head("Day 8 · The result (post it whatever the number)",
        "X (reply to your day-1 post and a new post), LinkedIn, Indie Hackers (a comment on your day-1 post), and one reply in each Reddit thread you posted",
        "Monday 17:00 Doha",
        "Render `count-square` / `count-wide` with `day: 8` (Pip: **Pleased**, all caught up)",
        "None needed; the result is the point") + f"""
## Text

```text
{result}
```

## The update email (only if the test passed)

Send update 1 from `marketing/drafts/emails.md` §1 to the list, one email per person through Resend, with each person's unsubscribe link. The consent allows at most a couple of updates a month.
""")
