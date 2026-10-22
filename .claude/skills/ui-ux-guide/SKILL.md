---
name: ui-ux-guide
description: Bench's UI/UX design rulebook (UX laws, user intent, layouts, color, typography, visual weight, components, microcopy, empty states, microinteractions, design judgment), adapted for a desktop agent-team app. Use in Phase 4 (UX) and Phase 5 (UI) whenever designing, reviewing or critiquing a screen, wireframe, prototype, design token, component or copy, and in UX/UI review of PRs.
---

# UI/UX Guide for Bench

Source: [references/guide.md](references/guide.md), compiled from @startuxdesign's posts (paraphrased; 22 posts, Nov 2024 – Oct 2026). This file turns that guide into **working rules for Bench**. When a rule here conflicts with the BRD, the security baseline or accessibility, those win (see "Bench adaptations").

## How to use this skill

1. **Before designing a screen**, fill in its *screen card*:
   - **Intent** (Know / Go / Do / Buy; for Bench usually Know, Go or Do, see §2 of the guide)
   - **Primary action** (exactly one)
   - **Use-case IDs** (from the BRD)
   - **States:** default, loading, empty (first use / no results / cleared / error), error, success
   - **Worst moment** (peak-load) and **ending** (peak-end)
2. **While designing**, apply the rules below in this order: structure → hierarchy → type → color → components → copy → motion. Low-fi (Phase 4) stops after copy. Color and motion are Phase 5.
3. **Before handing off or approving**, run the **review checklist** at the end. Report each failure as `screen — rule — problem — fix`, most severe first. A finding must name the rule it breaks.
4. **When critiquing**, use the design-judgment questions (§13 of the guide). Explain *why*, never "looks cool".

## Rules

### Structure and choice (UX laws)
- **One intent and one primary action per screen.** Secondary actions are visibly lighter.
- **Hick's and Miller's laws:** about 7 items or fewer per group. Chunk long lists (backlog, roster, memory) into groups, with progressive disclosure: top items first, "show all" to expand.
- **Fitts's law:** the most frequent actions (Send, Approve, Stop agent, New project) are large and close to where the eye already is.
- **Occam's razor:** if two layouts solve it, ship the simpler. Every element must have a job; remove decoration.
- **Jakob's law and mental models:** chat looks like a chat app, the board looks like a Kanban board, the org tree looks like a tree. Don't reinvent known patterns.
- **Peak-end:** design one clear highlight per flow (e.g. "We have something to show you", a decision memo) and a smooth ending (a confirmation plus a next step).
- **Peak-load:** find each flow's worst moment (usage limit hit, an agent stuck, a denied approval, a failed checkpoint) and design it first. State the exact reason and the next step.
- **Framing:** frame positively and concretely ("Agents paused: resumes at 14:00, nothing lost"), not as a bare error.
- **Authority and trust:** show provenance where trust matters (which agent wrote a memory note, which model ran, the cost of each message).
- **Variable reward:** use sparingly and never on money or approvals. Allowed only for delight (e.g. a celebration when a sprint is accepted).

### Layout and visual weight
- Use the **Z pattern** on onboarding and empty screens, ending on the primary button.
- Visual weight (size, color, type, imagery, contrast) goes on the primary action and on "needs me" items; everything else recedes.
- Planned asymmetry is fine. Keep alignment to one grid and one spacing scale everywhere ("a system, not one screen").
- Navigation: back and close on the left, actions on the right; related information in expandable sections; a dot or badge for new items.

### Typography (Phase 5 tokens)
- 1–2 typefaces at most (a display face for headings is optional; a sans for UI). **One type scale** (e.g. caption, body, subheading, heading, display) used on every screen.
- Body text: **40–60 characters per line**, **120–150% line height**. Headings: tighter tracking; small text: looser tracking.
- Left-align by default; center only short text.
- Rank information by size **and** weight, with one clear step between levels.

### Color (Phase 5 tokens)
- **60-30-10:** 60% neutral base, 30% primary, 10% accent (buttons, highlights).
- **Hierarchy:** the brightest, most saturated color is reserved for the primary action.
- **Feedback colors:** green = success, red = error, amber = warning or needs attention.
- **States:** default, hover, active, focus and disabled must each look different. Disabled is grey; focus is always visible.
- **Dark mode:** don't invert. Slightly lower the contrast, no pure-white text, more saturated accents, the same brand in both modes.

