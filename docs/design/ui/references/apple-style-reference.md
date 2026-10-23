# Apple — Style Reference (client-provided, 2026-10-22)

> white room with a single blue switch.

Provided by the client as the base design system ("imagine Apple created its own"). Source measurements are normalized; roles are interpreted. Kept as reference; Bench's adaptation is in [../DIRECTION.md](../DIRECTION.md).

**Theme:** light. Restraint: a near-white canvas, generous breathing room, and one vivid blue accent. Typography is the primary voice: SF Pro with negative tracking. The chrome recedes into thin borders, ghost navigation and hairline rules. Depth comes from scale and surface shifts, not shadows.

## Colors
| Name | Value | Role |
|---|---|---|
| Apple Blue | `#0071e3` | Filled action buttons, selected states: the only chromatic interactive color |
| Link Blue | `#0066cc` | Outlined action borders, inline links |
| Signal Blue | `#2997ff` | Decorative borders, icon strokes (atmospheric only) |
| Carbon | `#1d1d1f` | Primary text, heading and card borders |
| Frost | `#f5f5f7` | Page canvas |
| Ice | `#f4f8fb` | Elevated surface wash |
| Smoke | `#333333` | Secondary text, borders |
| Graphite | `#474747` | Nav text, tertiary |
| Ash | `#707070` | Muted text, footer |
| Mist | `#858585` | Hairlines, icon strokes |
| Onyx | `#000000` | Max-contrast headings |
| Pebble | `#e2e2e5` | Button fills, disabled surfaces |
| Hairline | `#d2d2d7` | Light borders and dividers |

## Typography
- **SF Pro Display** (substitute: Inter / system-ui) for 21–56px. Weights 400/600 (700 only in promo art). Line height 1.07–1.19.
- **SF Pro Text** for 12–44px. Weights 300 (subheads), 400 (body), 600 (nav and buttons). Negative tracking tightens with size: −0.022em at 12px to −0.01em at 44px.

| Role | Size | Line height | Tracking |
|---|---|---|---|
| caption | 12px | 1.33 | −0.264px |
| body-sm | 14px | 1.29 | −0.224px |
| body | 17px | 1.47 | −0.272px |
| subheading | 21px | 1.24 | −0.105px |
| heading-sm | 28px | 1.18 | 0.196px |
| heading | 40px | 1.14 | 0.44px |
| heading-lg | 44px | 1.18 | −0.44px |
| display | 56px | 1.07 | 0.616px |

## Spacing, shape, elevation
- 4px base unit; scale 4/8/12/16/20/24/40/48/56. Section gap 64px, card padding 24px, element gap 12px.
- **Radius:** buttons and tags 980px (full pill); cards, images and inputs 8px. No other radii.
- **Shadows:** none on cards, buttons or nav. Only `rgba(0,0,0,.22) 3px 5px 30px` on product imagery.
- **Surfaces:** Canvas `#f5f5f7` → Elevated wash `#f4f8fb` → Pebble `#e2e2e5`. Hierarchy comes from surface shifts and 1px hairlines.

## Components (summary)
- **Filled pill (primary):** `#0071e3` background, light text, 17px/400, padding 11×15, no border or shadow. The single filled element.
- **Outlined pill (secondary):** 1px `#0066cc`, `#0066cc` text, transparent.
- **Ghost link:** `#0066cc` text, underline on hover.
- **Nav bar:** hairline bottom border, 12px links.
- **Form input:** 8px radius, 1px `#d2d2d7`, `#f5f5f7` fill, 2px `#0071e3` focus ring.

## Do / Don't (from the source)
- Do: use `#0071e3` only for filled actions and selected states; pair a filled primary with an outlined secondary, never two filled; body 17px with −0.016em tracking; 980px radius for every button and tag; weight 300 for subheads.
- Don't: use `#0071e3` for text or decoration; add shadows to UI; put headlines above 600; use other radii; mix the three blues in one element; put cards inside a canvas section.
- Imagery in the source: photography only, no illustrations or 3D. **Bench overrides this for agent avatars** (see DIRECTION.md).

## CSS custom properties (source)
```css
:root{
  --color-apple-blue:#0071e3; --color-link-blue:#0066cc; --color-signal-blue:#2997ff;
  --color-carbon:#1d1d1f; --color-frost:#f5f5f7; --color-ice:#f4f8fb; --color-smoke:#333333;
  --color-graphite:#474747; --color-ash:#707070; --color-mist:#858585; --color-onyx:#000000; --color-pebble:#e2e2e5;
  --font-sf-pro-display:'SF Pro Display',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --font-sf-pro-text:'SF Pro Text',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --text-caption:12px; --text-body-sm:14px; --text-body:17px; --text-subheading:21px;
  --text-heading-sm:28px; --text-heading:40px; --text-heading-lg:44px; --text-display:56px;
  --spacing-4:4px; --spacing-8:8px; --spacing-12:12px; --spacing-16:16px; --spacing-20:20px; --spacing-24:24px; --spacing-40:40px; --spacing-48:48px; --spacing-56:56px;
  --radius-cards:8px; --radius-inputs:8px; --radius-buttons:980px; --radius-tags:980px;
  --shadow-xl:rgba(0,0,0,.22) 3px 5px 30px 0px;
  --surface-canvas:#f5f5f7; --surface-elevated-wash:#f4f8fb; --surface-pebble:#e2e2e5;
}
```
