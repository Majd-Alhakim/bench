# Task breakdown, lane B (app and server): Eucas companion v0.1

> **Sprint and lane:** this file's lane is the split the tech leads wrote by. Which lane and sprint runs each story is set by the [sprint plan](README.md#4-sprint-plan), which wins over any sprint note below.

| Status | Owner | For | Sources |
|---|---|---|---|
| Draft for Gate 6 (2026-10-26) | Tech lead, lane B | `/plan-sprint` | [BUILD-PLAN](../architecture/companion/BUILD-PLAN.md) §2–§4, [SRS](../requirements/SRS.md) v1.0 (FR/NFR ids), [CODE-STRUCTURE](../architecture/companion/CODE-STRUCTURE.md), [TESTING](../architecture/companion/TESTING.md), [SYSTEM-DESIGN](../architecture/companion/SYSTEM-DESIGN.md), [SP-ST1](../spikes/SP-ST1.md), [SP-H1](../spikes/SP-H1.md), [notch-and-panel](../design/ux/companion/notch-and-panel.md), [setup-flow](../design/ux/companion/setup-flow.md), ADR-0016/0017/0018 |

**Scope:** U-1, N-0, N-1, L-1, R-1, R-2, P-1, O-1, W-1, AC-1, AC-2, BU-1, ME-1, SUP-2, R1, the new **LY-1**, and the new **NA-1** (no account: safety and a small supervisor taste, founder decisions 2026-10-26; its tasks run in both lanes per the sprint plan). The other lead owns S1-1, G-1…G-5, A-1, A-2, H-1, C-1, T-1, F-1, M-1, D-1, SUP-1, SUP-3, Q-1; I cite their work by story id (or `<STORY>.<n>` where the id is certain).

**Conventions.**
- Estimates are focused build days; every task is ≤ 1 day.
- **Traces** are SRS v1.0 ids only.
- **Trace event** is the `<area>.<event>` row the feature writes to the app log and the diagnostic (server routes: an Analytics Engine row with route and status only, never a body).
- `SP-SUP2 (acceptance)` means the code can merge, but the task's numbers or its switch-on wait for SP-SUP2.
- Every story implements only approved screens and copy (FR-189); new strings go in `contracts/copy` keys.

**Non-negotiables for every lane B task.** Tests run in `pnpm check:all` and CI; a story is done only when each item below is verified:
- No credential, OAuth token, `.env` or key file is read (NFR-068; file-access audit).
- The guard links no account or network crate (NFR-033; `xtask check-deps`).
- Every IPC command is allow-listed with `deny_unknown_fields`, and every event is zod-parsed (NFR-067; capability test).
- No export anywhere except the diagnostic and the tripwire Copy list (NFR-103; text and capability scan).
- No global keyboard hook (NFR-078; check-deps).
- Every failure lands in a visible state (NFR-183; review).
- Contracts are the single source (NFR-185; `contracts` job).
- **Undo everywhere (FR-169):** every reversible change a task adds has a 10-s Undo, and anything irreversible says so before you commit. Each story's contract names its undo cases; LY-1.8 audits them all in one table-driven e2e.
- **Current UX over stale PRD text:**
  - No popover and no main window (PRD 18.2 as amended by v0.6, ADR-0016).
  - No toast except the BR-108 (3) fallback; never for blocks, usage or the meter.
  - No log or rules export (FD-3, G3-2).
  - The approved privacy line everywhere (FR-138).
- **The account gate (NA-1.1, from Sprint 5):** every call to the Eucas server goes through `net/gate.rs`, and every account-only feature (the full panel, Usage, your own rules, drafting, learns-you, receipts and the ledger, the trial) checks `AccountState` first. With no account (signed out counts as no account), Eucas is safety plus a small supervisor taste (NA-1): it never reads the account, and once the taste is used up it calls nothing.

---

## U-1 · Tauri shell · 2.0 d (plan 1.5) · depends: S1-1 · PRD 18.2 (as amended by v0.6), 27.3 · UC-60

