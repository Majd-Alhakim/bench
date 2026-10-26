# Task breakdown, lane A (guard and core): the Eucas companion v0.1

> **Sprint and lane:** this file's lane is the split the tech leads wrote by. Which lane and sprint runs each story is set by the [sprint plan](README.md#4-sprint-plan), which wins over any sprint note below.

**Status:** draft for Gate 6 · **Author:** tech lead (lane A) · **Date:** 2026-10-26
**Sources:** [BUILD-PLAN](../architecture/companion/BUILD-PLAN.md) §2–§4 (stories, estimates, files, dependencies), [SRS](../requirements/SRS.md) v1.0 (FR/NFR ids, §4 interfaces, §7 traceability), [CODE-STRUCTURE](../architecture/companion/CODE-STRUCTURE.md), [TESTING](../architecture/companion/TESTING.md), [SYSTEM-DESIGN](../architecture/companion/SYSTEM-DESIGN.md), [SECURITY-PRIVACY](../architecture/companion/SECURITY-PRIVACY.md), [SUPERVISOR](../architecture/companion/SUPERVISOR.md), [CI-CD](../architecture/companion/CI-CD.md), [story map](story-map.md).

**Lane A in this file:** S1-1, G-1, G-2, G-3, G-4, G-5, A-1, A-2, H-1, C-1, T-1, F-1, M-1, D-1, SUP-1, SUP-3, Q-1. The other lead's lane B file covers U-1, N-0, N-1, L-1, R-1, R-2, P-1, O-1, W-1, AC-1, AC-2, BU-1, ME-1, SUP-2, R1 and learns-you. **This split is not the same as the story map's:** SUP-3 and A-2 move from B to A, and N-1, P-1 and SUP-2 move from A to B. The proposed lane-A order in §2 takes this into account.

**Rules for every task.** Each task is at most 1 day and is one PR into `dev`. Its tests come first. It follows `engineering-craft` and the story's constraint contract (the **Contract** line under each header). Every task traces to at least one FR or NFR. "Trace event" means the store change or log row that makes the feature visible in the UI (CLAUDE.md). There is no export anywhere except the diagnostic report and the tripwire's **Copy list** (NFR-103, FR-059, G3-2). No surface in lane A calls the toast API directly: toasts are N-1's fallback policy (FR-115, NFR-136, BR-108 (3)).

---

## 1. Sprint 1 (S1-1 → G-1) in detail

### 1.1 Order

1. **S1-1.1** Cargo workspace → 2. **S1-1.2** pnpm workspace → 3. **S1-1.3** contracts and codegen → 4. **S1-1.4** CI. Each merges before the next starts.
2. After S1-1.4 merges, the two lanes run in parallel. Lane B: U-1. Lane A: **G-1.1 → G-1.2 → G-1.3 → G-1.4 → G-1.5**. G-1.2 and G-1.3 can run in either order.
3. Sprint 1 holds 3.25 lane-A days (S1-1 1.5 + G-1 1.75). If the sprint runs over, **G-1.5 (fuzz targets) moves to Sprint 2 day 1**. The sprint goal holds without it: the paste-a-command demo needs G-1.1 to G-1.4.

### 1.2 Shared files: who owns them first

| Path | First owner | Rule for the rest of Sprint 1 |
|---|---|---|
| `Cargo.toml` (root), `rust-toolchain.toml`, `deny.toml`, `.cargo/config.toml` | S1-1.1 | Frozen. S1-1.1 declares every member crate and pre-declares `[workspace.dependencies]` (serde, serde_json, thiserror, bincode, sha2, windows, proptest, insta, tauri 2, tauri-build, typify) and `exclude = ["crates/eucas-rules/fuzz"]`, so neither G-1 nor U-1 edits the root. Crate-local dependencies go in the crate's own `Cargo.toml` |
| `Cargo.lock`, `pnpm-lock.yaml` | S1-1.1 / S1-1.2 | Never merged by hand. The lane that merges second rebases and regenerates the lockfile |
| `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.js`, `.prettierrc`, `lefthook.yml`, `.changeset/` | S1-1.2 | Frozen. U-1 adds its dependencies only in `apps/companion/package.json`. S1-1.2 writes the `apps/companion` ESLint boundary rules in advance |
| `crates/eucas-platform/src/{lib.rs,windows/mod.rs}`, `crates/eucas-core/src/lib.rs` | S1-1.1 | S1-1.1 creates **every module named in CODE-STRUCTURE §1 as an empty file**, plus `windows/hotkey.rs`, `windows/spool.rs` and `core/src/trace.rs`, so later stories never edit a `mod` list. In Sprint 1, G-1.4 fills only `paths.rs` and `windows/paths.rs`. **U-1 doesn't edit `eucas-platform` in Sprint 1.** If it needs a platform function, it waits for G-1.4 to merge |
| `contracts/` layout, `contracts/errors/`, `contracts/copy/en/` | S1-1.3 | U-1 owns `contracts/ipc/**` for the rest of Sprint 1. G-1 adds no contract |
| `xtask/` | S1-1.1, S1-1.3 | No new xtask commands in Sprint 1 |
| `.github/workflows/ci.yml` | S1-1.4 | **U-1 only** adds its `build` and `e2e` jobs, after S1-1.4 merges. G-1 doesn't touch `ci.yml` (its unit and proptest tests run in the existing `rust` job) |
| `.github/workflows/fuzz.yml` (new) | G-1.5 | — |
| `packages/ui-tokens/` (moved from `docs/design`) | S1-1.2 | U-1 reads it |
| `crates/eucas-rules/**` | G-1 | — |
| `crates/eucas-app/**`, `apps/companion/**` | U-1 | Lane A never touches them |
| `apps/landing/` (npm, has its own `package-lock.json`) | — | S1-1.2 excludes it from the workspace (`!apps/landing`) (question 4) |

**Hot files after Sprint 1.** Every story adds copy keys, error codes and IPC commands. To avoid one hot file per kind, S1-1.3 splits them by domain: `contracts/copy/en/<surface>.json`, `contracts/errors/<domain>.schema.json` and (a convention for U-1 to follow) `contracts/ipc/commands/<domain>.schema.json`. Codegen merges each kind into one generated module.

---

## S1-1 · Monorepo scaffold · 1.5 d · depends: G6 · PRD 18.1 · UC: — (cross-cutting)
**Contract:** every crate boundary in CODE-STRUCTURE §3 is enforced by `xtask check-deps` from day 1. There is no `SetWindowsHookEx` and the guard links no network crate. All Actions are SHA-pinned. The existing `secret-scan` job stays. Licence allow-list per NFR-200. Verified by: CI green on windows + ubuntu, and the check-deps self-tests.

### S1-1.1 Cargo workspace, crate skeletons and `xtask check-deps`
- **Traces:** NFR-182, NFR-033, NFR-078, NFR-200, NFR-153
- **Files:** `Cargo.toml`, `rust-toolchain.toml`, `deny.toml`, `.cargo/config.toml` (`[profile.guard]` with `panic = "abort"`, `opt-level = "z"`), `crates/{eucas-types,eucas-platform,eucas-notch,eucas-rules,eucas-adapters,eucas-guard,eucas-elevate,eucas-core,eucas-app}/` (empty modules per §1.2), `xtask/src/{main.rs,check_deps.rs}`
- **Acceptance criteria:**
  - `cargo build --workspace` and `cargo nextest run --workspace` pass on Windows and Ubuntu.
  - `cargo xtask check-deps` fails on: a `SetWindowsHookEx` or `WH_KEYBOARD_LL` token anywhere; `eucas-guard` depending on tokio, rusqlite, reqwest, hyper, tauri, `eucas-core` or `account`; `eucas-rules` or `eucas-notch` depending on any I/O crate or on `eucas-platform`; `eucas-core` depending on tauri.
  - `cargo deny check` passes with the NFR-200 licence list.
- **Test approach:** unit tests in `xtask/src/check_deps.rs`: `bans_set_windows_hook_ex`, `guard_may_not_link_network_crates`, `rules_crate_is_pure`, `core_may_not_link_tauri`. Each runs over a fixture `cargo metadata` JSON and a fixture source tree.
- **Estimate:** 0.5 · **Depends:** — · **Blocked by spike:** none
- **Trace event:** n/a (build tooling)

### S1-1.2 pnpm workspace, TypeScript, lint and hooks
- **Traces:** NFR-182, NFR-067, NFR-185
- **Files:** `package.json` (scripts from CLAUDE.md, pinned `packageManager`), `pnpm-workspace.yaml` (`apps/*`, `packages/*`, `evals/*`, `tests/e2e`, `!apps/landing`), `tsconfig.base.json` (ADR-0003 flags), `eslint.config.js` (CODE-STRUCTURE §3 rules: `@tauri-apps/*` only in `src/ipc/**`, components ↛ screens/surfaces/ipc, no `console.log` in `apps/api`, no `dangerouslySetInnerHTML`, no raw hex, no infinite CSS animation), `.prettierrc`, `lefthook.yml`, `.changeset/config.json`, `packages/{contracts-ts,copy,ui-tokens,test-fixtures}/package.json`, `packages/ui-tokens/` (moved from `docs/design`, docs re-linked)
- **Acceptance criteria:**
  - `pnpm bootstrap`, `pnpm lint`, `pnpm typecheck` and `pnpm test` run green on an empty workspace.
  - One ESLint fixture file per boundary rule fails lint as expected.
  - `apps/landing` is untouched and still builds with npm.
- **Test approach:** a lint fixture test (`packages/test-fixtures/eslint/*.tsx` + `eslint-rules.test.ts`) that asserts each rule fires.
- **Estimate:** 0.25 · **Depends:** S1-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### S1-1.3 `contracts/` and `xtask codegen`, with the fixed strings stored once
- **Traces:** NFR-185, FR-050, FR-138, FR-036, NFR-138, NFR-183
- **Files:** `contracts/{errors/*.schema.json,copy/en/*.json,_sample.schema.json}`, `xtask/src/codegen.rs` (typify → `crates/eucas-types`, JSON Schema → zod → `packages/contracts-ts/src/generated/`), `crates/eucas-types/{build.rs,src/lib.rs}` (newtypes `SessionId`, `ToolUseId`, `RuleId`, `ErrorCode`), `packages/copy/src/{index.ts,fixed.ts}`
- **Acceptance criteria:**
  - `xtask codegen --check` fails when the generated output is stale.
  - A sample fixture round-trips byte-equivalently through Rust and TS.
  - `fixed.promise`, `fixed.gap`, `fixed.privacy` and `guard.deny.limit` exist once, with the SRS text verbatim, and are readable from Rust and TS.
  - `ErrorCode` is one enum shared by Rust and TS.
- **Test approach:** contract tests `crates/eucas-types/tests/codegen_round_trip.rs::sample_fixture_round_trips` and `packages/contracts-ts/src/round-trip.test.ts`; unit `packages/copy/src/fixed.test.ts::fixed_strings_match_srs_verbatim` and `::push_to_main_never_appears` (FR-050).
- **Estimate:** 0.5 · **Depends:** S1-1.2 · **Blocked by spike:** none
- **Trace event:** n/a

