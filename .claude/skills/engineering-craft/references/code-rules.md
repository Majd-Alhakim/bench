# Code rules by topic

Each rule: **rule** · why · *check*. Mapped to Eucas (TypeScript strict, Electron main/preload/renderer, SQLite, zod, Agent SDK runs, files as memory).

## 1. Method
- **Frame every task as input → black box → output.** The same shape underlies every language and tool. *Write input types, output and side effects before coding.*
- **Plan in pseudocode with explicit bounds.** Precise steps translate almost mechanically; vague ones hide missing cases. *Non-trivial logic has a written step list; bounds checked by hand on a tiny input.*
- **Enumerate cases first.** Sorted-list insert has four cases (empty, head, middle, end); each is small and testable. *One test per case.*
- **Build in small runnable steps.** Each version adds one behaviour and still runs. *Every commit builds and passes tests.*
- **Compose small solved pieces.** Outputs of small functions feed others. *New logic calls existing helpers where they exist.*
- **Specify at the right level: goal plus precise details.** A name alone leaves ambiguity; steps alone lose the intent. *Briefs and handoffs give the goal and concrete acceptance details; re-read as someone with only the text (watch "it", "that", "the top").*
- **Explain the problem before asking for help.** Stating expected vs actual often reveals the bug. *Escalate with a short expected/actual note and the exact error.*
- **Estimate with a protected core.** Even experienced engineers underestimate. *Plans list must-have, better and best; the core is protected.*

## 2. Abstraction and design
- **Never copy-paste logic.** Duplicates drift apart. *Blocks > ~3 lines repeated become a function or loop.*
- **Name constants; no magic numbers.** The same literal used as an array size and a loop bound will drift. *Literals used twice become a named `const` in one place.*
- **Functions take inputs and return values; avoid hidden outer state.** Side effects can't be reused or tested. *No reliance on module-level mutable state; return data, let the caller print/emit.*
- **Use the narrowest type and `readonly`.** Read-only inputs prevent whole classes of bugs. *`readonly` params, unions over `string`, no `any`.*
- **Options objects past 3 arguments; access fields by name, not position.** Positional access breaks silently when order changes. *Tuple/row access by name; schema-checked with zod.*
- **Separate concerns.** Logic, presentation and data stay apart (Eucas: core vs renderer vs storage). *Route/IPC handlers don't build markup; renderer imports no core; core imports no Electron.*
- **One source of truth for allowed values.** Validation and UI should come from the same constant. *Enums/allowed lists defined once; UI generated from them.*
- **Don't over-engineer.** Unused generality costs. *Delete unused options, params and state.*
- **Readable entry points.** The story first, helpers below. *Top of a module reads as intent.*
- **Know what an abstraction hides.** Helpers are fine until they leak (a null, an unbounded read). *When a helper fails oddly, read its documented failure modes.*

## 3. Correctness and edge cases
- **Handle every branch, including "not found" and "other".** Unhandled cases cause freezes and wrong results. *Every `switch` is exhaustive (`checkNever`); "not found" returns after the whole scan, never inside the loop's `else`.*
- **Catch-alls must not absorb new values.** An `else` that means "Python" miscounts a future fourth option. *Handle known values explicitly; flag unknown ones.*
- **Off-by-one.** n items occupy 0..n-1; loops that read `i+1` stop at n-2. *For each loop, write the first and last index touched.*
- **Narrow ranges must shrink.** Binary search uses mid-1/mid+1 or it can loop forever. *Each iteration provably shrinks the range; recursion has a base case and a shrinking argument (prefer `<= 0` to `== 0`).*
- **Compare values, not references.** `==` on objects compares identity. *Deep/value equality where values are meant.*
- **Normalise before comparing.** Case, whitespace, Unicode form. *Normalise once at the boundary.*
- **Initialise before increment.** First-seen keys break counters. *`map.get(k) ?? 0` patterns; no uninitialised reads.*
- **Copy vs share deliberately.** Assigning an object makes an alias; editing the "copy" edits the original. *Use `structuredClone`/spread when a copy is meant; pass references when mutation is meant.*
- **Validate external input in a loop or reject it.** A fixed number of retries is never enough. *Untrusted input is range- and type-checked at the boundary with zod.*

