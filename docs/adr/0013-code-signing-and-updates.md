# ADR-0013: Code signing (D-3) and auto-update channels

- **Status:** Proposed (2026-10-26), with **D-3 decided: v0.1 ships unsigned (option E), with signed updates and published hashes** (CR-010, founder 2026-10-26). Authenticode (route A, or B if a company exists) comes once revenue covers it, **or before the public launch if the waitlist is large** (founder, 2026-10-26; amendment at the end); the options table below is that later plan.
- **Date:** 2026-10-26

## Context
Signing matters three times for a safety tool: SmartScreen on download, the **UAC prompt** in first run (grey "verified publisher" vs yellow "unknown"), and antivirus reputation for `eucas-guard.exe`, which Claude Code starts thousands of times a day. EV certificates no longer skip SmartScreen (since 2024); reputation builds per publisher over days to weeks either way. Since June 2023, publicly trusted code-signing keys must live on hardware (a token or a cloud HSM), which decides whether CI can sign. The founder is **outside the USA and Canada**, which rules out Azure Artifact Signing as an individual.

## Options for a founder outside the USA and Canada
Prices are list prices seen in 2026 and **must be re-checked at purchase**. Routes A–D are the plan for when Authenticode is bought; E is the v0.1 choice (CR-010, founder 2026-10-26).

| Route | Eligible? | Cost (approx.) | Signs in CI? | Notes |
|---|---|---|---|---|
| **A. OV certificate with a cloud signing service** (for example SSL.com eSigner, Certum SimplySign, Sectigo via a reseller with cloud HSM) | Yes, as an individual or a sole trader, after identity validation | ~$130–$400 a year for the certificate, plus ~$0–$30 a month for cloud signing at our volume | **Yes** for services with an API or CLI signer and a TOTP seed stored as a CI secret; **no** for ones that need a phone tap per signature | Publisher name is the founder's legal name unless a company exists |
| B. Azure Artifact Signing (formerly Trusted Signing) as an **organisation** | Only with a registered legal entity in a supported country and Microsoft's identity validation | ~$9.99 a month (Basic) | Yes (GitHub Action) | Cheapest and best CI fit **if** a company is formed; the publisher shows the company name ("Eucas Labs" as in the UI mock) |
| C. SignPath Foundation (free for open source) | **Unlikely while the licence is FSL** (it asks for an OSI licence); ask them | $0 | Yes | Re-check if the licence changes |
| D. Certum Open Source Code Signing for individuals | Yes, individuals worldwide; aimed at open-source authors | ~€30–€70 a year plus a card or SimplySign | Partly (SimplySign needs a mobile confirmation) | Cheap, slow to automate |
| **E. Unsigned (no Authenticode)** | — | $0 | — | **The v0.1 choice** (CR-010, founder 2026-10-26). Yellow "Unknown publisher" UAC prompt, SmartScreen on download, less antivirus reputation; see Consequences |

## Decision
- **v0.1: route E, unsigned** (CR-010, founder 2026-10-26). No Authenticode on any binary. What stays signed or checkable:
  - **Updates** are signed with the Tauri updater's Ed25519 key, so a tampered update is rejected.
  - **Installer SHA-256s** are published on the site and with each GitHub release (`SHA256SUMS`), and the README says how to check one.
  - **The elevate helper** is checked by a **pinned SHA-256**, embedded in the app build, before the first-run UAC step (SYSTEM-DESIGN §5.6, SECURITY-PRIVACY T7), instead of an Authenticode check.
