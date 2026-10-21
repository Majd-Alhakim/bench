# Research: token-efficient multi-agent group chats

**Date:** 2026-10-21. Tags: [verified] = read on the primary page; [secondary] = from search summaries or vendor material; [unverified] = not checked this session.

## The core finding
Cost explodes when every agent sees every message. Every framework or paper that fixes this does one or more of three things:
1. **Route:** only selected agents run.
2. **Filter:** each agent gets a scoped view of the conversation.
3. **Externalize:** state lives in shared stores or files that agents fetch by reference.

## Ranked techniques (with evidence)

| # | Technique | Evidence | Source |
|---|---|---|---|
| 1 | **Subscribe and route, don't broadcast.** MetaGPT has a shared message pool where agents subscribe by role. AutoGen's SelectorGroupChat broadcasts every reply and its prompt grows each turn (161 → 718 tokens in the docs' example) | [verified] | arxiv.org/abs/2308.00352 · microsoft.github.io/autogen (selector-group-chat) |
| 2 | **Isolated subagents that return condensed results** (1–2K-token summaries) and pass references to external files | Multi-agent runs use ~15× the tokens of a chat. Opus lead + Sonnet workers beat single-agent Opus by 90.2% on Anthropic's internal research eval [verified] | anthropic.com/engineering/multi-agent-research-system · /effective-context-engineering-for-ai-agents |
| 3 | **Deferred tool loading** (Tool Search, `defer_loading`) | 85% fewer tool-definition tokens (~55K → ~8.7K); tool accuracy improved [secondary] | anthropic.com/engineering/advanced-tool-use |
| 4 | **Context editing + memory tool** (clear old tool results) | −84% tokens on a 100-turn eval [secondary] | anthropic.com/news/context-management |
| 5 | **Prompt caching**: stable prefix of tools → system → memory | Cache reads cost 0.1× input. Any change to tool definitions busts the cache. 1h TTL suits intermittent agents [verified] | platform.claude.com docs: prompt-caching |
| 6 | **Memory extraction instead of full history** (Mem0); **sleep-time compaction** (Letta) | Mem0 claims >90% token savings vs full context, but Letta and Zep dispute the method. Sleep-time compute: ~5× less test-time compute [secondary] | arxiv 2504.19413 · 2504.13171 |
| 7 | Learned communication pruning (AgentPrune, AgentDropout, Optima) | 20–70% fewer tokens, but needs training, so research only for us | arxiv 2410.02506 · 2503.18891 · 2410.08115 |
| 8 | **Fewer hops; forward answers verbatim** (no supervisor "telephone"); hide routing chatter | ~50% improvement in LangChain's tau-bench study [verified] | langchain.com/blog/benchmarking-multi-agent-architectures |
| 9 | **Know when NOT to go multi-agent** | Multi-agent setups degraded sequential tasks by 39–70%; centralized coordination gave +81% on parallel tasks [secondary] | arxiv 2512.08296 · MAST failure taxonomy arxiv 2503.13657 |

## What this means for Bench (adopted in ARCHITECTURE.md)
- **Router:** deterministic rules first (@mention, the agent that owns the task, topic subscription), then a Haiku router that sees **agent cards + digest only**. It picks 0..k agents, and the default is one responder.
- **Per-agent context order** (cache-friendly):
  1. that agent's tools only
  2. its role and private core memory, then the global core memory (read-only), then a cache breakpoint
  3. the thread digest
  4. messages addressed to it, verbatim
  5. the task card

  Other agents' tool outputs never enter its context. Long artifacts pass by reference.
- **Memory:** a small, always-in-context core block per agent, plus a shared global core block (one owner or curator writes it; append-style). An archival store in SQLite that agents search on demand. A background (sleep-time) Haiku pass summarizes idle threads and extracts facts.
- **Connectors per agent:** an allowlist, plus `defer_loading` / tool search when an agent has many. Keep tool sets stable within a session so the cache holds.
- **Handoff:** a structured call `handoff(to, task, context_summary, artifact_refs, acceptance_criteria)`. The receiver gets the payload plus its own memory, **not** the sender's transcript. Results are forwarded verbatim. A shared task board tracks states and dependencies. A verifier step checks completion.
- **Budgets:** tokens per thread, max hops per request, single agent by default for sequential work.

## Repos to borrow ideas from
autogen (selector_func/candidate_func) · ag2 (transition graphs) · **letta** (memory blocks, shared blocks, sleep-time) · **mem0** (fact extraction) · langgraph-supervisor/swarm (forward_message) · openai-agents-python (handoff input_filter) · crewAI (scoped memory trees) · google adk-python (output_key/state) · MetaGPT (role subscription). Most are MIT or Apache-2.0, but **check each license before copying code**. AgentPrune has **no license**, so its code can't be reused.
