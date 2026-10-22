# Interview: BRD v0.1 open issues (batch 5)

- **Date:** 2026-10-22
- **Interviewer:** PM
- **Client:** founder
- **Source:** the top open issues in BRD §10

## Answers (verbatim)

**#1 Content pipeline**
> Maybe, since we're making it product-based, we can make a dashboard page somewhere for each product or project. I don't know. We have a product or a project, and then we have the project manager or product manager, and we have his team or its team. Somewhere there, it should be displayed, and it has the backlog with the highest-priority stories or tasks shown first. If I want, I can click there to have the full expanded file to check all the user stories and tasks in the backlog and view the full backlog. There, I can view tasks in To Do for that sprint, tasks in progress, and done tasks. Each sprint is different and changes, but the dashboard is the same. The dashboard is just one place, but the content changes based on the sprint.

**#2 Group debate**
> So, the idea when I said that: why not, when there's something that the product wants to show me, with the product manager and the BA, could we get something like a TM (a temporary session, a meeting session)? We discuss, test, and tell my opinions and my feedback. Let the group debate. The debates happen in such places: the stakeholders related to the point of debate gather in a session, a group meeting, which is temporary. They argue for 5 minutes maximum and have to reach an agreement after 5 minutes of going back and forth. There should be the team lead or the product manager, or whoever takes the final decision. The higher one in the hierarchy is the one who decides. Everyone argues and gives their opinion, and they might reach a shared agreement before the time finishes. If we reach 5 minutes and still no decision is made, the team lead would take the final decision for this debate. Then the decision memory is saved. What is saved in the memory is the decision, and the meeting is deleted. The memory of this session or this meeting is saved somewhere, and who attended and everything is saved in the memory. However, the group chat is deleted after it finishes.

**#3 Gmail triage**
> Now, the Gmail Connect connection is not for a certain agent. I can add it for anyone I want, but mainly I would make it for the CEO. Mainly, he is only the one who has, for now, the Gmail Connect connection. Just for me, he can send me emails for urgent things. He reads my emails and sees what things I should care about. He acts as the one who runs my business. I am an owner, and he is the CEO, and he owns my business. He always communicates with me, tells me updates, and checks my emails. He runs my business. You can think about it this way.

**#4 Proposal approval**
> Maybe I can view it, and I accept it or reject it before he sends it. Maybe I can change my mind, or maybe he has to ask me for approval. This is what I understand about the problem, the idea that you have, the task, or the thing that you want to do. Is this right? I would tell him, "Yeah, correct." It would be something general, like the problem statement, the thing that I want to build, the thing that I want the team to do, or something general. He would have a one-pager .md file about this thing, and I will look at it as a proposal. I will see it, check it, and I will approve it if the understanding is correct. I would not go with him into much detail, but it would be just a general idea. The details come later when the product manager takes the proposal, thinks about it, and starts requirement gathering and discovery sessions.

**#5 Deputy scope**
> Is the PT limited to editing agent cards and instructions? I don't know, maybe. Maybe more than that. I'm not sure. I can't tell you what exactly. I can think of what the CEO can do, but basically, as I said, imagine him as someone who is running my business. Mainly, he has most of the permissions that I would have, except the ones that are major, like: deleting something big, adding something big, deploying, paying. I would not accept any agent paying from my cards. If anything needs payment, it should tell me. These are strict rules. However, anything related to work, things with the agent, it should have access to.

**#6 Outward actions**
> No, they don't count. It's okay if they push or send an email, but they don't send an email. They just draft it. They send an email only for me, or if I explicitly asked them to reply to emails. If I didn't, it shouldn't send email randomly. It can put me in trouble for something that I wasn't aware of. If there is an email that I have to be aware of and that I should reply to or take action on, it should tell me: "This action, this thing needs your action in the email. I drafted this email for you. Would you want me to send it, or do you have changes for it?"

**#7 Private memory**
> Yeah, yes, they can, if needed, only, not always. Just to not make the context and draw the context of this agent, the team lead agent, for no reason

**#8 Senior BA**
> Consider him as a BA lead from day one. Just one agent. As I mentioned before, every product, every project, or everything that I want to make will automatically make another project with these same agents, and I can manage them. I can remove one, add one, or change something on it. It's fully customizable. This is what I mean: it's not just "this is how it works." I can enter and see only the main bot or the main agent, and then I can add the main agent or another agent, and that's it sometimes. I can customize what the Grok bot is doing.

**#9 14-day deliverable**
> Let's say after 14 days, I want this certain application to be fully ready to be open-sourced at any moment after 14 days, as a full application.

## PM interpretation (to confirm in the clarifications below)

