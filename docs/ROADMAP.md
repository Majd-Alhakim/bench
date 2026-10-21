# Roadmap — Bench

1-week sprints. Each sprint ends with a demo the founder actually uses (dogfooding). Scope is negotiable; dates aren't.

| Sprint | Goal (one sentence) | Demo at the end |
|---|---|---|
| **S0 — Inception** (this week) | Prove the two riskiest assumptions and lock the stack. | Spike report: subscription auth works or doesn't; group-chat token numbers with vs. without the router |
| **S1 — Walking skeleton** | Chat with **one** agent, defined in a `.md` file, inside a Windows app, with a live trace panel. | Edit `agents/assistant.md`, change its model to Haiku, chat, see the tool calls and tokens |
| **S2 — The team** | Several agents with their own memory, plus an org chart; one agent can `ask_agent` / `handoff` to another. | "CEO, get the CTO to draft an architecture note": visible handoff, result posted back |
| **S3 — Group chat** | A group conversation with router-based turn-taking and rolling summaries. | 4 chiefs in one group; @mention; cost-per-message chips |
| **S4 — Control & economics** | Approval gates, a token ledger dashboard, budgets per agent, pause/stop/reroute. | "Developer wants to run `npm install`": approve; usage-window meter |
| **S5 — Memory that lasts** | Memory curator, compaction notes, weekly dedupe with a diff review. | Agent remembers a decision from S2 without being told |
| **S6 — Connectors** | MCP connectors per agent (Gmail, Calendar, GitHub, filesystem) + scheduler for reminders. | Haiku "Chief of Staff" morning brief from email and calendar |
| **S7 — Hardening & installer** | Security review, e2e tests, signed NSIS installer, auto-update. | v0.1.0 installed from GitHub Releases |

**MVP = end of S4.** Everything after that is driven by what dogfooding teaches us.
