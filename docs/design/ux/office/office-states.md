# Office states: the Home state matrix

Part of the [office UX](README.md). Premium-craft gate 2: every state of the office is designed with exact copy, or marked N/A with a reason. Shared banner patterns (P01–P10) come from the premium [state-matrix §1](../premium/state-matrix.md) unchanged; this file adds what the **office** does in each one and the office-only situations.

**Voice.** Interface copy: sentence case, second person, never "me/my" for you, no "I" from the app. Agent lines: lowercase, first person, real names and code kept as they are (R4). Example data: Thu 22 Oct, the week resets Mon 26 Oct at 09:00, 41 % used; floors **Lobby** (Atlas, Iris), **Bench** (Maya, Omar, Lina, Sam, Karim, Noor, Jade), **InterviewKit** (Rana, Yusuf, Tala).

**Layers** (README §3.1): **Scene** (3D) · **Top bar** (floor switcher, Office · List, usage ring, Needs you) · **Greeting line** · **Composer** · **List** (and the Simple view).

---

## 1. Office-only shared patterns

| ID | Situation | Office treatment | Copy (exact) | Actions |
|---|---|---|---|---|
| **OP1** | **Stale scene** (the scene can't show the latest truth for a moment) | A small caption under the floor switcher; the scene keeps the last known poses, no ambient motion | `Office as of 09:14` | *Refresh* |
| **OP2** | **Starting the office** (3D not ready yet) | The cached still of the floor (from the last session) fills the scene; the top bar, list, count and composer are live at once | After 4 s, a caption: **Starting the office…** "Everything else already works." | none |
| **OP3** | **Simple view** (3D unavailable or chosen) | The List (README §3.13) fills the main area; a still picture of the floor sits in a band above it, labelled with its age; **no marks on the still** (it would lie) | Band caption: **A picture of Bench from yesterday at 18:40.** "The list below is live." | *Try the live office* · *Keep the simple view* |
| **OP4** | **A floor can't be read** (its project files are invalid or locked) | The floor shows its outer walls and a sign on the lift doors; other floors work | Sign: **Bench's floor couldn't be read.** "`projects/bench/team.md` isn't valid. Nothing was changed." | *Open the file* · *Try again* |
| **OP5** | **While you were away** (window hidden, offline, limit, login, return after hours) | No replay of what happened: the scene **snaps to the truth** with a 200 ms crossfade; the P10 digest card sits under the greeting line; agents who need you show their marks as they are now | P10 copy (premium), office line added: "**While you were away (2 h 10 min):** Noor and Karim finished 3 tasks. Jade needs you. Nothing was lost." | *Dismiss* |

---

## 2. Summary: office-wide states

| # | State | Scene | Top bar | Composer | List / panel | Primary |
|---|---|---|---|---|---|---|
| S1 | First run, empty office | Lobby, Atlas only | Lobby ▾, All caught up | Chips | Empty | none (Send is a control) |
| S2 | One agent on a floor | Small floor, one desk | as usual | as usual | One row | none |
| S3 | Typical | Floor with activity | Bench ▾ 5 | — | Ranked | Top bubble's decision |
| S4 | Crowded (30 per floor) | LOD, labels on demand | — | — | Grouped | Top bubble's decision |
| S5 | All idle | Lounge busy, desks quiet | All caught up | Chips | All clear | none |
| S6 | Many need you at once | Capped escalation | Needs you 12 | — | Ranked, top 5 + Show all | Top bubble's decision |
| S7 | Error / stuck agents | Concern poses | — | — | Error rows | Retry now (in the panel) |
| S8 | Offline | Agents wait at desks | P01 banner | Queues | Works | none |
| S9 | Login expired | Atlas carries the mark | P03 banner | Queues | Atlas's ticket on top | Copy command (in Atlas's bubble) |
| S10 | Usage limit (and guard) | Agents paused at desks | P04 / P05 banner | Queues | Paused order | none; decisions still allowed |
| S11 | GPU fallback | Simple view (OP3) | Office · List disabled on Office with reason | as usual | Live | as usual |
| S12 | Reduced motion | Still office | as usual | as usual | as usual | as usual |
| S13 | Window hidden | Rendering stopped | — | — | — | — |

