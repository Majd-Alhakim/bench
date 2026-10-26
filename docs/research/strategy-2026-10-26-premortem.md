# Strategy delta: pre-mortem of the Eucas companion (2026-10-26)

**Question from the client:** "imagine eucas tool is released with these features … where can it fail and how … will this fail cost the tool to have no buyers or users … if we found a huge gap that can't be solved then we kill the full idea before we even commit."

**What was torn down:** the Eucas companion as agreed in the monetization grilling (25 Oct):
- **Free:** hard limits, rules, the ledger and forecast, the same-file warning, guided merge, the inbox and notch, 3 sessions.
- **Pro, $10/month:** budgets with auto-pause, the supervisor, unlimited sessions, history, the cloud beta.
- **Licence and goal:** FSL; $2k/month.

**Method:** the competitor-teardown skill applied to our own product as a pre-mortem ("it's 6 months after launch and it failed; why?"). Four reviewers worked in parallel, using public evidence only, with every claim typed and sourced.

| Lens | File | Verdict |
|---|---|---|
| Market, pricing, distribution | [eucas-premortem-market.md](teardowns/eucas-premortem-market.md) | Serious, only partly fixable; **near-fatal for $2k/month on this plan** |
| Dependency on Anthropic | [eucas-premortem-platform.md](teardowns/eucas-premortem-platform.md) | The product's design is safe from being cut off; **the Pro tier as specified is near-fatal** |
| Trust, safety, security | [eucas-premortem-trust.md](teardowns/eucas-premortem-trust.md) | **Fatal at the first incident if we promise "never"**; fixable if the promise changes |
| First run and solo building | [eucas-premortem-execution.md](teardowns/eucas-premortem-execution.md) | **Fatal as described**; fixable with a hard v0.1 cut |

## 1. The four ways it dies (ranked)

1. **The money doesn't add up.**
   - Real conversion for a free-heavy indie dev tool is **1–3%**. $2k net needs about **240 payers**, so **8,000–24,000 active free users**.
   - For scale: ccusage, the most popular Claude Code usage tool (19.2k stars), earns about **$104/month** from sponsors. Vibe Kanban (28.5k stars) **shut down**. VibeHandler (our exact price shape) got **0 upvotes**.
   - At 5 hours a week, build-in-public alone won't reach those numbers.
2. **Anthropic absorbs Pro.** Notifications, needs-input, usage warnings, `/goal`, Projects and enterprise spend caps have already shipped. Interactive budgets for Pro and Max are "one product decision away". Paid features that spend the user's plan are also **more exposed** under the "unless previously approved" line in the terms.
3. **The safety promise breaks once, in public.**
   - Hooks only see tool calls: a script the agent writes and runs gets past them.
   - Hooks fail open by default, and on Windows they failed open three ways until **2.1.310 (23 Oct)**.
   - An agent can edit its own hook settings.
   - Four Windows users lost **116–600 GB** in Sep–Oct 2026.

   "Never delete" as an absolute claim is **not honestly makeable**.
4. **Nobody gets value on day one, and one person can't keep up.** The first screen is empty. Claude Code ships about 6–8 releases a week, often touching hooks or Windows. The planned v0.1 scope is far beyond 2 weeks for one person.

## 2. Is there a gap that can't be solved?

| Gap | Solvable? | Why |
|---|---|---|
| Absolute "never delete / pay / send" | **No**, as an absolute promise about the agent | Hooks can't see inside programs the agent runs; native Windows has no network sandbox |
| An honest safety claim | **Yes** | "Eucas never auto-approves a delete, a push to main, a send or a payment, and no rule can change that", plus a tested fail-closed guard that **tells you the moment it isn't running** and kills a session that starts mass-deleting |
| Value in the first 5 minutes | **Yes** | Read existing local history (as ccusage does): a 7-day retro of tokens, past same-file clashes and risky commands, and the commands you approved by hand most often, turned into one-click rules |
| Anthropic absorbing features | **Partly** | What stays ours: **user-owned, deterministic rules across all sessions, outside the model, tested fail-closed on Windows**, and possibly **one rulebook across vendors** (Claude Code, Codex, Cursor), which Anthropic will never build |
| $2k/month from a $10 Pro on this distribution | **Not on the current plan** | It needs 8–24k active users; nothing in the evidence says a late, small entrant gets there in 6 months at 5 h/week |

**Conclusion:** no gap kills **the idea** (a trusted guard for people running agents). One gap kills **the current money plan** ($10 Pro to $2k/month, with features Anthropic is absorbing).

## 3. What must change to survive (consolidated)

**Promise and safety**
- Reword every claim: no absolute "never" about the agent; "never auto-approved by Eucas" plus "a guard that tells you when it's off".
- Every safety hook uses `onFailure: "block"`. A heartbeat and a canary test run on every Claude Code release, and the app shows "protection verified for CLI x.y".
- A mass-delete tripwire kills the session.
- Never auto-approve programs that run code (package installers, interpreters).
- Never nudge after a block.
- Cloud hand-off is gated on GitHub branch protection.
- Install the limits as managed settings (one admin prompt) so a repo or the agent can't switch them off. Read transcripts locally only, and never store their text.

**v0.1 scope (a credible 12–15 working days, solo)**
- **In:** hooks shipped as a Claude Code plugin at user scope; limits that hold even when the app is closed; the **7-day retro with suggested rules**; the live same-file warning; the inbox in the tray with Windows notifications; the ledger and forecast via a status-line wrapper that keeps the user's own status line; a one-button diagnostic report; signing and auto-update; clean uninstall.
- **Out of v0.1:** the notch (its global keyboard hook looks like a keylogger to antivirus on a new app; it belongs to the team app); guided merge; the free-text rules compiler; licence keys and Pro (a **waitlist** instead); launching sessions from the app.

**Money**
- **No paid tier before Anthropic's written OK.**
- Charge only for what saves or costs money (budgets that pause), not for session counts. Don't sell wrappers around Anthropic previews (the cloud stays a free beta).
- Re-test the $2k goal against reach. If the founder has under about 1,000 relevant followers, build-in-public alone won't get there.

**Platform**
- Distribute as a Claude Code plugin; chain the status line instead of replacing it; follow Anthropic's naming rules; carry the kill criteria in the PRD.

## 4. Kill criteria (merged)

**Measured after launch:**
- Under **300 installs or 50 weekly actives at +4 weeks**; under **150 weekly actives at +8 weeks**.
- Under **20 payers or 1% conversion at +12 weeks**; under **$500/month at +6 months**.

**Events, at any time:**
- Anthropic **refuses written approval** for a paid tool, or withdraws subscription use for third-party apps.
- Anthropic ships **interactive budget caps plus enforced user deny rules** for Pro and Max (our moat is gone).
- **One confirmed data-loss incident while Eucas showed "protected"**, or we can't detect that our hook stopped firing.

**Before building (cheapest test):** a 1-day hooks spike (fail-closed on 2.1.310+, whether the agent can edit hook settings, coverage of PowerShell, subagent and MCP calls, latency with Defender on), plus a **landing page and waitlist** for 2 weeks. If the waitlist is weak, don't build.

## 5. Decision for the client

Four paths, with a recommendation in the chat message. Whichever is chosen, the accepted fixes go to the business analyst as **proposed** requirement items (from teardown, needing client approval) in CR-010.
