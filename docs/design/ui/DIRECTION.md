# UI Direction: "Apple built a Grok Bot × Dots" (draft for client review)

**Status:** Draft v0.1 (2026-10-22), PM synthesis of the client's references. Input to Phase 5 (UI). The low-fi flows (UX prototype v0.4) stay the structure; this defines the look and feel.

**Client brief (verbatim):** *"the style and feel of grok bot which I find cool and clean and how everything runs and the animations; also the style of open Ai dots is nice design also; I want ours to be mix of both and imagine that Apple have created its own one with its design system."*

References: [`references/`](references/): the Apple style guide, three Dots screenshots, the client's shape-avatar image. Grok Bot screen recording analyzed: [../../research/teardowns/grok-bot-ui-video.md](../../research/teardowns/grok-bot-ui-video.md) (agent-list sidebar, agents created by conversation, inline workspace card with Take over / I'm done, checklist results, system lines, side panel with screen + routines + settings).

## 1. What each reference contributes
| Source | Take | Leave |
|---|---|---|
| **Apple** (base system) | Frost canvas, Carbon text, **one blue for actions**, Inter/SF with negative tracking, 980px pills, 8px cards, hairlines, **no shadows**, generous whitespace, weight 300 subheads | "No illustrations": overridden for agent avatars only |
| **Dots** (screenshots) | **Character avatars as the agents' faces**; the agent's **name tag + live status line under the avatar** ("Thinking…", "Clarifying the experiment goal"); **user bubbles tinted in the agent's color**; a **split view: conversation left, the agent's live workspace right** (docs, browser, email draft); reply threading ("↳ Read the brief in #aster-launch…"); reactions; read receipts; a soft pastel canvas tinted per agent | Plush 3D with accessories as default (client: one consistent, non-human family; eyes carry the expression) |
| **Grok Bot** (client-observed) | Clean, fast, "how everything runs" visible; smooth motion; a roster of shape characters with eyes ([avatar reference](references/avatar-reference-client-2026-10-22.png)); an activity line per agent ("Outreach drafts queued for approval") | The opaque cost and black-box feel |

## 2. Bench rules (the merge)
1. **The canvas is Apple:** `#f5f5f7` canvas, `#ffffff` content surfaces, `#1d1d1f` text, `#d2d2d7` hairlines, no UI shadows, 8px cards, 980px pills. The type stack is Inter (or system SF on macOS) with Apple tracking. Body 17px is too large for a dense desktop work app, so **Bench body = 15px** and 14px in lists, with the same tracking curve. ⚑ Client to confirm.
2. **One action color.** Apple Blue `#0071e3` is the **only** filled action color, one per screen (matches our "one primary action" rule). Link Blue for secondary and links.
3. **Agents bring the color.** Each agent owns **one identity color** (a curated palette of about 10 soft hues, like the shape-avatar image and Dots). It appears **only** in that agent's avatar, its name tag, a **light tint of the user's bubbles in that agent's chat**, and a very faint canvas wash behind its conversation. **Agent colors are never used for buttons or actions.**
4. **Avatars = the one illustration.**
   - Non-human shapes with eyes only (sphere, droplet, cloud, hexagon, blob, egg, pill, triangle, rounded square).
   - **Two renders from one design:** a flat vector in lists and chat lines, and a soft dimensional render (gentle gradient and highlight, Dots-like softness, no fur noise) for the hero position at the top of the agent's chat and on the profile.
   - Status: a **corner badge** in lists and messages; in the hero position, the **status line under the name tag** ("Thinking…", "Drafting the release notes"), Dots-style, with the text always visible.
