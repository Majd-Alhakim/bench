# ADR-0009: The guard is a short-lived native process; events reach the app over a named pipe with a spool fallback

- **Status:** Proposed (2026-10-26)
- **Date:** 2026-10-26

## Context
Claude Code starts the hook command once per hook event (PreToolUse, PostToolUse, PermissionRequest, Stop, Notification, SessionStart/End, ConfigChange). Matching hooks run in parallel, and sessions run tool calls in parallel. The guard must:
- decide PreToolUse in a few milliseconds, from local files only, whether or not the app runs;
- fail **closed** on any internal error (exit 2 with a reason, plus `onFailure: "block"` for crashes and timeouts);
- report a `check` event per call so the app can prove the heartbeat (UX principle 1), without slowing the decision.

## Options
| | Decision latency | Works with the app closed | Event delivery |
|---|---|---|---|
| `http` hook to the app | One local HTTP round trip | ❌ (ADR-0007) | Implicit |
| Long-lived daemon + tiny client exe | Lowest after warm-up | Only if the daemon runs (a second always-on process) | Daemon |
| **Short-lived exe; decides alone; best-effort event write** | Process start (~5–20 ms for a small signed Rust exe, **to measure in SP-H1** with Defender on) | ✅ | Pipe if the app listens, else spool file |

## Decision
**Short-lived `eucas-guard.exe`**, one invocation per hook event, subcommand per event (`pre-tool-use`, `post-tool-use`, `permission-request`, `stop`, `notification`, `user-prompt-submit`, `session-start`, `session-end`, `config-change`, `status-line`, `canary`). `onFailure: "block"` is set only on PreToolUse and PermissionRequest; every other hook is observational and must never block (a broken guard must not stop you disabling the plugin or let a stop be refused). The `user-prompt-submit` subcommand emits only "you answered in this session" and discards the prompt text unread.

**Exit codes on failure, per subcommand:** `pre-tool-use` and `permission-request` → deny (JSON on stdout if it can still write it, else exit 2). Every other subcommand → exit 0 with no output, so a panic in `stop` lets the agent stop (exit 2 there would force it to keep going, an unasked nudge). The crash note is written first, then the process exits.

**Decision path (PreToolUse), all local, no network ever:**
1. Read stdin (cap 1 MiB; over the cap → deny "input too large"). Parse with the versioned input schema; unknown fields ignored, missing required fields → deny.
2. Load the **compiled rulebook** (`%LOCALAPPDATA%\Eucas\guard\rulebook.bin`, written atomically by the app, checksum-verified; if missing or corrupt, use the built-in limits only and deny anything a user rule would have auto-approved, i.e. fall back to Claude Code's own prompt).
3. Evaluate: tripped-session flag → deny all · limits → deny · user rules → allow (exact command + folder scope) · otherwise no opinion (Claude Code's normal flow decides).
4. Write the decision to stdout as hook JSON; exit 0 (decided) or 2 (deny with reason on stderr for shells that need it).
5. Emit the `check` event (below) with a **5 ms total budget** for the whole emit. Claude Code waits for the process to exit, so the emit does add to the decision's wall time; the budget keeps it inside the 50 ms p95.

The limits guard in Program Files (ADR-0007) runs steps 1, 3 (tripped flag and limits only) and 4; it reads no user rulebook.

**Event channel:** the app hosts `\\.\pipe\eucas-events-<user SID>` (ACL: the current user only; the pipe name includes the SID so another user's session can't connect). The guard connects with a 3 ms timeout and writes one length-prefixed JSON frame. If the pipe isn't there or is busy, it appends the frame to `%LOCALAPPDATA%\Eucas\spool\<yyyymmdd>.jsonl` as **one `WriteFile` on a handle opened with only `FILE_APPEND_DATA`** (no lock; frames are kept under 4 KiB so each append lands whole; the ingester also skips any line that fails to parse). If that fails too, the event is dropped and a drop counter file is incremented, never the decision delayed. The app **watches the spool folder and ingests continuously** (not only at start), so a frame that fell back to the spool while the app runs still reaches the heartbeat within ~100 ms; it deletes segments once ingested. Frames carry `event_id` (UUIDv7), so ingest is idempotent.

**Questions that wait (`Stop` for the supervisor, `PermissionRequest` if S-2 passes):** the guard opens a second pipe, `\\.\pipe\eucas-ask-<SID>`, sends the moment, and waits up to the budget (Stop: 8 s; the hook timeout is 10 s). No answer, no app or any error → the default that hands back to the user (Stop: allow the stop and raise needs-you; PermissionRequest: no opinion, so the terminal prompt stays).

**Session and process identity:** the guard records its parent PID (the `claude` process) and that process's start time with each event, so the app can target the right process tree for the tripwire and detect PID reuse.

## Consequences
- The decision never depends on the app, the network or the server.
- A busy hour (6 sessions, ~1 tool call every 5 s each) is ~4,300 tool calls, which means **~14,000 guard starts** (two PreToolUse guards per call, PostToolUse for edit tools, status-line ticks; SYSTEM-DESIGN §2); at ~20 ms each that is ~4.7 CPU-minutes an hour, spread across cores. If SP-H1 measures much more, the fallback is a warm helper process with a tiny client (option 2), keeping the same decide-alone rule. Budget in TESTING.md §6: p95 ≤ 50 ms per PreToolUse on the reference PC, measured in CI on every PR (synthetic) and nightly (real CLI).
- The spool bounds itself: segments over 7 days or 50 MB total are dropped oldest-first, and the drop is logged as a guard event the user can see.
- The ask pipe is checked for spoofing: the guard verifies the pipe server is our signed `Eucas.exe` (SECURITY-PRIVACY T4).
- Windows-only code (pipes, the append-only spool, parent PID) lives in `crates/eucas-platform/src/windows/`; Unix gets a Unix-socket equivalent when macOS lands.

## Amendment 2026-10-26 (SP-H1, SP-SUP2 recorder)
- **Measured:** PreToolUse **p50 25 / p95 33 / p99 44 / max 48 ms** as Claude Code times its own hooks (300 calls, Defender on); inside the guard p95 0.55 ms. The short-lived exe stays; the warm-helper fallback isn't needed.
- **Cold start after every new binary: 130–196 ms** (Defender scans a newly written exe once). After writing a guard (install, update, Repair), the core runs `eucas-guard --version` once so the scan happens before a real hook. The p99 gate excludes that first run.
- **Exec form only** (ADR-0007 SP-H1 finding 1). The subcommand list and `onFailure` placement above are unchanged.
- **Stdout is hook JSON or nothing.** Claude Code treats exit 0 with non-JSON stdout as **no opinion** (the call runs), so a stray print is a silent allow. The guard writes all diagnostics to the spool or stderr only, and a fuzz test asserts stdout is always valid hook JSON or empty.
- **PermissionRequest crash or hang → explicit deny** ("blocking because onFailure is block"), as designed.
- **Observational hooks run with `async: true`** (`post-tool-use`, `notification`, `session-end`, `config-change`, `user-prompt-submit`): Claude Code doesn't wait for them, so they add no wall time (shown by the SP-SUP2 recorder). `pre-tool-use`, `permission-request` and `stop` (the supervisor's decision) stay synchronous. CPU cost per start is unchanged.
- **Parent identity by image path:** every Claude Code host on Windows names its process `claude.exe` (terminal CLI, the desktop app and its bundled CLI); the recorded parent includes the image path.
