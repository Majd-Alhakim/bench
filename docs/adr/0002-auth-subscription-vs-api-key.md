# ADR-0002: Authentication, Claude subscription first, API key fallback

- **Status:** Proposed. **Blocked on Spike S0-1** (verify terms and technical behavior)
- **Date:** 2026-10-21

## Context
The founder wants Bench to be "an extension of my Claude subscription" so usage counts against their plan instead of pay-per-token API billing.

**Known constraint:** Anthropic's Agent SDK docs state that third-party developers may not *offer* claude.ai login or subscription rate limits in their products without approval. Bench is a **personal, local tool** that runs on the founder's own machine through the official Claude Code installation, which is a different situation from a distributed product. We still have to read the current terms ourselves before relying on it.

## Decision (provisional)
- **Provider abstraction** with two backends behind one interface:
  - `subscription`: uses the local, already-logged-in Claude Code install (Agent SDK / `claude` CLI auth). Personal use only.
  - `api`: `ANTHROPIC_API_KEY`, stored in the OS keychain via Electron `safeStorage`.
- The app never handles the claude.ai password or OAuth tokens itself. It relies on Claude Code's own login.
- **If Bench is ever distributed publicly, the `api` backend is the only option** unless Anthropic approves otherwise. The founder answered "personal first, maybe share", so the `api` backend is a first-class path, not an afterthought.

## Consequences
- Usage limits are shared with the founder's normal Claude and Claude Code usage. That makes model tiering and the token ledger *critical* (see ARCHITECTURE §4.3).
- Spike S0-1 must confirm: rate-limit behavior with parallel agents, model selection per call, and the terms.
