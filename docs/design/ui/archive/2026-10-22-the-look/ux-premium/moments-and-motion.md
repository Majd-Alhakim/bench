# Moments and motion: the movie, not the frames

Part of the [premium experience spec](README.md). Premium-craft gates 3 and 5: pin the emotional moments in UX (the UI designer animates them), and keep spatial continuity so you build a mental map. Decided constraints respected: "calm and alive" motion (DIRECTION rule 7), avatars are shapes with eyes only, nothing flashes, and everything has a `prefers-reduced-motion` version.

## 1. The spatial model: a studio with a fixed floor plan

Every place in Bench lives somewhere fixed. Things **enter from where they live and leave the way they came**, so the client never loses the map (Apple principle: spatial continuity; the source video's left/right navigation study shows that moving things costs more time than people notice).

```
┌──────────────────────── TOP · time and budget ────────────────────────┐
│ breadcrumb (where am I)        week ring · Needs you (what's mine)    │
├───────────┬──────────────────────────────────┬────────────────────────┤
│ LEFT      │ CENTRE · the room                │ RIGHT · the glass      │
│ who and   │ Home: tickets + projects         │ the agent's workspace: │
│ where     │ Agent: the 1:1 conversation      │ screen · routines ·    │
│ (cast,    │ Team: the group conversation     │ settings; diff, doc,   │
│ projects) │ Project: the dashboard           │ browser, approval card │
│           │                                  │                        │
│           ├──────────── BOTTOM · your voice ─┤                        │
│           │ the composer                     │                        │
└───────────┴──────────────────────────────────┴────────────────────────┘
Overlays: dialogs rise from the centre as sheets · the take-over grows out of the workspace card
· toasts rise from the bottom centre · banners drop from under the top bar.
```

| Place | Lives | Enters | Leaves | Persistent element (morphs, never re-drawn) |
|---|---|---|---|---|
| Sidebar | Left edge | Expands rightward from the avatar rail | Collapses back into the rail | Every agent's avatar (the rail keeps it) |
| Agent room | Centre | Crossfade of the wash (240 ms) + the header avatar flies from the sidebar row to the header (shared element) | Reverse: the header avatar returns to its row | The avatar; the composer stays put and only its placeholder changes ("Message Noor" → "Message Karim") |
| Workspace pane | Right edge | Slides in from the right (`spring.smooth`) | Slides out to the right | Its segmented control (Screen · Routines · Settings) |
| Settings in the pane | Inside the pane | The pane widens leftward (the conversation yields space) | The pane narrows back | The pane header |
| Take-over | Out of the workspace card in the chat | The card's rectangle grows to full screen (clip-path, `spring.smooth`, 360 ms) | Shrinks back into the same card | The file tab and the diff |
| Ticket | In its list | Expands in place; siblings shrink (U6) | Collapses in place | The avatar (32 → 40 px) and the title |
| Dialog (New agent, New project) | Centre | Rises 16 px with a fade, scrim fades in | Falls 8 px with a fade | — |
| Split pane | Right half of the centre | Slides in from the right; the left pane yields with a spring | Slides out right | The project header |
| Banner | Under the top bar | Drops 8 px with a fade | Folds up into the P10 digest card | — |
| Toast | Bottom centre | Rises 8 px with a fade | Fades | — |

**Navigation rules**
- **Home → an agent:** the ticket's avatar (or the sidebar row's avatar) becomes the agent's header avatar. Clicking a ticket's "Open Noor" morphs the ticket into the ApprovalCard in Noor's workspace, which is the same object in a new place (P3, "one object, one shape").
- **Agent → agent ("changing rooms"):** the wash crossfades between the two hues; the hero swaps with a vertical drop (old one down and out 8 px, new one down and in), and the header's name crossfades. Total ≤ 300 ms.
- **Home → a project:** the project card's header grows into the dashboard header (shared element: the name and avatar stack).
- **Back:** always reverses the path you took.

## 2. Physics

Springs for anything you open, move or drag; short eases only for colour and opacity. Lists **rubber-band** at their edges (a 24 px max overscroll, then they settle). Pressed controls scale to .98. Counters tick with tabular figures so the digits don't jitter.

