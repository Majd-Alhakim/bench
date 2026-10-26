# Pre-mortem teardown: Eucas companion, market lens (2026-10-26)

**Target:** our own planned first release, the "Eucas companion" (Windows-first desktop companion for Claude Code sessions; FSL; Free + Pro $10/mo or $96/yr; goal $0 to $2k MRR; solo founder, 5 h/week on business).
**Lens:** market, demand, pricing and distribution only. Product and engineering risks are out of scope except where they decide whether people pay.
**Premise:** it is April 2027, six months after launch, and the companion has failed. Why?
**Builds on (not repeated here):** [competitive-brief-companion-2026-10-25.md](../competitive-brief-companion-2026-10-25.md) (the field of 15+ managers, Anthropic's agent view, VibeHandler, Vibe Kanban, Conductor), [2026-10-25-dogfooding-one-agent-runs-a-team.md](../2026-10-25-dogfooding-one-agent-runs-a-team.md), [competitive-brief.md](../competitive-brief.md).
**Method:** the `competitor-teardown` skill. Public web evidence only (official docs, survey pages, vendor pages, news, GitHub pages). No scraping, no decompiling. Every row is typed. Searches ran on 2026-10-26; "not found" means "not found in the searches named", never "doesn't exist".

---

## 1. Finding ledger

| # | Finding | Type | Evidence (URL, date read 2026-10-26) | Conf. | Search boundary |
|---|---|---|---|---|---|
| **Demand** |||||
| D1 | Anthropic's own guidance calls running 3–5 Claude sessions in parallel "the biggest productivity unlock". Parallel work is the official recommended pattern, not a niche hack. | Observation | https://support.claude.com/en/articles/14554000-claude-code-power-user-tips | H | Anthropic help center |
| D2 | No public figure exists for the share of Claude Code users who run several concurrent sessions. | Unknown | Searches on survey data, Anthropic posts, Economic Index news | H (that it is unknown) | Web search; only Anthropic telemetry would answer this |
| D3 | Stack Overflow 2025: Claude Code is used regularly by 9.7% of all respondents (10% of professionals, 11.3% of professionals who use AI). | Observation | https://survey.stackoverflow.co/2025/technology | H | SO 2025 survey page, Dev IDEs section |
| D4 | Stack Overflow 2025: about 23% use AI agents at least weekly (14.1% daily); 52% don't use agents or stick to simple AI tools; 38% have no plans to. | Observation | https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/ ; https://thenewstack.io/23-of-devs-regularly-use-ai-agents-per-stack-overflow-survey/ | H | Survey data is mid-2025, so the 2026 share is higher |
| D5 | Claude Code weekly active users doubled between 1 Jan and Feb 2026; run-rate revenue over $2.5B; absolute WAU not published. | Observation | https://simonwillison.net/2026/Feb/12/anthropic/ (quoting Anthropic's Series G post) | M | Secondary quote of the primary announcement |
| D6 | The pain is real and stated in users' own words: an Ask HN poster is "exhausted by context switching" with 2–3 agents; the top fix offered was "run fewer agents in parallel". | Observation | https://hn.svelte.dev/item/47797632 | M | One thread; mirror of HN |
| D7 | The most common answer to the pain is to **run fewer agents**, not to buy a manager. Part of the pain resolves through behaviour, not tools. | Inference | From D6 plus the free-tool abundance in the 25 Oct brief | M | — |
| D8 | Anthropic shipped, free: agent view (`claude agents`) with needs-input grouping, a "2 awaiting input" count, notifications, reply-from-peek, background supervision, automatic worktrees, `--json` state. Still "research preview". | Observation | https://code.claude.com/docs/en/agent-view | H | Docs page, first 100k chars read |
| D9 | Agent view instructs background sessions to "never push to main/master, force-push, or merge" before finishing. This is a prompt instruction, not an enforced block. | Observation (text) / Inference (not enforced) | https://code.claude.com/docs/en/agent-view | M | Docs only; not tested |
| D10 | Anthropic redesigned the Claude Code desktop app on 14 Apr 2026 around parallel sessions: a sidebar of all sessions, filters by status, auto-archive on PR merge, panes, side chats; Pro, Max, Team, Enterprise. | Observation | https://claude.com/resources/articles/claude-code-desktop-redesign | H | Article does not mention notifications or Windows explicitly |
| D11 | Anthropic ships Claude Code features at about 6 releases a week; each of the companion's free features (inbox, notch, forecast, hard limits) is one or two Anthropic releases from parity. | Inference | ../teardowns/claude-code.md (release cadence); D8, D10 | M | — |
| D12 | "Babysitting" will shrink, not vanish, as models improve: longer autonomous runs mean fewer interrupts per session but more sessions per person. The pain moves from "answer prompts" to "review and merge output" and "stay within limits". | Inference | D1, D8, Vibe Kanban's stated thesis that engineers now spend more time planning and reviewing (https://vibekanban.com/shutdown) | M | — |
| **Willingness to pay** |||||
| W1 | Freemium self-serve: 3–5% is "good", 6–8% "great"; developer-focused companies converted at about half the rate of non-developer companies (median about 5% in Lenny's data set). | Observation | https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion | M | Data set is VC-backed SaaS, not indie desktop tools; definition of the denominator varies |
| W2 | Consultancy benchmarks put developer tools at 1–3% (Monetizely) or 4.1% (First Page Sage via Fungies). Unverified methodology. | Observation (of claims) | https://www.getmonetizely.com/articles/whats-the-right-ratio-of-free-to-paid-users-in-developer-saas ; https://fungies.io/saas-free-trial-vs-freemium-which-converts-better-2026.md | L | Vendor blogs |
| W3 | Only concrete funnel data point found: WaveMaker 0.8% download-to-paid (700 of 90,000). Old, single company. | Observation | https://www.infoworld.com/article/2313481/how-wavemaker-added-700-customers-in-9-months.html | L | 2010-era article |
| W4 | **ccusage** (19.2k stars, the most popular Claude Code usage tool) has 22 current GitHub sponsors and is at 52% of a $200/month goal, i.e. about $104/month. | Observation | https://github.com/sponsors/ryoppippi | H | Sponsors page; other income unknown |
| W5 | Star-to-sponsor conversion for the closest adjacent tool is about 0.1% (22 / 19,200), and it delivers about 5% of our $2k target. Sponsorship cannot carry the goal. | Inference | W4 | H | — |
| W6 | **Vibe Kanban** (28.5k stars, "thousands" of daily users) shut down 10 Apr 2026: "the vast majority are free users"; "we couldn't find a business model that we could get excited about". | Observation | https://vibekanban.com/shutdown | H | Vendor page |
| W7 | Conductor charges $50/month for cloud workspaces, Mac only, and is venture-funded. The only visible paid price point in the category above €5 is tied to cloud compute, not to local supervision. | Observation (from 25 Oct brief) / Inference (the pattern) | ../competitive-brief-companion-2026-10-25.md | M | Not re-checked today; conductor.build search returned noise |
| W8 | VibeHandler: same shape as ours (free up to 3 agents, €5 Pro, Windows), 0 upvotes, 2 comments, #157 on its Product Hunt day; no vendor site found. | Observation | https://webmail.hunted.space/product/vibehandler | M | Third-party PH mirror |
| W9 | episko (free, MIT, Windows, has a 5-hour/weekly forecast and "N need you") still has 19 stars and 2 forks. Free and good-on-Windows does not create a pull by itself. | Observation | https://github.com/respeak-io/episko | H | GitHub page |
| W10 | Target users already pay Anthropic $20–200/month; $10 is 5–50% of that. Price level is not the barrier; the perceived gap over free Anthropic features is. | Inference | Plan structure (https://www.morphllm.com/claude-code-usage-limits); D8, D10 | M | — |
| **Pricing math** |||||
| P1 | Lemon Squeezy fee is 5% + 50¢ per transaction (more outside the US). | Observation | https://www.lemonsqueezy.com/pricing | H | Pricing page |
| P2 | Net per payer: monthly $10 → about $9.00; annual $96 → about $90.70/yr = $7.56/mo. At a 50/50 mix, about **242 paying customers** for $2k net MRR (223 if all monthly, 265 if all annual). | Inference (arithmetic) | P1 | H | Excludes VAT handling and refunds |
| P3 | Active free users needed for 242 payers: **~6,000 at 4%, ~12,000 at 2%, ~24,000 at 1%**. With 5% monthly churn, about 12 new payers a month are needed just to stand still at 242. | Inference (arithmetic) | P2, W1–W3 | M | Churn rate assumed, not sourced |
| P4 | "First 200 payers keep the price for life" means ~83% of the target base is permanently at the launch price. Fine at $10; a trap if the price has to rise. | Inference | P2 | H | — |
| P5 | A "3 sessions free" limit sits at the bottom of Anthropic's own recommended 3–5 range (D1); a user who runs 3 never hits it, and VibeHandler used the same cap without traction (W8). | Inference | D1, W8 | M | — |
| P6 | Under FSL, users may run and modify the software for nearly any purpose except competing with the producer. A user can legally remove a session cap in a local build for their own use. | Observation (licence summary) / Inference (consequence) | https://fsl.software/ | M | Licence summary page, not the full text |
| P7 | Whether per-task budgets with auto-pause can be enforced in **interactive** sessions without reading credentials is unproven; native caps are headless-only and the request for interactive caps (#66048) was closed as stale. | Observation (native caps) / Unknown (our feasibility) | ../competitive-brief-companion-2026-10-25.md §3 | M | Needs a spike, not research |
| P8 | Anthropic doubled 5-hour limits for Pro/Max/Team in May 2026 and removed peak-hour reductions for Pro and Max. Limit pain, the core reason to buy budgets and forecasts, is eased whenever Anthropic loosens limits. | Observation (change, secondary) / Inference (effect) | https://pasqualepillitteri.it/en/news/5428/claude-code-weekly-usage-limit-bug-3-percent ; https://sandlabs.com.au/blog/claude-usage-limits-explained | M | Secondary sources |
| **Licence** |||||
| L1 | FSL is not OSI-approved; GitButler (adopted FSL ~Aug 2024) could not call itself "Open Source" and called "source available" "weak and misleading". | Observation | https://blog.gitbutler.com/gitbutler-is-now-fair-source | H | Vendor blog |
| L2 | The loud backlash cases (HashiCorp BSL → OpenTofu fork backed by 140+ orgs; Redis → Valkey; Elastic) were **relicensing** of previously open projects with large commercial ecosystems. | Observation | https://www.techtarget.com/searchitoperations/news/366610212/OpenTofu-OpenBao-reach-milestones-post-HashiCorp-BSL ; https://logz.io/blog/terraform-is-no-longer-open-source-is-opentofu-opentf-the-successor | H | News coverage 2023–2024 |
| L3 | Critics of Fair Source (e.g. ESR) target corporate legal sign-off, not individual developers; one 2026 conference talk frames FSL as source-available, not open source. | Observation | https://isitreallyfoss.com/projects/sentry ; https://fossunited.org/c/indiafoss/2026/cfp/65csphmuup | M | — |
| L4 | No independent data on whether FSL from day one reduces adoption of a small desktop dev tool. | Unknown | Searches on FSL adoption | H (that it is unknown) | — |
| L5 | For a solo indie tool, FSL from day one is a low adoption risk with individuals but a **real distribution risk**: it can't be listed as open source, the HN "is it open source?" thread is predictable, and it conflicts with the project's own earlier "open-source at v0.1" decision (CLAUDE.md). The non-compete protects against little: the field already has 15+ free clones. | Inference | L1–L4; CLAUDE.md "Founder answers" | M | — |
| **Distribution** |||||
| X1 | The field has 15+ managers; the ones with traction are either venture-funded with teams (Conductor, Superset, Vibe Kanban) or early, free and open source (Claude Squad 8.7k, opcode 22.4k, Maestro 3.5k). The late, small entrants (episko 19, VibeHandler 0 upvotes) got almost nothing. | Observation (numbers) / Inference (pattern) | ../competitive-brief-companion-2026-10-25.md §2; W8, W9 | M | Star counts from 25 Oct |
| X2 | New Claude Code session tools keep appearing weekly (claude-fleet, claude-sessions, session-orchestrator, claude-code-wingman, claude-code-mcp). The noise floor rises every week. | Observation | https://github.com/exPardus/fleet ; https://github.com/hex/claude-sessions ; https://skills.cat/skills/yossiovadia/claude-code-wingman | H | One search |
| X3 | Even huge free traction (W6) did not convert; traction that did convert sold **cloud compute or teams**, not local supervision. | Inference | W6, W7 | M | — |
| X4 | 5 h/week covers about 3 posts, support replies and one release note. Build-in-public that breaks through usually needs daily posting plus a pre-existing audience. No data found on the founder's current X/Reddit reach. | Inference / Unknown (audience size) | — | M | Founder's audience not measured |
| X5 | Windows support issues (hooks failing open fixed in 2.1.300/309/310; Windows sandbox alpha) mean a Windows-first safety tool will generate a support load that eats the 5 hours. | Inference | ../competitive-brief-companion-2026-10-25.md §3 | M | — |
| **Windows wedge** |||||
| O1 | Stack Overflow 2025: Windows about 49.5% of professional developers' OS use, macOS 32.9% (multi-select). | Observation (secondary) | https://www.windowslatest.com/2026/09/22/microsoft-keeps-rebuilding-windows-for-developers-but-a-new-poll-puts-windows-at-just-12/ | M | Official OS table not visible on survey page fetch |
| O2 | Pragmatic Engineer poll, Sep 2026 (~4,000 on X; ~6,000 on LinkedIn), "mostly startups and Big Tech": macOS 61.6%, Linux 24.2%, **Windows 12.8%**. | Observation | same URL as O1 | M | Self-selected X/LinkedIn audience, the same bubble we'd reach by building in public |
| O3 | The early-adopter, multi-agent, build-in-public audience on X looks much closer to O2 than O1. Windows-first means aiming at about 12–25% of the audience the distribution plan reaches. | Inference | O1, O2; Conductor and Superset Mac-only by choice (25 Oct brief) | M | — |
| O4 | Windows is under-served (Conductor, Superset, Claude Squad have no Windows), so the companion faces less competition there. But the free Windows options that exist (episko, Pane, VibeHandler) haven't pulled users, which suggests limited Windows demand at this price, not just weak execution. | Inference | W8, W9; 25 Oct brief | L–M | — |
| O5 | No public figure for the OS split of Claude Code users. | Unknown | Search on Anthropic sources | H (unknown) | Only Anthropic telemetry |

---

## 2. Reconstructed failure path (inference)

```mermaid
flowchart TD
  A[Launch: Show HN, X, r/ClaudeCode] --> B{Gets noticed?}
  B -- "~70%: lost in weekly flood of managers (X1, X2)" --> Z1[Under 300 installs, posts stop at 5 h/week]
  B -- "noticed" --> C[Mac-heavy audience bounces: 'Windows only' (O2, O3)]
  C --> D[Windows users install free tier]
  D --> E{Free tier enough?}
  E -- "yes: 3 sessions, hard limits, inbox, forecast cover them (P5)" --> F[Happy free users, no reason to pay]
  E -- "no" --> G{Pro worth $10 over free Anthropic features?}
  G -- "budgets unproven in interactive sessions (P7); limits loosened (P8)" --> F
  G -- "yes" --> H[Pays: 1-3% of actives]
  F --> I[Anthropic ships an equivalent in agent view / desktop (D8, D10, D11)]
  H --> J["~50-150 payers by month 6 = $400-1,200 MRR (P2, P3)"]
  I --> K[Free users churn back to native]
  J --> L[Goal missed; founder time goes to Windows support (X5)]
```

*Labelled inference: the percentages are judgement, not data.*

---

## 3. Answers to the six questions

1. **Demand.** The pain is real and Anthropic itself promotes running 3–5 sessions (D1, D6). But it is (a) partly solved by behaviour (run fewer, D7), (b) being absorbed by Anthropic every few weeks (D8, D10, D11), and (c) shifting from "answer prompts" to "review output and stay under limits" (D12). **No public data on the share running concurrent sessions** (D2). Bounding it: ~10% of developers use Claude Code (D3), ~23% use agents weekly (D4); the multi-session power user is a minority of that. Persistent pain: yes. Persistent *unserved* pain: shrinking.
2. **Willingness to pay.** Realistic conversion for an indie, free-heavy, source-visible desktop tool is **1–3%** of active users (W1–W3), with the closest adjacent tool converting stars to money at about 0.1% (W5). $2k net MRR needs **~240 payers, so 8,000–24,000 active free users** (P2, P3). Nothing in the field reached that through build-in-public alone; the tools at that scale were venture-funded or years old, and the largest one died on free users (W6). Not reachable at 5 h/week without a breakout moment.
3. **Pricing traps.** $10 is not too high for people paying Anthropic $100–200 (W10); it is **too high relative to the perceived gap** over free (Anthropic + episko + ccusage). The 3-session cap barely bites (P5) and is legally removable under FSL (P6). Of the Pro features, only **budgets with auto-pause** is clearly a reason to pay, and its feasibility in interactive sessions is unproven (P7); the supervisor overlaps `/goal` and `TeammateIdle`; laptop-closed work wraps Anthropic's own Routines. Lifetime pricing for 200 locks most of the target base (P4).
4. **FSL.** Day-one FSL won't trigger a HashiCorp-style revolt (that came from relicensing, L2), and individuals rarely care (L3). The real costs: it can't be called open source on HN and Reddit, where that label is a distribution asset, it reverses the earlier "open source at v0.1" decision, and its non-compete protects against little in a field of free clones (L5). Net: a small adoption drag with almost no protective benefit. **Unknown** how big the drag is (L4).
5. **Distribution.** The winners started early, open and free, or had teams and funding; late small entrants got 0–19 stars (X1). The noise floor rises weekly (X2). At 5 h/week, Windows support (X5) competes with posting (X4). Traction that converted to money sold cloud or teams (X3).
6. **Windows wedge.** Windows is half of all professional developers (O1) but only about 13% of the startup/Big Tech poll audience (O2) that build-in-public reaches (O3). It is a real gap in competition (O4) but a small pond for the chosen channels, and free Windows tools in it haven't pulled users. **Claude Code's own OS split is unknown** (O5).

---

## 4. Failure modes

| Failure | How it happens | Likelihood | Kills users? | Kills buyers? | Early warning signal (measurable) | Prevention or fix | Can it be fixed? |
|---|---|---|---|---|---|---|---|
| **F1. Anthropic absorbs the free tier** | Agent view and the desktop app add notch-like presence, a usage forecast, enforced branch protection or deny-lists; each release removes a reason to install (D8–D11) | **H** | Yes | Yes (no funnel) | Weekly diff of the Claude Code changelog against our feature list; active users falling after an Anthropic release | Build only on what Anthropic structurally won't do: **user-written rules enforced outside the model, across all sessions, fail-closed**; read `claude agents --json` instead of rebuilding views | Partly |
| **F2. Too few free users to convert** | Launch lost in the flood of managers (X1, X2); founder posts 3 times a week; no breakout | **H** | Yes | Yes | Under 300 installs at launch +4 weeks; under 100 weekly actives at +8 weeks | Pick **one sharp story** ("the thing that stopped my agent pushing to main") with a reproducible demo video; launch on the day a relevant Claude Code incident trends; partner with a Windows-heavy community (e.g. .NET, game dev) | Partly |
| **F3. Free tier is good enough** | 3 sessions, hard limits, rules, inbox, forecast cover the median user; the cap doesn't bite (P5) | **H** | No | **Yes** | Under 15% of weekly actives ever hit a Pro gate; under 1% upgrade at +8 weeks | Gate on **value moments**, not counts: the first time a budget would have saved the user, show it. Move the session cap off the critical path | Yes |
| **F4. Pro isn't differentiated enough** | Supervisor ≈ `/goal` + `TeammateIdle`; cloud = Routines; history/export is weak; budgets don't work reliably in interactive sessions (P7) | **H** | No | Yes | Survey "what would you pay for" at 50 users; fewer than 30% name budgets or supervisor | **Spike budgets with auto-pause before launch**; if it can't stop an interactive session reliably, there is no Pro. Sell one thing well, not five | Partly |
| **F5. Windows-first misses the audience** | X/HN audience is ~60% Mac (O2); "Windows only" replies kill the launch thread | **M–H** | Yes | Yes | Share of launch-thread comments asking for Mac; waitlist OS split over 50% Mac | Ship a macOS build at launch or within 4 weeks (Electron makes it cheap); keep "fails closed on Windows" as the proof point, not the eligibility rule | Yes |
| **F6. Limits loosen, pain fades** | Anthropic raises limits again (P8) or adds its own budget cap (#66048 revived) | **M** | Partly | Yes (budgets lose urgency) | Anthropic limit announcements; forecast feature usage falling | Frame budgets around **cost per task and runaway loops**, not plan limits | Partly |
| **F7. 5 h/week is eaten by support** | Windows hook and shell quirks (X5) produce bug reports from a safety tool where every bug is serious | **M** | Yes (trust) | Yes | Over 50% of business hours on support for 3 straight weeks | Narrow the platform matrix; one supported shell; public "known limits" page; strict issue templates | Partly |
| **F8. FSL costs the open-source halo** | HN thread fixates on "not open source"; listing sites and awesome-lists exclude it (L1, L5) | **M** | Slightly | No | Share of top-level launch comments about the licence; exclusion from awesome-claude-code type lists | Use **open source (MIT/Apache) for the free core** and keep Pro code separate or FSL; or accept FSL and state the Apache/MIT date upfront | Yes |
| **F9. Lifetime price boxes in revenue** | The first 200 payers are ~83% of the goal at a fixed $10 (P4) | **L–M** | No | No (limits upside) | Payer count nearing 200 with net revenue per payer below $8 | Cap lifetime price at 100 or limit it to the annual plan | Yes |
| **F10. Trust event in a safety product** | One public case of a hard limit failing open | **L–M** | Yes | Yes | Any confirmed bypass report | Tests per hard limit on every Claude Code release; a public bypass bounty | Partly |
| **F11. Same shape as a failed entrant** | Free up to 3 + cheap Pro on Windows already failed (VibeHandler, W8) | **M** | — | Yes | Launch upvotes/comments within 2x of VibeHandler's | Lead with safety + rules, never "manage many agents" | Yes |

---

## 5. Kill criteria (recommended)

Measured from the public launch date (L). All counts are weekly actives by opt-in, anonymous ping, or, if there's no telemetry, by release download counts on GitHub as a proxy.

| By | Threshold that ends or pivots the idea |
|---|---|
| L + 4 weeks | Fewer than **300 installs** and fewer than **50 weekly actives** after a real launch (Show HN + r/ClaudeCode + X). **Action:** stop building Pro; decide to open-source fully as a portfolio piece or pivot to the full Eucas team app. |
| L + 8 weeks | Fewer than **150 weekly actives**, or fewer than **10 people** saying in the 50-user survey that they would pay for budgets/supervisor. **Action:** kill Pro as designed. |
| L + 12 weeks | Fewer than **20 paying customers** or free-to-paid under **1%** of weekly actives. **Action:** stop the paid plan; the $2k goal is out of reach on this path (P3). |
| L + 6 months | Net MRR under **$500**, or monthly paid churn over **8%**. **Action:** end the companion as a business. |
| Any time | Anthropic ships **enforced, user-editable deny rules across sessions** or **interactive budget caps** in Claude Code. **Action:** re-run this teardown within a week; if both are shipped, kill the companion. |
| Any time | Business-side work over **8 h/week** for 4 straight weeks to hold the numbers above. **Action:** the side-income premise is broken. |

**Go signals worth more than any of these:** 25+ unsolicited "how do I pay" messages before Pro exists, or one creator with 20k+ developer followers adopting it unprompted.

---

## 6. Steal / Avoid / Beat (market lens)

- **Steal:** Vibe Kanban's lesson in reverse: decide the paid feature *before* chasing stars (W6). Conductor's pattern: charge for what costs money to run or saves money, never for counts (W7).
- **Avoid:** VibeHandler's pricing shape and pitch (W8); a count-based gate in a source-visible app (P5, P6); relying on sponsorship (W4, W5); Windows-only messaging to a Mac-heavy channel (O2).
- **Beat:** be the only tool whose **rules are enforced outside the model and survive Anthropic's own UI changes**; sell **money saved** (budget stops that prevent a runaway) with a visible counter ("Eucas paused 3 runs this week, saving ~X% of your weekly limit").

---

## 7. Proposed BRD items (from teardown, needs client approval)

| ID | Proposal | Rationale | Evidence |
|---|---|---|---|
| PM-1 | **Gate Pro launch on a budget spike**: per-task budgets must reliably pause an interactive session, using only the status line, before Pro is announced. | If budgets don't work, Pro has no core; the other Pro items overlap free Anthropic features. | P7, F4 |
| PM-2 | **Replace the "3 sessions free" gate** with value-moment gating (budgets, cross-session supervisor) and no session cap, or a cap of 5+. | The cap barely bites and is legally removable under FSL. | D1, P5, P6, W8 |
| PM-3 | **Ship macOS at launch or within 4 weeks**; keep "fails closed on Windows" as a proof point, not the eligibility line. | The build-in-public audience is ~60% Mac; Windows-only shrinks the reachable pool to ~13–25%. | O1–O3, F5 |
| PM-4 | **Licence split:** MIT or Apache for the free core; FSL (or closed) only for Pro modules. Or, if FSL stays, state the conversion date in the README header. | Keeps the open-source halo on HN/awesome-lists; aligns with the earlier "open-source at v0.1" decision; FSL's non-compete protects little in this field. | L1–L5, F8 |
| PM-5 | **Adopt the kill criteria in §5** and add opt-in anonymous weekly-active telemetry (counts only) so they can be measured. | Without a weekly-active number, none of the thresholds can be checked. | §5 |
| PM-6 | **Limit "price for life" to the first 100 payers, or to annual plans only.** | 200 locks ~83% of the target base. | P4 |
| PM-7 | **A weekly Anthropic-overlap check** (changelog vs. our features) as a standing PM task. | Anthropic is the main competitor, releasing ~6 times a week. | D8–D11, F1 |
| PM-8 | **Launch positioning leads with safety + user rules**, never "manage many agents". | That pitch has already failed for others and is what Anthropic gives away. | W8, X1, F11 |

---

## 8. Checklist closure

| Question | Status |
|---|---|
| Q1 Demand and share running several sessions | **Partly answered.** Pain confirmed; share unknown (D2). |
| Q2 Conversion benchmarks and users needed | **Answered** (ranges, arithmetic); indie desktop-tool funnel data is thin. |
| Q3 Pricing traps | **Answered**, except budget feasibility (P7). |
| Q4 FSL perception | **Partly answered.** Qualitative evidence only; no adoption data (L4). |
| Q5 Distribution | **Partly answered.** Pattern clear; founder's audience size unknown (X4). |
| Q6 Windows share | **Partly answered.** General and bubble figures; Claude Code's own split unknown (O5). |

### Open unknowns and what would resolve them
- **Share of Claude Code users running 2+ concurrent sessions** (D2): only Anthropic telemetry; proxy via a poll in r/ClaudeCode or the Claude Discord (allowed, our own survey).
- **OS split of Claude Code users** (O5): same poll; or ask Anthropic DevRel.
- **Can interactive per-task budgets be enforced from status-line data?** (P7): a 1-day spike on our own build.
- **FSL's adoption cost for small tools** (L4): an A/B is impossible; ask 10 target users directly in the survey.
- **Founder's current reach** (X4): count followers and median post impressions on X/Reddit today; under 1,000 relevant followers means build-in-public alone won't reach 8,000+ actives in 6 months.
- **Anthropic's plans for interactive budget caps and enforced deny rules**: watch #66048 and the changelog.

---

## 9. Verdict for this lens

**Serious, partly fixable gap; close to fatal for the stated $2k MRR goal on this plan.**

The demand is real, but the *unserved* part is narrow and shrinking with each Anthropic release. The pricing math needs ~240 payers and 8,000–24,000 active users. That has not been reached by any comparable late, solo, build-in-public entrant; the largest free tool in the space shut down on free users, and the most popular adjacent tool earns about $100/month in sponsorship. Windows-first plus FSL plus a session-count gate each make the funnel smaller, and none of them makes the paid tier more desirable.

What is fixable: the gate (PM-2), the platform reach (PM-3), the licence halo (PM-4) and the pitch (PM-8). What is not fixable by us: Anthropic's pace (F1) and the founder's 5 h/week. The plan survives this pre-mortem only if **budgets with auto-pause work reliably** (PM-1) and the launch story is **safety rules Anthropic won't enforce for you**. Without that, treat the companion as a free, open portfolio piece that feeds the full Eucas app, not as a $2k/month business.

**Sources:** all URLs are inline in the ledger; read 2026-10-26.
