# Client feedback: UI direction samples v0.1, round 1 (2026-10-22)

Screenshots shared: Noor's Routines tab (a giant clock icon), Noor's Settings tab, "What needs me", the top bar.

| # | Feedback (verbatim) | Action |
|---|---|---|
| U1 | "the routine screen looks bad" | Bug: the routine icon renders huge (unsized SVG). Redesign Routines as a proper list: name, schedule, next run, last run and its cost, a **pre-run estimate** (CR-003 M2), a **read-only badge** (M4), an on/off toggle, "New routine" from plain language |
| U2 | "the bot settings is minimal and doesn't represent our requirement" | Rebuild agent Settings to cover the BRD: Profile (avatar, name, title, description, home team, lead), Model, Autonomy (preset + per-tool overrides + grants with Revoke), Connectors (from the inventory), Skills (built-in library, CR-005), Memory (private notes, checkpoint threshold 50–85% with a fixed 90% ceiling), Workspace (folder grants, browser agent opt-in, CR-004), Notifications, Lifecycle (pause, archive, duplicate without memory, loan, delete as a reserved action) |
| U3 | "the option to create a project is gone I want it back" | Restore "+ New project" (sidebar and Home) |
| U4 | "I want to be able to collapse a project view in the panel and open it wherever I want" | Projects in the sidebar are collapsible groups. A project can be opened in the main area, a **split pane**, or a **separate window** (right-click / drag) |
| U5 | "home screen should show the current projects not teams now" | Replace "Team now" with a **Projects** section: one card per active project (sprint/day, progress, team avatar stack, needs-me count) plus a New project card |
| U6 | "I don't like the way the what needs me is displayed … the black or grey line between them, want them to appear as bubbles or tickets that when I tap on one it enlarge and the other become small" | "What needs me" items become **separate rounded tickets** (no divider lines). Tapping one **expands it** (details + actions); the others **shrink** to compact one-line tickets |
| U7 | "I believe the top bar could be better more minimal modern and clean design" | Redesign the top bar: fewer boxes and borders; a quiet usage indicator; "Needs me" as a minimal badge; more air |

Also: *"you do it"* → the PM ran the local skills update script (caveman v4.0.1, taste-skill 2.1.4, 24 stale skills moved to a backup).
