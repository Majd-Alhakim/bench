# Code structure: the Eucas companion

Design only: this is the tree story **S1-1** creates (ADR-0003, ADR-0008). Nothing here exists yet except `docs/`, `.github/`, `spikes/`.

## 1. Repository tree

```text
/
├─ Cargo.toml                      # Rust workspace: members = crates/*, xtask, tests/contract
├─ rust-toolchain.toml             # channel pinned (e.g. 1.9x.0), targets x86_64-pc-windows-msvc, aarch64-pc-windows-msvc, x86_64-unknown-linux-gnu
├─ deny.toml                       # cargo-deny: licences (allow MIT/Apache-2.0/BSD/ISC/Unicode/Zlib/MPL-2.0), advisories, bans (see §3)
├─ .cargo/config.toml              # release profile: lto = "fat", codegen-units = 1, strip = true; plus a custom [profile.guard] (inherits = "release", panic = "abort", opt-level = "z") used with `--profile guard`, because Cargo can't set `panic` per package. The guard's panic hook writes the crash note, then exits with the per-subcommand code (ADR-0009)
├─ package.json                    # pnpm scripts (CLAUDE.md commands); "packageManager": "pnpm@<pinned>"
├─ pnpm-workspace.yaml             # apps/*, packages/*, evals/*, tests/e2e
├─ tsconfig.base.json              # ADR-0003 strict flags
├─ eslint.config.js                # flat config + boundary rules (§3)
├─ .prettierrc  lefthook.yml  .changeset/  .gitleaks.toml  .github/
│
├─ contracts/                      # SINGLE SOURCE OF TRUTH for every cross-language shape (JSON Schema 2020-12)
│  ├─ claude-code/                 # vendor input/output, versioned by the CLI version they were captured on
│  │  ├─ hook-input/{pre-tool-use,post-tool-use,permission-request,stop,subagent-stop,notification,user-prompt-submit,session-start,session-end,config-change}.schema.json
│  │  ├─ hook-output/{pre-tool-use,permission-request,stop}.schema.json
│  │  ├─ status-line.schema.json
│  │  ├─ agents-list.schema.json   # claude agents --json (optional input)
│  │  └─ fixtures/<cli-version>/*.json   # captured by the nightly canary; never hand-edited
│  ├─ guard-event.schema.json      # guard → core frames (check, needs, file_touch, usage, session, stop_moment, error)
│  ├─ rulebook.schema.json         # ADR-0010
│  ├─ install-manifest.schema.json # every file Eucas touched + backup + hash
│  ├─ elevate-op.schema.json       # the fixed operation enum + options for eucas-elevate (no free-form plan, SECURITY-PRIVACY T7)
│  ├─ ipc/
│  │  ├─ state.schema.json         # GuardState, SessionState, StopReason, TrayState, UsageMode, Session, NeedsItem, LogEntry, … (DESIGN §5.1, §11)
│  │  ├─ commands.schema.json      # renderer → core, one entry per Tauri command (§4)
│  │  └─ events.schema.json        # core → renderer
│  ├─ api/                         # app ↔ Worker
│  │  ├─ runtime-config.schema.json
│  │  ├─ verified-versions.schema.json
│  │  ├─ supervise-request.schema.json   # Level 2 only; Level 1 makes no call (SUPERVISOR §3–4)
│  │  ├─ supervise-response.schema.json
│  │  ├─ licence.schema.json
│  │  └─ waitlist.schema.json
│  ├─ errors.schema.json           # ErrorCode enum shared by Rust and TS
│  └─ copy/en.json                 # every user-visible string, incl. the four fixed strings (DESIGN §7.1); keys are stable
│
├─ crates/
│  ├─ eucas-types/                 # build.rs runs typify over contracts/ → generated types; + newtypes (SessionId, ToolUseId, RuleId), ErrorCode, Copy keys
│  ├─ eucas-platform/              # the ONLY place OS-specific code lives (ADR-0001 rule 1, Rust edition)
│  │  └─ src/{lib.rs, paths.rs, windows/{pipe.rs, spool_lock.rs, parent_process.rs, process_tree.rs, fs_watch.rs, foreground.rs, toast.rs, elevation.rs, registry.rs, acl.rs, version_info.rs}, unix/{socket.rs, process_tree.rs, fs_watch.rs}}
│  ├─ eucas-rules/                 # neutral ToolCall model, shell tokenizers (bash, pwsh, cmd), limit matchers, rule matching, compiler, dry run, suggestions
│  │  └─ src/{lib.rs, tool_call.rs, shell/{bash.rs, powershell.rs, cmd.rs, resolve.rs}, limits/{delete.rs, push_default.rs, send.rs, pay.rs, catalogue.rs}, rule.rs, compile.rs, dry_run.rs, suggest.rs, conflicts.rs}
│  ├─ eucas-adapters/              # vendor hook input → ToolCall, decision → vendor hook output
│  │  └─ src/{lib.rs, claude_code/{input.rs, output.rs, settings_read.rs, version.rs}}   # cursor/ lands with the Cursor story
│  ├─ eucas-guard/                 # BIN. Deps: types, platform, rules, adapters ONLY (no tokio, no sqlite, no tauri, no network crates)
│  │  └─ src/{main.rs, cmd/{pre_tool_use.rs, post_tool_use.rs, permission_request.rs, stop.rs, notification.rs, session.rs, config_change.rs, status_line.rs, canary.rs}, emit.rs, rulebook_load.rs, tripped.rs, limits_only.rs}
│  ├─ eucas-elevate/               # BIN, requireAdministrator manifest; fixed operations only (install, repair, pause-limits, resume-limits, remove, update-limits-guard), managed entries and the limits guard embedded; installs itself to Program Files
│  ├─ eucas-core/                  # LIB, no Tauri types (so a different shell can host it, ADR-0008 kill criterion)
│  │  └─ src/
│  │     ├─ lib.rs  app_state.rs (the store)  derive.rs (trayState, HeartbeatLine — pure fns)
│  │     ├─ ingest/  sessions/  heartbeat/  transcripts/  tripwire/  samefile/  ledger/
│  │     ├─ installer/ (plugin, status line, managed plan, uninstall)  canary/  notify/ (policy, budget)  diagnostic/
│  │     ├─ store/ (rusqlite, migrations/*.sql, retention.rs)  config/ (signed config client, verified list)  updates/
│  │     ├─ supervisor/ (rules_v2.rs, signals.rs, trimmer.rs, redactor.rs, client.rs, overrides.rs)      # Pro, flag-gated
│  │     ├─ cloud/ (branch_rules.rs, routine_body.rs, runs.rs)                                         # Pro beta, flag-gated
│  │     └─ retry.rs                # the ONE retry/backoff helper (CLAUDE.md)
│  ├─ eucas-app/                   # BIN, Tauri 2. tauri.conf.json, capabilities/*.json, icons/ (tray ICOs per TrayState × OS theme)
│  │  └─ src/{main.rs, commands.rs, events.rs, tray.rs, context_menu.rs, windows/{tray_flyout.rs, main_window.rs, first_run.rs}, single_instance.rs, autostart.rs}
│  └─ xtask/                       # cargo xtask: codegen (contracts → Rust/TS), check-deps (§3), build-plugin, build-marketplace, sbom, release helpers
│
├─ apps/
│  ├─ companion/                   # the renderer (Vite + React 19 + TS + Tailwind + shadcn); no Node APIs, no fetch except via ipc/
│  │  └─ src/
│  │     ├─ main.tsx  routes.tsx  store.ts (mirror of core state, updated only by events)
│  │     ├─ ipc/                   # the ONLY module that imports @tauri-apps/api; parses every event with zod
│  │     ├─ surfaces/{tray-flyout, main-window, first-run-window}/
│  │     ├─ screens/{today, rules, protection, usage, retro, settings}/
│  │     └─ components/<kebab-name>/   # one folder per DESIGN §4 component (§2)
│  ├─ api/                         # Cloudflare Worker (Hono + zod), wrangler.toml with [env.staging] and [env.production]
│  │  └─ src/{index.ts, routes/{config.ts, updates.ts, waitlist.ts, licence.ts, supervise.ts}, quota-do.ts, providers/openrouter.ts, prompts/, scan/secrets.ts}
│  └─ plugin/                      # plugin SOURCE: .claude-plugin/plugin.json, hooks/hooks.json, settings.json (shape proven in spikes/companion-hook-shape)
│
├─ packages/
│  ├─ contracts-ts/                # GENERATED: zod schemas + types from contracts/ (do not edit)
│  ├─ copy/                        # typed accessor over contracts/copy/en.json (+ the fixed-strings module)
│  ├─ ui-tokens/                   # tokens.css + tokens-notch.css (moved from docs/design at S1-1; docs link here)
│  └─ test-fixtures/               # transcript corpora (synthetic), status-line samples, hook inputs for unit tests
│
├─ evals/supervisor/               # SP-SUP1 harness as a regression suite (SUPERVISOR §10)
├─ tests/
│  ├─ contract/                    # Rust test crate: drives the REAL claude CLI (canary + bypass suite)
│  ├─ e2e/                         # Playwright against the built app (WebView2 over CDP on Windows)
│  └─ perf/                        # guard latency bench, idle CPU/RAM sampler
├─ config/runtime-config.default.json   # bundled fallback config (signed at build), used offline
├─ installer/                      # NSIS templates (per-user), uninstaller hook → `Eucas.exe --remove`
├─ spikes/                         # throwaway proofs (never imported)
└─ docs/
```