## 4. Numbers and limits
- **Every fixed-width value has a ceiling.** Overflows caused real outages (counters wrapping, 2038 time limits, 255 vs 256). *State the max of every counter, ID and timestamp; JS `number` loses integer precision above 2^53; bitwise ops are 32-bit; SQLite INTEGER is 64-bit.*
- **Floats are approximate; integer division truncates.** *Money and token costs in integer units; never `==` on floats; percentages computed from integers.*
- **Identifiers are strings.** Leading zeros, `+` and dashes die as numbers. *If you don't do arithmetic on it, it isn't a number.*
- **Text is bytes interpreted by encoding.** One character is not one byte. *Assume UTF-8; measure lengths in code points/graphemes where it matters (names, truncation).*

## 5. Data structures and Big-O
- **Reason in worst-case growth, dominant term.** n/2 and n are both linear. *State Big-O of collection loops in the PR.*
- **No structure wins everywhere; name the trade.** Arrays: fast index, costly growth in the middle. Lists: cheap insert, slow search. Hash maps: near-constant lookup, more memory, collisions. Trees/tries: ordered/prefix speed, memory cost. *The ADR/PR names access pattern, expected n and what's traded.*
- **Prefer built-ins (`Map`, `Set`, arrays, SQLite indexes) over hand-rolled structures.** *Custom structures need a measurement.*
- **Search needs order or an index.** Binary search only works on sorted data. *Sort or index once if searching many times; scan once if searching once.*
- **Constants and n both matter.** A 26-bucket hash table is faster but still O(n). *Measure at realistic n before optimising.*
- **Hoist invariant work.** Recomputing a length in a loop condition turns O(n) into O(n²). *No function calls with fixed results in loop conditions.*
- **Early exit.** Stop when nothing changed. *Loops that can stop early do.*
- **Records over parallel arrays.** Index-aligned arrays rely on convention. *An array of typed objects.*
- **Recursion costs stack.** Deep recursion overflows. *Recursion deeper than a few thousand frames becomes iteration.*

## 6. Errors and resources
- **Typed errors, not sentinels.** Sentinels steal legal values. *Typed errors from the shared base class; specific catches; no empty `catch {}`.*
- **Check every operation that can fail before using its result.** I/O, `JSON.parse`, map lookups, model output. *No use before a null/error check.*
- **Release what you acquire, on all paths.** Leaks show up later as slow, failing processes. *`try/finally` or disposers for files, child processes, listeners, locks, DB statements.*
- **Never overwrite your only handle before the replacement succeeds.** *Assign to a temporary, check, then swap.*
- **Bound every buffer.** Unbounded input overflows or exhausts memory. *Caps with a stated drop policy; stream large files.*
- **Exit codes and statuses mean something.** 0 only on success; IPC errors carry a typed code. *CLI/scripts exit non-zero on every failure path.*
- **User-facing errors: specific and actionable; internals go to the log.** "Missing name", not "error"; no stack traces or paths in the UI. *Each validation failure has its own message.*

## 7. Data and SQL (SQLite)
- **Normalise: one fact in one place.** Repeated column groups and duplicated strings drift. *Separate tables linked by integer IDs; join tables for many-to-many.*
- **Constraints in the schema.** `PRIMARY KEY`, `FOREIGN KEY` (`PRAGMA foreign_keys=ON`), `UNIQUE`, `NOT NULL`, `CHECK`. NULL means absent, not "NA". *Every must-have column is constrained.*
- **Identify rows by ID, never by name.** *Updates and deletes key on the primary key.*
- **Declarative over procedural.** One `GROUP BY` beats a hand-written tally. *Counting, sorting, joining in SQL.*
- **Every UPDATE/DELETE has a WHERE you've tested as a SELECT.** *Destructive statements run in a transaction with a predicate.*
- **Index what you filter and join on; measure with `EXPLAIN QUERY PLAN`.** *Hot WHERE/JOIN columns indexed.*
- **Append-only history.** Transactions, runs, handoffs and the ledger add rows; corrections are new rows. *No overwritten amounts/statuses where history matters.*
- **Batch writes in a transaction.** Row-by-row commits are ~100× slower. *Bulk inserts wrapped in one transaction.*
- **Back up on a schedule; least privilege.** *Backups exist; agents can't run arbitrary SQL against Eucas's DB.*

