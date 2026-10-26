# ADR-0016: The notch is a native Rust layered window; the panel is the one webview

- **Status:** Proposed (2026-10-26). Evidence: [SP-ST1](../spikes/SP-ST1.md). Requirement: [CR-011](../requirements/change-requests/CR-011.md) §2–3 (the Euca lives in the notch; a panel, no main window). **Amends ADR-0008** (surfaces) and supersedes the "no notch in v0.1" line of SYSTEM-DESIGN §1.
- **Date:** 2026-10-26

## Context
CR-011 makes the notch the companion's main surface: the Euca's eyes at the top of the screen, a glow while sessions work, markers that stay when something needs you, a peek on hover, and a panel on click. The notch is visible **all day**, so its idle cost is the product's idle cost. The founder's answers (2026-10-26) remove voice from the companion, so there is **no global keyboard hook** of any kind.

Facts from SP-ST1 (Windows 11, 125 %, Defender on):
- A transparent WebView2 notch with the eye-follow animation: **87–99 MB private, 2.5 % of one core at rest, 13.8 % with the eyes following at 30 Hz** (after two optimisations). The same notch in Electron: 101–106 MB, 2.8 % / 10.3 %. Both miss the < 90 MB, < 0.5 % idle budget (SYSTEM-DESIGN §2).
- A **native layered window** (`UpdateLayeredWindow`, per-pixel alpha, drawn in software only when something changes): **0.9 MB, 0.16 % at rest, 0.94 % following at 30 Hz**.
- Both versions met the behaviour bar: no focus at rest (`WS_EX_NOACTIVATE`), click-through outside the shape, hover by a 30 Hz cursor poll (`GetCursorPos`, not a hook), per-monitor placement, full-screen step-aside.
- The panel (a pre-warmed hidden webview) opens in p50 5 / p95 8 ms; shell idle with tray + panel ≈ 78.5 MB; with the native notch ≈ **80 MB** (sum of two measurements).

## Options
| | Idle RAM / CPU (measured) | Drawing | Accessibility | Work |
|---|---|---|---|---|
| A. Notch as a Tauri webview | 87–99 MB, 2.5 % rest | CSS (design tokens as-is) | Free (ARIA in the DOM) | Least |
| B. Change stack to Electron | 101–106 MB, 2.8 % rest | CSS | Free | Re-plan; same miss |
| **C. Native layered window from the Rust core, panel stays a webview** | **0.9 MB, 0.16 % rest** | Software drawing in Rust; tokens exported as plain values | A small UI Automation provider (to prove, SP-ST2) | ~2.5 build days |
| D. Native window with Direct2D / DirectComposition | Similar to C | GPU drawing | Same as C | More code; only worth it if C can't draw the eye grammar in budget |

## Decision
**C.** The notch is a native window owned by the Rust core:
- **Window:** `WS_EX_LAYERED | WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW | WS_EX_TOPMOST`, `MA_NOACTIVATE` on click, per-pixel alpha (transparent pixels aren't hit, so it's click-through outside the pill), placed per monitor from the work area and scale; refreshed on `WM_DPICHANGED` / display change, never queried in a hot loop (SP-ST1 finding 2).
- **Drawing:** a pure crate, `eucas-notch`, turns `(NotchState, time, cursor) → BGRA buffer` (the eight faces of the eye grammar, [DESIGN §2.3](../design/ui/companion/DESIGN.md#23-the-eye-grammar-the-only-faces), with blink and follow; glow, the working beam, markers, thin-line mode, Not protected ring). It redraws only when the state, the cursor (while following) or an animation frame changes, and stops the 30 Hz timer when nothing moves. Effects that would need blur or filters are **pre-rendered sprites** at each scale. Design tokens are exported as plain values (`packages/ui-tokens/tokens-notch.json` → generated Rust constants).
- **Input:** hover = the cursor poll entering the shape for 280 ms; click opens the panel. No `SetWindowsHookEx` anywhere in the product (banned by `xtask check-deps`, founder 2026-10-26). **Keyboard (founder, 2026-10-26, BRD #61):** an optional panel shortcut, **off by default**, registered with `RegisterHotKey` (Windows delivers only that combination; no other key is seen); if the combination is taken, Settings says so and leaves it off. Without it, the tray icon (reachable with Win+B) opens the panel.
- **Peek and panel:** both are the **one pre-warmed webview** (the panel), shown under the notch without activation for the peek (`WS_EX_NOACTIVATE`, SP-ST1 showed it keeps the foreground window) and activated on click for the panel. "Shown" is signalled by an event from Rust, not `visibilitychange` (SP-ST1 finding 4).
- **Full screen:** hide when `SHQueryUserNotificationState` is 3 or 4, or when the foreground window covers its monitor; state 2 ("busy") alone never hides it (SP-ST1).
- **Tray:** a fallback only (quit, show the panel), as CR-011 says. Toasts are a fallback too: SP-ST1 saw Windows put a toast straight into Notification Center, so **the notch carries needs-you on its own**.

## Consequences
- The shell idle budget holds (≈ 80 MB, < 0.5 % CPU) with the notch always on; the perf job measures notch + hidden panel together (TESTING §6).
- The eye grammar and animations are written twice in effect: once as the design's CSS prototype, once in Rust. The design's spec is the source; the Rust drawing is checked against the prototype's screenshots at 100/125/150 % (a golden-image test with a small tolerance).
- **Accessibility is our job, not the browser's:** the notch needs a UI Automation provider (name: protection state, activity and the needs-you count; `UiaRaiseNotificationEvent` for "bench is waiting for you"), and a keyboard path that doesn't need a hook. **Spike SP-ST2 (0.5 d)** proves both before N-0 starts (BUILD-PLAN §2).
- If the drawing layer can't meet the eye grammar inside 1 MB and 0.5 % CPU, option D replaces the drawing backend only; the window, input and state code stay.
- Playwright can't see the notch; it's tested by Win32 probes (no-activate, hit test, placement, step-aside) and the golden images. Everything with text is in the webview and stays Playwright-tested.
