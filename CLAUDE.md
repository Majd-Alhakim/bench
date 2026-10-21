# CLAUDE.md: Project Memory for "Bench" (codename)

Claude reads this file at the start of every session in this folder. Keep it short and current. Details live in `docs/`.

## What we're building
A native, cross-platform desktop app (Windows first, then macOS/Linux): a **glass-box team of Claude agents**. Each agent has a role, its own model, memory and chat. Agents hand off work to each other, and group chats have router-based turn-taking. The founder sees and controls everything (traces, prompts, tokens, approvals).
→ [docs/VISION.md](docs/VISION.md) · [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/ROADMAP.md](docs/ROADMAP.md) · [docs/BACKLOG.md](docs/BACKLOG.md)

## Roles
- **Founder (user):** product owner, final decisions, human in the loop.
- **Claude:** acts as PM + CTO. Plans in sprints, writes code, keeps docs and this file current, and asks before irreversible or outward-facing actions.

## Current phase
**Sprint 0: Inception** (started 2026-10-21). Next up: spikes S0-1 (subscription auth), S0-2 (group-chat token economics), S0-3 (MCP handoff).

## Key decisions (see docs/adr/)
- ADR-0001 *(proposed)*: Electron + React/TS + Claude Agent SDK in the main process; SQLite; files as the source of truth.
- ADR-0002 *(proposed, blocked on S0-1)*: subscription backend via the local Claude Code login (personal use) + API-key fallback.
- Model tiers: `fast` = claude-haiku-5-5, `balanced` = claude-sonnet-5-5, `deep` = claude-opus-5-5 (`config/models.yaml`).

## Founder answers (2026-10-21)
- **Audience:** personal first, maybe share later. Keep auth (API-key backend), naming and licensing clean enough to go public.
- **Platforms:** must run on **Windows, macOS and Linux** eventually. Windows is the first target, but no Windows-only dependencies.
- **First connectors:** Gmail + GitHub.
- **Repo:** private first; open-source at v0.1 once the auth/terms questions are settled.

## Open questions for the founder
1. Confirm Electron (ADR-0001), now that it's been re-checked against the cross-platform requirement.
2. First "company" to dogfood: which 4 chiefs, and which real goal do they work on in week 2?

## Conventions
- TypeScript strict. Business logic in `packages/core` (no Electron imports there).
- Agents/memory/org = files in `workspace/` (Markdown + YAML frontmatter). DB = SQLite for messages/runs/tokens only.
- Every feature ships with: Vitest tests for core logic, and a trace event so it's visible in the UI.
- Conventional Commits. Small PRs. Update BACKLOG.md status when a story is done.
- Cross-platform: use `path`/`os` APIs (never hard-coded `\` or `C:\`), no Windows-only native modules, and CI runs on windows/macos/ubuntu.
- Security: renderer sandboxed, secrets only in the OS keychain via Electron `safeStorage`, tools that act outside the app always need approval.

## Definition of Done
Code merged · tests pass · visible in trace · docs/backlog updated · founder demoed it.
