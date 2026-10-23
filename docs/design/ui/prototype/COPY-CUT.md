# Copy-cut pass on direction v0.3

File: `direction.html` (static markup and JS-generated strings). Date: 2026-10-23.

The test for every visible string was the client's question: *"If I removed it, would the user be confused?"* If yes, the string stayed (and was tightened where it could say the same thing in fewer words). If no, it was removed.

These always stayed: cost receipts, what an outward or reserved action will do, "nothing sends until you press", error cause plus next step, status words, counts, names, numbers, the ANTHROPIC_API_KEY note, the credential notes, and the delete confirmation. No layout changed. Where removed text left a gap, the gap is closed (see "Layout touch-ups" at the end). Every aria-label is unchanged.

The System sheet (`#tokens`) was left alone. It documents the design system and is not a product screen.

**Totals: 36 removed, 118 shortened.**

---

## Demo chrome: 1 removed

| What | Before | After |
|---|---|---|
| Removed | "Brand decisions of 23 Oct applied" under "Direction v0.3" | (gone) |

## Sidebar: 1 removed

| What | Before | After |
|---|---|---|
| Removed | Footer meta "Owner · Bench home on this PC" | (gone; "You" stays) |

## Top bar (usage ring): 2 shortened

| What | Before | After |
|---|---|---|
| Shortened | "84 % of your week · getting close" (forecast) | "84 % of your week" (amber ring plus the banner say it; the tooltip keeps the detail) |
| Shortened | "41 % of your week · guard on" (guard) | "41 % of your week" (the guard banner is on every screen) |

## Banners (worst moments): 1 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | Offline: "...Nothing is lost. Everything on this PC still works: What needs you, memory, the trace and settings." | "Agents finish their current step, then wait. Nothing is lost; everything on this PC still works." |
| Shortened | Limit: "...resume Mon 26 Oct at 09:00, in the order they paused." | "...resume Mon 26 Oct at 09:00." |
| Removed | Limit: "3 of 3 runs paused" counter (repeats "3 runs paused" in the same line) | (gone) |
| Shortened | Login: "Run this in a terminal, then come back: claude login" | "Run this in a terminal: claude login" |
| Shortened | Guard: "At this pace you'd have 24 % left by Monday, so 2 routines wait until there's room or until Mon 26 Oct at 09:00." | "2 routines wait until there's room or Mon 26 Oct at 09:00." |

## Home: 6 removed, 12 shortened

| What | Before | After |
|---|---|---|
| Shortened | Atlas line: "...held for your ok. nothing sends until you've read it." | "...held for your ok." (the ticket says "Nothing sends until you press Send") |
| Shortened | Atlas line (limit): "Atlas's summary from 08:02. Paused until Mon 26 Oct at 09:00." | "paused until Mon 26 Oct at 09:00." (the time is already in the meta) |
| Shortened | Atlas line (login): "Atlas is paused, waiting for your Claude login. The list below is live; it uses no tokens." | "waiting for your Claude login." |
| Removed | Atlas line (reset): "your week reset at 09:00. Noor and Karim picked up..." | (gone; the digest card says the same thing right above) |
| Shortened | Reset digest title: "Good morning. Your week reset at 09:00." | "Your week reset at 09:00." (the greeting is the H1) |
| Shortened | Reset digest body: "...; the standup digest ran at 09:02. Nothing was lost. Sprint 2's end date didn't move by itself: Maya proposes a new one, below." | "Noor and Karim picked up where they paused. Nothing was lost. Maya proposes a new end date for Sprint 2, below." |
| Shortened | Login-back digest: "...in that order. The 08:30 standup digest ran 12 min late. Nothing was lost, and Bench never saw your password." | "Noor, Karim and Maya picked up where they paused. Nothing was lost." |
| Removed | Learned card subline "Atlas approved the ones about you; each has Undo. Used 31 times so far." | (gone) |
| Shortened | First-run learned: "It learns from what you approve, deny and edit. You can read and delete all of it in Memory." | "It learns from what you approve, deny and edit; you can delete any of it in Memory." |
| Shortened | Forgotten row: "Forgotten. No agent uses it from their next step." | "Forgotten." |
| Shortened | "2 more in Memory · all plain Markdown" | "2 more in Memory" (the button says Markdown) |
| Removed | Section caption "Live · uses no tokens" | (gone) |
| Shortened | Empty (first use): "When an agent needs a decision, a meeting or your OK, it lands here, ranked: blocked work first." | "Decisions, meetings and approvals land here." |
| Removed | Empty (caught up): "The team is working on N things. New items land here as they come in." | (gone; the subline above already says it) |
| Removed | New-project card helper "Name it and pick a team, or describe it and the fields fill themselves." (both the "New project" and "Start a project" cards) | (gone, counted twice) |
| Shortened | Project card activity (limit): "6 tasks paused · Sprint 2 ends today; Maya proposes a new end date when work resumes" | "6 tasks paused · Sprint 2 ends today" |
| Shortened | Project card activity (reset): "...picked up where they paused · the end date waits for you" | "Noor and Karim picked up where they paused" (the sprint line shows "Maya proposes Tue 27 Oct") |

