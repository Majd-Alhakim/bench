---
name: premium-craft
description: Eucas's always-on premium design process. Takes a screen past "looks decent" to "feels premium" through evidence of quality (system status, undo, recovery), cross-screen coherence, designed worst moments, a visible intelligence layer, emotional moments and motion, and a craft checklist, scored with a Beginner→Staff rubric that blocks hand-off below Senior. Use it with ui-ux-guide on ANY UX or UI work: designing, prototyping, redesigning, reviewing, critiquing or fixing a screen, flow, component, token, copy, animation or brand element, and in UI review of PRs.
---

# Premium craft for Eucas

**Why this exists.** AI tools give every competitor a "decent" UI in a day. That level is the *commodity ceiling*. Users don't judge a product premium because it is pretty. They judge it premium from the evidence that it is good: it tells them what is happening, lets them undo, catches them when things fail, and feels like one product someone cared about. That evidence lives in states, connective tissue and worst moments, the parts AI-built UIs most often skip (the video calls the gap *design theater*: the reasoning is stated but never makes it into the interface).

Source: eight design-education videos shared by the client on 2026-10-22, paraphrased in [references/sources.md](references/sources.md).

**Relation to `ui-ux-guide`.** That skill is the rulebook: screen card, UX laws, type, color, components, copy. This skill is the process and quality bar on top of it. Load both. **When they conflict, `ui-ux-guide` wins on accessibility, the BRD and the security baseline.**

## When to use
Every time you design, prototype, redesign, review or fix any part of Eucas's UX or UI, at low-fi and hi-fi alike. It doesn't apply to text-only docs work.

## The process (gates)

Run the gates in order. Each one adds to the `ui-ux-guide` screen card. Record the outputs in the deliverable; don't just think them.

### Before: plan the experience, not the screen
1. **Screen card plus.** Add these to the ui-ux-guide card:
   - **Evidence:** how the user knows what just happened, how to take it back, and what to do next. All three are required.
   - **Consequence preview:** what the primary action will cost or produce, shown *before* the click (tokens, % of week, files touched, who gets notified).
   - **Intelligence deposit:** what this screen learns about the client, and where that learning is visible later (gate 6).
2. **State matrix.** Make a table per screen: default · loading/working · empty (first use / no results / cleared) · partial · error · offline / Claude unavailable · usage limit · permission denied · success. Every cell is designed, or explicitly marked N/A with a reason. See [references/states-and-recovery.md](references/states-and-recovery.md).
3. **Emotional-moment map.** Pin candidate moments on the flow, then choose **2–3 strategic ones** per flow, tied to a goal (trust, delight, a sense of progress, relief). Pin them in UX; animate them in UI. Don't scatter delight everywhere. See [references/emotion-and-motion.md](references/emotion-and-motion.md).

### During: design the movie, not the frames
4. **Remove, then add back.** Start with everything removed. Re-add each element only when it has a job. Hide secondary actions and reveal complexity when it is needed. Common actions are ≤ 3 clicks from anywhere (Send, Approve, Stop, New agent, open an agent).
5. **Spatial continuity.** Screens don't swap; they *transition*. An element that persists keeps its place and morphs, panels slide from where they live, and a handoff chip travels between agents. The user builds a mental map.
6. **Intelligence layer check.** Does session 1000 work measurably better than session 10? Show it: what the team has learned, the client's preferences applied ("using your PR style"), lessons, a memory growing. Make the deposit automatic (no "save preference" chores). Ask the **exit question**: what would the client have to rebuild elsewhere? See [references/intelligence-layer.md](references/intelligence-layer.md). Eucas is local and open source, so the value stays **visible and exportable** (Markdown memory) and there is no dark lock-in. Trust is the moat.
7. **Craft checklist.** Run [references/craft-checklist.md](references/craft-checklist.md) on every view: color 60-30-10, ≤ 4 type sizes and 2 weights per view, 4/8-pt spacing by relationship, consistent corner language, the full interaction-state set, icons sized to line height, subtle shadows.

### After: prove it, then hand off
8. **Worst-moment pass (break it on purpose).** Render each of these and design the recovery:
   - offline mid-run
   - the weekly usage limit is hit
   - an agent run fails or crashes
   - an approval is denied
   - a connector is revoked
   - a checkpoint fails
   - every list is empty
   - a long name or a 500-line message
   - a slow response (10 s+)

   Each recovery names the cause, says what was saved, and offers one clear next step. Done well, a failure can leave the user *happier* than if nothing had gone wrong (the service-recovery paradox).
9. **Coherence pass (use it for an hour).** Walk the core flows end to end as the client would, screen 1 next to screen 80. List every spot where it stops feeling like the same product: two patterns for one situation, a moved nav, a different corner radius, different words for one thing. Fix each one with **one pattern per situation**, reused everywhere.
10. **Render and look.** Render every route at **1440×900 and 1280×800** (headless Edge) and actually look at the PNGs: overlaps, clipping, hidden content, horizontal scroll, emptiness. Never hand off unrendered work.
11. **Score the rubric** below and include the table with the deliverable.

