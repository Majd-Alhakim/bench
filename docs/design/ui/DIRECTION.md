# UI Direction: "Apple built a Grok Bot × Dots" (draft for client review)

**Status:** Draft **v0.2** (2026-10-22). v0.1 was the PM synthesis of the client's references; v0.2 applies the client's first round of UI feedback (U1–U8, [interview notes](../../requirements/interviews/2026-10-22-ui-feedback-1.md)). The D-UI decisions in §3 are confirmed with the recommended options, ADR-0001 is accepted, and the name is still deferred ("bench" stays the codename). Input to Phase 5 (UI). The low-fi flows (UX prototype v0.4) stay the structure; this defines the look and feel.

**Client brief (verbatim):** *"the style and feel of grok bot which I find cool and clean and how everything runs and the animations; also the style of open Ai dots is nice design also; I want ours to be mix of both and imagine that Apple have created its own one with its design system."*

References: [`references/`](references/): the Apple style guide, three Dots screenshots, the client's shape-avatar image. Grok Bot screen recording analyzed: [../../research/teardowns/grok-bot-ui-video.md](../../research/teardowns/grok-bot-ui-video.md) (agent-list sidebar, agents created by conversation, inline workspace card with Take over / I'm done, checklist results, system lines, side panel with screen + routines + settings).

## 1. What each reference contributes
| Source | Take | Leave |
|---|---|---|
| **Apple** (base system) | Frost canvas, Carbon text, **one blue for actions**, Inter/SF with negative tracking, 980px pills, 8px cards, hairlines, **no shadows**, generous whitespace, weight 300 subheads | "No illustrations": overridden for agent avatars only |
| **Dots** (screenshots) | **Character avatars as the agents' faces**; the agent's **name tag + live status line under the avatar** ("Thinking…", "Clarifying the experiment goal"); **user bubbles tinted in the agent's color**; a **split view: conversation left, the agent's live workspace right** (docs, browser, email draft); reply threading ("↳ Read the brief in #aster-launch…"); reactions; read receipts; a soft pastel canvas tinted per agent | Plush 3D with accessories as default (client: one consistent, non-human family; eyes carry the expression) |
| **Grok Bot** (client-observed) | Clean, fast, "how everything runs" visible; smooth motion; a roster of shape characters with eyes ([avatar reference](references/avatar-reference-client-2026-10-22.png)); an activity line per agent ("Outreach drafts queued for approval") | The opaque cost and black-box feel |

## 2. Bench rules (the merge)
1. **The canvas is Apple:** `#f5f5f7` canvas, `#ffffff` content surfaces, `#1d1d1f` text, `#d2d2d7` hairlines, no UI shadows, 8px cards, 980px pills. The type stack is Inter (or system SF on macOS) with Apple tracking. Body 17px is too large for a dense desktop work app, so **Bench body = 15px** and 14px in lists, with the same tracking curve. ⚑ Client to confirm.
2. **One action color.** Apple Blue `#0071e3` is the **only** filled action color, one per screen (matches our "one primary action" rule). Link Blue for secondary and links.
3. **Agents bring the color.** Each agent owns **one identity color** (a curated palette of about 10 soft hues, like the shape-avatar image and Dots). It appears **only** in that agent's avatar, its name tag, a **light tint of the user's bubbles in that agent's chat**, and a very faint canvas wash behind its conversation. **Agent colors are never used for buttons or actions.**
4. **Avatars = the one illustration.**
   - Non-human shapes with eyes only (sphere, droplet, cloud, hexagon, blob, egg, pill, triangle, rounded square).
   - **Two renders from one design:** a flat vector in lists and chat lines, and a soft dimensional render (gentle gradient and highlight, Dots-like softness, no fur noise) for the hero position at the top of the agent's chat and on the profile.
   - Status: a **corner badge** in lists and messages; in the hero position, the **status line under the name tag** ("Thinking…", "Drafting the release notes"), Dots-style, with the text always visible.
