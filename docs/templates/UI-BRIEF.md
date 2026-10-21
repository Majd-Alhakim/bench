# UI & Brand Package: <Product>

| Status | Version | Owner | Approver | Upstream |
|---|---|---|---|---|
| Draft | 0.1 | UI Designer | Client | PRD, UX package |

## 1. Brand foundation
- **Personality** (3–5 adjectives) and anti-personality (what we're not).
- **Mood and references:** apps, games, films, objects. A moodboard in `docs/design/ui/moodboard/`.
- **Voice and tone:** how the app and the agents speak.

## 2. Naming
- **Criteria:** short, ownable, easy to say and spell, works as a CLI word and a GitHub repo, no trademark conflict (Anthropic forbids "Claude" / Claude Code-like names), and a domain or npm or GitHub handle is free.
- **Directions** (e.g. myth, creature, crew/workshop, glass/transparency) → long list → shortlist of 3–5, each with its story, logo idea and conflict check.
- **Decision:** chosen name + rationale (client approves at G5).

## 3. Visual identity
Logo, color system (light and dark), typography, iconography, illustration style.

## 4. Design system (tokens → components)
Spacing, radius, elevation, color tokens, type scale, motion tokens; core components (chat bubble, agent card, approval card, trace row, cost chip, memory item).

## 5. Agents' identity
- **Avatars:** style (illustrated characters / abstract shapes / generated), how a user picks or generates one, how the status shows (idle, thinking, working, waiting for approval).
- **Animation and liveliness:** typing and thinking states, handoff animation between agents, group-chat presence. Must respect `prefers-reduced-motion`.
- **Sound** (optional).

## 6. Hi-fi screens and prototype
Key screens in light and dark, a clickable prototype (HTML in `docs/design/ui/prototype/`), and component states.

## 7. Accessibility
Contrast (WCAG 2.2 AA), focus states, keyboard map, screen-reader labels, reduced motion.

## 8. Client feedback log
| Round | Date | Feedback | Change made |
|---|---|---|---|
