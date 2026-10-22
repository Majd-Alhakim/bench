# The Office: UX for the office-first Home

| Status | Version | Owner | Approver | Upstream |
|---|---|---|---|---|
| Draft for client review | 0.1 (2026-10-22) | UX Designer | Client | **Brief:** [office Home design](../../ui/office/2026-10-22-office-home-design.md) (approved 2026-10-22). Also the UX package v0.4 ([../README.md](../README.md)), the premium spec ([../premium/](../premium/)), DIRECTION v0.2, the design system stage 1 (`docs/design/ui/system/DESIGN-SYSTEM.md`), research [minimal-characters](../../../research/teardowns/minimal-characters.md), the client references `docs/design/ui/references/office-iso-*-client.webp` and `creature-sheet-client-2026-10-22.webp` |

**What this folder covers.** Only what the client changed: **Home becomes the office** and **agents become creatures**. Chats, the agent page, team chat, settings, routines, memory, usage, trace, the design system and the premium spec stay as agreed. Where the office needs one of those, it reuses it as it is (the Ticket, the ApprovalCard, the Receipt, Look inside, the shared patterns P01–P10, the status vocabulary).

| File | What it gives |
|---|---|
| **README.md** (this file) | Research, the IA and interaction model, the click map, panels and Back, keyboard and screen-reader paths, screen cards, principles, validation tasks, premium-craft outputs, client questions |
| [flows.md](flows.md) | Ten core flows, end to end, each step with what you do, what the office shows, the copy and the evidence |
| [office-states.md](office-states.md) | The office's state matrix: 13 office-wide states plus the 10 premium-craft columns for Home, exact copy |
| [behaviour-map.md](behaviour-map.md) | Every real agent event → office behaviour; the honesty rules; urgency escalation; clutter-from-history props |
| [creature-picker.md](creature-picker.md) | Choosing an agent's creature: parts, Atlas's suggestion, shuffle, uniqueness per floor, preview, accessibility |

**Greyscale, no art.** This is structure, behaviour and copy. Colours named here are meanings (amber = needs you, red = error) or the agent hue *names* from the design system; the UI designer owns the look board and the creature library sheet. Example data is the premium spec's: today is **Thu 22 Oct**, the week resets **Mon 26 Oct at 09:00**, 41 % used.

---

## 1. Research

**Methods:** the client's brainstorm (recorded in the design doc §1–2, verbatim quotes), the four client references (viewed), the minimal-characters teardown (Grok Bot, Dots, Duolingo, Rive, Clippy, Cozmo, Pikmin, Luxo Jr.), the existing UX research (UX package §1), heuristics (Nielsen #1, #3, #4, #6, #7, #8; Krug's "don't make me think") and conventions the client already knows (map and canvas apps: wheel zooms toward the pointer, drag pans, a "fit" control).

| # | Research question |
|---|---|
| RQ-O1 | What should the client *feel* and *read* in the first 3 seconds of opening Bench? |
| RQ-O2 | How does "what needs you" stay fast and findable when it lives in a 3D scene? |
| RQ-O3 | How do floors, areas and rooms map to the org the client already built (projects, teams, leads, loans)? |
| RQ-O4 | How does the office stay honest (glass box) while it feels alive? |
| RQ-O5 | How does every office action stay reachable without the 3D (keyboard, screen reader, no GPU)? |
| RQ-O6 | How does the client get from the office to the places that didn't change (agent page, sessions, project pages) and back, without losing the map? |
| RQ-O7 | How does choosing a creature feel like ownership without becoming a chore or a game? |

### Findings (with source) → insights

| RQ | Finding | Source | Insight (design consequence) |
|---|---|---|---|
| O1 | *"I have walked into my startup … everyone is positive and working hard … some arguing and others deep focus and others just doing nothing … then I get greeted … I am the boss"* | Design doc §1 | The open is a **scene**, not a screen: agents glance up, Atlas greets you, and the work is visible as activity before any text. Then the one thing that needs you comes forward (the D-UI7 rule carried into the office) |
| O1 | Calm control is the promise: "a quiet, well-run room"; amber only means needs you, motion only means working | Premium README §2, P1 | Energy comes from **real** work. At rest the office is calm; ambient life is sparse and budgeted (behaviour-map §4) |
| O2 | "It hides information: the client must hunt in 3D for something a list would show instantly" is an anti-goal; the list stays one click from the count | Design doc §3, §4.1 | **Two equal paths to one fact:** the mark in the scene and the row in the list. Resolving either clears both. The count is always in the top bar |
| O2 | Clippy failed by interrupting; Pikmin puts identity on top for crowd scenes | Teardown §3 | Marks float **above** heads (visible over partitions), and an agent who needs you moves only inside its own floor and never takes the camera |
| O3 | Project = floor; team = area; nested departments = sub-areas; company level = ground-floor lobby and executive corner; freelancers at hot desks; loans at guest desks; cross-floor handoff through a lift or tube | Design doc §6a "Org mapping" | The layout is **generated from the org** the client already edits on the Team page; there is nothing new to manage. The office is a view of the org, not a second org |
| O3 | BRD UC-01 A7: during a loan "the original agent stays in its home node and keeps working there" | BRD v0.5 | **Conflict** with the design doc ("its home desk shows an 'On loan to …' sign"). The office shows the original at home *and* the loan copy as a guest (§3.6, client question Q-O1) |
| O4 | Honesty: "no animation without a backing event"; idle may socialise, never "argue"; working, debating, handoff, needs-you, done and stuck only from real events | Design doc §5, §6a | Every non-idle behaviour is keyed to a **trace event** (CLAUDE.md: every feature emits one), and the hover card names it. Rules in behaviour-map §1 |
| O4 | Rive practice: blink on events, not on a timer; Luxo Jr.: timing is personality | Teardown §3, §4.1 | Blinks and glances fire on real events (a tool call, your message); temperament (tempo offset) comes from the agent id |
| O5 | Accessibility constraint: every office action has a keyboard path and a text equivalent; reduced motion respected; words on hover and focus; Simple view when GPU is missing | Design doc §5, §6a | An **office outline** (an accessible tree in the DOM, synced with the 3D focus) and a **List view** carry 100 % of the office's actions. The 3D is never the only way to do anything |
| O6 | Spatial continuity: things enter from where they live and leave the way they came; Back reverses the path | moments-and-motion §1 | Panels slide over the office from the right (the "glass" side) while a strip of the office stays visible and alive; Back returns to the same floor and camera position |
| O7 | Notion Faces: a parts kit plus Shuffle makes identity personal without an illustrator; Grok Bot: two parameters per agent = zero cost to add one | Teardown §3, §1 | Four parts (form, topper, eyes, colour), Atlas's suggestion as the default, Shuffle, and **no required step**: you can create an agent without touching the picker |
| O7 | Hue reuse rule: a pair is never used twice inside one project (D-UI8, R9) | Design system §3.4 | Uniqueness per floor = **form + colour**, enforced in the picker with the reason shown |

