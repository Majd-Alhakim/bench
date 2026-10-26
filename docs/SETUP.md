# Setup, Prerequisites & Connectors

## Already on this machine (checked 2026-10-21)
| Tool | Version | Status |
|---|---|---|
| Node.js | 26.7.0 | ✅ |
| npm | 12.2.0 | ✅ |
| Git | 2.53.0 | ✅ |
| Claude Code CLI | 2.1.303 | ✅ (provides subscription auth for ADR-0002) |
| Rust | — | Not needed (ADR-0001 chose Electron) |

Target platforms: **Windows first**, then macOS and Linux (ADR-0001). CI builds on all three from Sprint 1.

## What the founder needs to provide
| # | Item | Needed by | Why |
|---|---|---|---|
| 1 | Logged-in Claude Code (`claude` → `/login`) with the subscription plan you want to use | S0 | Subscription backend |
| 2 | *(Optional fallback)* An **Anthropic API key** from console.anthropic.com, with a spend limit set | S0 | API backend, and the fallback if subscription use isn't allowed |
| 3 | A **private GitHub repo** and permission for me to push | S1 | CI matrix (Win/macOS/Linux), issues, releases |
| 4 | Visual Studio Build Tools (C++ workload) | S1 | Compiling the `better-sqlite3` native module on Windows. Not needed if we can use `node:sqlite` |
| 5 | *(Later, for macOS release)* Apple Developer account ($99/yr) | S7+ | Signing and notarizing the `.dmg` |
| 6 | Decisions in the "Open questions" list in `CLAUDE.md` | S0 | |

## Connectors (MCP) by sprint
| Connector | For which agent | Sprint | Notes |
|---|---|---|---|
| **Eucas MCP** (ours, in-process) | All | S2 | handoff, ask_agent, post_to_group, remember, recall |
| Filesystem (scoped to the workspace) | Developers, writers | S1 | Built into the SDK tools |
| **GitHub** ⭐ first | CTO, developers | S6 | Official GitHub MCP server; fine-grained PAT in the OS keychain |
| **Gmail** ⭐ first | Chief of Staff (Haiku) | S6 | Read-only first; drafts next; sending always needs approval. Needs a Google Cloud OAuth client (Desktop app type) |
| Google Calendar | Chief of Staff | Later | Same OAuth client as Gmail |
| Outlook / M365 | Chief of Staff | Later | Only if needed |
| Web search / fetch | Researchers, CMO | S6 | |
| Notion / Slack | Optional | Later | |

## Environment variables
See [`.env.example`](../.env.example). Secrets never go in `.env` in production; they go in the OS keychain via Electron `safeStorage`.
