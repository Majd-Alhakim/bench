// POST /api/subscribe: adds an email to the waitlist and sends the confirm link when a mailer is set.
import { AGENTS, CONSENT, PLANS, type Ctx, cleanRef, json, newToken, normaliseEmail, readJson, sendConfirm, verifyTurnstile } from "../../lib/waitlist";

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const body = await readJson(request);
  if (!body) return json({ error: "That request didn't look right. Reload the page and try again." }, 400);

  // Bots fill the hidden field or submit faster than a person can type. Tell them it worked; store nothing.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if ((typeof body.website === "string" && body.website !== "") || elapsed < 1500) return json({ ok: true, confirm: true });

  const email = normaliseEmail(body.email);
  if (!email) return json({ error: "That doesn't look like an email address. Check for a typo." }, 400);

  const ip = request.headers.get("cf-connecting-ip");
  if (!(await verifyTurnstile(env, body.turnstile, ip, "waitlist"))) {
    return json({ error: "We couldn't check that you're a person. Try again, or email hello@eucas.app." }, 403);
  }

  const agents = Array.isArray(body.agents) ? [...new Set(body.agents.filter((a): a is string => typeof a === "string" && AGENTS.has(a)))] : [];
  const plan = typeof body.plan === "string" && PLANS.has(body.plan) ? body.plan : "free";
  const ref = cleanRef(body.ref);

  // The privacy note promises this: a confirm link not clicked in 30 days means the email is deleted.
  await env.DB.prepare("DELETE FROM waitlist WHERE status = 'pending' AND created_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-30 days')").run();

  const existing = await env.DB.prepare("SELECT status FROM waitlist WHERE email = ?").bind(email).first<{ status: string }>();
  if (existing) {
    // Same answer as a new sign-up, so the form never reveals who is on the list: a throwaway token, not theirs.
    if (agents.length) await env.DB.prepare("UPDATE waitlist SET agents = ? WHERE email = ?").bind(agents.join(","), email).run();
    return json({ ok: true, token: newToken(), confirm: existing.status === "pending" });
  }

  const token = newToken();
  await env.DB.prepare("INSERT INTO waitlist (email, token, status, agents, plan, ref, consent_text) VALUES (?, ?, 'unconfirmed', ?, ?, ?, ?)")
    .bind(email, token, agents.join(","), plan, ref, CONSENT)
    .run();
  const sent = await sendConfirm(env, email, token);
  if (sent) await env.DB.prepare("UPDATE waitlist SET status = 'pending' WHERE token = ?").bind(token).run();
  return json({ ok: true, token, confirm: sent });
};
