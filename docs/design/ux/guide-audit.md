# Bench low-fi prototype: audit against the ui-ux-guide skill

| Item | Value |
|---|---|
| Audited | `scratchpad/audit/index.html` (prototype v0.1, 14 screens) and `scratchpad/audit/ux-README.md` (UX package v0.1) |
| Against | `.claude/skills/ui-ux-guide/SKILL.md` (rules, Bench adaptations, 18-point checklist) |
| Phase | 4 (low-fi). In scope: structure, hierarchy, choice load, intent, primary actions, empty states, errors and worst moments, endings, microcopy and basic accessibility. **N/A (Phase 5):** colour, type tokens, motion, final sizes and avatars, except where the low-fi already breaks something structural |
| Prototype modified? | Not by the audit itself. The findings were then applied in prototype **v0.2** (`docs/design/ux/prototype/index.html`), together with client decisions D1–D6 (`docs/requirements/interviews/2026-10-22-ux-audit-decisions.md`). See the Status marker on each finding |
| Auditor | UX Designer, 2026-10-22 |
| Status update | 2026-10-22, v0.2: 32 of 32 Must-fix-before-G4 findings **Fixed (v0.2)**; 8 findings remain **Phase 5** (handed to UI). §1 and §2 still describe v0.1 as audited |

Legend: ✅ passes · ❌ fails (see notes and findings) · N/A not applicable or deferred to Phase 5.
Severity: **High** (blocks a validation task or breaks a Bench adaptation), **Medium** (a rule broken on a key flow), **Low** (polish or an edge case).
Tag: **Must-fix-before-G4** (fix in the low-fi or the UX package) or **Phase-5** (hand over to the UI phase).
Status (added 2026-10-22): **Fixed (v0.2)** (applied in prototype v0.2) or **Phase 5** (open, handed to the UI phase).

---

## 1. Screen cards

Empty-state types: **FU** first use · **NR** no results · **CL** cleared · **ER** error. Also listed: **LD** loading.

