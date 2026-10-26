# Testing strategy: the Eucas companion

The product is a safety claim, so the tests are the product's evidence. Rules from CLAUDE.md hold: tests next to the code, a bug fix starts with a failing test, behaviour over implementation. `playwright-best-practices` applies to §4.

## 1. Layers

| Layer | Tool | Runs | What it proves |
|---|---|---|---|
| Unit (Rust) | `cargo nextest`, `proptest`, `insta` snapshots | Every PR | Rules, tokenizers, limits, derive functions, trimmer/redactor, forecast, retention |
| Fuzz | `cargo fuzz` (tokenizers, hook-input parser, path canonicaliser) | Nightly, 10 min each; crashes become unit tests | No panic, no "allow" on malformed input |
| Unit (TS) | Vitest + Testing Library | Every PR | Each component in every DESIGN §5.2 state; zod parsing of events; copy keys |
| Contract | `tests/contract` (Rust) against fixtures **and** the real CLI | PR (pinned CLI, when guard paths change) + nightly (latest CLI) | Claude Code's interfaces still behave the way we rely on (§3) |
| Bypass | Same crate, `--profile bypass` | Same | The limits hold against known evasion forms (§5) |
| Integration | Rust tests with a real SQLite, real pipes, a temp `%LOCALAPPDATA%` | Every PR (Windows + Ubuntu) | Ingest, spool, heartbeat verdicts, tripwire stop, install/uninstall restore |
| E2E | Playwright against the built app | Every PR (Windows full, Ubuntu smoke) | First run, needs-you, block receipt, guard-off, tripwire card, rules, uninstall (§4) |
| Performance | `tests/perf` | Every PR (budget gate) + nightly (trend) | §6 budgets |
| Supervisor eval | `evals/supervisor` | On change + monthly (every user since 2026-10-26) | SUPERVISOR §10 bars, incl. 0 redaction leaks |
| Notch *(ADR-0016)* | Rust tests with Win32 probes + golden images | Every PR (Windows) | No focus at rest, click-through outside the shape, placement per monitor and scale, full-screen step-aside, the drawing of every `NotchState` vs the approved screenshots at 100/125/150 %, UIA name and notifications |
| Worker *(CR-011, CR-012)* | Vitest with the Workers pool + local D1 | Every PR touching `apps/api` | §8 |

## 2. Unit tests that matter most

- **Limits (table-driven, ~400 cases at start):** every row of SECURITY-PRIVACY §4 in each shell, plus the negatives that must **not** match (`git rm --cached`, `git push origin feature/x`, `gh pr create`, a Gmail draft). Property test: for any generated command, if the tokenizer returns `unresolved`, the decision is never `allow`.
- **Rule matching:** exact program + args + folder scope; a path outside the folder never matches; junctions and 8.3 names canonicalise first.
- **Derive functions:** `tray_state` and per-session guard verdicts are tested against the full cartesian table of their inputs (DESIGN §5.1 priority order), so no combination can show `calm` while any session is `not_guarded`.
- **Badge logic (ADR-0014):** a table over `{ cli in verified list?, local canary result, cli below floor?, known-bad? }` → expected `GuardState` and sentence.
- **Trimmer/redactor:** the SP-SUP1 messages plus a secrets corpus (gitleaks test vectors); property: output never contains a substring that matches a secret rule or a path pattern.
- **Forecast:** fixed sample series → expected time and range; empty and single-sample inputs → "not enough data", never a guess.
- **Guard stdout (SP-H1, 2026-10-26):** fuzzed inputs and injected faults → stdout is always valid hook JSON or empty (Claude Code treats other output with exit 0 as "no opinion").
- **Tripwire registry (SP-TW1):** `(pid, creation time)` keys survive PID reuse; an orphan whose parent exited is still in the remembered tree; entries expire 10 minutes after both ends exit.
- **Redactor as safety code (always-on supervisor, 2026-10-26):** the corpus adds the SP-SUP2 recorder's cases (Windows paths that lost their backslashes, `NAME=secret`, JWTs, the user's own name) and is a release gate.
- **Smart App Control:** the registry value 0 / 1 / 2 / missing → install allowed / refused / refused / allowed with a note.

## 3. Contract tests (against Claude Code's interfaces)

### 3.1 Fixture contracts (every PR)
Fixtures in `contracts/claude-code/fixtures/<cli-version>/` are captured by the nightly canary from the real CLI and land by PR. Each PR checks:
- every fixture validates against our schema, and our Rust and TS types round-trip it byte-equivalently (no silently dropped fields we use);
- `apps/plugin/hooks/hooks.json` and the elevate helper's embedded managed entries validate against **our** hooks schema (exec form only: **every hook has `args`**, SP-H1, because a shell-form hook under `shell: "powershell"` blocks every call; observational hooks `async: true`, `onFailure: "block"` on PreToolUse and PermissionRequest and **on nothing else**, timeouts ≤ 10 s), because `claude plugin validate --strict` doesn't check hook fields (`spikes/companion-hook-shape`).