---

## 2. Persona and journeys (delta)

The persona is unchanged (UX package §2). Two behaviours matter more now: the client opens Bench several times a day for **scan, act, leave** visits under 2 minutes `[ASSUMPTION, UX §2]`, and he wants to **feel like the boss** walking in (design doc §1).

### 2.1 First run: install → first useful result (office version)

| Stage | Where | You do | You feel | Risk | What the office does |
|---|---|---|---|---|---|
| 1. Checks and folder | First-run steps 1–2 over the empty lobby (blurred still) | Nothing, or run `claude login` | Wary | A new login | Unchanged copy (state-matrix 3.13); the empty lobby is the backdrop, so you see where you'll land |
| 2. Your main agent | Step 3 | Name it; keep or change its look | "This is mine" | A chore | Atlas's creature is suggested; **Change look** is optional (creature-picker.md) |
| 3. Team start | Step 4 | Pick Product + Dev or Atlas only | "Is this my team?" | A preset imposed | Nothing pre-selected (D1). The preview names the floor: "Creates a floor for Bench with 7 desks" |
| 4. Move-in | Home | Watch | Delight, belonging | A long animation | The floor is built desk by desk and the agents walk in (M-O1, ≤ 4 s, skippable with any key) |
| 5. First result | Home, Atlas | Send a suggested message | "It works" | A silent empty office | Atlas greets you at the entrance; suggestion chips sit under the docked composer; the first ticket appears as a mark |

### 2.2 Daily use: morning open

| Stage | You do | Office shows | Pain avoided |
|---|---|---|---|
| Arrive | Open Bench | The floor you last viewed renders from the cached still in < 1.5 s; agents glance up; Atlas greets you if free | Waiting on 3D before you can act (the count and list work immediately) |
| Read | Look | Who's working, who's debating, who needs you; the greeting line: "Seven things need you. Start with QA-3: Jade is blocked." | Reading a list first |
| Act | Decide in the bubble | Jade's bubble is open (top item, D-UI7); one blue button | Hunting in 3D |
| Next | Resolve, then the next | The mark pops, Jade nods and sits, counts tick down everywhere, the next bubble opens | Losing the queue |
| Leave | Close or switch floor | Nothing to save | — |

---

## 3. Information architecture

### 3.1 The layer model (what sits where)

Home is a **stack of five layers**. Everything else in Bench is unchanged.

| Layer | What | Lives | Closes with |
|---|---|---|---|
| **L0 Scene** | The 3D office of the current floor | The whole main area (right of the sidebar) | — |
| **L1 Chrome** | Top bar (floor switcher, Office · List, usage ring, Needs you), greeting line (top left), docked **Ask Atlas…** composer (bottom centre), view controls (bottom right: −, +, Fit) | Fixed over the scene | — |
| **L2 Light layers** | Hover card, **ticket bubble**, **Look inside peek**, area card, room card, prop tooltip | Anchored to a thing in the scene | Esc, click outside, or acting |
| **L3 Panels** | Agent page, session (debate, interview, review), What needs you list, project pages (Dashboard, Team chat, Team, Sessions), Company | Slide in from the right over the scene; a strip of the office stays visible (≥ 320 px at 1440) | Esc, the Close button (left of the panel header), Back |
| **L4 Dialogs** | New agent, New project, delete confirms (unchanged) | Centre | As today |

**Rule (one pattern): anything you open *from Home* opens as a panel over the office; anything you open from elsewhere opens where it always did.** The agent page is the same page in both cases; only its container differs. At windows under 1280 px wide the panel covers the scene fully and the office pauses behind it (the strip would be too narrow to read).

### 3.2 Wireframe: Home at 1440 × 900 (greyscale, annotated)

