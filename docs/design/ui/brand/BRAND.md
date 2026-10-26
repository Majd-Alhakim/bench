# Brand platform: "In plain sight"

**Status:** v1.2, 2026-10-24. **Every brand decision is closed.** The name is **Eucas** ([decision](../../../requirements/interviews/2026-10-24-product-name.md)). Brand round 2 ([client notes](../../../requirements/interviews/2026-10-23-brand-decisions.md)) kept the brand and Porcelain / Ink / Cobalt, chose the **Quartet** logo, **Instrument Sans + JetBrains Mono**, and the **three sounds on by default**. Explorations it chose from: [explorations/](explorations/) (read-only).
**Inputs:** [DIRECTION.md](../DIRECTION.md) (D-UI1 to D-UI11), client feedback [round 1](../../../requirements/interviews/2026-10-22-ui-feedback-1.md), [round 2](../../../requirements/interviews/2026-10-22-ui-feedback-2.md) and [brand round 2](../../../requirements/interviews/2026-10-23-brand-decisions.md), [VISION.md](../../../VISION.md), [PRODUCT-MODEL.md](../../../PRODUCT-MODEL.md), the [Grok Bot teardown](../../../research/teardowns/grok-bot-ui-video.md), [references/](../references/).
**Visual:** [brand-board.html](brand-board.html) (one file; fonts from Google Fonts for review). **Logo files:** [logo/](logo/) (`mark.svg`, `mark-on-dark.svg`, `app-icon-macos.svg`, `app-icon-windows.svg`, `favicon.svg`, `lockup.svg`). **System:** [../system/DESIGN-SYSTEM.md](../system/DESIGN-SYSTEM.md), [tokens.css](../system/tokens.css), [components.html](../system/components.html).
**Name:** **Eucas** ("you-kuz"), set lowercase as `eucas` in the lockup. One agent is **a Euca** ("you-ka"), and the team is the Eucas; Atlas is your first Euca. It comes from Tolkien's *eucatastrophe*, the sudden turn in a story from doom to a happy ending: your half-built idea, seen through. You stay the hero; the Eucas are the crew. The name was first Euca, but EUCA is registered for software in the EU and UK, so the product took the team's name. Trademark findings, risks and follow-ups are in the [decision](../../../requirements/interviews/2026-10-24-product-name.md); the domain **eucas.app** is ours. "Bench" stays the codename in the repo until the rename task.

The client's brief for this pass: *"it feels like normal and with no clear identity that makes it unique; it needs a brand and a design system that make it feel premium."*

---

## 1. Why v0.2 felt "normal"

v0.2 did what was asked (Apple foundation, one blue, shape avatars) and that is exactly why it read as generic. Every visible decision was borrowed:

| v0.2 element | Where it came from | What it signals |
|---|---|---|
| `#f5f5f7` canvas, `#1d1d1f` text, `#0071e3` buttons | Apple's web palette, unchanged | "A template of Apple" |
| Inter / Segoe at Apple tracking, 300-weight subheads | Apple's marketing type | Marketing page, not a tool |
| White 8 px cards, 980 px pills, 18 px bubbles | Three radius systems side by side | Assembled, not designed |
| "Bench (codename)" in plain text | No mark | No product |
| Eyes on the avatars | The one original idea, used only inside the avatars | Identity existed but stayed local |

The fix isn't more decoration. It's taking the one original idea (agents as shapes with eyes), making it the brand's signature, and giving the chrome its own material.

---

## 2. The idea

**Essence:** *in plain sight.*

**One line:** Your team, in plain sight: a desktop team of agents you can see through.

**What it is:** your own company of agents on your desktop, with every step, prompt, token and file open to you.

**How it should feel:** calm control. Like looking through clean glass into a well-lit workshop at night: busy, warm, nothing hidden. When someone inside needs you, they look up.

