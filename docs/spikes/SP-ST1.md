# Spike SP-ST1: the Tauri shell on Windows (tray, flyout, notch, toasts, updater, tests, footprint)

**Date:** 2026-10-26 · **Branch:** `spike/SP-ST1` · **Code:** [`spikes/SP-ST1/`](../../spikes/SP-ST1/) (throwaway): `tauri-tray/` (Tauri 2, Rust + static pages), `native-notch/` (Rust, no webview), `electron-tray/` (Electron 45, for the comparison)
**Setup:** Windows 11 Home 26300, one 1920×1080 display at **125 %**, WebView2 155, Rust 1.91, Tauri CLI 2.12.4, Electron 45.0.0, Defender on. Every check is automated with no screen control: Playwright over WebView2 CDP, the app's own Win32 probes, and the app's own timing log. Screen control was stopped at the founder's request; what needs eyes is on the [manual checklist](G6-MANUAL-CHECKLIST.md).

**Verdict: GO with limits.** Tauri stays; the ADR-0008 kill criterion is **not** triggered.
- **One design change:** the CR-011 notch must be **drawn natively** (a per-pixel-alpha layered window from the Rust core), not as a WebView2 window. As a webview it misses the idle budget in **both** Tauri and Electron.
- **Still open (manual):** toast button activation, 100 % / 150 % / multi-monitor placement, full-screen step-aside. A real tray click, real hover, and notch click + Esc were checked on screen with the founder's OK (only the spike's own windows; your other apps were masked).

## Results against the GO bar

| Item | Result |
|---|---|
| Tray icon swaps + tooltip | ✅ 3 states (guarded, needs you, not guarded) with tooltips; `set_icon` + `set_tooltip` take **0.8–2.5 ms** |
| Flyout at the tray (125 %) | ✅ Placed from the tray rect into the monitor's work area (centred on the icon, 12 px above the taskbar, clamped). **Real click** on the icon in the hidden-icons area: icon rect 1424,897 (50×50 px) → flyout 1224,405; **first frame 66 ms after the click**; a click on the desktop closed it. Synthetic clicks: p50 37 / p95 67 ms over 20 opens (bar < 150). 100 % / 150 %: ⏳ manual. |
| Toasts with buttons, click activation (app running) | ⏳ **Built and delivered** (WinRT toast via `tauri-winrt-notification`, two buttons, `on_activated` logs the button and opens the main window). On this PC, Windows **put it straight into Notification Center with no banner** (dismissal reason "timed out", 1 entry in history). Windows reported "busy" (`QUNS_BUSY`) at the time, and Do Not Disturb holds banners back then. Clicking **Open session** in Notification Center is still a manual check. **Design consequence:** a toast can land silently, so the notch must carry needs-you on its own, and the app should read the notification state before counting on a banner. Unpackaged dev builds borrow PowerShell's AUMID; the installer must register Eucas's own AUMID (a Start-menu shortcut) for buttons to route back. |
| Updater round trip with a signed manifest | ✅ Installed 0.1.0 per-user (NSIS, silent), served a signed `latest.json` for 0.1.1 on loopback. The app downloaded, verified, installed and **restarted at 0.1.1 in 3.1 s**. A **wrong signature was refused** ("The signature verification failed"), and the app stayed on 0.1.0. Uninstall left no folder, no Start-menu entry and no uninstall key. |
| Playwright over WebView2 CDP | ✅ `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` + `chromium.connectOverCDP`. It drives every webview (main, flyout, notch, panel): read DOM, click, hover, press Esc, call commands. The capability ACL is enforced too: `window.hide` was refused until allow-listed. |
| Idle RAM/CPU, flyout pre-warmed | ✅ **78.5 MB private, 0.7 % of one core** (tray + hidden pre-warmed flyout, 9 processes). Electron hello-tray with the same flyout: **78.2 MB, 0.4 %** (4 processes). |
| Installer / disk | Tauri NSIS installer **2.4 MB** (app exe 9 MB) vs Electron's 357 MB unpacked runtime (~100 MB installer). |

### The notch (CR-011)

