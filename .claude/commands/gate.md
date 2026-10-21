---
description: Record a client gate decision (approve / reject / approve with changes) in STATUS.md
argument-hint: "G<n> [approve|reject|changes] [comments]"
---

Gate: $ARGUMENTS

1. If the arguments don't state the decision explicitly, confirm it with the client. **Only the client approves gates.** Never infer an approval.
2. Append to the gate log in `docs/process/STATUS.md`: date, gate, decision, and the client's comments word for word. Update the phase tracker.
3. On approval, set the artifact's status to `Approved` / `Baselined` and its version to x.0. If changes are requested, list them as tasks for the owning agent.
4. Commit on a `docs/` branch and open a PR (standard workflow).
