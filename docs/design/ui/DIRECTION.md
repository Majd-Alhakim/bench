# UI Direction: "Apple built a Grok Bot × Dots" (draft for client review)

**Status:** **v0.3**, updated **2026-10-23** with the client's brand round 2 ([notes](../../requirements/interviews/2026-10-23-brand-decisions.md)): every brand decision is now closed except the name (§0.1, §0.2). v0.3 rebuilds the prototype on the stage-1 brand ("In plain sight", the Look) and design system, and on the UX premium spec. **§0 below is the current state**; §1–§5 are kept as the v0.1/v0.2 history. v0.1 was the PM synthesis of the client's references; v0.2 applied the first round of UI feedback (U1–U8, [interview notes](../../requirements/interviews/2026-10-22-ui-feedback-1.md)). ADR-0001 is accepted, and the name is still deferred ("bench" stays the codename). The low-fi flows (UX prototype v0.4) stay the structure; this defines the look and feel.

## 0. Direction v0.3 (current)

**Artifact:** [`prototype/direction.html`](prototype/direction.html), one file; its only network use is Google Fonts for review (the app bundles the OFL files). **Logo files:** [`brand/logo/`](brand/logo/). **Brand:** [`brand/BRAND.md`](brand/BRAND.md) and [`brand/brand-board.html`](brand/brand-board.html). **System:** [`system/DESIGN-SYSTEM.md`](system/DESIGN-SYSTEM.md), [`system/tokens.css`](system/tokens.css), [`system/components.html`](system/components.html). **UX spec:** [`../ux/premium/`](../ux/premium/README.md). The 3D office concept was explored and dropped by the client; it is archived and plays no part in v0.3.

### 0.1 Decided (final, applied everywhere in v0.3)

