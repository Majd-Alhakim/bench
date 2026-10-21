# Review Principles

Used for self-review before every PR, by `/review-pr`, and by the reviewer agents. A finding needs a concrete failure scenario. "Might be cleaner" is not a finding.

1. **Correctness first:** wrong results, crashes, unhandled errors, race conditions, broken edge cases (empty, huge, unicode, Windows paths).
2. **Security and isolation:** secrets, credential handling (ADR-0002), IPC validation, agent A reaching agent B's data, untrusted content triggering actions without approval. See [docs/security-baseline.md](docs/security-baseline.md).
3. **Tests prove the change:** new logic has tests; a bug fix has a regression test; tests assert behavior, not implementation.
4. **No slop:**
   - dead code, unused exports or params, commented-out code
   - duplication that should be one function
   - comments that restate the code, or generic filler
   - TODOs without a backlog ID
   - speculative abstraction (interfaces with one implementation "for later")
   - copy-pasted blocks that differ in one value
5. **Structure:** code lives in the right package (core has no Electron imports); names say what things are; functions do one thing; files stay focused.
6. **Consistency:** matches the surrounding code and [CLAUDE.md](CLAUDE.md) conventions. Formatting is the tools' job, so don't comment on it.
7. **Visibility:** new behavior emits a trace event the user can see.
8. **Scope:** the PR does one thing. Unrelated fixes go in their own PR.
