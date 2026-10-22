# Minimal characters: what makes Grok Bot and Dots work, and four character languages for Bench

**Date:** 2026-10-22 · **Author:** research pass for Phase 5 (UI) · **Status:** input to a client decision, not a decision.
**Question:** Our agent avatars (soft non-human shapes plus two slanted white eye strokes, "the Look") read as a copy of Grok Bot. What do Grok Bot and Dots get from keeping characters minimal, and what minimal character language can we own?

Legend: **[F]** = observed fact (with source) · **[I]** = our inference · **[?]** = could not verify.

---

## 0. The uncomfortable finding first

- **[F]** `docs/design/ui/references/avatar-reference-client-2026-10-22.png` is a Grok Bot screen. It shows the same agent list as our teardown of the client's recording (`grok-bot-ui-video.md`, O2): "Sales Outbound · Outreach drafts queued for approval", "Chief of Staff", "Inbox Manager", round/droplet/cloud/hexagon/blob/egg/pill/triangle/rounded-square bodies, each with two slanted white eye strokes.
- **[F]** Our BRAND.md §5 calls the slanted eye pair "the one element that's ours already (it came from the client's avatar reference)", and §8 lists the same nine shapes. So our signature is Grok Bot's signature, and the client is right.
- **[?]** The client's other taste reference (a sheet of flat pastel creatures: star, cloud, mug, TV, frog, cat, dot eyes, noodle limbs) isn't in the repo. Everything below works from the description in the brief. Please add it to `references/`.

---

## 1. Grok Bot (xAI): teardown

