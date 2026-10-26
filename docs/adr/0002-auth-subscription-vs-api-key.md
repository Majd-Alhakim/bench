# ADR-0002: Authentication, subscription via the official Claude Code binary; API key optional

- **Status:** Accepted for personal use (2026-10-21), based on research in [docs/research/anthropic-repos-and-auth.md](../research/anthropic-repos-and-auth.md). Spike S0-1 still confirms it works technically.
- **Date:** 2026-10-21

## Context
The founder wants Eucas to run on their Claude subscription. Anthropic's docs (verified 2026-10-21) allow an end user to sign in to the **unmodified Claude Code binary** with their own subscription. The Help Center confirms the Agent SDK and third-party apps can use subscription limits. They forbid third parties from offering claude.ai login, intermediating credentials or tokens, or routing other people's requests through one plan.

## Decision
- Eucas drives agents through `@anthropic-ai/claude-agent-sdk`, which spawns the official Claude Code binary and **inherits the user's own `claude login`**.
- Eucas never shows a claude.ai login, and never reads, stores or forwards OAuth credentials.
- `ANTHROPIC_API_KEY` is stripped from the agent environment unless the user explicitly chooses the API-key backend (stored in the OS keychain).
- If Eucas is shared later, every user signs in with their own account (via `claude login`) or brings an API key. Nobody shares a plan. The product name must not be "Claude Code" or imitate its branding.

## Consequences
- Subscription limits are shared with the founder's normal Claude usage, and they assume "ordinary, individual usage". Routing, per-agent model tiers, budgets and the usage meter (`/usage` rate limits) are core features, not extras.
- Policy risk: Anthropic can change enforcement without notice. Re-check the legal page each release; the API-key backend is the escape hatch.
