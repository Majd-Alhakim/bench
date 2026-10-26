# Build plan: the Eucas companion v0.1

**Scope:** the pre-mortem's cut-down v0.1 (SYSTEM-DESIGN §1): Pro shown as a waitlist line, no notch, no payments, no supervisor, no cloud hand-off. **Added by CR-010 (founder, 2026-10-26):** choosing and locking your rules in setup (A-2), prompted rules (R-2) and the plain-code guided merge (M-1) are in v0.1's Free tier, and v0.1 ships **without Authenticode signing** (ADR-0013). **Estimates** are focused build days for the founder working with Claude (one Claude developer lane, founder reviewing), from the pre-mortem's per-item figures adjusted for this design. They are estimates, not commitments; the day-6 re-plan (CR-009 practice) corrects them.

## 1. Gate 6 prerequisites

| # | Item | Owner | Blocks |
|---|---|---|---|
| P1 | Founder approves ADR-0007 … 0015 (or changes them) | Founder | Everything |
| P2 | ~~D-3 signing route chosen and identity validation started now~~ **Resolved (CR-010, 2026-10-26): no Authenticode signing in v0.1.** Updates stay signed with the Tauri updater's Ed25519 key; installer SHA-256s are published on the site; Authenticode comes once revenue covers it (ADR-0013) | Founder | — |
| P3 | CR-010 (the companion-first change request the pre-mortem calls for) approved with the v0.1 scope above | Founder + BA | Backlog baseline |
| P4 | Spikes in §2 at GO | Tech lead | The stories they name |
| P5 | Landing page + waitlist for 2 weeks (pre-mortem's cheapest test), if the founder wants the signal before building | Founder | Optional go/no-go |
| P6 | Naming: user-visible artefacts and crates named `eucas-*` (resolved: the rename to Eucas is done, CR-010; SYSTEM-DESIGN header) | Founder | S1-1 |
| P7 | Copy: the privacy line becomes "…nothing about your work leaves this PC unless you turn it on" (ADR-0015), and the diagnostic line "…no paths to your projects or files…" (OPERATIONS §3) | Founder + UI | O-1, D-1 |

## 2. Spikes still needed before Gate 6

Each on a `spike/*` branch, throwaway code under `spikes/`, a report in `docs/spikes/`. Order = dependency order.

| Spike | Question | Cost | GO bar | If NO-GO |
|---|---|---|---|---|
| **SP-H1** hook attach path (folds in S-3, S-5, F31, trust §7 unknowns) | With a minimal Rust guard as a user-scope plugin on CLI ≥ 2.1.310: do all events fire in the terminal, the desktop app's local sessions and VS Code? Does `onFailure: "block"` block on crash, hang, exit 1 and a missing exe, with Git Bash present and absent, PowerShell 5.1 and 7, native and npm installs? p95 latency with Defender on? Does a running session pick up a newly installed plugin? Can a plugin ship the main `statusLine`? Which managed source does the CLI read, and do managed hooks survive a project `disableAllHooks` and `--settings`? Can the agent edit `~/.claude/settings.json` despite deny rules? Which signal shows "tool ran, no check" fastest? | **1.5 d** | All fail-closed cases block; p95 ≤ 50 ms; managed hooks survive lower-scope disables | Any fail-open case with no workaround → stop and re-plan (it's the core); latency over → long-lived helper (ADR-0009 option 2) |
| **SP-ST1** Tauri shell on Windows | Tray icon swaps + tooltip; flyout positioned at the tray at 100/125/150 %; toasts with buttons and click activation (app running); updater round trip with a signed manifest; Playwright over WebView2 CDP; idle RAM/CPU with the pre-warmed flyout, against an Electron hello-tray on the same PC | **1 d** | Everything works or has a named workaround; idle < 90 MB with the flyout pre-warmed, popover first frame < 150 ms | ADR-0008 kill criterion: Electron shell + the same Rust guard and rules (via napi-rs) |
| **S-1** hook-only canary | Can the canary drive our guard through the real Claude Code hook path without a model turn? | 0.5 d | A deny receipt with 0 tokens | Real model turn (~400 tokens), copy says so (D-5) |
| **SP-TW1** tripwire | `ReadDirectoryChangesW` under a 50,000-file delete (buffer overflow handling), path attribution with 3 sessions, process-tree kill and verify, delete continuing after kill | 1 d | Stop ≤ 1 s after threshold, tree gone ≤ 3 s, no missed overflow | Lower thresholds + per-folder watch; ETW service moves up to v0.2 |
| **S-4** Open session | Find and focus the window hosting a session (Windows Terminal, conhost, VS Code, the desktop app) from the session pid | 0.5 d | Focus works for the top 3 hosts; names the tab otherwise | Name it only |
| **S-6** tray settings deep link | Is there a deep link to Settings › Personalization › Taskbar › Other system tray icons on current Windows 11 builds (first-run screen 6)? | 0.25 d | A link that opens the right page | Numbered steps (UX already designed) |
| **S-2** Allow once (optional for v0.1) | Can a waiting `PermissionRequest` hook answer from the app without racing the terminal prompt? | 0.5 d | No double prompt, no lost answer, in 50 trials | No "Allow once" in v0.1 (the design already covers it) |
| **SP-SUP2** (Pro, before Pro launch, not v0.1) | Supervisor on at least 300 real, blind-labelled moments | 2 d + labelling | SUPERVISOR §10 bars | Pro ships without the model (rules-only) |