| # | Screen | Intent | Primary action (as built) | Worst moment (peak-load) | Ending (peak-end) | Empty / loading / error states covered |
|---|---|---|---|---|---|---|
| 1 | First run | Do | Continue (per step) → "Finish and talk to Atlas" (large) | Claude Code not installed or not signed in: **designed** (exact command, Copy, Check again, "Bench never shows its own Claude login"). **Not designed:** folder not writable (F1 E3), write failure at Finish (F1 E6) | Lands in the CEO chat with a welcome message and suggested messages. Toast: "Created Atlas and 6 agents. Files are in …" ✅ | LD ✅ (Checking…) · ER ✅ not installed / not signed in / API-key warning · ER ❌ folder / create failure · FU N/A |
| 2 | Home | Know → Do | **Two:** the top "needs me" verb (filled, small) **and** Send to CEO (filled). The annotation itself lists both | Usage limit: **designed** (cached status with its age, "your message will be saved and sent at 14:00", list stays live) | Items resolved elsewhere drop off the list; the empty list returns ✅ | FU ✅ "Nothing needs you" (no action button) · CL ❌ reuses the first-use copy; F4's "Team is working on 6 items" is missing · LD ✅ status · ER ✅ limit · NR N/A |
| 3 | Org tree and editor | Go / Do | Add agent (header), but the side panel also has a filled "Open chat" | Write failed: **designed** (exact file, cause, "rolled back", Try again). Loan declined: designed | Add agent → toast "Open its profile to add connectors" with **no link** ❌ | FU ✅ CEO only (3 actions, one primary) · LD ✅ · ER ✅ · NR N/A |
| 4 | Agent profile | Do | Save changes (Draft state adds a second filled "Save and create") | Delete: **designed** (typed-name confirm, says what stays). **Not designed:** leaving with unsaved edits across 8 tabs, save failure | Toast "Saved to agents/noor/agent.md. Applies from the next tool call." ✅ | Draft / Paused / Archived ✅ · LD ❌ · ER ❌ save failure |
| 5 | Agent live chat | Do (+ Know) | ■ Stop (large) | Stop: **partly designed** ("Stopping at next safe point…" → "Noor has stopped. No further tool call will start."). **Not designed:** a slow stop (constraint C-A), "a shell command can't be undone" (F6 E1), "Connecting to run…" (F6) | Stopped → new instruction → "Redirect logged to Dev team memory" + Noor confirms ✅ | FU ✅ Idle (two variants, both with a next step) · Archived ✅ · LD ❌ · ER ❌ |
| 6 | Project team chat | Do / Know | Send / @assign | Send failed: **designed** (cause, "It's kept below", Retry) | @mention → "Task created … on the Bench board" system line ✅ | FU ✅ with an @-example · ER ✅ · LD ❌ (no sending state) |
| 7 | Meeting session (debate / interview / review) | Do | Debate: "Mark agreement reached" (unclear whose action) · Interview: Answer · Review: **three** filled buttons (Close session, Accept, Send) | Debate usage pause: **designed** (timer paused at 2:41, resumes 14:00). **Not designed:** closing a review with items still "To review"; usage pause for interview and review; "BA preparing" loading | Debate: memo → close → team-chat system line "memo saved · chat archived" + Open memo ✅ (the best peak in the app). Interview and review: a 4-second toast and a jump to Home ❌ | Paused ✅ (debate only) · LD ❌ · FU N/A |
| 8 | Proposal one-pager | Do | Approve (large) → Create project (large) | Creation failed: **designed** (folder, rolled back, proposal stays approved), but no explicit next step. Name clash: shown as a **toast**, not a field error (F2 E2) ❌ | "InterviewKit is set up. Rana has 'take over proposal'. You'll hear from Yusuf…" + Open dashboard ✅ (model ending) | Rejected / revising ✅ · ER ✅/❌ (see left) · LD ❌ (creating) |
| 9 | Project dashboard | Know | **None clear** (annotation: "Open a card · Full backlog") | Stale data: **designed** ("Showing the last loaded state from 08:31 … Nothing is lost. Retry"). Blocked card: dashed + BLOCKED tag ✅ | Accept on a card → "S1-2 accepted · 8 / 10 this week" ✅ | FU ✅ no sprint · FU ✅ empty backlog (InterviewKit) · LD ✅ · ER ✅ |
| 10 | Approval inbox | Do | Allow once / "Send this email" (one per card) | Action failed after approval: **partly designed** (raw `EBUSY…`, "counts as failed attempt 1 of 2", no next step for the client) ❌ | Last item resolved → "Nothing is waiting for you" + link to Atlas's log ✅ | CL ✅ · NR ❌ (filter with no match says "Nothing is waiting for you" while other items wait) · ER ⚠ see left · LD ❌ |
| 11 | Trace and cost | Know | Expand a step | Past retention: **designed** (what was removed, what was kept) | N/A | LD ✅ · FU ❌ (no runs yet) · NR ❌ ("Files only" filters) · ER ❌ |
| 12 | Usage meter | Know (+ Do when the guard is on) | Run now (guard) / Runs | Limit reached: **designed, exemplary** ("Paused and saved, resuming at 14:00 in this order …") | Guard turning off / work resuming ("client told", F9) not shown ❌ | ER ✅ ledger only (no next step) · FU ❌ (first week, no data) |
| 13 | Memory browser | Know / Do | Edit → Save note | Index rebuilding: **designed** ("about a minute… notes on disk are safe"). Stale "Delete": **one click, no confirm or undo** ❌ | "Note saved and re-indexed." ✅ | NR ✅ (no action) · ER ✅ · FU ❌ (no notes yet) · no backlinks ✅ |
| 14 | Settings | Do | Save (only in the Checkpoint section) | Out of range: **designed** (inline, aria-invalid, explains the 90 % ceiling) | "Saved. Default checkpoint threshold is 75 %." ✅ | ER ✅ · others N/A |

---

## 2. The 18-point checklist

Columns: **FR** First run · **HM** Home · **OG** Org · **AP** Agent profile · **LV** Live chat · **TC** Team chat · **SE** Session · **PR** Proposal · **DB** Dashboard · **AI** Approvals · **TR** Trace · **US** Usage · **ME** Memory · **ST** Settings.

