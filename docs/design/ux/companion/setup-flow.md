# Setup: make your Euca in about 5 minutes

| Date | Author | Status | Read with |
|---|---|---|---|
| 2026-10-26 | PM + UX (Claude), `ux-designer` role standards | **Approved by the founder 26 Oct**; the honest zero in step 9 is new since approval · **CR-012 / always-on (26 Oct): step 4 "Sign in" and step 8 "What is sent" approved by the founder 26 Oct** with decisions U-1 – U-8 (§7, [SELF-REVIEW §5b](../../ui/companion/SELF-REVIEW.md)) · **Reordered 2026-10-26 (founder, *"okay do that"*): the lock of the four limits and the test come before sign-in** (now steps 4 and 5; sign in is step 6, rules step 7) | [CR-012](../../../requirements/change-requests/CR-012.md) · [CR-011](../../../requirements/change-requests/CR-011.md) · [CR-010](../../../requirements/change-requests/CR-010.md) (D-4, D-5, copy) · [notch-and-panel.md](notch-and-panel.md) · [onboarding-flow.md](onboarding-flow.md) (edge paths A–Q, still valid) |

**Replaces** the screen sequence of [onboarding-flow.md](onboarding-flow.md). **Keeps** its evidence, its timing method, its validation tasks and its edge paths **A–Q** (referenced by letter below; their copy changes only where noted).

**Goal.** In about five minutes you **make your Euca**, see your own week, **lock the four limits**, watch your Euca block a test with your own eyes, **sign in with your email**, choose your rules, see exactly what is sent, and send it to its place at the top of your screen.

