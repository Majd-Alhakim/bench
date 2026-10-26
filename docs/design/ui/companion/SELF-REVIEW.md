# Self-review: the notch redesign

| Date | Reviewer | Scope |
|---|---|---|
| 2026-10-26 | PM + UX/UI (Claude) | [DESIGN.md](DESIGN.md), [prototype/notch.html](prototype/notch.html), [screens/](screens/), UX [notch-and-panel.md](../../ux/companion/notch-and-panel.md) and [setup-flow.md](../../ux/companion/setup-flow.md) |

**How it was checked.** Every state rendered with headless Edge at 1440 × 900 (dense panel also at 1280 × 800), zoomed crops of each notch state at 2×, light and dark; contact sheets reviewed and fixed (below). An interaction smoke test in headless Edge: no peek before 280 ms, peek opens on rest and folds on leave, click opens the panel, tabs work by mouse and arrow keys, Esc closes, setup runs end to end including the admin prompt, the flight lands in the notch with the coach mark, Continue stays disabled until the Euca has a name and a look, the jump menu lists all 57 states, **no console errors**.

**Skills.** `premium-craft` and `ui-ux-guide` were loaded and followed (gates, rubric, checklist below). `better-frontend`, `design-taste-frontend` (app screens), `anthropic-skills:accessibility` and `anthropic-skills:ui-animations` were **not loaded in this session**; their standing rules (tabular figures, focus rings, hit areas, reduced motion, no decorative motion, contrast, one accent) were applied from the existing system and the earlier companion review. A pass with those skills loaded is a fair ask before Gate 5-style approval.

---

## 0000. No account: everything Free sees, minus memory, 2026-10-26 (screens need approval)

