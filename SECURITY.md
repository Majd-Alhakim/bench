# Security Policy

Eucas is pre-release and private. Please **do not open public issues for vulnerabilities**.

Report privately to the maintainer via GitHub's private vulnerability reporting (Security tab → "Report a vulnerability"), or contact @Majd-Alhakim directly. Include the steps to reproduce, the impact, and the affected version or commit.

Scope highlights: credential handling (Eucas must never read or store Claude OAuth tokens), isolation between agents, Electron renderer escapes, and prompt injection that triggers actions without approval. Security rules for contributors: [docs/security-baseline.md](docs/security-baseline.md).