### Components
- **Cards** for agents, tasks, notes and approvals; **chips** for status, tags, filters and the model tier; **badges** for counts ("needs me", unread).
- **Chip states:** default, hover, selected, disabled.
- **Modals** only for decisions that must block (delete, outward-action approval); otherwise use popovers or inline UI.
- **Accordions** for long sections (full backlog, memory sections, settings groups).
- **Progress bars** for the usage meter, context usage and sprint progress.
- **Avatars (agents):**
  - States: empty → initials → picture.
  - Sizes: 24–40px in headers, 40–48px in lists, 56px+ on the profile.
  - **Status is shown on the avatar** (idle, thinking, working, waiting for approval, error, paused), always with a text label or tooltip as well as color.
  - Action icons beside the avatar match their result (pencil = edit, lock = permissions, red mark = remove).

### Microcopy
- Errors give the cause and a next step ("Gmail token expired. Reconnect"), never just "Something went wrong".
- Money and usage: state what happens and when ("Weekly limit 72% used, resets Mon 09:00").
- Affordance: say what's possible ("Drop .md, .pdf or a folder").
- Status labels: name the state plainly (Draft, Awaiting you, Running, Blocked, Done).
- Agents speak in plain language; no jargon in the client's view unless they open the trace.

### Empty states
- Types: first use, no results, cleared, error. Each has a **headline, a short explanation, an optional visual, and one primary action**.
- Never generic, never blaming, never overly cute. Every empty state offers a next step.

### Microinteractions (Phase 5)
- Feedback on every key action: hover change, button press, sent, approved.
- Loading: show progress or live activity (streaming tokens, the agent's current step) to reduce perceived delay.
- Signature moments: a handoff between agents, a debate timer, a context checkpoint, a sprint accepted. Subtle and fast.
- Always respect `prefers-reduced-motion`.

## Bench adaptations (these override the guide where they differ)
1. **Never color alone.** Status and risk always have a **text tag** too (OUTWARD, RESERVED, LEAD, LOAN, BLOCKED). This is a BRD/UX principle and an accessibility rule.
2. **Desktop first:** a fingertip target of about 44px becomes a **click target of 32px or more, 40px or more for primary actions**, with full keyboard access and visible focus. Keep 44px for any touch or mobile companion later.
3. **Accessibility:** WCAG 2.2 AA minimum (4.5:1 body text, 3:1 large text and UI parts); aim for AAA (7:1) on body text where possible.
4. **No dark patterns.** Bench's promise is the glass box: no hidden costs, no hidden actions, cancel and stop always one click away, outward actions always explicit.
5. **Glass box:** every agent action, cost and memory write is visible on demand. Design progressive disclosure: summary first, trace one click away.
6. **Variable rewards and gamification** never touch approvals, money or decisions.

## Review checklist
Run this before G4 (UX) and G5 (UI), and on UI PRs. ✅ / ❌ / N/A per item, with notes.

1. The screen has one clear intent and one primary action.
2. Choices are limited (about 7 or fewer per group) and chunked; long content uses progressive disclosure.
3. Key actions are large, near the eye's path, and the same style across the app.
4. Visual weight and color hierarchy lead to the primary action and "needs me".
5. Colors follow 60-30-10; feedback colors match meaning; **every status also has text**.
6. Default, hover, active, focus and disabled states are all distinct; focus is visible.
7. Body text is 40–60 characters wide with 120–150% line height; one type scale; at most 2 typefaces.
8. Spacing and type are consistent on every screen (a system).
9. Every empty state (first use, no results, cleared, error) explains itself and has a next step.
10. Every error message gives the cause and a next step; the flow's worst moment is designed.
11. The flow ends smoothly (peak-end) with a confirmation and a next step.
12. Key actions give feedback (hover, press, done); loading shows progress.
13. Contrast meets WCAG 2.2 AA; full keyboard use; reduced motion respected.
14. Click targets are 32px or more (40px or more for primary actions).
15. No dark patterns; costs and outward actions are explicit.
16. Nothing exists only for decoration.
17. Agent avatars show status with a label; avatar sizes match context.
18. Microcopy uses plain state names, says what's possible, and gives reassurance near usage and cost.