## 3. The cast's eye grammar (the status language)

Eyes carry the expression (decided); the badge and the word carry the meaning (C-D, WCAG 1.4.1). The table is the UI designer's animation spec for the avatar component. Sizes: full behaviour at ≥ 32 px; at 16–28 px only blinks and the badge; the hero (96 px) adds the breathing body.

| Status (word) | Eyes | Idle motion | On entering this state | Badge (existing glyph) |
|---|---|---|---|---|
| **Idle** | Calm, slightly lowered lids | A slow blink every 4–7 s (randomised per agent so the cast never blinks in sync); the hero breathes (scale 1 → 1.015, 4 s, `spring.gentle`) | A soft settle (−2 px, back) | Hollow dot |
| **Thinking** | Look up and to the left, then wander | The eyes drift between two points every 1.2 s | Eyes rise | Three dots fading in turn (in the hue, with the word) |
| **Working** | Focused (narrower), looking down-right at "the work" | The eyes track left→right slowly, like reading a line, every 2.4 s | A small nod (2 px down, back) | Turning arc |
| **Waiting for you** | Open, looking **toward you** (front, slightly up) | One gentle bob every 6 s. The only "come here" cue, and it's slow | A single small hop (4 px) | "!" filled (amber) |
| **Blocked** | Look down and to the side | Still | Eyes drop | Bar, filled |
| **Paused** | Closed (sleepy) | The breathing slows by half | Lids close over 300 ms | Two bars; the avatar at 60 % opacity |
| **Stopped** | Neutral, still | None | A short settle | Square |
| **Error** | Briefly wide, then **softened and looking down** (concern, not alarm) | Still; no shake, no blink loop | Wide for 200 ms, then soften | "×" filled (red) |

**The glance (identity detail):** when an agent is Waiting for you and its open ticket's primary button is on screen, its eyes look toward that button. It's decorative; the word and the badge carry the meaning, and the glance is off under reduced motion.

**Budget (C-F):** only Thinking, Working and Waiting animate continuously. On screens with many avatars, only the 12 nearest the viewport centre animate; the rest hold their pose. Use transforms and opacity only.

## 4. The emotional-moment map

For each core flow, the candidate moments are pinned and **2–3 are chosen**, each tied to a goal: **trust**, **progress**, **delight** or **relief**. Unchosen candidates get only the standard micro-feedback (press, check, counter tick).

| Flow | Candidates pinned | Chosen (goal) |
|---|---|---|
| F1 First run | Claude Code found · the folder created · Atlas named · the team assembled · Atlas's first reply | **M-F1** Atlas forms and blinks (delight, ownership) · **M-F2** the first receipt (trust) |
| F2 Daily triage (Home) | The morning greeting · the top ticket opens · resolving · the count falls · all caught up | **M-H1** the morning open (relief) · **M-H2** resolve and fold (progress) · **M-H3** all caught up (relief, the peak-end) |
| F3 Agent at work | Changing rooms · thinking · the live line · take-over · all green · a lesson applied | **M-A1** take-over and give back (trust, control) · **M-A2** all green (progress) · **M-A3** a lesson applied, the first time (delight, trust in the learning) |
| F4 New agent | The first greeting · the draft forming · the name chosen · Create | **M-N1** birth (delight, ownership) · **M-N2** "already knows 18 things" (trust) |
| F5 Team chat and debate | Routing · a handoff · a reaction · the debate timer · the memo | **M-T1** the handoff chip (trust, the glass box) · **M-T2** the debate condenses into a memo (relief: nothing lost) |
| F6 Project lifecycle | Create · the team assembles · the first plan · review · the sprint ends | **M-P1** the team assembles (delight, belonging) · **M-P2** the sprint-end gathering (progress, the peak-end) |
| F7 Recovery (cross-cutting) | The failure · the retry · back to normal | **M-R1** concern, not alarm (trust) · **M-R2** waking up (relief) |

## 5. Storyboards

Timings are offsets from the trigger. "Reduced motion" is the full alternative: the same information arrives with crossfades or instantly. Every moment also announces itself in words through an `aria-live` region, so no information is motion-only.

