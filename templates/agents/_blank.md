---
name:                     # e.g. "Inbox Assistant"
description:              # one line; other agents and the router see this
model: claude-haiku-5-5   # haiku = cheap & fast · sonnet = balanced · opus = deepest
connectors: []            # only what this agent needs (fewer = fewer tokens)
skills: []
plugins: []
permissions: ask
can_handoff_to: any       # or a list of agent names, or none
budget:
  daily_tokens: null
---

<!-- Role and instructions: write it like Claude Project instructions. -->
