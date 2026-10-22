# Design: the Office (Home as a living 3D office with creature agents)

| Field | Value |
|---|---|
| Status | Draft for client approval (brainstorm, 2026-10-22) |
| Replaces | The "Look" direction (archived: `docs/design/ui/archive/2026-10-22-the-look/`, tag `design/the-look-2026-10-22`) |
| Inputs | Client brainstorm (this document records it), references in `docs/design/ui/references/` (`office-iso-*-client.webp`, `creature-sheet-client-2026-10-22.webp`), research `docs/research/teardowns/minimal-characters.md`, UX premium spec `docs/design/ux/premium/`, skills `premium-craft` + `ui-ux-guide` |

## 1. Intent and why

**The feeling (client's words):** *"I have walked into my startup where everyone is positive and working hard and collaborative, you see some arguing and others deep focus and others just doing nothing faking work, and then I get greeted, I can feel the energy and motion in the office and the creativity. I want to feel like I am the boss who walked into his fast growing and successful startup."*

**Why the change:** the previous agent characters (non-human shapes with slanted eye strokes) read as a copy of Grok Bot (the client's earlier avatar reference was literally a Grok Bot screen). The client wants a unique identity "not just the eyes", so people see Bench's value instead of calling it a cheap copy.

**The idea:** Bench's Home is **your office**: a realistic, softly lit 3D office seen from above at an angle, where your agents (friendly imaginary creatures) visibly work, debate, plan, idle and greet you. The state of your whole company reads at a glance, before you read a word.

## 2. Decisions made by the client

1. **Home = the office.** It's the first screen. It shows the full office: desks, departments, teams, meeting rooms.
2. **Office look = realistic 3D render with soft light** (reference `office-iso-realistic-client.webp`): believable furniture, materials, shadows and clutter.
3. **Agents = imaginary friends:** don't look human, but behave like people (*"something that you would see in your imagination or dreams"*). Inspirations: the Smurfs (friendly, each a unique personality and job), the creature sheet (many different kinds of creature), the villains-in-an-office poster (non-human coworkers doing office things).
4. **Characters stay minimal on purpose,** like Grok Bot and Dots, so animation is controlled by code and no poses have to be drawn (client: they keep it minimal *"to keep things simple and have full control on the animations without having to care about the character poses"*). But the language must be our own.
5. **Pick any creature per agent.** Creatures are not tied to roles (*"I might add new agents for different roles"*).
6. **"What needs you" becomes agents trying to get your attention:** an agent who needs you gets a **mark above it** and actively tries to catch your eye.
7. **Clicking that agent opens a bubble above it** with the same content as today's "What needs you" ticket (kind, source, ask, reason, cost, one blue primary + secondary actions).
8. **Keep "Look inside"**: the eyes glyph that opens what's behind anything (a trace, a cost, a file).
9. **Technology is the PM/tech lead's call** (client: "make that").
10. **Keep the old direction** archived and untouched so we can go back.
11. **The live 3D office ships inside v0.1** (the 14-day, full-scope target after Gate 6); other work is re-sequenced around it, not cut. Client: "yes inside the 14 days".

## 3. Goals, non-goals, anti-goals

**Goals**
- Opening Bench feels like walking into a thriving startup: motion, energy, personality.
- The company's state is readable at a glance: who works, who debates, who's idle, who needs you, what's stuck.
- Unmistakably Bench: nobody mistakes it for Grok Bot, Dots or a generic AI chat app.
- Characters scale: adding agent #13 costs nothing; they read at office size (≈ 30–60 px on screen) and in lists/chat (16–32 px).
- Everything stays a glass box: every visual state maps to a real event, and the exact text is always one click away.

**Non-goals (v0.1)**
- A game: no walking your own avatar around, no decorating for its own sake, no gamified points.
- Hand-drawn pose libraries per creature.
- Dark mode (later, as before).

**Anti-goals (would be a failure even if it works)**
- It looks like Grok Bot/Dots (soft blobs + eye strokes) or like a stock low-poly game.
- The scene is decoration that lies: an agent looks busy while nothing runs, or a mark appears without a real request.
- It's slow: the office makes the app laggy, hot or battery-hungry, or delays getting to a chat.
- It hides information: the client must hunt in 3D for something a list would show instantly.
- Childish: cute wins over "successful startup".

## 4. The experience

### 4.1 The office (Home)
- **Camera:** fixed isometric-style angle (about 30–35° down), like the reference. Pan and zoom (scroll / pinch / keyboard), no free rotation in v0.1. Default zoom fits the current floor.
- **Layout = your org.** Each **project is a floor** *(PM call; the client said "departments, teams, meeting rooms")*. On a floor: one **area per team** (its desks, a rug/zone with the team name), **meeting rooms** (glass walls, where debates and sessions happen), a **whiteboard corner** (planning), a **lounge/kitchen** (idle), an **entrance** (Atlas greets you). The company level (Atlas, assistants) sits in an executive corner or lobby.
- **The floor grows with the team:** adding an agent adds a desk to its team's area; adding a team adds an area. Layout is generated from the org, not hand-placed.
- **Clutter = history (intelligence layer made physical):** small props accumulate from real events (a trophy for a shipped sprint, sticky notes for open tasks, a plant that grows with an agent's lessons, a cake on an agent's "birthday"). Never fake; each prop's tooltip says what it stands for.
- **Overlays (2D, on top of the 3D):** a minimal top bar (usage indicator, "N need you" count that opens a list, floor switcher), and the chat/inbox panels when opened. The **list of everything that needs you stays available** (one click from the count) for when the client wants text, not a hunt.

### 4.2 Creatures (the agents)
- **Built from parts, minimal, code-animated** (from research: parameters, not drawings). Each agent = a **form** (one of a library of simple 3D bodies) + a **topper** (antenna, ears, sprout, horn, steam, halo…) + an **eye style** + **colour**, chosen by the client when creating the agent (Atlas may suggest). Library target for v0.1: ≥ 12 forms × ≥ 8 toppers × 4 eye styles × 10 hues.
- **Our own language, not Grok/Dots:** bodies are objects-and-creatures from imagination (star, cloud, mug, TV, frog, bean, drop, pebble…) with **small noodle arms** (no drawn poses: arms are procedural, 2–3 joints, IK to props like a keyboard, mug or whiteboard marker). Faces stay tiny (dot or round eyes, small mouth). No slanted eye-stroke pair anywhere.
- **Material:** soft, slightly matte "clay/vinyl" 3D with gentle subsurface feel so they sit naturally in the realistic office but are clearly imaginary. *(PM call; validate in the spike.)*
- **Behaviour = real state.** Every state is a preset of shared parameters (squash, lean, gaze, lid, blink, arm targets, topper spring, location):

| State (from the run) | In the office |
|---|---|
| Working (tool calls, tokens streaming) | At desk, typing; screen lit with their actual work type (code, doc, browser); rhythm follows token rate |
| Thinking / planning | Leaning back or at the whiteboard |
| Debating (team chat / debate session) | In a meeting room with the others, gesturing; "!?" bubbles |
| Handoff | Walks a small glowing card to the receiver's desk |
| Needs you | **Stands up, mark above head, tries to catch your eye** (see 4.3) |
| Done | Small celebration (stretch, high-five a teammate), then idle |
| Idle | Lounge, coffee, scrolling a phone ("faking work"), dozing after long idle |
| Stuck / error | At desk, papers spilled, head in hands; mark turns red-amber if it needs you |
| Paused / archived | Desk lamp off, chair tucked in |
| Greeting | Atlas meets you at the entrance on open; agents glance up when you arrive |

- **Temperament:** each agent gets a small fixed tempo/personality offset from its id, so two agents with the same form still move differently.
- **Status is never colour/motion only:** hovering shows name + status in words; lists and chat always show the text status.

### 4.3 "What needs you" in the office
- A **mark** floats above the agent (amber "!" for a decision/approval, other glyphs for question, meeting, payment). Urgency escalates behaviour: stand up → wave → hop → walk toward the front of the floor. Never sound by default; follows the notification grammar (needs-you = toast + one repeat).
- **Click the agent (or its mark) → a ticket bubble opens above it**, anchored to the agent: kind tag, source ("Noor · S1-4 · 2 min ago"), the ask, one-line reason, consequence ("≈ 2 min · ≈ 0.3 % of your week"), one blue primary (e.g. **Allow once**), secondary actions (Always allow, Not now, Ask why). Same component and copy as the inbox ticket.
- Resolving it: the bubble folds, the mark pops, the agent gives a small nod and sits back down; counts tick down everywhere.
- Marks on other floors show on the floor switcher ("Bench · 2").

### 4.4 Clicking around
- **Click an agent (no mark):** opens its chat/workspace (the existing agent page: conversation + workspace) as a panel over the office, the office stays visible and alive behind it. *(PM call; validate.)*
- **Click a meeting room:** opens that debate/session.
- **Click a desk's monitor = "Look inside":** shows exactly what the agent is doing right now (file diff, browser, terminal). The eyes glyph appears on hover over monitors, meeting rooms and any cost line.
- **Look inside** everywhere else keeps its meaning: open the trace behind a message, cost or file.

### 4.5 The rest of the app
Agent page, team chat, settings, routines, memory, usage, trace keep the v0.2 structure and the UX premium spec (`docs/design/ux/premium/`). Their visual style is re-derived from the office direction (materials, light, colour) in the UI phase; the creatures replace the old avatars everywhere (lists, chat, profile hero).

## 5. Constraints
- **Performance budget** (Windows-first, typical laptop): office idle ≤ 5 % CPU and no fan spin; 60 fps target, 30 fps floor; the office pauses/sleeps when the window is hidden or minimized; time to first interactive Home ≤ 1.5 s after launch; a "Reduce motion / Simple view" setting replaces the 3D office with a static render + the list.
- **Accessibility:** everything in the office has a keyboard path and a text equivalent (the needs-you list, agent list); reduced motion respected; marks and states always have words on hover/focus.
- **Assets:** only assets we may ship in an MIT open-source app (CC0 or a licence that allows redistribution in source form); licences recorded in `THIRD_PARTY` notices. No third-party brands.
- **Truthfulness:** no animation without a backing event (glass-box rule).
- **Security:** the renderer stays sandboxed; 3D runs in the renderer with no Node access (existing Electron rules).
- **Cross-platform:** must work on Windows first, then macOS/Linux; graceful fallback when WebGL/GPU is unavailable (the Simple view).

## 6. Technology (PM + tech lead call, to validate in a spike)
- **Real-time 3D in the renderer** using an established WebGL engine (three.js via React Three Fiber is the default candidate), not pre-rendered images, so the scene can grow with the org, animate from real events and support pan/zoom/click.
- **Office art:** licensed/CC0 office model kit restyled to one material palette + baked soft lighting/ambient occlusion for the "realistic render" look at a low runtime cost.
- **Creatures:** simple parametric 3D meshes (forms + toppers) with procedural animation (springs, IK arms), driven by the shared state parameters.
- **Spike first (Sprint 1 day 1 alongside S0-1..3):** one floor, 8 agents, all states, measure CPU/GPU/fps on the client's Windows machine, and get the client's reaction to a real render before the full build.

## 6a. Calls made by the PM after the builder check (client may override)
- **Performance modes.** "Idle" = no agent runs active: the office renders on demand, ambient life is sparse (one or two small actions every few seconds), ≤ 5 % CPU, frame rate drops to ~10 fps between changes. While runs are active: continuous rendering capped at 30 fps (60 only while the client pans/zooms/clicks), ≤ 15 % CPU. Hidden/minimised window: rendering stops. The spike measures both modes.
- **Look vs growth.** Modular pre-lit pieces (desk pods, team areas, meeting rooms, lounge) with baked lighting per piece, composed by the layout generator; only creatures and moving props get real-time soft shadows. Growth snaps to whole pieces, so no runtime re-baking.
- **Ambient life vs truth.** Idle agents may do varied, social idle behaviour (coffee, chatting in the lounge, phone, dozing): that's truthful because they are idle. Working, debating, handoff, needs-you, done and stuck appear **only** from real events. Two idle agents may chat, never "argue" (arguing means a real debate).
- **Scale.** Design for up to 30 agents per floor and 8 floors; the performance test runs a 30-agent floor. Beyond 30 on a floor, the floor gets a second wing.
- **Org mapping.** Company level (Atlas, assistants, CEO node) = the ground-floor lobby and executive corner. Project = floor. Team/department = an area; nested departments = sub-areas inside it, labelled. Freelancers = hot desks at the edge of the team that hired them. A loaned agent sits at a guest desk on the borrowing floor; its home desk shows an "On loan to …" sign. A handoff across floors = the card goes into a lift/pneumatic tube and arrives on the other floor (with a toast).
- **Simple view.** The agent list + the needs-you list, plus a cached still of the office captured the last time it rendered (a generic illustration if none exists). No separate 2D renderer.
- **Talking to Atlas.** Home keeps a permanent "Ask Atlas…" composer docked at the bottom of the office; clicking Atlas does the same.
- **Spike timing.** The feasibility spike is a throwaway research spike on a `spike/` branch (like S0-1..3), allowed before Gate 6. Its code is not kept.

## 7. What's left to the builder
- Exact engine/library choices inside the 3D approach, asset sourcing, the procedural layout algorithm, camera details, LOD strategy.
- The exact creature form/topper library (respecting §4.2 and the anti-goals).
- Exact motion values (follow the premium-craft and moments specs).
- How the old brand tokens carry over (typography, Cobalt one-blue rule, receipt line, ticket) into the new look.

## 8. Next steps
1. Client approves this document.
2. UX: update flows for office-first Home (state matrix additions: empty office on first run, one-agent office, crowded floor, GPU fallback).
3. UI: office look-and-feel board (rendered stills) + creature library sheet + one animated spike scene.
4. Tech lead: feasibility + performance spike (§6), ADR for the 3D engine.
5. Then back into the lifecycle: BRD v1.1 / PRD v0.2 (CR for office-first Home and the creature system), SRS, G2–G5.
