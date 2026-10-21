# Product Backlog — Bench

Format: `ID · Story · Acceptance criteria (short) · Size (S/M/L)`. Ordered by priority, top = next.

## Sprint 0: Inception (spikes, time-boxed)

- **S0-1 · Spike: subscription auth via the Agent SDK** (L, 1 day)
  - AC: a Node script runs `query()` with `model: claude-haiku-5-5`, then `claude-opus-5-5`, using the local Claude Code login (no API key). Records rate-limit behavior with 3 parallel queries. Written verdict in `docs/spikes/S0-1.md`, including the terms check.
- **S0-2 · Spike: group-chat token economics** (M)
  - AC: script simulates 4 agents × 20 turns, naive vs. router + summary. Table of tokens in `docs/spikes/S0-2.md`.
- **S0-3 · Spike: in-process MCP handoff** (M)
  - AC: agent A calls the `ask_agent` tool, and agent B answers in its own session. Works end to end in a script.
- **S0-4 · Founder sign-off on ADR-0001 / ADR-0002** (S)
- **S0-5 · Competitor teardown** (M): hands-on notes on the agent-team bots the founder tested (what feels good, what breaks, what it costs). Output: `docs/research/competitors.md`.

## Sprint 1: Walking skeleton

- **S1-1** Scaffold monorepo (electron-vite + React + TS + Tailwind + shadcn, Vitest, ESLint/Prettier, CI on GitHub Actions)
- **S1-2** Agent definition loader: parse `workspace/agents/*.md` (frontmatter + prompt), validate with zod, hot-reload
- **S1-3** Agent Runner: wraps the SDK `query()`, streams events to the renderer over IPC
- **S1-4** Chat UI for one agent (streaming, markdown, stop button)
- **S1-5** Trace panel: tool calls, results, timings, tokens per turn
- **S1-6** SQLite persistence of conversations and runs
- **S1-7** Settings: provider (subscription / API key), workspace folder

## Later (groomed per sprint)

Epics: **E2 Team & handoffs** · **E3 Group chat & router** · **E4 Approvals, budgets, ledger** · **E5 Memory curator & compaction** · **E6 Connectors & scheduler** · **E7 Packaging & security**
