# Research: Anthropic repos we can use + subscription auth rules

**Date:** 2026-10-21. [V] = checked on the primary source this session; [S] = secondary/news; [I] = our inference. **Re-check the legal page before each release:** Anthropic enforces "without prior notice".

## 1. Subscription auth: the verdict

**Allowed (for personal use):** Bench uses `@anthropic-ai/claude-agent-sdk`, which runs the **official, unmodified Claude Code binary**, on the founder's own machine, logged in through Anthropic's own `claude /login` flow. [I, closely grounded in the [V] text below]

Key wording [V]:
- Claude Code legal page (code.claude.com/docs/en/legal-and-compliance): OAuth "is designed to support ordinary use of Claude Code and other native Anthropic applications". Developers "may not collect, store, or intermediate Claude.ai credentials or session tokens". Nothing "prevent[s] an end user from signing in to the unmodified Claude Code binary with their own Claude subscription". Limits "assume ordinary, individual usage".
- Agent SDK overview: third parties may not *offer* claude.ai login or rate limits in their products without approval. Branding: don't call it "Claude Code" or copy its look.
- Help Center (support.claude.com article 15036540, update 2026-10-07): "You can still use the Claude Agent SDK, `claude -p`, and third-party apps with your subscription limits." Max/Team plans include monthly credits covering SDK and `claude -p` usage.

**Hard rules for Bench (non-negotiable):**
1. No login screen of our own. Onboarding says "run `claude login`" (or opens it).
2. Never read, copy or store `~/.claude/.credentials.json` or any OAuth token. The SDK inherits the CLI login.
3. Never call the Anthropic API directly with subscription credentials (this is what got OpenCode blocked, Jan 2026 [S]).
4. Never let other people use the founder's plan through Bench. If Bench is shared, each user logs in with their own account or uses an API key.
5. Strip `ANTHROPIC_API_KEY` from the SDK `env` unless the user opts in. Otherwise it silently overrides the subscription and you get billed per token (Conductor docs warn about this).
6. Don't modify the binary.
7. Watch "ordinary, individual usage": heavy parallel agents are a grey area. Our router and budgets keep usage sane.

**How similar apps do it:** Conductor (subscription or API key, runs Claude Code) [V]; opcode/Claudia (Tauri GUI that shells out to `claude`, **AGPL, so don't copy its code**) [V]; Crystal (MIT, deprecated Feb 2026) [V]. Common pattern: inherit the CLI login and never touch tokens. That's our model too, so your point holds as long as we follow these rules.

## 2. Agent SDK features that map 1:1 to Bench [V]

| Bench need | SDK option |
|---|---|
| Model per agent | `model` (alias or full id) |
| Per-agent connectors only | `mcpServers` + **`strictMcpConfig: true`** (otherwise claude.ai connectors load anyway; or set `ENABLE_CLAUDEAI_MCP_SERVERS=false`) |
| Restrict tools | `tools` + `disallowedTools` (**not** `allowedTools`, which only auto-approves) |
| Use the user's own skills/plugins, selectively | `skills: [...]`, `plugins: [{path}]`, `settingSources: []` to isolate agents from the global config |
| Private memory per agent | per-agent `cwd` with its memory files, and/or a per-agent `CLAUDE_CONFIG_DIR`. Disable auto-memory with `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` and manage memory ourselves |
| Global memory | our own in-process MCP server (`createSdkMcpServer`) shared by all agents |
| Sessions per agent | `resume`, `forkSession`, `listSessions()` |
| Auto-compact | built-in; `compact_boundary` message + `PreCompact`/`PostCompact` hooks to save notes |
| Approvals (HITL) | `canUseTool` callback + `permissionMode` |
| Token/cost meter | result `modelUsage` per model, `total_cost_usd` (an estimate), `/usage` rate limits (`percent`, `resets_at`), `maxBudgetUsd` |
| Visibility | streamed messages + hooks (`PreToolUse`, `PostToolUse`, `TaskCompleted` …) carry `agent_id` |

## 3. Repos to use

| Repo | License | Use |
|---|---|---|
| **claude-agent-sdk-typescript** | Commercial Terms | **Core dependency** |
| claude-code | Commercial Terms | Binary + changelog + example hooks/plugins |
| **claude-agent-sdk-demos** (simple-chatapp, research-agent, email-agent) | none, so read only | Patterns for streaming UI and multi-agent orchestration |
| skills | per-skill | SKILL.md format; per-agent skills |
| claude-plugins-official, knowledge-work-plugins | Apache-2.0 | Plugin format + catalog |
| claude-cookbooks, claude-quickstarts | MIT | Reusable code and patterns |
| claude-code-action | MIT | Reference for spawning and parsing Claude Code streams |
| sandbox-runtime | Apache-2.0 | Optional per-agent sandbox for Bash/MCP |
| modelcontextprotocol/typescript-sdk, servers, registry, mcpb | check each repo's license | Our MCP servers; connector discovery; one-click connector install |
