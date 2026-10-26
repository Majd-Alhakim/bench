# ADR-0014: Nightly canary against the latest Claude Code, and the "verified for Claude Code x.y" logic

- **Status:** Proposed (2026-10-26)
- **Date:** 2026-10-26

## Context
Claude Code ships about 6–8 releases a week, and in October 2026 four of them changed Windows hook behaviour (fail-open fixes in 2.1.299, 2.1.309 and 2.1.310). We can't pin the user's binary (it auto-updates; pre-mortem platform S12). Kill criterion: "we can't detect that our hook stopped firing". So we need two loops: **ours** (CI proves each new CLI release before users get it) and **theirs** (each PC proves itself after its CLI updates).

## Decision
**1. Nightly canary in CI** (`.github/workflows/canary.yml`, 03:00 UTC plus on demand). On `windows-latest` (Git Bash present, and a job variant with Git Bash removed from `PATH`, PowerShell 5.1 and 7) and `ubuntu-latest`:
- install the **latest** Claude Code (native installer) and record its version;
- run the contract suite (TESTING.md §3): hook input fixtures per event, exit-code and `onFailure` semantics, exec-form launch, status-line JSON schema, `claude agents --json` schema, the bypass suite in a throwaway repo, a managed-settings precedence test (on the Windows runner, which is admin), and hook-only canary S-1;
- **no model calls in CI by default**: hook paths are driven through Claude Code's own synthetic entry point if S-1 finds one, otherwise a weekly job uses a real model turn on a CI API key with a $2/month cap.

On pass, the job appends `{ cli: "2.1.314", os, shells, suiteVersion, passedAt, commit }` to `verified-versions.json`, signs it with the **canary key** (a separate Ed25519 key that the app trusts for `verified-versions.json` only, never for runtime config; the offline config key of ADR-0012 never enters CI) and publishes it through `GET /v1/config/{channel}`. On fail, it opens (or comments on) one GitHub issue per CLI version, labelled `canary`, with the failing tests and the diff of any schema change, and adds the version to `knownBadCli[]` **in the same file** (the app shows "not verified" and, for a fail-open finding, a red banner). `verified-versions.json` is the one home for both lists; the founder can also edit it by hand and sign it with the offline config key, which the app accepts for every file.

**2. The badge on the PC.** The app reads the CLI version from `SessionStart` input, the status line and `claude --version`. It shows:

| Condition | State (DESIGN §4.2) |
|---|---|
| CLI version is in `verified-versions` **and** the local canary passed after this CLI was installed | `guarded` + "Verified for Claude Code 2.1.314" |
| CLI version not yet in the list (released after the last nightly), local canary passed | `not_verified` ("guard on, test pending") until the list includes it |
| CLI below the floor (2.1.310 on Windows) | `not_verified` permanently, with "Update Claude Code" |
| Local canary couldn't run | `untested` |
| Local canary not blocked, or the version is known-bad with a fail-open finding | `not_guarded` / red, everywhere |

**3. The local canary** runs in first run (UX screen 5), after each detected CLI version change, and on "Run the test again". It runs in a temp folder with a throwaway git repo, asks the guard path to evaluate `git push origin main`, and expects a deny with our receipt. It's hook-only (no tokens) if S-1 passes; otherwise it's a real model turn (~400 tokens) and the UI says so (D-5).

## Consequences
- Users are never told "verified" for a version we haven't run, and a CLI regression reaches the founder as an issue before most users update.
- The nightly costs Actions minutes only (Windows minutes are free on a public repo).
- The suite must stay fast (target ≤ 15 minutes per OS) so it can also run on every PR that touches `crates/eucas-guard`, `crates/eucas-adapters` or `contracts/`.
