# State matrix: 13 core screens × 10 states

Part of the [premium experience spec](README.md). Every cell is designed with exact copy, or marked **N/A** with a reason. Cells that share a situation use **one shared pattern** (§1), so the same failure looks and reads the same everywhere (premium-craft gate 9, "one pattern per situation").

## 0. How to read this

**States (columns of the summary, rows of each screen table):** Default · Working (loading, live, slow) · Empty: first use · Empty: no results / cleared · Partial · Error · Offline / Claude unavailable · Usage limit (and the 30 % guard) · Denied (permission, approval, reserved) · Success.

**Voice.**
- **Interface copy** (headings, banners, buttons, system lines, toasts) is the main agent speaking to the client: sentence case, second person, never "me" or "my" for the client, and no "I" from the app (U8).
- **Agent lines** are lowercase, first person ("i"), short and concrete (decided), keeping real names and code as they are: "Dana", "PR #41", `pnpm test` (recommendation R4).
- **The client's own messages** are the client's words.

**Fixed example data** (consistent with direction v0.2): today is **Thu 22 Oct**, the week resets **Mon 26 Oct at 09:00**, 41 % of the week is used, and **30k tokens ≈ 1 % of your week**. Main agent **Atlas** (CEO). Project **Bench**: Maya (PM, lead), Omar (BA lead), Lina (BA), Sam (UX/UI), Karim (tech lead), Noor (developer), Jade (QA). Project **InterviewKit**: Rana (PM), Yusuf (BA), Tala (developer). Personal: Iris. The repo uses **pnpm**.

**Notation.** **Primary** = the one blue button, always a decision (recommendation R1). *Secondary* = an outline or plain button. `[route]` = add this as a hi-fi v0.3 route. "Receipt" = the one meta-line format: `09:04 · 1.8k tokens · 0.06 % of your week · Trace`.

**Every screen card answers the three evidence questions** (premium-craft gate 1): *what just happened · can I take it back · what next*. It also gives the **consequence preview** and the **intelligence deposit**.

---

## 1. Shared patterns (one per situation)

Each pattern is one component with one copy template. The screen tables reference these by ID and add only the screen-specific line.

