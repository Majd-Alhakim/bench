# CI/CD: the Eucas companion

Design only. The workflow files are created in S1-1 (PR checks), S1-6 (canary) and the release story; the YAML below is the spec they implement. Every `uses:` is pinned to a full commit SHA with a `# vX.Y.Z` comment, every job has `permissions:` and `timeout-minutes:`, and concurrency cancels superseded runs (ADR-0003). `<sha>` marks where S1-1 fills the current SHA.

## 1. Branches and the release train (unchanged flow, new artefacts)

```mermaid
flowchart LR
  F[feat/ fix/ chore/ docs/ spike/] -- PR, squash --> D[dev]
  D -- Version Packages PR, squash --> D
  D -- promotion PR, merge commit --> S[staging]
  S -- tag vX.Y.Z-beta.N, updater-signed build --> B[(beta channel)]
  S -- release PR, merge commit --> M[main]
  M -- tag vX.Y.Z, updater-signed build, approval --> ST[(stable channel)]
  S -- wrangler deploy --env staging --> WS[Worker staging]
  M -- approval, wrangler deploy --env production --> WP[Worker production]
```

- **Changesets:** every user-visible PR adds one. On `dev`, the changesets action keeps a **Version Packages PR** open (bumps `package.json` and `Cargo.toml` versions through `xtask version`, writes `CHANGELOG.md`). Merging it is the cut for the next promotion. Staging and main never get commits from bots: beta tags are computed (`v<version>-beta.<run_number>`), the stable tag is the version on `main`.
- **Hotfix** and **rollback** stay as CONTRIBUTING.md says. Rolling back a release also means **pausing the channel** (§5): the Worker serves the previous manifest so nobody updates to the bad build.

## 2. Pull-request checks (`.github/workflows/ci.yml`)

Runs on every PR (Windows + Ubuntu) and on pushes to `dev`, `staging`, `main` (adds macOS build and unit tests only).