| # | Resolution |
|---|---|
| 1 | The answer describes a **project dashboard**, which strengthens UC-26: one dashboard per project (team, highest-priority backlog first, expandable full backlog, current sprint To Do / In Progress / Done; the layout stays the same while the content changes per sprint). The content pipeline itself is still undefined → C1. |
| 2 | **Debate = a temporary meeting session** of the stakeholders involved, **timeboxed to 5 minutes**. They may agree early; otherwise the **highest-ranked participant in the tree decides**. The **decision + attendees + rationale are saved to memory, and the chat is deleted**. Review sessions with the PM and BA use the same mechanism. What happens to the trace → C2. |
| 3 | The Gmail connector can be assigned to any agent; **day 1: the CEO only**. The CEO reads the client's email, flags what matters, drafts replies, and may **email the client** about urgent things. It acts as the business's CEO. |
| 4 | **The CEO writes a one-pager proposal (.md)**: problem, what to build, what the team should do. **The client approves or rejects it** before it goes to the PM. Details come later from the PM/BA discovery. |
| 5 | **The Deputy has broad authority** over all work-related actions. It may **not**: delete something big, add something big, deploy, or pay. **No agent ever pays**: payments always go to the client (strict). What counts as "big" → C3. |
| 6 | **`git push` is not outward.** Email: agents **draft only**. Sending is allowed only **to the client**, or when the client explicitly asked for a reply to be sent. Emails needing action → "needs me" item: "I drafted this, send it or change it?" |
| 7 | A lead may read a worker's private memory **only when needed** (on demand, never loaded by default). |
| 8 | Day-1 tree gets a **BA lead (one agent)**. **Every new project is created from a project template** (the same agents), and the client can add, remove or change any of them. Minimal setups (only the main agent) are fine. |
| 9 | Named deliverable: **an application fully ready to be open-sourced within 14 days** → C4 (which application). |

## Clarifications (answered)

| # | Question | Answer |
|---|---|---|
| C1 | Keep the content pipeline in the MVP? | **Drop it from the MVP.** It can come later as a project template. |
| C2 | Debate or meeting transcript after deletion | **Archive and hide it.** The chat leaves the client's views and agents only remember the decision memo. The raw transcript stays in the trace archive for audit until retention removes it. |
| C3 | Which "big" actions the Deputy can't take (they need the client) | **All four:** delete agents, projects or repos · create permanent agents or projects (the CEO may still draft them) · deploy, release or merge to `main` · spend money or use paid services (agents never pay). |
| C4 | Which application must be open-source ready in 14 days? | **Bench itself:** 14 days after build starts (Gate 6). PM note: very ambitious for 42 use cases, so the PRD's MVP cut and phasing must make it achievable. |

## Decision D1: no scope cut (2026-10-22)
> No don't cut, it is achievable don't worry i want to test the limits, form experience 14 days for agents is long time

**Recorded:** Bench keeps the **full MVP scope** (all Must use cases). The target stays **open-source ready 14 days after build start (G6)**. The PRD *sequences* the work into 3-day sprints; it doesn't cut anything. The PM tracks the risks (usage-limit throughput, the client's review bandwidth, CI time) from Sprint 1 velocity and raises them early if the trend misses the target.

## Batch 6: business-critical open issues from BRD v0.2 (2026-10-22)

| BRD §10 | Question | Answer |
|---|---|---|
| #4 | Budgets: accept the proposed per-agent caps? | **No per-agent caps.** Only the overall plan-usage meter and the 30% weekly-headroom guard apply. |
| #6 | Data retention | **Proposed defaults:** trace details and archived transcripts 90 days, then summarized; email items 30 days, bodies never stored; cost ledger and approval log kept indefinitely. Deleting an agent removes its files and memory; its logs stay labelled "deleted agent". |
| #7 | Which edge cases need no approval? | **Labelling/archiving Gmail** and **opening pull requests** need no approval. **Standing reply rules: not allowed**, so each email reply sent to someone else needs the client. |
| #27 | Project template: copies or shared agents? | **Each project gets its own copies** of the template agents, with their own memory. Global memory stays shared. |
| #12 | One agent in several places? | **One home node, guest elsewhere.** |
| #29 | Deputy self-limits | *"Give Gmail to other agents but with strict rules like CEO might need to hire and assistant that handles the repetitive tasks it still require me to approve before sending anything"* |

**Interpretation of #29:**
- The CEO **may give Gmail to other agents** (for example an assistant it hires for repetitive email work), under strict rules: **anything those agents send still needs the client's approval.**
- The CEO **may not widen its own powers** (not selected).
- If the "assistant" is a *permanent* agent, creating it still needs the client (C3). The CEO may hire a *freelancer* assistant on its own.

