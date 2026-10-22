# Premium experience spec: Bench (codename)

| Status | Version | Owner | Approver | Upstream | Next |
|---|---|---|---|---|---|
| Draft for client review | 0.1 (2026-10-22) | UX Designer | Client | Client brief (2026-10-22): *"it feels like normal and with no clear identity … it need a brand and a design system that make it feel premium"*; direction v0.2 ([DIRECTION.md](../../ui/DIRECTION.md), [direction.html](../../ui/prototype/direction.html)); UX package v0.4 ([../README.md](../README.md)); D-UI1–11; CR-001, CR-004, CR-006 | UI Designer turns this into a brand, a design system and hi-fi v0.3 |

This is the **experience half** of "premium". The UI designer owns the brand, the tokens and the pixels. This folder says what the product has to *do* and *feel like* so the brand has something real to express. It was written with the `premium-craft` and `ui-ux-guide` skills; every rule here traces to one of them, to the BRD, or to a client decision.

| File | What it gives the UI designer |
|---|---|
| **README.md** (this file) | The strategy: the promise, five principles, the five Bench signatures, the rubric (v0.2 as-is → v0.3 target), recommendations for the client, the hand-off order |
| [state-matrix.md](state-matrix.md) | 13 core screens × 10 states, every cell specified with exact copy, plus 10 shared patterns ("one pattern per situation") |
| [worst-moments.md](worst-moments.md) | 10 required worst moments (plus 4 edge cases), each with what you see, the cause, what's safe, one next step and the "they caught me" detail |
| [intelligence-layer.md](intelligence-layer.md) | How Bench visibly learns the client: deposits, where learning shows on each screen, the exit question, export |
| [moments-and-motion.md](moments-and-motion.md) | The spatial model, the avatar eye grammar, motion tokens, and 2–3 signature moments per flow as storyboards |
| [coherence-audit.md](coherence-audit.md) | The "use it for an hour" walk of v0.2: 38 findings, `screen — rule — problem — fix`, most severe first |

---

## 1. Why v0.2 feels "normal"

v0.2 is a well-made, Apple-flavoured chat app. That's the problem: it's now the **commodity ceiling**, the level any team reaches with AI tooling in a day (premium-craft, source video 2). The evidence:

1. **Identity lives in one place only, the avatars.** Take them out and the screens could belong to any assistant app: a sidebar of chats, a composer and grey bubbles.
2. **The glass box is written down but isn't designed.** Costs, traces and grants are there as text (`09:04 · 1.8k tokens · 0.06 % of week · Trace`), and they're good. But they're styled like footnotes, not shown as the product's core promise. Grok Bot's black box is a weakness; Bench never turns its transparency into something you can see and feel.
3. **The learning is invisible.** One system line ("Memory updated · Lesson: prefer the date library already in the repo") is the only sign that the team gets to know you. Session 100 looks exactly like session 1.
4. **The worst moments aren't designed.** The usage limit, offline, an expired login, a revoked connector and a failed write are absent (DIRECTION checklist item 10 is ⚠). Premium is judged most in exactly these moments.
5. **It doesn't hold together over an hour.** There are three corner languages side by side, two approval cards for one request, two ticket patterns, two cost formats, and nine places that break a decided rule ([coherence-audit.md](coherence-audit.md)). Each one is small. Together they're why it "feels normal".

## 2. The core emotional promise

> **Calm command over a team that knows you.**
> You open Bench and feel *relief*: the work is moving, and exactly one thing needs you. You watch skilled people work behind glass. Nothing happens behind your back, nothing is forgotten, and every month they need you a little less.

| | Grok Bot (direct competitor) | Claude Code (what the client uses daily) | **Bench** |
|---|---|---|---|
| Feels like | Magic: hand it off and hope | Power: a raw, precise instrument | **Warm glass: a studio you can see into** |
| Price of that feeling | Anxiety: surprise bills, memory you can't see | Cold and lonely: you are the router | (none: the warmth comes from the cast, the trust from the glass) |
| Remembers you | Hidden, not editable | Per repo, manual | Visibly, with provenance, as Markdown you own |