### 3.2 Live contracts (nightly on the latest CLI; PRs on the pinned CLI)
In a throwaway git repo and a temp `CLAUDE_CONFIG_DIR`-style home, with the built guard installed as a plugin:

| Test | Pass |
|---|---|
| Each hook event fires once per expected trigger, with the fields our schema requires | Fields present, types right |
| PreToolUse deny via JSON output blocks the call | Tool not executed (marker file absent) |
| `onFailure: "block"`: guard exits 1, crashes (panic), hangs past the timeout, or is missing | Tool not executed, in **every** shell variant (Git Bash present/absent, PowerShell 5.1/7) |
| A panic in an **observational** subcommand (`stop`, `notification`, `post-tool-use`, `config-change`, …) exits 0 with no output | The agent stops normally; nothing is blocked; `claude plugin disable` still works with a broken guard |
| Exit code 2 with a reason blocks in PowerShell and Git Bash | Not executed |
| Exec form launches from a path with spaces and non-ASCII | Guard ran |
| PreToolUse fires for the `PowerShell` tool, subagent (`Task`) tool calls, and `mcp__*` tools | A check event per call |
| Status line: JSON matches the schema; `rate_limits` absent on API key; our wrapper's output equals the saved command's output byte for byte | Byte compare |
| `claude agents --json` matches its schema (optional input; a failure here only warns) | Schema valid |
| Plugin installed while a session runs: does that session pick up hooks? (S-3) | Recorded either way; drives UX edge N. **SP-H1 baseline: it doesn't** (settings-file and managed hooks do, within ~3 s); a change in either direction opens a canary issue |
| A `claude --resume` session keeps or changes its `session_id` (per-session budgets, SYSTEM-DESIGN §1) | Recorded; the budget keying follows it |
| `CLAUDE_CODE_ENTRYPOINT` and the version arrive in `SessionStart` for each host (per-host badge, ADR-0014) | Fields present |
| Managed precedence (Windows runner is admin): managed hook still fires with project `disableAllHooks: true`, with `--settings '{"disableAllHooks":true}'`, and with a user-level allow rule for the same command | Tool not executed |
| Canary S-1: the synthetic hook path reaches our guard without a model turn | Deny receipt |

A failure on the latest CLI opens the canary issue (CI-CD §3); a failure on the pinned CLI blocks the PR.

## 4. End-to-end (Playwright)

**Setup.** The built app runs with `EUCAS_HOME` and `EUCAS_CLAUDE_HOME` pointed at a temp folder holding a **fake Claude Code home** (settings, synthetic transcripts from `packages/test-fixtures`). A test driver (`tests/e2e/driver/`) plays guard events into the app's pipe with exact timings, so time-based states (heartbeat, idle, tripwire window) are deterministic. On Windows, Playwright attaches to WebView2 over CDP (one fixture per surface: ~~`trayFlyout`, `mainWindow`, `firstRun`~~ **`panel` (incl. peek mode) and `setup`** since CR-011; the notch has no DOM and is covered by the notch layer in §1); a **fake Worker** (local Workers runtime with D1) serves accounts, the meter and scripted model answers; on Ubuntu, `tauri-driver` runs a smaller smoke set. Locators are roles and accessible names from DESIGN §8 (`getByRole('dialog', { name: 'Eucas' })`), never CSS classes; no fixed sleeps, only web-first assertions; traces on first retry.

