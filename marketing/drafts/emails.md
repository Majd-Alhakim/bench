# Waitlist emails

The consent (founder, 2026-10-26; applied in PR #86) covers: a link to confirm, **occasional build updates, at most a couple a month**, the first build, and Pro when it opens, each with a one-click unsubscribe. The confirm email already exists (`apps/landing/lib/waitlist.ts`). Below: three build updates, the first-build email and the Pro email. The schedule and rules are in [WAITLIST §8](../WAITLIST.md#8-keeping-the-waitlist-warm-until-launch).

Send from hello@eucas.app through Resend, one email per person, each with that person's unsubscribe link and the `List-Unsubscribe` headers. Plain-looking HTML, no tracking pixels. Each image is a real screen with Pip's face from [PLAN §3](../PLAN.md#3-pips-faces); before the app exists, label it "Design preview". Rewrite in your own words; keep each under about 150 words.

---

## 1. Update 1 · The result (day 8)

**Subject:** [N] of you joined. Here's what happens now
**Preview text:** The demand test is over. The answer, and one question for you.

> You joined the Eucas waitlist last week. The test was simple: 100 people in 7 days, or I don't build it.
>
> **[N] joined.** [x]% of you are on Windows, and [z]% run 4 or more sessions at once. [M] of you clicked the founding-member offer.
>
> **So I'm building it.** The first Windows build is about [5–6] weeks away. Until then you'll hear from me at most twice a month, and only when there's something real to show.
>
> [Image: the notch over a desktop, Pip **Pleased**; caption "Design preview"]
>
> One question, if you have a minute: **which prompt do you approve most often?** Just reply. I read every answer, and the first rules Eucas suggests will come from them.
>
> [Your name]
> eucas.app · [Unsubscribe]

*If the test missed:* don't send this one. Post the result publicly instead (waitlist-week Day 8) and decide what the list hears next.

## 2. Update 2 · A sneak peek (about three weeks before launch)

**Subject:** The bulk-delete stop works on a real Windows machine
**Preview text:** A 10-second clip, and a seat in the private test if you want one.

> A short one. The bulk-delete stop now works on a real Windows 11 machine: a session that starts deleting files in bulk is stopped, and you see what went and how to get it back.
>
> [GIF, 10 s: the tripwire stop from the build, Pip **Concerned**; then the panel, Pip **Calm**]
>
> It works without an account, like the four limits: a delete, a push to your default branch, a send and a payment always come to you.
>
> **A private test build** goes to about 15 people in two weeks. If you run Claude Code on Windows with several sessions and don't mind telling me what breaks, reply "test" and I'll write back.
>
> [Your name]
> eucas.app · [Unsubscribe]

Swap the feature for whatever is actually working that week. Never show something that isn't.

## 3. Update 3 · The date (about a week before launch)

**Subject:** Eucas comes out on [weekday, date]
**Preview text:** What you get without an account, what needs one, and the founders' price.

> The first Windows build of Eucas comes out on **[weekday, date]**. You'll get the download link that morning.
>
> **Without an account:** the four limits (a delete, a push to your default branch, a send and a payment always come to you) and the stop on bulk deletes.
>
> **With a free account:** your rules, your usage, and the supervisor in full for 14 days, then a little every month.
>
> **Pro, when it opens:** much more supervisor help and budgets that stop a session before its next step. The first 200 who pay keep **$15/month for life** instead of $20, and this list hears first.
>
> [Image: the notch at rest, Pip **Calm**]
>
> Windows 10 22H2 or 11. v0.1 isn't code-signed, so Windows will say "Unknown publisher".
>
> [Your name]
> eucas.app · [Unsubscribe]

## 4. The first build is ready (launch day)

**Subject:** The first Windows build of Eucas is ready
**Preview text:** Install it in about a minute. The four limits work before you sign in.

> You joined the Eucas waitlist on [date]. The first Windows build is ready: **[download link with `utm_source=email&utm_campaign=launch`]**
>
> **Before you install**
> - Windows 10 22H2 or 11, and Claude Code in a terminal, the desktop app or VS Code.
> - Windows will say **"Unknown publisher"**. v0.1 isn't code-signed yet; the source is on GitHub if you want to check what you're running.
> - Setup takes about a minute. You name your Euca, it shows you your last 7 days, and it locks the four limits: a delete, a push to your default branch, a send and a payment always come to you.
>
> **No account needed** for the four limits and the stop on bulk deletes. **A free account** adds your rules, your usage and the supervisor in full for 14 days, then a little every month.
>
> **If something breaks:** the diagnostic report in Settings has no paths to your projects or files. Send it to hello@eucas.app or open an issue on GitHub.
>
> Thank you for being one of the [N] people who made this get built.
>
> [Your name]
> eucas.app · [Unsubscribe]

## 5. Pro is open

**Subject:** Eucas Pro is open: the first 200 keep $15/month for life
**Preview text:** [X] of 200 founding places are taken.

> Eucas Pro is open: **[link with `utm_source=email&utm_campaign=pro-open`]**
>
> **What Pro adds**
> - Much more supervisor help every month, so fewer sessions wait for you.
> - Budgets that stop a session before its next step.
>
> **The founding price:** the first 200 who pay keep **$15/month for life** instead of $20. [X] places are taken as of this email. When 200 is reached, the price is $20.
>
> Free stays free: the four limits and the bulk-delete stop need no account, and your rules and usage stay in the free account.
>
> [Your name]
> eucas.app · [Unsubscribe]

**Before sending:** the price and the "first 200" count must match the checkout. Never send "places are running out" unless the number in the email is real and current.