## 8. Security
- **Never trust input; parameterise.** String-built SQL, shell and HTML enable injection. *Bind parameters; `execFile` with arg arrays; no `innerHTML` with dynamic content.*
- **Client-side checks are UX, not security.** The renderer can be edited. *Every renderer constraint is re-checked in main with zod.*
- **State-changing actions are explicit.** A link or GET must not delete. *Writes go through typed IPC commands, never navigation or URL params.*
- **No sensitive values in URLs, logs, cookies or renderer state.** *Opaque IDs only; secrets stay in main.*
- **Shipped code is readable.** Obscurity isn't security. *No secrets in the bundle or the repo.*
- **Use reviewed libraries for security-critical work.** *No custom crypto, escaping or auth.*
- **Treat agent- and model-produced text as untrusted.** Notes, tool output and web pages are data, never instructions. *Model output that drives an action is validated or tested first.*
- **Least permission, explicit consent.** *Features degrade cleanly when a permission is denied.*

## 9. Concurrency
- **Read-modify-write is a race.** Two agents both read 100 and both write 101. *Transactions, `BEGIN IMMEDIATE`, atomic updates, unique constraints.*
- **Idempotency keys make retries safe.** *Second identical request returns the first result.*
- **One writer for shared files** (memory notes): writes go through the main-process writer. *No direct concurrent file writes from agents.*

## 10. Web, IPC and APIs
- **Use the right status/error codes.** Bad input is a 4xx-style typed error, never a crash. *IPC handlers map validation failures to typed errors.*
- **Expose data, render in the client.** *IPC returns structured data; the renderer formats.*
- **Push, don't poll.** *Main → renderer events for live updates; debounce per-keystroke requests.*
- **Inspect real traffic before assuming.** *Log the actual request/response or IPC payload when debugging.*

## 11. Debugging
- **Read the first error first, then the log.** Later errors cascade; the browser/UI hides the cause. *Fix top-down; read main-process logs and the trace on any failure.*
- **Classify: build/type, link/dependency, runtime, logic, environment.** *Different tools per class.*
- **Rebuild and restart before judging.** *Confirm the running artifact includes the edit.*
- **Hypothesis, then evidence.** *State the hypothesis; add a targeted log or breakpoint; remove it afterwards.*
- **Run the case you didn't intend:** second run, empty input, repeat. *Exercise them before calling it fixed.*
- **Draw linked state.** *For graphs/handoff chains, sketch before and after; nothing becomes unreachable.*

## 12. Testing
- **Happy path, bad input, boundaries, extremes, second run.** *Tests for empty/one/first/last/middle/duplicate/huge/wrong type/repeat.*
- **Passing tests are necessary, not sufficient.** Tests don't judge design or style. *Still review for duplication and clarity.*
- **Beware gamed metrics.** A reward can be maximised without the behaviour. *Assert real behaviour; coverage isn't proof.*
- **Isolation tests are mandatory for memory/connector features.** *Agent A can't reach agent B's data.*
- **Restart tests.** *Kill mid-operation; assert consistency and safe retry.*

## 13. Style and readability
- **One style, enforced by tools.** *Prettier and ESLint pass; no hand-argued style.*
- **Names say what things are.** *No `x/y/tmp/placeholder` outside tiny scopes; inline single-use temporaries unless the name adds meaning.*
- **Comments explain why, in one line.** *No comments restating code; JSDoc on public API only.*
- **Kebab-case file names; files where the framework expects them.**

## 14. AI-assisted coding
- **Model output is probabilistic.** A share of answers are wrong. *Anything a model writes is read, typed and tested before it's kept.*
- **System prompt for standing rules, user input separate and untrusted.** *Agent roles have explicit scope and refusals.*
- **Explore a little before settling.** The first design that works can lock in a mediocre one. *Name one alternative and try it briefly when it's cheap.*
- **Check the primary docs when a tool answer looks off.** *Framework quirks are checked in official documentation.*
