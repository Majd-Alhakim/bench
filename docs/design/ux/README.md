# UX Package: Bench (codename)

| Status | Version | Owner | Approver | Upstream |
|---|---|---|---|---|
| Draft (lean mode, prototype after guide audit) | 0.2 | UX Designer | Client | BRD v1.0 (baselined at G1, 2026-10-22). PRD not yet written: it runs in parallel (STATUS), so this package traces to BRD use cases (UC-xx) and rules (BR-xx). Re-check against the PRD when it lands. v0.2 applies [`guide-audit.md`](guide-audit.md) (32 Must-fix findings) and the client's decisions D1–D6 (`docs/requirements/interviews/2026-10-22-ux-audit-decisions.md`) |

**Prototype:** [`prototype/index.html`](prototype/index.html) (v0.2). One file, greyscale, no network. Open it in any browser by double-clicking it. Every screen has an annotation bar (purpose, primary action, UC IDs, states, and notes on stubs) with buttons that switch the screen between its states (normal, empty, loading, error and so on). Demo-only controls live in the annotation bar, or in boxes marked "Demo controls (not part of the UI)", never in the UI itself.

**Out of scope here:** colour, type, brand, icons, avatars, motion and the final name. Those belong to Phase 5 (UI). The greyscale is deliberate.

---

## 1. Research

**Methods:** client interviews (batches 1–7, `docs/requirements/interviews/`), competitor walkthroughs from public docs (`docs/research/competitive-brief.md`: Grok Bot, Muse, OpenClaw), a heuristic review (Nielsen's 10 heuristics, Krug's "don't make me think") and desk research on the product model (`docs/PRODUCT-MODEL.md`). There is only one user, the client, so there is no outside usability testing (lean mode, STATUS). The prototype tasks in §8 replace it.

### Research questions

| # | Question |
|---|---|
| RQ1 | What is the founder's **first useful result**, and what stands between installing Bench and getting it? |
| RQ2 | What does the founder need to see **first thing every day**? |
| RQ3 | Scenario #1 moves through many places (CEO chat, proposal, BA chat, team chat, dashboard, review). How does the founder **know where to go next**? |
| RQ4 | How much **control versus hand-off** does the founder want, and where should approvals happen? |
| RQ5 | How can **cost** stay visible without nagging? |
| RQ6 | How should **temporary sessions** (5-minute debate, interview, review) feel, given their chat is removed when they close? |
| RQ7 | What mental model does the founder use for the **organisation** (teams, leads, projects, loans)? |
| RQ8 | What does "**the Obsidian effect**" mean for the memory UI? |

### Findings (with source) and insights (what they mean for design)