| ID | Situation | Component and placement | Copy template (exact) | Actions | Behaviour |
|---|---|---|---|---|---|
| **P01** | **Offline** (no network) | A Banner under the top bar, full content width, neutral (Frost on white, Carbon text, a cloud-slash glyph). Not red, not modal. Agents' badges show **Paused** with the reason in their tooltip | **You're offline.** Agents finish the step they're on, then wait. Nothing is lost. Everything on this PC still works: What needs you, memory, the trace and settings. | *Try now* | Reconnects on its own (checks every 15 s, then every minute). Messages typed while offline are queued: the receipt reads `Queued · sends when you're back online`. On reconnect, the banner becomes P10 "While you were away" |
| **P02** | **Claude isn't answering** (the service is overloaded, 5xx, a timeout) | The same Banner component, neutral | **Claude isn't answering right now.** Noor's step is saved; Bench tries again at 09:24, then every few minutes. Your other agents carry on if they can. | *Try now* · *Details* | Retries with backoff (the one retry helper). Never shows an HTTP code first; codes go under Details |
| **P03** | **Your Claude login expired** (or you signed out) | The Banner, with Carbon emphasis (this needs you). Also a Decide ticket at the top of What needs you (State tag: **Blocked**) | **Your Claude login has expired.** Your agents paused at a safe point; nothing is lost. Run this in a terminal, then come back: `claude login` | *Copy command* · *Check again* | Never a login form, never a password field (ADR-0002). Bench re-checks every 30 s while the banner is up and resumes paused work by itself once you're signed in (tech constraint TC-1 in worst-moments.md) |
| **P04** | **Weekly usage limit reached** | The Banner (Carbon emphasis) + a count badge on it + a For your info ticket. Agents show **Paused** | **Your week is used up.** 3 runs paused at a safe point and resume **Mon 26 Oct at 09:00**, in the order they paused. What needs you, memory and the trace still work. | **See paused work** (secondary when a decision is on screen) · *Continue on Balanced* (only when it's the Deep-model limit that ran out) | No API-key nudge, anywhere (D5). Count badge: `3 of 3 runs paused`. A session limit (5-hour) uses the same pattern with its own reset time: "Your session limit resets at 14:00" |
| **P05** | **The 30 % headroom guard is on** | A thin Banner (no emphasis) + a For your info ticket | **Keeping 30 % of your week free.** At this pace you'd have 24 % left by Monday, so 2 routines wait until there's room or until **Mon 26 Oct at 09:00**. Your own requests still run. | *See what's waiting* · *Run one now* (each row shows its cost: "≈ 0.3 % of your week") | Guard vocabulary everywhere: **"Guard on: keeping 30 % free"** / **"Headroom OK"**. Never "budget", "cap" or "warning" |
| **P06** | **A run failed** (a crash, a tool error, out of memory, a timeout) | A RunCard in the chat (white, 18 px corners, hairline, the agent's avatar showing concern, the State tag **Error**). In lists: the Error badge + the status word | **Noor's run stopped: the test runner ran out of memory.** Kept: her changes to 3 files (checkpoint 09:18) and the test log. Bench retries once at 09:20 with the suite split in two. | **Retry now** · *Ask Karim* · *Open trace* | The cause comes first, in plain words; the raw error sits under *Details*. One automatic retry with a changed approach, then it stops and waits for you. A lesson is saved if the retry works (intelligence-layer.md) |
| **P07** | **You denied something** (an approval, a folder, a reserved action) | A system line + the agent's own reply in its voice + the ticket folds away | System: **You denied `pnpm test` · Noor continues without it.** Agent: *"ok. no full suite. i'll open the pr with the chat tests only and say so in the description."* | Toast: `Denied · Undo` (10 s) | The agent never asks the same thing again in the same task. Denial reasons (optional field "Tell Noor why") are saved as a lesson |
| **P08** | **Slow response** (10 s or more before the first token) | The status line under the agent changes after 10 s; the thinking dots continue | **Claude is taking longer than usual (14 s).** Noor is still on it. | *Stop* stays where it always is | After 60 s: "Still waiting on Claude (1 min). This sometimes happens at busy times." It's never a spinner alone |
| **P09** | **A write failed** (disk full, file locked, read-only folder, Windows Controlled folder access) | Inline, where the action happened (a field error, or the dialog footer) | **Didn't save: Bench couldn't write `agents/noor/agent.md`** (another app has it open). Your change is still here. | **Try again** · *Open folder* | Atomic writes: nothing half-saved. Windows-specific cause copy: "Windows blocked Bench from writing to Documents (Controlled folder access). Allow Bench in Windows Security, or choose another folder." |
| **P10** | **Back to normal** (online again, signed in again, the week reset, the guard off) | The Banner turns into a one-time digest card on Home and in the affected chats, then fades after you've seen it | **While you were away (18 min):** Noor finished her step and waited; she's picked up again. 2 messages you typed were sent. Nothing was lost. | *Dismiss* | This is the service-recovery moment: specific, warm, short (worst-moments.md) |

**Toast rule:** a toast reports what happened, carries a link when something was created, and offers **Undo** whenever the action is reversible. It stays 8 s (10 s with an action). Where an action can't be undone, the toast says so: "Allowed once. Noor is running `pnpm test` (this can't be undone once it's running)".

---

## 2. Summary matrix

✅ = designed below · P0x = uses that shared pattern (plus the screen line below) · N/A = not applicable, with the reason below.

| Screen | Default | Working | Empty: first use | Empty: none / cleared | Partial | Error | Offline / Claude down | Usage limit / guard | Denied | Success |
|---|---|---|---|---|---|---|---|---|---|---|
| 3.1 Home | ✅ | ✅ P08 | ✅ | ✅ | ✅ | ✅ | ✅ P01 P02 | ✅ P04 P05 | ✅ P07 | ✅ |
| 3.2 Agent chat + workspace | ✅ | ✅ P08 | ✅ | ✅ | ✅ | ✅ P06 | ✅ P01 P02 P03 | ✅ P04 | ✅ P07 | ✅ |
| 3.3 Team chat / debate | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P09 | ✅ P01 | ✅ P04 | ✅ | ✅ |
| 3.4 Project dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P01 | ✅ P04 | N/A | ✅ |
| 3.5 What needs you / Approvals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P01 | ✅ P04 | ✅ P07 | ✅ |
| 3.6 Routines | ✅ | ✅ | ✅ | N/A | ✅ | ✅ P06 | ✅ P01 | ✅ P04 P05 | ✅ | ✅ |
| 3.7 Agent settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P09 | ✅ P01 | ✅ | ✅ | ✅ |
| 3.8 New agent | ✅ | ✅ P08 | ✅ (= default) | N/A | ✅ | ✅ P09 | ✅ P01 | ✅ P04 | N/A | ✅ |
| 3.9 New project | ✅ | ✅ | ✅ (= default) | N/A | ✅ | ✅ P09 | ✅ P01 | ✅ P04 | N/A | ✅ |
| 3.10 Memory browser | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P01 | ✅ | ✅ | ✅ |
| 3.11 Usage | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P01 | ✅ P04 P05 | N/A | ✅ |
| 3.12 Trace | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P01 | ✅ | ✅ | N/A |
| 3.13 Onboarding / first run | ✅ | ✅ | ✅ (= default) | N/A | ✅ | ✅ P09 | ✅ P01 | ✅ | ✅ | ✅ |

---

## 3. Screens

### 3.1 Home

**Card.** Intent: *Know → Do* (what's moving, what needs you; act on the top item). **Primary:** the open top ticket's decision (D-UI7). UCs: UC-08, UC-25, UC-29, UC-43. **Evidence:** a resolved ticket folds into a check and the counts tick down; Undo in the toast; the next ticket opens by itself. **Consequence preview:** inside the open ticket, the primary button carries its result ("Use nightly E2E · Karim sets it up tonight · free"). **Intelligence deposit:** which ticket kinds you resolve first, and how fast (ranking ties); your morning arrival time (Atlas's status is ready by then). **Hierarchy test:** the open ticket's title → its blue button → the greeting line.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#home` | The greeting, Atlas's one-line status, the Ask Atlas composer, **What needs you** with the top ticket **open** (D-UI7) and the rest at rest, Projects, then the **Your team learned** strip (intelligence-layer.md) | Eyebrow: `Thursday, 22 October` · H1: **Good morning.** · Sub: **Seven things need you. Start with QA-3: Jade is blocked.** · Section: **What needs you 7** (caption `Live · uses no tokens`) · Open ticket: **QA-3 is blocked: E2E failed twice** / "Jade's end-to-end tests failed twice on the Windows CI runners, at 07:12 and 07:39. Karim suggests two ways out. Pick one." / options *A paid Windows runner* ("About 2 h to set up · needs a payment from you") and *Nightly E2E on Karim's machine* ("Free · results each morning instead of on every pull request") / foot: "Escalated by Karim at 07:45 after two failed attempts." | **Use nightly E2E** (the label follows the selected option) · *Ask Karim* · *Later* |
| **Working** | The list renders instantly from local data (0 tokens). Atlas's status line shows thinking dots in Atlas's hue. After 10 s, P08 | Atlas line while loading: **Atlas is collecting team summaries…** · after 10 s: **Still collecting: 4 of 7 summaries in.** | none |
| **Empty: first use** `#home-first` | Atlas's hero (64 px) blinks once. Suggestion chips under the composer. The What needs you area explains itself | H1: **Good evening.** · Sub: **Your team is ready. Tell Atlas what you're working on.** · Empty card: **Nothing needs you yet.** "When an agent needs a decision, a meeting or your OK, it lands here, ranked: blocked work first." · Chips: *Look at my open GitHub issues* · *Plan a small project with me* · *What can this team do?* | Chips fill the composer; Send is a Carbon control (R1). No blue on screen |
| **Empty: cleared** `#home-empty` | The last ticket folds; the "all caught up" ending plays (moments-and-motion.md M-H3). Projects stay | **You're all caught up.** "The team is working on 7 things. New items land here as they come in." | *Open your projects* (scrolls to Projects; with one project: "Open the Bench dashboard") |
| **Empty: no results** (a filter, R2) | Filter chips above the list: All · Decide · Meet · For your info · Decided by Atlas | **No meetings waiting.** "5 other things need you." | *Show all* |
| **Partial** | The list is complete, but Atlas's summary failed, or one project's files couldn't be read. A one-line notice sits in place of the missing part, never over the list | Atlas line: **Atlas's summary isn't ready (Claude didn't answer).** "The list below is live and complete." · Project card: **InterviewKit couldn't be read from disk.** "Its items may be missing here." | *Try again* · *Open folder* |
| **Error** | The list itself can't load (the database is locked or corrupt). The greeting and projects still render from files | **What needs you couldn't load.** "Bench couldn't read its database (`bench.db` is locked by another program). Nothing was lost." | **Try again** · *Details* |
| **Offline / Claude down** | P01 or P02 banner. The list works. The composer queues | Composer receipt after send: `Queued · Atlas gets this when you're back online` | As P01 / P02 |
| **Usage limit / guard** `#home-limit` | P04 banner with `3 of 3 runs paused`. Atlas's line shows its cached summary. With the guard: P05 banner and a For your info ticket | Atlas line: **Atlas's summary from 08:02.** "Paused until Mon 26 Oct at 09:00." · FYI ticket: **2 routines are waiting for room in your week** | Tickets still resolve: "Allowed. Noor starts this on Mon 26 Oct at 09:00, first in line." |
| **Denied** | You deny inside a ticket: P07. The ticket folds; the next one opens | Toast: **Denied. Noor opens the pull request with the chat tests only.** `Undo` | *Undo* (10 s) |
| **Success** | The resolved ticket morphs into a check and folds (M-H2); counts tick down in the top bar, sidebar and project card at once; the next ticket opens | Toast: **Nightly E2E chosen. Karim sets it up tonight; first results tomorrow at 07:00.** `Undo` | *Undo* · link *Open QA-3* |

