# Interview: Users and roles (batch 1)

- **Date:** 2026-10-21
- **Interviewer:** PM, with questions prepared by the BA
- **Client:** founder
- **Status:** answers recorded; follow-ups in batch 2

## Answers (verbatim where the client wrote free text)

| # | Question | Answer |
|---|---|---|
| Q1 | What else may the main agent do without asking? | **Deputy**: edit agent cards and instructions, approve global-memory writes, and approve other agents' tool requests *within permissions the client has already granted*. Creating and deleting agents stays with the client. |
| Q2 | Who may hand off to, or ask, whom? | *"Now, I'm thinking this way: I can have a project of agents, or let's say a department of agents. Let's say a development department where I have different agents, and each agent is a developer or something in this department. They can communicate with each other and with related departments or related projects. Other than just specifying each, we have: what projects, what agents, and what agency each agent can communicate with or hand off to; what other projects, departments, or teams each project can communicate with. Name it what you want. A design team can communicate with the development team, or this kind of thing. I assign these roles as a user."* |
| Q3 | Can agents create agents? | *"Exactly like what Claude could do. It gives you a temporary agent that does a certain task, and then it just removes it, ignores it, or deletes it. I'm thinking about it: if we think about it from a business perspective, we say that I hire a freelancer for a certain task, and then I release them. I would take temporary helpers, but with this in mind."* |
| Q4 | Autonomy per agent | **Presets + per-tool overrides**: "Ask every time" / "Trusted" / "Autonomous" (everything except outward actions). |
| Q5 | Approval needed while the client is away | *"For now, since it's just a desktop application, just let it wait in the inbox. Wait for me to give it permission or to review what it has. It's not a big deal. Next, since we would have an application for desktop, I believe making an Android or a mobile app companion would be an easy job to do. Then we would consider doing things about these approvals or emails, like having them come as notifications to my phone or something like that. I can answer from my phone. We will think about this later."* |
| Q6 | System helpers' visibility | **Labelled system lines** in the chat, with cost; they are configurable in settings but not on the roster. |
| Q7 | The client's role in groups | **Participant or observer**, set per group. |
| Q8 | Agent lifecycle | **Draft, Active, Paused, Archived, Delete (confirmed), plus Duplicate without memory.** |

## Summary of requirements (BA interpretation, to be confirmed in the BRD)

- **New concept: Teams** (working name; the client said "name it what you want"). Agents are grouped into teams, such as departments or projects. The client defines the communication rules:
  - agent → agent
  - agent → team
  - team → team (e.g. Design ↔ Development)

  This replaces the earlier "flat" handoff assumption.
- **Main agent = Deputy.** It acts on the client's behalf for in-app decisions within the permissions the client has granted. Creating and deleting agents, and outward actions, remain with the client *[confirm in batch 2]*.
- **Freelancers** (temporary helpers): an agent can "hire" a short-lived helper for one task, which is released afterwards. It's not on the permanent roster *[rules in batch 2]*.
- **Approvals:** they wait in an inbox on the desktop. Phone notifications are **out of scope for the MVP**.
- **Future scope (parked):** a mobile companion app (Android first) for approval notifications and email.

## Batch 2 answers

| # | Question | Answer |
|---|---|---|
| Q9 | Can an agent belong to more than one team? | *"think of it this way, we have the chef officers and they have access to everything in their department, and the CEO is the only agent that has full access everywhere and it is the main one that I always speak to. Then under each officer there will be product managers that run full projects and they can communicate with their teams and under the product manager we have teams for devs, design etc and inside teams there is workers. now this is just an example template not a set rule, I can anytime make my own choices about the structure but the thing I want that I can do all of this like a tree"* |
| Q10 | Team memory? | **Yes**: three layers, global → team → private. |
| Q11 | Team leads? | *"this is a follow up to first question imagine it as a tree, each node has children, so there should always be one point of contact for the higher nodes. for ex: design team has multiple agents ui and ux etc.. and they have a design team lead and since from question 2 every team has a shared memory each agent in the team should always add an update to their memory in its place, like agent1 logs: I did this and that on 10 oct 2027 and this and this happend and then the team lead is the one following up with these agents and reading the logs of on their memory and updating the shared team memory and everytime it is the point of contact from a higher node in this case lets say product manager asked the design lead about updates then it send the upadtes and then product manager update their memory and officer reads all product managers memeories and update their department memory and whenever I ask them on the group of directly or ask the ceo then they answer from their and give me the latest updates and what needs me. now this is how human run businesses its up to the user to choose their structure but you can suggest a better way that is cost effective and make more value for agents and user and suggest that as template"* |
| Q12 | May the Deputy approve outward actions? | **Never.** Outward actions always go to the client. |

