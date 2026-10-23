# Design system

**Status:** v1.1, 2026-10-23. Light theme built, dark planned. Brand round 2 applied: P-1, P-2, P-3 (Instrument Sans + JetBrains Mono), P-4 and P-7 (sound on) are decided ([client notes](../../../requirements/interviews/2026-10-23-brand-decisions.md)). Brand platform: [../brand/BRAND.md](../brand/BRAND.md).
**Files:** [tokens.css](tokens.css) (the source of truth, importable as is) · [components.html](components.html) (every core component in every state, links `tokens.css` locally; fonts from Google Fonts for review) · [../brand/brand-board.html](../brand/brand-board.html) · logo files in [../brand/logo/](../brand/logo/).
**Skills applied:** premium-craft (gates, rubric), ui-ux-guide (rules, checklist), design-taste-frontend (app-screen rules, tells).
**Proposals** that change approved values are marked **P-n** and listed in §14. Everything else keeps the confirmed base: Apple foundation, light first, one blue action per screen, agent identity = hue × non-human shape with eyes only, soft dimensional hero avatar, 15 px body, 18 px bubbles, second-person voice, lowercase agent voice.

---

## 1. Principles

1. **Glass box first.** Every cost, step and memory write is one click away ("Look inside"). Consequences show before the click.
2. **One blue.** Cobalt fills one control per screen: the thing you are most likely to do next. Everything else is Ink, white or quiet.
3. **The agents bring the colour.** Chrome is Ink, Porcelain and white. Hue means "this agent", amber means "needs you". Colour never decorates.
4. **One pattern per situation.** One approval card, one estimate chip, one status vocabulary, one corner family, one recovery shape (§12).
5. **Calm and alive.** The chrome settles on springs and never bounces; only the characters move on their own.

---

## 2. Using the tokens

```html
<link rel="stylesheet" href="tokens.css">
```

Three tiers:
- **Primitives:** `--porcelain-*`, `--cobalt-*`, `--green-*`, `--amber-*`, `--red-*`, `--hue-<name>-<step>`. Palette only. Components never read them, except the hue table.
- **Roles:** `--bg-*`, `--text-*`, `--line-*`, `--action-*`, `--ok-*`, `--attn-*`, `--danger-*`, `--state-*`. Components read only these.
- **Agent scope:** put `data-hue="coral"` on any container and everything inside reads `--agent-base`, `--agent-ink`, `--agent-tint`, `--agent-wash`. A chat, a mention chip and an avatar all inherit from the nearest scope.

A raw hex in a component is a second palette starting: don't. The only exceptions are the avatar renderer (it needs the base, light and deep steps as SVG paint) and the danger button's hover and press shades, which are listed in `components.html`.

---

## 3. Colour

### 3.1 Neutrals: Porcelain and Ink (P-1)
One faint blue undertone (hue ≈ 228°) runs through the ground, the greys and the text, so the chrome reads as one material and sits right next to Cobalt.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--porcelain-0` | `#ffffff` | Surfaces: sheets, cards, bubbles | Ink on it 17.9:1 |
| `--porcelain-25` | `#f9fafb` | Hover on white | |
| `--porcelain-50` | `#f3f4f7` | **The ground**: canvas, sidebar | Ink on it 16.3:1 |
| `--porcelain-100` | `#eceef2` | Sunken: tracks, wells, disabled fills | Text 3 on it 4.73:1 |
| `--porcelain-150` | `#e4e6ec` | Pressed and selected neutral | |
| `--porcelain-200` | `#d8dbe2` | Strong divider on the ground | Decorative |
| `--porcelain-300` | `#c4c8d1` | Decorative only | Never text, never an edge |
| `--porcelain-500` | `#868b97` | **Control edge** (inputs, switches) | 3.41:1 on white, 3.11:1 on ground (WCAG 1.4.11) |
| `--porcelain-600` | `#646976` | **Text 3**: meta, placeholders, disabled labels | 5.49 white · 4.99 ground · 4.73 sunken |
| `--porcelain-700` | `#474b57` | **Text 2**: secondary text | 8.71 white · 7.92 ground |
| `--porcelain-900` | `#15171d` | **Ink**: text, the mark, toasts, tooltips | 17.9 white · 16.3 ground |

On Ink (toasts, tooltips, the brand board): `--text-inverse #eceef3` 15.4:1, `--text-inverse-2 #a9adb8` 7.98:1, links `--cobalt-300 #8fa8ff` 7.86:1.

State overlays are Ink at low alpha, so hover and press work on any ground, wash or tint: hover 4.5 %, press 8.5 %, selected 7 %.

### 3.2 Action: Cobalt (P-2)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--action` | `#2e5bff` | The one filled control; links; focus ring | White on it 5.17:1; as text on white 5.17, on ground 4.71 |
| `--action-hover` | `#2550eb` | Hover (darkens: contrast goes up) | White on it 6.13:1 |
| `--action-press` | `#1f45d1` | Pressed | |
| `--action-tint` | `#ebf0ff` | Selected rows, info, the "Look inside" hover | Cobalt text on it 4.54:1 |

Rules: one filled Cobalt per screen. Cobalt is never a status, never an agent, never a selected tab or a switch (those are Ink or white).

### 3.3 Feedback (always with a word or a glyph)
| Meaning | Ink (text) | Tint (pill) | Fill (badge, glyph) | Contrast |
|---|---|---|---|---|
| **Done** | `#1b7a45` | `#e3f5ea` | `#22a35a` | ink 5.36 white, 4.73 tint; fill 3.25 as a graphic |
| **Needs you** | `#8a5300` | `#fff1d9` | `#f5a20a` | ink 6.33 white, 5.68 tint; Ink on fill 8.58 |
| **Error** | `#c0262d` | `#fdeaea` | `#e5383b` | ink 5.90 white, 5.10 tint; white on ink 5.90; white glyph on fill 4.23 |

The amber fill on white is 2.09:1; it's never the only signal (the "!" glyph inside is 8.58:1 and the word sits beside it). The danger *button* fills with the ink, not the fill, because white on `#e5383b` is 4.23:1 (below 4.5 for 13 px text).