| # | Decision | Where v0.3 shows it |
|---|---|---|
| R1 | Blue means "your call"; chat Send is a dark control | One Cobalt button per screen, always a decision (Allow once, Use nightly E2E, Join and decide, Let it run, Create Lumen). Every composer's Send is Ink. "In review" and the diff hunk lost their blue tint |
| R2 | One inbox | The sidebar has **What needs you** only; "Decided by Atlas" is a filter on it (`#needs`). The workspace approval card is the same ticket, so resolving it anywhere clears it everywhere |
| R3 | One corner family 18 / 10 / pill | Tokens collapse to `--r-obj` 18 (tickets, cards, bubbles, dialogs, menus, toasts, banners) and `--r-in` 10 (options, inputs, wells, menu items, the bubble's tail), plus pills for controls; continuous corners where the engine draws them. The old xs/md/xl names are aliases. **Follow-up:** `system/tokens.css` and DESIGN-SYSTEM §6 still list five radii and should collapse the same way |
| R4 | Lowercase agent voice keeps names and code | "PR #44 open", "hi. i'm Lumen", "the Stop button… replaces Send", `VCRUNTIME140_1.dll` |
| R5 | FYI is not counted | Counts are Decide + Meet everywhere (top bar, sidebar, Home heading, project cards, panes); For your info is listed, not counted |
| R6 | Atlas approves learned preferences, with Undo and Forget | Home's "Your team learned 7 things this week" (each: Open, Forget, then Undo); Memory notes say "Atlas approved"; "Decided by Atlas" filter |
| R7 | Suggest a standing grant after 3 identical allows; the same for the guard | The FYI ticket "Always allow `pnpm lint --fix` in bench?" and the new **`#guard-exempt`**: "You've run Dependency check yourself the last 3 times it waited. Let it run?" with Undo on the routine. Never for outward or reserved actions |
| R8 | ≤ 4 type sizes and 2 weights per view | Weights are 400/600 only (a global `b, strong` rule, the command line and the workspace thumbnail lost 500). Content views use at most 12 · 15 · 20 · 28 (Home) or 12 · 13 · 15 · 20 (agent); the frame (sidebar, top bar, its banner) is a fixed frame with 12/13/15 |
| R9 | No two agents with the same hue + shape on one screen | All 20 identities in the sample are unique pairs (checked across the sidebar, split view and Field Notes) |
| R10 | First-run targets: Atlas's first reply < 3 min, a finished task < 5 min | `#first-run` → `#home-first`: the first answer is a real checklist from your GitHub issues and becomes the first ticket |
| R11 | A paused sprint's end date doesn't move by itself | `#usage-limit` says so on the project card; **`#limit-reset`** now opens Maya's proposal: "Sprint 2 ran out of time while paused. New end date?" (Tue 27 Oct, or close it now) |
| D-UI7 | Top ticket open by default | Every Home load and every inbox opens the top ticket; its decision is the screen's one blue. **Bug fixed in v0.3:** tickets with options (QA-3, issue #12, the sprint proposal) had no primary button at all, and pressing one would have thrown; now the primary follows the option you pick |
| D-UI8 | Identity = hue × shape | 10 hues × 9 shapes; the picker dims hues already used in the project |
| D-UI9 | No OS windows | Every menu says **Open in a new tab** (in-app); split view is in-app |
| D-UI10 | Settings save as you go | "Saved · applies from Noor's next step · Undo" in the pane header |
| D-UI11 / CR-006 | A routine can do anything the agent can | Routine badges come from Noor's permissions (Can edit files / Read-only); "Anything outward or reserved waits for you" |
| P-5 | Continuous corners | Covered by R3 |
| P-6 | "Look inside" replaces "Trace" | The client kept it: the eyes glyph + "Look inside" on every receipt, run, note and approval |
| **B-2** (23 Oct) | **Logo = Quartet**: four character shapes in a 2 × 2, for the mark, app icon, favicon and lockup; replaces the lit-window eyes mark | The sidebar lockup, the first-run screens, the System sheet, Bench's own tickets (the mark in Ink), the favicon; files in `brand/logo/`. The eyes stay on the faces and on Look inside |
| **P-1, P-2** (23 Oct) | **Keep the brand and Porcelain / Ink / Cobalt** (supersedes the 22 Oct "not blue" note) | Unchanged: they were built that way |
| **P-3** (23 Oct) | **Instrument Sans 400/600 + JetBrains Mono**, SIL OFL, bundled | Every screen. Same six steps and two weights; the face sets a little narrower than Segoe UI, so nothing that fitted before overflows. The lockup's name is part of the logo, not a type step (R8 unchanged) |
| **P-4** (23 Oct) | **Pear replaces Periwinkle** | Karim is Pear everywhere |
| **P-7** (23 Oct) | **Sound on by default**: needs you, done, handoff; mute in Settings › Notifications; the first-open chime optional, off | The demo bar has a **Sound** switch (on). Needs you plays when the top ticket opens in the morning-open demo, when Atlas's first answer lands and when Noor's request appears; done on all green and when a ticket resolves; handoff when the brief chip travels. Nothing plays before your first click or key press. The System sheet has a Sound table with Play buttons |

### 0.2 Still open

Only **D-UI5, the name** ("bench" is a codename; the lockup takes any 3 to 8 lowercase letters). Boards B and C in `brand/explorations/` stay explorations. Dark mode is mapped, not built (Phase 5b). **Check in the build:** Instrument Sans at 12–13 px on Windows/Electron, and tabular figures in the bundled file.

### 0.3 What changed from v0.2

1. **Brand and system applied everywhere:** Porcelain/Ink/Cobalt, Instrument Sans + JetBrains Mono with 6 steps and 2 weights (since 23 Oct; was the platform's type), Pear, one continuous corner family, tone-first elevation, springs (`--spring-smooth/snappy/gentle`), the Look (agent faces, Look inside, attention glances), the Quartet mark and lockup (since 23 Oct; was the eyes mark), and three sounds (since 23 Oct; was silent).
2. **Every S1 and S2 coherence finding fixed** ([coherence-audit.md](../ux/premium/coherence-audit.md)): C-01 top ticket open · C-02 routine badges from permissions · C-03 "Open in a new tab" · C-04 New project with fields you type into and the consequence on Create · C-05 one ApprovalCard (the Ticket) in inbox, Home and workspace · C-06 one Receipt (`time · tokens · % of your week · Look inside`) · C-07 `pnpm test` throughout (the brand board too) · C-08 counts are Decide + Meet, one inbox · C-09 Team and Sessions on the project group, clickable crumbs · C-10 one corner family · C-11 the Ticket everywhere (compact in panes) · C-12 one status vocabulary · C-13 tag grammar Kind / Gate (outline + lock) / State (filled) · C-14 Ink Send · C-15 de-boxed agent header · C-16 one time format ("since 07:45") · C-17 crumb grammar Project › Page · C-18 Undo on every reversible toast · C-19 "Open Lumen" · C-20 "Balanced" · C-21 guard vocabulary · C-22 verb + object primaries with the consequence · C-23 Join and decide is the debate's blue.
3. **S3s fixed:** C-24 (R8), C-26 (R4), C-27, C-28, C-30, C-31 (the draft's system line), C-32 (R9), C-34 (control edges 3.4:1), C-35 ("1 needs you" link in the header), C-36 (settings in three groups), C-37 ("uses no tokens" captions), C-38 (Watch / Take over). C-25 (spacing snaps) is mostly done; C-29 (tinted bubbles in 1:1 rooms only) is built, and still needs a line in DESIGN-SYSTEM; C-33 is the PM's render pass.
4. **Worst moments designed per [worst-moments.md](../ux/premium/worst-moments.md)**, each with cause, what's safe, one next step and the "they caught me" detail, plus the ending (While you were away / You're signed in again / Good morning, your week reset). New in this pass: `#guard-exempt`, `#slow` (status line changes at 10 s and 60 s; Stop never moves), `#long-message` (a 500-line log shows the 12 lines around the error with the count, scrolls inside, or opens in the workspace), `#long-names` (ellipsis in the sidebar, tickets and headers; project names clamp to 2 lines), and Maya's sprint proposal on `#limit-reset`.
5. **Intelligence layer visible:** Applied chips in replies ("Applied: your PR style… preference from 20 Oct", "keep components under 200 lines") and now on the email ticket ("Applied: your sign-off, “Best, Majd”"); the Ledger under every agent ("Together since 14 Oct · 312 runs · 46 notes · 12 lessons"), ticking when a run or lesson lands; "Your team learned 7 things this week" on Home; learned lines with Undo in chat; lessons saved from a denial and from a retry; new agents and projects start with the team's notes ("Lumen starts knowing 18 things"); Memory exports as plain Markdown.
6. **Signature moments animated** with springs, each replayable from the demo bar's Play button, all reduced-motion safe (the same state, at rest): the morning open, resolve-and-fold with counts ticking, all caught up, the glance, allow → all green with the Applied glow, birth and the flight to the sidebar, the brief travels, the debate condenses into a memo, Atlas forms on first run, waking in resume order, the team gathers.
7. **Bug fixed: the agent hero's ledger line.** The sticky hero faded to transparent in its own bottom 16 %, exactly where "Together since…" sits, so scrolled messages showed through under it. The hero is now solid and the fade hangs below it, over the messages.
8. **Brand board:** the cast row's names now sit 8 px under each character's ground (each shape pulls its caption up by its own empty band), the masthead fills the first screen with the hero centred and the cast directly under it (no dead band at 1440×900), `pnpm test` throughout, and the decisions chapter shows what's open vs decided.

### 0.4 Routes (all v0.2 routes still work)

- **Screens:** `#home` (alias `#home-ticket-open`) · `#home-empty` · `#needs` · `#agent` · `#agent-routines` · `#agent-routines-empty` · `#agent-settings` and `#agent-settings-{model,autonomy,connectors,skills,memory,workspace,notifications,lifecycle}` · `#agent-takeover` · `#team` · `#split` · `#project-bench` · `#project-ik` · `#room-{atlas,iris,maya,omar,lina,sam,karim,jade,rana,yusuf,tala}` · `#memory` · `#usage` · `#trace` · `#tokens` (alias `#system`)
- **Flows and moments:** `#first-run` · `#first-run-folder` · `#first-run-name` · `#first-run-team` · `#home-first` · `#new-agent` · `#agent-first` · `#new-project` · `#project-new` · `#agent-green` · `#team-memo` · `#project-sprint-done`
- **Worst moments:** `#offline` · `#offline-back` · `#usage-limit` (aliases `#limit`, `#home-limit`) · `#limit-forecast` · `#limit-reset` · `#login-expired` · `#login-back` · `#run-failed` (alias `#agent-error`) · `#agent-error-retried` · `#approval-denied` (alias `#needs-denied`) · `#agent-checkpoint` · `#agent-checkpoint-incomplete` · `#connector-revoked` · `#connector-back` · `#needs-conflict` · `#needs-conflict-resolved` · `#guard` · `#guard-exempt` · `#slow` (alias `#agent-slow`) · `#long-message` (alias `#agent-long`) · `#long-names`

### 0.5 Premium-craft rubric (v0.3)

| Axis | Level | Evidence |
|---|---|---|
| Copy | **Staff** | Second person throughout; consequences on buttons ("Merge PR #41 · 6 files · notifies Karim and Noor", "Let it run · ≈ 0.30 % a week"); recoveries name cause, what's safe and one step; the Monday digest and "Bench never saw your password" answer the next question |
| Visuals | **Staff** | The Look is the custom visual language (faces, Look inside, attention) and the Quartet mark is built from the agents' own shapes; nothing decorative besides the hero render, which is the agent |
| Color | **Senior** | 60-30-10, one Cobalt decision per screen (R1), amber only for needs you, hues only for agents, every status also in words |
| Type | **Senior** | 6-step scale, ≤ 4 sizes per content view, weights 400/600, tabular figures on every changing number, tight tracking on 20+ |
| Structure | **Senior** | One grid and 4-pt spacing by relationship; one corner family; the hierarchy test passes on Home (the open ticket, then the list, then projects) |
| States and recovery | **Staff** | Every worst moment in the spec is a route with an ending; failures leave a lesson that's reused later (the recovery paradox) |
| Motion and emotion | **Senior** | Springs with stated physics; 2–3 pinned moments per flow; only characters overshoot; reduced motion keeps the information |
| Coherence | **Senior** | One Ticket, one Receipt, one recovery card, one status vocabulary, one tag grammar, one corner family across all screens |
| Intelligence | **Senior** | Learning is visible where it's used (Applied chips, the Ledger, learned lines) and deposits are automatic, with Undo/Forget and Markdown export |

**Blockers left:** none on the rubric. **Not yet done:** the render pass at 1440×900 and 1280×800 (this session had no browser; the PM renders every route with headless Edge next), `tokens.css` and DESIGN-SYSTEM §6 to collapse to the R3 family, and dark mode (mapped in the system, not built: Phase 5b).

---

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