## Tickets (Home, What needs you, dashboards, dock): 7 removed, 19 shortened

| What | Before | After |
|---|---|---|
| Shortened | QA-3: "...Karim suggests two ways out. Pick one." | "...Karim suggests two ways out." |
| Removed | QA-3 foot "Escalated by Karim at 07:45 after two failed attempts." | (gone; the age is "since 07:45" and the body says "failed twice") |
| Removed | Email why "Always allow is off for email to other people: every email needs you." | (gone; the body keeps "Nothing sends until you press Send") |
| Shortened | Merge: "Code review passed and CI is green. Merging to main is reserved for you, so no agent can do it." | "Code review passed. Merging to main is reserved for you." (the Checks fact says CI passed) |
| Shortened | pnpm: "The full suite, 214 tests, before..." | "The full suite, before..." (the "214 tests" chip stays) |
| Shortened | pnpm why: "...Other commands and repos still ask. Revoke it any time in..." | "Always allow covers pnpm test in bench only; other commands and repos still ask. Revoke it in Noor › Settings › Autonomy." |
| Shortened | Figma: "Sam needs a Figma Professional seat for the first-run hand-off files. You pay outside Bench; agents never pay." | "You pay outside Bench; agents never pay." (the What and For facts say the rest) |
| Shortened | Review: "The Sprint 2 review: ... About 10 minutes; you accept or send back each one." | "Onboarding (S1-2) and the agent runner (S1-3). You accept or send back each one." (the button shows "about 10 min") |
| Shortened | Yusuf: "6 questions about the interview flow ... pick up later." | "About the interview flow, before Tala builds it. You can stop after any question." (the button shows "6 questions") |
| Shortened | Debate: "...If they don't agree, Maya decides..." | "Maya, Sam and Noor have 5 minutes. The memo goes to memory." (the meta says "Maya decides") |
| Shortened | Lint suggestion: dropped "Bench never suggests this for outward or reserved actions." | "...Noor would run it without asking; other commands still ask." |
| Shortened | Login ticket: "...Nothing is lost. Run this in a terminal, then come back." | "...Nothing is lost." (the command row shows "in any terminal") |
| Shortened | Login why: "Bench never sees or stores your Claude credentials; signing in happens in Claude Code. Bench checks every 30 s and resumes everything by itself." | "Bench never sees or stores your Claude credentials. It checks every 30 s and resumes by itself." |
| Shortened | Paused FYI: dropped "You can still decide everything here; allowed work queues for Monday." | "...resume in that order." |
| Shortened | Conflict: "...Karim is resolving it with Noor and will bring it back for your OK." | "...Karim is resolving it with Noor." |
| Shortened | Conflict why: "Merge waits until the conflict is resolved. The ticket updates here; you won't get a second one." | "This ticket updates when the fix lands; you won't get a second one." (the disabled button's tooltip says why) |
| Removed | Conflict foot "Karim asked Noor about the Composer.tsx conflict at 09:41." | (gone) |
| Shortened | Resolved: "Conflict resolved by Karim with Noor at 09:52. CI is green again: Windows, Ubuntu and the secret scan." | "Karim and Noor resolved the conflict at 09:52." (the Checks fact says it re-ran and passed) |
| Removed | Resolved foot "Already re-checked after the fix: you don't need to look at the conflict." | (gone) |
| Removed | First ticket foot "Your first ticket: it came from Atlas's first look at your issues." | (gone; the meta says "from your GitHub issues") |
| Shortened | Sprint: dropped "Maya proposes one." | "...paused for 43 hours. The end date didn't move by itself." (the options plus "Maya recommends" show it) |
| Removed | Sprint foot "A pause never moves a sprint's end date by itself. The lead proposes; you decide." | (gone; the body says it) |
| Removed | Deny box footnote "Nothing runs. Noor carries on without it." | (gone) |
| Shortened | Toast: "Draft discarded. Nothing was sent; Atlas won't redraft it unless you ask." | "Draft discarded. Nothing was sent." |
| Shortened | Toast (Copy command, ticket): "Copied: claude login. Run it in any terminal; Bench notices when you're back." | "Copied: claude login" |
| Shortened | Toast (Copy command, banner): same | "Copied: claude login" |

## What needs you page: 5 shortened

| What | Before | After |
|---|---|---|
| Shortened | Subtitle: "Ranked: blocked work first. Five need you; two are for your info. Live, and it uses no tokens." | "Ranked: blocked work first." (the filter chips show the counts) |
| Shortened | Decided-by-Atlas caption: dropped "Each one can be undone." | "Atlas decided these as your deputy, inside rules you set." (each row has Undo) |
| Shortened | "Atlas, on your behalf · 08:40 · inside your rule: pushes to feature branches" | "08:40 · your rule: pushes to feature branches" |
| Shortened | "...· each shown on Home with Undo · 20 Oct" | "\"Short PR titles\" and \"Sign emails Best, Majd\" · 20 Oct" |
| Shortened | "Atlas, on your behalf · 21 Oct · read only, revoke in Lina › Settings" | "21 Oct · read only" |

## Noor: chat and workspace: 2 removed, 15 shortened

| What | Before | After |
|---|---|---|
| Removed | Composer footnote (idle and running): "Noor reads it after the current step. Stop is always here." / "Noor replies in her own words; every reply shows what it cost." | (empty; the row is kept for the cost receipt while you type, and the placeholder already says when she reads it; counted twice) |
| Shortened | Composer footnote (offline): "messages queue and send in order, before Noor's next step." | "You're offline: messages queue and send when you're back." |
| Shortened | Workspace caption: "Live · updated 09:14 · uses no tokens" | "Live · updated 09:14" |
| Shortened | Workspace caption (offline): "As of 10:24 · uses no tokens" | "As of 10:24" |
| Shortened | Workspace caption (log): "Jade's CI log · 500 lines · uses no tokens" | "Jade's CI log · 500 lines" |
| Shortened | Run failed: "Kept: her changes to 3 files (checkpoint 09:18) and the test log. Bench retries once at 09:20..." | "Bench retries once at 09:20 with the suite split in two, not the same way again." (the Kept chips sit right under it) |
| Shortened | Run failed footnote: "Bench retries by itself at 09:20 · in 1:48. If that fails too, it stops and Karim takes it; it never loops." | "Bench retries by itself in 1:48. If that fails too, Karim takes it." |
| Shortened | Checkpoint: "Checkpoint: 8 of 8 sections · goal, decisions, files, current step, next steps, open questions, what failed, fixes. ..." | "Checkpoint: 8 of 8 sections. The old session is archived in the trace." |
| Shortened | Connector: dropped "Everyone it touches resumes together." | "Reconnect GitHub in Claude Code; Bench never copies connector credentials." |
| Shortened | While you were away: "Noor's tests finished (12 of 12 passed) and she waited. Karim's draft was saved. Your message to Noor was delivered first..." | "Your message was delivered first, so Noor picks up with it. Karim's draft was saved. Nothing was lost." (the line above already reports the tests) |
| Shortened | Slow, 1 min: dropped "This sometimes happens at busy times." | "Still waiting on Claude (1 min). Nothing is lost, and Stop is always here." |
| Shortened | Stop line: "You stopped Noor at 09:15 · no further tool call will start · tell her what to change" | "You stopped Noor at 09:15" (the status says "no new step will start" and the placeholder says "Tell Noor what to change") |
| Shortened | Dock (allowed once): "Noor ran pnpm test in bench. It's in the trace." | "Noor ran pnpm test in bench." (Look inside sits next to it) |
| Shortened | Toast: "Always allowed: ... Revoke it any time in..." | "Always allowed: pnpm test in bench. Revoke it in Noor › Settings › Autonomy." |
| Shortened | Toast: "You're back online. Your queued message went first; Noor picked up with it." | "You're back online." (the digest card says it) |
| Shortened | Learned line after Undo: "Forgotten. No agent uses this from their next step." | "Forgotten." |

## Take-over: 1 shortened

| What | Before | After |
|---|---|---|
| Shortened | "Noor is paused while you work. Your edits are logged in the trace, and she continues from them." | "Noor continues from your edits. They're logged in the trace." (the Paused tag sits beside it) |

## Routines: 1 removed, 10 shortened

| What | Before | After |
|---|---|---|
| Shortened | New-routine label "Describe the routine in plain words" | "Describe the routine" |
| Shortened | Summary: "2 of 3 on · about X of your week. Routines run with Noor's own permissions. Anything outward or reserved waits for you." | "About X of your week. Anything outward or reserved waits for you." (the caption says "2 of 3 on"; the permission tag is on each card) |
| Shortened | Empty: "A routine is anything Noor can do, on a schedule. Describe it in plain words; you see what each run costs before you save." | "A routine is anything Noor can do, on a schedule." |
| Shortened | Card (off): "Off since you paused it" | "Off" |
| Shortened | Guarded card: "(guard on: keeping 30 % free). Runs when there's room, or Mon 26 Oct at 09:00." | "Waiting for room in your week (keeping 30 % free)." (Next run already says "When there's room / or Mon 09:00") |
| Shortened | Exempt card: "...≈ 0.30 % of your week, once a week. Other routines still wait." | "You chose this on 22 Oct · ≈ 0.30 % a week." |
| Removed | Guard: an in-pane banner "Guard on: keeping 30 % free. 1 routine waits..." | (gone; the same banner already sits above the screen) |
| Shortened | Suggestion: "≈ 0.30 % of your week, once a week. Other routines still wait, and your 30 % line still holds for them." | "Let it run even when the guard is on? Other routines still wait." (the button shows "≈ 0.30 % a week") |
| Shortened | Draft estimate: "Before you save: ... It runs with Noor's permissions: it can edit files in bench/. ..." | "≈ 4.0k tokens per run (...), about ... a week. Anything outward or reserved waits for you." (the permission tag is on the draft card) |
| Shortened | Toast: "...now runs even when the guard is on. ≈ 0.30 % of your week, once a week. Next run..." | "Dependency check now runs even when the guard is on. Next run Mon 26 Oct at 09:00." |
| Shortened | Toast (Run now): "...Your 30 % line still holds." | "Running now · ≈ 0.30 % of your week" |

## Noor › Settings: 7 removed, 15 shortened

| Section | What | Before | After |
|---|---|---|---|
| Profile | Removed | Lede "How Noor appears to you and to the team." | (gone) |
| Profile | Shortened | "Coral pill · unique in Bench" | "Coral pill" |
| Profile | Removed | "Together since 14 Oct · 312 runs · 46 notes · 12 lessons" (the same ledger sits under her avatar in the chat on the same screen) | (gone) |
| Profile | Shortened | "Karim sees Noor's work log. He reads her private notes only when he needs to, and only to read." | "Karim sees Noor's work log; he can read her private notes, never edit them." |
| Model | Shortened | "Pick a tier. Bench maps it to the current Claude model." | "Bench maps each tier to the current Claude model." |
| Model | Removed | Footnote "Applies from Noor's next run." (the Saved stamp says it) | (gone; the limit-week note still shows) |
| Autonomy | Removed | " · can't be changed" on the 4 always-ask rows (the Locked tag says it) | (gone) |
| Connectors | Shortened | "Only the ones switched on load for Noor, and each one adds..." | "From your Claude Code inventory. Only the ones on load for Noor, and each adds to every turn's tokens." |
| Skills | Shortened | "Bench ships a skill set for each role. Each one loads only when Noor needs it." | "Each skill loads only when Noor needs it." |
| Memory | Removed | Lede "What Noor knows about the work and about you, and when she starts fresh." | (gone) |
| Memory | Shortened | "Together since 14 Oct · 312 runs · +5 notes this week" | "+5 notes this week" |
| Memory | Shortened | Learn: dropped "No \"save preference\" chores." | "Redirects, denials and edits become notes you can read." |
| Memory | Shortened | "46 notes · last written today 08:58 · only Noor writes here" | "Last written today 08:58 · only Noor writes here" |
| Memory | Shortened | Export: dropped "Works in any editor." | "Plain Markdown, the same files as on disk." |
| Memory | Shortened | Checkpoint help: dropped "At 900k (90 %) every agent checkpoints at once, even mid-step. That ceiling can't be changed." | "...then starts fresh with her memory and the checkpoint." (the legend says "From 90 %: immediate, fixed for every agent") |
| Workspace | Removed | Lede "The folders Noor can reach, and whether she gets a browser." | (gone) |
| Workspace | Shortened | Folder footnote: dropped "One writer per folder at a time; the others queue." | "Noor can't see anything outside these." |
| Workspace | Shortened | Browser: dropped "and you can take over any time" | "Her own isolated profile. She asks before clicks, typing and new sites. Screenshots stay on this PC for 30 days." |
| Workspace | Removed | Browser-in-routines helper "Off by default. Routines can do anything Noor can; this adds the browser to them." | (gone) |
| Notifications | Shortened | "When to tell you about Noor. In the app on this PC, silent by default." | "In the app on this PC, silent by default." |
| Lifecycle | Shortened | Loan: "...lead. When the work is done, its lessons merge back here." | "Karim sends a copy to the other team's lead; its lessons merge back here." |
| Lifecycle | Shortened | Delete: dropped "Only you can delete an agent." (the Reserved tag says it) | "Her 46 notes and 312 runs are removed from this machine; ledger entries stay, marked deleted." |

## Memory: 1 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | "...+7 this week. All of it is plain Markdown in Bench\memory." | "...+7 this week · plain Markdown in Bench\memory" |
| Removed | Note footnote "Agents read the new version from their next step." | (gone) |
| Shortened | Toast "Forgotten. No agent uses it from their next step." | "Forgotten." |
| Shortened | Export toast: dropped "; they stay in Claude Code" | "...Your Claude login and connector credentials aren't included." |
| Shortened | Open folder: dropped "The files are the product, not a copy of it." | "Opens Bench\memory in File Explorer." |

## Usage: 3 shortened

| What | Before | After |
|---|---|---|
| Shortened | "This week · resets Mon 26 Oct at 09:00. This page uses no tokens." | "This week · resets Mon 26 Oct at 09:00" |
| Shortened | Paused card: "Drag to reorder, or cancel one. Allowed work you decide now queues behind these." | "Drag to reorder, or cancel one." |
| Shortened | "Trends like approvals per task and first-try acceptance appear after 4 weeks together (you're on day 9), so they're honest." | "Trends appear after 4 weeks together (you're on day 9)." |

## Look inside (trace): 2 shortened

| What | Before | After |
|---|---|---|
| Shortened | "...and the memory each step used. Opening this uses no tokens." | "Every step, prompt, file and token, and the memory each step used." |
| Shortened | "Live · step 9 of about 14. Steps older than 30 days are summarized; the costs stay." | "Live · step 9 of about 14" |

## Project dashboards and split view: 1 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | Setup empty columns: "Lea adds the first stories here, from your goal." / "Work moves here when an agent starts it." / "Accepted stories land here." | "Lea adds the first stories here." / "Nothing here yet." / "Nothing here yet." |
| Shortened | "Nothing needs you on Field Notes." (under "Needs you on Field Notes") | "Nothing right now." |
| Shortened | Set-up card: "Lea, the PM, is planning sprint 1 from your goal. First plan by about 10:30. ..." | "Lea is planning sprint 1 from your goal. The team starts with 12 lessons from Bench." (the progress row shows "First plan by about 10:30") |
| Shortened | Sprint done: "8 of 8 accepted · ... 6 of 8 were accepted first time." | "6 of 8 accepted first time · 3 lessons learned · 212k tokens (7.1 % of your week)" (the bar shows 8 of 8) |
| Removed | Project menu tip "You can also drag a project onto the main area." | (gone) |

## Other agents' rooms (Atlas, Karim, Lumen…): 2 removed, 2 shortened

| What | Before | After |
|---|---|---|
| Removed | Composer footnote "X replies in their own words; every reply shows what it cost." | (empty slot; the cost receipt appears there while typing in Noor's room) |
| Removed | Lumen: "Starts with 18 notes from Bench: your PR style, ..." (Lumen's message and the ledger both say 18) | (gone) |
| Shortened | Screen caption "Live · uses no tokens" | "Live" |
| Shortened | Empty screen: "When X works on files, a doc or the browser, it shows here live. You can watch or take over." | "Files, docs and the browser show here live while X works." |

## Team chat: 1 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | Header meta "Bench · 7 members · your messages get replies" | "Bench" (the roster says "In this chat · 7") |
| Shortened | Debate meta: dropped "· the chat is archived when it closes; the memo stays" | "Maya decides · with Sam and Noor · 3.2k tokens so far (0.11 % of your week)" |
| Removed | Memo card "Saved to Bench memory. The debate chat is archived in the trace." (the system line in the chat says it) | (gone) |
| Shortened | Composer footnote: "@mention picks who replies; otherwise Maya, the lead, replies · ..." (the placeholder already says "@name picks who replies") | "Without an @name, Maya, the lead, replies · about 0.3k tokens to route" |
| Shortened | "Debate closed at 09:16 · the memo is in Bench memory · the debate chat is archived in the trace" | "Debate closed at 09:16 · memo saved to Bench memory · the chat is archived in the trace" |

## New agent: 2 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | "Draft by Atlas · it speaks as itself until you create it" | "Draft by Atlas" |
| Removed | After the birth, the subline is rewritten to "Draft by Atlas · Lumen speaks as itself until you create it" | (no rewrite; it stays "Draft by Atlas") |
| Removed | Footer hint "Atlas drafts this agent from your words. Nothing is created until you press Create." | (empty until there's a draft) |
| Shortened | Footer hint after the draft: "Creating an agent is yours to confirm. You can undo it for 10 s." | "You can undo it for 10 s." |
| Shortened | Picker: "Atlas picked a honey droplet from the job. Keep it or pick; hues already used in Bench are dimmed." | "Hues already used in Bench are dimmed." |
| Shortened | Toast: "Lumen joined Bench › Dev team. Starts with 18 notes about how you work." | "Lumen joined Bench › Dev team." |

## New project: 8 shortened

| What | Before | After |
|---|---|---|
| Shortened | "Describe it (optional · the fields fill themselves)" | "Describe it (optional)" (the button says "Fill the fields") |
| Shortened | "Goal (optional, one line)" | "Goal (optional)" |
| Shortened | Team option: "7 agents: PM, two analysts, ..." | "PM, two analysts, UX/UI, tech lead, developer, QA. They start with 12 lessons from Bench." (the right column says "7 agents") |
| Shortened | Team help: dropped "Each pair is unique in this project." | "Names, shapes and hues are editable later." |
| Shortened | Pitch: "Atlas asks questions and writes a one-page proposal for you to approve." | "you get a one-page proposal to approve." |
| Shortened | Hint (no name): "Give it a name, or describe it and Atlas fills the fields." | "Give it a name." |
| Shortened | Receipt hint: dropped "Reserved: you're doing it yourself, so nothing else needs approval." | "Creates Field Notes with 7 agents and a 3-day sprint 1 · ≈ 180k tokens." |
| Shortened | After Fill: "Atlas filled the name, goal and team. Change anything; nothing is created until you press Create." (this also overwrote the cost receipt) | "Atlas filled the name, goal and team." followed by the receipt line, so the cost now shows before you press Create |

## First run: 3 removed, 4 shortened

| What | Before | After |
|---|---|---|
| Shortened | Lede: "Four steps, about a minute. Everything lives in a folder on this PC; only your conversations go to Claude." | "Everything lives in a folder on this PC; only your conversations go to Claude." |
| Shortened | Step 1: "Bench uses this login. It never sees your password and never stores your Claude credentials." | "Bench uses this login and never stores your Claude credentials." |
| Removed | Step 1 "Checked just now" | (gone) |
| Shortened | Step 2 help: dropped "Open, back up or delete them any time." | "Your agents, memory and projects are plain files here." |
| Removed | Step 3 "It appears on the left" | (gone; the forming moment draws the eye) |
| Removed | Step 4 "Nothing outward happens until you ask." (after picking an option) | (empty; "Choose how to start the team first." still shows before you pick) |
| Shortened | Toast: "Atlas is ready. Tell Atlas what you're working on." | "Atlas is ready." (the Home input placeholder says it) |

---

## Kept on purpose (borderline)

- **First-run ANTHROPIC_API_KEY note and the credential lines** (first run, login ticket, connector card, export toast): billing, safety and trust.
- **pnpm "Always allow covers ... only" line**: it says what the button does before you press it.
- **"Ranked: blocked work first." on What needs you**: the only line that explains the order.
- **Composer placeholder "she reads it after the current step"**: it tells you when your message lands while she is working.
- **Offline "Checking every 15 s"** beside Try now: without it you can't tell whether it reconnects by itself.
- **Context meter " · checkpoint at 70 %"** in Noor's header: it is the only label for the tick on the bar (it already hides under 1400 px).
- **"Tell Noor why (optional). It becomes a lesson she keeps."**: it says what the field does to memory.
- **Agent message bodies** (for example Atlas's "nothing sends until you've read it" in his room, or Lumen's "nothing posts until you've read them"): these are conversation content in the agent's voice, not interface copy.
- **Demo-only stubs** ("This sample doesn't...") and the System sheet: they are not product copy.

## Layout touch-ups (gap closing only)

- Home, all-caught-up empty state: `margin-top:8px` on the button. It replaces the removed paragraph's bottom margin.
- Settings: `.set-main h2+.pf-av,.set-main h2+.memhead{margin-top:16px}`. Profile and Memory lost their lede, and this keeps the heading-to-content gap.
- Home reset: the Atlas line renders nothing (no empty `<p>`) when its text is empty.
- Routines guard: the duplicate in-pane banner no longer renders; `#guardSlot` stays empty.
- The composer hint row keeps its reserved 28 px height, so the cost receipt doesn't shift the layout when you start typing.