**Constraint contract:**
- One pre-warmed webview: shown, never created (NFR-010 < 150 ms).
- No main window, one instance, starts at login (FR-101).
- `@tauri-apps/*` is imported only in `src/ipc` (NFR-182).
- Commands are allow-listed and events zod-parsed (NFR-067).
- No Tauri window getter in a timer or loop (SP-ST1 #2).
- Verified by: Rust unit tests, Vitest, the Playwright smoke, the capability test and lint.

**Order and sprint fit:**
- **Sprint 1** (after S1-1 merges, about 1.5 d): U-1.1 → U-1.2 → U-1.3 → U-1.5. Demo: the hidden panel shows the live store in < 150 ms under Playwright.
- **Sprint 2** (0.5 d, before N-0): U-1.4, U-1.6.

**Shared files (flagged).** None of `crates/eucas-rules/**`, `crates/eucas-platform/**` or the S1-1 root configs is touched in Sprint 1, except:

| File | Who else | Rule |
|---|---|---|
| `.github/workflows/ci.yml` (U-1.5 adds `build`, `e2e`) | S1-1 creates it | Edit only after S1-1 merges; G-1 doesn't touch it, so it's sequenced |
| `contracts/errors/`, `contracts/copy/en/` | S1-1.3 creates them split per domain / surface | U-1 adds only its own files (`errors/ipc.schema.json`, `copy/en/tray.json`, `copy/en/quit.json`); no shared file (settled in the sprint plan) |
| `Cargo.lock`, `pnpm-lock.yaml` | G-1 (proptest, fuzz) | Unavoidable; regenerate, never hand-merge |
| Root `Cargo.toml` | S1-1 | Not touched **if** S1-1 uses `members = ["crates/*", …]` (CODE-STRUCTURE §1) and U-1 keeps the Tauri deps in `crates/eucas-app/Cargo.toml` (hoisted later in a chore PR) |
| `eslint.config.js` | S1-1 | Not touched if S1-1 ships the CODE-STRUCTURE §3 ipc-only rule, as specified |
| `deny.toml` | S1-1 | Only if Tauri pulls a licence outside the allow-list: a separate PR after S1-1 |
| `crates/eucas-platform/src/windows/mod.rs` (U-1.6, Sprint 2) | G-3, N-0 in the same sprint | Merge U-1.6 before G-3 starts, or apply Q5 |

### U-1.1 · App crate, the pre-warmed panel and the setup window
- **Traces:** FR-101, FR-001, FR-109, NFR-010, NFR-067
- **Files:**
  - `crates/eucas-app/{Cargo.toml, build.rs, tauri.conf.json, capabilities/panel.json, capabilities/setup.json, src/main.rs, src/windows/{mod,panel,setup}.rs}`
  - `apps/companion/{package.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/routes.tsx, src/surfaces/panel/panel.tsx, src/surfaces/setup-window/setup-window.tsx}`
- **Acceptance criteria:**
  - At start exactly one webview exists (the panel, hidden); show/hide never re-creates it; no main window exists.
  - The setup window is created on demand at 760 × 600 and destroyed (not hidden) on close.
  - Esc closes the panel and returns focus; focus loss dismisses it; "shown" is a Rust event, not `visibilitychange`; listeners are window-scoped (SP-ST1 #4, #5).
  - CSP `default-src 'self'`; the capability files allow exactly the commands in `commands.schema.json`, plus `window.hide` for the panel.
- **Test approach:**
  - Rust: `windows::panel::tests::{created_hidden_once, show_never_recreates}` and `windows::setup::tests::{size_760x600, destroyed_on_close}`.
  - `crates/eucas-app/tests/capabilities.rs::capabilities_match_commands_schema`.
  - The Playwright cases land in U-1.5.
- **Estimate:** 0.5 · **Depends:** S1-1 · **Blocked by spike:** none · **Trace event:** `shell.started {version, prewarm_ms}`, `shell.panel_shown {mode, first_frame_ms}`

### U-1.2 · IPC contract, the store and `state_patch`
- **Traces:** NFR-067, NFR-185, NFR-182, NFR-183
- **Files:**
  - `contracts/ipc/{state,commands,events}.schema.json` (first cut: `GuardState`, `TrayState`, `NotchState`, `SessionSummary`, `get_snapshot`, `state_patch`)
  - `contracts/errors/ipc.schema.json` (`IPC_EVENT_INVALID`, `IPC_BAD_ARGS`)
  - `crates/eucas-core/{Cargo.toml, src/lib.rs, src/app_state.rs}`, `crates/eucas-app/src/{commands,events}.rs`
  - `apps/companion/src/{ipc/index.ts, ipc/events.ts, store.ts}`
- **Acceptance criteria:**
  - `get_snapshot` returns the whole store; every core change is one `state_patch` with a strictly increasing `seq`.
  - The renderer applies patches in order; on a gap it calls `get_snapshot` once and replaces its mirror.
  - An event failing zod is dropped and logged as `IPC_EVENT_INVALID` (visible in the diagnostic), never a crash; command args with an unknown field are rejected with `IPC_BAD_ARGS`.
  - Lint fails on an `@tauri-apps/*` import outside `src/ipc/**` (fixture).
- **Test approach:**
  - Rust: `app_state::tests::{seq_strictly_increasing, snapshot_after_patches_equals_state}` and `commands::tests::unknown_field_rejected`.
  - Vitest: `store.test.ts::{applies_in_order, gap_triggers_one_resync, invalid_event_dropped_and_reported}` and `ipc/events.test.ts::hostile_string_stays_text`.
  - S1-1's codegen round-trip covers the new schemas.
- **Estimate:** 0.5 · **Depends:** U-1.1, S1-1 (codegen) · **Blocked by spike:** none · **Trace event:** `ipc.resync {gap}`, `ipc.event_invalid {code}`

### U-1.3 · Derive functions: notch state and tray state
- **Traces:** FR-103, FR-104, FR-105, FR-021, NFR-036
- **Files:** `crates/eucas-core/src/derive.rs`, `contracts/ipc/state.schema.json` (enums), `contracts/copy/en/tray.json` (`tray.tooltip.*`)
- **Acceptance criteria:**
  - `notch_state` returns exactly one of Not protected › Tripwire stop › Needs you › Working › Resting › Dozing, plus Before setup.
  - Working = a tool ran in the last 20 s; Dozing only with ≥ 5 min no input **and** nothing running.
  - `tray_state` is never `calm` while any session is not protected; every tray state has a tooltip sentence in words (the FR-021 Protected / Not protected tray line uses it; NA-1.2 reuses it for the no-account menu).
- **Test approach:**
  - `derive::tests::notch_priority_cartesian`: all 64 combinations of `{not_protected, tripped, needs>0, working, idle_5min, setup_done}`.
  - `tray_never_calm_when_any_not_protected`, `no_doze_while_running`, `working_boundary_19_999_vs_20_000`, `every_tray_state_has_a_sentence`.
- **Estimate:** 0.25 · **Depends:** U-1.2 · **Blocked by spike:** none · **Trace event:** `notch.state_changed {from, to}`

### U-1.5 · Playwright harness over WebView2 CDP, and the `build` / `e2e` CI jobs
- **Traces:** NFR-010, NFR-153, NFR-180
- **Files:**
  - `tests/e2e/{package.json, playwright.config.ts, fixtures/app.ts, fixtures/fake-claude-home.ts, smoke/shell.spec.ts}`
  - `.github/workflows/ci.yml` (`build`, `e2e` jobs; **shared with S1-1**, sequenced)
  - `crates/eucas-app/Cargo.toml` (an `e2e` feature exposing a test-only `show_panel`)
- **Acceptance criteria:**
  - The built app launches with `EUCAS_HOME` / `EUCAS_CLAUDE_HOME` in a temp folder and attaches over CDP; locators by role and name only; no fixed sleeps.
  - `shell.spec.ts`:
    - one webview target at idle;
    - panel first frame < 150 ms after show;
    - the store equals `get_snapshot` after scripted patches;
    - hostile strings render as text.
  - CI runs `build` and `e2e` on Windows (CDP) and Ubuntu (`tauri-driver` smoke), and uploads traces on failure.
  - The `e2e` feature is absent from release builds (test on the release capability set).
- **Test approach:** the suite itself, plus a capability test that the release build has no `show_panel`.
- **Estimate:** 0.25 · **Depends:** U-1.2 · **Blocked by spike:** none · **Trace event:** uses `shell.panel_shown`

### U-1.4 · Tray fallback, single instance, autostart, quit dialog *(Sprint 2)*
- **Traces:** FR-116, FR-101, FR-048, FR-021
- **Files:** `crates/eucas-app/src/{tray,context_menu,single_instance,autostart}.rs`, `crates/eucas-app/icons/tray/*.ico` (the UI's ICO set; placeholders until delivered), `contracts/copy/en/{tray,quit}.json` (`tray.menu.*`, `quit.*`)
- **Acceptance criteria:**
  - Signed in, the menu is exactly Show the panel · Show the notch as a thin line / pill · Quit Eucas…; there is no "Turn off protection". (The no-account menu is NA-1.2's; this task builds the menu from a per-state item list so NA-1.2 adds a list, not a branch.)
  - The icon and tooltip follow `tray_state` through a cached handle (no getter in a loop).
  - A second launch exits and shows the panel in the first instance; Eucas registers to start at login (official Tauri plugins, no platform code).
  - Quit asks first and says the limits and rules keep working while the heartbeat, notifications and tripwire stop.
- **Test approach:**
  - `tray::tests::{menu_exactly_three_items, no_turn_off_item, icon_follows_state}`.
  - Windows integration: `tests/single_instance.rs::second_launch_exits_and_shows_panel` and `autostart::tests::registered_on_first_run`.
  - The quit copy key is checked against `fixed.*`.
- **Estimate:** 0.25 · **Depends:** U-1.3 · **Blocked by spike:** none · **Trace event:** `tray.state_changed {state}`, `shell.quit {confirmed}`

### U-1.6 · Peek mode without activation; process AUMID *(Sprint 2)*
- **Traces:** FR-107, FR-115, NFR-136, NFR-010
- **Files:** `crates/eucas-platform/src/windows/{no_activate,aumid}.rs` (+ one `mod.rs` line, flagged above), `crates/eucas-app/src/windows/panel.rs` (`show_peek`, `show_panel`)
- **Acceptance criteria:**
  - `show_peek` shows the pre-warmed panel in peek layout with `WS_EX_NOACTIVATE` / `SW_SHOWNOACTIVATE`: the foreground window is unchanged.
  - The panel webview is transparent outside its shapes, so the gooey peek (N-0.8) can draw the notch body over the native notch's rect.
  - `show_panel` (a click) activates and focuses it.
  - The process sets Eucas's explicit AUMID at start (the Start-menu shortcut carrying it is R1.1).
- **Test approach:** Win32 probes `peek_keeps_foreground_window`, `panel_click_takes_focus`, `process_aumid_is_eucas`.
- **Estimate:** 0.25 · **Depends:** U-1.1 · **Blocked by spike:** **SP-ST2** (peek without activation) · **Trace event:** `shell.panel_shown {mode: peek}`

---

## N-0 · The native notch · 3.25 d (plan 2.5) · depends: U-1, SP-ST2 · PRD 27.1, 27.2, 27.10 · UC-60, UC-55

**+0.5:** the gooey peek (DESIGN §5 / §5.1, 2026-10-26) replaced the clip-path morph after the plan. The native notch and the peek webview now have to hand the notch body over between two windows (N-0.8).

**Constraint contract:**
- Notch < 2 MB, < 0.3 % CPU at rest, < 1.5 % while the eyes follow (NFR-008); idle total < 90 MB and < 0.5 % (NFR-007).
- Never takes focus; click-through outside its shape (FR-102).
- Readable in 1-bit (NFR-134); reduced-motion variants (NFR-133).
- A panic hides the notch and the tray shows the state (NFR-047).
- `eucas-notch` is pure, with no I/O.
- Verified by: the perf sampler, Win32 probes, golden images vs the approved screenshots, and check-deps.

### N-0.1 · Notch tokens as plain values → generated Rust constants
- **Traces:** NFR-185, FR-173, NFR-134
- **Files:** `packages/ui-tokens/tokens-notch.json` (from `docs/design/ui/companion/tokens-notch.css`), `xtask/src/codegen/notch_tokens.rs` (xtask is S1-1's; separate file), `crates/eucas-notch/{Cargo.toml, src/lib.rs, src/tokens.rs}` (generated)
- **Acceptance criteria:**
  - Sizes at 100 %, colours per state (with the forced-colours map) and timings come from the JSON. The timings: blink 3.8–7.2 s, glance 900 ms, drop 3 px / 640 ms, dwell 280 ms, fold 360 ms, pleased 1.6 s.
  - `xtask codegen --check` fails when the constants are stale.
  - No literal colour exists in `eucas-notch` outside `tokens.rs`.
- **Test approach:** codegen round-trip; `tokens::tests::every_state_has_colour_and_shape`; CI `codegen --check`.
- **Estimate:** 0.25 · **Depends:** U-1.3 · **Blocked by spike:** none · **Trace event:** — (build time)

### N-0.2 · Drawing core and the eye grammar: exactly eight faces
**Founder order (2026-10-26):** the eye grammar in DESIGN §11 ([sheet](../design/ui/companion/screens/eyes-sheet-d.png)) is the **only** set of faces Pip may show, here and everywhere else that draws Pip's eyes (panel header avatar, `CaughtUp`, setup birth and homecoming).

| Face | Shape (DESIGN §11, the sheet) | Motion | Reduced motion |
|---|---|---|---|
| **Calm** | two 5 × 13 pills, −12° | eye-follow ≤ 2.5 px; blink every 3.8–7.2 s | still, centred |
| **Focused** | 6 × 9 pills | reads ±2 px over 2.4 s, alternate: **the only loop** | still |
| **Glance** | Calm, looking at the marker (3 px right, 1 px down) | one look, then hands over | the shape only, no travel |
| **Toward you** | Calm, 1.5 px up and front | eye-follow; no bobbing | still, centred |
| **Concerned** | pills rotated ±16°, 1.5 px down | none ("never alarmed") | same shape |
| **Sleepy** | 9 × 2.6 lines, dim | none; wakes with a blink | same shape, no blink |
| **Pleased** | 9 × 5 arcs | held 1.6 s, then back | same shape for 1.6 s |
| **Closed** | two closed arcs | none | same shape |

**State → face** (one face at a time, first match wins; this is the prototype's grammar, `prototype/src/app.js`):

| # | App state (U-1.3 `notch_state`, plus the two transient moments) | Face |
|---|---|---|
| 1 | Not protected (FR-042) or Tripwire stop (FR-058) | Concerned |
| 2 | Dozing (FR-105) | Sleepy |
| 3 | Before setup (FR-173) | Closed |
| 4 | *Moment:* a needs-you item arrives (FR-106) | Glance, then row 6 |
| 5 | *Moment:* you're all caught up (FR-114), 1.6 s | Pleased, then row 7 or 8 |
| 6 | Needs you | Toward you |
| 7 | Working (FR-104) | Focused |
| 8 | Resting | Calm |

- **Traces:** FR-173, FR-103, FR-104, FR-105, FR-106, FR-114, FR-042, FR-058, NFR-133, NFR-134, NFR-008
- **Files:** `crates/eucas-notch/src/{face,draw,eyes,shape,anim,sprites}.rs` (`face.rs`: `enum Face` and `fn face_for(state, moment) -> Face`), `crates/eucas-notch/tests/golden/*.png`, `contracts/ipc/state.schema.json` (`Face` enum, so the panel avatar uses the same eight)
- **Acceptance criteria:**
  - `enum Face` has exactly the eight variants above. **No other face exists:** no other variant, sprite, shape or CSS expression anywhere in the repo (notch, panel avatar, setup, `CaughtUp`), and the webview reads `Face` from the generated contract rather than defining its own.
  - Each face is a native-drawable shape: pills, arcs, lines and rotations from plain token values (ADR-0016). No filter, effect or webview is involved; the gooey layer (N-0.8) draws the body, never the eyes.
  - `face_for` implements the state → face table, and every app state and moment maps to exactly one of the eight.
  - `draw(state, t, cursor, scale) -> BGRA` is pure, with time and cursor passed as arguments.
  - Eye-follow runs only for Calm and Toward you. Focused is the only looping animation. Blink applies only to Calm and Toward you.
  - Reduced motion keeps every shape and drops the movement: no follow, no Focused loop, no Glance travel, no blink.
  - In a 1-bit render, all eight faces stay distinct.
- **Test approach:**
  - `face::tests::face_enum_has_exactly_eight` (an exhaustive `match` with no wildcard, plus a variant count).
  - `face::tests::every_state_maps_to_one_of_eight`: the cartesian product of U-1.3's state inputs × {no moment, arrival, caught up} → `face_for` returns one variant, and the table's rows hold.
  - `face::tests::only_focused_loops`, `follow_only_calm_and_toward_you`, `reduced_motion_keeps_shape_drops_motion`, `one_bit_faces_distinct`.
  - `xtask check-faces`: a repo scan in CI that fails on any face or expression name outside the eight (`data-x` values, sprite names, copy keys).
  - Golden images: all eight at 100 / 125 / 150 %, compared with the eye sheet and `docs/design/ui/companion/screens/notch-{rest,doze}-zoom.png` (small tolerance).
  - proptest: `draw` never panics for any cursor or time.
- **Estimate:** 0.75 (was 0.5: the full set of eight, the mapping and the repo scan) · **Depends:** N-0.1 · **Blocked by spike:** none · **Trace event:** `notch.face_changed {from, to, cause}`

### N-0.3 · Drawing: beam, markers, Not protected, tripwire, thin line, arrival
- **Traces:** FR-104, FR-106, FR-042, FR-058, FR-117, FR-103, NFR-134
- **Files:** `crates/eucas-notch/src/{beam,marker,thin_line,words}.rs`, golden PNGs
- **Acceptance criteria:**
  - The working beam is in the Euca's colour; the amber count marker stays.
  - "**Not protected**" is red with a ring (eyes: `Face::Concerned` from N-0.2), and overrides thin line.
  - "**Stopped: <project>**" is a red marker with a middle ellipsis for long names.
  - The thin line is 96 × 4 with a needs dot; arrival drops 3 px (eyes: `Face::Glance`).
  - This task draws no eyes of its own: every face comes from N-0.2's eight (Pleased for LY-1.7 included).
  - Text uses a pure-Rust rasteriser (`ab_glyph`, MIT/Apache) and the bundled UI font; there is no DirectWrite in the pure crate.
- **Test approach:**
  - Golden images at 3 scales against `notch-{working,marker,off,trip,thin,thin-needs}-zoom.png`.
  - `not_protected_overrides_thin_line`, `long_project_name_middle_ellipsis`, and 1-bit renders.
- **Estimate:** 0.5 · **Depends:** N-0.2 · **Blocked by spike:** none · **Trace event:** —

### N-0.4 · Notch window: layered, no-activate, click-through, placement, full-screen step-aside, panic catch
- **Traces:** FR-102, FR-001, NFR-011, NFR-137, NFR-047, NFR-136
- **Files:** `crates/eucas-platform/src/windows/notch_window.rs`, `crates/eucas-app/src/notch.rs`
- **Acceptance criteria:**
  - Window styles `WS_EX_LAYERED | NOACTIVATE | TOOLWINDOW | TOPMOST` and `MA_NOACTIVATE`; per-pixel alpha makes it click-through outside the pill.
  - Placed top centre of the primary display from the monitor's work area and scale; refreshed on `WM_DPICHANGED` or a display change, never polled.
  - Hides when `SHQueryUserNotificationState` is 3 or 4, or when the foreground window covers the monitor, but never on state 2 alone; returns with `SW_SHOWNOACTIVATE`.
  - A panic in drawing or in the window procedure hides the notch, the tray shows the state, and the core keeps running. The notch appears only from setup step 9, with an account or without (the no-account minimal notch and panel are NA-1.11; pending founder answer (a)).
- **Test approach:** Win32 probes:
  - `foreground_unchanged_after_show`, `hit_test_corner_passes_through`;
  - `placement_at_100_125_150` (per-monitor DPI harness);
  - `fullscreen_state_3_hides_state_2_doesnt`, `panic_in_draw_hides_and_tray_shows`.
- **Estimate:** 0.5 · **Depends:** N-0.2, U-1.4 · **Blocked by spike:** none · **Trace event:** `notch.stepped_aside {reason}`, `notch.panic {code}`

### N-0.5 · Hover poll, peek trigger, click → panel, input idle; the budgets
- **Traces:** FR-107, FR-109, FR-105, NFR-007, NFR-008
- **Files:** `crates/eucas-platform/src/windows/notch_window.rs` (`GetCursorPos` poll, `GetLastInputInfo`), `crates/eucas-app/src/notch.rs`, `tests/perf/notch_sampler.rs`
- **Acceptance criteria:**
  - A 30 Hz poll runs only while the cursor is near or the eyes follow, and stops otherwise.
  - A 280 ms rest calls `show_peek`; a passing pointer doesn't; leaving folds the peek after 360 ms; a click calls `show_panel`.
  - `last_input_at` feeds the derive function (dozing) and LY-1.7 (away).
  - Keyboard-focus peek follows SP-ST2's outcome.
- **Test approach:**
  - Unit tests on the dwell state machine: `passing_pointer_never_peeks`, `dwell_280_opens`, `fold_after_360`.
  - `notch_sampler` (fake cursor, 60 s): < 2 MB, < 0.3 % at rest, < 1.5 % following.
  - The 10-min idle sampler with the panel hidden: < 0.5 %, < 90 MB.
- **Estimate:** 0.25 · **Depends:** N-0.4, U-1.6 · **Blocked by spike:** **SP-ST2** (keyboard-focus peek only) · **Trace event:** `notch.peek_opened {dwell_ms}`

### N-0.6 · UI Automation provider
- **Traces:** NFR-132, NFR-131
- **Files:** `crates/eucas-platform/src/windows/uia.rs`, `crates/eucas-app/src/notch.rs`
- **Acceptance criteria:**
  - Narrator reads the name (protection state, activity, needs count).
  - A new needs-you item raises `UiaRaiseNotificationEvent` once (polite).
  - On SP-ST2's NO-GO path: the hidden accessible companion window instead.
- **Test approach:** a UIA client probe: `name_reflects_state`, `notification_raised_once_per_item`; the manual Narrator pass per release (Q-1).
- **Estimate:** 0.25 · **Depends:** N-0.4 · **Blocked by spike:** **SP-ST2** · **Trace event:** `notch.uia_announced {kind}`

### N-0.7 · Optional panel shortcut with `RegisterHotKey`
- **Traces:** FR-118, NFR-078, NFR-131
- **Files:** `crates/eucas-platform/src/windows/hotkey.rs`, `crates/eucas-app/src/notch.rs`, `contracts/ipc/commands.schema.json` (`set_panel_shortcut`)
- **Acceptance criteria:**
  - Off by default; when switched on, it registers one combination with `RegisterHotKey` that opens the panel.
  - A taken combination is reported and left off.
  - `SetWindowsHookEx` appears nowhere (check-deps).
- **Test approach:** `hotkey::tests::{off_by_default, taken_combo_reported}` (registered twice); check-deps; the toggle UI is P-1.2.
- **Estimate:** 0.25 · **Depends:** N-0.5 · **Blocked by spike:** **SP-ST2** · **Trace event:** `notch.shortcut_changed {on, result}`

### N-0.8 · Gooey peek: the notch body melts into the card (DESIGN §5.1)
- **Traces:** FR-107, NFR-010, NFR-133, NFR-008
- **Files:**
  - `apps/companion/src/surfaces/panel/goo-layer.tsx` (inline SVG `<filter id="goo">`: `feGaussianBlur stdDeviation 6` → `feColorMatrix` alpha row `0 0 0 18 -7`)
  - `apps/companion/src/surfaces/panel/peek-motion.ts` (ported from `apps/landing/public/main.js` `showPeek` and `styles.css` `.goo`)
  - `crates/eucas-app/src/notch.rs` (handoff), `crates/eucas-notch/src/draw.rs` (an `EyesOnly` body mode)
- **Acceptance criteria:**
  - On peek, the webview covers the notch rect to the device pixel and draws the notch shape and the card in one goo layer that starts 24 px above the screen edge. The native notch switches to `EyesOnly` in the same frame, so the eyes never move; on fold it reverses.
  - Peek: the card grows from 30 % × 20 % with `--spring-gentle` (600 ms) and the words fade in 160 ms later. Fold: the words go first (140 ms), then the card melts back (300 ms).
  - Only `transform` and `opacity` animate; text, eyes, markers and icons sit outside the filter. No infinite animation; the webview's compositor idles once settled (SP-ST1 #3).
  - **Reduced motion:** the shapes appear and fold instantly, with no melt.
- **Test approach:**
  - **Golden images** (Playwright screenshot, animations frozen with `?freeze=1`-style clock control) of the peek at rest, mid-melt and folded, at 100 / 125 / 150 %, against the prototype's `peek-*-d.png`.
  - **Reduced-motion test:** with `prefers-reduced-motion`, no frame between closed and open.
  - Win32 probe `peek_rect_aligns_with_notch_within_1px` at 3 scales.
  - The notch sampler shows the budget is unchanged at rest (the webview is hidden).
- **Estimate:** 0.5 · **Depends:** N-0.5, U-1.6 · **Blocked by spike:** **SP-ST2** (peek without activation, which the handoff relies on) · **Trace event:** `shell.panel_shown {mode: peek, first_frame_ms}`

---

## N-1 · Needs-you and sounds · 2.0 d (plan 1.5) · depends: H-1, N-0 · PRD 23.1, 27.2, 27.10 (sounds) · UC-60

**Constraint contract:**
- Nothing opens by itself (NFR-136).
- No Allow or Deny on any item (FR-108).
- Blocks, usage, the meter, Pro and the account are never items (FR-110, FR-142, FR-161).
- A toast only when a full-screen app hides the notch and the event is a trip or Not protected (FR-115, BR-108); no toast anywhere else.
- Sounds are silent in full-screen apps, calls and Focus (FR-119).
- Undo: Not now has a 10-s Undo (FR-113, FR-169).
- **+0.5:**
  - +0.25: the SP-ST1 toast fallback (reading the notification state, routing by AUMID) wasn't sized.
  - +0.25: the sounds (PRD 27.10) are in no BUILD-PLAN story; the story map puts them here.

### N-1.1 · Item model, event mapping and resolution
- **Traces:** FR-110, FR-112, FR-120, FR-052, FR-038, FR-142, FR-161
- **Files:** `crates/eucas-core/src/notify/{mod,needs,mapping}.rs`, `contracts/ipc/state.schema.json` (`NeedsItem`); uses `needs_item` from H-1's `0001_init.sql`
- **Acceptance criteria:**
  - The kinds are exactly FR-110's; N-1 raises waiting (`permission_prompt` / `idle_prompt`), done after ≥ 2 min, login expired, not protected, restart-to-protect and not verified.
  - F-1, T-1, M-1 and SUP-1 add their kinds through the same `raise()` API.
  - An item resolves on the next tool call or `UserPromptSubmit` ("Answered in bench"), or on session end ("…ended before you answered. Nothing ran."), and persists across a restart.
  - A block, the meter or an account event never creates an item.
- **Test approach:**
  - `mapping::tests::{event_to_item_table, block_never_an_item, meter_empty_never_an_item, account_events_never_reach_notch, resolves_on_answer, ended_before_answer_copy}`.
  - Integration: items survive a restart.
- **Estimate:** 0.5 · **Depends:** H-1 · **Blocked by spike:** none · **Trace event:** `needs.raised {kind}`, `needs.resolved {kind, how}`

### N-1.2 · Notch markers, peek lines, the panel's Needs you list
- **Traces:** FR-106, FR-107, FR-108, FR-109, NFR-130, NFR-135
- **Files:** `apps/companion/src/surfaces/panel/peek.tsx`, `src/screens/needs-you/*`, `src/components/needs-you-card/*`, `crates/eucas-core/src/derive.rs` (needs count)
- **Acceptance criteria:**
  - The marker count is the total. The peek shows up to 3 items, one action each, with the status footer and "Open panel ›".
  - The panel shows "Needs you · n" (up to 3, then "Show n more"), or "Nothing needs you." when empty.
  - The peek and the panel use the same words, order and action; no Allow or Deny exists.
  - Peek rows sit above N-0.8's goo layer, outside the filter, so the words stay crisp.
- **Test approach:**
  - Vitest: every `NeedsYouCard` state (DESIGN §5.2).
  - Playwright `needs-you.spec.ts`: the driver plays a Notification event → the store count, a peek row, a panel row.
  - axe on the peek and the list.
- **Estimate:** 0.5 · **Depends:** N-1.1, N-0.8, P-1.1 · **Blocked by spike:** none · **Trace event:** `needs.shown {surface}`

### N-1.3 · Open session (S-4)
- **Traces:** FR-111
- **Files:** `crates/eucas-platform/src/windows/foreground.rs`, `crates/eucas-core/src/notify/open_session.rs`, `crates/eucas-app/src/commands.rs` (`open_session`)
- **Acceptance criteria:**
  - The host is classified by image path (Windows Terminal, conhost / OpenConsole, VS Code, the desktop app).
  - Focus runs inside the click handler.
  - Desktop app: focus it and name the session. Terminal: focus it and name the tab by its console title. Otherwise, name where it is.
- **Test approach:** a host-classification table over fixture image paths; a Win32 probe `focus_inside_click_handler`; the G6 manual checklist (passed, FD-6).
- **Estimate:** 0.25 · **Depends:** N-1.2, H-1 · **Blocked by spike:** none · **Trace event:** `needs.open_session {host, result}`

### N-1.4 · Not now, the Undo toast, pause notifications
- **Traces:** FR-113, FR-169, NFR-136
- **Files:** `apps/companion/src/components/undo-toast/*`, `crates/eucas-core/src/undo.rs`, `crates/eucas-app/src/commands.rs` (`snooze_needs`, `undo`, `pause_notifications`)
- **Acceptance criteria:**
  - Not now exists in the panel only: 15 min, with a 10-s Undo and a timer line; the hidden item says when it comes back.
  - Undo tokens are single-use and expire at 10 s (the shared undo service for R-1, LY-1 and A-2).
  - Pause notifications stops toasts and sounds until the chosen time.
- **Test approach:** `undo::tests::{token_single_use, expires_at_10s}`; Vitest UndoToast states; Playwright snooze → undo restores the item.
- **Estimate:** 0.25 · **Depends:** N-1.2 · **Blocked by spike:** none · **Trace event:** `needs.snoozed`, `undo.applied {kind}`

### N-1.5 · Toast fallback under the policy
- **Traces:** FR-115, FR-042, FR-058, NFR-136
- **Files:** `crates/eucas-core/src/notify/{policy,toast}.rs`, `crates/eucas-platform/src/windows/toast.rs`
- **Acceptance criteria:**
  - A toast is sent only when a full-screen app hides the notch and the event is a tripwire stop or Not protected.
  - At most one per event and ≤ 1 per 2 min per session; `SHQueryUserNotificationState` is read before relying on a banner.
  - Activation routes through Eucas's AUMID to the right item.
- **Test approach:** policy table tests `fullscreen_needs_item_no_toast`, `fullscreen_trip_one_toast`, `one_per_2min_per_session`; a toast payload snapshot; toast rendering stays on the manual checklist.
- **Estimate:** 0.25 · **Depends:** N-1.1, N-0.4, U-1.6 · **Blocked by spike:** none · **Trace event:** `notify.toast_sent {kind}`, `notify.toast_suppressed {reason}`

### N-1.6 · Sounds (PRD 27.10, DESIGN §6)
- **Traces:** FR-119, FR-106, NFR-136
- **Files:** `crates/eucas-core/src/sounds.rs`, `crates/eucas-platform/src/windows/audio.rs`, `crates/eucas-app/sounds/*.wav` (from UI)
- **Acceptance criteria:**
  - Needs you plays once per arriving item; T-1 calls the same API for a tripwire stop; Done plays for the setup test, the homecoming and all caught up (LY-1.7).
  - Sounds are on by default with one mute (P-1.2).
  - Silent while `SHQueryUserNotificationState` reports full screen, presentation or a call, and while Windows Focus is on; pause notifications also silences them; every sound has a visible twin.
  - **Resolved (PM):** SRS FR-119, notch-and-panel §9.8 and DESIGN §11 (`stopped`, F5 → C5, 400 ms, falling) agree on three sounds; §6 predates §11. The build ships three: Needs you, Done, Stopped.
- **Test approach:** a policy table unit test (full screen, presentation, call, Focus, muted, paused → silent); `plays_once_per_arrival`; a no-double-play test for several items in one tick.
- **Estimate:** 0.25 · **Depends:** N-1.1 · **Blocked by spike:** none · **Trace event:** `sound.played {kind}`, `sound.suppressed {reason}`

---

## L-1 · Usage: ledger and forecast · 1.5 d · depends: G-3, G-4, H-1, U-1 · PRD 22.1 · UC-58

**Constraint contract:**
- Your status line prints byte for byte (FR-084, NFR-157); the wrapper adds ≤ 30 ms p95 (NFR-006).
- Usage never comes from credentials (FR-085, NFR-068).
- No notification at the warning line (FR-087); no upsell at a limit (FR-088).

### L-1.1 · Status-line wrapper subcommand
- **Traces:** FR-084, NFR-006, NFR-157, NFR-031
- **Files:** `crates/eucas-guard/src/cmd/status_line.rs`, `crates/eucas-guard/src/main.rs` (one dispatch line; **G-3's file**, already merged by then), `tests/perf/status_line_bench.rs`
- **Acceptance criteria:**
  - The saved command runs with the same stdin bytes (exec form if it was exec form, else the shell Claude Code uses).
  - stdout, stderr and the exit code pass through unchanged.
  - Usage fields go to the core after stdout, capped at 10 ms; an internal failure prints the user's output or nothing.
- **Test approach:** `status_line_byte_equal` over fixtures (exec, shell, failing, non-UTF-8 output, no saved command); a bench with p95 ≤ 30 ms over the user's command; panic → exit 0.
- **Estimate:** 0.5 · **Depends:** G-3 · **Blocked by spike:** none · **Trace event:** `ledger.sample {mode}` (core side)

### L-1.2 · Chain and restore the status line in user settings
- **Traces:** FR-084, FR-187, NFR-158, NFR-040
- **Files:** `crates/eucas-core/src/installer/status_line.rs`, `contracts/install-manifest.schema.json` (status-line field; the schema is G-4's / A-1's, sequenced after them)
- **Acceptance criteria:**
  - Install saves the user's `statusLine` to `statusline.saved.json`, sets ours, and records a JSON patch; every write is atomic.
  - Remove puts the user's back only if ours is still set.
- **Test approach:** integration in a temp home: install → byte-equal output; a user change after install survives remove; a locked file rolls back.
- **Estimate:** 0.25 · **Depends:** L-1.1, G-4 · **Blocked by spike:** none · **Trace event:** `installer.status_line {action, result}`

### L-1.3 · Ledger and forecast
- **Traces:** FR-085, FR-086, FR-089, FR-090, NFR-094
- **Files:** `crates/eucas-core/src/ledger/{mod,forecast,modes}.rs`
- **Acceptance criteria:**
  - Samples come from the status line and transcript usage fields only, rolled up per session and per project, for today and 7 days.
  - The forecast is a least-squares fit over 45 min with a range; fewer than 2 samples → "not enough data", never a guess.
  - Modes: plan / tokens_only / api / not_reporting; samples are kept 90 days.
- **Test approach:** forecast fixtures (TESTING §2); `empty_and_single_sample_no_guess`; a mode table; a retention unit test; the file-access audit `never_opens_credentials`.
- **Estimate:** 0.25 · **Depends:** L-1.1, H-1 · **Blocked by spike:** none · **Trace event:** `ledger.mode_changed {mode}`

### L-1.4 · The Usage tab
- **Traces:** FR-086, FR-087, FR-088, FR-089, FR-090, FR-091, NFR-130
- **Files:** `apps/companion/src/screens/usage/*`, `src/components/{usage-meter,forecast-line,ledger-table}/*`
- **Acceptance criteria:**
  - 5-hour and weekly meters with freshness and the reset time; one forecast sentence per meter, with its basis on hover.
  - Past 85 %: amber with the word "close", and no notification.
  - At a limit: the FR-088 copy with no Pro line.
  - Tokens-only, API-cost, not-reporting and empty states; holds ME-1's meter and the Your week link.
- **Test approach:** Vitest for every state; Playwright `usage.spec.ts` (plan, tokens only, API, limit reached; never red); axe.
- **Estimate:** 0.5 · **Depends:** L-1.3, P-1.1, ME-1.1 · **Blocked by spike:** none · **Trace event:** — (renders the `ledger.*` state)

---

## R-1 · Rules, including the 10 library safety rules · 3.25 d (plan 1.5) · depends: G-1, G-2, H-1, U-1, P-1.4 · PRD 21.1, 27.8 (Undo on rules) · UC-57

**Constraint contract:**
- No rule auto-approves a limit (FR-066; a property test); rules are exact only (FR-072).
- Library rules are block-only and ship only with their bypass cases (FR-069, NFR-079).
- Your own Claude Code ask / deny wins (NFR-161).
- No export (FR-080); vendor-neutral (FR-082); a corrupt rulebook means limits only (FR-083).
- Undo: every rule on, off, add, edit and delete has a 10-s Undo (FR-070, FR-080, FR-169).
- **+1.75:**
  - +1.25: the 10 Appendix A library rules (G3-7, approved after the plan) are in no story, and the story map puts them here (R-1.8, R-1.9).
  - +0.5: the rulebook tamper restore (FR-047, NFR-062) and the idempotent save with Undo weren't sized.

### R-1.1 · Rulebook schema and model
- **Traces:** FR-072, FR-082, NFR-185
- **Files:** `contracts/rulebook.schema.json`, `crates/eucas-rules/src/rule.rs` (+ `lib.rs` mod line, shared with G-1 / G-2), `crates/eucas-core/src/rulebook/{mod,load}.rs`
- **Acceptance criteria:**
  - Kinds are `auto_approve | block`; a match is a tool, an exact program + args, or an MCP tool name; scope is one folder.
  - `*` and regex are rejected.
  - `schemaVersion` is set; a migration keeps `.bak`; an unknown future version is read-only with a banner.
- **Test approach:** schema tests; `rejects_glob_and_regex`; `no_vendor_fields`; a migration round-trip.
- **Estimate:** 0.25 · **Depends:** G-1 · **Blocked by spike:** none · **Trace event:** `rules.loaded {schema_version}`

### R-1.2 · Compiler → `rulebook.bin`
- **Traces:** FR-066, FR-063, FR-083, NFR-061, NFR-077
- **Files:** `crates/eucas-rules/src/compile.rs`, `crates/eucas-core/src/rulebook/write.rs`
- **Acceptance criteria:**
  - Output is bincode + SHA-256, written atomically, compiled from the active profile.
  - Any allow rule that overlaps a limit (G-2's matchers) is rejected with the reason; only block rules carry a lock flag.
  - Recompiles on a `ProfileSwitched` event (AC-2.4).
- **Test approach:** proptest `no_allow_rule_matches_any_limit_case`; `allow_overlap_rejected_with_reason`; `lock_flag_only_on_block`; a checksum round-trip; `recompiles_on_profile_switch`.
- **Estimate:** 0.25 · **Depends:** R-1.1, G-2 · **Blocked by spike:** none · **Trace event:** `rules.compiled {count, sha}`

### R-1.3 · Dry run, conflicts, runner warning
- **Traces:** FR-071, FR-073, FR-074, NFR-161
- **Files:** `crates/eucas-rules/src/{dry_run,conflicts}.rs`
- **Acceptance criteria:**
  - A dry run over the last 7 days of check events gives a count and the folders.
  - The user's own ask or deny on the same command → "That wins.", and Add is disabled; a rule it covers → "would do nothing".
  - Programs that run other code are never pre-ticked or scoped "everywhere", and carry a warning and a safe form.
- **Test approach:** conflict unit tests; a runner table; a 7-day dry-run fixture.
- **Estimate:** 0.25 · **Depends:** R-1.2, H-1 · **Blocked by spike:** none · **Trace event:** `rules.preview {would_match}`

### R-1.4 · Suggestions and templates
- **Traces:** FR-024, FR-068, FR-163, NFR-061
- **Files:** `crates/eucas-rules/src/suggest.rs`, `crates/eucas-core/src/rules/suggestions.rs`
- **Acceptance criteria:**
  - A manual allow = a no-opinion PreToolUse whose `tool_use_id` then runs after a permission prompt.
  - Allows are counted per exact program + args + folder over 7 days in `suggestion`, never for a limit.
  - 5 templates while you have fewer than 3 rules; the retro (O-1.4) and LY-1.3 call the same function.
- **Test approach:** `rm_rf_212_approvals_no_suggestion`; `counts_by_exact_args_and_folder`; templates compile.
- **Estimate:** 0.25 · **Depends:** R-1.2, H-1 · **Blocked by spike:** none · **Trace event:** `rules.suggested {count}`

### R-1.5 · Save, toggle, delete, counters, Undo
- **Traces:** FR-037, FR-070, FR-071, FR-080, FR-081, FR-169
- **Files:** `crates/eucas-core/src/rulebook/commands.rs`, `crates/eucas-app/src/commands.rs` (`rule_save`, `rule_toggle`, `rule_delete`, `rule_preview`)
- **Acceptance criteria:**
  - Saves are idempotent by `client_key`, written atomically, then recompiled; each change has a 10-s Undo (N-1.4).
  - `rule_counter` increments atomically on check events a rule decided.
  - A locked settings file → "Your settings file is locked by another program. Nothing changed. Retry", and the rule stays on screen.
- **Test approach:** `save_twice_same_key_one_rule`; `counter_on_conflict_increment`; a locked-file test; undo restores.
- **Estimate:** 0.25 · **Depends:** R-1.2, N-1.4 · **Blocked by spike:** none · **Trace event:** `rules.changed {action, source}`

### R-1.6 · The Rules tab
- **Traces:** FR-068, FR-070, FR-062, FR-063, FR-067, FR-080
- **Files:** `apps/companion/src/screens/rules/*`, `src/components/{rule-card,suggested-rule-row,suggested-rule-chip,rule-preview,limits-panel}/*`
- **Acceptance criteria:**
  - The promise and gap line (`fixed.promise`), the lock row, and Limits (no switch; Locked or Not locked).
  - Safety rules: the 10 library rules (R-1.8, R-1.9) with P-1.4's gooey switch and lock glyphs. Switching one on or off shows a 10-s Undo; pressing a locked rule's switch plays the tug and says "Locked rules change with admin. Windows will ask."
  - Your rules with live counters; suggestions with counts; 5 templates; the empty line.
  - Another account's machine locks show "**Locked on this PC**", read-only.
  - No export control exists.
- **Test approach:** Vitest for every component state; Playwright `rules.spec.ts` (suggestion → preview → save → counter → undo; library switch off → undo → on); a text scan for "Export"; axe.
- **Estimate:** 0.5 · **Depends:** R-1.5, R-1.8, P-1.1, P-1.4, AC-2.4 · **Blocked by spike:** none · **Trace event:** —

### R-1.7 · Rulebook tamper watch
- **Traces:** FR-047, NFR-062
- **Files:** `crates/eucas-core/src/rulebook/watch.rs`
- **Acceptance criteria:**
  - A change to `rulebook.json` or `.bin` that the core didn't make is detected, restored to the last version, logged and bannered within 2 s.
  - The core's own writes never trigger it.
- **Test approach:** integration: another process writes the file → restored in ≤ 2 s; own write → no event.
- **Estimate:** 0.25 · **Depends:** R-1.5 · **Blocked by spike:** none · **Trace event:** `rules.tamper_restored`

### R-1.8 · Library rules, git and system family (SRS Appendix A)
- **Traces:** FR-069, NFR-079, NFR-061, FR-063
- **Files:** `crates/eucas-rules/src/library/{mod,force_push_any,discard_work,delete_refs,elevate,disable_safety}.rs`, `tests/contract/bypass/library-{force_push_any,discard_work,delete_refs,elevate,disable_safety}.yaml` (G-5's suite, own files)
- **Acceptance criteria:**
  - Five block rules over the neutral `ToolCall` and G-1's tokenizers: `lib.force_push_any`, `lib.discard_work`, `lib.delete_refs`, `lib.elevate`, `lib.disable_safety`.
  - An unresolved command containing a rule's tokens is denied; the deny message is the hand-back wording naming the rule.
  - On by default, switchable, lockable like any block rule; none can allow anything.
- **Test approach:**
  - The positive cases in bash, PowerShell 5.1 / 7 and cmd, per Appendix A.
  - The negatives: `git push origin feature/x` without force, `git branch -d` on a merged branch.
  - Bypass YAML on the pinned CLI (`guard-contract`); a property test that no library rule produces `allow`.
- **Estimate:** 0.75 · **Depends:** G-2, R-1.2 · **Blocked by spike:** none · **Trace event:** check event `decided_by: lib.<id>` (G-3)

### R-1.9 · Library rules, data and outward family (SRS Appendix A)
- **Traces:** FR-069, NFR-079, NFR-061
- **Files:** `crates/eucas-rules/src/library/{secret_files,remote_script,publish,db_destroy,infra_destroy}.rs`, `tests/contract/bypass/library-{secret_files,remote_script,publish,db_destroy,infra_destroy}.yaml`
- **Acceptance criteria:**
  - Five block rules: `lib.secret_files` (paths through the canonicaliser: 8.3, junctions, `\\?\`, case), `lib.remote_script`, `lib.publish`, `lib.db_destroy`, `lib.infra_destroy`.
  - None overlaps an allow template (a compiler check).
- **Test approach:** the positives in three shells; the negatives (reading `.env.example`, `npm pack`, `terraform plan`); bypass YAML on the pinned CLI.
- **Estimate:** 0.5 · **Depends:** R-1.8 · **Blocked by spike:** none · **Trace event:** check event `decided_by: lib.<id>`

---

## R-2 · Prompted rules · 1.75 d · depends: R-1, AC-2, BU-1, SUP-2.2 · PRD 21.2 · UC-57

**Constraint contract:**
- Only the typed sentence is sent, only on Draft (FR-075, NFR-092).
- A draft is untrusted: re-validated, compiled and limit-checked on the PC (NFR-077).
- Nothing is saved before Add (FR-077); the request body is never logged (NFR-072).

### R-2.1 · Worker `/v1/draft-rule`
- **Traces:** FR-075, FR-078, NFR-092, NFR-111, NFR-072, NFR-097
- **Files:** `apps/api/src/routes/draft-rule.ts`, `apps/api/src/prompts/draft-rule.ts`, `contracts/api/draft-rule-{request,response}.schema.json`
- **Acceptance criteria:**
  - Token required (401); `.strict()`; text ≤ 1,200 chars; a secret re-scan → 422; the drafting schema ≤ 800 tokens.
  - The call is reserved and settled through BU-1; the response is one rule or `422 draft_invalid`; the meter is embedded.
  - The body is never logged; the provider block is on the call.
- **Test approach:** Workers pool: strictness, 401 / 402 / 413 / 422, a schema token-count test, a spy logger, a ZDR-block assertion.
- **Estimate:** 0.5 · **Depends:** BU-1.1, SUP-2.2 · **Blocked by spike:** none · **Trace event:** `api.draft_rule {status}`

### R-2.2 · Core `ruledraft`: client and checks
- **Traces:** FR-075, FR-076, FR-066, NFR-077
- **Files:** `crates/eucas-core/src/ruledraft/{client,validate}.rs`, `crates/eucas-app/src/commands.rs` (`rule_draft_from_text`)
- **Acceptance criteria:**
  - Sends only the text and an `idempotencyKey`, with the token.
  - Re-validates, compiles, and rejects any limit overlap or bypass case it would auto-approve, with the FR-076 reason.
  - Inexact wording → Reword plus the guided form; nothing is saved.
- **Test approach:** `limit_overlap_rejected_reason`, `bypass_case_rejected`, `invalid_schema_rejected`; an e2e proxy capture where the body = the sentence.
- **Estimate:** 0.5 · **Depends:** R-2.1, R-1.2, AC-2.1 · **Blocked by spike:** none · **Trace event:** `rules.draft {outcome}`

### R-2.3 · Describe-a-rule composer and the draft card
- **Traces:** FR-075, FR-077, FR-064
- **Files:** `apps/companion/src/screens/rules/describe-rule.tsx`, `src/components/draft-card/*`
- **Acceptance criteria:**
  - The note reads "This sentence is sent to draft the rule."; the card shows FR-077's fields.
  - Add rule turns the rule on with its counter at 0 and a 10-s Undo; leaving without Add writes nothing.
  - "Lock it too (asks for admin)" calls `update_locked_set` (A-2), in Rules only.
- **Test approach:** Playwright describe → preview → confirm (fake Worker); leaving without Add → no rule; Vitest card states.
- **Estimate:** 0.5 · **Depends:** R-2.2, R-1.6, A-2 · **Blocked by spike:** none · **Trace event:** `rules.changed {source: draft}`

### R-2.4 · Guided exact-rule form
- **Traces:** FR-079, NFR-042
- **Files:** `apps/companion/src/screens/rules/guided-rule-form.tsx`
- **Acceptance criteria:**
  - Offline, server unreachable or the meter at 0 % → "Write it as an exact rule: block / allow · tools · folder", with no model call and the same checks.
  - A rule can still be added.
- **Test approach:** Playwright: meter 0 % → form; offline → form; add works.
- **Estimate:** 0.25 · **Depends:** R-2.3, ME-1.2 · **Blocked by spike:** none · **Trace event:** `rules.draft {outcome: guided}`

---

## P-1 · Panel header, Settings, Protection · 1.5 d (plan 1) · depends: H-1, C-1, AC-2, W-1 · PRD 20.3 (as amended: no export, FD-3 / G3-2), 27.3, 27.4, 18.3 · UC-55, UC-60

**Constraint contract:**
- One status vocabulary (FR-053); one promise string (FR-050).
- No Allow anyway (FR-039); **no log export** (FR-049, NFR-103).
- The switches follow DESIGN §5 (gooey, reduced motion = no stretch).
- Undo: settings changes that FR-169 lists (sounds, thin line) show a 10-s Undo; Quit says what stops.
- **+0.5:**
  - +0.25: the block Why? page and removing `export_log` from the contract weren't in the slice.
  - +0.25: the gooey switch (DESIGN §5.1, 2026-10-26) is new (P-1.4).

### P-1.1 · Panel header and tab shell
- **Traces:** FR-109, FR-065, FR-040, FR-053
- **Files:** `apps/companion/src/surfaces/panel/{header,tabs}.tsx` (uses H-1's `components/heartbeat-line`)
- **Acceptance criteria:**
  - The header shows the avatar (its eyes are one of N-0.2's eight faces, read from the shared `Face` contract; no other face), the name, the Locked / Not locked chip (amber "press to lock" → Rules) and "Protected · 3 sessions · checked 2 s ago".
  - Tabs Usage · Rules · Settings remember the last tab (Usage first); sub-pages have a back arrow; Esc goes back, then closes.
- **Test approach:** Vitest header states; Playwright tab memory and Esc; a bundle string scan: "Guarded" absent.
- **Estimate:** 0.25 · **Depends:** U-1.2, H-1 · **Blocked by spike:** none · **Trace event:** `panel.tab {tab}`

### P-1.2 · Settings shell: Name and look, The notch, Help, Plan, Quit
- **Traces:** FR-174, FR-117, FR-118, FR-188, FR-048, FR-175
- **Files:** `apps/companion/src/screens/settings/{index,name-and-look,the-notch,help,plan}.tsx`, `src/components/euca-editor/*` (reused by O-1.3), `crates/eucas-app/src/commands.rs` (`setting_set`)
- **Acceptance criteria:**
  - The Name and look editor (≤ 16 chars, 9 shapes, 10 colours, live preview) changes the notch.
  - The notch: pill or thin line, sounds mute (N-1.6), theme, and the shortcut toggle (N-0.7).
  - Help has Run the diagnostic (D-1) and the FSL licence; Plan holds W-1.4's ProLine; Quit opens U-1.4's dialog.
  - Mounts W-1.4's Updates and Privacy screens.
- **Test approach:** Vitest editor gating; Playwright rename → store and notch state; a licence-string test.
- **Estimate:** 0.5 · **Depends:** P-1.1, P-1.4, N-0.7, W-1.4 · **Blocked by spike:** none · **Trace event:** `settings.changed {key}`

### P-1.4 · Gooey switch component (DESIGN §5, §5.1)
- **Traces:** FR-070, FR-064, NFR-133, NFR-131, NFR-135
- **Files:** `apps/companion/src/components/switch/{switch.tsx, switch.test.tsx, goo-sm.tsx}` (inline SVG `<filter id="goo-sm">`: `feGaussianBlur stdDeviation 3` → alpha row `0 0 0 20 -9`; ported from `apps/landing/public/styles.css` `.knob`)
- **Acceptance criteria:**
  - The knob is two blobs under `goo-sm`; the trail follows the lead 90 ms late (`--spring-gentle`, 450 ms), so the knob stretches as it slides and settles round.
  - Only `transform` and `opacity` animate, with no infinite animation.
  - A **locked** switch's knob tugs 18 px toward off and snaps back (no shake), and the switch doesn't change.
  - **Reduced motion:** the knob moves without stretching, and the locked state shows no tug, only the message.
  - `role=switch` with `aria-checked`; keyboard Space / Enter; a 32 px target; it reads in forced colours.
- **Test approach:**
  - Vitest every state (on, off, locked, disabled, focus).
  - **Golden images** (Playwright screenshot, clock frozen) at rest, mid-slide and mid-tug against the prototype's switch frames.
  - **Reduced-motion test:** no intermediate stretched frame and no tug translation.
  - axe and a keyboard test.
- **Estimate:** 0.25 · **Depends:** U-1.2 · **Blocked by spike:** none · **Trace event:** — (the caller's `settings.changed` / `rules.changed`)

### P-1.3 · Protection page, the log, What Eucas can't see, a block's Why?
- **Traces:** FR-049, FR-039, FR-050, FR-061, FR-038, FR-170, NFR-103
- **Files:**
  - `apps/companion/src/screens/settings/{protection,why}.tsx` (`why.tsx` is later extended by SUP-1 and LY-1.4, sequenced)
  - `src/components/{log-row,banner,receipt,protection-status-card}/*`
  - `contracts/ipc/commands.schema.json` (drop `export_log`)
- **Acceptance criteria:**
  - The status card shows the state sentence, the verified version, Locked / Not locked and Run the test again; one row per session.
  - The log has filters and no export; the capability set has no `export_log`.
  - What Eucas can't see shows the gap line, the bypass-table link and the tripwire gaps.
  - A block's Why? shows what Pip saw, the rule, the decision, the receipt (the one `receipt` component), "run it yourself" and Copy command; no Allow anyway.
- **Test approach:** Playwright `block-receipt.spec.ts` (the driver plays a deny → log row → Why? → Copy command; no allow control); a capability test (no export command); a test that the promise is one constant.
- **Estimate:** 0.5 · **Depends:** P-1.1, H-1, C-1 · **Blocked by spike:** none · **Trace event:** `log.why_opened {kind}`

---

## O-1 · Setup · 3.25 d (plan 3) · depends: A-1, A-2, C-1, R-1, L-1, AC-2, N-0, SUP-1, P-1.2 · PRD 24.1, 19.7, 27.4, 27.6, 27.11, 28.2 · UC-54

**Constraint contract:**
- One UAC prompt (FR-012); nothing written before step 4 (FR-015).
- Never "Protected" after edge J (FR-018).
- The limits block with no account and no network (NFR-033).
- ~~No "Sign in later" (FR-020).~~ **Revised 2026-10-26 (founder: "we make people have a small taste without sign up and then they have to create account or buy pro"):** step 6 offers a secondary **Continue without an account**, online or offline, then step 8 (What is sent) and a no-account step 9 with the flight (NA-1.3). Step 7 is skipped on that path, and nothing is sent during setup.
- Never the unredacted original (FR-027).
- **+0.25:** the step-1 edges (Smart App Control, organisation policy, two installs) and the never-signed-in path are more than the slice assumed.

### O-1.1 · Setup flow, persistence, resume, Back
- **Traces:** FR-001, FR-030, FR-031, NFR-040
- **Files:** `apps/companion/src/surfaces/setup-window/{flow.tsx,steps.ts}`, `crates/eucas-core/src/installer/setup_state.rs`, `crates/eucas-app/src/commands.rs` (`setup_*`)
- **Acceptance criteria:**
  - "Step n of 9"; the step is persisted in `setting`.
  - Resume follows FR-030: steps 2–3 keep the name and look; from step 4, the first step not done; signed in stays signed in.
  - Back shows only on steps 2–4, 6 and 7, and never undoes the lock.
- **Test approach:** a kill-at-each-step integration test; Playwright: kill after step 5 → relaunch at step 6.
- **Estimate:** 0.5 · **Depends:** U-1.1, U-1.5 · **Blocked by spike:** none · **Trace event:** `setup.step {n, result}`

### O-1.2 · Step 1: detection and its edges
- **Traces:** FR-002, FR-003, FR-004, FR-005, FR-006, NFR-012, NFR-046
- **Files:** `crates/eucas-core/src/installer/detect.rs`, `apps/companion/src/surfaces/setup-window/step-1-find.tsx`
- **Acceptance criteria:**
  - The checklist takes ≤ 3 s: installs by image path with a version per host, hooks, the status line, and 7-day counts only.
  - Smart App Control 1 or 2 → the U screen, with nothing written.
  - Missing or old CLI (A1), two installs (C), organisation policy (D).
- **Test approach:** the SAC table (G-4's `smart_app_control.rs`); fixtures per edge; Playwright edges A–D and U; a DB scan for prompt text.
- **Estimate:** 0.5 · **Depends:** O-1.1, G-4, C-1 · **Blocked by spike:** none · **Trace event:** `setup.detected {installs, sac}`

### O-1.3 · Step 2: Make your Euca
- **Traces:** FR-007, FR-174
- **Files:** `apps/companion/src/surfaces/setup-window/step-2-make.tsx` (P-1.2's `euca-editor`; a DOM mini-notch preview)
- **Acceptance criteria:**
  - Name suggestions; Continue is disabled with the hint for whichever is missing; the birth blink plays (Closed → Calm; the avatar's eyes use only N-0.2's eight faces).
  - The name and look persist for resume.
- **Test approach:** a Vitest gating table; a Playwright screenshot against `setup-2-create-born-d.png`.
- **Estimate:** 0.25 · **Depends:** O-1.1, P-1.2 · **Blocked by spike:** none · **Trace event:** `setup.euca_made`

### O-1.4 · Step 3: the retro
- **Traces:** FR-008, FR-009, FR-024, NFR-012
- **Files:** `crates/eucas-core/src/transcripts/retro.rs`, `apps/companion/src/surfaces/setup-window/step-3-week.tsx`
- **Acceptance criteria:**
  - Built while step 2 runs; 4 cards stream, the first ≤ 5 s, all ≤ 30 s on 500 MB.
  - Thin history → the starter rules; you can skip to step 4; no prompt text is stored.
  - Suggestions come through R-1.4 and are never for a limit.
- **Test approach:** the nightly 500 MB corpus perf test; card-builder unit tests; a DB scan.
- **Estimate:** 0.5 · **Depends:** O-1.1, H-1, R-1.4 · **Blocked by spike:** none · **Trace event:** `setup.retro {cards, ms}`

### O-1.5 · Steps 4–5: lock and test
- **Traces:** FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-018, FR-019, NFR-033, NFR-041
- **Files:** `apps/companion/src/surfaces/setup-window/{step-4-lock,step-5-test}.tsx`, `crates/eucas-core/src/installer/plan.rs`
- **Acceptance criteria:**
  - Four rows, all ticked, with no off switch; unticking one → Not locked.
  - The pinned-hash check runs before the single UAC prompt; edges H (declined), I (rollback, red line, Retry / diagnostic), J (stop) and K (amber).
  - The plugin is installed with an empty rulebook; the canary receipt "Blocked by Pip · 0.3 s · logged" plays the Done sound.
  - **Never signed in, network off: the test push is blocked.**
- **Test approach:** Playwright edges H, I, J, K with a fake UAC; UAC prompts counted = 1 (0 if all unticked); a network-off e2e.
- **Estimate:** 0.5 · **Depends:** O-1.1, A-1, G-4, C-1 · **Blocked by spike:** none · **Trace event:** `setup.locked {locked, declined}`, `setup.test {result}`

### O-1.6 · Steps 6–7: sign in and choose your rules
- **Traces:** FR-020, FR-021, FR-022, FR-023, FR-025, NFR-043
- **Files:** `apps/companion/src/surfaces/setup-window/{step-6-signin,step-7-rules}.tsx` (AC-2.2's `SignInStep`; R-1.6 rows; R-2.3's draft card with no Lock it too)
- **Acceptance criteria:**
  - ~~There is no Sign in later. Offline, the wait copy shows (locked or declined variant) with Retry and Back, and the tray shows words; closing keeps the guard, and reopening returns to sign-in.~~ **Revised 2026-10-26:** sign in is the primary; **Continue without an account** is the secondary, online and offline (built in NA-1.3), so offline no longer waits (supersedes the "setup waits" part of BRD #65 (a)). Offline, sign-in shows Retry next to it; the tray's Protected / Not protected line from #65 stays. Closing the window at step 6 keeps the guard, and reopening returns to step 6.
  - Step 7: the limits are read-only and library switches are on (except "Ask before installing packages"); suggestions and Add your own; the primary reads "Continue · n rules".
  - Rules are written at user scope with the Not locked hint; drafts draw on the `pending` allowance.
- **Test approach:** Playwright offline at step 6 (a push to the default branch is still blocked; the tray tooltip reads Protected; sign-in shows Retry, never a dead end); step 7 writes user scope only and raises no second UAC; BU-1's pending-allowance Worker test.
- **Estimate:** 0.5 · **Depends:** O-1.5, AC-2.2, R-1.6, R-2.3 · **Blocked by spike:** none · **Trace event:** `setup.signin {result}`, `setup.rules {count}`

### O-1.7 · Steps 8–9 and finish
- **Traces:** FR-026, FR-027, FR-028, FR-029, FR-138, NFR-095
- **Files:** `apps/companion/src/surfaces/setup-window/{step-8-sent,step-9-watching}.tsx` (SUP-1's payload builder and `what-is-sent`), `crates/eucas-app/src/commands.rs` (`setup_finish`)
- **Acceptance criteria:**
  - Step 8's lede is the **approved privacy line**, the `fixed.privacy` constant (FR-138, DESIGN §7.1: "When Pip isn't sure, … how much supervisor help you've used."). The stale "…your email and your plan." in setup-flow step 8 (SRS B-1) is not used.
  - Step 8 shows your last session redacted on the PC, with in-place tags and the footer; **Sample** when there's none or redaction fails; no toggle; never the original.
  - Step 9: each session's word, the restart line, the heartbeat and the honest zero.
  - Send Pip to the top → the window destroyed, the flight (a crossfade with reduced motion), the Done sound, and the coach mark once. ~~`trial/start` once~~: **pending founder answer (b)**, the trial starts at sign-up (NA-1.7), not here; if (b) is answered "at the end of setup", this call comes back and NA-1.7 is dropped.
- **Test approach:** Playwright: the fixture's secret is absent from the DOM; no `trial/start` call from step 9 (fake Worker; under (b)); the coach mark never shows twice.
- **Estimate:** 0.5 · **Depends:** O-1.6, SUP-1, N-0.4, AC-2.1 · **Blocked by spike:** none · **Trace event:** `setup.finished {seconds}`

---

## W-1 · Worker v0.1 · 1.75 d (plan 1.5) · depends: S1-1, U-1 · PRD 18.3 · UC-58, UC-62

**Constraint contract:**
- Strict bodies; no `console.log`; error logs carry route, status and request id only (NFR-072).
- Config is Ed25519-signed with anti-rollback (NFR-065).
- Always-on calls carry only version, channel, OS / arch and the bucket (FR-184, NFR-090).
- Telemetry is off by default (NFR-098).
- **+0.25:** the config signing tool with its eval-score gate wasn't sized.

### W-1.1 · Worker scaffold
- **Traces:** NFR-072, NFR-117, NFR-180
- **Files:** `apps/api/{package.json, wrangler.toml, tsconfig.json, vitest.config.ts, src/index.ts, src/http/{strict,errors,log}.ts}` (+ an `apps/api` override in `eslint.config.js`, after S1-1)
- **Acceptance criteria:**
  - Hono with the staging and production envs.
  - Strict zod middleware → 400 on an unknown key; one error envelope; the logger takes only `{route, status, requestId}`.
  - The Workers-pool tests run in the `ts` job; the bundle is < 1 MB.
- **Test approach:** Workers pool `unknown_key_400`; a spy logger.
- **Estimate:** 0.25 · **Depends:** S1-1 · **Blocked by spike:** none · **Trace event:** `api.request {route, status}`

### W-1.2 · `/v1/config` and `/v1/updates`
- **Traces:** NFR-065, NFR-049, NFR-187, FR-182, FR-184
- **Files:** `apps/api/src/routes/{config,updates}.ts`, `contracts/api/runtime-config.schema.json`
- **Acceptance criteria:**
  - Config is served from KV as signed; an unknown channel → 404.
  - The updates route proxies the GitHub manifest and returns 204 when paused; the rollout bucket header picks the 10 % stage.
  - Only the FR-184 headers are read.
- **Test approach:** Workers pool: paused → 204; bucket 0 vs 9 at the 10 % stage; schema strictness.
- **Estimate:** 0.5 · **Depends:** W-1.1 · **Blocked by spike:** none · **Trace event:** `api.updates {channel, served}`

### W-1.3 · Config signing tool and the app's config client
- **Traces:** NFR-065, NFR-042, NFR-049, FR-184
- **Files:** `xtask/src/config/{sign,push}.rs`, `crates/eucas-core/src/config/{client,verify}.rs` (**C-1 adds the verified list in this folder**, separate files), `crates/eucas-core/src/retry.rs` (the one helper, if not yet there), `config/runtime-config.default.json`, `config/history/`
- **Acceptance criteria:**
  - `xtask config sign` uses the offline key and refuses without a current `evalScore`; push runs after a schema check.
  - The app rejects a bad signature, a lower version or an unknown major version; it keeps the last good config 7 days, then the supervisor turns off; it re-fetches every 15 min, with the bundled default offline.
- **Test approach:** unit tests for a bad signature, a rollback and the 7-day expiry; the staging smoke in R1.4.
- **Estimate:** 0.5 · **Depends:** W-1.2 · **Blocked by spike:** SP-SUP2 (acceptance: the production config can't be signed until the eval score exists) · **Trace event:** `config.applied {version}`, `config.rejected {reason}`

### W-1.4 · Waitlist, telemetry, ProLine, Settings › Updates and Privacy
- **Traces:** FR-175, FR-176, FR-184, NFR-098, NFR-090
- **Files:**
  - `apps/api/src/routes/{waitlist,telemetry}.ts`, `contracts/api/{waitlist,telemetry}.schema.json`
  - `apps/companion/src/components/pro-line/*`, `src/screens/settings/{updates,privacy}.tsx` (mounted by P-1.2)
  - `crates/eucas-core/src/waitlist.rs` (`waitlist_join` / `waitlist_dismiss`)
- **Acceptance criteria:**
  - Get notified sends only `{moment, installHash}`.
  - The line shows at most once a week per moment and one a day, never on safety, a worst moment, a notification or setup; Not interested hides it for good.
  - Telemetry is asked once, off by default, counts only, with no token; Updates shows the channel and a failed update.
  - With no account there is no ProLine, no waitlist call and no telemetry (NA-1.1 routes this client through the gate).
- **Test approach:** Workers-pool schema tests; Vitest ProLine frequency rules; an e2e network capture.
- **Estimate:** 0.5 · **Depends:** W-1.2, U-1.2 · **Blocked by spike:** none · **Trace event:** `waitlist.joined {moment}`, `telemetry.sent`

---

## AC-1 · Accounts on the Worker · 1.75 d · depends: W-1, SP-AC1, P9 · PRD 28.1 · UC-65, UC-66

**Constraint contract:**
- The server keeps only the ADR-0017 fields (FR-153, NFR-096).
- Codes are HMAC-stored and constant-time compared, with no enumeration (NFR-071).
- Tokens expire (NFR-070); migrations are additive (NFR-186).

### AC-1.1 · D1 schema, migrations, the cleanup cron
- **Traces:** FR-153, NFR-096, NFR-186
- **Files:** `apps/api/src/db/migrations/0001_accounts.sql`, `apps/api/src/db/{account,codes}.ts`, `wrangler.toml` (D1 binding, hourly cron)
- **Acceptance criteria:**
  - The tables are exactly ADR-0017's; there is no IP, user agent or device column.
  - The hourly cron deletes expired codes; a migration lint enforces additive changes.
- **Test approach:** Workers pool: a column allow-list test; a cron test.
- **Estimate:** 0.25 · **Depends:** W-1.1 · **Blocked by spike:** none · **Trace event:** `api.cron {deleted}`

### AC-1.2 · `/v1/auth/start` and `/v1/auth/verify`
- **Traces:** FR-146, FR-148, FR-149, FR-151, NFR-071, NFR-102
- **Files:** `apps/api/src/routes/auth.ts`, `apps/api/src/auth/codes.ts`, `contracts/api/auth-{start,verify}.schema.json`
- **Acceptance criteria:**
  - A CSPRNG 6-digit code, stored as an HMAC, lasting 10 min, dead on the 6th wrong try, compared in constant time.
  - Known and unknown emails get identical responses; 3 codes / email / h, 10 / IP / h and the global daily cap apply.
  - `newsOptIn: false` never clears an earlier consent; an existing account keeps its plan.
- **Test approach:** the TESTING §8 auth rows, with a fake `EmailSender`.
- **Estimate:** 0.5 · **Depends:** AC-1.1 · **Blocked by spike:** none · **Trace event:** `api.auth {route, status}`

### AC-1.3 · Tokens, refresh, sign out, account, delete, trial start
- **Traces:** FR-144, FR-145, FR-154, FR-158, NFR-070, NFR-099
- **Files:** `apps/api/src/auth/tokens.ts`, `apps/api/src/routes/{account,trial}.ts`, `contracts/api/{auth-refresh,account}.schema.json`
- **Acceptance criteria:**
  - `v1.` HMAC tokens: access 1 h, refresh 60 days; sign-out bumps the epoch; refresh fails after a sign-out or a delete.
  - `DELETE` is one statement that keeps `trial_claim`.
  - `trial/start` is idempotent and once per normalised email (`+tags`, gmail dots).
- **Test approach:** TESTING §8; `a.b+x@gmail.com` after `ab@gmail.com` → no trial; delete → refresh 401.
- **Estimate:** 0.5 · **Depends:** AC-1.2 · **Blocked by spike:** none · **Trace event:** `api.account {route, status}`

### AC-1.4 · `EmailSender`: Cloudflare Email Service and Resend
- **Traces:** FR-160, NFR-015
- **Files:** `apps/api/src/email/{sender,cloudflare,resend}.ts`, `apps/api/src/email/templates/*.ts`
- **Acceptance criteria:**
  - One interface with two implementations, chosen by signed config `email.provider`.
  - Templates: the code, trial ending, plan change; product news only with `news_opt_in`, with an unsubscribe link.
  - Nothing else goes to the provider.
- **Test approach:** unit tests with fake bindings; a template audit test; SP-AC1's inbox results set the default provider.
- **Estimate:** 0.25 · **Depends:** AC-1.2 · **Blocked by spike:** **SP-AC1** · **Trace event:** `api.email {provider, status}`

### AC-1.5 · Disposable-domain refusal
- **Traces:** FR-150, NFR-071, NFR-117, NFR-202
- **Files:** `apps/api/src/generated/disposable-domains.ts`, `apps/api/src/auth/disposable.ts`, `apps/api/scripts/gen-disposable.mjs`, `config/disposable-allow.txt`, `.github/workflows/disposable-domains.yml`
- **Acceptance criteria:**
  - The domain and every parent are matched, case-folded, after IDNA; the allowlist overrides.
  - Gmail, Outlook and iCloud pass.
  - A weekly PR carries the upstream SHA and never auto-merges.
- **Test approach:** the TESTING §8 disposable rows; the generated module is sorted and deduped.
- **Estimate:** 0.25 · **Depends:** AC-1.2 · **Blocked by spike:** none · **Trace event:** `api.auth {status: 422}`

---

## AC-2 · Accounts in the app · 2.25 d · depends: AC-1, H-1, U-1 · PRD 28.2, 28.3, 28.4 · UC-65

**Constraint contract:**
- Tokens live in DPAPI only, never in the DB, logs or renderer (NFR-070); the guard never links the account (FR-054).
- ~~Signed out, the panel shows only sign-in and protection is unchanged (FR-155, NFR-041).~~ **Revised 2026-10-26:** the full panel is account-only now. Signed out (or account deleted) = the **no-account state**: the four limits, the tripwire and the install's supervisor taste, with the minimal notch and panel and the tray fallback; protection is unchanged (FR-155, NFR-041). Built in NA-1.5.
- **Profile isolation is a mandatory test** (NFR-100).
- **SRS App. B B-2, confirmed (tech lead):** follow the approved design and FR-159: you **can't sign out or delete while offline**; local tokens are kept and nothing changes. SYSTEM-DESIGN §5.9's "deletes the local tokens anyway, retries later" is superseded (owner: tech lead, in the Gate 6 docs pass).
  - Why: a local-only sign-out would leave the server epoch unbumped, so the refresh token stays valid. It would also show "Signed out" while the account still works elsewhere, and the approved copy can't say that honestly.

### AC-2.1 · Account client and DPAPI tokens
- **Traces:** FR-054, FR-154, NFR-070
- **Files:** `crates/eucas-core/src/account/{client,tokens,meter}.rs`, `crates/eucas-platform/src/windows/dpapi.rs` (SUP-1 reuses it for the sent log)
- **Acceptance criteria:**
  - Client calls: start, verify, refresh, sign out, account, delete.
  - Tokens are `CryptProtectData` blobs in `account\`; refresh at < 5 min left through the retry helper; a 401 after refresh → signed out.
  - The last known plan and meter hold for 7 days.
- **Test approach:** a DPAPI round-trip (Windows); a `token_never_in_db_or_log` scan; refresh timing; 401 → signed-out state; check-deps (the guard doesn't link `account`).
- **Estimate:** 0.5 · **Depends:** AC-1.3, U-1.2 · **Blocked by spike:** none · **Trace event:** `account.state {signed_in}`

### AC-2.2 · `SignInStep` ~~and the signed-out panel~~
- **Traces:** FR-146, FR-147, FR-148, FR-149, FR-150, FR-155, FR-161
- **Files:** `apps/companion/src/components/sign-in-step/*`, ~~`src/surfaces/panel/signed-out.tsx`~~, commands `account_start` / `account_verify`
- **Acceptance criteria:**
  - The email screen copy and the unticked product-news box.
  - The code: the 6th digit or a paste submits; a 30-s resend countdown; the wrong, expired, disposable and too-many-tries states.
  - No password field anywhere.
  - `SignInStep` is one component used by setup step 6 and by sign-up later from the tray (NA-1.4).
  - ~~Signed out, the panel shows only sign-in with the guarding lines~~ (revised 2026-10-26: signed out = the no-account state, NA-1.5); nothing account-related reaches the notch, the peek or a sound.
- **Test approach:** Vitest for every state; Playwright sign in / wrong code / resend / disposable (fake Worker); a UI scan for password inputs. (The effort freed by dropping the signed-out panel goes to the shared-use case; the estimate is unchanged.)
- **Estimate:** 0.5 · **Depends:** AC-2.1 · **Blocked by spike:** none · **Trace event:** `account.signin {result}`

### AC-2.3 · Settings › Account, sign out, delete
- **Traces:** FR-156, FR-157, FR-158, FR-159, NFR-099
- **Files:** `apps/companion/src/screens/settings/account.tsx`, commands `account_sign_out` / `account_delete`
- **Acceptance criteria:**
  - The email, the "Holds only…" line and the plan card.
  - Sign out lists what keeps working first, then "Signed out. Pip keeps guarding.", with no Undo. **Open (UX):** the "what keeps working" list must now say what no account keeps (the four limits, the tripwire, machine-locked rules, the install's supervisor taste); the copy is not changed here until UX supplies it.
  - Delete shows what is removed, the Pro line, the trial-claim note and "Delete account · can't be taken back".
  - After a successful sign out or delete, the app enters the no-account state (NA-1.5 does the switch).
  - Offline: Sign out and Delete change nothing. The tokens stay, no server call is queued, and the page says "Can't sign out or delete while offline. Your account is unchanged." / "Couldn't reach the Eucas server, so nothing was deleted. Try again" (B-2).
- **Test approach:** Playwright sign out / delete (the server row is gone, `trial_claim` kept, rules still enforced); offline sign-out and delete → tokens byte-equal before and after, no retry queued, the exact copy.
- **Estimate:** 0.5 · **Depends:** AC-2.2, ME-1.2 · **Blocked by spike:** none · **Trace event:** `account.signed_out`, `account.deleted {result}`

### AC-2.4 · Per-account profiles
- **Traces:** FR-152, FR-168, NFR-100, NFR-041
- **Files:** `crates/eucas-core/src/account/profiles.rs`, `crates/eucas-core/src/store/open.rs`, `apps/companion/src/components/sign-in-step/different-account.tsx`
- **Acceptance criteria:**
  - `profiles\<sha256(account id)>\{eucas.db, rulebook.json}`.
  - The first account adopts the pre-sign-in data (the Euca, the lock choices), including a Euca made in a no-account setup, however long ago (**assumption** from the 2026-10-26 brief, flagged for the founder); a different account is warned before a code is sent and gets a fresh profile.
  - A switch swaps the DB and emits `ProfileSwitched` (R-1.2 recompiles); the limits and managed locks never drop.
- **Test approach:**
  - **The isolation e2e**: A adds a rule and a learned item; B sees none of it and the limits still block; A signs back in and its data is back.
  - An integration watcher asserts `rulebook.bin` is never missing during a switch.
  - A unit test on the folder name.
- **Estimate:** 0.75 · **Depends:** AC-2.1, H-1 · **Blocked by spike:** none · **Trace event:** `account.profile_switched {fresh}`

---

## BU-1 · The budget on the Worker · 1 d · depends: AC-1, W-1.3 · PRD 27.5, 27.6, 28.4 · UC-66, UC-63

**Constraint contract:**
- `used + reserved` never exceeds the cap (NFR-044).
- No money or count in any response (FR-140, NFR-115).
- ≤ 3 D1 writes per call (NFR-114); caps live in signed config.

### BU-1.1 · Periods, reserve, settle, the daily breaker
- **Traces:** FR-025, FR-143, FR-144, NFR-044, NFR-110, NFR-112, NFR-114
- **Files:** `apps/api/src/budget/{ledger,periods,breaker}.ts`
- **Acceptance criteria:**
  - Lazy rollover pending → trial → taste / pro; a spent trial stays empty until day 14.
  - A conditional `UPDATE` reserves, else `402 budget_empty`; settle runs in `waitUntil` with `usage.cost` or the max.
  - The `spend_day` breaker is $10 from config.
- **Test approach:** 50 parallel calls never overspend; rollover; `trial/start` twice = one trial; a deleted account's calls fail; the breaker trips.
- **Estimate:** 0.5 · **Depends:** AC-1.3, W-1.3 · **Blocked by spike:** SP-SUP2 (acceptance: the cap values) · **Trace event:** `api.budget {outcome}`

### BU-1.2 · Prompt cap and `/v1/meter`
- **Traces:** FR-139, FR-140, NFR-111, NFR-115
- **Files:** `apps/api/src/budget/{prompt-cap,meter}.ts`, `apps/api/src/routes/meter.ts`, `contracts/api/meter.schema.json`
- **Acceptance criteria:**
  - Tokens are estimated as `ceil(bytes / 3)`; guidance is trimmed lowest priority first (ids kept), else 413.
  - The meter is `{period, percentLeft (int, floor), resetsAt}`, with an embed helper for model responses.
- **Test approach:** Workers pool; a key scan of every app-facing schema for `usd`, `cost`, `price`, `count`.
- **Estimate:** 0.5 · **Depends:** BU-1.1 · **Blocked by spike:** SP-SUP2 (acceptance: `promptTokenCap`) · **Trace event:** `api.meter {status}`

---

## ME-1 · Supervisor meter · 0.5 d · depends: BU-1, AC-2 · PRD 27.5, 27.6 · UC-66

**Constraint contract:**
- Never a dollar or a count in the meter (FR-140).
- The meter running out never raises an item, a marker or a toast (FR-142).
- `role=meter` (NFR-132).

### ME-1.1 · `SupervisorMeter` in every state
- **Traces:** FR-139, FR-140, FR-141, FR-142, NFR-115, NFR-132
- **Files:** `apps/companion/src/components/supervisor-meter/*`
- **Acceptance criteria:**
  - A percent and a bar in the Euca's colour, the reset or trial-end date, and the value line.
  - The states: trial, trial ended, taste, low, empty (the bold line, "Your rules and protection don't change.", the one Pro line), unreachable, Pro.
  - `role=meter`; a What is sent link.
  - **Flag:** FR-142's Pro line contains "$20", which NFR-115's "no `$` in the panel" scan would catch, so the scan allows `$` only in the `pro.line.meter_empty` key.
- **Test approach:** Vitest for every state; a text scan with that one exception.
- **Estimate:** 0.25 · **Depends:** BU-1.2 (schema) · **Blocked by spike:** none · **Trace event:** —

### ME-1.2 · `PlanCard` and meter refresh
- **Traces:** FR-091, FR-139, FR-156, NFR-042
- **Files:** `apps/companion/src/components/plan-card/*`, `crates/eucas-core/src/account/meter.rs`, command `meter_get`
- **Acceptance criteria:**
  - PlanCard shows Free trial / Free / Pro / Founders' price.
  - The meter updates from every model response's embedded meter and from a GET on panel open (newer wins); unreachable after a failed fetch.
- **Test approach:** Vitest PlanCard states; a unit test on the meter merge.
- **Estimate:** 0.25 · **Depends:** ME-1.1, AC-2.1 · **Blocked by spike:** none · **Trace event:** `meter.updated {period}`

---

## SUP-2 · `/v1/supervise` · 1 d · depends: BU-1 · PRD 25.3, 27.5 · UC-63

**Constraint contract:**
- Every provider call carries ZDR (NFR-097).
- The response schema has no allow variant (NFR-076).
- The secret re-scan runs before any model call (NFR-091).
- Behind `killSwitches.supervisor` (FR-128).

### SUP-2.1 · The route: auth, strictness, re-scan, cap, reserve, kill switch
- **Traces:** FR-128, FR-129, FR-133, NFR-049, NFR-072, NFR-073, NFR-091
- **Files:** `apps/api/src/routes/supervise.ts`, `apps/api/src/scan/secrets.ts`, `apps/api/src/prompts/supervise.ts`, `contracts/api/supervise-{request,response}.schema.json`
- **Acceptance criteria:**
  - Token; strict ≤ 8 KiB; message ≤ 1,200; a secret or code-fence match → `422 secret_detected`.
  - The prompt has a per-request random boundary; cap → 413; reserve → 402.
  - Kill switch → `503 supervisor_off`; 30 / min per account and 120 / min per IP → 429.
- **Test approach:** the 400 / 401 / 402 / 413 / 422 / 429 / 503 paths; a spy logger.
- **Estimate:** 0.5 · **Depends:** BU-1.2 · **Blocked by spike:** SP-SUP2 (acceptance: real prompt sizes; the switch stays on until it passes) · **Trace event:** `api.supervise {status}`

### SUP-2.2 · Model chain, ZDR, output validation, settle, idempotency
- **Traces:** FR-130, FR-132, NFR-014, NFR-076, NFR-097
- **Files:** `apps/api/src/providers/openrouter.ts`, `apps/api/src/supervise/{chain,validate,idempotency}.ts`
- **Acceptance criteria:**
  - The chain follows config: attempt budgets 1.3 / 1.4 / 1.0 s, deadline 2.8 s; the provider block is on every call.
  - Output must be the enum decision, a `rule_id` among those sent and text ≤ 280, else `ask_user`.
  - Settle runs; a repeated key within 60 s returns the stored outcome.
- **Test approach:** a contract test that every call path has `zdr` and `data_collection: "deny"`; mocked timeouts → fallback → `ask_user`; invalid JSON → `ask_user`; the schema has no allow.
- **Estimate:** 0.5 · **Depends:** SUP-2.1 · **Blocked by spike:** SP-SUP2 (acceptance: the model choice) · **Trace event:** `api.supervise {model, attempt, decision}`

---

## R1 · Release · 1.75 d · depends: U-1, W-1 (+ AC-1 for the Worker workflow) · PRD 18.4, 26.2 · UC-54

**Constraint contract:**
- Per-user install, no admin, < 20 MB (NFR-021).
- Updates only with the Ed25519 signature (NFR-064); SBOM and provenance (NFR-075).
- Stable needs approval and is staged (NFR-187); no Authenticode in v0.1.

### R1.1 · NSIS per-user installer
- **Traces:** FR-001, FR-187, NFR-021, NFR-150
- **Files:** `installer/{eucas.nsi,hooks.nsh}`, `crates/eucas-app/tauri.conf.json` (bundle)
- **Acceptance criteria:**
  - No admin, < 20 MB, installs in < 10 s; a Start-menu shortcut carries Eucas's AUMID.
  - The OS check passes Windows 10 22H2 and 11 22H2+ x64 only; otherwise it stops with a reason and writes nothing.
  - The uninstaller calls `Eucas.exe --remove`.
- **Test approach:** install and uninstall on a clean runner; an OS-version table unit test; the size gate.
- **Estimate:** 0.5 · **Depends:** U-1.4 · **Blocked by spike:** none · **Trace event:** `installer.run {result}`

### R1.2 · Updater and channels
- **Traces:** FR-182, NFR-022, NFR-045, NFR-064
- **Files:** `crates/eucas-core/src/updates/*`, `crates/eucas-app/tauri.conf.json` (pubkey)
- **Acceptance criteria:**
  - A pinned Ed25519 key; stable / beta from Settings; the bucket header.
  - Downloads in the background and installs on quit or when no session runs, then hands off to G-4's plugin update.
  - A failure keeps the old version and shows in Settings › Updates.
- **Test approach:** a tampered manifest and an older version are refused; a unit test on the "no session running" gate.
- **Estimate:** 0.25 · **Depends:** R1.1, W-1.2 · **Blocked by spike:** none · **Trace event:** `update.state {phase, result}`

### R1.3 · `release.yml`
- **Traces:** FR-032, NFR-064, NFR-074, NFR-075, NFR-187
- **Files:** `.github/workflows/release.yml`, `xtask/src/release/*`
- **Acceptance criteria:**
  - Build order with the embedded hashes; updater signing in `production` only; `SHA256SUMS`, the merged SBOM and provenance.
  - Beta prerelease from `staging`; stable from `main` with approval; the Worker channel pointer is updated.
  - The verify job on a clean runner checks the hash and signature, installs, runs the headless first-run e2e, uninstalls and checks the restore; `signCommand` is empty.
- **Test approach:** the verify job itself; a dry run on a test branch.
- **Estimate:** 0.75 · **Depends:** R1.1, R1.2 · **Blocked by spike:** SP-SUP2 (acceptance: stable release only, G3-1) · **Trace event:** — (the GitHub release record)

### R1.4 · `deploy-api.yml`
- **Traces:** NFR-180, NFR-186
- **Files:** `.github/workflows/deploy-api.yml`
- **Acceptance criteria:**
  - PR: tests, migrations listed, a dry-run deploy, bundle < 1 MB.
  - A push to `staging` applies the migrations, deploys and smokes: the config signature, 401 / 400 / 422, a code to the staging inbox, a disposable domain → 422.
  - Production needs approval and keeps the previous version for rollback.
- **Test approach:** the smoke itself.
- **Estimate:** 0.25 · **Depends:** W-1.1, AC-1.1 · **Blocked by spike:** SP-AC1 (acceptance: the staging code-send smoke) · **Trace event:** —

---

## LY-1 · Learns you · 3.0 d (indicative 2–3) · depends: R-1, N-1, SUP-1, AC-2, P-1, L-1, N-0 · PRD 27.7, 27.8 ("That was wrong"), 27.9 (calm and worst moments) · UC-67, UC-60

**Scope:** what N-1, R-1 and SUP-1 don't cover from SRS §2.12 and the CR-011 §7 features:
- What Pip knows, the learned items, the live suggestion, the learned line, Applied and That was wrong;
- the monthly line; the calm moments (caught up, away, back to normal); the undo audit and the worst-moment banners (27.9).

What lives elsewhere: the sounds (27.10) are N-1.6 (story map), Undo itself is N-1.4, rule suggestions are counted in R-1.4, and the supervisor's receipts and Why? are SUP-1. **The learns-you core (LY-1.1–LY-1.6) is 2.25 d; the moments and the undo audit add 0.75 d.**

**Constraint contract:**
- Learns only from structured events, never answer text or file contents (FR-162, FR-168, G3-3).
- Per profile, never synced (NFR-100); no Export and no Open the folder (NFR-103).
- Learning never touches a limit (FR-163, NFR-061); nothing opens by itself (NFR-136).
- A suggestion isn't counted on the notch and plays no sound.
- Undo: Forget, Forget everything, That was wrong and Keep asking each have a 10-s Undo (FR-169).
- Verified by: a DB scan, the isolation e2e, a text scan, Playwright.

### LY-1.1 · `learned_item` store and the learner
- **Traces:** FR-162, FR-168, NFR-093, NFR-100
- **Files:** `crates/eucas-core/src/learn/{mod,item,learner}.rs`, `crates/eucas-core/src/store/migrations/00NN_learned_item.sql`, `contracts/ipc/state.schema.json` (`LearnedItem`)
- **Acceptance criteria:**
  - Kinds: allowed / denied / answered, each with a structured key (program + args + folder, or a guidance-rule id), source dates, counts, a use count and `applied_at`.
  - No free-text column exists.
  - The learning switch is on by default; off → nothing is learned; Forget, Forget everything and Clear history delete.
- **Test approach:** `learning_off_learns_nothing`, `forget_removes`; a migration test (no text column); a DB scan over a fixture week; two-profile isolation.
- **Estimate:** 0.5 · **Depends:** AC-2.4, R-1.4 · **Blocked by spike:** none · **Trace event:** `learn.item {kind, action}`

### LY-1.2 · A structured "you denied" signal
- **Traces:** FR-162, FR-168
- **Files:** `crates/eucas-core/src/learn/deny_signal.rs`, `tests/contract/deny_signal.rs` (G-5's crate, own file)
- **Acceptance criteria:**
  - "Denied" comes only from metadata: a permission prompt for the `tool_use_id`, no PostToolUse, the tool_result error flag. Message text is never read.
  - A contract test on the pinned CLI decides; if it fails, the Q3 fallback applies.
- **Test approach:** a contract test on the pinned CLI; unit tests over fixture event sequences.
- **Estimate:** 0.25 · **Depends:** LY-1.1, G-5 · **Blocked by spike:** none · **Trace event:** `learn.deny_signal {source}`

### LY-1.3 · The live rule suggestion
- **Traces:** FR-163, FR-024, FR-169, NFR-061
- **Files:** `crates/eucas-core/src/learn/suggest_live.rs`, `apps/companion/src/components/suggestion-item/*`
- **Acceptance criteria:**
  - After 3 identical allows in a week: one quiet panel item, not in the notch count, with no sound.
  - It shows the exact rule first and "Other commands still ask."
  - Allow X in Y adds the rule (R-1.5) with Undo; Keep asking never suggests it again (with Undo).
  - Never for a limit.
- **Test approach:** unit tests: threshold 2 vs 3, the week window, `never_for_limit`; Playwright accept → rule + undo, with the notch count unchanged.
- **Estimate:** 0.25 · **Depends:** LY-1.1, R-1.5, N-1.2 · **Blocked by spike:** none · **Trace event:** `learn.suggested`, `learn.suggestion_answered {choice}`

### LY-1.4 · The learned line, the Applied chip, That was wrong
- **Traces:** FR-164, FR-165, FR-170
- **Files:** `apps/companion/src/components/{learned-line,applied-chip}/*`, `src/screens/settings/why.tsx` (adds That was wrong; after SUP-1), `crates/eucas-core/src/learn/applied.rs`
- **Acceptance criteria:**
  - The learned line shows once at the top of the panel with its source and dates, See it and Undo.
  - Applied appears wherever a learned item shaped a decision. **Interface needed from SUP-1:** `Decision.applied: Vec<LearnedId>`.
  - That was wrong forgets the item, with Undo.
- **Test approach:** Vitest states; a unit test "shown once"; e2e That was wrong → the item is gone → Undo brings it back.
- **Estimate:** 0.5 · **Depends:** LY-1.1, SUP-1 · **Blocked by spike:** none · **Trace event:** `learn.applied {item}`, `learn.forgotten {via}`

### LY-1.5 · Settings › What Pip knows
- **Traces:** FR-166, FR-028, FR-169, NFR-103
- **Files:** `apps/companion/src/screens/settings/what-pip-knows.tsx`, `src/components/known-item/*`
- **Acceptance criteria:**
  - Three groups; each item has its source, use count and Forget (10-s Undo); "Forget everything · forgets N things".
  - The learning switch and the ledger line "Together since … · n checks · n rules learned".
  - The honest zero when empty; no Export, no Open the folder.
  - "From how you answer" lists only confirmed guidance rules (Q2).
- **Test approach:** Vitest full and empty; a text and capability scan for export; Playwright forget + undo; axe.
- **Estimate:** 0.5 · **Depends:** LY-1.1, P-1.2 · **Blocked by spike:** none · **Trace event:** `learn.forgotten {count}`

### LY-1.6 · The monthly compounding line
- **Traces:** FR-167
- **Files:** `crates/eucas-core/src/learn/compound.rs`, `apps/companion/src/screens/usage/compound-line.tsx`
- **Acceptance criteria:**
  - Shown only with ≥ 4 weeks of data.
  - The ask rate (waiting items per active session-hour) this month vs last, shown the same way whether better or worse; See why opens What Pip knows.
- **Test approach:** a 5-week fixture, better and worse; hidden under 4 weeks.
- **Estimate:** 0.25 · **Depends:** LY-1.1, L-1.4 · **Blocked by spike:** none · **Trace event:** —

### LY-1.7 · Moments: all caught up, while you were away, back to normal
- **Traces:** FR-114, FR-171, FR-172, FR-173, NFR-136
- **Files:** `crates/eucas-core/src/moments/{caught_up,away,back_to_normal}.rs`, `apps/companion/src/components/{away-digest,back-to-normal-card}/*`, `src/surfaces/panel/peek.tsx` (after N-1.2)
- **Acceptance criteria:**
  - When the last item folds: "You're all caught up. Pip is watching n sessions.", `Face::Pleased` (N-0.2) for 1.6 s and the Done sound.
  - After 30+ min away (`last_input_at` from N-0.5), the digest shows the next time you look, never opening by itself, with a receipt and Got it.
  - After an outage, one Back to normal card says what the guard did and "Nothing was lost."
- **Test approach:** unit tests: away at 29:59 vs 30:00, the digest from a fixture, the outage card; Playwright for each moment.
- **Estimate:** 0.5 · **Depends:** N-1.2, N-0.5, P-1.3 · **Blocked by spike:** none · **Trace event:** `moment.shown {kind}`

### LY-1.8 · Undo-everywhere audit and the worst-moment banners (PRD 27.9)
- **Traces:** FR-169, FR-121, FR-088, NFR-183
- **Files:** `crates/eucas-core/src/moments/worst.rs`, `apps/companion/src/components/banner/*` (P-1.3's), `tests/e2e/undo-everywhere.spec.ts`
- **Acceptance criteria:**
  - Every FR-169 change offers a 10-s Undo; what can't be undone says so before you commit.
  - The changes covered: a rule on, off or added; a learned item forgotten; Not now; Keep asking; a lock change, which asks for admin again.
  - Offline, Claude-not-answering (from H-1's session state), weekly-limit and write-failed each name the cause, what's safe and one next step; the login-expired item is N-1.1's.
- **Test approach:** the table-driven Playwright `undo-everywhere.spec.ts` (one row per FR-169 change, across N-1, R-1, R-2, LY-1 and A-2); banner fixtures.
- **Estimate:** 0.25 · **Depends:** LY-1.3, LY-1.5, R-1.5, N-1.4 · **Blocked by spike:** none · **Trace event:** `moment.shown {kind: banner}`

---

## NA-1 · No account: safety and a small supervisor taste · 5.25 d (new, 2026-10-26) · depends: AC-1, AC-2, BU-1, SUP-1, SUP-2, U-1.4, N-1, P-1, T-1, O-1 · PRD 24.1, 25.3, 27.5, 28.2, 28.3 (as revised) · UC-54, UC-55, UC-56, UC-60, UC-63, UC-65

**Why:** founder decisions 2026-10-26:
- *"we make people have a small taste without sign up and then they have to create account or buy pro"* (Show HN and the awesome-claude-code list exclude sign-up-gated tools). It partly reverses BRD §10 #57 / FR-020: setup can finish without an account.
- **Addendum:** *"Let the no account also have to try the supervisor also but like small number of usage"*.

**No account = safety + a small supervisor taste:** the four locked limits, the mass-delete tripwire, and a fixed number of supervised decisions per install (**about 10 in total, pending founder answer (c)**; alternatives 5 / 10 / 25), on the hidden-budget model. Tracked by a random **install ID** made on this PC (no hardware fingerprint) and a signed **install token** for one anonymous supervisor route; a reinstall resets the taste (accepted). Without an account the server keeps only the install ID and the budget used. Everything else needs an account: Usage, rules editing and drafting (including the library rules beyond the four limits), learns-you, receipts and the ledger, the 14-day trial.

**Constraint contract:**
- With no account, the only calls to the Eucas server are **supervisor-taste calls** (plus the update check and signed config, NA-Q1 answered yes); **none once the taste is used up**. The guard, the limits and the tripwire never need the network (NFR-033, NFR-041).
- Signed out and account deleted are the same state as never signed in (no account); the install's taste is per install, not per account.
- The taste uses the same What is sent payload, redaction and privacy line as the supervisor (FR-138, SUP-1.4); nothing is sent before step 8 has been shown.
- **Never nag:** no timed pop-ups, no badges, no countdowns, no reminders, no expiring prompts. The invites are the quiet "Create an account" block in the minimal panel, one tray menu item, and one calm line, once, when the taste is used up.
- Only approved routes (FR-189): `s-signin` (with "Continue without an account"), `s-noacct-done` (now "9 · Pip is watching (no account)"), `p-noacct`, `p-noacct-empty`, `t-noacct`. The design branch must be merged before NA-1.2, NA-1.3 and NA-1.11 start.
- Undo: nothing here adds a reversible change.
- Verified by: unit tests on the gate and the taste counter, Workers-pool tests on the anonymous route, a network capture in every NA e2e, golden images against the approved screens, and NA-1.6.

### NA-1.1 · `AccountState` and the server-call gate in the core
- **Traces:** FR-054, FR-155, FR-184, NFR-033, NFR-041, NFR-090, NFR-098
- **Files:** `crates/eucas-core/src/account/state.rs` (`enum AccountState { NoAccount, SignedIn }`), `crates/eucas-core/src/net/gate.rs` (the one HTTP client for the Eucas server), `contracts/ipc/state.schema.json` (`AccountState`), `xtask/src/check_deps.rs` (one new rule, in its own function)
- **Acceptance criteria:**
  - `AccountState` is derived, never stored on its own: `SignedIn` only with valid DPAPI tokens (AC-2.1); never signed in, signed out, account deleted, or a 401 after refresh → `NoAccount`.
  - Every Eucas-server client goes through `gate.rs`: the account client (AC-2.1), the config client (W-1.3), waitlist and telemetry (W-1.4) and the meter (ME-1.2) are moved onto it here; SUP-1.7, R-2.2 and the NA-1.7 trial call use it from the start.
  - In `NoAccount`, the gate refuses every account-scoped route (`account`, `trial/start`, `meter`, `supervise`, `draft-rule`, `waitlist`, `telemetry`; `auth/*` only when the user starts a sign-in) with no request sent. It allows the anonymous taste routes (`install/register`, `supervise-taste`, NA-1.8 / NA-1.9) **only while the taste counter has answers left** (NA-1.10), and the update check (`/v1/updates`, `/v1/config`) with only the FR-184 headers. NA-Q1 answered yes by the PM (2026-10-26).
  - The core publishes `AccountState` in the store; the notch and panel mode (NA-1.11), the supervisor client (NA-1.10), the learner and the rulebook compiler read it.
  - `xtask check-deps` fails if any `eucas-core` module other than `net/gate.rs` builds an HTTP client.
- **Test approach:**
  - Unit `account::state::tests::{never_signed_in_is_no_account, signed_out_is_no_account, deleted_is_no_account, refresh_401_is_no_account}`.
  - Unit `net::gate::tests::{no_account_blocks_every_account_route, no_account_allows_only_taste_routes, taste_used_up_allows_no_taste_route, update_check_carries_only_fr184_headers}` over a table of every route in `contracts/api/`.
  - Integration against the fake Worker (replaces "zero calls"): a fixture day in `NoAccount` with sessions, blocks, supervised moments and a tripwire stop → **the only account-or-supervisor requests are supervisor-taste calls**, one per supervised decision, and **none after the taste is used up**; no request carries an account token, email or telemetry.
  - The check-deps self-test `http_client_only_in_gate`.
- **Estimate:** 0.5 · **Depends:** AC-2.1, W-1.3, W-1.4, ME-1.2 · **Blocked by spike:** none · **Trace event:** `account.state {state}`, `net.refused {route, reason: no_account}`

### NA-1.2 · The no-account tray fallback menu
- **Traces:** FR-116 (as revised), FR-021, NFR-036
- **Files:** `crates/eucas-app/src/{tray,context_menu}.rs` (U-1.4's; adds the no-account item list), `contracts/copy/en/tray.json` (`tray.noacct.*`)
- **Acceptance criteria:**
  - In `NoAccount` the tray stays the fallback surface (BRD #65), as in `t-noacct`: the "Protected · 4 limits locked · tripwire on" line (or "Not protected …", the `-off` variant, from U-1.3's `tray_state`), the items the approved route lists, and one **Create an account** item. No badge, no dot on the icon, no timer.
  - **Revised by the addendum:** the tray is no longer the only no-account surface; the minimal notch and panel are NA-1.11. If the founder picks tray only in (a) after all, NA-1.11 is dropped (−0.75 d) and this task takes back the toast-policy change (+0.25 d).
- **Test approach:** unit `tray::tests::{no_account_menu_matches_route, no_account_no_badge, not_protected_line_in_no_account}`; golden images against `screens/noacct-tray-d.png`, `-l` and `-off-d`.
- **Estimate:** 0.25 · **Depends:** NA-1.1, U-1.4, H-1.4 · **Blocked by spike:** none · **Trace event:** `tray.state_changed {state, account: none}`

### NA-1.3 · Setup without an account: step 6 → 8 What is sent → 9 Pip is watching (no account)
- **Traces:** FR-020 (as revised), FR-026, FR-027, FR-028, FR-029, FR-030, FR-138, FR-018, NFR-033, NFR-041
- **Files:** `apps/companion/src/surfaces/setup-window/{step-6-signin,step-8-sent,step-9-watching}.tsx` (O-1.6 / O-1.7's; adds the no-account variants), `apps/companion/src/surfaces/setup-window/steps.ts` (the path 1–6, 8, 9), `crates/eucas-core/src/installer/setup_state.rs` (`finished_without_account`), `contracts/copy/en/setup.json` (`setup.noacct.*`)
- **Acceptance criteria:**
  - Step 6 (`s-signin`) shows **Continue without an account** as a secondary button, online and offline.
  - It leads to **8 · What is sent**, the same screen and privacy line (FR-138) as with an account, since the taste uses it; step 7 (rules) is skipped and no rule is written beyond the limits.
  - Then **9 · Pip is watching (no account)** (`s-noacct-done`): "Pip is watching" and "The four limits are locked · the tripwire is on · 10 supervisor answers to try" (the number from founder answer (c); "Not locked" in the declined-UAC variant, edge H); the quiet invite line; **Send Pip to the top** runs the flight into the minimal notch (NA-1.11), the Done sound and the coach mark once. The "Safety is on" screen of the first brief is **replaced** by this.
  - No `trial/start`, no account call; nothing is sent during setup (the taste is used only by later supervised decisions).
  - Offline at step 6: Continue without an account works, and so do steps 8 and 9 (the example is built on the PC).
  - Never "Protected" after edge J (FR-018), on this path too. Resume: from step 6 on, the first step not done; finished stays finished.
  - Step 2's Euca is the one in the minimal notch, and it carries over when you create an account (**assumption** from the brief, flagged; AC-2.4 adopts it).
- **Test approach:**
  - Playwright `setup-no-account.spec.ts`: online and offline → Continue without an account → step 8 → step 9 → flight → the minimal notch shows; step 7 never appears; the declined-UAC variant reads Not locked.
  - A network capture over the whole no-account setup: no request to any account-scoped or taste route.
  - Golden images against `screens/setup-9-noacct-d.png` and `-l`.
  - A kill-at-each-step resume test on this path.
- **Estimate:** 0.5 · **Depends:** O-1.7, NA-1.1, NA-1.11 · **Blocked by spike:** none · **Trace event:** `setup.step {n, result, account: none}`, `setup.finished {seconds, account: none}`

### NA-1.4 · Sign up later from the tray: setup steps 6–9
- **Traces:** FR-030, FR-146, FR-152, FR-022, FR-026, FR-029
- **Files:** `crates/eucas-app/src/tray.rs` (the menu action), `apps/companion/src/surfaces/setup-window/{flow.tsx,steps.ts}` (an entry at step 6), `crates/eucas-app/src/commands.rs` (`setup_resume_from_tray`)
- **Acceptance criteria:**
  - **Create an account** (the minimal panel's block, the tray item, or the taste-used-up line) opens the setup window at step 6 (AC-2.2's `SignInStep`), then runs 7 (Choose your rules), 8 (What is sent) and 9 (Pip is watching), months later or at once. Steps 1–5 are not repeated; the limits' lock state carries over (Not locked stays Not locked, with step 4's "press to lock" route).
  - Closing the window mid-way returns to the no-account state with nothing written beyond what was confirmed; reopening resumes at the first step not done.
  - An existing account signing in on this PC keeps its plan and trial status (AC-1.2, AC-1.3). The no-account taste never counts against the trial.
  - On finish, the full notch and panel replace the minimal ones, with the same Euca (AC-2.4 adoption), and the tray switches to the signed-in menu.
- **Test approach:** Playwright: no-account install → Create an account (from the panel and from the tray) → steps 6–9 → the full panel opens; close at step 7 → back to no-account, nothing written; an existing-account fixture keeps its plan.
- **Estimate:** 0.5 · **Depends:** NA-1.3, NA-1.11, AC-2.4 · **Blocked by spike:** none · **Trace event:** `setup.step {n, result, entry: noacct}`

### NA-1.5 · Sign out and delete → the no-account state
- **Traces:** FR-155 (as revised), FR-156, FR-157, FR-158, FR-159, NFR-041, NFR-100
- **Files:** `crates/eucas-core/src/account/{profiles,state}.rs`, `apps/companion/src/screens/settings/account.tsx` (AC-2.3's), `crates/eucas-app/src/{tray,notch}.rs` (state switch only)
- **Acceptance criteria:**
  - After a successful sign out or delete (online; B-2's offline rule is unchanged): the full panel and notch switch to the minimal ones (NA-1.11), the tray shows the no-account menu, and the core switches to the no-account profile, which holds no account data.
  - The install's taste continues from where it is (it is per install; a used-up taste stays used up). **Flagged (NA-Q3):** derived from "per install"; the founder may prefer otherwise.
  - The compiled rulebook becomes limits only; **machine-locked rules keep blocking** (managed settings, "Locked on this PC"); the limits and the tripwire never drop during the switch (`rulebook.bin` never missing).
  - A failed refresh (401) does the same switch.
  - **Open (UX, NA-Q2):** whether the invite reads "Create an account" or "Sign in" after a sign-out (the first brief said "tray + Sign in"); built from one copy key either way.
- **Test approach:**
  - Playwright: signed in → Sign out → the minimal notch and panel, the no-account tray menu; an agent's delete and a default-branch push are still blocked; a machine-locked rule still blocks.
  - The same after Delete account (the server row gone, `trial_claim` kept).
  - An integration watcher: `rulebook.bin` never missing during the switch; NA-1.1's capture shows no account-scoped request afterwards.
- **Estimate:** 0.5 · **Depends:** AC-2.3, AC-2.4, NA-1.2, NA-1.11 · **Blocked by spike:** none · **Trace event:** `account.state {state: no_account, via}`, `account.profile_switched {to: none}`

### NA-1.6 · E2E: a fresh install with no account protects you offline
- **Traces:** NFR-033, NFR-041, FR-055, FR-056, FR-057, FR-058, FR-012
- **Files:** `tests/e2e/no-account-safety.spec.ts`, `tests/e2e/fixtures/offline.ts` (blocks every host)
- **Acceptance criteria:**
  - Fresh install (temp `EUCAS_HOME`) → setup 1–5 with a fake UAC → Continue without an account → 8 → 9, with the network off from step 6.
  - A session's push to the default branch is **blocked**, with the deny receipt in the log.
  - A scripted mass delete (≥ 200 git-tracked files in 20 s) **trips**: the session tree is stopped, the measured count is recorded, and the minimal notch shows the stop.
  - Offline, a supervised moment falls back to asking you (rules only) and the taste counter doesn't move; zero requests to any host.
  - A second, online run with the fake Worker: supervised moments make supervisor-taste calls only, until the taste is used up; then **no further call**, the next moment is a normal needs-you ask and the one calm line shows once (NA-1.1's capture).
  - The same run with UAC declined: Not locked in the tray line and on step 9, and the push is still blocked at user scope.
- **Test approach:** the spec itself, on the Windows e2e job; joins Q-1.2's full set.
- **Estimate:** 0.5 · **Depends:** NA-1.3, NA-1.10, T-1, O-1.5 · **Blocked by spike:** none · **Trace event:** uses `setup.finished`, `log_entry kind=block`, `TripwireEvent`, `taste.used`

### NA-1.7 · The trial starts at sign-up (**pending founder answer (b)**)
- **Traces:** FR-144 (as revised by (b)), FR-145, FR-025, NFR-044
- **Files:** `crates/eucas-core/src/account/client.rs` (after a successful verify). Step 9 never gets a `trial/start` call: O-1.7 (Sprint 9, later) is already written without it.
- **Acceptance criteria:**
  - Recommendation (b): the 14-day trial starts at account creation, in setup or months later from the tray. A no-account user never burns a trial, and the no-account taste doesn't count against it.
  - The app calls `trial/start` once after each successful verify; AC-1.3's idempotency and the `trial_claim` email hash make it a no-op for an account that already had one (one trial per account, BR-123 (9) unchanged). An existing account on a new PC keeps its plan and trial status.
  - Setup drafts at step 7 still draw on the `pending` allowance (FR-025), not the trial.
  - If (b) is answered "at the end of setup" instead, this task is dropped (−0.25 d) and O-1.7 keeps its call.
- **Test approach:** fake Worker: a new account → one `trial/start` right after verify; an existing account → the call is a no-op and the plan is unchanged; a no-account install → no `trial/start` ever; step 9 makes no call.
- **Estimate:** 0.25 · **Depends:** AC-2.2, AC-1.3 · **Blocked by spike:** none · **Trace event:** `account.trial {result}`

### NA-1.8 · Worker: install registration and the signed install token
- **Traces:** FR-143, FR-153 (as extended), NFR-070, NFR-071, NFR-072, NFR-096, NFR-186
- **Files:** `apps/api/src/routes/install.ts`, `apps/api/src/auth/install-token.ts`, `apps/api/src/db/migrations/00NN_install_taste.sql` (additive), `contracts/api/install-register.schema.json`, AC-1.1's column allow-list test (one new table)
- **Acceptance criteria:**
  - `POST /v1/install/register` takes only a random install ID (128-bit, made on the PC; no hardware fingerprint) and returns a `v1.` HMAC install token scoped to the taste route only; it can never call an account route.
  - The new table holds exactly `install_id`, budget used and created-at; no IP, user agent, device or email column. Nothing else is stored for an install.
  - Registration is rate-limited per IP (the value in signed config); a repeated ID returns the same token, idempotently.
  - **Open (ADR-0017):** the server now keeps an install row without an account; ADR-0017's "tables are exactly…" needs an amendment (doc, tech lead).
- **Test approach:** Workers pool: strictness (unknown key → 400), the column allow-list, an install token refused on `/v1/account` and `/v1/supervise` (401), idempotent re-register, the per-IP limit → 429, a spy logger (no body).
- **Estimate:** 0.5 · **Depends:** AC-1.3, W-1.3 · **Blocked by spike:** none · **Trace event:** `api.install {status}`

### NA-1.9 · Worker: the anonymous supervisor-taste route
- **Traces:** FR-128, FR-129, FR-133, FR-143, NFR-044, NFR-073, NFR-091, NFR-097, NFR-111
- **Files:** `apps/api/src/routes/supervise-taste.ts` (reuses SUP-2's validation, prompt, chain and settle), `apps/api/src/budget/taste.ts`, `contracts/api/supervise-taste-{request,response}.schema.json` (same body as `supervise`, plus `tasteLeft`)
- **Acceptance criteria:**
  - Install token required; the same strictness, secret re-scan, prompt cap, ZDR provider block, output validation and kill switch as `/v1/supervise` (one shared handler, two auth modes).
  - The taste budget is per install, **in total, not monthly**: about 10 decisions (**pending founder answer (c)**; 5 / 10 / 25), reserved and settled on the hidden-budget model, the cap in signed config. Used up → `402 taste_used_up`, with no model call.
  - Abuse: a per-IP rate limit and the **global daily spend cap** (BU-1.1's breaker) cover the taste; when the breaker trips, the taste answers `503` and the app asks you.
  - The response carries only the decision and `tasteLeft` (a count of answers, never money).
- **Test approach:** Workers pool: 50 parallel calls never overspend the install's cap; used up → 402 and no provider call; the breaker covers taste spend; per-IP 429; the ZDR contract test extended to this route; a key scan for `usd`, `cost`, `price`.
- **Estimate:** 0.5 · **Depends:** NA-1.8, SUP-2.2, BU-1.1 · **Blocked by spike:** SP-SUP2 (acceptance: the same launch gate as the supervisor; the taste is off until it passes) · **Trace event:** `api.supervise_taste {status, decision}`

### NA-1.10 · Core: install ID, the taste counter and the used-up state
- **Traces:** FR-128, FR-132, FR-136, FR-142, NFR-042, NFR-070, NFR-095
- **Files:** `crates/eucas-core/src/supervisor/{client,taste}.rs` (SUP-1.7's client gains the install-token mode), `crates/eucas-core/src/account/install.rs` (ID and DPAPI-held token), `contracts/ipc/state.schema.json` (`Taste { left, total, usedUp }`)
- **Acceptance criteria:**
  - The install ID is random, made on this PC at first use, stored with the token under DPAPI (AC-2.1's helper); never derived from hardware. Registration happens lazily, on the first supervised decision with no account.
  - In `NoAccount`, a supervised moment the rules don't settle calls the taste route through the gate (NA-1.1) with the same What is sent payload and redaction (SUP-1.4, SUP-1.8's sent log); the counter follows the server's `tasteLeft`.
  - **Taste used up:** no further taste call, ever, on this install; the moment becomes the normal needs-you ask ("Pip asks you instead"), and the store raises one `taste_used_up` flag that NA-1.11 shows as the calm line, **once**.
  - Offline, 402, 429, 503 or the kill switch → rules only and an ask, as SUP-1.7; the counter doesn't move.
  - Signing in switches the client to the account token; the taste counter is kept for this install.
- **Test approach:** integration against the fake Worker: `taste::{lazy_register_once, counts_down_from_server, used_up_makes_no_call, used_up_line_once, offline_no_count}`; a DPAPI round-trip; a scan that the ID is not derived from any hardware API.
- **Estimate:** 0.5 · **Depends:** NA-1.1, NA-1.9, SUP-1.7, SUP-1.8 · **Blocked by spike:** SP-SUP2 (acceptance, as SUP-1.7) · **Trace event:** `taste.used {left}`, `taste.used_up`

### NA-1.11 · The minimal notch and minimal panel (**pending founder answer (a)**; the addendum recommends this)
- **Traces:** FR-102, FR-103, FR-106, FR-107, FR-109, FR-139, FR-142, FR-173, NFR-132, NFR-136
- **Files:** `apps/companion/src/surfaces/panel/noacct/{panel-noacct,taste-meter,create-account-block}.tsx`, `apps/companion/src/surfaces/panel/panel.tsx` (mode switch on `AccountState`; **not** `peek.tsx`, which LY-1.7 edits in the same sprint), `crates/eucas-app/src/notch.rs` (shows in `NoAccount`), `contracts/copy/en/panel-noacct.json`
- **Acceptance criteria:**
  - In `NoAccount`, Pip is in the notch with the eight-face eye grammar (N-0.2's `Face` only), the needs-you marker and the peek, exactly as signed in.
  - The minimal panel (`p-noacct`) shows only: What needs you (N-1.2's list), the protection state (H-1's heartbeat line, Locked / Not locked), the taste meter ("7 of 10 supervisor answers left", `role=meter`, never money), and a quiet **Create an account** block (→ NA-1.4). No Usage, Rules editing, drafting, learns-you, receipts or ledger, and no tabs for them.
  - **Taste used up** (`p-noacct-empty`): the meter shows none left and the one calm line "Sign up for 14 more days of the supervisor" shows **once**; after it is dismissed or seen, only the quiet block remains. No badge, timer or notification.
  - The tray stays the fallback (NA-1.2) when the notch steps aside or panics.
- **Test approach:** Vitest for every state (taste left, 1 left, used up, line already seen); Playwright: no account → needs-you item → peek → minimal panel; used up → the line once, never again after relaunch; golden images against `panel-noacct-d.png`, `-l` and `panel-noacct-empty-d.png`; axe; a text scan that no Usage / Rules / receipts string is reachable in no-account mode.
- **Estimate:** 0.75 · **Depends:** NA-1.10, N-1.2, P-1.1, ME-1.1, N-0.4 · **Blocked by spike:** none · **Trace event:** `panel.mode {mode: noacct}`, `moment.shown {kind: taste_used_up}`

---

## Totals

| Story | Tasks | Task days | BUILD-PLAN | Δ | Why |
|---|---|---|---|---|---|
| U-1 | 6 | 2.0 | 1.5 | +0.5 | Playwright / CDP harness bootstrap; the two platform pieces (peek without activation, AUMID) |
| N-0 | 8 | 3.25 | 2.5 | +0.75 | Gooey peek handoff between the native notch and the webview (DESIGN §5.1, new); the eight-face eye grammar with its mapping and repo scan (founder, 2026-10-26) |
| N-1 | 6 | 2.0 | 1.5 | +0.5 | SP-ST1 toast fallback; the sounds (PRD 27.10, in no story) |
| L-1 | 4 | 1.5 | 1.5 | 0 | |
| R-1 | 9 | 3.25 | 1.5 | +1.75 | The 10 library rules (G3-7) 1.25; tamper restore and idempotent save with Undo 0.5 |
| R-2 | 4 | 1.75 | 1.75 | 0 | |
| P-1 | 4 | 1.5 | 1 | +0.5 | Block Why? page and `export_log` removal; the gooey switch |
| O-1 | 7 | 3.25 | 3 | +0.25 | Step-1 edges and the never-signed-in path |
| W-1 | 4 | 1.75 | 1.5 | +0.25 | Config signing tool with the eval-score gate |
| AC-1 | 5 | 1.75 | 1.75 | 0 | |
| AC-2 | 4 | 2.25 | 2.25 | 0 | |
| BU-1 | 2 | 1.0 | 1 | 0 | |
| ME-1 | 2 | 0.5 | 0.5 | 0 | |
| SUP-2 | 2 | 1.0 | 1 | 0 | |
| R1 | 4 | 1.75 | 1.75 | 0 | |
| **Subtotal** | **71** | **28.5** | **24.0** | **+4.5** | |
| LY-1 (new) | 8 | 3.0 | 2–3 (indicative, not in the 48) | +3.0 | Learns-you core 2.25 + moments and the undo audit 0.75 |
| NA-1 (new, 2026-10-26, with the taste addendum) | 11 | 5.25 | — (not in the 48) | +5.25 | No account = safety + a small supervisor taste: the gate 0.5, tray fallback 0.25, setup 6 → 8 → 9 0.5, sign up later 0.5, sign out / delete 0.5, the e2e 0.5, trial at sign-up 0.25, install token 0.5, taste route 0.5, taste counter 0.5, minimal notch and panel 0.75 |
| **Lane B file total** | **90** | **36.75** | | **+12.75** vs the 48.25 plan | NA-1's tasks run in both lanes per the sprint plan (NA-1.2, NA-1.8, NA-1.9, NA-1.10 in lane A) |

## Tasks blocked by a spike

- **SP-ST2** (native notch accessibility and keyboard):
  - U-1.6 (peek without activation);
  - N-0.5 (keyboard-focus peek only);
  - N-0.6 (UIA provider);
  - N-0.7 (`RegisterHotKey` shortcut);
  - N-0.8 (the gooey peek relies on peek without activation).
- **SP-AC1** (sign-in deliverability):
  - AC-1.4 (`EmailSender` and the default provider);
  - R1.4 (acceptance: the staging code-send smoke).
- **SP-SUP2 (acceptance)** (the supervisor's launch gate):
  - NA-1.9, NA-1.10 (the no-account taste is the same supervisor);
  - W-1.3 (the production config needs the eval score);
  - BU-1.1 (cap values);
  - BU-1.2 (`promptTokenCap`);
  - SUP-2.1 (prompt sizes; the switch stays on);
  - SUP-2.2 (model choice);
  - R1.3 (stable release only, G3-1).

## Tech-lead risks and questions for Gate 6

1. **The gooey peek spans two windows.** The notch is native (ADR-0016), but DESIGN §5.1 draws the notch body and the card in one WebView2 goo layer. So the webview must overlay the native notch to the device pixel, and the native notch must switch to eyes-only in the same frame (N-0.8). A transparent, animating webview also costs CPU while the peek is open (SP-ST1).
   - **Recommendation:** build it as specified, gated by N-0.8's alignment probe and the idle sampler. If alignment fails at any scale, or the peek misses 150 ms, fall back to the card melting out of a webview-drawn copy of the notch shape under the real one (same look, no handoff), decided by the tech lead without a re-plan.
2. **Guidance rules have no screen that creates them.** "From how you answer" (FR-166) and the supervisor's `rules[].text` both need guidance rules you confirm (G3-3). No approved design writes one, and BR-128 / FR-189 forbid unapproved screens.
   - **(a) Recommended:** let R-2's Describe a rule return a guidance rule on the same draft card. That's one draft-card variant for UX to approve, plus 0.25 d in R-2.
   - (b) Ship v0.1 with no guidance rules: the group shows its empty line, and the supervisor answers only from block and allow rules.
3. **"From what you denied" needs a deny signal that Claude Code may not give in structured form.** Hooks don't report your answer to a permission prompt, and reading the transcript's rejection text would break G3-3. **Recommendation:** accept the fallback now. LY-1.2's contract test decides; if there is no reliable metadata signal, "From what you denied" lists only block rules you added after a prompt, and the copy stays true.
4. **The estimate grows.**
   - Lane B is +4.25 d on existing stories (1.25 of it is the library rules, 1.0 the gooey peek and switch, 0.25 the sounds). LY-1 is 3.0 d (inside FD-4's 2–3).
   - With Q2(a) and Q5, the plan goes from 48.25 to about **56 build days**, or about 57 with the story map's Windows 10 day.
   - **Recommendation:** accept it; sequence, don't cut. LY-1 takes Sprint 10's lane-B slack, the rest adds about one sprint (≈ 11 sprints, about 31–33 working days elapsed), and the day-6 re-plan checks actuals.
   - **Update 2026-10-26:** NA-1 (no account: safety and a small supervisor taste) adds 5.25 d, for **63.75** in all. It fits the same 11 sprints by splitting R1 and LY-1 across sprints and using most re-plan buffers (README §4); no sprint is added.
5. **Hot shared files break the "no two tasks on one file in a sprint" rule in most sprints.** Examples: `eucas-core/src/lib.rs`, `eucas-platform/src/windows/mod.rs`, `eucas-rules/src/lib.rs`, `contracts/copy/en.json`, `contracts/errors.schema.json`, `contracts/ipc/*.schema.json`, `routes.tsx`, `capabilities/*.json`, the lockfiles.
   - **Recommendation:** S1-1 (+0.25 d, the other lead) pre-creates every module CODE-STRUCTURE lists as an empty stub in those registries, and splits copy and error codes into per-surface files (`contracts/copy/en/<surface>.json`).
   - Lockfiles are regenerated by whoever merges second, never hand-merged.
   - No product change; the founder accepts +0.25 d.
