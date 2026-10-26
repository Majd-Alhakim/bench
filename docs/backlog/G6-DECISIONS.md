# Gate 6: what you decide

**For:** you (the client) · **From:** PM, with the two tech leads · **Date:** 2026-10-26
**On:** [the backlog](README.md) (33 stories, 146 tasks, 58.5 build days), [the sprint plan](README.md#4-sprint-plan) (11 three-day sprints over two lanes) and [Sprint 1](../sprints/sprint-01/README.md).

**Already settled, not asked again:**
- the manual checklist (passed);
- the SP-SUP2 recorder (installed);
- BRD §10 #56–#65 (all answered);
- the guided-merge version and the setup order;
- the privacy line;
- Windows 10 in v0.1;
- the $10/day spend cap;
- the library rules;
- "no export";
- learns-you from structured events;
- the eye grammar: Pip shows only the eight faces in DESIGN §11 (founder order, 2026-10-26; in N-0.2, +0.25 d).

Reply with the numbers you accept, or "approve G6 as recommended".

## The gate itself

**1. Approve the backlog, the plan and Sprint 1?**
- (a) Approve as drafted.
- (b) Approve with changes.

**Recommendation: (a).** Sprint 1 is pure foundation (the scaffold, the guard's parser and the shell). It needs nothing still open, and its demo takes five minutes.

**2. Accept the estimate going from about 48 to 58.5 build days (11 sprints, about 33 working days)?**
- What's in the +10.25: +3 is learns-you and +1 is Windows 10, both of which you approved; +0.25 is your eight-face order. The other +6 is work no story owned (the SQLite store, sounds, tamper restore) and approved scope nobody had sized (the 10 library rules, the gooey peek and switches). The breakdown is in [README §2](README.md#2-totals).
- (a) Accept it, and sequence rather than cut.
- (b) Hold to 10 sprints by moving F-1 and L-1 to v0.1.1.
- (c) Ask for cuts.

**Recommendation: (a).** It's your rule ("sequence, don't cut"). Sprints 5, 7, 9 and 10 already hold buffer. If actuals beat the numbers at the day-6 re-plan, Q-1 starts a sprint early and v0.1 ends in 10 sprints.

**3. The demand test: does the build wait for week 1?** Your rule is that under 100 waitlist sign-ups in the week after the page goes live means don't build. The page is on `main` but not deployed yet.
- (a) Put the page live now. The build starts on day 8 if there are ≥ 100 sign-ups. The week goes on SP-ST2, SP-AC1, P9, creating the issues and recording SP-SUP2 moments.
- (b) Start Sprint 1 now, and stop if week 1 falls short.
- (c) Drop the test.

**Recommendation: (a).** It's your own kill rule, and the week isn't idle: all of Sprint 0 fits in it. The same count also decides whether you sign before launch.

**4. Approve ADR-0007 to ADR-0018 (BUILD-PLAN P1)?** All twelve are still marked *Proposed*. Your answers accepted the recommendations, not the ADR files.
- (a) Approve all twelve as amended.
- (b) Approve all but the ones you name.

**Recommendation: (a).** The tech lead fixes their stale text in a docs PR during Sprint 1: ADR-0011's "not in v0.1" header, ADR-0012's Durable Object text, ADR-0010's rulebook path. The decisions stand; only the wording is out of date.

**5. Approve G6 with the last prerequisites as conditions?** These are still open:
- SP-ST2 (0.5 d) blocks U-1.6 in Sprint 2 and N-0 in Sprint 3.
- SP-AC1 (0.25 d) and P9 block AC-1 in Sprint 4. P9 is Cloudflare Email on `eucas.app`, Workers Paid at $5 a month, and D1 for staging and production.

Options:
- (a) Approve now, on condition that SP-ST2 is GO before Sprint 2 and SP-AC1 and P9 are done before Sprint 4.
- (b) Hold G6 until all three are done.

**Recommendation: (a).** None of them touches Sprint 1, and under 3(a) they fit in the waitlist week.

## Scope calls inside the plan

**6. If SP-SUP2 is late or fails?** SRS G3-1 (your answer) says v0.1 launches only once it passes. BUILD-PLAN §2 still says "ships rules-only with the kill switch on".
- (a) The launch waits for a pass. On a NO-GO, re-run once with the fallback models and the hybrid. If that fails too, I bring a change request.
- (b) Launch rules-only, and start trials when the supervisor passes.

**Recommendation: (a)**, as you decided at G3, with a pace check at the Sprint 5 review: if the recorder isn't on track for 300 moments by Sprint 8, we know early. The tech lead corrects BUILD-PLAN §2.

**7. Create the GitHub Issues now that they're drafted?** [github-issues.md](github-issues.md) holds:
- 3 spike issues, 33 story issues and 13 Sprint 1 task issues;
- the labels `companion`, `type:*`, `lane:*`, `epic:E17`…`E28`, `blocked:SP-ST2`, `blocked:SP-AC1` and `gate:SP-SUP2`;
- the milestones `v0.1` and `Sprint 0`…`Sprint 11`.

The repo is public.

Options:
- (a) Create them all after G6.
- (b) Only Sprints 0–2 now, and the rest as each sprint starts.

**Recommendation: (a).** The board then shows the whole plan and its dependencies, and the content is already public in the docs.

**8. LY-1 "learns you": its slot, scope and one fallback?**
- **Slot:** Sprint 10, lane A, after SUP-1 and R-1.
- **Scope:** PRD 27.7, plus "That was wrong", plus 27.9 (calm and worst moments). The sounds went to N-1.
- **The fallback:** Claude Code's hooks may not report *your* answer to a permission prompt in a structured way. "From what you denied" then lists only the block rules you added after a prompt, rather than reading transcript text, which G3-3 forbids. LY-1.2's contract test decides.

Options:
- (a) Accept the slot, the scope and the fallback.
- (b) Learns-you only (27.7); the moments wait for v0.1.1.

**Recommendation: (a).** Its dependencies are all done by Sprint 10, and the fallback keeps the copy true.

**9. Guidance rules: who creates them?** "From how you answer" (FR-166) and the supervisor's guidance rules need rules you confirm (G3-3), but no approved screen writes one.
- (a) R-2's "Describe a rule" can return a guidance rule on the same draft card. That's one card variant for you to approve, and +0.25 d in R-2.
- (b) v0.1 has no guidance rules: the group shows its empty line, and the supervisor answers only from block and allow rules.

**Recommendation: (a).** It's the cheapest way to make "learns you" real, and R-2 sits in Sprint 10, where there is 1.25 d of buffer. The +0.25 is not in the 58.5.

**10. F-1 and L-1: decide their v0.1.1 escape now?**
- (a) No pre-approval: I ask at the day-6 re-plan, with the numbers.
- (b) Pre-approve moving them if a lane slips by more than a day.

**Recommendation: (a).** You decide with real actuals, not a guess.

## Small calls (approve as a set)

**11.** All recommended **yes**:
- **(i) CLAUDE.md:** it still describes the Electron team app. S1-1.4's PR updates its Commands and Architecture sections for Tauri, Rust and pnpm, and you review the change.
- **(ii) `apps/landing`:** it stays out of the pnpm workspace (npm, untouched), so the live waitlist carries no risk.
- **(iii) The gooey peek across two windows:** the native notch and the peek's webview must line up to the pixel. Build it with N-0.8's alignment probe. If alignment fails at any scale, or the peek misses 150 ms, the tech lead switches to the agreed fallback without a re-plan: the card melts out of a webview copy of the notch shape (same look).
- **(iv) Required checks:** the `dev` ruleset requires `Build & test (windows-latest / ubuntu-latest)` by name, so S1-1.4 keeps that job name. Adding the new jobs as required is a ruleset change you make yourself, after Sprint 1.
- **(v) The Pro price:** the meter's empty-state Pro line shows "$20" (FR-142). The "no `$` in the panel" check (NFR-115) allows `$` in that one copy key only.

## Documents to correct after G6 (owners, not decisions)

- **PRD (PM):**
  - move 25.3 (the supervisor) out of the Pro epic into the v0.1 epics;
  - add SP-ST2 and SP-AC1 to E17;
  - restate 18.2, 20.1, 20.3 and 23.2 (popover, toasts, export) to match the approved design;
  - add LY-1.
- **BUILD-PLAN (tech lead):**
  - point §3–§4 to [docs/backlog](README.md) for the current estimates and schedule;
  - fix §2's SP-SUP2 line (decision 6).
- **SYSTEM-DESIGN §5.9 (tech lead):** you can't sign out or delete your account while offline (SRS App. B B-2, AC-2.3).
- **CODE-STRUCTURE (tech lead):** `spool_lock.rs` becomes `spool.rs` (fixed in S1-1.1's PR).
