# Short-video scripts (week 1)

> **Rendered (2026-10-26).** The final cuts are in [`marketing/ready/media/videos`](../ready/INDEX.md#media), built from [`marketing/shorts`](../shorts). Where a shot list below names a face that differs from the one the captured screen shows (panels open while sessions work show **Focused**, not Calm), the rendered video follows the screen: the screen is the source of truth for the eye grammar.

Six short videos, each built from **real screens of the approved notch prototype** (`docs/design/ui/companion/prototype/notch.html`), step by step, with every Euca titled on screen. Drafts only: the founder records and posts.

## Before you record

- **Be honest about what it is.** Eucas isn't built yet. Every video carries a small, fixed corner label for its whole length: **"Design preview · Eucas is in development"**. Without it, the first "where's the download?" comment turns into "vaporware" (see PLAN.md, Risks).
- **The old 51 s showcase in `marketing/showcase/` is the pre-pivot team app** (Atlas, Maya, Noor, a bakery site). Don't post it for the companion: it shows a different product. Its Remotion setup can be reused for these cuts.
- **Record:** open `notch.html?r=<state>&bar=0` in Edge at 1920×1080, record with OBS (free) or the Xbox Game Bar (`Win + Alt + R`). Move from state to state with the **States** menu with `bar=1` while recording, or cut between `?r=` captures in Remotion. `?theme=light` for the light versions; dark is the default.
- **Vertical (Shorts, TikTok, Reels):** 1080×1920. The notch lives at the top centre, so crop a 1080-wide column around it and put the caption under it, in the lower third. Keep text out of the bottom 320 px (platform buttons cover it).
- **Project names:** the prototype's sample project is `bench`, our old codename. Record with the sample renamed to **web-app**, the way `apps/landing/scripts/capture-screens.mjs` does for the website (DESIGN.md §13.2).
- **Euca titles:** the first time Pip appears, a label slides in under the notch: **"Pip · your Euca"**. In the setup video, the moment you name it gets its own title: **"You name your Euca"**.
- **Sound:** no voice needed. Soft keyboard and the notch sound (BRAND §11), or a Pixabay track (licence: no redistribution of the file). Captions burned in, because most people watch muted.
- **Words:** second person, calm, numbers first. Never "never deletes", "100% safe", "AI-powered", "magic", "supercharge". The safety line is always the fixed promise: *"Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that."*
- **End card (every video, 2 s):** the Quartet mark, `eucas`, **eucas.app**, "Windows · in development · join the waitlist". Put the UTM link from PLAN.md §8 in the description or first comment, never inside the video.

Route names below are the `?r=` values from `prototype/capture.mjs`. The **Pip** column is the face for that shot, from the eight in [PLAN §3](../PLAN.md#3-pips-faces): never another one. Only Focused loops; Pleased plays once for 1.6 s.

---

## V1 · "Four things always come to you" (30 s) · the hero cut

**Hook (0–2 s, on screen):** "1,240 files deleted in 20 seconds. Then it stopped."  (the numbers on the `p-trip` screen)

| # | Time | Screen (`?r=`) | Title / caption | Action | Pip |
|---|---|---|---|---|---|
| 1 | 0–2 s | `n-trip` | Hook text | The notch shows "Stopped: notes" | Concerned |
| 2 | 2–5 s | `n-working` | "Rewind. Three sessions, one notch." · **"Pip · your Euca"** slides in | Pointer rests on the notch | Focused |
| 3 | 5–9 s | `n-peek` | "A session is waiting for you." | Hover: the peek opens | Glance → Toward you |
| 4 | 9–14 s | `p-needs` | "A delete always comes to you. So does a push to your default branch, a send and a payment." | Click: the panel | Toward you |
| 5 | 14–20 s | `n-trip` → `p-trip` | "If a session starts deleting files in bulk, it's stopped." | The tripwire marker, then the Tripwire stop page | Concerned |
| 6 | 20–25 s | `p-trip` (zoom on the list) | "You see what went, and how to get it back." | Slow zoom | Concerned |
| 7 | 25–28 s | `p-rules` | "No rule can switch these four off." | The locked rows | Calm |
| 8 | 28–30 s | End card | eucas.app | — | Calm |

**Caption for the post:** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. Design preview; Windows first. Waitlist: <link>"

## V2 · "Stop saying yes to the same command" (25 s)

**Hook:** "You approved `pnpm test` 212 times this week."  (the number on the `p-retro` screen)

| # | Time | Screen | Title / caption | Action | Pip |
|---|---|---|---|---|---|
| 1 | 0–3 s | `p-retro` | Hook | The 7-day retro: your most approved commands | Calm |
| 2 | 3–8 s | `p-suggest` | "Pip suggests a rule from what you approve by hand." | Pointer on the suggestion | Calm |
| 3 | 8–14 s | `p-rules-draft` | "Or say it in plain words. Pip writes the rule." | Typing: "let the tests run in web-app" | Calm |
| 4 | 14–19 s | `p-rules` | "Scoped to one folder. Deletes, pushes, sends and payments still ask you." | The rule list | Calm |
| 5 | 19–23 s | `p-learned` → `p-undo` | "Changed your mind? Undo." | Click Undo | Calm |
| 6 | 23–25 s | End card | | | Calm |

## V3 · "What leaves your PC, word for word" (20 s)

**Hook:** "An AI supervisor on your sessions. So what does it see?"

| # | Time | Screen | Title / caption | Action | Pip |
|---|---|---|---|---|---|
| 1 | 0–3 s | `s-sent` | Hook | Setup step 8 | Calm |
| 2 | 3–10 s | `s-sent-sample` | "When Eucas isn't sure, it sends the waiting session's last message, trimmed, with code, paths and secrets removed." | Zoom on the sample | Calm |
| 3 | 10–15 s | `p-sent` | "Nothing else about your work leaves this PC. Settings always shows you this." | The panel version | Calm |
| 4 | 15–18 s | `p-account` | "Your account holds your email, your plan and how much help you've used." | | Calm |
| 5 | 18–20 s | End card | | | Calm |

## V4 · "Set up in a minute" (55 s) · the step-by-step cut for YouTube

**Hook:** "From install to guarded, step by step."

| # | Screen | Title | Pip |
|---|---|---|---|
| 1 | `s-welcome` | **Step 1 · Your sessions** | Closed |
| 2 | `s-create` → `s-create-born` | **Step 2 · You name your Euca** ("Pip · your Euca" appears as it's born) | Closed → Calm |
| 3 | `s-retro` | **Step 3 · Your last 7 days**: tokens, risky commands, clashes | Calm |
| 4 | `s-lock` → `s-uac` | **Step 4 · Lock the four limits** (one Windows prompt; "Unknown publisher" is expected on v0.1) | Calm |
| 5 | `s-test` | **Step 5 · Pip tests the guard** in front of you | Calm |
| 6 | `s-signin` → `s-signin-code` | **Step 6 · Sign in with a 6-digit code** | Calm |
| 7 | `s-rules` | **Step 7 · Your first rules** | Calm |
| 8 | `s-sent-sample` | **Step 8 · What is sent** | Calm |
| 9 | `s-done` → `n-working` | **Step 9 · Pip is watching** | Calm → Focused |
| 10 | End card | | Calm |

About 5 s per step. Long form (YouTube, 3–4 min): the same steps with a voice-over that reads the screen and says why each step exists.

## V5 · "Two agents, one file" (15 s)

**Hook:** "Two sessions are about to edit `src/router.ts`."

| # | Time | Screen | Caption | Pip |
|---|---|---|---|---|
| 1 | 0–4 s | `n-working` | Hook | Focused |
| 2 | 4–7 s | `n-peek` | "Pip · your Euca" title | Glance → Toward you |
| 3 | 7–13 s | `p-same` | "You're warned before one overwrites the other." | Toward you |
| 4 | 13–15 s | End card | | Calm |

## V6 · "Your limit, before the task is half done" (15 s)

**Hook:** "Hit your limit with the refactor half done?"

| # | Time | Screen | Caption | Pip |
|---|---|---|---|---|
| 1 | 0–4 s | `p-usage` | Hook | Calm |
| 2 | 4–10 s | `sheet-meter` | "You see when you'll run out, with time to spare." | Calm |
| 3 | 10–13 s | `p-budget` | "Pro: a budget stops a session before its next step." | Concerned |
| 4 | 13–15 s | End card | | Calm |

---

## Where each one goes

| Video | X | LinkedIn | YouTube Shorts | TikTok / Reels | Reddit | Product Hunt |
|---|---|---|---|---|---|---|
| V1 | Pinned + launch thread | Week 1 post | Yes | Yes | r/ClaudeAI showcase (as a GIF or native video) | Gallery slot 1 |
| V2 | Thread reply | — | Yes | Yes | r/ClaudeCode | Gallery slot 2 |
| V3 | Reply under privacy questions | Yes | Yes | — | Answer to "what does it send?" | Gallery slot 3 |
| V4 | — | — | Long form + Short | — | — | The PH video |
| V5, V6 | Day 3–5 posts | — | Yes | Yes | — | — |
