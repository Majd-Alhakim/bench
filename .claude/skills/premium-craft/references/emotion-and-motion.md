# Emotion and motion

## Emotional design is strategic, not decorative
- In UX, pin candidate emotional moments on the flows (onboarding, the first success, a handoff, task completion, recovery).
- In UI, **choose the few that serve a goal**: trust, a sense of progress, delight, relief, belonging. Design those deeply.
- Treat the UI as a **movie, not a set of static frames**. Design how one screen becomes the next, not only each still image.
- Usability is the floor; in a crowded, AI-built market, products that stop at usability blend together. Emotional touch points are what is remembered.
- Use lightweight, often interactive animation (Rive/Lottie-class vectors, or CSS/WAAPI in prototypes), not heavy video.
- Fuse brand and core experience. For example, the avatar shapes and eyes ARE the brand's motion language.

## Apple-grade motion principles
- **Physics, not timelines.** Use springs (mass, stiffness, damping) instead of linear or ease curves for anything the user moves or opens. Momentum on flings, and a **rubber band** past the edges of scrollable content: the interface feels like an object with weight.
- **Spatial continuity.** Persistent elements morph instead of disappearing. Panels enter from where they live and leave the way they came. The user's mental map stays intact.
- **Micro-feedback** confirms every action: a press scale, a check morph, a counter tick, a soft settle.
- **Subtle cues teach behaviour without tutorials** (Apple's home-indicator line trained a gesture over years). For Bench: a grabber on resizable panes, and a faint drag affordance on project headers.
- **Change gradually.** Introduce new behaviours in steps across versions.
- **Precise geometry.** Continuous-curvature corners (squircles) feel softer and more expensive than plain rounded rectangles. Use consistent proportions.
- **Respect reduced motion:** the same information arrives without the movement (crossfade or instant).

## Motion tokens (starting point; the design system sets the final values)
| Token | Use | Value idea |
|---|---|---|
| `spring.snappy` | press, toggles, chips | stiffness ~500, damping ~30 |
| `spring.smooth` | panels, ticket expand, sheets | stiffness ~300, damping ~30 |
| `spring.gentle` | hero avatar, idle breathing | stiffness ~120, damping ~14 |
| `dur.micro` | hover, focus | 120–160 ms |
| `dur.move` | message in, crossfades | 180–240 ms |
| `dur.scene` | screen-level transitions | 300–400 ms |

## Bench signature-moment candidates (pick 2–3 per flow)
- **Birth:** a new agent's shape forms, its eyes open and it blinks at Create.
- **Handoff:** the sender's avatar chip travels into the receiver's conversation.
- **Thinking:** the eyes track the stream; dots in the agent's hue.
- **Green finish:** checks cascade, then the avatar relaxes to Idle.
- **Learned:** the first time a lesson is applied, a soft glow on the "Applied" chip.
- **Recovery:** a calm, non-red treatment; the avatar shows concern, not alarm.
- **Sprint end:** the team avatars gather into a small celebration on the project card.