## 2. UI component map (names match DESIGN §4 and §5.1 exactly)

| DESIGN name | Where | Notes |
|---|---|---|
| `TrayIcon` | `crates/eucas-app/src/tray.rs` + `icons/tray/{calm,needs,off,unverified,paused,setup}-{dark,light,hc}.ico` | `Tray.setImage` + `setToolTip(sentence)`; state from `derive::tray_state` |
| `ContextMenu` | `crates/eucas-app/src/context_menu.rs` | Native Windows 11 menu; no "turn off protection" item |
| `WinToast` | `crates/eucas-core/src/notify/toast.rs` → `eucas-platform::windows::toast` | Kinds = DESIGN §4.18 rows (`NeedsYou`, `Done`, `Blocked`, `Tripwire`, `SameFile`, `GuardOff`, `NearLimit`, `FirstSession`, `Grouped`) |
| `TrayFlyout` | `apps/companion/src/surfaces/tray-flyout/` | Frameless, always-on-top window positioned from tray bounds; pre-warmed, hidden on blur |
| `MainWindow` = `Caption` + `Sidebar` + `Layer` + `PageHead` | `surfaces/main-window/` | Mica via `window-vibrancy` on Windows 11 |
| `FirstRunWindow`, `UacFrame`, `CanaryLog`, `PinHelper` | `surfaces/first-run-window/` | `Installer` is NSIS, not React |
| `HeartbeatLine` (`inline`, `stack`, `big`), `HeartbeatStrip` (`fill`, `sm`) | `components/heartbeat-line/`, `components/heartbeat-strip/` | Driven by `check` events only |
| `NeedsYouCard`, `SuggestedRuleChip`, `SuggestedRuleRow`, `RulePreview`, `RuleCard`, `LimitsPanel` | `components/<kebab-name>/` | |
| `UsageMeter`, `ForecastLine`, `LedgerTable` | `components/…` | |
| `SameFileCard`, `ProtectionStatusCard`, `LogRow`, `Checklist`, `Diagnostic`, `UndoToast`, `TripwireCard`, `Banner`, `ProLine` | `components/…` | `TripwireCard` is the only `alertdialog` |