| Requirement | Webview notch (Tauri) | Native notch (Rust layered window) |
|---|---|---|
| Transparent, frameless, always on top | ✅ (`transparent`, no decorations, topmost, tool window) | ✅ |
| Never takes focus at rest | ✅ `WS_EX_NOACTIVATE`; showing it left the foreground window unchanged (Win32 probe) | ✅ same probe |
| Click-through outside its shape | ✅ `SetWindowRgn` to the pill: `WindowFromPoint` at the window's corner returns the window below; at the pill centre it returns the notch | ✅ per-pixel alpha: transparent pixels aren't hit (same probe) |
| Panel opens on click, closes on Esc / click-away | ✅ 21 opens via CDP click. Panel first frame **p50 5 / p95 8 ms**. Esc closed it **20 / 20**, click-away (focus moved to another window of ours) **1 / 1**. | (the panel is a webview in both designs) |
| Hover detection | ✅ **Real mouse** over the pill: the 30 Hz poll logged `hover inside` and the pill grew. In-page hover via CDP too. | same poll |
| Position at 100 / 125 / 150 % and multi-monitor | ✅ 125 %: top-centre at 797,0 (325×55 px). Placement is per monitor from `available_monitors()` (work area + scale). Other scales and a second display: ⏳ manual. | ✅ 125 % same rect |
| Steps aside for a full-screen app or game | Built: Direct3D full screen or presentation mode (`SHQueryUserNotificationState` 3 or 4), **or** a foreground window covering its monitor → hide; back with `SW_SHOWNOACTIVATE`. **Found on screen:** state 2 ("busy") stayed on with **nothing full screen in front**, and the first build hid the notch for no reason. The rule now ignores 2 unless the foreground window also covers the monitor. A real full-screen app wasn't tested: Windows' foreground lock kept the spike's test window from coming to the front, and clicking it wasn't approved. ⏳ manual. | same logic |
| **Idle with the eye-follow animation** | ❌ **87–99 MB private; 2.5 % of one core at rest, 13.8 % with the eyes following at 30 Hz** (after two fixes: a JS-timed blink instead of an infinite CSS animation, and caching the window handle and scale instead of asking Tauri 30× a second) | ✅ **0.9 MB; 0.16 % at rest, 0.94 % following at 30 Hz** (2,020 frames drawn in 95 s) |
| Same notch in Electron (kill-criterion check) | 101–106 MB; 2.8 % at rest, 10.3 % following | – |

**Why:** a visible transparent WebView2 (or Chromium) window keeps a renderer and the GPU process compositing every frame the eyes move, and costs about 20 MB of extra memory. A 325×55 px layered window redrawn in software only when the cursor moves costs almost nothing. The notch has no text input and no layout, so it doesn't need a webview. **Estimated shell idle with the change:** tray + pre-warmed panel webview (78.5 MB, measured as the flyout) + native notch (0.9 MB) ≈ **80 MB**, under the 90 MB bar. (That's the sum of two measurements, not one combined run.)

## Kill criterion (ADR-0008, 2 days, Electron fallback)
Not triggered. In about half a day, Tauri met or matched Electron on everything measured: tray, flyout, updater, CDP testing and idle (equal RAM, 40× smaller installer). The one miss, the webview notch, misses the bar in Electron too, so a stack change wouldn't fix it. The toast activation risk ADR-0008 named stays open until the manual check. If it fails, the ADR's own fallback (a direct WinRT module in Rust) applies, not a stack change.

## Findings for the design
1. **Notch = native Rust window** (`eucas-platform/windows/notch.rs`: layered window, `UpdateLayeredWindow`, per-pixel alpha, `WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW | WS_EX_TOPMOST`, `MA_NOACTIVATE`). The panel stays a webview, pre-warmed hidden. The notch's states, animations and copy hooks need a small Rust drawing layer (or Direct2D later). Update ADR-0008 and the UI spec: eye and blink animations are drawn in Rust, so the design tokens must be exported as plain values for it.
2. **Never call Tauri window getters in a hot loop**: each is a round trip to the main thread. Cache the HWND, scale and rect, and refresh on `ScaleFactorChanged` / `Moved`.
3. **No infinite CSS animations in always-visible webviews** (they keep the compositor at 60 fps).
4. **WebView2 keeps a hidden window's `document.visibilityState` as `visible`**: signal "shown" with an event from Rust, not `visibilitychange`.
5. **`emit_to("panel", …)` also reached `listen()` in the flyout page** (a second `flyout_first_frame` appeared). Use window-scoped listeners (`getCurrentWebviewWindow().listen`) for per-window events.
6. The installer must create a Start-menu shortcut carrying Eucas's AUMID, for toast buttons and activation (unpackaged app).
7. **Unsigned v0.1:**
   - SmartScreen will warn on the downloaded installer ("Windows protected your PC" → More info → Run anyway). Say so on the download page.
   - Once installed, the app and guard run from `%LOCALAPPDATA%` without prompts.
   - **Smart App Control on would block the unsigned app and guard** (see SP-H1 finding 6).
   - The updater's Ed25519 manifest signature is independent of Authenticode and works unsigned; tampering was refused.

## Reproduce
```bash
cd spikes/SP-ST1/tauri-tray && npm install && npx tauri build      # needs TAURI_SIGNING_PRIVATE_KEY (generated locally, not committed)
ST1_NOTCH=1 WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222 <target>/eucas-st1.exe
node ../drive-notch.mjs     # notch probe, hover, 21 panel opens, Esc, click-away
node ../drive.mjs           # flyout placement + first frame
node ../updater.mjs         # updater round trip (add "tamper" for the bad signature)
powershell -File ../measure-idle.ps1 -Root eucas-st1 -Seconds 60
```
`native-notch` takes `NN_SECS` and `NN_FAKE_CURSOR`; `eucas-st1` takes `ST1_NOTCH`, `ST1_NO_MAIN`, `ST1_NO_FLYOUT` and `ST1_FAKE_CURSOR`. The fake cursor circles the notch, so the eyes move without touching the real mouse.