> **Founder decision, 2026-10-26 (*"okay do that"*): protect the PC before sign-in.** The admin lock (one Windows prompt) and the four limits (delete, a push to your default branch, a send, a payment; all four ticked by default) move **before** sign-in, so the PC is protected even when setup waits at sign-in (offline, or the code email doesn't arrive). Only the four limits and their lock move. Everything else still needs sign-in, and there is still no "Sign in later". Setup has **exactly one admin prompt** (step 4, limits only). The rules you choose at step 7 run at user scope, shown **Not locked**; locking them later from Rules asks for admin once more.

> **Founder decisions applied (26 Oct, later the same day):** the four limits are **always on**, locked or not locked per limit; **guided merge** stays in Free as a needs-you item; **budgets** stop the agent before its next step; drafting a described rule **uses the supervisor and counts on the meter**; the app says **"your default branch"**, never "main"; v0.1 is **unsigned** and shows no "signed" badge.

> **CR-012 / always-on, 2026-10-26 (founder):** **accounts for everyone**: email plus a 6-digit code, no password, asked **after "Your week" and before "Choose your rules"**. **The supervisor is always on** with no off switch; **Level 1/2 is retired** and the privacy step becomes **"What is sent"**, a real redacted example from your own last session. **The trial starts when setup finishes.** The approved privacy line is used verbatim.

> **Founder decisions on this design, 2026-10-26:** **sign-in is mandatory:** *"don't allow to access without sign in"*. There is **no "Sign in later"** anywhere; offline at sign-in (step 6 since the reorder above), setup waits there ("You need to be online to sign in. Setup carries on once you're connected. Pip is already guarding: the four limits are locked.", **Retry**, **Back**; copy revised with the reorder). Once signed in, the guard, limits, tripwire and rules work offline (they never read the account). Signed out later, the panel shows **only sign-in**; the guard, the four limits and your locked rules keep protecting the PC, because the locks live in the PC's managed settings and turning safety off on sign-out would be unsafe (founder, 2026-10-26, *"yes"*); the supervisor, drafting, Usage and Rules editing need sign-in. The email step has an **unticked "Send me product news"** box (U-7). Setup **never shows the unredacted original** (U-8). Step 8 says the supervisor **can't be switched off**. A **Smart App Control** screen joins step 1 (edge U). The privacy line gains *"and how much supervisor help you've used"* (*"accept all the tech lead recommendations"*).

**What changed from the old first run, and why.**
- **"Create your Euca" is step 2** (CR-011 §1). The character is made before it does anything, so every later step can speak as it ("Pip turns them into exact rules", "Watch Pip block a test").
- **The four limits are locked at step 4, and tested at step 5, before sign-in** (founder, 2026-10-26): the PC is protected first, so a setup that waits at sign-in still leaves it guarded. The lock covers **only the four limits**; it's the one admin prompt in setup.
- **Sign in is step 6** (CR-012 / always-on; was step 4 until the reorder): after you've seen your week (value first) and watched the guard work, before choosing rules, because drafting a described rule is the first thing that needs the server.
- **"Choose your rules" is step 7, at user scope** (CR-010 D-4, reordered 2026-10-26): tested library on/off, suggestions from your week, and your own described rules. They run **Not locked**; you can lock them from Rules any time (Windows asks once more).
- **"What is sent" replaces the Level 1/2 privacy step** (CR-012 / always-on): no choice to make, only proof. The optional trial email is gone; the email is now asked once, at step 6.
- **The end is a place, not a window:** the Euca flies up into the notch, and a one-time coach mark says how it works.
- The tray pin step is gone: the notch is the surface; the tray is a fallback.

---

## 1. The path at a glance

One window, **760 × 600**, centred, dark by default, a slim progress line ("Step 4 of 9"). Back is shown on steps 2–4, 6 and 7; it's hidden on the test (5) and from step 8. Going back never undoes the lock: only Rules can change it, with admin.

| # | Step | Clock | You | Eucas |
|---|---|---|---|---|
| 0 | Install | 0:00 → 0:50 | Run the installer (unsigned in v0.1: SmartScreen "More info → Run anyway", explained on the site; whether to sign before launch is decided on waitlist size, see edge U) | Per-user install, no admin |
| 1 | **Find your sessions** | 0:50 → 1:05 | Read, press **Make your Euca** | Detects Claude Code, version, 7-day history, your status line and hooks (already running) |
| 2 | **Make your Euca** | 1:05 → 1:50 | Name it, pick a shape and a colour | Live preview: eyes follow you; it blinks when you choose (birth) |
| 3 | **Your week** | 1:50 → 2:30 | Skim 4 cards | Built from local history while you were on step 2 |
| 4 | **Lock the four limits** *(reordered 2026-10-26)* | 2:30 → 2:50 | Approve **one** Windows prompt | Writes the four limits to managed settings; the first change on this PC |
| 5 | **Watch it block a test** | 2:50 → 3:05 | Watch | Throwaway session tries to push to its default branch (`git push origin main`); blocked, logged |
| 6 | **Sign in** *(CR-012)* | 3:05 → 3:45 | Type your email, then the 6-digit code from your inbox | Sends the code; creates or finds your account |
| 7 | **Choose your rules** | 3:45 → 4:30 | Keep the tested rules, tick suggestions, maybe describe one | Drafts described rules as exact rules; writes them at user scope (Not locked) |
| 8 | **What is sent** *(CR-012)* | 4:30 → 4:50 | Read one redacted example | Built from your own last session, redacted on this PC |
| 9 | **Pip is watching** | 4:50 → 5:05 | Press **Send Pip to the top** | The trial starts; the window fades; the Euca flies into the notch; coach mark once |

```mermaid
flowchart LR
  I[0 Install] --> F[1 Find sessions]
  F --> C[2 Make your Euca]
  C --> W[3 Your week]
  W --> L[4 Lock the four limits: one UAC]
  L -->|Yes| T[5 Safety test]
  L -->|No / Skip| NL[4b Not locked] --> T
  T -->|blocked| A[6 Sign in]
  T -.->|not blocked| J[Edge J: stop, diagnostic]
  A -.->|offline: waits, Retry; already guarded| A
  A -->|code ok| R[7 Choose rules: Not locked]
  R --> S[8 What is sent]
  S --> D[9 Pip is watching] --> N[The notch + coach mark]
  F -. missing / old / policy .-> E[Edges A–D]
  F -. Smart App Control on .-> U[Edge U: can't guard, close]
```

---

## 2. Steps

Each card: intent · one primary · evidence (what happened / how to take it back / what's next) · consequence preview · states.

### Step 1 · Find your sessions
- **Intent:** Go. **Primary:** **Make your Euca**.
- **Headline:** "First, let's find your sessions"
- **Lede:** "Eucas watches the Claude Code sessions you already run. It never writes code. It guards them, tells you what needs you, and shows where your usage goes."
- **Checklist** (ticks as each resolves, ≤ 3 s): "Claude Code 2.1.312 found · In the desktop app and in your terminal" · "41 sessions in the last 7 days · Eucas keeps counts, never the text of your prompts or files" · "Your status line stays as it is" · "2 hooks of your own keep working".
- **Footer hint:** "About 5 minutes. Nothing on this PC changes until step 4." (the consequence preview for the whole flow; step 4 is the lock, the first write; *CR-012 / always-on, 2026-10-26:* "on this PC" because step 6 creates your account on the server)
- **States:** detecting · found · edges A (not found), B (old), C (two installs), D (organisation policy: no lock or protection possible; Make your Euca still works and the Euca says so later).

### Step 2 · Make your Euca (the birth moment)
- **Intent:** Do. **Primary:** **Continue** (disabled until it has a name and a look; the hint says which is missing).
- **Headline:** "Make your Euca" · **Lede:** "It sits at the top of your screen and minds your sessions. Pick a name and a look. You can change both later."
- **Left: the stage.** A soft-dimensional avatar (BRAND §8) on a faint wash of its colour, its name under it, and a **mini notch** showing its eyes where it will live ("Where Pip will sit"). Before you choose: the grey Unassigned shape with closed eyes, "No name yet".
- **Right:** Name (16 characters, suggestions Pip · Moss · Juno · Kit), Shape (the 9 brand shapes), Colour (the 10 hues). Choosing a shape or colour gives birth: the eyes open, it squashes and settles (spring), one blink.
- **Copy note:** if you pick coral, honey or tangerine (close to red and amber), one quiet line: "Fine to keep: Pip's warnings always come with words, never colour alone."
- **Intelligence deposit:** the name is used in every later line; the colour becomes the working beam in the notch and the supervisor meter.
- **States:** before (grey) · born · name only (Continue disabled: "Pick a shape or a colour") · look only ("Give it a name").

### Step 3 · Your week
- **Intent:** Know. **Primary:** **Continue** *(reordered 2026-10-26: the next step is the lock; was "Sign in", and before that "Choose your rules")*.
- **Headline (one sentence, real numbers):** "Your week: 41 sessions in 6 projects, about 62% of your weekly limit."
- **Four cards** (same as before, shorter): tokens + the 7-day bars ("bench used 58% of it") · "3 commands would have been stopped" (mono lines with project and time) · "2 sessions edited one file 4 minutes apart" · "You approved `pnpm test` 212 times · It can become a rule when you choose your rules."
- **States:** building (cards stream in, first ≤ 5 s; it started on step 1) · thin history (edge F: "Not much to look back on yet" + 5 starter rules) · tokens only (edge G).

### Step 4 · Lock the four limits (the one admin prompt) *(reordered 2026-10-26: limits only, before sign-in)*
- **Intent:** Do. **Primary:** **Lock the 4 limits**. **Secondary:** Skip the lock.
- **Why here:** it's the first step that changes the PC, and it doesn't need an account. Doing it before sign-in means the PC is protected even if setup has to wait at step 6.
- **Headline:** "Lock the four limits" · **Lede:** "Locked, they live where no agent or repo can change them. Your own rules come after you sign in. Changing a lock later asks for admin again."
- **One list:** the four **Limits** (never auto-approve a delete, a push to your default branch, a send or a payment), **all four ticked to lock by default**, each with a lock glyph; you may untick one, and it stays on but Not locked. Your own rules aren't on this screen: they come at step 7.
- **Consequence preview:** "Windows asks for permission once. It will say **Unknown publisher**: this first version isn't signed yet." · "Without the lock, the four limits still run, labelled Not locked." (CR-010: v0.1 ships unsigned; the UAC dialog is yellow and says Unknown. Saying it first makes the dialog expected.)
- **Waiting:** the button reads "Waiting for Windows…" while the UAC dialog is up.
- **Declined or skipped (edge H, new copy):** headline "**The four limits are on, but not locked**" · "Windows didn't give permission, so they sit in your user settings and still block." · the Not locked box: "An agent or a repo could change them. Pip watches for that and tells you the moment it happens. You can lock them any time from Rules." → Continue · Try again. Everywhere after: the **Not locked** chip in the panel header and an amber row in Rules.
- **Write failed (edge I):** unchanged.
- **This is setup's only admin prompt.** Nothing later in setup asks Windows again.
- **Emotional moment: none on purpose.** Elevation is sober.

### Step 5 · Watch it block a test (D-5, the proof moment)
- **Intent:** Know. **Primary:** **Sign in** (appears when the test finishes; it names the next step).
- **Headline:** "Watch Pip block a test" · **Lede:** "A throwaway session in a temporary folder tries to push to your default branch. Nothing touches your projects or the network."
- **Live log** (mono): "› Starting a test session in a temporary folder" · "› It tried: git push origin main" · "✓ **Blocked by Pip · 0.3 s · logged**" + the **done** sound once. Then "That's what happens in your real sessions. Every block shows up in the panel with why." (Uses the mock-API path from S-1: zero tokens, no network, no account.)
- **What it proves:** the four limits from step 4 are working, before you've signed in. Pushing to your default branch is one of them, so the test needs nothing from step 7.
- **Not blocked (edge J, worst moment of setup):** "✕ Not blocked" + "**The test wasn't blocked.** Pip is not protecting your sessions on this PC yet. Nothing outside the test folder was touched." → **Run the diagnostic** · Show what happened. The flow doesn't continue to sign-in or "watching"; the notch, when it appears, shows **Not protected**.
- **Couldn't start (edge K):** unchanged; status "Protected · not yet tested" (amber in the panel) until a real block or a later test.
- **No Back here:** the test has run; going back wouldn't undo it.

### Step 6 · Sign in *(new: CR-012 / always-on, 2026-10-26; step 4 until the reorder)*
- **Intent:** Do. **Primary:** **Send a code**, then **Sign in** (enabled at 6 digits; the 6th digit or a paste submits by itself), then **Choose your rules**.
- **Why here:** you've seen what Eucas found in your week (value first) and watched the guard work, and the next step is the first that needs the server (drafting a described rule).
- **Email screen.** Headline "Sign in with your email" · Lede "No password: Eucas emails you a 6-digit code. Your account holds only your email, your plan and how much supervisor help you've used." · one field, **Email** (prefilled from nothing; `autocomplete=email`) · an **unticked** checkbox **"Send me product news"** (founder, 2026-10-26, U-7: ticking it is consent to product emails; without it, account emails only: codes, trial ending, plan changes) · two consequence lines (the same `conseq` list as the lock step): "Your 14-day supervisor trial starts when setup finishes. No card." and "Your Claude login stays as it is. Eucas never sees it." (ADR-0002: the second line answers the question everyone asks here.)
- **Code screen.** Headline "Check your email" · "Eucas sent a 6-digit code to **sam@example.com**. Change" · six cells (one input in the build: `inputmode=numeric`, `autocomplete=one-time-code`, paste fills all six) · "Didn't get it? Check your spam folder, or send a new one." · After resending: "A new code is on its way. The old one no longer works." The resend link waits 30 s between sends ("Send a new one in 0:24"). A code works for 10 minutes.
- **Signed in, a new account.** Headline "You're signed in" · checklist: "Signed in as sam@example.com · A new account. It holds only your email, your plan and how much supervisor help you've used." and "Your 14-day supervisor trial · Starts when setup finishes. No card." → **Choose your rules**.
- **Signed in, an existing account** (it keeps its plan and trial). Headline "Welcome back" · "Signed in as sam@example.com · Your account since 2 Oct" · the plan that carries over, one of: "Your plan carries over: Pro, Founders' price · $15/month for life · renews 26 Nov" / "Pro · renews 26 Nov" / "Your trial carries over · 9 days left, ends 4 Nov" / "Your trial was used on 2 Oct · Pip gets a small amount of supervisor help each month" · and "This PC starts fresh · Your rules and what Pip knows live on each PC, never in your account."
- **Wrong code** (founder copy): the six cells take a red ring (no shake: the eye grammar never alarms) and one line: "**That code didn't match.** Send a new one" (the link resends). After 5 wrong tries the code stops working and the same line shows (spec).
- **Expired code** *(spec)*: "That code has expired. Send a new one".
- **An address that expires** (disposable email, founder copy): under the field, "Please use an address you'll keep. This one expires." **Send a code** stays disabled until the address changes.
- **Offline or the server can't be reached** *(revised, founder 2026-10-26: "don't allow to access without sign in")*: a neutral banner (the offline pattern): "**You need to be online to sign in.** Setup carries on once you're connected. Pip is already guarding: the four limits are locked." (if the lock was declined at step 4: "…Pip is already guarding: the four limits run, not locked.") → **Retry** (primary) · **Back**. ~~Sign in later~~ is gone: setup **waits here**. The four limits were installed at step 4, so the PC is protected while it waits; what waits for sign-in is your own rules (step 7), the supervisor and the rest of setup. See edge S.
- **Evidence:** what happened (the checklist names the account and the plan) · how to take it back (Settings › Account: Sign out, Delete account) · what's next (the primary names it).
- **Consequence preview:** the trial line, before you send anything; nothing more on this PC changes at this step.
- **Emotional moment: none on purpose.** A sign-in is a chore; it should feel short.

### Step 7 · Choose your rules (D-4) *(reordered 2026-10-26: after sign-in, at user scope)*
- **Intent:** Do. **Primary:** **Continue · 7 rules** (the count is the consequence).
- **Headline:** "Choose your rules" · **Lede:** "The four limits are locked. Keep the tested rules and add your own in plain words: Pip turns them into exact rules you confirm." (If the lock was declined at step 4: "The four limits are on. …")
- **Footer hint (left of the primary):** "Not locked yet. Lock them from Rules any time; Windows asks once more." (Setup has one admin prompt, at step 4. Your rules run at user scope and show **Not locked**; locking them later from Rules uses the existing rule that changing the locked set asks for admin again.)
- **Left: Limits** (the four, no switch; each shows **Locked**, or **Always on** if the lock was declined) above **Safety rules** (tested library, switches, on by default except "Ask before installing packages"). **Right: Your own** (the composer and the draft card) above **From your week** (suggestions as checkboxes; read-only ones pre-ticked; anything that runs project code shown unticked with "Runs code from the project").
- **The draft card:** *You wrote: "don't let agents touch the migrations in api-docs"* → `block Edit, Write · in api-docs/migrations/ and everything in it` → "Last week it would have blocked 3 calls, all from api-docs. It can't loosen a locked rule." → **Add rule** · Reword. A quiet line: "Drafted with supervisor help · counts on the meter" (the trial covers it in setup). **In setup the card has no "Lock it too"** (it would be a second admin prompt); in Rules it does.
- **Rules for rules** (unchanged from PM-T5): exact commands, never globs; scope is a folder; runners never pre-ticked or "everywhere"; nothing can allow a delete, a push to the default branch, a send or a payment; a conflict with your own Claude Code `ask`/`deny` rule disables the row with why.
- **States:** default · drafting · draft shown · draft rejected ("That would loosen a locked rule, so Pip can't add it. Try describing what to block instead.") · thin history (5 starters) · offline after sign-in (guided form) · write failed (edge I copy; the rule stays on screen).

### Step 8 · What is sent *(replaces "What Pip may read": CR-012 / always-on, 2026-10-26)*
- **Intent:** Know. **Primary:** **Start watching**. No choice on this screen: the supervisor is always on.
- **Headline:** "What is sent"
- **Lede (approved privacy line, verbatim):** "When Pip isn't sure, it sends the waiting session's last message, trimmed and with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC. Your account holds only your email and your plan."
- **The example** (one card, the same component as Settings › What is sent): header "From your last session · bench · today, 13:52" with the chip **Yours, redacted** · the message **exactly as it would leave the PC**, with each removal shown in place as a neutral mono tag (`path removed`, `secret removed`, `6 lines of code removed`) and a trailing "…" where it was trimmed · a footer: "Removed 6 lines of code, 2 paths, 1 secret · trimmed from 1,830 to 240 characters" and "Goes to the supervisor: an open model hosted with zero data retention."
- **The original is never shown.** It's your own session, and showing it would put a real secret on screen in setup. The counts say what was taken out; the session itself is one click away in your terminal.
- **No session yet** (edge F, or every session is older than history): the same card with a **labelled sample**: header "Not from your work: you have no sessions yet", chip **Sample**, a made-up message with the same kinds of removals. Settings › What is sent switches to your real example after your first session.
- **Redaction fails or can't parse the last message** *(spec)*: show the sample, and the build sends nothing for that question (Pip asks you instead). Never show an unredacted message.
- **Under the example** *(founder, 2026-10-26, tech lead Q9)*: "The supervisor is always on and can't be switched off. Your rules always decide first." (the download page says the same).
- **Only the redacted, trimmed last message is sent** (U-6); anything more would come back to the founder first.
- **Footer hint:** "Always in Settings › What is sent" (the evidence that this isn't a one-time promise).
- **Removed:** the Level 1 / Level 2 cards, "Default" chip, "Needed for the 14-day supervisor trial", the trial email field and its code. Nothing else from this step survives.
- **Emotional moment: trust, without motion.** The example is the moment; animating it would make it feel like marketing.

### Step 9 · Pip is watching (peak-end: the homecoming)
- **Intent:** Go. **Primary:** **Send Pip to the top**.
- **Content:** the avatar, "**Pip is watching**", "2 sessions running, both protected. Pip lives at the top of your screen and never opens by itself.", the heartbeat chip "Checked 2 s ago" (pulses every 2.4 s). Under it, **the honest zero** (new since approval): "Pip knows nothing about how you work yet. It learns from what you allow, deny and answer. You can read and delete all of it in Settings."
- **The trial starts here** *(CR-012 / always-on, 2026-10-26)*: when you press the primary, the 14-day trial starts (ends 9 Nov in the example). The meter shows it the first time you open Usage; no line here (the removal test: you were told at step 6).
- **The flight:** the window fades; the avatar shrinks and flies to the top centre (900 ms, `--spring-smooth`) and becomes the eyes in the notch, which open with a blink; the done sound. Reduced motion: a crossfade.
- **Coach mark, once:** under the notch: "**Pip lives here.** Hover to peek at what needs you. Click to open the panel. Nothing here opens by itself." [Got it]. It leaves on Got it, on the first click of the notch, or after the first peek.

---

## 3. Edge paths (changes to onboarding A–Q)

| # | Change |
|---|---|
| A–C | Unchanged; they sit on step 1. |
| D | Organisation policy: the lock and the test (steps 4–5) become one screen, "Your organisation's Claude Code policy only allows its own hooks, so Pip can't guard sessions on this PC. Pip can still show your week and your usage.", and Choose your rules (step 7) is skipped (*reordered 2026-10-26*; was steps 5–7). The notch shows **Not protected** with "Blocked by your organisation" in the peek, permanently. Sign in (step 6) and What is sent (step 8) are unchanged. |
| H | New copy above (step 4, "The four limits are on, but not locked"). Your step-7 rules are Not locked in every case; H is about the limits. |
| N | Sessions already running: step 9 says "2 running: bench is protected; api-docs will be when you restart it." The notch shows the needs-you item for api-docs ("api-docs isn't protected yet · restart it"). SP-H1 found running sessions don't pick up a new plugin; settings-file hooks hot-reload in ~3 s, so this may shrink. |
| P | Notifications off: no longer asked in setup (the notch is the surface). Settings shows it only if a full-screen notification was missed. |
| Q | Quit during setup: before step 4 nothing was written on this PC; after step 4 the four limits stay on (locked, or Not locked if declined) and reopening resumes at the next step not yet done (step 5 if the test hasn't run). *(CR-012 / always-on, 2026-10-26)* If you signed in at step 6, the account exists but the trial hasn't started; reopening resumes where you were, signed in. |
| R | **Closing the window at steps 2–3** (nothing written yet): reopening starts at step 2 with the name and look you had. From step 4 on, Q applies. The notch doesn't appear until step 9: between step 4 and step 9 the guard runs with no Euca on screen. |
| **New: S** *(revised, founder 2026-10-26: "don't allow to access without sign in"; reordered 2026-10-26)* | ~~**Sign in later** (offline or server unreachable at step 4): setup continues…~~ **Offline or server unreachable at sign-in (step 6): setup waits, and the PC is already protected.** "**You need to be online to sign in.** Setup carries on once you're connected. Pip is already guarding: the four limits are locked." (declined at step 4: "…the four limits run, not locked.") with **Retry** and **Back**. The four limits were installed at step 4, before sign-in; what isn't written until you sign in is your own rules (step 7) and the supervisor. Retry sends the code once you're back online. There is no "Sign in later", and decision U-3 is moot. |
| **New: T** *(CR-012 / always-on, 2026-10-26)* | **The code email never arrives**: the resend line after 30 s, then after a second resend: ~~"Still nothing? Check that sam@example.com is right, or Sign in later."~~ "Still nothing? Check that sam@example.com is right, or send a new one." (revised 2026-10-26: no "Sign in later"; a broken mail provider does hold setup at step 6, the cost of mandatory sign-in. Since the reorder the four limits are already on while it waits.) |
| **New: U** *(founder, 2026-10-26, tech lead Q2)* | **Smart App Control is on (or in evaluation)** at step 1: unsigned v0.1 can't install its guard. One screen: "**Windows is blocking Pip's guard**" · "Smart App Control is on, and it only runs signed apps. This first version of Eucas isn't signed yet, so it can't guard your sessions on this PC." · ✓ "Nothing was installed" · ✓ "A signed version is coming · eucas.app says when it's out" → **Close setup** (primary) · "Read why on eucas.app". The README says the same. **Signing before the public launch is decided on waitlist size** (founder, 26 Oct: *"if we had a lot of people in the waitlist then I might do the signing before launch"*); the fallback trigger stays: signing is bought if more than about 10 % of early installs hit this screen. The same decision covers the SmartScreen warning at step 0. Route `s-sac`. |

---

## 4. State matrix (setup window)

| Step | Default | Working | Empty | Partial | Error | Offline | Usage limit | Permission denied | Success |
|---|---|---|---|---|---|---|---|---|---|
| 1 Find | Checklist | Spinner glyph per line | N/A (always has lines) | "Still checking…" after 3 s | A, B, C | N/A: local | N/A | D | All ticked |
| 2 Make | Born *(proto)* | — | Before: grey, closed eyes *(proto)* | Name or look only (hint) *(proto)* | Name too long: capped at 16 | N/A | N/A | N/A | Birth blink |
| 3 Week | 4 cards *(proto)* | Streaming | F | G (tokens only) | Parse errors counted | N/A | Plan share shown, no warning tone | Folder unreadable → Diagnostic | — |
| 4 Lock *(limits only, reordered 2026-10-26)* | The four limits + consequences *(proto)* | Waiting for Windows *(proto)* | N/A | One limit unticked: it stays on, Not locked | I (write failed) | N/A: local, no account needed | N/A | H: declined *(proto)* | → 5 |
| 5 Test | Live log | Running | N/A | K (not yet tested) | J *(proto)* | Mock path needs no network | Mock path uses no tokens | N/A | Blocked *(proto)* |
| **6 Sign in** *(CR-012)* | Email *(proto)* | "Sending…" on the button; code screen *(proto)* | N/A (the field starts empty) | Code partly typed *(proto)* | Wrong code *(proto)* · expired *(spec)* · address that expires *(proto)* · email never arrives (T) *(spec)* | Setup waits, already guarded: "You need to be online to sign in. Setup carries on once you're connected. Pip is already guarding: the four limits are locked." · Retry · Back *(proto)* | N/A | Too many tries: the code stops working *(spec)* | New account *(proto)* · existing account keeps its plan *(proto)* |
| 7 Rules | Lists, limits shown Locked, the Not locked hint *(proto)* | Drafting | Thin history → starters | — | Draft rejected (loosens a lock) · I (write failed) | Offline after sign-in: the guided exact-rule form | N/A | Conflicts with your own `ask` rule | Draft shown *(proto)*; rules written at user scope, Not locked |
| **8 What is sent** *(CR-012)* | Your last session, redacted *(proto)* | Redacting (≤ 1 s, local) | No session: the labelled sample *(proto)* | Message shorter than 240: "not trimmed" in the footer *(spec)* | Can't redact: the sample, and nothing is sent for that question *(spec)* | N/A: local | N/A | N/A | → 9 |
| 9 Watching | Heartbeat *(proto)* | The flight | No sessions: "None running now. Start one and Pip will watch it." | N | J carried: Not protected | Heartbeat local | Shows usage only if near a limit | D carried | Coach mark *(proto)* |

## 5. Emotional moments (three, pinned)
1. **Birth** (step 2): the first blink of a character you made. Goal: belonging.
2. **The proof** (step 5; step 7 before the 2026-10-26 reorder): a block you watched, before you've even signed in. Goal: trust. The done sound.
3. **The homecoming** (step 9): it flies to its place. Goal: you know where it lives, and that it stays quiet there.
Not chosen: confetti (wrong tone for a safety tool), a tour of the panel (the coach mark is one sentence), any motion on sign-in or What is sent (*CR-012 / always-on, 2026-10-26*: a chore should feel short, and proof should feel plain).

## 6. Timing assumptions
As in [onboarding-flow §4](onboarding-flow.md), plus: step 2 ~45 s (naming is the longest choice; suggestions cap it); *CR-012 / always-on, 2026-10-26:* sign-in (step 6) ~40 s (typing an email, switching to the inbox, the code; the 6th digit submits), step 8 ~20 s (reading one card, no choice). *Reordered 2026-10-26:* the lock (step 4) ~20 s (four rows, all ticked; the UAC prompt is the time), rules (step 7) ~45 s. The total stays about 5 minutes because step 8 lost its choice and its email field and the lock lost its rules list. **Activation:** reached step 9 with the test blocked, and one real session protected within 24 h. **New measure:** share of installs that wait at sign-in (offline or no code), and how many of those finish setup within 24 h.

---

## 7. New for approval (CR-012 / always-on, 2026-10-26): approved 26 Oct with U-1 – U-8

| # | Screen or state | Route in the prototype |
|---|---|---|
| 1 | Step 6 · Sign in: your email (with the trial and Claude-login lines) | `s-signin` |
| 2 | Step 6 · the 6-digit code | `s-signin-code` |
| 3 | Step 6 · wrong code ("That code didn't match. Send a new one") | `s-signin-wrong` |
| 4 | Step 6 · an address that expires ("Please use an address you'll keep. This one expires.") | `s-signin-disposable` |
| 5 | Step 6 · offline: setup waits, already guarded (Retry, Back) | `s-signin-offline` |
| 6 | Step 6 · signed in, a new account (the trial starts when setup finishes) | `s-signin-done` |
| 7 | Step 6 · signed in, an existing account keeps its plan ("Welcome back") | `s-signin-back` |
| 8 | Step 8 · What is sent, from your last session | `s-sent` |
| 9 | Step 8 · What is sent, the labelled sample | `s-sent-sample` |
| ~~10~~ | ~~Step 9 · the not-signed-in line (edge S)~~ removed 2026-10-26 (no Sign in later) | — |
| 11 | Step 1 · Smart App Control is on (edge U) | `s-sac` |
| — | Spec only: expired code, too many tries, resend cooldown, email never arrives (T), can't redact | — |
| 12 | *Reordered 2026-10-26 (founder, approved):* Step 4 · Lock the four limits, its UAC wait and its declined state; Step 5 · the test, blocked and not blocked; Step 7 · Choose your rules with the Not locked hint | `s-lock`, `s-uac`, `s-declined`, `s-test`, `s-test-fail`, `s-rules`, `s-rules-draft` (ids unchanged; screenshots `setup-4-lock-d`, `setup-4-uac-d`, `setup-4-declined-d`, `setup-5-test-d`, `setup-5-test-failed-d`, `setup-7-rules-d`, `setup-7-rules-draft-d`) |

**Removed:** the Level 1 / Level 2 choice (old step 7, routes `s-privacy` and `s-privacy-2`), the optional trial email and decision D-3 (replaced by the sign-in step, now step 6). The panel's new states are listed in [notch-and-panel.md §10](notch-and-panel.md).