## Review rubric (hand-off gate)

Score each axis at its level. **Any axis below Senior blocks hand-off.** Fix it, or ask the client for an explicit waiver. Each level assumes the one below it.

| Axis | Junior | Mid | Senior (minimum) | Staff |
|---|---|---|---|---|
| **Copy** | Labels are vague or repeated | Clear, written for a user | Says more with less; every line passes the removal test ("would the user be confused without it?"); never repeats a label the heading already gives; second-person voice | Copy anticipates the next question and frames warmly ("guest pass", not "trial") |
| **Visuals** | Decorative effects, layered shadows | Polished but overworked | Emphasis only where it matters; visual patterns reused to connect related parts | Custom visual language (shapes, avatars, icons) that is unmistakably Eucas |
| **Color** | Too much or too little brand color | Tints and shades of one hue | 60-30-10, color only for meaning, one blue action | Color carries identity (agent hues) and state, with nothing decorative |
| **Type** | 5+ sizes, 3+ weights | Fewer sizes, some off | ≤ 4 sizes and 2 weights per view, tight tracking on large type, tabular figures | Type does the hierarchy with no extra chrome needed |
| **Structure** | Random spacing, misaligned | 8-pt grid mostly | Spacing by relationship (multipliers), grouped, aligned; the hierarchy test passes | Breaks the grid on purpose for rhythm |
| **States and recovery** | Happy path only | Loading and empty states exist | Full state matrix; every failure has cause, saved state and a next step; undo where possible | Worst moments become trust moments (recovery paradox) |
| **Motion and emotion** | None, or gratuitous | Transitions present | Physics-based, purposeful, reduced-motion safe; 2–3 pinned moments | Signature moments that are memorable and on-brand, and teach behaviour |
| **Coherence** | Screens disagree | Mostly consistent | One pattern per situation across all screens; the hour-long walk is clean | Feels like one object; muscle memory transfers everywhere |
| **Intelligence** | Every session starts at zero | Data is stored | Learning is visible and applied, deposits are automatic | Long-term use is measurably better and the client can see why |

**Hierarchy test:** for any card or screen, say in one breath which element is read first, second and third. If you can't, the user can't either.

## Designer-level heuristics (use them while designing)
- **Show consequences before commitment.** Put counts on options, and a result on the button: "Run · ≈ 1.2 % of your week", "Archive 3 notes", "Notify Karim and Maya".
- **Certainty over ranges.** Show one best estimate, not a range (the certainty effect). Add the range on hover if needed.
- **Context inside controls.** A slider can show where its values sit (a histogram of past runs, the weekly headroom line), so the choice is informed while it is being made.
- **Give control when no default is right.** Offer a view toggle (cards ↔ compact list) or density, instead of forcing one layout on everybody.
- **Signifiers teach.** A container means a group, a fill means selected, grey means inactive. Subtle cues (a drag handle, a grabber line) teach gestures without a tutorial.
- **Change gradually.** When behaviour changes between versions, step users through it rather than swapping it overnight.
- **Progressive disclosure of what happens next.** For anything multi-step (a routine, a project kickoff), show the itinerary up front: "Atlas drafts → you approve → team starts".

## Eucas applications (concrete)
- **Run/Send buttons** carry their consequence: estimated tokens and % of the week, and the files or connectors touched.
- **Usage limit (worst moment):** don't show a dead end. Say what paused, what is saved, when it resets (an exact date and time), and which runs will resume automatically. Offer "Continue with a smaller model" when it is allowed. Show a count badge ("2 of 2 runs paused") rather than a generic message.
- **Failed run:** a calm card with the cause in plain words, what was kept (checkpoint, diff), and one primary action: Retry / Ask Karim / Open trace. Never a raw stack trace first.
- **Denied approval:** the agent acknowledges it, shows what it will do instead, and nothing is lost.
- **Intelligence layer:**
  - A "Your team has learned" strip on Home: lessons this week, and your preferences applied with their source.
  - Each agent profile shows the memory that grew since its creation ("312 runs · 46 notes · 12 lessons").
  - "Using what Noor learned on Oct 14" chips inside replies.
  - The export is one click, as plain Markdown.
- **Emotional moments (pick 2–3 per flow):**
  - the new agent's first blink at Create
  - the handoff chip travelling between agents
  - all-green checks closing a task
  - the first time Eucas applies a learned preference
  - the sprint-complete ending
- **Physics:**
  - Panels and tickets use spring easing.
  - Lists rubber-band at their edges.
  - Ticket expand/collapse keeps its spatial anchor.
  - Avatars breathe while idle and react on state change.
- **Coherence:** one approval pattern (the same card in the inbox, the workspace and the ticket); one "estimate" chip; one status vocabulary; one corner radius family.

## Output with every deliverable
1. The state matrix (per screen, or "unchanged since vN").
2. The emotional-moment map (the chosen 2–3, and why).
3. The worst-moment pass results.
4. The coherence findings, and what was fixed.
5. The rubric table with a level per axis, plus the blockers left (if any).
6. Rendered screenshots at 1440×900 (plus 1280×800 for dense screens).
