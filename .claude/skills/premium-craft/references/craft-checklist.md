# Craft checklist (run on every view)

Rules of thumb drawn from the source videos. They are starting points, not laws. Eucas's token values live in the design system and win over the numbers here.

## Color
- **60-30-10:** 60 % neutral base (Frost/White), 30 % complementary (Carbon text, surfaces), 10 % accent (one action blue + agent hues).
- Use color **for meaning, not decoration**: semantic blue = action/trust, red = danger, amber = needs you, green = done. Always pair it with a word or glyph.
- Too much accent and nothing gets attention; too little and the UI is dull. If everything screams, nothing is heard.
- Build ramps from one hue (a light tint for backgrounds, a dark shade for text on tint) instead of adding new hues.
- Text hierarchy can come from neutral opacity or tone steps (for example 100 / 80 / 60 %), as long as every step keeps AA contrast.
- Secondary emphasis: the primary color at about 5 % as a fill, or a hairline border.

## Typography
- **One family** (Inter/SF) plus a monospace for code and big numbers. A second display face needs a reason.
- **≤ 4 sizes and 2 weights per view.** Dense app screens rarely go above 24 px, except a single display headline.
- Large type: tracking −2 to −3 %, line height 110–120 %. Body: 140–150 %.
- Set numbers that change in **tabular** figures, so they don't jitter.
- Line length 40–75 characters (desktop prose ≤ 600 px wide).
- Steps between sizes must be visible: the hierarchy is the *contrast* between sizes.

## Spacing and structure
- 4/8-pt scale. Every value is divisible by 4 (no 11, no 25).
- **Spacing by relationship.** Related items sit closest (base unit), then groups sit at 2× the base, then sections at 3–4×. Shrink the base unit for smaller type.
- Card and container padding: 16–32 px depending on content size. More breathing room is the safer default.
- Group with proximity before borders; add a container only when it signifies something (a group, a selection).
- Keep a structural grid for repeated content, and break it on purpose (a bleeding carousel, a centered finale) to avoid monotony.
- Keep one shape language: one radius family (cards, pills, bubbles) with **continuous corners** (squircle-like smoothing where the platform allows). Never mix 4 px squares with circles at random.

## Components and states
- **Every interactive element** has default, hover, pressed (scale ~.98), focus (a visible ring), disabled, and loading where it applies.
- **Inputs** have default, focus, filled, error (border + message with the cause and the fix), warning (optional issue) and disabled states.
- **Every action gets a response.** A copy button confirms "Copied", a save shows "Saved", a send shows a delivered state, and a long task shows progress.
- Buttons: width ≈ height × 2 or more of padding, a ghost variant for nav/secondary, and one filled primary per view.
- Icons: one set, one stroke weight, **icon size = the line height** of the adjacent text (16/20/24), never oversized.
- **Signifiers:** containers group, fills select, grey means inactive, a chevron means expand, a grabber means drag.

## Depth, overlays, dark mode
- Shadows are subtle: if you notice the shadow before the content, it is too strong. Cards need little; popovers and menus need more. (Eucas's Apple base uses no UI shadows; elevation comes from surface tone.)
- Text over an image uses a gradient scrim, or a progressive blur, not a flat full overlay.
- Dark mode gets depth from **lighter surfaces as elevation rises**, lower-contrast borders, and desaturated chips. Shadows don't work there.

## Copy
- **The removal test (client rule, 2026-10-23):** for every piece of visible text ask *"If I removed it, would the user be confused?"* Yes → keep it (and tighten it). No → remove it. Captions that restate a heading or button, explanations next to obvious controls, repeated reassurance and footnotes go. Costs before a click, what an outward action will do, error cause + next step, status words, counts and names stay. Accessible names (aria-labels) stay even when visible text goes.
- Shortest clear wording. Don't repeat what the heading already says ("Rewards" heading → "Claim", not "Claim rewards").
- Second person, from the main agent's voice (Eucas rule U8).
- Plain states, reassurance at risky moments ("nothing sends until you've read it"), and the next step after every outcome.
- Frame warmly: invitation over transaction, progress over failure.
