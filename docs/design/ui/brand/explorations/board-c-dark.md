# Brand board C: "Night Glasshouse" (dark-first exploration)

**Status:** exploration for client review, 2026-10-22. Visual: [board-c-dark.html](board-c-dark.html).
**Brief:** client feedback [round 1](../../../../requirements/interviews/2026-10-22-brand-feedback-1.md): "make 2 more different brand boards with unique style, make one of them dark"; "grok use blue, give me other option"; "yes make sounds"; and (coordinator, 2026-10-22) Bench's own action colour must never be blue.
**Name:** undecided. "bench" is a codename. The mark is an arch window, not a word, and the wordmark is a rule that works for any 3–8 letter name.

## 1. Concept
- **Place:** a glasshouse at night. With the lights on, you can see everything inside from anywhere.
- **Essence:** *Lit from within.*
- **One line:** Your team works in a glasshouse after dark. Every pane is clear and every light is on. When it's your call, one lamp turns toward you.
- **Why it fits Bench:** the glass box (the product's promise) becomes a glasshouse (the brand's place). Agents are the lights inside it, so you see at a glance who is working, who is thinking and who is waiting. It's dark, warm and low-glare, which suits an app that runs all day and into the evening.

## 2. Personality
Unhurried (not sleepy) · Candid (not clinical) · Warm (not cute) · Precise (not technical) · Deferential (not passive).

## 3. Signature rules
1. **Lamplight means you.** `#f2b65a` fills exactly one control per screen, the one that is your call. As text or outline it marks "Needs you". "Needs you" and "your call" are one meaning, so they share one colour. Focus rings are Mist and selection is Glass 2; neither borrows the lamp.
2. **Light carries state.** Working is bright and steady, thinking breathes, paused is turned low (dim tinted glass, eyes closed), never black.
3. **The metaphor stays in the pixels.** The copy never says "lights on" or makes glow puns.
4. **Clear glass, not frosted.** Panes and hairline frames; no blur, no glassmorphism.

## 4. Mark and icon
- **Mark:** an arched pane (a half circle on a rectangle, with a rounded foot) holding two upright eye pills: the house with the team's eyes. In the app it is mono (a Mist arch with Loam eyes), so the lamp on screen is always your call. It is lit gold only outside the app (the icon, a site).
- **App icon:** a dark glass squircle. The pane is lit gold from inside, and rose, violet and seafoam glow low at the sill (the team at work). Below 32 px it is a flat gold pane with eyes and no glow. On the Windows taskbar, one lamp dot means something needs you.
- **Wordmark:** Fraunces 600, Soft 100, lowercase, −0.035 to −0.04em. Gap = 0.3 × the mark's height. Shown with 3, 5 and 8 letter names.