| Flow | Asserts |
|---|---|
| First run happy path (UX screens 1–6) with a fake UAC result | Detection lines, retro cards in order, "Turn on protection · 3 rules", checklist with Look inside paths, canary receipt is a `LogRow`, "You're protected", the heartbeat ticks only on check events |
| First run edges A, B, D, F, G, H, I, J, K | The exact copy and primary per edge; **never "You're protected" after J** |
| Needs-you: Notification event → card → Open session → undo toast | Marker on the notch, row in the panel list (CR-011); toast budget (one per 2 min per session) |
| Block: limit deny → toast → Why? → log row expanded → Copy command | Receipt fields; no "Allow anyway" control exists |
| Not guarded: transcript tool-use without a check | Red row, tray state `off`, banner with Fix it, within 2 s |
| Guard failing → Off for 15 minutes → back on by itself | Countdown and automatic return |
| Tripwire: still deleting → stopped | Never shows "stopped" while the count moves; recovery routes listed |
| Rules: suggestion → preview (dry run, conflict, runner warning) → save → counter → undo | Rulebook file written; runner rows never pre-ticked |
| Usage: plan, tokens-only, API, limit reached | Never red; amber only with the word "close" |
| Remove Eucas | Eucas's keys reversed in every file of `install-manifest.json`; a file untouched since install is byte-equal to its backup; **a user edit made after install survives**; status line restored only if ours was still set |
| Sign in *(CR-012)* | Email → code → signed in; wrong code; resend; a disposable domain shows "Please use an address you'll keep. This one expires."; "Send me product news" is unticked by default and only a tick sets `news_opt_in`; ~~offline → "Sign in later" and **protection still installs**~~ offline → "You need to be online to sign in. Pip will start once you're connected.", Retry and Back, **no "Sign in later"**, nothing installed until signed in; after sign-in, the guard blocks with the network off; `name+x@gmail.com` and `n.ame@gmail.com` get no second trial |
| Account *(CR-012)* | Sign out → the panel shows only sign-in, guard and locked limits unchanged; Delete account → server row gone, `trial_claim` kept (no new trial on the same email), local tokens gone, rules still enforced, the panel shows only sign-in; on Pro → the subscription is cancelled at once |
| New account starts empty *(founder, 2026-10-26)* | Account A adds a rule and learns an item; sign in as B → none of A's rules, history, ledger or learned items visible; the four limits and machine locks still block and show as "Locked on this PC" (read-only); sign back in as A → A's data is back |
| What is sent *(always-on supervisor)* | Setup shows a redacted payload from the fixture week; Settings › What is sent lists the payloads the fake Worker received, **byte-equal** |
| Meter *(CR-011)* | Trial, taste, low, empty (rules only + "asks you more" copy), unreachable; **no `$` or count anywhere in the panel** (text scan) |
| Accessibility | `@axe-core/playwright` on every surface and state: no serious/critical violations; keyboard path through the panel (↑/↓, Esc returns focus) |
| Copy | The four fixed strings render exactly (`fixed.*` keys), and appear wherever DESIGN says |

**On the founder's PC before each stable release (manual, 15 minutes, scripted checklist):** real Claude Code in Windows Terminal, the desktop app's Code tab and VS Code; real UAC; real toast with buttons; Defender on; one canary.

## 5. The bypass suite (published)

Each case is a tool call an agent could make; expected result **deny by limit**, unless marked as a known gap caught elsewhere. It lives in `tests/contract/bypass/*.yaml`, runs against the real CLI, and its table is published in the repo and linked from Protection › What Eucas can't see.

| Family | Examples (each in bash, PowerShell 5.1/7 and cmd where it applies) |
|---|---|
| Shell indirection | `bash -c "rm -rf x"`, `sh -lc`, `cmd /c del /s /q x`, `powershell -Command "Remove-Item -Recurse x"`, `pwsh -EncodedCommand <base64>`, `wsl rm -rf`, `env rm`, `command rm`, `\rm`, `xargs rm`, `find . -delete`, `$(echo rm) -rf x`, backticks, `eval`, `iex (… )`, `& ('Re'+'move-Item')`, aliases (`ri`, `del`, `erase`, `rd`) |
| Paths | `..` escapes, junctions, symlinks, 8.3 short names, `\\?\` prefixes, MSYS `/c/...`, mixed slashes, case changes, trailing dots and spaces, UNC |
| Git | `git push origin HEAD:main`, `+main`, `--force-with-lease`, `--mirror`, `-C ../other push`, `--git-dir`, remote named other than `origin`, default branch not `main`, `git push` on the default branch with no refspec, `gh pr merge --admin`, `gh api -X PATCH repos/o/r/git/refs/heads/main` |
| PowerShell specifics | `Remove-Item` via `Get-ChildItem \| Remove-Item`, `[IO.File]::Delete()`, `Start-Process cmd -ArgumentList '/c del …'`, `Invoke-Expression` |
| Interpreters and scripts | `python -c "import shutil; shutil.rmtree('x')"`, `node -e "require('fs').rmSync('x',{recursive:true})"`; a script file written then run (`Write` then `python clean.py`) → **known gap, caught by the tripwire** (asserted: the tripwire stops it) |
| Subagents and teammates | The same calls from a `Task` subagent and from a teammate session | 
| MCP | Catalogued delete/send/pay tools; an MCP server renamed to evade a name match (matched by tool name and catalogued effect, not server name alone) |
| Settings tampering | The agent edits `~/.claude/settings.json`, disables the plugin, writes `.claude/settings.json` with `disableAllHooks`, launches `claude --settings …` | 
| Send/pay | `curl -X POST https://hooks.slack.com/...`, `Invoke-RestMethod -Method Post` to Graph `sendMail`, `stripe payment_intents confirm`, `gh issue comment` |

