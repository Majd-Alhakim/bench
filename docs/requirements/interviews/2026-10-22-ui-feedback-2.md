# Client feedback: UI direction v0.2 (2026-10-22)

| # | Question | Client (verbatim) | Recorded decision |
|---|---|---|---|
| D-UI7 | Open the top ticket on Home by default? | "yes" | Home opens the top "What needs you" ticket at rest, so its action is the screen's one blue button |
| D-UI8 | More than 10 agents: repeat hues or grow the palette? | "same color different shapes make a large combination no need" | Keep 10 hues. Identity = hue × shape (9 shapes → 90 combinations); never the same pair twice in one project |
| D-UI9 | "Open in a new window": real window or split only? | "same thing with claude you can have a browser inside the app" | No separate OS windows in v0.1. Projects and pages open as panes/tabs **inside** the app (like the Claude desktop app's in-app browser pane); the menu item becomes "Open in a new tab/pane" |
| D-UI10 | Settings saves as you go, or Save per section? | "keep that" | Saves as you go |
| D-UI11 | May a routine write files? | "yes a routine can be anything that the agent is capable of doing set with a time to be repeated" | A routine = any task the agent can do, on a schedule. This changes CR-003 M4 (read-only background runs) → [CR-006](../change-requests/CR-006.md) |

## Brand and premium feel (new requirement)
- Client (verbatim): *"One problem I currently have with the design that it feels like normal and with no clear identity that makes it unique it need a brand and a design system that make it feel premium"*.
- Client shared eight design-education video transcripts (premium vs commodity design, Apple principles, emotional design, intelligence lock-in, states and recovery, designer levels) and asked: *"see what can we use from them … make them as a skill that is always run when we make UI/UX and fix our UI/UX"* and *"make the UI and UX agents go all out"*.
- Recorded: Phase 5 now delivers a **brand identity + full design system** (not only a direction), and a new always-on design skill distilled from the transcripts governs all UX/UI work.
