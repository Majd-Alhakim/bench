// GET /api/confirm?t=…: the double opt-in link from the email.
import { type Ctx, isToken, page } from "../../lib/waitlist.ts";

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  const t = new URL(request.url).searchParams.get("t");
  if (!isToken(t)) return page("That link doesn't work", "<p>It may be cut short. Open it from the email again, or join from <a href=\"/#join\">the waitlist</a>.</p>", 400);
  const r = await env.DB.prepare(
    "UPDATE waitlist SET status = 'confirmed', confirmed_at = COALESCE(confirmed_at, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) WHERE token = ?",
  ).bind(t).run();
  if (!r.meta.changes) return page("We couldn't find you", "<p>You may have left the list already. You can <a href=\"/#join\">join again</a>.</p>", 404);
  return page("You're confirmed", `<p>You'll get the first Windows build of Eucas when it's ready. Nothing else in between.</p><p><a href="/api/unsubscribe?t=${t}">Leave the list</a></p>`);
};