Files are kebab-case (`needs-you-card.tsx` exports `NeedsYouCard`). Each component folder holds the component, its `*.test.tsx` (Vitest + Testing Library, every state in DESIGN §5.2) and nothing else.

## 3. Module boundaries (enforced, not hoped for)

**Rust (Cargo graph + `cargo xtask check-deps` in CI):**

| Crate | May depend on | Must not depend on |
|---|---|---|
| `eucas-types` | serde, typify output | anything of ours |
| `eucas-platform` | types, `windows` crate (cfg windows) | rules, core, tauri |
| `eucas-rules` | types | platform, core, tauri, any I/O crate (pure; property-tested) |
| `eucas-adapters` | types, rules | core, tauri |
| `eucas-guard` | types, platform, rules, adapters | **tokio, rusqlite, reqwest/hyper, tauri, core** (size, start-up, no network: banned in `deny.toml` for this crate via `xtask check-deps`) |
| `eucas-elevate` | types, platform | core, tauri, network |
| `eucas-core` | types, platform, rules, adapters, tokio, rusqlite, reqwest (rustls) | **tauri** |
| `eucas-app` | core, tauri + official plugins | — |

**TypeScript (ESLint `no-restricted-imports` + `import/no-restricted-paths`):**
- `apps/companion/src/**` may not import `@tauri-apps/*` except in `src/ipc/**`.
- `components/**` may not import `screens/**`, `surfaces/**` or `ipc/**` (props in, callbacks out).
- Nothing imports `packages/contracts-ts/src/**` internals; only its index.
- `apps/api/**` and `apps/companion/**` never import each other; both import `packages/contracts-ts`.
- `console.log` is an error in `apps/api` (no payload logging, ADR-0012); allowed `console.error` takes only `{ route, status, requestId }`.
- No raw hex colours in components (`no-restricted-syntax` on `/#[0-9a-f]{3,8}/i` in `.tsx`; tokens only, DESIGN §3).