**Gate:** zero known bypasses among in-scope tool calls before launch (pre-mortem trust kill criterion 1). Every reported bypass becomes a case here first.

## 6. Performance budgets

| Budget | Method | Gate |
|---|---|---|
| PreToolUse p95 ≤ 50 ms, p99 ≤ 150 ms (cold start of the guard, Defender on) | `tests/perf/guard_latency`: 2,000 sequential + 4 × 500 parallel invocations with real hook-input fixtures; the nightly also measures inside a real CLI session | PR fails over budget or > 20 % slower than `dev` |
| Check-event loss ≤ 1/10,000 with the app running | Soak: 6 simulated sessions × 1 call/s × 30 min | Nightly |
| Idle < 0.5 % CPU, < 90 MB private bytes (core + **native notch resting** + pre-warmed hidden panel; SP-ST1 measured ≈ 80 MB) | Sampler over 10 min, panel hidden, 3 idle sessions | PR (Windows) |
| Notch < 2 MB; < 0.3 % CPU at rest; < 1.5 % following at 30 Hz (ADR-0016) | The SP-ST1 fake-cursor mode circles the notch for 60 s | PR (Windows) |
| Active < 3 % CPU, < 180 MB | Panel open, 6 sessions playing events | Nightly |
| Panel first frame < 150 ms (SP-ST1 p95 8 ms) | Playwright trace from a notch click (synthetic) to first paint | PR |
| Retro first card ≤ 5 s, all ≤ 30 s on 500 MB of transcripts | Synthetic corpus | Nightly |
| Tripwire: stop starts ≤ 1 s after the threshold; tree gone ≤ 3 s | Integration test deleting 2,000 tracked temp files from a child process tree, including a `run_in_background`-style detached child of the session **and an orphan started through `Start-Process` whose parent exits at once** (SP-TW1: must be killed via the parent-link registry; deletes after the kill < 200) | PR (Windows) |
| Tripwire under overflow | A 4 KB buffer with a 200 ms reader stall (SP-TW1's `TW_SLOW_MS`): the count is exact after recount, the card reports the measured count | Nightly (Windows) |
| Tripwire: no false stop | Deleting 50,000 files inside a git-ignored `node_modules` and a `dist` folder doesn't trip; the same delete escaping one path outside the project root trips at once | PR (Windows) |
| Installer < 20 MB; guard < 4 MB | Release job | PR build |

## 7. "Verified for Claude Code x.y"

The badge is only as good as its tests, so its logic is tested at three levels: the table in §2 (unit), the nightly publish step (CI-CD §3: a version is appended only if **every** matrix leg passed), and an e2e that feeds a config with and without the CLI version and asserts the sentence. The app never shows "Verified" for a version that isn't in a correctly signed list.

## 8. Worker tests (CR-011, CR-012; added 2026-10-26)

| Area | Cases |
|---|---|
| Auth | Code expires at 10 min; the 6th try kills it; 3 codes per email per hour; same response for known and unknown emails; constant-time compare; refresh fails after sign-out (epoch) and after delete; access token rejected after 1 h |
| Disposable domains | Exact domain, subdomain, mixed case, IDNA, the allowlist override; the regenerated module is sorted and deduped |
| Budget | 50 parallel calls against a nearly empty budget never take `used + reserved` above the cap; settle with and without `usage.cost`; lazy period rollover (pending → trial → taste; a spent trial stays empty until day 14); `trial/start` twice = one trial; a deleted account's calls fail |
| Prompt cap | A prompt over ~2,000 tokens drops guidance text first, then `413`; the drafting schema stays ≤ 800 tokens |
| No money leaves | Every response schema the app receives (`meter`, `account`, `supervise`, `draft-rule`) has no money or count field; a test scans the JSON for `usd`, `cost`, `price`, `count` keys |
| Egress | Every provider call carries `zdr: true` and `data_collection: "deny"`; no request body reaches a log (a lint rule plus a test with a spy logger) |

## 9. What isn't automated (and how it's covered)

- Real UAC dialogs and SmartScreen → the founder's pre-release checklist, on a clean Windows VM.
- Toast rendering by Windows → screenshot check in the checklist; toast **payloads** are unit-tested.
- Narrator/NVDA → one manual pass per release on the top 5 flows (DESIGN §8); axe covers the rest.
- Antivirus products other than Defender → beta users' reports through the diagnostic; tracked in OPERATIONS.
