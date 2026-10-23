# States and recovery

## Evidence of quality (the three questions)
At every step of a core flow, the user must be able to answer:
1. **What just happened?** System status: the run started, the message delivered, the file saved, the agent is thinking.
2. **Can I take it back?** Undo, cancel, stop, rewind, or "nothing happens until you confirm".
3. **What do I do next?** One clear next step, never a dead end.

AI-generated UIs most often skip exactly these. One founder's line from the video sums up the failure: the user expected *anything* and got *nothing*. An empty response to an action is where users are lost.

## State matrix template

| Screen | Default | Working | Empty: first use | Empty: no results | Partial | Error | Offline / Claude down | Usage limit | Denied | Success |
|---|---|---|---|---|---|---|---|---|---|---|
| … | | | | | | | | | | |

Mark each cell ✅ designed, or N/A with a reason.

## Worst-moment audit (break it on purpose)
Do each of these in the prototype, then design the result as carefully as the success screen:
- Turn the network off mid-run, and mid-send.
- Hit the weekly usage limit during a multi-agent task.
- Crash an agent run (tool error, out of memory, timeout).
- Deny an approval; revoke a connector mid-task.
- Fail a context checkpoint (an incomplete checkpoint).
- Empty every list: agents, projects, memory, routines, approvals, trace.
- Edge content: very long names, a 500-line message, 50 agents, a tiny window.
- A slow model: 10 s+ before the first token.

## Recovery pattern
Every failure state has:
- the **cause in plain words** (no codes first; codes go behind "Details")
- **what is safe**: saved, kept, not sent, rolled back
- **one primary next step** (Retry / Continue with a smaller model / Ask the lead / Open the trace), plus a secondary one
- **specifics**: counts and exact dates ("2 of 2 runs paused · resumes Mon 26 Oct 09:00"), not generic text
- **the same pattern everywhere** it applies: one limit pattern, not two different screens for the same situation

**Service-recovery paradox:** a failure handled very well can leave people as satisfied as if nothing went wrong, or more. The video cites a large review for this, and a playful precedent: the Chrome offline dinosaur turned a dead page into something people enjoyed. The worst moments are the cheapest place to buy a premium feeling, because most teams skip them.

## Coherence audit (use it for an hour)
- Walk the core flows like the client would on a real day: morning triage, a long-running task, an approval, an evening review.
- Note every spot where it "stops feeling like the same product":
  - two patterns for the same situation
  - different words for one concept
  - moved navigation
  - inconsistent radii or icon sizes
  - a different empty-state voice
- Why it matters: the video cites a study where moving the navigation from left to right more than doubled time on the page. Users still reported little slowdown, so the cost of inconsistency is under-reported.
- AI makes this worse: screens are cheap to spawn, so 80 screens drift apart. The cure is **one pattern per situation**, documented in the design system and reused.
