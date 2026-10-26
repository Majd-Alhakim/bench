# Eucas companion: running-cost study (2026-10-26)

**Question from the founder:** what will running Eucas cost per month, for Free and Pro users, with each supervisor option? How many paying users does it take to break even, and what if everyone stays on Free?

**Short answer:**
- **Running Eucas costs almost nothing:** about **$1/month** before Pro exists, about **$6/month** once Pro runs, and about **$32/month** after code signing.
- **Each Pro user leaves about $13 (founding price) or $18 (regular price)** after every fee.
- **1 paying user covers the running costs; 3 cover them with signing.**
- **If nobody pays,** you lose about **$1/month**, even with 100,000 free users.
- **The real constraint is reaching ~155 paying users for $2k/month, not cost.**

All prices were checked on official pages on 2026-10-26 (sources at the end). Usage figures come from the benchmark (SP-SUP1, SP-SUP1b) plus the stated assumptions. This is planning, not accounting or tax advice.

## 1. What costs money

| Cost | Who causes it | Price | Notes |
|---|---|---|---|
| **Supervisor model calls** (OpenRouter) | **Pro users only** | Option A, gpt-oss-120b: $0.000148 per call. Option B, Jev 1.14 + gpt-oss: $0.000238 per call. Plus OpenRouter's **5.5%** fee on credits | Free users never call a model |
| **Server** (Cloudflare Workers) | Everyone (update checks); Pro (licence, quota, model routing) | **Free plan:** 100,000 requests a day. **Paid:** $5/month incl. 10M requests, then $0.30 per million | Durable Objects and KV for quotas fit inside the included amounts at this scale |
| **Payment provider** | Each Pro payment | **Lemon Squeezy:** 5% + $0.50, **+1.5% non-US buyer, +0.5% subscription, +1% payout to a Qatar bank**, so about **8% + $0.50**. **Paddle:** 5% + $0.50 all-in (Qatar support unconfirmed) | Both act as merchant of record and handle VAT and sales tax |
| **Domain** eucas.app | Fixed | about **$14.20/year** (Cloudflare Registrar renewal; third-party tracker) | |
| **Code signing** | Fixed, **only once revenue covers it** (CR-010) | SSL.com IV certificate $129/year + eSigner cloud signing $180/year, about **$309/year** ($25.75/month). Certum's cloud option is from €209 | Not bought for v0.1 |
| **Waitlist, site, email, analytics, errors** | Fixed | **$0:** Cloudflare Pages, D1, Turnstile, Email Routing and Web Analytics on free plans; Resend free (3,000 emails/month); Sentry Developer free (5,000 errors/month) | Paid tiers only at much larger scale |
| **CI, nightly canary, downloads** | Fixed | **$0:** GitHub Actions is free for public repos (Windows and Linux runners); release downloads are free with no bandwidth limit | Keep the repo public |

**Not counted as running cost:** your own Claude subscription for building it, your time, and occasional benchmark runs (about $2 so far).

## 2. Model cost per Pro user

The usage profiles are assumptions: the supervisor wakes about 6 times per agent-hour, and 54% of wake-ups need the model (SP-SUP1).

| Pro user type (share of Pro users) | Usage | Model calls a month | Option A (gpt-oss) | Option B (Jev + gpt-oss) |
|---|---|---|---|---|
| Light (50%) | 1 agent, 2 h/day | 143 | $0.02 | $0.04 |
| Medium (35%) | 3 agents, 4 h/day | 855 | $0.13 | $0.22 |
| Heavy (15%) | 6 agents, 8 h/day | 3,421 | $0.53 | $0.86 |
| **Average Pro user** | | **about 880** | **$0.14** | **$0.22** |
| **Worst case** (anyone hitting the 10,000-call allowance) | | 10,000 | **$1.56** | **$2.51** |

**The allowance is the safety valve.** No Pro user can cost more than $1.56 (A) or $2.51 (B) a month, because after 10,000 calls Eucas asks the user instead of calling the model.

## 3. What each Pro user leaves you

After the payment fee and the model:

| Payment provider | Option | Founding ($15) | Regular ($20) |
|---|---|---|---|
| Lemon Squeezy (worst case: international subscription + payout) | A | **$13.16** | **$17.76** |
| Lemon Squeezy | B | $13.08 | $17.68 |
| Paddle | A | $13.61 | $18.36 |
| Paddle | B | $13.53 | $18.28 |

Even if *every* Pro user hit the allowance, each would still leave **about $11.50 (founding) or $16 (regular)** with Lemon Squeezy and option B.

**Option A vs B makes almost no difference to money:** about $0.08 per user a month. Choose between them on quality (the SP-SUP2 real-moment test), not cost.

## 4. Fixed monthly cost

| Stage | What's running | Per month |
|---|---|---|
| **Now to launch** (waitlist, free app) | Domain; everything else on free plans | **$1.18** |
| **Pro is live** | + Workers Paid | **$6.18** |
| **Signed installer** (after revenue) | + code signing | **$31.93** |

## 5. Break-even

| Stage | Paying users needed to cover running costs |
|---|---|
| Free app only | Covered by any supporter ($10 minimum) |
| Pro live, unsigned | **1** |
| Pro live, signed | **3** |

## 6. Scenarios (option A, Lemon Squeezy worst-case fees)

The first 200 payers pay $15, the rest $20.

