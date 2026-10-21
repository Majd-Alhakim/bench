# CLAUDE.md: Project Memory for "Bench" (codename)

Claude reads this file at the start of every session in this folder. Keep it short and current. Details live in `docs/`.

## What we're building
A native Windows desktop app: a **glass-box team of Claude agents**. Each agent has a role, its own model, memory and chat. Agents hand off work to each other, and group chats have router-based turn-taking. The founder sees and controls everything (traces, prompts, tokens, approvals).
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

## Open questions for the founder
1. Personal tool only, or a product to share/sell later? (Changes auth, naming and licensing.)
2. Sign off on Electron (ADR-0001)?
3. First "company" to dogfood: which 4 chiefs, and which real goal do they work on in week 2?
4. Which connectors first: Gmail, Calendar, GitHub?
5. Open source from day one, or private repo first?

## Conventions
- TypeScript strict. Business logic in `packages/core` (no Electron imports there).
- Agents/memory/org = files in `workspace/` (Markdown + YAML frontmatter). DB = SQLite for messages/runs/tokens only.
- Every feature ships with: Vitest tests for core logic, and a trace event so it's visible in the UI.
- Conventional Commits. Small PRs. Update BACKLOG.md status when a story is done.
- Security: renderer sandboxed, secrets only in Windows Credential Manager, tools that act outside the app always need approval.

## Definition of Done
Code merged · tests pass · visible in trace · docs/backlog updated · founder demoed it.
