# ADR-0013: Code signing (D-3) and auto-update channels

- **Status:** Proposed (2026-10-26). **The signing route is the founder's decision (D-3)**; this ADR recommends one and lists the rest.
- **Date:** 2026-10-26

## Context
Signing matters three times for a safety tool: SmartScreen on download, the **UAC prompt** in first run (grey "verified publisher" vs yellow "unknown"), and antivirus reputation for `eucas-guard.exe`, which Claude Code starts thousands of times a day. EV certificates no longer skip SmartScreen (since 2024); reputation builds per publisher over days to weeks either way. Since June 2023, publicly trusted code-signing keys must live on hardware (a token or a cloud HSM), which decides whether CI can sign. The founder is **outside the USA and Canada**, which rules out Azure Artifact Signing as an individual.

## Options for a founder outside the USA and Canada
Prices are list prices seen in 2026 and **must be re-checked at purchase**.

| Route | Eligible? | Cost (approx.) | Signs in CI? | Notes |
|---|---|---|---|---|
| **A. OV certificate with a cloud signing service** (for example SSL.com eSigner, Certum SimplySign, Sectigo via a reseller with cloud HSM) | Yes, as an individual or a sole trader, after identity validation | ~$130–$400 a year for the certificate, plus ~$0–$30 a month for cloud signing at our volume | **Yes** for services with an API or CLI signer and a TOTP seed stored as a CI secret; **no** for ones that need a phone tap per signature | Publisher name is the founder's legal name unless a company exists |
| B. Azure Artifact Signing (formerly Trusted Signing) as an **organisation** | Only with a registered legal entity in a supported country and Microsoft's identity validation | ~$9.99 a month (Basic) | Yes (GitHub Action) | Cheapest and best CI fit **if** a company is formed; the publisher shows the company name ("Eucas Labs" as in the UI mock) |
| C. SignPath Foundation (free for open source) | **Unlikely while the licence is FSL** (it asks for an OSI licence); ask them | $0 | Yes | Re-check if the licence changes |
| D. Certum Open Source Code Signing for individuals | Yes, individuals worldwide; aimed at open-source authors | ~€30–€70 a year plus a card or SimplySign | Partly (SimplySign needs a mobile confirmation) | Cheap, slow to automate |
| E. Unsigned | — | $0 | — | Yellow UAC on a safety tool. **Rejected** |

## Decision (recommended)
- **v0.1: route A**, choosing a provider whose cloud signer runs headless in GitHub Actions, signing only in the `release` job inside the protected `production` environment. If the founder forms a company before launch, switch to **B** (cheaper; company name on UAC).
- **What gets signed (Authenticode, SHA-256, RFC 3161 timestamp):** the NSIS installer, `Eucas.exe`, `eucas-guard.exe` (both copies), `eucas-elevate.exe`, and the uninstaller. CI verifies every signature with `signtool verify /pa /all` before publishing.
- **Updates: the Tauri updater**, with its own Ed25519 key (separate from Authenticode; offline, stored in the founder's password manager and as a CI secret only in `production`). Manifests are served by `GET /v1/updates/{channel}/{target}/{version}` (ADR-0012) from GitHub Release assets.
- **Channels:** `stable` (from `main` tags `vX.Y.Z`), `beta` (from `staging` tags `vX.Y.Z-beta.N`). The founder dogfoods `beta`. Updates download in the background and install on the next quit or at a quiet moment (no session running); the guard keeps working through an update because Claude Code holds no lock on it beyond each short run (installer retries a locked file 3×, then schedules it for reboot and says so).
- **The limits guard in Program Files updates only with a UAC prompt**, and only when its version changes (rare); release notes say "this update asks Windows for permission once".

## Consequences
- Early users still see SmartScreen for a while; the download page says so with the real dialog (UX screen 0).
- Losing the updater key strands every install, so there are two sealed backups and a documented rotation path (a release signed by the old key that ships the new public key).
- Re-evaluate SignPath if the licence moves to an OSI licence at v1.
