# Laws of UX audit: direction v0.4 "calm"

| | |
|---|---|
| **Asked by** | Client, round 4 feedback F5 ("have a look at all the UX design laws on lawsofux.com and apply them") |
| **Audited** | `docs/design/ui/prototype/direction.html` (v0.4 · calm), read in full for the scenes below, plus `screens/*.png` |
| **Date** | 2026-10-23 |
| **Source** | https://lawsofux.com/ (index and all 30 law pages, fetched 2026-10-23). Definitions and takeaways are paraphrased. |
| **Context** | Client feedback round 3 (C1–C7: calm, relief, little on screen) and round 4 (F1–F6), [CR-007](../../requirements/change-requests/CR-007.md) (you're only called for what matters) |
| **Not repeated** | The `ui-ux-guide` skill already covers Hick, Miller, Fitts, Occam, Jakob, peak-end, peak-load, framing, 60-30-10, states, empty states and target sizes. This audit applies those laws to v0.4 and adds the laws the skill doesn't cover. |

**Scenes checked:** Home (Atlas asks one thing), What needs you overlay, Noor's chat (panel closed, then open), Team chat, Bench dashboard, New agent, New project, First run (4 steps), Memory, and the worst moments: weekly limit, offline, run failed, login expired, approval denied.

**Stale screenshots:** `agent-settings-autonomy-1440.png`, `split-1440.png`, `run-failed-1440.png`, `login-expired-1440.png`, `approval-denied-1440.png` and `long-names-1280.png` still show v0.3 (old Home, "What needs you" in the sidebar). For those states I checked the v0.4 HTML instead. Regenerate them before the client reviews (see fix 18).

**Verdict key:** ✅ applied · ⚠ partial · ❌ violated · N/A does not apply.

---

## 1. The laws, one by one

The site lists its 30 laws as one flat alphabetical list. It has no categories, so this audit keeps the site's order.

### 1. Aesthetic-Usability Effect
- **Law:** people judge attractive designs as easier to use.
- **Site takeaways:** attractiveness creates goodwill that makes a product feel like it works better; people forgive small usability problems in a good-looking product; good looks can hide usability problems during testing.
- **For Bench:** the v0.4 polish (the shape avatars, Porcelain, springs) builds trust in a product that runs autonomous agents. The same polish can stop the client noticing what is missing.
- **Verdict:** ✅ applied, with a process risk. Every screen is visually calm and coherent. The risk is real, though: the client found the missing agent settings (F2) only by *using* the prototype, never while reviewing screens. The validation tasks must be timed tasks, not "does it look right".

### 2. Choice Overload
- **Law:** too many options overwhelm people.
- **Site takeaways:** many options slow decisions and lower satisfaction; when people must compare, put the options side by side; help them decide by featuring the recommended option and filtering early.
- **For Bench:** this applies to the What needs you overlay, agent Settings and Memory.
- **Verdict:** ⚠ partial.
  - ✅ Ticket options come in pairs with "Karim recommends". New project offers 2 starts and autonomy offers 3 presets. Per-tool overrides are collapsed in a `<details>`.
  - ⚠ The overlay mixes 5 Decide + 2 Meet tickets with 2 For-your-info cards and a "Decided by Atlas · 4" footer: 9 cards plus a history (`needs-1440.png`, `NEEDS0`).
  - ⚠ Memory shows a header, an Export button, a folder icon, a "learned 7 things" accordion and a 3-pane browser with 11 categories (`memory-1440.png`).

### 3. Chunking
- **Law:** break information into units and group them into a meaningful whole.
- **Site takeaways:** chunked content is quicker to scan; split content into visually distinct groups with a clear hierarchy; modules, separators and levels show how pieces relate.
- **For Bench:** this applies to the sidebar, tickets, settings and boards.
- **Verdict:** ✅ applied.
  - The sidebar has Atlas / Company / Projects / Insight.
  - The overlay has Decide / Meet / For your info.
  - Settings has Who / What Noor may do / How Noor works with you (`SECGROUPS`).
  - Ticket facts come in label–value pairs.
  - The board has To do / In progress / Done.

### 4. Cognitive Bias
- **Law:** a systematic error in thinking that shapes how we see things and decide.
- **Site takeaways:** mental shortcuts speed decisions but bias them without our noticing; knowing the biases helps you avoid misleading people; confirmation bias makes people look for what they already believe.
- **For Bench:** defaults, recommendations and "Allow" buttons steer the client. Automation bias (rubber-stamping what an agent proposes) is the main risk.
- **Verdict:** ✅ applied.
  - The preselected option is always the free or reversible one ("Nightly E2E · free", "Wait until v0.1", "End it on Tue 27 Oct").
  - Every recommendation names who makes it ("Karim recommends", "Maya recommends").
  - Paid options say "needs a payment from you".
  - Framing is honest ("Nothing is lost", "An email can't be called back, so there's no Undo").
  - Keep this as a standing rule.

### 5. Cognitive Load
- **Law:** the mental effort needed to understand and use an interface.
- **Site takeaways:** when information exceeds what people can hold, tasks get harder and details are missed; intrinsic load is the work itself; extraneous load is effort spent on things that don't help, such as decorative or redundant elements.
- **For Bench:** C7 ("feel relief, not stressed") is exactly about cutting extraneous load.
- **Verdict:** ⚠ partial.
  - ✅ Home is one sentence and one button (`home-1440.png`). Receipts show only on the latest message and on hover (`.msgs>.msg:not(:has(~ .msg)) .msg-meta`).
  - ⚠ Noor's chat still stacks a 96 px hero, the name tag, the status line, a ledger line ("Together since 14 Oct · 312 runs · 46 notes · 12 lessons"), a context meter, a ticket with 3 buttons, an explanation line, Look inside, the live test line, Stop and Send (`agent-1440.png`).
  - ⚠ On the weekly-limit Home, the pause is stated three times (`usage-limit-1440.png`).

### 6. Doherty Threshold
- **Law:** productivity soars when the computer and the user respond to each other within about 400 ms.
- **Site takeaways:** give feedback within 400 ms; make waits feel shorter; animate during background work; progress indicators make waits tolerable even when they're imprecise; a short deliberate delay can add trust.
- **For Bench:** Claude replies take seconds, so Bench must answer instantly with *its own* feedback.
- **Verdict:** ✅ applied.
  - "Sent" appears instantly, followed by a thinking line ("Atlas · Thinking · reading your issues").
  - The live test counter shows "9 of 12 passed".
  - The slow state says "Claude is taking longer than usual (14 s). Noor is still on it", and after 60 s "Nothing is lost, and Stop is always here".
  - Counts tick in place. First run shows "1 of 8" while creating.

### 7. Fitts's Law
- **Law:** the time to reach a target depends on its distance and size.
- **Site takeaways:** make targets big enough; leave space between targets; put them where they are easy to reach.
- **For Bench:** Send is the app's most frequent action. The skill sets 32 px minimum and 40 px for primary actions.
- **Verdict:** ⚠ partial.
  - ✅ Ticket actions use `btn lg` (40 px). "Show them" sits right under the question.
  - ⚠ Send is a 32 px icon (`.btn.icon` `--h:32px`, `#askSend`, `#nSend`).
  - ⚠ The sidebar's hover-only icons (org tree, sessions, project "…") are 28 px (`btn icon sm`) and invisible until hover.
  - ⚠ "Look inside" is a 22 px link. "New project" (`.secbtn`) is 24 px.

### 8. Flow
- **Law:** a state of full, energised focus in an activity.
- **Site takeaways:** flow happens when challenge matches skill; too hard frustrates and too easy bores; give feedback on what was done; remove friction and make features discoverable.
- **For Bench:** the client's flow is "talk to Atlas, get on with my day". Every unnecessary approval breaks it.
- **Verdict:** ⚠ partial.
  - ✅ The composer is never blocked: you can message an agent "after this step", messages queue offline, and Stop is always present.
  - ⚠ The prototype still interrupts for routine work that CR-007 made automatic: run `pnpm test`, merge PR #41, and the "Always allow `pnpm lint --fix`?" suggestion (`NEEDS0`).
  - ⚠ Agent settings are hard to find (F2), which is a discoverability break.

### 9. Goal-Gradient Effect
- **Law:** the closer people are to a goal, the faster they work toward it.
- **Site takeaways:** effort rises near the finish; artificial progress can motivate; show clear progress.
- **For Bench:** this applies to sprints, first run and long agent runs.
- **Verdict:** ✅ applied.
  - The first run has a numbered 4-step list with ticks and summaries of completed steps (`first-run-1440.png`).
  - The dashboard shows "2 of 10 done · 20 %" with a bar (`project-bench-1440.png`).
  - Test runs show "9 of 12 passed". First run shows "Creating Atlas and 7 agents… 1 of 8".
  - No fake progress anywhere.

### 10. Hick's Law
- **Law:** decision time grows with the number and complexity of choices.
- **Site takeaways:** cut choices when speed matters; break complex tasks into steps; highlight recommended options; onboard progressively; don't oversimplify into vagueness.
- **For Bench:** this applies to every form and every screen's main action.
- **Verdict:** ⚠ partial.
  - ✅ Home has one action. Tickets have one primary action.
  - ⚠ First run step 4 and New project start with *no* option selected and a disabled Finish/Create plus the hint "Choose how to start the team." (`new-project-1440.png`, `renderFrSteps` step 4). The client must decide before anything is suggested.
  - ⚠ First run step 3 asks a newcomer to choose a model (Balanced / Deep / Fast) before they have used Bench.

### 11. Jakob's Law
- **Law:** users spend most of their time on other products, so they expect yours to work the same way.
- **Site takeaways:** people carry expectations from familiar products; reuse existing mental models so people can focus on the task; when you change something, let people keep the familiar version for a while.
- **For Bench:** people know chat apps (WhatsApp, Slack, ChatGPT/Claude), Kanban and a bottom-left settings entry. In every messenger, clicking a contact's face or name opens their profile.
- **Verdict:** ⚠ partial.
  - ✅ Chat layout, centred composer, Slack-like sidebar and Kanban board.
  - ⚠ In an agent's chat, the avatar and name are not clickable (`<h1 class="nametag">`). Settings live behind an unlabelled monitor icon → panel → gear: three steps (`noorHeadHTML`, `#wsGear`). The client reported this directly (F2: "the setting menu for the agent in chats is gone! I can't find it").
  - ⚠ The bottom-left gear (`#gearBtn`, a stub) looks the same as the agent gear, so the client read it as agent settings (F2).

### 12. Law of Common Region
- **Law:** elements inside a shared, clearly bounded area are seen as a group.
- **Site takeaways:** a common region gives structure; a border creates it; so does a background.
- **For Bench:** this applies to tickets, the composer, the overlay and settings.
- **Verdict:** ✅ applied.
  - Each ticket is one card. The overlay is one surface. The composer is one bordered box holding attach, text, Stop and Send. The agent's chat sits on the agent's wash colour.
  - Card nesting stays at one level, except Memory: an accordion card above a 3-pane card (see fix 16).

### 13. Law of Proximity
- **Law:** objects near each other are seen as a group.
- **Site takeaways:** nearness implies a relationship; near items look like they share a purpose; proximity helps people organise information faster.
- **For Bench:** controls belong next to the thing they act on.
- **Verdict:** ⚠ partial.
  - ✅ Receipts sit under their bubble. "Show them" sits under Atlas's question. "Fill the fields" sits beside "Describe it". "Always allow covers…" sits under the buttons it explains.
  - ⚠ An agent's settings entry (the monitor icon, top-right) is far from the agent's face and name, which is where the eye goes for "this agent" (`agent-1440.png`).

### 14. Law of Prägnanz
- **Law:** people read complex or ambiguous images in the simplest form possible.
- **Site takeaways:** the eye seeks simplicity and order; simple figures are processed and remembered better; complex shapes get reduced to one form.
- **For Bench:** agents are recognised by silhouette.
- **Verdict:** ✅ applied. Each agent is one simple shape (sphere, pill, droplet, triangle…) with two eyes, the logo is four simple shapes (Quartet), and status is one small glyph on the avatar.

### 15. Law of Similarity
- **Law:** elements that look alike are seen as related, even when apart.
- **Site takeaways:** visual likeness implies a relationship; colour, shape, size, orientation and motion signal a group; links and navigation must look different from text.
- **For Bench:** one look per meaning: Cobalt = the action, amber = needs you, an outline tag with a lock = a gate.
- **Verdict:** ⚠ partial.
  - ✅ The gate tags (Outward, Payment) share one outline-and-lock style. Status tags share one recipe. All buttons are the same pill.
  - ⚠ "Look inside" uses Cobalt text (`.lookin{color:var(--action-text)}`), the same colour as the primary button, so a passive link looks like an action. Noor's chat shows 3 Cobalt "Look inside" links next to one Cobalt primary.
  - ⚠ The bottom-left gear (app) and the panel gear (agent) are the same icon for different scopes.

### 16. Law of Uniform Connectedness
- **Law:** visually connected elements look more related than unconnected ones.
- **Site takeaways:** group similar functions with shared colour, lines, frames or shapes; use connectors such as lines and arrows; use connection to show context.
- **For Bench:** handoffs and mentions show how agents relate.
- **Verdict:** ✅ applied. The handoff "Brief · S1-6" chip travels from Maya to Karim (`team-1440.png`). Mention chips carry the agent's hue. The agent's wash colour joins the top bar and the chat into one room.

### 17. Mental Model
- **Law:** a compressed model of how users believe a system works.
- **Site takeaways:** people apply their model of one system to similar ones; match their model so they don't relearn; align with expectations; close the gap between the designer's and the user's model through research.
- **For Bench:** after CR-007, the client's model is explicit: *"not everything needs me… merging and committing happen automatically, I am only called for testing"* plus destructive actions, payments, questions and undecided decisions. Also F1: Atlas is the special front-door agent with a profile.
- **Verdict:** ❌ violated (v0.4 predates CR-007, so this is drift, not a bad decision).
  - The overlay still asks "Merge PR #41 to main · Reserved" and "Noor asks to run `pnpm test`" (`NEEDS0`: `merge`, `pnpm`, `lint`).
  - Noor's whole demo moment is a `pnpm test` approval (`agent-1440.png`).
  - The autonomy default is "Ask every time" (`SET.preset:"ask"`), and the "Autonomous" preset still mentions "reserved actions".
  - There is no "Ready to test" ticket kind. Atlas has no profile (F1).

### 18. Miller's Law
- **Law:** people hold about 7 (±2) items in working memory.
- **Site takeaways:** don't use "7" to justify arbitrary limits; chunk content to aid understanding and memory; capacity varies by person and context.
- **For Bench:** this applies to sidebar rosters, boards and lists.
- **Verdict:** ✅ applied. Each project shows Dashboard, Team chat and 4 agents, then "3 more". Board columns collapse with "1 more". Memory lists collapse with "17 more about you".

### 19. Occam's Razor
- **Law:** among equally good options, prefer the one with the fewest assumptions.
- **Site takeaways:** avoiding complexity beats removing it later; remove whatever you can without hurting function; you're done when nothing more can be removed.
- **For Bench:** this is the client's calm brief stated as a law.
- **Verdict:** ⚠ partial. v0.4 removed a lot, but some things are still repeated or unneeded:
  - The weekly-limit pause appears three times on Home: banner, top bar and Atlas's status line.
  - First run always shows the `ANTHROPIC_API_KEY` note, even when no key is set (`renderFrSteps` step 1).
  - Memory repeats Home's "learned 7 things" accordion.
  - The "Company" heading sits over a single agent (Iris).

### 20. Paradox of the Active User
- **Law:** users never read manuals; they start using the software right away.
- **Site takeaways:** people are task-focused and skip docs; learning up front would pay off, but they won't do it; put help in context, for example tooltips.
- **For Bench:** no tours. Help appears at the moment of a decision.
- **Verdict:** ✅ applied.
  - There are no tours. First-use suggestion chips appear ("What can this team do?").
  - Explanations sit beside the decision: "Always allow covers pnpm test in bench only", "Bench reads this to decide who replies", and the context-meter tooltip.
  - The F2 discoverability gap is counted under Jakob (11).

### 21. Pareto Principle
- **Law:** about 80 % of effects come from 20 % of causes.
- **Site takeaways:** inputs and outputs are rarely even; a few elements drive most results; focus effort where it helps the most users.
- **For Bench:** most of the client's time goes to talking to Atlas and answering what needs them.
- **Verdict:** ✅ applied. Home is the chat with Atlas (C6), and What needs you opens over any screen from Atlas's question or the top bar. Everything else is one click away.

### 22. Parkinson's Law
- **Law:** any task expands to fill the time available for it.
- **Site takeaways:** keep tasks within the time people expect; finishing early delights; autofill shortens tasks.
- **For Bench:** this applies to debates, sprints, forms and approvals.
- **Verdict:** ✅ applied.
  - The debate has a visible 5-minute clock ("4:08").
  - Sprints are 3 days with an end date.
  - "Fill the fields" fills New project from one sentence. New agent is created from one sentence.
  - Every request carries an estimate ("about 3 min", "about 10 min", "6 questions").

### 23. Peak-End Rule
- **Law:** people judge an experience by its most intense moment and its end, not the average.
- **Site takeaways:** design the peak and the final moments; find the moments where the product is most useful or delightful; negative moments are remembered more strongly.
- **For Bench:** the peaks are a worst moment (limit, login, run failed) and a win (all green, sprint done). The end is "All caught up".
- **Verdict:** ⚠ partial.
  - ✅ The endings are designed: "you're all caught up. the team is working on N things" (Atlas looks pleased), "all green" with a checklist, and after a reset "picked up where they paused; nothing was lost".
  - ⚠ At the peak of the weekly-limit moment, Atlas's message ignores the limit: "afternoon. 7 things need you. want to see them?" (`usage-limit-1440.png`). The bad news is told by chrome (banner, ring, status line), not by the agent you're talking to.

### 24. Postel's Law
- **Law:** be liberal in what you accept and conservative in what you send.
- **Site takeaways:** accept varied input and actions; plan for many inputs, abilities and contexts; anticipating more makes design more resilient; translate messy input into what the system needs and give feedback.
- **For Bench:** natural language is the main input.
- **Verdict:** ✅ applied.
  - Routines take free text ("every Friday at 4 pm, list the merged PRs") and show a draft before saving.
  - New agent and New project accept one sentence.
  - An empty name falls back to "Atlas" (`formAtlas`).
  - Offline messages queue ("Queued · sends when you're back online").

### 25. Selective Attention
- **Law:** people focus on a subset of stimuli, usually the ones tied to their goal.
- **Site takeaways:** guide attention and avoid overload; banner blindness means ad-like content gets ignored; change blindness means simultaneous or weakly signalled changes get missed.
- **For Bench:** the one thing that must never be missed is "needs you".
- **Verdict:** ⚠ partial.
  - ✅ Counts tick in place and are announced (`#liveHost` aria-live). Banners use the product's own style, not an ad-like one.
  - ⚠ The same news is shouted in four places at once: the top-bar amber count 7, the amber Bench 5, the amber InterviewKit 1, and Atlas's sentence (`home-1440.png`). Amber stops meaning "look here".
  - ⚠ Cobalt "Look inside" links compete with the primary action (see 15).

### 26. Serial Position Effect
- **Law:** people best remember the first and last items in a series.
- **Site takeaways:** put the least important items in the middle; put key actions at the far left and right of navigation.
- **For Bench:** this applies to the top bar, sidebar and ticket order.
- **Verdict:** ✅ applied.
  - The sidebar starts with Atlas (Home) and ends with Insight and your settings.
  - The top bar has usage on the left and "Needs you" at the far right.
  - The overlay ranks blocked work first (D2 ranking) and puts "Decided by Atlas" last.
  - The composer is always the last thing in a chat.

### 27. Tesler's Law
- **Law:** every system has complexity that can't be removed, only moved between the system and the user.
- **Site takeaways:** someone must carry the essential complexity; the system should carry as much as possible; don't design for an idealised rational user; give contextual help.
- **For Bench:** Atlas and the defaults should carry routing, models, permissions and merges, not the client.
- **Verdict:** ⚠ partial.
  - ✅ Atlas routes work, drafts tickets and picks options with a named recommender. "Fill the fields" does the same for New project.
  - ⚠ Still on the client:
    - routine approvals (CR-007);
    - choosing a model and a folder in first run;
    - a context meter (% plus a checkpoint marker) on every agent chat, even at 8–34 % when there's nothing to act on.

### 28. Von Restorff Effect
- **Law:** when several similar objects are present, the one that differs is remembered.
- **Site takeaways:** make important information and key actions visually distinct; use emphasis sparingly so highlights don't compete; don't rely on colour alone; use motion carefully.
- **For Bench:** Cobalt should mean "the action" and amber "needs you", each once per view.
- **Verdict:** ⚠ partial.
  - ✅ Status always has a text tag as well as colour. Reduced motion is respected (`html.rm`, `prefers-reduced-motion`).
  - ⚠ Emphasis is diluted:
    - Cobalt "Look inside" links appear on every receipt, ticket and sidebar row.
    - Team chat uses a Cobalt primary "Join and decide" on an item the strip says Maya decides and the ticket list calls For your info (`team-1440.png`).
    - Three amber counts appear on Home.

### 29. Working Memory
- **Law:** a system that briefly holds and works with the information needed for a task.
- **Site takeaways:** it holds about 4–7 chunks that fade in 20–30 s, so show only what's needed; recognition beats recall, so show what was seen; carry information between screens so the system remembers, not the user.
- **For Bench:** don't make the client remember an agent's context across screens.
- **Verdict:** ✅ applied.
  - What needs you is an overlay over the current screen, and closing it returns focus where you were (`openNeeds`/`closeNeeds`).
  - Each ticket carries its own facts, provenance ("Atlas passed it to you: it's a new command pattern") and cost.
  - Replies quote what they answer ("↳ the Stop button now sits…").
  - Agents are recognised by face, not recalled by name.

### 30. Zeigarnik Effect
- **Law:** people remember unfinished or interrupted tasks better than finished ones.
- **Site takeaways:** signal clearly that more content exists; show progress toward a goal; show where people are in a process.
- **For Bench:** open loops pull attention. Bench should open only the loops that matter.
- **Verdict:** ✅ applied. "3 more", "1 more" and "17 more about you" signal hidden content. Progress is shown on sprints and first run. The count includes only Decide + Meet; For your info is shown but not counted (R5), so FYI doesn't nag.

### Tally

| Verdict | Count | Laws |
|---|---|---|
| ✅ applied | 16 | 1, 3, 4, 6, 9, 12, 14, 16, 18, 20, 21, 22, 24, 26, 29, 30 |
| ⚠ partial | 13 | 2, 5, 7, 8, 10, 11, 13, 15, 19, 23, 25, 27, 28 |
| ❌ violated | 1 | 17 Mental Model (CR-007 drift) |
| N/A | 0 | (every law applies to a desktop chat app) |

---

## 2. Prioritised fixes

The most impactful fix comes first. Every fix removes or demotes something, or makes an existing element do more. The only additions are the ones the client asked for (F1, F3, CR-007's "Ready to test").

| # | Screen | Law | Problem | Concrete fix |
|---|---|---|---|---|
| 1 | What needs you overlay, Noor's chat, sidebar counts, dashboard "need you" line | Mental Model (17), Tesler (27), Flow (8) | The prototype still asks the client to merge PR #41 ("Reserved") and to run `pnpm test`, and suggests "Always allow `pnpm lint --fix`". CR-007 made all of these automatic. There is no "Ready to test" kind. | **(a)** Delete the `merge`, `pnpm` and `lint` tickets and the `NEED_CONFLICT`/`NEED_RESOLVED` merge variants. **(b)** Turn Maya's "Maya has something to show you" into the new kind: tag **Ready to test**, title "Onboarding and the agent runner are ready to try", body = what to test in ≤ 3 numbered steps, primary **Start testing** · cons "about 10 min", secondary "Later today". **(c)** Rename the groups to match CR-007: **Decide** (QA-3, Reply to Dana, Figma seat), **Test** (Maya), **Answer** (Yusuf). The count becomes 5 (Bench 3, InterviewKit 1, Company 1). **(d)** Add "Merged PR #41 to main · CI and the reviewer check passed" at the top of "Decided by Atlas", with **Revert** in place of Undo. **(e)** Replace Noor's demo moment with a CR-007 kind that still needs you, a destructive one: "Noor wants to delete `e2e/legacy/` (14 files, outside her scratch area)", with primary **Delete 14 files**, secondary "Keep them", and the line "Deleting can't be undone from Bench". Before it, show one quiet system line: "Noor ran the full suite on her own · 214 of 214 passed · your rule: tests run without asking". |
| 2 | Every agent chat (Noor, any room) | Jakob (11), Proximity (13) | Agent settings sit behind an unlabelled monitor icon, then the panel, then a gear (3 steps). The face and name aren't clickable (F2). | Make the hero avatar + name tag one button, labelled "Noor's profile and settings". It opens the panel directly on **Settings › Profile**. Hover: the name tag gets the `--state-hover` fill; cursor pointer; focus ring. Apply the same to the last breadcrumb segment ("Noor"). Keep the monitor icon for screen + routines only, with the tooltip "Noor's screen and routines". No new visible element. |
| 3 | What needs you overlay | Choice Overload (2), Occam (19), Selective Attention (25) | The overlay shows 9 cards, 2 of them For your info (a live debate and a suggestion) that need nothing from you, plus the history footer. | Remove the **For your info** group from the overlay. The debate already lives in Team chat, and heads-ups (forecast, paused runs) already have their banner. Keep only counted tickets and the "Decided by Atlas" footer. With fix 1 the overlay holds 5 cards. |
| 4 | Home in worst moments (weekly limit, login expired) | Peak-End (23), Occam (19), Cognitive Load (5) | The pause is stated three times (dark banner, top bar "Paused until Mon 09:00", status line under Atlas), while Atlas's message ignores it ("afternoon. 7 things need you"). | On **Home only**: remove the banner and the status line under the name tag (the top-bar ring stays). Atlas's message leads with the moment: "your week is used up. 3 runs paused safely and resume Mon 26 Oct at 09:00; nothing is lost. 5 things still need you. want to see them?", with **Show them** and tertiary "See paused work". Login expired works the same way: Atlas says it, with **Copy command** and tertiary "Check again". Other screens keep the banner. |
| 5 | All chats, tickets, Memory, sidebar | Von Restorff (28), Similarity (15) | "Look inside" is Cobalt, the action colour, so 3–4 Cobalt links compete with the one primary button per view. | Make `.lookin` Text 3 (grey) with the eyes glyph at rest, and Cobalt only on hover and focus. Rule: at rest, Cobalt appears once per view, on the primary button. |
| 6 | Sidebar project rows (every screen) | Von Restorff (28), Selective Attention (25) | Three amber counts (top bar 7, Bench 5, InterviewKit 1) plus Atlas's sentence all announce the same news, so amber loses its pull. | Project counts use the neutral `.count.soft` (grey fill, Text 2). Amber `.count.attn` appears only on the top-bar "Needs you" and in the overlay header. In the collapsed sidebar, show the soft count too. |
| 7 | Sidebar footer | Jakob (11), Similarity (15) | The "M · You" row with a stub gear reads as agent settings (F2). Same icon, different scope. | Make the whole footer row one button: gear icon + the word **Settings** (replacing "M" and "You"; there is one user). It opens app settings (Theme, Sound, Bench folder, Claude login, Usage guard). Tooltip: "App settings". Remove the separate gear button. |
| 8 | Home (Atlas) | Mental Model (17), Jakob (11) | Atlas has no profile, and nothing says what makes Atlas different (F1). | Fix 2 applied to Atlas: the hero + name tag on Home opens **Atlas's profile** in the right panel, with name, optional title, **Change shape or colour**, model, and one short "Only Atlas" list: *your front door · routes work · holds company memory · brings you what needs you · hires agents · can't be deleted* (Lifecycle shows a lock: "Atlas can't be deleted"). Nothing is added to Home itself. |
| 9 | Agent Settings › Autonomy | Mental Model (17), Tesler (27) | The default preset is "Ask every time", and the presets still speak of "reserved actions". Both contradict CR-007. | Default new agents to **Trusted**. Rewrite the presets: **Ask every time** "Asks before commands, edits and deletes." · **Trusted** "Runs tests, commits, pushes and merges once checks pass. Asks before deleting, paying, or writing to anyone for you." · **Autonomous** "Everything except the five things that always need you." Link that last phrase to a popover listing CR-007's five kinds. |
| 10 | First run step 4, New project | Hick (10), Cognitive Bias (4) | No option is preselected, the button is disabled, and a hint says "Choose how to start the team." The client must decide before getting help. | First run: preselect **Just Atlas for now** (free, reversible) and enable Finish. New project: preselect **Product + Dev team** with a small tag "Atlas recommends"; Create enables once Name is filled. Remove the "Choose how to start the team." hint from both footers. |
| 11 | Team chat | Von Restorff (28), Mental Model (17) | The debate strip has a Cobalt primary **Join and decide**, but the strip says "Maya decides" and the item is For your info. | Change it to a secondary **Watch** button and keep the 4:08 clock. The screen's primary action is the composer. |
| 12 | Agent chat hero | Cognitive Load (5), Tesler (27) | The ledger line ("Together since 14 Oct · 312 runs · 46 notes · 12 lessons") and the context meter are always visible. | Remove the ledger line from the chat (it belongs in Profile/Memory, reachable via fix 2). Show the context meter only from 60 % (approaching the 80 % checkpoint, BR-66); below that it lives in the panel. **Needs a client decision**: see the glass-box note below. |
| 13 | All composers | Fitts (7) | Send, the app's most frequent primary action, is a 32 px icon. | Make Send a 40 px circle (`--h:40px`, 18 px arrow). Stop stays a 32 px secondary pill beside it. |
| 14 | First run steps 1 and 3 | Occam (19), Tesler (27) | The `ANTHROPIC_API_KEY` note shows even when no key exists, and a newcomer must pick a model. | Show the API-key note only when the variable is detected. In step 3, remove the Model select (default Balanced; it can be changed later in Atlas's profile, fix 8) and put **Change shape or colour** under the name field (F1). Step 3 becomes a single field. |
| 15 | Sidebar hover icons, "New project", "Look inside" | Fitts (7) | Targets are 22–28 px, below the 32 px rule. | Keep the visual size and grow the hit area to 32 px with padding (e.g. `min-height:32px` on `.secbtn`, `.lookin`, `.btn.icon.sm`). |
| 16 | Memory | Occam (19), Choice Overload (2), Common Region (12) | The "Your team learned 7 things this week" accordion repeats Home's news above a 3-pane browser (card in card). | Remove the accordion from Memory. The header line "Your team knows 214 things about how you work." is enough. Atlas mentions weekly learning in chat. |
| 17 | New agent, sidebar | Mental Model (17) | The optional **title** (F3) exists in Profile but not in New agent, and the expanded sidebar doesn't show it. | New agent: under the editable draft name tag, add a quiet "Add a title" link that turns into an input labelled Title (Optional). Sidebar (expanded only): the title follows the name in Text 3, 13 px, ellipsis first. Hidden in the collapsed sidebar. |
| 18 | `screens/*.png` | Aesthetic-Usability (1) | Six screenshots still show v0.3, so the client may review a design that no longer exists. | Regenerate `agent-settings-autonomy`, `split`, `run-failed`, `login-expired`, `approval-denied` and `long-names` from v0.4 after fixes 1–17. Validate with timed tasks, not looks. |

### Decisions for the client (not resolved here)
- **D-A (fix 12):** the glass box (BRD) requires context to be visible. Is "visible in the agent's panel and in the chat from 60 %" enough, or should the meter always stay on screen?
- **D-B (fix 3):** removing For your info from the overlay means a live debate shows only in Team chat and the sidebar. Is that acceptable, or should FYI stay as a collapsed one-line group?
- **D-C (fix 1e):** is a destructive file deletion the right example for Noor's "needs you" moment, or would you rather see a **Ready to test** moment in Noor's chat?
- **D-D (fix 7):** should the footer show "Settings" (one user, clear purpose), or keep your initial "M" (ready for sharing later)?

---

## 3. Standing rules for Bench (add to the `ui-ux-guide` skill)

These are new rules only. Hick, Miller, Fitts, Occam, Jakob and peak-end are already in the skill.

1. **Von Restorff:** at rest, Cobalt appears once per view, on the primary action. Links, tags and secondary actions are never Cobalt until hovered or focused.
2. **One amber per view:** the amber "needs you" count appears at full strength in one place. Every other scope uses the neutral count.
3. **Say it once (Occam + Selective Attention):** a state (paused, offline, limit, login) is stated in one primary place per screen. On Home that place is Atlas's message; elsewhere it's the banner. Other places show only a glyph.
4. **Mental model (CR-007):** a ticket exists only for the five kinds: destructive, payment, question, undecided decision, ready to test. Everything else is automatic and shown in the trace and in "Decided by Atlas".
5. **Jakob:** clicking an agent's face or name anywhere opens that agent's profile and settings.
6. **Similarity:** one icon means one scope. App settings and agent settings never share an unlabelled icon.
7. **Tesler:** never ask the client to choose what a default or Atlas can choose (model, folder, autonomy). Default first, change later.
8. **Hick + Cognitive Bias:** every choice comes preselected with the recommended option and names who recommends it, except options that cost money, act outward or can't be undone.
9. **Peak-End:** in a worst moment, the agent you are talking to says first what happened, when it resumes and what was kept. The chrome only echoes it.
10. **Doherty:** every client action gets visible feedback within 400 ms. Any wait over 10 s says why and that nothing is lost.
11. **Goal-Gradient + Zeigarnik:** multi-step work shows "n of m" and never fakes progress. Only counted tickets open a loop; FYI never shows a count.
12. **Common Region:** cards nest at most one level deep.
13. **Proximity:** a control sits next to the thing it changes. An agent's settings sit next to the agent's face.
14. **Flow:** never block the composer. The client can always type, queue or stop while agents work.
15. **Postel:** free-text inputs accept natural language and show the parsed draft before saving.
16. **Parkinson:** anything time-boxed shows its clock, and every request shows an estimate (time, % of the week).
17. **Serial Position:** the most important item goes first, the way out last. In the top bar, usage sits left and "Needs you" far right.
18. **Paradox of the Active User:** no tours. Help is one line, beside the decision it explains.
19. **Aesthetic-Usability:** validate with timed tasks on the working prototype before polishing. Polish hides missing paths (F2 was found by use, not review).