The emotion to design for is **calm control**, not excitement. The excitement belongs to a few pinned moments (an agent's birth, the all-green finish). Everything else should feel like a quiet, well-run room.

## 3. Five experience principles

Each principle is a rule to design by, with the place it shows up and the trap it prevents.

**P1. Quiet until it's you.** At rest the screen is calm: Frost, Carbon, the cast, and nothing shouting. Attention is a budget. **Amber** only means *needs you*. **Motion** only means *working*. **Blue** only means *your call*.
- *Shows up as:* Home at rest has one open ticket and one blue button (D-UI7); working agents breathe and everything else is still; banners appear only for the guard, the limit, offline and login.
- *Prevents:* the "dashboard anxiety" of busy multi-agent tools, where everything blinks and nothing is heard.

**P2. Every action leaves a receipt.** Before the click, show the consequence ("Merge PR #41 · 6 files · notifies Karim and Noor"). After it, show the receipt: what happened, what it cost, and how to take it back. The three evidence questions (*what just happened? can I take it back? what next?*) are answered on every step of every core flow.
- *Shows up as:* the **Receipt** component (§4), Undo on every reversible toast, "can't be undone" said plainly where it can't, estimates on Run, Create and Save routine.
- *Prevents:* the founder's line from the source video: *expected anything, got nothing*.

**P3. One object, one shape, everywhere.** A ticket is the same ticket on Home, in the agent's workspace, on the board and in a split pane. An agent is always *avatar + name + status word*. An approval is one card in one fact, wherever you meet it. Things travel between places; they don't get redrawn.
- *Shows up as:* one Ticket, one ApprovalCard, one Receipt, one status vocabulary, one corner family; shared-element transitions (moments-and-motion.md §1).
- *Prevents:* the 80-screens-drift problem AI-built UIs have.

**P4. The team gets to know you, out loud.** Every approval, denial, edit and redirect quietly teaches the team, and the learning is **visible where it's applied** ("Applied: your PR style · learned 14 Oct"). It's automatic (no "save preference" chores), editable, forgettable, and exportable as plain Markdown. You stay because the team knows you, not because leaving is hard.
- *Shows up as:* the **Ledger** (§4), "Together since" on every agent, the weekly "Your team learned" strip, "Applied" chips in replies.
- *Prevents:* "every session starts at zero", and also dark lock-in.

**P5. Failure is a handover, not a crash.** When something breaks, someone on the team tells you in plain words: what happened, what is safe, and the one thing to do next. The avatar shows concern, not alarm. No red walls, no stack traces first, no dead ends. Where it can, Bench fixes the problem itself and says so.
- *Shows up as:* the 10 shared recovery patterns (state-matrix.md §1) and the worst-moment designs, each with a "they caught me" detail.
- *Prevents:* the cheapest way to lose trust; it's also the cheapest place to *buy* a premium feeling (the service-recovery paradox).

## 4. The five Bench signatures (what makes it unmistakably Bench)

These are UX behaviours with fixed rules. The UI designer brands them: they are the design system's hero components, and the brand should grow out of them rather than be painted on top.

| Signature | What it is | Rules (UX-fixed) | Where it appears |
|---|---|---|---|
| **1. The Cast** | The agents: non-human shapes, eyes only, hue × shape (decided) | **The eyes are the status language.** Each of the 8 statuses has an eye behaviour (moments-and-motion.md §3) as well as the badge and the word. Eyes may *glance* toward where you should act (a waiting agent looks toward its ticket's primary button). Eyes never replace the word (WCAG 1.4.1) | Everywhere an agent appears; the hero on the agent's page; birth in New agent |
| **2. The Receipt** | Bench's glass box made into one object: a single meta line under every agent action | One format everywhere: `time · tokens · % of your week · Trace`, tabular figures, monospace numbers, Ash. Grows to `· files touched` and `· used: 2 notes` when relevant. Click → the trace step. **Never a box, never a chip**: a line, like a lab notebook | Messages, system lines, routine runs, tickets (estimates), the header ("This run …"), toasts |
| **3. The Ticket** | The unit of "something needs you" | One component, three sizes (open · rest · small), 18 px continuous corners, on canvas. Tag grammar: **Kind** (grey: Work request, Meeting, Proposal) · **Gate** (outline + lock: Outward, Reserved, Payment) · **State** (filled: Blocked, Waiting for you, Error). Open shows evidence + the consequence + one blue | Home, What needs you, the project's "Needs you" strip, split panes, the agent workspace (as the ApprovalCard variant) |
| **4. The Room** | Each agent's chat is its room: a faint wash in its hue (D-UI3), its hero, its workspace | Going from one agent to another = **changing rooms**: the wash crossfades, the header avatar morphs from the sidebar row (shared element), and the composer placeholder names who you're talking to. Group rooms are neutral (no tint) | Agent page, team chat, the take-over |
| **5. The Ledger** | The team's growing knowledge of you, as a visible, countable, exportable thing | Every agent shows "Together since 14 Oct · 312 runs · 46 notes · 12 lessons". The team shows "Your team knows 214 things about how you work". Every applied lesson shows its source. One-click Markdown export | Agent header and Settings › Memory, the Home strip, in-reply chips, the Memory browser, New agent ("Lumen starts knowing 18 things about you") |

**One more rule ties them together: blue means *your call*.** The single blue action on a screen is always a decision only the client can make: Allow, Decide, Send (an email), Merge, Create. Chat Send is conversation, not a decision, so it's a Carbon control. This turns the decided "one blue per screen" into something you can *feel*: when you see blue, it's your move. (Recommendation R1, §7.)

## 5. Spatial model (summary)

The app is a **studio with a fixed floor plan**, so muscle memory transfers everywhere. Full spec: [moments-and-motion.md §1](moments-and-motion.md).

```
          TOP: time and budget (breadcrumb · the week ring · Needs you)
LEFT              CENTRE                          RIGHT
who and where     the room: the conversation      the glass: what they're doing
(sidebar: cast,   (one agent, a team, or Home's   (workspace: screen · routines ·
 projects)         tickets)                        settings; the diff; the browser)
          BOTTOM: your voice (the composer)
```
Panels slide in from where they live and leave the same way. Tickets expand in place. The take-over grows out of the workspace card. A handoff chip travels from the sender to the receiver. Dialogs rise from the centre as sheets.

## 6. Premium-craft rubric: v0.2 as-is → v0.3 target

v0.2 was scored from the source of `direction.html` and the renders in `prototype/screens/`. Five of those renders still show v0.1 (`agent-1440`, `team-1440`, `tokens-1440`, `agent-takeover-1440`, `new-agent-1440`: they have the old boxed top bar and "Needs me"), so the v0.2 team chat and agent header were read from source. Per the skill, **any axis below Senior blocks hand-off**: v0.2 is blocked on seven axes, which is expected for a direction sample.

| Axis | v0.2 as-is | Evidence (v0.2) | v0.3 target | What gets it there |
|---|---|---|---|---|
| **Copy** | **Mid** | Second person applied well (U8). Vague primaries ("Decide on QA-3", "Review email", "Review merge"); three cost formats; "is approved" for a manual create; "Open in a new window" after D-UI9 | **Staff** | Copy that answers the next question (state-matrix.md); consequences on buttons; one receipt format; warm framing at limits ("your week resets Mon 09:00", not "limit exceeded") |
| **Visuals** | **Mid** | The cast is custom and strong, but patterns aren't reused (two ticket designs, two approval cards); boxed chips in the header after U7 de-boxed the top bar | **Staff** | The five signatures as hero components; the eyes as status language; the receipt and ticket used everywhere |
| **Color** | **Senior** | 60-30-10 holds, hue only for identity, amber/green/red with words. Blue dilutes once (team chat Send) | **Staff** | Blue = your call (R1); hue carries identity *and* the room; nothing decorative |
| **Type** | **Mid** | Home uses 6 sizes (40/21/17/15/14/12), the agent page 6 (21/17/15/14/13/12 + a 10 px handoff label); 4 weights (300/400/500/600) | **Senior** | ≤ 4 sizes and 2 weights (400/600) per content view; tabular figures in every receipt, counter and timer |
| **Structure** | **Mid** | Generous and grouped, but off-grid values (9, 10, 14 px paddings) and three radius languages side by side (18 tickets beside 8 cards; 6, 2 and 1 px elsewhere) | **Senior** | 4-pt spacing by relationship; one concentric corner family (R3); the hierarchy test written per screen (state-matrix.md cards) |
| **States and recovery** | **Mid** | Loading and empty states exist for Home and routines; usage limit, offline, login expired, connector revoked, failed write and checkpoint aren't designed | **Staff** | The full matrix (state-matrix.md) and every worst moment with a "they caught me" detail (worst-moments.md) |
| **Motion and emotion** | **Mid** | Purposeful transitions, reduced-motion safe, a handoff chip and a ticket expand. Bézier eases, not springs; no pinned moments per flow; the eyes barely act | **Staff** | Springs; the eye grammar; 2–3 storyboarded moments per flow (moments-and-motion.md) |
| **Coherence** | **Mid** | 9 decided-rule breaks and 14 two-patterns-for-one-situation findings (coherence-audit.md) | **Senior** | All S1 and S2 findings fixed; one pattern per situation documented in the design system |
| **Intelligence** | **Mid** (data is stored and once announced) | One "Memory updated · Lesson" line; nothing applied visibly; no growth shown | **Staff** | The Ledger; "Applied" chips with provenance; the weekly strip; compounding metrics; one-click export (intelligence-layer.md) |

**Hierarchy test, Home v0.3** (to prove the target): read first, *the open ticket's title* ("QA-3 is blocked"); second, *its blue button* ("Use nightly E2E"); third, *the greeting line* ("Seven things need you"). Then the projects. If the UI can't make that order visible without extra chrome, Type and Structure aren't at Senior yet.

## 7. Recommendations that need a client decision

These touch decided rules or trade one goal against another, so they're for the client, not for UX or UI to settle.

| # | Recommendation | Why it helps premium | What it changes | UX default until decided |
|---|---|---|---|---|
| **R1** | **Blue means "your call".** The one blue action per screen is always a decision only you make; chat Send becomes a Carbon control | Makes blue *meaningful*, a signature you feel. Today team chat's blue Send competes with "Join" | Refines "one blue action per screen" (it stays one per screen) | Apply it |
| **R2** | **One inbox.** The sidebar "Approvals (3)" folds into **What needs you** as a filter (All · Decide · Meet · For your info · Decided by Atlas). Same tickets, one count | Today there are three entry points and two counts for one list (top bar 8, Approvals 3, Home 8) | IA from UX v0.4 (the approval inbox becomes a filter, not a page) | Keep both, with the counts aligned (audit C-08) |
| **R3** | **One corner family:** 18 px continuous corners for every object on the canvas (tickets, project cards, dialogs, bubbles, cards in panes), 10 px for things inside them, pills for controls | Apple's own product tiles use about 18 px; the mix of 8 and 18 side by side on Home reads as two products | Bends DIRECTION rule 1 ("8 px cards") | Apply in v0.3 |
| **R4** | **Lowercase agent voice keeps real names and code as they are:** "1 reply to Dana drafted in your voice", "PR #41", "QA-3", "Windows" | "dana" and "windows ci" read as typos, which costs more premium than the casual voice gains | Refines the decided lowercase voice | The copy in this folder follows R4 |
| **R5** | **"Needs you" counts only what needs you** (Decide + Meet). For your info is shown separately, not counted | Today the debate FYI makes the count 8, not 7. A count that lies once is never trusted again | Count semantics on the top bar, Home, sidebar and project cards | Apply |
| **R6** | **Learning is automatic, and Atlas approves preference notes about you by default** (they're global-memory writes; the BRD allows "you or the main agent"). Each one shows on Home with Undo and Forget | No chores, no nagging, and the learning is still visible | How global-memory proposals about the client are approved | Atlas approves, you see each one in the weekly strip |
| **R7** | **Suggest a standing grant after you allow the same thing 3 times** ("You've allowed `pnpm test` in bench 3 times. Always allow it?"). Never for outward or reserved actions | Fewer approvals over time (compounding), with your consent each time | Adds a suggestion, not a behaviour: nothing is granted without your click | Off until decided |
| **R8** | **Type:** drop the weight-300 subheads and the 17 px step; ≤ 4 sizes and 2 weights per content view | Clearer hierarchy, more "designed" | Bends the Apple "weight 300 subheads" reference; D-UI1 (15 px body) is kept | Apply in v0.3 |
| **R9** | **Hue × shape pairs are unique on one screen**, not only within one project (split view shows Omar's teal hexagon beside Yusuf's aqua hexagon) | The cast stays legible as a cast | Refines D-UI8 | Flag clashes; don't change the art yet |
| **R10** | **First-run targets:** the first reply from Atlas in under 3 minutes (UX Q9), and the **first useful finished task in under 5 minutes** | Makes the onboarding peak measurable | Adds a second target | Both |
| **R11** | **When the usage limit pauses a sprint, the sprint end date doesn't move on its own;** the lead proposes a new end date when work resumes | Honest, with no silent rescheduling | The BRD is silent on this `[ASSUMPTION]` | As written |

Constraints for the tech lead (decisions for the client if they conflict) are listed where they apply: worst-moments.md §3 (login detection without reading credentials, auto-resume), intelligence-layer.md §7 (compounding metrics), moments-and-motion.md §6 (springs in Electron, CPU budget for breathing avatars, C-F).

## 8. Hand-off to the UI designer (in order)

1. **Fix the S1 coherence findings first** (coherence-audit.md C-01 to C-09). They break decisions the client already made.
2. **Build the five signatures as design-system components** with every state: Cast (the 8 eye states plus badge plus word), Receipt, Ticket (3 sizes × tag grammar), Room (wash and transition), Ledger (counts, chips, strip). Then ApprovalCard, Banner (the 10 shared patterns) and Toast-with-Undo.
3. **Tokens:** a concentric radius family (R3), 4-pt spacing by relationship, ≤ 4 type sizes per view (R8), spring motion tokens (moments-and-motion.md §5), tabular numerals.
4. **Hi-fi v0.3 routes:** the existing ones plus one route per worst moment (worst-moments.md lists each route name) and per state-matrix cell marked **[route]**.
5. **The signature moments** in moments-and-motion.md, at most 3 per flow, each with its reduced-motion version.
6. **Render every route at 1440×900 and 1280×800** (headless Edge, the command is in the 2026-10-22 checkpoint) and *look at the PNGs*. Replace the five stale v0.1 renders. Score the rubric again; any axis below Senior blocks G5.

**Not yours to change without the client:** Apple base, light first, one blue per screen, hue × shape with eyes, 15 px body, D-UI1–11, CR-006 (routines may do anything the agent can; outward and reserved actions still wait for the client), the second-person voice, lowercase agent voice. Where this spec bends one, it's listed in §7.

## 9. Sources

- Client: [ui-feedback-1](../../../requirements/interviews/2026-10-22-ui-feedback-1.md) (U1–U8), [ui-feedback-2](../../../requirements/interviews/2026-10-22-ui-feedback-2.md) (D-UI7–11, the brand requirement), [decisions-2](../../../requirements/interviews/2026-10-22-decisions-2.md), [ux-audit-decisions](../../../requirements/interviews/2026-10-22-ux-audit-decisions.md) (D1–D6), [CR-001](../../../requirements/change-requests/CR-001.md), [CR-004](../../../requirements/change-requests/CR-004.md), [CR-006](../../../requirements/change-requests/CR-006.md).
- Product: [BRD](../../../requirements/BRD.md) (UC-18–21, UC-23, UC-27, UC-38, UC-40–42, UC-47, BR-66), [PRODUCT-MODEL](../../../PRODUCT-MODEL.md), [competitive brief](../../../research/competitive-brief.md), [Grok Bot teardown](../../../research/teardowns/grok-bot-ui-video.md).
- Design: [DIRECTION.md v0.2](../../ui/DIRECTION.md), [direction.html](../../ui/prototype/direction.html), [UX package v0.4](../README.md), [guide-audit](../guide-audit.md).
- Skills: `premium-craft` (SKILL.md and references: states-and-recovery, intelligence-layer, emotion-and-motion, craft-checklist, sources: the client's eight design videos, paraphrased) and `ui-ux-guide`. Heuristics: Nielsen #1 (visibility of system status), #3 (user control), #4 (consistency), #9 (help users recover); Krug ("don't make me think"; navigation shows where you are).
- **Findings vs insights:** findings are what the sources show (cited inline in each file); insights are the design consequences, marked as rules or recommendations.
