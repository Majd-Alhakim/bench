# ADR-0015: Local data: counts and metadata in SQLite, never the text of prompts or files

- **Status:** Proposed (2026-10-26). Includes a **copy change for the founder** (the privacy line, below).
- **Date:** 2026-10-26

## Context
The fixed privacy line in DESIGN §7.1 promises: "Eucas keeps counts, never the text of your prompts or files, and nothing leaves this PC." The retro, the ledger, the same-file warning, the log and the heartbeat all need data from transcripts, hooks and the status line. Microsoft Recall's backlash (UX research §3.1) shows a local plaintext activity store is judged by what it keeps.

The design also makes network calls that carry **no data about your work** but do leave the PC: update checks and the signed config (app version, channel, OS, a random rollout bucket), plus the opt-in ones (waitlist count, telemetry, crash reports, Pro Level 2). So "nothing leaves this PC" is not literally true as written.

## Decision
- **One SQLite database** (`%LOCALAPPDATA%\Eucas\eucas.db`, WAL mode, `rusqlite` with bundled SQLite, migrations in `crates/eucas-core/src/store/migrations/`). It holds only:
  - sessions: id, project folder hash + display name, vendor, CLI version, start/end, state history;
  - checks and log rows: time, session, tool kind, **program name** and the matched rule or limit id, decision; for blocks, the command text **as shown on the receipt** (the user needs it to run it themselves; capped at 512 chars, secrets redacted, deleted after 30 days);
  - file-touch events: path relative to the project, session, time, lines changed (for same-file; kept 24 h);
  - usage samples from the status line: token counts, cost, `rate_limits` percentages, reset times;
  - rule counters, suggestions (the exact command as a key, redacted, + folder + count), notification state, settings.
- **Transcripts are read, never copied.** The retro, the heartbeat and the rules parse `~/.claude/projects/**/*.jsonl` in a streaming reader. Kept from it: tool-use kinds, program names, file paths touched, token counts and timestamps. For **shell tool calls**, the full argv is extracted **in memory, redacted**, because suggestions, exact-command rules and the 7-day dry run need it; only the suggestion key and counts are stored. Message text, other tool inputs and all tool outputs are dropped in the parser and never reach the store, the logs or the renderer.
- **Never read:** `~/.claude/.credentials.json`, any OAuth token, the OS credential store entries of Claude Code, `.env` files, the `/fire` routine token (ADR-0002, SP-CR1 finding 3). A deny-list test asserts the file-access layer refuses these paths.
- **Retention:** raw check events roll up to per-minute counts after **24 hours** (the heartbeat strip needs 10 minutes, the log keeps its own rows), and to per-day after 90 days; same-file events 24 h; receipts 30 days; usage samples 90 days. A daily job enforces it and logs its own run.
- **Delete everything:** Settings › Remove Eucas and "Clear history" delete the database and the spool.
- **Copy change (founder decision):** reword the privacy line to "Eucas keeps counts, never the text of your prompts or files, and **nothing about your work leaves this PC unless you turn it on**." The design keeps that sentence true: always-on calls carry only version, channel, OS and a rollout bucket.

## Consequences
- With the reworded line, the privacy promise is literally true; the diagnostic and telemetry can't leak content because the store has none.
- The supervisor's Level 2 text is built in memory from the transcript tail at the moment of need and discarded after the call (SUPERVISOR.md §4).
- Size: a heavy day is ~35,000 checks at ~220 bytes a row with its index, about 7.7 MB of raw rows, rolled up after 24 hours to a few hundred KB, so the 50 MB budget for 90 days holds.
