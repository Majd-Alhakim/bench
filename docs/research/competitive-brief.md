# Competitive Brief — AI-teammate products vs Bench

**Date:** 2026-10-21 (this category moves monthly, so re-check before decisions). [V] = verified on a primary page; [S] = secondary source; *italics* = our inference.
**Decision this informs:** what Bench must match, where it differentiates, and the MVP scope.

## 1. The landscape (all launched Aug–Sep 2026)

| Product | What it is | Price | Platforms |
|---|---|---|---|
| **Grok Bot** (xAI, built and billed via Cursor) | Named bots on a **shared cloud computer**; DMs, group chats, routines | Bundled in X / SuperGrok / Cursor plans; weekly usage pool metered by "agent steps and tokens", then on-demand [V] | Desktop + iOS [V] |
| **Meta Muse** | One personal agent that spawns subagents; cloud VM; editable memory. A "Shared Agents" tab was spotted but is unreleased [S] | Free / $20 / $100 per month [S] | iOS, Android, web, WhatsApp, Mac [S] |
| **Manus Cue** | Several agents, each with its own email, phone, wallet and computer; group chat around one goal [S] | Invite-only | — |
| **ChatGPT Dots** | One primary "dot" on a cloud computer; teams of dots promised for the future [S] | ChatGPT Pro / Business | — |
| **OpenClaw** (open source) | Self-hosted multi-agent: per-agent persona files, model, tools allowlist, memory, sandbox [V] | Free | Self-hosted |
| **Bench** (us) | Glass-box team on *your* machine via Claude Code: one main agent + agents you create | Your Claude subscription | Win → macOS → Linux |

**Direct competitor:** Grok Bot. **Indirect:** Muse, Cue, Dots. **Closest design cousin:** OpenClaw (borrow its ideas, not its positioning). **Substitute:** plain Claude Code plus manual copy-paste between chats.

## 2. Feature comparison (Grok Bot is the bar)

| Capability | Grok Bot | Muse | OpenClaw | **Bench (target)** |
|---|---|---|---|---|
| Create a named bot (name, description, avatar) | Strong [V] | Weak (unreleased) | Adequate (files) | **Strong**: form + "main agent drafts it for you" |
| Separate role / instructions field | Absent (lives in the description) [V] | — | Strong (SOUL.md) | **Strong** (like Project instructions) |
| **Model per bot** | **Absent**: "Cursor manages model selection" [V] | Absent | Strong [V] | **Strong**: Haiku / Sonnet / Opus per agent |
| Private memory per bot | Adequate, but **not viewable or editable** [V] | Adequate (one user memory) | Strong (files) | **Strong**: Markdown files, editable |
| Global / shared memory | **Absent**: only via chats and shared files [V] | Absent | Weak (shared dir) | **Strong**: global memory all agents read |
| **Connectors per bot** | **Absent**: every permitted connector goes to every bot [V] | — | Strong (tools allow/deny) | **Strong**: pick from account inventory → fewer tokens |
| Group chats | Strong: 2–6 bots, @mention, bots self-select [V] | Absent | Adequate (mention patterns) | **Strong**: rules + Haiku router, one responder by default |
| Agent → agent handoff | Strong (async, text-only) [V] | Subagents | Adequate | **Strong**: structured brief + task board + verifier |
| Routines / triggers | **Strong**: 50 per bot, Slack/GitHub triggers, "teach a task" by screen recording [V] | Scheduled | Adequate | Adequate in MVP (scheduler in S6) |
| Visibility | Adequate: transcript shows tools, watch the computer [V] | Weak | Adequate (logs) | **Strong**: trace, exact prompt each agent saw, per-message cost |
| Approvals | Strong: allow once / always / deny, auto-review [V] | Adequate | Adequate | **Strong**: per agent, per tool |
| Cost transparency | **Weak**: no spend cap; users report surprise bills [V/S] | Token allowances [S] | n/a | **Strong**: per-message cost, budgets, plan-% meter |
| Isolation between bots | **Absent**: "Don't treat separate Bots as a security boundary" [V] | — | Strong (sandbox) | **Strong**: own folder, own tools, own connectors |
| Your files stay on your machine | Absent (their cloud computer) | Absent | Strong | **Strong** |
| Underlying model quality | Weak–Adequate (Grok / mixed) [S] | Adequate | Any | **Strong** (Claude) |
| Low friction to start | **Strong** | Strong | Weak | Must reach **Adequate** at minimum |

## 3. Positioning

- **Grok Bot:** *For people who want to hand off work, Grok Bot is an AI team you text, with bots that share a cloud computer and run routines.* It wins on **friction**: naming a bot and dropping it into a group is zero effort. That's the "group chat effect" the founder's video describes.
- **Bench:** *For people who want an AI team they can trust and afford, Bench is a glass-box agent team on your own machine. Every agent has its own model, memory and connectors, and you can see every step and every token. Unlike Grok Bot, nothing is hidden, nothing is locked in a vendor cloud, and cheap tasks run on cheap models.*
- **Unclaimed positions we take:** (1) model per agent, (2) connectors per agent, (3) editable private + global memory, (4) cost you can see before it surprises you.

## 4. Strengths & weaknesses (honest)

**Grok Bot strengths:** lowest friction; real group-chat effect; routines with event triggers; "teach a task" by screen recording; bots that create bots; a template marketplace.
**Grok Bot weaknesses:** no model choice; memory you can't see or edit; all connectors and credentials shared by every bot on one computer (no isolation); unpredictable spend; weaker model; vendor lock-in.

**Bench weaknesses to guard against:** more setup friction (Claude Code must be installed and logged in); desktop only at first; subscription limits shared with the founder's normal Claude use; policy risk if Anthropic changes enforcement (ADR-0002).

## 5. Opportunities and threats

- **Opportunity:** every complaint about Grok Bot (surprise cost, hidden memory, no isolation) is a Bench principle. Cost transparency alone is a reason to switch.
- **Threat, the nightmare scenario:** *Anthropic ships named persistent agents and group chats inside Claude Desktop or Cowork.* Mitigation: stay the power-user glass box (files on disk, per-agent connectors, router economics, open source at v0.1). Build on official SDK primitives so we can adopt anything Anthropic ships instead of competing with it.
- **Threat:** Muse "Shared Agents" or OpenAI "teams of dots" launch with zero friction and a free tier.

## 6. Strategic implications

1. **Parity (must have in MVP):** create a bot in under 30 seconds (the main agent can draft it); @mention groups; async handoffs; approval cards (once / always / deny).
2. **Differentiate (build first and make it visible):** model per agent, connectors per agent, editable private + global memory, per-message cost and plan meter, full trace.
3. **Defer:** routines with event triggers and "teach a task" (S6+), template marketplace, mobile.
4. **Borrow from OpenClaw:** persona files and per-agent tool allow/deny. **Borrow from Grok Bot:** one owner per stage, `@everyone` used sparingly, approvals kept out of group chats, duplicating a bot without its memory.
5. **Monitor monthly:** Grok Bot changelog (docs.x.ai/grok-bot), Muse Shared Agents, Claude Desktop/Cowork releases, Anthropic's legal page on subscription use.
