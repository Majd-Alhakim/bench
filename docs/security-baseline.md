# Security Baseline — Eucas

Applies to every PR. Eucas is a **local-first desktop app**: there is no Eucas server, no Eucas accounts and no multi-tenant database. The trust boundaries are between **the user, each agent, the renderer, and the outside world**.

## 1. Threat model

| Asset | Where it lives | Main threats |
|---|---|---|
| Claude login (OAuth) | Claude Code's own store, **never Eucas's** | Eucas reading or forwarding it → account ban (ADR-0002) |
| Optional API key, connector tokens Eucas owns | OS keychain via `safeStorage` | Leaking to disk, logs, renderer, git |
| Conversations, memory (private + global), knowledge files | Eucas home folder + SQLite | Agent A reading agent B's private data; leaking into logs or crash reports |
| User's files and machine | Agent `cwd` + granted paths | An agent deleting or exfiltrating files; running shell commands unasked |
| Email, GitHub (connectors) | Third-party services | **Prompt injection** from email or web content making an agent send, post or delete |

**Identities:** the user (full authority); the main agent; user-created agents (each scoped); the background curator (Haiku, memory writes only); routines (unattended, so the tightest scope).

**Dangerous operations** (always require approval unless the user grants a standing rule for that agent + tool): send or post anything externally; delete or overwrite files outside the agent folder; run shell commands; git push; write to global memory (configurable); anything involving payment.

## 2. Rules

### Credentials (ADR-0002)
- Never read, copy, log or store `~/.claude/.credentials.json` or any Claude OAuth token. No Eucas login screen.
- Strip `ANTHROPIC_API_KEY` from the agent `env` unless API mode is on.
- Secrets Eucas owns go in `safeStorage` only. Never in `.env`, SQLite, agent files, logs or IPC payloads to the renderer.

### Agent isolation (our equivalent of "user A can't read user B")
- Each run gets **only** its own private memory path, its own knowledge folder, the global memory, and its chosen connectors (`strictMcpConfig: true`, `settingSources: []`).
- Eucas MCP memory tools derive the agent id from the **runner's context**, never from a tool argument the model supplies.
- **Required tests:** agent A cannot read, list or write agent B's private memory or knowledge via any tool, path traversal (`../`), symlink or crafted argument.

### Electron hardening
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, strict CSP, no `remote`, `webSecurity` on.
- Preload exposes a minimal typed API. Every IPC payload is validated with zod in main.
- Block `will-navigate` and `new-window` to external origins; open links in the system browser only after showing the URL.

### Untrusted content
- Email, web, file and connector output is **data, not instructions**. Tools that act outside the app always go through the approval gate, even if the agent "was told to" by content.
- Approval cards show the exact action and target (recipient, repo, path).

### Data handling
- Logs: structured, local only, with secret and PII redaction (tokens, keys, email bodies). No telemetry leaves the machine.
- Crash reports: off by default; if added later, opt-in and redacted.

### Supply chain
- Lock files committed. `pnpm audit --audit-level high` in CI; high or critical findings block the merge unless a risk acceptance with a review date is recorded in the readiness report.
- Dependabot for npm and GitHub Actions. Pin Actions to full commit SHAs with a `# vX.Y.Z` comment (Dependabot keeps them current).
- Gitleaks secret scan on every PR and push.
- Check the license before copying code from any repo (no AGPL, and no unlicensed code).

## 3. PR security checklist
- [ ] No secrets, tokens or real personal data in the diff (gitleaks green)
- [ ] New IPC channels validated with zod; nothing secret sent to the renderer
- [ ] New agent tools respect isolation; tests cover cross-agent access
- [ ] New external-action tools go through the approval gate
- [ ] New dependencies: needed, maintained, license OK, audit clean
