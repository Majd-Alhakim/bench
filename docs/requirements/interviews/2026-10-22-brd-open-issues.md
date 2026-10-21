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
