# Security and privacy: the Eucas companion

Extends [docs/security-baseline.md](../../security-baseline.md) (which applies in full). **The baseline's opening paragraph says "there is no Eucas server"**; the companion adds the thin Worker of ADR-0012, so that paragraph and the §1 threat model need the amendment in §2 below at Gate 6.

**Privacy line:** DESIGN §7.1's "…and nothing leaves this PC" isn't literally true once update checks exist. ADR-0015 proposes "…and nothing about your work leaves this PC unless you turn it on", which §2 below keeps true. **Founder decision.**

The honest promise this design must keep true, word for word (DESIGN §7.1): *"Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."* And the gap: *"Eucas sees tool calls, not what a program does once it runs, and nothing in the cloud. Keep git and backups on."*

## 1. Assets and actors

| Asset | Where | Worst outcome |
|---|---|---|
| The user's files and repos | Their disk, GitHub | Mass delete; push to the default branch |
| Claude login | Claude Code's own store | Eucas reading it (account ban, ADR-0002) |
| The four limits | Managed settings + limits guard (admin) | Silently off while the UI says "guarded" |
| User rules | `rulebook.json` / `.bin` (user) | Widened auto-approvals |
| Local history | `eucas.db`, spool | Leak of activity metadata |
| Pro licence token | DPAPI-protected blob (user scope) | Reuse by someone else (low value) |
| Updater key, config key (no Authenticode credential in v0.1, CR-010) | CI `production` environment; config key offline | Malicious update to every install |
| Provider and payment keys | Worker secrets | Spend abuse |

**Actors:** you; **the agent** (runs as you; treat everything it produces as untrusted, including programs it writes and runs); a malicious repo (committed `.claude/settings.json`, scripts); content the agent reads (prompt injection); a network attacker; a compromised dependency or Action; an organisation admin (legitimate authority above us).

## 2. Data that leaves the machine

| When | To | Exactly what | Never |
|---|---|---|---|
| Always (v0.1) | Eucas API `GET /v1/config`, `/v1/updates` | App version, channel, OS/arch, a random rollout bucket 0–9 | Install ids, usernames, paths |
| You press **Get notified** (v0.1) | `POST /v1/waitlist` | `{ moment, installHash }`. `installHash` is a **pseudonymous id, stable for one release** (SHA-256 of a random install id with a per-release salt), used only to count each install once; not linkable across releases; not stored with an IP | Email, any content |
| Opt-in telemetry (OPERATIONS §1) | Eucas API `POST /v1/telemetry` | Counts and enums only (schema-allowlisted) | Commands, paths, names, text |
| Opt-in crash reports | Same | Minidump-free Rust panic message with paths stripped, module + line, versions | Memory dumps, env vars |
| You press **Open an issue** | Opens github.com in your browser | Nothing sent by Eucas; you paste the report you read | — |
| You describe a rule in plain words (v0.1, prompted rules; CR-010, founder 2026-10-26) | Eucas API `POST /v1/draft-rule` → OpenRouter (ZDR), `gpt-oss-120b` | **Only the sentence you typed**; the server adds the rulebook schema. Counts toward your supervisor budget | Your other rules, commands, paths, transcripts, file contents; nothing is stored or logged |
| Pro, Level 1 | Eucas API | Licence check only (`licenceHash`, `instanceHash`) | Any moment data (Level 1 makes no model call) |
| Pro, Level 2 | Eucas API → OpenRouter (ZDR) | Signals (integers and enums) + the trimmed, redacted last message ≤ 1,200 chars + your guidance text (SUPERVISOR §4) | Code, file contents, tool output, secrets, paths, repo/branch/person names |
| Pro beta, cloud hand-off | Your own Claude account via the CLI | The brief you approve, to **your** routine | Through our servers (never) |

**Baseline §1 amendment (proposed):** "The companion has one server, `eucas-api` (ADR-0012). It stores no user content: only hashed licence and instance identifiers, monthly call counters, and counters keyed by a per-release pseudonymous install id. Request bodies are never logged."

## 3. STRIDE by trust boundary

