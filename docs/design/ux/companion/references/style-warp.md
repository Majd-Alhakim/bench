# Style capture: Warp (terminal site, dark)

Source: [warp.dev/terminal](https://warp.dev/terminal), via Refero style `40a9c295-7a6f-48b3-ae15-2c4d171cf8fb`, seen 2026-10-26. Condensed notes in our words; values as reported by Refero. **Reference ingredient, not our system.**

**Thesis:** a near-monochrome dark system where colour is "a rare, meaningful signal"; the product's own UI is the hero image.

| Role | Value (Refero) | What to take for Eucas |
|---|---|---|
| Surface stack | `#090909` → `#121212` → `#1e1e1d` → `#353534` → `#40403f` (hover) | Elevation by tone only; four steps cover base, panel, raised, hover |
| Text | `#faf9f6` / `#afaeac` / `#868684` | Warm-white text, never `#fff` on dark |
| Single accent | sage `#799c92`, eyebrow labels only | Proof that one accent with one job reads premium; for us that job is Cobalt = the next action, amber = needs you |
| Type | Matter 400 and 600 only; −0.04em at 64 px down to −0.01em at 20 px; +0.01em at 12–14 px | Same two-weight discipline as ours; open tracking at small sizes |
| Mono | Geist Mono for commands on a raised block with a copy button | Commands in the inbox and log: mono on a raised block, copy at the trailing edge |
| Radius | cards 16, buttons 4, pills 50 for icon toggles | — (we keep our family) |
| Motion | 0.4 s state changes, cubic-bezier(0.44, 0, 0.56, 1); 0.15 s link hovers; never scale on hover | Calm, weighty state changes fit "relief over wow"; our springs stay, but no bounce on chrome |

**Do (adapted):** let the real product (the user's own sessions and numbers) be the hero of the first run; keep one high-contrast control per view.
**Don't (adapted):** a second decorative hue; gradients or glows on content; body text above 16 px in a dense tool.
