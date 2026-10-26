---
name: engineering-craft
description: Eucas's engineering rulebook for writing, designing, debugging and reviewing code. Gates before, during and after coding (cases, edge cases, Big-O, typed errors, resources, zod boundaries, parameterised SQL, transactions, idempotency), a system-design method sized for a local single-user Electron + SQLite app, and a greppable review checklist. Use on ANY coding, refactoring, debugging, code review, test design, data modelling, ADR or tech-lead design work in Eucas.
---

# Engineering craft for Eucas

**Why.** AI agents write plausible code fast. What separates good software from plausible software is the boring discipline underneath: precise problem statements, every case handled, the cost of each loop known, failures that release what they took, data that can't be corrupted by a retry or a race, and a design sized for the real problem. This skill is that discipline, written as checks an agent can run.

Sources: Harvard CS50 lectures (2024–25) and a senior system-design course, paraphrased and mapped to Eucas's stack. See [references/sources.md](references/sources.md).

**Relation to other skills.** This is the *rulebook*. `test-driven-development`, `systematic-debugging`, `verification-before-completion` and `constraint-driven-development` are *processes*; run them, and apply these rules inside them. On any conflict, `docs/security-baseline.md` and `CLAUDE.md` win.

Eucas's stack, assumed everywhere below: TypeScript strict · Electron (`main` runs agents, `preload` is a minimal typed bridge, `renderer` is React with no Node) · SQLite for messages, runs, tasks and the ledger · agents and memory as files · zod at every trust boundary · Claude Agent SDK runs.

## Gate 1: before coding

1. **Input → output → steps.** Write the input types, the expected output, and the side effects (files, DB rows, IPC events, trace events). If the output isn't stated, the task isn't ready; ask.
2. **Enumerate the cases** before the code: empty, one, first, last, middle, duplicate, absent, huge, wrong type, concurrent, second run. Each becomes a test.
3. **Pseudocode non-trivial logic** with explicit bounds (first and last index, termination condition). Check each bound by hand on a 2–3 item input.
4. **Reuse before you write:** existing repo helper → TypeScript/Node standard library → existing dependency → new dependency (last, justified). Never hand-roll parsing, escaping, crypto, sorting or retry.
5. **Constraints as numbers:** expected sizes (rows, items, file bytes), latency budget, how often it runs, max values of counters and IDs. "Fast" and "big" are not numbers.
6. **Name the access pattern** before choosing a structure: lookup by key (`Map`), membership (`Set`), ordered iteration (array), FIFO (queue table), append-only history (ledger).

## Gate 2: while coding

