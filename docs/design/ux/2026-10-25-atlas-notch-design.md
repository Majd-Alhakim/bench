# The Atlas notch: design

| Status | Date | Owner | Approver | Origin |
|---|---|---|---|---|
| **Approved** by the client 2026-10-25; in v0.1 via [CR-009](../../requirements/change-requests/CR-009.md) (option A) | 2026-10-25 | PM (Claude) | Client | Brainstorm with the client, 25 Oct 2026; reference: [Nusa](https://rama2555.github.io/nusa/) |

Mockups from the session (throwaway sketches, not the final look): `.superpowers/brainstorm/528-1792946181/content/` (`notch-moments`, `notch-resting-v2`, `notch-quick-talk`, `notch-needs-you-v2`).

**In the first version.** Approved into v0.1 through [CR-009](../../requirements/change-requests/CR-009.md), option A: epic E16, stories N0–N10 in Sprints 3–5, with a check on N8/N9 at the day-6 re-plan.

## 1. Intent: why this exists

You don't have to open Eucas to hand Atlas something, or to answer the team. A small notch at the top of the screen holds Atlas's eyes. You give it things in a few seconds and go back to what you were doing; the team comes to you there, without interrupting you.

The client's own moments (25 Oct):

1. **Catch an idea.** "When I got an idea I wanted to save it somewhere to come back to later." With Eucas, Atlas doesn't just save it: it plans it and prepares questions, so a **ready proposal** is waiting the next time you open the app (this is UC-12, *Turn an idea into a proposal*, started from the notch).
2. **Drop in something you found.** While browsing you find a skill, a UI, an image, anything you could use in what you're building. You drop it on Atlas. Atlas gets the other Eucas working with it, and they make **a sample for you to test**.
3. **Answer what needs you.** While the team works in the background, you see what needs you (BR-86, UC-25) and answer quick things from the notch instead of opening the app.

## 2. Goals, non-goals, anti-goals

**Goals**
- Handing something to Atlas takes a few seconds from anywhere on the desktop: type, talk, attach or drag.
- Talking needs no window at all: one shortcut, and the notch stays small while you speak.
- You can tell at a glance whether the team is working and whether anything needs you.
- Quick answers (approve, pick, one-line reply) happen in the notch.

**Non-goals**
- The notch is not a chat. Conversations, proposals and reviews happen in the app; the notch hands off and opens the app.
- Not a general notch utility (music, timers, battery, etc. like Nusa). Only Atlas and the team.
- No phone, no OS notification centre integration in this version (phone notifications come after v0.1, GR2-Q3).

**Anti-goals: it fails if…**
- **…it opens or pops down by itself.** The client was explicit: something arriving gets a small animation and a marker that stays; *you* hover to see it. It never takes focus or covers what you're doing.
- …anything is sent to Atlas without you confirming it (voice especially: you always see the words first).
- …your voice leaves the computer (dictation is local, as built in the prototype).
- …it gets in the way of full-screen apps, games or presentations.

## 3. What it looks like and how it behaves

### 3.1 Resting
- A small black notch at the top centre of the screen, with Atlas's eyes (Atlas's shape language: white rounded-pill eyes).
- The eyes follow the pointer and doze when you've been away, like the pinned Eucas in the sidebar (same behaviour family).
- **Activity is shown with the same voice glow as the composer** (client: "similar to the glow that we are using in the prompt bar"), along the notch's bottom edge:
  - nothing running → no glow, just the eyes;
  - the team is working → the glow gathers into a beam that sweeps under the eyes (the composer's "thinking" beam);
  - listening to you → the glow rises and blooms with your voice.

### 3.2 The prompt bar (click)
- Clicking the notch opens it into a bar with Atlas's face: a text field, **+** to attach files, a mic, and send.
- You can drag a link, image or file from anywhere (browser, Explorer) onto the notch, closed or open; it opens the bar with the item attached.
- *(My call, from the mockup; the client didn't object)* Three choices under the field for what Atlas should do: **Save as an idea** (UC-12: plan it, prepare questions, proposal waiting in the app), **Try it in a project** (the team makes a sample to test), **Just ask**.
- Send closes the bar. A small "done" chime confirms it landed.
- *(My call)* **Try it in a project:** Atlas picks the existing project the thing fits and briefs that team; the sample is a branch in that project's worktree, owned by the Euca Atlas hands it to, and it comes back as *Ready to test*. If it fits no project, Atlas doesn't create one (creating a project is yours, G2-Q1): it turns it into a proposal for a new project, as with an idea. No project picker in the notch.
- *(My call)* **Just ask:** Atlas's answer goes into Atlas's chat in the app, and the notch shows a small "Atlas replied" marker (Atlas's eyes do a little nod). Hovering shows the reply in a line or two, with "Open in Eucas" for more. This is a reply you asked for, not one of the five kinds of asks, so it adds no new kind of interruption: no bounce, no sound.

### 3.3 Quick talk (the shortcut)
One global shortcut, two ways to use it (client-confirmed):
- **Hold** it for a short note: talk while holding, let go to finish.
- **Tap** it for a longer talk: it listens hands-free; tap the same shortcut again to stop.

While you talk, the notch does **not** open and does not take focus: just the eyes and the voice glow. When you finish, the prompt bar drops down with your words in the field, so you can fix a misheard word, add a file, then **Send to Atlas** (Enter) or cancel (Esc). Nothing is sent without that confirmation.

Sounds (client asked for them; the specific tones are my call, from the same family as the prototype's `recStart`/`recStop`):
- press (hold or tap) → the rising "listening" tone;
- tap → a second soft tick about 0.5 s later, meaning "locked on, you can let go";
- stop (release, second tap, or the safety stop) → the falling "stopped" tone;
- sent → the small "done" chime.
All follow the Sound setting. BR-89 currently allows three sounds; CR-009 amends it for these.

When the confirm bar drops down it takes keyboard focus, so Enter and Esc work: you started the take, so this isn't the notch grabbing focus by itself. While you're only talking, it never takes focus.

*(My calls)* A press longer than ~0.5 s counts as a hold, so a tap is never mistaken for one. Hands-free listening has a safety stop after ~2 minutes of silence, so it can't record forever by accident.

### 3.4 Something needs you
The client's rule: **it never opens by itself.**
1. **Arrives:** the face of whoever is asking drops into the corner of the notch with a small bounce, Atlas's eyes glance at it, and the notch gives one small nudge. Then everything is still.
2. **Waits:** that face and a count stay in the notch until it's dealt with.
3. **You hover:** the notch opens with the ask: who, which project, one line, and quick buttons, plus "N more ›". Moving away folds it back up; the marker stays until answered.
Anything bigger than a quick answer gets "Open in Eucas".

*(My call, from the anti-goals and BR-58)* **What can be answered in the notch.** Of the five kinds (BR-86):
- **Questions** and **undecided decisions**: answered in the notch (pick an option, or Reply… with a line of text).
- **Ready to test**: "Not yet" and "Open in Eucas" only; accepting work means trying it, which happens in the app.
- **Destructive actions** and **payments**: never in the notch. The ask shows what it is and a single **Open in Eucas**; you approve in the app with the full context. A hover popup must never be one stray click away from a delete or a payment.
- "Not yet" is available on every kind and only defers it.
(The mockup's "Merge?" was a bad example: merges after CI are automatic and logged, CR-007, so they never appear as asks.)

*(My calls)* The existing soft "needs you" sound plays once on arrival, but not during full-screen apps or calls (the animation still plays). With several waiting, the newest asker's face shows with the count. When asks are waiting, hovering shows them; with nothing waiting, hover does nothing. A click always opens the prompt bar.

## 4. Constraints

- **Windows first** (then macOS/Linux). Windows laptops have no hardware notch: this is a floating, always-on-top shape at the top centre of the display.
- **Part of the Eucas app** *(my call, stated to the client)*: an extra always-on-top window of the same Electron app, not a separate program. The agents only run while Eucas runs (it lives in the tray, BR-76), and this reuses Atlas, the voice glow and local dictation. Trade-off: heavier than a native notch like Nusa (~30 MB), accepted.
- **Never block the desktop:** outside the notch's visible shape, clicks pass through to whatever is underneath.
- **Steps aside for full-screen apps** (games, presentations, video).
- **Local voice:** dictation uses the local engines from the prototype (Moonshine for English, Whisper for other languages; see BACKLOG "Voice input with local Whisper"). The model files ship with the app or download into the Bench home on first use; nothing streams to a CDN at runtime.
- **Dropped things are untrusted data.** A dragged page, image or file is content for Atlas to work with, never instructions to follow (security baseline; prompt injection).
- **Dropped skills: review first, then try freely** *(client, 25 Oct: "it would read what I send; if there is something suspicious it will inform me")*. Before anything runs, Atlas reads the skill as a security reviewer would: its scripts and commands, network calls, access to files or credentials outside its job, and any text that tries to instruct agents.
  - **Nothing suspicious:** a Euca may install and run it **inside the test sample only** (the project's worktree for that sample), without asking. It joins a real agent's permanent skills only when you accept the sample (*Ready to test*).
  - **Anything suspicious:** nothing runs. It becomes a question for you (one of the five kinds) that says exactly what looked wrong and where, with "Try it anyway" and "Drop it".
  - The review and its verdict appear in the trace.
- **Agents draft, never send; never delete** (CR-008). "Try it in a project" produces a sample to test; nothing is merged or published until you accept it (BR-86 kind 5, *Ready to test*).
- **Only the five kinds of things that need you** (BR-86) appear as asks in the notch; everything else stays in the app and the digest.
- **Visible in the trace:** every hand-off from the notch (idea, drop, quick answer) emits a trace event, like every feature.
- **Calm UI:** the notch earns its place by being quiet. No badges or text beyond what's described here.

## 5. Decided by the client
- The three jobs (§1) and that the playback was right.
- The resting notch uses the composer's voice glow for activity.
- Quick talk: one shortcut; hold = short note, tap = hands-free until tapped again; the notch stays small while listening and opens with the words to confirm.
- Sounds for quick talk.
- Asks never open the notch by themselves: animation + a marker that stays; hover to see.
- It's in the first version.
- Dropped skills: Atlas reviews them first; if nothing is suspicious they may be tried in the sample, otherwise Atlas tells you what it found (§4).

## 6. My calls (the client can overturn any of them)
- Part of the Eucas Electron app rather than a separate native program.
- The three intent chips (Save as an idea / Try it in a project / Just ask).
- The exact tones, the 0.5 s hold threshold, the 2-minute silence stop.
- The "needs you" sound rule (once, muted in full-screen and calls); newest face + count.
- Hover shows asks only when there are asks; click always opens the prompt bar.
- What can be answered in the notch per kind of ask; destructive actions and payments always go to the app (§3.4).
- "Try it in a project" uses the project the thing fits, never creates one (§3.2).
- "Just ask" replies land in Atlas's chat with a quiet "Atlas replied" marker (§3.2).
- Ctrl + Space was shown in the mockup as the shortcut; see §7 for the default.

## 7. Left to the builder
- **The default shortcut.** It must be changeable in settings and must not collide with Windows, IME/language switching (Ctrl + Space toggles IMEs) or common editors. Pick a safe default and say why.
- **How to detect hold vs tap globally.** Electron's `globalShortcut` fires on press only; hold needs key-up. If that means a low-level keyboard hook, it must watch only the chosen combination and never record other keys (state this in the security baseline, as Nusa does).
- Which display the notch sits on with several monitors, and how it scales across DPI settings.
- Detecting full-screen apps and calls on Windows (in `src/main/platform/`).
- The click-through technique, and keeping the notch from stealing focus while listening.
- Where a dropped web image or link is stored (the Bench home), and how it's handed to Atlas.
- Memory/CPU budget for the extra window; it should be close to idle when nothing moves.
- Accessibility: keyboard access to the bar and the asks, screen-reader labels, reduced motion (no bounce, no sweeping beam).

## 8. Related requirements
UC-12 (idea → proposal) · UC-25 (what needs you) · UC-23 / UC-24 (resolve an approval, accept work) · UC-29 (notify the client) · BR-76 (tray) · BR-86 (the five things that need you) · BR-89 (sounds) · CR-008 (drafts, no deletes).

## 9. Next step
After the client approves this document: **CR-009** (`/change-request`) adds the notch to the first version, with the impact analysis (use cases, sprint placement, effort and risk). Then stories in the backlog. No implementation before Gate 6.

**Sequencing (answered by the standing 14-day rule: sequence, don't cut).** The notch hangs off core work (Atlas's chat, what needs you, the tray, the voice glow, local dictation), so its UI comes late. Its risky parts get **early spikes in parallel** so they can't surprise the end: (1) the global hold/tap key detection, which likely needs a native keyboard-hook dependency and so an **ADR before Gate 6**; (2) full-screen and call detection on Windows; (3) a click-through, never-focused, always-on-top window. CR-009 places these.