Plus: **Loading** (OP2) and **Partial** (OP4) in the Home matrix (§4).

---

## 3. The states

### S1 · First run: the empty office
- **When:** first launch after the first-run steps, "Atlas only" chosen (or before the Product + Dev floor is built).
- **Scene:** the **Lobby** at a closer zoom (it's small): reception, the lift, the floor directory (empty), Atlas at its executive desk, Atlas's tray hidden (0). Atlas walks to the entrance, **greets you** (a wave, one blink), and walks back.
- **Greeting line:** **Good evening.** "Your team is ready. Tell Atlas what you're working on."
- **Composer chips** (built from your inventory, worst-moments §10): *Look at my open issues in bench* · *Plan a small project with me* · *What can this team do?*
- **Floor switcher:** **Lobby ▾**; menu: "Lobby · Atlas" and **+ New project (adds a floor)**.
- **Count:** **All caught up**. The What needs you panel: **Nothing needs you yet.** "When an agent needs a decision, a meeting or your OK, it stands up with a mark over its head and lands in this list, ranked: blocked work first."
- **Open desk** beside Atlas: "Open desk · Hire someone for the company" (personal agents).
- **Lobby noticeboard:** **Your team knows nothing about you yet.** "It learns from what you approve, deny and edit. You can read and delete all of it in Memory."
- **Next step:** send Atlas a message (or a chip). **Evidence:** Atlas's reply comes with its receipt (M-F2).
- **A11y:** outline "Lobby · Atlas · Idle"; live region "Atlas is ready."

### S2 · One agent on a floor
- **When:** a blank project with its first agent, or a project after you removed everyone but one.
- **Scene:** the layout generator builds **only what's needed**: one area with one desk, the lead's whiteboard corner, one meeting room, a small lounge corner, the lift. The camera fits this small floor, so it never looks deserted. **No placeholder creatures.**
- **Open desk** in the area: "Open desk · Hire for Field Notes".
- **Area label** (no lead yet, UX Q14): **No project lead yet** "Make Lea the lead from the Team page" with *Open Team*.
- **Greeting line** (if this is your current floor): "Lea is the only one on Field Notes. Hire more from the open desk, or ask Atlas to suggest a team."
- **Count / list:** as usual.

### S3 · Typical
- **Scene:** Bench: Karim working (code on screen); Jade standing with a red-amber Blocked mark in the QA sub-area; Maya, Sam and Noor debating in Meeting room A. Noor also has a pending request (`pnpm test`), but she can carry on (she's debating), so it shows as a **desk flag** on her empty desk, not a mark over her head (C-35). Lina and Omar in the lounge. Props: plants, sticky notes, the Sprint 1 trophy.
- **Greeting line:** `Thursday, 22 October` · **Good morning.** "Seven things need you. Start with QA-3: Jade is blocked." · "Your team learned 7 things this week · See what"
- **Top bubble (D-UI7):** opens on Jade ~1.2 s after the greeting: **QA-3 is blocked: E2E failed twice** / options *A paid Windows runner* · *Nightly E2E on Karim's machine* / **Use nightly E2E** · *Ask Karim* · *Later*.
- **Top bar:** **Bench ▾ 5** · Office | List · ◔ 41 % of your week · **Needs you 7**.

### S4 · Crowded (30 agents on a floor)
- **Scene:** the floor uses all its areas; over 30 a **second wing** opens with a corridor ("Bench · east wing"). Level of detail by zoom: at Floor zoom, creatures use the simple mesh and no toppers' secondary motion; names show only for marked, hovered and focused agents; props collapse to one per desk (the most recent).
- **Budget:** at most 3 escalating, 1 coming forward (behaviour-map §3.2), at most 4 ambient movers.
- **Finding someone:** `F` or the find field in the floor menu: "Find an agent on any floor" → typing "No" lists "Noor · Bench · Dev team · Working" → Enter: lift if needed, pan, focus, hover card shown.
- **Area labels** show counts ("Dev team · 9 · 2 need you") so you can read the floor by area before by creature.
- **Long names:** nameplates truncate with an ellipsis at 14 characters; the hover card, outline and List give the full name.
- **List:** groups by area, each area collapsed to 4 rows + "5 more" (Miller).

### S5 · All idle
- **Scene:** desks quiet (screensavers, lamps on), most agents in the lounge chatting, on phones or dozing (behaviour-map §4). Nobody types, nobody is in a meeting room (H2).
- **Greeting line:** **You're all caught up.** "Everyone on Bench is free. Give the team something to do, or check the board."
- **Count:** **All caught up**. Composer placeholder: **Ask Atlas…** with chips based on the board: *Plan sprint 3 with Maya* · *What's left in the backlog?*
- **Whiteboard hover:** "Sprint 2 is done · 10 of 10 accepted".
- **The ending (M-O3):** when the last need resolves and nothing is running, the floor does **one shared nod** toward you, then settles. Once per visit.

### S6 · Many need you at once (12 across two floors)
- **Scene:** every needing agent shows its **mark** (step 0). Only the top 3 by rank escalate; only the top-ranked Blocked one comes forward. The rest stand with marks, still.
- **Greeting line:** **Twelve things need you. Start with QA-3: Jade is blocked.** "The list may be quicker: Open the list." (link)
- **Top bar:** **Needs you 12**; floor switcher **Bench ▾ 9 · InterviewKit 3**.
- **List:** ranked (D2), grouped Decide · Meet · For your info, top 5 + **Show all 12**.
- **Toasts:** batched: "3 new things need you: Noor, Karim, Rana." (one toast, one repeat).
- **Never:** a queue of creatures at your "door"; more than one walking forward.

### S7 · Error and stuck agents
- **Scene:** Noor at her desk, papers spilled, head down (concern, not alarm, M-R1); her topper askew; the monitor shows **"Stopped: out of memory"**. If Bench retries: she picks the papers up and types (behaviour-map §5.1). If the retry fails: Karim (the lead) walks over and stands beside her (a real escalation run).
- **Hover card:** **Noor** · **Error** · "Her run stopped: the test runner ran out of memory. Kept: changes to 3 files (checkpoint 09:18). Bench retries at 09:20 with the suite split in two."
- **Click:** opens Noor's page panel with the P06 RunCard (unchanged): **Retry now** · *Ask Karim* · *Open trace*.
- **Two failures:** Noor's state → **Blocked**, red-amber mark only if it needs you; otherwise the hover says "Karim has the details and will suggest a fix" and **no mark** (nothing is asked of you).
- **Success after retry:** the monitor's checklist turns green, Done celebration, a leaf on her plant ("Lesson saved: run the full suite in two halves on this PC").

### S8 · Offline
- **Banner (P01):** **You're offline.** "Agents finish the step they're on, then wait. Nothing is lost. Everything on this PC still works: What needs you, memory, the trace and settings." · *Try now*
- **Scene:** agents finish their current local step (a running `pnpm test` keeps going), then sit back at their desks: **Paused · offline**, eyes half-closed and calm (not worried); monitors: "waiting for the connection". Debates pause; the glass reads "Paused at 4:12 · offline". Idle agents carry on idling (they're idle).
- **Usage ring:** greyed, `as of 10:24`.
- **Composer:** sends queue: `Queued · Atlas gets this when you're back online`.
- **Marks:** still resolvable; local allows queue: **Allowed. Noor runs it as soon as you're back online.**
- **They caught me (OP5 + M-R2):** on reconnect, your queued messages go first, then the agents **wake in resume order**, 120 ms apart, so you can see the order. Digest: **While you were away (18 min):** "Noor's tests finished (12 of 12 passed) and she waited. Your message to Atlas was delivered first. Nothing was lost."

### S9 · Login expired
- **Banner (P03, Ink emphasis):** **Your Claude login has expired.** "Your agents paused at a safe point; nothing is lost. Run this in a terminal, then come back:" `claude login` · *Copy command* · *Check again*
- **Scene:** every agent that was running sits back: **Paused · waiting for your Claude login**. **Atlas carries the need** (README §3.8): on the Lobby, Atlas stands with a red-amber Blocked mark; on project floors, the floor switcher shows "Lobby 1". If you're on Bench, the greeting line says: **Sign in to Claude again.** "Atlas has the details in the Lobby."
- **Atlas's bubble:** **Sign in to Claude again** · tag **Blocked** · "3 agents and 1 routine are waiting for it. Bench never sees or stores your Claude credentials; signing in happens in Claude Code." · **Copy command** · *Check again*
- **Ending:** Bench re-checks every 30 s; on success Atlas's mark pops, agents wake in pause order, toast **You're signed in again.** "Noor, Karim and Maya picked up where they paused."

### S10 · Usage limit (and the guard before it)
- **Guard first (P05):** thin banner **Keeping 30 % of your week free.** "At this pace you'd have 24 % left by Monday, so 2 routines wait until there's room or until Mon 26 Oct at 09:00. Your own requests still run." The scene doesn't change except a small **clock** on the routine owners' monitors (behaviour-map §6). Ring tooltip **41 % of your week · guard on**.
- **Forecast:** Atlas's FYI (list only, no mark): **At this pace your week runs out around Sat 14:00.**
- **Limit (P04, Ink emphasis):** **Your week is used up.** "3 runs paused at a safe point and resume **Mon 26 Oct at 09:00**, in the order they paused. What needs you, memory and the trace still work." Badge `3 of 3 runs paused` · *See paused work*
- **Scene:** the 3 agents sit back at their desks, **Paused · week used up**; monitors show "resumes Mon 09:00 · 1st in line" (2nd, 3rd); debate timers on the glass: "Paused at 3:12 left · resumes with your week". Nobody goes to the lounge (they have work; H2 applies only to Idle).
- **Decisions still work:** in a bubble: **Allowed. Noor starts this on Mon 26 Oct at 09:00, first in line.** The mark becomes a resting mark with "starts Mon 09:00".
- **Deep model only ran out:** *Continue on Balanced* on Noor's card ("Noor switches to Sonnet for this task and goes back to Deep after the reset"). Never an API-key nudge (D5).
- **Ending (M-R2):** Monday 09:00 the agents wake **in resume order**; greeting line on your next open: **Good morning. Your week reset at 09:00.** "Noor and Karim picked up where they paused; the standup digest ran at 09:02. Nothing was lost."

### S11 · GPU fallback (Simple view)
- **When:** WebGL can't start, only a software renderer is available, or the 3D context is lost twice within 10 minutes (TC-O3). Also when you choose it in Settings › Office.
- **What you see (OP3):** the List fills the main area; above it a band with the last still of the floor and its age.
- **Banner (once, neutral):** **Showing the simple view.** "Bench couldn't start the live office on this PC (graphics acceleration is off or unavailable). Everything works the same: needs, agents, sessions and Atlas." · *Try the live office* · *Keep the simple view*
- **Context lost once:** the scene restores itself silently (OP1 caption for up to 2 s). Twice: the banner above.
- **Office · List:** **Office** is disabled with its reason in the tooltip: "The live office needs graphics acceleration. Try again from Settings › Office."
- **No still yet** (first run on a PC without a GPU): a generic greyscale illustration of an office, labelled **"Your office will appear here when the live view is available."**
- **Nothing is lost:** every action in README §3.9 has a List row.

### S12 · Reduced motion (OS setting or the in-app switch)
- **Default (Q-O3):** the **Still office**: the same 3D scene with poses and cuts instead of motion (behaviour-map §7). Marks appear without hops; escalation shows as a label on the mark ("waiting 10 min"); the camera moves you ask for are instant; floor changes crossfade.
- **One-time offer:** a quiet line under the greeting: "Motion is reduced. Prefer a list instead of the office? · Use the simple view" (shown once; it never returns after either choice).

### S13 · Window hidden or minimized
- **Behaviour:** rendering stops (0 % GPU for the office), escalation clocks pause, ambient life stops. Runs continue in main (unchanged). OS notifications follow the defaults (UX Q8: meeting requests, "something to show you" and blocked on; the rest off).
- **On return:** OP5. The scene snaps to the current truth (no replay of walks or celebrations you missed); needs appear with their marks at step 0 (no hop: they didn't just arrive); the digest card lists what happened if you were away ≥ 10 min.
- **Tray badge:** the count of needs (Decide + Meet).

---

## 4. Home (office) × the ten premium-craft columns

| Column | What you see | Exact copy | Actions |
|---|---|---|---|
| **Default** `#office` | S3 | as S3 | The bubble's primary |
| **Working / loading** `#office-loading` | OP2: the cached still, live chrome; 3D fades in when ready (≤ 1.5 s target). Atlas's status line loading in the greeting | **Atlas is collecting team summaries…** · after 10 s: **Still collecting: 4 of 7 summaries in.** · after 4 s of 3D: **Starting the office…** | none |
| **Empty: first use** `#office-first` | S1 | as S1 | Chips |
| **Empty: cleared** `#office-clear` | S5 ending (M-O3) | **You're all caught up.** "The team is working on 7 things. New needs show up as marks over their heads." | none |
| **Empty: no results** | `F` finds nobody · a List filter with no match | **No one called "Noah" on any floor.** "Hire someone from an open desk, or check the spelling." · **No meetings waiting.** "5 other things need you." | *Show all* |
| **Partial** `#office-partial` | OP4 on one floor; or Atlas's summary missing while the scene and list are live | **Atlas's summary isn't ready (Claude didn't answer).** "The office and the list are live and complete." | *Try again* |
| **Error** `#office-error` | The needs list can't load (database locked): marks can't be trusted, so **no marks are drawn** and the count reads "—" | **What needs you couldn't load.** "Bench couldn't read its database (`bench.db` is locked by another program). Nothing was lost. Marks come back when it loads." | **Try again** · *Details* |
| **Offline / Claude down** `#office-offline` | S8, or P02 for Claude down (agents: **Paused · Claude isn't answering**) | P01 / P02 | *Try now* |
| **Usage limit / guard** `#office-limit` | S10 | P04 / P05 | *See paused work* |
| **Denied** `#office-denied` | You deny in a bubble (P07): the mark folds (no pop), the agent sits and continues with plan B; Noor's line appears on hover for 6 s | Toast: **Denied. Noor opens the pull request with the chat tests only.** `Undo` · Noor: *"ok. no full suite. i'll open the pr with the chat tests only and say so in the description."* | *Undo* (10 s) |
| **Success** `#office-resolved` | Bubble → check → fold → mark pops → nod → sit; counts tick everywhere; the next bubble opens | Toast: **Nightly E2E chosen. Karim sets it up tonight; first results tomorrow at 07:00.** `Undo` | *Undo* · *Open QA-3* |

**Suggested hi-fi routes** for the UI phase and the spike: `#office`, `#office-loading`, `#office-first`, `#office-one`, `#office-crowded`, `#office-idle`, `#office-many`, `#office-stuck`, `#office-offline`, `#office-login`, `#office-guard`, `#office-limit`, `#office-simple`, `#office-still`, `#office-back` (OP5), `#office-partial`, `#office-error`, `#office-denied`, `#office-resolved`.

## 5. Worst-moment pass (office)

| Moment | Cause shown | What's safe | One next step | They caught me |
|---|---|---|---|---|
| Offline mid-run | "You're offline" | Steps in progress, queued messages | none (*Try now*) | Your messages go first on reconnect; agents wake in order |
| Weekly limit | "Your week is used up" + the time | Everything; decisions still allowed | *See paused work* | Forecast hours earlier; monitors show each agent's place in line |
| A run crashes | Plain cause on the monitor and hover | Files, checkpoint, log | *Retry now* (panel) | Automatic retry with a changed approach; the plant grows when it works |
| Approval denied | Your decision | The agent's work | none (*Undo*) | Plan B in the same breath; no new mark |
| Connector revoked | "GitHub stopped answering Noor" | Commits on this PC | Atlas's bubble: *How to reconnect* | Atlas lists the blast radius: "This affects Noor, Karim and 2 routines" |
| Every list empty | First run | — | A chip | Chips built from your machine |
| Long name / 30 agents | — | — | `F` to find | Area counts read the floor before the creatures |
| 3D won't start | Graphics acceleration off | Everything | *Keep the simple view* | Nothing is office-only |
| Hidden for hours | — | Everything | *Dismiss* digest | No replays; the truth, then a short story of what happened |
| Login expired | Atlas carries it | Every session | *Copy command* | Auto-resume when you're back |