**All other §10 items:** the BA's proposed defaults are accepted for now and carried into the PRD/SRS. The client will correct them against the prototype.

## Addendum: context checkpoint (B6-CTX, 2026-10-22)
> something that all the agents should do is when they reach 80% of there context limit (out of 1M) they should to save their work and update their memory file and then auto compact, and that would help in saving usage limit

**Recorded:** every agent, at **80% of its context window**:
1. saves its work in progress
2. updates its memory (private, plus a team work-log entry)
3. auto-compacts

**PM notes:**
- The threshold is a per-agent setting, default 80%.
- The tech lead will verify in the SRS how the Agent SDK's compaction threshold and its `PreCompact` hook support "save, then compact".
- The tech lead will also measure whether an earlier default saves more usage. Every turn re-sends the whole context, so a smaller context is cheaper on every turn, even with prompt caching.

## Context checkpoint, refined by the client (B6-CTX2, 2026-10-22)
> okay here is what I am thinking and correct me if I am wrong or missed something. Let the agent run until they reach 80% of context then update the memory and savig it work at natural breakpoint using a fixed format and including things that already we tried and failed or mistakes and its fix, and then this agent is restart as a fresh session uploading the memory of the previous version and continue working. this combines all 4 I believe

**Recorded rule:**
1. The agent runs until 80% of its context window.
2. At the next natural breakpoint, it saves its work and writes a **checkpoint in a fixed format**, including **what was tried and failed, and the mistakes made and their fixes**.
3. It updates its memory.
4. It **restarts as a fresh session** loaded with that memory and checkpoint, and continues.

This replaces summary-style compaction. PM additions are proposed in the chat.

> Also I heard that using a memory vault like obsidian or similar apps will make the agents much smarter and cheaper can we discover this option?

→ Research launched on Obsidian-style memory vaults (outcome to be recorded in docs/research/).

**Client approval of the PM's four additions (B6-CTX3):** *"yes do that"*
- Hard checkpoint at 90%.
- Lessons go to long-term memory.
- The fresh session confirms its next step.
- The old session is archived.

**New question from the client:**
> what does it take to make a system like obsidian that makes out thing better and independent from other apps like obsidian but we gain the same or close effects ?

## Bench Memory scope (B6-MEM, 2026-10-22)
On the curator and semantic search: *"add them as layers to the plan"*. On the scope question: *"all plus the other two"*.

**Recorded:** Bench Memory is **in the MVP with all six layers**:
1. Notes on disk: Markdown, frontmatter, `[[links]]`, Obsidian-compatible
2. Index and search: SQLite full-text search, tags, backlinks
3. Agent memory tools (MCP): search, read, build_context, recent, write; single writer; source recorded
4. The client's memory browser: editor, backlinks, graph view, filters, stale flags
5. Curator: background dedupe, merge, staleness sweep
6. Local semantic search: on-device embeddings, hybrid with full-text search

Design reference: docs/research/memory-vault.md.

## Remaining open issues answered (B7, 2026-10-22)

| BRD §10 | Answer |
|---|---|
| #14 Team links | **D:** leads by default. Members may *ask* each other questions across a link, but tasks go through the leads. |
| #31 Guests | *"rather than transferring the full agent the team lead will request other team lead to hand them on agent as guest then the team lead would approve and ask the required agent to generate to do what he does when they reach the context limit (what we agreed on that it saves and start fresh) but here it only saves and then the team lead of that team will send a copy of the instructions and memory and everything related to that agent and the other team lead who requested the agent it create a copy of that agent on their team and assign it tasks and when finished it deletes it so there is no duplicates"* |
| #10 System tray | **A:** Bench keeps running in the system tray; "Quit" in the tray stops everything. |
| #32 Names | **C:** each project copy gets a personal name (e.g. "Maya, PM of Project X"); Bench suggests names and the client can change them. |
| #34 Checkpoint limits | **(a):** a fixed 90% ceiling; each agent's threshold can be set between 50% and 85%. |
| #35 Bad checkpoint | **(a):** before the old session closes, Bench checks all eight sections and has the agent fill any gaps; it escalates only if the checkpoint is still incomplete. |

**Interpretation of #31, the "agent loan":**
1. The requesting lead asks the owning lead for an agent.
2. The owning lead approves.
3. The agent writes a checkpoint (save only, no restart).
4. The owning lead sends a copy of the agent's instructions, memory and related material.
5. The requesting lead creates a temporary copy in its own team and assigns it tasks.
6. When the work is done, the copy is deleted, so there are no duplicates.

**PM proposal, pending client confirmation:** before the copy is deleted, its work log and lessons are merged back into the original agent's memory, so its learning isn't lost.
