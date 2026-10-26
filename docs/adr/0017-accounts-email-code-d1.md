# ADR-0017: Eucas accounts: email + one-time code, short-lived signed tokens, D1, Cloudflare Email Service

- **Status:** Accepted (2026-10-26, Gate 6 decision 4a); proposed 2026-10-26. Requirement: [CR-012](../requirements/change-requests/CR-012.md) (approved 2026-10-26: everyone signs in; the email is asked ~~**after the retro**~~ **after the four limits are locked**, setup step 6 since the reorder below). **Amends ADR-0012** (the server now has accounts) and ADR-0015 (what the server keeps). **Revised 2026-10-26** with the founder's decisions: sign-in is mandatory (*"don't allow to access without sign in"*), no device count, a keyed email hash on delete, Gmail-alias normalisation for the trial, and the product-news consent flag (*"accept all the tech lead recommendations"*, BUILD-PLAN §6). **Revised again 2026-10-26 (founder, *"okay do that"*):** in setup, the four limits and their lock (the one UAC prompt) come **before** sign-in, so a PC is protected even while setup waits at sign-in; everything else still needs sign-in (SYSTEM-DESIGN §5.6).
- **Date:** 2026-10-26

## Context
CR-012: every install signs in to a Eucas account in setup, Free included. The account is an email plus a one-time code (no password). It holds the supervisor budget, the trial entitlement (one per account), the plan (Pro and the founders' $15 for life belong to the person, BR-117), the waitlist and the mailing list, **and nothing about your work**. The guard, limits, tripwire and rules never read it; only model calls (drafting, supervisor) and the plan check do. **Sign-in is mandatory** (founder, 2026-10-26): there is no way to use Eucas without it, but ~~once signed in,~~ protection works offline **from the lock at setup step 4, before any sign-in** (it never needs an account token). Your Claude login is never touched (ADR-0002).

This replaces two stopgaps: the per-IP rate limit as the only key for a Free install's drafts (ADR-0012 "Open"), and "one trial per verified email + device binding" (CR-011 §5).

**Numbers.** About 1,000 new accounts a month at launch (cost study); each sign-in sends one email, plus resends and sign-ins on other PCs: **< 3,000 emails a month**, but a launch day can bring **hundreds of sign-ups in one day**. Every model call reads the account (budget), so auth adds no separate lookup.

## Options
**Sign-in method:**
| | Secret we store | Phishing / reuse risk | Setup time |
|---|---|---|---|
| Password | A hash per user | Reuse, resets, breach target | Longer; a reset flow |
| Magic link | None | Link opens in a browser, not the app: a hand-off back to the panel | Similar; awkward on a desktop app |
| **6-digit code by email** | A short-lived hash of the code only | Low; the code is useless after 10 minutes | ~30 s (CR-012: setup 4:30 → 5:00) |
| OAuth (Google/GitHub) | Provider ids | Low | Fast, but a browser round trip and a third party per user |

**Email provider** (prices seen 2026-10-26):
| | Cost at our volume | Limits that matter | Fit |
|---|---|---|---|
| **Cloudflare Email Service** (`send_email` binding) | 3,000 a month included with **Workers Paid** ($5/month), then $0.35 per 1,000 | **No daily cap** documented; arbitrary recipients need Workers Paid; Email Sending is **beta** | Same vendor and account as the Worker, D1 and DNS; no API key to store or rotate; SPF/DKIM set up in the same dashboard |
| Resend | Free: 3,000 a month | **100 emails a day** on Free (a launch day breaks sign-up); Pro $20/month | A second processor holding every email address; one more secret |

## Decision
**Email + 6-digit code; the Worker issues short-lived HMAC-signed tokens; accounts live in Cloudflare D1; codes are sent with Cloudflare Email Service, with Resend as a configured fallback.**

**Why Cloudflare Email Service:** no daily cap (Resend Free's 100 a day would refuse sign-ups on a launch day, and sign-up is in setup); no API key in the Worker; one vendor and one data processor for everything the server touches; and the $5 Workers Paid plan it needs is already required once the trial makes model calls from v0.1 (ADR-0018; D1 writes at that volume exceed the Free plan too). Because Email Sending is beta, `EmailSender` is an interface with two implementations, and `email.provider` in signed config switches to Resend (its key held as a Worker secret, unused until needed) without a release.

**Routes** (all JSON, `.strict()` zod, ≤ 2 KiB bodies):
| Route | Body → result | Rules |
|---|---|---|
| `POST /v1/auth/start` | `{ email }` → `202 {}` | Normalises the email (trim, lower-case); the code goes to the address as typed. Refuses a disposable domain with `422 disposable_email` (trial abuse, below). Creates or replaces one pending code: 6 digits from a CSPRNG, stored as `HMAC(key, email ‖ code)`, **expires in 10 minutes**, at most **5 tries**. **Same response whether or not the account exists** (no enumeration). Limits: 3 codes per email per hour, 10 per IP per hour (Workers rate-limiting binding), plus a global daily send cap in config |
| `POST /v1/auth/verify` | `{ email, code, newsOptIn: bool }` → `{ accessToken, refreshToken, account: { plan, meter } }` | Constant-time compare; a 6th wrong try deletes the code. On success: deletes the code, creates the account if it's new (plan `free`, period `pending`; the trial starts when setup finishes, ADR-0018). `newsOptIn` comes from the **unticked "Send me product news"** box (founder, 2026-10-26): `true` sets `news_opt_in = 1` (consent to product emails); `false` never clears an earlier consent (withdrawal is the unsubscribe link in every product email). ~~`newDevice`, `device_count`~~: removed 2026-10-26, no device count is stored |
| `POST /v1/auth/refresh` | `{ refreshToken }` → `{ accessToken }` | Checks the account still exists and the token's `epoch` matches |
| `POST /v1/auth/signout` | access token → `204` | Bumps `token_epoch`: every token for this account stops working (all devices; one person, few devices) |
| `POST /v1/trial/start` | access token → `{ meter }` | Called once when setup finishes (founder, 2026-10-26: the trial "starts when setup finishes"); moves `pending` → `trial` and inserts the account's `trial_claim` key (below). Idempotent: a repeat, an account whose trial already ran (`trial_used`), or an email whose `trial_claim` key already exists (an alias, or a deleted account signing up again) just gets the current meter, as `taste` (one trial per normalised email) |
| `GET /v1/account` | access token → `{ email, plan, planUntil?, meter }` | What Settings › Account shows |
| `DELETE /v1/account` | access token → `204` | Deletes the account row and any pending code (CR-012 "Delete account"). **Keeps only the `trial_claim` key** (a keyed hash, no email), so the same email gets no new trial; the delete page says so (founder, 2026-10-26, U-4). **On Pro or the Founders' price, the Lemon Squeezy subscription is cancelled at once, with no partial refund**, and the page says so (U-5). Local data stays until uninstall; the panel then shows only sign-in |

**Tokens:** `v1.<base64url payload>.<base64url HMAC-SHA256>`, signed with a Worker secret that only the Worker verifies (the app never needs to). Payload `{ sub: accountId, kind: "access" | "refresh", epoch, plan, iat, exp }`. **Access: 1 hour**, sent as `Authorization: Bearer` on every model route. **Refresh: 60 days.** Both die on sign-out (epoch) and on delete (no row). On the PC both are stored with `CryptProtectData` (user scope), never in the DB, logs or the renderer (SECURITY-PRIVACY §6).

**Every model route requires a valid access token** (`/v1/draft-rule`, `/v1/supervise`, `/v1/meter`). The supervisor is always on for every user (founder, 2026-10-26), so **every signed-in install makes model calls**; a signed-out install is rules only, and its panel shows only sign-in. The per-IP limit stays **only for abuse** (bursts, scripted sign-ups), never as the budget key.

**D1 schema (the whole of what the server keeps per person):**
```sql
CREATE TABLE account (
  id TEXT PRIMARY KEY,                -- random, 128-bit
  email TEXT NOT NULL UNIQUE,         -- normalised
  plan TEXT NOT NULL,                 -- free | pro | founder
  plan_until INTEGER,                 -- end of the paid period (Pro, Lemon Squeezy)
  period_kind TEXT NOT NULL,          -- pending | trial | taste | pro   (ADR-0018)
  trial_used INTEGER NOT NULL DEFAULT 0,
  period_start INTEGER NOT NULL, period_end INTEGER NOT NULL,
  used_micro_usd INTEGER NOT NULL DEFAULT 0, reserved_micro_usd INTEGER NOT NULL DEFAULT 0,
  token_epoch INTEGER NOT NULL DEFAULT 0,
  waitlist_at INTEGER, news_opt_in INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL);
CREATE TABLE trial_claim (email_key TEXT PRIMARY KEY);              -- HMAC(trial key, trial-normalised email); survives Delete account
CREATE TABLE auth_code (email TEXT PRIMARY KEY, code_hmac TEXT NOT NULL, expires_at INTEGER NOT NULL, tries INTEGER NOT NULL DEFAULT 0);
CREATE TABLE spend_day (day TEXT PRIMARY KEY, micro_usd INTEGER NOT NULL);   -- server-wide circuit breaker, no user key
```
`auth_code` rows live ≤ 10 minutes (deleted on use; an hourly cron deletes expired ones). No IP, no user agent, no content, no event history and **no device count** is stored (dropped 2026-10-26). `news_opt_in` is set only by the unticked "Send me product news" box at registration (founder, 2026-10-26): an account email isn't consent to marketing, so without it the account gets account emails only (codes, trial ending, plan changes).

**Trial identity (founder, 2026-10-26, tech lead recommendations accepted).** `trial_claim.email_key` = `HMAC-SHA256(trial key, normalise(email))`, where `normalise` lower-cases, drops a `+tag` on every domain, and on `gmail.com` / `googlemail.com` drops dots and maps to `gmail.com`. It is used **only** for "one trial per account"; the code still goes to the address as typed, and the account's `email` is stored as typed (trimmed, lower-cased). The key is a Worker secret, so the hash can't be reversed with a dictionary of common addresses without it. It is not a device fingerprint and holds nothing about your work.

**Offline and server-down:** the guard, limits, tripwire, rules, heartbeat and canary never read the account (the guard has no network code at all, CODE-STRUCTURE §3). Without the server: no drafting (the guided exact-rule form instead), the supervisor asks you, the meter shows "unreachable", and the last known plan is trusted for 7 days. ~~**Setup (founder, 2026-10-26, BRD §10 #57):** online, signing in is **required to finish setup**; offline, the step offers **"Sign in later"**: the guard and rules install and work, and drafting and the supervisor wait until you sign in (the panel keeps one quiet "Sign in" line). The trial starts at the end of setup only for a signed-in account; for "Sign in later" it starts when the sign-in completes.~~ **Setup (revised, founder, 2026-10-26: *"don't allow to access without sign in"*):** sign-in is **mandatory** and there is **no "Sign in later"**. Offline (or with the server or email provider down) at the sign-in step, setup **waits there**: "You need to be online to sign in. Pip will start once you're connected." with **Retry** and **Back**; nothing past the step is written. ~~so protection installs only after the first sign-in. **After the first sign-in, the guard works offline**~~ **Reordered 2026-10-26 (founder, *"okay do that"*):** setup is 1 Find your sessions · 2 Make your Euca · 3 Your week · 4 Lock the four limits (the one UAC prompt) · 5 Watch it block a test · 6 Sign in · 7 Choose your rules · 8 What is sent · 9 Pip is watching. So a PC that waits at step 6 is **already protected**: the guard and the four limits work **from the lock at step 4, before any sign-in, with no account token at all** (the guard never reads the account), and so do the tripwire and, once chosen, the rules. Only the four limits and their lock moved; library rules, your own rules, drafting, the supervisor, Usage and Rules editing still need sign-in, and there is still no "Sign in later". **Signed out** (Sign out or Delete account): the panel shows **only sign-in**; the guard, the four limits and everything locked in managed settings keep protecting, because the locks live in the PC's managed settings and turning safety off on sign-out would be unsafe (founder, *"yes"*); the supervisor, drafting, Usage and Rules editing need sign-in.

**Pro, after v0.1:** Lemon Squeezy checkout carries `custom_data.account_id`; its signed webhooks (`subscription_created/updated/cancelled/expired`, verified with the webhook secret) set `plan`, `plan_until`. A cancelled subscription runs to `plan_until`, then the plan returns to `free` (founder, 2026-10-26); a founder who returns keeps `founder` pricing because the plan belongs to the account. Licence keys aren't needed once accounts exist.

## Trial abuse (founder, 2026-10-26: "Apply 2 and 3")
- **(2) A new account starts from zero, on the PC.** Everything local that makes Eucas *yours* is keyed to the signed-in account: learned items ("What Pip knows"), your rules (`rulebook.json`), history, receipts, the ledger, suggestions, the Euca's name and look. Each lives in a **profile folder** `%LOCALAPPDATA%\Eucas\profiles\<p>\` (`<p>` = SHA-256 of the account id, so the folder name doesn't reveal the email), with its own `eucas.db` and `rulebook.json`. **A different account on the same PC starts empty; nothing is synced to the server.** Rules:
  - Data made before the first sign-in (the setup retro is computed, not stored; the Euca made in step 2; the lock choices of step 4) is **adopted by the first account that signs in on this PC**. A later, different account gets a fresh profile.
  - Switching accounts swaps the active profile and recompiles `rulebook.bin` from that profile's rulebook. The previous profile stays on disk (not synced, not shared) and comes back if that account signs in again; Remove Eucas and "Clear history" delete all profiles.
  - **Protection doesn't follow the account.** The four limits (compiled into the guard) and anything locked in managed settings are machine-level and stay whatever account is signed in. Signing out keeps the last profile's rules in force, so protection never drops on sign-out. **A new account sees machine-locked rules as "Locked on this PC"**, read-only; unlocking asks for admin as today (founder, 2026-10-26). **Only block rules can be locked** (ADR-0007, ADR-0010; confirmed 2026-10-26).
- **(3) Disposable addresses are refused** at `POST /v1/auth/start` with `422 disposable_email` and the copy key `account.email.disposable`: *"Please use an address you'll keep. This one expires."* (The answer depends on the domain only, so it reveals nothing about accounts.)
  - **Source:** the public [`disposable-email-domains`](https://github.com/disposable-email-domains/disposable-email-domains) list (`disposable_email_blocklist.conf`, CC0, thousands of domains, community-maintained with an allowlist of false positives).
  - **How it ships and updates:** a weekly scheduled workflow fetches the list at its latest commit, regenerates `apps/api/src/generated/disposable-domains.ts` (a sorted array, binary-searched; ~100 KB, inside the 1 MB bundle budget) and opens a PR into `dev` with the diff and the upstream commit SHA. It ships with the next Worker deploy; nothing is fetched at runtime. Our own `config/disposable-allow.txt` overrides false positives.
  - Matching: the email's domain and every parent domain (`x.mailinator.com` matches `mailinator.com`), case-folded, after IDNA normalisation.
- **Rejected: one trial per PC via a hashed machine id.** Eucas stores **no device fingerprint** and, since 2026-10-26, **no device count**. The trial stays **one per account** (one per normalised email, `trial_claim`), and its hidden cost cap (~$0.50, ADR-0018) plus the daily circuit breaker bound the abuse.

## Consequences
- The server now stores email addresses. The baseline §1 amendment and the privacy line change (SECURITY-PRIVACY §2); the founder approved the line with CR-012, then revised it on 2026-10-26: *"When Pip isn't sure, it sends the waiting session's last message, trimmed and with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC. Your account holds only your email, your plan and how much supervisor help you've used."* (the device count is dropped, so the line is complete).
- One trial per account is only as strong as one account per person. Disposable addresses are refused and Gmail-style aliases normalised (above); real throwaway inboxes on other domains can still mint trials, each costing at most the trial cap (~$0.50), with the daily circuit breaker bounding the total; and a new account starts empty on the PC, so farming trials costs the abuser their rules and history (founder, 2026-10-26). A deleted account's email can't start a new trial (`trial_claim` survives the delete, founder, 2026-10-26).
- Setup gains a step (CR-012: ~30 s), and it **blocks** offline or when the server or email provider is down. ~~so a PC isn't protected until its first sign-in~~ Since the reorder (founder, 2026-10-26) the block comes **after** the four limits are locked and tested (steps 4–5), so an outage delays the account, drafting and the supervisor, never protection; the guard, limits and canary must therefore pass their tests with no account and no token (TESTING §4). The code email must arrive in seconds. Deliverability (SPF, DKIM, DMARC on `eucas.app`; Gmail, Outlook, iCloud inboxes) is checked in spike SP-AC1 before AC-1.
- Workers Paid ($5/month) starts at v0.1 instead of at Pro. The running-cost study's "$1.18 before Pro" becomes about $6.18 (flagged to the PM).
- Every model call already reads the account row for its budget, so the token check adds no extra D1 round trip.

**Data location (founder, 2026-10-26, *"yes"*):** the accounts D1 database is created with the **EU jurisdiction**, so account data is stored and processed only in the EU. This is set at creation time and can't be changed later. The eucas.app waitlist D1 database is EU too (see `apps/landing/DEPLOY.md`).