| Active users | Conversion to Pro | Payers | Revenue | Fees | Model | Fixed | **Profit a month** |
|---|---|---|---|---|---|---|---|
| 500 | 0% | 0 | $0 | $0 | $0 | $1 | **−$1** |
| 500 | 2% | 10 | $150 | $17 | $1 | $6 | **$125** |
| 2,000 | 1% | 20 | $300 | $34 | $3 | $6 | **$257** |
| 2,000 | 3% | 60 | $900 | $102 | $8 | $6 | **$784** |
| 5,000 | 2% | 100 | $1,500 | $170 | $14 | $6 | **$1,310** |
| 5,000 | 3% | 150 | $2,250 | $255 | $21 | $6 | **$1,968** |
| 10,000 | 2% | 200 | $3,000 | $340 | $28 | $6 | **$2,626** |
| 10,000 | 3% | 300 | $5,000 | $550 | $41 | $6 | **$4,402** |
| 30,000 | 2% | 600 | $11,000 | $1,180 | $83 | $6 | **$9,731** |

Signing lowers each line by about $26. Option B lowers it by $0–25.

**The $2k/month goal needs about 153–156 paying users** (both options, signed or not). At 1–3% conversion, that's **about 5,000–15,000 active users**.

## 7. What if everyone uses Free?

| Free users | Server requests a month (one update check a day) | Monthly cost |
|---|---|---|
| 1,000 | 30,000 | **$1.18** (free plan) |
| 10,000 | 300,000 | **$1.18** (free plan) |
| 100,000 | 3.0M (about 100k a day, at the free plan's limit) | **$6.18** (Workers Paid) |
| 300,000 | 9.0M | **$6.18** (still inside Workers Paid) |

**Free users can't run up a bill:** they never call a model, everything they do runs on their own PC, and downloads come from GitHub for free. The worst case is **about $6/month** with no revenue, plus the time you spend supporting them, which is the real cost of free users.

## 7b. Free trial and monthly taste (CR-011)

The founder decided Free gets a taste of the supervisor: a **14-day full trial at install**, then a **small monthly taste**. Every limit is a hidden cost budget. The user sees a meter, never dollars.

| Item | Hidden cap | Typical cost |
|---|---|---|
| 14-day trial (once per verified email) | $0.50 per trial | about $0.11 (average user) |
| Monthly taste on Free (about 80 decisions) | $0.02 per free user a month | well under the cap; most free users won't use it all |

| Scenario | Extra cost a month |
|---|---|
| 1,000 new installs a month (trials) | about **$110** |
| 10,000 free users, everyone using the full taste | at most **$200** |
| **Worst case: 10,000 free users, nobody pays, 1,000 new trials a month** | about **$300** |
| 10,000 users, 2% paying | profit about $2,600 → about **$2,300–2,500** after trial and taste |

The free usage moves the all-free case from "about $6" to "up to about $300 a month at 10,000 users". It's bounded by the hidden caps and by one trial per verified email.

## 7c. How wrong could the model cost be? (sensitivity)

The model cost per call is measured (SP-SUP1: about 935 tokens in and 103 out per call, $0.000148 for gpt-oss-120b). **The number of calls is an assumption** (6 wake-ups per agent-hour). Real prompts may also be bigger than the benchmark's.

| Change from the measured case | Heaviest user, Jev + gpt-oss |
|---|---|
| As measured | $0.86 |
| Prompts 3× bigger | about $2.60 |
| Agents stop 3× more often | about $2.60 |
| Both | about $7.50 |
| Model prices double | ×2 |

**Fix adopted (CR-011):**
- The allowance is a **hidden dollar budget per user**, not a call count, so no user can cost more than the budget whatever the prompt size.
- Each prompt is capped at about 2,000 tokens.
- With a Pro budget of about $2 a month, a $15 founding user still leaves **at least about $11**.

SP-SUP2 (real moments) measures the true prompt size and wake-up rate. Re-run this study with them before setting the final budgets.

## 8. Risks to these numbers

- **Usage assumptions:** the wake-ups per agent-hour and the profile mix are estimates. Watch the real numbers from SP-SUP2 and the first Pro users; the allowance caps the downside either way.
- **Provider prices:** model prices can change. Keep the fallback models (Gemma is cheaper) and the allowance.
- **Payment fees:** Lemon Squeezy's extras (non-US, subscription, payout) make it about 8% + $0.50. Paddle is cheaper at 5% + $0.50 if it accepts a Qatar-based seller; confirm before choosing.
- **Refunds and chargebacks** aren't modelled. Budget a few percent.
- **Tax:** the merchant of record handles VAT and sales tax on sales. Income tax on your side depends on your situation in Qatar; check with a local accountant.

## Sources (seen 2026-10-26)

- **Cloudflare:**
  - Workers pricing: developers.cloudflare.com/workers/platform/pricing
  - Pages limits: developers.cloudflare.com/pages/platform/limits
  - Turnstile plans: developers.cloudflare.com/turnstile/plans
  - Email Routing: developers.cloudflare.com/email-routing
- **Payments:** Lemon Squeezy fees: docs.lemonsqueezy.com/help/getting-started/fees · Paddle pricing: paddle.com/pricing
- **OpenRouter pricing:** openrouter.ai/pricing
- **Code signing:** SSL.com IV code signing and eSigner pricing (ssl.com) · Certum code signing: shop.certum.eu/code-signing.html
- **GitHub:** Actions billing and releases (docs.github.com)
- **Other services:** Sentry pricing (sentry.io/pricing) · Resend pricing (resend.com/pricing)
- **Domain:** .app renewal via cfdomainpricing.com (third-party tracker)
- **Model costs:** measured per call in SP-SUP1 / SP-SUP1b (`docs/spikes/`)