### 3.2 Agent chat + workspace (Noor)

**Card.** Intent: *Know → Do* (watch, steer, stop). **Primary:** the pending decision if there is one ("Allow once"); otherwise none is blue (Stop and Send are controls, R1). UCs: UC-09, UC-22, UC-23, UC-27, UC-28, UC-33, UC-38. **Evidence:** the hero's status line, the live line ("8 of 12 passed"), the receipt under each reply, the workspace diff; Stop is always in the header; take-over says "Noor is paused while you work". **Consequence preview:** the approval shows what runs, where, for how long and at what cost ("214 tests · about 3 min · ≈ 0.08 % of your week · stays inside bench/"). **Intelligence deposit:** redirects ("use the existing date library") become lessons; your edits in take-over become preference candidates. **Hierarchy test:** the hero and its status line → the newest reply → the workspace (or its pending decision).

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#agent` | Header: avatar + **Noor** + status word + `Developer · Bench › Dev team · Balanced` + the Ledger line + the quiet receipts. The room's wash. Hero + status line. Workspace on the right | Header ledger: `Together since 14 Oct · 312 runs · 46 notes · 12 lessons` · receipts: `This run 28.4k tokens · 0.9 % of your week` · `Context 34 % · checkpoint at 70 %` · Hero: **Working · running tests** · Composer: "Message Noor · she reads it after the current step" | *Stop* · *Take over* (workspace) · Send (Carbon) |
| **Working** | Thinking dots in Noor's hue with the word; the live line under the last message; the workspace updates. 10 s+: P08 | Live line: `running pnpm test chat · 8 of 12 passed` · Thinking: **Noor · Thinking** · Stopping: **Stopping after this step: waiting for `pnpm lint --fix` to finish (usually under a minute). No new step will start.** | *Stop* (becomes "Stopping…", disabled) |
| **Empty: first use** (a just-created agent, here Lumen) `#agent-first` | The hero blinks (the end of the birth moment). The agent introduces itself and shows what it already knows (the Ledger) | Agent: *"lumen here. i'm new, but i already know 18 things about how you work from your team's memory. what's first?"* · Chips from its card: *Draft this week's release notes* · *Show me what you can do* · Workspace: **Nothing on Lumen's screen yet.** "When Lumen works on files, a doc or the browser, it shows here live." | Chips · Send |
| **Empty: no results** (search in this chat) | Search field in the header overflow | **No messages with "date-fns" in Noor's chat.** "2 matches in other chats." | *Search all chats* |
| **Partial** | The live view dropped, the run continues | Workspace: **Noor's screen lost its live view at 09:14.** "Her run continues and the chat still updates." | *Reconnect* |
| **Error** `#agent-error` | P06 RunCard. Header status **Error**; the avatar shows concern (moments-and-motion.md §3) | RunCard: **Noor's run stopped: the test runner ran out of memory.** "Kept: her changes to 3 files (checkpoint 09:18) and the test log. Bench retries once at 09:20 with the suite split in two." · After a successful retry, a system line: **Retried with the suite in two halves · 12 of 12 passed · Lesson saved: run the full suite in two halves on this PC** | **Retry now** · *Ask Karim* · *Open trace* |
| **Offline / Claude down / login** | P01 / P02 / P03. Status **Paused** with the reason. The composer queues | Status line: **Paused · offline** · or **Paused · waiting for your Claude login** | As the pattern |
| **Usage limit** | P04. A RunCard in the chat | **Paused at a safe point: your week is used up.** "Noor resumes S1-4 on Mon 26 Oct at 09:00, first in line. Kept: her session, the diff and your pending approval." | *See paused work* · *Continue on Balanced* (only for the Deep limit) |
| **Denied** | P07 for an approval. For a folder outside her grants, a system line | **Noor tried to read `../secrets/`. It isn't one of her folders, so nothing was read.** | *Grant access…* · *Leave it* |
| **Success** `#agent-green` | The all-green moment (M-A2): the checklist cascades, the receipt lands, the avatar relaxes to Idle | Agent: *"done. PR #44 is open for Karim."* + checklist: **✓ tests → 12 of 12 passed · ✓ lint → clean · ✓ PR #44 → opened, Karim reviewing** · Receipt: `09:31 · 3.4k tokens · 0.11 % of your week · 3 files · Trace` | *Open PR #44* |