| # | Check | FR | HM | OG | AP | LV | TC | SE | PR | DB | AI | TR | US | ME | ST | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | One intent, one primary action | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | HM: WNM verb vs Send. OG: Add agent vs panel "Open chat". AP: two primaries in Draft. SE: review has three filled buttons; the debate primary is ambiguous. DB: no primary. AI: one per card is acceptable. Composer "Send" is filled on every chat screen; declare it a Jakob's-law exception or make it secondary where the screen has another primary |
| 2 | ≤ ~7 per group, chunked, progressive disclosure | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | FR: a 7×7 preview table. HM: up to 9 ungrouped "needs me" items. OG: about 10 actions with duplicates. AP: 8 tabs; Autonomy has 10 rows. ME: flat note list (thousands at scale). DB's top 5 + "Full backlog" is the model to copy |
| 3 | Key actions large, on the eye path, consistent | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | N/A | ✅ | ❌ | ✅ | Accept/Approve comes in three sizes (review: small, card: normal, proposal: large). HM's top verb and ME's "Save note" are small. SE: Close session is top-right, away from the items. AI: "Allow once" is the most frequent action but normal size |
| 4 | Weight leads to the primary and to "needs me" | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | **The selected state uses the primary fill** (team radio in FR, Participant/Observer in TC, filters in AI, scopes in ME), so a screen shows 2–3 "primaries". DB doesn't lift "In review, waiting for you" or Blocked above the rest |
| 5 | 60-30-10; feedback colours; **every status has text** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | Colour N/A (Phase 5). Text tags everywhere (OUTWARD, RESERVED, LEAD, ON LOAN, BLOCKED, LIVE). ME: in the graph, "stale" is a dashed stroke and "selected" is a fill only |
| 6 | Default / hover / active / focus / disabled distinct | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Phase 5. Already OK: global `:focus-visible` 2px outline. Missing: an active state; disabled is opacity-only |
| 7 | 40–60 ch, 120–150 % line height, one scale, ≤ 2 faces | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Phase 5. Noted: 10 ad-hoc sizes (10.5–28px); `.doc` (720px) and chat bubbles run well past 60 ch; 145 % line height is fine |
| 8 | Spacing and type are a system | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Phase 5. Many inline margins; no spacing scale yet (expected in low-fi) |
| 9 | Every empty state explains itself and has a next step | N/A | ❌ | ✅ | N/A | ✅ | ✅ | N/A | N/A | ✅ | ❌ | ❌ | ❌ | ❌ | N/A | HM: no action in the empty list; "cleared" copy missing. AI: misleading filter no-results. TR, US, ME: no first-use state; ME no-results has no action |
| 10 | Errors give cause + next step; worst moment designed | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | FR: F1 E3/E6 missing. AP: unsaved edits / save failure. LV: slow stop, can't-undo. SE: review close with pending items. PR: name clash as toast. AI: raw EBUSY. TR: no error. US: ledger-only has no next step. ME: unguarded delete |
| 11 | Smooth ending: confirmation + next step | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | N/A | ❌ | ✅ | ✅ | OG: toast without a link. SE: interview and review end on a 4.2s toast. US: guard-off and resume not shown. Global: toasts carry no action and vanish after 4.2s |
| 12 | Feedback on key actions; loading shows progress | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | Hover/press feedback is Phase 5. Structural loading/progress states missing: AP saving, TC sending, SE "BA preparing", PR "Creating project…", AI "Running…" after Allow. LV's live tool-call list is excellent |
| 13 | WCAG 2.2 AA, full keyboard, reduced motion | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Everything is a real button; graph nodes are keyboard-operable; form errors set aria-invalid and move focus. HM: no `<h1>`; the whole chat is an aria-live region that is re-rendered on every update. Global (Phase 5): input borders `#c4c4c4` ≈ 1.7:1 (< 3:1); modals don't trap or return focus; tabs lack arrow keys / aria-controls. Reduced motion N/A (no animation) |
| 14 | Targets ≥ 32px, primary ≥ 40px | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Phase 5 sizing (estimates from CSS): `.btn.sm` ≈ 25px, `.chip` ≈ 24px, inline `.link.xs` text, 13px table checkboxes; `.btn.pri` ≈ 34px (< 40). Only `.btn.lg` (≈ 44px) passes: Stop, Approve, Create project, Continue |
| 15 | No dark patterns; costs and outward actions explicit | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | FR: Gmail connection pre-ticked; template pre-selected. AI: "Always allow" doesn't say what it grants. Global: "≈$" on every message on a subscription plan reads like a bill (client decision) |
| 16 | Nothing only decorative | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Demo controls inside the UI ("Skip to time's up (demo)", "Demo: revised draft is ready"); dead affordances ("More views: Epics · Kanban · Flow", "Documents (14)", "Change order…", "Open folder in another editor", "Files only"); duplicated Org actions; "Editable? Open question (Q7)" printed in Settings |
| 17 | Avatars show status with a label; sizes fit the context | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Phase 5 (README defers avatars). The **status vocabulary** is Phase 4 and is broken (finding H1). Sizes now 26px in lists (rule: 40–48) and 44px on the profile (rule: 56+); status sits beside the avatar, not on it |
| 18 | Plain state names; says what's possible; reassurance near usage/cost | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | HM: "Approval" vs "Work request"; verb "Open" for payment. LV/DB: raw lowercase `running` / `working` / `blocked`. TC: "Router", "Curator" in the client's view. AI: `EBUSY`. US: the top-bar meter has no reset time. FR's copy is the best in the app |

