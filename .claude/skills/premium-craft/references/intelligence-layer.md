# The intelligence layer (stored value)

## Idea
Engagement (smooth onboarding, satisfying interactions) is layer one: it brings users in. Layer two is **investment**: every session deposits something that compounds, so the product gets better *for this user* over time. AI turns stored data into a learned model of the user (the video's examples: a taste profile trained by ranking images, years of personal health baselines, a company's encoded spending rules). People also value what they helped shape (the IKEA effect).

## Bench's version, with ethics
Bench's memory, lessons and per-agent knowledge **are** this layer. Bench is local-first and open source, and memory is plain Markdown, so we design the value to be **visible, explainable and exportable**. The client stays because the team truly knows them, not because leaving is hard. No dark lock-in, no hidden data.

## Checks for any screen or flow
1. **Investment loop:** does this core action make Bench better *for this client specifically*, or only better in general? If only general, it is a feature, not stored value.
2. **Compounding action:** what is Bench's equivalent of ranking images? Candidates:
   - approving or rejecting a draft (learns style)
   - editing an agent's output (learns preferences)
   - routing corrections (learns who does what)
   - lessons from failed attempts
   - Make these frictionless and automatic: no "save preference" chores.
3. **Make the intelligence visible:**
   - Counts that grow (runs, notes, lessons, days together).
   - Preferences applied with their provenance ("Using your PR style · learned 14 Oct · Edit").
   - A weekly "your team learned" summary.
4. **Measure the compounding:** can we show that a 6-month client gets better results than a 10-day one (fewer corrections, fewer approvals needed, faster tasks)? Surface it ("Approvals needed down 40 % since September").
5. **The exit question:** if the client left today, what would they rebuild from scratch? The answer should be "a team that knows me". They can still take every note with them in one click.
6. **Integration roots:** connectors and routines that depend on Bench (GitHub, Gmail, schedules) deepen the value. Show them on agent profiles.

## UI patterns
- **Home strip:** "Your team learned 7 things this week" → it expands to a list with sources.
- **Agent profile:** a "Together since 14 Oct · 312 runs · 46 notes · 12 lessons" line, and a memory sparkline.
- **In-reply chip:** "Applied: prefer the date library already in the repo (lesson from 22 Oct)", so the client sees the learning work.
- **Memory browser:** the growing graph is itself the visible investment.
- **Export:** one action, plain Markdown, never hidden.