**Spike total before G6: about 5 days** (SP-H1, SP-ST1, S-1, SP-TW1, S-4, S-6; S-2 optional).

## 3. Sliced backlog (v0.1)

Stories are vertical slices; each task inside is ≤ 1 day of agent work and names its files, tests and dependencies in the sprint plan (`/plan-sprint`). Every story ends with a trace/log event visible in the UI (CLAUDE.md).

| ID | Story (slice) | Main files | Tests | Est. | Depends |
|---|---|---|---|---|---|
| **S1-1** | Monorepo scaffold: pnpm + Cargo workspaces, `contracts/` + `xtask codegen`, lint/format/typecheck, lefthook, changesets, CI jobs `ts`, `rust`, `contracts`, `licences`, `dependency-review` | root configs, `crates/eucas-types`, `packages/contracts-ts`, `.github/workflows/ci.yml` | codegen round-trip test | 1.5 | G6 |
| **G-1** | Neutral `ToolCall` + shell tokenizers (bash, PowerShell, cmd) + path canonicaliser | `crates/eucas-rules/src/{tool_call,shell/*}.rs`, `eucas-platform/src/windows/paths.rs` | unit + proptest + fuzz target | 1.5 | S1-1 |
| **G-2** | The four limits + catalogue + self-protection | `crates/eucas-rules/src/limits/*` | ~400 table cases (TESTING §2) | 1.5 | G-1 |
| **G-3** | Guard binary: PreToolUse decide → hook JSON, fail-closed paths, check event over pipe with spool fallback, tripped flag | `crates/eucas-guard/**`, `eucas-adapters/claude_code/*`, `eucas-platform/windows/{pipe,spool,parent_process}.rs` | fault injection (panic, hang, bad input; observational subcommands exit 0), latency bench with the 5 ms emit cap | 1 | G-2 |
| **G-4** | Plugin + local marketplace + install/uninstall through `claude plugin` | `apps/plugin/**`, `xtask build-plugin`, `eucas-core/installer/plugin.rs` | `plugin validate --strict`, our hooks schema, install/restore test | 0.5 | G-3 |
| **G-5** | Contract + bypass suites on the pinned CLI in CI (`guard-contract`, `plugin` jobs) | `tests/contract/**` | the suites themselves | 1 | G-4 |
| **A-1** | Admin limits: `eucas-elevate` (fixed operations, embedded payload), managed merge recorded as a JSON patch, limits guard install, `pause-limits`/`resume-limits`, user-level fallback (deny patterns in user settings), key-level remove | `crates/eucas-elevate/**`, `eucas-core/installer/managed.rs` | precedence tests on the admin runner; swapped-helper hash test (unsigned v0.1, SYSTEM-DESIGN §5.6); a user edit survives remove | 1.5 | G-3 |
| **U-1** | Tauri shell: tray icon states + tooltip, context menu, flyout window, main window shell (Caption, Sidebar, Layer), store + `state_patch` events, single instance, autostart | `crates/eucas-app/**`, `apps/companion/src/{ipc,store.ts,surfaces/*}` | derive-function table tests; Playwright smoke | 1.5 | S1-1, SP-ST1 |
| **H-1** | Ingest + sessions + transcript tail + heartbeat verdicts → `HeartbeatLine`, `HeartbeatStrip`, session rows | `eucas-core/{ingest,sessions,transcripts,heartbeat}`, `components/heartbeat-*` | "not guarded within 2 s" integration test; component states | 1.5 | G-3, U-1 |
| **C-1** | Canary: local (S-1 path), verified list client, badge logic; nightly `canary.yml` with issue filing and signed `verified-versions` | `eucas-core/canary`, `eucas-core/config`, `.github/workflows/canary.yml`, `xtask canary-*` | badge table; workflow dry run | 1.5 | G-5, H-1 |
| **T-1** | Tripwire: watch, count, attribute, stop tree, verify, `TripwireCard` both states, "This was expected" | `eucas-core/tripwire`, `eucas-platform/windows/{fs_watch,process_tree}.rs`, `components/tripwire-card` | 2,000-file delete integration test; e2e | 1.5 | H-1, SP-TW1 |
| **N-1** | Needs-you: Notification/Stop → `NeedsYouCard` (popover + Today), notification policy, `WinToast` kinds, Open session (S-4), `UndoToast`, pause notifications | `eucas-core/notify`, `eucas-platform/windows/{toast,foreground}.rs`, `components/{needs-you-card,undo-toast}`, `screens/today` | toast budget unit tests; e2e | 1.5 | H-1 |
| **L-1** | Status-line wrapper (chain + tee; restore only if ours is still set), usage samples, forecast, `UsageMeter`, `ForecastLine`, `LedgerTable`, Usage screen (4 modes) | `eucas-guard/cmd/status_line.rs`, `eucas-core/ledger`, `screens/usage` | byte-equal output test; forecast fixtures | 1.5 | G-4, U-1 |
| **F-1** | Same-file warning: `SameFileCard` (full + compact), toast, resolve on commit | `eucas-core/samefile`, `components/same-file-card` | window and worktree cases | 0.75 | H-1 |
| **M-1** *(CR-010)* | Guided merge, plain code (no AI, never writes code): from `SameFileCard`, **Merge safely** checks both trees are clean, rebases the later branch onto the earlier one, runs the project's test command, then opens the PR with `gh` when it's installed and signed in (otherwise shows the exact command to copy). A rebase conflict or a failing test stops it: it aborts the rebase, names the files, and leaves both branches as they were | `eucas-core/samefile/merge.rs`, `components/guided-merge` | temp-repo integration tests: clean merge, conflict → abort and restore, failing tests → stop, no `gh` → command shown | 1.5 | F-1 |
| **R-1** | Rules: rulebook schema + compiler + `rulebook.bin`, suggestions from manual allows, 5 templates, dry run, conflicts with the user's ask/deny, runner warning, counters; `LimitsPanel`, `SuggestedRuleRow`, `RulePreview`, `RuleCard`, `SuggestedRuleChip` | `eucas-rules/{rule,compile,dry_run,suggest,conflicts}.rs`, `screens/rules` | compiler rejects limit overlap; e2e add/undo | 1.5 | G-2, U-1 |
| **R-2** *(CR-010)* | Prompted rules: you describe a rule in plain words; the Worker's `/v1/draft-rule` sends **only that sentence** and the rulebook schema to the provider-hosted `gpt-oss-120b` (zero data retention, ADR-0012); the answer must validate as an **exact rule** (exact commands, no globs or regex, ADR-0010), compile, pass the bypass suite and never overlap a limit, or it's rejected with the reason; `RulePreview` shows exactly what it allows or blocks; nothing is enabled until you confirm. Each draft counts toward the supervisor budget | `apps/api/src/routes/draft-rule.ts`, `contracts/api/draft-rule-*.schema.json`, `eucas-rules/compile.rs`, `screens/rules` | schema strictness; invalid or limit-overlapping drafts rejected; e2e describe → preview → confirm | 1.5 | R-1, W-1 |
| **A-2** *(CR-010, D-4)* | Choose and lock your rules: the first-run **Choose your rules** step before the UAC step (the four limits always on, each with a lock choice; other library rules on or off; add your own through R-2); per-limit `locked` / `not locked` state and label; changing the locked set later goes through `eucas-elevate` (a new fixed operation, `update-locked-set`) and asks for admin again | `surfaces/first-run-window/choose-rules`, `eucas-core/installer/managed.rs`, `crates/eucas-elevate` | the four limits can't be switched off; decline UAC → user scope, labelled not locked; relock asks for admin | 1 | A-1, R-1 |
| **P-1** | Protection screen: `ProtectionStatusCard`, sessions, `LogRow` with filters and export, What Eucas can't see, `Banner` rules | `screens/protection`, `components/{protection-status-card,log-row,banner}` | export formats; e2e block receipt | 1 | H-1, C-1 |
| **O-1** | First run: `FirstRunWindow` steps 1–6, detection checklist, retro (streaming, 4 cards, first ≤ 5 s), Choose your rules (A-2), install plan + `UacFrame`, `CanaryLog`, `PinHelper`, edges A–Q | `surfaces/first-run-window`, `eucas-core/{transcripts/retro.rs,installer/plan.rs}` | 500 MB corpus perf; e2e per edge | 2 | A-1, A-2, C-1, R-1, L-1 |
| **D-1** | Diagnostic: checklist, repairs, Copy/Save, Open an issue | `eucas-core/diagnostic`, `components/diagnostic` | redaction test (only known-folder-relative paths, project names only by display name, no tokens) | 0.5 | H-1, C-1 |
| **W-1** | Worker v0.1: `/v1/config`, `/v1/updates`, `/v1/waitlist`, `/v1/telemetry`; staging + production; signed config tooling; `ProLine` (D-2 b); Settings (Privacy, Updates, Appearance, Remove Eucas) | `apps/api/**`, `xtask config`, `components/pro-line`, `screens/settings` | Workers-pool tests; schema strictness | 1.5 | S1-1, U-1 |
| **R1** | Release: NSIS per-user installer (**no Authenticode in v0.1**, CR-010), Tauri updater with its Ed25519 key + channels, installer SHA-256s published with each release and on the site, staged rollout, SBOM, provenance, `release.yml`, `deploy-api.yml`, verify job (updater signature + published hash) | `installer/**`, `.github/workflows/{release,deploy-api}.yml`, `tauri.conf.json` | install/upgrade/uninstall on a clean runner; a tampered update is rejected | 1.5 | U-1, W-1 |
| **Q-1** | Hardening: perf budgets in CI, axe pass, full e2e set, founder's manual checklist, README (SmartScreen "More info → Run anyway" steps, unbrick line, how to check the SHA-256), published bypass table and threat model | `tests/{perf,e2e}`, `README.md`, `docs/` | the gates themselves | 1.5 | all |