**Totals (screen cells):** ✅ 115 · ❌ 74 · N/A 63 (252 cells). Items 6, 7, 8 and 17 are wholly Phase 5.

---

## 3. Findings (most severe first)

Format: `screen — rule — problem — fix` · **severity** · **tag**.

### High

**H1.** Dashboard, Org tree, Live chat, Approvals — *Avatars: status shown with a label (idle, thinking, working, waiting for approval, error, paused) · Glass box · Status labels named plainly* — Noor shows "Running" (live view) and "running" (dashboard) while her `rm -rf node_modules/.vite` is **waiting for your approval** (Trace step 5, Approvals a3). "Running" and "Working" are both used with no difference explained; there is no "Waiting for you", "Paused" or "Error" run state; the dashboard and the live idle view print raw lowercase values. This undermines T4 ("can't tell whether she stopped") and T3. — Define one status set for agents and use it everywhere: **Idle · Thinking · Working · Waiting for you · Blocked · Paused · Stopped · Error**. Show "Waiting for you · Open approval" as a pointer line in the live view and as the tag on the team row and org node. Drop the Running/Working split. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H2.** Home — *Hick's/Miller's law, chunk and disclose · One primary action · Fitts* — "What needs me" grows to 9 ungrouped items (proposal, guard, review, meeting, 4 approvals, blocked). The top item gets the only primary, but that is just list order: on day 3 it's "Join review", above an outward email draft and a blocked team. The composer's Send is a second filled button. The top verb is a small button. — Group the list into **Decide (n)** / **Meet (n)** / **For your info (n)**, show the first 5 with "Show all". Agree a priority rule (see decision D2). Make the top item's verb the only primary on the screen at ≥ 40px. Treat composer Send as the standard chat pattern with secondary weight on Home. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H3.** Session (review) — *Peak-load: design the worst moment · One primary action* — "Close session" is a filled button at top-right, live from the first second while S1-2 and S1-3 are still "To review". Nothing says what happens to unreviewed items. Accept is a small button, and Send is a third filled button. — Move Close to the bottom-right after the items. If items are pending, show "2 items not reviewed. They stay In review and Maya will ask again. Close anyway?" (or disable Close with that reason; decision D6). Make Accept/Reject the per-item primary at normal size; make Send secondary. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H4.** Approvals (action failed) — *Errors give the cause and a next step · Agents speak plain language* — "Approved at 09:02, then failed: `EBUSY: resource busy or locked, node_modules/.vite`. Noor was told; this counts as a failed attempt (1 of 2)." The client gets jargon and no next step. — "The command couldn't run: another program (probably the dev server) has the folder open. Noor will close it and try again; you don't need to do anything. [Retry now] [Open Noor]". Keep the raw error behind "Details" (trace). · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H5.** Approvals — *Bench adaptation 4, no hidden actions; outward and grants explicit* — "Always allow" is enabled on a file-deleting shell command, and the card doesn't say what the grant covers (this exact command? any shell command? this repo? until when?) or where to revoke it. — Label the button with its scope, e.g. "Always allow this exact command in bench", add "Revoke any time in Noor › Autonomy", and log the grant in the card history. Scope granularity is decision D3. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H6.** First run, step 4 — *Bench adaptation 4, no dark patterns; outward actions explicit · BR-04 (never pre-installed)* — "Connect Gmail to Atlas" is **pre-ticked**, so one click on Finish gives an email-capable connector to an agent. The Product + Dev template is also pre-selected, so Finish installs it by default, though the README says both options are "equally prominent". — Gmail unticked (opt-in) with the same explanation. Start the team step with neither option selected and Finish disabled until one is chosen (or keep the template default if the client accepts it). Decision D1. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H7.** Memory (stale flag) — *Modals only for blocking decisions (delete) · No dark patterns · Peak-load* — "Delete" sits next to "Keep" with equal weight and deletes in one click, with no confirm and no undo ("Deleted (only you can delete)"). Deleting an agent, by contrast, needs a typed confirm. — Put Delete last and separate it visually. Either confirm ("Delete 'CI matrix (old)'? Agents will no longer recall it. The file goes to the Bench trash for 30 days") or give a 10-second Undo. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**H8.** Global (First run team choice, Team chat role toggle, Approvals filters, Memory scopes) — *Visual weight on the primary action; the strongest style is reserved for the primary* — Selected toggles and filters use the same filled `.btn.pri` as the primary action, so several screens show 2–3 equal "primaries" (Memory: selected scope + Edit; First run: selected template + Finish). — Add a distinct **selected chip** style (outline + check mark + `aria-pressed`), and keep the filled style for the one primary action. · **High** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

