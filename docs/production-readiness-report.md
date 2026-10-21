# Production Readiness Report — Bench

**Overall status: `not ready`.** No application code exists yet (Sprint 0). This report sets each layer's applicability and the sprint where its evidence will be produced. Update it every release.
**Last run:** 2026-10-21 on branch `chore/engineering-standards`.

## Layer status

| Layer | Applies? | Plan / evidence | Sprint |
|---|---|---|---|
| 0 Inventory & threat model | ✅ | Done: [security-baseline.md §1](security-baseline.md). Stack in [ARCHITECTURE.md](ARCHITECTURE.md) | S0 ✅ |
| 1 Database architecture | ✅ (local SQLite) | Drizzle schema + **migrations** from day one; FKs, indexes on (conversation_id, created_at), (agent_id, created_at), (task status); bounded pagination | S1 |
| 2 Dependency security | ✅ | Lock file, `pnpm audit` in CI, Dependabot (npm + actions) | S0 config ✅ / S1 enforced |
| 3 Authz & ownership | ✅, adapted | No user accounts; the boundary is **agent isolation** (private memory, knowledge, connectors). Cross-agent access tests required | S2 |
| 4 Row-level security / multi-tenancy | ❌ N/A | Single user, local DB. Agent scoping is enforced in Bench MCP + repository functions (Layer 3) | — |
| 5 Secrets | ✅ | `safeStorage` only; never Claude OAuth; gitleaks in CI; packaged-app scan for secrets before release | S0 CI ✅ / S7 |
| 6 Privacy & data rights | ✅ (light) | Local-first: document what leaves the device (prompts to Anthropic via Claude Code; connector calls). "Delete agent" deletes its memory and knowledge; "export" = copy the folder | S2 / S7 |
| 7 Environments | ✅, adapted | dev (electron-vite) → PR CI builds → pre-release (GitHub prerelease channel) → stable. Separate Bench home for dev (`BENCH_HOME`) so dev never touches real data | S1 |
| 8 CI/CD & review gates | ✅ | Branch per change, PR template, required checks on `main`, squash-merge. CI: lint, typecheck, test, build on Windows + Ubuntu per PR and macOS on `main`, audit, gitleaks | S0 ✅ partial / S1 full |
| 9 Platform limits / background jobs | ✅, adapted | Subscription usage window, SDK `maxTurns`/`maxBudgetUsd`, routines as a durable local queue (survive restart, idempotent) | S4 / S6 |
| 10 Caching & rate limiting | ✅, adapted | Prompt caching (stable prefixes, cache-hit metrics); local concurrency cap on parallel agents | S3 / S4 |
| 11 Scaling & external limits | ✅, adapted | Backoff and retries on rate limits; budgets per agent; Gmail/GitHub API limits; graceful "usage exhausted" UI | S4 / S6 |
| 12 Monitoring & security testing | ✅, adapted | Local structured logs with redaction; trace panel; Electron security checklist (electronegativity or manual) before release | S1 / S7 |
| 13 Backups & recovery | ✅ | Bench home is plain files + SQLite: documented backup (copy folder / git); restore test before v0.1; SQLite WAL + integrity check on start | S7 |
| Payments | ❌ N/A | No monetization | — |
| Feature flags / canary | ✅ (light) | Local settings flags for risky features (autonomous routines, auto-approve); prerelease channel = canary | S4 / S7 |
| Mobile / local-first addendum | ✅ | Code signing (Windows; Apple later), no secrets in the bundle, debug vs release config, redacted notifications | S7 |

## Commands run (this branch)
- `git grep -nIiE "api_key|secret|token|password|PRIVATE_KEY|sk-ant"`: only placeholders in `.env.example` and docs. **No secrets.**
- CI gitleaks workflow: see the PR checks.

## Remaining risks
| Risk | Severity | Owner | Next action |
|---|---|---|---|
| Anthropic changes subscription enforcement | High | Founder | Re-check the legal page each release; API mode as fallback |
| Prompt injection via email/web connectors | High | Claude (eng) | Approval gate + tests in S6 |
| Cross-agent data leaks | Medium | Claude (eng) | Isolation tests in S2 |
| Branch protection unavailable on private repo (GitHub Free) | Low | Founder | Workflow discipline + CI; enable protection if the plan allows |
