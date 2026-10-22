# Brand explorations, round 2 (for client review)

**Date:** 2026-10-22 · **Input:** [brand feedback round 1](../../../../requirements/interviews/2026-10-22-brand-feedback-1.md), plus the client's correction of P-4: *"I meant the color for me, blue is what others uses, Karim is not the issue."*
**Visual:** [explorations.html](explorations.html) (one file; fonts load from Google Fonts for review only).
**Not changed:** the characters (nine shapes with eyes), the ten agent hues (Karim keeps **Pear**, as proposed), the name (still the codename "bench").

Each section has options, a recommendation, and what the client has to choose. Nothing here is decided until the client picks.

---

## 01 · Logo directions (6)

**Constraint applied:** no slanted eye-stroke pair as the logo (Grok-like), no X shapes, nothing Claude/Anthropic-like (no starburst or asterisk, no orange-on-cream). The eyes stay the agents' face only. This retires job 2 of "the Look" in BRAND.md §5 (the mark); the other three jobs (face, Look inside, attention) are unaffected.

Each direction is shown on light and dark, as a macOS squircle and a Windows tile, as a real 16 px favicon (rasterised, then enlarged 4× so you can judge the pixels), at taskbar sizes 32/24/16, and locked up with "bench".

| | Direction | Idea | Survives a rename? | Watch |
|---|---|---|---|---|
| **A** | **Seated** (team mark) | Three different shapes sitting on one bench line: the team, together | Yes: it's a picture, not a word | Keep the 5-unit gaps so the shapes separate at 16 px |
| B | Glass box (window) | A rounded window with a small lit dome inside: you can always see in | Yes | A bigger dome reads as a sunrise or a record button |
| C | Quartet (character symbol) | Four character bodies (sphere, triangle, square, droplet) in a 2 × 2 | Yes | 2 × 2 grids recall Microsoft/Slack tiles; the mixed shapes keep it ours |
| D | Trace (line) | One unbroken line with an over-under loop where work changed hands | Yes | Line marks drift towards generic "flow" logos; thins at 16 px |
| E | Monogram | A lowercase b whose counter is a lit window | **No**: the letter is the mark | Crowded space (Behance, Bitwarden, Beeper) |
| F | Wordmark only | "bench" drawn as one monoline, a light in the b | Partly: the rules survive, the drawing doesn't | The app icon falls back to the b, so it carries E's rename risk |

**Recommendation: A · Seated.** It's the only mark that shows what Bench *is* (different agents, one team), it echoes the codename without depending on it, it renders cleanly at 16 px, and in colour (the app icon) it carries three agent hues on Ink, so the icon is the team. **Runner-up: B · Glass box**, if the client wants the transparency promise to lead instead of the team.

Conflict check (visual, not legal): no close match found among common dev-tool, AI and productivity marks for A or B. A trademark search is still needed before v0.1 goes public, together with the name.

---

## 02 · Brand colour: non-blue first (5 + baseline)

**Client correction:** the issue is *Bench's own* colour (the action colour), not Karim's. Blue is what others use. So five non-blue palettes lead and Porcelain + Cobalt is last, marked "Baseline · blue = what others use".

Each palette = canvas, surface, ink, secondary text, hairline + one action colour + feedback (done, needs you, error), applied to the same mini app (sidebar, a Needs-you ticket with its one primary button, a chat bubble, status tags) and paired with the Seated lockup and two app icons. **All contrast ratios on the page are computed live from the hex values** (WCAG 2.x formula); every pair shown passes AA (4.5:1 text, 3:1 UI).

| Palette | Action | Feeling | Watch |
|---|---|---|---|
| **Bone + Aubergine** | `#7a2e73` | Adult, warm, rare in software | Lavender/Orchid agents are distant cousins; agent hues never sit on buttons, and aubergine is much darker |
| Paper + Ink | `#141416` (ink) | Maximum restraint: the team is the only colour | It isn't really "a colour of your own" |
| Mist + Spruce | `#0b6b5d` | Quiet, natural, a kept workshop | Neighbours the done green; done moves to olive `#3b7417` and always shows its check and word |
| Fog + Fuchsia | `#b0127a` | Bold, energetic, unmistakable | Less calm all day; near Orchid (Jade) |
| Night + Lime (dark-first) | `#cdf25c` with dark label | The most distinctive; a lit cursor | Neighbours Pear (Karim) and done; dark-only, so light mode needs another action |
| Porcelain + Cobalt (baseline) | `#2e5bff` | The current system | Blue: what others use |

