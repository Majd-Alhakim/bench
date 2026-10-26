# GitHub Issues: approved for creation

> **Approved at Gate 6 (decision 7a, 2026-10-26).** The labels and the milestones `Sprint 0` … `Sprint 11` are on GitHub; the 50 issues below (3 spikes, 34 stories, 13 Sprint 1 tasks) are next. Generated from the task files, NA-1 added by hand; if a task file changes, update this file before creating.

**Labels to create first:** `companion`, `type:story`, `type:task`, `type:spike`, `lane:A`, `lane:B`, `priority:must`, `epic:E17` … `epic:E28`, `blocked:SP-ST2`, `blocked:SP-AC1`, `gate:SP-SUP2`, `needs:founder-answer`.

**Milestones:** `Sprint 0` … `Sprint 11` (from the [sprint plan](README.md#4-sprint-plan)). GitHub allows one milestone per issue, so each issue takes its first sprint as its milestone (SP-SUP2 takes Sprint 0), and `v0.1` is a **label** on every issue. Sprint 1 task issues are listed in full; later sprints get their task issues at each `/plan-sprint`, from the task files.

Format per issue: **title** · labels · milestone, then the body.

## 1. Spikes (Sprint 0, before G6 or alongside)

### SP-ST2: native notch accessibility and keyboard (0.5 d)
Labels: `companion`, `type:spike`, `epic:E17` · Milestone: `Sprint 0`, `v0.1`

**Question:** Narrator reads the notch state and announces a new needs-you item through a UI Automation provider; the panel is reachable from the tray with Win+B and from the optional `RegisterHotKey` shortcut; the peek shows from the pre-warmed webview without taking focus.

**GO bar: all three hold. NO-GO: a hidden accessible companion window, or the panel live region speaks while hidden (measure). Blocks: U-1.6, N-0.5–N-0.8.**

**Traces:** NFR-132, NFR-131, FR-107, FR-102, FR-118, NFR-078. Report goes to `docs/spikes/`; throwaway code under `spikes/` on a `spike/*` branch.

### SP-AC1: sign-in email deliverability (0.25 d)
Labels: `companion`, `type:spike`, `epic:E17` · Milestone: `Sprint 0`, `v0.1`

**Question:** Cloudflare Email Service (beta) from `eucas.app` to Gmail, Outlook and iCloud inboxes.

**GO bar: 10 / 10 in the inbox, p95 < 30 s. NO-GO: switch `email.provider` to Resend (ADR-0017) and re-test. Needs P9 (domain on Cloudflare Email, Workers Paid, D1). Blocks: AC-1.4, R1.4.**

**Traces:** FR-146, FR-148, NFR-071. Report goes to `docs/spikes/`; throwaway code under `spikes/` on a `spike/*` branch.

### SP-SUP2: supervisor launch gate (2 d + labelling, alongside the build)
Labels: `companion`, `type:spike`, `epic:E17` · Milestone: `v0.1`, `v0.1`

**Question:** The supervisor on ≥ 300 real, blind-labelled moments from the recorder; measures the real prompt size and wake-up rate (they re-set the ADR-0018 caps) and redaction leaks.

**GO bar: the SUPERVISOR §10 bars, 0 dangerous decisions, 0 redaction leaks. v0.1 launches only once it passes (SRS G3-1). Acceptance-gates: SUP-1.4, SUP-1.5, SUP-1.7, SUP-3.2, W-1.3, BU-1.1, BU-1.2, SUP-2.1, SUP-2.2, R1.3 (stable channel).**

**Traces:** FR-128, FR-133, NFR-091. Report goes to `docs/spikes/`; throwaway code under `spikes/` on a `spike/*` branch.

## 2. Stories (one issue each)

### [S1-1] Monorepo scaffold
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E18` · Milestone: `Sprint 1`, `v0.1`

**Story:** Monorepo scaffold · 1.5 d · depends: G6 · PRD 18.1 · UC: — (cross-cutting)

**Estimate:** 1.5 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (14):** NFR-182, NFR-033, NFR-078, NFR-200, NFR-153, NFR-067, NFR-185, FR-050, FR-138, FR-036, NFR-138, NFR-183, NFR-180, NFR-075

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] S1-1.1 Cargo workspace, crate skeletons and xtask check-deps (0.5 d)
- [ ] S1-1.2 pnpm workspace, TypeScript, lint and hooks (0.25 d)
- [ ] S1-1.3 contracts/ and xtask codegen, with the fixed strings stored once (0.5 d)
- [ ] S1-1.4 CI jobs ts, rust, contracts, licences, dependency-review, changeset (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [G-1] Neutral ToolCall, shell tokenizers and path canonicaliser
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 1`, `v0.1`

**Story:** Neutral ToolCall, shell tokenizers and path canonicaliser · 1.5 d → **1.75 d** · depends: S1-1 · PRD 19.1 · UC-55, UC-56

**Estimate:** 1.75 d over 5 tasks (tech lead). **Spikes:** none.

**Traces (6):** FR-033, NFR-061, FR-034, NFR-152, FR-092, NFR-032

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] G-1.1 ToolCall model and the PathResolver seam (0.25 d)
- [ ] G-1.2 Bash tokenizer (0.5 d)
- [ ] G-1.3 PowerShell and cmd tokenizers (0.5 d)
- [ ] G-1.4 Path canonicaliser (lexical part and Windows resolver) (0.25 d)
- [ ] G-1.5 Property tests and nightly fuzz targets (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [G-2] The four limits, the catalogue and self-protection
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 2`, `v0.1`

**Story:** The four limits, the catalogue and self-protection · 1.5 d · depends: G-1 · PRD 19.2 · UC-55, UC-56

**Estimate:** 1.5 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (8):** FR-034, NFR-061, FR-100, FR-033, FR-036, FR-047, FR-066, NFR-062

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] G-2.1 limit.delete (0.5 d)
- [ ] G-2.2 limit.push_default and the git facts parser (0.5 d)
- [ ] G-2.3 limit.send, limit.pay and the catalogue (0.25 d)
- [ ] G-2.4 Self-protection and the decide() order (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [G-3] Guard binary
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 2`, `v0.1`

**Story:** Guard binary · 1.25 d → **1.5 d** · depends: G-2 · PRD 19.3 · UC-55, UC-56

**Estimate:** 1.5 d over 5 tasks (tech lead). **Spikes:** none.

**Traces (19):** FR-035, NFR-032, NFR-156, FR-033, FR-037, FR-054, FR-060, FR-083, NFR-030, NFR-033, NFR-005, NFR-031, NFR-093, FR-052, NFR-003, NFR-066, NFR-035, NFR-001, NFR-002

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] G-3.1 Hook-input and hook-output contracts, and the Claude Code adapter (0.25 d)
- [ ] G-3.2 pre-tool-use and permission-request (0.5 d)
- [ ] G-3.3 Observational subcommands (0.25 d)
- [ ] G-3.4 Emit: the pipe client with an identity check, the spool and drop counting (0.25 d)
- [ ] G-3.5 Fault-injection suite, stdout fuzz and latency bench in CI (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [G-4] Plugin, local marketplace, install and uninstall
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 3`, `v0.1`

**Story:** Plugin, local marketplace, install and uninstall · 1 d → **1.25 d** · depends: G-3 · PRD 19.4 · UC-55, UC-54

**Estimate:** 1.25 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (17):** NFR-152, NFR-005, FR-035, NFR-021, FR-013, FR-183, FR-187, NFR-004, NFR-045, NFR-158, FR-002, NFR-046, NFR-160, FR-052, FR-043, FR-045, NFR-037

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] G-4.1 Plugin source, our strict hooks schema and xtask build-plugin (0.25 d)
- [ ] G-4.2 installer/plugin.rs: version folders, warm-up and atomic repoint (0.5 d)
- [ ] G-4.3 Smart App Control check and the "not protected until restarted" list (0.25 d)
- [ ] G-4.4 repair_guard and protection_off(15) (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [G-5] Contract and bypass suites on the pinned CLI in CI
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 4`, `v0.1`

**Story:** Contract and bypass suites on the pinned CLI in CI · 1 d → **1.25 d** · depends: G-4 · PRD 19.5 · UC-55, UC-56

**Estimate:** 1.25 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (14):** NFR-069, NFR-116, FR-016, NFR-030, NFR-031, NFR-060, NFR-152, NFR-155, NFR-160, FR-041, NFR-061, FR-069, NFR-079, NFR-180

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] G-5.1 Loopback Messages API stand-in and the canary environment builder (0.25 d)
- [ ] G-5.2 Live contract harness (TESTING §3.2) (0.5 d)
- [ ] G-5.3 Bypass suite and the published table (0.25 d)
- [ ] G-5.4 CI jobs plugin and guard-contract (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [A-1] Admin limits (eucas-elevate)
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 3`, `v0.1`

**Story:** Admin limits (eucas-elevate) · 1.5 d → **1.75 d** · depends: G-3 · PRD 19.6 · UC-54, UC-55

**Estimate:** 1.75 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (14):** NFR-063, FR-015, NFR-060, NFR-159, FR-006, FR-013, FR-044, FR-187, NFR-158, FR-011, FR-012, FR-014, FR-062, NFR-040

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] A-1.1 Helper skeleton: operation enum, self-install and ACLs (0.5 d)
- [ ] A-1.2 Managed merge into the file and/or HKLM, recorded as a JSON patch (0.5 d)
- [ ] A-1.3 Operations: install, repair, update-limits-guard, pause, resume and remove (0.25 d)
- [ ] A-1.4 installer/managed.rs: pinned-hash launch, user-level fallback and rollback (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [A-2] Choose and lock your rules
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E19` · Milestone: `Sprint 8`, `v0.1`

**Story:** Choose and lock your rules · 1.5 d · depends: A-1, R-1 (lane B) · PRD 19.7 · UC-54, UC-57

**Estimate:** 1.5 d over 3 tasks (tech lead). **Spikes:** none.

**Traces (14):** FR-063, FR-064, FR-066, NFR-063, NFR-079, FR-062, FR-023, FR-067, FR-014, NFR-100, FR-169, FR-010, FR-022, NFR-135

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] A-2.1 Helper update-locked-set with a deny-only schema (0.5 d)
- [ ] A-2.2 Core: the locked-set model, ordering and "Locked on this PC" (0.5 d)
- [ ] A-2.3 UI: LimitsPanel lock rows, choose-rules (step 7) and the lock control in Rules (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [H-1] Ingest, sessions, transcript tail and heartbeat
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E20` · Milestone: `Sprint 4`, `v0.1`

**Story:** Ingest, sessions, transcript tail and heartbeat · 1.5 d → **2 d** · depends: G-3, U-1 (lane B) · PRD 20.1 · UC-55, UC-60

**Estimate:** 2 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (21):** NFR-094, NFR-093, FR-185, NFR-040, NFR-183, NFR-188, NFR-034, NFR-035, NFR-066, FR-040, FR-052, NFR-154, FR-041, FR-042, FR-043, FR-051, NFR-018, NFR-036, NFR-037, NFR-156, NFR-046

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] H-1.1 Store: SQLite, migrations, retention, the needs repository and the trace sink (0.5 d)
- [ ] H-1.2 Ingest: pipe server, continuous spool ingest and dedupe (0.5 d)
- [ ] H-1.3 Sessions and the transcript tail (metadata only) (0.5 d)
- [ ] H-1.4 Heartbeat verdicts, derive.rs and the heartbeat components (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [C-1] Canary, verified list and badge per host
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E20` · Milestone: `Sprint 5`, `v0.1`

**Story:** Canary, verified list and badge per host · 1.5 d → **1.25 d** · depends: G-5, H-1 · PRD 20.2 · UC-55, UC-54

**Estimate:** 1.25 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (14):** NFR-065, NFR-042, NFR-049, NFR-154, FR-016, FR-018, FR-019, NFR-016, NFR-038, NFR-116, FR-004, FR-046, NFR-155, NFR-185

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] C-1.1 Signed config and verified-list client (0.5 d)
- [ ] C-1.2 Local canary run (0.25 d)
- [ ] C-1.3 Badge logic per host (0.25 d)
- [ ] C-1.4 canary.yml and xtask canary-* (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [D-1] One-button diagnostic
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E24` · Milestone: `Sprint 5`, `v0.1`

**Story:** One-button diagnostic · 0.5 d · depends: H-1, C-1 · PRD 24.2 · UC-61

**Estimate:** 0.5 d over 2 tasks (tech lead). **Spikes:** none.

**Traces (8):** FR-123, FR-124, FR-126, NFR-101, NFR-184, NFR-070, FR-125, NFR-103

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] D-1.1 Diagnostic core with section providers (0.25 d)
- [ ] D-1.2 The Diagnostic component, run_diagnostic and export_report (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [F-1] Same-file warning
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E23` · Milestone: `Sprint 5`, `v0.1`

**Story:** Same-file warning · 0.75 d · depends: H-1 · PRD 23.2 · UC-59

**Estimate:** 0.75 d over 2 tasks (tech lead). **Spikes:** none.

**Traces (6):** FR-092, FR-094, FR-095, NFR-019, FR-093, FR-169

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] F-1.1 samefile: window, worktrees and resolve (0.5 d)
- [ ] F-1.2 SameFileCard (full and compact) (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [T-1] Tripwire
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E20` · Milestone: `Sprint 6`, `v0.1`

**Story:** Tripwire · 2 d · depends: H-1 · PRD 20.4 · UC-56

**Estimate:** 2 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (10):** FR-055, NFR-039, FR-056, NFR-017, FR-057, FR-059, FR-060, FR-058, FR-061, FR-169

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] T-1.1 fs_watch: ReadDirectoryChangesW with an overflow recount (0.5 d)
- [ ] T-1.2 Parent-link registry and tree kill (0.5 d)
- [ ] T-1.3 tripwire core: count, trip, second kill and verify (0.5 d)
- [ ] T-1.4 TripwireCard (both states) and tripwire_expected (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [M-1] Guided merge (plain code)
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E23` · Milestone: `Sprint 8`, `v0.1`

**Story:** Guided merge (plain code) · 1.75 d · depends: H-1, N-1 (lane B) · PRD 23.3 · UC-59

**Estimate:** 1.75 d over 3 tasks (tech lead). **Spikes:** none.

**Traces (8):** FR-096, FR-097, FR-099, FR-100, NFR-061, NFR-183, FR-098, FR-169

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] M-1.1 Offer detection and the test command (0.5 d)
- [ ] M-1.2 The runner (0.75 d)
- [ ] M-1.3 Result, Close the PR and the GuidedMerge component (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [SUP-3] Supervisor eval harness as a regression suite
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E25`, `gate:SP-SUP2` · Milestone: `Sprint 2`, `v0.1`

**Story:** Supervisor eval harness as a regression suite · 1 d · depends: S1-1 · PRD 25.3 · UC-63

**Estimate:** 1 d over 2 tasks (tech lead). **Spikes:** SP-SUP2.

**Traces (6):** FR-130, FR-131, NFR-076, FR-128, NFR-091, NFR-111

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] SUP-3.1 Port the harness to TypeScript (0.5 d)
- [ ] SUP-3.2 Leak bar, size and wake-up metrics, the held-out set, and the CI job (0.5 d; spike: SP-SUP2 (acceptance): the held-out set of ≥ 300 moments and the 0-leak, prompt-size and wake-up bars come from SP-SUP2. The v0.1 launch waits for its pass (G3-1))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [SUP-1] The supervisor in the core, always on
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E25`, `epic:E27`, `epic:E28`, `gate:SP-SUP2` · Milestone: `Sprint 8`, `v0.1`

**Story:** The supervisor in the core, always on · 3 d → **3.25 d** · depends: H-1, BU-1, AC-2, SUP-2 contract (lane B), SUP-3 · PRD 25.3, 27.8, 27.11, 28.4 · UC-63, UC-66

**Estimate:** 3.25 d over 9 tasks (tech lead). **Spikes:** SP-SUP2.

**Traces (28):** FR-129, FR-130, FR-131, NFR-076, FR-132, FR-133, NFR-091, NFR-188, NFR-181, FR-135, NFR-014, NFR-031, NFR-066, FR-128, FR-136, NFR-042, NFR-049, NFR-090, NFR-111, NFR-095, NFR-094, NFR-101, FR-137, FR-127, FR-134, FR-138, FR-170, NFR-103

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] SUP-1.1 Signals and rules v2 (0.5 d)
- [ ] SUP-1.2 Overrides and the text filter (0.25 d)
- [ ] SUP-1.3 Trimmer (0.25 d)
- [ ] SUP-1.4 Redactor and xtask redact (0.5 d; spike: SP-SUP2 (acceptance): the cases found by the recorder join the corpus, and the 0-leak bar on real moments)
- [ ] SUP-1.5 Redaction corpus, property tests and the coverage gate (0.25 d; spike: SP-SUP2 (acceptance))
- [ ] SUP-1.6 Ask path: eucas-guard stop and the core's ask server (0.5 d)
- [ ] SUP-1.7 Server client and the kill switch (0.25 d; spike: SP-SUP2 (acceptance): the prompt cap (about 2,000 tokens) and the wake-up rate are re-set from SP-SUP2's measurements)
- [ ] SUP-1.8 Sent log, and the account and supervisor diagnostic sections (0.25 d)
- [ ] SUP-1.9 What is sent, and receipts with Why? (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [Q-1] Hardening
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E18`, `blocked:SP-ST2` · Milestone: `Sprint 11`, `v0.1`

**Story:** Hardening · 1.5 d → **2.5 d** · depends: all · PRD 18.5 · UC: all

**Estimate:** 2.5 d over 4 tasks (tech lead). **Spikes:** SP-ST2.

**Traces (20):** NFR-007, NFR-008, NFR-009, NFR-010, NFR-021, NFR-130, NFR-131, NFR-132, NFR-067, NFR-138, FR-169, FR-032, FR-061, FR-188, NFR-061, NFR-180, NFR-151, NFR-150, NFR-011, NFR-137

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-a.md](tasks-lane-a.md)):
- [ ] Q-1.1 Perf samplers and hard budgets (0.5 d)
- [ ] Q-1.2 Accessibility, the full e2e set and the undo-everywhere audit (0.5 d; spike: SP-ST2 (acceptance): the notch's UIA and keyboard checks follow the route SP-ST2 chooses (a UIA provider, or the hidden-companion fallback))
- [ ] Q-1.3 README, the published bypass table, the threat model, and the manual checklist on Windows 11 (0.5 d)
- [ ] Q-1.4 Windows 10 22H2 VM pass (G3-5) (1 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [U-1] Tauri shell
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E18`, `epic:E27`, `blocked:SP-ST2` · Milestone: `Sprint 1 (U-1.4, U-1.6 in Sprint 2)`, `v0.1`

**Story:** Tauri shell · 2.0 d (plan 1.5) · depends: S1-1 · PRD 18.2 (as amended by v0.6), 27.3 · UC-60

**Estimate:** 2 d over 6 tasks (tech lead). **Spikes:** SP-ST2.

**Traces (20):** FR-101, FR-001, FR-109, NFR-010, NFR-067, NFR-185, NFR-182, NFR-183, FR-103, FR-104, FR-105, FR-021, NFR-036, NFR-153, NFR-180, FR-116, FR-048, FR-107, FR-115, NFR-136

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] U-1.1 App crate, the pre-warmed panel and the setup window (0.5 d)
- [ ] U-1.2 IPC contract, the store and state_patch (0.5 d)
- [ ] U-1.3 Derive functions: notch state and tray state (0.25 d)
- [ ] U-1.5 Playwright harness over WebView2 CDP, and the build / e2e CI jobs (0.25 d)
- [ ] U-1.4 Tray fallback, single instance, autostart, quit dialog (0.25 d)
- [ ] U-1.6 Peek mode without activation; process AUMID (0.25 d; spike: SP-ST2 (peek without activation))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [N-0] The native notch
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E27`, `blocked:SP-ST2` · Milestone: `Sprint 3`, `v0.1`

**Story:** The native notch · 3.25 d (plan 2.5) · depends: U-1, SP-ST2 · PRD 27.1, 27.2, 27.10 · UC-60, UC-55

**Estimate:** 3.25 d over 8 tasks (tech lead). **Spikes:** SP-ST2.

**Traces (27):** NFR-185, FR-173, NFR-134, FR-103, FR-104, FR-105, FR-106, FR-114, FR-042, FR-058, NFR-133, NFR-008, FR-117, FR-102, FR-001, NFR-011, NFR-137, NFR-047, NFR-136, FR-107, FR-109, NFR-007, NFR-132, NFR-131, FR-118, NFR-078, NFR-010

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] N-0.1 Notch tokens as plain values → generated Rust constants (0.25 d)
- [ ] N-0.2 Drawing core and the eye grammar: exactly eight faces (0.75 d)
- [ ] N-0.3 Drawing: beam, markers, Not protected, tripwire, thin line, arrival (0.5 d)
- [ ] N-0.4 Notch window: layered, no-activate, click-through, placement, full-screen step-aside, panic catch (0.5 d)
- [ ] N-0.5 Hover poll, peek trigger, click → panel, input idle; the budgets (0.25 d; spike: SP-ST2 (keyboard-focus peek only))
- [ ] N-0.6 UI Automation provider (0.25 d; spike: SP-ST2)
- [ ] N-0.7 Optional panel shortcut with RegisterHotKey (0.25 d; spike: SP-ST2)
- [ ] N-0.8 Gooey peek: the notch body melts into the card (DESIGN §5.1) (0.5 d; spike: SP-ST2 (peek without activation, which the handoff relies on))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [N-1] Needs-you and sounds
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E23`, `epic:E27` · Milestone: `Sprint 7`, `v0.1`

**Story:** Needs-you and sounds · 2.0 d (plan 1.5) · depends: H-1, N-0 · PRD 23.1, 27.2, 27.10 (sounds) · UC-60

**Estimate:** 2 d over 6 tasks (tech lead). **Spikes:** none.

**Traces (21):** FR-110, FR-112, FR-120, FR-052, FR-038, FR-142, FR-161, FR-106, FR-107, FR-108, FR-109, NFR-130, NFR-135, FR-111, FR-113, FR-169, NFR-136, FR-115, FR-042, FR-058, FR-119

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] N-1.1 Item model, event mapping and resolution (0.5 d)
- [ ] N-1.2 Notch markers, peek lines, the panel's Needs you list (0.5 d)
- [ ] N-1.3 Open session (S-4) (0.25 d)
- [ ] N-1.4 Not now, the Undo toast, pause notifications (0.25 d)
- [ ] N-1.5 Toast fallback under the policy (0.25 d)
- [ ] N-1.6 Sounds (PRD 27.10, DESIGN §6) (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [L-1] Usage: ledger and forecast
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E22` · Milestone: `Sprint 6`, `v0.1`

**Story:** Usage: ledger and forecast · 1.5 d · depends: G-3, G-4, H-1, U-1 · PRD 22.1 · UC-58

**Estimate:** 1.5 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (16):** FR-084, NFR-006, NFR-157, NFR-031, FR-187, NFR-158, NFR-040, FR-085, FR-086, FR-089, FR-090, NFR-094, FR-087, FR-088, FR-091, NFR-130

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] L-1.1 Status-line wrapper subcommand (0.5 d)
- [ ] L-1.2 Chain and restore the status line in user settings (0.25 d)
- [ ] L-1.3 Ledger and forecast (0.25 d)
- [ ] L-1.4 The Usage tab (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [R-1] Rules, including the 10 library safety rules
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E21`, `epic:E27` · Milestone: `Sprint 7`, `v0.1`

**Story:** Rules, including the 10 library safety rules · 3.25 d (plan 1.5) · depends: G-1, G-2, H-1, U-1, P-1.4 · PRD 21.1, 27.8 (Undo on rules) · UC-57

**Estimate:** 3.25 d over 9 tasks (tech lead). **Spikes:** none.

**Traces (26):** FR-072, FR-082, NFR-185, FR-066, FR-063, FR-083, NFR-061, NFR-077, FR-071, FR-073, FR-074, NFR-161, FR-024, FR-068, FR-163, FR-037, FR-070, FR-080, FR-081, FR-169, FR-062, FR-067, FR-047, NFR-062, FR-069, NFR-079

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] R-1.1 Rulebook schema and model (0.25 d)
- [ ] R-1.2 Compiler → rulebook.bin (0.25 d)
- [ ] R-1.3 Dry run, conflicts, runner warning (0.25 d)
- [ ] R-1.4 Suggestions and templates (0.25 d)
- [ ] R-1.5 Save, toggle, delete, counters, Undo (0.25 d)
- [ ] R-1.6 The Rules tab (0.5 d)
- [ ] R-1.7 Rulebook tamper watch (0.25 d)
- [ ] R-1.8 Library rules, git and system family (SRS Appendix A) (0.75 d)
- [ ] R-1.9 Library rules, data and outward family (SRS Appendix A) (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [R-2] Prompted rules
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E21` · Milestone: `Sprint 10`, `v0.1`

**Story:** Prompted rules · 1.75 d · depends: R-1, AC-2, BU-1, SUP-2.2 · PRD 21.2 · UC-57

**Estimate:** 1.75 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (13):** FR-075, FR-078, NFR-092, NFR-111, NFR-072, NFR-097, FR-076, FR-066, NFR-077, FR-077, FR-064, FR-079, NFR-042

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] R-2.1 Worker /v1/draft-rule (0.5 d)
- [ ] R-2.2 Core ruledraft: client and checks (0.5 d)
- [ ] R-2.3 Describe-a-rule composer and the draft card (0.5 d)
- [ ] R-2.4 Guided exact-rule form (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [P-1] Panel header, Settings, Protection
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E20`, `epic:E27`, `epic:E18` · Milestone: `Sprint 6`, `v0.1`

**Story:** Panel header, Settings, Protection · 1.5 d (plan 1) · depends: H-1, C-1, AC-2, W-1 · PRD 20.3 (as amended: no export, FD-3 / G3-2), 27.3, 27.4, 18.3 · UC-55, UC-60

**Estimate:** 1.5 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (22):** FR-109, FR-065, FR-040, FR-053, FR-174, FR-117, FR-118, FR-188, FR-048, FR-175, FR-070, FR-064, NFR-133, NFR-131, NFR-135, FR-049, FR-039, FR-050, FR-061, FR-038, FR-170, NFR-103

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] P-1.1 Panel header and tab shell (0.25 d)
- [ ] P-1.2 Settings shell: Name and look, The notch, Help, Plan, Quit (0.5 d)
- [ ] P-1.4 Gooey switch component (DESIGN §5, §5.1) (0.25 d)
- [ ] P-1.3 Protection page, the log, What Eucas can't see, a block's Why? (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [O-1] Setup
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E24`, `epic:E19`, `epic:E27`, `epic:E28` · Milestone: `Sprint 9`, `v0.1`

**Story:** Setup · 3.25 d (plan 3) · depends: A-1, A-2, C-1, R-1, L-1, AC-2, N-0, SUP-1, P-1.2 · PRD 24.1, 19.7, 27.4, 27.6, 27.11, 28.2 · UC-54

**Estimate:** 3.25 d over 7 tasks (tech lead). **Spikes:** none.

**Traces (39):** FR-001, FR-030, FR-031, NFR-040, FR-002, FR-003, FR-004, FR-005, FR-006, NFR-012, NFR-046, FR-007, FR-174, FR-008, FR-009, FR-024, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-018, FR-019, NFR-033, NFR-041, FR-020, FR-021, FR-022, FR-023, FR-025, NFR-043, FR-026, FR-027, FR-028, FR-029, FR-138, NFR-095

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] O-1.1 Setup flow, persistence, resume, Back (0.5 d)
- [ ] O-1.2 Step 1: detection and its edges (0.5 d)
- [ ] O-1.3 Step 2: Make your Euca (0.25 d)
- [ ] O-1.4 Step 3: the retro (0.5 d)
- [ ] O-1.5 Steps 4–5: lock and test (0.5 d)
- [ ] O-1.6 Steps 6–7: sign in and choose your rules (0.5 d)
- [ ] O-1.7 Steps 8–9 and finish (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [W-1] Worker v0.1
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E18`, `gate:SP-SUP2` · Milestone: `Sprint 2`, `v0.1`

**Story:** Worker v0.1 · 1.75 d (plan 1.5) · depends: S1-1, U-1 · PRD 18.3 · UC-58, UC-62

**Estimate:** 1.75 d over 4 tasks (tech lead). **Spikes:** SP-SUP2.

**Traces (13):** NFR-072, NFR-117, NFR-180, NFR-065, NFR-049, NFR-187, FR-182, FR-184, NFR-042, FR-175, FR-176, NFR-098, NFR-090

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] W-1.1 Worker scaffold (0.25 d)
- [ ] W-1.2 /v1/config and /v1/updates (0.5 d)
- [ ] W-1.3 Config signing tool and the app's config client (0.5 d; spike: SP-SUP2 (acceptance: the production config can't be signed until the eval score exists))
- [ ] W-1.4 Waitlist, telemetry, ProLine, Settings › Updates and Privacy (0.5 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [AC-1] Accounts on the Worker
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E28`, `blocked:SP-AC1` · Milestone: `Sprint 4`, `v0.1`

**Story:** Accounts on the Worker · 1.75 d · depends: W-1, SP-AC1, P9 · PRD 28.1 · UC-65, UC-66

**Estimate:** 1.75 d over 5 tasks (tech lead). **Spikes:** SP-AC1.

**Traces (20):** FR-153, NFR-096, NFR-186, FR-146, FR-148, FR-149, FR-151, NFR-071, NFR-102, FR-144, FR-145, FR-154, FR-158, NFR-070, NFR-099, FR-160, NFR-015, FR-150, NFR-117, NFR-202

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] AC-1.1 D1 schema, migrations, the cleanup cron (0.25 d)
- [ ] AC-1.2 /v1/auth/start and /v1/auth/verify (0.5 d)
- [ ] AC-1.3 Tokens, refresh, sign out, account, delete, trial start (0.5 d)
- [ ] AC-1.4 EmailSender: Cloudflare Email Service and Resend (0.25 d; spike: SP-AC1)
- [ ] AC-1.5 Disposable-domain refusal (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [AC-2] Accounts in the app
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E28` · Milestone: `Sprint 5`, `v0.1`

**Story:** Accounts in the app · 2.25 d · depends: AC-1, H-1, U-1 · PRD 28.2, 28.3, 28.4 · UC-65

**Estimate:** 2.25 d over 4 tasks (tech lead). **Spikes:** none.

**Traces (19):** FR-054, FR-154, NFR-070, FR-146, FR-147, FR-148, FR-149, FR-150, FR-155, FR-161, FR-156, FR-157, FR-158, FR-159, NFR-099, FR-152, FR-168, NFR-100, NFR-041

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] AC-2.1 Account client and DPAPI tokens (0.5 d)
- [ ] AC-2.2 SignInStep (the signed-out panel is dropped: signed out = no account, NA-1.5) (0.5 d)
- [ ] AC-2.3 Settings › Account, sign out, delete (0.5 d)
- [ ] AC-2.4 Per-account profiles (0.75 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [BU-1] The budget on the Worker
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E27`, `epic:E28`, `gate:SP-SUP2` · Milestone: `Sprint 4`, `v0.1`

**Story:** The budget on the Worker · 1 d · depends: AC-1, W-1.3 · PRD 27.5, 27.6, 28.4 · UC-66, UC-63

**Estimate:** 1 d over 2 tasks (tech lead). **Spikes:** SP-SUP2.

**Traces (11):** FR-025, FR-143, FR-144, NFR-044, NFR-110, NFR-112, NFR-114, FR-139, FR-140, NFR-111, NFR-115

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] BU-1.1 Periods, reserve, settle, the daily breaker (0.5 d; spike: SP-SUP2 (acceptance: the cap values))
- [ ] BU-1.2 Prompt cap and /v1/meter (0.5 d; spike: SP-SUP2 (acceptance: `promptTokenCap`))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [ME-1] Supervisor meter
Labels: `companion`, `type:story`, `lane:B`, `priority:must`, `epic:E27` · Milestone: `Sprint 5`, `v0.1`

**Story:** Supervisor meter · 0.5 d · depends: BU-1, AC-2 · PRD 27.5, 27.6 · UC-66

**Estimate:** 0.5 d over 2 tasks (tech lead). **Spikes:** none.

**Traces (9):** FR-139, FR-140, FR-141, FR-142, NFR-115, NFR-132, FR-091, FR-156, NFR-042

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] ME-1.1 SupervisorMeter in every state (0.25 d)
- [ ] ME-1.2 PlanCard and meter refresh (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [SUP-2] /v1/supervise
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E25`, `epic:E27`, `gate:SP-SUP2` · Milestone: `Sprint 6`, `v0.1`

**Story:** /v1/supervise · 1 d · depends: BU-1 · PRD 25.3, 27.5 · UC-63

**Estimate:** 1 d over 2 tasks (tech lead). **Spikes:** SP-SUP2.

**Traces (12):** FR-128, FR-129, FR-133, NFR-049, NFR-072, NFR-073, NFR-091, FR-130, FR-132, NFR-014, NFR-076, NFR-097

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] SUP-2.1 The route: auth, strictness, re-scan, cap, reserve, kill switch (0.5 d; spike: SP-SUP2 (acceptance: real prompt sizes; the switch stays on until it passes))
- [ ] SUP-2.2 Model chain, ZDR, output validation, settle, idempotency (0.5 d; spike: SP-SUP2 (acceptance: the model choice))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [R1] Release
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E18`, `epic:E26`, `gate:SP-SUP2`, `blocked:SP-AC1` · Milestone: `Sprint 5 (R1.1, R1.2), Sprint 6 (R1.4), Sprint 7 (R1.3)`, `v0.1`

**Story:** Release · 1.75 d · depends: U-1, W-1 (+ AC-1 for the Worker workflow) · PRD 18.4, 26.2 · UC-54

**Estimate:** 1.75 d over 4 tasks (tech lead). **Spikes:** SP-SUP2, SP-AC1.

**Traces (14):** FR-001, FR-187, NFR-021, NFR-150, FR-182, NFR-022, NFR-045, NFR-064, FR-032, NFR-074, NFR-075, NFR-187, NFR-180, NFR-186

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] R1.1 NSIS per-user installer (0.5 d)
- [ ] R1.2 Updater and channels (0.25 d)
- [ ] R1.3 release.yml (0.75 d; spike: SP-SUP2 (acceptance: stable release only, G3-1))
- [ ] R1.4 deploy-api.yml (0.25 d; spike: SP-AC1 (acceptance: the staging code-send smoke))

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [LY-1] Learns you
Labels: `companion`, `type:story`, `lane:A`, `priority:must`, `epic:E27` · Milestone: `Sprint 9 (LY-1.1–LY-1.4), Sprint 10 (LY-1.5–LY-1.8)`, `v0.1`

**Story:** Learns you · 3.0 d (indicative 2–3) · depends: R-1, N-1, SUP-1, AC-2, P-1, L-1, N-0 · PRD 27.7, 27.8 ("That was wrong"), 27.9 (calm and worst moments) · UC-67, UC-60

**Estimate:** 3 d over 8 tasks (tech lead). **Spikes:** none.

**Traces (23):** FR-162, FR-168, NFR-093, NFR-100, FR-163, FR-024, FR-169, NFR-061, FR-164, FR-165, FR-170, FR-166, FR-028, NFR-103, FR-167, FR-114, FR-171, FR-172, FR-173, NFR-136, FR-121, FR-088, NFR-183

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md](tasks-lane-b.md)):
- [ ] LY-1.1 learned_item store and the learner (0.5 d)
- [ ] LY-1.2 A structured "you denied" signal (0.25 d)
- [ ] LY-1.3 The live rule suggestion (0.25 d)
- [ ] LY-1.4 The learned line, the Applied chip, That was wrong (0.5 d)
- [ ] LY-1.5 Settings › What Pip knows (0.5 d)
- [ ] LY-1.6 The monthly compounding line (0.25 d)
- [ ] LY-1.7 Moments: all caught up, while you were away, back to normal (0.5 d)
- [ ] LY-1.8 Undo-everywhere audit and the worst-moment banners (PRD 27.9) (0.25 d)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

### [NA-1] No account: safety and a small supervisor taste
Labels: `companion`, `type:story`, `lane:A`, `lane:B`, `priority:must`, `epic:E24`, `epic:E27`, `epic:E28`, `gate:SP-SUP2`, `needs:founder-answer` · Milestone: `Sprint 5` … `Sprint 10` (per task below), `v0.1`

**Story:** As someone trying Eucas, I can finish setup without an account and still get the four locked limits, the mass-delete tripwire and about 10 supervisor answers, with Pip in a minimal notch and panel, so I can see it work before I sign up. Founder decisions 2026-10-26 ("we make people have a small taste without sign up and then they have to create account or buy pro"; addendum: "Let the no account also have to try the supervisor also but like small number of usage"). · 5.25 d · PRD 24.1, 25.3, 27.5, 28.2, 28.3 (as revised) · UC-54, UC-55, UC-56, UC-60, UC-63, UC-65

**Estimate:** 5.25 d over 11 tasks (tech lead). **Spikes:** SP-SUP2 (acceptance, NA-1.9, NA-1.10). **Waits for:** founder answers (a) surface (minimal notch recommended), (b) trial at sign-up (recommended), (c) taste size (10 recommended); the design routes `s-noacct-done`, `p-noacct`, `p-noacct-empty`, `t-noacct`.

**Acceptance (story level, Given/When/Then):**
- Given a fresh install, When I press Continue without an account at step 6, Then I see step 8 What is sent and the no-account step 9, and Pip flies to a minimal notch.
- Given no account and no network, When a session pushes to the default branch or mass-deletes files, Then the push is blocked and the delete is stopped.
- Given no account, When Pip supervises, Then only supervisor-taste calls reach the Eucas server, and none once the taste is used up; then Pip asks me instead and shows "Sign up for 14 more days of the supervisor" once.
- Given I sign out or delete my account, Then I'm back in the no-account state with protection unchanged.

**Traces:** FR-020, FR-026 – FR-030, FR-054, FR-102 – FR-109, FR-116, FR-128, FR-129, FR-132, FR-133, FR-138, FR-139, FR-142 – FR-146, FR-155 – FR-159, FR-173, FR-184, NFR-033, NFR-041, NFR-044, NFR-070 – NFR-073, NFR-090, NFR-091, NFR-096, NFR-097 (as revised where marked)

**Tasks** (acceptance criteria, files and tests per task in [tasks-lane-b.md §NA-1](tasks-lane-b.md)):
- [ ] NA-1.1 AccountState and the server-call gate in the core (0.5 d · Sprint 5 · lane B)
- [ ] NA-1.7 The trial starts at sign-up (0.25 d · Sprint 6 · lane B · needs founder answer (b))
- [ ] NA-1.8 Worker: install registration and the signed install token (0.5 d · Sprint 7 · lane A)
- [ ] NA-1.9 Worker: the anonymous supervisor-taste route (0.5 d · Sprint 9 · lane A · needs founder answer (c); gate SP-SUP2)
- [ ] NA-1.10 Core: install ID, the taste counter and the used-up state (0.5 d · Sprint 9 · lane A; gate SP-SUP2)
- [ ] NA-1.2 The no-account tray fallback menu (0.25 d · Sprint 9 · lane A)
- [ ] NA-1.11 The minimal notch and minimal panel, and the taste-used-up state (0.75 d · Sprint 10 · lane B · needs founder answer (a))
- [ ] NA-1.3 Setup without an account: step 6 → 8 → 9 (no account) (0.5 d · Sprint 10 · lane B)
- [ ] NA-1.4 Sign up later: setup steps 6–9 (0.5 d · Sprint 10 · lane B)
- [ ] NA-1.5 Sign out and delete → the no-account state (0.5 d · Sprint 10 · lane B)
- [ ] NA-1.6 E2E: a fresh install with no account protects you offline; taste calls only, none after it's used up (0.5 d · Sprint 10 · lane B)

**Done when:** every task is merged into `dev` with its tests, CI is green, the trace event shows in the app, and the story is demoed at the sprint review (Definition of Done in [story-map.md §3](story-map.md#3-definition-of-ready-and-done-companion-tasks)).

## 3. Sprint 1 task issues

One issue per task, linked to its story issue; each is one PR into `dev`.

### [S1-1.1] Cargo workspace, crate skeletons and xtask check-deps
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [S1-1]

**Traces:** NFR-182, NFR-033, NFR-078, NFR-200, NFR-153

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § S1-1.1.

### [S1-1.2] pnpm workspace, TypeScript, lint and hooks
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [S1-1]

**Traces:** NFR-182, NFR-067, NFR-185

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § S1-1.2.

### [S1-1.3] contracts/ and xtask codegen, with the fixed strings stored once
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [S1-1]

**Traces:** NFR-185, FR-050, FR-138, FR-036, NFR-138, NFR-183

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § S1-1.3.

### [S1-1.4] CI jobs ts, rust, contracts, licences, dependency-review, changeset
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [S1-1]

**Traces:** NFR-180, NFR-075, NFR-200, NFR-153

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § S1-1.4.

### [G-1.1] ToolCall model and the PathResolver seam
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [G-1]

**Traces:** FR-033, NFR-061

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § G-1.1.

### [G-1.2] Bash tokenizer
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [G-1]

**Traces:** FR-034, NFR-061, NFR-152

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § G-1.2.

### [G-1.3] PowerShell and cmd tokenizers
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [G-1]

**Traces:** FR-034, NFR-061, NFR-152

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § G-1.3.

### [G-1.4] Path canonicaliser (lexical part and Windows resolver)
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [G-1]

**Traces:** NFR-061, FR-034, FR-092

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § G-1.4.

### [G-1.5] Property tests and nightly fuzz targets
Labels: `companion`, `type:task`, `lane:A` · Milestone: `Sprint 1`, `v0.1` · Parent: [G-1]

**Traces:** NFR-061, NFR-032

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-a.md](tasks-lane-a.md) § G-1.5.

### [U-1.1] App crate, the pre-warmed panel and the setup window
Labels: `companion`, `type:task`, `lane:B` · Milestone: `Sprint 1`, `v0.1` · Parent: [U-1]

**Traces:** FR-101, FR-001, FR-109, NFR-010, NFR-067

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-b.md](tasks-lane-b.md) § U-1.1.

### [U-1.2] IPC contract, the store and state_patch
Labels: `companion`, `type:task`, `lane:B` · Milestone: `Sprint 1`, `v0.1` · Parent: [U-1]

**Traces:** NFR-067, NFR-185, NFR-182, NFR-183

**Estimate:** 0.5 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-b.md](tasks-lane-b.md) § U-1.2.

### [U-1.3] Derive functions: notch state and tray state
Labels: `companion`, `type:task`, `lane:B` · Milestone: `Sprint 1`, `v0.1` · Parent: [U-1]

**Traces:** FR-103, FR-104, FR-105, FR-021, NFR-036

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-b.md](tasks-lane-b.md) § U-1.3.

### [U-1.5] Playwright harness over WebView2 CDP, and the build / e2e CI jobs
Labels: `companion`, `type:task`, `lane:B` · Milestone: `Sprint 1`, `v0.1` · Parent: [U-1]

**Traces:** NFR-010, NFR-153, NFR-180

**Estimate:** 0.25 d · **Spike:** none

Acceptance criteria, files, tests and trace event: [tasks-lane-b.md](tasks-lane-b.md) § U-1.5.
