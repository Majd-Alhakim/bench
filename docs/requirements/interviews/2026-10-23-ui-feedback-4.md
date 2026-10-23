# Client feedback: v0.4 round 4 (2026-10-23)

| # | Client (verbatim / condensed) | Action |
|---|---|---|
| F1 | "how I could edit my main bot name and style? and what is the thing that makes them special?" | Atlas (the main agent) gets a clear profile/settings entry (name, shape, colour, model) and a visible statement of what makes it special: the front door, routes work, holds company memory, brings you what needs you, hires agents, can't be deleted |
| F2 | "the setting menu for the agent in chats is gone! I cant find it; is the theme option now?" | Agent settings must be easy to find from any chat (e.g. click the agent's name/avatar in the header → profile & settings, plus the panel gear). Make the bottom-left icon's purpose obvious (it is app settings/theme, not agent settings) |
| F3 | "every agent to have a small title next to their name that appears on the side menu only when expanded and it is optional; add it when creating an agent or remove it from agent profile; so I know what each agent role is" | Optional agent **title** (e.g. "Developer"): set in New agent, edit/remove in Profile; shown next to the name in the expanded sidebar only |
| F4 | Only major things need the client; merging/committing automatic; called for testing | [CR-007](../change-requests/CR-007.md) |
| F5 | "make an agent have a look at all the UX design laws here https://lawsofux.com/ and apply them" | Laws of UX audit + fixes |
| F6 | "I want to see the onboarding and setup screens" | Sent the current five first-run screens; refine with F1 (naming and styling Atlas in setup) |
| — | Invoked `/design-taste-frontend` | Apply its app-screen run and house rules (`references/app-screens.md`) and its inspector in `--app` mode |

## Laws of UX audit: client decisions (2026-10-23)
All four confirmed ("yes"): context meter in the agent panel and in the chat only from 60 % · For-your-info items move into Atlas's chat as a quiet line · Noor's demo moment is "Ready to test" (a file deletion shown elsewhere) · footer reads "Settings" next to the client's initial.
Also: sending emails and posts as the client is automatic (CR-007 updated).
