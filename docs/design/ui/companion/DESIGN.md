# UI design: your Euca in the notch

| Date | Author | Status | Builds on |
|---|---|---|---|
| 2026-10-26 | PM + UI (Claude), `ui-designer` role standards | **§1–§10 approved by the founder 26 Oct** with D-1 to D-8 as recommended · **§11 "New since approval" needs approval** · **§12 CR-012 / always-on (account, What is sent) needs approval** | [CR-012](../../../requirements/change-requests/CR-012.md) · [CR-011](../../../requirements/change-requests/CR-011.md) · UX: [notch-and-panel.md](../../ux/companion/notch-and-panel.md), [setup-flow.md](../../ux/companion/setup-flow.md) · [BRAND](../brand/BRAND.md) · [tokens.css](../system/tokens.css) · [the 2026-10-25 notch design](../../ux/2026-10-25-atlas-notch-design.md) · the [direction prototype](../prototype/direction.html) effects |

**In this folder:** this file · [tokens-notch.css](tokens-notch.css) (the only new tokens) · [prototype/notch.html](prototype/notch.html) (hi-fi, clickable, one file) · [screens/](screens/) (78 PNGs) · [SELF-REVIEW.md](SELF-REVIEW.md). The unapproved tray-and-window design (PR #57) is in [v1-tray-superseded/](v1-tray-superseded/), kept as history.

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
| Expressions | calm (default) · glance (3 px toward the marker on arrival, 900 ms) · **concerned** (pills rotated ±16°, for not protected and tripwire) · **sleepy** (9 × 2.6 arcs, grey, for dozing) · closed (grey, before setup) |
| Beam | 2 px, inset 12 px, a 46 % wide gradient `transparent → --euca-light → --euca-base → transparent` sweeping 1.7 s each way, `ease-in-out`, alternate |
| Glow | 12 px tall ellipse below the notch, blur 8, the Euca's base colour at 55 %, swaying with the beam. Hidden while the peek is open |
| Marker (amber) | 18 px pill, `--marker-attn`, Ink text 11/600 tabular: the count |
| Marker (red) | 18 px pill, `--marker-danger`, white: stop glyph + "Stopped: notes" (the project after a colon; "Stopped notes" read like a typo) |
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
| `LimitRow` | Rules, setup 5 and 6 (*CR-012*: were 4 and 5) | the four limits: title, detail, **Locked** chip or amber **Not locked** (press to lock); never a switch |
| `GuidedMergeItem` | needs-you | the offer ("Open a PR for search · tests first"; in the peek "Update, test, open PR") becomes its result in place (green check, "Open the PR") |
| `BudgetItem` (Pro) | needs-you | "Budget reached for this session. Continue?" · Continue · Open session |
| `RuleRow` | Rules, setup 5 | title, detail, lock glyph, switch; locked switches explain on press |
| `RuleComposer` + `DraftCard` | Rules, setup 5 | described → exact rule in mono → effect last week → Add · Reword · Lock it too |
| `SettingsRow`, `Seg` (notch look, theme) | Settings | — (*CR-012 / always-on*: the privacy `Radio` is retired) |
| `PlanCard` | Settings › Account | Free trial / Free / Pro / Founders' price (*CR-012 / always-on*: moved from Settings › Plan) |
| `EucaEditor` | setup 2, Settings › Name and look | **one** editor in both places |
| `SetupWindow` + `StepProgress` | setup | 760 × 600, **9 segments** (*CR-012 / always-on*) |
| `Stage` + `MiniNotch` | setup 2 | the birth moment and a preview of where it lives |
| `DraftCard`, `Checklist`, `LiveLog`, `Heartbeat` | setup | — (*CR-012 / always-on*: `LevelCard` is retired) |
| `SignIn`, `CodeField`, `SentExample`, `AccountGroup`, `ConfirmPage` | setup 4 and 8, Settings | *CR-012 / always-on*: §12 |
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
| **Homecoming** (setup 9; *CR-012*: was 8) | the avatar flies to the notch (900 ms) and becomes its eyes; eyes open from a line | crossfade |
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
- **Privacy (approved, CR-012 / always-on, 2026-10-26; replaces "Nothing about your work leaves this PC unless you turn it on."):** "When Pip isn't sure, it sends the waiting session's last message, trimmed and with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC. Your account holds only your email, your plan and how much supervisor help you've used." (revised 2026-10-26: *"accept all the tech lead recommendations"*)
- **Always on (founder, 2026-10-26):** "The supervisor is always on and can't be switched off. Your rules always decide first." (setup step 8 and the download page)
- **Offline at sign-in (founder, 2026-10-26):** "You need to be online to sign in. Pip will start once you're connected."
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

**Eye grammar** ([the sheet](screens/eyes-sheet-d.png)): Calm (5 × 13 pills) · **Focused** (6 × 9, reads ±2 px over 2.4 s, the only loop) · Glance · **Toward you** (1.5 px up, follows the pointer) · **Concerned** (±16°, 1.5 px down) · Sleepy · **Pleased** (9 × 5 arcs, 1.6 s) · Closed. Reduced motion keeps every shape and drops the movement. Eye-follow runs only for Calm and Toward you.

**Colour:** the new parts add no colour. Blue appears only on decisions (R1); the learned line, chips, receipts, digest and banners are neutral; green is the merge result's check (a real result); red stays for danger.

**Sounds:** `stopped` joins the family (F5 → C5, 400 ms, falling): a tripwire or budget stop. Settings › The notch › Sounds: "Needs you, done and stopped. Quiet in full-screen apps".

**Wording fixed:** the tripwire marker reads **"Stopped: notes"**; the item and the Windows notification read "Pip stopped the notes session".

**Screens:** `new-suggest-d`, `new-learned-d`, `new-knows-d` / `-l`, `new-knows-empty-d`, `new-why-d`, `new-undo-d`, `new-away-d` / `-l`, `peek-away-d`, `new-caught-up-d`, `eyes-sheet-d`, `worst-offline-d`, `worst-login-d`, `worst-week-d`, `worst-claude-d`, `worst-write-failed-d`, `worst-back-to-normal-d` (78 screens in all; the prototype has 74 states).

---

## 12. CR-012 / always-on, 2026-10-26: sign in, What is sent, Account

The UX is in [setup-flow.md](../../ux/companion/setup-flow.md) (steps 4 and 8) and [notch-and-panel.md §10](../../ux/companion/notch-and-panel.md). Everything here is built from existing parts: the field, the `conseq` list, the checklist, the banner, the inline error, the check list on sub-pages, the plan card. **No new tokens** (`tokens-notch.css` is unchanged); no new colour.

### 12.1 Why it looks like this
The account is a chore and the privacy step is a proof, so both are **plain on purpose**: no illustration, no motion, no Euca expression. The personality budget stays on the three pinned moments (birth, proof, homecoming). The one visual idea is the **redaction tag**: a removal shown in place, as a neutral mono tag inside the message, so you read the sentence the supervisor reads and see exactly where your code, paths and secrets were. That is the glass box made literal, and it reuses the mono language Eucas already uses for commands and rules.

### 12.2 Components

| Component | Where | Spec |
|---|---|---|
| `SignIn` | setup 4, panel › Sign in | **One pattern in both places.** Email state: `field-l` "Email" + the 40 px `.field` (max 460 px in setup, full width in the panel); setup adds the two-line `conseq` list (clock glyph: the trial; key glyph: your Claude login). The primary is in the setup footer ("Send a code", 40 px Cobalt) and inline in the panel (32 px Cobalt). Under the field, the **unticked** `OptIn` checkbox "Send me product news" (16 px box, radius 5, the `cb-box` look on a real `<input type=checkbox>`; founder, U-7). Offline replaces the box and the `conseq` list with the neutral `Banner` (cloud glyph; "**You need to be online to sign in.** Pip will start once you're connected.") and the footer becomes Back (ghost) + **Retry** (Cobalt); ~~Sign in later~~ is gone (founder, 2026-10-26, *"don't allow to access without sign in"*). **Signed out, the whole panel is this pattern** (header with "Protected · signed out", 20 px title "Sign in to use Pip", the form, then a two-line `conseq`: what keeps guarding, what waits) |
| `CodeField` | setup 4, panel | Six cells, 48 × 56 in setup (44 × 48 in the panel), radius 12, `--bg-ground`, 1 px `--line-control` ring; digits 20/600 tabular; the current cell has the focus ring and a 2 × 22 caret. Wrong: every cell's ring turns `--danger-fill` and the `InlineError` sits under it ("That code didn't match. Send a new one", the link inherits the danger ink). **No shake** (the eye grammar never alarms; a shake also fails reduced motion). Build: **one** `<input inputmode=numeric autocomplete=one-time-code maxlength=6>` drawn as cells, so paste and Windows' one-time-code fill work and a screen reader hears one field ("6-digit code") |
| `SentExample` | setup 8, panel › What is sent | A `figure`: radius 14; in setup `--bg-ground` with a 1 px `--line` ring (like the live log), in the panel the surface card with `--elev-1`. Caption row 12 Text 3 (where it came from) + a neutral chip (**Yours, redacted** or **Sample**). The message 13/22 Text 1 in Instrument Sans (it's prose, not code), with **redaction tags** inline: JetBrains Mono 12, Text 3 on `--bg-sunken`, 1 px `--line-subtle` ring, radius 5, `nowrap`; words not glyphs ("path removed", "secret removed", "6 lines of code removed") so the tag reads aloud correctly. A trailing "…" marks the trim. Footer under a hairline: 12 Text 3, the counts (tabular) and where it goes |
| `AccountGroup` | Settings › Account | The `SettingsRow` (email 13/600, "Holds only your email, your plan and how much supervisor help you've used" 12) with **Sign out** (32 px neutral), then the `PlanCard` in the same group under a hairline; a quiet **Delete account** link under the group. ~~Not signed in: one row~~ Signed out, Settings isn't shown: the panel is the `SignIn` pattern |
| `PlanCard` | Account | + **Pro · Founders' price** "$15/month for life" · **Free trial** (was "Free · supervisor trial") "12 days left" |
| `ConfirmPage` | Sign out, Delete account | A sub-page: 20 px title naming the account · a check list of consequences, each with its glyph (✓ ok ink: what keeps working; clock / note in Text 3: what waits or stays; ✕ danger ink: what's removed) · actions row. Sign out: Cobalt **Sign out** + ghost "Stay signed in". Delete: **danger-tint button** "Delete account · can't be taken back" (`--danger-tint` with `--danger-ink`, not a solid red: the solid red marker fill is 4.2:1 with white, under AA for 13 px text) + ghost "Keep my account". **No modal**: the panel already holds focus, and a sub-page shows the consequences before the button, which a modal's two lines can't |
| ~~Supervisor meter: not signed in~~ | — | Removed 2026-10-26: signed out, the panel shows only sign-in |
| `SmartAppControl` | setup 1 (edge U) | The setup step layout: 28 headline, 15 lede, two checklist ticks ("Nothing was installed", "A signed version is coming"), footer ghost "Read why on eucas.app" + Cobalt **Close setup** |
| `WhatIsSentRow` | Settings › Privacy | A `button.row` with chevron; replaces the Level radio |

### 12.3 Type, colour and state budget per new view
- **Setup 4 (code):** 28 headline · 20 digits · 15 lede · 13 resend line: 4 sizes, 2 weights. **Setup 8:** 28 · 15 · 13 · 12: 4 sizes. **Panel pages:** 20 · 15 · 13 · 12, as before.
- **One Cobalt per view:** Send a code / Retry / Sign out (the decision). Sign in (navigation to the form) is neutral everywhere (R1). Delete is the only danger-tinted button in the product.
- **Amber** only for the different-account warning (a consequence, the Not locked pattern). **Red** only for the wrong code, the expiring address and the delete button. **Green** only on the checklist ticks of a real sign-in.
- **States:** the field and the code cells have default, focus (ring + halo), error (danger ring + text) and disabled (the primary, with the reason in the error line); buttons keep the system's hover and press. Every error has words.

### 12.4 Motion
None new. The code screen replaces the email screen in place, like every setup step; the 6th digit submits after 150 ms so the last digit is seen. Reduced motion: identical (nothing moves).

### 12.5 Accessibility
Labels: "Email", "6-digit code". Errors use `role=alert` and `aria-describedby` from the field; the offline banner and the switch warning use `role=status`. The resend countdown is announced once when it ends. The redaction tags are real text, so a screen reader reads "path removed". The danger button's label includes "can't be taken back".

### 12.6 Copy fixed (stored once)
- Privacy line: §7.1.
- Wrong code: "That code didn't match. Send a new one" · Disposable: "Please use an address you'll keep. This one expires." · Offline: "You need to be online to sign in. Pip will start once you're connected." (founder, 2026-10-26; replaces "Sign in later").
- "Your Claude login stays as it is. Eucas never sees it." (ADR-0002) · "Your 14-day supervisor trial starts when setup finishes. No card."
- "There's no off switch. Your rules always decide first; the supervisor only sees a message like this one."
- Delete: "Delete account · can't be taken back".
- **Removal test cut:** "Create an account" vs "Sign in" (one verb: email + code does both) · a password hint · "We'll never share your email" (the privacy line already says what the account holds) · the Level names · "Default" · a showing of the unredacted original.

### 12.7 Screens to render (capture IDs in `prototype/capture.mjs`)
Setup: `setup-1-sac-d` (new 2026-10-26), `setup-4-signin-d` / `-l`, `setup-4-signin-code-d`, `setup-4-signin-wrong-d`, `setup-4-signin-disposable-d`, `setup-4-signin-offline-d`, `setup-4-signin-done-d`, `setup-4-signin-back-d`, `setup-8-sent-d` / `-l`, `setup-8-sent-sample-d`; renumbered: `setup-5-rules-d`, `setup-5-rules-draft-d`, `setup-6-lock-d`, `setup-6-uac-d`, `setup-6-declined-d`, `setup-7-test-d`, `setup-7-test-failed-d`, `setup-9-watching-d`, `setup-10-coach-d`. Panel: `acct-sent-d` / `-l`, `acct-sent-sample-d`, `acct-sent-link-d`, `acct-account-d` / `-l` / `-d1280`, `acct-account-founders-d`, `acct-signout-d`, `acct-delete-d`, `acct-deleted-d`, `acct-signedout-d`, `acct-signin-d` / `-l`, `acct-signin-code-d`, `acct-switch-d`. Changed and to re-render: `panel-settings-d` / `-l`, `panel-usage-d`, `panel-needs-usage-d` / `-l` / `-d1280`, `meter-sheet-d` / `-l`, `meter-empty-d`, `plan-trial-d`, `plan-taste-d`, `new-why-d`. **Not yet rendered** (no shell in this session): see [SELF-REVIEW.md §00a](SELF-REVIEW.md).
