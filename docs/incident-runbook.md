# Incident Runbook — Bench (one page)

## 1. Triage (5 minutes)
- **What broke?** App won't start / agents fail / an agent did something unexpected / usage exhausted / data looks wrong.
- **Since when?** Last app update? Last Claude Code update (`claude --version`)? Last connector change?

## 2. First checks
| Symptom | Check |
|---|---|
| All agents fail | `claude` works in a terminal? Logged in (`/status`)? Anthropic status page? Usage window exhausted (Bench usage meter or `/usage`)? |
| Billed unexpectedly | Is `ANTHROPIC_API_KEY` set in the environment? Is API mode on? |
| One agent fails | Its connector auth expired? Its trace for the last tool error? Its budget hit? |
| Agent took an unwanted action | **Pause all agents** (global stop). Read its trace and the approval log. Revoke the connector token at the provider if anything was sent. |
| App won't start / data error | Logs in `<userData>/logs`; SQLite integrity check; restore `bench.sqlite.bak` |
| Suspected secret leak | Rotate the key at the provider immediately; gitleaks the repo and history; record it in the readiness report (name only, never the value) |

## 3. Recover
- Roll back the app (see [deploy-checklist.md §C](deploy-checklist.md)), or downgrade Claude Code if its update caused the break.
- Restore the Bench home from backup if data was corrupted.

## 4. Afterwards
- Write a short note in `docs/incidents/YYYY-MM-DD-<slug>.md`: what happened, impact, root cause, fix, and a test or check that prevents a repeat.
