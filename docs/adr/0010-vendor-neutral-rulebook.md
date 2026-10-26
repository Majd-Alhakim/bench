# ADR-0010: A vendor-neutral rulebook, compiled per vendor

- **Status:** Proposed (2026-10-26)
- **Date:** 2026-10-26

## Context
The pre-mortem names "one rulebook across vendors (Claude Code, Codex, Cursor)" as part of what Anthropic will never build. Cursor is next. If rules are stored as Claude Code permission strings (`Bash(pnpm test:*)`), every Cursor adapter becomes a translator of another vendor's syntax, and every Claude Code syntax change (2.1.300 changed MCP rule matching) breaks the rulebook.

SP-SUP1 also showed that contradictory user rules caused the supervisor's remaining mistakes, so rules need **scopes** (for example "style only").

## Decision
- **One rulebook file per user**, `%APPDATA%\Eucas\rulebook.json`, validated by `contracts/rulebook.schema.json` (`$id` versioned, `schemaVersion: 1`). It describes intent in vendor-neutral terms:
  - `rules[]`: `{ id, kind: "auto_approve", match: { tool: "shell" | "file_read" | "file_write" | "mcp", command?: { program, args: exact[] }, mcpTool?: { server, name } }, scope: { folders: [path] }, enabled, createdAt, source: "suggestion" | "template" | "user" }`. Exact commands only; no globs, no regex (trust PM-T5).
  - `guidance[]` (supervisor rules, Pro): `{ id, text, appliesTo: "style" | "process" | "tests" | "safety", priority }`. Only `safety` guidance can make the supervisor ask the user; `style` guidance can never decide an order of work or a merge.
  - `limits` is **not** in the file. The four limits are compiled into the guard and can't be expressed, disabled or scoped by the rulebook (schema has no field for them; the compiler rejects any rule whose match overlaps a limit).
- **A neutral `ToolCall` model** in `crates/eucas-rules`: `{ vendor, session, tool: Shell { program, argv, raw, shell_kind } | FileRead | FileWrite | Mcp { server, name, input } | Other, cwd }`. Each vendor adapter (`crates/eucas-adapters/claude_code`, later `cursor`) maps its hook input into it. Shell commands are parsed with a real tokenizer per shell (bash, PowerShell, cmd); anything the parser can't fully resolve (subshells, `$()`, backticks, `-EncodedCommand`, pipes into interpreters, redirections) is **"unresolved"**, which can match a limit but never an auto-approve rule.
- **Compiled output per vendor:** the app compiles the rulebook into `rulebook.bin` for the guard (a bincode snapshot with a SHA-256) and, for Claude Code, mirrors the limits as `permissions.deny` patterns in managed settings (admin mode) or in the user's `~/.claude/settings.json` (user-level fallback, D-4 (b)). Auto-approve rules are **not** written as Claude Code `allow` rules (the user's `ask`/`deny` must still win, and the guard is where the counters live).
- **Conflicts are computed, not guessed:** the compiler reads the user's Claude Code permission rules (`~/.claude/settings.json`, project and local settings in the scoped folders) and marks a rule "would do nothing" when an `ask` or `deny` there covers it (UI §4.9).

## Consequences
- The Cursor adapter is a new crate plus a hook-input mapping, not a rulebook migration.
- Every rule carries a live counter, kept by the app from guard events (not in the rulebook file), so editing rules never rewrites history.
- Schema changes follow semver on `schemaVersion`; the app migrates forward and keeps a `.bak` of the previous file.
