# Sprint 01: 3 working days from the day after Gate 6 is approved

> **Approved at Gate 6 (2026-10-26, [decisions](../../backlog/G6-DECISIONS.md)).** Day 1 is day 8 after the landing page goes live, and only if the waitlist has ≥ 100 sign-ups by then (decision 3a).

## Planning
- **Sprint goal** (one sentence the client can check): *The repo builds green on Windows and Ubuntu, the guard's parser turns bash, PowerShell and cmd commands into the exact calls and paths it will judge, and the hidden panel shows live state in under 150 ms.*
- **How you check it at the demo (about 5 minutes):**
  1. The PR checks are green on both OSes: `ts`, `rust`, `contracts`, `licences`, `dependency-review`, `build`, `e2e` and `secret-scan`.
  2. `cargo nextest run -p eucas-rules` shows the tokenizer snapshots. In each, a command such as `bash -c "rm -rf ~/x"`, `powershell -EncodedCommand …`, `cmd /c del /s /q x` or `Get-ChildItem | Remove-Item` becomes a named program with canonical paths, and `$(…)`, `iex` or `eval` becomes **Unresolved**, which can never be auto-approved.
  3. `pnpm test:e2e` launches the app. One hidden webview exists at idle, and the panel's first frame is under 150 ms.
- **Capacity / notes:**
  - Two Claude developer lanes in separate worktrees; you review.
  - Lane A: S1-1 (1.5 d) → G-1 (1.75 d) = 3.25 d.
  - Lane B: U-1's first four tasks (1.5 d), after S1-1.4 merges. Lane B is idle or reviewing for the first ~1.5 days, because everything needs the scaffold.
  - If lane A runs over, **G-1.5 (fuzz targets) moves to Sprint 2, day 1**. The goal holds without it.
- **Committed stories:**

| Story | Title | Points (days) | Owner (agent) | Tasks |
|---|---|---|---|---|
| S1-1 | Monorepo scaffold (pnpm + Cargo, contracts + codegen, lint, CI) | 1.5 | `developer` (lane A) | S1-1.1 Cargo workspace, crate skeletons, `xtask check-deps` (0.5) → S1-1.2 pnpm workspace, TS, lint, hooks (0.25) → S1-1.3 `contracts/` + `xtask codegen`, the fixed strings stored once (0.5) → S1-1.4 CI jobs (0.25). Each merges before the next starts |
| G-1 | Neutral `ToolCall`, shell tokenizers and path canonicaliser | 1.75 | `developer` (lane A) | G-1.1 `ToolCall` + `PathResolver` (0.25) → G-1.2 bash (0.5) ∥ G-1.3 PowerShell + cmd (0.5) ∥ G-1.4 canonicaliser (0.25) → G-1.5 proptest + nightly fuzz (0.25) |
| U-1 (part) | Tauri shell: pre-warmed panel, store, derive, e2e harness | 1.5 of 2.0 | `developer` (lane B) | U-1.1 app crate, pre-warmed panel, setup window (0.5) → U-1.2 IPC contract, store, `state_patch` (0.5) → U-1.3 derive notch and tray state (0.25) → U-1.5 Playwright over WebView2 CDP, `build` / `e2e` jobs (0.25). U-1.4 and U-1.6 are in Sprint 2 |

Each task's traces (SRS FR/NFR ids), files, acceptance criteria, named tests and trace event are in [tasks-lane-a.md §S1-1, §G-1](../../backlog/tasks-lane-a.md) and [tasks-lane-b.md §U-1](../../backlog/tasks-lane-b.md). Main traces: NFR-182, NFR-185, NFR-033, NFR-078, NFR-200, NFR-180 (scaffold) · FR-033, FR-034, NFR-061, NFR-152 (parser) · FR-101, FR-103–FR-105, NFR-010, NFR-067 (shell).

- **File ownership in this sprint** (tech lead; the two lanes never edit the same file):