## 4. IPC contract (renderer ↔ core)

Tauri **commands** (renderer → core). Args are Rust structs with `#[serde(deny_unknown_fields)]`, generated from `contracts/ipc/commands.schema.json`; every command returns `Result<T, IpcError { code: ErrorCode, message_key }>`. The capability file allow-lists exactly these.

| Command | Args | Effect | Idempotent |
|---|---|---|---|
| `get_snapshot` | — | Full store | yes |
| `open_session` | `session_id` | Focus the session's window (S-4) | yes |
| `snooze_needs` / `undo` | `needs_id, minutes` / `undo_token` | Snooze; undo within 10 s | yes (token) |
| `allow_once` | `needs_id` | Only when S-2 passed and the flag is on | yes (needs_id) |
| `rule_preview` | `suggestion_id \| rule_draft` | Dry run over 7 days + conflicts | yes |
| `rule_save` / `rule_toggle` / `rule_delete` | `draft, client_key` / `rule_id, enabled` / `rule_id` | Writes rulebook.json atomically, recompiles rulebook.bin | yes (client_key) |
| `run_canary` | — | Local canary | yes (single-flight) |
| `run_diagnostic` / `export_report` | — / `format: md \| file` | Redacted report | yes |
| `repair_guard` | — | Re-install plugin from the local marketplace; re-run canary | yes |
| `protection_off` | `minutes: 15` (only allowed value) | Only from `failing`: disables the plugin (`claude plugin disable eucas@eucas`) and re-enables it when the time is up; admin-mode limits use `pause_limits` instead | yes |
| `pause_notifications` | `until` | — | yes |
| `tripwire_expected` | `session_id, folder` | Adds folder to that project's tripwire allow list | yes |
| `export_log` | `format: md \| csv, filter` | Save dialog | yes |
| `firstrun_*` | per step | Detection, plan, apply, canary, finish | yes (step id) |
| `use_admin` | — | Retry the UAC step | yes |
| `waitlist_join` / `waitlist_dismiss` | `moment` | D-2 (b) | yes |
| `pause_limits` / `resume_limits` | — | Admin-mode escape from a limits-guard brick (SYSTEM-DESIGN §7.1); one UAC prompt each | yes |
| `remove_eucas` | — | Reverses Eucas's keys from `install-manifest.json` (your later edits stay); one UAC prompt | yes |

**Events** (core → renderer): `state_patch` (a list of `{ path, value }` replacements on the store, sequence-numbered; the renderer resyncs with `get_snapshot` on a gap), `undo_offer`, `focus_request`. The renderer parses every event with the generated zod schema; a parse failure is a bug report in the diagnostic, never a crash.

## 5. Local database schema (ADR-0015)

