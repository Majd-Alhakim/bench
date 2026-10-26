# System design method (tech lead)

Paraphrased from a senior system-design course and adapted to Eucas: a local, single-user Electron app with SQLite, files as memory, and Agent SDK runs.

## The five steps (each ends with a check-in at a Eucas gate)
1. **Clarify requirements.** Functional scope, explicit out-of-scope, users, and non-functional limits. Find the core by asking what, if removed, stops the product being itself. Write in-scope, out-of-scope and open assumptions (owner + answer). Jumping straight to a solution is the classic failure.
2. **Data model + API.** Entities, keys, indexes, record sizes, per-entity consistency; contracts with request schema, error set, pagination and retry safety. In Eucas: zod IPC and MCP tool schemas.
3. **High-level design.** Components, then walk the read path and the write path end to end (renderer → preload → main → core → SQLite/files → back).
4. **Deep dives.** Bottlenecks, single points of failure, fallbacks, monitoring (trace + ledger).
5. **Trade-offs and extensions.** What was prioritised, what was sacrificed, rejected alternatives, what changes at 10×.

Start simple; scale only when numbers force it. Plan before code: mid-level engineers code first, seniors decide first.

## Numbers
- NFRs as numbers. Course examples: search < 500 ms, booking confirmation in 2–3 s, 99.9 % availability, message delivery ~500 ms. Eucas equivalents: UI response < 100 ms, time to an agent's first token, tokens and % of week per run, cold start, DB size after a year, crash safety of runs.
- Back-of-envelope from one anchor number: which resource dominates, read-heavy or write-heavy. For Eucas, estimate trace/ledger rows per run, tokens per run, DB size per year, largest transcript/knowledge file. Usually: SQLite is far more than enough.

## Local vs distributed

| Idea | Eucas (local) | Only if multi-user/hosted |
|---|---|---|
| Single source of truth; derived copies rebuildable | SQLite authoritative; FTS index, caches, UI state rebuilt from it | CDC into a search engine |
| Consistency chosen per operation | Strong for ledger, tasks, approvals; eventual for UI previews | Replica lag, read-after-write routing |
| Check-then-act protection | One transaction, `BEGIN IMMEDIATE`, unique constraints, atomic updates | `SELECT … FOR UPDATE`, serializable isolation in Postgres |
| Idempotency keys | Runs, tool calls, handoffs, IPC commands | Payment/reservation APIs |
| Queue: ack fast, work later | Durable job table + in-process worker | Kafka/RabbitMQ consumers |
| Batch writes | Trace and ledger inserts per transaction | Batched Cassandra writes |
| Retry + dead letter | Shared retry helper + visible "failed runs" state | DLQ with retry ladders |
| Survive downstream outage | Write-ahead journal, bounded buffer, replay on recovery | Local buffer when Kafka is down |
| Delivery stages | Handoff: queued → received → accepted → done | Sent → delivered → read; offline inbox |
| Real-time | Main → renderer IPC events | WebSockets, presence |
| Large files | On disk; path in the DB | Presigned URLs + CDN |
| Rate limiting | Runaway guard on agent spawns and loops | Token buckets, central counters |
| Cleanup | Scheduled pruning of traces, temp files, orphaned runs | TTL jobs on media |
| Feature flags | Settings flag | Percentage rollouts |
| Stateless servers | Main-process state recoverable from SQLite after a crash | Horizontal scaling |
| Modular monolith | Packages with enforced boundaries, one DB, local ACID | Services with their own DBs |
| Skip | — | Load balancers, CDNs, read replicas, sharding, consistent hashing, Redis, pub/sub fan-out, service discovery, multi-region |

## Checks a tech lead runs on every design
- Which step is this doc in, and was the previous one confirmed?
- Is every NFR a number?
- For each entity: storage, access pattern, and why not the alternative?
- For each write path: strong or eventual, and why?
- Any read-then-write that two actors could interleave?
- If this runs twice, is the second run a no-op?
- For each component: what happens when it's down?
- **Scale check:** correct with 1 user on 1 machine? Any component only because big systems have one?
- **Failure check:** kill the process at the worst moment; is state recoverable and the retry safe?
- Rejected alternatives written down?

## Worked examples (summaries)
- **Music streaming (Spotify-like).** Capacity math showed audio dwarfs metadata, so blobs go to object storage with signed URLs and metadata to SQL (joins for playlists; indexes on titles). Scaling: CDN with LRU, stateless API servers, read replicas, sharding, regional blobs.
- **Hotel booking (Booking.com-like).** A funnel estimate made it read-heavy (~1000 reads/s vs ~17 writes/s). SQL with ACID, an inventory table per hotel/room type/day, an overbooking factor, an idempotency key plus row locks to stop double booking; search via a derived index fed by change capture; cache with TTL and invalidation on booking.
- **Chat (WhatsApp-like).** WebSockets with a presence registry; messages through a queue into a write-optimised store with batching, retries and a dead-letter path; offline inbox and push fallback; media via presigned URLs; group fan-out via pub/sub; multi-device last-write-wins with versions; explicit plans for cache and queue outages, plus cleanup jobs.

The course's numbers are illustrative interview assumptions, not benchmarks.
