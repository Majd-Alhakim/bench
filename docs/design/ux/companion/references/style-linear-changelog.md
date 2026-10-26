# Style capture: Linear changelog (dark)

Source: [linear.app/changelog](https://linear.app/changelog), via Refero style `11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6`, seen 2026-10-26. Condensed notes in our words; values as reported by Refero. **Reference ingredient, not our system:** Eucas keeps its own tokens ([tokens.css](../../../ui/system/tokens.css)).

**Thesis:** "midnight command center behind frosted glass" (Refero's phrase). Depth comes from tone steps and 1 px borders, almost never from shadows.

| Role | Value (Refero) | What to take for Eucas |
|---|---|---|
| Canvas | `#08090a` | Our Graphite ground already does this job; keep ours |
| Raised surface | `#141516` / `#1c1c1f` | Two raised steps are enough for a tray popover + one panel |
| Hairline | `#34343a` (1 px) | Separate rows with hairlines, not cards, in dense lists (inbox, log) |
| Text 1 / 2 / 3 | `#f7f8f8` / `#d0d6e0` / `#8a8f98` | Three text steps; no pure white |
| Type | Inter Variable; headings at 500–590, not bold; −0.01em | Our Instrument Sans 600 + tight tracking does the same; don't go heavier |
| Mono | Berkeley Mono for dates, timestamps, code | Our JetBrains Mono for commands, paths, timestamps in the log |
| Radius | cards 8, buttons and tabs pill | We keep our continuous-corner family (DESIGN-SYSTEM §6); note: pill = interactive, rounded rect = container is a clear signifier |
| Density | compact: section gap 24, card padding 16, element gap 8 | Matches a tray popover; use our 4-pt scale |
| Accent | none | Supports our "one Cobalt per screen" rule |

**Do (adapted):** layer surfaces by tone; 1 px hairlines; mono only for technical text; keep headline weight moderate.
**Don't (adapted):** heavy shadows; several vivid accents; large hero imagery inside a working tool.