| # | Boundary | Threat (STRIDE) | Mitigation | Test |
|---|---|---|---|---|
| T1 | Agent → guard (hook stdin) | **T**ampering: crafted tool input to confuse parsing (unicode, `\r`, NUL, 8.3 names, MSYS paths, `^` escapes) | Real tokenizers per shell; canonicalise paths (junctions, 8.3, case, `\\?\`); anything unresolved can't match an allow rule | Bypass suite §5, fuzzing (`cargo fuzz` on tokenizers) |
| T2 | Agent → guard | **E**levation: the agent edits Claude Code settings, the plugin, Eucas's files, or launches `claude --settings '{"disableAllHooks":true}'` | **Self-protection** in the guard: deny Write/Edit/shell targeting `~/.claude/settings*.json`, `~/.claude/plugins/**`, `%APPDATA%\Eucas\**`, `%LOCALAPPDATA%\Eucas\**`, managed paths, and `claude` invocations with `--settings`, `--setting-sources`, `--dangerously-skip-permissions`, `plugin disable/uninstall`. Admin-mode limits live where the user account can't write. `ConfigChange` hook + file watch → `not_guarded` / `user_level` | Bypass suite; precedence tests |
| T3 | Program the agent runs → anything | **E**levation: a script does what a blocked command would (hooks can't see inside programs) | Can't be closed by hooks; **stated in the gap line**. Interpreters with inline code are parsed for limit tokens (`os.remove`, `shutil.rmtree`, `fs.rm`, `Remove-Item`, `git push`); runner programs are never pre-ticked as rules; the tripwire stops mass deletes; managed limits keep rules from touching the four | Bypass suite marks these "known gap, caught by tripwire" |
| T4 | Program the agent runs → Eucas pipes | **S**poofing: a process creates `\\.\pipe\eucas-ask-<SID>` before the app and answers Stop moments with "nudge" | App creates pipes with `FILE_FLAG_FIRST_PIPE_INSTANCE` and a user-only DACL; the guard calls `GetNamedPipeServerProcessId` and checks the server image is `Eucas.exe` at the installed path **and that its SHA-256 equals the hash pinned in the guard build** (unsigned v0.1, CR-010, founder 2026-10-26; the release builds the plugin guard after the app, CI-CD §4); mismatch → treat as no app (safe default) and log. **Weaker than Authenticode, honestly:** the per-user app folder is user-writable, so no Program Files ACL protects `Eucas.exe`; a same-user process that replaces it fails the hash check, but one that also replaces the plugin guard in the user-writable plugin cache passes it (Authenticode wouldn't stop that either, because the attacker replaces the checker). A hash pins one exact release, so between an app update and its plugin update the guard sees "no app" and Stop moments go to you | Unit + integration test with a rogue server and with a swapped `Eucas.exe` |
| T5 | Program the agent runs → `rulebook.json` | **T**ampering: widen auto-approvals | Self-protection (T2) for tool calls. For programs (which run as you, so nothing on the same account can *prevent* it), the app **detects**: it records the hash of every `rulebook.json`/`.bin` it writes, watches both files, and on a change it didn't make shows a banner, restores its last version and logs it. Limits are not in the rulebook, so the worst case is a widened auto-approval until the app notices | Integration test |
| T6 | Repo → Claude Code | **E**levation: committed `.claude/settings.json` with `disableAllHooks: true`, allow rules, or its own PreToolUse hook that allows | Managed limits ignore lower scopes; deny beats allow; limits left "not locked" are detected via heartbeat (no check events) and goes red | Precedence tests in canary |
| T7 | Core → elevate helper | **E**levation: a local process launches `eucas-elevate.exe` with crafted input to write arbitrary managed settings under our UAC prompt, or **replaces the helper** in the user-writable app folder so the next UAC prompt elevates its copy | **No plan file:** the helper accepts only fixed operations (`install`, `repair`, `pause-limits`, `resume-limits`, `remove`, `update-limits-guard`, `update-locked-set`) with enum options (the locked set is a subset of the four limit ids, never free text); the managed entries and the limits-guard binary are **embedded in the helper**, never read from user-writable paths; it merges only keys inside our marker object. **Location and identity (unsigned v0.1, CR-010, founder 2026-10-26):** the first run launches it from the app folder only after the core checks its **SHA-256 against the hash pinned in the app build**; it installs itself to `C:\Program Files\Eucas\` (admin-only ACLs), and every later operation runs that copy, so after first run a user-level process can't swap it. **Weaker than Authenticode, honestly:** the UAC prompt is yellow and says "Unknown publisher", so the user can't tell our prompt from an impostor's; a same-user process that replaces both `Eucas.exe` (which holds the pinned hash) and the helper in the user-writable app folder before first run gets its own copy elevated when the user accepts. With Authenticode, the impostor's prompt would lack our publisher name, a visible warning; without it, the exposure is the first-run window, and the pinned hash only stops a swap of the helper alone. UacFrame no longer tells the user to press No on "Unknown publisher" | Unit tests; hash-check test with a swapped helper; review checklist item |
| T8 | App → Worker | **S**poofing/**T**ampering of config or updates (network attacker, DNS) | TLS (rustls, system roots); config Ed25519-signed with an offline key and anti-rollback `version`; updates signed by the Tauri updater key (Ed25519) and verified before install; in unsigned v0.1 (CR-010, founder 2026-10-26) there's no Authenticode second check, so the updater key is the only signature on an update, and first installs rely on the SHA-256s published on the site and with each release | Tests with a bad signature and an older version |
| T9 | Worker → OpenRouter | **I**nformation disclosure: provider retains data | `zdr: true`, `data_collection: "deny"`; only ZDR-listed providers; payload already redacted | Contract test asserts the provider block is present on every call |
| T10 | Anyone → Worker | **D**oS / spend abuse (stolen licence token, scripted calls) | Per-licence quota, per-IP rate limit (Workers rate limiting binding), 8 KiB cap, global daily circuit breaker, OpenRouter credit limit | Load test on staging |
| T11 | Renderer | **E**levation via XSS in log text (commands from the agent are attacker-controlled strings) | React text nodes only; no `dangerouslySetInnerHTML` (lint error); strict CSP (`default-src 'self'; script-src 'self'; connect-src ipc: http://ipc.localhost`); Tauri capabilities allow-list only our commands; no shell/fs plugins exposed to the renderer | e2e with hostile strings |
| T12 | Supply chain | **T**ampering: compromised crate, npm package or Action | Lockfiles, `--frozen-lockfile`, pnpm `onlyBuiltDependencies` allow-list, `cargo deny` (advisories, sources: crates.io only), SHA-pinned Actions, Dependabot, SBOM, build provenance, updater signing only in `production` | CI §2, §4 |
| T15 | App → Worker → OpenRouter (`/v1/draft-rule`, v0.1, CR-010, founder 2026-10-26) | **I**nformation disclosure (the sentence leaves the PC) and **E**levation (a drafted rule, shaped by prompt injection in the sentence or a bad model answer, widens auto-approvals or touches a limit) | Sends **only the sentence you typed**; the server adds the rulebook schema, applies the strict allowlist, size cap and secret re-scan (ADR-0012), calls `gpt-oss-120b` with the ZDR provider block, logs nothing and counts the call toward your supervisor budget. The draft is untrusted: the server checks it against the schema, then the app re-validates it, compiles it (exact commands only, ADR-0010), rejects any overlap with a limit and any bypass case it would auto-approve, and shows `RulePreview`; nothing is enabled until you confirm | Schema strictness; drafts that overlap a limit or match a bypass case are rejected; e2e describe → preview → confirm |
| T13 | Local store | **I**nformation disclosure: another user or backup software reads `eucas.db` | Stores counts and metadata only (ADR-0015); per-user `%LOCALAPPDATA%` ACLs; receipts redacted and expire in 30 days | Deny-list test |
| T14 | Logs | **R**epudiation / leakage | Guard decisions are append-only receipts with time, rule and session; logs redact secrets with the same redactor as the supervisor | Unit tests |

## 4. The four limits: what each covers

Implemented in `crates/eucas-rules/src/limits/`; the **catalogue** (`catalogue.rs`) of MCP tools and API hosts is reviewed every release and is part of the published bypass suite. The `LimitsPanel` shows this list in plain words.

| Limit | Shell (bash, PowerShell, cmd; including `-c`, `-Command`, `-EncodedCommand` decoded, `cmd /c`, `bash -lc`, `wsl`) | Claude Code tools and MCP | Not covered (gap list) |
|---|---|---|---|
| `limit.delete` | `rm`, `rmdir`, `rd`, `del`, `erase`, `unlink`, `shred`, `Remove-Item` and its aliases (`ri`, `rm`, `del`, `rmdir`, `erase`, `rd`), `Clear-Content` on files, `find … -delete`/`-exec rm`, `git clean -f*`, `git rm` (not `--cached`), `robocopy … /MIR` and `/PURGE`, `mv`/`Move-Item` to `/dev/null`, `NUL` or the Recycle Bin, `diskpart`, `format`, `cipher /w`; inline interpreter code containing file-delete calls | MCP tools whose catalogued effect is delete (filesystem, Drive, S3, GitHub `delete_*`) | Deletes inside a program or script the agent wrote (the tripwire is the backstop) |
| `limit.push_default` | `git push` whose effective target is the default branch: explicit refspecs (`HEAD:main`, `+main`, `:main`), `--force*`, `--mirror`, `--all`, `--delete`, and a bare `git push` when the current branch is the default; the default branch is read from `.git` (`refs/remotes/<remote>/HEAD`, else `main`/`master`), honouring `-C`, `--git-dir`, `--work-tree`, worktrees; `gh pr merge`, `gh api` writes to `git/refs`, `gh repo sync` | GitHub MCP merge and ref-update tools | Pushes from a script; cloud sessions (they never load local hooks) |
| `limit.send` | `sendmail`, `mail`, `mutt`, `Send-MailMessage`; `curl`/`wget`/`Invoke-WebRequest`/`Invoke-RestMethod` with a write method or body to catalogued messaging hosts (Slack, Discord, Telegram, Teams/Graph `sendMail`, Gmail API `send`, SendGrid, Mailgun, Twilio); `gh issue create/comment`, `gh pr comment/review`, `gh release create` | MCP tools catalogued as send or post (email send, chat post, social post, issue/PR comment). **Drafts are allowed** (CR-008) | Sends from programs; hosts not in the catalogue |
| `limit.pay` | `stripe` CLI write commands (charges, payment intents, transfers, payouts, refunds), write calls to catalogued payment APIs, crypto CLIs (`cast send`, `solana transfer`, `bitcoin-cli send*`) | MCP tools catalogued as payment, transfer or purchase | Payments from programs |

**Self-protection (always on, not a fifth limit in the copy):** T2 above. **Unresolved commands** (`$()`, backticks, eval, pipes into an interpreter, `iex`, a variable as the program) are matched against the limit tokens and denied on a hit; they can never be auto-approved.

**The deny message** (to the agent; copy key `guard.deny.limit`, the only wording used): "Eucas blocks <action> in every session. Don't try another way. Tell the user what you wanted to do so they can do it themselves." This is the "never nudge after a block" rule from the agent's side (trust F35).

## 5. Managed-settings precedence (what the design relies on)

| Source (Windows) | Who can write | Read when | Our use |
|---|---|---|---|
| `C:\Program Files\ClaudeCode\managed-settings.json` or `HKLM\SOFTWARE\Policies\ClaudeCode` | Admin | Always; top of precedence | **Locked limits (D-4, CR-010, founder 2026-10-26):** our marker object with the limits hook and the deny patterns for the limits you locked, merged into whichever source exists (an organisation's own source → we don't write; edge D) |
| `HKCU\SOFTWARE\Policies\ClaudeCode` | The user | Only when no admin source exists; no warning for skipped sources | Never (user-writable, so no stronger than user settings, and silently ignored on managed PCs) |
| CLI `--settings`, local, project, user settings | The user / the repo | Normal precedence | The plugin (user scope; its guard enforces all four limits, always); deny patterns for limits left "not locked" |

Rules we rely on (pre-mortem trust F3, F14, F16, F25), each covered by a canary test: managed hooks can't be disabled by lower scopes; `disableAllHooks` in project settings or `--settings` doesn't stop managed hooks; deny beats ask beats allow across scopes; `allowManagedHooksOnly` (set by an organisation) blocks the plugin, which we detect and name.

## 6. Secrets

| Secret | Lives | Rotation |
|---|---|---|
| Authenticode signing credential | **Not in v0.1** (unsigned, CR-010, founder 2026-10-26). Once bought: CI `production` environment (cloud signer) | Per certificate term |
| Tauri updater private key | Founder's password manager + CI `production` | Only with the key-rotation release (ADR-0013) |
| Config-signing key (Ed25519) | **Offline**, founder's machine + a sealed backup; **never in CI**. The app trusts it for every signed file | Yearly, or on suspicion |
| Canary key (Ed25519) | CI `canary-publish` environment. The app trusts it for `verified-versions.json` only (verified and known-bad CLI lists), never for runtime config | Yearly, or on suspicion |
| Cloudflare API tokens | CI `api-staging` / `api-production` (scoped to one Worker) | 90 days |
| OpenRouter keys, Lemon Squeezy API key | Worker secrets per environment | 90 days; credit limits on the keys |
| Canary CI API key (only if S-1 fails) | `canary-publish`, $2/month cap | 30 days |
| Pro licence token on the PC | `CryptProtectData` (user scope), never in the DB, logs or renderer | 24 h validity |

The app ships **no** secret. `ANTHROPIC_API_KEY` is never read except to detect API mode (presence only), and is stripped from the environment of every `claude` process Eucas starts (canary, cloud hand-off).

## 7. Never read credentials (ADR-0002), enforced

- The core's file access goes through one `fs_guarded` module with a deny-list: `~/.claude/.credentials.json`, `~/.claude/**/*token*`, the Windows Credential Manager entries of Claude Code, `.env*`, `*.pem`, `id_*`, `/fire` routine tokens. A unit test asserts each is refused, and CI greps for any other `std::fs` use in `eucas-core` outside that module (`xtask check-deps`).
- Usage comes only from the status-line JSON and transcript usage fields, never an OAuth endpoint.
- Cloud hand-off and branch-rule checks run through the user's own `claude` and `gh` CLIs; Eucas never sees their tokens.

## 8. Kill switches

| Switch | Who | Effect |
|---|---|---|
| `killSwitches.*` in signed config | Founder (minutes) | Supervisor, cloud hand-off or waitlist off for everyone; the app falls back to rules-only / hidden |
| `updates.<channel>.paused` | Founder | Stops a bad rollout |
| `knownBadCli[]` in `verified-versions.json` (the one home of the known-bad list) | Canary (canary key) or founder (config key) | Every PC on that CLI shows `not_verified` (or red for a fail-open finding) with what to do |
| Guard `failing` → **Off for 15 minutes** | You | The only temporary off; comes back by itself |
| `claude plugin disable eucas@eucas` | You | Removes the plugin hooks at once (unbrick path; printed in the diagnostic and README) |
| Pause the limits (asks Windows) | You (one UAC each way) | Removes our managed hook entry, keeps the deny patterns; the admin-level escape from a limits-guard brick (SYSTEM-DESIGN §7.1) |
| Settings › Remove Eucas | You (one UAC) | Reverses Eucas's keys from `install-manifest.json`; your later edits stay |

## 9. Incident response: "Eucas showed protected, and data was lost"

This is a **kill-criterion event** (pre-mortem §4). Severity S1. The founder is the incident lead.

1. **First hour:** acknowledge publicly where it was reported; ask for the diagnostic report (the user reads it first, then shares); don't speculate about cause.
2. **Contain (≤ 4 h):** if a bypass is plausible, sign and publish a `verified-versions.json` that adds the affected CLI versions to `knownBadCli[]` (every PC on them turns amber/red with a plain sentence) and, if the supervisor or cloud path is involved, flip its kill switch.
3. **Reproduce (≤ 24 h):** on a clean VM with the reported CLI, shell and Eucas versions; determine which layer failed: hook didn't fire, guard decided wrong, limit catalogue gap, program-level gap (T3), tripwire missed, or UI showed green wrongly.
4. **Help the user recover:** the TripwireCard's recovery routes (git, File History, OneDrive), plus Windows Previous Versions and the user's backups; never promise recovery.
5. **Fix:** a failing test first (bypass suite or contract), then the fix, hotfix branch from `main` (CONTRIBUTING.md), beta then stable; un-mark `known-bad` only after the nightly passes.
6. **Disclose (≤ 72 h):** a GitHub Security Advisory and a public post-mortem: timeline, the layer that failed, what the UI said, what changed, and whether the promise or the gap line needed new words. Update the gap list in the app by config if the wording must change before a release.
7. **Decide:** the founder decides whether the product continues (kill criterion), with the post-mortem as input.

Lower severities: S2 a bypass found by us or reported privately (same steps, no user loss, coordinated disclosure via SECURITY.md); S3 a false block or a fail-closed brick (support playbook, OPERATIONS §4).
