# Dogfooding: one agent ran a team for an evening (2026-10-25)

**What this is.** One long Claude Code session in the Claude desktop app. The client talked to a single agent (Claude, acting as PM/CTO), and that agent handed work to helpers and brought back only the decisions that were the client's. Without planning it, this was Eucas's core loop, done by hand with today's tools. The client's own words, at the end of the evening:

> "the way that you are running this session and another session and reporting to me is actually was the whole idea of eucas agents but in much nicer and controller way"

This note records what worked and what was clunky, and maps each clunky moment to the Eucas feature that fixes it. It's evidence for CR-010, and material for build-in-public posts.

## What the one agent got done

| Work | Done by | Result |
|---|---|---|
| Thinking orbs, gooey +, voice glow and pinned Eucas in the prototype | the main agent | [eucas-app/eucas#52](https://github.com/eucas-app/eucas/pull/52) |
| Local dictation: Whisper, then a 7-setup benchmark leading to Moonshine for English (~0.5–1 s a pass) | the main agent + headless Edge tests | in #52 |
| The Atlas notch, from brainstorm to approved design | the main agent + a **builder-check reviewer** | [design](../design/ux/2026-10-25-atlas-notch-design.md) |
| CR-009 impact analysis | a **tech lead** helper (effort, risk, sprints) + the main agent (requirements) | [CR-009](../requirements/change-requests/CR-009.md) |
| BRD v1.3 and PRD v0.4, written in parallel | a **business analyst** + a **product manager** helper | [eucas-app/eucas#53](https://github.com/eucas-app/eucas/pull/53) |
| What Anthropic's terms allow for a paid app | a **terms researcher** | fed the monetization grilling |
| Can work continue while the laptop is closed? | a separate **spike session** | [eucas-app/eucas#54](https://github.com/eucas-app/eucas/pull/54): GO with limits |
| Real pain points in the market | **three researchers in parallel** (GitHub issues; Hacker News; blogs, reviews, launches) | six ranked opportunities |
| The money plan | the main agent grilling the client, 31 questions over 11 rounds | pending the final write-up |

That's 9 helpers and one separate session. The client typed to one agent the whole time.

## What worked

- **One point of contact.** The client never had to know which helper did what. Questions came back ranked, each with a recommendation, so most of them were a "yes".
- **Parallel work.** The BRD and PRD were rewritten at the same time by two helpers, each told to touch only its own file. Three market scans ran at once.
- **Decisions stayed with the client.** Approvals, prices, the licence and the plan order were always asked, never assumed. When the spike wanted to create something on the client's own account, it stopped and asked.
- **Findings were checked, not just passed on.** A helper's summary was treated as a claim. For example, the PRD helper's point totals were re-added (44, not 43), and the push block was investigated before anything was overridden.

## What was clunky, and the Eucas feature that fixes it

| What happened | Why it hurt | Eucas feature |
|---|---|---|
| The client approved a live test, but the spike session **rejected the approval because it was relayed** through the main agent, and the client had to approve again in the other session | Double work; the client has to know where to click | **Approvals routed to the right agent with the client's own words attached**, so one yes reaches whoever needs it ("what needs you", BR-86) |
| "There's an agent running for an hour, what is it doing?" It was an idle mockup server from an earlier step | No way to see what's running or why | **A live view of every agent and task**, with what each is doing and since when |
| Helper reports arrived as short text notes the main agent had to read and relay | Status was buried in chat | **One inbox and the notch**: a quiet marker, checked when the client wants (BR-94) |
| No way to see what each helper cost | Spend was invisible, which is pain point #1 in the market scan | **The token ledger**, per agent, per handoff and per task |
| An open question (Q31) had to be remembered across several turns while waiting on the spike | Easy to lose a decision | **Open decisions tracked** until answered |
| The spike session's branch was missing the main agent's latest commits | Helpers can work from stale context | **Handoff briefs** (task, summary, artifact references) and shared memory |
| A helper's file-backed summary was nearly too large to read | Context overload | **Roll-ups and digests** instead of raw dumps |

## Why it matters

The market scan's strongest pain point is *"the constant context-switching to continue prompting whichever one needs attention is brutal"*. Tonight the client did none of that: one agent was the scheduler. Every rough edge above is a feature already in Eucas's design or in CR-009/CR-010. This evening is the demo.

**Build-in-public line:** *"I planned my app's whole business model in one evening by talking to one agent that ran a team for me. Eucas is that, without the rough edges."*
