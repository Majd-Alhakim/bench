# Competitor Teardowns

Method: the `competitor-teardown` skill (REA evidence discipline, public evidence only; see the skill for the legal boundary). Each claim is typed as an Observation, an Inference or an Unknown, with its source and date.

| Product | File | Date | Findings | Headline |
|---|---|---|---|---|
| Grok Bot (xAI / Cursor) | [grok-bot.md](grok-bot.md) | 2026-10-22 | 61 (11 questions answered, 4 partly) | Cost blow-ups come from unbounded per-bot threads (200–250k input tokens per reply). Shared memory exists but can't be seen. All bots share one VM |
| OpenAI Dots | [openai-dots.md](openai-dots.md) | 2026-10-22 | 30 | One "primary dot" per user, each on a sandboxed cloud computer. Non-human character avatars. 4-level approval ladder + reviewer model. Memory can't be edited ("delete the dot") |
| Claude Code (Anthropic) | [claude-code.md](claude-code.md) | 2026-10-22 | 67 | Agent teams don't work through the Agent SDK. Checkpoints skip Bash edits. No shell sandbox on native Windows. About 6 releases a week; risk: `--bare` may become the default for headless runs |

**Corrections to the earlier [competitive brief](../competitive-brief.md):**
- Grok Bot is on macOS, Windows, Linux, iPad and Android.
- Grok Bot has a "Main Bot" role and a shared user memory.
- Grok Bot uses mixed models (Claude, Grok, Gemini) without user choice.

The combined strategy is in [../strategy-2026-10-22.md](../strategy-2026-10-22.md).
