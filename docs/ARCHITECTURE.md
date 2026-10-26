# Architecture — Eucas

**Status:** Draft v0.2 (Sprint 0). Product model: [PRODUCT-MODEL.md](PRODUCT-MODEL.md). Decisions: [`docs/adr/`](adr/). Evidence: [`docs/research/`](research/).

> **Companion first (26 Oct 2026).** The first thing we ship is the Eucas **companion**, which attaches to the Claude Code sessions you already run. Its architecture is separate and lives in [`architecture/companion/`](architecture/companion/SYSTEM-DESIGN.md) (proposed ADR-0007 … ADR-0015: a user-scope plugin + native guard + admin-level limits, on **Tauri 2 + Rust**, amending ADR-0001 for the companion only). This file still describes the Agent SDK team app, which follows later.

---

## 1. Stack (ADR-0001)

| Layer | Choice | Why |
|---|---|---|
| Desktop shell | **Electron** + electron-vite | Cross-platform (Windows → macOS → Linux) from one codebase; the Agent SDK runs natively in the main process |
| UI | React 19 + TypeScript + Tailwind + shadcn/ui | |
| Agent runtime | **`@anthropic-ai/claude-agent-sdk`** | Spawns the official Claude Code binary. Gives us model per agent, tools, MCP, skills, plugins, hooks, compaction, sessions and usage reporting. Subscription-compatible (ADR-0002) |
| Local DB | SQLite + Drizzle | Messages, runs, token ledger, task board, archival memory (+ vector index later) |
| Agent & memory storage | Plain files in the Eucas home folder | Glass box: readable, diffable, git-versionable |
| IPC | Typed IPC with zod schemas | Renderer never touches the SDK or secrets |
| Secrets | Electron `safeStorage` (OS keychain) | Only for an optional API key and connector tokens Eucas itself owns. Never Claude OAuth tokens |
| Tests / CI | Vitest, Playwright-Electron, GitHub Actions matrix win/mac/linux | |
| Packaging | electron-builder: NSIS / DMG / AppImage | |

## 2. System view

```
┌─────────────────────────────── Renderer (React) ─────────────────────────────────┐
│ Main agent chat │ Agent chats │ Groups │ Agent editor │ Memory │ Trace │ Usage meter │
└──────────────────────────────────▲───────────────────────────────────────────────┘
                                   │ typed IPC
┌──────────────────────────────────┴──── Main process ─────────────────────────────┐
│ Orchestrator                                                                      │
│  ├─ Router: rules first (@mention, task owner, subscriptions) → Haiku on cards    │
│  ├─ Agent Runner ×N: one SDK query() per turn, with per-agent options (§4)        │
│  ├─ Handoff + Task board (states, deps, verifier)                                 │
│  ├─ Approval gate (canUseTool) · Budgets · Token ledger (/usage, modelUsage)      │
│  ├─ Background curator (Haiku): thread digests, memory extraction, dedupe         │
│  └─ Scheduler: routines                                                           │
│ Inventory service: reads the user's Claude Code MCP servers, plugins, skills      │
│ Eucas MCP server (in-process, createSdkMcpServer):                                │
│   handoff · ask_agent · post_to_group · task_* · memory_global_* · memory_private_*│
└───────────────────────────────────────────────────────────────────────────────────┘
                      │ spawns the official Claude Code binary (user's own `claude login`)
```

## 3. Data on disk

```
<eucas-home>/
  main-agent/agent.md            # the one main agent (name, model, instructions)
  agents/<slug>/
     agent.md                    # frontmatter: name, description, model, connectors, skills, plugins, permissions, budget
     knowledge/                  # files attached to this agent only (like Project knowledge)
     memory/MEMORY.md + *.md     # PRIVATE memory: one fact per file + index
  memory/global/MEMORY.md + *.md # GLOBAL memory: every agent reads the index
  groups/<slug>.yaml             # members, settings
  eucas.sqlite                   # messages, runs, tasks, ledger, digests, archival index
```

## 4. How each agent is run (SDK options per turn)

| Option | Value | Effect |
|---|---|---|
| `model` | the agent's model | Haiku / Sonnet / Opus per agent |
| `systemPrompt` | role + private core memory + **global memory index** | Stable prefix → prompt cache hits |
| `mcpServers` + `strictMcpConfig: true` | the agent's selected connectors + `eucas` | Only selected tool definitions load. Without strict mode, claude.ai connectors leak in |
| `tools` / `disallowedTools` | the agent's tool set | Real restriction (`allowedTools` only auto-approves) |
| `skills`, `plugins` | the agent's selections from the inventory | Per-agent skills and plugins |
| `settingSources: []` | — | Isolates agents from the global Claude Code config, so we control exactly what loads |
| `cwd` | `agents/<slug>/` | Agent works inside its own folder by default |
| `env` | `process.env` minus `ANTHROPIC_API_KEY` (unless API mode), `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | Subscription stays in use; Eucas owns memory |
| `resume` | the agent's session id per thread | Continuity; the SDK auto-compacts and we log `compact_boundary` |
| `canUseTool`, hooks | approval gate + trace events | Human in the loop + full visibility |

## 5. Group chat without a token explosion
(Evidence: [research/multi-agent-efficiency.md](research/multi-agent-efficiency.md))
1. **Rules first:** an @mention, the agent that owns the task, or a topic subscription decides who replies. Only if nothing matches does the **Haiku router** pick, using **agent cards + thread digest** only.
2. **Default: one responder.** Max k per message, max hops per request.
3. Each responder gets: its own prefix (cached) + **thread digest** + messages addressed to it (verbatim) + the task card. **Never** other agents' raw tool outputs. Long outputs pass as file or artifact references.
4. The **curator** (Haiku, in the background) updates digests when a thread goes idle.
5. Answers are forwarded **verbatim**, not re-paraphrased by a supervisor.
6. Every bubble shows its cost; every group shows its running total.

## 6. Handoffs
`handoff(to, task, context_summary, artifact_refs, acceptance_criteria)` creates a task on the board. The receiver runs with **the payload + its own memory**, not the sender's transcript. The result comes back verbatim. Optional verifier step. Org rules: max delegation depth (default 3), and you can disable agent→agent handoffs per agent.

## 7. Memory
- **Private:** small core notes always in context; the rest fetched on demand. Written via `memory_private_*` tools.
- **Global:** the index is always in context; full entries fetched on demand. Agents *propose* global writes; the main agent or you approve (configurable). Append-style to avoid last-writer-wins clobbering.
- **Group digest:** per group, maintained by the curator.
- **Curator jobs:** after each task, extract facts (Mem0-style add/update/delete). Weekly dedupe, shown to you as a diff.

## 8. Security
Renderer sandboxed (`contextIsolation`, no `nodeIntegration`, strict CSP). Tools that act outside the app (send, post, delete, pay) always need approval. Content from email, web or files is untrusted data. Eucas never handles Claude credentials (ADR-0002). No telemetry leaves the machine.

## 9. Repo layout

```
apps/desktop/            Electron (main, preload, renderer); main/platform/ = OS adapters
packages/core/           Orchestrator, router, runner, memory, ledger (pure TS)
packages/eucas-mcp/      In-process MCP server
packages/shared/         Types, zod schemas, IPC contracts
config/                  models.yaml defaults
templates/               OPTIONAL agent templates (never pre-installed)
docs/
```
