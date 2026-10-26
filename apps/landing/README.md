# eucas.app: landing page and waitlist

The demand test for the Eucas companion. A static page on Cloudflare Pages, a waitlist stored in Cloudflare D1 through Pages Functions, Turnstile against bots, and an optional confirm email through Resend. **Nothing here is deployed.** Going live is the founder's job; the steps are below.

```
public/          the site: index.html, privacy.html, styles.css, main.js, fonts/, screens/, og.png, _headers
functions/api/   subscribe (POST), details (POST), confirm (GET), unsubscribe (GET page, POST delete)
lib/waitlist.ts  validation, Turnstile siteverify, the Resend call, small HTML pages
migrations/      the D1 schema
scripts/         capture-screens.mjs (real screens from the companion prototype), og.mjs, check.mjs
review/          screenshots for the PR (dark and light, desktop and phone)
```

## Run it locally

```bash
cd apps/landing
npm install
cp .dev.vars.example .dev.vars          # Cloudflare's always-pass Turnstile test keys, no real secrets
npx wrangler d1 migrations apply eucas-waitlist --local
npx wrangler pages dev                  # http://localhost:8788
```

To test the form with the Turnstile widget, set `<meta name="turnstile-sitekey" content="1x00000000000000000000AA">` in `public/index.html` (Cloudflare's test site key) and change it back before committing. Then `node scripts/check.mjs` renders both themes at 1440 and 390 px and submits the form (set `PUPPETEER_CORE` to a puppeteer-core folder). Read the list with:

```bash
npx wrangler d1 execute eucas-waitlist --local --command "SELECT email, status, agents, sessions, os, plan, ref, created_at FROM waitlist"
```

## Why Cloudflare and not a form service

| | Cloudflare Pages + D1 (built) | Tally | Loops |
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

Spam: a hidden honeypot field, a 1.5 s minimum fill time, Turnstile (checks success, action `waitlist` and the hostname, and fails closed), and one WAF rate-limit rule (step 9). A duplicate email gets the same answer as a new one, so the form never reveals who is on the list.

Double opt-in: with Resend set up, new rows are `pending` until the confirm link is clicked, and `pending` rows older than 30 days are deleted. Without Resend, rows are `unconfirmed` and the page only promises the consent line. Every email carries a one-click unsubscribe that deletes the row.

## Going live (founder steps)

Each step is in your Cloudflare dashboard or terminal. Steps 6 and 8 are optional for the first day.

1. **Cloudflare account.** Sign up at dash.cloudflare.com (free plan).
2. **Put eucas.app on Cloudflare.** *Add a domain* → eucas.app → Free. If the domain is registered elsewhere, change its nameservers at your registrar to the two Cloudflare shows you, and wait until the zone says Active (minutes to a few hours).
3. **Create the database.** From `apps/landing`:
   ```bash
   npx wrangler login
   npx wrangler d1 create eucas-waitlist
   ```
   Paste the `database_id` it prints into `wrangler.toml`, commit it (the id isn't a secret), then:
   ```bash
   npx wrangler d1 migrations apply eucas-waitlist --remote
   ```
4. **Create the Pages project.** *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → `eucas-app/eucas`. Production branch `main`, root directory `apps/landing`, build command empty, output directory `public`. The D1 binding `DB` comes from `wrangler.toml`. The first build gives you a `*.pages.dev` address to check before the domain.
5. **Turnstile.** *Turnstile* → *Add widget*: name "eucas waitlist", hostnames `eucas.app` and `www.eucas.app`, mode Managed. Put the **site key** in `public/index.html` (`<meta name="turnstile-sitekey" content="…">`) and commit it; it's public. Put the **secret key** in the Pages project: *Settings* → *Variables and Secrets* → add `TURNSTILE_SECRET` as a Secret, for Production. If you test on the `pages.dev` address first, add that hostname to the widget and to `TURNSTILE_HOSTNAMES` in `wrangler.toml` too.
6. **Confirm emails (optional, recommended).** Sign up at resend.com, *Domains* → add `eucas.app`, and add the DNS records it lists (SPF, DKIM) in Cloudflare *DNS*. Create an API key with sending access only and add it to the Pages project as the Secret `RESEND_API_KEY`. Until you do, sign-ups are stored with the consent line only.
7. **The domain.** Pages project → *Custom domains* → add `eucas.app`, then `www.eucas.app`. Cloudflare adds the DNS records and the certificate.
8. **hello@eucas.app.** *Email* → *Email Routing* → route `hello@eucas.app` to your own inbox. The page, the privacy note and the error messages use this address.
9. **Rate limit.** *Security* → *WAF* → *Rate limiting rules* → one rule: URI path equals `/api/subscribe`, 5 requests per 10 seconds per IP, action Block.
10. **Visit counts.** Pages project → *Metrics* → enable *Web Analytics*. It needs no code and no cookie banner; the CSP in `public/_headers` already allows its beacon.
11. **Try it.** Join with your own email, click the confirm link, then use the unsubscribe link and check the row is gone:
    ```bash
    npx wrangler d1 execute eucas-waitlist --remote --command "SELECT count(*) FROM waitlist"
    ```

Reading the results later:

```bash
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT agents, count(*) AS n FROM waitlist WHERE status != 'pending' GROUP BY agents ORDER BY n DESC"
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT ref, plan, count(*) AS n FROM waitlist GROUP BY ref, plan ORDER BY n DESC"
```

## Costs

| Item | Free allowance | Cost now |
|---|---|---|
| Cloudflare Pages (static files) | Unlimited requests and bandwidth, 500 builds a month | $0 |
| Pages Functions | 100,000 requests a day (Workers Free) | $0 |
| D1 | 5 GB, 5 million rows read and 100,000 written a day | $0 |
| Turnstile, Web Analytics, Email Routing | Free | $0 |
| Resend | 3,000 emails a month, 100 a day | $0; $20/month for 50,000 if you outgrow it |
| eucas.app | Already yours | the yearly renewal only |

**Total: $0 a month** until a single day brings more than 100 sign-ups. On such a day, emails past the 100th fail to send; those people are still stored (as `unconfirmed`) and the page tells them they're on the list. Upgrade Resend before a big launch post if you want every confirm email out the same day.
