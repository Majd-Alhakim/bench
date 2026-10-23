# Skills review: 8 community skill sources (2026-10-22)

Reviewed read-only: sources cloned with git hooks disabled, nothing executed or installed. Three reviewers covered content, security, licenses and fit, against our delivery process and Bench's built-in agent roles.

| Source | Version | License | Installs hooks? | Verdict |
|---|---|---|---|---|
| obra/superpowers | 7.0.1 | MIT | **Yes**: a SessionStart hook injects a coercive "ABSOLUTELY MUST invoke a skill" prompt into every session | **Don't install the plugin.** Take 3–4 skills |
| mattpocock/skills (`mattpocock-skills` plugin) | 1.3.1 | MIT | No auto hooks (git-guardrails edits settings only when invoked) | **Install the plugin** (replaces stale loose copies) |
| addyosmani/agent-skills | 0.6.13 | MIT | Hooks present but not wired (opt-in) | Take selected skills; **skip its commands** (they clash with ours) |
| Leonxlnx/taste-skill | 2.1.4 | MIT | None | **Upgrade** the installed `design-taste-frontend` (2.1.3, profile-sweep bug) |
| DietrichGebert/ponytail | 5.3.2 | MIT | **Yes**: SessionStart nudges adding a `powershell -ExecutionPolicy Bypass` statusLine; injects into every subagent | **Don't install.** Borrow the ideas |
| JuliusBrussee/caveman | 4.0.1 | Apache-2.0 | **Yes** (plugin), and the CLI rewrites `ANTHROPIC_BASE_URL`, has telemetry on by default, and "Auto" uploads prompts and memory to the cloud | Replace the installed old fork with **upstream SKILL.md only** |
| Graphify-Labs/graphify | 0.9.93 | Apache-2.0 | **Yes** (PreToolUse + git hooks); the skill silently runs `pip install --break-system-packages` | **Don't bundle.** Borrow the graph ideas |
| multica-ai/andrej-karpathy-skills | — | **None** (MIT is only claimed) | None | Reference only, in our own words; no name use |

## A. Our delivery process: adopt
| From | What | Where it goes |
|---|---|---|
| mattpocock `grilling` | Interview mechanics (one question at a time, resolve each branch) | `/discovery` and the business-analyst agent |
| mattpocock `code-review` | The **spec axis** (code vs the story's acceptance criteria) next to the standards axis | `/review-pr` |
| obra `test-driven-development`, `systematic-debugging`, `verification-before-completion` | Strict red-green-refactor, 4-phase root cause, evidence before "done" | developer, qa-engineer, `/bug` |
| addy `constraint-driven-development` | A written quality contract per task | tech-lead, Definition of Done |
| Karpathy principles (our words) | State assumptions; build only what the AC needs; every changed line traces to the task; delete only the orphans you created; "step → how I verify" | developer agent |
| ponytail ideas | The smallest-complete-change ladder (reuse → stdlib → dependency); the never-cut list; `shortcut: <limit>, <when to upgrade>` comments → a PM-owned debt ledger each sprint | developer, PM (`/sprint-review`) |
| taste-skill `references/app-screens.md`, `tells.md`, `critique.md` | Anti-slop rules for working screens. **DIRECTION.md wins on conflicts** (rule order: BRD/security → accessibility → DIRECTION → ui-ux-guide → taste) | ui-designer |
| ui-ux-guide fix | 60-30-10 → "neutral base, one blue, agent hues"; uppercase tags untracked at ≥12px | ui-ux-guide skill |

## B. Bench product: built-in skill library (proposed CR-005)
Bundled with MIT/Apache notices and **without hooks, installers, telemetry or unpinned downloads**. Cross-references are rewritten. Loaded per role through the SDK `skills` option.

| Bench role | Built-in skills |
|---|---|
| CEO (intake) | brainstorming (obra, text only, no web companion), grilling (mattpocock) |
| BA | grilling, to-questionnaire, research (mattpocock), domain-modeling |
| PM | writing-plans (obra), debt-ledger (ponytail idea), retro patterns |
| Tech lead | constraint-driven-development, api-and-interface-design, documentation-and-adrs, doubt-driven-development, observability/performance/ci-cd/shipping (addy), codebase-design (mattpocock) |
| Developer | test-driven-development, systematic-debugging, verification-before-completion, receiving-code-review (obra), incremental-implementation, source-driven-development (addy), diagnosing-bugs, prototype, pr (mattpocock), plus our developer principles |
| QA | systematic-debugging, verification-before-completion, security-and-hardening + the security-auditor approach (addy) |
| UI designer | taste-skill 2.1.4 (scripts behind Bash and network approvals, CDN libraries vendored), ui-ux-guide, frontend-ui-engineering (addy) |
| Reverse engineer | competitor-teardown, research (mattpocock) |
| System (router, curator) | A **terse mode** for model-to-model messages only (caveman rules rewritten, unbranded, A/B tested before default); memory compression (the caveman-compress approach) for the curator |
| Bench Memory | graphify ideas: provenance tags on edges (EXTRACTED / INFERRED / AMBIGUOUS), communities, "god nodes", surprising links for the curator, path/explain next to `build_context` |
| Usage meter | ponytail band ideas (cost, tokens, agent time, reuse and tests per task), built from SDK usage data |

**Never bundle:** any SessionStart/SubagentStart injection hook, meta-router skills (using-superpowers, using-agent-skills), the caveman CLI/proxy/cloud, graphify's Python runtime, unpinned `npx …@latest` MCPs, and anything without a license.

## C. The client's machine (needs approval: changes the Claude Code setup)
1. Install the `mattpocock-skills` plugin (1.3.1).
2. Then remove the **stale or duplicate loose copies** in `~/.claude/skills`. 11 skills were removed upstream: to-prd, to-issues, request-refactor-plan, design-an-interface, diagnose, qa, review, write-a-skill, edit-article, ubiquitous-language, zoom-out. Also the stale grill-me, and copies that conflict with the plugin.
3. Replace `caveman` with the upstream `skills/caveman/SKILL.md` (v4.0.1) file only.
4. Upgrade `design-taste-frontend` to 2.1.4.
5. Don't install the superpowers, ponytail, caveman or graphify plugins.

(An optional pinned graphify CLI for our own code analysis, code-only with `GRAPHIFY_BACKEND=none` and no hooks, is left for later.)
