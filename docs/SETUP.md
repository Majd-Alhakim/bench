# Setup, Prerequisites & Connectors

## Already on this machine (checked 2026-10-21)
| Tool | Version | Status |
|---|---|---|
| Node.js | 26.7.0 | ✅ |
| npm | 12.2.0 | ✅ |
| Git | 2.53.0 | ✅ |
| Claude Code CLI | 2.1.303 | ✅ (provides subscription auth for ADR-0002) |
| Rust | — | Not needed (ADR-0001 chose Electron) |

## What the founder needs to provide
| # | Item | Needed by | Why |
|---|---|---|---|
| 1 | Logged-in Claude Code (`claude` → `/login`) with the subscription plan you want to use | S0 | Subscription backend |
| 2 | *(Optional fallback)* An **Anthropic API key** from console.anthropic.com, with a spend limit set | S0 | API backend, and the fallback if subscription use isn't allowed |
| 3 | A **GitHub repo** (private to start) and permission for me to push | S1 | CI, issues, releases |
| 4 | Visual Studio Build Tools (C++ workload) | S1 | Compiling `better-sqlite3` / `keytar` native modules on Windows |
| 5 | Decisions in the "Open questions" list in `CLAUDE.md` | S0 | |

## Connectors (MCP) by sprint
| Connector | For which agent | Sprint | Notes |
|---|---|---|---|
| **Bench MCP** (ours, in-process) | All | S2 | handoff, ask_agent, post_to_group, remember, recall |
| Filesystem (scoped to the workspace) | Developers, writers | S1 | Built into the SDK tools |
| GitHub | CTO, developers | S6 | Official GitHub MCP server, PAT in Credential Manager |
| Gmail / Outlook | Chief of Staff (Haiku) | S6 | Read-only first; sending always needs approval |
| Google / Outlook Calendar | Chief of Staff | S6 | |
| Web search / fetch | Researchers, CMO | S6 | |
| Notion / Slack | Optional | Later | |

## Environment variables
See [`.env.example`](../.env.example). Secrets never go in `.env` in production; they go in Windows Credential Manager.
