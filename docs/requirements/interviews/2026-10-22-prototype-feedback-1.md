# Client feedback: prototype v0.2, round 1 (2026-10-22)

**Q11 (a dollar price on payment requests):** *"yes"*. Payment requests may show their price.

**Verbatim feedback** (with screenshots of the sidebar "Projects" section and the "Chat: Noor" / "Profile: Noor" items):
> why items from same projects are listed as different projects? + I should be able to create a project manually right now it gets me back to CEO when I press New project
>
> Organization is part of the project not separate thing
>
> also why chat and profile are two separate things?
>
> Also I want to have avatars that have animations and customizable same to grok bot or dots

## Interpretation → actions
| # | Feedback | Action | Type |
|---|---|---|---|
| F1 | "Bench · Dashboard" and "Bench · Team chat" look like two projects | The sidebar shows **one entry per project** (Bench ▸ Dashboard, Team chat, Team, Sessions) | Prototype fix |
| F2 | "New project" goes back to the CEO | **Manual project creation**: the client creates a project directly (name, goal, template or blank, team). The CEO-intake route stays as an option | **CR-001**: new path for UC-43 |
| F3 | The organization is part of the project | **Each project has its own Team (org tree)** inside the project. The company level shows only the CEO, the client's own agents and the list of projects | **CR-001**: the IA changes how UC-01 is presented |
| F4 | Chat and profile are separate | **One agent page**: chat in the center, profile/settings, memory and activity as a side panel or tabs | Prototype fix |
| F5 | Animated, customizable avatars like Grok Bot / Dots | **Avatar system:** customizable (style, colors, features/accessories, or an uploaded image) and animated per status (idle, thinking, working, waiting for you…), respecting reduced motion. A placeholder and customizer flow in low-fi; the visual design in Phase 5 | **CR-001**: new requirement (it was only "look & feel" before) |
