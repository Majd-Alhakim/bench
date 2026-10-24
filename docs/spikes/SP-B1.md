# Spike SP-B1: a browser agent under the SDK on Windows 11 Home

**Date:** 2026-10-24 · **Branch:** `spike/g0-feasibility` · **Code:** [`spikes/sp-b1/`](../../spikes/sp-b1/) (throwaway)
**Setup:** `@playwright/mcp` **0.0.83** as a stdio MCP server, headed **Microsoft Edge** (`--browser msedge`, no extra browser download), its own profile (`--user-data-dir profile/agent-a`), `--allowed-origins` set to a local test shop on `127.0.0.1` (fake data). Agent: Sonnet 5.5, SDK 0.3.290, the same isolation as S0-1.

**Recommendation: GO**, with one change to how Take over works (finding 1).

## Results
| Criterion (PRD story 0.4) | Result |
|---|---|
| One agent, a 10-step task on a test site, headed, own profile | ✅ Search → item → quantity 2 → add to cart → cart → checkout → sign-in → checkout form → place order → screenshot. Confirmation: *"Test order for Spike Tester in Riyadh, total $48."* (correct: 2 × $24) |
| Screenshots in the stream | ✅ `browser_take_screenshot` came back as an image block in the tool result; a PNG was also saved to the output folder |
| `canUseTool` pauses for Take over | ✅ When the agent reached the password field, `canUseTool` held the run (3 s stand-in for you), then sent the agent back with "the user signed in for you". The password was never typed |
| Tokens and wall time | **45 s**, 18 browser tool calls, 19 turns. Sonnet: 30 input, 1,993 output, 15,499 cache-write and 160,655 cache-read tokens. About **$0.098** at API prices |
| Extra: stays on allowed sites | ✅ Asked to open `https://example.com`, it got `net::ERR_BLOCKED_BY_CLIENT` |

## Findings for the design
1. **Take over must hold every tool call, not just the one that triggered it.** The agent sent its password fill and its "Sign in" click in the same turn. While `canUseTool` held the fill, the click was already queued. **Rule:** Take over is a session-wide gate. While it's on, every `canUseTool` and PreToolUse call for that agent waits until you press *I'm done*.
2. **Snapshots are the token cost.** Most of the 176k cache tokens are page snapshots (accessibility trees). Fine on a toy shop; real sites are bigger. Use `--snapshot-mode` and screenshots only when needed, and show the cost per step in Look inside.
3. **`--allowed-origins` is a real fence.** It goes with G2-Q3: the agent browses freely only on sites you allowed, and signing in to a new site goes to you.
4. **Edge works with no Chromium download**, which keeps the installer small. The profile folder holds cookies, so it belongs in the agent's own space and is deleted with the agent (BR-84).

## Not covered here
Real sites, CAPTCHAs (never solved by agents), file downloads and long sessions. Those land with UC-49 in Sprint 3.