## Summary after batch 2

- **Org tree (core concept).** The client builds any structure as a **tree**, and can change it at any time.
  - **The root is the main agent** ("CEO"): it has full access and is the one the client always talks to.
  - **Every node with children has exactly one point of contact (lead)** toward its parent.
  - Example template only (not a preset): CEO → chief officers (each has access to their whole department) → product managers (each runs a project) → teams (dev, design…) → workers.
- **Access follows the tree.** A node sees everything below it. The CEO sees everything.
- **Memory follows the tree.** Each node has shared memory: team, project, department, company (global).
  - Workers log what they did (dated) into their team's memory.
  - Leads consolidate their team's logs into the team memory and report upward on request.
  - Each level up reads the summaries of the level below.
  - The CEO answers the client with the latest status and **"what needs me"**.
- **The client asked the PM to propose a more cost-effective version** of this roll-up as the default template (see the proposal in batch 3).
- **Deputy limit:** outward actions are never approved by the main agent.

## Batch 3: PM proposal and answers

**PM proposal ("lazy roll-up")**, presented to the client:
1. The app writes the work logs from task records (0 tokens).
2. Leads re-summarize only when a parent asks and the log has changed, plus an optional daily Haiku refresh; otherwise the cached summary is reused.
3. Summaries are fixed-size: Done / In progress / Blocked / Needs you, ≤300 words.
4. "What needs me" is a live, non-LLM list (approval inbox, blocked tasks, questions addressed to the client).
5. Parents can read down the tree (read-only); commands go through the leads.
6. Keep trees shallow. The default template is CEO → teams (lead + workers); add officer or PM levels only beyond 3 teams.

| # | Question | Answer |
|---|---|---|
| Q13 | Use lazy roll-up as the default? | **Yes.** |
| Q14 | Can the client message any agent directly? | **Yes, anyone.** The conversation is logged so the lead stays informed. Agents themselves follow the tree. |
| Q15 | Who can hire freelancers? | **Any agent, within its limits.** A freelancer gets a subset of the hirer's tools, connectors and budget, is visible in the trace and cost meter, and is released when its task is done. |
| Q16 | Open tasks when an agent is paused or archived | **Return to its lead** (parent node), which re-assigns or escalates them. |

## Consolidated actors and roles (input for the BRD)

| Actor | Type | Role |
|---|---|---|
| Client (founder) | Human | Owner. Builds the org tree, creates and deletes agents, approves gates and all outward actions, can message any node, and joins groups as participant or observer. |
| Main agent ("CEO", root node) | System agent | Deputy: full read access, edits agent cards, approves global-memory writes and in-app tool requests within the client's grants; never approves outward actions. Answers "status / what needs me". |
| Lead (any node with children) | Agent | Single point of contact for its subtree; re-assigns work; maintains its node's summary (lazy roll-up). |
| Worker (leaf node) | Agent | Does tasks; its work is auto-logged to its team memory. |
| Freelancer | Temporary agent | Hired by any agent for one task, with a subset of the hirer's tools and budget; released afterwards; never on the roster. |
| Router, curator, scheduler | System services | Shown as labelled system lines in the chat with their cost; configurable in settings; not on the roster. |

**Memory layers:** global (company / root) → each tree node's shared memory (department, project, team) → private (per agent).
**Agent lifecycle:** Draft → Active ⇄ Paused → Archived; Delete (confirmed); Duplicate without memory.
**Autonomy:** presets "Ask every time" / "Trusted" / "Autonomous" with per-tool overrides; outward actions always need the client.
**Approvals:** wait in the desktop inbox. Phone notifications are parked for a future mobile companion app.

## Still unknown (later themes)
Goals and success criteria per use, key scenarios, connectors per role, budgets and limits, look and feel, naming.
