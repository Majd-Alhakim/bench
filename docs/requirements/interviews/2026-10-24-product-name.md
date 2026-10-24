# Product name: Eucas (2026-10-24)

Closes D-UI5 (the name). This came out of a brainstorm on 2026-10-23 and 2026-10-24. "Bench" stays the codename in the repo until the rename task (below).

## Decision
- **Name:** **Eucas**, pronounced "you-kuz". It's written in lowercase in the lockup (`eucas`).
- **The characters:** one agent is **a Euca** ("you-ka"), and the team is **the Eucas**, the way one Smurf is part of the Smurfs. The product is named after the team. Atlas is your first Euca.
- **Origin:** from *eucatastrophe*, Tolkien's word for the sudden turn in a story that saves the hero from doom and ends happily.
- **Client's words:** *"whenever a user is stuck with an Idea, or facing a challenge in building an app, a Euca is the exact character who pops up to save the day and turn a disaster into a win"*.
- **History:** the client first chose **Euca** (*"Yes. Record Euca as the product name (characters are Eucas)…"*). The trademark search then found EUCA registered for software in the EU and UK (below), so the client switched to **Eucas**: *"Make the product name Eucas (one character is a Euca), update the docs, then make the repo public."*

## Why it fits
- **The why:** ideas die half-built and keep coming back. The client wants to see them through, in their own control, and feel proud to share them. A eucatastrophe is that turn from doom to a happy ending.
- **The client's naming rules:** one word, easy to say and remember, a meaning close to the why, not generic, and free by the realistic bar (no one in AI, agents or app building uses it, no well-known brand, a usable domain). It also has to carry a slogan and a campaign.
- **It matches the domain** the client already owns: `eucas.app`.
- **Slogan to test:** *Every idea deserves a happy ending.* Content format: people share their own "eucatastrophe", the moment a stuck project turned around.
- **Lore rule (PM):** **you** stay the hero. The Eucas are the crew that turns your story around while you decide, test and accept. They don't take over (BR-86, CR-008).

## Trademark search (2026-10-24; a first search, not legal clearance)
| Search | Result |
|---|---|
| USPTO, `EUCAS` | No marks |
| WIPO Global Brand Database, `EUCAS` (exact) | 2 results, both a Korean construction company's (classes 6, 7, 19, 21, 35, 37, 40), **expired / ended** |
| USPTO, `EUCA` | No class 9 or 42 marks. Live: soaps (class 3, Australia), sippy cups (class 21, pending) |
| WIPO, `EUCA` (exact, 117 results) | **EUCA, Holland Brands B.V., EU and UK registrations (2019), classes 9, 14, 16, 25, 35, 36, 38, 41, 42.** EUCA Match (Australia), classes 35 and 42, pending |
| USPTO, `EUKA` (sound-alike) | Essential oils only (classes 3, 5). Euka AI has no registration |


**Second search (2026-10-24, WIPO Global Brand Database, fuzzy and phonetic, live marks in classes 9 or 42):**
- Spelled alike: LUCAS (ZF, Jolife: vehicle and medical equipment), EURAS (Germany), EuCAP (UK, an antennas conference). Nothing close to EUCAS for software.
- Sound alike: **EUCOS** is the nearest. It's registered in class 9 by several Chinese electronics sellers (EU, UK, US, Canada, Australia, Japan, Mexico): devices, not software services. Then AUCAS (cables, class 9, EU and UK) and AICAS (a German real-time Java company, classes 9 and 42, pronounced "eye-kas"). EUKAS and EUCAZ exist, but not in 9 or 42.
- **Reading (not legal advice):** no live mark found would clearly block EUCAS for a software app and its services. EUCOS is the one a trademark lawyer should look at before you file or sell anything.

The Holland Brands registration is why the product isn't "Euca". A Euca as one character, inside the Eucas product, is a lower risk, but have it checked before using "Euca" alone as a brand in the EU or UK.

## Freedom check (2026-10-24, web search + DNS)
- No app, startup or brand named Eucas was found.
- **Domain:** **`eucas.app` is ours** (see follow-ups). `eucas.com` is registered by someone else.
- **npm:** `eucas` and `euca` are free.
- **GitHub:** `github.com/eucas` is an old personal account (2016); the org name `euca-app` is free.

## Risks (accepted by the client)
| Risk | Severity | Mitigation |
|---|---|---|
| **EUCA** is registered for software in the EU and UK (Holland Brands B.V.) | Medium for "Euca" alone; low for "Eucas" | The product is Eucas. Check before using "Euca" alone as a mark there |
| **Euka AI** (San Francisco, 2024; TikTok Shop affiliate marketing) sounds like one Euca | Low | Different spelling and field; no registration found |
| **Eucalyptus** (Australian digital-health company, part of Hims & Hers, often "Euc"); the word reads like the plant | Low | The Tolkien origin story leads every first touch; no plant imagery |
| Pronunciation on first read | Low | Onboarding and the site say "you-kuz" once |

## Follow-ups
1. **Trademark: two searches done** (above): no blocking mark found for EUCAS in software. Have a lawyer clear it (EUCOS especially) before filing or any commercial use.
2. **Domain: done.** The client bought **`eucas.app`** at Cloudflare on 2026-10-24. Confirmed through the Cloudflare API on 2026-10-24: auto-renew on, WHOIS privacy on, transfer lock on; expires 2027-10-24. No site yet; a landing page can be GitHub Pages pointed at it.
3. **GitHub org and npm: done (2026-10-24).** The client created the GitHub organization **`eucas-app`** (it matches eucas.app); moving the repo into it is optional and still open. The npm package **`eucas`** 0.0.1 is published under the client's account `majd-alhakim`: a placeholder with a README pointing to the repo. **`euca`** is deliberately not claimed, because of the EU/UK EUCA mark.
4. **Rename task:** product copy, the prototype, the README and the app name move from "Bench" to "Eucas". Package and repo names follow at S1-1. The codename stays in code until then.
5. Convert the lockup's live text to outlines before shipping `logo/lockup.svg`.