- **Later: route A** once revenue covers it, choosing a provider whose cloud signer runs headless in GitHub Actions, signing only in the `release` job inside the protected `production` environment; **B** instead if the founder has formed a company by then (cheaper; company name on UAC). The release workflow keeps a pluggable `signCommand` so turning signing on is a secret and one line (CI-CD §6).
- **What gets signed once Authenticode is bought (SHA-256, RFC 3161 timestamp):** the NSIS installer, `Eucas.exe`, `eucas-guard.exe` (both copies), `eucas-elevate.exe`, and the uninstaller. CI then verifies every signature with `signtool verify /pa /all` before publishing.
- **Updates: the Tauri updater**, with its own Ed25519 key (separate from any Authenticode credential; offline, stored in the founder's password manager and as a CI secret only in `production`). Manifests are served by `GET /v1/updates/{channel}/{target}/{version}` (ADR-0012) from GitHub Release assets.
- **Channels:** `stable` (from `main` tags `vX.Y.Z`), `beta` (from `staging` tags `vX.Y.Z-beta.N`). The founder dogfoods `beta`. Updates download in the background and install on the next quit or at a quiet moment (no session running); the guard keeps working through an update because Claude Code holds no lock on it beyond each short run (installer retries a locked file 3×, then schedules it for reboot and says so).
- **The limits guard in Program Files updates only with a UAC prompt**, and only when its version changes (rare); release notes say "this update asks Windows for permission once".

## Consequences
- **v0.1 (unsigned, CR-010, founder 2026-10-26):**
  - SmartScreen warns on every download until Authenticode exists (reputation can't build without a publisher). The download page and README show the real dialog and the "More info → Run anyway" steps (UX screen 0) and how to check the published SHA-256.
  - The first-run UAC prompt is **yellow and says "Unknown publisher"**. It can't prove to the user that the prompt is ours, so the protection moves into the app (the pinned-hash check of the helper) and Program Files ACLs after install; the UacFrame copy can no longer tell the user to press No on "Unknown publisher".
  - **Less antivirus reputation for `eucas-guard.exe`**: a higher chance of false-positive quarantine (which fails closed, SYSTEM-DESIGN §7.1) and possibly slower scans on each start (BUILD-PLAN risk 5).
  - Each new release is a new set of binaries with no publisher identity tying them together; the updater key and the published hashes are the only chain of trust.
- Losing the updater key strands every install, so there are two sealed backups and a documented rotation path (a release signed by the old key that ships the new public key).
- Re-evaluate SignPath if the licence moves to an OSI licence at v1.

## Amendment 2026-10-26 (SP-H1 finding 6, SP-ST1 finding 7)
- **Measured unsigned behaviour:** an unsigned guard with a Mark-of-the-Web runs normally when Claude Code starts it (16 ms, no prompt); SmartScreen gates only Explorer launches. Once installed, the app and guard run from `%LOCALAPPDATA%` without prompts. The updater round trip works unsigned and refused a tampered manifest.
- **Smart App Control (SAC) blocks unsigned executables.** New Windows 11 installs ship it in evaluation or on. With SAC on, the unsigned installer doesn't run at all. In evaluation it can switch on later, and then every tool call fails closed (a brick). **So:** setup's detection reads `HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy\VerifiedAndReputablePolicyState` (0 off, 1 on, 2 evaluation) and **refuses to install the guard when it isn't 0**, with a plain reason, until releases are signed. The heartbeat re-reads it daily and at start: if SAC turns on, the session state becomes `failing` with the "Off for 15 minutes" escape and the uninstall path. Authenticode signing is what lets SAC users in; how many people that excludes is a launch question (BUILD-PLAN §6).
- **The cold-start cost (130–196 ms) recurs after every guard update** (Defender scans the new file); the core's warm-up run absorbs it (ADR-0009 amendment).
- **The installer creates a Start-menu shortcut carrying Eucas's AUMID** (toast buttons route back only with it; SP-ST1).
- The download page and README keep the SmartScreen "More info → Run anyway" steps.

## Amendment 2026-10-26 (founder: signing before launch)
- Founder, on code signing and Smart App Control: *"we will see regarding signing, if we had a lot of people in the waitlist then I might do the signing before launch to avoid this"*.
- **Recorded as:** whether Authenticode signing (route A, or B with a company) is bought **before the public launch is decided on the waitlist size**. The **fallback trigger stays**: sign before launch, or as soon as possible after it, if more than ~10 % of early installs hit Smart App Control (BUILD-PLAN §6 question 3). v0.1 is still planned unsigned (route E) until one of the two fires; turning signing on stays a secret and one line (`signCommand`, CI-CD §6).
