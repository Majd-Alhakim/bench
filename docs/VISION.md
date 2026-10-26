# Product Vision — Eucas

> Eucas (formerly codenamed Bench, from the founder's metaphor *Claude Code feels like a workbench*). "Claude" is an Anthropic trademark, so the product can't be called "Claude Bot" or "Claude Code".

**Status:** Sprint 0 (Inception) · **Owner:** Founder (human in the loop) · **PM/CTO:** Claude · **Last updated:** 2026-10-21

---

## 1. One-liner

A native desktop app (Windows first, then macOS and Linux) where you build and run a **team of Claude agents** (your own AI company). Each agent has a role, a model, memory and a chat. They hand work to each other in group chats while you watch, with every message, tool call, token and file visible and editable.

## 2. The problem

| Who | Today | Pain |
|---|---|---|
| Power users of Claude Code who want *delegation*, not just *assistance* | One agent, one session, one context. You are the router between "roles" and you copy-paste context between chats. | You are the bottleneck. Nothing persists between roles. Nobody remembers decisions. |
| Users of multi-agent bots (xAI/Meta-style agent teams) | Nice "team" UX: personas, group chats, handoffs | **A black box.** You can't see what an agent did, why, or what it cost. Weaker models. Group chats **burn tokens** because every agent reads everything. |

**Root cause:** today's multi-agent products optimize for the *feeling* of a team rather than for **control and economics**. Claude Code gets control right (glass box, permissions, files, diffs) but has no persistent *team*.

## 3. Jobs to be done

- **Functional:** "When I have a goal bigger than one conversation, I want to delegate it to specialized agents that coordinate on their own, so the work progresses without me routing every message."
- **Control:** "When agents act for me, I want to see and veto every action, so I trust the output and never get surprised."
- **Economic:** "When I run many agents, I want each to use the cheapest model that can do its job, so my subscription limits last."
- **Emotional:** "I want to feel like the founder of a company I'm building, not a user watching a chatbot."

## 4. Positioning: "Glass-box agent company"

| | Agent-team bots (Grok/Meta style) | Claude Code | **Eucas** |
|---|---|---|---|
| Persistent team of personas | ✅ | ❌ | ✅ |
| Group chat + agent→agent handoffs | ✅ | Partial (subagents) | ✅ |
| Full visibility (tools, files, tokens, prompts) | ❌ | ✅ | ✅ **plus** a per-agent cost meter |
| Human approval gates | ❌ / weak | ✅ | ✅ per agent, per tool |
| Model per agent (cost tiering) | ❌ | Partial | ✅ first-class |
| Editable memory you can read | ❌ | ✅ (files) | ✅ plain Markdown per agent |
| Runs locally on your machine | ❌ | ✅ | ✅ |

**Our wedge:** *visibility + model tiering + persistent memory.* We are not competing on "more agents". We compete on **trust and cost per outcome**.

## 5. Product principles (tie-breakers)

1. **Glass box over magic.** If an agent did it, you can see it, replay it and edit it. No hidden prompts.
2. **Files are the source of truth.** Agents, memories and org charts are Markdown/YAML on disk. You can version them with git and edit them in VS Code.
3. **Cheapest capable model.** Every agent has a model, and routing/summarizing always runs on the cheap tier.
4. **Human in the loop by default, autonomy by opt-in.** Risky tools need approval until you grant standing permission.
5. **Ship thin, iterate fast.** Every sprint ends with something the founder actually uses.

## 6. Assumptions to test (riskiest first)

| # | Assumption | Confidence | Kills the idea if wrong? | Cheapest test |
|---|---|---|---|---|
| A1 | We can drive agents through the founder's **Claude subscription** (via the official Claude Code / Agent SDK auth) for **personal, local use**, with no API key needed | Medium | Partially: it falls back to an API key, which changes the economics | **Sprint 0 spike:** Agent SDK `query()` using the local Claude Code login. Read the current Anthropic terms on subscription use in third-party apps |
| A2 | Group chat can be made token-efficient enough to run daily (routing + shared summaries + prompt caching) | Medium | Yes, for the "company" UX | Spike: 4 agents, 20-turn group chat, measure tokens with and without the router |
| A3 | Haiku-tier models are good enough for routing, summaries and reminders | High | No | Eval set of 30 routing decisions |
| A4 | A visible "who's working on what" view is what makes it feel like a team (not just chat bubbles) | Medium | No | Paper prototype, then founder dogfooding |
| A5 | Per-agent Markdown memory stays useful after weeks (no rot or bloat) | Low–Med | No, but it degrades value | Memory compaction job + a weekly "memory review" |

## 7. Success metrics (MVP)

- **North star:** tasks completed by the agent team per week that the founder accepts without redoing.
- **Guardrails:** tokens per accepted task (trend down); weekly subscription-limit headroom (≥ 30%); zero unapproved destructive actions.
- **Dogfood bar:** the founder uses Eucas daily for 2 weeks instead of plain chats.

## 8. Explicitly out of scope (for now)

- Multi-user / team accounts, cloud sync, mobile app
- A marketplace of agents
- Non-Anthropic models (maybe later, through the same provider abstraction)
- Voice
