# Worst moments: break it on purpose

Part of the [premium experience spec](README.md). Premium-craft gate 8: render each failure and design the recovery as carefully as the success screen. The bar is the **service-recovery paradox**: a failure handled very well can leave you *happier* than if nothing had gone wrong. Each recovery uses a shared pattern from [state-matrix.md §1](state-matrix.md) (P01–P10), so the same situation always looks and reads the same.

## 0. The recovery recipe (every moment below follows it)

1. **Who tells you.** Bench (sentence case, second person) states the facts. The affected agent, when it can talk, adds a line in its own lowercase voice. A colleague tells you, not an error dialog.
2. **The cause in plain words**, with specifics (names, counts, exact times). Codes go behind *Details*.
3. **What's safe**: saved, kept, not sent, rolled back. Always said, even when it's "everything".
4. **One next step** (the primary), at most one secondary.
5. **The "they caught me" detail**: the one thing that shows someone thought about this moment before it happened.
6. **The ending**: when it's over, P10 "While you were away" says what happened while you weren't looking, then gets out of the way.
7. **The look**: no red walls, no shaking. Red is reserved for the Error badge and destructive buttons. The avatar shows *concern* (eyes soften, look down) and never alarm. The banner is neutral; a Carbon-emphasis banner means "this needs you".

**Format for each moment:** the trigger · what you see (screen and exact copy) · the cause · what's safe · the one next step · **they caught me** · the ending · the hi-fi `[route]` · constraints.

---

## 1. Offline mid-run

- **Trigger:** the Wi-Fi drops at 10:24 while Noor runs `pnpm test` and Karim drafts a PR description. You type a message to Noor at 10:30.
- **What you see:**
  - P01 banner on every screen: **You're offline.** "Agents finish the step they're on, then wait. Nothing is lost. Everything on this PC still works: What needs you, memory, the trace and settings." · *Try now*
  - Noor's status line: **Paused · offline** (the badge shows Paused; her eyes go sleepy, not worried: this isn't a failure).
  - Your message to Noor shows the receipt `Queued · sends when you're back online`.
  - The top-bar ring greys out with `as of 10:24`.
- **Cause:** no internet, so Claude can't be reached. Bench runs on your PC, but the agents think through Claude.
- **What's safe:** the step in progress (local tool calls like `pnpm test` keep running to the end and their results are kept), every message you type (queued in order), all files.
- **One next step:** none needed. *Try now* only if you've fixed the connection yourself.
- **They caught me:** when the connection comes back at 10:42, Bench **sends your queued messages in order, before the agents resume**, so Noor reads your instruction *before* she takes her next step, not after. Then the digest:
  > **While you were away (18 min):** Noor's tests finished (12 of 12 passed) and she waited. Karim's draft was saved. Your message to Noor was delivered first, so she picks up with it. Nothing was lost.
