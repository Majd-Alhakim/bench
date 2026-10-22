# UI Direction: "Apple built a Grok Bot × Dots" (draft for client review)

**Status:** Draft v0.1 (2026-10-22), PM synthesis of the client's references. Input to Phase 5 (UI). The low-fi flows (UX prototype v0.4) stay the structure; this defines the look and feel.

**Client brief (verbatim):** *"the style and feel of grok bot which I find cool and clean and how everything runs and the animations; also the style of open Ai dots is nice design also; I want ours to be mix of both and imagine that Apple have created its own one with its design system."*

References: [`references/`](references/): the Apple style guide, three Dots screenshots, the client's shape-avatar image. **Pending:** the Grok Bot screen recording (the file path is on another machine).

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
- D-UI5: The name: Phase 5 also runs naming ("Bench" is still a codename).
