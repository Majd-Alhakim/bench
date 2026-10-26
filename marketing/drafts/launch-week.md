# Launch week: every post, ready to paste

For **launch day L**, the day the first Windows build can be downloaded and run. The schedule is in [PLAN §6](../PLAN.md#6-launch-plan). Same voice rules as [waitlist-week.md](waitlist-week.md): rewrite in your own words, no hype, the fixed safety sentence only, and "Claude Code" is the tool you guard, never the product's name.

**Two conditions before Show HN** (from HN's rules): people can **run it without signing up**, and there's something real to try. If the account is still required before the guard works, either let the four limits and the bulk-delete stop run without an account (setup already guards before sign-in) or wait. HN readers treat a sign-up wall as a landing page.

---

## 1. Show HN (L, Tuesday, 16:00–17:00 Doha = 8–9 am ET)

**Title** (under 80 characters, no hype words):

> Show HN: Eucas – a Windows notch that watches your Claude Code sessions

Alternatives: "Show HN: Eucas – get asked less by your Claude Code sessions, on Windows" · "Show HN: A guard for Claude Code on Windows that tells you when it's off"

**URL:** the GitHub repo (people can read and run it), not eucas.app.

**First comment (post it yourself right after submitting):**

> Hi HN, I'm Majd, a solo developer in Doha.
>
> I run several Claude Code sessions at once, and I kept losing time to two things: checking which one was waiting for me, and reading permission prompts for commands I'd approved a hundred times. Then this autumn four Windows users reported recursive deletes that reached their drive root (issues #92593, #95426, #97660, #99193), and I wanted something on my own machine that I trusted.
>
> Eucas is a small notch at the top of the screen. It watches the sessions you already run and taps you only when one needs you.
>
> What it does:
> - Shows which session is waiting, and for what, in one glance.
> - Never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. The limits are installed as managed settings (one Windows admin prompt), so a repo or the agent can't switch them off. [Keep this line only if v0.1 ships the lock.]
> - Stops a session that starts deleting files in bulk, and shows what went and how to get it back.
> - Lets you write rules ("let the tests run in web-app"), scoped to a folder, so the safe prompts stop.
> - A supervisor answers the prompts your rules can't settle, within your rules. It runs on an open model (gpt-oss-120b in our tests), not on your Claude plan, and only sees the waiting session's last message with code, paths and secrets removed.
>
> What it can't do: hooks only see tool calls. If the agent writes a script and runs it, the script's deletes don't pass through a hook. That's why there's a file-system tripwire on top, why Eucas never auto-approves interpreters or package installers, and why it tells you the moment its hook stops firing. If you need a hard boundary, use a container; Eucas is for the sessions you run on your own machine anyway.
>
> Stack: [Tauri + Rust, per the ADRs]. Windows 10 22H2 and 11. v0.1 isn't code-signed, so Windows will say "Unknown publisher".
>
> Licence: [the settled licence, see waitlist-week FAQ].
>
> I'd love to hear where the guard is wrong. Especially: Windows path tricks I haven't covered.

**On the day:** stay in the thread for 4–6 hours and answer every comment, short and factual. Thank critics; never argue tone. Don't ask anyone to upvote, and don't share the HN link in groups that would vote together: HN's ring detector buries the post. If it gets no attention, you may repost once on another day.

**Expected questions and short answers:** "just use a sandbox", "denylists are bypassable", "is this allowed by Anthropic's terms", "why Windows first", "why not open source" → the [FAQ answers](waitlist-week.md#faq-answers-to-paste).

---

## 2. Reddit (L+1, Wednesday)

### r/ClaudeCode (standalone post if the rules allow launches; otherwise the weekly showcase thread)

**Title:** I built a Windows notch that watches your Claude Code sessions. It's out today, free, and here's what it can't do

> In [month] I ran a 7-day demand test for this, and [N] of you joined the waitlist. The first build is out.
>
> [V1 as native video]
>
> **What it does:** [the five bullets from the Show HN comment, shortened]
>
> **What it can't do:** [the limits paragraph, in two sentences]
>
> **Free:** the four limits, the bulk-delete stop, rules, usage, and the supervisor in full for 14 days.
>
> Download and source: <link-reddit-claudecode-launch>. Tell me what breaks.

### r/ClaudeAI ("Built with Claude" megathread, or the main feed with flair if your karma allows)

Same as above, framed as "how it was built with Claude": the design-to-build process, one prompt that mattered, the numbers.

### r/SideProject

"The result of my demand test, [X] weeks later: it's built" + the numbers since day 8.

---

## 3. X thread (L, after the HN post is up)

> **1/** Eucas is out. A notch at the top of your Windows screen that watches your Claude Code sessions and taps you only when one needs you. Free. [V1]
>
> **2/** One glance: which session is waiting, and for what. Nothing pops up and nothing steals your focus. [peek clip; Pip: Toward you]
>
> **3/** A delete, a push to your default branch, a send or a payment always comes to you. No rule can change that. [rules clip; Pip: Calm]
>
> **4/** A session that starts deleting files in bulk is stopped. You see what went and how to get it back. [tripwire clip; Pip: Concerned]
>
> **5/** Say once what your sessions may do. The prompts you approve a hundred times a week stop. [V2; Pip: Calm]
>
> **6/** What leaves your PC, word for word: only the waiting session's last message, trimmed, with code, paths and secrets removed, and only when your rules can't decide. [V3]
>
> **7/** What it can't do: a script the agent writes and runs gets past any hook. That's why the tripwire exists, and why it tells you when it's off.
>
> **8/** Windows 10 and 11. Claude Code in a terminal, the desktop app or VS Code. <link-x-launch>

---

## 4. LinkedIn (L+1)

> [X] weeks ago I said I'd only build Eucas if 100 people joined the waitlist in 7 days. [N] did. Today the first Windows build is out.
>
> If you run Claude Code, Eucas is a notch at the top of your screen that watches your sessions and taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you.
>
> Three things I learned building it alone:
> 1. [real lesson]
> 2. [real lesson]
> 3. [real lesson]
>
> It's free to start. The link is on my profile.
>
> [Image: the notch over a real desktop; Pip: Focused]

---

## 5. Product Hunt kit (L+7, a Tuesday; launch at 12:01 am PT = 11:01 Doha)

**Name:** Eucas
**Tagline** (60 characters max): `A notch that watches your Claude Code sessions on Windows`
**Alternative:** `Get asked less by your coding agents. Windows, free.`
**Topics:** Developer Tools, Artificial Intelligence, Windows, Productivity, Open Source (only if the licence is MIT)
**Pricing:** Free + paid (Pro $20/month; the first 200 keep $15/month for life)
**Links:** eucas.app with `utm_source=producthunt`, the GitHub repo

**Description** (260 characters max):

> Eucas lives in a notch at the top of your screen and watches the Claude Code sessions you already run. It taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you. Bulk deletes are stopped.

**Gallery** (1270 × 760, in this order; every image a real screen, with Pip's face from PLAN §3):

| # | Image | Caption | Pip |
|---|---|---|---|
| 1 | V4 as the video (or V1) | — | — |
| 2 | `desk-peek-d.png` | "One glance: which session needs you" | Toward you |
| 3 | `panel-needs-usage-d.png` | "What it's waiting for, and your usage" | Toward you |
| 4 | `panel-rules-d.png` | "Your rules, scoped to a folder" | Calm |
| 5 | `panel-tripwire-d.png` (Concerned eyes on the notch) | "A bulk delete is stopped" | Concerned |
| 6 | `setup-8-sent-sample-d.png` | "What leaves your PC, word for word" | Calm |
| 7 | `new-caught-up-d.png` | "You're all caught up" | Pleased |

Re-capture each with the sample project renamed from `bench` to `web-app`, and at the gallery size.

**Thumbnail:** the notch alone on black, Calm eyes, no text (240 × 240).

**Maker's first comment:**

> Hi Product Hunt, I'm Majd. Eucas started as a 7-day demand test: 100 waitlist sign-ups or I wouldn't build it. [N] of you joined, so here it is.
>
> If you run several Claude Code sessions on Windows, it's a notch that watches them and taps you only when one needs you. What I'd love to hear: which prompt you'd most like to stop seeing.

**On the day:** reply to every comment; share the PH link with the waitlist only in the "Pro is open" or launch email if it's the same day, otherwise on X and LinkedIn. Never ask for upvotes: PH penalises it. Ask people to "take a look and tell me what's missing".

---

## 6. Newsletters (L+2, one email each)

**Console.dev** (hello@console.dev):

> Subject: Eucas, a Windows companion for Claude Code sessions (v0.1, free tier)
>
> Hi, Eucas is a Windows app that watches the Claude Code sessions you already run: it never auto-approves a delete, a push to your default branch, a send or a payment, stops bulk deletes, and answers safe prompts within your rules so you get asked less. v0.1, individual sign-up, free tier, source on GitHub: [link]. Happy to answer anything. [Name]

**Changelog News** ([submit form](https://changelog.com/news/submit)): the GitHub repo, one plain sentence, only if the licence is MIT (it excludes commercial products).

**The Rundown AI** ([tool form](https://www.rundown.ai/submit)): the free "recommend a tool" route only.

---

## 7. awesome-claude-code (L+14 or later)

Only when: the repo is at least 14 days old with commits after day 1, and **the free core runs without sign-up or payment** (the list's CONTRIBUTING calls those blockers). Submit through the **web issue form only**, by hand.

> **Name:** Eucas
> **Description:** A Windows notch that shows which Claude Code session needs you, holds deletes, pushes to the default branch, sends and payments for your approval, and stops sessions that delete files in bulk.