### Medium

**M1.** Live chat, Agent profile, Session, Proposal — *Navigation: back and close on the left* — Drill-down screens have no breadcrumb or back control. Proposal's "Back to Atlas chat" sits on the right. The README promises "a breadcrumb back to the project" for each hand-off. — Add a left-aligned breadcrumb (e.g. "Bench › Team chat › Debate", "Org › Noor › Live") on every screen below the sidebar level. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M2.** Session (interview, review) — *Peak-end: confirmation + next step* — Closing goes to Home with a 4.2-second toast ("2 feedback items became tasks…"). The client can't see or open the notes or the new tasks. — End on a close summary (inline panel or the dashboard with a banner): "Review closed · 1 accepted, 1 sent back · 2 new tasks [view] · Lina's notes [open] · chat archived in Trace". Generally, any toast that reports something created should carry its link and stay until dismissed or for at least 8 seconds. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M3.** Approvals — *Empty states: no results is its own type, never misleading* — With a filter selected (e.g. Payment after paying), the list says "Nothing is waiting for you" while 3 other requests wait. — "No payment requests. 3 others are waiting. [Show all]". · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M4.** Proposal (project preview) — *Errors give cause + next step; field errors stay with the field* — A name clash is a disappearing toast ("…is empty, too long or already used") rather than the per-field error F2 specifies. The creation error says what failed but not what to do. — Show an inline error under the offending name with `aria-invalid` ("'Maya' is already used by your PM. Pick another name"). In the error state add "Try again" and "Choose another Bench folder…". · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M5.** First run — *Peak-load; every flow state in the prototype* — F1's E3 (folder not writable) and E6 (write fails, nothing created) are missing, and Finish has no progress ("Creating Atlas and 6 agents…"). — Add the two error states with cause and next step, plus a short creating state. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M6.** Live chat — *Peak-load: state the exact reason and the next step* — "Stopping at next safe point…" doesn't say what it is waiting for or how long. F6 E1 ("a shell command can't be undone") and the "Connecting to run…" loading state are not built. This is the core of T4, and constraint C-A says stopping may be slower than 2s. — "Stopping: waiting for `pnpm test` to finish (usually under a minute). No new step will start." Add the E1 state ("This command already ran and can't be undone. Noor will report what it changed.") and the connecting state. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M7.** Session (debate) — *One intent and one primary · Occam* — The primary "Mark agreement reached" asks the client to judge the agents' agreement, which is not their role while observing. "Skip to time's up (demo)" sits in the real UI. — The client's primary is "Join (you'll be the decider)". Agreement is declared by the decider and shown as a system line. Move all demo controls into the annotation bar's state buttons. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M8.** Org tree — *Hick's law · Occam · one primary* — About 10 actions across the header (Add agent, Ask Atlas to draft one, Links) and the side panel (filled Open chat, Profile, Add agent under X, Move, Make lead, Communication links, Loan). Three of them are duplicates. — Header: Add agent (primary) + "Ask Atlas to draft". Panel: Open chat and Profile as secondary, edit actions in a "More" menu or accordion. Remove the duplicate Links and Add agent. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M9.** Dashboard — *Visual weight on "needs me" · one primary* — No primary. Items waiting for the client (S1-2 "In review", the Blocked QA-3 escalation) look like any other card. — Add a "Needs you on this project (2)" strip above the board with verb buttons (Review S1-2, Decide on QA-3). That strip is the screen's primary. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M10.** Global (every message, trace, usage) — *Framing; money and usage say what happens; no hidden costs* — "≈$0.007" appears on every message for a client on a subscription plan. It reads like a charge, and only the Usage table explains "≈ API price". — Pick one unit (decision D4). If $ stays, label it once per screen ("API-equivalent, not billed") and add "% of week" in the tooltip. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M11.** Top bar (all screens) — *Money and usage: "72 % used, resets Mon 09:00"* — The meter shows "Week 41 % used" with no reset time or headroom meaning. — "Week 41 % · resets Mon 09:00" (or in its tooltip and aria-label), plus "Headroom OK" or "Guard on" as text. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M12.** Trace, Usage, Memory — *Every empty-state type has headline, explanation, one action* — No first-use states ("No runs yet. Runs appear as soon as an agent works. [Talk to Atlas]"; "No usage this week yet"; "No notes yet. Agents write here as they work. [New note]"), no Trace no-results or error state, and Memory's no-results has no action. — Add them, each with one action ("Clear search", "Show all scopes"). · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M13.** Agent profile — *Miller's law · peak-load · one primary* — 8 tabs. Edits on several tabs share one Save, with no dirty indicator and no "unsaved changes" guard when switching screens. Draft state shows two filled buttons. — Group into ≤ 7 tabs (e.g. merge Model into Card, or Folders into Connectors). Show "Unsaved changes (2)" next to Save and a leave guard. In Draft, the banner button replaces Save changes rather than duplicating it. · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M14.** Dashboard card detail, Org loan, Add agent — *Modals only for decisions that must block* — The work-item detail opens as a modal (F8 says a drawer). The agent loan, a multi-day process waiting on another lead, lives in a modal stepper. — Card detail as a side drawer. Loan status inline in the Org side panel, with a "needs me" item when the client must act. Add agent can stay a modal or become a panel (low priority). · **Medium** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**M15.** Global — *Bench adaptation 2: click targets ≥ 32px, primary ≥ 40px · Fitts* — Estimated from the CSS: `.btn.sm` ≈ 25px (top verbs, Accept in review, Save note, Run now), chips ≈ 24px, `.link.xs` "Trace" links are small text, table checkboxes ≈ 13px with no label hit area, and `.btn.pri` ≈ 34px is below 40px for Allow once, Send, Add agent and Save changes. — UI sets min-heights by token (32 / 40), adds label hit areas to table checkboxes and gives "Trace" links padding. UX should mark in the annotation which actions are "frequent", so they get the 40px size. · **Medium** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**M16.** Global — *WCAG 2.2 AA, 3:1 for UI parts* — Input and card borders `#c4c4c4` on white are about 1.7:1. · **Medium** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

### Low

**L1.** Team chat, Home — *Agents speak plainly; no jargon outside the trace* — System lines read "Router → Karim (rule: task owner's lead)" and "Curator updated the group digest". — "Bench asked Karim to reply (he leads the task owner)" · "Digest updated". Keep "Router" and "Curator" in the trace and Settings. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L2.** Home vs Approvals — *Plain, consistent state names; verbs say what happens* — The same request is tagged "Approval" on Home and "Work request" in the inbox. The payment item's verb is "Open". — Use one label ("Work request"); verb "Review payment". · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L3.** Home — *Empty states: one primary action; cleared ≠ first use* — The empty list has no action, and the cleared case reuses first-use copy instead of F4's "Nothing needs you. Team is working on 6 items". — Cleared: "All clear. The team is working on 6 items [Open Bench dashboard]". First use: point at the suggested messages. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L4.** Live chat — *Microcopy* — "Tell her what to change", "what should she do instead?" are hard-coded for every agent. — Use the agent's name ("Tell Noor what to change"). · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L5.** Home — *Accessibility basics* — No `<h1>` on Home. The whole CEO chat is `aria-live` and is re-rendered on every update, so a screen reader re-announces the conversation. — Add a (visually hidden) h1 "Home". Make the live region announce only the newest message (spec note for the build). · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L6.** Memory graph — *Never colour (or style) alone* — Stale is a dashed stroke and selected is a fill, with no text. — Add "(stale)" and "(open)" to each node's label and aria-label, plus a legend entry for selected. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L7.** Dashboard, Usage, Memory, Trace, Settings — *Occam: every element has a job* — Dead affordances ("More views: Epics · Kanban · Flow" as plain text, "Documents (14)", "Change order…", "Open folder in another editor", "Files only / Commands only") and an annotation printed in the UI ("Editable? Open question for the client (Q7)"). The client may take these for broken features during validation. — Make each one work, mark it "(stub)" in the annotation bar, or remove it. Move Q7 to the annotation. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L8.** Settings — *One clear primary · consistency* — Only the Checkpoint section has Save. The system-service checkboxes and "Check again" have no save model. — One Save for the page with a dirty indicator, or say "saved automatically" beside the toggles. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L9.** First run, step 4 — *Progressive disclosure · Hick's law* — The preview table has 7 columns (Keep, Name, Role, Team, Model, Connectors, Autonomy) on a "2-minute" setup. — Show Keep / Name / Role / Team, with a "Details" expander per row for model, connectors and autonomy. Keep the Figma "not in your inventory" hint visible. · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L10.** Memory — *Chunk long lists* — The notes list is flat (9 here, about 2,000 at scale per UC-44). — Group by type or recency, show the top 10, then "Show all (n)". · **Low** · **Must-fix-before-G4** · Status: **Fixed (v0.2)**

**L11.** Global — *Type scale; 40–60 ch* — About 10 ad-hoc font sizes. Proposal `.doc` and chat bubbles exceed 60 ch per line. · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**L12.** First run and dialogs — *Navigation: actions on the right; Z pattern ends on the primary* — Back and Continue are left-aligned together, so the eye path doesn't end on the primary. · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**L13.** Global — *Avatars* — Initials only, 26px in lists and 44px on profiles; status beside rather than on the avatar. Apply the size rules and the status ring + label once H1's vocabulary is fixed. · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**L14.** Global — *Distinct states* — No active state; disabled is opacity only (`.45`). · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**L15.** Global — *Keyboard* — Modals don't trap focus or return it to the trigger. Tabs lack arrow-key navigation and `aria-controls`. · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**L16.** Global — *Microinteractions* — Toasts last 4.2s (too short for the longer messages) and carry no action. Set the duration by length, allow pausing on hover and focus, and respect reduced motion. · **Low** · **Phase-5** · Status: **Phase 5** (open, handed to UI)

**Counts:** High 8 · Medium 16 · Low 16 = **40 findings**. Must-fix-before-G4: **32** · Phase-5: **8**.
**Status (v0.2):** Fixed (v0.2): **32** (H1–H8, M1–M14, L1–L10) · Phase 5: **8** (M15, M16, L11–L16).

---

## 4. Decisions needed from the client

These trade one rule against another, so they are left for the client to decide.

**Decided 2026-10-22:** the client accepted the recommended option for all six (`docs/requirements/interviews/2026-10-22-ux-audit-decisions.md`), as worded there: D1 nothing pre-selected, Gmail unticked · D2 blocked → outward/reserved approvals → meeting requests → proposals → FYI · D3 a command pattern in one repo, with its scope and where to revoke it · D4 tokens and % of the weekly limit, no dollar figure in the client's views · D5 no API-key nudge at the limit, show the resume time, API mode only in Settings · D6 the review closes; unreviewed items stay In review and are listed in the memo. All six are applied in v0.2.

| # | Decision | Conflict | Recommendation |
|---|---|---|---|
| D1 | First run: Gmail pre-ticked and the template pre-selected? | Grok-Bot-level low friction (≤ 6 clicks) vs no dark patterns, explicit outward actions and BR-04 | Gmail **unticked**. Team step starts unselected (one extra click) |
| D2 | What ranks first in "What needs me"? | List order currently decides the primary action | Blocked > outward/reserved approvals > meeting requests > proposals > FYI; ties by age |
| D3 | Scope of an "Always allow" grant (exact command / command pattern / tool in a repo) | Glass box vs approval fatigue. Also a **tech constraint** for the permission gate | Exact command + repo by default; a pattern only via Agent › Autonomy |
| D4 | Cost unit on messages: ≈$ API-equivalent, tokens, or % of the weekly limit? | Glass box vs framing (a $ figure on a flat plan reads as a bill) | Tokens + "% of week" on messages; ≈$ only in Usage and Trace, labelled "API-equivalent" |
| D5 | At "Usage limit reached", offer the API-key fallback as a next step? | Peak-load wants a next step; money must never be nudged (adaptations 4 and 6) | Show a plain link "Use your API key for urgent work (billed by Anthropic)" only if it's already on in Settings |
| D6 | Closing a review with unreviewed items: block, or close with the items left In review? | Control vs speed | Allow it with a confirm that lists the items and says they stay In review |

The open questions Q1–Q10 and constraints C-A to C-D in the UX package still stand. C-A directly affects M6's copy.

---

## 5. What's already strong

- **Status is never colour alone.** Every risk or state has a text tag (OUTWARD, RESERVED, LEAD, ON LOAN, BLOCKED, LIVE, Awaiting you), which already meets Bench adaptation 1 before any colour exists.
- **The usage-limit worst moment is framed well.** "All agents stopped at a safe point and their work is saved. Resumes automatically at 14:00 (in 2 h 10 min). 'What needs me' still works." The Usage screen lists the paused work in resume order, and the debate timer pauses with the exact time.
- **Rules are explained where they apply.** The disabled "Always allow" carries its reason inline ("No standing rule can send email for you"), and Autonomy shows the fixed rows as "(can't be changed)".
- **First run detects instead of asking.** Separate not-installed and not-signed-in states, each with a copyable command and Check again, plus "Bench never shows its own Claude login".
- **Nothing vanishes silently.** The debate's "What happens on close" panel, the memo review and the team-chat line "memo saved · chat archived in the Trace [Open memo]" form the clearest peak-end in the app.
- **The proposal is two steps with an explicit safety line.** "Nothing is created until you press Create project" leads to "InterviewKit is set up … [Open dashboard]", a model ending.
- **Stop is designed as a moment, not a button:** a large labelled Stop, then "Stopping at next safe point…", then "Noor has stopped. No further tool call will start." Then redirect, and the redirect is logged.
- **Glass box and provenance throughout:** cost + Trace on every message, connector token cost per turn, source on every memory note, the "Decided by Atlas" Deputy log, system services shown with their cost.
- **Progressive disclosure where it matters most:** the dashboard's top 5 + Full backlog, collapsed trace steps, a fixed dashboard layout per sprint.
- **Error copy that reassures:** the Org write failure ("Nothing was changed; everything … was rolled back"), team chat ("It's kept below. Retry"), stale dashboard ("Nothing is lost").
- **A screen-card discipline already exists:** every screen's annotation bar states purpose, primary action, use cases and switchable states, which made this audit straightforward.
- **Keyboard basics:** every control is a real button, `:focus-visible` is global, graph nodes work from the keyboard, and form errors set `aria-invalid`, announce themselves and move focus.