**What it promises:**
1. You see it before it happens (cost, files, recipients).
2. You can take it back (Undo, Stop, Deny, nothing sends until you've read it).
3. The team gets better at working for you, and you can see why (lessons, applied preferences, memory you can read and export).

**Positioning in one sentence:** other agent teams feel like magic and hide the bill; this one feels like a studio you can see into.

---

## 3. Personality

| Trait | Not | In practice |
|---|---|---|
| **Candid** | clinical | Says what it did, what it cost and what it couldn't do, in plain words. Numbers over adjectives. |
| **Calm** | sleepy | Quiet chrome, alive characters. Nothing flashes or pings without a reason, and the team still feels present. |
| **Warm** | cute | Characters with eyes, never mascots with jokes. No exclamation marks, no emoji in the interface. |
| **Precise** | technical | Exact times, counts and percentages. Jargon stays in the trace, one click away. |
| **Deferential** | passive | You are the founder. The team proposes, drafts and asks; it never acts outward on its own. |

---

## 4. Voice and tone

### Rules (confirmed, carried forward)
1. **The app speaks to you, as the main agent would** (U8): "What needs you", "You're all caught up", "Tell you when Noor needs you". Never "me" or "my" for the client.
2. **Agents write in lowercase**, first person, short and concrete: "on it.", "done. swapped in date-fns, 41 lines removed." Interface text, system lines and your own messages stay in sentence case.
3. **Numbers first, reassurance second, one next step last.** "Paused: your weekly limit is reached. 2 of 2 runs resume Mon 26 Oct at 09:00. Nothing is lost."
4. **No system words in your view:** "Bench picked Karim", not "Router selected agent". "Look inside", not "Trace" (proposal P-6).
5. **Framing:** an invitation, not a transaction; progress, not failure. Never blame.

### Tone by moment
| Moment | Tone | Example |
|---|---|---|
| Routine status | Light, brief | "Morning briefing sent · 0.1 % of your week" |
| Needs you | Direct, with the cost up front | "Noor wants to run npm test in bench. About 3 minutes, 0.9 % of your week." |
| Outward action | Reassuring and exact | "Held for you. Nothing sends until you've read it." |
| Failure | Calm, cause first, what's safe, one next step | "The test run stopped: out of memory. Noor kept her changes and the 09:12 checkpoint. Retry with 2 workers?" |
| Success | Quietly satisfied, then the next thing | "All green. PR #44 is ready for your review." |
| Money and usage | Factual, never alarming | "84 % of your week · resets Mon 09:00" |
| Destructive | Names the object and the consequence | "Delete Noor? Her 46 notes and 312 runs are removed from this machine." |

### Write / not
| Write | Not |
|---|---|
| What needs you · 3 | Pending items (3) |
| Noor wants to run **npm test** in bench. Allow once? | Permission request: tool execution (Bash). Approve? |
| Paused: your weekly limit is reached. Resumes Mon 26 Oct at 09:00. Nothing is lost. | Error 429: rate limit exceeded. |
| done. swapped in date-fns, 41 lines removed. | Great news! 🎉 I have successfully completed the task! |
| Atlas drafted Lumen. Nothing is created until you press Create. | Agent created successfully! |
| The draft to Dana is held. Nothing sends until you've read it. | Are you sure you want to continue? |
| Not sent: you're offline. Kept here. Retry | Message failed. |
| Run now · ≈ 0.4 % of your week | Run |
| Couldn't load the trace. Last good at 09:14. Retry | Something went wrong. |
| Applied what Noor learned on 22 Oct: use the repo's date library | Using memory… |
| You're all caught up. The team is working on 7 things. | No items. |
| Delete Noor | Confirm |

---

## 5. The signature: the Look

**Committed:** the signature is **the Look**, the pair of slanted eye strokes. Two rounded pills, rotated −12°, about 2.6 times as tall as they are wide.

It's the one element that's ours already (it came from the client's avatar reference) and that ties both halves of the product idea together: **the glass box** (you look in) and **the team** (they look back). It does three jobs and appears nowhere else:

| Job | Where | Rule |
|---|---|---|
| **1. A face for every agent** | Every avatar, all 90 hue × shape combinations | The hue and the shape change; the eyes never do. That family resemblance is what makes many agents feel like one team. |
| **2. Look inside** (the glass-box handle) | Next to every agent message's cost, every run summary, file, memory note, approval | A small eyes glyph and the words "Look inside" open the trace of whatever they sit next to. One glyph, one place, everywhere (P-6, replaces the "Trace" link). Your message also gets a "Seen by Noor" receipt with the same glyph. |
| **3. Attention, not alarms** | Hero avatar, tickets, approval cards | When an agent needs you, its eyes move to the thing to decide (the button, the draft, the command). The amber tag and the words carry the meaning; the eyes carry the feeling. A soft "needs you" sound (§11) helps when you're in another window; there are still no red dots. |

**Retired (2026-10-23): "the eyes as the logo".** The eyes-on-a-squircle mark and the lit-window icon are replaced by the Quartet (§6). The eyes stay where they mean something: on the agents' faces and on Look inside. That keeps the Look from becoming wallpaper.

**Why not the alternatives as the signature:**
- *Glass material* (blur, translucency): it's the most copied effect of 2025–26 (OS-level "liquid glass", every generated landing page) and it costs contrast. The glass box is a promise about behaviour, so we express it as a behaviour (Look inside), not as a texture.
- *The trace line* (alternative B): honest and precise, but it serves only the glass box and turns the team into dots on a line.

**Rules for the Look**
- Eyes only. Never a mouth, brows, a nose, hands or accessories.
- Eyes are always white on an agent; the Look inside glyph takes the colour of its text.
- Expressions change the eye shape, never the count or the colour (see §8). Only the eight faces of the eye grammar exist ([companion DESIGN §2.3](../companion/DESIGN.md#23-the-eye-grammar-the-only-faces)).
- The glyph is never used as decoration: if it's on screen, it either is someone or opens something.

---

## 6. Logo: Quartet (B-2, decided 2026-10-23)

**The story.** Four seats, four different characters. The team is the logo: a sphere, a triangle, a rounded square and a droplet, cut from the same bodies your agents wear, sitting together in a 2 × 2. Every agent you create is one of these shapes, so the mark means "your team" before anyone reads a word, and it survives any name. The client chose it on 2026-10-23: *"I liked the logo of the quadrat the most."*

Files: [logo/](logo/). Source of truth for the geometry: [`logo/quartet.py`](logo/quartet.py), which writes every master; edit its `spec()`, not the SVGs. **Refined 2026-10-24** after the client's logo videos ([lessons](logo-lessons.md)): the triangle and droplet were about a third lighter than the sphere and square, so the mark leaned left; the gaps ran 8 to 13.5; the triangle was a stroke. Now the weights are close, the gaps are even, the triangle is a drawn equilateral, and the reversed mark is shaved 0.6 so it doesn't look heavier on dark.

### The mark
| Rule | Value |
|---|---|
| Grid | A 100-unit square split into four 50-unit seats; one character per seat |
| Shapes | Sphere `r 20.2` at (25, 25) · equilateral triangle, apex (75, 2), base at y 44.5, corners `r 4.5` · square 37 at `r 11` from (7, 57) · the avatar droplet at 0.485, centred on x 74.5, base at y 95 |
| Gaps | 11.8 to 14 between neighbours (8.3 at the droplet's tip, which reads wider), so the four still separate at 16 px |
| One colour (the default) | Ink `#15171d` on light grounds (`mark.svg`); Porcelain white `#eceef3` on Ink and dark grounds (`mark-on-dark.svg`). The mark is the team as a whole, so in the interface it never wears an agent's hue |
| Colour | Coral, Honey, Mint, Orchid (`#ff5f73`, `#f2ab1d`, `#3cc47c`, `#e05cb4`), fixed. Only on the app icon and brand moments (first open, the brand board). They never follow your agents' hues |
| Minimum size | 16 px. Below 24 px the mark stands alone, without the name |
| Clear space | A third of the mark's height on every side |
| Never | Four squares (that's a tile logo, and the mixed shapes are what keep it ours), a fifth shape, a rearranged order, one shape recoloured in an agent's hue, an outline, a box around it, Cobalt |

### The lockup (renameable)
`[mark] + gap of 0.36 × mark height + [name]`, the name in **Instrument Sans 600** at 0.84 × the mark's height, lowercase, tracking −0.035em, centred on the mark (`lockup.svg`). Any 3 to 8 lowercase letters take the same slot; the board shows the 3, 5 and 8 letter slots. `lockup.svg` sets `eucas` as live text; convert it to outlines before shipping.

The drawn monoline wordmark of v1.0 (letters built from the eye stroke) is retired with the eyes mark: with Quartet, the identity is the shapes, and the name is simply set well.

---

## 7. App icon

**Concept: four seats on dark glass.** An Ink glass tile, slightly lighter along its top edge, with the Quartet in full colour. It's the only everyday place the mark wears colour, so it reads as one bright, friendly object in a dock or taskbar.

- **Why it works:** it shows a team, not a tool; the four different shapes are recognisable at 16 px (gaps ≥ 8 units); and it isn't another blue or purple gradient tile.
- **macOS** (`app-icon-macos.svg`, 512 master): continuous-corner squircle, the mark at 56 % of the tile, with the system's own shadow.
- **Windows** (`app-icon-windows.svg`, 256 master): a rounded tile (r 10 of 100), the mark at 60 %, exported to the ICO sizes 16 to 256.
- **Linux:** the PNG set from the macOS master.
- **Favicon** (`favicon.svg`): the one-colour mark, Ink, switching to `#eceef3` when the browser is dark.
- **Taskbar states (later):** a small amber dot on the icon when something needs you; never a number bigger than the OS badge allows.

---

## 8. Illustration and avatar language

**The avatars are the only illustration.** No spot illustrations, no stock 3D, no people.

| Aspect | Rule |
|---|---|
| Family | 9 shapes (sphere, droplet, cloud, hexagon, blob, egg, pill, triangle, rounded square) × 10 hues = 90 identities. A pair is never used twice inside one project (D-UI8). |
| Character | Non-human on purpose: agents are characters, not people pretending. Eyes only. |
| Two renders, one design | **Flat** (the base hue, white eyes) in lists, chat lines, tickets, mentions. **Soft dimensional** (radial light, a highlight, a soft ground shadow, no fur or noise) at the top of a conversation, on the profile and in the hero row (D-UI2). |
| Sizes | 16 mention · 24 ticket and stack · 32 chat and sidebar · 40 lists and approvals · 64 profile · 96 hero. Status badge from 24 px; at 96 px the status is a line under the name. |
| Status | Always a word too (tag, label or the line under the hero). Badge glyphs: Idle ring, Thinking dots, Working arc, Needs you "!" on amber, Blocked bar on Ink, Paused bars, Error "×" on red, Done check on green. |
| Expressions | **Since 2026-10-26 (founder: "make sure everyone is using this faces everywhere"), the only faces are the eye grammar's eight:** Calm · Focused · Glance · Toward you · Concerned · Sleepy · Pleased · Closed, with the state → face table in [companion DESIGN §2.3](../companion/DESIGN.md#23-the-eye-grammar-the-only-faces). **Retired:** Curious and Surprised. *Was (team-of-agents era): Calm (idle, needs you) · Curious (thinking) · Focused (working) · Pleased (done, 1.6 s) · Concerned (blocked, error) · Sleepy (paused, stopped) · Surprised (interrupted, 0.4 s).* |
| How you get one | At Create, Atlas proposes a shape and a free hue from the job. You keep it or pick: hues already used in the project are dimmed. The preview blinks when you choose; that first blink is the agent's birth moment. |
| Unassigned | A grey "Unassigned" shape with closed eyes, used only while an agent is being drafted. |
| Group | The team chat uses a cluster of three members' avatars; stacks show four and a count. |

---

## 9. Colour and type identity (summary; values in the design system)

- **Ink `#15171d`, Porcelain `#f3f4f7`, Cobalt `#2e5bff`.** The three chrome colours share one faint blue undertone, so the chrome, the text and the one action read as one material (P-1 and P-2, decided 23 Oct). 60 % Porcelain, 30 % white and Ink, 10 % meaning.
- **Meaning colours:** Cobalt for the one action per screen, amber for *needs you*, green for done, red for errors, always with a word.
- **Agent hues** live only on their own things: avatar, name tag, mention chip, your bubbles in their chat, the faint wash behind their conversation, their thinking dots. Never on a button.
- **Type (P-3, decided 2026-10-23):** **Instrument Sans** in two weights (400 and 600) for everything, and **JetBrains Mono** for code, commands, diffs and the trace. Both SIL OFL 1.1 and bundled with the app, so every OS reads the same. Six far-apart steps with at most four in one view. Why: precise like a grotesk, warm in its curves, and its 600 gives the lockup a voice without looking like every other dev tool (Inter, Geist).
- **Shape:** one continuous-corner family (squircles where the engine draws them), pills for buttons (proposal P-5).

---

## 10. Motion personality: calm and alive

1. **The chrome is an object with weight.** Panels, tickets and sheets move on critically damped springs: they arrive and settle, they never bounce.
2. **Only the characters move on their own.** Breathing and blinking on the hero avatar is the only loop in the product. Everything else moves because something happened.
3. **Every movement says something:** who has the work (the handoff chip travels), what just landed (checks cascade), who needs you (the eyes glance).
4. **Spatial continuity:** things leave the way they came; the open ticket keeps its place while the others shrink; a pane slides from the side it lives on.
5. **Reduced motion keeps the information:** the same state arrives at rest, by crossfade or instantly.

**Signature moments** (pinned, 2–3 per flow):

| Flow | Moments | Goal |
|---|---|---|
| Create an agent | **Birth** (the shape takes its hue, the eyes open, one blink) · the "Renamed to Lumen" system line | Belonging, delight |
| Approve a request | **The glance** (eyes go to the request) · "Allowed once" toast with Undo | Trust, relief |
| A task finishes | **Green finish** (checks land in order, the eyes relax into a smile) | Progress, peak-end |
| Handoff | **The brief travels** (a chip flies from Maya to Noor and lands) | Understanding |
| Learning | **Applied** chip glows once the first time a lesson is used | Visible intelligence |
| Usage limit | Calm paused state with the exact resume time; the avatar sleeps, it doesn't panic | Relief (recovery paradox) |

---

## 11. Sound and haptics (desktop)

**P-7, decided 2026-10-23:** *"the sounds are good."* The three sounds from the explorations page, as designed, **on by default**, with a mute in Settings › Notifications.

- **Needs you:** two rising notes (A4 → D5), 320 ms. A light tap on the shoulder that asks rather than warns; the only one that wants you to look. Plays when an approval or question lands in What needs you while Bench isn't the window you're in.
- **Done:** one rounded note (F♯5), 380 ms, quietly satisfied. Plays when a task or run you started finishes all green, or a ticket you decided resolves, while you're elsewhere.
- **Handoff:** a soft breath moving left → right with a small rising glide, 290 ms, the way the handoff chip crosses the screen. Plays when an agent hands work to another in the project you're viewing.
- **First open of the day** (optional, **off by default**): D5, A5, E6 in stacked fifths, 900 ms, the studio lights coming on. Something you turn on, not something you get.
- **Why on by default:** each of the three carries information you'd otherwise have to look for; all are soft, short (under 400 ms), pitched in one key and never alarming. Never a sound for agents talking to each other, for typing, for every step of a run, or for errors you didn't trigger.
- **Sound is separate from motion:** reduced motion doesn't mute them, and every sound has a visible twin (the amber ticket, the green finish, the travelling chip), so nothing depends on hearing.
- Respect the OS: Focus and Do Not Disturb silence everything; the OS notification itself uses the OS sound setting. Full spec: DESIGN-SYSTEM §8.5.
- **Haptics:** none in v0.1 (Electron has no reliable desktop haptics). If a macOS build adds them later: one light tap when a dragged project snaps to the split.

---

## 12. Directions considered

| | **A · In plain sight** (recommended) | B · The Thread | C · Daylight Studio |
|---|---|---|---|
| Idea | A glass box with a team inside | An instrument: follow the work | A warm studio of characters |
| Signature | The Look (eyes): face, Look inside, attention; the Quartet mark (since 23 Oct) | One live line through every step, changing hue at each handoff | Plush dimensional characters everywhere, screens washed in the agent's colour |
| Chrome | Ink, Porcelain, Cobalt | Ink on white, numbers forward | Warm washes, rounder type |
| Strength | Serves both halves: the glass box and the team | The most honest about cost and steps | The most lovable at first sight |
| Weakness | Needs restraint so the eyes stay meaningful | Cold; the team becomes dots; thin lines drift into ornament | Cute beats premium; serious moments (cost, delete, deny) lose weight; tiring by hour six |

**Recommendation: A.** It's built from the one idea that was already ours, it makes the glass-box promise visible as behaviour, and it stays calm enough for an all-day work app.

---

## 13. What changed from the v0.2 look, and why

| Area | v0.2 | Now | Why |
|---|---|---|---|
| Identity | No mark; eyes only inside avatars | The Look (faces, glass-box handle, attention) and the Quartet mark, icon and lockup (v1.1) | One signature for behaviour, one mark for the team |
| Neutrals | Apple Frost/Carbon | Porcelain/Ink with one shared undertone (P-1) | Our own material; still Apple-calm |
| Action | Apple Blue `#0071e3` | Cobalt `#2e5bff` (P-2) | Ownable, deeper, AA as text and as fill |
| Agent hues | 10 incl. Periwinkle | Pear replaces Periwinkle (P-4) | A blue-violet agent ink read like a link next to the action blue |
| Type | 7 sizes (14 and 15 both), 300 subheads, Inter | 6 steps far apart, ≤ 4 per view, 400/600 only, Instrument Sans + JetBrains Mono, bundled (P-3) | Fewer, clearer steps; a face of our own that reads the same on every OS |
| Sound | None | Needs you, done, handoff, on by default (P-7) | Information you'd otherwise have to look for |
| Shape | 8 px cards, 18 px bubbles, 980 px pills | One continuous-corner family (P-5) | One shape language |
| Depth | No shadows anywhere | Tone first; shadows only on what floats | Menus and dialogs need to float |
| Inputs | 1.5:1 hairline edges (open v0.2 item) | 3.4:1 control edge | WCAG 1.4.11 |
| Expressions | Idle sleepy, error surprised | Idle calm, paused sleepy, error concerned | Idle ≠ off; recovery, not alarm |
| Trace link | "Trace" | "Look inside" with the eyes (P-6) | The glass box gets one handle |
| Motion | Ease curves | Springs (smooth, snappy, gentle) with stated parameters | Physics; characters only overshoot |

---

## 14. Decisions

| # | Decision | Decided |
|---|---|---|
| B-1 | Direction: A · In plain sight | 22 Oct |
| **B-2** | **Logo, app icon, favicon, lockup: Quartet** (replaces the lit-window eyes mark) | **23 Oct** |
| **P-1** | **Porcelain + Ink**, kept as built | **23 Oct** |
| **P-2** | **Cobalt `#2e5bff`**, kept as built (supersedes the 22 Oct "not blue" note) | **23 Oct** |
| **P-3** | **Instrument Sans 400/600 + JetBrains Mono**, OFL, bundled | **23 Oct** |
| **P-4** | **Pear replaces Periwinkle** (Karim) | **23 Oct** |
| P-5 | Continuous corners, one family (R3) | 22 Oct |
| P-6 | "Look inside" replaces "Trace" | 22 Oct |
| **P-7** | **Sound: needs you, done, handoff on by default, mute in Settings; first-open chime optional, off** | **23 Oct** |

Boards B ("The Proof") and C ("Night Glasshouse") stay as explorations only. The name (D-UI5) is **Eucas**, decided 24 Oct. Dark mode is mapped but not built (Phase 5b).