### M-F1 · Atlas forms and blinks (first run)
- **Goal:** delight and ownership. "This is *my* main agent."
- **Trigger:** you press Continue on "Name your main agent".
- **Frames:**
  1. 0 ms: the neutral grey sphere (the draft) sits at 96 px, eyes closed.
  2. 0–420 ms: the hue fills from the bottom up like ink in water (lavender for Atlas); the soft highlight slides into place (`spring.gentle`).
  3. 420–600 ms: the eyes open (lids up, 180 ms).
  4. 900 ms: **one blink** (120 ms); the eyes then glance at you.
  5. 1100 ms: the name tag drops onto the avatar (`spring.snappy`, 4 px overshoot): **Atlas**.
- **Physics:** gentle spring on the fill and the highlight, snappy on the tag. No sound.
- **Reduced motion:** the coloured avatar with open eyes and the name tag appear at once; the live region says "Atlas is ready".
- **Don't:** confetti, particles, a voice line.

### M-F2 · The first receipt (the first useful result)
- **Goal:** trust. The glass box, proved on the very first answer.
- **Trigger:** Atlas's first reply finishes streaming.
- **Frames:** 0 ms: the reply's last line settles. 120 ms: the receipt types in left to right (`09:41 · 1.2k tokens · 0.04 % of your week · Trace`, 240 ms). 400 ms: the top-bar ring ticks from 41.00 % to 41.04 % (counter tick). 600 ms: a one-time hint bubble points at the receipt: "Every message shows what it cost. Click it to see each step." *Got it*.
- **Reduced motion:** the receipt and ring update instantly; the hint appears.
- **Shown once in Bench's life.** The hint never returns.

### M-H1 · The morning open (Home)
- **Goal:** relief. "It's handled; here's the one thing."
- **Trigger:** Home opens for the first time today.
- **Frames:** 0 ms: the greeting is already there (no entrance animation; Home must feel instant, BR-36). 0–320 ms: the tickets settle up 8 px in a 30 ms stagger. 320–640 ms: **the top ticket opens itself** (D-UI7): it grows in place and the others shrink to their rest size (`spring.smooth`). 700 ms: the waiting agent's eyes glance at the blue button (§3).
- **Reduced motion:** the screen renders with the top ticket already open.

### M-H2 · Resolve and fold
- **Goal:** progress. You can feel the queue shrinking.
- **Trigger:** you press the open ticket's primary (or Deny).
- **Frames:**
  1. 0 ms: the button presses (.98) and shows a small spinner if the action takes > 300 ms.
  2. On success: the button's label morphs into a check (160 ms).
  3. 200–440 ms: the ticket folds: its height springs to 0, its content fades, and the siblings close the gap (`spring.smooth`). The rubber-band settle on the list is ≤ 4 px.
  4. 440 ms: **every count ticks down together**: the section heading, the top bar, the sidebar group and the project card (`spring.snappy` on each digit). One fact, many places.
  5. 600 ms: the next ticket opens itself (M-H1 step 3).
  6. The toast rises with Undo.
- **Deny version:** no check; the ticket slides out left (it's leaving, not completing).
- **Reduced motion:** the ticket disappears, the counts change, and the next ticket is open; the toast appears.

### M-H3 · All caught up (the peak-end)
- **Goal:** relief, and a clean ending to the visit.
- **Trigger:** the last ticket resolves.
- **Frames:** 0–440 ms: M-H2 for the last ticket. 500 ms: in the empty space, the project cards' avatar stacks do **one synchronized blink** (the team "nods"). 600 ms: **You're all caught up.** fades in with its line ("The team is working on 7 things"). The top bar's "Needs you" crossfades to **All caught up**.
- **Reduced motion:** the empty state appears; no blink.
- **Don't:** celebrate harder than this. Clearing the queue is the client's routine, not an achievement (ui-ux-guide: no variable rewards on approvals).

### M-A1 · Take over and give back
- **Goal:** trust and control. You're in charge of the agent's hands.
- **Trigger:** *Take over* on the workspace card.
- **Frames:** 0 ms: Noor's status crossfades to **Paused** and her eyes close (she's stepping back). 80–440 ms: the workspace card's rectangle grows to full screen (clip-path, `spring.smooth`); the diff stays exactly where it was relative to the card, so your eye doesn't lose the line. 440 ms: the "You" cursor label appears. **Giving back** (*Done editing, continue*): the screen shrinks back into the card (360 ms), Noor's eyes open, a system line slides in: "You edited Composer.tsx in Noor's workspace · she continues from your change".
- **Reduced motion:** cut to full screen and back; the system line still appears.

