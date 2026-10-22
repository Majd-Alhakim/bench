# Behaviour map: real events → the office

Part of the [office UX](README.md). This is the contract between the agent runtime and the office: **every behaviour you can see comes from a real event**, except idle life, which is true because the agent is idle. Event names are illustrative; the tech lead maps them to the trace event schema (CLAUDE.md: every feature emits a trace event). Motion values are the UI designer's; this file fixes *what*, *where*, *how long* and *how it ends*.

---

## 1. Honesty rules (non-negotiable)

| # | Rule | Why |
|---|---|---|
| **H1** | **No event, no behaviour.** Working, thinking, planning, debating, handoff, needs you, done, stuck and paused appear only from trace events. The hover card names the event behind what you see ("Working · running `pnpm test chat` · since 09:12"). | Glass box (design doc §5) |
| **H2** | **Idle may socialise, never pretend.** Idle agents may drink coffee, chat with other idle agents, scroll a phone, doodle, doze. They **never** type at a lit work screen, never gather in a meeting room, never show "!?" bubbles, never lean in to argue. Their monitor shows a screensaver. | The client's "faking work" is idle *behaviour*, not fake *work* (CO-07) |
| **H3** | **The word changes first.** The status word in the hover card, outline and List changes at the event time. Walking to the new place is a transition that follows (max 2.5 s; walks are sped up, never slowed). | Truth isn't delayed by animation |
| **H4** | **Debounce places, not words.** A state shorter than 3 s doesn't move the agent (it changes pose in place); after moving, an agent stays at least 8 s unless a higher-priority state arrives (needs you, stuck, done). | No ping-pong between desk and whiteboard |
| **H5** | **Modifiers never change state.** Glances (at you on arrival, at a teammate who mentions it, at the bubble's button), blinks and nods last ≤ 1 s and overlay any state. | Personality without lies |
| **H6** | **No event, no prop.** Every prop has a source, a date and a tooltip, and leaves when its source does (§6). | Clutter = history, not decoration |
| **H7** | **Atlas greets only when free.** Atlas walks to the entrance only if Atlas is idle; if Atlas is working, the greeting is a wave from its desk (visible only in the lobby) and the greeting line. | Atlas's state stays true |
| **H8** | **Stale is said.** If the office can't show the current truth (offline from Bench's own data, a floor unreadable, a cached still), it says "as of 09:14" where it shows it. | Never a confident lie |
| **H9** | **The camera is yours** (README O3). Events never move it. | Control |

---

## 2. The rig and the status language

Every creature takes the same parameter vector (teardown §4.2): `squash`, `lean`, `bob`, `tempo`, `gazeX/Y`, `lid`, `blink` (trigger), `pulse` (synced to tokens), `tremor`, `armTargets` (keyboard, mug, marker, phone, card), `topperSpring`, `location` (desk, whiteboard, room seat, lounge spot, entrance, guest desk). States are presets; transitions interpolate. **Temperament:** a fixed offset of `tempo` (±15 %), `bob` and gaze restlessness, derived from the agent id, so two coral mugs still move differently.

**Status word → body language** (the eye rules from moments-and-motion §3 survive: eyes go to what needs you; concern, never alarm):

| Status word (design system) | Pose and place | Eyes | Topper | Monitor |
|---|---|---|---|---|
| **Idle** | Lounge or desk, relaxed; progressive (§4) | Soft, lids lowered | Rests, sways slowly | Screensaver |
| **Thinking** | Leans back at the desk, one arm to chin | Up and aside, drifting | Tilts | Dim, the work still on screen |
| **Working** | At the desk, typing; rhythm follows the token rate | Down at the screen, scanning | Steady rhythm (antenna blinks, steam rises) | Lit with the work type (code, doc, browser, terminal) |
| **Needs you** | Standing at its desk (or wherever the need began), mark above | Toward you (the camera), then the bubble's button when open | Points up / forward | Shows the request ("waiting for your OK") |
| **Blocked** | Standing, mark turns red-amber; or at the desk, head low if it's stuck on something else | Down and aside | Droops | The blocker ("E2E failed twice") |
| **Paused** (by you) | **Not at the desk.** Lamp off, chair tucked, a note on the keyboard "Paused by you" | — | — | Off |
| **Paused** (offline, limit, login) | At the desk, sitting back, still | Half-closed, calm | Folded | The reason and the resume time |
| **Error** | At the desk, papers spilled, head in hands for 1 s, then still | Wide 200 ms, then softened, looking down | Knocked askew | "Stopped: out of memory" |
| **Done** | Short celebration (stretch, or a high-five with a teammate who is also free), then Idle | Pleased (1.6 s) | One flourish | A check, then screensaver |

