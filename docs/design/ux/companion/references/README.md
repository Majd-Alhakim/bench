# References: the Eucas companion

Saved while researching [ux-research.md](../ux-research.md). All seen **2026-10-26**.

**Licence rule.** Refero and Mobbin screenshots belong to the apps shown and are served under each service's own terms, so **no screenshots are copied into this repo**. Each row is a link; open it on Refero or Mobbin (both need an account). The Refero style captures below are our own condensed notes of the style references, with the source named, not a copy.

**Tooling notes.**
- The `refero-design` skill is **not installed** in this environment. The Refero MCP itself worked; nothing was installed (as instructed).
- Refero covers **web** and **iOS** only. It has no screens of desktop agent managers (Conductor, episko, Superset, Claude Code agent view, Cursor agents window) and no Windows tray UI. Those come from vendor docs and pages in [ux-research.md](../ux-research.md) §2.
- Mobbin covers web and iOS. Its web catalogue has good AI-agent dashboards (tasks needing approval, usage meters).

## Style captures (Refero)

| File | Source | Why it's here |
|---|---|---|
| [style-linear-changelog.md](style-linear-changelog.md) | linear.app/changelog, Refero style `11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6` | The calmest dark dev-tool chrome in the set: depth from tone steps, no shadows, one weight step for headings |
| [style-warp.md](style-warp.md) | warp.dev/terminal, Refero style `40a9c295-7a6f-48b3-ae15-2c4d171cf8fb` | Near-monochrome with **one** rare accent; the product UI is the hero; slow, weighty state transitions |

## Screens and flows