| | What we know |
|---|---|
| Built from | **[F]** One rounded primitive per agent (sphere, droplet, cloud, hexagon, blob, egg, pill, triangle, rounded square) in a saturated flat hue, plus **two white rounded eye strokes, slanted**. No mouth or limbs (client reference image). Rendered with a soft highlight (a light 3D feel) at hero size and flat in the list. |
| How it was made | **[F]** Design lead Benji Taylor said the whole icon set was **made with code**, and Grok Build was used in production. The characters **change expression and shape with the bot's state** (Wait, Work, Response), and each state morphs into the next "without interruption" ([Design Compass](https://designcompass.org/en/wp-json/wp/v2/posts/67684)). This is a single source, an aggregator summarising Taylor's post and video. The official launch post ([x.ai](https://x.ai/news/introducing-grok-bot)) says nothing about the visuals. |
| Tech | **[?]** No framework is named. **[I]** "Made with code" plus shape morphing between states points to procedural vector paths (SVG/Canvas, or native paths on iOS) with interpolated control points, not Rive or Lottie files. |
| State | **[F]** In the recording, state appears in text ("Typing…", "Thinking" with three dots in the agent's colour) and in status pills (Action needed, Working, Done). **[F]** The avatar's shape and expression change by state (Design Compass). **[I]** State lives mostly in the eyes and the silhouette. Colour is identity, not state. |
| Scale | **[F]** Hero row of about 3 large avatars, list rows of about 40 px, a collapsed avatar rail, a cluster avatar for groups. The same drawing works at every size because it's one shape and two strokes. |
| Count and difference | **[F]** About 9 shapes × free hues. Agents differ only by **silhouette and hue**. The eyes are identical on all of them, which is the family resemblance. |
| Why it works | **[I]** (1) Two parameters per agent (shape, hue), so a new agent costs nothing. (2) The silhouette stays readable at 16 px. (3) The eyes are the only expressive part, so every state change is just an eye change, cheap to animate and to morph. (4) No pose library: there's nothing to draw per state. |

## 2. OpenAI Dots: teardown

| | What we know |
|---|---|
| Built from | **[F]** From our three screenshots: **plush, furry 3D creatures** (a yellow blob with round glasses and a bow tie, "Alfred"; a blue cloud-like puff with a beret, "Felipe"; a green frog with a bow tie, "Todd"). Each has **big round eyes with dark pupils**, sometimes no mouth, and one accessory. **[F]** Press examples: "a plump, smiling frog named Todd, a sunglass-wearing heart named Jojo, and a puffy blue cloud named Felipe" ([Fast Company via search summary](https://www.fastcompany.com/91615068/openai-dots-agent-crew-of-friendly-mascots), page returned 403 to us). Triangles, rabbits and clouds are also cited ([Design Compass](https://designcompass.org/en/2026/09/30/openai-dots-always-on-ai-agents/)). |
| Identity | **[F]** Users name their Dot and "make it your own", choosing a default character or a pet ([Design Compass](https://designcompass.org/en/2026/09/30/openai-dots-always-on-ai-agents/), [TechCrunch](https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/)). At launch it's **one Dot per user**, with more planned ([search summary of SF Standard, Android Authority](https://sfstandard.com/2026/09/29/openai-launches-dots/)). |
| State | **[F]** A small avatar sits at the top of the chat with a **name tag and a live status line** under it ("Thinking…", "Clarifying the experiment goal"). The **user's bubbles and the canvas are tinted** in the Dot's colour (yellow, blue, green). **[F]** In "Alfred thinking", the eyes look up and aside. **[I]** State is carried by text plus gaze. The body barely changes. |
| Tech | **[?]** Not published. **[I]** The fur rendering suggests pre-rendered 3D (stills or video), with the small in-chat avatar as a still or short loop, not a runtime rig. |
| Scale | **[F]** Large hero renders in marketing, small (about 56 px) in the chat header. **[I]** Fur and accessories fall apart below about 32 px, which is one reason it works for one agent per user and wouldn't for a roster of 12. |
| Why it works | **[I]** Warmth through material (plush), personality through one accessory, and the "face of the agent" placed where the status lives. The status line under the face is the important UX pattern, and it's already in our DIRECTION (rule 2). |

**Contrast that matters for us:** Grok Bot = *minimal geometry, code-animated, roster-scale*. Dots = *rich material, a hero character, single-agent scale*. Bench needs roster scale (12+ agents, 16 px mentions), so the Grok Bot economics are right. Our language just needs a different **construction** and a different **face**.

## 3. Other systems worth stealing from

| System | Fact | What it teaches Bench |
|---|---|---|
| **Duolingo World Characters (Rive)** | Hand-animating lip-sync for 10 characters in 40+ languages was "completely out of the question". Each character has body-pose states plus a **separate mouth state set (20+ mouths)** running at the same time in a Rive State Machine, driven by timing data at runtime. Idle behaviours (nods, blinks, brow moves) run continuously ([Duolingo blog](https://blog.duolingo.com/world-character-visemes)). | **Layers, not drawings:** a body layer, a face layer and an idle layer, each driven by inputs. A few authored parts × runtime data = endless combinations. |
| **Procedural Rive rigs** | System-wide inputs (talking, gaze left/centre/right) are shared across poses. **Blinks are triggered by events** (gaze change, transition, big move) instead of a random timer, because a looping timeline "breaks the illusion" ([With Love, Substack](https://withloveapp.substack.com/p/procedural-animation-in-rive-how?r=535ifv)). Gaze can be a number input on a 1D blend ([Rive docs: states](https://rive.app/docs/editor/state-machine/states)). | **Blink on intent.** Our agents should blink when they *switch* attention (new tool call, handoff, your message), not on a metronome. That's free personality, and it's honest because it's tied to real events. |
| **Apple ARKit blend shapes (Animoji/Memoji control model)** | A face is described by named coefficients from 0 (neutral) to 1 (max). Apple's own example says a cartoon can use only `jawOpen`, `eyeBlinkLeft` and `eyeBlinkRight` ([Apple docs](https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapes)). The 52-shape set became a de facto standard in engines ([arXiv 2601.08234](https://arxiv.org/html/2601.08234v1)). **[?]** Apple doesn't say outright that Animoji runs on these. | **The rig contract is a short list of named 0–1 parameters.** Every Bench character, whatever it looks like, should take the same parameter vector (see §4.2). States become presets of that vector, and transitions are interpolation. |
| **Microsoft Agent / Clippy** | Characters had **named states** (Idling levels 1–3, Listening, Thinking-like Hearing, Gesturing, Moving, Speaking). The engine played them automatically and **picked randomly among several animations per state**. Microsoft advised avoiding endless loops and made **idling progressive** ([Microsoft Learn: Agent states](https://learn.microsoft.com/en-us/windows/win32/lwef/agent-states), [Get method](https://learn.microsoft.com/en-us/windows/win32/lwef/get-method)). | Steal the mechanics, not the manners. **Progressive idle** (settle → fidget → doze) is exactly the "slacking" the client wants. Clippy failed by **interrupting**. Bench characters never pop up or move into your way; they act inside their own tile. |
| **WALL·E / EVE (Pixar)** | EVE is a smooth white shape made relatable by "simple graphic elements produced with a marvelous economy of pixels" for eyes, which convey "mood, intent, emotion and personality". Anki later borrowed EVE's eyes for Cozmo ([Core77](https://www.core77.com/posts/54328/Whats-the-One-Design-Element-That-Can-Make-a-Robot-Lovable)). | Eyes alone can carry a full emotional range. That's also why "eyes on a blob" is crowded territory (EVE → Cozmo → Grok Bot). **Our eyes need a different shape grammar.** |
| **Cozmo (Anki, with Pixar animator Carlos Baena)** | Pupil-less eyes **change shape** with mood (happy = compressed slits). When idle it plays Pong on its face to show boredom ([designboom](https://www.designboom.com/technology/anki-cozmo-07-07-2016/)). An "emotion engine" decides behaviour and picks the animation ([Digital Trends summary](https://digitaltrends.com/?p=994925)). | **Boredom can be a visible activity** (doodling, playing) instead of a sleepy face. A slacking agent doing a tiny "desk toy" loop is funnier and kinder than drooping eyes. |
| **Luxo Jr. (Pixar)** | No face at all. Emotion comes from **timing**: quick hops while chasing the ball, slow heavy hops with more ground time after it pops ([Cartoon Brew](https://www.cartoonbrew.com/animators/learn-three-storytelling-tricks-john-lasseter-147534.html)). | **Timing is the cheapest expressive parameter.** The same bob animation at 1.6 s with ease-out reads as calm. At 0.35 s with overshoot it reads as excited. At 2.8 s with a long hold it reads as tired. |
| **Kirby (HAL)** | Kept "simple and circular so that anyone would be able to draw him" (Iwata, via [Wikipedia](https://en.wikipedia.org/wiki/Kirby_(character))). | The drawability test: if the founder can sketch an agent from memory in 5 seconds, the language scales. |
| **Pikmin (Nintendo)** | Designed for a top-down view with many units, so "gender and personality" were made **identifiable from what's on their head"**. The leaf exists because the character is tiny and needed to stand out ([Nintendo, Ask the Developer: Pikmin 4](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-10-pikmin-4-part-1/)). | **Put identity on top.** In crowd scenes and at 16 px, a distinctive topper (ear, sprout, antenna, handle) beats a subtle body difference. |
| **Rabbit r1 (with Teenage Engineering)** | A pixel rabbit head on the screen blinks, winks, wears headphones and moves while you talk ([Yanko Design](https://www.yankodesign.com/2024/01/12/rabbit-r1-co-designed-with-teenage-engineering-is-a-cute-pocket-ai-assistant/), [Engadget](https://www.engadget.com/rabbit-r1-hands-on-already-more-fun-and-accessible-than-the-humane-ai-pin-163622560.html)). | Low-res dot-matrix faces read as "a device with a soul" and stay crisp at tiny sizes. Watch out: the retro pixel look is also crowded. |
| **Notion Faces** | A parts kit (eyes, brows, eyewear, nose, mouth, hair, accessories) plus a shuffle button, exported as SVG ([Notion help](https://www.notion.com/help/notion-faces)). | Proves a parts kit + **shuffle** makes creation fun and makes identities feel personal without an illustrator. |
| **Meta Muse "Jolly"** | A cream character with black eyes and a smile, designed by Alex Cornell ([Axios](https://axios.com/2026/09/25/ai-doom-meta-muse-mascot)). It drew criticism for a plush, kid-toy look on an 18+ agent ([AI Weekly](https://aiweekly.co/alerts/metas-muse-ships-an-18-ai-agent-behind-a-kids-toy-mascot), [Creative Bloq](https://www.creativebloq.com/ai/metas-new-ai-avatar-is-making-me-feel-infantilised)). | **The market is filling up with cute agent mascots** (Dots, Muse, Grok Bot, all in 2026). Plush and round eyes are now generic. Bench should feel more like **a studio of colleagues** than a toy box: graphic, adult, a little witty. |

**[?] Not covered:** Headspace has no public character-system documentation we could find (only that Anna Charity led its early art direction, per [Creative Lives in Progress](https://creativelivesinprogress.com/articles/anna-charity)). Pi, Humane, Arc/Dia and Tamagotchi turned up no specific, sourceable character-system facts in this pass, so they're left out rather than guessed.

## 4. Principles

### 4.1 Why minimal works
1. **Parameters, not drawings.** A minimal character is a function `render(form, hue, params)`. A pose library grows as forms × states × sizes. A parameter rig grows as forms + states, and a new agent costs zero art (Grok Bot "made with code"; Duolingo layers; ARKit coefficients).
2. **One expressive organ.** If the eyes (or one other part) carry the emotion, every state is a small, reviewable change. Grok Bot, EVE and Cozmo all do this.
3. **Silhouette = identity, motion = state, text = truth.** Identity must survive a 16 px mention, state must survive at 24 px, and the meaning must also be in words for accessibility (our DESIGN-SYSTEM already says "status is always a badge and a word").
4. **Timing is personality** (Luxo Jr.). Give each agent a small, stable *temperament* (tempo, bounce, gaze restlessness) derived from its id, so two agents with the same form still move differently.
5. **Behaviour must be honest.** In a glass-box product the motion should be *driven by real events*: blinks on tool calls, gaze toward who it's talking to, typing tempo following token rate. Then the animation is information, not decoration. (This is our edge: Dots and Grok Bot animate *state labels*; we can animate *the actual trace*.)
6. **Calm crowds.** Many characters can't all loop. Use phase offsets, a cap on simultaneous big moves, and level of detail by size.

### 4.2 Proposed shared rig contract (for any language below)
Every character takes the same parameter vector, so states are presets, transitions are interpolation, and the language can change later without touching state logic:

| Param | Range | Meaning |
|---|---|---|
| `squash` | −1…1 | vertical squash (−) / stretch (+) |
| `lean` | −1…1 | tilt toward a target (another agent, you, the workspace) |
| `bob` | 0…1 | idle float amplitude |
| `tempo` | 0.3…3 | speed multiplier (temperament × state) |
| `gazeX, gazeY` | −1…1 | where the eyes look |
| `lid` | 0…1 | eyelid closure (0 = open, 1 = closed) |
| `blink` | trigger | fired by events (tool call, handoff, your message) |
| `pulse` | 0…1 | the "working" rhythm, synced to token stream |
| `tremor` | 0…1 | small shake (arguing, stuck) |
| `prop` | enum | none · bubble · spark · zzz · check · question · hand-wave (one at a time, outside the body) |

### 4.3 The nine required states as data
| State | Vector preset (shared) | Required text + badge |
|---|---|---|
| Greeting | `squash` +0.3 hop, gaze → you, blink, `prop` hand-wave (language-specific) | "Says hi" (only on app open, once) |
| Working | `pulse` synced to tokens, gaze → workspace, `lid` 0.15 | "Working" + live activity line |
| Focused (deep) | `bob` 0, `tempo` 0.5, `lid` 0.35, gaze fixed | "Focused" (long run, do not disturb) |
| Thinking | gaze up-side, slow drift, `prop` spark/bubble | "Thinking" |
| Arguing / debating | `lean` toward the other agent, alternating `tremor` bursts, mirrored | "Debating with Noor" |
| Idle / slacking | progressive (Clippy): settle → fidget → doze; never "off" | "Idle" |
| Waiting for you | gaze → the decision control, `lean` toward it, stillness | amber "Needs you" |
| Done | quick stretch → settle, `prop` check, 1.6 s | "Done" |
| Stuck / error | `lid` 0.3, small `tremor` once, then still; never alarmed | "Stuck: <reason>" |

---

## 5. Four character languages for Bench

All four are code-drawn (SVG paths plus CSS/JS springs, or a single Rive file with runtime inputs if we want an animator in the loop), driven by §4.2, and legible at 16–200 px. None uses a soft 3D blob with two slanted eye strokes. The user picks a **form** from a library plus a **hue**. Forms aren't tied to roles (a "mug" can be your engineer today and your researcher tomorrow).

### A. Die-cut — flat paper creatures

**Concept:** each agent is a **flat sticker**: a creature silhouette in its hue with a 2–3 px off-white **die-cut border** and a hard, offset paper shadow (a flat 2 px down-right shift of a darker step, not a blur). The face is **two round dot eyes with pupils** that look around, plus an optional one-line mouth used only for Done and Greeting. No limbs. Motion is **paper physics**: stickers peel, flip, flap and wobble like card.

- **Made of:** (1) one closed path per form from a library of about 24 (star, cloud, mug, TV, frog head, cat head, ghost, leaf, moon, pear, house, plug, kettle, cactus, fish, bean, bolt, shell…), each drawn once on a 100-unit grid. (2) A border stroke. (3) An offset shadow. (4) Two eye dots (white sclera + dark pupil, pupil travels inside the sclera). (5) An optional mouth arc.
- **Identity:** form × hue (24 × 10 = 240 pairs, no repeat inside a project). The **peel corner** (which corner lifts slightly at rest) is derived from the agent id, a tiny tell for duplicates.
- **States:** Greeting = the sticker **flaps** (scaleY 1 → 0.85 → 1 around the top edge) and smiles. Working = pupils scan left to right on a line, sticker "breathes" by 1 %. Focused = pupils fixed down, edge lift 0. Thinking = pupils up, a tiny paper "thought scrap" (circle) floats off and fades. Arguing = two stickers lean in and **alternate flaps**, like slapping a table. Slacking = the sticker **peels half off** and droops; at doze the eyes close to lines. Waiting = pupils lock onto the decision, the corner lifts as if "pick me". Done = flip (rotateY 180° then back) and a check stamp. Stuck = sticker **crumples** slightly (path offset noise 2 %), eyes worried, then flattens.
- **Office scene:** a **corkboard / desk mat** per project. Agents are stuck in loose clusters; arguing pairs overlap edges; a slacking agent hangs from one corner. Handoffs fly as a folded paper note between stickers.
- **Glass-box tie:** weak by default. Can attach the run's **receipt** (a little paper slip with tokens) to the sticker, "pinned work".
- **SVG sketch:** `<g filter=none><path d=form fill=hue stroke=#FFFDF8 stroke-width=6 paint-order=stroke/> <circle eye-white r=9/><circle pupil r=4.5 cx=+gazeX*3/>` + shadow = same path translated (2,2) in the deep step.
- **Risks:** the closest to Dots' creature catalogue and to every sticker pack. Round pupil eyes are generic. 24 forms need real drawing skill once. The peel and crumple effects need care to stay crisp at 24 px (turn them off below 32 px). **Most loved on first sight, least ownable.**

### B. Lit Rooms — dot-matrix faces in glass tiles

**Concept:** every agent is a **rounded glass tile** (our squircle) with a **low-res dot-matrix display** inside, like a lit office window at night. The creature (star, cloud, mug, frog…) is drawn **in lit dots** on a 9×9 grid, and its face is two dot clusters. The body never moves. **The light does all the acting:** dots brighten, scan, ripple and dim. This literally is the "lit window" app icon in BRAND.md §7, extended to every agent.

- **Made of:** (1) the tile: squircle, Ink/dark-glass fill with a top-edge highlight (one gradient). (2) A 9×9 grid of dots (81 circles, or one canvas). (3) A **form bitmap** (81 bits) for the creature silhouette, plus an eye mask. (4) Dot brightness 0–1 per dot, computed each frame from `params`. At 16–20 px it switches to a 5×5 grid with its own bitmaps.
- **Identity:** form bitmap × hue (the dots glow in the agent's hue). The bitmaps are **trivially user-editable**: the user can paint their own 9×9 creature in Create. That's the strongest "make it yours" story of the four, with no illustrator needed.
- **States:** Greeting = dots light up from the bottom like a window switching on, eyes blink, one wave of brightness. Working = a **scanline** sweeps at a tempo tied to the token rate (glass box made literal). Focused = silhouette dims to 40 %, eyes steady, tile border gets a thin hue ring. Thinking = random sparkle dots orbit the head. Arguing = two tiles flash **alternating "speech" ripples** toward each other, plus tiny `!` and `?` glyphs in dots. Slacking = the face plays a **2-dot Pong or a snake** on its own display (Cozmo boredom), then dims to "screensaver". Waiting = eyes shift to the edge nearest the decision and pulse amber (outer ring only, the dots stay in hue). Done = a check glyph in dots for 1.6 s. Stuck = a few dots "dead" (off), flicker once, then a steady `…`.
- **Office scene:** a **building façade at night**: a grid of windows, one per agent, grouped into floors by project. Busy floors glow; a slacking window plays a tiny game; arguing windows ripple at each other; a done window flashes its check. The user's arrival turns every window toward the street (the eyes look down at you). This is *exactly* "your team, in plain sight": you look into lit windows.
- **Glass-box tie:** **strongest.** The tile is the glass; the dots *are* the activity (scan speed = tokens, dead dots = errors). "Look inside" opens the window.
- **SVG sketch:** `<rect rx=28% fill=url(#glass)/>` + `<g>` of 81 `<circle r=3.2 fill=hue opacity=b[i]/>` on a 9 px pitch. One pure function `brightness(form, eyes, state, t) → number[81]`.
- **Risks:** dark tiles on a light Apple canvas are heavy in a list (mitigate: a light variant, hue dots on Porcelain glass, in lists). The dot-matrix look is shared with Rabbit r1, Teenage Engineering and retro widgets, so it can read "gadget" rather than "teammate". Lower warmth than A. 81 animated elements × 30 agents needs Canvas, not SVG, in the office scene.

### C. Wire — one living line

**Concept:** each agent is **a single continuous stroke**, a closed loop of thick, rounded ink in its hue drawing the outline of its creature, with **two small solid dots for eyes inside**. No fill (or a 6 % hue tint). The line is alive: it **morphs** between the creature and state shapes, wobbles slightly like hand-drawn ink ("line boil"), and can **unspool** into a thread that travels. This merges BRAND's rejected alternative B (the trace line) with the character: **the agent is the line of its work.**

- **Made of:** (1) one closed curve defined by **N = 64 points** or a small **Fourier series** (8–12 harmonics). Every form is a coefficient set, so any form morphs into any other by interpolating coefficients, which is what lets Grok-Bot-style "shape changes without interruption" happen without per-pair drawings. (2) Stroke width = 9 % of size (min 1.5 px). (3) Two eye dots, position from form anchors. (4) Optional "tail": the curve can open at one point and extend.
- **Identity:** form × hue × **line character** (boil amplitude, stroke cap: round / slightly brushy), derived from the agent id. A cat and a mug are instantly distinct in outline at 16 px, because outlines read as icons.
- **States:** Greeting = the line **draws itself on** (stroke-dashoffset), eyes pop in, a little loop-de-loop. Working = a bright **bead travels around the loop** at token tempo; the line boils faster. Focused = the boil stops (dead-still ink), the stroke thickens 15 %. Thinking = the top of the outline **curls into a spiral** and uncurls. Arguing = outlines become **zig-zag** on the side facing the opponent (harmonic noise), alternating. Slacking = the loop **sags** (gravity on lower points) and slowly **doodles** a spiral beside itself. Waiting = the line opens and a **thread extends to the decision control** in the UI, connecting the agent to what it needs from you. Done = the bead completes one lap and the line **ties a small knot** (a check-like flourish). Stuck = the loop gets a **tangle** (a knot of noise) at one spot; it stays until resolved.
- **Office scene:** a white canvas where each agent is a living outline, and **threads connect agents to each other while they work together** (handoff = a thread runs from one to the other; a group debate = a tangle of zig-zags in the middle). From far away it looks like a live drawing of the company: who works with whom, right now.
- **Glass-box tie:** **strong and unique.** The thread *is* the trace: from an agent to a file, to another agent, to your approval. "Look inside" = follow the thread. It unifies the avatar, handoff animation and trace view under one visual idea, which is the most ownable thing here.
- **SVG sketch:** `path d = toSmoothPath(fourier(coeffs_form ⊕ coeffs_state, t))` `fill=hue@6% stroke=hue stroke-width=9% stroke-linejoin=round` + two `<circle r=6%/>`. Morphs are a lerp on coeffs. Boil = add small noise to high harmonics at 8–12 fps (a deliberate "on twos" feel).
- **Risks:** outline-only characters are less "cute" than filled ones, so the client's warmth goal is at risk (mitigate with the 6–10 % tint fill and slightly larger eyes). The thin stroke disappears at 16 px on low-DPI Windows screens (clamp to 1.5 px min, drop boil below 24 px). Fourier tuning per form needs a small internal tool. Easy to drift into ornament if threads appear everywhere, so threads appear only for real links.

### D. Kit — snap-together geometric toys

**Concept:** each agent is **assembled from three flat geometric parts**, like a wooden toy or a Bauhaus building block set: a **body** (circle, half-disc, rounded rect, triangle, arch, square), a **topper** (cat ears, frog eye-bumps, antenna, sprout, mug handle on the side, steam, cloud puffs, star points, a TV antenna) and a **face** (eye style: dot, bar, ring, half-moon; picked per agent). Parts are hard-edged and flat, with no gradient. Personality comes from **secondary motion of the topper** (Pikmin lesson: identity on top): ears twitch, the antenna wobbles, the sprout sways, steam curls.

- **Made of:** body path (6) × topper (about 14) × eye style (4) × hue (10), with a second "accent" hue step for the topper. The creatures in the client's sheet are combinations: **cat** = circle + ear pair; **frog** = half-disc + eye bumps (eyes live in the bumps); **mug** = rounded rect + side handle + steam; **TV** = rounded rect + antenna + screen inset (eyes on the screen); **star** = star body + no topper; **cloud** = arch + puffs. Users can pick a preset creature or **shuffle** (Notion Faces).
- **Identity:** body × topper × eye style × hue: thousands of combinations, and the topper gives a 16 px tell. Two "cats" differ by eye style and hue.
- **States** (the body does squash and lean, the topper does the acting): Greeting = a hop with squash, topper springs (ears flick up, antenna boings, steam puffs). Working = the topper keeps a steady rhythm (antenna blinks, steam rises steadily, sprout sways) at token tempo; the body is still. Focused = topper **folds down** (ears back, antenna retracts, steam thins); the eyes become bars. Thinking = topper tilts, one eye half-closes, a small dot orbits the topper. Arguing = two kits lean in, **toppers bristle** (ears flat, antenna sparks, steam bursts), alternating hops. Slacking = body leans back (rotate −10°), topper droops, eyes half-lidded; at doze the topper becomes a "zzz" puff. Waiting = body leans toward the decision, topper points at it (antenna aims, ears forward). Done = a quick hop, topper does a one-shot flourish (steam heart, antenna star), check. Stuck = topper **knocked askew** (rotated 20°, stays), eyes worried, still.
- **Office scene:** a low isometric-free **"floor plan" in flat 2D**: one desk line per project, kits sitting at desks; when arguing, two kits turn to face each other across a desk; slackers lean back; deep-focus kits have their toppers down; on arrival, every topper **pops up toward you** in a quick, staggered wave (the greeting ripple). Reads instantly as a startup floor.
- **Glass-box tie:** medium. The topper is the **status antenna**: its rhythm mirrors real activity (tool calls = antenna ticks). "Look inside" could literally lift the topper off (an open-lid metaphor). Weaker than B and C as a brand idea, stronger as play.
- **SVG sketch:** `<g transform=body(squash, lean)> <path body/> <g transform=topperSpring(angle, k=180, d=12)><path topper fill=accent/></g> <g eyes/> </g>`. The topper is a damped spring on rotation and scale; one spring function drives every topper type.
- **Risks:** combinatorics can produce ugly combos (curate presets, constrain the shuffle). Hard geometric toys can look childish (keep the palette adult, the hard edges crisp, no faces with mouths). Without discipline it drifts toward Dots' creature catalogue. More design surface (about 24 parts) than B or C.

---

## 6. Comparison

| | A Die-cut | B Lit Rooms | C Wire | D Kit |
|---|---|---|---|---|
| Distance from Grok Bot | Medium (flat + border, but still a creature with eyes) | **High** | **High** | High |
| Distance from Dots | Low (creature catalogue) | High | High | Medium |
| Warmth / "startup energy" | **High** | Medium | Medium | **High** |
| Glass-box tie | Weak | **Strongest** (the window is the glass) | **Strong** (the thread is the trace) | Medium |
| 16 px legibility | Good (silhouette + border) | Good (5×5 variant) | Fair (stroke clamp) | **Good** (topper tell) |
| Cost to add a new form | One path | **81 bits** (user-paintable) | One coefficient set | One part |
| Group scene | Corkboard | **Façade of windows** | Live drawing with threads | **Desk floor plan** |
| Main risk | Generic, sticker-pack | Gadget-cold, heavy on light UI | Too delicate, too abstract | Childish, combo sprawl |

**[I] Recommendation for the client conversation:** show **C (Wire)** and **D (Kit)** side by side, with **B (Lit Rooms) as the app-icon and office-façade layer** regardless of choice (it already matches the "lit window" icon). C is the most ownable and fuses the avatar with the glass box. D best matches the client's creature sheet and the "fast-growing startup" energy. A hybrid is plausible: **D's parts kit drawn with C's living line** (filled body, ink outline that boils, threads for handoffs). Drop **A** unless the client simply prefers it; it's the one most likely to be called a copy again.

**What changes in BRAND.md if any of these is chosen:** §5 "the Look" (slanted eye strokes) is retired as the signature. The eye *behaviour* rules survive (eyes go to what needs you, eyes only, no alarms). The mark and wordmark would need redrawing from the new signature (C: the letters drawn with the living line; B: dot-matrix letters, which are risky because they're generic; D: a kit-built mark).

## 7. Next steps
1. Add the client's creature sheet to `docs/design/ui/references/`.
2. Build a one-file SVG spike per shortlisted language (C, D; B as a façade): 6 forms × the 9 states × sizes 16/24/32/96 + an office scene of 12 agents. Same §4.2 parameter vector for all, with a "Reduce motion" switch.
3. Client picks at a design review, then BRAND.md §5/§8 and DESIGN-SYSTEM avatar rules are rewritten (it's a change request against the stage-1 brand).
4. Before committing: a quick originality check (reverse image search the spike frames against Grok Bot, Dots, Muse, Rabbit, Cozmo).

## Sources
- Design Compass on Grok Bot icons: https://designcompass.org/en/wp-json/wp/v2/posts/67684
- xAI, Introducing Grok Bot: https://x.ai/news/introducing-grok-bot
- Design Compass on Dots: https://designcompass.org/en/2026/09/30/openai-dots-always-on-ai-agents/
- TechCrunch on Dots: https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/
- Fast Company on Dots (403 for us; quoted via search summary): https://www.fastcompany.com/91615068/openai-dots-agent-crew-of-friendly-mascots
- SF Standard on Dots: https://sfstandard.com/2026/09/29/openai-launches-dots/
- Duolingo, World Character visemes: https://blog.duolingo.com/world-character-visemes
- Procedural animation in Rive: https://withloveapp.substack.com/p/procedural-animation-in-rive-how?r=535ifv
- Rive docs, states: https://rive.app/docs/editor/state-machine/states
- Apple ARKit blendShapes: https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapes
- arXiv 2601.08234 (52-blendshape standard): https://arxiv.org/html/2601.08234v1
- Microsoft Agent states: https://learn.microsoft.com/en-us/windows/win32/lwef/agent-states · Get method: https://learn.microsoft.com/en-us/windows/win32/lwef/get-method
- Core77 on EVE's eyes: https://www.core77.com/posts/54328/Whats-the-One-Design-Element-That-Can-Make-a-Robot-Lovable
- designboom on Cozmo: https://www.designboom.com/technology/anki-cozmo-07-07-2016/
- Cartoon Brew on Lasseter's timing: https://www.cartoonbrew.com/animators/learn-three-storytelling-tricks-john-lasseter-147534.html
- Kirby (Wikipedia): https://en.wikipedia.org/wiki/Kirby_(character)
- Nintendo, Ask the Developer, Pikmin 4: https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-10-pikmin-4-part-1/
- Rabbit r1: https://www.yankodesign.com/2024/01/12/rabbit-r1-co-designed-with-teenage-engineering-is-a-cute-pocket-ai-assistant/ · https://www.engadget.com/rabbit-r1-hands-on-already-more-fun-and-accessible-than-the-humane-ai-pin-163622560.html
- Notion Faces: https://www.notion.com/help/notion-faces
- Meta Muse mascot: https://axios.com/2026/09/25/ai-doom-meta-muse-mascot · https://aiweekly.co/alerts/metas-muse-ships-an-18-ai-agent-behind-a-kids-toy-mascot · https://www.creativebloq.com/ai/metas-new-ai-avatar-is-making-me-feel-infantilised
- Anna Charity / Headspace: https://creativelivesinprogress.com/articles/anna-charity