```sql
-- crates/eucas-core/src/store/migrations/0001_init.sql (STRICT tables, WAL)
CREATE TABLE session (
  id TEXT PRIMARY KEY, vendor TEXT NOT NULL, folder_hash TEXT NOT NULL, folder_name TEXT NOT NULL,
  cli_version TEXT, pid INTEGER, pid_started_at INTEGER, state TEXT NOT NULL, guard_state TEXT NOT NULL,
  first_seen_at INTEGER NOT NULL, last_check_at INTEGER, ended_at INTEGER) STRICT;
CREATE TABLE check_event (
  event_id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES session(id), tool_use_id TEXT,
  at INTEGER NOT NULL, tool_kind TEXT NOT NULL, program TEXT, decision TEXT NOT NULL,
  decided_by TEXT, latency_us INTEGER NOT NULL) STRICT;
CREATE INDEX check_by_session_time ON check_event(session_id, at);
CREATE TABLE check_rollup (session_id TEXT NOT NULL, bucket_start INTEGER NOT NULL, bucket_secs INTEGER NOT NULL,
  checks INTEGER NOT NULL, denies INTEGER NOT NULL, PRIMARY KEY (session_id, bucket_start, bucket_secs)) STRICT;
CREATE TABLE log_entry (id TEXT PRIMARY KEY, at INTEGER NOT NULL, session_id TEXT, kind TEXT NOT NULL,
  what TEXT, why_key TEXT NOT NULL, decided_by TEXT, raw TEXT, expires_at INTEGER NOT NULL) STRICT;
CREATE TABLE file_touch (session_id TEXT NOT NULL, worktree TEXT NOT NULL, path TEXT NOT NULL, at INTEGER NOT NULL,
  lines_changed INTEGER, PRIMARY KEY (session_id, path, at)) STRICT;
CREATE INDEX touch_by_path ON file_touch(worktree, path, at);
CREATE TABLE usage_sample (session_id TEXT NOT NULL, at INTEGER NOT NULL, input_tokens INTEGER, output_tokens INTEGER,
  cost_micro_usd INTEGER, five_hour_pct INTEGER, five_hour_resets_at INTEGER, seven_day_pct INTEGER,
  seven_day_resets_at INTEGER, PRIMARY KEY (session_id, at)) STRICT;
CREATE TABLE rule_counter (rule_id TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, last_used_at INTEGER) STRICT;
CREATE TABLE suggestion (program_args TEXT NOT NULL, folder TEXT NOT NULL, manual_allows INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL, dismissed INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (program_args, folder)) STRICT;
CREATE TABLE needs_item (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, kind TEXT NOT NULL, since INTEGER NOT NULL,
  summary TEXT, snoozed_until INTEGER, resolved_at INTEGER) STRICT;
CREATE TABLE canary_run (id TEXT PRIMARY KEY, cli_version TEXT NOT NULL, path TEXT NOT NULL, result TEXT NOT NULL,
  at INTEGER NOT NULL) STRICT;
CREATE TABLE setting (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
```

Counters update atomically (`INSERT … ON CONFLICT DO UPDATE SET count = count + 1`); ingest writes in one transaction per batch (≤ 200 events or 250 ms). Money is integer micro-dollars; percentages integers ×100 where needed.

## 6. Typed errors

- **Rust:** each crate has a `thiserror` enum; every variant maps to one `ErrorCode` from `contracts/errors.schema.json` (`code()`), and `match` arms are exhaustive (no `_ =>` on our own enums; clippy `wildcard_enum_match_arm` denied).
- **TS:** `class EucasError extends Error { constructor(readonly code: ErrorCode, readonly messageKey: CopyKey) }` in `packages/contracts-ts`; `checkNever()` in every `switch` over a union.
- **Guard rule:** any error inside PreToolUse resolves to a deny with the copy key `guard.internal_error` and code `GUARD_INTERNAL`; there is no code path that turns an error into an allow (tested by fault injection, TESTING §3.2).

## 7. Naming

- Rust enums serialise as the DESIGN strings: `GuardState::NotGuarded` ↔ `"not_guarded"` (`#[serde(rename_all = "snake_case")]`).
- Limit ids: `limit.delete`, `limit.push_default`, `limit.send`, `limit.pay`. Rule ids: `rule_<uuidv7>`. Event kinds = `guard-event.schema.json` `kind` values.
- Copy keys mirror surfaces: `tray.tooltip.calm`, `toast.blocked.title`, `fixed.promise`, `fixed.guard`, `fixed.gap`, `fixed.privacy`.