### Needs-you inbox and approvals
| Product | Link | Observation | Use |
|---|---|---|---|
| Cofounder (Mobbin) | [screen](https://mobbin.com/screens/f54f6423-ce18-4844-b335-35878733403b) | A small floating **Inbox** card: "Requests", each row "Marketing Agent requested review · 10m ago", a "Desktop alerts" toggle in the card header, a footer "2 agent updates · Review" | Steal: the inbox as a small card, not a page; the alert toggle where the alerts are |
| Relevance AI (Mobbin) | [screen](https://mobbin.com/screens/63d33c52-d5a2-46c1-8441-a87a381ea758) | Tasks with tabs "All tasks 17 · To review 4 · Escalated · Errored"; amber "Pending approval" pills with a glyph; plan meters in the sidebar ("176 remaining /200", "Resets in 24 days") | Steal: counts on tabs, amber + glyph + word; meter with its reset in one line |
| Gumloop (Mobbin) | [screen](https://mobbin.com/screens/29b5231e-a1f2-4850-b265-561cd710aceb) | Task filters "All · Completed · Approval Required · Failed"; credits remaining bar pinned bottom-left | Same state vocabulary as agent view; meter always visible but small |
| Deel (Mobbin) | [screen](https://mobbin.com/screens/b6d82ee0-8694-4f55-a1d5-9f0964c8b13c) | "Action required 72" with a menu **"Approve all your pending (71)"** | **Avoid** for Eucas: bulk approve is the exact failure the guard exists to prevent |
| Juicebox (Mobbin) | [screen](https://mobbin.com/screens/0e5bf5bf-e8f9-4dc9-a311-9635a8dd1886) | Modal "Your Tasks", Pending (7), each row with a filled primary and two secondaries | Avoid: three buttons per row, the primary repeated 7 times |
| Jace AI (Refero) | [screen](https://refero.design/pages/141b9b34-309d-463f-a2ff-b400ef320699) | Dark inbox, date-grouped rows, an **Undo** toast top-right after "mark done" | Steal: undo toast after every triage action |

### Usage meters and forecasts
| Product | Link | Observation | Use |
|---|---|---|---|
| Claude settings › Usage (Mobbin) | [screen](https://mobbin.com/screens/ea02c392-d84c-4ce0-81bb-66d7bda183b3) | "Current session · Starts when a message is sent · 0% used"; "Weekly limits · All models · Resets Tue 5:00 AM · 21% used"; "Last updated: just now" with a refresh glyph | **Parity:** use the user's own vocabulary (session, weekly, resets at) and show data freshness |
| Luma AI (Mobbin) | [screen](https://mobbin.com/screens/933c13eb-cc70-4012-b1e2-17d426415ed4) | Credits as a stacked bar by type, then "With your remaining 2,390 credits, you can generate around 597 images or 14 videos" | **Steal:** translate a percentage into work left ("about 3 more runs like this one") |
| OpenAI Platform limits (Mobbin) | [screen](https://mobbin.com/screens/8cf8d3eb-515b-4ff9-b14c-dddcfb207adf) | "March budget $0.09 / $5.00 · Resets in 29 days" with "Add alert" / "Edit budget" | Pro budgets: the budget, its reset and its alert on one card |
| StackAI usage (Mobbin) | [screen](https://mobbin.com/screens/a2976bbf-d4f1-407f-8c56-88779215f037) | Segmented tick meters with a sentence each ("You have used 10 runs today") | Sentence + meter beats meter alone |
| Cohere spending limit (Refero) | [screen](https://refero.design/pages/0316cb1c-3c50-4af2-8ca1-fd84b004d901) | A $10 monthly cap, progress bar, Edit / Remove | Pro budget editing |
| Rox billing (Refero) | [screen](https://refero.design/pages/332bb354-d2fc-459d-b563-5388e5a65222) | Over-limit usage as a **red** bar with a gold Upgrade pill | **Avoid:** alarm colour on money, upsell glued to the alarm |

### Status, heartbeat and audit
| Product | Link | Observation | Use |
|---|---|---|---|
| Zendesk status (Refero) | [screen](https://refero.design/pages/7957c520-682f-4b22-ba1d-d86b77ed661c) | "No incidents" summary, 90-day bars per service, recently resolved incidents | Steal: the heartbeat strip (time-bucketed bars) for "guard checks per session" |
| OpenSea status (Refero) | [screen](https://refero.design/pages/fb3699de-33c3-4017-8a6d-089b8edbd7e7) | Green "All Systems Operational" banner + service list + past incidents | The calm state still shows its evidence (history), not only a green word |
| Stripe security history (Refero) | [screen](https://refero.design/pages/4e3c7127-e1de-4c73-afde-17cda3defb5a) | Chronological security log, filters, export, expandable rows with detail | Steal: the protection log is a filterable, exportable list with expandable rows |
| PayPal block contact (Refero) | [flow 7394](https://refero.design/pages/f51a8f06-f0ff-4a36-869f-619fba6e9ae1) | Confirm modal names the person and what stops; success states what is now blocked; "Blocked contacts" list with Unblock | Steal: every block is listed and reversible from where you see it |

### Onboarding
| Product | Link | Observation | Use |
|---|---|---|---|
| Rox agent initialisation (Refero) | [screen](https://refero.design/pages/6d41af23-9de8-49ef-b31e-30fd26fc729e) | Dark, near-black onboarding step that lists setup items with status badges as they complete | Steal: a calm checklist that fills in by itself while you watch |
| Factory onboarding (Refero) | [flow 7723](https://refero.design/flows/7723) | 19 screens: sign-up, email code, org name, platform pick, GitHub, local Bridge, welcome, dashboard | **Avoid:** 19 steps before any value; Eucas needs no account at all |
| Airtable onboarding (Refero) | [flow 1533](https://refero.design/flows/1533) | 28 screens incl. a payment step before the workspace | Avoid: payment inside first run |
| Mapbox editor tour (Refero) | [flow 9679](https://refero.design/flows/9679) | Welcome modal then a 4-step coach-mark tour | Avoid: tours that explain UI instead of showing the user's own data |
| n8n data tables (Refero) | [flow 9540](https://refero.design/flows/9540) | Starts on an empty state, then import, mapping, table | The empty state is the import: Eucas's equivalent is the retro reading history |
