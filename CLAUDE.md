# CLAUDE.md: Project Memory for "Bench" (codename)

Claude reads this file at the start of every session in this folder. Keep it short and current. Details live in `docs/`.

## What we're building
A native, cross-platform desktop app (Windows first, then macOS/Linux): a **glass-box team of Claude agents**. Each agent has a role, its own model, memory and chat. Agents hand off work to each other, and group chats have router-based turn-taking. The founder sees and controls everything (traces, prompts, tokens, approvals).
→ [docs/VISION.md](docs/VISION.md) · [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/ROADMAP.md](docs/ROADMAP.md) · [docs/BACKLOG.md](docs/BACKLOG.md)

## Roles
- **Founder (user):** product owner, final decisions, human in the loop.
- **Claude:** acts as PM + CTO. Plans in sprints, writes code, keeps docs and this file current, and asks before irreversible or outward-facing actions.

## Product model (founder, 2026-10-21): read docs/PRODUCT-MODEL.md
- **One main agent** + agents the founder creates (no predefined agents). Each agent is like a Claude Project: name, description, role, model, knowledge, **private memory**; all agents read **global memory**.
- Connectors, plugins and skills = the founder's global account inventory; **each agent gets only the subset chosen for it** (saves tokens).

## Current phase
**Sprint 0: Inception** (started 2026-10-21). Research done (docs/research/). Repo: https://github.com/Majd-Alhakim/bench (private). Next up: spikes S0-1, S0-2, S0-3.

## Key decisions (see docs/adr/)
- ADR-0001 *(proposed)*: Electron + React/TS + Claude Agent SDK in the main process; SQLite; files as the source of truth.
- ADR-0002 *(accepted, personal use)*: drive the **official unmodified Claude Code binary** via the Agent SDK, inheriting the user's own `claude login`. **Never** build a login, never read or store OAuth tokens, never share a plan, strip `ANTHROPIC_API_KEY` unless in API mode, never call the product "Claude Code".
- Per-agent isolation: `mcpServers` + `strictMcpConfig: true`, `tools`/`disallowedTools` (not `allowedTools`), `settingSources: []`, `skills`, `plugins`.
- Model tiers: `fast` = claude-haiku-5-5, `balanced` = claude-sonnet-5-5, `deep` = claude-opus-5-5 (`config/models.yaml`).

## Founder answers (2026-10-21)
- **Audience:** personal first, maybe share later. Keep auth (API-key backend), naming and licensing clean enough to go public.
- **Platforms:** must run on **Windows, macOS and Linux** eventually. Windows is the first target, but no Windows-only dependencies.
- **First connectors:** Gmail + GitHub.
- **Repo:** private first; open-source at v0.1 once the auth/terms questions are settled.

## Open questions for the founder
1. Confirm Electron (ADR-0001), now that it's been re-checked against the cross-platform requirement.
2. First agents the founder will create for dogfooding, and the real goal they work on in week 2.

## Engineering workflow (founder standing order, 2026-10-21: always follow)
1. **Never commit to `main` directly.** One branch per story/fix: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `spike/…`.
2. **Before opening a PR, self-review the diff for:** bugs, edge cases, dead code, duplication, unclear names, over-abstraction, "slop" (generic filler comments, unused params, copy-paste blocks, TODOs without an issue), and structure. Fix them, then re-run checks. Run `/code-review` or `/simplify` on non-trivial changes.
3. **Tests are part of the change:** Vitest for `packages/core` logic (bug fix = failing test first), Playwright-Electron for critical UI flows. No PR lowers coverage on core.
4. **Local gate = CI gate:** `npm run lint && npm run typecheck && npm test && npm run build`, plus `npm audit --audit-level=high`. CI runs the same on windows/macos/ubuntu, plus a secret scan (gitleaks). Red CI never merges.
5. **PR:** use the template, link the backlog ID, describe how it was tested. Squash-merge with a Conventional Commit title. Delete the branch after merging.
6. **Security per change:** check against [docs/security-baseline.md](docs/security-baseline.md). Never commit secrets; never touch Claude OAuth credentials (ADR-0002).
7. **Release:** follow [docs/deploy-checklist.md](docs/deploy-checklist.md); update [docs/production-readiness-report.md](docs/production-readiness-report.md) each release.
8. Update BACKLOG.md status and this file when a story lands.

## Conventions
- TypeScript strict. Business logic in `packages/core` (no Electron imports there).
- Agents/memory = files in the Bench home folder (Markdown + YAML frontmatter). SQLite only for messages/runs/tasks/ledger.
- Every feature ships with a trace event so it's visible in the UI.
- Cross-platform: use `path`/`os` APIs (never hard-coded `\` or `C:\`), no Windows-only native modules, and CI runs on windows/macos/ubuntu.
- Security: renderer sandboxed, secrets only in the OS keychain via Electron `safeStorage`, tools that act outside the app always need approval.

## Definition of Done
Branch + PR · self-reviewed (no slop) · tests added and passing · CI green on all 3 OSes · secret scan clean · visible in trace · docs/backlog updated · founder demoed it.