**Founder decisions:** *"we make people have a small taste without sign up and then they have to create account or buy pro"* (Show HN and the awesome-claude-code list exclude sign-up-gated tools); *"Let the no account also have to try the supervisor also but like small number of usage"*; then the answers: (a) *"Everything a free account sees but with limited supervisour usage and no memory and 1 custom role"* (rule), (b) the trial starts when the account is created, (c) 10 answers per install, counts *"as meter not dollars or money"*, *"Yes install ID"*. **Partly reverses U-1** (§5b). Spec: [setup-flow.md](../../ux/companion/setup-flow.md) step 6 secondary, steps 7, 8 and 9 without an account, edges S, T, V, W, §4, §6, §7 rows 13–18, §8 · [notch-and-panel.md §11](../../ux/companion/notch-and-panel.md) (and §5's count rule, the signed-out and deleted states in §10) · [DESIGN §12.8](DESIGN.md).

- **Path:** 1–5 the same · 6 **Continue without an account** (ghost, left of the primary; also offline) → 7 Choose your rules (no From your week; one rule of your own; "Continue · 5 rules") → 8 What is sent (the no-account last sentence) → 9 **Pip is watching** without an account (three ticks; "An account adds 14 days of the supervisor, more rules and memory."; the flight). About **4:25**.
- **Surface:** the same notch and panel as Free. Three things change: Usage › Supervisor is the taste ("No account" chip, "Answers left · For this install · 7 of 10"); Rules › Your rules allows one rule, then "One rule of your own without an account. Create an account for more rules"; Settings › Account reads "No account · 10 supervisor answers, one rule of your own, no memory. Eucas keeps only a random ID for this install." with **Create an account**. Memory's parts (What Pip knows, learned line, Applied chips, suggestions, compounding line) are absent, not disabled. The tray stays the fallback.
- **Taste used up:** "0 of 10" and "**Pip asks you now.** Sign up for 14 more days of the supervisor. Create an account", as the meter's own state in Usage.
- **Counts:** "never a call count" is corrected to **"never dollars or money; counts as a meter are fine"** in notch-and-panel §5 and DESIGN `SupervisorMeter` (not an exception).
- **Signed out / deleted** → the no-account state (replaces "the panel shows only sign-in"); sign-in moves to the setup window (step 6), opened from Settings › Account or the tray, and ends on **Done** with one blink.
- **Superseded during the same session:** a "Safety is on" end screen, a tray-only surface and a minimal panel without tabs, each drafted before the founder's next answer. Only one mention remains (setup-flow step 9).

**Calm and never nag, checked:** no greyed-out tabs, rows or padlocks; the notch never changes face, marker or sound because you have no account; each invite sits where the limit is felt (the empty meter, the composer after one rule, the Account row) and the only Cobalt invite is in Settings › Account, where you go to decide. **Voice:** Pip speaks of itself by name; no "I/me". **Removal test:** cut the honest zero and the trial line from step 9 and From your week from step 7 (all untrue without memory or an account); kept the step 6 consequence line.

**Things the founder or tech lead should look at:**
- **The taste-used-up line is no longer "once":** the prototype shows it as the meter's used-up state (always there in Usage, nowhere else). The brief said "one calm line, once"; it's calm because it only lives where you look for the meter, but say if you want a Got it.
- **The approved privacy line's last sentence** changes on the no-account path only (new copy for approval).
- **Signing out with several rules of your own:** they keep working; you can't add more until you sign in. Spec'd in notch-and-panel §10.4.
- **Step 5's primary still reads "Sign in"**, which can look like a gate before you see the secondary on step 6. Left as approved; renaming it "Continue" is a one-word change if the founder wants the door visible a screen earlier.
- **Measuring the no-account path:** the server sees only install IDs and taste used; linking the install ID at sign-up (to know conversion) needs a tech lead check against the privacy line.
- **Edge D (org policy) without an account:** assumes the tripwire runs without hooks; tech lead to confirm.
- **Assumption:** step 2 (Make your Euca) runs for everyone.

**Render-and-look:** done by the coordinator, who builds the prototype states (this session has no shell and didn't touch `prototype/` or `screens/`). **Final round** screens: `setup-6-signin-d`, `setup-6-signin-offline-d`, `setup-7-rules-noacct-d`, `setup-8-sent-noacct-d`, `setup-9-noacct-d` / `-l` / `-declined-d`, `panel-noacct-d` / `-l`, `panel-noacct-rules-d`, `panel-noacct-settings-d`, `panel-noacct-empty-d`, `noacct-tray-d` / `-l` / `-off-d`, and the re-renders `acct-signedout-d`, `acct-deleted-d`. Results (2026-10-26, final round): all 14 no-account captures plus `acct-signedout-d` / `acct-deleted-d` rendered at 1440×900 and looked at. Usage, Rules and Settings shots scroll the panel to the section that differs (route `scroll`), so the taste meter, the one-rule line and the Account row are in view. **Fixed:** step 9 without an account clipped its link at 600 px in the declined variant; the invite is now one sentence ("An account adds 14 days of the supervisor, more rules and memory.") and fits. **Fixed:** the one rule of your own in Rules was a rule learned from approvals, which contradicts no memory; it is now a described rule. The "No account" chip, "7 of 10" and "0 of 10" sit in the meter without wrapping; the Settings Account row wraps to four lines beside the Cobalt button and stays readable. The used-up line is the meter's state, not a one-time message; that is accepted (it appears only where you look, never as a pop-up). Risks to look for: the "No account" chip and "For this install" fitting the meter row at 400 px; Rules reading as complete with one rule and the line; the Settings Account row's two-line description. **First round** (minimal panel, superseded; kept as history) results (2026-10-26): rendered at 1440×900 and looked at. **Fixed:** step 9 without an account overflowed 600 px; the lede is cut by the removal test, the hero is 84 px and the checklist 540 px wide, and the declined variant (the tallest) fits. The step 6 footer's three buttons fit at 760 px. **Fixed (pre-existing on dev):** the 6-digit code cells' `.code` grid also styled the desktop editor's `.code`, garbling the backdrop in desk and setup shots since CR-012; it is renamed to `.codefield` (the same fix landed on dev in eucas-app/eucas#90; this branch takes that version) and every screen is re-rendered. The minimal panel reads calm: Needs you, then the three no-account rows and one quiet invite; the header's Locked chip is a label, not a link to Rules. Click-through s-signin → Continue without an account → What is sent → Pip is watching → the notch: no console errors. Risks to look for: the step 6 footer with three buttons at 760 px; step 9's three ticks plus the invite line inside 600 px; the `MiniPanel` empty state reading as unfinished rather than calm; the light tray menu.

**Rubric for this round (on paper, before render-and-look):**

| Axis | Level | Why |
|---|---|---|
| Copy | **Staff** | Every no-account line says what you have before what you'd get; the step 6 consequence line answers "what do I lose?" before the click; no "upgrade/unlock/limited" anywhere |
| Visuals | **Senior** | The same panel as Free; what's missing is absent, never greyed out |
| Color | **Senior** | No new colour; one Cobalt invite, in Settings › Account only; amber only for Not locked and a low taste |
| Type | **Senior** | ≤ 4 sizes per view, two weights, tabular counts |
| Structure | **Senior** | No new structure: three parts of the Free panel swap their content; each invite sits where its limit is felt |
| States and recovery | **Senior** | Taste full / low / used up / offline; signed out; deleted; declined lock; org policy; matrix rows in both UX files |
| Motion and emotion | **Senior** | The homecoming is kept for everyone; no new motion |
| Coherence | **Senior** | Same notch, header, needs-you item, meter and setup patterns; one invite pattern |
| Intelligence | **Senior** | The meter's line says what the supervisor does and what happens after; memory is honestly absent rather than faked |

**No axis below Senior on paper. Blocker before hand-off:** render-and-look of the screens above (gate 10).

## 000. Setup reorder, 2026-10-26: protect the PC before sign-in

**Founder decision (*"okay do that"*):** the admin lock and the four limits move before sign-in, so a PC is protected even when setup waits at sign-in (offline, or the code email doesn't arrive). New order: 1 Find your sessions · 2 Make your Euca · 3 Your week · **4 Lock the four limits** (one UAC prompt) · **5 Watch it block a test** · **6 Sign in** · **7 Choose your rules** · 8 What is sent · 9 Pip is watching. Spec: [setup-flow.md](../../ux/companion/setup-flow.md) §1–§7.

- **One admin prompt in setup, limits only.** Step 7's rules run at user scope, shown Not locked, with the hint "Not locked yet. Lock them from Rules any time; Windows asks once more." Locking later uses the existing rule that changing the locked set asks for admin again.
- **Copy mirrored from the prototype:** step 1 "Nothing on this PC changes until step 4."; step 4 "Lock the four limits" / **Lock the 4 limits** / "Locked, they live where no agent or repo can change them. Your own rules come after you sign in."; declined "The four limits are on, but not locked"; step 5's primary is **Sign in**; step 3's is **Continue**; step 6 offline "You need to be online to sign in. Setup carries on once you're connected. Pip is already guarding: the four limits are locked." (panel: "Pip keeps guarding while you wait."); Smart App Control's second check "A signed version is coming · eucas.app says when it's out" (signing before launch is decided on waitlist size; the ~10 % trigger is the fallback).
- **Screens renamed** (ids unchanged): `setup-4-lock-d`, `setup-4-uac-d`, `setup-4-declined-d`, `setup-5-test-d`, `setup-5-test-failed-d`, `setup-6-signin-*`, `setup-7-rules-d`, `setup-7-rules-draft-d`. The old `setup-4-signin-*`, `setup-5-rules-*`, `setup-6-lock/uac/declined-d` and `setup-7-test-*` PNGs are deleted.
- **Why it's better:** the proof moment (step 5) now lands before any chore, and the worst wait in setup (no code) no longer leaves the PC unguarded. Emotional moments are unchanged in kind; the proof moved from step 7 to step 5.
- **Prototype matches:** the setup draft card no longer shows **Lock it too** (it would be a second admin prompt); the Rules panel keeps it. **Open:** between step 4 and step 9 the guard runs with no Euca in the notch (edges Q, R): acceptable for a five-minute window, but worth a look if setup is abandoned mid-way.
- **Rendered and looked at:** every `setup-*` screen re-rendered with `capture.mjs setup` (plus `panel-rules-draft-d`); lock, declined, test, offline sign-in, rules and rules-draft checked at 1440×900: no clipping or overflow. The step-7 footer hint fits on one line beside Back and the primary.

## 00a. CR-012 / always-on, 2026-10-26: accounts for everyone, What is sent

**What changed** (spec: [setup-flow.md](../../ux/companion/setup-flow.md) steps 6 and 8 (sign-in was step 4 until the reorder in §000), edges S and T, §7 · [notch-and-panel.md §10](../../ux/companion/notch-and-panel.md) · [DESIGN §12](DESIGN.md)):
- **Setup has 9 steps.** New step 4 (step 6 since §000) **Sign in** (email, 6-digit code, wrong code, an address that expires, offline (revised 2026-10-26: setup waits, no Sign in later), new account, existing account keeps its plan). Step 8 **What is sent** replaces the Level 1/2 step: the approved privacy line verbatim and a real redacted example from your last session, or a labelled sample.
- **Level 1/2 is gone everywhere:** setup, Settings › Privacy (now a What is sent row), the meter's Level 1 state (now Not signed in; removed 2026-10-26, signed out the panel shows only sign-in), the guided rule form's trigger, the Why page, the prototype state (`level`), its CSS (`.levels`, `.lvl`, `.trial-f`, `.radio`) and its routes (`s-privacy`, `s-privacy-2`). D-3 is replaced.
- **Settings › Account** replaces Settings › Plan: email, plan (Free trial / Free / Pro / Founders' $15 for life), Sign out, Delete account; sign-in in the panel with the different-account warning.
- **What is sent** is a permanent page and a link under every meter state.

**How it was checked, and what wasn't.** This session had **no shell**, so `build.mjs` and `capture.mjs` could not run. Instead:
- `notch.html` was brought up to date by applying **the same edits** to it as to `src/` (the build is a verbatim concatenation; line offsets were checked: `src/app.js` line *n* is `notch.html` line *n* + 997, as before plus the 14 net CSS lines). Running `node docs/design/ui/companion/prototype/build.mjs` should produce a byte-identical file; please run it once to confirm.
- The new code was read back for syntax and every new route traced by hand through `go()`, `render()` and `act()`.
- **Not rendered and not looked at:** every screen listed in [DESIGN §12.7](DESIGN.md). Render-and-look (premium-craft gate 10) is **still owed** for this round: `node docs/design/ui/companion/prototype/capture.mjs setup-4 setup-8 acct panel-settings panel-usage panel-needs meter plan new-why` covers them (*after §000*: `setup-4 setup-5 setup-6 setup-7 setup-8`). Risks to look for: the step 8 lede (3 sentences) plus the card inside 600 px; the code cells in light theme; the delete button's wrap at 400 px; the toast length "Account deleted. Your rules and history stay on this PC." in the 400 px panel.
- **Stale PNGs to delete** after re-rendering (their names now mean other steps): `setup-4-rules-d`, `setup-4-rules-draft-d`, `setup-5-lock-d`, `setup-5-uac-d`, `setup-5-declined-d`, `setup-6-test-d`, `setup-6-test-failed-d`, `setup-7-privacy-d`, `setup-7-privacy-level2-d`, `setup-8-watching-d`, `setup-9-coach-d`.

**State matrix:** setup-flow §4 (rows 4 and 8 new) and notch-and-panel §6 (rows What is sent, Account, Sign in; the meter's denied cell). **Emotional moments:** unchanged on purpose; sign-in and What is sent carry no motion (a chore should feel short; proof should feel plain). **Worst moments:** offline at sign-in (revised 2026-10-26: setup waits with Retry and Back; after the first sign-in, everything local keeps working offline), wrong / expired code, an expiring address, the code never arriving (edge T), redaction failing (send nothing, show the sample), delete with Pro or Founders' (says what ends), signing in to a different account (warned before the code is sent). **Coherence:** one `SignIn` in setup and the panel; one `SentExample` in setup and Settings; the privacy line stored once; the offline banner, inline error, checklist and consequence list reused, no new pattern; "Sign in" is neutral navigation everywhere and the blue goes to the decision (Send a code, Sign out).

**Rubric for this round** (the §4 table still holds for everything else):

| Axis | Level | Why |
|---|---|---|
| Copy | **Staff** | The privacy line verbatim; the sign-in lede answers the two questions people ask there (password? my Claude login?); What is sent answers "can I turn it off?" before it's asked; Sign out and Delete say what keeps working before the click |
| Visuals | **Senior** | Plain on purpose; the one new idea, the in-place redaction tag, reuses the mono language |
| Color | **Senior** | No new colour; one Cobalt per view; amber only for the different-account consequence; delete is a danger tint, not a solid red |
| Type | **Senior** | ≤ 4 sizes per new view, 2 weights, tabular digits in the code cells |
| Structure | **Senior** | Hierarchy test: sign-in (step 6) headline → field → primary; step 8 headline → privacy line → example; Account email → plan → delete (quiet, last) |
| States and recovery | **Senior** | Full matrix rows; every error has a cause and one next step; nothing on this PC depends on the account |
| Motion and emotion | **Senior** | No new motion, deliberately; reduced motion is identical; the three pinned moments are untouched |
| Coherence | **Senior** | One pattern per situation, reused (above) |
| Intelligence | **Senior** | "Welcome back" tells you plainly that rules and learning stay per PC; What is sent counts what went this month |

**No axis below Senior on paper.** **Blocker before hand-off:** render-and-look for the screens above (gate 10 can't be waived by me).

## 00. New since approval (26 Oct, evening)
The founder approved D-1 to D-8 as recommended and asked for the full app's UX features. Added (spec: [notch-and-panel §9](../../ux/companion/notch-and-panel.md), [DESIGN §11](DESIGN.md)):
- **Learns you:** ongoing rule suggestions (quiet, never in the notch count), the "Pip learned" line with Undo, Applied chips, the ledger line, the monthly compounding line, **What Pip knows** in Settings (sources, Forget, export), the honest zero at setup.
- **Undo everywhere** with a 10 s timer; what can't be undone says so; Close the PR on a guided merge.
- **The Receipt** under everything Pip did, and one **Why?** page.
- **Moments:** all caught up, While you were away (peek and panel), Back to normal.
- **Worst moments:** offline, login expired, weekly limit, Claude not answering, write failed (plus not protected and the empty meter, already designed).
- **Eye grammar** for the notch (8 expressions, one loop), **R1** (blue only on decisions), **C-22** (verb + object + consequence), one time format, the **stopped** sound.
- **Fix:** the tripwire marker reads "Stopped: notes".

Checked: rendered every new state (dark, two in light) and looked at them; fixed the learned card's wrapped mono source line, the digest footer, a suggestion-only list title, and a wrapped receipt. A second smoke test passes: Not now + Undo, the merge offer becoming its result, the last item folding into all caught up, suggestions not counting in the notch, Undo on rules and learned items, What Pip knows, the tripwire wording; no console errors. The first smoke test still passes.

## 0. Founder decisions applied (26 Oct, later)
| Decision | Where it landed |
|---|---|
| Guided merge stays in Free | New needs-you item and its result (`p-needs`, `p-merge-done`, `n-peek-merge`); notch-and-panel §4.7 |
| Choose your rules and prompted rules stay; drafting uses the supervisor and counts on the meter | Draft card line; guided exact-rule form when the meter is empty, you're not signed in (CR-012; was "at Level 1") or offline (§4.5) |
| The four limits are always on; lock per limit | `LimitRow` in Rules and setup 4 and 7 (renumbered in §000); no switch; Locked / Not locked chips |
| "Your default branch", not "main" | All prose; `main` only in literal commands |
| Budgets stop before the next step | `p-budget`, notch-and-panel §4.8 |
| v0.1 unsigned, no "signed" badge | UAC copy says Unknown publisher; nothing claims signing |

## 1. Fixed after looking at the renders
1. The Euca's name overlapped the mini notch on the setup stage → the mini notch moved into the flow.
2. The panel header's status line truncated ("…2 working · c…") → the lock chip moved onto the name row; the status line now has the full width; "working" is left to the beam.
3. The drafted rule in setup's rules step (then step 4, now step 7) was below the fold → "Your own" moved above "From your week"; the window grew to 600 px (still fits a 768 px laptop).
4. The trial chip was green (green is only for proven checks) → neutral.
5. The meter said "Help left … left until 9 Nov" → one label, the date on the right.
6. The tripwire page repeated "Stopped notes" twice → the page title is "Tripwire stop".
7. The thin-line dot hung below the line → it sits on the line's end.
8. The glow spilled into the open peek → hidden while peeking.
9. The tripwire line truncated in the peek; the not-protected peek repeated its item in the footer → both shortened.
10. "Lock it too" wrapped in the draft card; "Change the words" → "Reword".
11. Arrow keys lost the tab focus after a click re-render → focus restored.

## 2. `ui-ux-guide` checklist

| # | Item | ✓ | Note |
|---|---|---|---|
| 1 | One intent, one primary | ✅ | Notch: look. Peek: one action per item. Panel: one Cobalt per view. Setup: one primary per step |
| 2 | ≤ 7 per group, progressive disclosure | ✅ | Needs-you shows 3 + more; 3 tabs; 7 safety rules |
| 3 | Key actions large, on the eye's path | ✅ | The notch is 124 × 32 at the top centre (Fitts: an edge target); peek actions on the right of each line |
| 4 | Weight leads to the primary and "needs you" | ✅ | Amber marker is the only colour in a resting notch |
| 5 | 60-30-10, meaning colours, text on every status | ✅ | Eye shapes + words for serious states |
| 6 | All interaction states distinct | ✅ | Hover, press (scale 0.97), focus ring, disabled (setup Continue) |
| 7 | Measure, line height, one scale | ✅ | Lede ≤ 56 ch; 4 sizes in the panel |
| 8 | A system | ✅ | One editor, one rule row, one needs-you item across surfaces |
| 9 | Empty states | ✅ | "Nothing needs you.", no sessions, thin history, before setup |
| 10 | Errors: cause + next step; worst moment designed | ✅ | Tripwire, not protected, test not blocked, not locked |
| 11 | Smooth ending | ✅ | The homecoming + one-sentence coach mark |
| 12 | Feedback on key actions | ✅ | Toasts with Undo, birth blink, done sound |
| 13 | AA contrast, keyboard, reduced motion | ✅ | §8 of DESIGN.md |
| 14 | 32 / 40 px targets | ✅ | Peek buttons 28 visual, 32 hit |
| 15 | No dark patterns | ✅ | Pro only where the free answer runs out (empty meter, Settings › Plan); never in the notch |
| 16 | Nothing decorative | ✅ | The glow is the activity signal, not ornament |
| 17 | Avatar shows status with a label | ✅ | The Euca's eyes + the status line |
| 18 | Microcopy | ✅ | Plain state names, exact times and percentages |

## 3. `premium-craft` outputs
- **State matrix:** [notch-and-panel.md §6](../../ux/companion/notch-and-panel.md), [setup-flow.md §4](../../ux/companion/setup-flow.md).
- **Emotional moments (3):** birth (setup 2), the proof (setup 5; setup 7 before §000), the homecoming (setup 9) (*CR-012*: renumbered from 6 and 8). Everyday micro-moment: the glance when something arrives.
- **Worst moments:** tripwire stop, not protected, test not blocked, admin declined, meter empty, 5-hour limit, stale item, long names. Each names the cause, what's safe and one next step.
- **Coherence fixed:** "Guarded" retired for "Protected" (one word, CR-011's); one needs-you item in peek and panel; one Euca editor; one rule row and draft card in setup and Rules; one status line in peek, header and setup end.
- **Intelligence:** rule counters, the supervisor's value line, the forecast, Your week.

## 4. Rubric

| Axis | Level | Why |
|---|---|---|
| Copy | **Senior** | Second person, the Euca by name, numbers first, removal test applied (§7.2 of DESIGN.md); the fixed strings are stored once |
| Visuals | **Staff** | The product *is* the brand's signature: two eyes in a black notch, with the beam in your Euca's colour; nothing on Windows looks like it |
| Color | **Senior** | One Cobalt per view; amber, red and green only for meaning; the Euca's hue only on its own things |
| Type | **Senior** | 4 sizes in the panel, 2 weights, tabular numbers |
| Structure | **Senior** | One spacing scale; hierarchy test passes (notch: eyes → marker; panel: status → needs-you → tab content) |
| States and recovery | **Senior** | Full matrix; some cells are spec-only (§6) |
| Motion and emotion | **Senior** | Springs, reduced-motion safe, three pinned moments |
| Coherence | **Senior** | One pattern per situation (§3) |
| Intelligence | **Senior** | Counters and the value line are automatic deposits |

**No axis below Senior.** Blockers left: none for review. Before the build: the gaps in §6.

## 5. Decisions the founder needs to make

| # | Decision | Recommended | Alternative |
|---|---|---|---|
| **D-1** | Tab order in the panel | **Usage · Rules · Settings** (by how often you open them) | Settings · Rules · Usage (your words' order) |
| **D-2** | The notch colour in the light theme | **Always black** (it belongs to the screen, like a hardware notch) | Follows the theme (white notch in light) |
| ~~D-3~~ | ~~Where the trial email is asked~~ | **Replaced by CR-012 / always-on, 2026-10-26:** everyone signs in during setup (step 6 since §000); Level 2 no longer exists | — |
| **D-4** | Hover when nothing needs you | **A two-line status peek** ("Protected · 3 sessions · checked 2 s ago" + usage) — answers "is it on?" | Nothing happens (the 25 Oct design's rule for Atlas) |
| **D-5** | When the eyes doze | **Only when you're away 5 min *and* nothing is running** (so dozing never reads as "off") | Whenever you're away |
| **D-6** | The Pro button in v0.1 | **"Join the Pro waitlist"** until checkout exists (CR-010 D-2) — the prototype shows "Get Pro · $20/month" so you can see the final copy | Real checkout at launch |
| **D-7** | How the Euca refers to itself | **By its name** ("Pip will check with you more often until 1 Dec") | "Your Euca will…" (CR-011's literal line) |
| **D-8** | Thin-line mode | **Offered in Settings, pill by default**; not protected always shows the full pill | Pill only |

Also worth a glance: the example Euca is "Pip", a lavender sphere; the name suggestions (Pip, Moss, Juno, Kit); the setup headline "First, let's find your sessions".

## 5b. Decisions for the founder (CR-012 / always-on, 2026-10-26): answered

**Answered by the founder on 2026-10-26** (the Answer column). The new screens are approved with these changes (BRD §10 #62). Everything from the tech lead's BUILD-PLAN §6 is accepted too (*"accept all the tech lead recommendations"*).

| # | Decision | Recommended | Alternative | Answer |
|---|---|---|---|---|
| **U-1** | When "Sign in later" is offered | **Only when the code can't be sent or doesn't arrive** (offline, server down, edge T): accounts stay for everyone, and a broken mail provider can't block setup | Always, as a secondary on the email screen (more installs finish setup without an account) | **Partly reversed 2026-10-26 (§0000):** *"we make people have a small taste without sign up and then they have to create account or buy pro"* (Show HN and awesome-claude-code exclude sign-up-gated tools): step 6 offers **Continue without an account**, online and offline; no account gets everything Free sees, minus memory, with 10 supervisor answers and 1 rule of your own (founder (a)). Struck below: ~~**Revised: sign-in is mandatory:** *"don't allow to access without sign in"*. No "Sign in later" anywhere; offline, setup waits at sign-in ("You need to be online to sign in. Setup carries on once you're connected. Pip is already guarding: the four limits are locked.", Retry, Back; copy revised with the reorder in §000, where the limits are locked before sign-in). Signed out, the panel shows only sign-in;~~ the guard and the locked limits keep protecting (*"yes"*); signed out now returns to the no-account state |
| **U-2** | What happens to this PC's data when a different account signs in | **Kept per account on this PC**: the new account starts empty, the old one's rules, learning and history wait for it to sign back in (nothing is deleted without asking, CR-008's spirit) | Wiped on switch (simpler, but a mistyped email would erase your learning) | **Yes** |
| **U-3** | When the trial starts for someone who chose Sign in later | **When they sign in** (the trial belongs to the account) | When setup finishes, account or not (they'd lose trial days while offline) | **Moot** (no Sign in later) |
| **U-4** | After Delete account, can the same email get a new trial? | **No: the server keeps a one-way hash of the email and a "trial used" flag, nothing else**, and the delete page says so ("Signing up again with this email doesn't start a new trial") | Delete everything; the same email gets a fresh trial (easy trial abuse) | **Yes** (also tech lead Q1) |
| **U-5** | Delete account while on Pro or the Founders' price | **Pro stops at once and nothing more is charged; no partial refund**; the page says so, and Founders' is told the price ends with the account | Refund the unused part of the month (fairer, more billing work) | **Yes** |
| **U-6** | Exactly what the supervisor payload holds | **Only the trimmed, redacted last message**, as the approved line says; if the build needs the tool name (Bash, Edit), that's a copy change to bring back to you first | Message plus the tool name without arguments | **Yes**: anything more comes back to the founder first |
| **U-7** | Mailing list | **Account emails only** (codes, trial ending, plan changes); product news is an opt-in later in Settings › Account | An unticked "Send me product news" box at sign-in | **The alternative:** an unticked "Send me product news" box at registration; ticking it is consent |
| **U-8** | Show the unredacted original beside the example | **No**: it would put a real secret on screen during setup; the counts say what was removed | A "Show the original (stays on this PC)" toggle | **Yes** |

## 6. Gaps (honest)
- **No account, 2026-10-26 (§0000):** (a), (b), (c) answered by the founder; the final round's render-and-look is with the coordinator; spec-only: low taste, offline taste, step 9 with K / D, the Why? page without "what you taught it", creating an account later (edge W), signing out with several own rules.
- **CR-012 / always-on, 2026-10-26:** the new and renumbered screens are **not rendered** (no shell this session; §00a lists them); spec-only: expired code, too many tries, resend cooldown, the code never arriving (edge T), redaction failing, delete failed, sign-out/delete offline.
- **Spec-only, not drawn:** the supervisor unreachable meter line (the Level 1 line is retired); org policy; offline plan check; the "supervisor wasn't sure" item; "Show n more"; the fail-closed brick (unchanged from #57's spec).
- **Not rendered:** 125 % / 150 % display scaling; multi-monitor; a real Windows title bar under the notch (browser tabs at the top centre) to test the 280 ms hover intent against real pointer paths — **this is the biggest UX risk and needs a test on the founder's laptop in SP-ST1**.
- **Fonts** load from Google Fonts in the prototype; the app bundles them.
- The unsigned-build UAC copy ("Unknown publisher") follows CR-010's no-signing decision; it changes when a certificate is bought. Whether that happens before launch is decided on waitlist size (founder, 26 Oct), with the ~10 %-of-early-installs Smart App Control trigger as the fallback.
