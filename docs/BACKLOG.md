# Product Backlog — Bench

> **Provisional.** Written before requirements gathering. It will be rebuilt from the approved BRD, PRD and SRS in Phase 6 ([LIFECYCLE](process/LIFECYCLE.md)). The Sprint 0 spikes still count as Phase 0 feasibility validation.

Format: `ID · Story · Acceptance criteria (short) · Size`. Ordered by priority, top = next. Product model: [PRODUCT-MODEL.md](PRODUCT-MODEL.md).

## Sprint 0: Inception

- ✅ **S0-4** ADR-0002 accepted for personal use (research: [anthropic-repos-and-auth](research/anthropic-repos-and-auth.md)). ADR-0001 awaiting founder confirmation.
- ✅ **S0-5** Competitor teardown: [competitive-brief](research/competitive-brief.md)
- ✅ **S0-6** Multi-agent efficiency research: [multi-agent-efficiency](research/multi-agent-efficiency.md)
- ✅ Private GitHub repo: github.com/Majd-Alhakim/bench
- ✅ **S0-1 · Spike: SDK on subscription, per-agent isolation** (M): GO, [report](spikes/S0-1.md). Also done: ✅ **SP-B1** browser agent ([report](spikes/SP-B1.md)) and ✅ **M8** shell containment ([report](spikes/M8.md))
  - AC: a script runs `query()` with no API key, inheriting `claude login`, once with Haiku and once with Opus.
  - AC: with `strictMcpConfig` + `settingSources: []`, the agent sees ONLY the MCP servers and skills we pass (shown via its init message).
  - AC: 3 parallel queries; record `/usage` rate-limit percent and `modelUsage`.
  - Output: `docs/spikes/S0-1.md`.
- **S0-2 · Spike: group-chat economics** (M)
  - AC: 4 agents × 20 turns, naive broadcast vs rules + router + digest. Token table in `docs/spikes/S0-2.md`.
- **S0-3 · Spike: in-process Bench MCP** (M)
  - AC: agent A calls `handoff` / `ask_agent`, and agent B answers in its own session with its own memory. `memory_global_read` works from both.

## Sprint 1: Walking skeleton (main agent only)

- **S1-1** Scaffold per ADR-0003: pnpm workspace, strict tsconfig.base, ESLint 9 + Prettier, Vitest, lefthook, changesets, `scripts/*`, `.claude/settings.json` format hook, electron-vite + React + Tailwind + shadcn, CI (PRs: windows + ubuntu; macOS on main + on PRs touching packaging), `main/platform/`; add npm to Dependabot
- **S1-2** Onboarding: detect Claude Code and login status; strip `ANTHROPIC_API_KEY`; choose the Bench home folder
- **S1-3** Main agent from `main-agent/agent.md`; Agent Runner wraps `query()`; stream to UI
- **S1-4** Chat UI (streaming, markdown, stop)
- **S1-5** Trace panel + per-message tokens/cost + plan-usage meter
- **S1-6** SQLite persistence; session resume

## Sprint 2: Agents you create

- Agent editor (name, avatar, description, role, model, knowledge files); main agent can draft an agent from chat
- **Inventory service:** list the user's MCP servers, plugins and skills; per-agent picker → SDK options
- Private memory + global memory (Bench MCP tools); memory viewer/editor
- Duplicate an agent (without memory)

## Later (groomed per sprint)
**E3** Groups & router · **E4** Handoffs & task board · **E5** Approvals, budgets, ledger · **E6** Curator (digests, extraction, dedupe) · **E7** Routines + Gmail/GitHub · **E8** Packaging, security, open-source at v0.1
