# Waitlist emails

The form's consent line allows exactly three kinds of email: **a link to confirm, the first build, and Pro when it opens.** The confirm email already exists (`apps/landing/lib/waitlist.ts`). These are drafts of the other two. Anything else (build notes, surveys) needs a new, unticked opt-in first; see [WAITLIST §8](../WAITLIST.md#8-keeping-the-waitlist-warm-until-launch).

Send from hello@eucas.app through Resend, as plain-looking HTML, with the one-click unsubscribe link every email already carries. No tracking pixels: the privacy note doesn't mention any.

---

## 1. The first build is ready (launch day)

**Subject:** The first Windows build of Eucas is ready
**Preview text:** Install it in about a minute. The four limits are on before you sign in.

> You joined the Eucas waitlist on [date]. The first Windows build is ready: **[download link with `utm_source=email&utm_campaign=launch`]**
>
> **Before you install**
> - Windows 10 22H2 or 11, and Claude Code in a terminal, the desktop app or VS Code.
> - Windows will say **"Unknown publisher"**. v0.1 isn't code-signed yet; the source is on GitHub if you want to check what you're running.
> - Setup takes about a minute. You name your Euca, it shows you your last 7 days, and it locks the four limits: a delete, a push to your default branch, a send and a payment always come to you.
>
> **What's free:** the four limits, the stop on bulk deletes, your rules and your usage. The supervisor in full for 14 days, then a little every month.
>
> **If something breaks:** the diagnostic report in Settings has no paths to your projects or files. Send it to hello@eucas.app or open an issue on GitHub.
>
> Thank you for being one of the [N] people who made this get built.
>
> [Your name]
> eucas.app · [Unsubscribe]

## 2. Pro is open

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
> Free stays free: the four limits, the bulk-delete stop, your rules and your usage don't move behind Pro.
>
> [Your name]
> eucas.app · [Unsubscribe]

**Before sending:** the price and the "first 200" count must match the checkout. Never send "places are running out" unless the number in the email is real and current.
