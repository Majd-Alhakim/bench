# Product Model — Bench

**Founder correction (2026-10-21):** no predefined company of agents. Bench is **one main agent + agents you create yourself**, each one like a *Claude Project turned into a person*. This document replaces the "starter org" idea.

---

## 1. The objects

### Main agent (exactly one, always present)
- Your front door: chat with it about anything, the way you chat with Claude.
- It knows every agent's **card** (name, description, role, connectors), *not* their full prompts or memories, so it stays cheap.
- It routes work: "ask Designer", "hand this to Sales", and it can **draft a new agent for you** from a conversation ("make me a bot that watches my GitHub issues"). You review and save the draft.
- You choose its name and model. Default: Sonnet; Opus when you want it.

### Agents (as many as you create, none built in)
Each agent is a **Claude Project with a personality and a job**:

| Field | Like in Claude Projects | Notes |
|---|---|---|
| Name, avatar, description | Project name/description | The description is what other agents and the router see |
| Role / instructions | Project instructions | The system prompt. Fully visible and editable |
| Knowledge files | Project knowledge | Files and folders attached to this agent only |
| **Private memory** | Project memory | Only this agent reads or writes it |
| **Model** | — | Haiku / Sonnet / Opus, or an exact model id |
| **Connectors** | — | A subset of your account's connectors (see §3) |
| **Skills / plugins** | — | A subset of your installed skills and plugins |
| Permissions | — | Which tools need your approval |
| Budget | — | Optional daily token cap |

Agents are stored as files (`agents/<name>/agent.md`, `memory/`, `knowledge/`) so you can open, diff and version them. **Templates are optional starting points, never pre-installed.**

### Groups
- Any set of agents (plus you) in one chat. The main agent can join any group as a moderator.
- An agent can be in several groups. Each group has its own rolling summary.

## 2. Memory: two layers (plus group context)

```
GLOBAL MEMORY  (about you, your business, preferences, decisions)
   readable by every agent · writes are proposed, you or the main agent approve
        │
        ├── PRIVATE MEMORY  per agent (its own learnings, working notes)
        │      read/write by that agent only
        │
        └── GROUP CONTEXT   per group (rolling summary, decisions made in that group)
```

- Every agent gets the **global memory index** (short) in its context and pulls full entries only when needed, so memory doesn't bloat every prompt.
- Memory = Markdown files, one fact per file, with an index. You can read and edit all of it in the app or in any editor.
- "Promote to global" button: a private fact an agent learned can become company-wide knowledge.

## 3. Connectors, skills and plugins: global inventory, per-agent selection

- Bench **reads what's already on your account/machine**: the MCP servers, plugins and skills configured in your Claude Code. That's the *inventory*.
- Each agent ticks only the ones it needs. Only those tool definitions load into that agent's context.
- **Why it matters for tokens:** every connected MCP server adds its tool definitions to *every* request. An agent with 2 connectors instead of 20 saves those tokens on every turn, and the model picks tools more accurately.
- Credentials stay where they already live (Claude Code / OS keychain). Bench never copies them.

## 4. How it feels (the Grokbot lessons, plus what Grokbot lacks)

| Keep from the "AI team member" products | Add from the "AI workbench" (Claude Code) |
|---|---|
| Named bots that feel like texting a teammate | See every step: tool calls, files touched, tokens, cost |
| Group chats where bots talk and argue | Files on *your* machine; nothing locked in a vendor cloud |
| Hand off and forget; routines that run alone | Approve risky actions; pause, edit or reroute anything |
| Near-zero friction to create a new bot | Deep context: knowledge files, memory, skills |

Design goal: **as easy as Grokbot to create a bot, as transparent as Claude Code once it's working.**
