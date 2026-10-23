# Brand board B: The Proof (exploration, for client review)

**Status:** Exploration, 2026-10-22. One of the boards requested in [brand feedback round 1](../../../../requirements/interviews/2026-10-22-brand-feedback-1.md). Light-first. Visual: [board-b.html](board-b.html).
**Name:** undecided ("bench" is the codename). Nothing in the platform depends on it.

## Concept
A **riso print studio**. Paper, spot inks, crop marks, job slips, and one proofing colour.

**Essence:** *Signed by you.*
**Line:** Nothing goes out until you sign it.

**Why it fits Bench:**
- **Glass box → the proof.** In print, nothing runs until the client signs the proof. In Bench, every step is laid out where you can read it ("See the proof" opens the trace), and outward actions wait for you.
- **Team → the studio.** Each agent prints in its own spot ink. Many inks on one sheet still read as one publication.
- **Cost → the job slip.** Every ticket carries its slip: minutes, % of your week, files touched, who gets notified, all shown before you press.
- **Your call → the proofing pink.** It appears once per screen, on the decision that's yours.

## Personality
Candid (not clinical) · Crafted (not precious) · Warm (not cute) · Exact (not technical) · Deferential (not passive).

## Identity
- **Mark:** an ink block with paper eyes (one of the character family), printed slightly off a pink proof layer. **App icon:** the same on a paper tile inside crop marks. At 16 px the mark is the block and eyes only.
- **Wordmark:** the name in Schibsted Grotesk 800, lowercase, −0.05em, with a pink proof shadow offset 0.04em (shown at 32 px and up). Rename grammar: mark + 0.3 × height gap + a name of 3–8 letters at 0.72 × height.
- **Characters:** the same non-human shapes with eyes (8 shapes × 8 inks). They're printed as flat spot ink plus a halftone shade, and paper shows through as the eyes. Signature: **working agents print off-register, and done work snaps into register.** States: idle, thinking, working, needs you, done, error (circled in correction red), paused. Each state always has a word.

## Colour (hard rule: no blue)
- **Neutrals:** Paper `#f7f2e8` (60 %), Sheet `#fffcf6`, Press ink `#1f1c19` (15.2:1 on paper), Ink 2 `#4f4a43`, Ink 3 `#6e675d`, control edge `#8d8577` (3:1 UI).
- **Action:** Proofing pink `#ff4fa3`, always with an ink label and an ink outline (5.6:1). It becomes `#b8005f` for focus and text (about 5.9:1). **The action colour and the brand colour are never blue**, per your rule; there's no blue anywhere in the palette.
- **Meaning, always with a word:** needs you = yellow highlighter `#ffe14d` (ink on it, 13:1) and `#7a5a00` as text; done `#1e7a46`; error = correction red `#b42318`.
- **Agent inks, no blue and no pink:** Apricot, Ochre, Moss (Karim, replacing Periwinkle), Fern, Teal, Sage, Violet, Cocoa. Each has a deep step for names that passes AA on paper. The board computes every ratio live.
- **Dark ("the press room after hours"):** warm black `#1b1815`, the same inks slightly lifted, and the pink unchanged.

## Type
**Newsreader** (OFL) is the display face and the studio's voice. **Schibsted Grotesk** (OFL, drawn for a newspaper group) handles UI, numbers and agents, with tabular figures. Code uses the platform mono. The scale has 6 steps, with no more than 4 sizes and 2 weights in any one view. Both fonts are bundled in the app.

## Shape and depth
- Cut-paper corners: 3, 6 and 10 px.
- Hard print offsets instead of blur shadows. Only pressable or floating things get the offset.
- Tickets are perforated slips.

## Motion: printed, not animated
- **Signature moments:**
  - Into register: done work snaps together.
  - The slip travels: the handoff.
  - The highlighter: needs you, while the eyes glance at the decision.
  - The stamp: your sign-off, with "Signed · 09:20" and Undo.
  - Thinking in halftone.
  - Off the press: new items arrive.
- **Tokens:** feed `cubic-bezier(.2,.9,.25,1)`, stamp `cubic-bezier(.5,0,.2,1.4)`, durations 80–620 ms. Only the characters loop.
- **Reduced motion:** every moment rests on its final frame, and the words carry the state. The board has a preview toggle.

## Voice
- Second person, as the main agent speaks to you. Numbers first, then one next step.
- Agents write in lowercase.
- Studio words (proof, slip, signed) are used where they make things clearer, never as puns.
- Examples: "Held. Nothing sends until you've read it." · "Signed at 09:20. Noor is running the tests. Undo" · "Paused: your weekly limit is reached. 2 of 2 runs resume Mon 26 Oct at 09:00. Nothing is lost."

## Sound (on by default; mute in Settings › Sound)
The sounds come from the studio's materials: soft, dry, low, each under 300 ms.
- **Needs you:** a rubber-stamp tap, then a felt note rising a fourth (260 ms).
- **Done:** a sheet landing on a stack, with one warm wooden note (220 ms).
- **Handoff:** a paper slip sliding, panned in the direction of travel (200 ms).

Sounds never play for typing, for agents talking to each other, or for errors you didn't cause. Focus and Do Not Disturb silence them. The board plays Web Audio sketches of all three.

## Risks and open points
- Pink action and red error are both warm. They're kept apart by luminance (light fill vs dark ink), by form (filled button vs correction circle) and by a word every time. This needs checking with colour-blind simulation in stage 2.
- The paper grain is a CSS/SVG noise. In the app it must stay subtle, or be dropped on low-end GPUs.
- The pink proof layer in the mark is the one place pink appears outside a decision, and that's on purpose: the mark says "you sign".