| Job | OS | Steps | Blocks merge |
|---|---|---|---|
| `secret-scan` | ubuntu | gitleaks 8.30.1 CLI, checksum-verified (exists today) | ✅ |
| `dependency-review` | ubuntu | `actions/dependency-review-action@<sha>` with `fail-on-severity: high`, `deny-licenses: AGPL-3.0, GPL-3.0, SSPL-1.0, BUSL-1.1` (our own FSL code is excluded by path) | ✅ |
| `ts` | win + ubuntu | `pnpm install --frozen-lockfile` · `pnpm lint` · `pnpm typecheck` · `pnpm test` (Vitest: renderer, copy, contracts-ts, Worker via `@cloudflare/vitest-pool-workers`) | ✅ |
| `rust` | win + ubuntu | `cargo fmt --check` · `cargo clippy --workspace --all-targets -- -D warnings` · `cargo nextest run --workspace` · `cargo deny check` · `cargo xtask check-deps` (also fails on any `SetWindowsHookEx` use: no keyboard hook, founder 2026-10-26) · `cargo xtask codegen --check` (generated types up to date, incl. the notch tokens from `tokens-notch.json`) | ✅ |
| `contracts` | ubuntu | Validate every fixture against its schema; round-trip each through the Rust and TS types (TESTING §3.1); `ajv` validate `apps/plugin/hooks/hooks.json` against **our** stricter hooks schema (the CLI validator doesn't check hook fields, see `spikes/companion-hook-shape`) | ✅ |
| `plugin` | windows | Install the **pinned** Claude Code version from `contracts/claude-code/pinned.txt`; `claude plugin validate --strict apps/plugin` | ✅ |
| `guard-contract` | windows (Git Bash present) + windows (Git Bash removed from `PATH`) | Only when `crates/eucas-guard`, `crates/eucas-adapters`, `crates/eucas-rules`, `apps/plugin` or `contracts/claude-code` change: the contract and bypass suites against the pinned CLI (TESTING §3, §5) | ✅ |
| `build` | win + ubuntu | `pnpm tauri build` (unsigned on PRs), artefact size check (installer < 20 MB, guard < 4 MB) | ✅ |
| `e2e` | windows + ubuntu | Playwright against the built app with a fake Claude Code home (TESTING §4); Windows over WebView2 CDP, Ubuntu via `tauri-driver`. Traces and screenshots uploaded on failure | ✅ |
| `perf` | windows | Guard latency bench (p95 ≤ 50 ms with Defender on, as the runner has it; the first run of a new binary excluded, SP-H1), idle sampler (10 min, < 0.5 % CPU, < 90 MB with the native notch resting and the pre-warmed panel; SP-ST1 ≈ 80 MB), notch sampler (< 2 MB, < 0.3 % at rest, < 1.5 % following, ADR-0016) | ✅ on regression > 20 % against the last `dev` run; hard fail over the budget |
| `licences` | ubuntu | `cargo deny check licenses` + `pnpm licenses list --json` against the allow-list; writes `THIRD_PARTY_NOTICES.md` and fails if it changed without being committed | ✅ |
| `changeset` | ubuntu | A changeset exists if any file under `apps/`, `crates/`, `installer/` changed (label `no-changeset` to skip) | ✅ |

**Required checks** in the "Protect main, staging and dev" ruleset grow from `gitleaks + Windows + Ubuntu` to every ✅ job above. macOS failures on pushes get a fix PR the same day (CONTRIBUTING.md).

## 3. Nightly canary (`.github/workflows/canary.yml`, ADR-0014)

```yaml
name: Canary (latest Claude Code)
on:
  schedule: [{ cron: "0 3 * * *" }]
  workflow_dispatch: { inputs: { cli_version: { required: false } } }
permissions: { contents: read, issues: write }
concurrency: { group: canary, cancel-in-progress: false }
jobs:
  canary:
    strategy:
      fail-fast: false
      matrix:
        include:
          - { os: windows-latest, shell: git-bash }
          - { os: windows-latest, shell: no-git-bash }   # SP-H1: the CLI checks C:\Program Files\Git\bin\bash.exe directly, so this leg renames that file, not just PATH
          - { os: windows-latest, shell: pwsh5 }         # hooks with shell: powershell, Windows PowerShell 5.1
          - { os: windows-latest, shell: pwsh7 }         # PowerShell 7
          - { os: ubuntu-latest,  shell: bash }
    runs-on: ${{ matrix.os }}
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@<sha> # v7
      - uses: dtolnay/rust-toolchain@<sha> # pinned by rust-toolchain.toml
      - name: Install latest Claude Code (official native installer)
        run: <official install command for the OS>; claude --version > cli-version.txt
      - run: cargo build -p eucas-guard --release
      - run: cargo nextest run -p contract-tests --profile canary   # hook contract, fail-closed, status line, agents --json, managed precedence, bypass suite, S-1 canary
        env: { EUCAS_SHELL_VARIANT: "${{ matrix.shell }}", ANTHROPIC_API_KEY: "" }
      - if: always()
        run: cargo xtask canary-report --out report.json     # results + captured fixtures + schema diffs
      - uses: actions/upload-artifact@<sha> # v5
        if: always()
        with: { name: "canary-${{ matrix.os }}-${{ matrix.shell }}", path: "report.json\ncontracts/claude-code/fixtures/**" }
  publish:
    needs: canary
    if: always()
    runs-on: ubuntu-latest
    environment: canary-publish          # holds exactly: the canary key (signs verified-versions.json only), a KV token scoped to that key,
                                         # (no canary CI API key: S-1 passed, 2026-10-26). Never the offline config key.
    permissions: { contents: write, issues: write }
    steps:
      - run: cargo xtask canary-publish   # pass → append to verified-versions.json, sign with the canary key, PUT to KV (staging, then production)
                                          # fail → open or update issue "Canary: Claude Code <v> on <os>/<shell>", label canary, add to knownBadCli[]
      - run: cargo xtask fixtures-pr      # new CLI fixtures → a PR into dev (schema drift is reviewed, never auto-merged)
```

- **No model calls, ever.** The hook paths are exercised through the S-1 path (a loopback Messages API stand-in; **S-1 GO, 2026-10-26**: 20 / 20 receipts, 0 tokens). ~~If S-1 fails, a weekly job adds one real turn on a dedicated CI API key with a $2/month cap~~: dropped, and so is that key.
- **Auto-filed issue body:** CLI version, OS, shell, failing tests with their assertion, the hook input/output diff, the schema diff, and the badge state users will see. One issue per CLI version; later nights comment on it.
- The canary also runs on every PR that touches the guard (§2 `guard-contract`), against the pinned CLI instead of the latest.

## 4. Release (`.github/workflows/release.yml`)

| Trigger | Job | Notes |
|---|---|---|
| Push to `staging` | `beta` | (The NSIS script creates a Start-menu shortcut with Eucas's AUMID, SP-ST1.) Build on `windows-latest` (x64; arm64 later) in a fixed order so each pinned hash exists before the binary that embeds it: limits guard → `eucas-elevate.exe` (embeds the limits guard) → `Eucas.exe` (embeds the helper's SHA-256, SYSTEM-DESIGN §5.6) → plugin guard (embeds `Eucas.exe`'s SHA-256, SECURITY-PRIVACY T4); sign the update with the Tauri updater key and skip Authenticode in v0.1 (§6); verify the updater signature and the embedded hashes; build SBOM, attest provenance, create **GitHub prerelease** `vX.Y.Z-beta.N` with the installer, `latest.json`, SBOM and `SHA256SUMS`, and publish the installer SHA-256 on the site; then point the Worker's `beta` channel at it |
| Push to `main` | `stable` | Same build from the merge commit; waits for **manual approval** on the `production` environment (founder), then GitHub release `vX.Y.Z` with `SHA256SUMS`, the installer SHA-256 on the site, Worker `stable` channel. Staged rollout: the manifest serves the update to 10 % of installs (a random rollout bucket 0–9 the app picks at install and sends as a header; not an identifier) for 48 h, then 100 %, unless paused |
| Any | `verify` | Downloads the published installer on a clean Windows runner, checks its SHA-256 against `SHA256SUMS` and the updater signature on `latest.json`, installs per-user, runs the first-run e2e headless (fake Claude home), uninstalls, checks the restore |

**Rules:** signing secrets (in v0.1 only the Tauri updater key; an Authenticode credential once bought) exist only in the `production` environment (beta signs from `production` too, behind an environment rule that allows `staging` and `main` refs only). No Claude step, no third-party action that isn't SHA-pinned, and no `pull_request_target` in release workflows. Release notes come from `CHANGELOG.md`; a limits-guard version change adds the line "this update asks Windows for permission once" (ADR-0013).

### SBOM and provenance
- `cargo auditable build` embeds the Rust dependency list in each exe; `cargo cyclonedx` + `@cyclonedx/cyclonedx-npm` produce CycloneDX SBOMs merged into `eucas-<version>.cdx.json` and attached to the release.
- `actions/attest-build-provenance@<sha>` attests the installer, `Eucas.exe`, `eucas-guard.exe` and `eucas-elevate.exe` (SLSA build provenance on GitHub's public-good Sigstore instance; the repo is public). The README shows `gh attestation verify <file> --repo eucas-app/eucas`.

## 5. Auto-update channels

| Channel | Source | Who | Pause |
|---|---|---|---|
| `stable` | Tags on `main` | Everyone by default | `config.updates.stable.paused = true` (signed config) → the manifest route returns 204 |
| `beta` | Tags on `staging` | Founder and opted-in users (Settings › Updates) | Same |

The app checks `GET /v1/updates/{channel}/{target}/{version}` at start and every 6 h, verifies the Tauri updater signature, downloads in the background, and installs on quit or when no session is running. Then it updates the plugin (`claude plugin update eucas@eucas`) and, if the limits guard changed, asks for UAC with the reason. A failed update leaves the old version running and is shown in Settings › Updates.

## 6. Signing (ADR-0013, decision D-3)

**v0.1 is unsigned** (CR-010, founder 2026-10-26): no Authenticode on any binary. What the release still does:
- **Updater signature:** `tauri build` signs the update artefacts with the Tauri updater's Ed25519 key (`TAURI_SIGNING_PRIVATE_KEY`, `production` environment only); the app rejects an update whose signature doesn't verify (§5).
- **Published hashes:** `SHA256SUMS` is attached to every release, and the installer's SHA-256 is published on the site; the README shows how to check it (`Get-FileHash`).
- **Pinned helper hash:** the build embeds `eucas-elevate.exe`'s SHA-256 in `Eucas.exe` (§4 build order); the `verify` job checks the embedded value matches the shipped helper.

The workflow keeps one `sign` step with a pluggable command (`tauri.conf.json` `bundle.windows.signCommand`), **empty in v0.1**, so turning Authenticode on once revenue covers it changes a secret and one line:

| Route (later) | Step | Secrets (production environment only) |
|---|---|---|
| A. OV + cloud signer | Provider's CLI signer, e.g. `CodeSignTool sign -input_file_path %1 …` | Provider username, credential id, TOTP seed |
| B. Azure Artifact Signing (if a company is formed) | `azure/trusted-signing-action@<sha>` or `signtool` with the dlib | Federated credential (OIDC), no long-lived secret |

Once signing is on: `signtool verify /pa /all` on every exe and the installer; failure stops the release.

## 7. Worker deploy (`.github/workflows/deploy-api.yml`)

**Worker secrets per environment (2026-10-26, CR-012):** the token-signing key, the OpenRouter key, the Resend key (fallback, unused unless config switches), and the Lemon Squeezy webhook secret once Pro opens. Set with `wrangler secret put` by the founder; never in the repo or in Actions.

| Trigger | Steps |
|---|---|
| PR touching `apps/api/**` or `contracts/api/**` | Vitest with the Workers pool and a local D1 (TESTING §8), `wrangler d1 migrations list` (no unapplied migration missing from the PR), `wrangler deploy --dry-run --env staging`, bundle size < 1 MB (with the disposable-domain module) |
| Push to `staging` | `wrangler d1 migrations apply --env staging` (migrations are additive only; a destructive change needs two releases), then `wrangler deploy --env staging` (Cloudflare API token scoped to the one Worker, its KV, its D1 database and the Email Service binding; ~~and DO~~; stored in the `api-staging` environment) · smoke: `/v1/config/beta` signature valid; `/v1/supervise`, `/v1/draft-rule` and `/v1/meter` refuse a missing token (401), an unknown field (400) and a fake key pattern (422); `/v1/auth/start` to a verified staging inbox sends a code (free on Email Service) and to a disposable domain returns 422 |
| Push to `main` | Approval on `api-production`, the same migrations and deploy for `production`, the same smoke (without the email send), then `wrangler versions` keeps the previous version for one-command rollback (`wrangler rollback`; D1 migrations are additive, so a rollback never needs a down-migration) |
| Weekly (Monday 04:00 UTC) *(2026-10-26)* | `disposable-domains.yml`: fetch `disposable_email_blocklist.conf` from `disposable-email-domains/disposable-email-domains` at its latest commit, apply `config/disposable-allow.txt`, regenerate `apps/api/src/generated/disposable-domains.ts`, open a PR into `dev` with the diff size and the upstream SHA (no auto-merge). Permissions: `contents: write`, `pull-requests: write` only |

Runtime config changes (model swap, kill switch, channel pause) are **not deploys**: `cargo xtask config sign` on the founder's machine (the signing key never leaves it), then `cargo xtask config push --env staging|production`, which writes KV after a schema check. Every config version is committed to `config/history/` in a PR for the record.

## 8. Dependabot and scheduled hygiene

- Dependabot weekly for `cargo`, `npm` and `github-actions` (grouped minor/patch; majors one by one).
- Weekly `cargo deny check advisories` and `pnpm audit --audit-level high` on `dev` (opens an issue on a new finding).
- Monthly: re-run the supervisor eval (Pro) on the current server config; rotate the canary CI API key if used.
