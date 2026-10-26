# Self-review: the notch redesign

| Date | Reviewer | Scope |
|---|---|---|
| 2026-10-26 | PM + UX/UI (Claude) | [DESIGN.md](DESIGN.md), [prototype/notch.html](prototype/notch.html), [screens/](screens/), UX [notch-and-panel.md](../../ux/companion/notch-and-panel.md) and [setup-flow.md](../../ux/companion/setup-flow.md) |

**How it was checked.** Every state rendered with headless Edge at 1440 × 900 (dense panel also at 1280 × 800), zoomed crops of each notch state at 2×, light and dark; contact sheets reviewed and fixed (below). An interaction smoke test in headless Edge: no peek before 280 ms, peek opens on rest and folds on leave, click opens the panel, tabs work by mouse and arrow keys, Esc closes, setup runs end to end including the admin prompt, the flight lands in the notch with the coach mark, Continue stays disabled until the Euca has a name and a look, the jump menu lists all 54 states, **no console errors**.

**Skills.** `premium-craft` and `ui-ux-guide` were loaded and followed (gates, rubric, checklist below). `better-frontend`, `design-taste-frontend` (app screens), `anthropic-skills:accessibility` and `anthropic-skills:ui-animations` were **not loaded in this session**; their standing rules (tabular figures, focus rings, hit areas, reduced motion, no decorative motion, contrast, one accent) were applied from the existing system and the earlier companion review. A pass with those skills loaded is a fair ask before Gate 5-style approval.

---

## 1. Fixed after looking at the renders
1. The Euca's name overlapped the mini notch on the setup stage → the mini notch moved into the flow.
2. The panel header's status line truncated ("…2 working · c…") → the lock chip moved onto the name row; the status line now has the full width; "working" is left to the beam.
3. The drafted rule in setup step 4 was below the fold → "Your own" moved above "From your week"; the window grew to 600 px (still fits a 768 px laptop).
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
- **Emotional moments (3):** birth (setup 2), the proof (setup 6), the homecoming (setup 8). Everyday micro-moment: the glance when something arrives.
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
| **D-3** | Where the trial email is asked | **Optional at setup when you pick Level 2**, skippable, startable later from Usage | Only later, from Usage (a shorter setup, fewer trials started) |
| **D-4** | Hover when nothing needs you | **A two-line status peek** ("Protected · 3 sessions · checked 2 s ago" + usage) — answers "is it on?" | Nothing happens (the 25 Oct design's rule for Atlas) |
| **D-5** | When the eyes doze | **Only when you're away 5 min *and* nothing is running** (so dozing never reads as "off") | Whenever you're away |
| **D-6** | The Pro button in v0.1 | **"Join the Pro waitlist"** until checkout exists (CR-010 D-2) — the prototype shows "Get Pro · $20/month" so you can see the final copy | Real checkout at launch |
| **D-7** | How the Euca refers to itself | **By its name** ("Pip will check with you more often until 1 Dec") | "Your Euca will…" (CR-011's literal line) |
| **D-8** | Thin-line mode | **Offered in Settings, pill by default**; not protected always shows the full pill | Pill only |

Also worth a glance: the example Euca is "Pip", a lavender sphere; the name suggestions (Pip, Moss, Juno, Kit); the setup headline "First, let's find your sessions".

## 6. Gaps (honest)
- **Spec-only, not drawn:** the supervisor unreachable and Level 1 meter lines; org policy; offline plan check; the "supervisor wasn't sure" item; "Show n more"; the fail-closed brick (unchanged from #57's spec).
- **Not rendered:** 125 % / 150 % display scaling; multi-monitor; a real Windows title bar under the notch (browser tabs at the top centre) to test the 280 ms hover intent against real pointer paths — **this is the biggest UX risk and needs a test on the founder's laptop in SP-ST1**.
- **Fonts** load from Google Fonts in the prototype; the app bundles them.
- The unsigned-build UAC copy ("Unknown publisher") follows CR-010's no-signing decision; it changes when a certificate is bought.
