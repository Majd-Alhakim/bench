# Research: Obsidian-style memory vaults for agents

**Date:** 2026-10-22. Asked by the client: *"using a memory vault like obsidian… will make the agents much smarter and cheaper; can we discover this option?"* Tags: [V] = verified on the primary source, [U] = unverified.

## Verdict
**Partly right. The gain comes from the mechanism, not from Obsidian.** What is measured is *just-in-time retrieval of small, well-structured notes* instead of putting everything into the context. Obsidian is a free editor over a folder of `.md` files. We found **no benchmark** showing that Obsidian, wikilinks or the graph view improve agent accuracy or cost.

## Evidence
| Finding | Source |
|---|---|
| Memory tool + context editing: **+39%** on Anthropic's internal agentic-search eval; context editing alone **−84% tokens** over 100 turns (vendor eval) [V] | claude.com/blog/context-management |
| "Context rot": accuracy drops as input grows, and one related-but-wrong passage hurts accuracy, across 18 models [V] | trychroma.com/research/context-rot |
| A plain filesystem agent (grep/search/open) **74.0%** on LoCoMo vs Mem0's self-reported 68.5%: how well the agent uses its tools matters more than the memory engine [V] | letta.com/blog/benchmarking-ai-agent-memory |
| Mem0 claims >90% token savings vs full context (self-reported; disputed by Zep) [V claim] | arxiv.org/abs/2504.19413 |
| Anthropic's pattern: CLAUDE.md/index loaded up front, files fetched on demand [V] | anthropic.com/engineering/effective-context-engineering-for-ai-agents |

## Options reviewed
| Option | What it is | Verdict |
|---|---|---|
| Vault folder + file tools | Agent reads and writes Markdown with grep and an index | ✅ The basis of Bench's memory |
| **basic-memory** (AGPL-3.0) | Markdown + frontmatter + `[[links]]`, local SQLite full-text + vector search, MCP tools (`search_notes`, `build_context`…), works in Obsidian | Copy its *design*, don't bundle it (AGPL, and we need multi-agent write control) |
| Obsidian MCP servers via the Local REST API plugin | Need Obsidian running plus an unsandboxed plugin | ❌ |
| Smart Connections (source-available) / Khoj (AGPL) | Obsidian plugin / RAG app | ❌ as dependencies |
| Mem0 / Zep-Graphiti / Letta (Apache-2.0) | Memory engines with an LLM call per write and/or external databases | ❌ for now: cost per write, and they replace our model rather than complement it |
| Anthropic memory tool (`memory_20250818`) | A client-side `/memories` command set; the TS SDK ships `BetaLocalFilesystemMemoryTool` | ✅ Optional: expose the Bench store through it |

## Risks
- **Bloat and stale notes** act as distractors (context rot). Mitigation: size caps, expiry, staleness sweeps.
- **Retrieval misses** with embeddings. Mitigation: keyword search plus the index as a fallback.
- **Several agents writing at once.** No tool reviewed handles it. Mitigation: one main-process writer, one owner per scope.
- **Prompt injection through memory** (MINJA reports 98.2% in ideal conditions) [V as reported]. Mitigation: treat memory as data, never instructions; record where each note came from; protect against path traversal.
- **Obsidian plugins are not sandboxed** [V]. Bench never requires a plugin. Obsidian itself is free, including for commercial use [V].

## Recommendation
**Adopt now:**
1. **Memory folders = an Obsidian-compatible vault.**
   - YAML frontmatter: `type`, `scope`, `tags`, `updated`, `source_agent`, `expires`.
   - `[[wikilinks]]` between notes.
   - `MEMORY.md` as the index (a "map of content") for each scope.
   - No `.obsidian/` folder and no plugins. The client can "Open folder as vault" for free.
2. **Our own Bench memory MCP** with basic-memory's tool shape:
   - `search` (SQLite FTS5 full-text search), `read`, `write`, `build_context` (follow links 1–2 hops), `recent`.
   - Every write goes through the main process, with scope permissions, size caps and a record of where each note came from.
3. Keep the context checkpoint and lazy roll-ups (the measured gain), and add expiry and staleness sweeps.
4. Optional: expose the store through Anthropic's memory-tool commands.

**Later, only if measured:**
5. **Local** semantic search (a small ONNX embedding model + sqlite-vec, hybrid with FTS5), switched on per project once memory passes a few hundred notes or the logs show grep missing things. Never hosted embeddings (memory would leave the device).
6. An A/B benchmark (memory on vs. off, 10–20 repeated tasks: tokens, cost, pass rate) to give real numbers.
