// The eucas.app Worker. Static files in public/ are served by Workers static assets; only /api/* runs here.
import { type Ctx, type Env, json } from "../lib/waitlist.ts";
import * as confirm from "./api/confirm.ts";
import * as details from "./api/details.ts";
import * as subscribe from "./api/subscribe.ts";
import * as unsubscribe from "./api/unsubscribe.ts";

type Handler = (ctx: Ctx) => Promise<Response>;

const ROUTES: Record<string, Record<string, Handler>> = {
  "/api/subscribe": { POST: subscribe.onRequestPost },
  "/api/details": { POST: details.onRequestPost },
  "/api/confirm": { GET: confirm.onRequestGet },
  "/api/unsubscribe": { GET: unsubscribe.onRequestGet, POST: unsubscribe.onRequestPost },
};

// public/_headers covers static files only; Worker responses need their own (developers.cloudflare.com/workers/static-assets/headers/).
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function secure(response: Response): Response {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  return response;
}

async function route(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);
  const methods = ROUTES[pathname];
  if (!methods) return json({ error: "not found" }, 404);
  const handler = methods[request.method];
  if (!handler) return new Response(null, { status: 405, headers: { allow: Object.keys(methods).join(", ") } });
  if (request.method === "POST" && env.RATE_LIMITER) {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: `${pathname}:${ip}` });
    if (!success) return json({ error: "Too many tries from your network. Wait a minute and try again." }, 429);
  }
  return handler({ request, env });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return secure(await route(request, env));
  },
};
