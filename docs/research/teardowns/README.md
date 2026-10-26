# Competitor Teardowns

Method: the `competitor-teardown` skill (REA evidence discipline, public evidence only; see the skill for the legal boundary). Each claim is typed as an Observation, an Inference or an Unknown, with its source and date.

| Product | File | Date | Findings | Headline |
|---|---|---|---|---|
| Grok Bot (xAI / Cursor) | [grok-bot.md](grok-bot.md) | 2026-10-22 | 61 (11 questions answered, 4 partly) | Cost blow-ups come from unbounded per-bot threads (200–250k input tokens per reply). Shared memory exists but can't be seen. All bots share one VM |
| OpenAI Dots | [openai-dots.md](openai-dots.md) | 2026-10-22 | 30 | One "primary dot" per user, each on a sandboxed cloud computer. Non-human character avatars. 4-level approval ladder + reviewer model. Memory can't be edited ("delete the dot") |
| Claude Code (Anthropic) | [claude-code.md](claude-code.md) | 2026-10-22 | 67 | Agent teams don't work through the Agent SDK. Checkpoints skip Bash edits. No shell sandbox on native Windows. About 6 releases a week; risk: `--bare` may become the default for headless runs |

**Pre-mortem of our own Eucas companion (2026-10-26):** same evidence discipline, applied to our planned product ("6 months after launch it failed; why?").

| Lens | File | Date | Findings | Headline |
|---|---|---|---|---|
| Market, pricing, distribution | [eucas-premortem-market.md](eucas-premortem-market.md) | 2026-10-26 | 40 | $2k/month needs 8–24k active users at 1–3% conversion; ccusage (19.2k stars) earns about $104/month |
| Dependency on Anthropic | [eucas-premortem-platform.md](eucas-premortem-platform.md) | 2026-10-26 | ~38 | Hooks around the official CLI are safe; Pro is near-fatal: absorbed, and more exposed under the terms |
| Trust, safety, security | [eucas-premortem-trust.md](eucas-premortem-trust.md) | 2026-10-26 | 52 | "Never delete" isn't honestly makeable; a guard that fails closed and tells you when it's off is |
| First run and solo building | [eucas-premortem-execution.md](eucas-premortem-execution.md) | 2026-10-26 | ~53 | Empty first screen; replace it with a 7-day retro of past sessions; a credible solo v0.1 is 12–15 days without the notch |

The merged verdict and kill criteria are in [../strategy-2026-10-26-premortem.md](../strategy-2026-10-26-premortem.md).

**Corrections to the earlier [competitive brief](../competitive-brief.md):**
- Grok Bot is on macOS, Windows, Linux, iPad and Android.
- Grok Bot has a "Main Bot" role and a shared user memory.
- Grok Bot uses mixed models (Claude, Grok, Gemini) without user choice.

The combined strategy is in [../strategy-2026-10-22.md](../strategy-2026-10-22.md).