## 5. Characters (the same family, rendered as lanterns)
- The 9 shapes of board A with **eyes only**. Eyes are **upright dark pills** (the places where the light isn't) on a body of lit coloured glass.
- **Three renders:** *Lantern* (radial core light, a specular highlight, and a breathing halo from 56 px up) for the hero, profile and chat header · *Flat* (solid hue, dark eyes) for lists, tickets and mentions at 16–40 px · *Low* (22 % tinted glass, closed eyes in the hue) for paused.
- **States, always with a word:** Idle (calm) · Thinking (the halo breathes, the eyes look up) · Working (focused) · Needs you (a lamp ring, the eyes on you) · Blocked and Error (concerned, never alarmed) · Paused (low) · Done (pleased for 1.6 s).
- **7 hues × 9 shapes = 63 identities:** Rose `#ff8fb1`, Orchid `#e88ee6`, Violet `#c49cff`, Clay `#e39c86`, Pear `#c8e26a`, Sage `#a9cf9b`, Seafoam `#5fd9bd`. None is blue or periwinkle, and none is gold. There are fewer hues than in A on purpose: seven stay distinct in the dark.

## 6. Colour (dark first)
| Role | Hex | Key contrast |
|---|---|---|
| Loam (ground) | `#0d1210` | Mist on it 15.9 : 1 |
| Glass 1 / 2 / 3 (lighter = nearer) | `#141a17` / `#1b2320` / `#242e2a` | Mist on Glass 3 11.8 : 1 |
| Mist (text 1, not pure white) | `#e8ede9` | |
| Text 2 / Text 3 | `#a7b3ad` / `#8c9892` | 6.5 and 4.7 : 1 on Glass 3 (worst case) |
| Control edge | `#66736c` | 3.6 : 1 on Glass 1 (WCAG 1.4.11) |
| Lamplight (action, needs you) | `#f2b65a` | Soot `#17130c` label 10.2 : 1; as text on Glass 2 8.9 : 1 |
| Done / Error | `#74d39a` / `#ff7b72` | 8.8 and 6.4 : 1 on Glass 2 |
| Agent hues as text | pastel bases | all ≥ 7 : 1 on Glass 2; Loam eyes on every hue ≥ 7 : 1 |

The board recomputes every ratio live (WCAG formula) in its contrast table. Proportion: 60 Loam · 30 Glass and Mist · 10 meaning. Depth comes from lighter surfaces, with no shadows in dark mode.

**Light mapping (Phase 5b, values to verify):** Linen `#f3f5f1` ground, white surfaces, Loam text. The primary keeps the same Lamplight fill and Soot label (10.2 : 1 on any ground). Lamp as text becomes `#8a5a12`, Done `#1b7a45`, Error `#c0262d`. An agent hue as text uses its deep step (base mixed 55 % with Loam). The characters stay lanterns without a halo, and the mark flips to a Loam arch.

## 7. Type
**Fraunces** (OFL; Soft axis 100) for the wordmark and the one headline per screen. **Figtree** (OFL) for everything else. Both are bundled, so every OS renders the same. Two weights (400, 600). The scale is 12 · 13 · 15 · 20 · 28 · 48, with at most four steps per view and tabular figures for counts. Code uses the platform mono.

## 8. Motion: "light, not leaps"
- Light changes warm up on `cubic-bezier(.33,0,.15,1)` over 900 ms. Chrome uses a critically damped spring (ζ 1, 420 ms). Only the characters overshoot (ζ 0.55, 640 ms).
- **Signature moments:** *Lighting up* (create: dim glass warms to its hue, then one blink) · *The lamp turns to you* (needs you: the ticket warms from its corner, a ring on the avatar, the eyes move to the button) · *Passing the light* (handoff: a mote carries the brief along an arc) · *All lit* (checks light in order, 250 ms apart).
- **The only loop:** the halo breathes (5.2 s) and the eyes blink (about 6 s).
- **Reduced motion:** travel and loops stop, and every state arrives at rest. The board has a toggle and also honours `prefers-reduced-motion`.

## 9. Sound: "glass and felt, in a quiet room"
Struck glass and a felt-mallet wooden bar, soft, with a short room tail, all in one key. **On by default** (your decision), with one mute switch in Settings › Sound. Focus and Do Not Disturb silence everything.
- **Needs you:** two glass notes rising a fifth (E5 → B5), about 450 ms. It reads as a question, not an alarm. Repeats within 30 s are batched into one.
- **Done:** one low wooden note (A3) with a breath of glass above it, about 600 ms.
- **Handoff:** a soft breath across the room that lands on a tiny glass tick, about 380 ms.
- **Never:** for agent-to-agent background traffic, for typing, or for routine runs.
The board plays Web Audio sketches of all three; the final sounds would be recorded.

## 10. Voice
The same rules as A: second person ("What needs you"), agents in lowercase, numbers first, then reassurance, then one next step. The night tone shows only as calm, for example "While you were away: 4 things done, 1 waits for you."

## 11. Conflict check
- **Grok/xAI:** no blue anywhere as action or identity; no stark black-and-white monospace; no X shapes. The ground is green-black and the type is soft.
- **Anthropic/Claude:** no cream ground and no terracotta/clay action colour. The serif is Fraunces (soft, wonky), not Tiempos, and it sits on a dark green ground. **Watch:** a warm serif with a warm accent could drift editorial, so headlines stay rare (one per screen).
- **Board A:** dark instead of light, gold instead of Cobalt, lanterns with dark upright eyes instead of white slanted ones, an arch window instead of an Ink squircle, sound on by default.
- "Night Glasshouse" is a concept name, not a product name proposal.

## 12. Decisions for you
| # | Decision | Recommended if C wins |
|---|---|---|
| C-1 | Direction C as a whole | Your call next to A and B |
| C-2 | Lamplight gold as the one "your call" colour, also marking "Needs you" | Yes |
| C-3 | Lantern characters with dark upright eyes | Yes |
| C-4 | Fraunces + Figtree, bundled | Yes |
| C-5 | The arch-window mark | Yes |
| C-6 | Glass-and-felt sounds, on by default with mute | Yes |

## 13. Rubric (brand stage) and open items
Copy Senior · Visuals Staff candidate (the lantern language and arch mark are unmistakably C) · Colour Senior (one lamp, meaning only, ratios computed live) · Type Senior · Structure Senior · Motion Senior (pinned moments, reduced motion keeps the information) · Coherence Senior (one Look-inside glyph, from the mark) · States: component states are shown on the board; the full matrix carries over from the design system if C is chosen.
**Not yet done:** the board was not rendered in this session (no browser available). It needs a headless-Edge render at 1440×900 and 1280×800 and a look at the first viewport, §06 (app frame) and the contrast table.