### M-A2 · All green
- **Goal:** progress. The satisfying end of a unit of work.
- **Trigger:** the last check of a run passes.
- **Frames:**
  1. 0–360 ms: the checklist's items turn to ✓ in a cascade, 90 ms apart (each check draws its stroke in 120 ms, the green ink with the word).
  2. 400 ms: the live line (`12 of 12 passed`) settles into the receipt.
  3. 600 ms: the hero relaxes: Working → Idle (the eyes widen, the lids lower, a soft settle).
  4. 700 ms: the header status crossfades to **Idle**.
- **Reduced motion:** all the checks appear at once; the status changes.

### M-A3 · A lesson applied (the first time)
- **Goal:** delight and trust in the learning (intelligence-layer.md). "It remembered."
- **Trigger:** a reply is shaped by a learned note for the **first time** after the note was created.
- **Frames:** 0 ms: the reply finishes. 200 ms: the **Applied** chip slides in under the reply. 300–1100 ms: a soft glow passes once across the chip (a neutral highlight, not the agent hue), then it rests. On hover: the note's first line and "learned 22 Oct from your instruction".
- **Only once per note.** After that the chip appears without the glow.
- **Reduced motion:** the chip appears without the glow.

### M-N1 · Birth (New agent)
- **Goal:** delight and ownership.
- **Trigger:** the draft resolves (a name and a role are proposed).
- **Frames:**
  1. 0–300 ms: the neutral draft droplet morphs into the chosen shape (path morph, `spring.gentle`).
  2. 300–700 ms: the hue fills from the bottom (as M-F1); the dialog's wash crossfades to the agent's tint.
  3. 700 ms: the eyes open; 1000 ms: one blink; the name tag swaps "New agent" → **Lumen** with a crossfade and a 2 px drop. A system line: "Renamed to Lumen · Release notes".
  4. **On Create:** the dialog falls away (240 ms) while **Lumen's name tag and avatar fly to its new row in the sidebar** (shared element, `spring.smooth`, 420 ms) and land with a blink. The toast: **Lumen joined Bench › Dev team.** `Open Lumen`.
- **Reduced motion:** the avatar and name swap instantly; on Create the row appears in the sidebar with a 160 ms highlight.

### M-N2 · "Already knows 18 things"
- **Goal:** trust. A new agent isn't a stranger.
- **Trigger:** the draft card is shown.
- **Frames:** the line **Lumen starts knowing 18 things about how you work** appears under the draft card; the number counts up from 0 to 18 over 400 ms (tabular figures). Clicking it lists the notes.
- **Reduced motion:** the number appears.

### M-T1 · The handoff chip
- **Goal:** trust (the glass box: work visibly moves between people).
- **Trigger:** an agent hands a task to another (UC-13).
- **Frames:**
  1. 0 ms: the system line appears with both avatars at its ends.
  2. 120–420 ms: the **task chip** ("S1-6") lifts out of the sender's avatar and travels along the line to the receiver (`spring.smooth`, 300 ms).
  3. 420 ms: the receiver's avatar does a small catch (scale 1.06 → 1) and its eyes look at the chip; its status crossfades to Working.
  4. If the receiver's room is open elsewhere (split view, or later), the brief arrives at the top of its chat as a pinned card.
- **Reduced motion:** the line appears with the chip already at the receiver.

