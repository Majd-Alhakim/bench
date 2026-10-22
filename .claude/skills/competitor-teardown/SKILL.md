---
name: competitor-teardown
description: Evidence-based product teardown ("black-box reverse engineering") of competitors and reference products, adapted from the REA reverse-engineer-anything method. Use before a BRD is baselined (the /teardown step), when the client names a product to learn from, or when strategy needs refreshing. Produces a finding ledger, a probable architecture, Steal/Avoid/Beat recommendations and open unknowns.
---

# Competitor Teardown

Method adapted from **REA, "Reverse Engineer Anything"** (github.com/morluto/rea, MIT): its investigation planning, summary-first work, and strict observation / inference / unknown evidence discipline. REA's *tools* (binary decompilers, JS/Electron extraction, runtime capture) are **not** used on competitors' products. See the legal boundary below.

## Legal and ethical boundary (non-negotiable)
- **Allowed evidence:**
  - official docs, help centers, changelogs and release notes, pricing pages
  - announcement posts, keynotes, public talks, demos and videos
  - public repos and SDKs
  - reviews and forums (HN, Reddit, vendor forums)
  - job posts, patents, app-store listings
  - what the client observed while using a product under its normal terms
- **Not allowed on third-party proprietary products:**
  - decompiling, disassembling, deobfuscating or extracting app bundles
  - intercepting or replaying their network traffic
  - bypassing logins, rate limits or paywalls
  - scraping against the terms of service
  - using leaked material

  Most vendor terms forbid these. **For Anthropic products this could also put the client's account at risk** (ADR-0002).
- REA's deep tools are fine on **our own** code and builds, or on open-source software whose license allows it.
- If a question can only be answered by a forbidden method, record it as **Unknown** and name the method; don't do it.

## Workflow
1. **Scope.** Target product(s), the decision this informs (e.g. the BRD for project X), and the date. Read existing research first (`docs/research/`) and don't repeat it.
2. **Question checklist.** Turn the job into questions, each naming the evidence it needs. The standard set:
   - product model and core objects
   - visible architecture (models, runtime, where it runs)
   - memory and context
   - integrations and connectors
   - automation and scheduling
   - collaboration and multi-agent mechanics
   - approvals, safety and security boundaries
   - visibility and transparency
   - pricing and metering, cost complaints
   - onboarding and first-run friction
   - UX patterns and emotional design (avatars, presence, notifications)
   - platforms
   - release cadence and roadmap signals
   - what users love and hate
3. **Summary first.** Start with the broadest official overview. Then follow each question from its entry point (docs page, feature announcement) to its result. Expand only where a concrete gap remains.
4. **Parallelize.** One worker per product or independent question set. Each returns sources, conclusions and gaps.
5. **Finding ledger.** Every claim is a row: `Finding | Type (Observation / Inference / Unknown) | Evidence (URL + date) | Confidence (H/M/L) | Search boundary`. Never present an inference as an observation. A negative search is bounded ("not found in docs X, Y as of date"), never "doesn't exist".
6. **Reconstruct.** A probable architecture or flow diagram (Mermaid), **labelled as an inference**.
7. **So what.**
   - **Steal:** what to copy, with a design note for our product.
   - **Avoid:** their mistakes and the complaints about them.
   - **Beat:** where our principles let us do clearly better.
   - **Parity:** the minimum we must match.
8. **Close the checklist.** Mark each question answered, partially answered or unresolved. List the open unknowns and what evidence would resolve them.
9. **Feed downstream.** Turn the recommendations into proposed BRD items (marked "from teardown, needs client approval") and a short strategy delta. **Never add requirements without client approval.**

## Output
- `docs/research/teardowns/<product>.md`: one per product
- `docs/research/teardowns/README.md`: an index with the date, products and headline Steal/Avoid/Beat
- A strategy delta: update `docs/research/competitive-brief.md` or write `docs/research/strategy-<date>.md`

## Freshness
Every teardown carries its date. This category changes monthly, so re-run before each BRD baseline and at least once per release.