### S1-1.4 CI jobs `ts`, `rust`, `contracts`, `licences`, `dependency-review`, `changeset`
- **Traces:** NFR-180, NFR-075, NFR-200, NFR-153
- **Files:** `.github/workflows/ci.yml` (replaces the placeholder `build-test`; keeps `secret-scan`), `THIRD_PARTY_NOTICES.md`, `CONTRIBUTING.md` (the list of required checks)
- **Acceptance criteria:**
  - Every job has a SHA pin, `permissions:` and `timeout-minutes:`. Concurrency cancels superseded runs.
  - `licences` fails if `THIRD_PARTY_NOTICES.md` changed without being committed.
  - `dependency-review` uses `fail-on-severity: high` and the CI-CD §2 deny list.
  - All jobs are green on this PR, on both OSes.
- **Test approach:** the jobs themselves, plus one throwaway PR that adds a GPL crate and must fail `licences` (closed without merging).
- **Estimate:** 0.25 · **Depends:** S1-1.3 · **Blocked by spike:** none
- **Trace event:** n/a

---

## G-1 · Neutral `ToolCall`, shell tokenizers and path canonicaliser · 1.5 d → **1.75 d** · depends: S1-1 · PRD 19.1 · UC-55, UC-56
**Why +0.25:** two things are under-counted. PowerShell `-EncodedCommand` decoding needs its own alias table. And the canonicaliser has to be split into a pure lexical part in `eucas-rules` and a Windows resolver in `eucas-platform`, because `eucas-rules` may not depend on platform (CODE-STRUCTURE §3).
**Contract:** pure crate, with no I/O in `eucas-rules`. Any construct the tokenizer can't resolve returns `Unresolved`, which can never match an allow. No panic on any UTF-8 input. Verified by: proptest, the fuzz targets and the `rules_crate_is_pure` check.

### G-1.1 `ToolCall` model and the `PathResolver` seam
- **Traces:** FR-033, NFR-061
- **Files:** `crates/eucas-rules/src/{lib.rs,tool_call.rs}`
- **Acceptance criteria:**
  - `ToolCall` covers Shell { shell, commands: Vec<Command> }, FileWrite / FileEdit / FileRead { path }, Mcp { server, tool }, Task and Other. Each `Command` is `Resolved { program, args }` or `Unresolved { reason }`.
  - `trait PathResolver { fn canonical(&self, p) -> CanonicalPath }`, with a lexical-only implementation for tests.
  - Serde round-trips. The enums are `#[non_exhaustive]`-free and matched exhaustively.