**Recommendation: Bone + Aubergine.** It's a colour the client can own (almost no software brand uses it), it means nothing else in the interface (it isn't done-green, needs-you amber or error red, so the meaning colours stay clear), and it's dark enough to stay calm for an all-day tool. White on it is about 8.5:1 and it works as link text on white (AAA). **Runner-up: Paper + Ink**, if the client prefers no brand hue at all.

If chosen, the system change is small: `--action*`, `--focus`, `--action-tint` and the neutral primitives in `tokens.css`; the agent hues and meaning colours stay. The dark-theme values still need their own verification pass.

---

## 03 · Typefaces (6 pairings, all SIL OFL 1.1)

Each pairing is set with real Bench copy: a headline, "What needs you · 3", an approval sentence, an agent's lowercase line, usage numbers (tabular) and a trace in mono with the ambiguity test `Il1| O0`.

| Pairing | Character | Licence |
|---|---|---|
| **Instrument Sans + JetBrains Mono** | Calm, precise, quietly warm | OFL 1.1 (both) |
| Geist + Geist Mono | Precise, technical; reads as "another dev tool" | OFL 1.1 (both) |
| Bricolage Grotesque + Figtree + DM Mono | Warmest, most personality; three files | OFL 1.1 (all) |
| Atkinson Hyperlegible Next + Mono | Candid, legibility-first; a bit institutional | OFL 1.1 (both) |
| Schibsted Grotesk + IBM Plex Mono | Newsroom-precise, good with numbers; cool | OFL 1.1 (both) |
| Inter Tight + Inter + Fragment Mono | The safe choice; what v0.2 felt like | OFL 1.1 (all) |

**Recommendation: Instrument Sans (400/600) + JetBrains Mono (400/500).** It reverses BRAND.md P-3 ("platform's own face"), as the client asked for a chosen, bundled typeface. It keeps the system's six-step scale (12/16, 13/18, 15/22, 20/26, 28/34, 44/48), and the lockup and fallback wordmark are set in Instrument Sans 600 at −0.035em. **Before locking it:** check 13 px rendering on Windows (ClearType) in the Electron build.

---

## 04 · Sounds (3 + 1 optional), synthesised with Web Audio

One family: sine bodies, 8 ms attacks, a soft low-pass, all in D major pentatonic, master compressor. Volume and a mute toggle on the page (the mute state is remembered); in the app, sounds are on by default with a mute switch in Settings › Notifications, and OS Focus / Do Not Disturb silences everything.

| Sound | Design | Length | Intent | Plays when / never |
|---|---|---|---|---|
| **Needs you** | Two notes, A4 → D5 (a rising fourth) | 320 ms | A tap on the shoulder that asks, never warns | An approval or question arrives while the window isn't focused / never more than once per item, never for agent-to-agent talk |
| **Done** | One rounded F♯5 with soft partials and a tiny settle in pitch | 380 ms | Lands and settles; quietly satisfied | A run or task you started finishes all green / never for intermediate steps |
| **Handoff** | Filtered breath swept left → right plus an E5 → A5 glide | 290 ms | Work passing between hands, moving like the on-screen chip | An agent hands work on in the project you're viewing / never in the background |
| First open of the day *(optional)* | D5, A5, E6 in stacked fifths | 900 ms | The studio lights coming on | First open after 05:00 if turned on / never on every launch |

**Recommendation:** ship the three; the morning chime is **off by default** (pure delight, so it's opt-in). This updates BRAND.md §11 ("silent by default"), following the client's "yes make sounds". "Play a short story" plays needs you → handoff → done back to back so you can judge whether they're distinct.

---

## Self-check (premium-craft / ui-ux-guide)

- **Rendered:** not rendered in this pass (no browser or shell available to this agent). **Please render at 1440×900 and 1280×800 (headless Edge) and look for JS console errors before showing the client.** The code avoids network calls except Google Fonts, and every font has a system fallback.
- **Colour:** every text and UI pair shown is computed live; all pass AA by construction (hand-checked before writing).
- **Coherence:** the same mini app, copy and agents in every palette; the same specimen copy in every pairing; the same family rules for all sounds.
- **Accessibility:** status is always shown with a word and a glyph; buttons are 32 px or more with visible focus; reduced motion stops the avatar blink; the mute toggle is an `aria-pressed` button and play results are announced in a live region.

## What the client chooses

1. **Logo:** A Seated (recommended) · B Glass box · C · D · E · F
2. **Brand colour:** Bone + Aubergine (recommended) · Paper + Ink · Mist + Spruce · Fog + Fuchsia · Night + Lime
3. **Typeface:** Instrument Sans + JetBrains Mono (recommended) · the other five
4. **Sounds:** approve the three as designed (or say which feels off) · morning chime opt-in (recommended) or on by default
