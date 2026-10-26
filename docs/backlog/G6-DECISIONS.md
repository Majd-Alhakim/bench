# Gate 6: what you decide

**For:** you (the client) · **From:** PM, with the two tech leads · **Date:** 2026-10-26
**On:** [the backlog](README.md) (34 stories, 156 tasks, 63.0 build days; 58.5 before NA-1, no account with a supervisor taste, 2026-10-26), [the sprint plan](README.md#4-sprint-plan) (11 three-day sprints over two lanes) and [Sprint 1](../sprints/sprint-01/README.md).

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

## Your answers (2026-10-26)

**G6 approved with conditions.** You said *"Accept Gate 6"*, accepting the recommendations 1a, 2a, 3a, 4a, 5a, 6a and 7a, and then 8–11 (*"yes"*) ([gate log](../process/STATUS.md#gate-log)).

| # | Answer | What it means now |
|---|---|---|
| 1 | (a) | The backlog, the sprint plan and Sprint 1 are approved as drafted. |
| 2 | (a) | 63.75 build days (with NA-1), 11 sprints; sequence, don't cut. A 12th sprint is the named fallback. **Re-estimated the same day to 63.0 d** (156 tasks) after the founder's no-account answers cut the minimal panel; still 11 sprints. |
| 3 | (a) | **Condition:** the page goes live now. The build starts on day 8 after it goes live, and only if the waitlist has ≥ 100 sign-ups. |
| 4 | (a) | ADR-0007 to ADR-0018 are **Accepted**; the stale wording is fixed in a Sprint 1 docs PR. |
| 5 | (a) | **Conditions:** SP-ST2 is GO before Sprint 2; SP-AC1 and P9 are done before Sprint 4. |
| 6 | (a) | **Condition:** the launch waits for SP-SUP2 to pass. On a NO-GO, it re-runs once with the fallback models; then a change request. |
| 7 | (a) | The GitHub Issues, labels and milestones are created from [github-issues.md](github-issues.md) (done 2026-10-26: #100–#150). |
| 8 | (a) | LY-1's slot, scope and fallback as recommended (founder, 2026-10-26: *"yes"*). |
| 9 | (a) | R-2's "Describe a rule" can return a guidance rule on the same draft card (+0.25 d in R-2). |
| 10 | (a) | No pre-approval for moving F-1 and L-1; asked at the day-6 re-plan with the numbers. |
| 11 | yes | All five small calls (i)–(v) as recommended. |

2b (a)–(c), the no-account answers, are in too (see 2b below; applied in #92).

*The questions as asked:*

## The gate itself

**1. Approve the backlog, the plan and Sprint 1?**
- (a) Approve as drafted.
- (b) Approve with changes.

**Recommendation: (a).** Sprint 1 is pure foundation (the scaffold, the guard's parser and the shell). It needs nothing still open, and its demo takes five minutes.

**2. Accept the estimate going from about 48 to 63.0 build days (11 sprints, about 33 working days)?** *(Updated 2026-10-26: 58.5 + 4.5 for NA-1 (no account: Free without memory, a 10-decision supervisor taste, 1 own rule; the tech lead's estimate after your answers, was 5.25); slack drops from 7.5 to 3.0 lane-days, and a 12th sprint is the named fallback, never a cut. See [README §2](README.md#2-totals).)*
- What's in the +10.25: +3 is learns-you and +1 is Windows 10, both of which you approved; +0.25 is your eight-face order. The other +6 is work no story owned (the SQLite store, sounds, tamper restore) and approved scope nobody had sized (the 10 library rules, the gooey peek and switches). The breakdown is in [README §2](README.md#2-totals).
- (a) Accept it, and sequence rather than cut.
- (b) Hold to 10 sprints by moving F-1 and L-1 to v0.1.1.
- (c) Ask for cuts.

**Recommendation: (a).** It's your rule ("sequence, don't cut"). Sprints 5, 7, 9 and 10 already hold buffer. If actuals beat the numbers at the day-6 re-plan, Q-1 starts a sprint early and v0.1 ends in 10 sprints.

**2b. No account (NA-1, founder 2026-10-26: *"a small taste without sign up"*, *"try the supervisor also but like small number of usage"*). ✅ Answered by you, 2026-10-26; applied to the backlog.**
- (a) **What does a no-account user see?** ~~Recommendation: a minimal notch and panel. Alternative: the tray only.~~ **Answered:** *"Everything a free account sees but with limited supervisour usage and no memory and 1 custom role"* ("role" read as rule). So: the full notch and panel as on Free; no memory (learns-you, What Pip knows, learned suggestions off); exactly 1 own rule ("Create an account for more rules"); setup step 7 runs on the no-account path.
- (b) **Does the 14-day trial start at sign-up?** **Answered: yes**, when the account is created (at `verify`, no trial route); the no-account taste doesn't count against it.
- (c) **How big is the taste?** **Answered: 10 decisions per install, in total.**
- Also answered: counts may show as a meter everywhere, never dollars or money (*"Show counts always, but as meter not dollars or money"*); a random per-install ID is approved (*"Yes install ID"*); the SRS gets a revision note to v1.1 (*"Yes update SRS"*).

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

**Recommendation: (a).** It's the cheapest way to make "learns you" real, and R-2.3 (the draft card) sits in lane A's Sprint 10, which has 0.5 d of buffer. The +0.25 is not in the 63.0.

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
