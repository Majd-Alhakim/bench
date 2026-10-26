// /api/unsubscribe?t=…: GET shows one button (so mail scanners can't unsubscribe you); POST deletes the row.
// POST also serves RFC 8058 one-click unsubscribe from the List-Unsubscribe header.
import { type Ctx, isToken, page } from "../../lib/waitlist.ts";

export const onRequestGet = async ({ request }: Ctx): Promise<Response> => {
  const t = new URL(request.url).searchParams.get("t");
  if (!isToken(t)) return page("That link doesn't work", "<p>It may be cut short. Open it from the email again, or write to <a href=\"mailto:hello@eucas.app\">hello@eucas.app</a>.</p>", 400);
  return page(
    "Leave the waitlist?",
    `<p>We'll delete your email and your answers. Nothing else will arrive.</p><form method="post" action="/api/unsubscribe?t=${t}"><button class="btn btn-ink" type="submit">Delete my email</button></form>`,
  );
};

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const t = new URL(request.url).searchParams.get("t");
  if (!isToken(t)) return page("That link doesn't work", "<p>Write to <a href=\"mailto:hello@eucas.app\">hello@eucas.app</a> and we'll remove you by hand.</p>", 400);
  await env.DB.prepare("DELETE FROM waitlist WHERE token = ?").bind(t).run();
  return page("You're off the list", "<p>Your email and answers are deleted. If you change your mind, <a href=\"/#join\">join again</a>.</p>");
};