5. **Workspace split (from Dots).** The agent page is the conversation (left) plus **a live workspace pane (right)** showing what the agent is working on: a file diff, doc, browser, email draft or terminal. That's our "glass box". In v1 this pane hosts the diff review and terminal (CR-003 M10, v1 scope).
6. **Draft-then-you-send (from the Dots email screenshot).** Outward actions appear in the workspace as drafts with a single blue **Send** that only the client presses (BR-15, B5-#6).
7. **Motion: "calm and alive"** (Grok Bot feel + Apple restraint).
   - The hero avatar idles with a subtle breathe or blink; eyes shift with the state (focused when Working, sleepy when Idle).
   - Messages slide in 8px with a fade (180ms).
   - A handoff animates a small avatar "chip" travelling between conversations (300ms).
   - The badge changes with a crossfade.
   - Everything respects `prefers-reduced-motion`; nothing flashes.
8. **Density.** Apple's spacing scale (4-based), with 16/24 paddings in panels and 12px element gaps. The sidebar is a thin icon rail (Dots) that expands to labels on hover or by setting.
9. **Accessibility:** text tags beside color and glyphs (the ui-ux-guide adaptation), and WCAG AA on every agent tint (tints are light; text stays Carbon).
10. **Dark mode:** later (Phase 5b), following the guide's dark-mode rules.

## 3. Open decisions for the client
- D-UI1: Body size: **15px (recommended for a desktop work app)** or Apple's 17px?
- D-UI2: Hero avatar render: **soft dimensional (recommended)** or flat everywhere?
- D-UI3: A faint per-agent canvas wash behind its chat (Dots), **yes (recommended)** or a plain Frost canvas?
- D-UI4: The sidebar: a **thin icon rail (Dots, recommended)** or the current labelled sidebar?
- D-UI6: Theme: **Decided 2026-10-22: light first (Apple base), dark as a mode later** (client: "Light first (Apple base), dark as a mode later.")
- D-UI5: The name: Phase 5 also runs naming ("Bench" is still a codename).

## 4. Checklist results (direction v0.1)

**Artifact:** [`prototype/direction.html`](prototype/direction.html) (one file, no network). Tabs: Home · Agent · Noor · Team chat · Tokens. It is built with the recommended options for D-UI1 to D-UI3. D-UI4 changed: the sidebar is now a Grok Bot-style agent list that collapses to an avatar rail. The file folds in the Grok Bot recording findings (2026-10-22): an agent-list sidebar, a new agent created by conversation, thinking dots in the agent's colour, an inline workspace card with Take over, checklist summaries, system lines, mention chips, held drafts, emoji reactions, a toggleable side pane with screen, routines and settings, and lowercase agent voice. It also has a "Reduce motion" switch and a "Demo: Noor's state" picker in the demo chrome. Neither is part of the UI.

ui-ux-guide review checklist (✅ pass · ⚠ partial · ❌ fail · N/A):

| # | Item | Result | Notes |
|---|---|---|---|
| 1 | One intent, one primary | ✅ | Home: "Decide on QA-3". Agent: "Allow once" while the request is pending, then Stop while Noor runs, then Send when she is idle or stopped (the fill moves; only one at a time). Team chat: Send. The dialog and take-over each have their own single primary. |
| 2 | ≤ 7 per group, chunked | ⚠ | What needs me shows the top 5 and puts Meet and FYI behind "Show all 8". The roster is chunked Company 2 / Bench 7. The sidebar's Bench group has 8 rows (Team chat + 7 agents), one over. Larger teams need "Show all" or collapsible groups. |
| 3 | Key actions large, on the eye path, consistent | ⚠ | Primaries are 40 px pills and Stop sits in the header. "Allow once" lives in the workspace pane. If the client hides the pane, the inline card ("Action needed") and the pointer line lead back to it, but the primary is then off screen. |
| 4 | Weight leads to the primary and "needs me" | ✅ | One blue per screen. Attention items get filled tags (Blocked, Outward) and the amber "Action needed" pill. |
| 5 | 60-30-10, feedback colours, text with every status | ✅ | Frost/White/Carbon base. Blue is the only accent. Green = Done, amber = needs you, red = error, always with a word. Status tags sit next to names in the roster, the header, members and approvals. Sidebar rows are too tight for a tag; there the badge has a tooltip and aria-label, and "Typing…" is shown in words (the same exception as the low-fi chat sender lines). |
| 6 | Distinct states, visible focus | ✅ | Hover = surface shift, press = scale .98, focus = 2 px Apple Blue ring, disabled = Pebble with grey text. Selected tabs = a white pill on a grey track (not blue). |
| 7 | 40–60 ch, 120–150 % line height, one scale, ≤ 2 faces | ✅ | Bubbles max 30em (≈ 60 ch) at 1.47. Descriptions are ≤ 46 ch. One scale (12/14/15/17/21/28/40) plus code at 12.5 px. Inter (or SF) plus a monospace. |
| 8 | A system across screens | ✅ | One token set, one avatar function, one tag set and one badge set on all screens. |
| 9 | Empty states | N/A | Not in this direction sample. The low-fi (v0.4) states carry over to the full hi-fi. |
| 10 | Errors: cause + next step; worst moment designed | ⚠ | Designed: the pending approval, Stop ("Stopping after the current step", then "Request withdrawn, nothing ran"), Error hero copy ("test runner crashed (out of memory) · retrying once at 09:20") and a time-up debate. Not shown yet: the usage limit, a blocked escalation detail, a failed write. |
| 11 | Peak-end | ✅ | Allow → full suite → "all green" checklist (PR #44, S1-4 In review) → Noor goes Idle. New agent: colour morph, "Renamed to Lumen", Create, and a 10 s toast with a link. |
| 12 | Feedback and loading | ✅ | Live test counter, thinking dots, "wrapping the run" line, toasts, press states, a debate timer with a bar. |
| 13 | WCAG AA, keyboard, reduced motion | ⚠ | Every text pair is computed live on the Tokens tab: neutrals, the feedback inks, all 10 agent inks on white and on their tints, and Carbon on every tint all pass AA. Keyboard: arrow keys on tablists, a focus trap and Esc on the dialog and take-over, and focus returns. Reduced motion: the OS setting plus a demo switch stop every animation and transition. **Open:** input borders use Hairline (#d2d2d7, about 1.5:1). That is Apple's pattern, but below 3:1 for WCAG 1.4.11; inputs rely on their Frost fill and placeholder. The take-over "You" cursor is a pointer-only demo. |
| 14 | Targets ≥ 32 px, primaries ≥ 40 px | ✅ | Sidebar rows ≥ 40 px, icon buttons 32–36 px, primaries 40 px. |
| 15 | No dark patterns; costs and outward actions explicit | ✅ | Every agent message shows tokens and % of the week. A run chip and the plan meter sit in the header. Routines show their cost. Outward and Reserved tags. "Held for your ok, nothing sends until you've read it." No dollars except the payment item (Q11). |
| 16 | Nothing purely decorative | ⚠ | The hero's gradient, highlight and ground shadow are decoration by design: the one illustration the direction allows. Everything else has a job. |
| 17 | Avatars show status with a label; sizes fit context | ✅ | Eight distinct badge glyphs readable at 24 px (Tokens › Status). Sizes: 16 (mention), 20–24 (inline), 32 (chat, header), 36 (sidebar), 40 (lists), 64 (settings), 96 (hero). |
| 18 | Microcopy: plain states, possibilities, reassurance | ✅ | One status vocabulary. "Describe the agent first", "nothing is created until you confirm", "Stays inside bench/", "Revoke in Settings › Permissions or Noor › Autonomy". |

### Rules from §2 that were bent, and why
1. **Chat bubbles use an 18 px radius** (rule 1 allows only 8 px and 980 px). An 8 px bubble reads as a card, not a chat (Jakob's law). Apple's own Messages, Dots and Grok Bot all use soft bubbles. Composers and inputs keep 8 px.
2. **Agent colour appears in two more places** than rule 3 lists: mention chips (treated as a name tag) and the thinking dots (identity, from the Grok Bot recording). It never appears on a button or an action. Dots use the hue's deep shade (≥ 3:1 on the wash) and always come with the word "Thinking".
3. **Sidebar (rule 8 / D-UI4):** the Grok Bot recording replaced the thin icon rail with an **agent list** (search, avatar, name, last-message snippet, time, "Typing…", a cluster avatar for the team chat, the client at the bottom) that **collapses to an avatar-only rail**. This brings agent rows back into the sidebar, which v0.3 had removed. The IA is kept: Home, Approvals, Company, the project's Dashboard / Team / Sessions as icon links on the Bench group header, then Memory, Usage, Trace.
4. **An approval card inside the agent's workspace pane** (the UX package Q5 default is "inbox only"). The brief asked for it. It complements the inbox: the same request still appears in What needs me and Approvals.
5. **"Router picked Karim" is written "Bench picked Karim (@mention) · 0.3k tokens"**, because UX principle 10 keeps system words like "Router" out of the client's view.
6. **Ash is #6e6e73** (Apple's current secondary label colour) instead of the reference's #707070. It gives 4.7:1 on Frost instead of 4.54:1.
7. **The hero's soft ground shadow** goes against "no shadows". Apple allows shadow on product imagery, and the hero avatar is imagery. No UI element has a shadow.
8. **Lowercase agent voice** (Grok Bot) next to Apple's sentence case. Only agents write lowercase; the interface, system lines and the client's messages stay in sentence case.
9. **Nine shapes, ten hues:** a tenth agent (Lumen in the demo) reuses a shape with a new colour and eyes, so "each agent its own shape" can't hold beyond nine agents.
10. **Dark mode isn't built** (rule 10 says later). Grok Bot is dark, so this is the obvious Phase 5b follow-up.

### New decisions for the client (raised by this direction)
- D-UI4 (revised): the agent-list sidebar, collapsible to an avatar rail. Should it start expanded or as the rail?
- Q5 (revisited): approve inline in the agent's workspace **and** in the inbox, or the inbox only?
- Lowercase agent voice: yes or no.
- Emoji reactions (👍) from agents: yes or no. They render with the OS emoji font.
- Take over: Noor pauses while you edit her workspace, then continues from your change. Is that right?
- New agent by conversation: the new agent greets you, Atlas drafts it, and you press Create. Confirm that the agent speaks for itself before it exists.
- Bubble radius 18 px and agent-coloured thinking dots (bends 1 and 2).