**Total: about 32 build days** (the original 28, plus 4 for A-2, R-2 and M-1 added by CR-010 on 2026-10-26), plus about **5 spike days** before Gate 6.

## 4. Schedule (3-day, goal-boxed sprints)

With the founder reviewing and **two Claude developer lanes** in separate worktrees (tasks in a sprint never touch the same files, tech-lead rule; every dependency in §3 is either in an earlier sprint or earlier in the same lane, marked →), about 32 build days compress to roughly **13 sprint slots ≈ 7 sprints ≈ 21–23 working days elapsed**. Review time is the bottleneck, not typing.

| Sprint | Goal (one sentence) | Lane A | Lane B |
|---|---|---|---|
| 0 (pre-G6) | The attach path and the shell are proven | SP-H1, S-1 | SP-ST1, SP-TW1, S-4 |
| 1 | The repo builds, and a tool call is parsed the way the guard will see it | S1-1 → G-1 | (after S1-1) U-1 |
| 2 | A real tool call is blocked by a fail-closed guard | G-2 → G-3 | W-1 → R1 (installer, release workflow, updater signing, published hashes) |
| 3 | The limits hold with the app closed, at admin level, and you can see the heartbeat | G-4 → G-5 → A-1 | H-1 → F-1 |
| 4 | It proves itself and stops the dangerous thing | C-1 → P-1 | N-1 → T-1 |
| 5 | Rules, your own rules and usage are in | R-1 → R-2 | L-1 → D-1 |
| 6 | First run delivers the retro, lets you choose your rules and turns protection on in under 5 minutes | A-2 → O-1 | M-1 |
| 7 | Hardened and ready for the first outside user | Q-1 (after O-1's flows exist) | Slack for the day-6 re-plan |

The day-6 re-plan checks actuals against these numbers; if a lane slips, **sequence, don't cut** (founder preference): F-1 and L-1 can move to v0.1.1 only with the founder's OK.

## 5. Risks

| # | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | A Windows fail-open path we can't work around (SP-H1) | M | **Critical** | Spike first; nightly canary; `known-bad` marking; never show green without a check | Tech lead |
| 2 | Claude Code churn (6–8 releases a week) eats the founder's time | H | H | Fixture PRs automated; contract suite narrow; load-shedding order (OPERATIONS §7) | Founder |
| 3 | Unsigned v0.1 (CR-010) costs trust: SmartScreen on download and a yellow "unknown publisher" UAC prompt | H | M | The site explains "More info → Run anyway" and publishes each installer's SHA-256; updates are Ed25519-signed; buy Authenticode once Pro income covers it; a 10 % SmartScreen abort rate is a kill signal (onboarding edge L) | Founder |
| 4 | Tauri gaps on Windows (toast activation, updater) | M | M | SP-ST1 with a 2-day kill criterion → Electron shell, same Rust core | Tech lead |
| 5 | Guard latency with Defender on exceeds 50 ms (higher risk while unsigned: less AV reputation) | M | M | Small static exe; measure in SP-H1 unsigned; fallback to a warm helper | Tech lead |
| 6 | Fail-closed bricks a user's Claude Code (AV quarantine, deleted binary) | M | H | Guard lives in the plugin cache; `failing` state + Repair; one-line unbrick everywhere; AV false-positive submission | Tech lead |
| 7 | Tripwire attribution too coarse (shared folders) | M | M | Stop every session in that folder with a tool call in flight; ETW service in v0.2 | Tech lead |
| 8 | Anthropic ships the hero (default-branch deny, budgets) | M–H | H | Kill criteria in the PRD; vendor-neutral rulebook keeps the cross-vendor angle | Founder |
| 9 | Rust + Tauri slows a TS-first workflow | M | M | Claude writes Rust well; crates kept small; renderer stays TS/React per ADR-0003 | Founder |
| 10 | Real-world shells and setups differ from CI | H | M | Diagnostic in every bug; known-setups table; beta channel first | Founder |
| 11 | Estimates are optimistic (pre-mortem: 12–15 days for a smaller cut) | H | M | Day-6 re-plan; the estimate above already exceeds the pre-mortem's because it includes the heartbeat, canary, tripwire and managed limits the pre-mortem made must-haves | Tech lead |
