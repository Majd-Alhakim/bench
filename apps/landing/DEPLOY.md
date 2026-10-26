# Deploying eucas.app: the go-live runbook

Follow this on deploy day, top to bottom. Every step says **why** and links the Cloudflare doc it comes from (read 2026-10-26). Only you (the founder) run these steps: they need your Cloudflare sign-in, change DNS or deploy. Claude never runs them.

Time: about 1.5 hours, plus waiting for nameservers (minutes to hours) and DNSSEC (up to 1–2 days, runs in the background).

## The two decisions behind this runbook

**1. Workers with static assets, not Pages.** Cloudflare now says "Start new projects with Workers" ([Pages migration guides](https://developers.cloudflare.com/pages/migrations/)). Static asset requests are free on both and Function calls cost the same, so the price doesn't change ([migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). Workers adds what we need for a safe launch and Pages lacks: Workers Logs with query-string redaction, the rate-limiting binding, per-Worker scoped API tokens, version rollback, and Preview URLs that are off unless asked for ([compatibility matrix](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/#compatibility-matrix)). Nothing is deployed yet, so moving now costs nothing; moving later means a second cut-over. This PR already did it: `src/index.ts` is the Worker, `public/` the assets, and the four API handlers are unchanged.

**2. Git-connected deploys (Workers Builds), not `wrangler deploy` from GitHub Actions.** With Workers Builds, Cloudflare builds `main` itself, so no long-lived Cloudflare API token ever sits in GitHub, which matters for a public repo ([Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)). `main` only changes through reviewed PRs (the repo ruleset), so "push to main" is the release gate. If we ever need GitHub Actions instead (for example, to run the e2e check before deploy), use an account-owned token scoped to this one Worker with the **Editor** role ([Workers roles](https://developers.cloudflare.com/workers/authorization/workers/), [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)), kept in a GitHub `production` environment with a required reviewer, and give it a 90-day expiry.

## Before you start

- [ ] The PR with this file is merged and promoted to `main`.
- [ ] You have the registrar login for eucas.app, a password manager and an authenticator app or security key.
- [ ] In `apps/landing`: `npm ci` works.

## A. Lock the account (before anything else)

- [ ] **1. Turn on two-factor sign-in** for your Cloudflare user: *My Profile* → *Authentication* → a security key or an authenticator app. Save the backup codes in your password manager.
  Why: the account will hold the waitlist (people's emails) and the domain. A stolen password must not be enough. [2FA](https://developers.cloudflare.com/fundamentals/user-profiles/2fa/)
- [ ] **2. Review members**: *Manage Account* → *Members*. Only you, as Super Administrator. Remove anyone else. Repeat whenever someone gets access.
  Why: least privilege; every member can reach the list. [Manage members](https://developers.cloudflare.com/fundamentals/manage-members/)
- [ ] **3. Check API tokens**: *My Profile* → *API Tokens* and *Manage Account* → *Account API Tokens*. Delete any you don't recognise. Create none today; Workers Builds makes its own.
  Why: an unused token is an unwatched key. [Account-owned tokens](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/)

## B. Put the domain on Cloudflare

- [ ] **4. Add eucas.app** (*Add a domain* → Free). If your current DNS has DNSSEC on, **remove the DS record at the registrar first** and wait for its TTL (often 24–48 h), then change the nameservers to the two Cloudflare shows. Wait until the zone says *Active*.
  Why: changing nameservers with an old DS record in place makes the domain fail to resolve (SERVFAIL). [Change nameservers](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/), [pending nameservers](https://developers.cloudflare.com/dns/zone-setups/troubleshooting/pending-nameservers/)
- [ ] **5. Turn on DNSSEC**: *DNS* → *Settings* → *Enable DNSSEC*, then add the DS record it shows at your registrar (Algorithm 13). If the registrar is Cloudflare Registrar, this is automatic (1–2 days).
  Why: stops forged DNS answers that could send visitors, or confirm emails, to a fake site. [DNSSEC](https://developers.cloudflare.com/dns/dnssec/)
- [ ] **6. TLS settings**: *SSL/TLS* → *Overview* → **Full (strict)**. *Edge Certificates* → **Always Use HTTPS** on, **Minimum TLS Version** 1.2, **TLS 1.3** on.
  Why: a Worker has no origin today, but Full (strict) keeps any future origin encrypted *and* verified; Always Use HTTPS removes plain-HTTP sign-ups. [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/), [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [Minimum TLS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/)
- [ ] **7. HSTS: leave the zone setting off.** The site already sends `Strict-Transport-Security: max-age=31536000; includeSubDomains` (from `public/_headers` for pages, from `src/index.ts` for API answers). Turning it on in the dashboard too would send the header twice. **Don't add `preload`** and don't submit to hstspreload.org yet: preload is close to permanent and makes any subdomain without HTTPS unreachable.
  Why: HTTPS-only in browsers, without a promise we can't take back. [HSTS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/)

## C. Security rules for the zone

- [ ] **8. Check the Free Managed Ruleset is on**: *Security* → *Settings* → filter *Web application exploits*.
  Why: Cloudflare's rules for widely exploited bugs, free and safe to leave on. [Managed rules](https://developers.cloudflare.com/waf/managed-rules/)
- [ ] **9. One rate-limiting rule** (Free allows one): *Security* → *Security rules* → *Create rule* → *Rate limiting rules*. Name "waitlist sign-up". Expression `(http.request.uri.path eq "/api/subscribe" and http.request.method eq "POST")`, characteristic IP, **5 requests per 10 seconds**, action **Block**, duration 10 seconds.
  Why: scripts that skip the browser skip Turnstile's widget too; this stops floods before they reach the Worker. The Worker adds its own limit (10 POSTs a minute per IP and path) for the other API paths. [Protect forms](https://developers.cloudflare.com/use-cases/solutions/protect-sensitive-forms-fraud-abuse/), [rate-limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [ ] **10. Bot Fight Mode on**: *Security* → *Settings* → filter *Bot traffic* → *Bot fight mode*.
  Why: free challenge for known bot patterns across the domain. Caveat: it can't be skipped by rules. After step 18, test the one-click unsubscribe from a real Gmail inbox; if it fails, turn Bot Fight Mode off (Turnstile and the rate limit still protect the form). [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)

## D. Turnstile and the database

- [ ] **11. Turnstile widget**: *Turnstile* → *Add widget*: name "eucas waitlist", hostnames **only** `eucas.app` and `www.eucas.app` (no `localhost`; local runs use Cloudflare's test keys), mode Managed. Put the **site key** in `public/index.html` (`<meta name="turnstile-sitekey" content="…">`) through a PR; it's public. Keep the **secret key** in your password manager until step 14.
  Why: the server checks every token with siteverify (success, action `waitlist`, hostname) and refuses sign-ups if the secret is missing, so a skipped step fails safe instead of silently turning bot protection off. [Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [ ] **12. Create the database in the EU** from `apps/landing`:
  ```bash
  npx wrangler login
  npx wrangler d1 create eucas-waitlist --jurisdiction=eu
  ```
  > **This can't be changed later.** A jurisdiction is set only when the database is created. Forgetting `--jurisdiction=eu` means deleting and recreating the database (easy today while it's empty, painful later). Check with `npx wrangler d1 info eucas-waitlist` before going on.

  Why EU (founder decision, 2026-10-26): the list holds personal data (emails), and the companion's account database (ADR-0017) will be EU too, so both keep the same promise. The database then runs and stores data only in the EU; the Worker can still reach it from anywhere, so nothing else changes. Time Travel and `d1 export` work the same. We don't use read replication (one small table), so replica locations don't matter here. A jurisdiction replaces a location hint (it wins over `--location`). [Data location](https://developers.cloudflare.com/d1/configuration/data-location/)
  Put the printed `database_id` in `wrangler.toml` through a PR (the id isn't a secret). Then:
  ```bash
  npx wrangler d1 migrations apply eucas-waitlist --remote
  ```
  Why: migrations are versioned files in `migrations/`, applied once and tracked by D1, so the schema in the repo is the schema in production. [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [ ] **Know your backup**: D1 Time Travel can restore the database to any minute of the last **7 days** on the Free plan (30 days on Workers Paid). For anything older, export:
  ```bash
  npx wrangler d1 export eucas-waitlist --remote --output waitlist-YYYY-MM-DD.sql
  ```
  The export contains every email: keep it out of the repo and in an encrypted folder. It's also how you export the list for yourself, or send one person a copy of their row, as `/privacy` promises. [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)

## E. The Worker

- [ ] **13. Connect the repo with Workers Builds**: *Workers & Pages* → *Create* → *Import a repository* → GitHub → install the Cloudflare app for **only** `eucas-app/eucas`. Settings:
  - Project name `eucas-landing` (must match `name` in `wrangler.toml`)
  - Production branch `main`, path / root directory `apps/landing`
  - Build command `npm ci && npm run typecheck && npm test` (a failing test stops the deploy)
  - Deploy command `npx wrangler deploy`
  - **Builds for non-production branches: off.** Previews would bind to the same production database.

  Why: one deploy path, no token in GitHub, and the build fails closed on a broken test. [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [ ] **14. Add the secrets** (never in the repo, chat or a screenshot). From `apps/landing`:
  ```bash
  npx wrangler secret put TURNSTILE_SECRET
  npx wrangler secret put RESEND_API_KEY
  ```
  Paste the value when it asks. Or use *Worker* → *Settings* → *Variables and Secrets* → type **Secret**. Don't add plain variables in the dashboard: the next deploy replaces them with `[vars]` from `wrangler.toml`.
  Why: secrets are encrypted and never shown again after saving. [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [ ] **15. Custom domains**: *Worker* → *Settings* → *Domains & Routes* → *Add* → *Custom domain* → `eucas.app`, then `www.eucas.app`. Cloudflare creates the DNS records and the certificate. `workers.dev` and preview URLs stay off (`wrangler.toml`), so every request goes through the zone's rules from section C.
  Why: a `*.workers.dev` address would skip the zone's WAF and rate-limit rules. [Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [ ] **16. Logs are on with tokens redacted.** `wrangler.toml` turns on Workers Logs (`[observability]`) with `redact_query_string = true`, because confirm and unsubscribe links carry the row's token in `?t=`. Free keeps logs 3 days. See them under *Workers & Pages* → *Observability*.
  Why: you can see errors on launch day without logging anything that could unsubscribe someone. [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)

## F. Email

- [ ] **17. hello@eucas.app**: *Email* → *Email Routing* → enable, then route `hello@eucas.app` to your inbox (verify the destination). It adds the MX and SPF records for the root domain.
  Why: the page, privacy note and errors point people to this address. [Email Routing](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)
- [ ] **Resend (optional, recommended)**: resend.com → *Domains* → add `eucas.app` (pick the EU region if it offers one, to match the database), then add exactly the records it lists in Cloudflare *DNS* (DKIM, plus SPF and MX on its sending subdomain). Keep **one** SPF record per name. Create an API key with **sending access only, for this domain only**, and store it as `RESEND_API_KEY` (step 14).
- [ ] **DMARC**: *Email* → *DMARC Management* → enable. It adds a `_dmarc` record that starts at `p=none` and collects reports. After 2–4 weeks of clean reports (Resend and Email Routing both pass), change it to `p=quarantine`.
  Why: stops others sending mail as eucas.app, which protects the confirm emails' inbox placement. [DMARC Management](https://developers.cloudflare.com/dmarc-management/)

### Sending more than 100 emails a day, and list updates

Resend's free plan sends **100 emails a day** (3,000 a month). The code already handles a busy day: past the cap, people are still stored (as `unconfirmed`) and the page tells them they're on the list; only their confirm email is missing.

| Option | Cost | Daily limit | Fit |
|---|---|---|---|
| **Resend Free** (today) | $0 | 100 | Fine until a launch post |
| **Resend Pro** | $20/month, 50,000 a month | No daily cap | Predictable for a launch week; no code change, just upgrade |
| **Cloudflare Email Service** | Needs Workers Paid ($5/month): 3,000 included, then $0.35 per 1,000 | New accounts start on a **conservative daily quota that grows with reputation**; Email Sending is **beta** and meant for transactional mail | Same vendor as everything else, no API key. Needs a code change (the `send_email` binding) |

**Recommendation:** launch on Resend Free. **Before the first big launch post, upgrade to Resend Pro for that month**: it's the only option with a known, high daily limit on day one. Move the confirm email to Cloudflare Email Service later, together with the companion (ADR-0017 picks it for sign-in codes), once Workers Paid is on and the account's sending quota has grown; keep Resend as the fallback, as ADR-0017 does. Sources: [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/), [Email Service limits](https://developers.cloudflare.com/email-service/platform/limits/).

**List updates (broadcasts).** Keep D1 as the only list. Don't copy it into a second tool's audience: two unsubscribe lists drift apart and someone who left gets mailed again. To send an update:
1. Export the people who confirmed: `npx wrangler d1 execute eucas-waitlist --remote --json --command "SELECT email, token FROM waitlist WHERE status = 'confirmed'"` (or `status != 'pending'` if you never set up confirm emails).
2. Send **one email per person** (never one email with many recipients) through Resend's batch API, each with that person's link `https://eucas.app/api/unsubscribe?t=<token>` in the text and the headers `List-Unsubscribe: <that link>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. The Worker already serves both (RFC 8058). Gmail and Yahoo require one-click unsubscribe from bulk senders.
3. Send from `hello@eucas.app`, so replies reach you through Email Routing.

This needs a small script that isn't built yet (a follow-up). **Before the first update, check the consent.** Today the form and `/privacy` promise "three emails at most: a link to confirm, the first build, and Pro when it opens". Either keep updates inside that promise, or change the consent line (`CONSENT` in `lib/waitlist.ts`) and the privacy page **before launch**; each row stores the exact consent text its person agreed to.

## G. Counting visits

- [ ] **Umami** is already in `public/index.html` (the website id is public by design). Nothing to switch on in Cloudflare. **Don't also turn on Cloudflare Web Analytics**: two counters would disagree, and the CSP in `public/_headers` now allows only Umami (`cloud.umami.is` for the script, `gateway.umami.is` for events). If you ever turn Web Analytics on, add its two hosts back to the CSP first.
  Why: you need visits ÷ sign-ups for the demand test. Umami is cookie-free, so there's no banner, and `/privacy` says what it records.

## H. Try it (the smoke test)

- [ ] **18.** On `https://eucas.app`:
  1. `curl -sI https://eucas.app/` shows `content-security-policy`, `strict-transport-security`, `x-content-type-options: nosniff`.
  2. `curl -si https://eucas.app/api/confirm?t=x` gives 400 with `content-security-policy: default-src 'none'…` (the Worker's own headers).
  3. `http://eucas.app` redirects to `https://`.
  4. Join with your own email, click the confirm link, then use **Leave the list** and the one-click unsubscribe in Gmail.
  5. Check the row is gone:
     ```bash
     npx wrangler d1 execute eucas-waitlist --remote --command "SELECT count(*) FROM waitlist"
     ```
  6. Open *Workers Logs*: the confirm and unsubscribe requests show no `?t=`.
  7. **Umami: confirm events arrive after deploy.** Open `https://eucas.app` in a normal browser window (turn off any ad blocker for this check), then open the Umami dashboard → *Realtime*: your visit shows within a minute with the page `/`. In DevTools → *Console* there are no CSP errors; in *Network*, `script.js` from `cloud.umami.is` and `POST /api/send` to `gateway.umami.is` both return 200.
- [ ] **19. Sign out of Wrangler** when you're done: `npx wrangler logout`. Day-to-day reads can use a fresh `wrangler login` when needed.
  Why: `wrangler login` grants broad account access on this PC; it can't be scoped. [Authorization](https://developers.cloudflare.com/workers/authorization/)

## I. Alerts

- [ ] **20.** *Manage Account* → *Notifications* → *Add*: turn on the DDoS attack alert and the certificate (Universal SSL) alerts, sent to your email. D1 emails you by itself when a Free daily limit is hit.
  Why: on a solo project the alerts are the on-call. [Notifications](https://developers.cloudflare.com/notifications/get-started/), [D1 Free limits](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)

## When something goes wrong

| Situation | Do this |
|---|---|
| A bad deploy | *Worker* → *Deployments* → pick the previous version → *Rollback*, or `npx wrangler rollback`. Then revert the PR on `main`. Rollback changes code only, not D1 or secrets. [Rollbacks](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/) |
| Bad data (a wrong `DELETE`, a broken migration) | `npx wrangler d1 time-travel info eucas-waitlist`, then `npx wrangler d1 time-travel restore eucas-waitlist --timestamp=<before it happened>`. Free goes back 7 days. [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) |
| A spam flood | Check *Security* → *Events*. Tighten step 9 (for example 3 per 10 s). Bad rows: `DELETE FROM waitlist WHERE created_at > '…' AND status != 'confirmed'`, after an export. |
| A leaked secret | Rotate it at the source (Turnstile → *Rotate secret*; Resend → new key, delete old), then `npx wrangler secret put` again. |
| Turnstile errors for real people | Check the widget's hostnames match the address bar; Workers Logs show the 403s. |

## Costs (Free plan) and when to pay $5

| Item | Free allowance | Our use |
|---|---|---|
| Static files (the whole site) | Free and unlimited, not counted as requests | All page views |
| Worker requests (`/api/*` only) | 100,000 a day, 10 ms CPU each | ~3 per sign-up |
| D1 | 5 GB; 5 million rows read and 100,000 written a day. Over the limit, queries fail until midnight UTC | ~4 rows written per sign-up |
| Time Travel | 7 days | — |
| Workers Logs | 200,000 events a day, 3-day retention (Free gets 0.5 GB a day after 1 Dec 2026) | A few per request |
| WAF rate limit, Free Managed Ruleset, Bot Fight Mode, Turnstile, Email Routing, DMARC Management, DNSSEC | Free | — |
| Umami Cloud | Its free plan (check the monthly event allowance in your Umami account) | 1 event per page view |
| Resend | 100 emails a day, 3,000 a month; Pro $20/month | 1 per sign-up |

Sources: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), [Observability pricing](https://developers.cloudflare.com/observability/pricing/).

**Total: $0 a month.** Move to **Workers Paid ($5/month)** when any of these is true: a single day nears 25,000 sign-ups (D1 writes); you want 30 days of Time Travel because the list is now worth protecting (from about 500 sign-ups, or before a big launch post); or you want 7-day logs. Resend's free tier (100 emails a day) runs out long before any of these; see "Sending more than 100 emails a day" above.

## The top 10, if you only have 20 minutes

1. Two-factor sign-in and you as the only member (steps 1–2).
2. Turnstile secret set as a Worker secret, never in the repo (steps 11, 14). Without it, sign-ups are refused.
3. Custom domains only: `workers.dev` and preview URLs off (step 15, `wrangler.toml`).
4. The rate-limit rule on `/api/subscribe` (step 9).
5. Full (strict), Always Use HTTPS, TLS 1.2+ (step 6).
6. DNSSEC (step 5).
7. Workers Builds from `main` only, previews off, tests in the build (step 13).
8. Logs with `?t=` redacted (step 16).
9. A known restore path: Time Travel (7 days) plus an export before risky changes.
10. SPF, DKIM and DMARC for eucas.app (section F).