```
┌ sidebar (unchanged; rail below 1180 px) ┬────────────────────────────── main area ───────────────────────────────┐
│ Home ●                                  │ [Bench ▾  2]  [Office | List]          ◔ 41 % of your week   Needs you 7 │ ← L1 top bar
│ Approvals 3                             │ Thursday, 22 October                                                     │ ← greeting line (L1)
│ Company                                 │ Good morning. Seven things need you. Start with QA-3: Jade is blocked.   │
│ ▾ Bench                                 │ Your team learned 7 things this week · See what                          │
│   Dashboard · Team chat · Team · Sess.  │                                                                          │
│   (agent rows with creature + badge)    │      ┌──────── Meeting room A (glass) ───────┐   ┌ Whiteboard ┐          │
│ ▸ InterviewKit                          │      │ Debate: where does Stop live? 4:12    │   │ Sprint 2   │          │
│ Insight: Memory · Usage · Trace         │      │  Maya  Sam  Noor  (!? bubbles)        │   └────────────┘          │
│ Settings                                │      └───────────────────────────────────────┘                          │
│                                         │   ▣ Requirements ▣        ▣ Design ▣          ▣ Dev team ▣              │ ← area rugs + labels
│                                         │   Omar ▢  Lina ▢          Sam's desk (empty)   Karim ▢ Noor ▢ ⚑(flag)    │
│                                         │                                               ┌ QA (sub-area) ┐          │
│                                         │                       [!]                     │ Jade ▢ (!)    │          │ ← marks above heads
│                                         │                ┌──────────────────────────┐   └───────────────┘          │
│                                         │                │ BLOCKED · QA-3 …  (bubble│                              │ ← L2 ticket bubble
│                                         │                │ open, one blue button)   │                              │
│                                         │                └───────────▽──────────────┘                              │
│                                         │   ◇ Lounge: Lina (coffee) · Omar (phone)        ◇ Lift / entrance        │
│                                         │                                                  Open desk · Hire        │
│                                         │              ┌────────────────────────────────────┐        [−][+][Fit]  │ ← view controls
│                                         │              │ Ask Atlas…                    Send │                     │ ← docked composer
│                                         │              └────────────────────────────────────┘                     │
└─────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy test (Home, one need open):** first the open bubble's title ("QA-3 is blocked: E2E failed twice"), second its blue button ("Use nightly E2E"), third the greeting line. **With nothing open:** first the people (who works, who debates, who has a mark), second the greeting line, third the composer.

### 3.3 Org → office mapping (generated, never hand-placed)

| Org object (from the Team page and Company) | In the office | Notes |
|---|---|---|
| Company (Atlas, personal agents, the projects list) | **Ground floor: the Lobby.** Atlas's desk in the **executive corner**, personal agents (Iris) near reception, a **floor directory** by the lift | The reception desk opens the Company page |
| Project | **A floor** above the lobby, in project creation order | Floor name = project name |
| Project lead (Maya) | A lead desk at the head of the floor, by the **whiteboard corner** | Text tag LEAD on the hover card |
| Team / group (Requirements, Design, Dev team) | **An area**: a rug or zone with the team name on the floor, its desks, its lead's desk at the end nearest the aisle | One area per group |
| Nested department (Dev team › QA) | **A sub-area** inside the parent area, with its own smaller label | Max 2 levels drawn; deeper levels are labelled "Dev team › QA › E2E" on the sub-area |
| Agent | **A desk** (chair, monitor, lamp, nameplate) in its home area | Desk order: lead first, then by creation date |
| Freelancer | A **hot desk** at the edge of the area of the agent who hired it, nameplate "Freelancer · until S1-6 is done" | Removed when the freelancer ends |
| Loan copy (UC-47) | A **guest desk** at the edge of the borrowing area; the creature wears a guest lanyard; label tag **LOAN** · "On loan from Bench · Dev team" | The original stays at its home desk and keeps working (BRD UC-01 A7); its desk shows a small sign "A copy is on loan to InterviewKit" (Q-O1) |
| Session (debate, interview, review) | A **meeting room** (glass walls) on the floor of the session's project | Rooms are generated: 1 per 10 agents, minimum 1 |
| Sprint board | The **whiteboard corner** (planning) | Opens the project Dashboard |
| Idle agents | The **lounge / kitchen** | Idle only (behaviour-map §1) |
| A floor over 30 agents | A **second wing** on the same floor, joined by a corridor | Wing label "Bench · east wing" |
| Archived agent | The desk is packed (a box) and leaves the layout the next time Home opens | The agent stays on the Company page |

### 3.4 The camera

- **Angle:** fixed, about 30–35° down, isometric-style. **No rotation** in v0.1.
- **Zoom:** continuous between **Fit floor** (the default: the whole floor with a 10 % margin) and **Desk** (a monitor readable, about 4× fit), with soft snaps at three stops: **Floor**, **Area** (one team fills the view), **Desk**. Names show for every agent at Area and Desk zoom; at Floor zoom only for agents that need you, the hovered one and the focused one.
- **Pan:** bounded to the floor, with a rubber-band at the edges (24 px max, then it settles: premium physics).

| Input | Does |
|---|---|
| Mouse wheel | Zooms toward the pointer (map convention, Jakob's law) |
| Drag on empty floor (left or middle button) | Pans |
| Trackpad two-finger scroll / pinch | Pans / zooms |
| Double-click an area | Zooms to that area |
| **Fit** (bottom right) or `0` | Fits the floor |
| `+` / `−` | Zoom one stop |
| Shift + arrow keys | Pan (plain arrows move focus in the office outline, §6) |
| Focus moves to an item (Tab, arrows, N, Find) | The camera follows only if the item is outside the middle 80 % of the view |

**The camera never moves by itself** for events. Only you move it: by panning, zooming, or asking for something (opening a bubble for an off-screen agent, "Show in office", switching floors). The one exception is the first-run move-in (flows F1), which you can skip. *(Clippy lesson: never take control.)*

### 3.5 Floors and the floor switcher

- **Where:** the first item of the top bar, where the breadcrumb used to be. It reads as the location: **Bench ▾** with the needs-you count of that floor.
- **Open it (click, or Enter on focus):** a menu of floors, top floor first (like a building directory), then the Lobby at the bottom:

```
InterviewKit        2 need you · 3 working            Sprint 1 · day 2 of 3
Bench           ●   5 need you · 4 working · debate   Sprint 2 · day 1 of 3 · ends Sat 24 Oct
Lobby               Atlas · Iris                      Company
──────────────
+ New project (adds a floor)
```
  Each row carries what the old Home project card carried (name, needs-you count, live activity, sprint line), so the Projects section of the old Home lives here now.
- **Switch:** click a row, `[` / `]` (previous / next floor), or the in-world floor directory by the lift. The transition is a lift: the current floor slides down and the next one rises into place (`--dur-scene`, 420 ms; reduced motion: crossfade). The camera lands on **Fit floor**.
- **Marks on other floors** show as a count on that row and on the switcher label when you're elsewhere: "Bench ▾ · InterviewKit 2".
- **Where you land on open:** the floor you last viewed. First run: the Lobby until a project exists, then that project's floor. (Client question Q-O4.)
- **Floor menu (project pages):** the switcher row has a "…" (and right-click) with the project's existing pages: **Dashboard · Team chat · Team · Sessions** plus Open in split view / Open in a new tab (D-UI9). They open as panels over the office.

### 3.6 Places on a floor

| Place | What it's for | Hover | Click | Empty state |
|---|---|---|---|---|
| **Area** (team rug and label) | Who is in a team | The label lifts; a count "Dev team · 3 · 1 needs you" | **Area card** (L2): lead, members with status words, needs-you count, *Open team chat* · *Open Team* · *Hire for Dev team* | "No one in Design yet." *Hire for Design* |
| **Sub-area** (nested department) | The same, one level down | "Dev team › QA · 1" | Area card for the sub-area | as above |
| **Meeting room** | Where sessions happen | The glass shows the topic, the decider and the timer: "Debate: where does Stop live? · Maya decides · 4:12"; the eyes glyph (Look inside) | Opens the **session** as a panel (debate view, interview or review) | Hover: "No meeting here now. Last: debate on the Stop button, decided 09:16." Click opens the project's Sessions page |
| **Whiteboard corner** | Planning | "Sprint 2 · day 1 of 3 · 2 of 10 done" | Opens the project **Dashboard** | "No sprint yet · Maya is planning sprint 1" |
| **Lounge / kitchen** | Where idle agents go | "Idle: Lina, Omar" | Nothing of its own (each creature is its own target) | Empty lounge = everyone is busy (honest) |
| **Entrance / lift** | Where you arrive and where Atlas greets you; cross-floor handoffs go into the tube here | "Lift · floors" | Opens the floor switcher | — |
| **Open desk** (one per area, at its edge) | The signifier for growth | "Open desk · Hire for Dev team" | Opens **New agent** with the team pre-filled | Always present unless switched off in Settings › Office |
| **Lobby: executive corner** | Atlas (the main agent) and the company level | Atlas's hover card | Atlas → Atlas's page (same as the composer) | — |
| **Lobby: reception** | The company | "Company · 2 projects · 11 agents" | Opens the **Company** page | — |
| **Lobby: floor directory** | Floors in-world | The directory lists floors with counts | Same menu as the switcher | — |
| **Atlas's tray** (on Atlas's desk) | What Atlas decided for you | "Decided by Atlas today: 4" | What needs you, filter **Decided by Atlas** | Hidden at 0 |

### 3.7 The docked "Ask Atlas…" composer

- Always at the bottom centre of Home, 560 px wide, over the scene (`--z-sticky`). Placeholder **Ask Atlas…**; under it, on first use only, the suggestion chips (state-matrix 3.1).
- **Send** is a Carbon control, not blue (R1): talking isn't a decision.
- On Send, **Atlas's page opens as a panel** (§3.1 rule) and the composer **becomes that panel's composer** (shared element: it slides into the panel's bottom edge; the placeholder changes to "Message Atlas"). Your message is the first new line in Atlas's room. Close the panel and the composer slides back to its dock, empty.
- **Clicking Atlas** in the office does the same as focusing the composer and opening Atlas's page.
- Offline / limit: the composer queues (P01, P04 receipts), exactly as in Atlas's room.
- Keyboard: `Ctrl + /` focuses it from anywhere on Home; it's also the last Tab stop of Home.

### 3.8 "N need you": the count and the list

- **The count** sits at the right of the top bar: **Needs you 7** (Decide + Meet only, R5); **All caught up** at 0 (not a link on Home). Marks on other floors are included.
- **Click it → the What needs you panel** (L3, 420 px, from the right): the **same tickets and filters** as the inbox (All · Decide · Meet · For your info · Decided by Atlas), ranked by D2, the top one open. Each row adds the floor ("Bench") and a **Show in office** link (locate glyph).
- **One fact, two places:** resolving in the list pops the mark in the office; resolving in the bubble removes the row. Counts tick together in the top bar, the floor switcher, the sidebar and the area card (M-H2).
- **Show in office:** closes the panel, switches floor if needed (lift), pans to the agent and opens its bubble, with focus in the bubble.
- **Hovering a row** highlights the agent in the visible strip of the office (a soft outline), so the list and the scene stay connected.
- **For your info** items get no mark (they need nothing from you); they live only in the list.
- **System needs** with no agent source (your Claude login expired, a connector revoked) are **carried by Atlas**: Atlas gets the mark (the app speaks as the main agent, U8).

### 3.9 Click map (pointer, keyboard, result)

| Target | Hover / focus shows | Click / Enter | Right-click / Shift+F10 / Menu key |
|---|---|---|---|
| **Agent, no mark** | Hover card: creature 24 + **Noor** · Developer · Dev team / **Working** · running `pnpm test chat` · since 09:12 / `This run 28.4k tokens · 0.9 % of your week` | Opens **the agent page** as a panel (conversation focused) | Agent menu: Open Noor · Look inside her screen · Message Noor · Change look · Loan to another team… · Pause Noor |
| **Agent with a mark**, or **the mark** | Hover card with the ask in one line: **Needs you** · asks to run `pnpm test` in bench | Opens the **ticket bubble** above it (§3.10) | Same menu + Open ticket |
| **Monitor** (on any desk) | The eyes glyph + "Look inside Noor's screen" | Opens the **Look inside peek** (§3.11) | — |
| **Meeting room** | Topic, decider, timer, Look inside | Opens the **session** panel | Session menu: Open · Join and decide (debates) |
| **Prop** (trophy, sticky notes, plant, cake…) | Its tooltip: what it stands for, its source and date (behaviour-map §6) | Opens its source (the memo, the task list, the lessons, the ledger) | — |
| **Area label / rug** | Area count | **Area card** | Area menu: Open team chat · Open Team · Hire for this team |
| **Whiteboard** | Sprint line | Project **Dashboard** | — |
| **Empty floor** | — | Closes any light layer (L2); never closes a panel | — |
| **Handoff card in transit** | "Maya → Karim · brief: S1-6 SQLite persistence" | Opens the task | — |

### 3.10 The ticket bubble

- **The same Ticket component in its open size** as the inbox and the old Home (kind tag, source "Noor · S1-4 · 2 min ago", the ask, a one-line reason, the consequence "≈ 3 min · ≈ 0.08 % of your week", **one blue primary**, secondary actions). Same copy, same Undo toast, same scope note on Always allow (D3). It is **one fact**: allowing here clears the inbox row and the workspace ApprovalCard.
- **Anchored** above the agent with a tail to the mark; it flips below the agent near the top edge, and docks to the nearest screen edge with a leader line if it can't fit. If the agent is off-screen when you open it (from the list or with `N`), the camera pans first (`--spring-smooth`), then the bubble grows from the mark.
- **One at a time.** Opening another bubble closes the first. Opening a panel closes the bubble.
- **D-UI7 in the office:** on Home's first render of a visit, the **top-ranked** bubble on the current floor opens by itself after the greeting (about 1.2 s; instantly under reduced motion). If the top item is on another floor, the greeting line names it with a link ("Start with QA-3 on Bench") instead. (Client question Q-O2.)
- **Resolving:** the primary shows progress if > 300 ms → a check → the bubble folds into the mark → the mark pops → the agent nods and sits back down (or carries on working) → counts tick → the next bubble on this floor opens itself. Toast with Undo where reversible.
- **Later / Not now:** the bubble folds, the mark **shrinks to a resting mark** (small, no escalation) and the item stays in the list. It escalates again only if its state changes (for example it becomes Blocked).
- **Esc** closes it; focus returns to the agent in the outline.

### 3.11 The Look inside peek (monitor)

- Clicking a monitor grows a **peek card** out of the screen (shared element, `--spring-smooth`): the agent's live workspace view as it is right now (the diff, the doc, the browser, the terminal), read-only, with the live line ("running `pnpm test chat` · 8 of 12 passed").
- Actions: **Open Noor** (the agent page panel, workspace in front) · *Take over* (opens the agent page and starts take-over, unchanged). Esc shrinks it back into the monitor.
- Idle monitor: "Noor's screen is idle. Last: PR #44 opened at 09:31." with *Open Noor*.
- The same eyes glyph keeps its meaning everywhere else: it opens the trace behind a message, a cost or a file.

### 3.12 Panels over the office and the way back

| From | Opens | Office behind | Back / Esc / Close returns to |
|---|---|---|---|
| Agent (no mark), Atlas, the composer | Agent page panel (conversation + workspace, unchanged) | Visible strip ≥ 320 px on the left, alive; the camera re-centres the agent's desk in the strip | The full office, same floor, the camera where it was before you opened |
| A bubble's "Open Noor" | Agent page panel with the ApprovalCard in the workspace | as above | as above |
| Meeting room | Session panel (debate / interview / review, unchanged) | Strip shows the room | as above |
| Monitor → Open Noor | Agent page, workspace in front | as above | as above |
| Needs you count | What needs you panel (420 px) | Most of the office visible | The office |
| Floor menu / whiteboard / area card links | Project page panel (Dashboard, Team chat, Team, Sessions) | Strip | The office |
| Reception | Company page panel | Strip | The office |

- **Changing rooms:** clicking another agent in the visible strip while a panel is open switches the panel to that agent (the existing room change: the wash crossfades, the header creature swaps). Back goes to the previous room, then to the office.
- **Back** is the panel header's left button, Esc, Alt + ←, and the mouse back button. It always reverses the path.
- Panels **don't** close on a click in the office strip (no lost drafts by accident). Light layers (L2) **do**.
- Opening a page from the **sidebar** while on Home follows the same rule (panel over the office). The sidebar's **Home** item, when Home is already showing a panel, closes all panels.

### 3.13 Office · List

A segmented control in the top bar switches the main area between the **Office** and the **List**. The List is the office in words, live, and is also the Simple view's main content (office-states §GPU fallback):

```
What needs you 7                                   (the same tickets, top one open)
─────────
Bench (floor)      Sprint 2 · day 1 of 3                       5 need you
  Dev team         Karim  LEAD   Working · reviewing PR #41
                   Noor          Working · in a debate · 1 waiting for you [Open ticket]
    QA             Jade          Blocked · QA-3 E2E failed twice           [Open ticket]
  Meeting room A   Debate: where does Stop live? · 4:12 · Maya decides     [Open]
  Lounge           Lina, Omar · Idle
