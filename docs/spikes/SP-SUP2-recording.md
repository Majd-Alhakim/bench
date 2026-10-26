# SP-SUP2 recording: collecting real supervisor moments, locally

**Date:** 2026-10-26 · **Branch:** `spike/SP-SUP2-recorder` · **Code:** [`spikes/SP-SUP2/recorder/`](../../spikes/SP-SUP2/recorder/)
**Status:** built and tested in the isolated spike profile. **Not installed in the founder's profile yet; that needs the founder's go-ahead** (consent to record was given; the install itself is asked for separately). No labelling and no model runs: that's SP-SUP2 proper, before Pro.

## What it is
An **observational** Claude Code hook on `Stop` and `Notification`:
- **Never blocks.** It's registered with `async: true`, so Claude Code doesn't wait for it, and it always exits 0 with no output.
- At each moment it reads the session transcript (the path comes from the hook input), rebuilds the **SP-SUP1 signals** (trigger, session minutes, idle, turns, tool calls, the last 5 tool categories, last exit code, tests, same-failure streak, files changed, tokens, permission, message flags), and **scrubs the last assistant message on the PC**.
- It appends one line per moment to `%LOCALAPPDATA%\Eucas\sup2-recordings\moments-<date>.jsonl`, in the SP-SUP1 corpus format plus `event` and `label: null`.
- Moments recorded: every **stop**, every **needs-you notification** (permission or idle), the first two **guard / permission blocks** of each kind per session, and a **test failure repeated 3×**.
- **Scrubbing, on device:**
  - code blocks and long inline code → `[code removed]`;
  - keys, tokens, JWTs, private keys, connection strings and `NAME=secret` → `[redacted]`;
  - emails, URLs and paths (including a Windows path that lost its backslashes) → placeholders;
  - the repo's folder name → `[repo]`; your Windows username and any extra names you list → `[person]`;
  - at most 500 characters, keeping the start and the end.
- Session ids are hashed. **No network calls**; nothing leaves the PC.

## Install and uninstall (one command each)
```bash
node spikes/SP-SUP2/recorder/install.mjs --dry-run   # prints exactly what changes, writes nothing
node spikes/SP-SUP2/recorder/install.mjs             # install
node "%LOCALAPPDATA%\Eucas\sup2-recorder\uninstall.mjs"          # remove the hooks + recorder, keep recordings
node "%LOCALAPPDATA%\Eucas\sup2-recorder\uninstall.mjs" --purge  # …and delete the recordings
node "%LOCALAPPDATA%\Eucas\sup2-recorder\status.mjs"             # how many moments so far (target 200–300)
```
What `install.mjs` changes in `~\.claude\settings.json` (a backup goes to `settings.json.eucas-sup2-backup`):
```json
"hooks": {
  "Stop":         [{ "hooks": [{ "type": "command", "command": "C:\\Program Files\\nodejs\\node.exe", "args": ["%LOCALAPPDATA%\\Eucas\\sup2-recorder\\record.mjs"], "async": true, "timeout": 15 }] }],
  "Notification": [{ "hooks": [{ "type": "command", "command": "C:\\Program Files\\nodejs\\node.exe", "args": ["%LOCALAPPDATA%\\Eucas\\sup2-recorder\\record.mjs"], "async": true, "timeout": 15 }] }]
}
```
Nothing else changes. Uninstall removes only entries pointing at `sup2-recorder`, so later edits to settings survive. Optional: set `EUCAS_SUP2_NAMES=Name1,Name2` (user env) to scrub more names.

## Test (isolated profile, mock API, 0 tokens)
Three scripted sessions recorded **5 moments**:
- `tool_blocked` (a push the guard denied, category `push`);
- `stopped` with a question;
- `test_failed` at a 3× streak (tests 3 passed / 1 failed, the file anonymised to `T1`);
- `stopped` after the loop;
- `stopped` with a message holding a code block, a GitHub token, an email and a Windows path → `"Done! I fixed ranking in [path]\n[code removed]\nI used GITHUB_TOKEN=[redacted] and emailed [email]. Should I push to main?"`.

No recorder errors; uninstall restored `settings.json` byte for byte (whitespace aside). Scrub unit tests: 9 / 9 (`node --test spikes/SP-SUP2/recorder/scrub.test.mjs`).

## Known limits
- Moments carry what the transcript says; tool output beyond the test summary isn't kept.
- Sessions started before the install begin recording within a few seconds (settings hooks hot-reload; SP-H1).
- Cloud sessions aren't recorded (they don't load local hooks).
