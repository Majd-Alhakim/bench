# Architecture — Bench

**Status:** Draft v0.1 (Sprint 0). Decisions are recorded as ADRs in [`docs/adr/`](adr/).

---

## 1. Stack (proposed, see ADR-0001)

| Layer | Choice | Why |
|---|---|---|
| Desktop shell | **Electron** (latest stable) + electron-vite | Cross-platform (Windows → macOS → Linux) from one codebase. The Claude Agent SDK is TypeScript/Node-native, so it runs in Electron's main process with no sidecar |
| UI | React 19 + TypeScript + Tailwind + shadcn/ui | Fast to build, accessible primitives |
| Agent runtime | **`@anthropic-ai/claude-agent-sdk`** | The same engine as Claude Code: tools, MCP, permissions, hooks, compaction, sessions, subagents. We don't reinvent the agent loop |
| Local DB | SQLite (`better-sqlite3`) + Drizzle ORM | Messages, runs, token ledger, search. Single file, zero ops |
| Agent/memory storage | Plain files under the workspace (`.md` + YAML frontmatter) | Glass box: readable, diffable, git-versionable |
| IPC | Typed IPC (main ↔ renderer) with zod schemas | Security boundary; renderer never touches the SDK or secrets |
| Secrets | Electron `safeStorage` → DPAPI (Win) / Keychain (macOS) / libsecret (Linux) | Never store keys in plain files |
| Tests | Vitest (unit), Playwright for Electron (e2e), CI matrix on Win/macOS/Linux | |
| Packaging | electron-builder → NSIS (Win), DMG (macOS), AppImage/deb (Linux); GitHub Releases auto-update | |
| Package manager | npm (already installed); pnpm optional | |

## 2. System view

```
┌──────────────────────────── Renderer (React) ────────────────────────────┐
│  Org chart │ Agent chat │ Group chat │ Activity/Trace │ Memory editor │ $ │
└───────────────────────────────▲──────────────────────────────────────────┘
                                │ typed IPC (zod)
┌───────────────────────────────┴──── Main process (Node) ─────────────────┐
│  Orchestrator ─────────────┬─ Router (Haiku): who should speak/act next   │
│   • message bus            ├─ Agent Runner ×N  (Agent SDK query())        │
│   • handoff queue          │     model / tools / MCP / permissions        │
│   • approval gate (HITL)   ├─ Memory Service (per-agent .md + compaction) │
│   • token ledger           ├─ Summarizer (Haiku): rolling group summaries │
│                            └─ Scheduler (reminders, recurring jobs)       │
│  Bench MCP server (in-process): ask_agent, handoff, post_to_group,        │
│                                  remember, recall, create_task            │
│  Storage: SQLite (runs, messages, tokens) + workspace files (agents, mem)│
└──────────────────────────────────────────────────────────────────────────┘
                                │
              Claude Code auth (subscription)  or  ANTHROPIC_API_KEY
```

## 3. Core concepts (domain model)

| Entity | Lives in | Key fields |
|---|---|---|
| **Agent** | `workspace/agents/<id>.md` | name, role, `model`, `reports_to`, tools allowlist, MCP servers, permission mode, system prompt (body), `budget` |
| **Memory** | `workspace/memory/<agent-id>/*.md` + `MEMORY.md` index | One fact per file (same pattern as Claude Code memory). Agents read the index and pull files on demand |
| **Conversation** | SQLite | type: `direct` / `group`, participants, rolling summary |
| **Message** | SQLite | author (user / agent), mentions, handoff ref, tokens in/out, model, cost estimate |
| **Run / Trace** | SQLite | every SDK event: tool call, tool result, permission request, compaction |
| **Task / Handoff** | SQLite | from → to, brief, status (`queued`, `running`, `needs_approval`, `done`, `rejected`), result |
| **Org** | `workspace/org.yaml` | hierarchy, groups, who may talk to whom |

## 4. How the key features work

### 4.1 Agent → agent handoff
Each agent gets the **Bench MCP server**, which exposes:
- `ask_agent(agent, question)`: synchronous consult. The callee answers with its own memory and context and returns text.
- `handoff(agent, task_brief, expected_output)`: async. Creates a Task, and the callee runs it in its own session. The result posts back to the caller and to the thread.
- `post_to_group(group, message)`, `remember(fact)`, `recall(query)`, `create_task(...)`

Org rules (`org.yaml`) limit who can hand off to whom (an employee can't assign work to the CEO), and there is a **max delegation depth** (default 3) to stop loops.

### 4.2 Group chat without a token explosion
Naive version: every agent reads every message, so cost grows with N agents × M messages.
Our version:
1. **Router (Haiku)** reads the new message plus the group summary and picks the 0–2 agents who should respond. @mentions override the router.
2. Responders get **the rolling group summary + the last K messages + messages that mention them**, not the full transcript.
3. **Summarizer (Haiku)** updates the group summary every N messages.
4. **Prompt caching** on stable prefixes (system prompt + memory index).
5. A visible **"cost of this message"** chip on every bubble.

### 4.3 Model tiering (`config/models.yaml`)
| Tier | Default model | Used for |
|---|---|---|
| `fast` | `claude-haiku-5-5` | Router, summarizer, reminders, inbox triage, memory compaction |
| `balanced` | `claude-sonnet-5-5` | Most employees (writers, analysts, developers on routine work) |
| `deep` | `claude-opus-5-5` | Chief officers, architects, hard design or strategy |

Each agent pins a tier or an exact model. Optional **escalation**: an agent can request one higher-tier turn, which goes through an approval gate.

### 4.4 Memory and auto-compact
- **Session level:** use the SDK's built-in compaction, then write the compacted summary as a *session note*.
- **Long-term:** after each task, a Haiku "memory curator" proposes facts to save (`remember`). You can see the proposals, and the agent may auto-accept them if you allow it.
- **Weekly:** a dedupe/merge pass across memory files. You get a diff to approve.

### 4.5 Visibility (the differentiator)
- **Trace panel:** every tool call, input, output, permission prompt and timing, streamed live.
- **Prompt inspector:** the exact system prompt, memory and context an agent saw for any turn.
- **Token ledger:** per agent, per conversation, per day, plus the percentage of the usage window spent.
- **Edit anything:** agent prompts, memories and org are files, and they hot-reload.
- **Intervene:** pause or stop any running agent, rewrite its last message, reroute a handoff.

## 5. Security model
- The renderer is sandboxed (`contextIsolation`, no `nodeIntegration`, strict CSP). Only the main process holds credentials.
- Per-agent tool allowlists. Destructive tools (shell, file write outside the workspace, sending email or messages) need approval by default.
- Agents work in a **workspace directory**. They get file access outside it only through an explicit grant.
- Content from email, web or files is treated as **untrusted data**, with prompt-injection guards on tools that act outside the app (send, post, pay = always human-approved).
- No telemetry leaves the machine.

## 6. Repo layout (target)

Portability rules are in ADR-0001: OS-specific code lives only in `apps/desktop/src/main/platform/`.

```
apps/desktop/            Electron app (main, preload, renderer); main/platform/ = OS adapters
packages/core/           Orchestrator, router, memory, ledger (pure TS, testable)
packages/bench-mcp/      In-process MCP server (handoff, ask_agent, …)
packages/shared/         Types, zod schemas, IPC contracts
config/                  models.yaml, default permissions
workspace-template/      Starter org: agents/, memory/, org.yaml
docs/                    Vision, architecture, ADRs, roadmap, backlog
```