InterviewKit       …
Lobby              Atlas · Idle · Iris · Working · drafting 2 replies
```
Every row has the same click result as its office target (§3.9). The List remembers your choice per device; the default is Office.

---

## 4. Keyboard and screen-reader paths (every office action without the 3D)

### 4.1 The office outline (the accessible twin of the scene)

The scene is mirrored by a **DOM tree** (`role="tree"`, labelled "Office: Bench floor") that is the real focus target; the 3D draws a focus ring around whatever the tree has focused. One Tab stop for the whole office (roving tabindex).

```
Bench floor · 5 need you · 4 working · 1 debate
├─ Needs you (5)          ← a shortcut group listing marked agents in rank order
├─ Meeting room A · Debate: where does Stop live? · 4:12 · Maya decides
├─ Requirements · 2
│  ├─ Omar · LEAD · Idle · in the lounge
│  └─ Lina · Idle · in the lounge
├─ Design · 1
├─ Dev team · 3 · 1 needs you
│  ├─ Karim · LEAD · Working · reviewing PR #41
│  │  └─ Karim's screen (Look inside)
│  ├─ Noor · Working · in Meeting room A · 1 waiting for you: allow pnpm test
│  └─ QA · 1
│     └─ Jade · Blocked · needs you · QA-3: E2E failed twice
├─ Whiteboard · Sprint 2 · 2 of 10 done
├─ Lounge · Lina, Omar
└─ Lift · other floors: InterviewKit (2 need you), Lobby
```

- **Arrows:** ↑/↓ move through visible items, → expands / goes to the first child, ← collapses / goes to the parent, Home/End first/last.
- **Enter:** the item's click result (§3.9). **Shift+F10 / Menu key:** its menu.
- **Accessible names** always carry the words: "Noor, Developer, Dev team. Needs you: asks to run pnpm test in bench. 2 minutes ago." Props are listed under their owner ("Noor's desk: plant, 12 lessons; 3 sticky notes, open tasks").
- The tree contains **everything clickable** in the scene. If it isn't in the tree, it doesn't exist (a test rule for QA).

### 4.2 Home shortcuts

Single-letter keys work **only while the office has focus** (WCAG 2.1.4) and are listed on the `?` sheet.

| Key | Does |
|---|---|
| Tab / Shift+Tab | Top bar → office → composer → view controls |
| `N` | Next agent who needs you, in rank order (this floor, then "2 more on InterviewKit · press N again to go there") |
| `F` | Find an agent on any floor (type a name; Enter goes there) |
| `[` / `]` | Previous / next floor |
| `+` / `−` / `0` | Zoom in / out / fit floor |
| Shift + arrows | Pan |
| `L` | Toggle Office · List |
| `Ctrl + /` | Focus Ask Atlas |
| Esc | Close the top layer (bubble → peek → panel), focus returns to where it came from |
| `?` | Keyboard sheet |

### 4.3 What the screen reader hears (live region, polite)

- **Announced:** a new need ("Noor needs you: asks to run pnpm test"), a resolution ("Allowed once. Noor is running pnpm test."), a floor change ("Bench floor. 5 need you, 4 working."), a cross-floor handoff ("Maya handed S1-6 to Rana on InterviewKit"), a banner (P01–P05, `role="status"`).
- **Throttled:** at most one announcement every 5 s; bursts are batched ("3 updates: Noor finished; Karim started PR #41; Jade needs you.").
- **Never announced:** ambient idle behaviour, walks, glances, props appearing (they're in the tree when you look).

### 4.4 Without a GPU, or by choice

The **List** (§3.13) carries every action. The **Simple view** (office-states) is the List plus a still picture. Nothing in Bench requires the 3D.

---

## 5. Screen cards (premium-craft gate 1)

| Surface | Intent | Primary | Evidence (what happened · take it back · next) | Consequence preview | Intelligence deposit | Hierarchy test |
|---|---|---|---|---|---|---|
| **Home: the office** | Know → Do | The open bubble's decision; none when nothing is open | Marks pop and counts tick; Undo toast; the next bubble opens | Inside the bubble's button ("Use nightly E2E · Karim sets it up tonight · free") | The order you resolve kinds in (ranking ties); the floor you work on most (landing floor) | Bubble title → its blue → greeting line |
| **Ticket bubble** | Do | The ticket's verb | As the Ticket (state-matrix 3.5) | On the button and the consequence line | Allow / deny patterns (R7), denial reasons (lessons) | Title → primary → provenance |
| **Look inside peek** | Know | None (Open Noor is secondary) | Live line with time | N/A (read view) | None | The screen → the live line → Open |
| **What needs you panel** | Do | The top ticket's decision | Same as the inbox | Same | Same | Open ticket → its decision → the queue |
| **Floor switcher** | Go | None | The label shows where you are | Counts per floor | Your landing floor | Current floor → counts → other floors |
| **Area card** | Know → Go | None (links) | — | "Hire for Dev team" says where the desk goes | — | Team name → who needs you → members |
| **Creature picker** | Do | Use this look / Create | Live preview; Undo on save | "Unique on Bench" before you pick | Your picks tune Atlas's suggestions | Preview → parts → Use |

---

## 6. Office principles (added to UX principles 1–14)

- **O1. The office is a view of real work.** No animation without a trace event, except idle life, which is honest because the agent *is* idle (behaviour-map §1).
- **O2. The scene and the list are one fact.** Whatever you can see or do in the office, you can read and do in the List and the What needs you panel.
- **O3. You drive the camera.** Events never move it; marks come to the front of the floor, the view doesn't go to them.
- **O4. Words are one hover or one focus away.** Every creature, mark, room and prop names itself in text (status word + what + since).
- **O5. Calm by budget.** At most 3 agents escalate at once; ambient idle actions are sparse; the office sleeps when hidden.
- **O6. Panels over the office, Back to the same spot.** The office stays visible behind what you opened, and Back returns you to the same floor and camera.
- **O7. Your creature, your call.** Atlas suggests, Shuffle offers, you decide; nothing is required to create an agent.

---

## 7. Usability validation (client tasks, on the office spike and the next prototype)

There's no clickable office prototype yet: the UI look board and the tech lead's spike come next (design doc §8). These tasks are written for that spike scene and for a greyscale clickable prototype built from this spec.

| # | Task (as given to the client) | Covers | Success criteria | Fail if |
|---|---|---|---|---|
| **T8** | "It's the morning. Without opening any list, tell me who is working, who is debating, who is idle and who needs you on Bench." | Home scene, behaviour map | Names ≥ 3 states correctly within 10 s of the office appearing; points at the debate room; says what Jade needs by hovering her mark | Reads an idle agent as working, or can't tell a debate from two idle agents chatting |
| **T9** | "Deal with the most important thing that needs you, then the next one, without leaving the office." | Bubble, D-UI7, counts | Uses the auto-opened bubble; presses its one blue; sees the mark pop and the count drop; handles the next bubble; ≤ 2 clicks per item | Looks for a separate page, or doesn't notice the count changed |
| **T10** | "Noor is doing something odd. See what's on her screen, then talk to her, then come back to the office where you were." | Peek, agent panel, Back | Clicks her monitor (Look inside), then Open Noor, sends a message, presses Back or Esc and lands on the same floor and view | Loses the office, or can't find the way back |
| **T11** | "Hire a designer for InterviewKit. Give it a look you like that nobody on that floor already has, and watch it arrive." | New agent, creature picker, uniqueness | Finds the floor and the open desk or New agent; uses Atlas's suggestion or changes ≥ 1 part; reads why a colour is unavailable; sees the desk appear and the creature sit | Picks a clash without understanding why it's blocked, or takes > 2 min |
| **T12** | "Do task T9 again with your mouse unplugged (or with the List)." | Keyboard, outline, List | Reaches Jade's ticket with `N` or the List; allows/decides with Enter; hears or reads the result | Any step needs the mouse or the 3D |

---

## 8. Premium-craft outputs

### 8.1 State matrix
[office-states.md](office-states.md). Every other screen: **unchanged since premium spec v0.1** (state-matrix.md), except that "avatar" now means the creature.

### 8.2 Emotional-moment map (office flows; 2–3 chosen per flow)

| Flow | Candidates pinned | Chosen (goal) |
|---|---|---|
| First run | The empty lobby · Atlas's look · the floor built · agents walk in · Atlas greets · first receipt | **M-O1 Move-in** (belonging) · **M-F2 first receipt** (trust, unchanged) |
| Morning open | Agents glance up · Atlas greets · top bubble opens · resolve · all caught up | **M-O2 Walk in** (the boss arrives: relief, energy) · **M-H2 resolve and fold**, office version: mark pops, nod, sit (progress) · **M-O3 All caught up**: the floor relaxes, one shared nod (relief, the peak-end) |
| Hire | Atlas suggests · shuffle · preview at the desk · Create · the desk appears · first sit | **M-O4 New desk** (delight, ownership): the desk slides into the area, the creature walks from the lift, sits, blinks |
| Handoff | Card picked up · walked · tube · arrives | **M-O5 The brief travels** (trust: work visibly moves) |
| Debate | Agents gather · "!?" · decided · memo pinned | **M-T2 office version**: the memo pins to the room's glass, the room empties (relief: nothing lost) |
| Recovery | Limit · offline · stuck | **M-R2 Waking up** office version: agents look up in resume order (relief) |

Storyboards are in [flows.md](flows.md) at the step where each happens; motion values come from the design system (§8) and are the UI designer's to finish.

### 8.3 Worst-moment pass (office)
Designed in [office-states.md](office-states.md): offline mid-run, usage limit (with the forecast), an agent stuck and its retry, a denied approval in the bubble, a connector revoked (Atlas carries it), every list empty (first run, one agent, all idle), a long name (labels ellipsize on the nameplate, full name in the hover card and tree), 30 agents on a floor and 12 needs at once, 3D failing to start, the window hidden for hours, login expired. Each names the cause, what's safe, and one next step.

### 8.4 Coherence findings (this pass)

| ID | Where | Rule | Problem | Fix / status |
|---|---|---|---|---|
| CO-01 | Loans | BRD UC-01 A7 vs design doc §6a | The doc puts an "On loan to …" sign on an empty home desk; the BRD keeps the original working at home | Original stays and works; the copy sits at a guest desk with a lanyard and LOAN; home desk shows "A copy is on loan to InterviewKit". **Client decision Q-O1** |
| CO-02 | Status words | One status vocabulary | UX v0.4 says **Waiting for you**; the design system (stage 1) says **Needs you** | The office uses the design system's words (Idle, Thinking, Working, Needs you, Blocked, Paused, Error, Done). UX package README §4.1 and T7 need the same update (outside this folder: PM to apply) |
| CO-03 | Avatar customizer | One pattern per situation | UX v0.4 F11 (shapes with eyes only, upload, initials overlay) is superseded by the creature picker | creature-picker.md replaces F11; the UX README's F11, screen 6 and T7 must point here (PM). Upload: **client question Q-O5** |
| CO-04 | Home content | Nothing lost silently | The old Home's Projects cards and "Your team learned" strip had no place in the office brief | Projects → floor switcher rows (§3.5); learned strip → the greeting line's second line + plants and the lobby noticeboard (behaviour-map §6) |
| CO-05 | Opening the agent page | One pattern | "Panel over the office" from Home vs the full page from elsewhere could read as two patterns | One rule (§3.1): the container follows where you are; the page is identical |
| CO-06 | Reduced motion | Design doc §5 couples "Reduce motion / Simple view" | Reduced motion users would lose the office entirely | Split: reduced motion = **Still office** (poses, cuts, no walking); Simple view = a separate choice. **Client decision Q-O3** |
| CO-07 | "Faking work" | Truthfulness | The client's words ("doing nothing faking work") could be built as an idle agent typing | Idle never types at a lit work screen; phone, coffee, chatting, dozing only (behaviour-map H2) |
| CO-08 | Escalation | P1 "Quiet until it's you"; Clippy lesson | "Walk toward the front" for every need would turn the floor into a queue | Max 3 escalating at once; only the top-ranked Blocked need may walk forward (behaviour-map §3) |
| CO-09 | Eye grammar | moments-and-motion §3 is written for eyes-only avatars | Creatures have bodies, arms and toppers now | behaviour-map §2 restates the status language for the creature rig; the eye rules survive (eyes go to what needs you, concern not alarm) |
| CO-10 | Breadcrumb on Home | One crumb grammar (C-17) | The top bar's breadcrumb slot is now the floor switcher | On Home, the floor switcher *is* the location; panels carry their own crumb ("Bench › Noor") in the panel header |

### 8.5 Rubric (this UX deliverable)

| Axis | Level | Evidence | Blockers left |
|---|---|---|---|
| Copy | **Senior** | Second person, one status vocabulary, specifics (names, times, % of your week), lowercase agent lines keep real names and code (R4); hover cards answer "doing what, since when" | — |
| Visuals | **Not scored** | Greyscale spec; no renders. Owned by the UI look board and creature library | Blocks G5, not this hand-off |
| Color | **Senior (rules only)** | Amber only for needs-you marks (with "!" glyph and word), red-amber only for Blocked marks; hues only on creatures; one blue (in the bubble) | UI to verify on render |
| Type | **N/A** | Unchanged design-system scale; the office adds labels only (13/600 names, 12 meta) | — |
| Structure | **Senior** | Five-layer model, generated layout from the org, hierarchy test written for Home | — |
| States and recovery | **Senior → Staff target** | 13 office states + the 10-column matrix; each failure: cause, what's safe, one next step; "while you were away" without replays | Spike must confirm GPU-fallback detection |
| Motion and emotion | **Senior** | Event-driven behaviour, bounded escalation, budget, reduced-motion versions for every moment, 2–3 pinned per flow | Values belong to UI; CPU budget to the spike |
| Coherence | **Senior, with 3 client decisions open** | 10 findings, 7 fixed here; CO-01, CO-03, CO-06 wait on the client; CO-02/03 need edits outside this folder | Q-O1, Q-O3, Q-O5 |
| Intelligence | **Senior** | History becomes props with provenance (plants = lessons, trophies = sprints, Atlas's tray = deputy decisions); picks tune Atlas's suggestions | Compounding metrics unchanged (TC-3) |

**Gate 10 (render and look) is not met:** this is a written spec; the first renders are the UI look board and the spike scene. Hand-off to UI and the tech lead is fine; G4 needs those renders.

---

## 9. Decisions only the client can make

| # | Question | Why it matters | Default in this spec |
|---|---|---|---|
| **Q-O1** | **Loans:** the BRD keeps the original agent working at home during a loan; the design doc shows its home desk empty with an "On loan" sign. Which is true? | Two identical creatures on two floors at once, or an agent that stops working at home | BRD wins: original works at home; the copy is a guest with a lanyard and LOAN tag; home desk sign "A copy is on loan to InterviewKit" |
| **Q-O2** | **Top bubble on open (D-UI7):** should the top need's bubble open by itself when you arrive, or should you see only marks until you click? | One click less and a clear first action, versus a calmer first look at the office | Opens by itself ~1.2 s after the greeting, current floor only |
| **Q-O3** | **Reduced motion:** with the OS "reduce motion" setting on, show a **still office** (no walking, state changes as cuts) or switch to the **Simple view**? | The design doc couples them; splitting keeps the office for people who just dislike motion | Still office, plus a one-time offer of the Simple view |
| **Q-O4** | **Where you land when you open Bench:** the floor you last viewed, or always the Lobby (Atlas greets you there, then you take the lift)? | Speed to your project vs the "walk into the building" ritual | Last viewed floor; Atlas comes to its entrance to greet you if free |
| **Q-O5** | **Own images as avatars:** v0.4 allowed uploading a picture. Creatures live in a 3D office, where a flat photo can't sit at a desk. Drop upload? | Ownership vs a coherent office | Drop it in v0.1 (only creatures); revisit later as a framed picture on the desk |
| **Q-O6** | **The greeting:** Atlas greets you on the first open of each day and after ≥ 2 h away; other opens get only glances. Right frequency? | Delight vs repetition | As written |

**Constraints to confirm with the tech lead (decisions for the client if they conflict):**
- **TC-O1:** the outline tree must stay in sync with the scene (focus ring, camera follow). If 3D picking and DOM focus can't share one source of truth, the List becomes the only keyboard path, which is weaker.
- **TC-O2:** time to first interactive Home ≤ 1.5 s relies on showing a cached still first; the still must be captured without a visible hitch.
- **TC-O3:** detecting "no usable GPU" (WebGL context failure, software renderer, repeated context loss) must be reliable, or the Simple view triggers late.
- **TC-O4:** the work type on a monitor (code, doc, browser, terminal) comes from tool names in the trace; tools the map doesn't know show a neutral "working" screen.
- **TC-O5:** escalation timers run only while the office is visible; the renderer must know visibility (it already must, to sleep).

## 10. Sources
Client: design doc §1–2 (verbatim quotes), references `office-iso-realistic-client.webp`, `office-iso-flat-client.webp`, `office-iso-villains-client.webp`, `creature-sheet-client-2026-10-22.webp`. Product: BRD v0.5 (UC-01 A7, UC-47, UC-25, UC-29, BR-36, BR-60), CLAUDE.md (trace events). Design: UX package v0.4, premium spec v0.1 (all five files), DIRECTION v0.2, DESIGN-SYSTEM stage 1 (§3.4 hues, §8 motion, §11 components, §12 one pattern per situation). Research: minimal-characters teardown. Skills: `premium-craft` (gates 1–11, rubric, references) and `ui-ux-guide` (screen card, Fitts, Hick/Miller, Jakob, peak-end, peak-load, avatars with words, review checklist). Heuristics: Nielsen #1 visibility of status, #3 user control (Back, Esc, camera never moves by itself), #4 consistency (one Ticket), #6 recognition over recall (marks, the List), #7 flexibility (shortcuts), #8 minimalist design (sparse ambient life); Krug (the floor switcher shows where you are). **Findings vs insights:** findings are cited in §1; everything else is design insight and rules.