| Path | Owner | Rule |
|---|---|---|
| root `Cargo.toml`, `rust-toolchain.toml`, `deny.toml`, `.cargo/` | S1-1.1 | Frozen after S1-1.1. It declares `members = ["crates/*", "xtask"]` and pre-declares the shared workspace dependencies (Tauri among them); crate-local dependencies go in each crate's own `Cargo.toml` |
| `package.json`, `pnpm-workspace.yaml` (`!apps/landing`), `tsconfig.base.json`, `eslint.config.js`, `lefthook.yml`, `.changeset/` | S1-1.2 | Frozen; U-1 adds dependencies only in `apps/companion/package.json` |
| every module file in CODE-STRUCTURE §1, created empty | S1-1.1 | No later task edits a `mod` list. In Sprint 1, G-1.4 fills only the path files in `eucas-platform`, and **U-1 doesn't touch `eucas-platform`** |
| `contracts/errors/<domain>`, `contracts/copy/en/<surface>`, `contracts/ipc/**` | S1-1.3 creates the layout | U-1 owns `contracts/ipc/**`, `errors/ipc`, `copy/en/tray`; G-1 adds no contract |
| `.github/workflows/ci.yml` | S1-1.4 | After it merges, **only U-1.5** adds the `build` and `e2e` jobs; G-1.5's fuzzing goes in a new `fuzz.yml` |
| `Cargo.lock`, `pnpm-lock.yaml` | — | Never hand-merged: whoever merges second rebases and regenerates |
| `crates/eucas-rules/**` | G-1 | Lane B never touches it |
| `crates/eucas-app/**`, `crates/eucas-core/src/{app_state,derive}.rs`, `apps/companion/**`, `tests/e2e/**` | U-1 | Lane A never touches them |
| `apps/landing/` | nobody | Untouched; it stays on npm |

- **Order:**
  - **Day 1:** S1-1.1 → S1-1.2 → S1-1.3.
  - **Day 2:** S1-1.4. Then lane A starts G-1.1 → (G-1.2 ∥ G-1.3 ∥ G-1.4), and lane B starts U-1.1 → U-1.2.
  - **Day 3:** G-1.5; U-1.3 → U-1.5; demo.
- **Risks / dependencies:**
  - **The required checks are named.** The ruleset on `main`, `staging` and `dev` requires `Secret scan (gitleaks)`, `Build & test (windows-latest)` and `Build & test (ubuntu-latest)`. If S1-1.4 renames or replaces `build-test`, every PR blocks. S1-1.4 keeps a job named `Build & test (${{ matrix.os }})` that runs the real checks. The new jobs become required only after you change the ruleset, an account setting that you change yourself. *(Tech lead.)*
  - **The WebView2 CDP harness on the Windows runner (U-1.5) is new.** If it is flaky, U-1.5 lands its Ubuntu `tauri-driver` smoke first, and the Windows CDP run moves to Sprint 2, day 1.
  - **G-1.4's 8.3-name test** depends on the runner. It is skipped with a printed reason, never silently.
  - **CLAUDE.md still describes the Electron app.** S1-1.4's PR updates its Commands and Architecture sections for Tauri, Rust and pnpm, if you approve (G6 decision 11 (i)).
  - **No spike blocks Sprint 1.** SP-ST2 must be at GO by Sprint 2 (U-1.6).
  - **The no-account decisions (2026-10-26) don't change Sprint 1.** Its scope, goal and capacity stand. The new NA-1 work (no account: Free without memory, with a 10-decision supervisor taste and 1 own rule; +4.5 d) starts in Sprint 5. Sprint 1 has no touchpoint: the tray U-1.3 derives is the same with or without an account.
- **Client approval of scope:** ☑ 2026-10-26 (Gate 6)

## Daily standups
Append entries from `/standup`:

### YYYY-MM-DD
- **Done:** …
- **Doing:** …
- **Blocked:** … → action, owner

## Review (demo)
| Story | Demoed | Accepted by client? | Notes |
|---|---|---|---|
| S1-1 | | | |
| G-1 | | | |
| U-1 (part) | | | |

- **Increment:** release or build link
- **Metrics:** velocity, bugs found and fixed, tokens used

## Retrospective
- **Went well:**
- **To improve:**
- **Action items for next sprint** (max 2, each with an owner):
