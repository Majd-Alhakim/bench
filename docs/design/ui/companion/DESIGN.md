# UI design: your Euca in the notch

| Date | Author | Status | Builds on |
|---|---|---|---|
| 2026-10-26 | PM + UI (Claude), `ui-designer` role standards | **Needs founder design approval — do not build or reuse before it** (CR-011 §6) | [CR-011](../../../requirements/change-requests/CR-011.md) · UX: [notch-and-panel.md](../../ux/companion/notch-and-panel.md), [setup-flow.md](../../ux/companion/setup-flow.md) · [BRAND](../brand/BRAND.md) · [tokens.css](../system/tokens.css) · [the 2026-10-25 notch design](../../ux/2026-10-25-atlas-notch-design.md) · the [direction prototype](../prototype/direction.html) effects |

**In this folder:** this file · [tokens-notch.css](tokens-notch.css) (the only new tokens) · [prototype/notch.html](prototype/notch.html) (hi-fi, clickable, one file) · [screens/](screens/) (57 PNGs) · [SELF-REVIEW.md](SELF-REVIEW.md). The unapproved tray-and-window design (PR #57) is in [v1-tray-superseded/](v1-tray-superseded/), kept as history.

**Open the prototype:** double-click `prototype/notch.html` (Edge or Chrome; fonts load from Google Fonts for review). It opens on a Windows desktop with your Euca, Pip, in the notch. Hover the notch, click it. The **States** button bottom-left is the demo control, not the UI: a jump menu to all 54 states, light/dark, reduced motion, thin line, and "Simulate: needs you". URL: `?r=<state>`, `?theme=light`, `?bar=0`, `?freeze=1`. `node prototype/build.mjs` rebuilds from `prototype/src/`; `node prototype/capture.mjs` re-renders the screens.

---

## 1. Visual direction: a character that belongs to the screen

**The idea.** Your Euca is not an app you open; it's a small creature that lives in the edge of your screen. The notch is **black like hardware** in both themes, so it reads as part of the display, not as another window. Inside it there are only the **two white eyes** (the Look, BRAND §5), and one moving thing: **the beam in your Euca's colour** when sessions work. Everything you need to read sits one hover or one click away.

**Why this, not something louder.** The founder asked for one clear character, calm UI (nothing opens by itself), relief over wow. A black pill with two eyes is the least that can carry *on, working, needs you, not protected* without words, and the eyes give it a personality nobody else on Windows has: other notch tools show music, timers or a logo. The brand's signature was always the eyes; now the product *is* the eyes.

**Built from the system, not a new brand.** Porcelain / charcoal / Cobalt, Instrument Sans 400/600 + JetBrains Mono, the six-step type scale, the springs, the continuous corners, the 9 shapes × 10 hues and the eye expressions all come from `tokens.css` and BRAND unchanged. `tokens-notch.css` adds only the notch object, its markers and its timings.

### 1.1 What's reused, what's retired

| From | Reused | Retired |
|---|---|---|
| 2026-10-25 notch design (approved) | Hover not pop · marker that stays · the eyes follow and doze · the voice glow as the activity beam · sounds once on arrival · steps aside for full-screen apps · click-through outside the shape | The prompt bar, quick talk, drops and intent chips (the Euca never takes work: it's an agentsitter) |
| Direction prototype effects (PR #52) | Eye-follow (pinned Eucas) · the voice glow → beam · the avatar renderer and expressions | Thinking orbs (no chat), gooey + (no composer) |
| PR #57 companion UI (never approved) | Copy strings · guard state model · needs-you item · rule row and suggested rule · usage meter + forecast line · tripwire content · checklist · Windows chrome conventions | Tray popover as home · six-section main window · per-project session avatars · the heartbeat strip as the signature |

### 1.2 Windows first

| Decision | What | Why |
|---|---|---|
| **A notch on a screen with no notch** | Flush with the top edge, bottom corners 16 px, **concave 8 px shoulders** where it meets the edge, a 1 px light ring and a soft shadow | The shoulders make it read as part of the display (like a hardware notch) rather than a floating toolbar. The ring keeps it visible on black wallpapers and full-black apps |
| **Always black** | `--notch-bg #0b0b0b` in both themes; the peek is part of the same object | A notch belongs to the screen. On a light wallpaper a black tab reads as hardware; a white one reads as a window |
| **Thin line for thick bezels** | 96 × 4 px line, grows into the pill on hover | Laptops with a deep top bezel already have dead space; the pill would look stacked on top of it |
| **The panel follows the Eucas theme** | Dark default, light option, `--bg-raised` / white, 18 px corners, `--elev-4` | It's where you read and change things, so it follows your reading preference |
| **Windows draws its own chrome** | UAC, the tray menu and the fallback notification use Segoe UI and Windows metrics; everything Eucas draws uses Instrument Sans | Designing Windows' dialogs in our face would be a fiction the build can't ship |
| **No macOS cues** | No traffic lights, no menu bar, no vibrancy | Constraint |

### 1.3 Colour and type budget

- **The notch:** black, white eyes, the Euca's colour only in the beam. Amber only for the needs-you marker, red only for *not protected* and *tripwire*, green only in the status dot for a check that really happened.
- **The panel:** 60 % ground, 30 % surfaces and text, 10 % meaning. **One Cobalt per view:** the first needs-you item's action, or the draft's Add rule, or nothing. Usage meters fill in Ink; amber only past your warning line, with the word "close". The supervisor meter fills in the Euca's colour (it's the Euca's own capacity).
- **Type:** 12 meta · 13 sub · 15 body · 20 title in the panel (4 steps); setup adds 28 for headlines. Two weights. Mono for commands, paths and the drafted rule. Tabular figures on every number that changes.

---

## 2. The notch, anatomy

```
          shoulder ╮                              ╭ shoulder
 ─────────────────╯ [label] [eyes] [marker]        ╰──────────── top edge of the screen
                    ╰──── beam (2 px) ─────╯   ← 3 px from the bottom
                          glow (blurred, below the notch)
```

| Part | Spec |
|---|---|
| Body | 124 × 32 at rest · 164 with a marker · auto width for "Not protected" (label + eyes) and a tripwire stop (eyes + red marker) · bottom radius 16 · `--notch-bg` · ring `inset 0 -1px 0` + `0 0 0 1px` at 9 % white · shadow `0 6px 20px` 35 % |
| Eyes | Two pills 5 × 13, rotated −12°, 9 px apart, `--notch-eye`. Follow: ≤ 2.5 px x, ≤ 1.5 px y, eased over 260 px of pointer distance. Blink: scaleY 0.08 for 150 ms every 3.8–7.2 s |
| Expressions | calm (default) · glance (3 px toward the marker on arrival, 900 ms) · **concerned** (pills rotated ±16°, for not protected and tripwire) · **sleepy** (9 × 2.6 arcs, grey, for dozing) · closed (grey, before setup) |
| Beam | 2 px, inset 12 px, a 46 % wide gradient `transparent → --euca-light → --euca-base → transparent` sweeping 1.7 s each way, `ease-in-out`, alternate |
| Glow | 12 px tall ellipse below the notch, blur 8, the Euca's base colour at 55 %, swaying with the beam. Hidden while the peek is open |
| Marker (amber) | 18 px pill, `--marker-attn`, Ink text 11/600 tabular: the count |
| Marker (red) | 18 px pill, `--marker-danger`, white: stop glyph + "Stopped notes" |
| Label | "Not protected", 12/600, `--notch-danger`, left of the eyes; red ring `inset 0 0 0 1px` 50 % |
| Thin line | 96 × 4, radius 0 0 4 4; the beam runs along it; needs-you adds an 8 px dot at the right end (amber or red) with a 2 px black ring |

### 2.1 The peek

The notch's own body grows down into a 372 px card (clip-path morph from the notch's size, `--spring-smooth` 320 ms), so the eyes never move: **spatial continuity**. Same black, radius 22, the shoulders continue. Content starts under the 32 px notch row.
- **Items** (≤ 3): severity glyph (20 px circle, tinted) · title 13/600 · one evidence line 12 (commands in mono) · one action (28 px pill; the first danger item's action is white, the only "primary" in the notch).
- **Footer:** status dot + "Protected · 3 sessions" · **Open panel ›**.
- **Nothing waiting:** two lines: "● Protected · 3 sessions · checked 2 s ago" and "5-hour 46% · week 62% · supervisor 78% left".
- **Timing:** opens after 280 ms of rest, folds 360 ms after the pointer leaves both notch and peek. Keyboard focus on the notch opens it too.

### 2.2 The panel

| Part | Spec |
|---|---|
| Frame | 400 × up to 640 (fits a 1366 × 768 laptop's 728 px work area), 8 px under the notch, centred on it · radius 18 · `--elev-4` · grows from the notch: scale 0.97 → 1, y −10 → 0, fade, `--spring-smooth` 320 ms |
| Header | 40 px soft avatar (eyes follow) · name 15/600 with the lock chip right-aligned on the same row · status line 13 under it, full width, with a 7 px dot (green = a real check, red = not protected) |
| Needs you | section title "Needs you · 3" · items: 14 px radius, surface tone, `--elev-1`; red items add a 1 px red inner ring · time top-right · actions 32 px (primary Cobalt on the first item only) + "Not now" ghost |
| Tabs | segmented, full width, 34 px, `--seg-on` thumb · WAI-ARIA tabs (arrow keys) |
| Content | scrolls; the bottom 20 px fades out so a cut row reads as "more below" |
| Sub-pages | replace the content in place; a 32 px back button + title 15/600 |
| Toast | inverse pill at the bottom of the panel with Undo (10 s) |

---

## 3. Components

| Component | Where | Notes |
|---|---|---|
| `Notch` | always | states in §2; `role=button`, its label says the whole state ("Pip: protected, 2 need you. Open the panel.") |
| `NotchMarker` | notch | amber count / red words; never colour alone |
| `Peek` + `PeekItem` | notch hover | one action per item, never Allow/Deny |
| `Panel`, `PanelHeader`, `LockChip` | panel | the chip opens Rules |
| `NeedsYouItem` | panel and peek (compact) | **one pattern**: same words, same order, same action in both |
| `Tabs` | panel | Usage · Rules · Settings (order: decision D-1) |
| `UsageMeter` + `ForecastLine` | Usage | from #57: % big and tabular, reset time, a tick at your warning line, one forecast sentence |
| `WhereItWent` | Usage | project bars, Today / 7 days |
| `SupervisorMeter` | Usage, meter sheet | % left + reset date + value line; **no dollars, no counts of budget**; empty state copy fixed (CR-011) |
| `PromiseText` | Rules | the one honest-promise string |
| `LockRow` | Rules | locked (neutral) / not locked (amber, with Lock) |
| `RuleRow` | Rules, setup 4 | title, detail, lock glyph, switch; locked switches explain on press |
| `RuleComposer` + `DraftCard` | Rules, setup 4 | described → exact rule in mono → effect last week → Add · Reword · Lock it too |
| `SettingsRow`, `Radio` (privacy), `Seg` (notch look, theme) | Settings | — |
| `PlanCard` | Settings › Plan | trial / taste / Pro |
| `EucaEditor` | setup 2, Settings › Name and look | **one** editor in both places |
| `SetupWindow` + `StepProgress` | setup | 760 × 600, 8 segments |
| `Stage` + `MiniNotch` | setup 2 | the birth moment and a preview of where it lives |
| `DraftCard`, `Checklist`, `LiveLog`, `LevelCard`, `Heartbeat` | setup | — |
| `CoachMark` | once after setup | arrow to the notch, Got it |
| Windows-drawn: `UAC`, `TrayMenu`, `WinNotification` | — | Segoe UI, Windows metrics |

---

## 4. Tokens added ([tokens-notch.css](tokens-notch.css))

| Group | Tokens |
|---|---|
| The object | `--notch-bg` `--notch-ring` `--notch-shadow` `--notch-text(-2,-3)` `--notch-line` `--notch-hover` `--notch-btn(-hover)` `--notch-eye(-dim)` `--notch-danger(-ring)` `--notch-ok` |
| Markers | `--marker-attn(-text)` `--marker-danger(-text)` |
| Geometry | `--notch-h 32` `--notch-w-rest 124` `--notch-w-marker 164` `--notch-r 16` `--notch-shoulder 8` eye sizes and travel · `--notch-thin-w 96` `--notch-thin-h 4` · `--peek-w 372` `--peek-r 22` · `--panel-w 400` `--panel-max-h 640` `--panel-gap 8` |
| Motion | `--notch-hover-intent 280ms` `--notch-leave-grace 360ms` `--notch-morph 320ms` `--notch-arrive 640ms` `--notch-sweep 1.7s` blink min/max · `--notch-doze-after 5min` |
| Identity | `--euca-base` `--euca-light` `--euca-deep` are set at runtime from the chosen hue (`--hue-*` primitives) |

Contrast is computed in the file's header: notch text 16.6:1, danger label 8.6:1, Ink on the amber marker 8.3:1.

---

## 5. Motion

Physics from `tokens.css`; only the character overshoots.

| Moment | Motion | Reduced motion |
|---|---|---|
| Eyes follow | 140 ms ease-out per frame, ≤ 2.5 px | still, centred |
| Blink | 150 ms, every 3.8–7.2 s | none |
| Working beam | sweep 1.7 s alternate + glow sway | a still segment under the eyes |
| **Needs you arrives** | notch drops 3 px and settles + marker pops (`--spring-gentle`, 640 ms) + glance | marker fades in |
| Peek | clip-path morph from the notch (`--spring-smooth`, 320 ms) | instant |
| Panel | scale 0.97 → 1, rise 10 px, fade (320 ms) | fade |
| **Birth** (setup 2) | squash 1.06/0.94 and settle (`--spring-gentle`), one blink | blink only |
| **Homecoming** (setup 8) | the avatar flies to the notch (900 ms) and becomes its eyes; eyes open from a line | crossfade |
| Heartbeat chip | ring every 2.4 s, never faster than 2 s | timestamp only |

## 6. Sound (BRAND §11, P-7)
- **Needs you** (A4 → D5, 320 ms): once when an item arrives, and for a tripwire stop. Not during full-screen apps or calls; Windows Focus silences it.
- **Done** (F♯5, 380 ms): the safety test blocks in setup; your Euca reaches the notch.
- No sound for working, hover, panel, or the meter. Settings › The notch › Sounds mutes both. Every sound has a visible twin.

---

## 7. Copy

Second person; your Euca speaks of itself by name ("Pip will check with you more often until 1 Dec"), never "I/me/my" for you. Numbers first, one next step. "Claude Code" only in plain text. No exclamation marks.

### 7.1 Fixed strings (stored once)
- **Promise:** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."
- **Privacy (approved):** "Nothing about your work leaves this PC unless you turn it on."
- **Diagnostic (approved):** "No paths to your projects or files."
- **Meter empty (CR-011, with the name):** "Pip will check with you more often until 1 Dec."
- **Never approves:** "It never approves a tool call."

### 7.2 What the removal test cut
- "Welcome to Eucas!" and any feature tour (setup step 1 starts with your sessions).
- A title on the panel ("Eucas") — the avatar and name already say whose panel it is.
- "Help left" repeated next to "left until…" on the meter (one label, the date on the right).
- The second "Stopped notes" title on the tripwire page (the page title is "Tripwire stop").
- Labels on the notch other than "Not protected" and the tripwire marker.

### 7.3 Words we don't use
Seamless, effortless, supercharge, unleash, magic, AI-powered, smart (as an adjective for us), "Oops", "Something went wrong", "Are you sure?".

---

## 8. Accessibility
- **Keyboard:** the global shortcut opens the panel; focus on the notch opens the peek; Tab reaches each peek action; Esc closes peek → sub-page → panel and returns focus to the notch. Tabs follow WAI-ARIA (arrows).
- **Screen readers:** the notch's label states protection, activity and the count; arrivals are announced once in a polite live region ("bench is waiting for you"); meters are `role=meter` with values.
- **Never colour alone:** eye shapes + words + glyphs; the notch reads in a 1-bit render; forced colours map to system colours.
- **Targets:** 32 px floor in the panel (28 px peek buttons grow their hit area to 32); 40 px primaries in setup.
- **Contrast:** AA everywhere, body text in the panel well past AAA (text-1 on the raised surface about 11:1).
- **Reduced motion:** §5. **Zoom / DPI:** sizes are CSS px; the notch and panel scale with Windows display scaling.

## 9. Decisions for the founder
See [SELF-REVIEW.md §5](SELF-REVIEW.md).

## 10. For the build (SP-ST1 and after)
- The notch is a Tauri window: always-on-top, no focus at rest (`focusable: false` until the panel opens), click-through outside the shape (`set_ignore_cursor_events` toggled by hit-testing the shape, or a window region), hidden when a full-screen app is foreground.
- The peek and the panel can be the same transparent window that resizes, so the morph is one surface; or the panel a second window. SP-ST1 measured a flyout first frame at p95 67 ms; the morph needs ≤ 100 ms to feel attached.
- Idle: the beam and blink are the only loops; pause both when the display sleeps or the notch is hidden.
- Tokens: `tokens.css` + `tokens-notch.css` move to `packages/ui-tokens/` at S1-1 (CODE-STRUCTURE).