### 3.3 Team chat / debate (Bench)

**Card.** Intent: *Know → Do* (watch the team, steer with @mentions, decide a debate). **Primary:** in a live debate, **Join and decide**; otherwise none (R1). UCs: UC-10, UC-11, UC-13, UC-24. **Evidence:** "Bench picked Karim (@mention)" after every message you send; the handoff chip; the debate timer and cost; "the chat is archived when it closes, the memo stays". **Consequence preview:** the composer hint "@mention picks who replies; otherwise Maya, the lead, replies · about 0.3k tokens to route". **Intelligence deposit:** routing corrections (you re-@mention someone else after Bench picked) teach who does what. **Hierarchy test:** the debate bar (when live) → the newest message → the roster.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#team` | Messages grouped by sender, system lines, the roster with status words, the live debate bar | Debate bar: **Debate: where does the Stop button live?** "Maya decides · with Sam and Noor · 3.2k tokens so far · the chat is archived when it closes; the memo stays" · `4:12` | **Join and decide** · *Watch* |
| **Working** | Thinking dots + the agent's name; routing line; the handoff chip travels (M-T1) | `Bench picked Karim (@mention) · 0.3k tokens` · `Maya handed S1-6 SQLite persistence to Karim · the Dev team owns storage · 0.2k tokens · Open task` | none |
| **Empty: first use** (a new project's chat) | The cluster avatar, the members' avatars blinking in turn (once) | **No one has said anything here yet.** "@mention someone to give them a task, or just say hi; Lea, the lead, replies by default." | none (Send is a control) |
| **Empty: no results** | @mention autocomplete finds no one | **No one in Bench is called "Noah".** "Mention one of the 7 members, or ask Maya to bring someone in." | *Ask Maya* |
| **Partial** | Some members can't reply (paused or archived) | Roster note: **Jade is paused and won't reply until you resume her.** | *Resume Jade* |
| **Error** | P09 for a failed send; the routing fallback when the Haiku pick fails | Under your bubble: **Didn't send: Bench couldn't save your message.** "Your text is still here." · Routing: **Bench couldn't pick who replies (Claude didn't answer), so Maya, the lead, will.** | *Try again* |
| **Offline** | P01; your messages queue; the debate timer pauses | Debate bar: **Paused at 4:12 · offline.** "The timer restarts when you're back." | — |
| **Usage limit** | P04; the debate timer pauses (UX Q10 default) | **Debate paused at 3:12 left.** "It restarts with your week on Mon 26 Oct at 09:00. Nothing said so far is lost." | *See paused work* |
| **Denied** | You're an observer in this chat (UX Q6) | Composer: **You're watching this chat.** "Join to send messages; your messages get replies and use your week." | *Join the chat* |
| **Success** `#team-memo` | The debate closes: the debate thread condenses into the memo card (M-T2) | Memo: **Decided: Stop lives in the composer and replaces Send while an agent runs.** "Maya decided at 09:16 · Sam and Noor agreed · 6.1k tokens (0.2 % of your week)." / "Saved to Bench memory. The debate chat is archived in the trace." | *Open memo* |

### 3.4 Project dashboard (Bench)

