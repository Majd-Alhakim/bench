# UI design: your Euca in the notch

| Date | Author | Status | Builds on |
|---|---|---|---|
| 2026-10-26 | PM + UI (Claude), `ui-designer` role standards | **§1–§10 approved by the founder 26 Oct** with D-1 to D-8 as recommended · **§11 "New since approval" needs approval** · **§12 CR-012 / always-on (account, What is sent) needs approval** · **§13 The website (eucas.app)**, from the founder's review of PR #81, 2026-10-26 · **2026-10-26 setup reorder** (founder, *"okay do that"*): the four limits are locked (step 4) and tested (step 5) before sign-in (step 6); rules (step 7) start Not locked | [CR-012](../../../requirements/change-requests/CR-012.md) · [CR-011](../../../requirements/change-requests/CR-011.md) · UX: [notch-and-panel.md](../../ux/companion/notch-and-panel.md), [setup-flow.md](../../ux/companion/setup-flow.md) · [BRAND](../brand/BRAND.md) · [tokens.css](../system/tokens.css) · [the 2026-10-25 notch design](../../ux/2026-10-25-atlas-notch-design.md) · the [direction prototype](../prototype/direction.html) effects |

**In this folder:** this file (§13: the website) · [tokens-notch.css](tokens-notch.css) (the only new tokens) · [prototype/notch.html](prototype/notch.html) (hi-fi, clickable, one file) · [screens/](screens/) (78 PNGs) · [SELF-REVIEW.md](SELF-REVIEW.md). The unapproved tray-and-window design (PR #57) is in [v1-tray-superseded/](v1-tray-superseded/), kept as history.

**Open the prototype:** double-click `prototype/notch.html` (Edge or Chrome; fonts load from Google Fonts for review). It opens on a Windows desktop with your Euca, Pip, in the notch. Hover the notch, click it. The **States** button bottom-left is the demo control, not the UI: a jump menu to all 93 states (*CR-012 / always-on, 2026-10-26*: 74 + 19, a new group "Account and what is sent"), light/dark, reduced motion, thin line, and "Simulate: needs you". URL: `?r=<state>`, `?theme=light`, `?bar=0`, `?freeze=1`. `node prototype/build.mjs` rebuilds from `prototype/src/`; `node prototype/capture.mjs` re-renders the screens.

---

> **Founder decisions applied (26 Oct, later the same day):** the four limits are **always on**, locked or not locked per limit; **guided merge** stays in Free as a needs-you item; **budgets** stop the agent before its next step; drafting a described rule **uses the supervisor and counts on the meter**; the app says **"your default branch"**, never "main"; v0.1 is **unsigned** and shows no "signed" badge.

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
| Faces | Only the eight of the eye grammar (§2.3), nothing else |
| Beam | 2 px, inset 12 px, a 46 % wide gradient `transparent → --euca-light → --euca-base → transparent` sweeping 1.7 s each way, `ease-in-out`, alternate |
| Glow | 12 px tall ellipse below the notch, blur 8, the Euca's base colour at 55 %, swaying with the beam. Hidden while the peek is open |
| Marker (amber) | 18 px pill, `--marker-attn`, Ink text 11/600 tabular: the count |
| Marker (red) | 18 px pill, `--marker-danger`, white: stop glyph + "Stopped: notes" (the project after a colon; "Stopped notes" read like a typo) |
| Label | "Not protected", 12/600, `--notch-danger`, left of the eyes; red ring `inset 0 0 0 1px` 50 % |
| Thin line | 96 × 4, radius 0 0 4 4; the beam runs along it; needs-you adds an 8 px dot at the right end (amber or red) with a 2 px black ring |

### 2.1 The peek

The notch's own body grows down into a 372 px card, so the eyes never move: **spatial continuity**. *Revised 2026-10-26 (founder): the growth is **gooey**, not a clip-path morph: the notch and the card are two black shapes under a goo filter (§5.1), so the card melts out of the notch and back into it.* Same black, radius 22, the shoulders continue. Content starts under the 32 px notch row.
- **Items** (≤ 3): severity glyph (20 px circle, tinted) · title 13/600 · one evidence line 12 (commands in mono) · one action (28 px pill; the first danger item's action is white, the only "primary" in the notch).
- **Footer:** status dot + "Protected · 3 sessions" · **Open panel ›**.
- **Nothing waiting:** two lines: "● Protected · 3 sessions · checked 2 s ago" and "5-hour 46% · week 62% · supervisor 78% left".
- **Timing:** opens after 280 ms of rest, folds 360 ms after the pointer leaves both notch and peek. Keyboard focus on the notch opens it too.

### 2.2 The panel

| Part | Spec |
|---|---|
| Frame | 400 × up to 640 (fits a 1366 × 768 laptop's 728 px work area), 8 px under the notch, centred on it · radius 18 · `--elev-4` · grows from the notch: scale 0.97 → 1, y −10 → 0, fade, `--spring-smooth` 320 ms |
| Header | 40 px soft avatar showing the notch's face (§2.3; it follows the pointer only in Calm and Toward you) · name 15/600 with the lock chip right-aligned on the same row · status line 13 under it, full width, with a 7 px dot (green = a real check, red = not protected) |
| Needs you | section title "Needs you · 3" · items: 14 px radius, surface tone, `--elev-1`; red items add a 1 px red inner ring · time top-right · actions 32 px (primary Cobalt on the first item only) + "Not now" ghost |
| Tabs | segmented, full width, 34 px, `--seg-on` thumb · WAI-ARIA tabs (arrow keys) |
| Content | scrolls; the bottom 20 px fades out so a cut row reads as "more below" |
| Sub-pages | replace the content in place; a 32 px back button + title 15/600 |
| Toast | inverse pill at the bottom of the panel with Undo (10 s) |

### 2.3 The eye grammar: the only faces

*Founder, 2026-10-26: "make sure everyone is using this faces everywhere".* Pip (your Euca) has **eight faces and no others**, on every surface: the notch, the avatar, the setup screens, the website, marketing and video. The rendered sheet is [eyes-sheet-d.png](screens/eyes-sheet-d.png); the reference code is the prototype (`prototype/src/notch.css`, the `.eyes[data-x]` rules; `faceOf()` in `prototype/src/app.js`). **The eyes carry the feeling; the marker, the words and the panel carry the meaning.**

**Which face, when.** One face at a time; the first row that matches wins.

| # | State | Face | For how long |
|---|---|---|---|
| 1 | Before you make your Euca (setup) | **Closed** | until it's born; the eyes open from a line (Homecoming) |
| 2 | Not protected, or Pip stopped a session (tripwire, budget stop) | **Concerned** | while it lasts |
| 3 | Something needs you: it just arrived | **Glance** | 900 ms, once per arrival |
| 4 | Something needs you: it waits | **Toward you** | until nothing waits |
| 5 | The last item was dealt with | **Pleased** | 1.6 s, then the face of the state below it |
| 6 | Sessions are working (a tool ran in the last 20 s) | **Focused** | while they work |
| 7 | You're away 5 min **and** nothing runs | **Sleepy** | until you're back or a session starts; it wakes with a blink |
| 8 | Protected, nothing running | **Calm** | the default |

**What each face is.** At 100 %; two eyes, `--notch-eye-gap` (9 px) apart, always white except the two dimmed faces. Avatars draw the same faces at their own scale (Calm 7 × 16 in the 100-unit avatar, so × 1.3); minis scale the whole pair (`scale`), never a single eye.

| Face | Shape | Position and motion | Follows / blinks |
|---|---|---|---|
| **Calm** | pills 5 × 13, fully round, rotated −12° | follow ≤ 2.5 px x, ≤ 1.5 px y over 260 px of pointer distance | yes / every 3.8–7.2 s (scaleY 0.08, 150 ms) |
| **Focused** | 6 × 9, radius 3, upright | reads left to right: ±2 px, 2.4 s ease-in-out, alternate. **The only loop**, and it always comes with the beam | no / no |
| **Glance** | Calm's pills | 3 px toward the marker, 1 px down | no / no |
| **Toward you** | Calm's pills | 1.5 px up; follows the pointer; no bobbing | yes / yes |
| **Concerned** | Calm's pills, left +16°, right −16° (softened) | 1.5 px down; still. Never alarmed: no shake, no red eyes | no / no |
| **Sleepy** | flat dash 9 × 2.6, `--notch-eye-dim` | 3 px down; still | no / no |
| **Pleased** | arc 9 × 5, radius 9 9 3 3 (∩) | 1 px up; still | no / no |
| **Closed** | flat dash 8 × 2.4, `--notch-eye-closed` | 2 px down; still | no / no |

**Rules.** The shape changes, never the count or the colour (BRAND §8). A blink squashes with `scale`, so it never undoes a face's own position. Reduced motion keeps every shape and drops the movement (no follow, no blink, no reading loop; Glance and Pleased still hold for their time). No other face exists: no wide, sad, angry, surprised, winking or heart eyes, no colour in the eyes, and no "happy closed" ∪ arcs.

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
| `SupervisorMeter` | Usage, meter sheet | % left + reset date + value line; ~~**no dollars, no counts of budget**~~ **never dollars or money; counts as a meter are fine** (founder, 2026-10-26: *"Show counts always, but as meter not dollars or money"*; the no-account meter reads "7 of 10", §12.8); empty state copy fixed (CR-011) |
| `PromiseText` | Rules | the one honest-promise string |
| `LockRow` | Rules | locked (neutral) / not locked (amber, with Lock) |
| `LimitRow` | Rules, setup 4 and 7 (*reordered 2026-10-26*: the lock is step 4, before sign-in; step 7 shows them read-only as **Locked**) | the four limits: title, detail, **Locked** chip or amber **Not locked** (press to lock); never a switch |
| `GuidedMergeItem` | needs-you | the offer ("Open a PR for search · tests first"; in the peek "Update, test, open PR") becomes its result in place (green check, "Open the PR") |
| `BudgetItem` (Pro) | needs-you | "Budget reached for this session. Continue?" · Continue · Open session |
| `RuleRow` | Rules, setup 7 | title, detail, lock glyph, switch; locked switches explain on press. In setup every rule is Not locked (user scope); the footer hint says "Not locked yet. Lock them from Rules any time; Windows asks once more." |
| `RuleComposer` + `DraftCard` | Rules, setup 7 | described → exact rule in mono → effect last week → Add · Reword · Lock it too (**Rules only**; setup's card drops it: setup has one admin prompt, step 4) |
| `SettingsRow`, `Seg` (notch look, theme) | Settings | — (*CR-012 / always-on*: the privacy `Radio` is retired) |
| `PlanCard` | Settings › Account | Free trial / Free / Pro / Founders' price (*CR-012 / always-on*: moved from Settings › Plan) |
| `EucaEditor` | setup 2, Settings › Name and look | **one** editor in both places |
| `SetupWindow` + `StepProgress` | setup | 760 × 600, **9 segments** (*CR-012 / always-on*) |
| `Stage` + `MiniNotch` | setup 2 | the birth moment and a preview of where it lives |
| `DraftCard`, `Checklist`, `LiveLog`, `Heartbeat` | setup | — (*CR-012 / always-on*: `LevelCard` is retired) |
| `SignIn`, `CodeField`, `SentExample`, `AccountGroup`, `ConfirmPage` | setup 6 and 8, Settings | *CR-012 / always-on*: §12 |
| `CoachMark` | once after setup | arrow to the notch, Got it |
| Windows-drawn: `UAC`, `TrayMenu`, `WinNotification` | — | Segoe UI, Windows metrics (`TrayMenu` has a no-account state: §12.8) |
| No-account variants of `SupervisorMeter`, `RuleComposer`, `AccountGroup`, `TrayMenu`; `SetupWatchingNoAccount` | no account | *2026-10-26:* §12.8 |

---

## 4. Tokens added ([tokens-notch.css](tokens-notch.css))

| Group | Tokens |
|---|---|
| The object | `--notch-bg` `--notch-ring` `--notch-shadow` `--notch-text(-2,-3)` `--notch-line` `--notch-hover` `--notch-btn(-hover)` `--notch-eye(-dim,-closed)` `--notch-danger(-ring)` `--notch-ok` |
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
| Eyes follow | 140 ms ease-out per frame, ≤ 2.5 px, Calm and Toward you only | still, centred |
| Blink | 150 ms, every 3.8–7.2 s, Calm and Toward you only (§2.3) | none |
| Working beam | sweep 1.7 s alternate + glow sway | a still segment under the eyes |
| **Needs you arrives** | notch drops 3 px and settles + marker pops (`--spring-gentle`, 640 ms) + Glance (900 ms), then Toward you | marker fades in |
| Peek | **gooey** (§5.1): the card shape grows out of the notch from 30 % × 20 % with `--spring-gentle` (600 ms) and the two shapes melt into one; the words fade in 160 ms later. Folding: the words go first (140 ms), then the card melts back into the notch (300 ms). *Was: clip-path morph (revised 2026-10-26, founder)* | instant, no melt |
| Panel | scale 0.97 → 1, rise 10 px, fade (320 ms) | fade |
| **Birth** (setup 2) | squash 1.06/0.94 and settle (`--spring-gentle`), one blink | blink only |
| **Homecoming** (setup 9; *CR-012*: was 8) | the avatar flies to the notch (900 ms) and becomes its eyes; eyes open from a line | crossfade |
| Heartbeat chip | ring every 2.4 s, never faster than 2 s | timestamp only |
| **Switches** (*new 2026-10-26, founder*) | **gooey** (§5.1): the knob is two blobs; the trail follows the lead 90 ms late (`--spring-gentle`, 450 ms), so the knob stretches as it slides and settles round. A locked switch's knob tugs 18 px toward off and snaps back, instead of a shake | the knob moves, no stretch |

### 5.1 The goo effect (new 2026-10-26, founder: *"use this Gooey effect for the notch … and the switches"*)
The shapes that should merge sit in one layer with an SVG filter: blur them, then sharpen their alpha, so shapes that touch melt into one liquid shape. Only the shapes are filtered; text, eyes, markers and icons sit on top, unfiltered, so they stay crisp.

| Filter | Used for | Values |
|---|---|---|
| `goo` | notch + peek | `feGaussianBlur stdDeviation 6` → `feColorMatrix` alpha row `0 0 0 18 -7` |
| `goo-sm` | switch knobs | `feGaussianBlur stdDeviation 3` → alpha row `0 0 0 20 -9` |

- **The notch's black body is drawn by the goo layer**, not by the button: a notch shape (its width follows the button, which grows for the marker) and the card shape. The layer starts 24 px above the screen edge so the top stays flat after the blur.
- **Build (Tauri, WebView2):** an inline SVG `<filter>` applied with `filter: url(#goo)`; no library. Reference implementation: `apps/landing/public/styles.css` (`.goo`, `.knob`) and `main.js` (`showPeek`). Only transform and opacity animate.
- **Reduced motion:** shapes appear and fold instantly, the knob moves without stretching.

## 6. Sound (BRAND §11, P-7)
- **Needs you** (A4 → D5, 320 ms): once when an item arrives, and for a tripwire stop. Not during full-screen apps or calls; Windows Focus silences it.
- **Done** (F♯5, 380 ms): the safety test blocks in setup; your Euca reaches the notch.
- No sound for working, hover, panel, or the meter. Settings › The notch › Sounds mutes both. Every sound has a visible twin.

---

## 7. Copy

Second person; your Euca speaks of itself by name ("Pip will check with you more often until 1 Dec"), never "I/me/my" for you. Numbers first, one next step. "Claude Code" only in plain text. No exclamation marks.

### 7.1 Fixed strings (stored once)
- **Promise:** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."
- **Privacy (approved, CR-012 / always-on, 2026-10-26; replaces "Nothing about your work leaves this PC unless you turn it on."; in the app the first word is your Euca's name, `$N` in the prototype; **on the website it reads "When Eucas isn't sure"**, founder, 2026-10-26, §13):** "When Pip isn't sure, it sends the waiting session's last message, trimmed and with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC. Your account holds only your email, your plan and how much supervisor help you've used." (revised 2026-10-26: *"accept all the tech lead recommendations"*)
- **Always on (founder, 2026-10-26):** "The supervisor is always on and can't be switched off. Your rules always decide first." (setup step 8 and the download page)
- **Offline at sign-in (founder, 2026-10-26; revised with the reorder; revised again for no account, §12.8):** setup: ~~"**You need to be online to sign in.** Setup carries on once you're connected. Pip is already guarding: the four limits are locked."~~ "**You need to be online to sign in.** The four limits are already locked. Retry when you're connected, or continue without an account and sign up later." (declined lock: "The four limits already run, not locked. …") · panel: "You need to be online to sign in. Pip keeps guarding while you wait."
- **Diagnostic (approved):** "No paths to your projects or files."
- **Meter empty (CR-011, with the name):** "Pip will check with you more often until 1 Dec."
- **Never approves:** "It never approves a tool call."
- **Budget (founder, 26 Oct):** "Budget reached for this session. Continue?" + "Pip stopped bench before its next step." Always "stops before the next step", never "pauses".
- **Guided merge:** "search is ready · Update it from your default branch, run the tests and open the PR?"
- **Branch wording:** "your default branch" in prose; `main` only inside a literal command.
- **Unsigned v0.1:** setup warns that UAC will say "Unknown publisher"; no "signed" or "verified publisher" badge anywhere.

### 7.2 What the removal test cut
- "Welcome to Eucas!" and any feature tour (setup step 1 starts with your sessions).
- A title on the panel ("Eucas") — the avatar and name already say whose panel it is.
- "Help left" repeated next to "left until…" on the meter (one label, the date on the right).
- The second "Stopped notes" title on the tripwire page (the page title is "Tripwire stop").
- Labels on the notch other than "Not protected" and the tripwire marker.

### 7.3 Words we don't use
Seamless, effortless, supercharge, unleash, magic, AI-powered, smart (as an adjective for us), "Oops", "Something went wrong", "Are you sure?". "Pause" for a budget stop. "main" in prose. "Signed".

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


---

## 11. New since approval (26 Oct)

The founder approved §1–§10 with the 8 recommendations and asked for the full app's UX features. The UX is in [notch-and-panel.md §9](../../ux/companion/notch-and-panel.md). What it looks like:

| Component | Spec |
|---|---|
| `SuggestionItem` | A needs-you item marked quiet: grey check glyph, the noticed pattern as the title, the exact rule in mono first, **blue verb + object** ("Allow pnpm test in bench"), ghost "Keep asking". Excluded from the notch count, the badge and sounds. The list's title reads "A suggestion" when it's the only item |
| `LearnedLine` | A surface-tone card at the top of the panel: note glyph · "**Pip learned:** …" · a source line (12, Text 3) with "See it" · **Undo** on the right |
| `AppliedChip` | Neutral sunken pill, 12 px: note glyph + "Applied: {what} · {date}". Never in the Euca's colour (identity ≠ learning) |
| `Receipt` | 11.5 px JetBrains Mono, Text 3, tabular: `time · tokens (supervisor) · rule or reason` + a "Why?" button with the Look glyph (hit area grown to 32 px). One line, never a box or a chip |
| `WhyPage` | Sub-page: a 20 px title (what Pip did), the question in italics, a 4-line checklist (saw · a rule decided · what you taught it · the decision), the receipt, "That was wrong" + Open bench |
| `WhatPipKnows` | Sub-page under Settings: ledger line (12, Text 3) · the compounding sentence · three groups with Forget per row · the learning switch · Export as Markdown / Open the folder · "Forget everything" with its count |
| `Digest` | Surface card: title + duration (12, Text 3) · 3 bullets · footer with the receipt left and **Got it** right. Also a two-line version at the top of the peek |
| `CaughtUp` | Surface card with a 44 × 28 black mini notch showing pleased eyes · "**You're all caught up.**" · "Pip is watching 3 sessions." |
| `Banner` | Neutral sunken card, never red: glyph (cloud-slash for offline, clock for limits and Claude) · **bold cause** · what's safe |
| `InlineError` | Danger-tint row inside the form that failed: "**Didn't save:** …" and the primary becomes **Try again** |
| `UndoToast` | The inverse pill with **Undo** and a 2 px timer line that runs out over 10 s; non-reversible toasts have no Undo and say so when it matters |

**Eye grammar** ([the sheet](screens/eyes-sheet-d.png)): Calm · **Focused** · Glance · **Toward you** · **Concerned** · Sleepy · **Pleased** · Closed. The spec, with the state → face table, is now §2.3.

**Colour:** the new parts add no colour. Blue appears only on decisions (R1); the learned line, chips, receipts, digest and banners are neutral; green is the merge result's check (a real result); red stays for danger.

**Sounds:** `stopped` joins the family (F5 → C5, 400 ms, falling): a tripwire or budget stop. Settings › The notch › Sounds: "Needs you, done and stopped. Quiet in full-screen apps".

**Wording fixed:** the tripwire marker reads **"Stopped: notes"**; the item and the Windows notification read "Pip stopped the notes session".

**Screens:** `new-suggest-d`, `new-learned-d`, `new-knows-d` / `-l`, `new-knows-empty-d`, `new-why-d`, `new-undo-d`, `new-away-d` / `-l`, `peek-away-d`, `new-caught-up-d`, `eyes-sheet-d`, `worst-offline-d`, `worst-login-d`, `worst-week-d`, `worst-claude-d`, `worst-write-failed-d`, `worst-back-to-normal-d` (78 screens in all; the prototype has 74 states).

---

## 12. CR-012 / always-on, 2026-10-26: sign in, What is sent, Account

The UX is in [setup-flow.md](../../ux/companion/setup-flow.md) (steps 6 and 8; sign-in was step 4 until the 2026-10-26 reorder put the lock and the test before it) and [notch-and-panel.md §10](../../ux/companion/notch-and-panel.md). Everything here is built from existing parts: the field, the `conseq` list, the checklist, the banner, the inline error, the check list on sub-pages, the plan card. **No new tokens** (`tokens-notch.css` is unchanged); no new colour.

### 12.1 Why it looks like this
The account is a chore and the privacy step is a proof, so both are **plain on purpose**: no illustration, no motion, no Euca expression. The personality budget stays on the three pinned moments (birth, proof, homecoming). The one visual idea is the **redaction tag**: a removal shown in place, as a neutral mono tag inside the message, so you read the sentence the supervisor reads and see exactly where your code, paths and secrets were. That is the glass box made literal, and it reuses the mono language Eucas already uses for commands and rules.

### 12.2 Components

| Component | Where | Spec |
|---|---|---|
| `SignIn` | setup 6, panel › Sign in | **One pattern in both places.** Email state: `field-l` "Email" + the 40 px `.field` (max 460 px in setup, full width in the panel); setup adds the two-line `conseq` list (clock glyph: the trial; key glyph: your Claude login). The primary is in the setup footer ("Send a code", 40 px Cobalt) and inline in the panel (32 px Cobalt). Under the field, the **unticked** `OptIn` checkbox "Send me product news" (16 px box, radius 5, the `cb-box` look on a real `<input type=checkbox>`; founder, U-7). Offline replaces the box and the `conseq` list with the neutral `Banner` (cloud glyph; setup: "**You need to be online to sign in.** Setup carries on once you're connected. Pip is already guarding: the four limits are locked."; panel: "**You need to be online to sign in.** Pip keeps guarding while you wait.") and the footer becomes Back (ghost) + **Retry** (Cobalt); ~~Sign in later~~ is gone (founder, 2026-10-26, *"don't allow to access without sign in"*). ~~**Signed out, the whole panel is this pattern** (header with "Protected · signed out", 20 px title "Sign in to use Pip", the form, then a two-line `conseq`: what keeps guarding, what waits)~~ *(2026-10-26, no account: signed out, the panel is in the no-account state and sign-in happens in the setup window, opened from Settings › Account, §12.8.)* **Setup footer since 2026-10-26:** Back (ghost, far left) · flexible space · **Continue without an account** (ghost, 40 px) · **Send a code** (Cobalt). Offline: Back · Continue without an account · **Retry**. The code screen has no secondary (Change returns to the email screen). A third `conseq` line (shield glyph) sits under the other two: §12.8 |
| `CodeField` | setup 6, panel | Six cells, 48 × 56 in setup (44 × 48 in the panel), radius 12, `--bg-ground`, 1 px `--line-control` ring; digits 20/600 tabular; the current cell has the focus ring and a 2 × 22 caret. Wrong: every cell's ring turns `--danger-fill` and the `InlineError` sits under it ("That code didn't match. Send a new one", the link inherits the danger ink). **No shake** (the eye grammar never alarms; a shake also fails reduced motion). Build: **one** `<input inputmode=numeric autocomplete=one-time-code maxlength=6>` drawn as cells, so paste and Windows' one-time-code fill work and a screen reader hears one field ("6-digit code") |
| `SentExample` | setup 8, panel › What is sent | A `figure`: radius 14; in setup `--bg-ground` with a 1 px `--line` ring (like the live log), in the panel the surface card with `--elev-1`. Caption row 12 Text 3 (where it came from) + a neutral chip (**Yours, redacted** or **Sample**). The message 13/22 Text 1 in Instrument Sans (it's prose, not code), with **redaction tags** inline: JetBrains Mono 12, Text 3 on `--bg-sunken`, 1 px `--line-subtle` ring, radius 5, `nowrap`; words not glyphs ("path removed", "secret removed", "6 lines of code removed") so the tag reads aloud correctly. A trailing "…" marks the trim. Footer under a hairline: 12 Text 3, the counts (tabular) and where it goes |
| `AccountGroup` | Settings › Account | The `SettingsRow` (email 13/600, "Holds only your email, your plan and how much supervisor help you've used" 12) with **Sign out** (32 px neutral), then the `PlanCard` in the same group under a hairline; a quiet **Delete account** link under the group. ~~Not signed in: one row~~ Signed out, Settings isn't shown: the panel is ~~the `SignIn` pattern~~ in the no-account state and this group is the no-account `AccountGroup` (*2026-10-26*, §12.8) |
| `PlanCard` | Account | + **Pro · Founders' price** "$15/month for life" · **Free trial** (was "Free · supervisor trial") "12 days left" |
| `ConfirmPage` | Sign out, Delete account | A sub-page: 20 px title naming the account · a check list of consequences, each with its glyph (✓ ok ink: what keeps working; clock / note in Text 3: what waits or stays; ✕ danger ink: what's removed) · actions row. Sign out: Cobalt **Sign out** + ghost "Stay signed in". Delete: **danger-tint button** "Delete account · can't be taken back" (`--danger-tint` with `--danger-ink`, not a solid red: the solid red marker fill is 4.2:1 with white, under AA for 13 px text) + ghost "Keep my account". **No modal**: the panel already holds focus, and a sub-page shows the consequences before the button, which a modal's two lines can't |
| ~~Supervisor meter: not signed in~~ | — | Removed 2026-10-26: signed out, the panel shows only sign-in |
| `SmartAppControl` | setup 1 (edge U) | The setup step layout: 28 headline, 15 lede, two checklist ticks ("Nothing was installed", "A signed version is coming · eucas.app says when it's out"; revised 2026-10-26: no promise of signing before launch, which is decided on waitlist size with the ~10 %-of-early-installs trigger as the fallback), footer ghost "Read why on eucas.app" + Cobalt **Close setup** |
| `WhatIsSentRow` | Settings › Privacy | A `button.row` with chevron; replaces the Level radio |

### 12.3 Type, colour and state budget per new view
- **Setup 6 (code):** 28 headline · 20 digits · 15 lede · 13 resend line: 4 sizes, 2 weights. **Setup 8:** 28 · 15 · 13 · 12: 4 sizes. **Panel pages:** 20 · 15 · 13 · 12, as before.
- **One Cobalt per view:** Send a code / Retry / Sign out (the decision). Sign in (navigation to the form) is neutral everywhere (R1). Delete is the only danger-tinted button in the product.
- **Amber** only for the different-account warning (a consequence, the Not locked pattern). **Red** only for the wrong code, the expiring address and the delete button. **Green** only on the checklist ticks of a real sign-in.
- **States:** the field and the code cells have default, focus (ring + halo), error (danger ring + text) and disabled (the primary, with the reason in the error line); buttons keep the system's hover and press. Every error has words.

### 12.4 Motion
None new. The code screen replaces the email screen in place, like every setup step; the 6th digit submits after 150 ms so the last digit is seen. Reduced motion: identical (nothing moves).

### 12.5 Accessibility
Labels: "Email", "6-digit code". Errors use `role=alert` and `aria-describedby` from the field; the offline banner and the switch warning use `role=status`. The resend countdown is announced once when it ends. The redaction tags are real text, so a screen reader reads "path removed". The danger button's label includes "can't be taken back".

### 12.6 Copy fixed (stored once)
- Privacy line: §7.1.
- Wrong code: "That code didn't match. Send a new one" · Disposable: "Please use an address you'll keep. This one expires." · Offline: §7.1 (setup and panel versions; founder, 2026-10-26; replaces "Sign in later").
- Lock step: "Lock the four limits" · "Locked, they live where no agent or repo can change them. Your own rules come after you sign in. Changing a lock later asks for admin again." · **Lock the 4 limits** · declined: "The four limits are on, but not locked". Rules step hint: "Not locked yet. Lock them from Rules any time; Windows asks once more." (reordered 2026-10-26)
- "Your Claude login stays as it is. Eucas never sees it." (ADR-0002) · "Your 14-day supervisor trial starts when you create your account. No card."
- "There's no off switch. Your rules always decide first; the supervisor only sees a message like this one."
- Delete: "Delete account · can't be taken back".
- **Removal test cut:** "Create an account" vs "Sign in" (one verb: email + code does both; *2026-10-26 exception:* the no-account invite says **Create an account**, because the person has none; **signed out it says Sign in** everywhere (founder, 2026-10-26: *"Say Sign in"*), because the account exists; and the link names what they'd get; the form it opens is the same, and signed out the link reads **Sign in**, §12.8) · a password hint · "We'll never share your email" (the privacy line already says what the account holds) · the Level names · "Default" · a showing of the unredacted original.

### 12.7 Screens to render (capture IDs in `prototype/capture.mjs`)
Setup: `setup-1-sac-d` (new 2026-10-26), `setup-6-signin-d` / `-l`, `setup-6-signin-code-d`, `setup-6-signin-wrong-d`, `setup-6-signin-disposable-d`, `setup-6-signin-offline-d`, `setup-6-signin-done-d`, `setup-6-signin-back-d`, `setup-8-sent-d` / `-l`, `setup-8-sent-sample-d`; renumbered (*2026-10-26 reorder: lock and test before sign-in*): `setup-4-lock-d`, `setup-4-uac-d`, `setup-4-declined-d`, `setup-5-test-d`, `setup-5-test-failed-d`, `setup-7-rules-d`, `setup-7-rules-draft-d`; unchanged: `setup-9-watching-d`, `setup-10-coach-d`. Panel: `acct-sent-d` / `-l`, `acct-sent-sample-d`, `acct-sent-link-d`, `acct-account-d` / `-l` / `-d1280`, `acct-account-founders-d`, `acct-signout-d`, `acct-delete-d`, `acct-deleted-d`, `acct-signedout-d`, `acct-signedout-rules-d`, `acct-signedout-tray-d` (signed out says **Sign in**, 2026-10-26), `acct-signin-d` / `-l`, `acct-signin-code-d`, `acct-switch-d` (*2026-10-26:* `acct-signin-*` are superseded by setup step 6, §12.8; `acct-signedout-d` and `acct-deleted-d` now show the no-account state). **No account (2026-10-26, §12.8):** `setup-6-signin-d` (re-render: now with **Continue without an account**), `setup-6-signin-offline-d` (re-render), `setup-7-rules-noacct-d`, `setup-8-sent-noacct-d`, `setup-9-noacct-d` / `-l` / `-declined-d`, `panel-noacct-d` / `-l` (Usage, scrolled to the supervisor), `panel-noacct-rules-d`, `panel-noacct-settings-d`, `panel-noacct-empty-d`, `noacct-tray-d` / `-l` / `-off-d`. Changed and to re-render: `panel-settings-d` / `-l`, `panel-usage-d`, `panel-needs-usage-d` / `-l` / `-d1280`, `meter-sheet-d` / `-l`, `meter-empty-d`, `plan-trial-d`, `plan-taste-d`, `new-why-d`. **Not yet rendered** (no shell in this session): see [SELF-REVIEW.md §00a](SELF-REVIEW.md).

### 12.8 No account: everything Free sees, minus memory (2026-10-26; screens need approval)

The UX is in [setup-flow.md](../../ux/companion/setup-flow.md) (step 6's secondary, steps 7, 8 and 9 without an account, edges V and W, §8 decisions) and [notch-and-panel.md §11](../../ux/companion/notch-and-panel.md). Founder, 2026-10-26: *"we make people have a small taste without sign up and then they have to create account or buy pro"*, *"Let the no account also have to try the supervisor also but like small number of usage"*, then (a) *"Everything a free account sees but with limited supervisour usage and no memory and 1 custom role"* (rule), (b) the trial starts when the account is created, (c) 10 answers per install, and *"Show counts always, but as meter not dollars or money"*. **No new tokens, no new colour, no new face, no new component family**: the no-account state is the Free panel with three parts swapped (the supervisor meter's content, Rules' composer after one rule, Settings › Account) and memory's parts absent.

**Why it looks like this.** The same character and the same panel, not a lesser version. What's missing is simply absent: no greyed-out tabs or rows, no padlocks, no "upgrade" badges, because each of those is a nag you'd see every time you open the panel. Each invite sits exactly where the limit is felt (the meter when it's empty, the composer after one rule, the Account row) and nowhere else, as words with a link; the only primary-button invite is in Settings › Account, the one place you go on purpose to decide about an account.

| Component | Where | Spec |
|---|---|---|
| `SignIn` secondary | setup 6 email + offline | Ghost button, 40 px, label "Continue without an account", left of the primary with 8 px between; Back stays far left. **Third `conseq` line** (shield glyph, 13 Text 2): "Without an account: everything on Free with 10 supervisor answers, one rule of your own and no memory. The 14-day trial starts when you create one." At 760 px the footer holds Back (≈ 72) + ghost (≈ 232) + primary (≈ 132) with room (the window scales with Windows display scaling, so this holds at 125 %); labels never wrap |
| Setup 7, no account | `s-rules-noacct` | The step 7 layout; **From your week is hidden** (learned items: no memory), so the right column is Your own only. Under the composer, one 13 Text 2 line: "Without an account: one rule of your own, drafted with one of your 10 supervisor answers. **Create an account for more rules**" (link, Text 1). After your one rule, that line replaces the composer. Primary "**Continue · 5 rules**" (6 with a draft added) |
| Setup 8, no account | `setup-8-sent-noacct-d` | Unchanged except the privacy line's last sentence (§12.8 copy) |
| `SetupWatchingNoAccount` | setup 9, no account | The step 9 layout (avatar, "Pip is watching", the heartbeat chip; the sessions line is cut to fit 600 px) + the setup **checklist**, three rows with green ticks (all three true): "**The four limits are locked** · Any agent, any session" · "**The tripwire is on** · Stops a session that deletes 200+ files" · "**10 supervisor answers to try** · When Pip isn't sure, the supervisor answers your agents so they don't wait for you". Under it the **invite line**, 13 Text 2, no card: "An account adds 14 days of the supervisor, more rules and memory." + link-style **Create an account** (Text 1, 1 px underline at 35 %, hover 100 %; a real `button`, it opens step 6). Primary **Send Pip to the top** (the only Cobalt). The honest zero is cut. Declined lock: row 1 amber, "**The four limits are on, but not locked** · An agent or a repo could change them. Lock them from Rules any time; Windows asks once more." (`setup-9-noacct-declined-d`). Type: 28 · 15 · 13 · 12, two weights |
| `SupervisorMeter`, no account | Usage › Supervisor (`panel-noacct-d` / `-l`) | The same meter component. The section title carries a neutral chip **No account** (the `AppliedChip` look, never the Euca's colour). Label "**Answers left**", the right-hand meta "For this install" (where the reset date goes), the figure "**7 of 10**" (tabular, 600), the 4 px bar in the Euca's colour. Under it, 12 Text 3: "When Pip isn't sure, the supervisor answers your agents so they don't wait for you. After that, Pip asks you." and the quiet **What is sent** link. **Low (≤ 2):** bar and figure amber, the words kept. **Used up** (`panel-noacct-empty-d`): "**0 of 10**", empty track, no amber (a state, not a warning), and in place of the line: "**Pip asks you now.** Sign up for 14 more days of the supervisor. **Create an account**" (link). This is the meter's own state, not a prompt: it appears nowhere else |
| `RuleComposer`, no account | Rules › Your rules (`panel-noacct-rules-d`) | Your one rule is a normal `RuleRow`, e.g. "Block edits in api-docs/migrations/ · Your own · drafted from your words" (no rows learned from approvals). While you have none, the composer works and its draft card's quiet line reads "Drafted with supervisor help · 1 of your 10 answers". Once you have one, the composer is replaced by one 13 Text 2 line: "One rule of your own without an account. **Create an account for more rules**" (link). No padlock, no disabled field |
| `AccountGroup`, no account | Settings › Account (`panel-noacct-settings-d`) | One `SettingsRow`: "**No account**" (13/600) · "10 supervisor answers, one rule of your own, no memory. Eucas keeps only a random ID for this install." (12) · **Create an account** (32 px Cobalt: the one decision on this page). Signed out: "**Signed out**" and **Sign in**. No plan card, no Sign out, no Delete account. Settings has no **What Pip knows** row |
| `TrayMenu`, no account | tray (fallback; `noacct-tray-d` / `-l`) | Windows-drawn. Header (disabled, Narrator reads it): "Protected · 4 limits locked · tripwire on" · Show the panel · — · Create an account (signed out: Sign in) · — · Quit Eucas… **Not protected** (`noacct-tray-off-d`): the icon gains a red dot and the header reads "**Not protected** · the guard isn't answering". **Never a count badge** |
| Peek, no account | notch hover | Unchanged; its second line reads "5-hour 46% · week 62% · supervisor 7 of 10 left" |
| Absent without an account | panel | What Pip knows (row and page), the `LearnedLine`, `AppliedChip`, `SuggestionItem`, the monthly compounding line, "what you taught it" on the `WhyPage`. Absent means not rendered, never disabled |

**Colour budget.** Green only on the three real setup ticks. Amber only for Not locked and a low taste. Red unchanged (Not protected, tripwire). Cobalt: one per view; the only Cobalt invite is Settings › Account's **Create an account**.

**Motion.** None new. The flight at step 9 is the same for everyone (900 ms, `--spring-smooth`; reduced motion: a crossfade). Creating an account later ends with one blink in the notch and the done sound (no flight: Pip is already home).

**Accessibility.** The no-account meter is `role=meter` with `aria-valuenow` = answers left, `aria-valuemax` = 10 and `aria-valuetext` "7 of 10 supervisor answers left, for this install". The "Create an account" links are `button`s (they open a window, not a URL). The tray header is a disabled item Narrator reads in full. The setup footer's tab order: Back → Continue without an account → the primary.

**Copy fixed (stored once).** Step 6 third line · step 7's one-rule line · step 8's no-account last sentence: "Without an account, Eucas keeps only a random ID for this install and how many answers it has used." · step 9's three ticks and "An account adds 14 days of the supervisor, more rules and memory." · the meter ("Answers left · For this install · 7 of 10", its explanation line, the used-up line) · Rules' "One rule of your own without an account. Create an account for more rules" · the Account row · the tray header. **Never:** "Upgrade", "Unlock", "Free tier", "limited", a countdown, a padlock glyph on a feature, dollars or money on any meter.

---

## 13. The website (eucas.app), 2026-10-26

The landing page in `apps/landing/` is built on this design (PR #81). The founder reviewed it on 26 Oct; these are the rules that came out of that review. They apply to the website only, unless a line says otherwise.

### 13.1 The notch on a web page
- **No shoulders, no ring, no glow.** The concave shoulders and the 1 px ring join the notch to a black screen bezel; a web page has none, so on the page they read as hooks and a grey outline. The page draws only the black body: flat top, 16 px bottom radius. Captures hide them too (`apps/landing/scripts/capture-screens.mjs`).
- **Only the eye grammar (§2.3).** The page's faces are the app's, drawn to the same spec. **No red "Stopped" marker and no "Not protected" label** on the page; a stop shows Concerned eyes. The amber needs-you count stays.
- **A live notch** sits on the page's top edge: the eyes follow the pointer and blink, its state follows the section in view and picks the face by §2.3: working → Focused (with the beam), the count → Glance then Toward you, a stop → Concerned, resting → Calm, the waitlist → Pleased for 1.6 s, then Calm, and hover or tap opens the peek, which melts out of the notch and back into it (the goo effect, §5.1). The rule switches use it too.

### 13.2 Words
- **Why before what.** The page opens with the visitor's day ("You started three Claude Code sessions to go faster. Now you spend the day checking on them.") and names four pains before any feature: a session waiting for a yes, a delete you didn't read, the limit hit mid-task, two agents writing in the same file.
- **Name the four limits.** Write "deletes, pushes, sends and payments"; never "the four limits" on its own, which a visitor can't decode.
- **The privacy line names Eucas, not Pip:** "When Eucas isn't sure, it sends…" (founder, 2026-10-26); the rest is §7.1 word for word.
- **Introduce the supervisor before the privacy line:** "Eucas has a supervisor: an AI model that keeps stopped sessions going within your rules, so fewer of them wait for you." Then the privacy line (§7.1) and "The supervisor is always on and can't be switched off."
- **Say each thing once.** No line restates a list, a heading or another section (the promise sentence under the four things was cut for this).
- **No jargon from our side:** the sample project is **web-app**, never "bench" (our old codename; captures rename it). "Pip" appears only as the name inside the screens; the page doesn't explain it.
- **Plain plan words:** "The supervisor in full for 14 days, then a little every month", not "trial" and "taste"; "where your usage went", not "the ledger".
- **Left out on purpose:** export of any kind (founder, #15: removed in Free and Pro); a supporter tier (support is GitHub Sponsors only, linked in the footer); the unsigned-build note; the founders' plan-card capture (the price line says "$15/month for life").

### 13.3 Pictures
Every product picture is a real capture from `prototype/notch.html`, cut out with a transparent background, dark and light: the panel (Needs you, Usage, Rules), the same-file warning, the tripwire stop and What is sent. The panel's tabs on the page switch the capture with a 220 ms crossfade.
