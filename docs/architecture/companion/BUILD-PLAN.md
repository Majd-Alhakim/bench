# Build plan: the Eucas companion v0.1

**Scope (updated 2026-10-26):**
- **Base:** the pre-mortem's cut-down v0.1 (SYSTEM-DESIGN §1). Pro is a waitlist button: no payments, no per-session budgets, no cloud hand-off.
- **Added by CR-010 (founder, 2026-10-26):** choosing and locking your rules in setup (A-2), prompted rules (R-2) and the plain-code guided merge (M-1), in v0.1's Free tier. v0.1 ships **without Authenticode signing** (ADR-0013).
- **Added by CR-011 and the founder's decisions of 2026-10-26:**
  - your Euca in **the native notch** with **one panel**; no main window (ADR-0016);
  - the **supervisor meter**;
  - **the supervisor itself, always on for every user**: a 14-day trial from the end of setup, then a monthly taste; Pro's hidden budget is about $1.48; SP-SUP2 is the gate (ADR-0011, ADR-0018).
- **Added by CR-012 and the founder's decisions:**
  - **Eucas accounts** (email + code; required to finish setup when online);
  - **per-account local profiles** (a new account starts from zero);
  - **refusing disposable email domains** (ADR-0017).
- **Changed by the spikes** (SP-H1, SP-ST1, SP-TW1): stories G-3, G-4, T-1, U-1 and C-1.
- **Changed by the founder (BRD §10 #60):** the guided merge follows the approved design (M-1).

**Estimates** are focused build days for the founder working with Claude (one Claude developer lane, founder reviewing), from the pre-mortem's per-item figures adjusted for this design. They are estimates, not commitments; the day-6 re-plan (CR-009 practice) corrects them.

**The new total: about 48 build days** (was 32), plus **about 0.75 spike days** still to run before Gate 6 and **SP-SUP2** (2 days + labelling) running alongside the build as the supervisor's launch gate. Where the 16 days come from is in §3.1.

## 1. Gate 6 prerequisites

| # | Item | Owner | Blocks |
|---|---|---|---|
| P1 | Founder approves ADR-0007 … **0018** (or changes them) | Founder | Everything |
| P2 | ~~D-3 signing route chosen and identity validation started now~~ **Resolved (CR-010, 2026-10-26): no Authenticode signing in v0.1.** Updates stay signed with the Tauri updater's Ed25519 key; installer SHA-256s are published on the site; Authenticode comes once revenue covers it (ADR-0013). **New consequence (SP-H1):** PCs with Smart App Control on or in evaluation can't run unsigned v0.1 (§6 question 3) | Founder | — |
| P3 | CR-010 (the companion-first change request the pre-mortem calls for) approved with the v0.1 scope above | Founder + BA | Backlog baseline |
| P4 | Spikes in §2 at GO | Tech lead | The stories they name |
| P5 | Landing page + waitlist for 2 weeks (pre-mortem's cheapest test), if the founder wants the signal before building | Founder | Optional go/no-go |
| P6 | Naming: user-visible artefacts and crates named `eucas-*` (resolved: the rename to Eucas is done, CR-010; SYSTEM-DESIGN header) | Founder | S1-1 |
| P7 | Copy: ~~the privacy line becomes "…nothing about your work leaves this PC unless you turn it on" (ADR-0015)~~ **the new privacy line approved 2026-10-26 (BRD #63)**, with one wording gap (§6 question 6), and the diagnostic line "…no paths to your projects or files…" (OPERATIONS §3) | Founder + UI | O-1, D-1 |
| P8 *(2026-10-26)* | CR-011 and CR-012 applied to the BRD/PRD (PR #74) and the design (setup with sign-in and "What is sent" instead of Level 1/2; Settings › Account and What is sent; the Smart App Control edge), with the conflicts in §7 resolved | PM + UX | O-1, AC-2, SUP-1 |
| P9 *(2026-10-26)* | Domain `eucas.app` onboarded to Cloudflare Email Service (SPF, DKIM, DMARC), Workers Paid on, D1 databases for staging and production | Founder | AC-1 |
| P10 *(2026-10-26)* | The founder installs the SP-SUP2 recorder (dry run first) so real moments accumulate during the build | Founder | SP-SUP2 → the supervisor's launch |

## 2. Spikes

Each on a `spike/*` branch, throwaway code under `spikes/`, a report in `docs/spikes/`.

**Done (2026-10-26):**

| Spike | Verdict | What it changed |
|---|---|---|
| **SP-H1** hook attach path | **GO with limits**: 72 / 72 faults blocked; p95 33 ms; managed hook 33 / 33 | Exec form only; the plugin runs in place from the marketplace folder (part of the install); running sessions never load a new plugin (restart); the status line goes in user settings; both managed sources work; stdout is JSON or nothing; the Smart App Control check; the version badge per host; host by image path (ADR-0007, 0009, 0013, 0014) |
| **S-1** hook-only canary | **GO**: 20 / 20, 0 tokens | No paid canary turn; D-5 resolved (ADR-0014) |
| **SP-ST1** Tauri shell | **GO with limits**: Tauri stays | **The notch is native** (0.9 MB vs 87–106 MB); toasts are a fallback and need an AUMID shortcut; WebView2 rules (ADR-0008, ADR-0016) |
| **SP-TW1** tripwire | **GO**: kill 16–49 ms, tree gone 16–25 ms, exact count under overflow | **Parent-link registry** + second kill (the orphaned deleter fix); report the measured count (SYSTEM-DESIGN §5.5) |
| **S-4** Open session | Provisional GO | Desktop app: focus the one window, name the session; focus inside the click handler |
| **S-6** tray settings link | Provisional GO | `ms-settings:taskbar` + one step; matters less now the tray is a fallback |
| **SP-SUP2 recorder** | Built, not installed | Async observational hooks; its scrubber is the reference for the always-on redactor |

**Still to run:**

| Spike | Question | Cost | GO bar | If NO-GO |
|---|---|---|---|---|
| **G6 manual checklist** | Toast buttons, 100 / 150 % and a second monitor, full-screen step-aside, desktop app and VS Code hook events, S-4 focus, S-6 link | Founder, ~20 min | Each box ticked or a named workaround | Per item, in the checklist |
| **SP-ST2** *(new)* native notch accessibility and keyboard | In the `native-notch` spike: a UI Automation provider (name, value, `UiaRaiseNotificationEvent`) heard by Narrator; the panel reached from the tray with Win+B and from the optional `RegisterHotKey` shortcut; the peek shown from the pre-warmed webview without activation | **0.5 d** | Narrator reads the notch state and announces a new needs-you item; keyboard reaches the panel with no hook; the peek doesn't take focus | The notch gets a hidden accessible companion window, or the panel's live region speaks while it is hidden (measure) |
| **SP-AC1** *(new)* sign-in deliverability | Cloudflare Email Service (beta) from `eucas.app` to Gmail, Outlook and iCloud inboxes: inbox, not spam; time to arrive | **0.25 d** | 10 / 10 in the inbox, p95 < 30 s | Switch `email.provider` to Resend (ADR-0017) and re-test |
| **S-2** Allow once *(optional)* | Can a waiting `PermissionRequest` hook answer from the app without racing the terminal prompt? | 0.5 d | No double prompt, no lost answer, in 50 trials | No "Allow once" in v0.1 |
| **SP-SUP2** *(now the v0.1 gate for the supervisor; founder, 2026-10-26)* | Supervisor on ≥ 300 real, blind-labelled moments; also measures the real prompt size and wake-up rate (they re-set the ADR-0018 caps) and **0 redaction leaks** | 2 d + labelling, alongside the build (needs P10) | SUPERVISOR §10 bars | v0.1 ships with `killSwitches.supervisor` on (rules only) until it passes |

## 3. Sliced backlog (v0.1)

Stories are vertical slices; each task inside is ≤ 1 day of agent work and names its files, tests and dependencies in the sprint plan (`/plan-sprint`), with a constraint contract per story. Every story ends with a trace/log event visible in the UI (CLAUDE.md). **Δ** marks a change on 2026-10-26, with its source.

| ID | Story (slice) | Main files | Tests | Est. | Depends |
|---|---|---|---|---|---|
| **S1-1** | Monorepo scaffold: pnpm + Cargo workspaces, `contracts/` + `xtask codegen`, lint/format/typecheck, lefthook, changesets, CI jobs `ts`, `rust`, `contracts`, `licences`, `dependency-review`; `check-deps` bans (`SetWindowsHookEx`, guard network deps) | root configs, `crates/eucas-types`, `packages/contracts-ts`, `.github/workflows/ci.yml` | codegen round-trip test | 1.5 | G6 |
| **G-1** | Neutral `ToolCall` + shell tokenizers (bash, PowerShell, cmd) + path canonicaliser | `crates/eucas-rules/src/{tool_call,shell/*}.rs`, `eucas-platform/src/windows/paths.rs` | unit + proptest + fuzz target | 1.5 | S1-1 |
| **G-2** | The four limits + catalogue + self-protection | `crates/eucas-rules/src/limits/*` | ~400 table cases (TESTING §2) | 1.5 | G-1 |
| **G-3** | Guard binary: PreToolUse decide → hook JSON, fail-closed paths, check event over pipe with spool fallback, tripped flag. **Δ SP-H1:** stdout JSON-or-nothing, observational subcommands for async hooks, parent identity by image path | `crates/eucas-guard/**`, `eucas-adapters/claude_code/*`, `eucas-platform/windows/{pipe,spool,parent_process}.rs` | fault injection; **stdout fuzz**; latency bench with the 5 ms emit cap | **1.25** (+0.25) | G-2 |
| **G-4** | Plugin + local marketplace + install/uninstall through `claude plugin`. **Δ SP-H1:** exec-form contract; a versioned plugin folder per release with an atomic manifest repoint; cleanup only when no live session uses a version; the Defender warm-up run; the "not protected until restarted" list; the status line in user settings; the Smart App Control check | `apps/plugin/**`, `xtask build-plugin`, `eucas-core/installer/plugin.rs`, `eucas-platform/windows/smart_app_control.rs` | `plugin validate --strict`, our hooks schema (every hook has `args`), install/restore test, version-folder cleanup test | **1** (+0.5) | G-3 |
| **G-5** | Contract + bypass suites on the pinned CLI in CI (`guard-contract`, `plugin` jobs) | `tests/contract/**` | the suites themselves | 1 | G-4 |
| **A-1** | Admin limits: `eucas-elevate` (fixed operations, embedded payload), managed merge recorded as a JSON patch (into whichever source exists; both if both, SP-H1), limits guard install, `pause-limits`/`resume-limits`, user-level fallback, key-level remove | `crates/eucas-elevate/**`, `eucas-core/installer/managed.rs` | precedence tests on the admin runner; swapped-helper hash test; a user edit survives remove | 1.5 | G-3 |
| **A-2** *(CR-010, D-4)* | Choose and lock your rules; **all four start ticked to lock** (founder). **Δ CR-011 design:** lock your own **block** rules too; `update-locked-set` takes a strict deny-only rule list | `surfaces/setup-window/choose-rules`, `eucas-core/installer/managed.rs`, `crates/eucas-elevate` | the four limits can't be switched off; decline UAC → not locked; a forged allow rule is rejected by the helper | **1.5** (+0.5) | A-1, R-1 |
| **U-1** | Tauri shell. **Δ CR-011, SP-ST1:** **one pre-warmed panel webview** (with a peek mode shown without activation), the setup window, the tray as a fallback (icon states, menu), store + `state_patch`, single instance, autostart, AUMID shortcut; the SP-ST1 webview rules. ~~Flyout, main window shell~~ | `crates/eucas-app/**`, `apps/companion/src/{ipc,store.ts,surfaces/*}` | derive-function table tests; Playwright smoke | 1.5 | S1-1 |
| **N-0** *(new, CR-011, ADR-0016)* | **The native notch:** layered window, the `eucas-notch` drawing crate (eyes, blink, glow, beam, markers, thin line, Not protected, doze, before setup), hover poll and peek trigger, per-monitor placement, full-screen step-aside, UIA provider, tokens exported to Rust, optional `RegisterHotKey` panel shortcut (off by default, BRD #61) | `crates/eucas-notch/**`, `eucas-platform/windows/{notch_window,uia,hotkey}.rs`, `eucas-app/src/notch.rs`, `packages/ui-tokens/tokens-notch.json` | Win32 probes; golden images at 100/125/150 %; idle and follow budgets | **2.5** | U-1, SP-ST2 |
| **H-1** | Ingest + sessions + transcript tail + heartbeat verdicts. **Δ SP-H1:** PostToolUse-without-check as the fastest signal; `config-change` rule; per-host CLI version from `SessionStart` | `eucas-core/{ingest,sessions,transcripts,heartbeat}`, `components/heartbeat-*` | "not protected within 2 s" integration test; component states | 1.5 | G-3, U-1 |
| **C-1** | Canary: local (S-1 path), verified list client, badge logic per host; nightly `canary.yml`. **Δ S-1:** no paid fallback | `eucas-core/canary`, `eucas-core/config`, `.github/workflows/canary.yml`, `xtask canary-*` | badge table; workflow dry run | 1.5 | G-5, H-1 |
| **T-1** | Tripwire: watch, count, attribute, stop tree, verify, `TripwireCard` both states, "This was expected". **Δ SP-TW1:** the parent-link registry (200 ms snapshots, pid + creation time), the second kill, overflow recount, the measured count on the card | `eucas-core/tripwire`, `eucas-platform/windows/{fs_watch,process_tree,process_registry}.rs`, `components/tripwire-card` | 2,000-file delete incl. an orphaned `Start-Process` deleter; overflow test | **2** (+0.5) | H-1 |
| **N-1** | Needs-you. **Δ CR-011:** markers on the notch + the panel list (both), the peek lines; toasts as a fallback under the policy; Open session per S-4; `UndoToast`; pause notifications | `eucas-core/notify`, `eucas-platform/windows/{toast,foreground}.rs`, `screens/needs-you`, `components/{needs-you-card,undo-toast}` | toast budget unit tests; e2e | 1.5 | H-1, N-0 |
| **L-1** | Status-line wrapper (in user settings, SP-H1), usage samples, forecast, `UsageMeter`, `ForecastLine`, `LedgerTable`, Usage tab (4 modes) | `eucas-guard/cmd/status_line.rs`, `eucas-core/ledger`, `screens/usage` | byte-equal output test; forecast fixtures | 1.5 | G-4, U-1 |
| **F-1** | Same-file warning: `SameFileCard` (full + compact), resolve on commit (a warning only; the merge moved to M-1) | `eucas-core/samefile`, `components/same-file-card` | window and worktree cases | 0.75 | H-1 |
| **M-1** *(CR-010; **Δ re-checked for the approved design**, BRD #60)* | Guided merge, plain code: **offered as a needs-you item when a session finishes on a branch** ahead of the default; clean tree and idle session; fetch; **update from the default branch** (merge, no force-push); the project's test command (detected or set once); push the branch after a not-the-default-branch self-check; `gh pr create` or the command to copy; a conflict or failing test stops with nothing pushed; **never merges into the default branch**; Close the PR as the undo | `eucas-core/merge/**`, `components/guided-merge` | temp-repo tests: clean → PR; conflict → abort, nothing pushed; failing tests → stop; no `gh` → command shown; a tool call mid-run aborts; the push target can never be the default branch | **1.75** (+0.25: the session-end trigger, test-command detection, the mid-run abort; the rebase-onto-another-branch logic goes away) | H-1, N-1 |
| **R-1** | Rules: rulebook schema (**Δ** `auto_approve` and `block` kinds, ADR-0010) + compiler + `rulebook.bin`, suggestions, 5 templates, dry run, conflicts, runner warning, counters; Rules tab components | `eucas-rules/{rule,compile,dry_run,suggest,conflicts}.rs`, `screens/rules` | compiler rejects limit overlap for allow rules; e2e add/undo | 1.5 | G-2, U-1 |
| **R-2** *(CR-010)* | Prompted rules through `/v1/draft-rule`. **Δ:** the account token, budget reserve and meter; Draft is the opt-in for that sentence; the guided exact-rule form when signed out, offline or the meter is empty | `apps/api/src/routes/draft-rule.ts`, `contracts/api/draft-rule-*.schema.json`, `eucas-core/ruledraft`, `screens/rules` | schema strictness; the drafting schema ≤ 800 tokens; invalid or limit-overlapping drafts rejected; e2e describe → preview → confirm | **1.75** (+0.25) | R-1, AC-2, BU-1 |
| **P-1** | **Δ CR-011:** the panel header (avatar, name, lock chip, status line) and Settings (name and look, Protection, The notch, Help, Plan, Quit); the log with filters and export; What Eucas can't see. ~~Protection screen~~ | `surfaces/panel/header`, `screens/settings`, `components/{log-row,banner}` | export formats; e2e block receipt | 1 | H-1, C-1, AC-2 |
| **O-1** | Setup (CR-011 flow): detection (**Δ** Smart App Control edge), **make your Euca**, retro, **sign-in (required online; "Sign in later" offline, BRD #57)**, choose rules, lock, the canary, **"What is sent"** (a real redacted payload), the list of sessions to restart, `setup_finish` → trial start → the notch; edges A–Q | `surfaces/setup-window`, `eucas-core/{transcripts/retro.rs,installer/plan.rs}` | 500 MB corpus perf; e2e per edge; offline sign-in path | **3** (+1) | A-1, A-2, C-1, R-1, L-1, AC-2, N-0, SUP-1 (payload builder) |
| **D-1** | Diagnostic (+ **Δ** the account, supervisor and platform sections, OPERATIONS §3) | `eucas-core/diagnostic`, `components/diagnostic` | redaction test (no email, tokens or payload text) | 0.5 | H-1, C-1 |
| **W-1** | Worker v0.1: `/v1/config`, `/v1/updates`, `/v1/waitlist`, `/v1/telemetry`; staging + production; signed config tooling; `ProLine`; Settings › Updates and Privacy | `apps/api/**`, `xtask config`, `components/pro-line` | Workers-pool tests; schema strictness | 1.5 | S1-1, U-1 |
| **AC-1** *(new, CR-012, ADR-0017)* | Accounts on the Worker: D1 schema and migrations; `/v1/auth/{start,verify,refresh,signout}`, `GET`/`DELETE /v1/account`, `/v1/trial/start`; HMAC tokens; code rules and rate limits; `EmailSender` (Cloudflare + Resend); **disposable-domain refusal** with the weekly list workflow | `apps/api/src/{routes/{auth,account,trial}.ts,auth/*,email/*,db/migrations/*,generated/disposable-domains.ts}`, `.github/workflows/disposable-domains.yml` | TESTING §8 auth and blocklist rows | **1.75** | W-1, SP-AC1, P9 |
| **AC-2** *(new, CR-012, founder)* | Accounts in the app: the sign-in step, DPAPI tokens and refresh, Settings › Account (email, plan, sign out, **Delete account**), **per-account profiles** (folder per account, adopt pre-sign-in data, switch and recompile `rulebook.bin`, protection never drops), the 7-day plan grace | `eucas-core/account/**`, `eucas-platform/windows/dpapi.rs`, `screens/settings/account`, `components/sign-in-step` | e2e sign in / out / delete; **profile isolation** (B sees nothing of A; limits still block) | **2.25** (1.5 + 0.75 for profiles) | AC-1, U-1 |
| **BU-1** *(new, CR-011, ADR-0018)* | The budget on the Worker: periods (pending → trial → taste / pro), reserve and settle in D1, the prompt cap, the daily breaker in `spend_day`, `/v1/meter`; caps in signed config (Pro $1.48, BRD #56) | `apps/api/src/{budget/*,routes/meter.ts}`, `contracts/api/meter.schema.json` | 50 parallel calls never overspend; rollover; no money field in any response | **1** | AC-1 |
| **ME-1** *(new, CR-011)* | `SupervisorMeter` (trial, taste, low, empty = rules only, unreachable), `PlanCard` | `components/{supervisor-meter,plan-card}`, `screens/usage` | every state; no `$` or count rendered | **0.5** | BU-1, AC-2 |
| **SUP-1** *(now v0.1; founder, 2026-10-26)* | The supervisor in the core, **always on**: rules v2, signals, **trimmer and redactor as release-gating safety code** (the SP-SUP2 scrubber ported, corpus + property tests), overrides, the `eucas-ask` Stop path, the server client with token and budget, the local **sent log**, Settings › What is sent, receipts with Why?, the kill switch | `eucas-core/supervisor/**`, `eucas-guard/cmd/stop.rs`, `screens/settings/what-is-sent` | SP-SUP1 dangerous cases as unit tests; redaction corpus; e2e What is sent byte-equal | **3** | H-1, BU-1, AC-2, SUP-3 |
| **SUP-2** *(now v0.1)* | `/v1/supervise` on the Worker: token, strict schema, secret re-scan, prompt cap, reserve, the model chain with the ZDR block, output validation, settle | `apps/api/src/routes/supervise.ts`, `providers/openrouter.ts`, `prompts/` | provider block on every call; 400/401/402/413/422 paths | **1** | BU-1 |
| **SUP-3** *(now v0.1)* | The eval harness as a regression suite (`evals/supervisor/`, SP-SUP1 ported) + the leak bar | `evals/supervisor/**` | the suite itself, in CI on supervisor changes | **1** | S1-1 |
| **R1** | Release: NSIS per-user installer (unsigned, **Δ** AUMID Start-menu shortcut), Tauri updater with its Ed25519 key + channels, published SHA-256s, staged rollout, SBOM, provenance, `release.yml`, `deploy-api.yml` (**Δ** D1 migrations, Email binding, auth smoke) | `installer/**`, `.github/workflows/{release,deploy-api}.yml`, `tauri.conf.json` | install/upgrade/uninstall on a clean runner; a tampered update is rejected | **1.75** (+0.25) | U-1, W-1 |
| **Q-1** | Hardening: perf budgets in CI (incl. the notch), axe pass, full e2e set, the founder's manual checklist, README (SmartScreen steps, Smart App Control note, unbrick line, SHA-256 check), published bypass table and threat model | `tests/{perf,e2e}`, `README.md`, `docs/` | the gates themselves | 1.5 | all |

### 3.1 The total

| | Days |
|---|---|
| Before (CR-010 scope, 2026-10-26 morning) | 32 |
| Spike findings: G-3 +0.25, G-4 +0.5, T-1 +0.5, R1 +0.25 | +1.5 |
| CR-011 surfaces: N-0 notch 2.5, setup O-1 +1, A-2 lock block rules +0.5, F-1/M-1 re-cut for the approved guided merge +0.25 | +4.25 |
| CR-011 budget and meter: BU-1 1, ME-1 0.5, R-2 +0.25 | +1.75 |
| **CR-012 accounts: AC-1 1.75, AC-2 2.25** (incl. disposable domains 0.25 and per-account profiles 0.75, founder 2026-10-26) | **+4** (replaces the CR's "+2 days") |
| The supervisor in v0.1, always on: SUP-1 3, SUP-2 1, SUP-3 1 | +5 |
| **Total** | **about 48 build days** (48.25) |

Not in the total: the CR-011 §7 "full-app UX features" (learns you, undo everywhere, receipts, moments), **until the founder approves them** (pending on #67). Some are already in stories (Undo in N-1, R-1; receipts with Why? in SUP-1); the rest, mainly "What Pip knows" and the learned-item suggestions, are **about 2–3 more days, indicative**, estimated properly once approved.

## 4. Schedule (3-day, goal-boxed sprints)

Two Claude developer lanes in separate worktrees; tasks in a sprint never touch the same files (tech-lead rule); every dependency is in an earlier sprint or earlier in the same lane (→). About 48 build days ≈ **10 sprints ≈ 28–30 working days elapsed**. Review time is the bottleneck, not typing.

| Sprint | Goal (one sentence) | Lane A | Lane B |
|---|---|---|---|
| 0 (pre-G6) | The last unknowns are closed | SP-ST2, SP-AC1 | Founder: the manual checklist; the SP-SUP2 recorder installed |
| 1 | The repo builds, and a tool call is parsed the way the guard will see it | S1-1 → G-1 | (after S1-1) U-1 |
| 2 | A real tool call is blocked by a fail-closed guard, and the Euca has eyes | G-2 → G-3 | N-0 |
| 3 | The plugin installs, and the limits hold at admin level | G-4 → A-1 | W-1 → SUP-3 |
| 4 | The heartbeat is visible, and the server knows who you are | G-5 → H-1 | AC-1 → BU-1 |
| 5 | It proves itself and explains itself; you can sign in | C-1 → D-1 → F-1 | AC-2 → ME-1 |
| 6 | It stops the dangerous thing; the panel has its header and Settings | T-1 → P-1 | R1 (installer, release workflow, updater signing, published hashes) |
| 7 | Needs-you and the guided merge; rules and your own rules | N-1 → M-1 | R-1 → R-2 |
| 8 | The supervisor answers from your rules; usage and locking are in | SUP-2 → SUP-1 (first 2 days) | L-1 → A-2 |
| 9 | Setup makes your Euca, signs you in and protects you in about 5 minutes | SUP-1 (last day) → slack | O-1 |
| 10 | Hardened and ready for the first outside user | Q-1 (after O-1's flows exist) | Slack for the day-6 re-plan |

The supervisor's model path ships behind `killSwitches.supervisor`; whether it's switched on at release depends on SP-SUP2 (§2), not on this schedule. The day-6 re-plan checks actuals against these numbers; if a lane slips, **sequence, don't cut** (founder preference): F-1 and L-1 can move to v0.1.1 only with the founder's OK.

## 5. Risks

| # | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | A Windows fail-open path we can't work around | L (SP-H1: 0 of 72) | **Critical** | Nightly canary; `known-bad` marking; never show green without a check; the stdout fuzz test | Tech lead |
| 2 | Claude Code churn (6–8 releases a week) eats the founder's time | H | H | Fixture PRs automated; contract suite narrow; load-shedding order (OPERATIONS §7) | Founder |
| 3 | Unsigned v0.1 (CR-010) costs trust: SmartScreen on download and a yellow "unknown publisher" UAC prompt; **Smart App Control excludes some PCs entirely** (SP-H1) | H | M–H | The site explains "More info → Run anyway" and publishes each SHA-256; setup refuses to install the guard under SAC; buy Authenticode once Pro income covers it, sooner if SAC exclusions are common (§6 question 3) | Founder |
| 4 | ~~Tauri gaps on Windows~~ Toast button activation fails | L | L | SP-ST1 passed everything else; toasts are now a fallback; the direct WinRT module if needed | Tech lead |
| 5 | Guard latency with Defender on exceeds 50 ms | L (measured p95 33 ms) | M | The warm-up run after each new binary; the warm helper stays the fallback | Tech lead |
| 6 | Fail-closed bricks a user's Claude Code (AV quarantine, deleted marketplace folder, SAC switching on) | M | H | `failing` state + Repair; Off for 15 minutes; one-line unbrick everywhere; AV false-positive submission | Tech lead |
| 7 | Tripwire attribution too coarse (shared folders, very short-lived parents) | M | M | The parent-link registry; stop every session in that folder with a tool call in flight; "still deleting" honesty; ETW in v0.2 | Tech lead |
| 8 | Anthropic ships the hero (default-branch deny, budgets) | M–H | H | Kill criteria in the PRD; vendor-neutral rulebook keeps the cross-vendor angle | Founder |
| 9 | Rust + Tauri slows a TS-first workflow; **the notch's drawing in Rust takes longer than 2.5 days** | M | M | Claude writes Rust well; crates kept small; sprites instead of effects; Direct2D only if needed (ADR-0016) | Founder |
| 10 | Real-world shells and setups differ from CI | H | M | Diagnostic in every bug; known-setups table; beta channel first | Founder |
| 11 | Estimates are optimistic (pre-mortem: 12–15 days for a smaller cut) | H | M | Day-6 re-plan; this plan already includes everything CR-010 to CR-012 added | Tech lead |
| 12 *(new)* | **A redaction miss leaks a secret, path or name, for every user by default** (always-on supervisor) | M | **H** | Redactor as release-gating code; don't-send rules; server re-scan; size caps; ZDR; What is sent; the kill switch; 0 leaks in SP-SUP2 (SECURITY-PRIVACY T16) | Tech lead |
| 13 *(new)* | Always-on model spend at scale (every install calls the model) | M | M | Hidden caps per period (worst ~$0.52 per new Free user, then $0.02 a month); daily breaker; OpenRouter credit limit; re-run the cost study with SP-SUP2 numbers | Founder |
| 14 *(new)* | Users who won't accept default-on egress leave (there's no off switch) | M | M | Say it plainly before install (download page, setup's What is sent); track uninstalls after setup (telemetry, if on) | Founder |
| 15 *(new)* | Cloudflare Email Sending is beta | M | M | `EmailSender` with Resend behind config; SP-AC1; sign-in is the only thing it blocks, never protection | Tech lead |

## 6. Open questions (tech lead → client, 2026-10-26)

Each has a recommendation; none blocks Sprint 1.

1. ~~Does the supervisor ship in v0.1?~~ **Answered (founder, 2026-10-26):** yes, gated by SP-SUP2.
2. **A deleted account's email signing up again: a new trial?** As designed, yes (the row is gone). *Recommendation:* keep only a keyed hash of the normalised email with "trial used" after deletion, and say so in the delete confirmation ("…so a new trial can't start on this address"). It isn't a device fingerprint and holds nothing about your work.
3. **Smart App Control:** unsigned v0.1 can't protect PCs with SAC on or in evaluation (SP-H1). *Recommendation:* the setup edge (design needed), the README note, and buy Authenticode before the public launch if more than ~10 % of early installs hit it.
4. **Email aliases for "one trial per account":** `name+x@gmail.com` and dotted Gmail variants are separate accounts. *Recommendation:* normalise `+tags` on every domain and dots on gmail.com / googlemail.com, for trial identity only (the code still goes to the address as typed).
5. **Machine-locked rules and a second account:** locks in managed settings belong to the PC, so a new account (which starts from zero) still finds them enforced. *Recommendation:* show them in the new account's Rules as "Locked on this PC" (read-only; unlocking asks for admin as today).
6. **Privacy-line wording:** the approved line says the account holds "only your email and your plan", but it also holds the supervisor budget used and a device count (CR-012 lists both). *Recommendation:* "…Your account holds only your email, your plan and how much supervisor help you've used." (The device count can go if the founder prefers; it has no use now that there's no device limit, BRD #58.)
7. **Mailing list consent:** an email given to sign in isn't consent to product news. *Recommendation:* a separate, unticked "Send me product news" box (`news_opt_in`).
8. **Guided merge "update from your default branch":** merge or rebase? *Recommendation:* merge (`git merge --no-edit`), so a branch that was already pushed never needs a force-push; rebasing would rewrite pushed history.
9. **Locking your own rules:** only block rules can be locked (ADR-0007, ADR-0010). *Recommendation:* confirm; locking an allow rule would put an auto-approval where no one can remove it without admin.

## 7. Conflicts with requirements and design (for their owners)

The architecture follows the founder's decisions of 2026-10-26; these documents still say otherwise (as of `dev` and PR #74, read for the guided merge only):
- **Setup flow** (`docs/design/ux/companion/setup-flow.md`): "without an account", the optional trial email (D-3), the Level 1/2 privacy step. Superseded by CR-012 (sign-in required online, after the retro) and by the always-on supervisor ("What is sent" instead of a choice).
- **Notch and panel** (`notch-and-panel.md` §5, §4.5, state table): the Level 1 meter line, "drafting needs Level 2" and the Level 1 guided form, trial start from Usage. Drafting is now the opt-in for one sentence, levels are gone, and the trial starts at the end of setup. Its §140 global shortcut matches BRD #61 only if it is off by default and uses `RegisterHotKey`.
- **UI** (`docs/design/ui/companion/DESIGN.md`): the notch is drawn natively, so the eye, blink, glow and beam animations need plain-value tokens and must be drawable as shapes or pre-rendered sprites (ADR-0016). There's a new Smart App Control edge, and new screens: Settings › Account, What is sent, sign-in.
- **PRD/BRD (as on `dev`):** "10,000 model calls a month" (PRD 25.3, BRD S26) is now a hidden budget; Pro licence keys are now the account plan; "Lemon Squeezy or Paddle" is now Lemon Squeezy; the build is about 48 days, not 32; story 23.3 is the same-file rebase version, not the approved design.
- **Cost study** (`docs/business/ops-cost-study-2026-10-26.md`): Workers Paid ($5) from v0.1, not from Pro; with the supervisor always on, "everyone uses the full taste" is the expected case, not the worst; the trial starts at the end of setup; the Pro cap is $1.48.
- **Claude Code floor:** the desktop app bundled CLI 2.1.308 (below the 2.1.310 floor), so desktop-app sessions show "not verified" until Anthropic updates the bundle (BRD AS-9).