### M-T2 · The debate condenses into a memo
- **Goal:** relief. The chat "disappears" (BR-60), so you must see where it went.
- **Trigger:** the decider declares the decision, or time's up.
- **Frames:**
  1. 0 ms: the timer bar finishes; the debate bar reads **Decided**.
  2. 200–700 ms: the debate's messages compress upward (height to 0, opacity to 0, `spring.smooth`) into the memo card, which grows from the debate bar's position.
  3. 700 ms: the memo card is in place with **Decided: …**, "Saved to Bench memory. The debate chat is archived in the trace."
  4. 900 ms: the memory glyph in the sidebar's Insight section pulses once (a single 1.0 → 1.1 scale), showing where the memo went.
- **Reduced motion:** the memo replaces the debate thread; the line says where the chat went.

### M-P1 · The team assembles (New project, creating)
- **Goal:** delight and belonging. "This is my team."
- **Trigger:** *Create project*.
- **Frames:** the 7 grey placeholders in the team preview fill with their hues one by one (110 ms apart, each as a mini M-N1 without the blink); the progress reads `4 of 7`; as the last one fills, **all 7 blink once together**; the dialog gives way to the new dashboard, where the avatar stack arrives in the project header (shared element).
- **Reduced motion:** a progress count, then the dashboard.

### M-P2 · The sprint-end gathering
- **Goal:** progress, the peak-end of a sprint.
- **Trigger:** the last story of the sprint is accepted.
- **Frames:** the progress bar fills to 100 % (`spring.smooth`); the project card's avatar stack **slides together into a tight cluster** and does one synchronized hop (4 px); the summary appears: **Sprint 2 is done.** "10 of 10 accepted · 4 lessons learned · 412k tokens (13.7 % of your week)". The one celebration Bench allows (ui-ux-guide: delight only, e.g. a sprint accepted).
- **Reduced motion:** the summary appears; no hop.

### M-R1 · Concern, not alarm
- **Goal:** trust. Something broke, and it's being handled calmly.
- **Trigger:** a run fails (P06) or a connector is revoked.
- **Frames:** the avatar's eyes go wide for 200 ms, then soften and look down; the badge crossfades to **Error** (160 ms); the RunCard slides in like a message (8 px, 180 ms), not as an overlay. Nothing shakes, flashes or turns the screen red.
- **On recovery:** the eyes look up, a small relieved settle; the badge crossfades back.
- **Reduced motion:** badge and card only.

### M-R2 · Waking up (back to normal)
- **Goal:** relief.
- **Trigger:** P10 (online again, signed in, or the week reset).
- **Frames:** the banner folds up into the digest card (300 ms); the paused avatars open their eyes **in the order they'll resume**, 120 ms apart, so the resume order is *visible*; the top ring fills back in.
- **Reduced motion:** the digest replaces the banner; badges change.

## 6. Motion tokens (starting values; the design system sets the final ones)

| Token | Use | Value |
|---|---|---|
| `spring.snappy` | Presses, toggles, chips, name tags, counters | stiffness 500 · damping 30 · mass 1 |
| `spring.smooth` | Panels, tickets, the take-over, sheets, shared elements | stiffness 300 · damping 30 · mass 1 |
| `spring.gentle` | Hero breathing, birth fills, eye moves | stiffness 120 · damping 14 · mass 1 |
| `dur.micro` | Hover, focus, badge crossfade | 120–160 ms |
| `dur.move` | A message in, crossfades, the receipt | 180–240 ms |
| `dur.scene` | Room change, take-over, the memo condense | 300–420 ms |
| `stagger.list` | Tickets, checklists | 30 ms (lists) · 90 ms (checks) · 110–120 ms (avatars) |

**Constraints for the tech lead and UI:**
- Electron's Chromium supports CSS `linear()` easing, which can approximate these springs without a library; interruptible drags and shared elements may need a small spring library in the renderer.
- Animate transforms and opacity only, except the ticket's height (already a documented bend, 320 ms, user-triggered).
- The CPU budget for idle avatars is in §3 (C-F). If the build still shows cost, the fallback (only the hovered or selected agent animates) is a client decision.
- Every moment is off under `prefers-reduced-motion` and the in-app switch; nothing flashes more than 3 times a second (WCAG 2.3.1).
