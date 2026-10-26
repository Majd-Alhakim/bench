# Pre-Gate-6 spikes: the checks only you can do

Claude doesn't control your screen (your call, 2026-10-26). These checks need eyes or a click, so they're yours, whenever you choose. Each takes a minute or two. Write the result next to the box, and a Claude session folds the results into the spike reports.

Before you start: the spike files live in `%TEMP%\eucas-spikes`, and the spike code is in this repo under `spikes/`. Nothing here touches your real Claude Code setup unless a step says so.

## SP-ST1: the shell

Start the spike app with the notch on (PowerShell, from the repo root):
```powershell
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS="--remote-debugging-port=9222"; $env:ST1_NOTCH="1"; & "$env:TEMP\eucas-spikes\st1\target\release\eucas-st1.exe"
```
1. ☑ **Tray click.** Done on screen with your OK (first frame 66 ms after the click, closed by clicking away).
2. ☐ **Toast buttons.** In a second terminal: `node spikes/SP-ST1/toast.mjs`. A notification "Eucas spike: a session needs you" appears with **Open session** and **Dismiss**. If no banner shows, Windows put it straight into Notification Center (that happened during the spike, with Windows in its "busy" state): open Notification Center from the clock and click it there. Click **Open session**: the spike's main window should appear. Then check `%TEMP%\eucas-spikes\st1\log.jsonl` for a `toast_activated` line with `"action":"open"`. *Result:*
3. ☐ **Scale 100 % and 150 %.** Settings › Display › Scale: set 100 %, restart the spike app (same command), and check that the black notch sits centred at the very top and the tray panel opens at the icon. Repeat at 150 %, then **set it back to 125 %**. *Result:*
4. ☐ **Second monitor** (if you have one): drag nothing. Just check the notch is on the main display, centred. *Result:*
5. ☐ **Full screen.** With the notch showing, open any video in full screen (or press F11 in a browser). The notch should disappear within about 1 s and come back when you leave full screen, without taking focus. *Result:*
6. ☑ **Hover.** Done on screen with your OK (hover detected; panel opened on click and closed on Esc).

Quit the spike app from its tray menu (right-click › Quit).

## SP-H1: the desktop app and VS Code
Uses a throwaway folder that turns on the spike plugin **only for itself** (project settings). Your other sessions aren't affected. The guard only logs, except that it refuses `git push … main`.

7. ☐ **Desktop app.** In the Claude desktop app, start a local session in `%TEMP%\eucas-spikes\host-check` and ask: *"run `echo hello` in the terminal"*. If it asks to trust or install the project's plugin, accept for this folder only. Then check `%TEMP%\eucas-spikes\guard-log.jsonl` for lines with `"entrypoint":"claude-desktop"` (session-start, pre-tool-use, post-tool-use, stop). *Result:*
8. ☐ **VS Code.** Open the same folder in VS Code, start Claude Code there, and ask the same. Check the log for `"entrypoint":"claude-vscode"` (or similar). *Result:*

(These use a few tokens of your normal plan, since they're real model turns.)

## S-4: Open session
9. ☐ Start `claude` in **Windows Terminal** in any folder, and another in **VS Code's terminal**. In a separate terminal:
   ```bash
   powershell -File spikes/S-4/find-host.ps1
   ```
   Note the `claude_pid` of each, then for each:
   ```bash
   powershell -File spikes/S-4/focus-host.ps1 -ClaudePid <pid>
   ```
   The right window should come to the front, and the script prints the tab title. *Result per host:*

## S-6: tray settings link
10. ☐ `start ms-settings:taskbar`. Does it open Taskbar settings with **Other system tray icons** on the page (collapsed or open)? *Result:*
