// POST /api/details: the two optional answers after sign-up (sessions at once, which computer).
import { OSES, SESSIONS, type Ctx, isToken, json, readJson } from "../../lib/waitlist";

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const body = await readJson(request);
  if (!body || !isToken(body.token)) return json({ error: "bad request" }, 400);
  const sessions = typeof body.sessions === "string" && SESSIONS.has(body.sessions) ? body.sessions : "";
  const os = typeof body.os === "string" && OSES.has(body.os) ? body.os : "";
  await env.DB.prepare("UPDATE waitlist SET sessions = ?, os = ? WHERE token = ?").bind(sessions, os, body.token).run();
  return json({ ok: true });
};