---

## 3. "Needs you": marks and urgency escalation

### 3.1 Mark types (one glyph per kind, always with a word on hover and in the tree)

| Kind (ticket tag grammar) | Mark | Example hover |
|---|---|---|
| Decision or approval (Work request) | Amber **"!"** | "Needs you · asks to run `pnpm test` in bench" |
| Question | Amber **"?"** | "Needs you · asks which date library to keep" |
| Meeting request (interview, review, "we have something to show you") | Amber **two-seat** glyph | "Needs you · wants to meet: review of Sprint 2" |
| Proposal | Amber **page** glyph | "Needs you · a one-page proposal for InterviewKit" |
| Payment | Amber **receipt** glyph inside a **lock ring** | "Needs you · Payment · a paid Windows runner, $12/month" |
| Gate: Outward or Reserved (any kind) | The kind's glyph inside a **lock ring** | "Needs you · Outward · send the reply to Dana" |
| State: Blocked | The mark turns **red-amber** with a bar under the glyph | "Blocked · QA-3: E2E failed twice · needs you" |
| Has a request but keeps working (C-35) | A **small flag on the desk**, no mark over the head; the agent keeps working | "Working · 1 waiting for you: allow `pnpm test`" |
| Snoozed (you pressed Later) | A **resting mark**: small, still, no escalation | "Needs you · later (you snoozed it at 09:20)" |

For your info items get **no mark**.

### 3.2 Escalation (only while the office is visible; the clock pauses when hidden or when you're inside a panel that isn't this floor)

| Step | Behaviour | Starts | Repeats |
|---|---|---|---|
| 0 Mark | Stands up, mark appears with a small hop (4 px); glances at you | Immediately on `approval.requested` / `question.asked` / `meeting.requested` | — |
| 1 Wave | One wave toward you | After 2 min visible without you opening it; **immediately** for Blocked | Every 20 s, a single wave (never a loop) |
| 2 Hop | Two small hops beside the desk | After 5 min visible (Blocked: 2 min) | Every 30 s |
| 3 Come forward | Walks to the front edge of the floor (nearest the camera), stands there | After 10 min visible, **top-ranked Blocked need only** | Stays until resolved or snoozed |

**Caps (O5):** at most **3** agents above step 0 at once, chosen by rank (D2). Only **1** may come forward. Everyone else holds step 0 (the mark only). **Never sound** by default. Notifications follow the grammar: a needs-you item gets a toast and **one** repeat (at step 2), and an OS notification only when the window is hidden (UX Q8 defaults).

### 3.3 How a need ends

| Outcome | Office | Duration |
|---|---|---|
| Allowed / decided | The bubble folds into the mark → the mark pops (scale up 10 %, fade) → a nod → sits and goes to work (Working) or back to Idle | ~800 ms |
| Denied (P07) | The mark folds away (no pop) → the agent sits → it carries on with plan B (its line in chat) | ~600 ms |
| Later | The mark shrinks to a resting mark; escalation resets | 300 ms |
| Resolved elsewhere (List, inbox, workspace, Atlas as deputy) | Same as allowed; if Atlas decided it, a paper flies to Atlas's tray (lobby) | ~800 ms |
| Withdrawn by the agent (it found another way) | The mark fades; the agent sits; hover: "No longer needs you: Noor used the chat tests instead" | 400 ms |
| Came forward | Walks back to its desk after resolution (the word is already updated, H3) | ≤ 2.5 s |

---

## 4. Ambient life (idle only) and the budget

