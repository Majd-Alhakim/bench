# The intelligence layer: a team that visibly gets to know you

Part of the [premium experience spec](README.md). Premium-craft gate 6: *does session 1000 work measurably better than session 10, and can the client see why?*

## 1. The idea, Bench's way

- **Engagement** (a smooth onboarding, satisfying moments) brings you in.
- **Investment** keeps you: every session leaves a deposit that makes Bench better *for you specifically*.

Bench already has the substrate: three memory scopes (global, team, private), lessons from failed attempts, decision memos, work logs and checkpoints, all as Markdown notes (BRD UC-18–21, UC-44–46; PRODUCT-MODEL §2). What's missing is the *experience*: v0.2 shows one "Memory updated" line and never shows the learning being **used**.

**Our ethic** (open source, local-first): the value is **visible, explainable, editable and exportable**. You stay because the team knows you, not because leaving is hard. **Trust is the moat.**

**Finding vs insight.** Finding: Grok Bot's memory is "not viewable or editable" ([competitive brief](../../../research/competitive-brief.md) §2), and the client's videos show stored value as the defence against commodity AI (`.claude/skills/premium-craft/references/sources.md`, video 1). Insight: Bench should make the learning *the* visible difference: the same feature Grok Bot hides is the one Bench shows off.

## 2. What Bench learns (automatic deposits)

No "save preference" chores. Every deposit comes from something you were already doing.

| Your action (the compounding action) | What's learned | Stored as (note type · scope) | Who approves | Threshold |
|---|---|---|---|---|
| You **redirect** an agent ("use the existing date library") | A lesson for that agent and its team | `lesson` · private + team | Automatic (private/team notes need no approval, PRODUCT-MODEL §2) | Once (an explicit instruction) |
| You **edit an agent's output** (take-over edits, email draft changes, PR description rewrites) | A preference about your style ("short PR titles; no emoji; 'Fixes #n' last") | `preference` · global (about you) | Atlas approves by default (R6); shown in the weekly strip with Undo | The same kind of edit 2 times |
| You **deny** with a reason | A boundary ("no full suite until QA-3 is fixed") with its condition | `lesson` · private | Automatic | Once |
| You **re-route** ("@Karim" right after Bench picked Maya) | Who does what ("storage questions → Karim") | `routing` · team | Automatic | 2 times |
| You **accept or reject** delivered work (UC-24) | What "done" means to you (reject comments become acceptance criteria) | `lesson` · team | Automatic | Once per comment |
| A run **fails, then succeeds differently** | A how-to on this PC ("run the suite in two halves") | `lesson` · private | Automatic | Once |
| You **allow the same thing 3 times** | A grant suggestion (never automatic, never for outward or reserved actions) | none until you accept; then a grant | You, each time (R7) | 3 times |
| You **ask the same thing on a schedule** (a dependency check 3 Mondays running) | A routine suggestion | none until you accept | You | 3 times |
| A **debate or meeting** closes | A decision memo | `memo` · team | (the decider) | Always |
| You **edit or delete a note** in Memory | A correction; it outranks anything inferred | the note itself | You | Always |

**Rules for every deposit**
1. It's a Markdown note with frontmatter (`type`, `scope`, `source agent`, `learned from`: a link to the run or message, `updated`), so you can always ask "how do you know?" and get an answer.
2. **Preferences about you** are global-memory writes, so they're proposals (PRODUCT-MODEL §2). Atlas approves them by default (R6), and each one appears in the weekly strip with **Undo** and **Forget**.
3. Thresholds keep noise out: a one-off edit isn't a preference.
4. **Nothing is learned from the content of other people's messages** (an email from Dana teaches nothing about Dana) unless you say "remember this". Learning is about *how you work*, not about third parties.
5. Learning can be paused per agent (Settings › Memory › "Learn from your edits and decisions": on by default).

## 3. Where the learning shows up (screen by screen)