5. **Workspace split (from Dots).** The agent page is the conversation (left) plus **a live workspace pane (right)** showing what the agent is working on: a file diff, doc, browser, email draft or terminal. That's our "glass box". In v1 this pane hosts the diff review and terminal (CR-003 M10, v1 scope).
6. **Draft-then-you-send (from the Dots email screenshot).** Outward actions appear in the workspace as drafts with a single blue **Send** that only the client presses (BR-15, B5-#6).
7. **Motion: "calm and alive"** (Grok Bot feel + Apple restraint).
   - The hero avatar idles with a subtle breathe or blink; eyes shift with the state (focused when Working, sleepy when Idle).
   - Messages slide in 8px with a fade (180ms).
   - A handoff animates a small avatar "chip" travelling between conversations (300ms).
   - The badge changes with a crossfade.
   - Everything respects `prefers-reduced-motion`; nothing flashes.
8. **Density.** Apple's spacing scale (4-based), with 16/24 paddings in panels and 12px element gaps. The sidebar is a thin icon rail (Dots) that expands to labels on hover or by setting.
9. **Accessibility:** text tags beside color and glyphs (the ui-ux-guide adaptation), and WCAG AA on every agent tint (tints are light; text stays Carbon).
10. **Dark mode:** later (Phase 5b), following the guide's dark-mode rules.

11. **Voice (v0.2, U8).** The app speaks as the main agent talking to the client, in the second person: "What needs you", "Needs you · 8", "Your agents", "You're all caught up", "Tell you when Noor needs you". It never uses "me" or "my" for the client. Agents still say "i" about themselves (lowercase agent voice), and the client's own chat messages are the client's words.

## 3. Decisions for the client
**Confirmed 2026-10-22** with the recommended options:
- D-UI1: Body size **15px**.
- D-UI2: Hero avatar render **soft dimensional**.
- D-UI3: A faint per-agent canvas wash behind its chat: **yes**.
- D-UI4: The sidebar: the agent list that collapses to an avatar rail (the revised D-UI4 of §4).
- D-UI6: Theme: light first (Apple base), dark as a mode later.
- D-UI5: The name: **deferred**. "Bench" stays the codename.

## 4. v0.2 changes (client feedback round 1)

| # | Client feedback | What v0.2 builds |
|---|---|---|
| U1 | "the routine screen looks bad" | **Bug fixed at the source:** every SVG now has explicit `width`/`height` (the v0.1 clock had none and filled the pane). Routines (agent pane › Routines, `#agent-routines`) is a list: name, a **Read-only** badge (CR-003 M4), an on/off switch, the schedule in plain words, then three figures: **next run**, **last run with its cost** (tokens and % of your week), and the **pre-run estimate** (CR-003 M2). A summary line totals the week ("2 of 3 on · about 1.3 % of your week"). **New routine** takes plain words, drafts the schedule and shows the estimate *before* Save. Empty state with examples: `#agent-routines-empty`. |
| U2 | "the bot settings is minimal" | Agent Settings is rebuilt with a **section nav** (one section per view, each nav item shows a one-line summary of its current value) and the pane widens while Settings is open. **Profile** (avatar, name, title, description, home team, lead) · **Model** (tier, with the per-turn cost of each) · **Autonomy** (preset, per-tool overrides, the fixed "always asks you" rows, **active grants with Revoke**, including one granted by Atlas on your behalf) · **Connectors** (from your Claude Code inventory, per-agent switches, the per-turn token cost, "not in your inventory" shown) · **Skills** (the built-in Developer library, CR-005, plus your own) · **Memory** (private notes, team and global scope, **checkpoint slider 50–85 % with the fixed 90 % ceiling drawn**; it moves the marker in the agent header too) · **Workspace** (folder grants with Revoke, **browser opt-in**, CR-004, and its routine opt-in) · **Notifications** (with a preview of how one arrives) · **Lifecycle** (pause, archive, duplicate without memory, loan, and **delete as a Reserved action** with a typed-name confirm). Every control saves itself; the pane header says "Saved · applies from Noor's next step". Routes: `#agent-settings`, `#agent-settings-<section>`. |
| U3 | "the option to create a project is gone" | **New project** is back: a text button in the sidebar's Projects header, a New project card on Home, and in the sidebar's "+" menu (New agent / New project). It opens the create-by-conversation dialog in project mode: Atlas drafts a one-page proposal with the team, sprint and a token estimate; nothing is created until you press Create project (BR-58, BR-61). Route: `#new-project`. |
| U4 | "collapse a project view in the panel and open it wherever I want" | Projects in the sidebar are **collapsible groups** (Dashboard, Team chat, the agents, "3 more"). Each group, each Home project card and each pane header has a visible **"…" menu** (keyboard) and the **same menu on right-click**: Open here · Open in split view · Open in a new window · Collapse/Expand. A group header can also be **dragged** onto the main area (drop left = here, right = split). The **split view** (`#split`) shows two project dashboards side by side with a resizable divider (drag or arrow keys), Swap sides and Close pane. One project in the main area: `#project-bench`, `#project-ik`. "New window" is described, not simulated. |
| U5 | "home screen should show the current projects not teams now" | "Team now" is replaced by **Projects**: one card per active project (sprint and day, a progress bar at the true ratio with both ends labelled, the team avatar stack, a "6 need you" count, the live activity line) plus a New project card. |
| U6 | "tickets … tap on one it enlarge and the other become small" | "What needs you" items are **separate rounded tickets** on the Frost canvas, with no divider lines. Tap or Enter/Space opens one: it shows the details, the evidence (options, the email draft, the command, the checks) and its actions with **one primary**; the others **shrink** to one-line tickets (avatar, title, status tag). Esc closes and returns focus; ↑/↓ move between tickets. It animates `grid-template-rows`, padding and the avatar size over 320 ms, and is instant under reduced motion. Resolving a ticket (Allow once, Deny, Mark as paid) removes it and updates every count. Routes: `#home-ticket-open`, `#home-empty` ("You're all caught up"). |
| U7 | "the top bar could be … more minimal modern and clean" | The top bar lost its border, fill and boxed controls. It keeps the breadcrumb, a **quiet usage ring** ("41 % of your week"; reset time and headroom in the tooltip and label) and **"Needs you"** as a text button with a count. It sits on the screen's own canvas (Frost on Home). |
| U8 | "talking to me like 'what need you'" | The voice rule (§2 rule 11) is applied to every string in the file: "What needs you", "Needs you", "All caught up", "Tell you when…", "Revoke it in Noor › Settings › Autonomy", "Done editing, continue" (was "I'm done"). The suggestion chips no longer put "me/my" in the client's mouth. |

New routes, added to the v0.1 ones (`#home #agent #team #tokens #agent-takeover #new-agent`): `#home-ticket-open #home-empty #agent-routines #agent-routines-empty #agent-settings #agent-settings-{model,autonomy,connectors,skills,memory,workspace,notifications,lifecycle} #split #project-bench #project-ik #new-project`.

## 5. Checklist results (direction v0.2)

**Artifact:** [`prototype/direction.html`](prototype/direction.html) (one file, no network). Tabs: Home · Agent · Noor · Team chat · Split view · Tokens. v0.2 rows that changed are marked **(v0.2)**. It is built with the recommended options for D-UI1 to D-UI3. D-UI4 changed: the sidebar is now a Grok Bot-style agent list that collapses to an avatar rail. The file folds in the Grok Bot recording findings (2026-10-22): an agent-list sidebar, a new agent created by conversation, thinking dots in the agent's colour, an inline workspace card with Take over, checklist summaries, system lines, mention chips, held drafts, emoji reactions, a toggleable side pane with screen, routines and settings, and lowercase agent voice. It also has a "Reduce motion" switch and a "Demo: Noor's state" picker in the demo chrome. Neither is part of the UI.

ui-ux-guide review checklist (✅ pass · ⚠ partial · ❌ fail · N/A):

| # | Item | Result | Notes |
|---|---|---|---|
| 1 | One intent, one primary | ✅ **(v0.2)** | Home at rest has **no** filled button: the tickets are the action. Opening a ticket shows its one primary ("Decide on QA-3", "Allow once"…), and the other tickets shrink, so there is never more than one blue. Agent: "Allow once" while the request is pending, then Stop, then Send (the fill moves). Routines and Settings add no blue (New routine, Save routine, Revoke are secondary). Split and project views have no filled button. Team chat: Send. The dialogs and take-over each have one. |
| 2 | ≤ 7 per group, chunked | ⚠ **(v0.2)** | What needs you shows the top 5 and puts Meet and FYI behind "Show all 8". Sidebar: projects are collapsible groups; Bench shows Dashboard, Team chat and 4 agents, with the other 3 behind "3 more" (7 rows). Board columns cap at 4 cards ("1 more"). **Over:** the Settings nav has 9 sections (the BRD needs them all); each is one view and its summary line makes the list scannable. |
| 3 | Key actions large, on the eye path, consistent | ⚠ | Primaries are 40 px pills and Stop sits in the header. "Allow once" lives in the workspace pane. If the client hides the pane, the inline card ("Action needed") and the pointer line lead back to it, but the primary is then off screen. |
| 4 | Weight leads to the primary and "needs you" | ✅ | One blue per screen. Attention items get filled tags (Blocked, Outward) and the amber "Action needed" pill. **(v0.2)** Project cards carry an amber "6 need you" tag; the open ticket is the largest object on Home. |
| 5 | 60-30-10, feedback colours, text with every status | ✅ | Frost/White/Carbon base. Blue is the only accent. Green = Done, amber = needs you, red = error, always with a word. Status tags sit next to names in the roster, the header, members and approvals. Sidebar rows are too tight for a tag; there the badge has a tooltip and aria-label, and "Typing…" is shown in words (the same exception as the low-fi chat sender lines). |
| 6 | Distinct states, visible focus | ✅ | Hover = surface shift, press = scale .98, focus = 2 px Apple Blue ring, disabled = Pebble with grey text. Selected tabs = a white pill on a grey track (not blue). |
| 7 | 40–60 ch, 120–150 % line height, one scale, ≤ 2 faces | ✅ | Bubbles max 30em (≈ 60 ch) at 1.47. Descriptions are ≤ 46 ch. One scale (12/14/15/17/21/28/40) plus code at 12.5 px. Inter (or SF) plus a monospace. |
| 8 | A system across screens | ✅ | One token set, one avatar function, one tag set and one badge set on all screens. |
| 9 | Empty states | ✅ **(v0.2)** | What needs you: "You're all caught up. The team is working on 7 things" + Open the Bench dashboard (`#home-empty`). Routines: "No routines yet", why, and two example routines that draft on click (`#agent-routines-empty`). Project needs: "Nothing needs you on InterviewKit." Grants and folders say what happens with none. Other screens keep the low-fi (v0.4) states. |
| 10 | Errors: cause + next step; worst moment designed | ⚠ | Designed: the pending approval, Stop ("Stopping after the current step", then "Request withdrawn, nothing ran"), Error hero copy ("test runner crashed (out of memory) · retrying once at 09:20") and a time-up debate. Not shown yet: the usage limit, a blocked escalation detail, a failed write. |
| 11 | Peak-end | ✅ | Allow → full suite → "all green" checklist (PR #44, S1-4 In review) → Noor goes Idle. New agent: colour morph, "Renamed to Lumen", Create, and a 10 s toast with a link. |
| 12 | Feedback and loading | ✅ | Live test counter, thinking dots, "wrapping the run" line, toasts, press states, a debate timer with a bar. |
| 13 | WCAG AA, keyboard, reduced motion | ⚠ | Every text pair is computed live on the Tokens tab: neutrals, the feedback inks, all 10 agent inks on white and on their tints, and Carbon on every tint all pass AA. Keyboard: arrow keys on tablists, a focus trap and Esc on the dialog and take-over, and focus returns. Reduced motion: the OS setting plus a demo switch stop every animation and transition. **(v0.2)** New form fields (Settings, New routine, delete confirm) use a new `--control` border (#8e8e93, 3.3:1). Tickets, menus, the settings nav and the split divider are keyboard-operable (Enter/Space, Esc, arrows; the menu is `role="menu"` with focus return). **Open:** the composers and the sidebar search still use Hairline (about 1.5:1); drag-to-split is pointer-only (the "…" menu is its keyboard path); the take-over "You" cursor is a pointer-only demo. |
| 14 | Targets ≥ 32 px, primaries ≥ 40 px | ✅ | Sidebar rows ≥ 40 px, icon buttons 32–36 px, primaries 40 px. |
| 15 | No dark patterns; costs and outward actions explicit | ✅ **(v0.2)** | Every agent message shows tokens and % of the week. Routines show the last run's cost, an estimate per run and a weekly total, and a new routine shows its estimate before Save. The model tiers and connectors show their per-turn cost. Grants show who granted them (you, or Atlas on your behalf) and have Revoke. Deleting an agent is marked Reserved and needs the typed name. The usage ring stays in the top bar. No dollars except the payment item (Q11). |
| 16 | Nothing purely decorative | ⚠ | The hero's gradient, highlight and ground shadow are decoration by design: the one illustration the direction allows. Everything else has a job. |
| 17 | Avatars show status with a label; sizes fit context | ✅ | Eight distinct badge glyphs readable at 24 px (Tokens › Status). Sizes: 16 (mention), 20–24 (inline, board cards, small tickets, team stacks), 32 (chat, header, tickets), 36 (sidebar), 40 (lists), 64 (settings), 96 (hero). In tickets the status is the text tag beside the title. |
| 18 | Microcopy: plain states, possibilities, reassurance | ✅ **(v0.2)** | One status vocabulary, second-person voice (rule 11). "Nothing is created until you confirm", "Noor reads and reports; anything that writes or sends waits for you", "Only you can delete an agent", "That ceiling can't be changed", "Revoke it any time in Noor › Settings › Autonomy". |

### Rules from §2 that were bent, and why
1. **Chat bubbles use an 18 px radius** (rule 1 allows only 8 px and 980 px). An 8 px bubble reads as a card, not a chat (Jakob's law). Apple's own Messages, Dots and Grok Bot all use soft bubbles. Composers and inputs keep 8 px. **(v0.2)** The "What needs you" tickets reuse the same 18 px radius, because the client asked for "bubbles or tickets"; no new radius token was added. Project cards, routines and settings keep 8 px.
2. **Agent colour appears in two more places** than rule 3 lists: mention chips (treated as a name tag) and the thinking dots (identity, from the Grok Bot recording). It never appears on a button or an action. Dots use the hue's deep shade (≥ 3:1 on the wash) and always come with the word "Thinking".
3. **Sidebar (rule 8 / D-UI4):** the Grok Bot recording replaced the thin icon rail with an **agent list** (search, avatar, name, last-message snippet, time, "Typing…", a cluster avatar for the team chat, the client at the bottom) that **collapses to an avatar-only rail**. This brings agent rows back into the sidebar, which v0.3 had removed. The IA is kept: Home, Approvals, Company, the project's Dashboard / Team / Sessions as icon links on the Bench group header, then Memory, Usage, Trace.
4. **An approval card inside the agent's workspace pane** (the UX package Q5 default is "inbox only"). The brief asked for it. It complements the inbox: the same request still appears in What needs you and Approvals. **(v0.2)** It is one fact: allowing it in either place clears both.
5. **"Router picked Karim" is written "Bench picked Karim (@mention) · 0.3k tokens"**, because UX principle 10 keeps system words like "Router" out of the client's view.
6. **Ash is #6e6e73** (Apple's current secondary label colour) instead of the reference's #707070. It gives 4.7:1 on Frost instead of 4.54:1.
7. **The hero's soft ground shadow** goes against "no shadows". Apple allows shadow on product imagery, and the hero avatar is imagery. No UI element has a shadow.
8. **Lowercase agent voice** (Grok Bot) next to Apple's sentence case. Only agents write lowercase; the interface, system lines and the client's messages stay in sentence case.
9. **Nine shapes, ten hues:** a tenth agent (Lumen in the demo) reuses a shape with a new colour and eyes, so "each agent its own shape" can't hold beyond nine agents. **(v0.2)** With a second project (InterviewKit: Rana, Yusuf, Tala) there are twelve agents, so hues now repeat **across** projects (Yusuf shares Iris's aqua, Tala Maya's mint, Rana Lumen's honey) but never inside one project.
11. **(v0.2) The ticket shrink animates layout** (`grid-template-rows`, padding, avatar size) rather than only transform and opacity. It is short (320 ms), user-triggered, and off under reduced motion.
12. **(v0.2) Zero filled buttons on Home at rest.** v0.1 made the top item's verb the Home primary (audit H2). With tickets, the primary lives inside the opened ticket, so the resting screen has none.
10. **Dark mode isn't built** (rule 10 says later). Grok Bot is dark, so this is the obvious Phase 5b follow-up.

### New decisions for the client (raised by this direction)
- D-UI4 (revised): the agent-list sidebar, collapsible to an avatar rail. Should it start expanded or as the rail?
- Q5 (revisited): approve inline in the agent's workspace **and** in the inbox, or the inbox only?
- Lowercase agent voice: yes or no.
- Emoji reactions (👍) from agents: yes or no. They render with the OS emoji font.
- Take over: Noor pauses while you edit her workspace, then continues from your change. Is that right?
- New agent by conversation: the new agent greets you, Atlas drafts it, and you press Create. Confirm that the agent speaks for itself before it exists.
- Bubble radius 18 px and agent-coloured thinking dots (bends 1 and 2).

**New in v0.2:**
- ~~D-UI7~~ **Decided:** open the top ticket by default. Was: Should Home **open the top ticket by default** (one click less, a blue button visible at rest), or start with all tickets equal as built?
- ~~D-UI8~~ **Decided:** keep 10 hues; identity = hue × shape. Was: Hue reuse: once there are more than 10 agents, should hues **repeat across projects** (as built) or should the palette grow past 10?
- ~~D-UI9~~ **Decided:** no separate windows; open as an in-app pane/tab. Was: "Open in a new window": a real second app window per project (Electron supports it; more to build and test), or split view only for v0.1?
- ~~D-UI10~~ **Decided:** saves as you go. Was: Settings saves as you go (as built) or with one Save per section?
- ~~D-UI11~~ **Decided:** routines can do anything the agent can (CR-006). Was: Routines are read-only by default (CR-003 M4). Should a routine ever be allowed to write files (with an explicit opt-in per routine), or is read-only a hard rule?