| RQ | Finding | Source | Insight |
|---|---|---|---|
| RQ1 | Bench runs on the client's own `claude login`; Bench must never show its own Claude login. "Setup friction (Claude Code must be installed and logged in)" is a named Bench weakness | BR-54, ADR-0002, competitive brief §4 | **Detect, don't ask.** First run opens by checking Claude Code and the login on its own. If something is missing, show the exact command to run and a "Check again" button, never a login form |
| RQ1 | Grok Bot wins on friction: naming a bot and adding it to a group takes no effort. The parity bar is "create a bot in under 30 seconds" | Competitive brief §3, §6 | First run has **4 short steps**. The day-1 template is one click, with an editable preview. "CEO only" is equally prominent (BR-04: never pre-installed). **D1:** the team step starts with nothing selected and Gmail is an opt-in tick box (one extra click, no dark pattern) |
| RQ1 | The CEO is "the main one that I always speak to" | B2-Q9 | First run **ends in the CEO chat** with a suggested first message. The first useful result is a CEO reply to a real request |
| RQ2 | "Whenever I ask them … they answer … the latest updates and what needs me." "What needs me" is a live list with no LLM call; the status has a fixed format (Done / In progress / Blocked / Needs you) | B2-Q11, B3-Q13, BR-25, BR-26, BR-36 | **Home = "What needs me" + the CEO chat.** The list renders instantly (0 tokens) and the CEO status loads next to it. The list never waits for the status |
| RQ3 | The client's scenario relies on agents calling him: "The BA wants to meet you", "We have something to show you" | B4-Q3, UC-29 | **Notifications are the connective tissue.** Every "needs me" item has one verb button that opens the exact place to act (session, proposal, approval, card). The founder never has to remember where something lives (Nielsen #6: recognition over recall) |
| RQ3 | "At any moment, I can enter any agent and see what it's doing. I can stop it and tell it to change things." Also: "a way to view this process … It's updated, and I can see it" | B4-Q3, UC-27, UC-26 | Every agent name in the app is a link to its live view, and the live view has **Stop** always visible. The dashboard is one fixed layout per project (B5-#1) |
| RQ4 | Approvals: allow once / always / deny (Grok Bot parity). Approvals are kept out of group chats. Outward actions always need the client; there are no standing email rules; 4 reserved actions | Competitive brief §6, BR-15, BR-58, B6-#7 | **One approval inbox.** Chats show only a pointer line ("waiting for your approval → open"). Outward actions carry a text tag ("OUTWARD: leaves your machine"). "Always allow" is **shown but disabled, with the reason**, so the rule is learnable (Nielsen #5: error prevention). **D3:** where "Always allow" is allowed, it grants one command pattern in one repo for one agent, says so on the button and the card, and says where to revoke it (Settings › Permissions or the agent's Autonomy tab) |
| RQ4 | The Deputy approves most work requests for the client, and every Deputy decision is logged | BR-14, BR-21 | The inbox has a **"Decided by Atlas"** tab, so hand-off stays auditable without the founder approving everything |
| RQ5 | Grok Bot users report surprise bills. The client wants ≥ 30 % of the weekly limit kept free and no per-agent caps | Competitive brief §2, B4-Q4, B6-#4 | **The plan meter is always in the top bar** ("Week 41 % · resets Mon 09:00 · Headroom OK"). **D4:** each message shows its cost as tokens and % of the weekly limit; no dollar figure anywhere in the client's views. A banner appears only when the 30 % guard turns on or the limit is hit. **D5:** at the limit, Bench says when work resumes and never nudges toward an API key; API key mode is mentioned only in Settings. No per-agent warnings anywhere |
| RQ6 | Debate: 5 minutes at most, the higher one in the hierarchy decides, the decision is saved and "the group chat is deleted". Transcript archived and hidden | B5-#2, B5-C2, BR-59, BR-60 | Show the **timer and the decider at the top** from the first second. On close, show the memo and say plainly where the chat went ("archived in the trace, hidden from chats"). Otherwise the vanishing chat looks like data loss (Nielsen #1: visibility of system status) |
| RQ7 | "I can do all of this like a tree"; "each node … one point of contact"; one home node per agent; loans instead of guests | B2-Q9, B2-Q11, B6-#12, B7-#31 | The **org tree is the main map** of the organisation. Leads are marked in text ("LEAD"). Loan copies sit in the borrowing team with a dashed outline and "on loan from …" |
| RQ8 | The client asked for Obsidian-like effects "independent from other apps": editor, backlinks, graph, filters, stale flags | B6-MEM, UC-44 | A **three-pane memory browser** (scopes and filters / note / backlinks), with a graph toggle. Every decision memo, checkpoint and agent links into it |

**Heuristic review of the scenario #1 path (pre-prototype):** the main risk is the number of hand-offs between places (8 places in 13 steps). Each hand-off is covered by a "needs me" item with a deep link, a breadcrumb back to the project, and the project dashboard as the "where are we" view.

---

## 2. Persona

One primary persona: the only user (lean mode). Grounded in interviews B1–B7; assumptions are marked.

| Persona | Context | Goals | Frustrations | Tech comfort | Quote |
|---|---|---|---|---|---|
| **The founder: "BA by day, aspiring PM by night"** | Works as a business analyst, builds personal projects, does software development *(B4-Q1)*. Windows 11 desktop *(constraints)*. Uses Claude Code daily and will keep it in the MVP period *(B4-Q8b)*. Single user, no team *(STATUS)* | Have "a full delivery department working together" take an idea to a delivered product *(B4-Q3)*; ≥ 10 accepted tasks a week; keep ≥ 30 % of the weekly limit free; Bench open-source ready 14 days after the build starts *(B4-Q4, B5-#9)* | Being the router and the bottleneck between roles; copy-pasting context between chats; nobody remembers decisions; no visibility of cost *(BRD §5.1)*. Black-box agent products *(VIS)*. Email sent "randomly" that "can put me in trouble" *(B5-#6)* | High: runs CLI tools, git and npm; wants every agent setting visible and editable as files *(B4-Q6, VIS)*. Comfortable with Agile vocabulary (backlog, epics, Kanban) *(B4-Q3)* | *"Imagine it as a full delivery department working together, trying to give you something."* |

**Behaviours that shape the design**
- Thinks in **business roles and hierarchy** (owner → CEO → officers → PMs → teams) *(B2-Q9)*: the UI uses that vocabulary (CEO, lead, team, loan, freelancer) rather than technical terms (session, subagent).
- Wants to **drop in anywhere** (team chat, any agent) and **leave** without breaking anything *(B4-Q3)*.
- Delegates broadly but keeps **hard lines**: payments, deleting or creating big things, deploying, outward email *(B5-#5, B5-C3)*.
- Reviews in **meetings** rather than documents *(B4-Q3, B5-#2)*.
- `[ASSUMPTION]` Opens Bench in the morning and then several times a day in short visits between day-job tasks. The design favours "scan, act, leave" visits of under 2 minutes.

---

## 3. Journeys

### 3.1 First run: install → first useful result

| Stage | Actions | Thinking / feeling | Pain points (risk) | Opportunities (in the prototype) |
|---|---|---|---|---|
| 1. Launch | Opens Bench after install | "Will this need another account?" Wary | Fear of a new login, of API keys, of Claude credentials | Step 1 detects Claude Code and the login automatically: "Found Claude Code 2.x, signed in. Bench uses this login; it never sees your password" |
| 2. Fix setup (only if needed) | Runs `claude login` in a terminal | Mild annoyance | Leaving the app; not knowing when it's done | A copyable command and "Check again". Not-installed and not-signed-in are separate states with separate instructions |
| 3. Home folder | Accepts the default folder | "Where do my files go?" | Hidden storage | The path is shown with "agents, memory and projects are plain files here" (VIS: files on your machine) |
| 4. Create the CEO | Names it, keeps Sonnet | Ownership: "this is my CEO" | Too many fields | 2 fields (name, model) with defaults; everything else is editable later |
| 5. Team | Picks "Product + Dev" or "CEO only", reviews the preview, removes or edits roles | "Is this my team or a fixed preset?" | A template that feels imposed (BR-04) | Both options are equal choices and **neither is pre-selected** (D1); Finish stays disabled with the reason "Choose how to start your team first". The preview shows Keep / Name / Role / Team, with model, connectors and autonomy behind a per-row "Details". A connector missing from the inventory shows a visible hint (UC-06 E1). Gmail for the CEO is an **unticked**, optional box. Finish shows "Creating Atlas and 6 agents…"; a write failure says nothing was created and offers Try again or another folder |
| 6. First useful result | Lands in the CEO chat; sends the suggested first message ("Here's an idea…") or asks for status | "It works, and it knows my team" | An empty, silent screen | A welcome line from the CEO, suggested first messages, and an empty "What needs me" that explains what will show up there |

**Target:** first useful result (a CEO reply) in under 3 minutes when Claude Code is already signed in `[ASSUMPTION – a target for the client to confirm]`.

### 3.2 Scenario #1: idea → delivered product (and the daily loop inside it)

| Stage (BRD §5.2 step) | Where | Actions | Thinking / feeling | Pain points (risk) | Opportunities (in the prototype) |
|---|---|---|---|---|---|
| Pitch (1–2) | Home, CEO chat | Describes the idea; answers the CEO's questions | "Does it get it?" | Endless back-and-forth | The CEO shows "Intake: understanding at a high level" and stops when it has enough: "Okay, we will take this" |
| Proposal (3) | Proposal page | Reads the one-pager; approves, edits or rejects | "Is this what I meant?" | A long document | One page, three sections (problem / what to build / what the team does). Approve and Reject are the only primary actions; Reject requires a comment |
| Project setup (3, UC-43) | Project preview | Checks the team copies and their suggested names; confirms "Create project" | "Two confirmations?" | The second confirmation may feel redundant | The preview is the second step on the same screen, with a clear "Nothing is created until you confirm" (open question Q3) |
| Meet the BA (4–6) | What needs me → BA interview session | Clicks "The BA wants to meet you"; answers batches of questions | Engaged, like this project's interviews | Losing their place if interrupted | Progress "Question 3 of 8"; "Pause and continue later"; verbatim answers kept |
| Documents and plan (7–8) | Dashboard | Glances at the backlog filling up | "Things are moving" | No signal that anything is happening | Dashboard team row shows each agent's status as a text tag (Idle, Thinking, Working, Waiting for you, Blocked, Paused, Stopped, Error); the top-5 backlog updates live |
| Build (9–10) | Dashboard, team chat, agent live view, approvals | Watches, drops into the team chat, stops and redirects a developer, approves a command | In control | Approval fatigue; not knowing who to talk to | Approvals in one inbox with a Deputy log; "Stop" always visible in the live view; an agent waiting on an approval shows "Waiting for you" with a link to it; team chat shows plain system lines ("Bench asked Karim to reply…") with cost |
| Contested point (12) | Debate session | Watches a 5-minute debate or joins and decides | Curious, slightly impatient | Debates eating tokens and time | Timer plus running cost; decider named up front; memo on close |
| Review (11–12) | What needs me → review session | Tests, gives feedback, accepts or rejects each item | "Is it what I asked for?" | Feedback getting lost; closing too early | The BA's notes are visible live in the session; the current item is highlighted with its Accept as the one primary. Close review sits after the items; with items left, a confirm lists them and says they stay In review (D6). Closing ends on the dashboard with a summary: accepted, sent back, not reviewed, new tasks [view], notes [open] |
| Repeat / done (13) | Dashboard, usage | Sees sprint 2 start on the same dashboard; checks headroom | Confidence | Running out of weekly limit | The top-bar meter; the 30 % guard banner only when it matters |

**Daily loop (inside stage "Build"):** open Bench → "What needs me" (instant) and the CEO's status → resolve approvals → open one project dashboard → maybe drop into a chat or an agent → leave. Bench stays in the tray (BR-76).

---

## 4. Information architecture

### 4.1 Navigation model

A persistent left sidebar with 8 destinations, a top bar with the plan meter and the "needs me" count, and contextual links everywhere (every agent name opens its profile or live view; every cost opens the trace).

```
Top bar:  [Bench]        [Week ▮▮▮▯▯▯ 41 % · resets Mon 09:00 · Headroom OK]  [Needs me: 8]
Sidebar:
  Home ............ CEO chat + What needs me + morning status        (UC-08, UC-25, UC-29)
  Approvals (n) ... inbox · Decided by Atlas (Deputy log)             (UC-23, UC-22 A1)
  Projects
    Bench ......... Dashboard · Team chat · (sessions appear while open) (UC-26, UC-10, UC-11, UC-30, UC-31)
    + New project
  Org ............. tree view and editor → Agent profile → Live chat  (UC-01–07, UC-47, UC-09, UC-27)
  Memory .......... browser: notes, backlinks, graph                  (UC-21, UC-44, UC-45, UC-46)
  Usage ........... plan meter, 30 % guard, breakdowns                (UC-40, UC-41, UC-42)
  Trace ........... runs, steps, system lines, costs, archive         (UC-28)
  Settings ........ checkpoint threshold, system services, folders   (BR-66, BR-38)
```

**Rules**
- **Temporary sessions** (interview, review, debate) appear under their project only while they are open, marked "LIVE". When they close they disappear from navigation, as BR-60 requires; their memo or notes are reachable from the dashboard, from memory and from the trace archive.
- **Projects** are nodes under the CEO in the org tree (AS-6) and also have their own sidebar entry, because the dashboard is a daily destination.
- **Proposals** are not a nav item. They live in "What needs me" while awaiting the client, and in the project's documents once approved.
- **Direct chats** are reached from the org tree, an agent card, the dashboard team row or a task card. A "Recent chats" list under Org `[ASSUMPTION]` keeps the sidebar short.
- **Breadcrumbs** sit top-left on every screen below the sidebar level (agent live chat, agent profile, sessions, proposal). The first crumb is the screen you came from (e.g. "Bench · Dashboard › Noor · Live chat"), so back is always one click on the left.
- **Work items** open in a side drawer over the dashboard, not a modal. Modals are kept for decisions that must block (delete, close a review with items left, reject with a comment, escalation).
- **Agent status vocabulary** is one set, shown as a text tag everywhere (org node, dashboard team row, live chat header, profile, card drawer): **Idle · Thinking · Working · Waiting for you · Blocked · Paused · Stopped · Error**. Lifecycle (Draft, Paused, Archived) is shown separately.

### 4.2 Objects and how they relate

```mermaid
graph TD
  Client((Client)) -->|talks to| CEO[CEO / main agent]
  CEO -->|root of| Tree[Org tree]
  Tree --> Node[Node: team / project]
  Node -->|has one| Lead[Lead agent]
  Node -->|contains| Agent[Agent]
  Agent -->|has| Card[Card · instructions · model · autonomy]
  Agent -->|uses subset of| Conn[Connectors & skills inventory]
  Agent -->|owns| PMem[Private memory]
  Node -->|owns| NMem[Node memory: work logs, summaries, memos]
  CEO -->|owns| GMem[Global memory]
  Agent -.->|hires| FL[Freelancer, temporary]
  Node -.->|borrows| Loan[Loan copy, temporary]
  Project[Project] -->|is a| Node
  Project --> Dash[Dashboard: team, backlog, sprint]
  Project --> TChat[Team chat]
  Project --> Sess[Meeting sessions: interview, review, debate]
  Sess -->|leaves| Memo[Decision memo / notes]
  Memo --> NMem
  Proposal[Proposal one-pager] -->|approved creates| Project
  Agent -->|runs produce| Trace[Trace: steps, cost]
  Trace --> Ledger[Usage ledger → plan meter]
  Agent -->|requests| Appr[Approval]
  Appr --> Inbox[Approval inbox]
  Inbox --> Needs[What needs me]
```

---

## 5. User flows

Each flow shows its empty, loading and error states. "WNM" = "What needs me".

### F1. First run (UC-06, UC-08 E1, BR-54)

```mermaid
flowchart TD
  A[Launch Bench] --> B{Detect Claude Code<br/>loading: 'Checking…'}
  B -->|not installed| E1[Error: install steps + Check again] --> B
  B -->|installed, not signed in| E2[Error: run 'claude login' + copy + Check again] --> B
  B -->|ANTHROPIC_API_KEY found| W1[Warning: Bench strips it; uses your login] --> C
  B -->|found + signed in| C[Choose Bench home folder]
  C -->|folder not writable| E3[Field error: cause + 'Use C:\Users\you\Bench'] --> C
  C --> D[Create the CEO: name + model]
  D -->|name empty/too long| E4[Field error] --> D
  D --> T{Team: nothing pre-selected D1<br/>Finish disabled with reason}
  T -->|CEO only| GM
  T -->|Product + Dev| P[Template preview: Keep / Name / Role / Team<br/>Details per row]
  P -->|connector missing| E5[Role shown without it + visible hint] --> P
  P --> GM{Gmail in inventory?}
  GM -->|yes| G1[Optional box, unticked D1] --> F
  GM -->|no| F
  F[Finish] --> CR[Loading: 'Creating Atlas and 6 agents…']
  CR -->|write fails| E6[Error: nothing created, choices kept<br/>Try again / Choose another folder] --> F
  CR -->|ok| H[Home: CEO welcome + suggested first messages<br/>empty WNM: 'Nothing needs you yet' + 'Pick a suggested message'<br/>toast with 'Open Org tree']
```

### F2. Idea → proposal → project (UC-12, UC-43, UC-29)

```mermaid
flowchart TD
  A[Client pitches idea in CEO chat] --> B[CEO asks clarifying questions<br/>loading: typing + cost]
  B -->|client leaves| B2[Intake saved; resumes later] --> B
  B -->|too vague| E1[CEO says what is missing] --> B
  B --> C[CEO: 'Okay, we will take this' → writes one-pager]
  C --> D[WNM: 'Proposal awaiting your approval']
  D --> P[Proposal page]
  P -->|Reject + comment required| R[Rejected → CEO revises] --> D
  P -->|Edit text| P
  P -->|Park| K[Parked; can reopen]
  P -->|Approve| V[Project preview: team copies + suggested names]
  V -->|name clash / empty| E2[Inline field error under the name, aria-invalid:<br/>'Maya is already used by your PM. Pick another name'] --> V
  V -->|Cancel| A2[Proposal stays Approved, not sent]
  V -->|Create project| X{Create}
  X -->|file write fails| E3[Error: rolled back, proposal stays approved<br/>Try again / Choose another Bench folder] --> V
  X -->|ok| Y[Project Active: dashboard empty state<br/>'No sprint started'; PM has 'take over proposal']
  Y --> Z[Later in WNM: 'The BA wants to meet you']
```

### F3. BA interview session (UC-30)

```mermaid
flowchart TD
  A[WNM: 'The BA wants to meet you'] --> B[Session opens: 'Question 1 of 8'<br/>loading: BA preparing]
  B --> C[Client answers] --> D{More questions?}
  D -->|follow-up / edge case| C
  C -->|'I don't know'| O[Listed as open question] --> D
  C -->|contested point| DB[Debate inside session, F7]
  B -->|client pauses| PZ[Paused; resumes at next unanswered question]
  D -->|done| N[Notes written: verbatim + summary; PM told]
  N --> CL[Session closes → Bench dashboard with a close summary:<br/>answered / open questions, notes link, chat archived in Trace]
  B -->|usage limit| L[Saved; resumes after reset]
```

### F4. Daily loop: morning status and "what needs me" (UC-25, UC-29, UC-23)

```mermaid
flowchart TD
  A[Open Bench / tray] --> B[WNM list renders instantly, 0 tokens]
  A --> S[CEO status: loading 'Collecting team summaries…']
  S -->|ok| S1[Done / In review / In progress / Blocked / Needs you, links]
  S -->|usage limit| S2[Cached summaries with their age]
  B -->|first use| B1[Empty: 'Nothing needs you yet' + 'Pick a suggested message']
  B -->|cleared| B0[Empty: 'All clear. The team is working on 6 items' + 'Open Bench dashboard']
  B --> O[Rank D2: blocked > outward/reserved > other approvals > meetings > proposals > FYI; ties by age<br/>Groups Decide / Meet / For your info; top 5 + 'Show all'<br/>Top item's verb = the only primary]
  O --> I{Item type}
  I -->|approval| AP[Approval inbox, F5]
  I -->|meeting request| MS[Session, F3/F7]
  I -->|proposal| PR[Proposal, F2]
  I -->|email draft| EM['Send it or change it?']
  I -->|blocked / escalation| ES[Escalation card: history, options]
  I -->|payment need| PY[Review payment → pay outside Bench → Mark done]
  I -->|FYI: guard on| U[Usage, F9]
  I -->|FYI: debate running| DW[Watch debate, F7]
```

### F5. Resolve an approval (UC-23, UC-22, BR-15, BR-57, BR-58)

```mermaid
flowchart TD
  A[Agent tool call stopped by gate] --> B{Who may approve?}
  B -->|work request| D[Deputy may decide → logged in 'Decided by Atlas']
  B -->|outward / reserved| C[Client only: card tagged OUTWARD or RESERVED]
  B -->|payment| PY[Not approvable: WNM payment item]
  C --> O{Client choice}
  O -->|Allow once| X[Runs; agent told; logged]
  O -->|Always allow this command in repo D3| G[Grant: one agent, one command pattern, one repo<br/>card states the scope + 'Revoke in Settings › Permissions or Agent › Autonomy'] --> X
  O -->|Always on outward / reserved| N[Disabled with reason: no standing rules]
  O -->|Edit then allow| X
  O -->|Deny + reason| Y[Agent adapts]
  X -->|fails after approval| F[Plain cause + 'Noor will close it and try again; nothing for you to do'<br/>Retry now / Open Noor; raw error under Details]
  A2[Inbox with nothing pending] --> E[Empty: 'Nothing is waiting for you' + 'See what Atlas decided']
  A3[Filter with no match] --> NR[No results: 'No payment requests. 3 others are waiting' + Show all]
  G --> RV[Settings › Permissions: Revoke, applies immediately]
```

### F6. Watch, stop, redirect an agent (UC-27, UC-09)

```mermaid
flowchart TD
  A[Click any agent name] --> B[Agent live chat<br/>loading: 'Connecting to Noor's run…']
  B -->|Idle| B0[Empty: 'Idle. Give Noor a task']
  B -->|Waiting for you| WA[Pointer: 'Noor asks to run rm -rf node_modules/.vite in bench'<br/>primary: Open approval; Stop still available] --> F5[Approvals, F5]
  WA -->|Stop| S
  B -->|Working| R[Live: task, step, tool calls, files, tokens + % of week, context %]
  R -->|Stop| S[Stopping: waiting for 'pnpm lint --fix' to finish<br/>usually under a minute; no new step will start]
  S -->|ok| ST[Stopped: 'No further tool call will start. Tell Noor what to change']
  S -->|shell cmd already ran| E1[Stopped, but the command changed 2 files and can't be undone;<br/>Noor lists what it changed] --> ST
  ST -->|new instruction| R2[Running with redirect; logged to team memory]
  ST -->|Cancel task| C[Task Cancelled; lead informed]
  B -->|archived agent| E2[History read-only, no composer]
```

### F7. Debate and review sessions (UC-11, UC-31, UC-24)

```mermaid
flowchart TD
  A[Point contested in chat / review / task] --> B[Debate opens: topic, participants,<br/>decider named, timer 5:00, cost 0]
  B --> C[Participants argue; cost per message]
  C -->|decider declares agreement early| M[Memo: decision, attendees, rationale]
  C -->|5:00 reached or 100k token cap| D[Decider decides] --> M
  C -->|client presses 'Join, you'll be the decider'| CJ[Client is highest rank → 'Declare the decision now'] --> M
  C -->|usage limit| P[Timer paused; resumes after reset] --> C
  C -->|client cancels| K[Memo: cancelled + positions]
  D -->|major decision| W[Recommendation → WNM for client confirm]
  M --> CL[Close: chat removed from views; transcript archived;<br/>memo saved to node memory, linked from origin]
  R[WNM: 'We have something to show you'] --> RS[Review session: PM presents, BA takes notes live]
  RS --> AC{Per item; current item highlighted}
  AC -->|Accept| DN[Done; weekly accepted count +1]
  AC -->|Reject + comment| RJ[Back to same agent; comment in its memory]
  RS -->|build won't start| E1[PM records; Dev lead task]
  RS -->|Close review, all reviewed| CL2
  RS -->|Close review, items left D6| CF[Confirm lists the items:<br/>'They stay In review; Maya will ask again'] -->|Close review| CL2
  CF -->|Keep reviewing| RS
  CL2[Dashboard close summary: accepted / sent back / not reviewed,<br/>new tasks view, notes open, chat archived in Trace]
```

### F8. Project dashboard (UC-26, UC-16)

```mermaid
flowchart TD
  A[Open project] --> L[Loading skeleton]
  L -->|ok| D[Needs you on this project: verbs, first one primary<br/>Team row with status tags · Top 5 backlog · Sprint To Do / In Progress / Done]
  L -->|can't refresh| E[Last loaded state + time + warning]
  D -->|no sprint yet| N[Empty sprint: 'No sprint started'; backlog shown]
  D -->|no backlog| N2[Empty: 'Maya is preparing the backlog']
  D --> F[Full backlog expanded] --> D
  D --> C[Card drawer: owner, history, AC, trace, cost]
  C -->|In review| AR[Accept / Reject]
  D --> AG[Agent in team row → F6]
  D --> SP[Sprint selector: past sprints read-only]
```

### F9. Usage: guard and limit (UC-40, UC-41, UC-42)

```mermaid
flowchart TD
  A[Run ends → ledger] --> F{Weekly forecast}
  F -->|≥ 30 %| OK[Meter: 'Headroom OK']
  F -->|< 30 %| G[Guard ON: routines + daily refresh deferred<br/>banner + WNM item]
  G -->|Run now on one item| G1[Runs once; guard stays on]
  G -->|forecast recovers / weekly reset| OK2[Guard off; deferred work runs; client told]
  F -->|limit reached| L[All agents stop at safe point; status Paused;<br/>banner with resume time 14:00; paused list in resume order<br/>no API-key nudge D5]
  L -->|reset| RS[Work resumes in pause order; client told]
  A -->|usage data unreadable| E[Meter: 'Ledger only' note; guard uses ledger; Check again]
  A -->|first week, no runs| N0[Empty: 'No usage this week yet' + Talk to Atlas]
```

### F10. Org editing and agent loan (UC-01, UC-02, UC-03, UC-47)

```mermaid
flowchart TD
  A[Org tree] -->|empty: CEO only| A0['Add your first agent' / 'Apply template']
  A --> N[Select node → side panel]
  N --> AA[Add agent: form or 'Ask Atlas to draft']
  AA -->|name clash| E1[Field error]
  AA --> SV[Save = client action; agent Active]
  N --> LC[Lifecycle: Pause / Archive / Duplicate / Delete typed confirm]
  LC -->|pause/archive| T[Open tasks return to lead]
  N --> LN[Request loan from 'More actions'; status shown inline in the side panel]
  LN --> R[Requested] -->|owning lead declines| DC[Declined + reason]
  R -->|approves| CP[Checkpoint, save only<br/>incomplete → wait] --> CA[Copy active, dashed, 'on loan from …']
  CA -->|Done / end early| MB[Merge-back to original] -->|merge fails| E2[Retry; not deleted]
  MB --> DL[Copy deleted; only original remains]
```

---

## 6. Wireframes / low-fi prototype

**File:** [`prototype/index.html`](prototype/index.html). Click through with the sidebar, or follow the validation tasks in §8 (also inside the prototype under "Prototype guide").

| # | Screen | Purpose | Primary action | Use cases | States in the prototype |
|---|---|---|---|---|---|
| 1 | First run (4 steps) | Get from install to a working CEO | Continue (one per step); Finish once a team start is chosen | UC-06, UC-08 E1, BR-04, BR-54 | checking, found, not installed, not signed in, API key warning, folder not writable, creating, couldn't create; nothing pre-selected; template preview (4 columns + Details); Gmail opt-in |
| 2 | Home | Morning status, what needs me, talk to the CEO | The top "needs me" item's verb (only primary, large); Send when the list is empty | UC-08, UC-12, UC-25, UC-29 | normal (grouped Decide / Meet / For your info, top 5 + Show all), first use, cleared, status loading, usage limit (cached) |
| 3 | Org tree and editor | See and change the organisation | Add agent | UC-01–UC-07, UC-43, UC-47 | normal, CEO only (empty), loading, error (rolled back); loan inline in the side panel; edit actions under "More actions" |
| 4 | Agent profile | See and change everything about one agent | Save changes (Draft: Save and create) | UC-02–UC-04, UC-21, UC-22, UC-32, UC-35, BR-66 | 6 tabs; active, draft, paused, archived (read-only), save failed; unsaved-changes count and leave guard; standing grants with Revoke; delete confirm |
| 5 | Agent live chat | Watch, stop and redirect an agent | Working: Stop · Waiting for you: Open approval · Stopped: Send instruction | UC-09, UC-27, UC-28 | connecting, working, waiting for you, stopping (slow), stopped, stopped (command can't be undone), idle (empty), archived |
| 6 | Project team chat | Watch and steer the project team | Send / assign with @mention | UC-10, UC-13, UC-11 A5 | participant, observer, empty, error |
| 7 | Meeting session | Interview, review or 5-minute debate | Debate: Join (you'll be the decider) → Review memo and close · Interview: Answer · Review: Accept the current item → Close review | UC-11, UC-24, UC-30, UC-31 | debate running, decider declared agreement, time's up, memo; interview; review (+ close confirm with items left); paused |
| 8 | Proposal one-pager | Confirm the CEO understood the idea | Approve (→ project preview → Create project) | UC-12, UC-43 | awaiting, rejected (revising), approved → preview (inline name errors), created, error (Try again / Choose another folder) |
| 9 | Project dashboard | Where the project is right now | First verb in "Needs you on this project" | UC-26, UC-16, UC-24 | normal, no sprint, loading, stale data, new project (empty); close summaries after a review or interview; work item drawer |
| 10 | Approval inbox | Decide what agents may do | The first card's main action | UC-23, UC-22 A1, BR-15, BR-57, BR-58, BR-64 | normal, empty, filter with no results, Deputy log, action failed (plain cause + Retry now); scoped "Always allow" (D3) |
| 11 | Trace and cost | See every step and its cost | Expand a step | UC-28, UC-07, BR-38, BR-60 | normal, no runs yet, loading, can't read, past retention, archived transcript; working Files only / Commands only filters with no-results |
| 12 | Usage meter | Keep ≥ 30 % weekly headroom | Run now / Open runs | UC-40, UC-41, UC-42 | OK, first week (no data), guard on, limit reached (resume time, no API nudge), ledger only (Check again); costs in tokens and % of week |
| 13 | Memory browser | Read and edit what agents remember | Edit → Save note | UC-21, UC-44, UC-45, UC-46 | note, no notes yet, graph (text labels for open and stale), stale flag (Delete confirm + Undo), search no-results (Clear search / Show all scopes), index rebuilding; list grouped by recency, 10 + Show all |
| 14 | Settings | Set the checkpoint threshold and system behaviour | Save settings (one for the page) | BR-66, BR-38, BR-52, BR-76, UC-32 | normal, out-of-range error, unsaved-changes indicator; Permissions (grants, Revoke); API key mode (the only place it is mentioned) |

**What the prototype does not decide:** visual hierarchy beyond greyscale weight, iconography, motion, the layout grid or the final copy tone. Phase 5 decides those.

---

## 7. UX principles

1. **What needs me comes first, and it's instant.** The live list never waits for an LLM (BR-36). Every item has one verb that takes you exactly where to act.
2. **One obvious next step per screen.** Exactly one primary (filled) button per screen (Krug, D2). In lists of cards, only the current or first card's action is filled. Selected toggles and filters use an outline with a check mark, never the primary fill. Modals and drawers have their own single primary.
3. **Never hide what an agent did.** Every message has a cost and a "Trace" link; every agent name opens its live view; system services show as plain, labelled lines ("Bench asked Karim to reply", "Digest updated"); their technical names stay in the Trace and Settings (BR-38, BR-39).
4. **Stop is always one click away.** On any running agent, live view and session (UC-27, UC-11 E4).
5. **Explain a rule where it applies.** Disabled options stay visible with the reason ("Always allow is off for emails to other people: every email needs you"). Rules become learnable, not mysterious (BR-15, BR-58).
6. **Nothing vanishes silently.** When a session closes, say what was kept (the memo), where the chat went (the archive) and where to find it (BR-60).
7. **Cost is visible, not loud.** A meter in the top bar with its reset time, and small costs on messages in tokens and % of the weekly limit, never in dollars (D4); banners only for the 30 % guard and the limit, and the limit banner gives the resume time without nudging toward paid API use (D5, B6-#4).
8. **Defaults for everything, files underneath.** Every setting has a default; every agent, memo and note can be opened as a file (VIS principle 2).
9. **Same place, changing content.** The project dashboard keeps one layout across sprints (B5-#1); the founder learns it once.
10. **Business words, not system words.** CEO, lead, team, loan, freelancer, meeting; not "subagent", "session id", "MCP", "Router" or raw error codes outside the details.
11. **One status vocabulary, always as text.** Idle · Thinking · Working · Waiting for you · Blocked · Paused · Stopped · Error, on every screen that shows an agent. "Waiting for you" always links to the request.
12. **Endings say what happened and link to it.** A toast or summary that reports something created carries its link and stays at least 8 s (10 s with an action); closing a review or interview ends on a dashboard summary, not a toast.

---

## 8. Usability validation

The client tries these tasks on the prototype, thinking aloud or noting where they hesitate. Start each task from the "Prototype guide" (top right), which resets the demo.

| # | Task (as given to the client) | Covers | Success criteria |
|---|---|---|---|
| T1 | "You've just installed Bench. Get to the point where you can talk to your CEO with your day-1 team, but without QA for now." | F1, UC-06 | Reaches the CEO chat in ≤ 6 clicks without help (Continue, Continue, Create Atlas, pick the template, untick QA, Finish); picks the team start themselves, since nothing is pre-selected; leaves Gmail off or ticks it knowingly; can say where Bench stores its files. **Fail if** they look for a login form, are unsure the CEO uses their Claude login, or think Gmail was connected without them choosing it |
| T2 | "Tell the CEO about a new idea and get it to the point where a team is working on it." | F2, UC-12, UC-43 | Finds the proposal from "What needs me"; approves; understands that "Create project" is a second step; ends on the new project's dashboard. **Fail if** they think approving alone created the project, or can't find the proposal |
| T3 | "It's the morning. What needs you today? Deal with the most important item, and make sure no email goes out to a client without you." | F4, F5, UC-25, UC-23 | Names at least 3 "needs me" items within 30 s of opening; handles the top Decide item (the blocked QA-3, the only filled button) or explains why it ranks first; spots the OUTWARD tag on the email and explains why "Always allow" is disabled; says what "Always allow" on Noor's request would cover (that command, in repo bench) and where to revoke it. **Fail if** they think "Always allow" on Noor's request allows any shell command |
| T4 | "Noor, the developer, is going the wrong way. Make her stop and use the existing date library instead. Then find out what her last run cost." | F6, UC-27, UC-28 | Reaches Noor's live view in ≤ 2 clicks from the dashboard; stops; reads "Stopped" on the status tag; redirects; opens the trace and reads the run's cost in tokens and % of the week. **Fail if** they can't tell whether she stopped, or read the cost as a bill |
| T5 | "Your team disagrees on a design point. Let them debate and find out what was decided afterwards, and where the chat went." | F7, UC-11, UC-44 | Sees the timer and who decides; joins as decider or lets time run out (annotation state "Debate: time's up" skips the wait); after the close, can find the decision memo in Memory and says the chat was archived in the trace. **Fail if** they think the conversation was lost |

**Observations and changes:** client walkthrough observations to be filled in after the Phase 4 review (before G4). Changes so far are logged below.

### Changes log

| Version | Date | Source | Changes |
|---|---|---|---|
| 0.1 | 2026-10-22 | First prototype | 14 screens, 10 flows, validation tasks T1–T5 |
| 0.2 | 2026-10-22 | [`guide-audit.md`](guide-audit.md) (32 Must-fix-before-G4 findings, all fixed; 8 Phase-5 findings handed to UI) and client decisions D1–D6 | **D1** first run: nothing pre-selected, Finish disabled with a reason until a team start is chosen, Gmail unticked and optional. **D2** What needs me ranked blocked → outward/reserved → other approvals → meetings → proposals → FYI (ties by age), grouped Decide / Meet / For your info, top 5 + Show all; the top verb is the only primary on Home (composer Send is secondary unless the list is empty). **D3** "Always allow this command in bench" grants one agent one command pattern in one repo, states the scope on the card, links to Settings › Permissions and the agent's Autonomy tab, where it can be revoked. **D4** all costs in tokens and % of the weekly limit; dollar figures removed from the client's views. **D5** limit banners show the resume time and no API-key nudge; API key mode appears only in Settings. **D6** a review can close with items unreviewed after a confirm that lists them; they stay In review and are listed in the review notes. **Also:** one agent status vocabulary as text tags everywhere, with "Waiting for you" linking to the request (Noor's live view links to her pending approval); a distinct selected style for toggles and filters (outline + check mark); exactly one primary per screen; breadcrumbs on drill-down screens; review and interview end on a dashboard close summary with links; toasts carry links and stay longer; Approvals failure in plain language with Retry now and Details; filter no-results; inline name errors on the project preview; first-run folder, creating and write-failure states; live chat connecting, waiting, slow-stop and can't-undo states; debate primary is "Join (you'll be the decider)" and demo controls moved to the annotation bar; Org panel actions under "More actions" and loans inline; dashboard "Needs you on this project" strip; work items in a drawer; empty, no-results and error states for Trace, Usage and Memory; agent profile in 6 tabs with an unsaved-changes count and leave guard; plain system lines in chats; memory delete with confirm and Undo; graph labels for open and stale; memory list grouped by recency with Show all; one Save on Settings; dead affordances removed or marked as stubs in the annotation |

---

## 9. Open questions and decisions needed (for the client)

**Resolved:** D1–D6 from the guide audit (2026-10-22, all recommended options), applied in v0.2. Q1–Q10 below are still open.

**New for the client (raised by v0.2):**
- **Q11. Dollar price on the payment request.** D4 removes dollar figures from the client's views. The Figma seat request still shows "about $15/month (Figma's price, paid by you outside Bench)", because the client can't decide on a purchase without the price. Keep this one exception for third-party purchases, or drop the price? Prototype default: keep it.
- **Q12. Where non-outward work requests and payments rank in What needs me.** D2 names blocked, outward/reserved approvals, meetings, proposals and FYI. The prototype puts ordinary work requests and payment requests right after outward/reserved approvals (still in Decide). It also shows groups in the order Decide, Meet, For your info, so a proposal (Decide) appears above meetings on screen even though it ranks below them; the rank decides the top item and which 5 show. Confirm both.

| # | Question | Why it matters | Prototype default |
|---|---|---|---|
| Q1 | **Day-1 team vs project copies.** Each project gets its own copies of the template agents (B6-#27), and the day-1 team mirrors the template. Is the day-1 team (Maya, Omar, Lina, Sam, Karim, Noor, Jade) itself the team of your first project (Bench), with later projects getting copies? Or do the day-1 agents stay as a template that never works? | It decides what the org tree shows on day 1 and whether two "PMs" exist after the first project | The day-1 team works on project **Bench**. New projects (e.g. InterviewKit) get copies with new suggested names |
| Q2 | **Where projects sit in the tree.** Are projects nodes directly under the CEO (AS-6), with Product and Dev teams inside each project? | Shapes the tree view and the roll-up | Project nodes under the CEO; the day-1 teams are shown as the Bench project's teams |
| Q3 | **Two confirmations for a new project** (approve the proposal, then "Create project"). Keep both, or make "Approve and create" one step with the team preview before it? | Fewer clicks vs. a safety step (the BRD default is two steps, to revisit at the prototype) | Two steps on the same screen |
| Q4 | **Temporary sessions after close.** Is a small "Recently closed" list (memo or notes only, no transcript) acceptable, or must closed sessions leave no trace in the chat list at all? | BR-60 removes the chat from your views; a closed session can feel like data loss | No list; the memo is linked from the origin chat, the dashboard and Memory |
| Q5 | **Approvals in chats.** Approve only in the inbox (Grok Bot practice), or also inline on the agent's live view? | Speed vs one consistent place | Inbox only; chats show a pointer line with a link |
| Q6 | **Client role in the project team chat:** participant or observer by default? | Whether your messages trigger replies (and cost) | Participant |
| Q7 | **The 30 % guard:** fixed, or adjustable in Settings? | UC-41 leaves it open | Shown in Settings, not editable (your stated target) |
| Q8 | **OS notifications** when Bench is in the background, for "needs me" items (UC-29 step 3 is an assumption)? | Interruptions vs missing a meeting request | On for meeting requests, "something to show you" and blocked; off for the rest |
| Q9 | **First-run target:** is "a CEO reply within 3 minutes of launch" the right bar? | Sets the onboarding acceptance criterion | 3 minutes |
| Q10 | **Debate timer during a usage-limit pause:** pause the 5 minutes (BRD assumption) or let them run out? | Fairness of the timebox | Paused |

**Constraints to confirm with UI and the tech lead (decisions for the client if they conflict):**
- **C-A (tech):** the live view streams tool calls and context % as they happen, and Stop takes effect within 2 s (UC-27 NFR). If the Agent SDK can only stop at turn boundaries, the "Stopping at next safe point…" state may last longer, and the copy must say so.
- **C-B (tech):** a usage-limit forecast and "session/weekly %" in the top bar assume Bench can read plan usage (S0-1 spike). If it can't, the meter shows ledger tokens only (state "Ledger only"), which weakens the 30 % guard.
- **C-C (tech/UI):** graph view performance (about 2,000 notes in under 2 s, UC-44 assumption) may need neighbourhood-only rendering by default.
- **C-D (UI):** greyscale here encodes status with text tags and outlines (OUTWARD, RESERVED, LEAD, LOAN, BLOCKED). The UI phase must keep the text tags, not replace them with colour alone (accessibility).