- **Test approach:** unit `tool_call::tests::{serde_round_trip, unresolved_carries_reason}`.
- **Estimate:** 0.25 · **Depends:** S1-1.4 · **Blocked by spike:** none
- **Trace event:** n/a (library; surfaces later as the check event's `program` field, G-3)

### G-1.2 Bash tokenizer
- **Traces:** FR-034, NFR-061, NFR-152
- **Files:** `crates/eucas-rules/src/shell/bash.rs`
- **Acceptance criteria:**
  - Splits `;`, `&&`, `||` and `|`, and handles quoting and escapes.
  - Recurses into `bash -c`, `sh -lc` and `wsl …`.
  - Strips `env`, `command`, `\rm`, `xargs` and `exec` prefixes down to the real program.
  - `$()`, backticks, `eval` and a variable as the program become `Unresolved`.
- **Test approach:** unit `bash::tests::{splits_and_or_semicolon_pipe, bash_c_recurses, strips_env_command_backslash, xargs_rm_seen_as_rm, command_substitution_unresolved, eval_unresolved}`, plus insta snapshots over `packages/test-fixtures/shell/bash/*.txt`.
- **Estimate:** 0.5 · **Depends:** G-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### G-1.3 PowerShell and cmd tokenizers
- **Traces:** FR-034, NFR-061, NFR-152
- **Files:** `crates/eucas-rules/src/shell/{powershell.rs,cmd.rs}`
- **Acceptance criteria:**
  - PowerShell: `-Command` and `-EncodedCommand` (base64 UTF-16LE) are decoded and tokenized. The alias table covers `ri`, `rm`, `del`, `erase`, `rd` and `rmdir`. `Get-ChildItem | Remove-Item` is seen. `iex`, `Invoke-Expression` and `& ('Re'+'move-Item')` become `Unresolved`. `Start-Process cmd -ArgumentList` recurses.
  - cmd: `cmd /c` and `/k`, `^` escapes, `&` and `&&`, and `del /s /q` and `rd /s` flags.
- **Test approach:** unit `powershell::tests::{decodes_encoded_command_utf16le, alias_ri_is_remove_item, pipeline_into_remove_item, iex_unresolved, string_concat_program_unresolved, start_process_argument_list_recurses}` and `cmd::tests::{cmd_c_caret_escapes, del_s_q_flags, ampersand_chain}`.
- **Estimate:** 0.5 · **Depends:** G-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### G-1.4 Path canonicaliser (lexical part and Windows resolver)
- **Traces:** NFR-061, FR-034, FR-092
- **Files:** `crates/eucas-rules/src/shell/resolve.rs`, `crates/eucas-platform/src/{paths.rs,windows/paths.rs}`
- **Acceptance criteria:**
  - Lexical: normalises `..`, mixed slashes, case-folding, trailing dots and spaces, `\\?\` prefixes, MSYS `/c/…`, UNC, and `~` against a given home.
  - Windows: resolves junctions and symlinks (`GetFinalPathNameByHandleW`) and expands 8.3 names (`GetLongPathNameW`).
  - A path outside a scope root never resolves inside it.
- **Test approach:** unit `resolve::tests::{dotdot_cannot_escape_root, msys_c_maps_to_drive, verbatim_prefix_stripped, trailing_dots_spaces_trimmed, case_folded}`. Windows integration `windows::paths::tests::{junction_resolves_to_target, short_name_expands}`. `short_name_expands` is skipped with a printed reason when the runner has 8.3 names off, never silently.
- **Estimate:** 0.25 · **Depends:** G-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### G-1.5 Property tests and nightly fuzz targets
- **Traces:** NFR-061, NFR-032
- **Files:** `crates/eucas-rules/tests/prop_tokenizers.rs`, `crates/eucas-rules/fuzz/fuzz_targets/{tokenize_bash,tokenize_pwsh,tokenize_cmd,canonicalise}.rs`, `.github/workflows/fuzz.yml` (nightly, 10 minutes per target; a crash opens an issue)
- **Acceptance criteria:**
  - Property tests `never_panics_on_any_utf8` and `unresolved_is_sticky_through_nesting` (an unresolved inner command keeps the whole call unresolved).
  - One fuzz run per target passes locally for 60 s.
  - A fuzz crash input becomes a unit test (documented in the workflow).
- **Test approach:** proptest + `cargo fuzz`.
- **Estimate:** 0.25 · **Depends:** G-1.2, G-1.3, G-1.4 · **Blocked by spike:** none
- **Trace event:** n/a

---

## G-2 · The four limits, the catalogue and self-protection · 1.5 d · depends: G-1 · PRD 19.2 · UC-55, UC-56
**Contract:** the limits are always on and live outside the rulebook. If any limit token appears in an unresolved command, the call is denied. There are about 400 table cases (TESTING §2). Negatives such as `git rm --cached`, `git push origin feature/x`, `gh pr create` and a Gmail draft must **not** match. Coverage of `eucas-rules` is at least 90 % (NFR-181).

### G-2.1 `limit.delete`
- **Traces:** FR-034, NFR-061
- **Files:** `crates/eucas-rules/src/limits/delete.rs`, `crates/eucas-rules/tests/cases/delete.yaml`
- **Acceptance criteria:**
  - Every row of SECURITY-PRIVACY §4 is matched in bash, PowerShell and cmd, including `robocopy /MIR` and `/PURGE`, moving to `NUL` or the Recycle Bin, and inline interpreter delete calls (`shutil.rmtree`, `fs.rmSync`, `os.remove`).
  - MCP tools catalogued as delete are matched.
  - Negatives pass: `git rm --cached`, and `rm` inside a quoted echo string.
- **Test approach:** table-driven `limits_table::delete` (YAML cases), plus the property test `delete_tokens_in_unresolved_deny`.
- **Estimate:** 0.5 · **Depends:** G-1.5 · **Blocked by spike:** none
- **Trace event:** n/a (decision `decided_by: limit.delete`, emitted in G-3)

### G-2.2 `limit.push_default` and the git facts parser
- **Traces:** FR-034, FR-100, NFR-061
- **Files:** `crates/eucas-rules/src/limits/push_default.rs`, `crates/eucas-rules/src/git_facts.rs` (a pure parser of `.git/HEAD`, `refs/remotes/<r>/HEAD`, a worktree's `gitdir` file and `packed-refs` contents; the guard does the reads), `tests/cases/push_default.yaml`
- **Acceptance criteria:**
  - Explicit refspecs (`HEAD:main`, `+main`, `:main`), `--force*`, `--mirror`, `--all` and `--delete` are matched.
  - A bare `git push` on the default branch is matched, honouring `-C`, `--git-dir`, `--work-tree` and remotes other than `origin`.
  - `gh pr merge`, `gh api` writes to `git/refs` and `gh repo sync` are matched.
  - When the default branch isn't `main`, it comes from the facts. `git push origin feature/x` doesn't match.
  - A public `targets_default(facts, push) -> bool` exists for M-1's self-check.
- **Test approach:** table `limits_table::push_default`, and unit `git_facts::tests::{remote_head_symref, packed_refs_fallback, worktree_gitdir}`.
- **Estimate:** 0.5 · **Depends:** G-1.5 · **Blocked by spike:** none
- **Trace event:** n/a

### G-2.3 `limit.send`, `limit.pay` and the catalogue
- **Traces:** FR-034, NFR-061
- **Files:** `crates/eucas-rules/src/limits/{send.rs,pay.rs,catalogue.rs}`, `tests/cases/{send,pay}.yaml`
- **Acceptance criteria:**
  - The mail CLIs, write methods to catalogued hosts (Slack, Discord, Telegram, Graph `sendMail`, Gmail `send`, SendGrid, Mailgun, Twilio), `gh issue create/comment` and `gh pr comment/review/release create` are matched.
  - Stripe writes and the crypto CLIs are matched, as are MCP tools catalogued as send or pay. **Drafts are not matched** (CR-008).
  - The catalogue is data with a version number that changes on each release.
- **Test approach:** table cases, plus `catalogue::tests::renamed_mcp_server_matched_by_tool_effect`.
- **Estimate:** 0.25 · **Depends:** G-1.5 · **Blocked by spike:** none
- **Trace event:** n/a

### G-2.4 Self-protection and the `decide()` order
- **Traces:** FR-033, FR-036, FR-047, FR-066, NFR-061, NFR-062
- **Files:** `crates/eucas-rules/src/{decide.rs,limits/self_protect.rs}`, `limits/mod.rs` (`overlaps(rule) -> Option<LimitId>` for R-1's compiler)
- **Acceptance criteria:**
  - Writes to `~/.claude/settings*.json`, `~/.claude/plugins/**`, Eucas's per-user folders and the managed paths are denied.
  - `claude --settings`, `--setting-sources`, `--dangerously-skip-permissions` and `plugin disable/uninstall` are denied.
  - The order is limits and self-protection first, then rules, else no opinion. A deny carries the `guard.deny.limit` key.
  - The property test `unresolved_never_allow` passes over generated commands.
- **Test approach:** table `self_protect.yaml`; property tests `unresolved_never_allow` and `limit_hit_beats_any_rule`.
- **Estimate:** 0.25 · **Depends:** G-2.1, G-2.2, G-2.3 · **Blocked by spike:** none
- **Trace event:** n/a

---

## G-3 · Guard binary · 1.25 d → **1.5 d** · depends: G-2 · PRD 19.3 · UC-55, UC-56
**Why +0.25:** the guard's check of the pipe server's identity (NFR-066: the server image path and its pinned SHA-256) isn't in any story, and its home is the guard's emit path.
**Contract:** PreToolUse and PermissionRequest fail closed on every path, and no error code path leads to an allow. Stdout is valid hook JSON or empty. The emit starts only after stdout is flushed and takes at most 5 ms. The guard does no network, account or app I/O on the decision path. The hook adds p95 ≤ 50 ms. Verified by: fault injection, the stdout fuzz target, the latency bench and check-deps.

### G-3.1 Hook-input and hook-output contracts, and the Claude Code adapter
- **Traces:** FR-035, NFR-032, NFR-156
- **Files:** `contracts/claude-code/hook-input/*.schema.json`, `contracts/claude-code/hook-output/*.schema.json`, `contracts/claude-code/pinned.txt`, `contracts/guard-event.schema.json`, `crates/eucas-adapters/src/claude_code/{input.rs,output.rs,version.rs}`
- **Acceptance criteria:**
  - Input is capped at 1 MiB; over the cap → deny "input too large".
  - Unknown fields are ignored. A missing required field → deny `GUARD_SCHEMA`.
  - `tool_input` maps to a `ToolCall`: Bash, PowerShell, Write, Edit, Read, `mcp__*` and Task.
  - The output builders emit `permissionDecision` deny or allow, or nothing.
- **Test approach:** fixture contract tests (`contracts` job), plus unit `input::tests::{oversize_denies, missing_field_guard_schema, unknown_field_ignored}`.
- **Estimate:** 0.25 · **Depends:** G-2.4 · **Blocked by spike:** none
- **Trace event:** n/a

### G-3.2 `pre-tool-use` and `permission-request`
- **Traces:** FR-033, FR-035, FR-037, FR-054, FR-060, FR-083, NFR-030, NFR-032, NFR-033
- **Files:** `crates/eucas-guard/src/{main.rs,cmd/pre_tool_use.rs,cmd/permission_request.rs,rulebook_load.rs,tripped.rs,limits_only.rs}`
- **Acceptance criteria:**
  - A panic hook writes a crash note (error codes only), then exits with the per-subcommand code (ADR-0009).
  - `rulebook.bin` is checked with SHA-256; corrupt or missing → limits only, no allows.
  - The tripped flag for the session → deny everything.
  - The guard reads `.git` facts for `push_default`.
  - Stdout goes through one writer that emits a single JSON object or nothing.
- **Test approach:** integration `guard_faults::{panic_denies, bad_json_denies, oversize_denies, corrupt_rulebook_limits_only, tripped_flag_denies_all}`, each driving the built binary with fixture stdin.
- **Estimate:** 0.5 · **Depends:** G-3.1 · **Blocked by spike:** none
- **Trace event:** check frame `kind=check {decision, decided_by, program, latency_us}` (ingested by H-1 into `check_event` and `log_entry kind=block`)

### G-3.3 Observational subcommands
- **Traces:** NFR-005, NFR-031, NFR-093, FR-052
- **Files:** `crates/eucas-guard/src/cmd/{post_tool_use.rs,notification.rs,session.rs,config_change.rs}`, a `user-prompt-submit` arm in `main.rs`, `crates/eucas-platform/src/windows/parent_process.rs`
- **Acceptance criteria:**
  - These subcommands always exit 0 and print nothing, panic included.
  - `user-prompt-submit` drops the prompt text before emitting.
  - `session-start` sends the parent pid, start time and **image path** (the host), the CLI version and `CLAUDE_CODE_ENTRYPOINT`.
  - `post-tool-use` sends `tool_use_id`, file paths and the status only.
- **Test approach:** integration `observational::{panic_exits_zero_silent, prompt_text_never_emitted, session_start_has_parent_image}`.
- **Estimate:** 0.25 · **Depends:** G-3.2 · **Blocked by spike:** none
- **Trace event:** frames `session`, `needs`, `file_touch`, `config_change`

### G-3.4 Emit: the pipe client with an identity check, the spool and drop counting
- **Traces:** NFR-003, NFR-066, NFR-035
- **Files:** `crates/eucas-guard/src/emit.rs`, `crates/eucas-platform/src/windows/{pipe.rs (client half),spool.rs}`
- **Acceptance criteria:**
  - Connects to `\\.\pipe\eucas-events-<SID>` within 3 ms, then checks `GetNamedPipeServerProcessId`: the image is `Eucas.exe` at the installed path and its SHA-256 equals the build-pinned `EUCAS_APP_SHA256`. On a mismatch the frame is treated as "no app" and goes to the spool.
  - The fallback is one `FILE_APPEND_DATA` write to the spool; if that fails, the frame is dropped and a counter goes up.
  - The whole emit takes at most 5 ms.
- **Test approach:** integration `emit::{pipe_absent_spools, slow_pipe_capped_5ms, rogue_server_treated_as_no_app}` (the rogue test starts a fake pipe server first).
- **Estimate:** 0.25 · **Depends:** G-3.2 · **Blocked by spike:** none
- **Trace event:** the spool drop counter (shown by D-1)

### G-3.5 Fault-injection suite, stdout fuzz and latency bench in CI
- **Traces:** NFR-001, NFR-002, NFR-030, NFR-032
- **Files:** `crates/eucas-guard/fuzz/fuzz_targets/guard_stdout.rs`, `tests/perf/guard_latency/`, `.github/workflows/ci.yml` (adds the `perf` job: **G-3.5 owns `ci.yml` in Sprint 2**, and lane B's N-0 adds its notch sampler step after this merges)
- **Acceptance criteria:**
  - The fuzz target asserts that stdout always parses as hook JSON or is empty.
  - The bench runs 2,000 sequential and 4 × 500 parallel calls and fails above p95 50 ms, p99 150 ms, or more than 20 % slower than `dev`. The first run of a new binary is excluded.
  - The guard's self-timed decision is p95 ≤ 2 ms.
- **Test approach:** fuzz + perf + the existing fault tests.
- **Estimate:** 0.25 · **Depends:** G-3.3, G-3.4 · **Blocked by spike:** none
- **Trace event:** n/a

---

## G-4 · Plugin, local marketplace, install and uninstall · 1 d → **1.25 d** · depends: G-3 · PRD 19.4 · UC-55, UC-54
**Why +0.25:** `repair_guard` and `protection_off(15)` (FR-043, FR-045, CODE-STRUCTURE §4) have no owner. They are `claude plugin` operations, so they sit here. Writing the status line into user settings stays with **L-1** (its BUILD-PLAN row), not G-4.
**Contract:** hooks are exec form only, every hook has `args`, and `onFailure: "block"` is set on PreToolUse and PermissionRequest only. Nothing is written into project settings. A version folder is deleted only when no live session uses it. The guard is warmed up before the manifest is repointed. Setup refuses to install under Smart App Control.

### G-4.1 Plugin source, our strict hooks schema and `xtask build-plugin`
- **Traces:** NFR-152, NFR-005, FR-035, NFR-021
- **Files:** `apps/plugin/{.claude-plugin/plugin.json,hooks/hooks.json,settings.json}`, `contracts/claude-code/hooks.schema.json`, `xtask/src/{build_plugin.rs,build_marketplace.rs}`
- **Acceptance criteria:**
  - `hooks.json` validates against our schema: every hook has `args`, observational hooks are `async: true`, and timeouts are ≤ 10 s.
  - The build produces `marketplace/eucas/<version>/bin/eucas-guard.exe`, built `--profile guard`, under 4 MB.
- **Test approach:** contract `hooks_schema::{every_hook_has_args, block_only_on_pre_and_permission}` (ajv in the `contracts` job); a size check in the build.
- **Estimate:** 0.25 · **Depends:** G-3.5 · **Blocked by spike:** none
- **Trace event:** n/a

### G-4.2 `installer/plugin.rs`: version folders, warm-up and atomic repoint
- **Traces:** FR-013, FR-183, FR-187, NFR-004, NFR-045, NFR-158
- **Files:** `crates/eucas-core/src/installer/plugin.rs`, `contracts/install-manifest.schema.json`, `crates/eucas-core/src/trace.rs` (the `TraceEvent` enum and sink trait with an app-log sink; H-1.1 adds the SQLite sink. This file is new and not in CODE-STRUCTURE)
- **Acceptance criteria:**
  - Runs `claude plugin marketplace add`, then `install eucas@eucas --scope user`.
  - Each version gets its own folder. The guard is warmed up with `--version` **before** the manifest is renamed into place.
  - `install-manifest.json` records the folders and the sessions that loaded each.
  - Uninstall removes only our plugin. A failed update leaves the old guard in place.
- **Test approach:** integration with a fake `claude` shim: `plugin_install::{warmup_precedes_repoint, failed_update_keeps_old, cleanup_skips_live_version}`.
- **Estimate:** 0.5 · **Depends:** G-4.1 · **Blocked by spike:** none
- **Trace event:** `TraceEvent::Installer { step, file, result }` (the setup checklist line, FR-013)

### G-4.3 Smart App Control check and the "not protected until restarted" list
- **Traces:** FR-002, NFR-046, NFR-160, FR-052
- **Files:** `crates/eucas-platform/src/windows/smart_app_control.rs`, `crates/eucas-core/src/installer/plan.rs` (only the `running_sessions_needing_restart` function; O-1 owns the rest of `plan.rs` in Sprint 9)
- **Acceptance criteria:**
  - Reads `VerifiedAndReputablePolicyState`: 0 → install allowed; 1 or 2 → refused; missing → allowed with a note. The value is re-read at start and daily.
  - Sessions already running are listed as needing a restart.
- **Test approach:** unit table `sac::tests::state_table` (the four rows); unit `plan::tests::running_sessions_listed`.
- **Estimate:** 0.25 · **Depends:** G-4.2 · **Blocked by spike:** none
- **Trace event:** `TraceEvent::Installer { step: "sac", result }`

### G-4.4 `repair_guard` and `protection_off(15)`
- **Traces:** FR-043, FR-045, NFR-037
- **Files:** `crates/eucas-core/src/installer/plugin.rs` (`repair`, `off_for`), IPC command structs in `contracts/ipc/commands/protection.schema.json`
- **Acceptance criteria:**
  - Repair rewrites the version folder from the embedded copy and runs `claude plugin update`.
  - Off runs `claude plugin disable` and stores the re-enable deadline, so it survives an app restart. It re-enables at 15 minutes ± 5 s.
  - Both return a "restart running sessions" notice (FR-045).
  - Only `minutes: 15` is accepted.
- **Test approach:** integration with a fake clock and the fake `claude`: `off_reenables_after_restart`, `off_rejects_other_minutes`.
- **Estimate:** 0.25 · **Depends:** G-4.2 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=off` / `kind=on`, written through the trace sink (persisted from H-1)

---

## G-5 · Contract and bypass suites on the pinned CLI in CI · 1 d → **1.25 d** · depends: G-4 · PRD 19.5 · UC-55, UC-56
**Why +0.25:** the contract tests need a tool call without a model turn, so the S-1 loopback Messages API stand-in has to be built here, not in C-1 (C-1 drops 0.25 for it; the net change is zero).
**Contract:** a red suite on the pinned CLI blocks the PR. No real API key and no credential read. Every reported bypass becomes a failing case first.

### G-5.1 Loopback Messages API stand-in and the canary environment builder
- **Traces:** NFR-069, NFR-116, FR-016
- **Files:** `crates/eucas-core/src/canary/{loopback.rs,env.rs}` (a Rust port of `spikes/SP-H1/mock-api.mjs`)
- **Acceptance criteria:**
  - The stand-in follows the streaming SSE shape. The first request returns one scripted `tool_use`; the next returns "done".
  - The child environment gets a loopback `ANTHROPIC_BASE_URL`, a dummy key, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` and `NO_PROXY=127.0.0.1`. The real `ANTHROPIC_API_KEY` is stripped. `--no-session-persistence` is passed.
- **Test approach:** unit `env::tests::{real_key_stripped, dummy_key_set}`; contract `loopback::request_shape_matches_fixture`.
- **Estimate:** 0.25 · **Depends:** G-4.4 · **Blocked by spike:** none
- **Trace event:** n/a

### G-5.2 Live contract harness (TESTING §3.2)
- **Traces:** NFR-030, NFR-031, NFR-060, NFR-152, NFR-155, NFR-160, FR-041
- **Files:** `tests/contract/{Cargo.toml,src/harness.rs,tests/live.rs}`
- **Acceptance criteria:**
  - Each row of TESTING §3.2 runs in a temp home with a throwaway repo, on the CLI version in `pinned.txt`.
  - Fail-closed is checked in every shell variant.
  - An observational panic → the stop is not blocked.
  - Managed precedence runs on the admin runner.
  - Plugin hot-load is recorded either way.
  - Removing the hook yields the "tool ran, no check" fixture that H-1 uses.
- **Test approach:** the suite itself.
- **Estimate:** 0.5 · **Depends:** G-5.1 · **Blocked by spike:** none
- **Trace event:** n/a (CI)

### G-5.3 Bypass suite and the published table
- **Traces:** NFR-061, FR-069, NFR-079
- **Files:** `tests/contract/bypass/*.yaml` (the TESTING §5 families), `tests/contract/tests/bypass.rs`, `xtask/src/bypass_table.rs` → `docs/security/bypass-table.md`
- **Acceptance criteria:**
  - Every family case is denied by a limit, or marked "known gap, caught by tripwire". T-1.3 asserts those cases.
  - The table is generated, never edited by hand.
- **Test approach:** the suite; `xtask bypass-table --check` in the `contracts` job.
- **Estimate:** 0.25 · **Depends:** G-5.2 · **Blocked by spike:** none
- **Trace event:** n/a

### G-5.4 CI jobs `plugin` and `guard-contract`
- **Traces:** NFR-155, NFR-180
- **Files:** `.github/workflows/ci.yml` (lane A owns it in Sprint 4)
- **Acceptance criteria:**
  - `plugin` runs `claude plugin validate --strict apps/plugin` on the pinned CLI.
  - `guard-contract` runs two Windows legs: Git Bash present, and `C:\Program Files\Git\bin\bash.exe` renamed. It runs only when guard, adapter, rules, plugin or `contracts/claude-code` paths change.
  - Both are required checks.
- **Test approach:** the jobs themselves.
- **Estimate:** 0.25 · **Depends:** G-5.3 · **Blocked by spike:** none
- **Trace event:** n/a

---

## A-1 · Admin limits (`eucas-elevate`) · 1.5 d → **1.75 d** · depends: G-3 · PRD 19.6 · UC-54, UC-55
**Why +0.25:** the swapped-helper test and the pinned hash need the build order (limits guard → helper → app hash) to work locally in xtask, not only in R1's `release.yml`.
**Contract:** fixed operations only, with no plan file and no free text. Nothing is read from user-writable paths. The helper merges only keys inside our marker object. It never writes `allowManagedHooksOnly`, `disableAllHooks`, `HKCU\…\Policies` or an organisation's source. A limit is never off between two states. Exactly one UAC prompt per operation.

### A-1.1 Helper skeleton: operation enum, self-install and ACLs
- **Traces:** NFR-063, FR-015
- **Files:** `contracts/elevate-op.schema.json`, `crates/eucas-elevate/src/{main.rs,ops.rs}`, `crates/eucas-elevate/eucas-elevate.manifest` (`requireAdministrator`), `crates/eucas-platform/src/windows/acl.rs`
- **Acceptance criteria:**
  - Argument parsing accepts only the CODE-STRUCTURE §1 operations, with the limit ids as an enum set.
  - Exit codes: 0, or a typed error code on stdout. Nothing is ever half-written.
  - First run copies the helper to `%ProgramFiles%\Eucas` with admin-only ACLs.
- **Test approach:** unit `ops::tests::{free_text_rejected, unknown_op_rejected, limit_ids_enum_only}`; admin-runner integration `self_install_acl_admin_only`.
- **Estimate:** 0.5 · **Depends:** G-3.5 · **Blocked by spike:** none
- **Trace event:** n/a (A-1.4 writes the log row)

### A-1.2 Managed merge into the file and/or HKLM, recorded as a JSON patch
- **Traces:** NFR-060, NFR-159, FR-006, FR-013
- **Files:** `crates/eucas-elevate/src/managed_merge.rs`, `crates/eucas-platform/src/windows/registry.rs`
- **Acceptance criteria:**
  - Detects the source: file, HKLM, both, none, or organisation. With both, the same JSON goes to both.
  - Only the marker object is changed, and a patch is recorded.
  - An organisation's source → a typed error `ORG_POLICY` and nothing written.
- **Test approach:** unit over fixture JSON: `merge::{only_marker_keys, both_sources_same_json, org_source_refused, never_writes_disable_all_hooks}`.
- **Estimate:** 0.5 · **Depends:** A-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### A-1.3 Operations: install, repair, update-limits-guard, pause, resume and remove
- **Traces:** FR-044, FR-187, NFR-158
- **Files:** `crates/eucas-elevate/src/ops.rs`, `xtask/src/build_elevate.rs` (the limits guard is embedded via `include_bytes!`; the build order is limits guard → helper → its SHA-256 into `EUCAS_ELEVATE_SHA256`)
- **Acceptance criteria:**
  - `pause-limits` removes the hook entry and keeps the deny patterns; `resume-limits` restores it.
  - `remove` reverses the patch key by key, so a user's edit survives.
  - `repair` and `update-limits-guard` write the embedded binary.
- **Test approach:** admin-runner integration `ops::{pause_keeps_deny_patterns, remove_keeps_user_edit, repair_restores_binary}`.
- **Estimate:** 0.25 · **Depends:** A-1.2 · **Blocked by spike:** none
- **Trace event:** n/a

### A-1.4 `installer/managed.rs`: pinned-hash launch, user-level fallback and rollback
- **Traces:** FR-011, FR-012, FR-014, FR-015, FR-062, NFR-040
- **Files:** `crates/eucas-core/src/installer/managed.rs`, `crates/eucas-platform/src/windows/elevation.rs`
- **Acceptance criteria:**
  - Before ShellExecute `runas`, the helper's SHA-256 is compared with the pinned value. On a mismatch: no prompt, a typed error, nothing written.
  - First run launches from the app folder; later runs from Program Files.
  - UAC declined or nothing locked → deny patterns in user settings (JSON patch) and the state "Not locked". Nothing locked → no prompt at all.
  - A failure rolls back in reverse.
- **Test approach:** integration `managed::{swapped_helper_no_prompt, declined_uac_user_level, none_ticked_no_prompt, kill_at_each_step_rolls_back}` with a fake elevation seam. Precedence tests (managed hook still fires with `disableAllHooks` in a project and with `--settings`) run nightly on the admin runner, added to G-5's live suite.
- **Estimate:** 0.5 · **Depends:** A-1.3 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=on why_key=limits.locked` / `limits.not_locked`; `TraceEvent::Installer { step: "lock" }`

---

## A-2 · Choose and lock your rules · 1.5 d · depends: A-1, R-1 (lane B) · PRD 19.7 · UC-54, UC-57
**Contract:** all four limits start ticked and none has an off switch. Only **block** rules can be locked. The helper's `update-locked-set` accepts only a deny-only list. Unlocking writes the user-scope deny first, so nothing is off in between. Setup raises exactly one UAC prompt (step 4). Rules from step 7 are "Not locked". Every lock change offers a 10-s Undo, which asks for admin again (FR-169).

### A-2.1 Helper `update-locked-set` with a deny-only schema
- **Traces:** FR-063, FR-064, FR-066, NFR-063, NFR-079
- **Files:** `contracts/elevate-op.schema.json` (the `update-locked-set` payload), `crates/eucas-elevate/src/ops.rs`
- **Acceptance criteria:**
  - Accepts a subset of the limit ids plus block rules, each one of: exact program + args, a folder scope for file tools, or an MCP tool name.
  - Rejects allow rules, globs, regex and free text with a typed error.
  - Rewrites only our marker object.
- **Test approach:** unit `locked_set::{forged_allow_rejected, glob_rejected, marker_only}`.
- **Estimate:** 0.5 · **Depends:** A-1.4 · **Blocked by spike:** none
- **Trace event:** n/a

### A-2.2 Core: the locked-set model, ordering and "Locked on this PC"
- **Traces:** FR-062, FR-023, FR-067, FR-014, NFR-100, FR-169
- **Files:** `crates/eucas-core/src/installer/managed.rs`, `contracts/ipc/commands/locks.schema.json` (`update_locked_set`)
- **Acceptance criteria:**
  - Unlock: the user-scope deny is written, then the managed entry is removed. Lock: the reverse.
  - Step 7 rules are written at user scope and labelled Not locked.
  - The machine-level locked set is shown read-only in any profile as "Locked on this PC".
  - UAC declined → nothing changes.
  - Undo calls the inverse operation (admin again).
- **Test approach:** integration `locks::{unlock_never_off_between, declined_changes_nothing, other_profile_sees_locked_on_this_pc}`.
- **Estimate:** 0.5 · **Depends:** A-2.1 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=on|off why_key=locks.changed`, plus a `state_patch` on `rules.locked`

### A-2.3 UI: `LimitsPanel` lock rows, choose-rules (step 7) and the lock control in Rules
- **Traces:** FR-010, FR-022, FR-023, FR-063, FR-064, NFR-135
- **Files:** `apps/companion/src/components/limits-panel/`, `apps/companion/src/surfaces/setup-window/choose-rules/`, `apps/companion/src/screens/rules/` (only the lock control; **shared with R-1/R-2: lane B must have merged R-1 and not be editing `screens/rules` while this task runs**)
- **Acceptance criteria:**
  - The four rows are ticked by default; unticking one shows "Not locked"; no off control exists.
  - Step 7 shows the limits read-only and the "Not locked yet…" hint, with no "Lock it too".
  - In Rules, the lock glyph and "Lock it too (asks for admin)" appear on block rules only.
  - O-1 wires `LimitsPanel` into step 4.
- **Test approach:** Vitest component tests for every state (`limits-panel.test.tsx::no_off_switch`, `::untick_reads_not_locked`); e2e `choose-rules.spec.ts::no_second_uac`.
- **Estimate:** 0.5 · **Depends:** A-2.2, R-1 (lane B) · **Blocked by spike:** none
- **Trace event:** as in A-2.2

---

## H-1 · Ingest, sessions, transcript tail and heartbeat · 1.5 d → **2 d** · depends: G-3, U-1 (lane B) · PRD 20.1 · UC-55, UC-60
**Why +0.5:** no story names the SQLite store, its migrations runner or the retention job (NFR-094, SRS §5.3). H-1 is their first writer.
**Contract:** nothing shows Protected without a real check. Idle never shows a tick. "Not protected" appears ≤ 2 s after an unchecked tool. **H-1 raises a needs-you item and a notch state only; it never calls the toast API.** The toast fallback (a full-screen app hides the notch) is N-1's policy (FR-042, FR-115). The UI vocabulary is "Not protected", never "Not guarded" (FR-053). No prompt text in the store.

### H-1.1 Store: SQLite, migrations, retention, the `needs` repository and the trace sink
- **Traces:** NFR-094, NFR-093, FR-185, NFR-040, NFR-183, NFR-188
- **Files:** `crates/eucas-core/src/store/{mod.rs,migrations/0001_init.sql,retention.rs,needs.rs}`, `crates/eucas-core/src/trace.rs` (the SQLite sink)
- **Acceptance criteria:**
  - WAL and STRICT. Migrations are tracked with `PRAGMA user_version` and run in one transaction; a failure → the previous version plus a visible error state.
  - The DB lives at `profiles\<p>\eucas.db`, with a pre-sign-in profile id.
  - Retention: rollups after 24 h and 90 days, file touches 24 h, receipts 30 days, usage 90 days. The job logs its run.
  - `needs::raise` and `needs::resolve` are the only writers of `needs_item`.
  - The rotating app log is capped at 10 MB and 7 days. SUP-1.8 adds its redaction pass.
- **Test approach:** integration `store::{failed_migration_keeps_previous, retention_rolls_up_24h, needs_raise_idempotent}`; a DB scan over a fixture week finds no prompt text.
- **Estimate:** 0.5 · **Depends:** G-3.5 · **Blocked by spike:** none
- **Trace event:** `log_entry` (the persistence of every earlier `TraceEvent`)

### H-1.2 Ingest: pipe server, continuous spool ingest and dedupe
- **Traces:** NFR-034, NFR-035, NFR-066
- **Files:** `crates/eucas-core/src/ingest/`, `crates/eucas-platform/src/windows/pipe.rs` (the server half)
- **Acceptance criteria:**
  - The pipe has the SID in its name, a user-only DACL and `FILE_FLAG_FIRST_PIPE_INSTANCE`, with a pool of 8 workers.
  - The spool folder is watched (about 100 ms) and bounded at 7 days or 50 MB, oldest first, with drops counted.
  - Dedupe by `event_id`. Writes are batched in one transaction per ≤ 200 events or 250 ms.
- **Test approach:** integration `ingest::{duplicate_event_once, spool_bound_drops_oldest, second_server_instance_fails}`; the nightly soak (6 × 1/s × 30 min, ≤ 1/10,000 lost).
- **Estimate:** 0.5 · **Depends:** H-1.1 · **Blocked by spike:** none
- **Trace event:** `check_event` rows; the drop count in the store

### H-1.3 Sessions and the transcript tail (metadata only)
- **Traces:** FR-040, FR-052, NFR-154, NFR-093, FR-185
- **Files:** `crates/eucas-core/src/{sessions/,transcripts/tail.rs}`
- **Acceptance criteria:**
  - A Session is created from `SessionStart`, with the CLI version per host, the entrypoint and the parent image.
  - `SessionEnd` closes it.
  - The tail emits `ToolUseSeen { tool_use_id, tool, program, at }` and nothing else.
  - `claude agents --json` is polled every 30 s only while sessions exist; a failure is ignored.
  - A session seen with no `SessionStart` → Not protected with "restart it".
- **Test approach:** integration with `packages/test-fixtures` transcripts: `tail::{metadata_only, no_session_start_not_protected}`.
- **Estimate:** 0.5 · **Depends:** H-1.2 · **Blocked by spike:** none
- **Trace event:** `state_patch sessions[*]`

### H-1.4 Heartbeat verdicts, `derive.rs` and the heartbeat components
- **Traces:** FR-040, FR-041, FR-042, FR-043, FR-051, NFR-018, NFR-036, NFR-037, NFR-156, NFR-046
- **Files:** `crates/eucas-core/src/{heartbeat/,derive.rs}`, `apps/companion/src/components/{heartbeat-line,heartbeat-strip}/`
- **Acceptance criteria:**
  - Signals: PostToolUse without a check for the same `tool_use_id` (fastest); a transcript result without a check after 2 s; `config-change`; a status-line tick with tool activity and no check for 30 s.
  - `failing` = ≥ 3 guard-caused blocks in 60 s (from `GUARD_INTERNAL`, `GUARD_SCHEMA` or the transcript), or Smart App Control turning on.
  - Verdict priority as in SYSTEM-DESIGN §5.2.
  - Not protected → `needs::raise(not_protected)` with no toast call.
- **Test approach:** a cartesian table test `derive::tests::no_calm_while_any_not_protected`; integration `heartbeat::not_protected_within_2s` (uses G-5.2's hook-removed fixture); Vitest for every component state; a string scan for "Guarded" (FR-053).
- **Estimate:** 0.5 · **Depends:** H-1.3, U-1 (lane B) · **Blocked by spike:** none
- **Trace event:** `state_patch guard`, `log_entry kind=off why_key=heartbeat.not_protected`, `needs_item kind=not_protected`

---

## C-1 · Canary, verified list and badge per host · 1.5 d → **1.25 d** · depends: G-5, H-1 · PRD 20.2 · UC-55, UC-54
**Why −0.25:** the loopback stand-in moved to G-5.1.
**Contract:** never green without both proofs (a signed list entry **and** a passing local canary). Below the floor, never green. 0 Claude tokens. The config is Ed25519-checked with anti-rollback.

### C-1.1 Signed config and verified-list client
- **Traces:** NFR-065, NFR-042, NFR-049, NFR-154
- **Files:** `crates/eucas-core/src/config/`, `contracts/api/{runtime-config,verified-versions}.schema.json` (**W-1 in lane B writes `runtime-config.schema.json` first, in Sprint 3; C-1 only consumes it**)
- **Acceptance criteria:**
  - Fetched at start and every 15 minutes. With no account this fetch still runs, as part of the update check (NA-1.1; NA-Q1 answered yes by the PM, 2026-10-26).
  - Rejected: a bad signature, an older `version`, an unknown major version. The last good copy is kept for 7 days.
  - The canary key is trusted for `verified-versions.json` only.
  - `knownBadCli[]` is honoured.
- **Test approach:** unit `config::{bad_signature_rejected, rollback_rejected, canary_key_cannot_sign_config, last_good_7_days}`.
- **Estimate:** 0.5 · **Depends:** H-1.4, W-1 schema (lane B) · **Blocked by spike:** none
- **Trace event:** `state_patch config.version`

### C-1.2 Local canary run
- **Traces:** FR-016, FR-018, FR-019, NFR-016, NFR-038, NFR-116
- **Files:** `crates/eucas-core/src/canary/run.rs`, `contracts/ipc/commands/canary.schema.json` (`run_canary`)
- **Acceptance criteria:**
  - Runs at setup step 5, at the first session after a CLI version change, and on demand (single-flight).
  - Uses G-5.1 in a temp repo. Results: deny receipt → pass; no block → fail and never Protected; can't start → `untested` (amber).
  - Usage 0/0. p95 ≤ 2 s.
- **Test approach:** integration with the fake `claude`, plus a contract test on the pinned CLI: `canary::{pass_receipt, not_blocked_never_protected, no_git_untested}`.
- **Estimate:** 0.25 · **Depends:** C-1.1 · **Blocked by spike:** none
- **Trace event:** a `canary_run` row and `log_entry kind=block why_key=canary.blocked`

### C-1.3 Badge logic per host
- **Traces:** FR-004, FR-046, NFR-154, NFR-038
- **Files:** `crates/eucas-core/src/canary/badge.rs`, `derive.rs` (badge input only)
- **Acceptance criteria:**
  - The table {in the signed list, local result, below the floor, known-bad} → `GuardState` and the sentence.
  - Not verified → `needs::raise(not_verified)` with **Run the test**.
- **Test approach:** unit table `badge::tests::full_table` (TESTING §7), plus the e2e config with and without the version (Q-1).
- **Estimate:** 0.25 · **Depends:** C-1.2 · **Blocked by spike:** none
- **Trace event:** `needs_item kind=not_verified`, `state_patch guard`

### C-1.4 `canary.yml` and `xtask canary-*`
- **Traces:** NFR-155, NFR-038, NFR-185
- **Files:** `.github/workflows/canary.yml`, `xtask/src/{canary_report.rs,canary_publish.rs,fixtures_pr.rs}`
- **Acceptance criteria:**
  - The 5-leg matrix of CI-CD §3. A version is published only if every leg passed; otherwise one issue per version is opened and the version is added to `knownBadCli`.
  - Fixtures arrive by PR and are never auto-merged.
  - The workflow runs in ≤ 15 minutes per OS.
- **Test approach:** a `workflow_dispatch` dry run with `--no-publish`; unit `canary_publish::{partial_failure_not_published}`.
- **Estimate:** 0.25 · **Depends:** C-1.3 · **Blocked by spike:** none
- **Trace event:** n/a (CI)

---

## D-1 · One-button diagnostic · 0.5 d · depends: H-1, C-1 · PRD 24.2 · UC-61
**Contract:** no prompts, file contents, tokens, email, payload text or project paths. Commands appear as program names only. The report is built in ≤ 5 s. **The only output is the report (Copy, Save as file, Open an issue); no log export (NFR-103, G3-2).** Eucas sends nothing itself.

### D-1.1 Diagnostic core with section providers
- **Traces:** FR-123, FR-124, FR-126, NFR-101, NFR-184, NFR-070
- **Files:** `crates/eucas-core/src/diagnostic/`
- **Acceptance criteria:**
  - Sections follow OPERATIONS §3: versions, shells, hooks, managed settings (with the hash check), heartbeat, canary, status line, the last 20 events, store (with the spool drop count), platform, errors and repairs.
  - The `Account` and `Supervisor` sections are providers registered by AC-2 (lane B) and SUP-1.8.
  - Paths are relativised to known folders; projects appear by display name.
- **Test approach:** a redaction test `diagnostic::no_email_token_payload_or_project_path` over a seeded store; a timing test (≤ 5 s).
- **Estimate:** 0.25 · **Depends:** C-1.4 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=on why_key=diagnostic.ran`

### D-1.2 The `Diagnostic` component, `run_diagnostic` and `export_report`
- **Traces:** FR-125, NFR-103
- **Files:** `apps/companion/src/components/diagnostic/`, `contracts/ipc/commands/diagnostic.schema.json`
- **Acceptance criteria:**
  - Each line is green, amber or red with a word and its repair.
  - The screen says "No paths to your projects or files".
  - Open an issue opens the browser and sends no request.
  - `export_report` is the only export command in the capability file.
- **Test approach:** Vitest for every state; e2e network capture: no request on Open an issue.
- **Estimate:** 0.25 · **Depends:** D-1.1 · **Blocked by spike:** none
- **Trace event:** as in D-1.1

---

## F-1 · Same-file warning · 0.75 d · depends: H-1 · PRD 23.2 · UC-59
**Contract:** a warning only; it never blocks an edit. **It is a needs-you item (a notch marker and a panel row) and never a toast:** BR-108 (3) and FR-115 allow toasts only for a tripwire stop or "not protected". PRD 23.2's toast is superseded (story map). It never says "conflict" when git would merge cleanly.

### F-1.1 `samefile`: window, worktrees and resolve
- **Traces:** FR-092, FR-094, FR-095, NFR-019
- **Files:** `crates/eucas-core/src/samefile/`
- **Acceptance criteria:**
  - Paths are canonicalised with G-1.4.
  - Same working tree within 15 minutes (adjustable 5–60) → one `needs::raise(same_file)`. Later edits update its count.
  - A commit or stop resolves it.
  - Edits in different worktrees produce only a quiet note, after a `git merge-tree` check.
  - The warning appears ≤ 2 s after the second PostToolUse.
- **Test approach:** integration `samefile::{two_edits_one_item, commit_resolves, worktrees_quiet_note, clean_merge_never_says_conflict}`.
- **Estimate:** 0.5 · **Depends:** H-1.4 · **Blocked by spike:** none
- **Trace event:** `needs_item kind=same_file`, `log_entry kind=warn`

### F-1.2 `SameFileCard` (full and compact)
- **Traces:** FR-093, FR-169
- **Files:** `apps/companion/src/components/same-file-card/`
- **Acceptance criteria:**
  - Show both is read-only, with each side's last edit time and lines changed.
  - **Open** per session.
  - "Don't warn for this file today" offers a 10-s Undo.
- **Test approach:** Vitest for every state.
- **Estimate:** 0.25 · **Depends:** F-1.1 · **Blocked by spike:** none
- **Trace event:** as in F-1.1

---

## T-1 · Tripwire · 2 d · depends: H-1 · PRD 20.4 · UC-56
**Contract:** the tripped flag is persisted **before** the kill. Stop starts ≤ 1 s after the threshold; the tree is gone ≤ 3 s. Never "stopped" while the count moves. The card reports the measured count, never the threshold. 0 wrong trips with 3 sessions. No trip on deletes inside git-ignored folders. The toast fallback is N-1's policy only. **Copy list** is the only export (G3-2).

### T-1.1 `fs_watch`: `ReadDirectoryChangesW` with an overflow recount
- **Traces:** FR-055, NFR-039
- **Files:** `crates/eucas-platform/src/windows/fs_watch.rs`
- **Acceptance criteria:**
  - A dedicated thread with a 64 KB buffer watches the active session folders and the user profile.
  - A 0-byte return (overflow) → a recount signal.
- **Test approach:** Windows integration `fs_watch::{overflow_triggers_recount}` (a 4 KB buffer with a 200 ms reader stall).
- **Estimate:** 0.5 · **Depends:** H-1.4 · **Blocked by spike:** none
- **Trace event:** n/a

### T-1.2 Parent-link registry and tree kill
- **Traces:** FR-056, NFR-017
- **Files:** `crates/eucas-platform/src/windows/{process_registry.rs,process_tree.rs}`
- **Acceptance criteria:**
  - A Toolhelp32 snapshot every 200 ms, only while sessions exist.
  - Keys are `(pid, creation time)`. Entries expire 10 minutes after both ends exit.
  - The kill walks the remembered tree and repeats until no new children appear for 1 s. Each kill is verified with a `SYNCHRONIZE` wait.
- **Test approach:** unit `registry::{pid_reuse_not_aliased, orphan_kept, expiry_10min}`; integration `tree_kill::orphan_start_process_killed`.
- **Estimate:** 0.5 · **Depends:** T-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### T-1.3 `tripwire` core: count, trip, second kill and verify
- **Traces:** FR-055, FR-056, FR-057, FR-059, FR-060, NFR-039
- **Files:** `crates/eucas-core/src/tripwire/`
- **Acceptance criteria:**
  - 200 deletes in 20 s per session (git-tracked in its folder, or anywhere else in the profile).
  - Git-ignored folders don't count, unless deletes outside the project start in the same window, which trips at once.
  - On a trip: the flag file, then the kill, then a second kill if deletes are still landing at 300 ms. If the count still moves after 3 s, `claude.exe` is stopped too.
  - The flag and the card survive an app restart.
  - The folder allow list (`tripwire_expected`).
- **Test approach:** PR integration `tripwire::{two_thousand_deletes_with_orphan_under_200_after_kill, node_modules_50k_no_trip, escape_outside_root_trips_immediately, never_stopped_while_counting, crash_mid_stop_still_denied}`; a bypass case "script written then run" asserted caught (G-5.3); nightly overflow test with the exact count.
- **Estimate:** 0.5 · **Depends:** T-1.2 · **Blocked by spike:** none
- **Trace event:** `TripwireEvent { session, measured_count, state }` → `log_entry kind=trip`, `needs_item kind=tripwire_stop`, `state_patch` for the notch marker (N-0/N-1 draw it)

### T-1.4 `TripwireCard` (both states) and `tripwire_expected`
- **Traces:** FR-058, FR-059, FR-061, FR-169
- **Files:** `apps/companion/src/components/tripwire-card/`, `contracts/ipc/commands/tripwire.schema.json`, `contracts/copy/en/gap-list.json`
- **Acceptance criteria:**
  - An `alertdialog` with two states: "still deleting" (live count) and "stopped at <time>" (the measured count, grouped by folder, recovery routes, Open the folder, Copy list).
  - **This was expected** spells out its consequence and offers Undo.
  - The gap-list lines exist (FR-061).
- **Test approach:** Vitest for both states; e2e `tripwire.spec.ts::never_stopped_while_count_moves`; `overflow_fixture_reports_measured_not_200`.
- **Estimate:** 0.5 · **Depends:** T-1.3 · **Blocked by spike:** none
- **Trace event:** as in T-1.3

---

## M-1 · Guided merge (plain code) · 1.75 d · depends: H-1, N-1 (lane B) · PRD 23.3 · UC-59
**Contract:** no model and no Worker call. It merges with `git merge --no-edit` and **never rebases**. It never merges into or pushes to the default branch (G-2.2 is reused as a self-check). A conflict or a failing test stops it with nothing pushed. A tool call starting mid-run aborts it. Close the PR is the undo.

### M-1.1 Offer detection and the test command
- **Traces:** FR-096
- **Files:** `crates/eucas-core/src/merge/offer.rs`
- **Acceptance criteria:**
  - A `Stop` after a run, or `SessionEnd`, on a non-default branch with commits ahead → `needs::raise(merge_offer)`.
  - The test command is detected from `package.json` `test`, `Cargo.toml` or `pyproject.toml`; otherwise it is set once per project (`setting`).
- **Test approach:** temp-repo integration `offer::{ahead_branch_offers, default_branch_no_offer, detects_pnpm_test}`.
- **Estimate:** 0.5 · **Depends:** H-1.4, N-1 (lane B) · **Blocked by spike:** none
- **Trace event:** `needs_item kind=merge_offer`

### M-1.2 The runner
- **Traces:** FR-097, FR-099, FR-100, NFR-061, NFR-183
- **Files:** `crates/eucas-core/src/merge/run.rs`
- **Acceptance criteria:**
  - Steps: check the tree is clean and the session idle → fetch → `merge --no-edit` → on a conflict, `merge --abort` and name the files → run the tests → assert `!targets_default` → `push -u` → `gh pr create`, or the command to copy.
  - A tool call in that session aborts the run.
  - The command log has no `rebase` and no Worker request.
- **Test approach:** temp-repo tests `run::{clean_opens_pr, conflict_aborts_head_unchanged, failing_tests_nothing_pushed, no_gh_shows_command, tool_call_mid_run_aborts, push_target_never_default}`.
- **Estimate:** 0.75 · **Depends:** M-1.1 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=on why_key=merge.result`

### M-1.3 Result, Close the PR and the `GuidedMerge` component
- **Traces:** FR-098, FR-169
- **Files:** `crates/eucas-core/src/merge/result.rs`, `apps/companion/src/components/guided-merge/`, `contracts/ipc/commands/merge.schema.json`
- **Acceptance criteria:**
  - The item becomes its result: "PR #n is open · N tests passed. Nothing was merged." or "Tests failed… Nothing was pushed."
  - **Close the PR** runs `gh pr close` and keeps the branch.
- **Test approach:** Vitest for every state; e2e `guided-merge.spec.ts`.
- **Estimate:** 0.5 · **Depends:** M-1.2 · **Blocked by spike:** none
- **Trace event:** `needs_item` resolved, with the result

---

## SUP-3 · Supervisor eval harness as a regression suite · 1 d · depends: S1-1 · PRD 25.3 · UC-63
**Contract:** the same corpus format as SP-SUP1. Rules-only is scored in every run as the floor. The bars are SUPERVISOR §10. **The v0.1 launch waits for SP-SUP2 to pass (SRS G3-1: the supervisor is on from launch, and the kill switch is for emergencies, not a launch state).** This harness is what scores SP-SUP2.

### SUP-3.1 Port the harness to TypeScript
- **Traces:** FR-130, FR-131, NFR-076
- **Files:** `evals/supervisor/{package.json,src/{score,run-models,run-decisions}.ts,sets/{planted,real-sp-sup1}/}` (from `spikes/supervisor-bench`)
- **Acceptance criteria:**
  - On the same data, the scores equal SP-SUP1's (the planted set of 166 plus 40 injection moments, and 23 real moments).
  - Rules-only is scored as a separate row.
  - No secrets in the committed corpus (gitleaks clean).
- **Test approach:** a Vitest parity test `score.test.ts::matches_sp_sup1_results_summary`.
- **Estimate:** 0.5 · **Depends:** S1-1.4 · **Blocked by spike:** none
- **Trace event:** n/a (eval output in `evals/supervisor/out/`)

### SUP-3.2 Leak bar, size and wake-up metrics, the held-out set, and the CI job
- **Traces:** FR-128, NFR-091, NFR-111
- **Files:** `evals/supervisor/src/{leaks,metrics}.ts`, `evals/supervisor/sets/held-out-real/` (gitignored locally; only scores are committed), `.github/workflows/supervisor-eval.yml` (a new file, so no `ci.yml` conflict)
- **Acceptance criteria:**
  - Leak scorer: 0 payloads with a secret, path or name after redaction. It uses the reference `scrub.mjs` until SUP-1.4 provides `xtask redact`.
  - Reports prompt size p50/p95 and the wake-up rate. Writes `out/<date>-<config>.json`, which `xtask config sign` reads.
  - The PR run is rules-only plus the leak bar, offline. Model runs are nightly or manual.
- **Test approach:** unit `leaks.test.ts::{planted_secret_flagged, clean_passes}`; the job itself.
- **Estimate:** 0.5 · **Depends:** SUP-3.1 · **Blocked by spike:** **SP-SUP2 (acceptance)**: the held-out set of ≥ 300 moments and the 0-leak, prompt-size and wake-up bars come from SP-SUP2. The v0.1 launch waits for its pass (G3-1)
- **Trace event:** n/a

---

## SUP-1 · The supervisor in the core, always on · 3 d → **3.25 d** · depends: H-1, BU-1, AC-2, SUP-2 contract (lane B), SUP-3 · PRD 25.3, 27.8, 27.11, 28.4 · UC-63, UC-66
**Why +0.25:** the receipts with Why? for supervisor decisions (FR-134) need their own UI half-day, on top of What is sent.
**Contract:** the `Decision` type has no allow variant, and the crate isn't a guard dependency. The trimmer and redactor are **release-gating** code: 0 leaks on the corpus, the property tests pass, and coverage is ≥ 90 %. If more than 40 % was removed or a secret still matches, nothing is sent and the decision is ask you. There is no off switch in the UI. What is sent is byte-equal to what the Worker received. Stop observers exit 0 on any failure. **Launch acceptance needs SP-SUP2 to pass (G3-1).** `killSwitches.supervisor` stays an emergency switch.

### SUP-1.1 Signals and rules v2
- **Traces:** FR-129, FR-130, FR-131, NFR-076
- **Files:** `crates/eucas-core/src/supervisor/{signals.rs,rules_v2.rs,decision.rs}` (ports of `spikes/supervisor-bench/lib/{signals,rules}.mjs`)
- **Acceptance criteria:**
  - Signals are integers and enums only.
  - R1–R7 as in SUPERVISOR §5. "No, rule N forbids it" counts as answering from the rules.
  - `Decision` = nudge | answer_from_rules | ask_user | stop | done.
- **Test approach:** unit tests on every SP-SUP1 dangerous case (`rules_v2::dangerous_cases`), plus parity with SUP-3's rules-only score.
- **Estimate:** 0.5 · **Depends:** H-1.4, SUP-3.2 · **Blocked by spike:** none
- **Trace event:** n/a (the log row comes in SUP-1.6)

### SUP-1.2 Overrides and the text filter
- **Traces:** FR-131, FR-132, NFR-076
- **Files:** `crates/eucas-core/src/supervisor/overrides.rs`
- **Acceptance criteria:**
  - Overrides 1–5 run after the model.
  - Text filter: ≤ 280 characters; no URLs, fences, metacharacters or paths; no "approved" or "allowed". On a failure, the template text is used, else ask you.
  - At most 3 nudges.
- **Test approach:** unit `overrides::{block_then_nudge_is_ask, done_without_green_is_ask, fourth_nudge_is_ask, approved_word_filtered}`.
- **Estimate:** 0.25 · **Depends:** SUP-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### SUP-1.3 Trimmer
- **Traces:** FR-133, NFR-091
- **Files:** `crates/eucas-core/src/supervisor/trimmer.rs`
- **Acceptance criteria:**
  - Takes the last assistant text block only.
  - Removes code blocks, inline code over 40 characters, diffs, stack traces and JSON/YAML.
  - Cuts to 1,200 characters at a sentence boundary.
  - Reports the removed share; over 40 % → not sent.
- **Test approach:** unit + proptest `trimmer::{never_over_1200, tool_io_never_included, forty_percent_not_sent}`.
- **Estimate:** 0.25 · **Depends:** SUP-1.1 · **Blocked by spike:** none
- **Trace event:** n/a

### SUP-1.4 Redactor and `xtask redact`
- **Traces:** FR-133, NFR-091, NFR-188
- **Files:** `crates/eucas-core/src/supervisor/redactor.rs` (port of `spikes/SP-SUP2/recorder/scrub.mjs` plus the gitleaks rule set), `xtask/src/redact.rs`
- **Acceptance criteria:**
  - Replaces secrets, paths (Windows paths with and without backslashes, POSIX, UNC, `~`), URLs, emails, IPs, repo and folder names, the remote's owner and repo, branch names, and people's names (`git config user.name` and the last 200 authors) with tags.
  - The same function redacts the app log (NFR-188).
  - `xtask redact` replaces `scrub.mjs` in SUP-3.
- **Test approach:** unit tests per class.
- **Estimate:** 0.5 · **Depends:** SUP-1.3 · **Blocked by spike:** **SP-SUP2 (acceptance)**: the cases found by the recorder join the corpus, and the 0-leak bar on real moments
- **Trace event:** n/a

### SUP-1.5 Redaction corpus, property tests and the coverage gate
- **Traces:** NFR-091, NFR-181
- **Files:** `packages/test-fixtures/redaction/**`, `crates/eucas-core/tests/redaction_corpus.rs`
- **Acceptance criteria:**
  - The corpus holds the gitleaks vectors, the SP-SUP1 messages, the SP-SUP2 recorder cases and names.
  - Property test `no_output_matches_secret_or_path_rule`.
  - `cargo llvm-cov` ≥ 90 % for the trimmer, redactor and overrides.
  - It runs on every PR that touches `supervisor/`.
- **Test approach:** corpus + proptest + coverage.
- **Estimate:** 0.25 · **Depends:** SUP-1.4 · **Blocked by spike:** **SP-SUP2 (acceptance)**
- **Trace event:** n/a

### SUP-1.6 Ask path: `eucas-guard stop` and the core's ask server
- **Traces:** FR-132, FR-135, NFR-014, NFR-031, NFR-066
- **Files:** `crates/eucas-guard/src/cmd/stop.rs`, `crates/eucas-core/src/supervisor/ask_server.rs`, `crates/eucas-platform/src/windows/pipe.rs` (reused, no change)
- **Acceptance criteria:**
  - The guard waits ≤ 8 s on `eucas-ask-<SID>`, with the server identity checked.
  - nudge or answer_from_rules → `{"decision":"block","reason"}`. Otherwise empty. Panic → exit 0.
  - ask_user or late → `needs::raise(waiting, "Pip didn't answer: not sure")`.
  - Every decision is logged with who decided ("rule 3" or "model … (config vN)").
- **Test approach:** integration `ask::{late_allows_stop_and_raises_needs, panic_exit_zero, rogue_ask_server_ignored}`.
- **Estimate:** 0.5 · **Depends:** SUP-1.2 · **Blocked by spike:** none
- **Trace event:** `log_entry kind=on why_key=supervisor.decision decided_by=…`, `needs_item kind=waiting`

### SUP-1.7 Server client and the kill switch
- **Traces:** FR-128, FR-129, FR-136, NFR-042, NFR-049, NFR-090, NFR-111
- **Files:** `crates/eucas-core/src/supervisor/client.rs` (uses `contracts/api/supervise-*.schema.json` from SUP-2 in lane B, the token API from AC-2, and the retry helper `retry.rs`)
- **Acceptance criteria:**
  - A call happens only when signed in, the kill switch is off and the rules didn't settle it. The client goes through NA-1.1's gate (`net/gate.rs`); with no account (signed out included) it uses the install token on the taste route (NA-1.10) while the taste lasts, then rules only, sending nothing.
  - Each call has an idempotency key and a 3 s deadline.
  - 402, 413, 422, 429, 503, offline or signed out → rules only, plus the copy "The supervisor isn't reachable right now…" where it applies.
  - An app-side size precheck: ≤ 8 KiB body, ≤ 1,200-character message.
  - The kill switch is read from C-1.1's config within 15 minutes.
- **Test approach:** integration against the fake Worker: `client::{budget_empty_rules_only, kill_switch_no_call, deadline_3s_is_ask}`.
- **Estimate:** 0.25 · **Depends:** SUP-1.6, SUP-2 contract and AC-2 (lane B) · **Blocked by spike:** **SP-SUP2 (acceptance)**: the prompt cap (about 2,000 tokens) and the wake-up rate are re-set from SP-SUP2's measurements
- **Trace event:** as in SUP-1.6, plus a `state_patch meter`

### SUP-1.8 Sent log, and the account and supervisor diagnostic sections
- **Traces:** NFR-095, NFR-094, NFR-101, FR-137
- **Files:** `crates/eucas-core/src/supervisor/sent_log.rs`, `crates/eucas-core/src/store/migrations/0002_sent_log.sql`, `crates/eucas-core/src/diagnostic/supervisor.rs` (uses `platform/windows/dpapi.rs` from AC-2)
- **Acceptance criteria:**
  - The payload is stored DPAPI-encrypted and verbatim as sent: the last 20, at most 7 days. Clear history removes it.
  - The diagnostic shows sizes and outcomes only, never text.
  - The app log redaction pass is wired to SUP-1.4.
- **Test approach:** integration `sent_log::{byte_equal_to_request, keeps_last_20, cleared_by_clear_history}`; the diagnostic redaction test is extended.
- **Estimate:** 0.25 · **Depends:** SUP-1.7 · **Blocked by spike:** none
- **Trace event:** `sent_payload` row

### SUP-1.9 What is sent, and receipts with Why?
- **Traces:** FR-127, FR-134, FR-137, FR-138, FR-170, NFR-095, NFR-103
- **Files:** `apps/companion/src/screens/settings/what-is-sent/` (**shared folder: lane B's P-1/AC-2 must not be editing `screens/settings` in the same sprint**), `apps/companion/src/components/receipt-why/`, `contracts/ipc/commands/supervisor.schema.json` (`sent_log_get`)
- **Acceptance criteria:**
  - Shows the privacy line from `fixed.privacy`, the example card rebuilt from your most recent session (or one labelled **Sample**), "Sent N times this month · last at …", and the no-off-switch line. Never the original text. No toggle. No export.
  - Why? shows the trimmed, redacted question, the rule, the decision, and a **That was wrong** slot (learns-you, lane B, fills it).
  - O-1 reuses the payload builder for setup step 8.
- **Test approach:** Vitest for every state; e2e `what-is-sent.spec.ts::byte_equal_to_fake_worker`; a DOM grep for the fixture's secret → absent; a UI scan → no toggle.
- **Estimate:** 0.5 · **Depends:** SUP-1.8 · **Blocked by spike:** none
- **Trace event:** n/a (it reads the trace)

---

## Q-1 · Hardening · 1.5 d → **2.5 d** · depends: all · PRD 18.5 · UC: all
**Why +1:** the Windows 10 22H2 VM pass (G3-5, story map decision 6) was added by the PM. The founder sets up the free VirtualBox VM before Sprint 10.
**Contract:** every perf budget is a hard gate. No serious or critical axe violations. The full TESTING §4 e2e set is green. 0 known bypasses among in-scope tool calls. Undo everywhere (FR-169) is checked across stories. No export anywhere except the diagnostic report and Copy list.

### Q-1.1 Perf samplers and hard budgets
- **Traces:** NFR-007, NFR-008, NFR-009, NFR-010, NFR-021
- **Files:** `tests/perf/{idle_sampler,notch_sampler,active_nightly}/`, `.github/workflows/ci.yml` (the `perf` job)
- **Acceptance criteria:**
  - Idle < 0.5 % CPU and < 90 MB. Notch < 2 MB, < 0.3 % CPU at rest, < 1.5 % while following. Active (nightly) < 3 % and < 180 MB. Panel first frame < 150 ms. Installer < 20 MB.
  - The job fails over a budget, or on a regression of more than 20 %.
- **Test approach:** the samplers.
- **Estimate:** 0.5 · **Depends:** all feature stories, N-0 · **Blocked by spike:** none
- **Trace event:** n/a

### Q-1.2 Accessibility, the full e2e set and the undo-everywhere audit
- **Traces:** NFR-130, NFR-131, NFR-132, NFR-067, NFR-138, FR-169
- **Files:** `tests/e2e/**` (gap-filling the TESTING §4 table), `tests/e2e/a11y.spec.ts`, `tests/e2e/undo-audit.spec.ts`
- **Acceptance criteria:**
  - axe runs on every panel and setup state.
  - The keyboard path reaches the panel from the tray and the hotkey, and Esc returns focus.
  - Hostile strings render as text.
  - Every reversible change in FR-169's list offers a 10-s Undo, and each irreversible one says so before you commit.
  - The fixed strings render exactly.
  - The set includes NA-1.6's no-account spec, and axe runs on `s-noacct-done`, `p-noacct` and `p-noacct-empty`.
- **Test approach:** Playwright + `@axe-core/playwright`; a Narrator pass on the top 5 flows (manual).
- **Estimate:** 0.5 · **Depends:** Q-1.1 · **Blocked by spike:** **SP-ST2 (acceptance)**: the notch's UIA and keyboard checks follow the route SP-ST2 chooses (a UIA provider, or the hidden-companion fallback)
- **Trace event:** n/a

### Q-1.3 README, the published bypass table, the threat model, and the manual checklist on Windows 11
- **Traces:** FR-032, FR-061, FR-188, NFR-061, NFR-180, NFR-151
- **Files:** `README.md`, `docs/security/{bypass-table.md,threat-model.md}`, `docs/spikes/G6-MANUAL-CHECKLIST.md` (the run record)
- **Acceptance criteria:**
  - The README covers the SmartScreen steps, the Smart App Control note, the unbrick line, the SHA-256 check, "the supervisor can't be switched off" and the FSL.
  - The bypass table is generated by G-5.3.
  - The required-checks ruleset is audited.
  - The founder's checklist passes on Windows 11 (real UAC, real toasts, three hosts).
- **Test approach:** a docs review; the checklist.
- **Estimate:** 0.5 · **Depends:** Q-1.2 · **Blocked by spike:** none
- **Trace event:** n/a

### Q-1.4 Windows 10 22H2 VM pass (G3-5)
- **Traces:** NFR-150, NFR-011, NFR-137
- **Files:** `docs/spikes/G6-MANUAL-CHECKLIST.md` (a Windows 10 column), `crates/eucas-core/src/installer/os_check.rs` (the installer OS gate), `tests/e2e/os-check.spec.ts`
- **Acceptance criteria:**
  - The full manual checklist passes on Windows 10 22H2 in VirtualBox. Scaling and second-monitor results are recorded as "partial (VM)".
  - On Windows 10, the Smart App Control check is skipped (FR-002).
  - Older Windows or arm64 → a plain reason and nothing written.
- **Test approach:** unit `os_check::table` (10 22H2, 11 22H2+, 10 21H2 refused, arm64 refused); the manual VM run.
- **Estimate:** 1 · **Depends:** Q-1.3; the founder sets up the VM · **Blocked by spike:** none
- **Trace event:** n/a

---

## 2. Proposed lane-A order (superseded by the [sprint plan](README.md#4-sprint-plan); kept for its reasoning)

| Sprint | Lane A (days) | Needs from lane B by the start |
|---|---|---|
| 1 | S1-1 (1.5) → G-1 (1.75) = 3.25; G-1.5 may spill | U-1 starts after S1-1.4 |
| 2 | G-2 (1.5) → G-3 (1.5) = 3.0 | N-0 adds to `ci.yml` only after G-3.5 merges |
| 3 | G-4 (1.25) → A-1 (1.75) = 3.0 | — |
| 4 | G-5 (1.25) → H-1 (2.0) = 3.25 | U-1 merged (H-1.4); lane B keeps off `ci.yml` while G-5.4 runs |
| 5 | C-1 (1.25) → D-1 (0.5) → SUP-3 (1.0) = 2.75 | W-1's `runtime-config.schema.json` |
| 6 | F-1 (0.75) → T-1 (2.0) = 2.75 | — |
| 7 | A-2 (1.5) → M-1 (1.75) = 3.25 | **R-1 and N-1 merged by the end of Sprint 6**; lane B off `screens/rules` during A-2.3 |
| 8 | SUP-1 (first 3.0 of 3.25) | AC-2 (with `dpapi.rs`), BU-1, SUP-2's contracts; lane B off `screens/settings` during SUP-1.9 |
| 9 | SUP-1 spill (0.25) · open (about 2.75 d: learns-you if the other lead places it here, or the day-6 re-plan slack) | O-1 in progress |
| 10 | Q-1 (2.5) | O-1 done; the Windows 10 VM set up |

**Differences from BUILD-PLAN §4 and the story map:** SUP-3 moves from Sprint 3 to Sprint 5 because lane A is full in Sprint 3. It still lands well before SP-SUP2 needs scoring. A-2 moves from Sprint 8 to Sprint 7, and M-1 needs N-1 from lane B a sprint earlier than the old plan had it.

---

## 3. Totals

| Story | Sum of task days | BUILD-PLAN | Δ | Reason (one line) |
|---|---|---|---|---|
| S1-1 | 1.5 | 1.5 | 0 | — |
| G-1 | 1.75 | 1.5 | +0.25 | PowerShell `-EncodedCommand` and aliases; canonicaliser split pure/platform |
| G-2 | 1.5 | 1.5 | 0 | — |
| G-3 | 1.5 | 1.25 | +0.25 | Pipe-server identity check (NFR-066) had no owner |
| G-4 | 1.25 | 1 | +0.25 | `repair_guard` and `protection_off(15)` had no owner; the status line stays in L-1 |
| G-5 | 1.25 | 1 | +0.25 | S-1 loopback stand-in built here (moved from C-1) |
| A-1 | 1.75 | 1.5 | +0.25 | Local build order for the embedded guard and the pinned hash |
| A-2 | 1.5 | 1.5 | 0 | — |
| H-1 | 2.0 | 1.5 | +0.5 | SQLite store, migrations and retention had no owner |
| C-1 | 1.25 | 1.5 | −0.25 | Loopback moved to G-5 |
| T-1 | 2.0 | 2 | 0 | — |
| F-1 | 0.75 | 0.75 | 0 | — |
| M-1 | 1.75 | 1.75 | 0 | — |
| D-1 | 0.5 | 0.5 | 0 | — |
| SUP-1 | 3.25 | 3 | +0.25 | UI for the receipts with Why? (FR-134) |
| SUP-3 | 1.0 | 1 | 0 | — |
| Q-1 | 2.5 | 1.5 | +1 | Windows 10 VM pass (G3-5, PM story map) |
| **Lane A** | **27.0** | **24.25** | **+2.75** | +1 approved by the PM (Windows 10); +1.75 tech-lead re-estimate |

17 stories and 67 tasks. The largest task is 0.75 d (M-1.2).

**Added 2026-10-26 (sprint plan, not this file's stories):** lane A also runs four NA-1 tasks written in [tasks-lane-b.md §NA-1](tasks-lane-b.md): NA-1.8 the install token on the Worker (Sprint 7), NA-1.9 the taste route, NA-1.10 the taste counter and NA-1.2 the tray fallback (Sprint 9); 1.75 d. To make room, the sprint plan moves R1 (lane B's story) into lane A earlier (R1.1, R1.2 in Sprint 5; R1.4 in Sprint 6; R1.3 in Sprint 7), and LY-1 and R-2 run in lane A over Sprints 9 and 10.

## 4. Tasks blocked by a spike

| Spike | Tasks | Kind |
|---|---|---|
| SP-ST2 | Q-1.2 | Acceptance only (how the notch's Narrator and keyboard checks are verified). Its build owner is N-0 in lane B |
| SP-AC1 | none in lane A | Indirect only: SUP-1.7 needs AC-2's token API, and the e2e tests use the fake Worker |
| SP-SUP2 | SUP-1.4, SUP-1.5, SUP-1.7, SUP-3.2 | **Acceptance.** Building them isn't blocked. Per G3-1, **v0.1 launches only once SP-SUP2 passes** (≥ 300 blind-labelled moments, 0 dangerous decisions, 0 leaks, measured prompt size and wake-up rate). It needs P10 (the recorder installed) now |

## 5. Requirements with no owner (found while splitting; for the PM and lane B)

- **FR-047 (second half) / NFR-062:** detecting a rulebook change Eucas didn't make, restoring it and logging it within 2 s. Suggested owner: R-1 (lane B), which writes the rulebook.
- **FR-187 Remove Eucas, end to end:** A-1, G-4 and L-1 each reverse their own part, but nobody owns the `remove_eucas` orchestration, the deletion of the DB and spool, or the "restore list" UI and e2e. Suggested owner: P-1 (Settings).
- **The Failing banner UI** (Repair / Off for 15 minutes, FR-043): the core is in G-4.4 and H-1.4; the `Banner` component belongs to P-1.
- **Naming drift:** BUILD-PLAN says `windows/spool.rs`, CODE-STRUCTURE says `spool_lock.rs`. S1-1.1 creates `spool.rs` and fixes CODE-STRUCTURE in the same PR.

## 6. Tech-lead questions for Gate 6

1. **Accept lane A at 27.0 d (+1.75 on top of the PM's +1)?** That puts the whole build at about 51–53 days with learns-you, past the 10-sprint fit the story map assumed. **Recommendation:** accept, and don't cut ("sequence, don't cut"). Re-check at the day-6 re-plan; F-1 is the first candidate for v0.1.1, and only with your OK.
2. **Accept the new lane split and order (§2)?** M-1 now waits for N-1 and A-2 waits for R-1, both from lane B, by the end of Sprint 6. **Recommendation:** yes, and lane B schedules N-1 and R-1 no later than Sprint 6.
3. **CLAUDE.md still describes the Electron team app** (its commands, architecture and key concepts), and `engineering-craft` assumes Electron. **Recommendation:** let S1-1.4's PR update CLAUDE.md's Commands and Architecture sections for Tauri, Rust and pnpm. You review it; nothing else in it changes.
4. **`apps/landing` (npm) sits inside `apps/*`.** **Recommendation:** exclude it from the pnpm workspace in S1-1.2 and migrate it later, so the waitlist site carries no risk.
5. **SP-SUP2 now gates the launch (G3-1).** The recorder isn't installed (P10), and it holds 50 of the ≥ 300 moments. **Recommendation:** install it this week (dry run first), so the held-out set is labelled before SUP-1 finishes in Sprint 8–9 and the launch doesn't wait on data.
