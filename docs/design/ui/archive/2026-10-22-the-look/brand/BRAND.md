# Brand platform: "In plain sight" (stage 1, for client review)

**Status:** Draft v1.0, 2026-10-22. Phase 5, stage 1 (brand identity and design system). Stage 2 rebuilds the hi-fi prototype on top of this, together with the UX spec.
**Inputs:** [DIRECTION.md](../DIRECTION.md) (D-UI1 to D-UI11), client feedback [round 1](../../../requirements/interviews/2026-10-22-ui-feedback-1.md) and [round 2](../../../requirements/interviews/2026-10-22-ui-feedback-2.md), [VISION.md](../../../VISION.md), [PRODUCT-MODEL.md](../../../PRODUCT-MODEL.md), the [Grok Bot teardown](../../../research/teardowns/grok-bot-ui-video.md), [references/](../references/).
**Visual:** [brand-board.html](brand-board.html) (one file, no network). **System:** [../system/DESIGN-SYSTEM.md](../system/DESIGN-SYSTEM.md), [tokens.css](../system/tokens.css), [components.html](../system/components.html).
**Name:** deferred by the client. "bench" is the codename. Nothing here depends on it: the mark carries the identity, and the wordmark is a set of drawing rules that takes any short name.

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

It's the one element that's ours already (it came from the client's avatar reference) and that ties both halves of the product idea together: **the glass box** (you look in) and **the team** (they look back). It does four jobs and appears nowhere else:

| Job | Where | Rule |
|---|---|---|
| **1. A face for every agent** | Every avatar, all 90 hue × shape combinations | The hue and the shape change; the eyes never do. That family resemblance is what makes many agents feel like one team. |
| **2. The mark** | App icon, title bar, wordmark lockup, favicon | The same eyes on an Ink squircle. The mark is the team as a whole, so it never takes an agent's hue. |
| **3. Look inside** (the glass-box handle) | Next to every agent message's cost, every run summary, file, memory note, approval | A small eyes glyph and the words "Look inside" open the trace of whatever they sit next to. One glyph, one place, everywhere (proposal P-6, replaces the "Trace" link). Your message also gets a "Seen by Noor" receipt with the same glyph. |
| **4. Attention, not alarms** | Hero avatar, tickets, approval cards | When an agent needs you, its eyes move to the thing to decide (the button, the draft, the command). The amber tag and the words carry the meaning; the eyes carry the feeling. No red dots, no pings. |

**Why not the alternatives as the signature:**
- *Glass material* (blur, translucency): it's the most copied effect of 2025–26 (OS-level "liquid glass", every generated landing page) and it costs contrast. The glass box is a promise about behaviour, so we express it as a behaviour (Look inside), not as a texture.
- *The trace line* (alternative B): honest and precise, but it serves only the glass box and turns the team into dots on a line.

**Rules for the Look**
- Eyes only. Never a mouth, brows, a nose, hands or accessories.
- Eyes are always white on an agent; Ink on the inverted mark.
- Expressions change the eye shape, never the count or the colour (see §8).
- The glyph is never used as decoration: if it's on screen, it either is someone or opens something.

---

## 6. Logo and wordmark (renameable)

### The mark
- An **Ink squircle** (continuous corners) with the white eyes, slightly above centre.
- Inverted on Ink: a white squircle with Ink eyes.
- **Never** on Cobalt (the action colour) or on an agent hue; never outlined; never with a gradient (the app icon is the only dimensional render).
- Minimum size 16 px. Below 24 px the mark stands alone, without the name.

### The wordmark: a drawing system, not a font
The letters are **drawn with the eye stroke**, so the wordmark and the mark are visibly one family.

| Rule | Value |
|---|---|
| Case | lowercase only (matches the agents' voice) |
| Construction | monoline, round ends and joins; every bowl is one circle (r 20), every arch a half circle (r 16) |
| Metrics (units) | x-height 50, ascender 80, stroke 10 (equal to the eye width at lockup scale) |
| Spacing | optical: round to round 8, straight to round 10, straight to straight 14 |
| Never | capitals, italics, contrast, outlines, gradients, a hue |

**Rename grammar (any short name):** `[mark] + gap of 0.36 × mark height + [name, 3 to 8 lowercase letters]`, with the name drawn to the rules above at 0.8 × the mark's height, bottoms aligned. Until a name is drawn, the fallback is the name set in the display face at 600 with −0.03em tracking. The board shows "bench" drawn and the 3, 5 and 8 letter slots.

**Clear space:** one eye height on every side of the lockup.

---

## 7. App icon

**Concept: a lit window at night.** A dark glass squircle (Ink, lighter at the top edge like real glass), the white eyes, and the team's colours glowing low inside, as if the room behind the glass is still at work. It's the only place the brand uses the full spectrum of hues.

- **Why it works:** it reads as one object in a dock or taskbar full of flat, bright tiles; it says "a team inside a glass box" without a word; the eyes make it a character, so it's recognisable at 16 px.
- **macOS:** full-bleed squircle at Apple's icon grid, with the system's own shadow.
- **Windows:** the same artwork in the ICO sizes (16 to 256). Below 32 px the glow is dropped (it turns to mud) and the icon is the flat mark.
- **Linux:** the PNG set from the macOS master.
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
| Expressions | Calm (idle, needs you) · Curious (thinking) · Focused (working) · Pleased (done, 1.6 s) · Concerned (blocked, error: never alarmed) · Sleepy (paused, stopped) · Surprised (interrupted, 0.4 s). **Change from v0.2:** Idle is now calm (eyes open, slow blink) and only Paused sleeps, so "idle" never reads as "off"; Error is concerned, not surprised. |
| How you get one | At Create, Atlas proposes a shape and a free hue from the job. You keep it or pick: hues already used in the project are dimmed. The preview blinks when you choose; that first blink is the agent's birth moment. |
| Unassigned | A grey "Unassigned" shape with closed eyes, used only while an agent is being drafted. |
| Group | The team chat uses a cluster of three members' avatars; stacks show four and a count. |

---

## 9. Colour and type identity (summary; values in the design system)

- **Ink `#15171d`, Porcelain `#f3f4f7`, Cobalt `#2e5bff`.** The three chrome colours share one faint blue undertone, so the chrome, the text and the one action read as one material (proposals P-1 and P-2). 60 % Porcelain, 30 % white and Ink, 10 % meaning.
- **Meaning colours:** Cobalt for the one action per screen, amber for *needs you*, green for done, red for errors, always with a word.
- **Agent hues** live only on their own things: avatar, name tag, mention chip, your bubbles in their chat, the faint wash behind their conversation, their thinking dots. Never on a button.
- **Type:** the platform's own grotesk (SF Pro on macOS, Segoe UI Variable on Windows, Inter on Linux), two weights (400 and 600), six far-apart steps with at most four in one view (proposal P-3). Identity comes from the drawn wordmark, not from a downloaded face.
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

- **Silent by default.** It's a work app that runs all day; sound is a choice you make, not one we impose.
- **Three optional sounds** (Settings › Notifications, off by default), each under 300 ms, soft, pitched low, from one family: *needs you* (two soft notes, rising), *done* (one rounded note), *handoff* (a short airy pass). Never a sound for agents talking to each other, for typing or for errors you didn't trigger.
- Respect the OS: Focus and Do Not Disturb silence everything; the notification itself uses the OS sound setting.
- **Haptics:** none in v0.1 (Electron has no reliable desktop haptics). If a macOS build adds them later: one light tap when a dragged project snaps to the split.

---

## 12. Directions considered

| | **A · In plain sight** (recommended) | B · The Thread | C · Daylight Studio |
|---|---|---|---|
| Idea | A glass box with a team inside | An instrument: follow the work | A warm studio of characters |
| Signature | The Look (eyes): face, mark, Look inside, attention | One live line through every step, changing hue at each handoff | Plush dimensional characters everywhere, screens washed in the agent's colour |
| Chrome | Ink, Porcelain, Cobalt | Ink on white, numbers forward | Warm washes, rounder type |
| Strength | Serves both halves: the glass box and the team | The most honest about cost and steps | The most lovable at first sight |
| Weakness | Needs restraint so the eyes stay meaningful | Cold; the team becomes dots; thin lines drift into ornament | Cute beats premium; serious moments (cost, delete, deny) lose weight; tiring by hour six |

**Recommendation: A.** It's built from the one idea that was already ours, it makes the glass-box promise visible as behaviour, and it stays calm enough for an all-day work app.

---

## 13. What changed from the v0.2 look, and why

| Area | v0.2 | Now | Why |
|---|---|---|---|
| Identity | No mark; eyes only inside avatars | The Look: mark, wordmark, icon, glass-box handle, attention | One signature, used for jobs, not decoration |
| Neutrals | Apple Frost/Carbon | Porcelain/Ink with one shared undertone (P-1) | Our own material; still Apple-calm |
| Action | Apple Blue `#0071e3` | Cobalt `#2e5bff` (P-2) | Ownable, deeper, AA as text and as fill |
| Agent hues | 10 incl. Periwinkle | Pear replaces Periwinkle (P-4) | A blue-violet agent ink read like a link next to the action blue |
| Type | 7 sizes (14 and 15 both), 300 subheads | 6 steps far apart, ≤ 4 per view, 400/600 only, native face (P-3) | Fewer, clearer steps; native feel on each OS |
| Shape | 8 px cards, 18 px bubbles, 980 px pills | One continuous-corner family (P-5) | One shape language |
| Depth | No shadows anywhere | Tone first; shadows only on what floats | Menus and dialogs need to float |
| Inputs | 1.5:1 hairline edges (open v0.2 item) | 3.4:1 control edge | WCAG 1.4.11 |
| Expressions | Idle sleepy, error surprised | Idle calm, paused sleepy, error concerned | Idle ≠ off; recovery, not alarm |
| Trace link | "Trace" | "Look inside" with the eyes (P-6) | The glass box gets one handle |
| Motion | Ease curves | Springs (smooth, snappy, gentle) with stated parameters | Physics; characters only overshoot |

---

## 14. Decisions for you

| # | Decision | Options | Recommended |
|---|---|---|---|
| B-1 | Direction | A In plain sight · B The Thread · C Daylight Studio | **A** |
| P-1 | Signature neutral | Porcelain + Ink · keep Apple Frost + Carbon | **Porcelain + Ink** |
| P-2 | Action colour | Cobalt `#2e5bff` · keep Apple Blue `#0071e3` | **Cobalt** |
| P-3 | Typeface | Platform's own face · bundle Inter everywhere | **Platform's own** |
| P-4 | Pear replaces Periwinkle | Yes · keep Periwinkle | **Yes** |
| P-5 | Continuous corners | Yes · plain rounded corners | **Yes** |
| P-6 | "Look inside" replaces "Trace" | Yes · keep the word Trace | **Yes** |
| P-7 | Sound | Silent by default with 3 optional sounds · always silent · sounds on | **Silent by default** |
| B-2 | App icon | Lit window (dark glass + glow) · flat Ink mark | **Lit window** |

Still deferred, by your choice: the name (D-UI5). Dark mode is mapped but not built (Phase 5b).