**Card.** Intent: *Know* (where is this project right now). **Primary:** the first item in "Needs you on this project" (the Ticket, small, with its verb). UCs: UC-16, UC-24, UC-26. **Evidence:** progress at the true ratio, live statuses, "updated 09:14". **Consequence preview:** accepting a story in review shows "Accept S1-2 · moves to Done · Maya closes it". **Intelligence deposit:** accept/reject patterns (first-try acceptance rate), shown as a team-level trend. **Hierarchy test:** "Needs you on this project" → progress → the board.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#project-bench` | The project header (team avatars, the "…" menu), progress, Needs you (tickets, small), the sprint board, the team row | `Sprint 2 · day 1 of 3 · ends Sat 24 Oct` · **2 of 10 done** `20 %` · **Needs you on Bench 5** | **Review S1-2** (the top item's verb) |
| **Working** | Skeleton rows for the first 300 ms, then live updates (cards move with a spring; counts tick) | Caption: `Live · updated 09:14` | — |
| **Empty: first use** (just created) `#project-new` | A set-up banner; the team avatars gather (M-P1); the board columns are empty with one line each | Banner: **Field Notes is set up.** "Lea, the PM, is planning sprint 1 from your goal. First plan by about 10:30." · To do: "Lea adds the first stories here." | *Open its Team* |
| **Empty: no results / cleared** | A board filter with no match / a cleared Needs you | **No tasks owned by Lina in Sprint 2.** · Needs you: **Nothing needs you on Bench.** | *Clear filter* |
| **Partial** | Refresh failed; showing the last good data | **Couldn't refresh at 09:14. Showing 09:02.** | *Try again* |
| **Error** | The board file is invalid | **Bench couldn't read Bench's board** (`projects/bench/board.md` isn't valid). "Nothing was changed." | *Open the file* · *Try again* |
| **Offline** | P01; agents' statuses read Paused · offline; the board works | — | — |
| **Usage limit** | P04 scoped to the project | **6 tasks paused at a safe point.** "They resume Mon 26 Oct at 09:00. The sprint end date doesn't move by itself; Maya will propose one when work resumes." `[ASSUMPTION, R11]` | *See paused work* |
| **Denied** | **N/A:** every dashboard action (accept, reject, move a card, open) is the client's own; nothing on this screen is gated | — | — |
| **Success** `#project-sprint-done` | Sprint complete: the team gathers on the project card (M-P2) | **Sprint 2 is done.** "10 of 10 accepted · 4 lessons learned · 412k tokens (13.7 % of your week)." | **Start sprint 3 planning** · *Read the lessons* |

### 3.5 What needs you / Approvals (the inbox)

**Card.** Intent: *Do*. **Primary:** the open ticket's decision. UCs: UC-17, UC-22, UC-23, UC-24, UC-29, BR-15, BR-57, BR-58. **Evidence:** each decision gives a toast with Undo where reversible, the ticket's history keeps the result ("Allowed by you at 09:16"), and the **Decided by Atlas** filter shows Deputy decisions. **Consequence preview:** on every decision button ("Always allow `pnpm test` in bench: Noor runs it without asking; other commands still ask"). **Intelligence deposit:** allow/deny patterns (recommendation R7) and denial reasons (lessons). **Hierarchy test:** the open ticket → its decision → the remaining queue.

The ticket component and all its copy are shared with Home (3.1); this screen adds the filters and the history.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#needs` | Filter chips with counts, ranked tickets (D2), the top one open. The ApprovalCard variant for approvals | ApprovalCard: **Noor asks to run `pnpm test`** · Kind tag **Work request** · `in repo bench` · "The full suite, 214 tests in about 3 minutes, before Noor opens the pull request for S1-4. It stays inside bench/. ≈ 0.08 % of your week." · Scope note: "Always allow covers `pnpm test` in bench only. Other commands and repos still ask. Revoke it any time in Noor › Settings › Autonomy." | **Allow once** · *Always allow `pnpm test` in bench* · *Deny* |
| **Working** | The button shows progress for actions that take time (Merge) | **Merging PR #41…** → "Merged at 09:22" | — |
| **Empty: first use** | Same as Home first use | **Nothing needs you yet.** "Approvals, meetings and decisions land here, ranked: blocked work first." | — |
| **Empty: cleared** | | **You're all caught up.** "Atlas decided 4 things for you today." | *See what Atlas decided* |
| **Empty: no results** | A filter with no match | **No payment requests.** "3 other things need you." | *Show all* |
| **Partial** | A ticket's evidence couldn't load (GitHub didn't answer) | In the ticket: **The diff for PR #41 couldn't load from GitHub.** "You can still decide from the summary." | *Open PR #41 on GitHub* |
| **Error** | Allowed, but it failed after approval (UX F5) | **Allowed, but `pnpm test` didn't start:** "pnpm isn't installed in bench/. Noor will install it and ask you again; nothing for you to do now." | *Open Noor* · *Details* |
| **Offline** | P01. Local decisions still work; outward sends wait | Allow: **Allowed. Noor runs it as soon as you're back online.** · Email: **Send waits until you're online. Nothing has been sent.** | — |
| **Usage limit** | P04. You can still decide | **Allowed. Noor starts this on Mon 26 Oct at 09:00, first in line.** | — |
| **Denied** | You deny (P07), with an optional reason. **Rule explained in place:** an outward ticket shows Always allow disabled with the reason | Deny field: "Tell Noor why (optional)" · Disabled reason: **Always allow is off for email to other people: every email needs you.** | *Deny* · toast *Undo* |
| **Success** | The ticket folds into a check (M-H2); the count ticks | **Allowed once. Noor is running `pnpm test` in bench.** (can't be undone once it's running) · **Always allowed: `pnpm test` in bench.** `Undo` · **Merged PR #41 to main. Karim and Noor are told.** (Merge: "can't be undone from Bench; revert it on GitHub") | *Undo* where reversible |

### 3.6 Routines (Noor › Routines)

**Card.** Intent: *Do* (set up repeat work). **Primary:** none at rest; **Save routine** in the New routine form (a decision with a cost). UCs: UC-38, UC-41, CR-006. **Evidence:** next run, last run with its result and cost, a summary line for the week; system lines in the chat ("Created routine · …"). **Consequence preview:** before Save: the schedule in words, the cost per run and per week, and what it may do ("Can edit files in bench/ · anything outward waits for you"). **Intelligence deposit:** repeated manual asks become routine suggestions ("You've asked Noor for a dependency check 3 Mondays in a row"). **Hierarchy test:** the summary line → each routine's name and badge → its next run.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#agent-routines` | The list. Each row: name, **permission badge derived from Noor's autonomy** (CR-006: **Can edit files** or **Read-only**), switch, schedule, next / last / estimate | Summary: **2 of 3 on · about 1.3 % of your week.** "Routines run with Noor's own permissions. Anything outward or reserved waits for you." · Row: **Morning test sweep** `Can edit files` · "Every weekday at 08:00" · Next **Tomorrow 08:00** · Last **Today 08:00** `Done · 6.2k tokens · 0.21 %` · Estimate **≈ 6.0k tokens** `0.20 % of your week` | *New routine* |
| **Working** (running now) | The row shows live progress, with Stop | **Running now** · `started 08:00 · 3.1k tokens so far` | *Stop* |
| **Empty: first use** `#agent-routines-empty` | Examples that draft on click | **No routines yet.** "A routine is anything Noor can do, on a schedule. Describe it in plain words; you see what each run costs before you save." · Examples: *Run the tests every weekday at 8* · *Check dependencies on Mondays* | Examples → the form |
| **Empty: no results** | **N/A:** a routine list is short (≤ 50 per agent, Grok Bot parity) and has no search or filter | — | — |
| **Partial** | The parser isn't sure about the schedule | In the draft: **Noor read this as every Friday at 16:00.** "Is that right?" | *Yes* · *Change the time* |
| **Error** | The last run failed: P06, with the knock-on effect stated | Row: **Last run failed Mon 19 Oct 09:00: GitHub said Noor's access was revoked.** "The next run (Mon 26 Oct) will fail the same way unless GitHub is reconnected." | *How to reconnect* · *Turn off* |
| **Offline** | A routine was due while offline | **Missed: Morning test sweep was due at 08:00 while you were offline.** | *Run now* · *Skip to tomorrow* |
| **Usage limit / guard** | P04: **Waits for your week to reset · Mon 26 Oct 09:00.** P05: | Row: **Waiting for room in your week** "(guard on: keeping 30 % free). Runs when there's room, or Mon 26 Oct at 09:00." | *Run now · ≈ 0.30 % of your week* |
| **Denied** | Outward work is drafted, never sent (CR-006). Browser routines need the opt-in (CR-004) | Run result: **Drafted 3 emails · waiting for you in What needs you.** "A routine never sends." · Save blocked: **This routine uses the browser. Turn on "Browser in routines" in Noor › Settings › Workspace first.** | *Open Workspace settings* |
| **Success** | Saved; a system line appears in the chat too | Toast: **Routine saved: Merged PR digest. First run Fri 23 Oct at 16:00 · ≈ 0.12 % of your week each time.** `Undo` | *Undo* |

New routine form (consequence before commit), exact copy: label **Describe the routine in plain words** · placeholder "every Friday at 4 pm, list the pull requests merged this week" · after Draft: "**Merged PR digest** · Every Friday at 16:00 · ≈ 3.5k tokens per run (0.12 % of your week) · Read-only: it reads GitHub and writes a note." · **Save routine**.

### 3.7 Agent settings (Noor › Settings)

**Card.** Intent: *Do* (configure). **Primary:** none (saves as you go, D-UI10); **Delete Noor…** is Reserved and lives in its own confirm. UCs: UC-02–04, UC-22, UC-32, UC-35, BR-66. **Evidence:** the stamp "Saved · applies from Noor's next step" with **Undo**; each nav item shows its current value. **Consequence preview:** every option shows its cost or effect ("Deep · Opus · ≈ 6 % of your week per long turn"; "Autonomous: everything except outward and reserved actions"). **Intelligence deposit:** none directly; Settings › Memory *shows* the ledger (growth sparkline, export). **Hierarchy test:** the section title → the current value → the options.

Nav grouping (Hick's law, 9 sections → 3 groups): **Who** (Profile, Model) · **What Noor may do** (Autonomy, Connectors, Skills, Workspace) · **How Noor works with you** (Memory, Notifications, Lifecycle).

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#agent-settings-*` | Section nav + section | Stamp: `Saves as you go` · Autonomy: **What Noor may do without asking you first.** · Memory: **Noor knows 46 things · 12 lessons** + sparkline · "Checkpoint at 70 %. The 90 % ceiling is fixed for every agent." | Per control |
| **Working** | Saving takes < 300 ms; then the stamp | `Saving…` → **Saved · applies from Noor's next step** `Undo` | *Undo* |
| **Empty: first use** | Sections with nothing in them yet | Connectors: **Your Claude Code has no connectors yet.** "Add one there, then check again: `claude mcp add`." · Grants: **No standing grants. Noor asks every time.** · Skills: **No skills of your own yet.** "The Developer library is on; your own skills from Claude Code show here." | *Check again* |
| **Empty: no results** | Skill search | **No skills match "deploy".** "Skills come from your Claude Code inventory and the built-in library." | *Clear search* |
| **Partial** | The inventory was read partly | **Read 4 of 5 connectors.** "Figma's settings couldn't be read, so it's skipped here, not removed." | *Try again* |
| **Error** | P09 on save; a field error on the checkpoint | **Didn't save: `agents/noor/agent.md` is open in another app.** "Your change is still here." · Field: **The checkpoint goes from 50 to 85 %. 90 % is the fixed ceiling for every agent.** | *Try again* |
| **Offline** | Settings are local and work. Checks that need the network say so | Connectors: **Can't check GitHub while you're offline. The switch still saves.** | — |
| **Usage limit** | Settings work. The Model section shows the limit honestly | Model: **Deep (Opus) is used up until Mon 26 Oct at 09:00.** "Balanced still works." | — |
| **Denied** | Locks explained in place | Outward row (locked): **Sending email to anyone but you always asks you. This can't be turned off.** · Delete: **Only you can delete an agent.** Type **Noor** to confirm. | *Delete Noor* (in the confirm, red outline, typed name) |
| **Success** | The stamp, plus Undo for revokes | **Revoked. Noor asks before running `pnpm test chat` again.** `Undo` · **Revoked. Noor can no longer reach docs-site/.** `Undo` | *Undo* |

### 3.8 New agent (the create-by-conversation dialog)

**Card.** Intent: *Do*. **Primary:** **Create Lumen** (enabled once there's a draft). UCs: UC-02, CR-001. **Evidence:** "Draft by Atlas · nothing is created until you confirm"; after Create, the birth moment and a toast with a link. **Consequence preview:** the draft checklist shows the name, team, model, what it can do, its routine and its cost ("≈ 0.12 % of your week each Friday"). **Intelligence deposit:** what you change in drafts (names, models, connectors) tunes Atlas's next drafts. **Hierarchy test:** the draft avatar and name → the draft card → Create.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#new-agent` | A neutral draft avatar; the draft agent speaks (decided); a hint says who drafts | Agent: *"good to meet you. what do you want me around for?"* · Hint: "Atlas drafts this agent from your words. Nothing is created until you press Create." | Suggestions · *Fill the card yourself* |
| **Working** | Atlas's dots, then P08 | **Atlas is drafting…** | *Cancel* |
| **Empty: first use** | Same as Default (the dialog is always a first use) | — | — |
| **Empty: no results** | **N/A:** there's no search or list in this dialog | — | — |
| **Partial** | The draft needs something you don't have | **Lumen would use Slack, but Slack isn't in your Claude Code inventory.** "Create Lumen without it, or add Slack there first." | *Create without Slack* |
| **Error** | A name clash (inline); P09 on create | **There's already a Lumen in Bench.** "Try Lux or Lyra." · **Lumen wasn't created:** "Bench couldn't write `agents/lumen/`. Your draft is kept." | *Try again* |
| **Offline** | Atlas can't draft; the manual card still works | **You're offline, so Atlas can't draft right now.** "You can still fill the card yourself; Lumen starts working when you're back." | *Fill the card yourself* |
| **Usage limit** | Same idea | **Atlas can't draft until Mon 26 Oct at 09:00.** "Fill the card yourself now; Lumen starts after the reset." | *Fill the card yourself* |
| **Denied** | **N/A:** creating an agent is your own reserved action, so nothing gates it | — | — |
| **Success** | The birth moment (M-N1); the name tag flies to the sidebar | Toast: **Lumen joined Bench › Dev team.** `Open Lumen` · `Undo` (removes the agent; nothing has run yet) | *Open Lumen* |

### 3.9 New project

**Card.** Intent: *Do*. **Primary:** **Create project**. UCs: UC-43, UC-12 (the alternative), CR-001, BR-58. **Evidence:** the editable fields stay visible; "Reserved: you're doing it yourself, so nothing else needs approval"; then the dashboard's set-up banner. **Consequence preview:** **"Creates Field Notes with 7 agents and a 3-day sprint 1 · ≈ 180k tokens (6 % of your week)"**, on the button row. **Intelligence deposit:** template edits (which roles you drop or rename) tune future templates. **Hierarchy test:** the project name → the team preview → Create.

Fixes coherence finding C-04: **manual creation is the main path** (CR-001, F2). The description box is a *shortcut that fills the fields*, not a pitch. The pitch path stays as a link.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#new-project` | Fields: **Name** · **Goal (one line, optional)** · **Start from** (Product + Dev team / Blank; nothing pre-selected, D1) · **Team** (suggested names, editable). Above them, an optional "Describe it" box that fills them | Describe box: "Describe it and the fields fill themselves (optional)" · Continue disabled reason: **Choose how to start the team first.** · Footer link: *Or pitch it to Atlas* ("Atlas asks questions and writes a one-page proposal for you to approve") | **Create project** · *Cancel* |
| **Working** | Creating: the agents are born one by one (M-P1) | **Creating Field Notes and 7 agents…** `4 of 7` | — |
| **Empty: first use** | Same as Default | — | — |
| **Empty: no results** | **N/A:** no list or search | — | — |
| **Partial** | The describe box filled some fields, not all | **Atlas filled the name and team.** "Add a goal if you want Lea to plan from it." | — |
| **Error** | Inline field errors; P09 on create (rolled back) | **There's already a project called Bench.** "Pick another name." · **"Noor" is already your developer in Bench.** "Projects get their own agents; try Nadia." · **Field Notes wasn't created:** "Bench couldn't write `projects/field-notes/`. Nothing was half-made; your choices are kept." | **Try again** · *Choose another Bench folder* |
| **Offline** | The manual path works; the describe box is off | **You're offline: fill the fields yourself.** "The team starts planning when you're back." | — |
| **Usage limit** | Creation works; planning waits | Button-row note: **Creates now; Lea starts planning after your week resets on Mon 26 Oct at 09:00.** | **Create project** |
| **Denied** | **N/A:** creating a project is reserved for you, and you're the one doing it | — | — |
| **Success** | The dashboard with the set-up banner (3.4 first use); the project appears in the sidebar, expanded | Toast: **Field Notes is set up with 7 agents.** `Open its Team` | *Open its Team* |

### 3.10 Memory browser

**Card.** Intent: *Know → Do* (read, correct, take with you). **Primary:** none at rest; **Save note** while editing. UCs: UC-18–21, UC-44–46. **Evidence:** every note shows its source agent, date and scope; saves show "agents read the new version from their next step" with Undo. **Consequence preview:** "Delete note · 3 notes link to it" · "Promote to global · every agent will read this". **Intelligence deposit:** your edits to notes are the strongest signal (a corrected fact outranks an inferred one). **Hierarchy test:** the note title → its source line → backlinks.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#memory` | Three panes: scopes and filters / the note / backlinks, with a graph toggle. Header: the team ledger | Header: **Your team knows 214 things about how you work.** `+7 this week` · Note source: `Lesson · Noor · Bench › Dev team · 22 Oct · from run 09:12` | *Export (Markdown)* · *Open folder* |
| **Working** | Re-indexing | **Re-indexing 1,204 notes…** "Search uses the previous index until this is done." | — |
| **Empty: first use** | | **Nothing remembered yet.** "As your team works, it writes here: work logs, decisions and lessons. Everything is plain Markdown in `Bench/memory/`, and you can edit or delete any of it." | *Open folder* |
| **Empty: no results** | | **No notes match "stripe" in Noor's memory.** "3 matches in other scopes." | *Search all scopes* · *Clear search* |
| **Partial** | The graph shows a neighbourhood (C-C) | **Showing 120 of 1,204 notes around this one.** | *Show all (slower)* |
| **Error** | A note's header is invalid | **This note's header isn't valid (line 3).** "Bench shows it as plain text. Fix it here or in your editor." | *Edit* |
| **Offline** | Keyword search works; meaning search doesn't | **Offline: keyword matches only.** "Meaning search comes back with the connection." | — |
| **Usage limit** | The same degradation `[ASSUMPTION: semantic search calls Claude]` | **Keyword matches only until Mon 26 Oct at 09:00.** | — |
| **Denied** | An agent's proposal to write global memory was declined | **Kept in Noor's private memory.** "Other agents won't see it. You can promote it later." | *Promote to global* |
| **Success** | Saved | **Saved to `memory/global/pr-style.md`.** "Agents read the new version from their next step." `Undo` · Delete: **Deleted "old CI notes".** `Undo` | *Undo* |

### 3.11 Usage

**Card.** Intent: *Know* (am I safe this week?). **Primary:** none at rest; **Run one now** when the guard defers work. UCs: UC-40–42. **Evidence:** the meter, the forecast line, the guard status in words, the reset time. **Consequence preview:** each deferred item shows its cost before "Run now". **Intelligence deposit:** the compounding metrics live here ("tokens per accepted task down 22 % since September"). **Hierarchy test:** the % used and reset → the forecast and guard → the breakdowns.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#usage` | Ring + numbers (tabular), forecast, guard status, breakdowns by agent, project and model tier | **41 % of your week used** · "Resets Mon 26 Oct at 09:00 · at this pace about 68 % by then" · **Headroom OK** · Breakdown header: `By agent · this week` · Glass-box value line: **Per-agent connectors saved about 96k tokens this week (3.2 % of your week).** | — |
| **Working** | | **Reading your plan usage…** | — |
| **Empty: first use** | | **No usage this week yet.** "Your week resets Mon 26 Oct at 09:00. Every run's cost shows here and on each message." | — |
| **Empty: no results** | A filter | **No runs by Lina this week.** | *Clear filter* |
| **Partial** | Ledger only (C-B) | **Showing Bench's own count only.** "Bench can't read your plan's numbers right now, so this counts Bench's runs, not your other Claude use. The 30 % guard uses this count too." | *Check again* |
| **Error** | The ledger can't be read | **Usage couldn't load.** "Bench couldn't read its ledger. Your agents keep working; the guard uses the last good count from 09:02." | *Try again* |
| **Offline** | The last known numbers | `As of 09:14` beside the ring | — |
| **Usage limit / guard** | P04 / P05 with the paused or deferred list in order | **Paused, in resume order:** 1 Noor · S1-4 · 2 Karim · S1-6 · 3 Morning standup digest (Maya) | *Run now* per deferred item with its cost |
| **Denied** | **N/A:** Usage is read-only; nothing is gated here | — | — |
| **Success** | The week reset | **New week.** "2 routines that waited ran at 09:00 (0.4 % of your week). Headroom OK." | — |

### 3.12 Trace

**Card.** Intent: *Know* (exactly what happened, and what it cost). **Primary:** none (expand a step). UCs: UC-07, UC-28, BR-38, BR-60. **Evidence:** every step shows the prompt, the tools, the files, the tokens, and **the memory notes that were loaded** ("Used: 2 notes"), which is the glass box for the learning too. **Consequence preview:** N/A (read view). **Intelligence deposit:** none. **Hierarchy test:** the run (agent, task, result, cost) → its steps → a step's detail.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#trace` | Runs list → steps; filters: All · Files · Commands · Memory | Step: `09:12 · tool · pnpm test chat · 12 of 12 passed · 1.4k tokens` · Memory step: `Used 2 notes: "prefer the repo's date library" (lesson, 22 Oct) · "PR style" (preference, 14 Oct)` | *Copy step* |
| **Working** | A live run streams steps | `Live · step 9 of ~14` | — |
| **Empty: first use** | | **No runs yet.** "Every step an agent takes shows up here: the prompt it saw, the tools it used, the files it touched and what it cost." | — |
| **Empty: no results** | A filter | **No commands in this run.** | *Show all steps* |
| **Partial** | Past retention | **Steps older than 30 days are summarized.** "The summary and the costs stay." | — |
| **Error** | The log is cut off | **This run's log stops at step 14.** "Steps 1–13 are shown; the rest couldn't be read." | *Open the log file* |
| **Offline** | Works (local) | — | — |
| **Usage limit** | A paused run | `Paused at step 9 · your week was used up · resumes Mon 26 Oct 09:00` | — |
| **Denied** | Gate steps are part of the trace; archived debates are hidden from chats | `Step 7 · stopped at the approval gate · you denied it at 09:16` · **This debate chat is archived.** "Only you can open it, here." | *Open archived chat* |
| **Success** | **N/A:** a read view has no completion; copying a step confirms with "Copied" | — | — |

### 3.13 Onboarding / first run

**Card.** Intent: *Go → Do* (from install to the first useful result). **Primary:** one per step (Continue), **Finish**, then the first message. UCs: UC-06, UC-08, BR-04, BR-54, CR-001. **Evidence:** each check says what it found; "agents, memory and projects are plain files here"; "Creating Atlas and 6 agents…". **Consequence preview:** the team step: "Product + Dev creates a first project, Bench, with 7 agents"; Gmail unticked (D1): "Atlas could read and draft email; sending to anyone but you always needs you". **Intelligence deposit:** none yet, and the screen says so ("Your team knows nothing yet; it learns from what you approve, deny and edit"). **Hierarchy test:** the step title → the found/missing result → Continue. **Targets (R10):** Atlas's first reply in under 3 minutes; the first useful finished task in under 5.

| State | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#first-run` | 4 steps: Claude Code check → Bench folder → your main agent → how to start the team. Atlas's avatar forms over the steps (M-F1) | Step 1 found: **Found Claude Code 2.x, signed in.** "Bench uses this login. It never sees your password and never stores your Claude credentials." · Step 2: `C:\Users\majd\Bench` "Your agents, memory and projects are plain files here." · Step 3: **Name your main agent** (default Atlas, Balanced) | **Continue** |
| **Working** | | **Checking for Claude Code…** · Finish: **Creating Atlas and 6 agents…** `3 of 7` | — |
| **Empty: first use** | Same as Default (the whole flow is a first use) | — | — |
| **Empty: no results** | **N/A:** no lists or search | — | — |
| **Partial** | Installed, not signed in | **Claude Code is installed but not signed in.** "Run this in a terminal, then come back: `claude login`" | *Copy command* · *Check again* (auto-checks every 5 s) |
| **Error** | Not installed; folder not writable (P09); creation failed | **Claude Code isn't installed.** "Bench runs on Claude Code. Install it, then check again." · **Bench wasn't set up:** "nothing was created; your choices are kept." | *How to install* · **Check again** · *Choose another folder* |
| **Offline** | Local setup works | **You're offline.** "Bench can set up your folder and your team now; your first conversation needs the internet." | **Continue** |
| **Usage limit** | Signed in, but the week is used up | **Your Claude week is used up until Mon 26 Oct at 09:00.** "Set up your team now; Atlas says hello after the reset." | **Continue** |
| **Denied** | An API key in the environment (CLAUDE.md: billing) | **Bench found an `ANTHROPIC_API_KEY` and will ignore it,** "so your agents use your Claude subscription, not paid API credits. You can change this in Settings › API mode." | **Continue** |
| **Success** | Home, first use (3.1), with Atlas's first blink and first line | Atlas: *"hi. i'm Atlas. i'll run your team and bring you only what needs you. what are you working on?"* · Toast: **Atlas and 6 agents are ready in Bench.** `Open Bench's Team` | Chips |
