# UI design: the Eucas companion

| Date | Author | Status | Builds on |
|---|---|---|---|
| 2026-10-26 | Lead UI designer (Claude), `ui-designer` role standards | Draft for the client and the systems engineer; no gate yet | UX package [PR #55](https://github.com/eucas-app/eucas/pull/55) (`docs/design/ux/companion/`), [BRAND](../brand/BRAND.md), [DESIGN-SYSTEM](../system/DESIGN-SYSTEM.md), [tokens.css](../system/tokens.css), the [direction prototype](../prototype/direction.html) |

**In this folder:** this file · [tokens-companion.css](tokens-companion.css) (the only new tokens) · [prototype/companion.html](prototype/companion.html) (hi-fi, clickable, self-contained) · [screens/](screens/) (72 PNGs) · [SELF-REVIEW.md](SELF-REVIEW.md) (premium-craft rubric, the UX handoff's 14 points, gaps).

**Open the prototype:** double-click `prototype/companion.html` (Edge or Chrome; fonts load from Google Fonts). The black bar on top is the demo bar, not the UI: a jump menu to every state, **Play: first run**, the app theme, the Windows theme, reduced motion, sound, and **Client decisions** (D-1, D-2, D-4, D-5, S-2). `?bar=0` hides it. Sources are in `prototype/src/`; `node prototype/build.mjs` rebuilds the file, `node prototype/capture.mjs` re-renders the screens.

---

## 1. Visual direction: a quiet instrument

**The idea.** Eucas is a gauge on your desk, not a dashboard you visit. On every surface, **the guard's real checks become the heartbeat**: a timestamp that moves only when a real tool call was checked, and a strip of 10-second bars that shows the last ten minutes of proof. That strip is the one element only Eucas has, so it carries the identity. Everything else is quiet chrome, so the heartbeat and the one thing that needs you are what you see.

**Why this and not something louder.** The founder asked for relief over wow (calm UI), premium but not template-looking, and dark first. The UX research found that the tools that feel best here (Linear, Warp) get there with tone steps, hairlines, two weights and one accent with one job. A safety tool that pulses, glows or colours everything trains you to ignore it. So colour appears only when it means something: Cobalt for the one thing to press, amber for "needs you", red for "not guarded" and the tripwire, green only for a check that really happened.

**Built from the existing system, not a new brand.** Porcelain / charcoal / Cobalt, Instrument Sans 400/600 and JetBrains Mono, the six-step type scale, the springs and durations, the continuous-corner family and the shape avatars all come from `tokens.css` unchanged. The companion adds tokens only for what the base system can't express (§3).

### 1.1 Windows first

| Decision | What | Why |
|---|---|---|
| **Main window on Mica** | The window's base is Mica (emulated in the prototype as `--cmp-mica`, the ground faintly tinted by the wallpaper). The sidebar and title bar sit on it; the content is a **layer** with an 8 px top-left corner and a hairline, the Windows 11 NavigationView pattern | Microsoft: Mica for long-lived base surfaces. Mica is opaque, so it doesn't break BRAND's "no glass" rule |
| **Tray popover solid, not Acrylic** | `--cmp-flyout` = `--bg-raised`, opaque. It *behaves* like a Windows flyout: anchored to the tray, light-dismiss on click-away and Esc, rises 8 px in 200 ms | Acrylic is blur and translucency, the glass BRAND rejected as a signature (§5) and a contrast risk at 13 px. UX handoff point 3 asked for this call and why |
| **OS metrics on OS-owned chrome** | Top-level window corners 8 px (DWM rounds them; we match), caption buttons 46 × 32 with the red close hover, Windows 11 context menu (8 px, 4 px items), toasts at 364 px | You already know these from every Windows app (Jakob's law). Inside our content, the brand's corners apply |
| **Segoe UI only where Windows draws** | The title bar text, the right-click menu, the toasts, the UAC dialog and the taskbar use Segoe UI Variable. Everything Eucas draws uses Instrument Sans | Toasts and menus are drawn by Windows; designing them in our face would be a fiction the build can't ship |
| **Two themes, two owners** | The app follows Eucas's theme (dark default). The tray icon, toasts and context menu follow the **Windows** theme (`data-os-theme`) | They are drawn by Windows. The demo bar switches each one separately; `popover-needs-d-oslight1440.png` shows a dark app on a light taskbar |
| **No macOS cues** | No traffic lights, no menu-bar dropdown, no vibrancy, no centred title | Constraint from the brief |

### 1.2 The colour and type budget per view

- **Colour:** about 60 % ground, 30 % surfaces and text, 10 % meaning. **One Cobalt per view**, and the tray popover has **none** unless a needs-you card is present. When a guard problem has its own primary (Fix it, Repair), every needs-you card drops to a secondary button. Checked by the smoke test (one `.btn.pri` on Today and in the popover).
- **Never colour alone:** every state has a word and a glyph; the tray states read in a 1-bit render (count, slash, "!", moon, dimming).
- **Type:** four steps per view at most: 12 meta, 13 sub, 15 body, 20 title (28 on first-run headlines; 44 only for the tripwire's live count). Two weights. Mono only for commands, paths, times in the log and hook output. Tabular figures on every number that changes.

### 1.3 Session avatars, the Look, and the PR #52 effects

A Claude Code session is someone working for you, so each project gets a **flat shape avatar** (hue × shape, white eyes only, BRAND §8): bench is a lavender sphere, api-docs a teal droplet, notes a honey square. The status glyph sits on the avatar like everywhere else in the system, with the word beside it.

From the direction prototype's effects (PR #52), the companion reuses two and leaves one:
- **Eye-follow** (the pinned Eucas): avatars in the popover, needs-you cards and session rows look toward your pointer (≤ 5 px of travel). It's the BRAND "attention, not alarms" job: when a card needs you, its face is already looking your way. Off under reduced motion.
- **Thinking orb** → the **Working** glyph: a small turning arc in the project's ink on the avatar. Rebuilt in CSS for the self-contained file; the build can use `thinking-orbs` directly. Under reduced motion it becomes a still dot.
- **Voice glow and the gooey +** don't apply: the companion has no composer.

---

## 2. Surfaces and layout

| Surface | Size | Opened by | Default | Prototype route |
|---|---|---|---|---|
| Tray icon | 16 px at 100 % (ICO 16–40 for 100–250 %) | Always there once pinned | Visible after first run | `sheet-tray` |
| Windows toast | 364 px, drawn by Windows | Eucas, by the notification policy (§4.18) | On; Focus silences | `sheet-toasts`, `toast-live` |
| Tray popover | **380 × up to 560**, 12 px from the taskbar's right edge | Left-click the icon | Closed | `popover…` |
| Right-click menu | Windows 11 context menu | Right-click the icon | — | `menu` |
| Main window | **1040 × 720**, min 880 × 600, resizable, maximise fills | Open Eucas, a toast action, Start | Closed; never opens itself after first run | `today` … `settings` |
| First-run window | **720 × 560**, centred, one window for every step | The installer finishing | Opens once | `fr-…` |

**Main window grid.** Caption 32 px. Sidebar 216 px on Mica: the heartbeat line on top (it's the first thing read, and clicking it opens Protection), five sections, Settings pinned at the bottom (`Ctrl+1…6`). Content layer: 28 / 36 px padding, max 820 px wide, sections 28 px apart, rows 56 px (`--row-2`), log rows 44 px.

**The six sections, and where the brief's names live.** The UX IA (ia-and-flows §2.2) is kept exactly: **Today** (the needs-you inbox and the sessions), **Rules**, **Protection** (the heartbeat, per-session guard and the **log**), **Usage**, **Retro**, **Settings**. "Inbox", "sessions" and "log" are not separate pages because each is read in the context of the others; splitting them would add two sidebar items without a job.

---

## 3. Tokens added (tokens-companion.css)

Load after `tokens.css`. Components use roles only; a raw hex in a component is a second palette starting.

| Group | Tokens | Notes |
|---|---|---|
| **Severity** | `--sev-calm` `--sev-attn` `--sev-attn-tint` `--sev-danger` `--sev-danger-tint` `--sev-ok` `--sev-ok-tint` | Aliases of the feedback roles named by meaning. `--sev-ok` is for proven states only, never a claim |
| **Guard states** | `--guard-guarded` `--guard-idle` `--guard-not-guarded` `--guard-not-verified` `--guard-user-level` `--guard-org` `--guard-failing` | One glyph colour per guard state; the word is always beside it |
| **Heartbeat** | `--hb-bar` `--hb-bar-now` `--hb-bar-idle` `--hb-bar-miss` `--hb-gap` `--hb-bar-w` `--hb-h` `--hb-pulse` (2400 ms) `--hb-bucket` (10 s) | The strip and the glyph's ring. The ring never beats faster than once per 2 s |
| **Surfaces** | `--cmp-flyout` `--cmp-flyout-card` `--cmp-mica` `--cmp-scrim-trip` `--cmp-meter-track` `--cmp-meter-fill` `--cmp-meter-close` `--cmp-meter-tick` | Usage fills in Ink; amber only at your threshold, with the word "close". Never red |
| **Sizes** | `--cmp-flyout-w` 380 · `--cmp-flyout-max-h` 560 · `--cmp-window-*` · `--cmp-firstrun-*` · `--cmp-sidebar-w` 216 · `--cmp-trip-count` | From the UX package |
| **Motion** | `--cmp-count-up` 400 ms · `--cmp-toast-in` 320 ms · `--cmp-flyout-in` 200 ms · `--cmp-undo` 10 s | Everything else uses the base springs and durations |
| **Windows chrome** (`[data-os-theme]`) | `--os-desktop` `--os-taskbar` `--os-text*` `--os-surface` `--os-button*` `--os-accent` `--os-close-hover` `--os-shadow` `--os-secure-desktop` · `--os-radius-window` 8 · `--os-radius-menu` 8 · `--os-radius-item` 4 · `--os-caption-h` 32 · `--os-caption-btn-w` 46 · `--os-taskbar-h` 48 · `--os-toast-w` 364 | Windows 11 defaults, dark and light. Only for what Windows draws |
| **Tray glyph** (`[data-os-theme]`) | `--tray-glyph` `--tray-glyph-dim` `--tray-badge-attn` `--tray-badge-text` `--tray-slash` `--tray-moon` | Dark: white glyph 17.0:1 on `#1c1c1c`; Ink on the amber badge 8.58; slash 6.12. Light: glyph 14.9 on `#eeeeee`; badge edge 4.03, white digit on it 4.68; slash 4.88. Forced colours map to system colours |

---

## 4. Components

Names are the build's names. Each lists anatomy, sizes, states and its accessibility contract. "One pattern per situation" (DESIGN-SYSTEM §12) applies: each component is the only way its situation is drawn.

### 4.1 `TrayIcon` (6 states)

The Quartet at 16 px, monochrome in the Windows text colour, plus at most one mark, always bottom right with a 1.2 px cut-out in the taskbar colour.

| State | Mark | Tooltip (the accessible name) | When |
|---|---|---|---|
| `calm` | none | "Eucas · guard on · 3 sessions · checked 2 s ago" | Every running session reported a check |
| `needs` | amber disc with a count (9+ above 9) | "Eucas · 2 things need you" | Needs-you count > 0, including a tripwire stop |
| `off` | red diagonal slash across the mark | "Eucas · bench isn't guarded: no check for 40 s" | Not guarded, guard failing, protection off, organisation policy |
| `unverified` | amber disc with "!" | "Eucas · not verified for Claude Code 2.1.314 yet" | Not verified, not yet tested, user level |
| `paused` | mark at 50 %, a moon | "Eucas · notifications paused until 15:00 · guard on" | You paused notifications (the guard keeps working) |
| `setup` | mark at 50 % | "Eucas · finishing setup" | First run before "You're protected" |

**Priority** when several are true: off › needs › unverified › paused › calm. The popover lists every true state in words. **Shipping:** a hand-hinted ICO per state at 16, 20, 24, 32, 40 px, light and dark, plus forced-colours. Updates on state change only, never animated (the taskbar isn't a place for motion).

### 4.2 `HeartbeatLine` (the product)

One component in the sidebar, the popover's first row, first-run "You're protected" and the Protection status card.

- **Anatomy:** glyph (14 px, 18 px in the `big` variant) · **state word** (600) · facts in Text 2 · a live `checked N s ago`.
- **Variants:** `inline` (popover, Protection) · `stack` (sidebar: word on line 1, facts on line 2) · `big` (Protection, first run).
- **States and glyphs:**

| State | Glyph | Sentence |
|---|---|---|
| `guarded` | filled dot, green, a ring that expands once per real check (never faster than 2 s) | **Guard on** · 3 sessions · checked 2 s ago |
| `idle` | hollow ring, Text 3 | **Guard ready** · idle since 13:40 / no sessions running |
| `not_guarded` | slashed circle, red | **bench isn't guarded** · no check for 40 s |
| `not_verified` | triangle "!", amber | **Not verified for Claude Code 2.1.314** · guard on, test pending |
| `untested` | triangle "!", amber | **Guard on · not yet tested** · the test couldn't run |
| `user_level` | half-filled circle, amber | **Guard on · user level** · weaker · checked 3 s ago |
| `org` | lock, Text 2 | **Blocked by your organisation** · sessions aren't guarded |
| `failing` | crossed circle, red | **Guard failing** · blocking every tool call |
| `off` | slashed circle, red | **Protection is off** · back on at 14:17 |
| `setup` | dashed ring, Text 3 | **Finishing setup** |

- **Rules:** the timestamp is evidence: it changes only when a check event arrives; between checks it counts up. Idle never ticks. It never shows green until a real check passed. Weaker states stay named until fixed; they never collapse into green.
- **A11y:** the whole line is one text run; the live seconds are `aria-live="off"` (a screen reader reads it on focus, not every second). State changes are announced once through the window's polite live region.

### 4.3 `HeartbeatStrip` (the signature element)

60 bars, one per 10-second slot over the last 10 minutes, newest on the right. Bar height = checks in that slot (20–100 %); a slot with no tool calls is a 2 px baseline dot; a slot where tools ran with **no** check is a full-height red bar; the slot that just got a check is green.
- **Sizes:** `fill` (status card, bars stretch to the width, 24 px tall) · `sm` (session rows, 2 px bars, 16 px tall).
- **Live:** on each check the newest bar grows by one step; every 10 s the strip shifts left by one bar (`transform`, 200 ms). Reduced motion: the strip redraws without the shift.
- **A11y:** `role="img"` with a sentence: "A check landed in every busy 10-second slot in the last 10 minutes" / "Tools ran with no check in the last 40 seconds". The caption under the status card explains how to read it once.
- Taken from status pages (Zendesk on Refero: time-bucketed bars) and turned into live evidence rather than history.

### 4.4 `TrayFlyout` (the popover)

380 px, `--cmp-flyout`, 8 px corners, `--elev-3`. Top to bottom; every optional section disappears when empty.
1. **Status row** (always): `HeartbeatLine` + chevron; opens Protection. Tinted red for `off`-class states, amber for weaker states, with one action under it (Fix it · Repair / Off for 15 min · Turn it back on · Run the test · Use admin).
2. **What needs you · n** (only when > 0): up to 3 compact `NeedsYouCard`s, oldest-first ordering is Today's job; here it's newest first.
3. **Same-file** compact card (only when active).
4. **Sessions** (collapsed to one line: stacked 20 px avatars + "3 sessions · bench needs you · api-docs working · notes idle"); expands to one row each with tokens, state word and guard word.
5. **Usage strip** (always): a 56 px bar + "5-hour: 46 % · resets 15:40 · Week: 62 %"; amber with the word "close" at your threshold; "5-hour limit reached · resets 15:40" at the limit; opens Usage.
6. **Footer:** Open Eucas · settings.

**Behaviour:** light-dismiss on click-away and Esc (focus returns to the tray icon); ↑/↓ move between controls; Tab cycles; opens with focus on the status row. At 125 % and 150 % Windows scaling it caps its height to the work area and scrolls inside (`popover-125`, `popover-150`). **No Cobalt** unless a needs-you card is present.

### 4.5 `ContextMenu` (right-click on the tray icon)

Native Windows 11 menu: **Open Eucas** · Pause notifications for 1 hour · Pause until tomorrow (or Resume) · Run the diagnostic · Quit Eucas…. **There is no "turn off protection" here** (that's a deliberate act in Settings). Quit confirms: "Protection stays on while Eucas is closed. The heartbeat and notifications stop until you open it again."

### 4.6 `MainWindow` = `Caption` + `Sidebar` + `Layer`

- `Caption`: app icon 16 · "Eucas" · minimise / maximise / close (close sends it to the tray; it never quits).
- `Sidebar`: `HeartbeatLine stack` · Today (amber count) · Rules · Protection · Usage · Retro · Settings (bottom). Active row: neutral selected fill + a 3 px Ink bar + 600 weight. Never Cobalt (selection is never blue, DESIGN-SYSTEM §11.4).
- `Layer`: the page. `PageHead` = title (20/600) + one line that states the screen's finding ("2 things need you. 3 sessions are guarded."), and at most one action on the right.

### 4.7 `NeedsYouCard` (one card: popover, Today, the toast's landing)

- **Anatomy:** avatar (24 full / 20 compact, with the needs-you badge) · project name (600) · "waiting 2 min" (Text 3, right) · evidence: "wants to run" + the command in a mono chip + "in `bench/`"; or "Asks: " + the question's first line · consequence line (13 px Text 2, dots): "Runs in bench/ · you've allowed this 14 times" · actions.
- **Actions:** **Open session** (primary; secondary on every card after the first, and on all cards when a guard problem owns the primary) · **Allow once** only if spike S-2 passes (toggle S-2 in the demo bar) · **Not now** (snooze 15 min) · when S-2 hasn't passed, a Text 3 hint "Answer in the terminal, or open it".
- **The state word isn't repeated:** inside a "What needs you" section the card doesn't carry a "Needs you" tag (copy removal test); the avatar badge has the accessible text.
- **After:** the card leaves and an `UndoToast` says what happened for 10 s ("Opened bench · it's the Windows Terminal tab titled "bench"", "Snoozed until 14:17"). Answered in the terminal: it resolves itself ("Answered in bench") *(spec)*.
- **Never** for anything a limit covers; those are blocked, not asked. No bulk "Allow all".

### 4.8 `SuggestedRuleChip`

The intelligence deposit, on the card where you're doing the work: after 10+ manual allows of the same exact command in one folder, the card shows a 24 px chip "Make **pnpm build** a rule" (rules glyph, Text 2, right-aligned). It opens Rules with that suggestion's preview already open. Never on a limit command, never pre-saved.

### 4.9 `SuggestedRuleRow` and `RulePreview`

- **Row:** checkbox (first run) or **Add** (Rules) · `command` in mono · "in bench/ · you allowed it 212 times" · one line underneath, one of: the dry run ("Would have auto-approved 212 calls in the last 7 days, all in bench/"), the runner warning in amber ("Runs code from the project. Tick only if you trust every repo here."), or the conflict ("Your Claude Code settings ask for this every time. That wins; this rule would do nothing." · row at 62 %, control disabled).
- **Pre-ticked** only when read-only and exact (`git status`, `git diff`, `ls`). Runners are never pre-ticked and never "everywhere".
- **Preview** (opens in place, sunken well): the dry run, and for runners a plain warning that the scope is one folder; **Save · auto-approve pnpm test in bench/** (Ink, not Cobalt: a setting isn't the screen's action) · Cancel. After saving: `UndoToast` "Saved · auto-approve `pnpm test` in bench/" and the rule appears in Your rules with its counter at 0.

### 4.10 `RuleCard` and `LimitsPanel`

- `RuleCard`: `command` · "in bench/" · "Auto-approved 1,204 times since 12 Oct · last used 2 min ago" · Ink switch · overflow (Edit scope, Delete). The live counter keeps each rule's effect visible.
- `LimitsPanel` (top of Rules, collapsed to one line): lock · "**4 limits always on:** delete · push to your default branch · send · pay. No rule can change them." Expanded: **the promise** (fixed string), what each limit covers, **the gap** (fixed string) plus "Pattern checks catch common forms of these commands; they can't see every way a program could do the same thing.", and "Blocked calls are never asked: Eucas tells the session to hand back to you. If you meant it, run it yourself in a terminal."

### 4.11 `UsageMeter` and `ForecastLine`

- **Meter card:** label (13/600) · "updated 20 s ago" · the figure (28/600, tabular) · "close" tag at your threshold · "resets 15:40" · a 6 px bar in Ink at the true ratio, a hatched extension to the forecast end, a 2 px tick at your line (85 % default) · ends "0 · your line 85 % · 100 %" · the forecast sentence.
- **Forecast, one time, certainty over ranges:** "At today's pace you'll reach the 5-hour limit around **14:35**, 65 min before it resets." Hover/focus shows the range and basis ("Range 14:28–14:44, based on the last 45 minutes"). Below the line: "At today's pace you'll end this window at about **68 %**. That's about 9 more runs like your last one in bench." (work left, the Luma pattern).
- **Variants:** plan (default) · tokens only (no `rate_limits` yet: one sentence, the share column shows "—") · API key (cost in $ instead of plan share; subtitle "Today: $2.69 across 3 sessions.") · limit reached (§5.3).
- **Never red** for money or limits; amber only at your threshold, always with the word.

### 4.12 `LedgerTable`

By session / by project (segmented) × Today / 7 days (segmented). Columns: name with 20 px avatar · Tokens · Share of 5-hour (or Cost) · Last activity. Right-aligned tabular figures, 12 px Text 3 sentence-case headers, row rules, no zebra, a **Total** row computed from the rows (182,400 + 64,100 + 9,300 = 255,800; 33 + 11 + 2 = 46 %, the meter's figure). Pattern from the dark usage screens on Refero (Steel) minus their chrome.

### 4.13 `SameFileCard`

"**Two sessions are editing the same file**" · Warning tag (outline: it's not a needs-you) · "api-docs changed `src/router.ts` 4 minutes after bench did. If both keep going, one may overwrite the other's work." · two facts side by side (each session's avatar, last edit time, lines changed) · **Show both** (secondary) · Open bench · Open api-docs · "Don't warn for this file today". Compact in the popover: split glyph, `src/router.ts`, both names, Show both. Never blocks the edit; never says "conflict" when git would merge it.

### 4.14 `ProtectionStatusCard`

`HeartbeatLine big` · facts (dots): "Verified for Claude Code 2.1.314 · canary passed at 09:12" · "Limits in admin settings" / "User level (weaker): limits in your user settings" · "Tested with PowerShell" · in a weaker or broken state, one sentence that names the cause and what's safe, and **that state's one action on the right** (Fix it · Repair + Off for 15 minutes · Turn it back on now · Try again with admin · Copy a note for your IT team) · `HeartbeatStrip fill` with its time axis · a one-line caption on reading the strip. Tinted with a 1 px red or amber ring in those states. The page header keeps **Run the test again** (Cobalt only when the card has no action of its own).

### 4.15 `LogRow` (one row for blocks, warnings, tripwire stops, guard changes)

Glyph (block: filled Ink disc with a bar · warning: amber triangle · tripwire: stop square, red · guard off: slashed circle, red · guard on: check, green) with its word for screen readers · time `13:58` (mono, Text 3) · session · what (mono, ellipsis) · why in plain words ("a push to your default branch") · chevron. Expands in place (`aria-expanded`): What · Why · Decided by ("Limit · push to default branch") · Session and where it runs · the raw hook decision (mono) · for blocks, "If you meant it, run it yourself in a terminal." and **Copy command** (secondary, the only escape). Filter chips: All · Blocks · Warnings · Tripwire · Guard; **Export** (Markdown/CSV). The same row is the canary's receipt in first run, so the first thing you ever see logged looks exactly like every later one. Pattern: Stripe's security history (Refero), quieter.

### 4.16 `Checklist` (detection · install · diagnostic)

Rows of 32 px: status glyph (✓ green, ! amber, slashed red, a turning arc while waiting, a dot when not started) · text · optional value or **Look inside** (opens the exact file it touched). Rows tick in on a 320 ms spring. Used by first-run detection, "Turning on protection", Settings › Remove Eucas, and the diagnostic.

### 4.17 `Diagnostic`

Settings › Diagnostic, the tray menu and every error's secondary action open it. **Run the diagnostic** → a checklist in about 5 s: Claude Code version and install type · shell · whether Eucas hooks fire (per session) · status line · managed settings · canary · last 20 guard events (program names only) · Eucas version. Then: the specific repair when one exists (Restart bench's guard) · **Copy report** · Save as file · Open an issue (opens GitHub's new-issue page for you to review; never sends). Always: "The report has no prompts, file contents, paths outside Claude Code's folder, or tokens. Read it before you share it."

### 4.18 `WinToast` (content only; Windows draws the frame)

| Kind | Title (≤ 48) | Body (≤ 200) | Buttons | Stays |
|---|---|---|---|---|
| Needs you | bench needs you | Wants to run `pnpm build` | Open session · (Allow once if S-2) | Until acted on or the session moves on |
| Done (runs ≥ 2 min) | bench is done and waiting for you | It ran for 14 min. | Open session | 6 s |
| Blocked | Blocked in bench | `git push origin main` · a push to your default branch | Why? (opens the log row) | 6 s |
| Tripwire | Stopped bench: it deleted 1,240 files in 20 s | Eucas checked it's no longer running. | See what happened | Until acted on; ignores grouping |
| Same file | bench and api-docs are both editing a file | `src/router.ts` | Show both | 10 s |
| Guard off | bench isn't guarded | Eucas hasn't seen a check for 40 s. | Fix it | Until acted on |
| Near the limit | 85 % of your 5-hour limit | Resets 15:40. | — | Once per window |
| First session of a project | Guarding bench | Protection checked. | — | 6 s, once per project |
| Grouped | 3 more things need you | bench, api-docs and notes are waiting. | Open Eucas | — |

Budget: one per event, at most one per 2 minutes per session, at most 2 on screen, grouped beyond that. No toast when that session's terminal is focused. Low-priority (same file across worktrees, short runs) go silently to Notification Center. Resolved needs-you clears its toast. Buttons are neutral (Windows style); the tripwire and guard-off toasts carry a 3 px red edge in the prototype to mark the Windows "urgent" scenario. **Pro is never a toast.**

### 4.19 `UndoToast` (in-app, DESIGN-SYSTEM §11.13)

Inverse surface, bottom centre of the window, ≤ 440 px: what happened · **Undo** · a 2 px timer that empties in 10 s. After every triage and rule action.

### 4.20 `TripwireCard` (the one modal-weight moment)

Opens over the window on a scrim (`role="alertdialog"`, focus trapped, Esc only once it's stopped).
- **Still deleting (designed first):** stopped avatar · "**bench is still deleting files**" · the live count (44/600, red, tabular) · a blinking dot · "files deleted · still counting" · "Eucas stopped bench's session at 14:02:31, but files are still being deleted by a process it started. Eucas is stopping every process in that tree. It says "stopped" only when the count stops moving." · Open the folder (secondary). It never says "stopped" while the number moves.
- **Stopped:** "**Eucas stopped bench**" · "1,240 files deleted in 20 seconds" · "It started with `…/bench/node_modules`. Eucas stopped it at **14:02:31** and checked it's no longer running." · what was deleted, grouped by folder with counts (exportable) · **How to get them back**, numbered, only the routes that are on (git restore with the tracked count, `pnpm install`, File History) · **Open the folder** (primary) · Export the list · This was expected · Close · the consequence of "This was expected" in one Text 3 line.

### 4.21 `Banner`

One per screen at most, inside the page: glyph · bold cause · one sentence (what's safe) · up to two actions. Red for not guarded / failing / off; amber for not verified / user level / organisation. Not used on Protection, where the status card carries the state.

### 4.22 `ProLine` (D-2: waitlist)

A single Text 2 line with a text link, same look as everything else: "Pro can pause bench at a budget you set, before the limit does. **Get notified** · Not interested". After Get notified: "You're on the list. Eucas tells you here when it's ready." Not interested hides that moment for good. Shown only at the five moments in ia-and-flows §4, once a week each, one per day across the app; never in a worst moment, a toast or first run; hidden offline; hidden entirely when D-2 is (a).

### 4.23 First-run components

`FirstRunWindow` (720 × 560, a 5-bar step indicator "3 of 5", Back until something is written) · `UacFrame` (the sentence before it: "Windows is asking for permission. It will name Eucas Labs."; the button reads "Waiting for Windows…"; the prototype draws the Windows 11 UAC dialog as an illustration, grey for a verified publisher) · `CanaryLog` (three live lines, then the block lands on a gentle spring with the Done sound, then the same `LogRow` you'll see in Protection) · `PinHelper` (a drawn Windows 11 tray corner with the ^ arrow and the Eucas icon outlined in the Windows accent, one sentence, **Keep it visible**) · `Installer` (no choices: "For you only. No admin needed.").

---

## 5. States

### 5.1 The guard state model (for the build)

```ts
type GuardState = "setup" | "guarded" | "idle" | "not_guarded" | "not_verified" | "untested"
                | "user_level" | "org" | "failing" | "off";
type SessionState = "working" | "needs" | "idle" | "done" | "failed" | "stopped"; // agent view's six, in Eucas's words
type StopReason = "user" | "trip" | "block" | "error";   // Pro's supervisor line only for "user"
type TrayState = "calm" | "needs" | "off" | "unverified" | "paused" | "setup";
// trayState = off      if guard ∈ {not_guarded, failing, off, org}
//           | needs    if needsCount + (tripwire ? 1 : 0) > 0
//           | unverified if guard ∈ {not_verified, untested, user_level}
//           | paused   if notificationsPaused
//           | setup    if first run before step 5
//           | calm
type UsageMode = "plan" | "tokens_only" | "api" | "limit_reached";
```

### 5.2 Matrix (routes are in the jump menu; *(spec)* cells are written here but not drawn in the prototype)

| Surface | Empty | Loading | Error | Offline | Protected | Unprotected |
|---|---|---|---|---|---|---|
| Tray popover | "No sessions running. Start or continue one in Claude Code." + Guard ready (`popover-empty`) | Opens instantly from local state; nothing to load | Guard problem in the status row with its action (`popover-off`) | Unaffected (local); Pro lines hidden | Guard on + live seconds (`popover-calm`) | Red status row + Fix it; tray slash (`popover-off`) |
| Today | "No sessions running" card + earlier events (`today-empty`); caught up drops the needs-you section and says so in the subtitle (`today-caught-up`) | Final layout with flat bars (no shimmer) | "Couldn't read today's events. Last good at 14:02. Retry" inside the block (`today-error`) | Unaffected | `today` | Banner + red session row (`guard-off`, `fail-closed`, `protection-off`) |
| Rules | Fewer than 3 rules: five templates appear | Dry run: "checking 7 days…" in the preview *(spec)* | "Your settings file is locked by another program. Nothing changed. Retry" *(spec)* | Unaffected | `rules` | Organisation: rules read-only with why |
| Protection | Log empty: "Nothing blocked yet. Every block shows here with why." *(spec)* | Canary running: the header button reads "Running the test…" *(spec)* | Canary failed: amber, then red (`not-verified`) | Hook-only check passes; a full test reruns online | `protection` | Red ring + cause + action (`guard-off-protection`, `org-blocked`) |
| Usage | "Usage appears after your first session." *(spec)* | — | Status line not reporting → Diagnostic *(spec)* | Unaffected | `usage` | — |
| First run | Thin history → templates (`fr-edge-f`) | Detection lines with arcs; streaming retro cards (`fr-building`) | Canary not blocked (`fr-edge-j`), couldn't run (`fr-edge-k`), policy (`fr-edge-d`), admin declined (`fr-edge-h`) | Nothing in first run needs the network (unless D-5 = model turn) | `fr-protected` | Never shows "You're protected" after J |

### 5.3 Worst moments (each names the cause, what's safe, one next step)

- **Tripwire** (`tripwire-live`, `tripwire-stopped`, `tripwire-toast`): §4.20.
- **Not guarded** (`guard-off`): red row "bench isn't guarded", banner with **Fix it** (diagnostic with the specific repair), slash on the tray, toast. Green only after a real check passes.
- **Guard failing closed** (`fail-closed`): "Eucas's guard is failing and blocking every tool call in 3 sessions. Your work is safe…" · **Repair** · Turn the guard off for 15 minutes. The only temporary off switch in the product.
- **Protection off** (`protection-off`): "Protection is off until 14:17" in the heartbeat everywhere; it comes back on by itself; Turn it back on now.
- **Not verified after an update** (`not-verified`), **user level** (`user-level`), **organisation** (`org-blocked`): amber or lock, named permanently until fixed.
- **5-hour limit reached** (`usage-limit`): "**5-hour limit reached.** Claude Code pauses new requests until **15:40**. Your sessions keep their work. Weekly: 64 %." No upsell.
- **Canary not blocked** (`fr-edge-j`): "The test wasn't blocked. Eucas is not protecting your sessions on this PC yet. Nothing outside the test folder was touched." → Run the diagnostic.
- **Long content:** project names ellipsize in the middle; commands ellipsize in rows and wrap in mono up to 3 lines in cards; counts over 9,999 abbreviate with the exact number on hover.

---

## 6. Motion

Physics from `tokens.css`; everything moves because something happened, except the heartbeat, which moves because something keeps happening. Transform and opacity only.

| Moment | Spec | Reduced motion |
|---|---|---|
| Popover open | rise 8 px + fade, 200 ms `--ease-out`; close 140 ms | Fade only |
| Main / first-run window open | rise 12 px, scale 0.985 → 1, `--dur-scene` 420 ms on `--spring-smooth` | Fade |
| Heartbeat ring (pinned moment 3) | One ring per real check, scale 0.6 → 1.9, opacity 0.7 → 0, 2400 ms, never more than once per 2 s | No ring; the seconds still update |
| Heartbeat strip | Newest bar grows 200 ms; strip shifts one bar every 10 s | Redraw without shift |
| Retro reveal (pinned moment 1) | Cards in a fixed order, 90 ms stagger, rise 10 px + scale 0.98, 420 ms spring; numbers count up once in ≤ 400 ms | Cards at rest, final numbers |
| Canary block (pinned moment 2) | The Blocked glyph lands on `--spring-gentle` (scale 0.4 → 1, 520 ms) + the Done sound (F♯5); the receipt rises 240 ms later | Appears at rest; the sound still plays (sound is information) |
| Checklist ticks | Each row rises 4 px, 320 ms spring | Instant |
| Needs-you resolve | Card leaves 200 ms on `--ease-exit`; the undo toast rises 320 ms; its timer empties linearly over 10 s | Fade |
| Eye-follow / glance | Eyes translate ≤ 5 px toward the pointer, 320 ms spring | Off |
| Working glyph | Arc turns once per 1.1 s | Still dot |
| Toasts | Windows' own slide-in from the right (320 ms); exit 200 ms | Windows decides |
| Tripwire | Card rises on the scene spring; the count updates in place (no roll); the dot blinks at 1 Hz while counting | No blink; the number still updates |
| Theme switch | All transitions suppressed for one frame | — |

No confetti, no bounce on the chrome, no looping motion except the Working arc and the live count. **Sound:** Needs you (A4 → D5) when a needs-you lands while Eucas isn't focused; Done (F♯5) for the canary block and long runs finishing. Focus silences both.

---

## 7. Copy

Second person, the app speaking as your main agent; sentence case; numbers first, then what's safe, then one next step. No "me/my", no exclamation marks, no emoji, no "Error", "Denied" or "Something went wrong".

### 7.1 Fixed strings (UX §4.2; stored once in `COPY`, never shortened)

- **The promise:** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."
- **The guard:** "Eucas checks every tool call in your Claude Code sessions on this PC, stops when it's unsure, tells you the moment it isn't running, and stops a session that starts mass-deleting."
- **The gap:** "Eucas sees tool calls, not what a program does once it runs, and nothing in the cloud. Keep git and backups on."
- **The privacy line:** "Eucas keeps counts, never the text of your prompts or files, and nothing leaves this PC."

The gap line sits next to the promise everywhere the promise appears (first run step 4, Rules › Limits) and in Protection › What Eucas can't see. No absolute claim about the agent anywhere: the agent-facing words are "blocks the known ways", "catches common forms". "Claude Code" appears only in plain text ("your Claude Code sessions", "Verified for Claude Code 2.1.314"), never as a product name, logo or visual.

### 7.2 What the copy removal test cut

| Cut | Why |
|---|---|
| The "Needs you" tag on cards inside "What needs you" | The heading says it; the avatar badge carries it for screen readers |
| The "You're all caught up" card under an empty "What needs you" heading | The subtitle says it; the empty section is gone |
| A separate privacy screen in first run | One sentence + "What Eucas reads" carries it (UX decision kept) |
| "Protected" as a badge | Only the sentence "You're protected" at the end of first run |
| A Protection banner repeating the status card | The status card states the cause and holds the action |
| "Welcome", tours, feature cards | The retro is the welcome |

### 7.3 Strings per screen

Every visible string is in `prototype/src/` (components.js and screens.js) in its final form; the build should lift them from there. Notable ones beyond §4: Today subtitle by state ("2 of 3 sessions are guarded.", "Protection is off until 14:17.", "The guard is blocking every tool call."); first-run lines exactly as onboarding-flow.md, fitted: "Let's look at your week with Claude Code" · "Show your week" · "Building your week" · "Reading 312 sessions · 6 of 7 days" · "Your week: 41 sessions in 6 projects, about 62 % of your weekly limit." · "Turn on protection · 3 rules" · "Waiting for Windows…" · "Watch it work" · "Blocked by Eucas · logged" · "Every block gets a receipt like this one in Protection." · "You're protected" · "Eucas lives in the taskbar corner" · "Keep it visible" · "Send a test notification".

---

## 8. Accessibility

- **Contrast (WCAG 2.2 AA, aiming AAA on body):** body Text 1 on ground 15.2:1, on raised 12.4; Text 2 on raised 7.4; Text 3 on raised 5.1; guard green on surface 8.8; danger ink on its tint 7.5 and on raised 6.5; amber ink on its tint 8.5; white on Cobalt 4.72; light theme green 5.4, amber on tint 5.7. Tray and toast values in §3. Every state also has a word or a glyph.
- **Keyboard:** the tray icon is reachable from Win+B (Windows); Enter opens the popover with focus on its first row; ↑/↓ and Tab move; Esc closes and returns focus to the icon. Main window: `Ctrl+1…6` for sections; Tab order follows reading order; log rows and the limits panel are buttons with `aria-expanded`; the tripwire card traps focus and Esc works once it's stopped. Visible 2 px Cobalt-300 focus ring at 2 px offset everywhere, Windows-white inside the taskbar.
- **Screen reader (NVDA/Narrator):** the tray icon's name is its tooltip sentence; the popover is a `dialog` named "Eucas"; needs-you cards are `article`s named "bench needs you"; log glyphs carry their word ("Blocked by Eucas"); meters are `role="meter"` with "46 percent used, resets 15:40"; the strip is an image with a sentence; toasts are read by Windows; in-app changes go through one polite live region; the tripwire is an `alertdialog`.
- **Reduced motion:** follows Windows › Accessibility › Visual effects (`prefers-reduced-motion`) and a setting in Appearance; §6 lists each fallback. Sounds are not muted by it, and each has a visible twin.
- **High contrast / forced colours:** the tray marks map to system colours (the sheet shows the high-contrast row); in-app components use borders and words, so nothing depends on fills.
- **Targets:** 32 px minimum (28 px visual buttons get a 32 px hit area), 40 px for screen primaries; chips and the rule chip extend their hit areas with pseudo-elements.
- **Scaling:** checked at 100 / 125 / 150 % for the popover; the main window reflows down to its 880 × 600 minimum.

---

## 9. Client decisions in the prototype

Designed with the UX researcher's recommendations; each is a switch under **Client decisions** in the demo bar.

| # | Default (recommended) | Swap | What changes on screen |
|---|---|---|---|
| D-1 | (b) cap details at 3, guard every session | (c) no cap | 4th session: "Showing details for 3 sessions. All 4 are guarded. Pro shows every session's details." in Today and the popover (`pro-sessions`) |
| D-2 | (b) waitlist line | (a) hide | Every `ProLine` disappears |
| D-3 | — | — | No screen changes; signing decides whether UAC shows a verified publisher (grey) or not (yellow). The illustration assumes signed |
| D-4 | (a) ask for UAC | (b) user level only | First run step 4 loses "Without admin (weaker)", skips UAC, and every heartbeat says "user level"; Settings and Protection name it |
| D-5 | Hook-only canary (if spike S-1 passes) | Real model turn | The canary and Protection add "This test used about 400 tokens." |
| S-2 | Not proven: Open session only, with "Answer in the terminal, or open it" | Proven | Needs-you cards and toasts add **Allow once** |

---

## 10. Skills and rules applied

| Skill | Rules followed (where) |
|---|---|
| `ui-ux-guide` | One intent and one primary per screen (§1.2, smoke-tested); Hick/Miller: 6 sidebar items, ≤ 3 popover cards; Fitts: Open session and Fix it are 32–40 px and next to the evidence; never colour alone (§4.1, §4.2); empty states with a next step (§5.2); errors with cause and next step (§5.3); peak-load designed first (tripwire "still deleting", canary J); peak-end ("You're protected" + the first heartbeat + the closing toast) |
| `premium-craft` | Screen card plus: evidence (undo toasts, receipts), consequence preview (dry runs on rules, "Turn on protection · 3 rules", the forecast before the limit); state matrix (§5.2); 3 pinned moments (§6); remove-then-add (§7.2); spatial continuity (popover from the tray, cards collapse in place, the canary's receipt becomes the first log row); intelligence layer (rule chip, live rule counters, forecast learning pace, week-over-week retro, export); worst-moment pass (§5.3); render gate (72 screens; SELF-REVIEW.md) |
| `design-taste-frontend` (app-screens) | Colour on data not chrome; KPIs as type (the meters have no icons, no sparklines); flat surfaces; no hero header (20 px titles); tables as rules and alignment, right-aligned tabular figures; honest data (totals summed from rows; small numbers at their size; "—" when there's no plan data); the product's own face (the Quartet, the session avatars, the heartbeat strip as the one element only this product has); the main job one click away (Open session on the first screen) |
| `better-frontend` | Concentric radii inside cards; exact transition properties (no `transition: all`); scale 0.97 on press (system token); stroke 1.5 beside 400 text; tabular numbers on changing values; `text-wrap: balance/pretty`; one meaning per colour; visible `:focus-visible` rings; theme switch suppresses transitions |
| `web-design-guidelines` (fetched 2026-10-26) | Accessible names on icon buttons; polite live region for toasts; `…` in loading text; no outline removal without replacement; `color-scheme` per theme; Title Case for headings **not applied**: BRAND's sentence case wins |
| `anthropic-skills:accessibility` | POUR audit (§8); native buttons; `aria-expanded`/`aria-controls` on disclosures; focus trapped and restored in the tripwire; reduced motion |
| `anthropic-skills:design-system` | Primitive → role → component tokens; only role tokens in components; new tokens grouped and documented (§3); every component lists its states |
| `anthropic-skills:ui-animations` | Purpose per motion (§6); 200–420 ms entrances, 140–200 ms exits; transform/opacity only; reduced-motion fallback per row |
| `anthropic-skills:apple-hig-expert` | Not applied: the brief is Windows-first and says "not macOS-looking". Fluent and Windows app notification guidance were used instead |
| `ui-designer` role | Hi-fi single-file prototype in light and dark; distinctive, not generic; rubric returned with the deliverable (SELF-REVIEW.md) |

**References used.** Refero: Stripe security history (the log), Steel and Cartesia dark usage screens (the ledger, minus chrome), Zendesk status bars (the strip's origin). Windows: Microsoft Learn on the notification area, app notifications UX and materials (via the UX package). Real screenshots of agent view, the Claude desktop Code tab, Warp notifications and a Windows 11 tray flyout were **not** captured (see SELF-REVIEW gaps).

---

## 11. For the systems engineer

- **Component map:** §4 names = suggested React components in `apps/desktop/src/renderer/companion/`. `TrayIcon` is an ICO set chosen in main (`Tray.setImage`) plus `setToolTip(sentence)`; `WinToast` is a Windows App SDK / Electron `Notification` payload (title ≤ 48, body ≤ 200, buttons as actions); `TrayFlyout` is a frameless, always-on-top `BrowserWindow` positioned with the tray bounds (`screen.getDisplayNearestPoint`), hidden on blur.
- **State:** one store with `guard: GuardState`, `sessions: Session[]` (id, name, path, hue, shape, state, stopReason, tokens, share, where), `needs: NeedsItem[]` (id, kind: permission | question, sessionId, since, command | question, consequences, suggestion?), `log: LogEntry[]` (id, at, sessionId, kind: block | warn | trip | off | on, what, why, decidedBy, raw?), `rules`, `suggestions`, `usage` (mode, fiveHour, weekly, thresholds, updatedAt), `notificationsPausedUntil`, `decisions` (D-1/D-2/D-4/D-5/S-2 feature flags). `trayState` and every `HeartbeatLine` are derived, never stored.
- **Heartbeat contract:** a `check` event per hook call (sessionId, at) drives the seconds, the ring and the strip; "not guarded" is raised when transcript/status-line activity arrives without a matching check within one tool call (spike S-5).
- **Strings:** take them from `COPY` and the components verbatim; the fixed four are one module.