- **Progressive idle** (Clippy's mechanics, not its manners): 0–2 min after Done or Idle: settles at the desk (stretch, look around). 2–20 min: may go to the lounge (coffee, chat with another idle agent, phone). 20 min+: dozes (in the lounge sofa or at the desk), a slow `zzz` puff from the topper.
- **Social idle:** two idle agents may stand together and chat: relaxed lean, alternating small nods, **no** "!?" bubbles, **no** tremor (H2).
- **Budget (performance mode "idle", design doc §6a):** across a floor, one or two small ambient actions every few seconds; at most **4** creatures in motion at once outside real events; walks to the lounge staggered (never two leaving in the same second). Blinks are event-triggered or every 5–9 s at random per creature, never in sync.
- **When a task arrives** for an agent in the lounge: the word changes at once (H3); the agent puts the mug down and walks back (≤ 2.5 s), then types.

---

## 5. Event → behaviour (the full map)

`loc` = where the creature is. "Ends" = what returns it to another state.

### 5.1 Runs and tools

| Event (trace) | State word | Location | Animation intent | Mark | How long | Ends |
|---|---|---|---|---|---|---|
| `run.started` (from a message, task, routine, handoff) | Working (or Thinking until the first tool/token) | Desk (walks back if elsewhere) | Sits, pulls chair in, glances at the screen | — | Until the run ends | `run.completed` / `run.failed` / `approval.requested` |
| `stream.tokens` | Working | Desk | Typing rhythm = token rate (`pulse`); topper rhythm matches | — | While streaming | Stream stops |
| `thinking` (extended thinking, no tool yet) | Thinking | Desk | Leans back, arm to chin, gaze up | — | While thinking (≥ 3 s to change pose, H4) | First tool call or tokens |
| `tool.call` · Edit / Write | Working | Desk | Monitor shows **code** or a **doc** by file type; a blink on each new call | — | Per call | Next call |
| `tool.call` · Bash | Working | Desk | Monitor shows a **terminal**; the live line on hover ("running `pnpm test chat` · 8 of 12") | — | Until the command ends | Result |
| `tool.call` · browser / WebFetch | Working | Desk | Monitor shows a **browser** | — | Per call | Next call |
| `tool.call` · Read / Grep / Glob | Working | Desk | Monitor shows a **doc**; eyes scan faster | — | Per call | Next call |
| `tool.call` · connector (Gmail, GitHub) | Working | Desk | Monitor shows the connector's generic screen (mail list, PR list); no brand logos | — | Per call | Next call |
| `plan.updated` (TodoWrite, board edit, sprint planning) | Thinking · planning | **Whiteboard corner** (if ≥ 3 s, H4) | Writes with a marker (arm IK to the board); the board's counts update | — | While planning | Next non-planning call |
| `ask_agent.sent` (a quick question to a teammate, same floor) | Working · asking Karim | Walks to Karim's desk, leans over the partition | Karim glances up (modifier) | — | Until `ask_agent.answered` | Walks back |
| `ask_agent.sent` (other floor) | Working · asking Rana | Desk | Picks up the desk phone | — | Until answered | Hangs up |
| `memory.written` · note / work log | (unchanged) | Desk | Writes in a small notebook (1 s) | — | 1 s | — |
| `memory.written` · **lesson** | (unchanged) | Desk | Notebook + the desk plant grows a leaf (§6) | — | 1.2 s | — |
| `checkpoint.started` | Working · saving its place | Desk | Closes eyes a beat, stacks papers neatly | — | Until done | `checkpoint.done` (eyes open) / `checkpoint.failed` (→ Blocked if it needs a lead) |
| `run.slow` (10 s+ before first token, P08) | Thinking | Desk | Taps fingers; nothing alarming | — | Until tokens | Tokens |
| `run.completed` (success) | Done → Idle | Desk | **Done** celebration (stretch; high-five a teammate only if that teammate is Idle or Done right now) | — | 1.6 s, then Idle | Progressive idle (§4) |
| `checks.all_green` (all checks pass) | Done | Desk | The monitor's checklist turns green, then the celebration | — | 1.6 s | Idle |
| `run.failed` | Error | Desk | Papers spill, head in hands 1 s, then still; concern, not alarm (M-R1) | None unless it needs you | Until retry or escalation | `run.retrying` / `escalation.raised` |
| `run.retrying` (automatic, changed approach) | Working · retrying | Desk | Picks the papers up, sits up, types | — | Run length | completed / failed |
| `escalation.raised` (to the lead, UC-17) | Error (agent) · Working (lead) | The **lead walks to the stuck agent's desk** and stands beside it (a real run of the lead) | Lead looks at the monitor | — | While the lead's run is about it | Lead's run ends |
| `escalation.to_client` | Blocked | Stands | Mark: red-amber (§3) | Blocked | Until you decide | §3.3 |
| `stop.requested` (you pressed Stop) | Working · stopping | Desk | Hands lift off the keyboard; waits for the step | — | Until the step ends | `run.stopped` → **Stopped**: hands in lap, still, monitor "Stopped by you" |

### 5.2 Needs you

| Event | State | Location | Animation | Mark | How long | Ends |
|---|---|---|---|---|---|---|
| `approval.requested` (gate) and the agent **can't continue** | Needs you | Stands at its desk | §3.2 escalation | By kind (§3.1) | Until resolved | §3.3 |
| `approval.requested` and the agent **continues other work** | Working | Desk | Keeps working | Desk flag | Until resolved | Flag folds |
| `question.asked` | Needs you | Stands | as above | "?" | as above | as above |
| `meeting.requested` (interview, review) | Needs you | Walks to a **meeting room**, sits, leaves an empty chair with a "You" card | Glances at the door | Two-seat glyph above the room *and* the agent | Until you join or snooze | Session starts (you enter: the room's door opens) |
| `proposal.ready` | Needs you | Atlas (lobby) or the PM | Holds up a page | Page glyph | Until decided | §3.3 |
| `payment.needed` | Needs you | Stands | as above | Receipt + lock ring | Until marked done | §3.3 |
| `auth.expired` / `connector.revoked` (system needs) | Atlas: Needs you · Blocked; affected agents: Paused | Atlas stands at its desk (lobby); affected agents at desks, monitors show a broken-plug glyph | Atlas's mark red-amber | Blocked mark on **Atlas** | Until fixed | `auth.restored` / `connector.restored`: Atlas's mark pops; agents wake in resume order (M-R2) |

### 5.3 Teams, sessions, handoffs

| Event | State | Location | Animation | Mark | How long | Ends |
|---|---|---|---|---|---|---|
| `session.started` · debate | Working · in a debate | Participants walk to a **meeting room**; the decider sits at the head | The glass shows topic, decider, timer | — | Up to 5:00 (timer on the glass) | `session.decided` |
| `session.message` (a debater speaks) | Working · in a debate | Room | The speaker gestures (arms), a **"!?"** bubble above it for the message's duration; listeners turn to it | — | Per message | Next message |
| `session.paused` (offline, limit) | Paused | Room | Everyone sits back; the timer on the glass shows "Paused at 3:12 left" | — | Until resume | `session.resumed` |
| `session.decided` | Done | Room | The decider pins a **memo card** to the glass (M-T2 office), everyone stands, walks out | — | 1.6 s | Agents go back to their next state; the memo stays on the glass (§6) |
| `session.started` · interview / review **with you** | Working · meeting you | Room, with your empty chair | When you open the session, your chair turns to face them | — | While the session runs | `session.closed` |
| `team_chat.message` (an agent posts) | Working | Desk | A small speech-bubble glyph above it (1.5 s) | — | 1.5 s | — |
| `router.picked` (Bench picked Karim) | (Karim) Thinking | Desk | Karim glances at the person who asked | — | modifier | — |
| `handoff.sent` (same floor) | Sender: Working · handing off | Sender walks a **small glowing card** to the receiver's desk (M-O5) | Receiver catches it (a small bounce), status → Working | — | ≤ 2.5 s walk | Sender walks back |
| `handoff.sent` (other floor) | as above | Sender walks the card to the **lift / tube** at the entrance and drops it in; on the receiving floor it pops out and a runner-free glide takes it to the receiver | Toast on both floors; the floor switcher row pulses once | — | ≤ 3 s on screen | Receiver works |
| `task.assigned` by you (from the board) | Working | Desk | A sticky note lands on the monitor edge (§6) | — | — | Task closed |

### 5.4 Agents and org

| Event | Office | How long | Ends |
|---|---|---|---|
| `agent.created` | **New desk** slides into the team area (the area widens by one desk), the creature walks out of the lift, sits, blinks once (M-O4) | ~2 s | Idle |
| `agent.paused` (by you) | The creature stands, pushes the chair in, switches the lamp off, walks to the lift; a note "Paused by you" stays on the keyboard | ~2 s | `agent.resumed`: walks back, lamp on |
| `agent.archived` | A box appears on the desk; the creature waves once and leaves by the lift; the desk is removed from the layout the next time Home opens (not live) | ~2 s | — |
| `agent.deleted` | As archived, without the box; immediate on the next open | — | — |
| `agent.moved` (another team) | Walks with its desk items (a box) to the new area, where a new desk appears; the old desk closes | ~2.5 s | — |
| `agent.look_changed` | The creature does a small spin (300 ms) into the new look | 300 ms | — |
| `lead.changed` | The two agents swap desks (lead desk first in the area) | ~2.5 s | — |
| `loan.requested` | The borrowing lead's monitor shows a request; nothing else until approved | — | approved / declined |
| `loan.started` (copy active) | A **guest desk** appears at the edge of the borrowing area; the **copy** walks out of the lift wearing a guest lanyard; label tag LOAN · "On loan from Bench · Dev team". The original stays at its home desk (BRD); a small sign "A copy is on loan to InterviewKit" appears on its desk (Q-O1) | ~2 s | `loan.ended` |
| `loan.ended` (merge-back) | The copy packs a small box ("3 notes going home"), walks to the lift; the box arrives at the original's desk, the original's plant grows if lessons came back; the guest desk closes; the sign goes | ~3 s | — |
| `freelancer.hired` | A **hot desk** pops in at the edge of the hiring agent's area; the freelancer arrives by lift | ~2 s | `freelancer.ended`: leaves by lift, the hot desk folds |
| `team.created` / `project.created` | A new area is laid out on the floor (rug unrolls, desks appear in order) / a new floor appears in the switcher; with "Product + Dev", the move-in sequence (M-O1) plays when you first visit it | ≤ 4 s | — |

### 5.5 System and app

| Event | Office | Ends |
|---|---|---|
| `app.opened` (first today, or after ≥ 2 h) | **Walk in (M-O2):** agents on the floor glance up (staggered 60 ms, only non-busy ones also wave); Atlas comes out of the lift to greet you if idle (H7), says the greeting line, walks back | ≤ 2 s; any input skips it |
| `app.opened` (otherwise) | Glances only | 600 ms |
| `window.hidden` / minimized | Rendering stops; escalation clocks pause | `window.shown` (§office-states "window hidden") |
| `network.offline` | Agents finish the step they're on, then sit back (Paused · offline); monitors "waiting for the connection" | `network.online` → M-R2 wake in resume order |
| `usage.guard_on` | Nothing changes in the scene (it's your rule, not an event in anyone's work); deferred routines show a small clock on the owner's monitor | `usage.guard_off` |
| `usage.limit_reached` | Running agents finish the safe point, sit back (Paused · week used up); monitors show "resumes Mon 09:00"; debate timers pause on the glass | `usage.reset` → M-R2 in resume order |
| `routine.started` / `routine.finished` | As a run, plus a small clock glyph on the monitor while it runs | Finished: Done or Error |
| `sprint.accepted` | A **trophy** is placed on the area's shelf by the lead; the whole floor's free agents look at it (one shared nod) | 1.6 s |
| `gpu.unavailable` / `context.lost` | Switch to the Simple view (office-states) | — |

---

## 6. Clutter from history (props)

Each prop is **made by an event**, lives in a fixed place, has a tooltip that names its source, opens that source on click, and leaves when its source does (H6). Caps keep desks readable at 30 agents.

| Prop | Created by | Where | Tooltip (exact) | Click opens | Cap / decay |
|---|---|---|---|---|---|
| **Sticky notes** | A task assigned to the agent and still open | Monitor edge | "3 open tasks: S1-4, S1-7, QA-3" | The project board filtered to the agent | 5 notes max, then "+n" on the last; each note leaves when its task closes |
| **Plant** | Lessons in the agent's private memory | Desk corner | "Noor has learned 12 lessons · latest 22 Oct: run the full suite in two halves" | Noor › Settings › Memory, lessons | Grows in steps at 1, 5, 15, 40 lessons; never shrinks unless you delete lessons |
| **Notebook** | Any memory note written in the last 24 h | Desk, open | "Wrote 4 notes today" | Memory, filtered to the agent and today | Closes after 24 h |
| **Cake** | The agent's anniversary ("together since" date: 1 month, then each 3 months, then yearly) | Desk | "1 month together today · 312 runs · 46 notes · 12 lessons" | Agent page, the Ledger | That day only |
| **Trophy** | A sprint accepted (all stories reviewed) | The area's shelf | "Sprint 2 accepted · 10 of 10 · Sat 24 Oct" | The sprint summary | Last 5 shown; "+n" plaque |
| **Memo on the glass** | A debate decided | The meeting room's glass wall | "Decided 09:16: Stop lives in the composer · Maya" | The memo in Memory | Last 3 per room |
| **Paper stack** | Items in review waiting for you (a review session pending) | PM's desk | "4 stories ready for your review" | Sessions › waiting for you | Leaves when reviewed |
| **Atlas's tray** | Decisions Atlas made for you today (deputy) | Atlas's desk, lobby | "Decided by Atlas today: 4" | What needs you › Decided by Atlas | Resets at midnight |
| **Lobby noticeboard** | Lessons and preferences learned this week (the old "Your team learned" strip) | Lobby, by the lift | "Your team learned 7 things this week" | The learned list (with Undo / Forget) | Weekly |
| **Desk flag** | A pending request while the agent keeps working (§3.1) | Desk | "1 waiting for you: allow `pnpm test`" | The ticket bubble | Leaves when resolved |
| **Box** | Archive, move, loan end | Desk | "Noor is moving to Design" / "3 notes going home to Noor" | — | During the move |
| **"A copy is on loan" sign** | `loan.started` | Original's desk | "A copy of Noor is on loan to InterviewKit · Dev team until S2-3 is done" | The borrowing floor (lift) | Leaves at `loan.ended` |
| **Guest lanyard** | Loan copy | On the copy | "On loan from Bench · Dev team" | The original's floor | With the copy |
| **Clock on monitor** | A routine running or waiting for room (guard) | Monitor | "Morning test sweep · waiting for room in your week (guard on: keeping 30 % free)" | The routine | While it waits / runs |
| **Broken-plug glyph** | A connector revoked for this agent | Monitor | "GitHub stopped answering Noor: access was revoked or expired" | Atlas's ticket "Reconnect GitHub" | Until restored |

**Never:** props for things that didn't happen, props as rewards for approvals (ui-ux-guide: no variable rewards on decisions), brand logos, or clutter that hides a mark (marks always render above props).

---

## 7. Reduced motion (the same information, no movement)

| Moving thing | Still version |
|---|---|
| Walks (to the lounge, room, whiteboard, lift) | The creature **cuts** to the new place with a 200 ms crossfade |
| Typing rhythm, topper rhythm, bob | Still pose; the monitor shows the work type; the hover card says the rest |
| Marks and escalation | The mark appears; escalation shows as a **step label** on the mark ("waiting 10 min"), no waves, hops or walking |
| Handoff card | The card appears on the receiver's desk; toast as usual |
| Debate gestures and "!?" | Still seated in the room; "!?" shows as a static glyph on the speaker |
| Move-in, new desk, walk in | The final layout appears; the live region says "Your Bench floor is ready: 7 desks" |
| Done celebration | A static check on the monitor for 1.6 s |
| Camera moves you ask for | Instant |
| Ambient idle | Off; idle agents hold a relaxed pose in the lounge |

## 8. Performance contract (for the spike)
The behaviours above must fit the design doc's budgets: idle mode ≤ 5 % CPU (sparse ambient life, on-demand rendering, ~10 fps between changes); active runs ≤ 15 % CPU at 30 fps (60 only while you pan or zoom); hidden = 0. If the spike shows a behaviour can't fit, the fallback order is: drop ambient idle first, then walks (cut instead), then typing rhythm (still pose); **never** drop marks, status words or the hover card. Any fallback that changes what the client sees goes back to the client.