- **The ending:** the avatars "wake up" in turn (eyes open, a small settle), the ring fills back in, and the banner folds into the digest card.
- **Routes:** `#offline` · `#offline-back`
- **Constraints:** a local send queue; tool calls already running keep going (they're local); the next model turn waits.

## 2. Your Claude login expired

- **Trigger:** at 08:10 a run fails with an authentication error (the token expired, or you signed out in another terminal).
- **What you see:**
  - P03 banner (Carbon emphasis): **Your Claude login has expired.** "Your agents paused at a safe point; nothing is lost. Run this in a terminal, then come back:" `claude login` · *Copy command* · *Check again*
  - The top ticket in What needs you: **Sign in to Claude again** (State tag **Blocked**) · "3 agents and 1 routine are waiting for it." · *Copy command*.
  - Agents read **Paused · waiting for your Claude login**.
- **Cause:** Bench uses your own Claude Code login (ADR-0002), and that login needs renewing.
- **What's safe:** every session, task state, queue and pending approval (UC-42 postconditions apply).
- **One next step:** *Copy command*, run it, come back.
- **They caught me:**
  - Bench **never asks for your password** and never shows a login form. It says so on the banner's *Details*: "Bench never sees or stores your Claude credentials. Signing in happens in Claude Code."
  - You don't need to press *Check again*. Bench notices you've signed in (it re-checks every 30 s while the banner is up) and **resumes everything by itself, in the order it paused**.
  - > **You're signed in again.** Noor, Karim and Maya picked up where they paused. The 08:30 standup digest ran 12 min late.
- **Routes:** `#login-expired` · `#login-back`
- **Constraints (TC-1, tech lead):** detect the auth failure from Claude Code's own error and exit codes, and re-check by running Claude Code's status (`claude` CLI), **never by reading `~/.claude/.credentials.json`** (CLAUDE.md). Bench can't predict an expiry, so there's no "expires in 2 days" warning. If the CLI offers no reliable status check, *Check again* becomes the only path (a decision for the client).

## 3. The weekly usage limit is hit

- **Trigger:** Saturday 14:05, during a multi-agent task: Noor, Karim and Maya's standup routine are mid-flight.
- **What you see:**
  - **Before it happens (the catch):** from Saturday 09:00, once the forecast says the week will run out, the P05 guard has already been deferring routines (moment 4), and a For your info ticket said: **At this pace your week runs out around Sat 14:00.** "Routines are waiting; your own requests still run."
  - At 14:05, the P04 banner: **Your week is used up.** "3 runs paused at a safe point and resume **Mon 26 Oct at 09:00**, in the order they paused. What needs you, memory and the trace still work." Count badge `3 of 3 runs paused` · **See paused work**
  - In Noor's chat, the RunCard: **Paused at a safe point: your week is used up.** "Noor resumes S1-4 on Mon 26 Oct at 09:00, first in line. Kept: her session, the diff and your pending approval."
  - Usage shows the resume order: **1 Noor · S1-4 · 2 Karim · S1-6 · 3 Morning standup digest (Maya)**.
- **Cause:** the Claude subscription's weekly limit (plan usage includes your own Claude use outside Bench).
- **What's safe:** everything (sessions, task states, queues, pending approvals). You can still **decide** tickets; allowed work queues for Monday.
- **One next step:** *See paused work* (for reorder or cancel). If only the Deep (Opus) limit ran out: **Continue on Balanced** ("Noor switches to Sonnet for this task and goes back to Deep after the reset"). **Never** an API-key nudge (D5).
- **They caught me:**
  - The warning came hours earlier, with a specific time, not a surprise wall.
  - On Monday at 09:00, before you've opened Bench:
    > **Good morning. Your week reset at 09:00.** Noor and Karim picked up where they paused; the standup digest ran at 09:02. Nothing was lost.
  - Debates paused their timer (UX Q10), so no one "lost" the argument to the clock.
- **Routes:** `#limit-forecast` · `#limit` · `#limit-reset`
- **Constraints:** depends on reading plan usage (spike S0-1, C-B). In "ledger only" mode the forecast line says "Based on Bench's own count" (state-matrix 3.11 Partial).

## 4. The 30 % headroom guard defers work

- **Trigger:** Thursday 16:00. The forecast says 24 % would be left at the reset, under your 30 % target (UC-41).
- **What you see:**
  - P05 thin banner: **Keeping 30 % of your week free.** "At this pace you'd have 24 % left by Monday, so 2 routines wait until there's room or until Mon 26 Oct at 09:00. Your own requests still run." · *See what's waiting*
  - Routine rows: **Waiting for room in your week** "(guard on: keeping 30 % free)" · *Run now · ≈ 0.30 % of your week*.
  - The top-bar ring's tooltip and label: **41 % of your week · guard on**.
- **Cause:** your own rule (keep ≥ 30 % free), applied by Bench. Not an error and not a limit, so it's styled as information: no emphasis, no amber.
- **What's safe:** the deferred routines run later, in the order they were deferred. Your requests are never deferred.
- **One next step:** none required. *Run now* per item, with its cost shown on the button.
- **They caught me:**
  - The guard explains its own maths in one line ("you'd have 24 % left by Monday"), so it never feels arbitrary.
  - **It learns your exceptions** (intelligence-layer.md): after you've pressed *Run now* on Dependency check 3 times while the guard was on:
    > "You've run Dependency check yourself the last 3 times it waited. Let it run even when the guard is on? ≈ 0.30 % a week."
    > *Let it run* · *Keep waiting*
  - When the forecast recovers: **Headroom OK again.** "2 routines that waited have run (0.4 % of your week)."
- **Routes:** `#guard` · `#guard-exempt`
- **Constraints:** BRD UC-41 doesn't define exemptions; the suggestion is an `[ASSUMPTION]` that needs the client's yes (it's recommendation R7's sibling: a suggestion, never automatic).

## 5. A run crashes

- **Trigger:** 09:18. Noor's full test suite runs out of memory (the test runner is killed).
- **What you see:**
  - Noor's header status: **Error**. The avatar: eyes widen briefly and settle into concern (no shake, nothing red except the badge).
  - The RunCard (P06): **Noor's run stopped: the test runner ran out of memory.** "Kept: her changes to 3 files (checkpoint 09:18) and the test log. Bench retries once at 09:20 with the suite split in two." · **Retry now** · *Ask Karim* · *Open trace*
  - A For your info ticket only if the retry also fails.
- **Cause:** the PC ran out of memory during `pnpm test` (214 tests in one process). *Details:* the exit code and the last 20 log lines.
- **What's safe:** the 3 changed files (a per-turn snapshot, CR-003 M10), the test log, the session.
- **One next step:** nothing; the retry is automatic. *Retry now* if you don't want to wait 2 minutes.
- **They caught me:**
  - Bench doesn't retry the same thing blindly. It **changes the approach** (splitting the suite in two) and says so before it does it.
  - When it works, the lesson is saved and **visibly reused next time**:
    > System line: **Retried with the suite in two halves · 12 of 12 passed · Lesson saved: run the full suite in two halves on this PC.**
    > Next week, in Noor's reply: chip **Applied: run the suite in two halves (lesson from 22 Oct)**.
  - If the retry fails too, it stops and escalates: "Noor tried twice. Karim, the tech lead, has the details and will suggest a fix." (UC-17). It never loops.
- **Routes:** `#agent-error` · `#agent-error-retried`
- **Constraints:** one retry/backoff helper (CLAUDE.md conventions); per-turn snapshots (CR-003 M10).

## 6. An approval is denied

- **Trigger:** you press *Deny* on "Noor asks to run `pnpm test`".
- **What you see:**
  - The ticket folds (M-H2 runs in reverse: it slides out, no check). The field "Tell Noor why (optional)" was offered first, inline, not as a dialog.
  - System line (P07): **You denied `pnpm test` · Noor continues without it.**
  - Noor's reply: *"ok. no full suite. i'll open the pr with the chat tests only and say so in the description."*
  - Toast: **Denied.** `Undo` (10 s).
- **Cause:** your decision; nothing failed.
- **What's safe:** her work; the PR opens with a clear note ("Full suite not run: the client declined it on 22 Oct").
- **One next step:** none; *Undo* if you misclicked.
- **They caught me:**
  - The agent **shows plan B in the same breath**, so a "no" never stops work or creates a new ticket.
  - **No nagging:** the same request isn't asked again in the same task.
  - If you gave a reason ("not before CI is fixed"), it becomes a lesson with its scope shown: "Saved for Noor: don't run the full suite until QA-3 is fixed." The next time the condition is met, Noor says: *"QA-3 is fixed, so the full suite is back on, as you said."*
- **Routes:** `#needs-denied`
- **Constraints:** denial reasons are stored in the agent's private memory (UC-23 alt flow).

## 7. A context checkpoint at the 90 % ceiling

- **Trigger:** Noor's session hits the 90 % hard ceiling in the middle of a step (BR-66, B6-CTX3); her own threshold (70 %) was skipped because the step was long.
- **What you see:**
  - Header context meter fills to the ceiling mark; the status line: **Saving her place…** (eyes close for a beat, like taking a breath).
  - A Checkpoint card in the chat (not an error: neutral, with the memory glyph): **Noor's memory was nearly full, so she saved her place mid-step and started fresh.** "Checkpoint: 8 of 8 sections · goal, decisions, files, current step, next steps, open questions, what failed, fixes." · *Read the checkpoint*
  - Noor's first line from the fresh session: *"picking up: rerun the e2e on Windows with the new runner flag. i've got the 3 decisions from this morning."*
  - The context meter drops to `8 %`.
- **Cause:** a long session filled Claude's working memory (the context window). Restarting fresh keeps her sharp and makes each turn cheaper (UC-42 A3).
- **What's safe:** everything she knew that matters: the checkpoint, her memory notes and lessons. The old session is archived in the trace.
- **One next step:** none. *Read the checkpoint* if you're curious.
- **They caught me:**
  - The fresh session's first message **restates the next step in her own voice**, which proves continuity instead of asking you to trust it (BRD UC-21 acceptance criterion).
  - **If the checkpoint is incomplete**, Bench asks Noor to fill the gap *before* closing the old session (B7-#35); you only hear about it if that fails: "Noor's checkpoint is missing its next steps after two tries. Karim has been asked to check it before she continues."
- **Routes:** `#agent-checkpoint` · `#agent-checkpoint-incomplete`
- **Constraints:** none beyond the BRD (BR-66 (2), (8)).

## 8. A merge conflict

- **Trigger:** 09:40. Karim's PR #41 (waiting for your Reserved merge) now conflicts with `main` in 2 files, because Noor's PR #44 merged at 09:30.
- **What you see:**
  - The **existing** ticket "Merge PR #41 to main" updates **in place** (no new ticket, the count doesn't jump): its State tag becomes **Blocked**; the line: **PR #41 now conflicts with main in 2 files** (`Composer.tsx`, `run.ts`) "since Noor's PR #44 merged at 09:30. Nothing has been merged. Karim is resolving it and will bring it back for your OK."
  - The merge button is disabled with its reason: "Merge waits until the conflict is resolved."
  - In the workspace (if you open it): a side-by-side conflict view where **each side shows its author's avatar** (Karim's square, Noor's pill), so you can see *whose* change is whose.
- **Cause:** two agents changed the same lines on different branches (UC-34 coordinates writers within a folder; branches can still collide on merge).
- **What's safe:** both branches, untouched; `main` is unchanged.
- **One next step:** none; Karim owns it. *Open the conflict* if you want to see it.
- **They caught me:**
  - Karim **asks Noor**, not you, because the conflict is between their changes (a handoff chip appears in the team chat: "Karim asked Noor about the Composer.tsx conflict").
  - When it's resolved, the ticket comes back **already re-checked**: **Merge PR #41 to main** "Conflict resolved by Karim with Noor · CI green again (Windows, Ubuntu, secret scan)." The consequence on the button: **Merge PR #41 · 7 files · notifies Karim and Noor**.
- **Routes:** `#needs-conflict` · `#needs-conflict-resolved`
- **Constraints:** conflict detection through the GitHub connector or local git; merge to main stays Reserved (BR-58).

## 9. A connector is revoked mid-task

- **Trigger:** 11:02. GitHub access is revoked (you rotated the token in GitHub) while Noor is about to push.
- **What you see:**
  - Noor's RunCard (P06 shape, no Error colour since it isn't her fault): **GitHub stopped answering Noor: access was revoked or expired.** "Noor stopped before pushing. Her commits are safe on `feat/s1-4` on this PC."
  - **The blast radius, in one line:** "This affects Noor, Karim and 2 routines (Merged PR digest, Dependency check)."
  - A Decide ticket: **Reconnect GitHub** · "In Claude Code, reconnect the GitHub connector, then come back." · *How to reconnect* · *Check again*.
  - Agent Settings › Connectors shows GitHub with the State tag **Error** and the same sentence.
- **Cause:** the connector's credentials live in Claude Code (PRODUCT-MODEL §3: Bench never copies them), and they no longer work.
- **What's safe:** every commit (local); every draft; the routines' schedules. Nothing was half-pushed.
- **One next step:** reconnect in Claude Code (*How to reconnect* shows the exact steps for your setup).
- **They caught me:**
  - Bench tells you **everything** the revoke touches before you discover it piece by piece (two routines would otherwise have failed silently on Monday).
  - Once it's reconnected, **every affected agent and routine resumes together**, and Noor pushes: **GitHub is back.** "Noor pushed `feat/s1-4`. Karim and both routines carry on."
- **Routes:** `#connector-revoked` · `#connector-back`
- **Constraints (TC-2):** detecting "revoked" relies on the connector's error; Bench can't inspect the credentials.

## 10. An empty first run

- **Trigger:** first launch, Claude Code signed in, "CEO only" chosen (no template): every list is empty.
- **What you see:** never a blank screen. Home first use (state-matrix 3.1):
  - Atlas's hero forms and **blinks once** (M-F1). Atlas: *"hi. i'm Atlas. i'll run your team and bring you only what needs you. what are you working on?"*
  - **Nothing needs you yet.** "When an agent needs a decision, a meeting or your OK, it lands here, ranked: blocked work first."
  - Projects: one New project card: **Start a project** "Name it and pick a team, or describe it and the fields fill themselves."
  - The Ledger at zero, honestly: **Your team knows nothing about you yet.** "It learns from what you approve, deny and edit. You can read and delete all of it in Memory."
- **Cause:** nothing has happened yet.
- **What's safe:** N/A.
- **One next step:** send Atlas a message (or tap a chip).
- **They caught me:** the suggestion chips are **built from what Bench found on your machine**, so the first task is real, not a demo. Example, with GitHub in your Claude Code inventory: *"Look at my open issues in bench"*. Atlas replies within the first 3 minutes (R10) with a useful checklist (**✓ 7 open issues → 2 look like bugs, 1 needs a decision from you**), and **that** becomes the first ticket in What needs you. The first useful result lands in under 5 minutes.
- **Routes:** `#home-first`
- **Constraints:** reading the inventory is already in scope (PRODUCT-MODEL §3).

---

## 11. Edge cases from the skill's list

| Case | Design | Copy |
|---|---|---|
| **Slow response (10 s+)** | P08: the thinking dots continue; the status line changes at 10 s and again at 60 s. Stop never moves | **Claude is taking longer than usual (14 s).** Noor is still on it. · at 60 s: **Still waiting on Claude (1 min).** "This sometimes happens at busy times." |
| **A 500-line message** (an agent pastes a log, or you paste one) | Long content collapses to its first 12 lines with a fade and a count; code blocks scroll inside a max height; a log gets "Open in workspace" | `Show all 500 lines` · `Open in Noor's workspace` |
| **A very long name** ("InterviewKit for the Spring Hiring Round 2027"; an agent called "Release-notes-and-changelog-bot") | Truncate with an ellipsis in the sidebar and in tickets, with the full name in the tooltip and accessible name; never wrap a name onto 3 lines; the header gets 2 lines max | Tooltip: the full name |
| **50 agents, or a 1024 px window** | The sidebar groups collapse to the avatar rail below 1180 px; project groups show 4 agents + "N more"; the workspace pane becomes an overlay sheet below 1100 px with the same toggle; split view needs ≥ 1280 px and otherwise offers "Open here" only | `46 more` · split menu item disabled with reason: **Split view needs a wider window.** |

## 12. Summary for the UI designer

| # | Moment | Pattern | Avatar state | New route(s) |
|---|---|---|---|---|
| 1 | Offline mid-run | P01 → P10 | Paused, sleepy → wakes | `#offline`, `#offline-back` |
| 2 | Login expired | P03 → P10 | Paused | `#login-expired`, `#login-back` |
| 3 | Weekly limit | P05 forecast → P04 → P10 | Paused | `#limit-forecast`, `#limit`, `#limit-reset` |
| 4 | Guard defers | P05 | (unchanged) | `#guard`, `#guard-exempt` |
| 5 | Run crash | P06 | Error: concern → relief | `#agent-error`, `#agent-error-retried` |
| 6 | Approval denied | P07 | Calm (a nod) | `#needs-denied` |
| 7 | Checkpoint at 90 % | Checkpoint card | Eyes close a beat, reopen | `#agent-checkpoint`, `#agent-checkpoint-incomplete` |
| 8 | Merge conflict | Ticket updates in place | Karim focused | `#needs-conflict`, `#needs-conflict-resolved` |
| 9 | Connector revoked | P06 + Decide ticket | Concern | `#connector-revoked`, `#connector-back` |
| 10 | Empty first run | Home first use | Birth blink | `#home-first` |
