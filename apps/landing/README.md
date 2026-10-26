# eucas.app: landing page and waitlist

The demand test for the Eucas companion, built on the approved notch design (`docs/design/ui/companion/DESIGN.md`): Pip lives in a live notch at the top of the page, its state follows the section you read, and every product picture is a real capture from the notch prototype. One Cloudflare Worker: the static page served as Workers static assets, a small API (`src/`) that stores the waitlist in Cloudflare D1, Turnstile against bots, and an optional confirm email through Resend. **Nothing here is deployed.** Going live is the founder's job: [DEPLOY.md](DEPLOY.md) is the runbook.

```
public/          the site: index.html, privacy.html, styles.css, main.js, fonts/, screens/, og.png, _headers
src/index.ts     the Worker: routes /api/*, security headers, per-IP rate limit (static files never reach it)
src/api/         subscribe (POST), details (POST), confirm (GET), unsubscribe (GET page, POST delete)
lib/waitlist.ts  validation, Turnstile siteverify, the Resend call, small HTML pages
migrations/      the D1 schema
scripts/         capture-screens.mjs (cut-outs from docs/design/ui/companion/prototype/notch.html), og.mjs, check.mjs
review/          screenshots for the PR (dark and light, desktop and phone)
```

## Run it locally

```bash
cd apps/landing
npm install
cp .dev.vars.example .dev.vars          # Cloudflare's always-pass Turnstile test keys, no real secrets
npx wrangler d1 migrations apply eucas-waitlist --local
npm run dev                             # http://localhost:8787
```

To test the form with the Turnstile widget, set `<meta name="turnstile-sitekey" content="1x00000000000000000000AA">` in `public/index.html` (Cloudflare's test site key) and change it back before committing. Then `node scripts/check.mjs` renders both themes at 1440 and 390 px and submits the form (set `PUPPETEER_CORE` to a puppeteer-core folder; `BROWSER` to a Chrome or Edge binary if Edge isn't at its default path). After a design change in the prototype, `node scripts/capture-screens.mjs` re-renders `public/screens/` and `node scripts/og.mjs` the share card. Read the list with:

```bash
npx wrangler d1 execute eucas-waitlist --local --command "SELECT email, status, agents, sessions, os, plan, ref, created_at FROM waitlist"
```

## Why Cloudflare and not a form service

| | Cloudflare Workers + D1 (built) | Tally | Loops |
|---|---|---|---|
| Cost at this size | $0 | $0 (Tally branding; Pro $29/mo removes it) | $0 to 1,000 contacts, then $49/mo |
| Where the list lives | Your Cloudflare account | Tally's servers | Loops' servers |
| Page speed | Same page, no third-party embed | An iframe or a redirect | An embed or an API call |
| Double opt-in | Built here, needs Resend for the email | No | Yes, built in |
| Lock-in | One SQL table, export any time | CSV export | CSV export |

Cloudflare keeps the list in your account, costs nothing, and keeps the page at Lighthouse 100. The cost is about an hour of setup below.

## What's in the waitlist

- **Email** (required) and **Which agents do you use?** (Claude Code, Cursor, Codex, Other) on the first step.
- **Sessions at once** and **Which computer?** on an optional second step after you're on the list, so they don't cost sign-ups.
- **plan**: `pro` when someone came from "Join as a founding member". That's your founding-member demand signal.
- **ref**: the `?ref=` or `utm_source` of the link. Post `https://eucas.app/?ref=x` on X and `?ref=reddit` on Reddit to see which one worked.
- No IP addresses, no user agents, no names. The privacy note at `/privacy` says exactly this.

Spam: a hidden honeypot field, a 1.5 s minimum fill time, Turnstile (checks success, action `waitlist` and the hostname, and fails closed), one WAF rate-limit rule ([DEPLOY.md](DEPLOY.md) step 9), and a per-IP limit in the Worker. Without a Turnstile secret, sign-ups are refused rather than let through. A duplicate email gets the same answer as a new one, so the form never reveals who is on the list.

Double opt-in: with Resend set up, new rows are `pending` until the confirm link is clicked, and `pending` rows older than 30 days are deleted. Without Resend, rows are `unconfirmed` and the page only promises the consent line. Every email carries a one-click unsubscribe that deletes the row.

## Going live (founder steps)

Follow [DEPLOY.md](DEPLOY.md): a checkbox runbook with the reason and the Cloudflare doc for each step, from two-factor sign-in to the smoke test, rollback and costs. In short: lock the account, put eucas.app on Cloudflare with DNSSEC and Full (strict), add the rate-limit rule and Bot Fight Mode, create the Turnstile widget and the D1 database, connect the repo with Workers Builds (`main` only, previews off), add the two secrets, attach the custom domains, set up email (Email Routing, Resend, DMARC) and Web Analytics, then run the smoke test. Before a PR, `npm run check:deploy` validates the Worker config without deploying.

Reading the results later:

```bash
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT agents, count(*) AS n FROM waitlist WHERE status != 'pending' GROUP BY agents ORDER BY n DESC"
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT ref, plan, count(*) AS n FROM waitlist GROUP BY ref, plan ORDER BY n DESC"
```

## Costs

| Item | Free allowance | Cost now |
|---|---|---|
| Workers static assets (the site) | Free and unlimited | $0 |
| Worker requests (`/api/*` only) | 100,000 a day (Workers Free) | $0 |
| D1 | 5 GB, 5 million rows read and 100,000 written a day | $0 |
| Turnstile, Web Analytics, Email Routing | Free | $0 |
| Resend | 3,000 emails a month, 100 a day | $0; $20/month for 50,000 if you outgrow it |
| eucas.app | Already yours | the yearly renewal only |

**Total: $0 a month** until a single day brings more than 100 sign-ups. On such a day, emails past the 100th fail to send; those people are still stored (as `unconfirmed`) and the page tells them they're on the list. Upgrade Resend before a big launch post if you want every confirm email out the same day.