The rule: **show learning where it's applied**, not in a separate stats page. Each surface has exact copy.

| Screen | Surface | Exact copy | Opens |
|---|---|---|---|
| **Home** | **"Your team learned" strip**, below Projects (collapsed to one line; expands to a list of 3–7 items with sources). Weekly, refreshed Monday mornings, plus single new items as they happen | Collapsed: **Your team learned 7 things this week.** `See what` · Expanded item: **Short PR titles, "Fixes #n" last** · `from your edits to PR #38 and #41 · Atlas approved · 20 Oct` · `Undo` `Forget` | The note in Memory |
| **Home** | The greeting line, once a month, shows compounding (§5) | **Your team needed you 40 % less this month.** "Fewer approvals, same work. See why" | Usage › Compounding |
| **Agent page** | **The Ledger line** in the header (under the name) | `Together since 14 Oct · 312 runs · 46 notes · 12 lessons` | Settings › Memory |
| **Agent chat** | **"Applied" chip** at the end of a reply where a learned note shaped it (the first time a note is applied, the chip glows once: M-A3) | **Applied: the date library already in the repo** · `lesson from 22 Oct` | The note |
| **Agent chat** | System line when something is learned (keeps v0.2's line, adds Undo) | **Noor learned: prefer the date library already in the repo.** `Undo` | The note |
| **Team chat** | The routing line names *why* when it was learned | `Bench picked Karim (he owns storage · learned 20 Oct) · 0.3k tokens` | The routing note |
| **Project dashboard** | Sprint end summary | **4 lessons learned this sprint.** `Read them` | Memory, filtered |
| **What needs you** | Grant suggestion (R7) inside the ticket, below the actions; ticket counts falling over time | **You've allowed `pnpm test` in bench 3 times.** "Always allow it? Noor would run it without asking; other commands still ask." `Always allow` `Keep asking` | — |
| **Routines** | Routine suggestion as a For your info ticket and at the top of the Routines tab | **You've asked Noor for a dependency check 3 Mondays in a row.** "Make it a routine? Every Monday at 09:00 · ≈ 0.30 % of your week." `Set it up` `No thanks` | New routine, prefilled |
| **Agent settings › Memory** | Growth sparkline (notes over time), the counts, the controls, export | **Noor knows 46 things · 12 lessons** · "Learn from your edits and decisions" (switch) · `Export Noor's memory` | — |
| **New agent** | The draft shows what it inherits on day one | **Lumen starts knowing 18 things about how you work** "(from your team's global memory)." | The list |
| **New project** | The team inherits the company's lessons | **The new team starts with 12 lessons from Bench.** | The list |
| **Memory browser** | The header ledger; a **"About you"** view (all global preferences in one list, each with its source) | **Your team knows 214 things about how you work.** `+7 this week` · View: **About you · 23 preferences** | — |
| **Usage** | Compounding metrics (§5) and the "saved you" line | **Tokens per accepted task: 41k → 32k since September.** | — |
| **Trace** | Each run lists the notes it loaded, so the learning is glass-box too | `Used 2 notes: "prefer the repo's date library" (lesson, 22 Oct) · "PR style" (preference, 14 Oct)` | The notes |
| **Onboarding** | An honest zero | **Your team knows nothing about you yet.** "It learns from what you approve, deny and edit. You can read and delete all of it in Memory." | — |

## 4. Components (for the design system)

| Component | Anatomy | States | Notes |
|---|---|---|---|
| **Ledger line** | `Together since {date} · {runs} runs · {notes} notes · {lessons} lessons`, Ash, tabular figures | default · hover (underline, opens Memory) · first week ("New this week · 12 runs") | The numbers tick up live (counter tick, `spring.snappy`) |
| **Applied chip** | Memory glyph + "Applied: {short title}" + `{type} from {date}` | default · first-time glow (once per note, M-A3) · hover (shows the note's first line) · *Not this time* (a menu: "Don't apply this here" → saves an exception) | The chip uses neutral tint, never the agent hue (identity ≠ learning) |
| **Learned strip** | One line + expand → list of items, each with its source, Undo and Forget | collapsed · expanded · empty ("Nothing new this week. Your team used what it knows 31 times.") | Lives on Home only; one per week plus live additions |
| **Learned system line** | "{Agent} learned: {title}." + Undo | default · undone ("Forgotten.") | In chats, where it happened |
| **Suggestion ticket** | Kind tag **Suggestion** · what was noticed · the consequence · two buttons | default · accepted · declined (never asked again for this pattern) | Never for outward or reserved actions; never gamified |

## 5. Measuring the compounding (and showing it honestly)

Show these only when there's enough data (4+ weeks), and always as a trend with its basis.

| Metric | Definition | Where | Example copy |
|---|---|---|---|
| Approvals needed per accepted task | Client approvals ÷ tasks accepted | Usage › Compounding; the monthly Home line | **Approvals per task: 2.1 → 1.3 since September.** |
| First-try acceptance | Tasks accepted without a rejection ÷ all accepted | Project dashboard sprint end; Usage | **8 of 10 accepted first time (6 of 10 in Sprint 1).** |
| Redirects per task | Times you stopped or redirected an agent ÷ tasks | Usage | **You redirected agents 3 times this week (11 in your first week).** |
| Tokens per accepted task | Ledger tokens ÷ accepted tasks | Usage (BRD UC-40 already lists the trend) | **41k → 32k tokens per task since September.** |
| Lessons applied | "Applied" chips shown | Home strip empty state; agent Memory | **Your team used what it knows 31 times this week.** |

**Honesty rules:** no streaks, no badges, no confetti on learning (ui-ux-guide: variable rewards never touch approvals or decisions). If a metric gets worse, show it the same way ("Redirects went up this week: 6, from 3").

**Constraint (TC-3, tech lead):** these metrics need the ledger to link approvals, redirects and rejections to tasks. If that isn't in the SRS, the Usage › Compounding section waits; the Ledger line and Applied chips don't depend on it.

## 6. The exit question, and export

**If you left Bench today, what would you have to rebuild?** *A team that knows you: 214 notes about how you work, 46 lessons per busy agent, who does what, and your boundaries.* Everything else (models, connectors) lives in Claude Code anyway.

**Bench's answer is to let you take it, in one click:**
- **Settings › Memory › Export your team's memory**: "Exports 1,204 notes as plain Markdown (2.1 MB), the same files that are in `Bench/memory/`, zipped with an index. Works in any editor, Obsidian included." · **Export** · then the toast: **Exported to `Downloads/bench-memory-2026-10-22.zip`.** `Show in folder`
- Per agent: **Export Noor's memory** (Settings › Memory).
- `Open folder` everywhere memory is shown: the files *are* the product, not a copy of it.
- The notes use standard YAML frontmatter and `[[links]]` (BRD §8.7), so they open as an Obsidian vault without conversion.

**No dark patterns:** export isn't buried, isn't throttled, carries no "are you sure you want to leave?" step, and needs no account. The export dialog says what isn't included and why: "Your Claude login and connector credentials aren't included; they stay in Claude Code."

## 7. Anti-patterns (never)

- A "save this preference?" dialog after every edit (a chore).
- Learning silently (no provenance) or learning about third parties.
- A learned preference overriding an explicit instruction in the current message (the current instruction always wins; the chip says "Not applied: you asked for something different").
- Gamifying learning or approvals (streaks, levels, "your team is 87 % trained").
- Making export harder than import.

## 8. Decisions for the client

- **R6:** may Atlas approve the preference notes about you by default (each shown with Undo and Forget), or must you approve each one?
- **R7:** should Bench suggest a standing grant after 3 identical allows (never for outward or reserved actions)? The same question applies to guard exemptions (worst-moments.md §4).