- **Small runnable steps.** Every commit builds and runs; each step adds one verifiable behaviour.
- **No copy-paste logic.** A block repeated twice (more than ~3 lines) becomes a function or a loop. A literal used twice becomes a named `const`.
- **Narrow, honest types.** `readonly` inputs, unions over `string`, exhaustive `switch` with `checkNever()`, no `any`, no non-null `!` without a proof comment. IDs and phone-like values are strings; money and counts are integers.
- **Typed errors, not sentinels.** Throw or return a typed error from the shared base class; never steal a legal value (`-1`, `null`, `""`) to mean failure. Catch specific error types only.
- **Release what you acquire, on every path.** Every open/subscribe/listen/spawn/lock has a matching close/unsubscribe/kill/release in `finally` or a disposer, including early returns and errors.
- **Validate at the boundary, once.** zod on IPC payloads, files read from disk, tool inputs, agent/model output that drives an action, and env/config. Inside the boundary, trust the types.
- **Parameterised SQL only.** `?`/named bind parameters; never template strings or concatenation into SQL, shell commands or HTML.
- **Transactions for read-modify-write.** Any "read, decide, write" that two agents or two windows could interleave runs in one SQLite transaction (`BEGIN IMMEDIATE`) or becomes an atomic statement (`UPDATE … SET n = n + 1`, `INSERT … ON CONFLICT`).
- **Idempotent writes.** Retried runs, tool calls, handoffs and IPC requests carry a client-generated key; a second identical request returns the first result instead of acting twice.
- **Batch hot writes.** Trace events, ledger rows and imports go in one transaction per batch, never one commit per row inside a loop.
- **Hoist invariant work out of loops** (lengths, regex compiles, lookups that don't change).
- **Persist important state.** Anything the user would miss after a crash lives in SQLite or a file, not only in memory.
- **Keep secrets out of code, bundles, URLs, logs and renderer state.** Never touch Claude credentials (ADR-0002).

## Gate 3: after coding

- **Tests cover the case list** from Gate 1, plus the failure paths (I/O error, invalid input, model returns garbage, process killed).
- **State the Big-O** of every loop over a collection in the PR. Nested loops over the same data are O(n²) until proven otherwise; ask "what if n is 10,000× bigger?"
- **Restart-and-recover check:** kill the process at the worst moment (mid-run, mid-handoff, mid-write); on restart, state is consistent and retrying is safe.
- **Read the real error.** Fix the first compiler/type error first; read the main-process log and the trace before guessing. Classify: type/build, runtime, logic, environment.
- **Rebuild and restart before judging a fix.** A stale build or a stale Electron main process hides changes.
- **Remove scaffolding:** temporary logs, debug flags, commented-out code.
- **Run `verification-before-completion`:** fresh evidence, not memory.

## System design (tech lead)

Use for any ADR, SRS section, or story that adds data, a process, IPC, or a background job. Detail: [references/system-design.md](references/system-design.md).

1. **Requirements:** in scope, out of scope, open assumptions (each with an owner). Find the core: what, if removed, stops this feature being itself? Check in with the PM/client (Eucas gates).
2. **Numbers:** NFRs as local numbers: UI response < 100 ms, agent first token, tokens and % of week per run, DB size after a year, the largest transcript or knowledge file, crash safety. Estimate rows/run and which resource dominates.
3. **Data model + contracts:** entities, keys, indexes, record size; zod IPC/MCP schemas with error sets, pagination and "is a retry safe?". Choose storage by access pattern: SQLite for relational state, files for large or human-editable data (agents, memory), paths in the DB, never blobs.
4. **Flow:** walk the read path and the write path end to end, including the renderer → preload → main → core → SQLite/file hops.
5. **Deep dive + trade-offs:** consistency per operation (strong or eventual, and why), the single source of truth (indexes and caches are rebuildable from it), failure answers per component, what you rejected and why, what changes at 10×.

**Patterns Eucas uses:** append-only ledger and history (never overwrite an amount or a status where history matters) · durable job table + in-process worker for slow work (acknowledge fast, process async) · the one shared retry/backoff helper + a visible "failed" state the user can see (dead letter) · write-ahead journal for queued agent work and ledger events · bounded in-memory buffers (cap, drop policy stated) · scheduled cleanup (old traces, temp files, orphaned runs) whose own failures are traced · settings flags for risky features · push over IPC events, never polling · a runaway guard on agent loops and spawns.

**Two checks on every design:**
- **Scale check:** would this be correct with 1 user on 1 machine? Is any component here only because big systems have one?
- **Failure check:** kill the process at the worst moment. Is state recoverable and the retry safe?

**Skip unless Eucas becomes multi-user or hosted:** load balancers, CDNs, read replicas, sharding, consistent hashing, Kafka/RabbitMQ, Redis, pub/sub fan-out, service discovery, multi-region, CDC into a search engine, presigned-URL blob flows.

## Review checklist (run on every diff)

Report each failure as `file:line — rule — problem — fix`.

- [ ] Every new function has its case list tested (empty, one, boundaries, duplicate, wrong type, second run).
- [ ] `rg "\$\{" -g "*.sql" ; rg "(query|prepare|exec)\(\`"`: no template strings into SQL; same for `spawn`/`exec` shell strings and `innerHTML`.
- [ ] Every IPC handler, file read, tool input and model output that drives an action is parsed with zod.
- [ ] Read-then-write sequences on shared rows/files are in one transaction or atomic.
- [ ] Retriable operations (runs, tool calls, handoffs) carry an idempotency key.
- [ ] No sentinel error returns; catches name specific error types; no swallowed errors (`catch {}`).
- [ ] Every acquire has a release in `finally`/a disposer, including error paths (`addEventListener`, `on(`, `spawn(`, `open(`).
- [ ] No duplicated blocks; no magic numbers used twice; no single-letter names outside tiny loops.
- [ ] Loops over collections state their Big-O; no invariant work in loop conditions; no row-by-row commits in loops.
- [ ] Numbers: integers for money/counts, no float `==`, IDs as strings, limits stated for counters and timestamps.
- [ ] No secrets, tokens or personal data in code, bundles, URLs, logs or renderer state; no `ANTHROPIC_API_KEY` leak into agent env.
- [ ] Renderer has no Node access; preload stays minimal; `core` imports no Electron.
- [ ] State that must survive a crash is persisted; restart mid-operation leaves a consistent state.
- [ ] Every feature emits a trace event; failures land in a visible state, not only a log line.
- [ ] Temporary logs and debug code removed; one-line comments explain *why*, not *what*.

Full rules by topic: [references/code-rules.md](references/code-rules.md).
