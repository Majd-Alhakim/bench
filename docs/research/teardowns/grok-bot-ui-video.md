# Grok Bot: UI and interaction teardown from the client's screen recording

**Source:** the client's own 86-second screen recording (2026-10-22, 1234×836), shared with us. It's analyzed as 43 frames, one every 2 seconds. This is an **observation of the product as used by the client** (allowed evidence under the competitor-teardown skill). No app internals were inspected. It complements [grok-bot.md](grok-bot.md).

## What the recording shows (Observations)
| # | Pattern | Detail |
|---|---|---|
| O1 | **Dark, minimal desktop app** | Mac-style window, near-black surfaces, light grey bubbles, almost no chrome. Agent colors are the only color |
| O2 | **Sidebar = agent list** | Search at the top. Rows show the agent avatar (a colored shape with eyes), name, a one-line last-message snippet and the time; "Typing…" replaces the snippet while it works. Groups have a cluster avatar. The user's name is at the bottom. **Collapses to an avatar-only rail** |
| O3 | **Agents are created by conversation** | "+" opens a chat: *"good to meet you. What do you want me around for?"* The user describes the job, and a system line follows: **"Renamed to Sales Outbound"**. The agent names itself from the job |
| O4 | **Thinking indicator** | Three dots pulsing in the agent's color + "Thinking". Another status line: "Wrapping the run" |
| O5 | **Inline "Computer" card** | A live screenshot thumbnail of the agent's cloud screen, a task title, and a status pill: **Action needed** (amber) → **Working** → **Done** (green). Pill buttons **Take over / I'm done** |
| O6 | **Take over = full-screen workspace** | Expands to full screen; the user acts themselves (the cursor is labelled **"You"**), with a dock of apps (terminal, browser). The user types a password themselves. **"I'm done, continue"** hands control back |
| O7 | **Results as checklists** | **"✓ Salesforce → list pulled · 52 accounts"**: a bold key → result · detail. Very scannable. Used for every run summary |
| O8 | **System lines** | "Renamed to …", "Created routine ⏱ Overnight outbound", "Memory updated", **"Messages from (Account Manager) and (Chief)"** with mini avatars |
| O9 | **Cross-agent mentions** | Inline chips with a mini avatar in the agent's color, e.g. "Account Manager sent over the Acme + Globex threads" |
| O10 | **Held drafts** | *"36 drafts are sitting in the LinkedIn queue… nothing goes out until you've had a look"*; *"3 intros drafted in your voice and held for your ok"* |
| O11 | **Natural-language routines** | "Send it. **Run this every week.**" creates a routine and adds a system line |
| O12 | **Agents acknowledge with reactions** | A 👍 emoji appears on the user's message |
| O13 | **Right side panel** | Toggled by a monitor icon: "<Agent>'s screen" thumbnail, **Routines** list ("Morning briefing · Weekdays at 8:00", "End-of-week recap · Fridays at 5:00"), a gear for **Settings** (avatar edit, Name, Title (optional), Description, a Notifications toggle: "Get notified when this agent finishes or needs input") |
| O14 | **Group chat** | "Offsite crew": the sender name sits above each bubble group; the Chief assigns follow-ups with mention chips; the Chief proposes *"I'd spin up a dedicated agent for outbound"* |
| O15 | **Voice** | Short, lowercase-casual, concrete: "on it.", "Done.", "book it", "inbox is at zero, with 5 parked for tomorrow" |
| O16 | **Marketing line** | *"AI teammates you can give real work to. Bots can sign in to your tools, use them just like you do, and come back with finished work."* Download for Windows |

## Motion (Inferences from frame sequence)
- Typing dots pulse in sequence.
- The inline Computer card **expands smoothly into a full-screen workspace** and collapses back.
- The side panel slides in from the right.
- The sidebar collapses to the avatar rail.
- Status pills change colour in place.
- New messages appear without heavy animation (calm).

## What Bench takes
| Take | Bench version |
|---|---|
| Agent-list sidebar with snippets | ✅ Combined with our project tree. Agents are listed under the project and Company groups; "Typing…/Working" replaces the snippet |
| Agents created by conversation + self-naming | ✅ Fits UC-02 ("the main agent drafts agents"). The new agent proposes its own name and role card; **the client confirms** (C3) |
| Inline workspace card → expand | ✅ Merged with the Dots workspace pane: a card in the chat → the right pane → full screen. "Take over / I'm done, continue" maps to our control model and to sign-ins (the client types credentials themselves, never the agent: ADR-0002, security baseline) |
| Checklist results ("**Key** → result · detail") | ✅ The standard agent run-summary format. It also feeds the auto work log (BR on work logs) |
| System lines | ✅ Already ours (router/curator lines). Add "Renamed", "Created routine", "Memory updated", "Messages from…" |
| Held drafts language | ✅ Matches draft-only email (B5-#6) |
| Routines from natural language | ✅ UC-38: "run this every week" proposes a routine; per CR-003 M2, it shows an estimate before saving |
| Side panel: screen, routines, settings | ✅ Becomes our agent page's right panel tabs (Workspace, Routines, Profile/Autonomy/Connectors/Memory/Activity) |
| Dark theme | ⚑ The client asked for the Apple base (light). **Offer dark as a mode** in Phase 5b |
| Hidden cost and context | ❌ Ours shows tokens, % of week and the context meter (CR-003 M1/M2) |