### 3.4 Agent hues
Ten identities, ordered around the wheel. Each has six steps: **base** (flat avatar body), **light** and **deep** (hero render gradient), **ink** (name tags, mention text), **tint** (your bubbles in that agent's chat, mention chips), **wash** (the canvas behind the conversation).

| Hue | Base | Ink | Tint | Wash | Ink on white | Ink on tint | Ink text on tint | Cast |
|---|---|---|---|---|---|---|---|---|
| Coral | `#ff5f73` | `#c4283f` | `#ffe6e9` | `#fff8f9` | 5.64 | 4.77 | 15.1 | Noor |
| Tangerine | `#ff8a3d` | `#b04a00` | `#ffeee2` | `#fffaf6` | 5.49 | 4.86 | 15.8 | Sam |
| Honey | `#f2ab1d` | `#8a5a00` | `#fff4dc` | `#fffcf4` | 5.93 | 5.43 | 16.4 | Lumen, Rana |
| **Pear** (new, P-4) | `#96bf2c` | `#4d6a00` | `#f0f7dc` | `#fbfdf4` | 6.22 | 5.64 | 16.2 | Karim |
| Mint | `#3cc47c` | `#1d7a43` | `#e5f7ec` | `#f6fcf8` | 5.36 | 4.81 | 16.1 | Maya, Tala |
| Teal | `#1fb5a3` | `#00756a` | `#e1f6f2` | `#f5fcfb` | 5.60 | 4.97 | 15.9 | Omar |
| Aqua | `#2db4dc` | `#006b85` | `#e3f6fb` | `#f6fcfe` | 6.10 | 5.47 | 16.1 | Iris |
| Lavender | `#8e6cf0` | `#5a3dc8` | `#efeaff` | `#faf8ff` | 7.15 | 6.09 | 15.3 | Atlas |
| Orchid | `#e05cb4` | `#b0287f` | `#fbe7f4` | `#fef8fc` | 6.08 | 5.16 | 15.2 | Jade |
| Cocoa | `#a66e4e` | `#7a4a2e` | `#f5ebe4` | `#fcf8f5` | 7.38 | 6.29 | 15.3 | Lina |

Every agent ink passes AA on white and on its own tint; Ink text passes AAA on every tint. `components.html` recomputes these ratios live from `tokens.css`, so any edit is checked on render. Light and deep steps are in `tokens.css`.

- **Pear replaces Periwinkle** because Periwinkle's ink (`#3c4bc4`) next to Cobalt read like a link, and blue must mean "action" only.
- **Eyes:** white on every base, 1.9 to 4:1 (honey is the lowest). The eyes are expression, not information; status is always a badge and a word.
- **Where a hue may appear:** avatar · name tag · mention chip · your bubble in that agent's chat · the faint wash behind that chat · the agent's thinking dots · the "Applied" chip's glyph. **Never** on buttons, links, status, selection or charts of anything but that agent.
- **Hue reuse (D-UI8):** identity is hue × shape. A pair is never used twice inside one project; hues may repeat across projects with a different shape.
- **Unassigned:** `--hue-none-*` (grey, closed eyes) while an agent is being drafted.

### 3.5 Proportion
60 % Porcelain ground · 30 % white surfaces and Ink text · 10 % meaning (Cobalt for one control, amber for needs-you items, agent hues on their own things). If a screen has two Cobalt fills, one of them is wrong.

---

## 4. Type

**Faces (P-3, decided 2026-10-23):** **Instrument Sans** for everything (`--font-text`; `--font-display` is the same family, kept as a name) and **JetBrains Mono** (`--font-mono`) only for code, commands, diffs and the trace. **Two weights:** 400 and 600.

- **Why:** a precise grotesk with soft curves and a confident 600, distinct from the Inter/Geist look of every dev tool; JetBrains Mono is the clearest small mono for the trace (`Il1 O0` never collide).
- **Licence and delivery:** both are SIL Open Font License 1.1. **The app bundles the font files** (variable WOFF2, declared once with `@font-face`, `font-display: block` so nothing reflows on launch); the OFL text ships in the app's licence notices. No network font loading in the app. The review pages (brand board, components, prototype) load the same faces from Google Fonts with a `<link>`.
- **Fallbacks** (only if a file is missing): Segoe UI Variable / Segoe UI, the Apple system face, `system-ui`; for mono, Cascadia Mono, SF Mono, Consolas.
- **Check before locking the build:** 13 px and 12 px rendering on Windows/Electron (ClearType hinting; Instrument Sans is a newer family), and that the bundled file includes tabular figures (`tnum`) for `.num`. If 12 px reads soft on Windows, raise meta to 600 only in tags, never add a third weight.

| Step | Size / line | Tracking | Weight | Use |
|---|---|---|---|---|
| `meta` | 12 / 16 | +0.005em | 400, 600 in tags | Timestamps, tags, token counts, badges |
| `sub` | 13 / 18 | 0 | 400, 600 in buttons | Snippets, descriptions, help, md buttons |
| `body` | **15 / 22** (D-UI1) | −0.006em | 400, 600 for names | Body, chat, inputs, list names, lg buttons |
| `title` | 20 / 26 | −0.014em | 600 | Pane, dialog and open-ticket titles |
| `headline` | 28 / 34 | −0.022em | 600 | The one h1 per screen |
| `display` | 44 / 48 | −0.032em | 600 | First run and brand only; never in a working screen |

- **Budget:** ≤ 4 steps in any one view (for example Home: meta, sub, body, headline; an agent chat: meta, sub, body, title). The switch to Instrument Sans keeps the same six steps; it sets slightly narrower than Segoe UI, so no label that fitted before can overflow now. The wordmark in the lockup is part of the logo, not a type step.
- **Numbers that change** use `font-variant-numeric: tabular-nums` (`.num`), right-aligned in columns.
- **Measure:** chat bubbles max `--measure-chat` (34em ≈ 60 characters); prose 62ch.
- **Sentence case** everywhere in the interface. Agents write lowercase (their own messages only). No uppercase tracked labels.
- Removed from v0.2: 14 px (too close to 15), 17 and 21 px (Apple marketing steps), weight 300.

---

## 5. Space and layout

4-pt scale: `--sp-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64.

**Spacing by relationship:** 8 between related lines (a name and its snippet's group), 12 between elements in a row, 16 between groups and inside dense cards, 20–24 card and pane padding, 32 between sections, 48 the screen gutter.

**Sizes**
| Thing | Value |
|---|---|
| Controls | 28 small · **32 default (click floor)** · **40 primary** |
| Rows | 40 one-line · 56 two-line with a 32 avatar (never under 44 with a subline) |
| Icons | 14 with 12–13 px text · 16 with 15 px text and in nav · 20 toolbar · 1.5 px stroke, one outline set |
| Avatars | 16 · 24 · 32 · 40 · 64 · 96 (see §11.7) |
| Sidebar | 280 expanded · 56 rail |
| Chat column | bubbles ≤ 34em; the workspace pane takes the rest (resizable, min 360) |

---

## 6. Shape: one continuous-corner family (P-5)

> **R3 (client-accepted 2026-10-22) overrides the table below:** three values only: **18** for objects (cards, tickets, bubbles, menus, dialogs, panes), **10** for things inside them (inputs, tags, chips, menu items, a bubble's grouped corner), **pill** for controls. `tokens.css` keeps the old token names as aliases mapped to these values.

| Token | Visual radius | Squircle value* | Use |
|---|---|---|---|
| `--r-xs` | 6 | 9 | Tags with corners, checkboxes, code chips, skeleton bars |
| `--r-sm` | 10 | 16 | Inputs, menu items, inline alerts, wells |
| `--r-md` | 14 | 22 | Cards, menus, popovers, toasts |
| `--r-lg` | **18** | 28 | Bubbles and tickets (the decided 18) |
| `--r-xl` | 24 | 38 | Dialogs, panes, sheets |
| `--r-full` | pill | pill | Buttons, chips, switches, badges, segmented |

\* Where the engine supports `corner-shape` (Chromium, so Electron), `tokens.css` switches `--corner` to `squircle` and raises the numbers about 1.6× so the corner *looks* the same size with continuous curvature, which is how Apple's corners read. Elsewhere it falls back to plain rounding at the visual radius. Every component sets `border-radius: var(--r-*); corner-shape: var(--corner)`. Pills stay `round` (a squircle pill would flatten its ends).

**Nesting:** an inner radius is the outer radius minus the padding (a 14 menu with 6 padding has 8–10 items). Bubbles use `--r-xs` on the corner that touches the next bubble in a group (your messages: bottom right).

---

## 7. Elevation

Tone first. A shadow means "this floats above the page".

| Token | Recipe | Use |
|---|---|---|
| `--elev-0` | none (a tone step) | Wells, sunken tracks |
| `--elev-1` | 1 px ring at 7 % Ink | Resting cards, bubbles, collapsed tickets |
| `--elev-2` | ring + 2 soft layers (5 %) | The open ticket, the composer, pending approvals |
| `--elev-3` | ring + 2 layers (8 %, 10 %) | Menus, popovers, select lists, toasts, tooltips |
| `--elev-4` | ring + 2 layers (14 %, 18 %) | Dialogs (over a 32 % Ink scrim) |

No hover lift on cards: hover darkens the ring. Shadow colour is Ink-tinted (`hsl(228 16% 10%)`), never pure black. The hero avatar's ground shadow is imagery, not elevation.

---

## 8. Motion

### 8.1 Durations
| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 140 ms | Press, hover, focus |
| `--dur-short` | 200 ms | Crossfades, message in, badge swap |
| `--dur-move` | 320 ms | Ticket expand, switch knob, menus |
| `--dur-scene` | 420 ms | Panes, dialogs, split view |
| `--dur-character` | 640 ms | Avatars: birth, glance, handoff landing |

### 8.2 Curves
- `--ease-out` `cubic-bezier(.22,1,.36,1)`: anything under 240 ms (press, hover, fade).
- `--ease-in-out` `cubic-bezier(.65,0,.35,1)`: things that travel while visible (the handoff chip's flight).
- `--ease-exit` `cubic-bezier(.55,0,1,.45)`: leaving for good, at 70 % of the entrance (a resolved ticket).
- **Springs**, sampled into CSS `linear()` from a damped harmonic oscillator, normalised to the duration:

  x(t) = 1 − e^(−ζω₀t) · (cos ω_d t + ζ/√(1−ζ²) · sin ω_d t), with ω_d = ω₀√(1−ζ²); for ζ = 1, x(t) = 1 − (1 + ω₀t)e^(−ω₀t).

| Token | ζ | ω₀ (per duration) | Duration | ≈ stiffness / damping (mass 1) | Overshoot | Use |
|---|---|---|---|---|---|---|
| `--spring-smooth` | 1.0 | 9.2 | 420 ms | 480 / 44 | none | Panes, tickets, sheets, the segmented thumb |
| `--spring-snappy` | 0.8 | 7.75 | 320 ms | 590 / 39 | 1.5 % | Switch knob, chips |
| `--spring-gentle` | 0.55 | 8.37 | 640 ms | 170 / 14 | 12.7 % | **Characters only**: birth, eye glance, handoff landing |

Developers using a JS spring library take the stiffness and damping columns; CSS uses the `linear()` tokens.

### 8.3 Choreography rules
1. **Feedback under the hand:** press scales to 0.97 over 140 ms; hover changes colour, never weight or size.
2. **Spatial continuity:** a pane slides in from its own side; the open ticket keeps its top edge while the others shrink (`grid-template-rows` and padding, 320 ms, the one layout animation allowed); a dialog scales from 0.97 at its centre; a menu from its trigger.
3. **Messages arrive** 8 px up with a fade (200 ms). Nothing in the chrome performs an entrance.
4. **Only characters loop:** the hero avatar breathes (5.2 s) and blinks (every ~6 s). Working badges turn. No other loops.
5. **No overshoot on chrome.** Only `--spring-gentle`, only on avatars.
6. **Reduced motion** (`prefers-reduced-motion` or the in-app switch): durations of moves and scenes drop to 1 ms, the press scale to 1, travel to 0; opacity and colour changes stay; loops stop; the handoff chip appears at its destination; the "Applied" glow becomes a static ring for 2 s.

### 8.4 Signature moments (pinned per flow)
Birth (first blink at Create) · the glance (eyes go to the request) · green finish (checks cascade, then pleased eyes for 1.6 s) · the brief travels (handoff chip) · Applied (one glow the first time a lesson is used). See BRAND §10 for which flow gets which.

### 8.5 Sound (P-7, decided 2026-10-23)
Three sounds from one family, as designed on the explorations page and heard on the brand board: synthesised (Web Audio in the renderer, no audio files), D major pentatonic, sine bodies through a soft low-pass, 8 ms attacks, one compressor, all under 400 ms and never alarming.

| Sound | What you hear | Plays when | Never |
|---|---|---|---|
| **Needs you** | Two rising notes, A4 → D5 (a fourth), 320 ms: a question, not a warning | An approval or question lands in What needs you while Bench isn't the focused window | For agents talking to each other; twice for one item |
| **Done** | One rounded note, F♯5 with soft partials, 380 ms | A task or run you started finishes all green, or a ticket you decided resolves, while you're elsewhere | For every step inside a run; only the finish |
| **Handoff** | A band-passed breath panned left → right with an E5 → A5 glide, 290 ms (it crosses the stereo field like the chip crosses the screen) | An agent hands work to another in the project you're viewing | In the background, for projects you aren't viewing |
| First open of the day (optional) | D5, A5, E6 in stacked fifths, 900 ms | The first open after 05:00 local time | Unless you turned it on; on every launch |

- **Default:** the three are **on**; the first-open chime is **off**. Volume: master gain 0.7 (`--sound-volume`) into the system output, so the OS volume still rules.
- **Controls:** Settings › Notifications has one Sound switch, a volume slider and a separate switch for the first-open chime. Muting is instant and remembered.
- **The OS wins:** Focus / Do Not Disturb silence all of them; OS notifications use the OS's own sound setting, never ours on top.
- **Rate:** one sound per kind per 600 ms; a burst of resolutions plays once.
- **Sound is separate from motion.** Reduced motion doesn't mute sounds (they carry information, not movement), and muting doesn't change motion. Every sound has a visible twin (the amber ticket, the green finish, the travelling chip), so nothing depends on hearing it.
- **Autoplay:** nothing plays before the first user interaction of a session (browser and Electron autoplay rules); the AudioContext is created on that first gesture.
- **Prototype:** `direction.html` plays needs you when the top ticket opens in the morning-open demo, when Atlas's first answer lands and when Noor's request appears; done on all green and when a ticket resolves; handoff when the brief chip travels. The Sound switch in the demo bar is on by default. In the prototype they play in view so you can hear them; the app follows the "while you're elsewhere" rules above.

---

## 9. Layers

`--z-base` 0 · `--z-sticky` 10 (sticky headers, composer) · `--z-sidebar` 20 · `--z-pane` 30 (workspace pane, split divider) · `--z-dropdown` 100 · `--z-popover` 200 (popovers, context menus) · `--z-toast` 300 · `--z-scrim` 400 · `--z-dialog` 410 · `--z-tooltip` 500 · `--z-drag` 600 (drag ghost when a project is dragged to the split).

---

## 10. Dark theme (planned, not built: Phase 5b)

Rules: don't invert. Depth comes from lighter surfaces, not shadows. No pure white text. Accents slightly brighter. Same brand: Ink, Porcelain, Cobalt and the eyes.

| Role | Light | Dark (planned) |
|---|---|---|
| Ground | `#f3f4f7` | `#0f1014` |
| Surface | `#ffffff` | `#17181d` |
| Sunken | `#eceef2` | `#1e2026` |
| Floating surface | white + `--elev-3` | `#23252c` + ring, shadows at 50 % black |
| Text 1 / 2 / 3 | `#15171d` / `#474b57` / `#646976` | `#eceef3` / `#b3b6c0` / `#8c909b` |
| Lines | Ink at 7 % / 11 % | white at 6 % / 10 % |
| Control edge | `#868b97` | `#6b707c` |
| Action / hover / text | `#2e5bff` / `#2550eb` / `#2e5bff` | `#3d66ff` / `#5277ff` / `#8fa8ff` |
| Done / Needs you / Error ink | `#1b7a45` / `#8a5300` / `#c0262d` | `#5fd08f` / `#ffc35c` / `#ff8a8c` |
| Agent ink | hue's ink | hue's light step |
| Agent tint | hue's tint | base at 16 % over surface |
| Agent wash | hue's wash | base at 5 % over ground |
| The mark (Quartet) | Ink `#15171d` | Porcelain white `#eceef3` (`brand/logo/mark-on-dark.svg`) |

Every pair is re-verified when 5b is built; the commented block at the end of `tokens.css` holds these values so nobody ships them by accident.

---

## 11. Components

Each one is rendered in [components.html](components.html) in every applicable state. The table names the states shown; "N/A" carries a reason.

### 11.1 Buttons
- **Variants:** Primary (Cobalt, 40 px when it's the screen's primary; one per screen) · Secondary (white, 16 % Ink ring) · Tertiary (text, Text 2) · Danger (red ink fill; destructive dialogs only) · Quiet danger (red text; Revoke, Remove in lists) · Icon (32 px, always with an accessible name and a tooltip).
- **States:** default, hover (darker fill or 26 % ring), pressed (0.97 scale, darker), focus (2 px Cobalt outline at 2 px offset), disabled (Porcelain 100 fill, Text 3 label 4.73:1, a tooltip says why), loading (the verb in progress, "Allowing", plus three dots; width holds).
- **Consequence on the button:** a primary that costs something carries it, in regular weight after a dot: "Run now · ≈ 0.4 % of your week", "Send to Dana · 1 email, from you".
- Label sizes: 15/600 at 40 px, 13/600 at 32, 12/600 at 28. Two buttons in one row share a height.

### 11.2 Inputs and selects
- 40 px, `--r-sm`, white, 1 px control edge (3.41:1). Label above (13/600), help below (12, Text 3). Never a placeholder as the label.
- **Optional fields (v0.4, C3):** a small "(Optional)" right after the label, 12/400 Text 3 (`.optl`): "Goal (Optional)". No box, no pill, no separate line. (v0.3 drew a grey box because the label used `.opt`, the ticket-option class.)
- **States:** default, hover (Text 2 edge), focus (2 px Cobalt inside), filled ("Saved" stamp when it saves itself, D-UI10), error (2 px red edge + cause and fix: "Noor already works on Bench. Pick another name or rename Noor first."), disabled (sunken fill, a lock glyph and why: "Set by the project"), loading ("Checking" with dots, inside the field).
- **Search:** 32 px, leading icon, shortcut hint at the end.
- **Select:** the same field with a chevron. The open list (`--elev-3`) shows the cost of each option ("≈ 2.1k / turn") and a reason on disabled options ("Off for routines in this project").
- **Composer:** `--r-lg` (same family as bubbles), control edge plus `--elev-2`. Resting: Send disabled. With a draft: focus ring, Send in Ink (dark, not blue: R1, blue means "your call"), the token estimate under it. **Send states (v0.4, C1):** default Ink `#15171d` with a white 2 px arrow (17.9:1) · hover `#2b2e37` (13.6:1) · pressed black (21:1) · disabled sunken pill with a Text 3 arrow (4.7:1). The icon-button rule must never recolour the arrow (`.btn.icon.inkbtn` pins it white). While the agent works: Send becomes **Stop** (secondary, in place), and the placeholder says when she'll read it.

### 11.3 Switches
- 36 × 22 track, 16 knob. **On is Ink**, not Cobalt (a setting is not the screen's action). The knob moves on `--spring-snappy`.
- **States:** off, on, hover, focus, disabled off, disabled on (Porcelain 500, a tooltip says why: "The 90 % ceiling can't be changed"), saving (a small arc in the knob, then "Saved").
- Every settings row: title (15/600), one-line description (13, Text 2), the switch at the right, the "Saved" stamp beside it.

### 11.4 Segmented and tabs
- **Segmented** switches views of one object (v0.4: the agent panel no longer uses one; its views are preview + routines, the full screen, and Settings behind the gear): sunken track, white thumb with a hairline and soft shadow, labels 13/600. The thumb slides on `--spring-smooth`. Arrow keys move.
- **Underline tabs** split long pages into sections: a 2 px Ink underline on the selected tab, counts in Text 3.
- **States:** selected, hover, focus, disabled. Selection is never blue.

### 11.5 Tags, badges and chips
- **Status tags** (one per row): Idle, Thinking, Working, Draft (neutral) · **Needs you** (amber) · Blocked (Ink fill) · Paused (neutral) · Error (red) · Done (green) · In review (Cobalt tint). Each with its glyph.
- **Risk tags** (BRD text tags), outlined so they never read as status: **Outward**, **Reserved**, **Work request**. Role tags are neutral: Lead, Loan, Read-only.
- **Count badges** only on queues: amber + Ink number for needs-you queues, Ink + white for other queues, soft for "3 more". A dot means "new since you looked".
- **Estimate chip** (one pattern everywhere): sunken pill, "≈", one best number, "% of your week"; the range lives in its tooltip.
- **Mention chip:** the agent's 16 px avatar, its name in its ink, on its tint.
- **Filter chips:** outline; selected is Ink fill; disabled carries the count ("FYI · 0").
- **Look inside** (P-6): the eyes glyph and the words, Cobalt text, Cobalt tint on hover. It opens the trace of what it sits next to.

### 11.6 Avatars and status
- Renderer: one SVG function for both renders. **Flat:** base fill and white eyes. **Hero:** radial light → base → deep, a soft highlight, a deep occlusion at the bottom, a ground shadow. Hexagon and triangle get rounded joins (a stroke in the same paint).
- **Sizes and jobs:** 16 mention (no badge) · 24 tickets, stacks, board cards · 32 chat, sidebar, headers · 40 lists, approvals · 64 settings, profile · 96 hero (status as a line under the name: "Working · running tests, 128 of 214").
- **Badge** from 24 px, bottom right, with a 2 px surface ring: 12 at 24, 14 at 32, 16 at 40, 20 at 64.
- **States:** Idle, Thinking, Working, Needs you, Blocked, Paused (body at 45 %), Error, Done; each with its expression (BRAND §8) and always a word nearby.
- **Groups:** team chat cluster (three members), stack of four plus a count, Unassigned.
- **Intelligence:** the profile and hero show memory that grew: "312 runs · 46 notes · 12 lessons".

### 11.7 Messages
- **Your bubble:** right, the agent's tint, no ring, `--r-lg` with `--r-xs` bottom right. Under it: "Seen by Noor · 08:52" with the eyes glyph; "Sending" with dots; failed: red edge and "Not sent: you're offline. Kept here. Retry".
- **Agent bubble:** left, white, `--elev-1`, 32 px avatar with its status badge. Under it the meta line: time · tokens · % of your week · **Look inside**. **Receipts are quiet (v0.4):** the latest message of each sender shows its receipt; older ones show it on hover or keyboard focus (CSS `:has()`; nothing is removed from the DOM or the accessibility tree). In team chats the name stands alone over the bubble; role and time are in its tooltip and the receipt.
- **Run summary:** the checklist "✓ **key** → result · detail" (from the Grok Bot teardown) inside the bubble.
- **System line:** centred, 13 px, Text 3, with a glyph: "Memory updated · lesson: …", "Renamed to Lumen", "Bench picked Karim".
- **Handoff chip (v0.4, C2: the brand board's motion):** a white chip with the sender's 18 px face and "Brief · S1-6" rises (fade + scale .7 → 1), flies an arc between the two faces (`offset-path`, `--ease-in-out`), is absorbed at the receiver (fade, scale → .4), and the receiver squashes once (1.1 × .92, then .97 × 1.03) as it lands. 1.3 s, played once on arrival. At rest and under reduced motion the chip waits at the top of the arc. The line under it is only "Maya handed **S1-6 SQLite persistence** to Karim · Look inside".
- **Thinking:** three dots in the agent's ink plus the word and what it's doing. After 10 s: "Still thinking · 14 s · reading 3 files" with a Stop.
- **Applied chip:** "**Applied** what Noor learned on 22 Oct: use the repo's date library". It glows once in the agent's tint the first time.
- **Recovery card** (failed run): cause in plain words first ("The test run stopped: out of memory."), what was kept (chips: "3 files changed, kept", "checkpoint 09:12"), one primary (Retry with 2 workers), a secondary (Ask Karim) and Look inside. Never a stack trace first.
- **Long content:** collapsed at about 6 lines with a fade and "Show all 512 lines".

### 11.8 Side-panel rows
- Nav rows 36 px. **v0.4:** the first row is **Atlas** (its face, "Atlas"), which is Home; What needs you is no longer a row (it is the top bar's count and an overlay). Group headers 32 px, 12 px Text 3, with 24 px icon actions that **show on hover or focus only**, and a visible "…" (same menu on right-click).
- **Agent row (v0.4, calm):** 40 px, avatar 28 with its status badge, name 15/400 (600 when selected), ellipsis on overflow. The snippet, time and "Typing" line moved to the row's tooltip ("Noor · Developer / Working · running pnpm test chat") and its screen-reader text keeps the status word. The project header drops the sprint line (tooltip) and keeps the amber count.
- **States:** default, hover (overlay), **selected (neutral pill, never a colour)**, focus (inset ring), working ("Typing" plus dots in the agent's ink), needs you (amber snippet + amber count), blocked, paused (faded avatar, "paused by you · resumes on Send"), long name (ellipsis; the full name in the tooltip).
- **Rail:** 56 px, 44 px targets, the same selected pill, avatars with badges, a tooltip on each.

### 11.9 Tickets ("What needs you", U6, D-UI7)
- **Collapsed:** 52 px, `--r-lg`, white, avatar 24, title (ellipsis), one tag (Outward, Reserved, Needs you, Meet), chevron. Hover darkens the ring; focus ring; Enter or Space opens; ↑/↓ move.
- **Open:** `--elev-2`, padding 20/22, avatar 32 with badge, title 20/600, status tag and meta, the explanation (≤ 60 characters per line), the evidence (options as selectable cards, the draft, the command), **the one primary** plus a secondary, provenance ("Escalated by Karim at 07:45 after two failed attempts").
- **Open by default:** the top ticket (D-UI7). **v0.4:** tickets live in the **What needs you overlay**, not on Home, so the open ticket's action is the overlay's one Cobalt.
- **Tags (v0.4, calm):** only a gate (Outward, Reserved, Payment: outline + lock) or a state (Blocked). Kind tags (Proposal, Meeting, Work request…) are gone; the group label says Decide, Meet or For your info.
- **Consequences (v0.4):** one quiet 13 px Text 2 line separated by dots ("214 tests · about 3 min · ≈ 0.08 % of your week · stays inside bench/"), not a row of estimate pills.
- **Resolved:** stays 10 s at 60 % with Undo, then leaves on `--ease-exit`; every count updates at once.

### 11.10 Project card (U5)
- Reading order: name → "6 need you" (amber tag) → sprint line ("Sprint 2 · day 1 of 3 · ends Sat 24 Oct") → progress ("2 of 10 done", 20 %, a 6 px bar at the true ratio) → team stack plus the live activity line.
- **States:** default, hover (ring darkens, no lift), focus, loading (the final layout with flat bars, no shimmer), empty project ("No sprint yet · Plan the first sprint").
- A "…" menu on the card (Open here · Open in split view · Open in a new tab, D-UI9).

### 11.11 Routine card (U1, D-UI11)
- Name (15/600), the schedule in words with the owner ("Weekdays at 08:00 · Iris"), the switch, then three figures: **next run**, **last run** (with its cost or its result), **estimate** ("≈ 0.1 % a run").
- **States:** on, running (the agent's working badge in the header), off (Text 2, "Off since you paused it on Tue. Nothing is scheduled."), last run failed (red inline alert with the cause, "Logs kept" and Retry now), paused by the limit ("Paused until Mon 09:00").

### 11.12 Approval card
- One pattern in the inbox, the workspace pane and the ticket; allowing in one place clears all of them. **v0.4:** the agent's request appears **inline in its chat** (the open Ticket, aligned with the bubbles) and in the What needs you overlay; it is no longer docked in the side panel. Resolved anywhere, the inline ticket folds away and the chat's own system line says what happened ("You allowed `pnpm test` in bench once", "You stopped Noor · her request is withdrawn; nothing ran").
- **Head:** avatar 40 with Needs you badge, "Noor asks to run a command", provenance ("Atlas passed it to you: it's a new command pattern"), the risk tag.
- **Evidence:** the command (mono) and where it runs, or the email draft (To, Subject, body).
- **Consequence chips** before the buttons: what it does, ≈ time, ≈ % of your week, the scope ("Stays inside bench/").
- **Actions:** Allow once (primary) · Always allow this pattern (secondary) · Deny (tertiary). Outward: **Send to Dana · 1 email, from you** (only you press it, BR-15) · Edit · Discard.
- **After:** collapses to one line: "Allowed once by you at 09:20. Noor is running the tests." + Look inside; or "Denied at 09:24. Karim will open a pull request for you to merge instead. Nothing ran." + Undo.

### 11.13 Toasts and tooltips
- **Toast:** Ink, `--r-md`, `--elev-3`, bottom right, one at a time, max 440 px. Glyph · message · action(s) in Cobalt 300. After your action: Undo for 10 s, with a thin timer. Information: auto-hides after 6 s. Errors and limits: stay until acted on and name the cause ("The email connector was revoked. Iris's draft is kept; nothing was sent. Reconnect").
- **Tooltip:** Ink, `--r-sm`, 12 px, max 240 px, with the shortcut in Text inverse 2. Shown after 500 ms, on focus too.

### 11.14 Dialog
- Only for decisions that must block: deletes and outward actions.
- 460 px, `--r-xl`, `--elev-4`, 32 % Ink scrim. Avatar + title naming the object ("Delete Noor?"), the consequence in numbers, the Reserved tag and who can do it, a typed confirmation, then Export memory (tertiary) · Cancel · **Delete Noor** (danger, disabled until the name matches).
- Focus starts in the field, is trapped, Esc cancels and focus returns to the trigger.

### 11.15 Context menu
- Same menu from the "…" button and right-click. 260 px, `--r-md`, `--elev-3`, 6 px padding, 32 px items, 16 px icons, shortcuts in Text 3.
- **States:** default, hover, focus (same fill plus ring), disabled (the reason replaces the shortcut: "Sprint running"), danger last in red ink, separated by one rule.

### 11.16 Usage and context meters
- **Usage ring** in the top bar (U7): 18 px ring and "41 % of your week". States: normal (Ink), hover, getting close at 80 % (amber ring, "84 % · getting close"), limit (full ring, "Paused until Mon 09:00"). The tooltip gives the reset time and headroom.
- **Usage card:** the figure (20/600), headroom, a 6 px bar at the true ratio with both ends labelled and a tick at your 70 % line (VISION guardrail: keep ≥ 30 % headroom).
- **Context meter:** the bar, a tick at your checkpoint (50–85 %, default 70 %) and the **fixed 90 % ceiling** as a hatched end. States: normal, approaching ("checkpoint soon", amber text), checkpointing (the working badge), checkpoint failed (amber inline alert: "Checkpoint incomplete. Noor kept the good one from 09:12 and is waiting." + Retry).

### 11.17 Empty, loading and error
- **Quiet empty (v0.4):** inside a panel or a list that is not the screen's subject, an empty state is **one line of Text 3** ("No routines yet.", "Nothing on Iris's screen right now.") with the create action in the section header. No dashed box, no illustration.
- **Empty** (the screen's own subject: first use, cleared, no results): headline (20/600), one sentence of why, one next step; an avatar only where an agent is the subject. "You're all caught up. The team is working on 7 things." · "No routines yet" with two examples that draft on click · "Nothing matches 'deploy'" with a way to widen the search.
- **Loading:** the final layout with flat Porcelain 100 bars at their real size; rows keep their pitch; no shimmer; no layout shift when data lands.
- **Error:** inside the block that failed, one sentence with the cause and the last good time, Retry. Never a full-screen error for a part of a screen.

---

## 12. One pattern per situation

| Situation | The one pattern |
|---|---|
| Something needs your decision | The Ticket, in the What needs you overlay and inline in the agent's chat; amber "Needs you" count in the top bar; Cobalt primary |
| Something is secondary on this screen (v0.4) | Collapsed behind one click: a disclosure ("More", "Per-tool overrides", "Frontmatter"), a tooltip, hover, or a closed panel. Never a second card competing with the first |
| What something will cost | Estimate chip "≈ x % of your week", or the consequence on the button |
| Open the glass box | "Look inside" with the eyes |
| What an agent is doing | Avatar badge + status word; at hero size, the status line |
| Something failed | Recovery card: cause, what's safe, one next step, Look inside |
| You hit a limit | Calm paused state with the exact resume time and the count paused |
| You did something reversible | Ink toast with Undo for 10 s |
| A list is empty | Headline, why, one next step |
| Settings change | Saves itself, "Saved" stamp, "applies from the next step" |
| Selection | Neutral pill (rows), white thumb (segmented), Ink underline (tabs), Ink fill (filter chips). Never Cobalt |
| Corners | One continuous family; pills for controls |

---

## 13. Premium-craft outputs

### 13.1 Component state matrix
✅ designed in `components.html` · N/A with a reason.

| Component | Default | Hover | Pressed | Focus | Disabled | Loading | Error | Empty | Success |
|---|---|---|---|---|---|---|---|---|---|
| Buttons (6 variants) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A: the result shows the error | N/A | ✅ toast |
| Inputs | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | ✅ placeholder | ✅ Saved |
| Select | ✅ | ✅ (option) | N/A | ✅ (open) | ✅ (option) | N/A: options are local | N/A | N/A | ✅ check |
| Composer | ✅ | N/A | N/A | ✅ | ✅ Send | ✅ agent working (Stop) | ✅ not sent | ✅ | ✅ Seen |
| Switch | ✅ | ✅ | N/A | ✅ | ✅ off and on | ✅ saving | N/A: can't fail locally | N/A | ✅ Saved |
| Segmented and tabs | ✅ | ✅ | N/A | ✅ | ✅ | N/A | N/A | N/A | ✅ selected |
| Tags, chips, Look inside | ✅ | ✅ | N/A | ✅ | ✅ (filter) | N/A | ✅ Error tag | ✅ "FYI · 0" | ✅ Done |
| Avatars | ✅ | N/A (tooltip) | N/A | N/A | ✅ Unassigned | ✅ Working, Thinking | ✅ Error, Blocked | ✅ Unassigned | ✅ Done |
| Messages | ✅ | ✅ Look inside | N/A | ✅ | N/A | ✅ Sending, Thinking, 14 s | ✅ not sent, recovery | ✅ "Today" | ✅ Seen, checklist |
| Side-panel rows | ✅ | ✅ | N/A | ✅ | ✅ Paused | ✅ Typing | ✅ Blocked | N/A | ✅ selected |
| Tickets | ✅ | ✅ | N/A | ✅ | N/A | N/A: data is local | N/A | ✅ all caught up | ✅ resolved + Undo |
| Project card | ✅ | ✅ | N/A | ✅ | N/A | ✅ skeleton | stage 2 | stage 2 | ✅ |
| Routine card | ✅ | N/A | N/A | via switch | ✅ off | ✅ running | ✅ failed | ✅ no routines | ✅ last run |
| Approval card | ✅ pending | via buttons | via buttons | via buttons | N/A | ✅ Allowing | ✅ revoked connector (toast) | N/A | ✅ allowed, denied |
| Toast, tooltip | ✅ | N/A | N/A | ✅ actions | N/A | N/A | ✅ | N/A | ✅ |
| Dialog | ✅ | N/A | N/A | ✅ field | ✅ Delete until typed | ✅ Deleting | stage 2 | N/A | stage 2 |
| Context menu | ✅ | ✅ | N/A | ✅ | ✅ with reason | N/A | N/A | N/A | N/A |
| Usage, context meters | ✅ | ✅ ring | N/A | N/A | N/A | ✅ checkpointing | ✅ checkpoint failed | N/A | ✅ |
| Empty / loading / error | ✅ | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ | N/A |

"Stage 2" cells are screen-level states the prototype rebuild will design (a project with no sprint, a failed delete).

### 13.2 Emotional-moment map
Chosen 2–3 per flow (full table in BRAND §10): **Create** → birth + "Renamed to Lumen" · **Approve** → the glance + "Allowed once" with Undo · **Task done** → green finish · **Handoff** → the brief travels · **Learning** → the Applied glow · **Limit** → calm pause with the exact time. Each is rendered on the brand board (motion tiles) or in the gallery.

### 13.3 Worst-moment pass (component level)
| Worst moment | Where it's designed | Cause · what's safe · next step |
|---|---|---|
| Offline mid-send | Your bubble, failed state | "Not sent: you're offline. Kept here." · Retry |
| Weekly limit hit | Usage ring "Paused until Mon 09:00", limit toast, routine card | "2 runs resume Mon 26 Oct at 09:00, nothing is lost" · Details |
| Run crashes | Recovery card | "Out of memory" · changes and the 09:12 checkpoint kept · Retry with 2 workers / Ask Karim |
| Approval denied | Approval card, denied row | "Karim will open a pull request instead. Nothing ran." · Undo |
| Connector revoked | Error toast | "Iris's draft is kept; nothing was sent." · Reconnect |
| Checkpoint fails | Context meter, failed state | "Kept the good one from 09:12, waiting" · Retry |
| Every list empty | Empty states | headline, why, one next step |
| Long name, 500-line message | Sidebar row (ellipsis + tooltip), collapsed diff | "Show all 512 lines" |
| Slow response (10 s+) | Thinking line | "Still thinking · 14 s · reading 3 files" · Stop |

### 13.4 Coherence findings (v0.2 → now)
1. Three corner systems (8 / 18 / 980) → **one continuous family**.
2. "Action needed" pill, "Waiting for you" tag and "needs me" → **one word: Needs you**, one amber.
3. "Trace" links in different places → **Look inside**, always after the cost.
4. Periwinkle agent ink looked like a link → **Pear**.
5. Inputs and composers at 1.5:1 edges (v0.2 open item) → **3.41:1 control edge** everywhere.
6. Counts were Ink circles in some places, amber tags in others → **amber = needs-you queue, Ink = other queues**.
7. Seven type sizes with 14 and 15 side by side, 300-weight subheads → **six steps, ≤ 4 per view, 400/600**.
8. Idle looked asleep (same as Paused) → **Idle calm, Paused sleepy**.
9. Error looked alarmed → **concerned**, with the recovery card's calm copy.
10. Menus and the dialog had no elevation → **elev-3/4 for what floats only**.

### 13.5 Rubric (stage 1: brand and system; screens come in stage 2)
| Axis | Level | Evidence | Left for stage 2 |
|---|---|---|---|
| Copy | **Senior** | Second person throughout; consequence on buttons; recovery copy with cause, what's safe, next step; Write/Not table | Staff needs the copy walked through every flow |
| Visuals | **Staff** | Custom language: the Look, the Quartet mark built from the agents' own shapes, 90-identity family, Look inside glyph, three sounds from one family | Hold restraint on real screens |
| Color | **Staff** | Colour only for action, needs-you, state and identity; 60-30-10; every text pair verified live | Measure colour share per screen |
| Type | **Senior** | Six steps, ≤ 4 per view, two weights, tabular figures, tracking per step | Prove "type does the hierarchy" on screens |
| Structure | **Senior** | 4-pt scale by relationship, one radius family, sizes table | Grid arithmetic per screen |
| States and recovery | **Senior** | Full component matrix (§13.1), worst-moment pass (§13.3) | Turn worst moments into trust moments in flows |
| Motion and emotion | **Senior** (Staff candidate) | Springs with stated physics; signature moments that teach (glance = needs you, chip = who has the work); reduced motion keeps the information | Staff once they live in the prototype flows |
| Coherence | **Senior** | One pattern per situation (§12); coherence fixes (§13.4) | The hour-long walk in stage 2 |
| Intelligence | **Senior** | Applied chip with provenance, memory counts on the profile, "Memory updated" lines, export stays one click | The "your team learned" strip on Home |

No axis is below Senior. **Render check:** this session had no browser to render, so the layouts were checked by arithmetic (column sums, widths of the longest labels at 1440, wrapping limits); the PM renders both pages at 1440×900 and 1280×800 in headless Edge. Pages to check first: `brand-board.html` first viewport (hero), `components.html` first viewport (colour) and `#buttons`.

---

## 14. Decisions (all closed on 2026-10-23)

| # | Decision | Replaces | Status |
|---|---|---|---|
| P-1 | Porcelain + Ink neutrals | Apple Frost `#f5f5f7` + Carbon `#1d1d1f` | **Decided 23 Oct**, kept as built |
| P-2 | Cobalt `#2e5bff` | Apple Blue `#0071e3` | **Decided 23 Oct**, kept as built (supersedes the 22 Oct "not blue" note) |
| P-3 | Instrument Sans 400/600 + JetBrains Mono, OFL, bundled | The platform's own face | **Decided 23 Oct** (§4) |
| P-4 | Pear replaces Periwinkle | Periwinkle | **Decided 23 Oct** |
| P-5 | Continuous corners, one radius family | 8 / 18 / 980 | Decided 22 Oct (R3) |
| P-6 | "Look inside" with the eyes glyph | "Trace" link | Decided 22 Oct |
| P-7 | Three sounds on by default, mute in Settings; first-open chime optional, off | Silent by default | **Decided 23 Oct** (§8.5) |

Also from BRAND: B-1 direction A (decided), **B-2 logo = Quartet** (decided 23 Oct; replaces the lit-window eyes mark). Only the name (D-UI5) is still open.

---

## 15. Migration from the v0.2 tokens (for stage 2)

| v0.2 | Now |
|---|---|
| `--blue #0071e3`, `--link #0066cc` | `--action #2e5bff`, `--action-text` (same Cobalt) |
| Frost `#f5f5f7`, White, Carbon `#1d1d1f`, Graphite `#474747`, Ash `#6e6e73` | `--bg-ground #f3f4f7`, `--bg-surface`, `--text-1 #15171d`, `--text-2 #474b57`, `--text-3 #646976` |
| Hairline `#d2d2d7` on controls | `--line-control #868b97`; hairlines become `--line` (Ink 11 %) |
| `--warn-*`, `--ok-*`, `--err-*` | `--attn-*`, `--ok-*`, `--danger-*` |
| `--r-card 8`, bubbles 18, pills 980 | `--r-md 14` cards, `--r-lg 18` bubbles and tickets, `--r-full` |
| Sizes 12/14/15/17/21/28/40 | 12/13/15/20/28/44 |
| PAL.periwinkle | `--hue-pear-*` |
| EXPR idle "sleepy", error "surprised" | idle "calm", error "concerned"; new "pleased", "concerned" |
| Platform face (SF Pro / Segoe UI Variable / Inter) | `--font-text` / `--font-display` = Instrument Sans, `--font-mono` = JetBrains Mono (v1.1) |
| Eyes-on-squircle mark, drawn monoline wordmark | Quartet mark + the name set in Instrument Sans 600 (v1.1, `brand/logo/`) |

## Addendum (v0.3)
- **C-29:** the agent's tint on your bubbles appears only in one-to-one chats with that agent; team chats and meeting sessions use the neutral bubble so no agent's colour dominates a shared space.

## Addendum (v0.4, the calm pass: client feedback round 3, C1–C7)
The principle: **on entering any screen you should feel relief.** Per screen ask "what must be visible right now?"; everything else is one click away (a disclosure, a tooltip, hover, or a closed panel). What always stays visible: costs before a click, outward and reserved consequences, an error's cause and next step, status words, and the one blue (your call).
- **Home is the chat with Atlas (C6).** One centred column (max 680), Atlas's face and name, one message ("morning. 7 things need you. want to see them?") with one secondary action ("Show them"), one composer. Projects, "your team learned" and the ticket list are no longer on Home: projects live in the sidebar, "learned this week" moved to the top of Memory (collapsed), tickets moved to the overlay. In a 1:1 chat (Home included) the top bar sits on the agent's wash, so there is no band.
- **What needs you is an overlay (C6)**, anchored under the top bar's count, over whatever screen you are on (`--elev-4`, 16 % scrim, `--r-xl`, max 600 px; opens on `--spring-smooth` from the count's corner). Grouped Decide · Meet · For your info, top ticket open, counts tick everywhere as you resolve. "Decided by Atlas" is its footer link. A project shows "3 things here need you" as one line that opens the overlay filtered to that project. Esc, × or the scrim close it and focus returns to what opened it.
- **The agent page starts as just the chat (C5).** No header bar: the face, name and status are the hero; two tools float top-right (the context meter, hidden when the chat is under 620 px, and a screen icon with a live dot). The icon opens a 360 px **panel**: a compact live preview of the agent's screen (click it for the full view: diff, files, terminal, Take over) with **Routines** under it as compact rows (name, when and cost per run; click a row for its figures and actions). **Settings opens from the gear** in the panel header, beside ×. The full view and Settings widen the panel.
- **Colour budget:** status colour only where it carries meaning (Blocked, Needs you, Error, Done) and never as a decoration on a row that already has a word; neutral tags that repeat a heading are removed.
- **Meta text budget:** at most one meta line per object at rest; receipts quiet (see 11.7).
- **Fewer boxes:** a group is shown by spacing and one heading before a container; headers lost their fills and borders (agent page, project dashboard, team chat); empty columns and panels use quiet one-line states.

### Calm pass: component changes in this version
| Component | v0.3 | v0.4 |
|---|---|---|
| Send button (C1) | Text 2 arrow on Ink (2.1:1, looked empty) | White arrow, 17.9:1; hover 13.6:1; pressed 21:1 |
| Optional label (C3) | Grey "optional" box (class collision) | "(Optional)" after the label, 12/400 Text 3 |
| Agent row | 56 px: name, time, snippet | 40 px: face with badge, name; the rest in the tooltip |
| Ticket tags | Kind + gate + state | Gate or state only |
| Ticket consequences | 4 estimate pills | One quiet line |
| Receipts | Under every bubble | Latest per sender; the rest on hover/focus |
| Approval in the agent page | Docked in the workspace pane | Inline in the chat; the panel is closed by default |
| Routine card | Card with 3 figures, tag, switch, menu | Row: name, when · cost per run, switch; figures on click |
| Settings nav | Two lines (name + summary) | One word; the summary is the tooltip |
| Handoff (C2) | A dark chip sliding on a dashed line | The brand board's arc flight, absorb and squash |
| New-agent name (C4) | Fixed "Lumen" | Atlas's suggestion; click the pill to rename (validated) |
