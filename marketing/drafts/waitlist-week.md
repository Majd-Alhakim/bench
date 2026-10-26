# Waitlist week: every post, ready to paste

Drafts for [WAITLIST.md](../WAITLIST.md). **You post; nothing here is posted for you.** Before each Reddit post, read that subreddit's sidebar and pinned posts: the rules below come from secondary sources and change.

**Voice:** you speak to the reader as "you". "I" only where a person has to stand behind it (the test, the build, the mistakes). Calm, numbers first, no exclamation marks, no "AI-powered", "magic", "game-changer", "supercharge", no emojis in Reddit or HN text. Never "never deletes" or "100% safe": the only safety sentence is *"Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."* "Claude Code" is the tool you guard, never the product name. **Rewrite each draft in your own words before posting.** Readers spot templated text, and the "AI slop" reaction is the biggest risk this week.

**Every screen or clip** carries "Design preview · Eucas is in development", and Pip's face follows [PLAN §3](../PLAN.md#3-pips-faces).

Links: swap `<link-…>` for the matching UTM link in [WAITLIST §6](../WAITLIST.md#6-tracking).

---

## Day 1 · Monday: go live and the demand test

### 1a. Direct message (send 30, one by one, each with a personal first line)

> Hi Sara, [one line that's only for her: the project you know she's on, the last time you talked].
>
> I'm testing an idea before I build it, and you're exactly who it's for. If you run Claude Code, would you look at this for one minute? eucas.app
>
> It's a small notch at the top of your Windows screen that watches your Claude Code sessions and taps you only when one needs you. Deletes, pushes, sends and payments always come to you.
>
> The rule I set myself: if 100 people don't join the waitlist in 7 days, I don't build it. If it's useful to you, joining is the vote. If it isn't, I'd love to hear why.
>
> <link-dm>

### 1b. LinkedIn (no link in the post; add it as a comment only if someone asks, see PLAN §4)

> I'm running a test this week, and the result decides whether I build the thing.
>
> If you use Claude Code, you know the routine. You start three sessions to go faster. Then you spend the day checking on them: which one is waiting for a yes, which one is about to run out of usage, whether two of them are editing the same file.
>
> Eucas is my answer: a small notch at the top of your Windows screen. Your Euca lives in it, watches your sessions and taps you only when one needs you. A delete, a push to your default branch, a send or a payment always comes to you, and no rule can change that.
>
> It isn't built yet. The design is done, and the screen below is from the prototype.
>
> The test: if 100 people join the waitlist by Sunday, I build it. If not, I don't, and I'll post what I learned either way.
>
> If you run coding agents, the site is eucas.app. If you know someone who does, sending it to them helps more than a like.
>
> [Image: `docs/design/ui/companion/screens/peek-needs-d.png`, cropped to the notch and peek; Pip: Toward you]

### 1c. X: the announcement (V1 as native video, the link in the first reply)

> **Post 1:** You started three Claude Code sessions to go faster.
>
> Now you spend the day checking on them.
>
> I designed Eucas: a notch at the top of your Windows screen that watches them and taps you only when one needs you.
>
> It isn't built yet. If 100 people join the waitlist in 7 days, I build it. [V1]
>
> **Reply 1:** Four things always come to you: a delete, a push to your default branch, a send, a payment. No rule can change that. If a session starts deleting files in bulk, it's stopped, and you see what went and how to get it back.
>
> **Reply 2:** The waitlist: <link-x>
> Free to join. When Pro opens, the first 200 who pay keep $15/month for life.
>
> **Reply 3:** I'll post the real count every evening this week. Day 1 starts now.

### 1d. Indie Hackers (the "Building in public" or "Product launch" group; check the group's rules)

**Title:** I set myself a rule: 100 waitlist sign-ups in 7 days, or I don't build it

> I'm a solo developer in Doha. For the last few weeks I've been designing Eucas, a Windows companion for people who run several Claude Code sessions at once. It watches them from a notch at the top of the screen and taps you only when one needs you: a session waiting for a yes, a delete or push it shouldn't do without you, a usage limit coming, two sessions editing the same file.
>
> Before I write the code, I'm testing demand with a waitlist. The rule: **100 sign-ups in 7 days, or I don't build it.** Not "pivot", not "extend the deadline". Stop.
>
> Why the hard line: I wrote a pre-mortem on this idea, and the most likely way it dies is that I spend weeks building something nobody asked for. A tool in this space with 19k GitHub stars earns about $100 a month in sponsorships. The bar for "people want this" has to be set before I'm attached to the code.
>
> What I'll share here, every day this week:
> - visitors, sign-ups and conversion, by source;
> - which channel worked and which didn't;
> - the objections people raise.
>
> The page: <link-ih>. What would you change on it?

---

## Day 2 · Tuesday: the useful post

The most important piece of the week. It has to be worth reading **with Eucas removed**. If a reader learns nothing without the last paragraph, cut it until they do.

### 2a. Dev.to article (full version; tag `claudecode`, `windows`, `ai`, `productivity`)

**Title:** Claude Code deletes on Windows: what happened this autumn, and 7 things to do today

> Between 7 September and 3 October 2026, four Windows users reported Claude Code recursive deletes that reached their profile or drive root. The losses ranged from 116 to 600 GB, including `.ssh` folders and CLI tokens. In at least one, the user says auto mode approved the command. ([summary](https://vibegraveyard.ai/story/claude-code-windows-path-alias-recursive-deletions/); issues [#92593](https://github.com/anthropics/claude-code/issues/92593), [#95426](https://github.com/anthropics/claude-code/issues/95426), [#97660](https://github.com/anthropics/claude-code/issues/97660), [#99193](https://github.com/anthropics/claude-code/issues/99193). These are user reports; as of 3 October none had a maintainer reply.)
>
> None of them was a model "going rogue". Each was a path that meant one thing to the agent and another to Windows:
>
> - **8.3 short names.** `C:/Users/ALEXAN~1` can be the same folder as `C:/Users/alexandra`. A path check that looks for one doesn't match the other.
> - **MSYS and Git Bash translation.** `/c/Users/...`, `C:\Users\...` and `C:/Users/...` are the same place; a backslash can be eaten on the way through.
> - **Variables that expand to nothing.** In PowerShell, an unset variable becomes an empty string, so `rm -rf "$target/"` can become `rm -rf "/"` before bash ever runs.
> - **Junctions.** A delete that follows an NTFS junction leaves the folder you meant and walks into one you didn't.
> - **Nested shells.** In one report, a protected-path check caught PowerShell's `Remove-Item` but not `rm -rf` inside `bash -lc`.
>
> In two of the reports, the delete **kept running for 5 to 45 minutes after the agent said it had stopped it.**
>
> ### What you can do today, with no new tool
>
> 1. **Turn on File History** (Settings › System › Storage › Advanced › Backup options) or OneDrive backup for your user folder. It's the only step here that brings files back.
> 2. **Commit and push before a long session.** `git restore` can only bring back what git has seen.
> 3. **Don't use auto mode or `--dangerously-skip-permissions` in a folder that contains junctions or symlinks into other places**, and never from your home folder.
> 4. **Add deny rules for the obvious ones** in your Claude Code settings (`permissions.deny`), for example recursive `rm` and `Remove-Item -Recurse`. Check the permissions docs for your version's exact syntax. Know their limit: a deny rule matches the command text, so a script the agent writes and then runs gets past it.
> 5. **Run risky work somewhere it can't reach your profile**: WSL with the project inside the Linux filesystem, a dev container, or a separate Windows user.
> 6. **Watch the Task Manager after you say stop.** If disk activity keeps going, end the process tree yourself.
> 7. **Keep your tokens out of your profile's blast radius** where you can, and know how to rotate them. Several of the reports lost `.ssh` and CLI credentials.
>
> ### What I'm building, briefly
>
> I'm designing a Windows companion, Eucas, partly because of these reports. It never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. It also stops a session that starts deleting files in bulk and shows you what went and how to get it back. It can't promise that nothing bad ever happens, and nothing built on hooks can: see point 4. It isn't built yet; there's a waitlist at <link-devto>, and the build only happens if enough people want it.
>
> If you've hit one of these, what happened, and what would have caught it?

**Before publishing, check:** every number matches its source; the Settings path is right on your own Windows 11.

### 2b. r/ClaudeCode (a discussion post: **no link in the body**; flair Discussion or the closest)

**Title:** I read all four Windows recursive-delete reports from Sep–Oct. Here's the pattern, and what to set up today

> [The article's first two sections, shortened: the 4 reports with links, the 5 path causes, the "kept running after stop" detail, then the 7 steps.]
>
> I'm building a tool around this, but that's not the point of the post. The steps above work without it. If you've had a close call on Windows, what was the command?

If someone asks what you're building, reply with one sentence and <link-reddit-claudecode>. That reply is the only place the link goes.

### 2c. X (V1 again is fine; this is the article)

> Four Windows users reported Claude Code deletes reaching their drive root this autumn. 116 to 600 GB each.
>
> I read all four. None was the model "going rogue". Each was a path that meant one thing to the agent and another to Windows.
>
> The pattern, and 7 things you can set up today: <link-devto-article>

---

## Day 3 · Wednesday: showcases

### 3a. r/ClaudeAI: a comment in the "Built with Claude" megathread

Follow the megathread's format (what you built, how, screenshots or demo). Draft:

> **Eucas: a notch for your Claude Code sessions on Windows (design stage, waitlist)**
>
> **What:** a small notch at the top of your screen that watches the Claude Code sessions you already run and taps you only when one needs you: waiting for a yes, a delete, a push to your default branch, a send or a payment (these always ask you), a usage limit coming, two sessions in one file.
>
> **How it was made with Claude:** the whole design process ran as Claude Code sessions: requirements, a pre-mortem that changed the safety promise, a clickable prototype with 93 states, and the landing page. The supervisor model was picked from a test of 189 labelled moments (gpt-oss-120b: 0% dangerous answers, 68% fewer questions than rules alone, in that test).
>
> **Demo:** [V1 as a GIF or video link]. It's a design preview: nothing to install yet.
>
> **Ask:** if 100 people join in 7 days, I build it. <link-reddit-claudeai>. Honest criticism welcome, especially from Windows users.

Check the 189-moment and 68% figures against `docs/research/supervisor-model-comparison-2026-10-26.md` before posting.

### 3b. r/SideProject (standalone post; check the sidebar)

**Title:** Day 3 of a 7-day demand test: 100 waitlist sign-ups or I don't build it. [N] so far

> [Indie Hackers post 1d, shortened, plus:]
>
> Where the [N] came from so far: [your real breakdown from the evening query]. What surprised me: [one honest line].
>
> The page: <link-reddit-sideproject>. Tell me what's unclear.

### 3c. X (V2)

> You approved `pnpm test` 212 times this week.
>
> Your Euca suggests a rule from what you approve by hand. Or you say it in plain words, and it writes the rule, scoped to one folder.
>
> Deletes, pushes, sends and payments still come to you. [V2]
>
> Day 3: [N] of 100. <link-x> in the reply.

---

## Day 4 · Thursday: what leaves your PC

### 4a. X thread (V3)

> **1/** An AI supervisor watching your coding sessions. The first question you should ask: what does it see?
>
> Here's the answer for Eucas, word for word. [V3]
>
> **2/** Your rules decide first, in plain code on your machine. Only the moments they can't settle go any further.
>
> **3/** When Eucas isn't sure, it sends the waiting session's last message, trimmed, with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC.
>
> **4/** Your account holds your email, your plan and how much supervisor help you've used. Your Claude login stays yours: Eucas never sees or stores it.
>
> **5/** Setup shows you this with a message from your own sessions. Settings always shows it too.
>
> **6/** It isn't built yet. If 100 people join this week, it is. Day 4: [N]. <link-x>

### 4b. r/ChatGPTCoding: the weekly self-promotion thread (only there)

> Eucas: a Windows notch that watches your Claude Code sessions and taps you only when one needs you. Deletes, pushes to your default branch, sends and payments always come to you. Claude Code first; Codex and Cursor depend on what the waitlist asks for (the form asks which agents you use). Design stage, demand test this week: <link-reddit-chatgptcoding>

### 4c. Discord (one server where you're already a member, in its showcase or self-promo channel only)

> Hi all. I've been designing a Windows companion for people who run several Claude Code sessions: a notch that taps you only when a session needs you. It's a design preview with a 7-day demand test (100 sign-ups or I don't build it). If you're on Windows, I'd value one honest reaction: eucas.app/?utm_source=discord&utm_medium=community&utm_campaign=waitlist-w1

---

## Day 5 · Friday: the honest count

### 5a. X, LinkedIn and an Indie Hackers update (same facts, each in its own words)

> Day 5 of my demand test: **[N] of 100.**
>
> What worked: [top source and its number].
> What didn't: [the weakest channel, honestly].
> What people asked most: [the top objection, and your answer].
> [M] of them clicked "Join as a founding member" (the $15/month-for-life offer for the first 200).
>
> Two days left. If you run Claude Code on Windows and want this, eucas.app. If you're on Mac, join anyway and tick macOS: it's how I decide what comes next.

### 5b. Email to small Claude Code YouTubers (3 of them; find a public business email on their channel's About page; never cold-DM on platforms that discourage it)

**Subject:** A Windows notch for Claude Code sessions: would it fit a video later?

> Hi [name],
>
> Your video on [a specific video, with something real you took from it] is why I'm writing.
>
> I'm a solo developer designing Eucas: a notch at the top of a Windows screen that watches your Claude Code sessions, taps you only when one needs you, and never auto-approves a delete, a push to your default branch, a send or a payment.
>
> It's a design preview right now (a 30-second clip is here: [link]). I'm not asking for a video now. When the first Windows build is ready, may I send it to you early? No payment, no script, and honest criticism is welcome.
>
> [Your name] · eucas.app

---

## Day 6 · Saturday: Showoff Saturday

### 6a. r/webdev Showoff Saturday (Saturday only; it reads as an ad if it sells)

**Title:** [Showoff Saturday] A notch on a web page: the eucas.app landing page reacts to the section you're reading

> The landing page for my (unbuilt) Windows app has a live notch at the top edge. Its eyes follow your pointer and blink, its state follows the section in view, and hovering it opens a peek that melts out of the notch with an SVG goo filter.
>
> Stack: static HTML, CSS and a little JS on Cloudflare Workers, D1 for the waitlist, Turnstile, no framework, Lighthouse 100. Happy to share how the goo effect and the scroll-linked states work.
>
> <link-reddit-webdev>

### 6b. r/ClaudeCode: the weekly showcase thread (if there is one this week)

Reuse 3a, shortened to 4 lines, with the r/ClaudeCode link.

### 6c. Shorts and TikTok (V5, V6)

Title V5: "Two Claude Code sessions, one file". Title V6: "Hit your usage limit halfway through?" Description: one line + the `yt` or `tiktok` link (see PLAN §8).

---

## Day 7 · Sunday: the last day

### 7a. X and LinkedIn

> Last day of my demand test: **[N] of 100.**
>
> If you've been meaning to look: eucas.app. Free to join. When Pro opens, the first 200 who pay keep $15/month for life.
>
> Tomorrow I'll post the result and what I decide, whichever way it goes.

### 7b. A follow-up to Day-1 DMs that got no answer (once, never twice)

> No pressure at all. Today's the last day of the test, so this is my one reminder: eucas.app. Thanks either way.

---

## Day 8 · Monday: the result (post it whatever the number)

> The demand test is over. **[N] people joined in 7 days.**
>
> Where they came from: [top three sources].
> [x]% on Windows, [y]% on macOS, [z]% run 4 or more sessions at once.
> [M] clicked the founding-member offer.
> What I learned: [two honest lines].
>
> What happens now: [build, with the next date / don't build, and what I'll do instead].
>
> Thank you to everyone who joined, and to everyone who told me why they didn't.

---

## FAQ answers to paste

**"Is it open source?"** "The source is public on GitHub under FSL-1.1-MIT: you can read, run and change it, just not sell a competing product with it, and each version becomes MIT two years after release. It isn't open source by the OSI definition today, so I don't call it that."

**"Do I need an account?"** "Not for the four limits and the stop on bulk deletes: they work without signing up. Your rules, your usage and the supervisor need a free account; more supervisor help and budgets are Pro."

**"Does it use my Claude login / is this allowed?"** Eucas never sees or stores your Claude login. Your sessions stay your own, unmodified Claude Code. The supervisor runs on a separate open model that Eucas pays for, not on your Claude plan.

**"Why not just use a sandbox?"** You should, for anything risky, and Eucas doesn't replace one. Most people don't run every session in a container. Eucas is for the sessions you do run on your machine: it makes sure a delete, a push to your default branch, a send or a payment comes to you, stops bulk deletes, and asks you less about the safe things.

**"Can it guarantee nothing gets deleted?"** No, and nothing built on hooks can: an agent can write a script and run it. What Eucas promises is narrower: it never auto-approves those four things, no rule can change that, it stops a session that starts deleting in bulk, and it tells you the moment it isn't running.

**"Mac? Linux? Cursor? Codex?"** Windows and Claude Code first. Join and answer the two questions after you sign up: that's exactly how the next one gets chosen.

**"When can I install it?"** It isn't built yet. If this week's test passes, the waitlist gets the first Windows build; the email is the only one you'll get before then.

