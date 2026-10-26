/* Eucas companion prototype · components and data.
   Component names match DESIGN.md §4 so the build can map them one to one:
   TrayIcon, HeartbeatLine, HeartbeatStrip, SessionAvatar, NeedsYouCard, SuggestedRuleChip, SuggestedRuleRow,
   RuleCard, UsageMeter, ForecastLine, SameFileCard, ProtectionStatusCard, LogRow, Checklist, ProLine,
   WinToast, UndoToast, TripwireCard, Banner. */
"use strict";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => new Intl.NumberFormat("en-GB").format(n);

/* ---------------- Fixed copy (UX ux-research §4.2: store once, reuse everywhere) ---------------- */
const COPY = {
  promise: "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.",
  guard: "Eucas checks every tool call in your Claude Code sessions on this PC, stops when it’s unsure, tells you the moment it isn’t running, and stops a session that starts mass-deleting.",
  gap: "Eucas sees tool calls, not what a program does once it runs, and nothing in the cloud. Keep git and backups on.",
  privacy: "Eucas keeps counts, never the text of your prompts or files, and nothing leaves this PC.",
  ccv: "2.1.314",
};

/* ---------------- Icons: one outline set, 1.5 px, 24 grid, currentColor ---------------- */
const IC = {
  today: '<path d="M4 13.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5"/><path d="M4 13.5 6.4 6.3A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 1.3L20 13.5"/><path d="M4 13.5h4.2l1.3 2.5h5l1.3-2.5H20"/>',
  rules: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
  shield: '<path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6z"/>',
  shieldcheck: '<path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  gauge: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="m12 13 3.5-3.5"/><circle cx="12" cy="13" r="1"/>',
  retro: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v3.5h3.5"/><path d="M12 8v4l2.5 1.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  chev: '<path d="m9.5 6 6 6-6 6"/>',
  chevd: '<path d="m6 9.5 6 6 6-6"/>',
  chevu: '<path d="m6 14.5 6-6 6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  min: '<path d="M6 12h12"/>',
  max: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
  ext: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h3.8l2 2h7.2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.2M12 17.2v.1"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.1"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  moon: '<path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  term: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="m7.5 9.5 3 2.5-3 2.5M12.5 15h4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  download: '<path d="M12 4.5v11M7.5 11l4.5 4.5 4.5-4.5M5 19.5h14"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
  more: '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
  undo: '<path d="M9 7.5 4.5 12 9 16.5"/><path d="M4.5 12H15a4.5 4.5 0 0 1 0 9h-1.5"/>',
  file: '<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-10z"/><path d="M14 3.5v5h5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
  slashc: '<circle cx="12" cy="12" r="8.5"/><path d="m6 18 12-12"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r=".9" fill="currentColor"/>',
  vol: '<path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  batt: '<rect x="2.5" y="7.5" width="17" height="9" rx="2"/><path d="M21.5 10.5v3"/><rect x="4.5" y="9.5" width="10" height="5" rx="1" fill="currentColor" stroke="none"/>',
  cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 4 4 0 0 1-.5 7.5z"/>',
  split: '<path d="M8 4.5v15M16 4.5v15"/><rect x="3.5" y="4.5" width="17" height="15" rx="2"/>',
  pin: '<path d="M14.5 4 20 9.5l-3 1-4 4 .5 4-2 1-7-7 1-2 4 .5 4-4z"/><path d="m4.5 19.5 4-4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  heart: '<path d="M3 12h4l2-4 3 8 2-4h7"/>',
};
/* The Look inside eyes glyph (BRAND §5): two slanted pills */
const EYES_GLYPH = '<g fill="currentColor" stroke="none"><rect x="7.2" y="6.5" width="3.6" height="10" rx="1.8" transform="rotate(-12 9 11.5)"/><rect x="13.2" y="6.5" width="3.6" height="10" rx="1.8" transform="rotate(-12 15 11.5)"/></g>';
function ic(name, size = 16, sw = 1.5) {
  const body = name === "eyes" ? EYES_GLYPH : IC[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/* ---------------- The Quartet mark (from brand/logo/mark.svg) ---------------- */
const MARK_D = [
  "M4.8 25A20.2 20.2 0 1 1 45.2 25A20.2 20.2 0 1 1 4.8 25Z",
  "M78.9 8.75L95.64 37.75A4.5 4.5 0 0 1 91.74 44.5L58.26 44.5A4.5 4.5 0 0 1 54.36 37.75L71.1 8.75A4.5 4.5 0 0 1 78.9 8.75Z",
  "M18 57L33 57A11 11 0 0 1 44 68L44 83A11 11 0 0 1 33 94L18 94A11 11 0 0 1 7 83L7 68A11 11 0 0 1 18 57Z",
  "M74.5 52.81C79.35 60.57 90.99 70.27 90.99 79.97C90.99 89.18 83.72 95 74.5 95C65.28 95 58.01 89.18 58.01 79.97C58.01 70.27 69.65 60.57 74.5 52.81Z",
];
const QUARTET_HUES = ["#ff5f73", "#f2ab1d", "#3cc47c", "#e05cb4"];
function mark(size = 20, color = "currentColor") {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${MARK_D.map(d => `<path fill="${color}" d="${d}"/>`).join("")}</svg>`;
}
/* App icon: four seats on an Ink tile, the only everyday place the mark wears colour (BRAND §7) */
function appIcon(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><rect width="100" height="100" rx="12" fill="#15171d"/><g transform="translate(20 20) scale(.6)">${MARK_D.map((d, i) => `<path fill="${QUARTET_HUES[i]}" d="${d}"/>`).join("")}</g></svg>`;
}

/* ---------------- TrayIcon: 16 px, six states, readable without colour ----------------
   state: calm | needs | off | unverified | paused | setup.  count for needs. bg = the taskbar colour (cut-outs). */
function TrayIcon(state, { count = 2, size = 16, bg = "var(--os-taskbar)" } = {}) {
  const dim = state === "paused" || state === "setup";
  const g = `<g transform="scale(.16)" opacity="${dim ? 0.5 : 1}">${MARK_D.map(d => `<path fill="var(--tray-glyph)" d="${d}"/>`).join("")}</g>`;
  let badge = "";
  if (state === "needs") badge = `<circle cx="12" cy="12" r="4.6" fill="var(--tray-badge-attn)" stroke="${bg}" stroke-width="1.2"/><text x="12" y="14.4" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="6.6" font-weight="700" fill="var(--tray-badge-text)">${count > 9 ? "9+" : count}</text>`;
  if (state === "unverified") badge = `<circle cx="12" cy="12" r="4.6" fill="var(--tray-badge-attn)" stroke="${bg}" stroke-width="1.2"/><path d="M12 9.6v2.8" stroke="var(--tray-badge-text)" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="14.3" r=".8" fill="var(--tray-badge-text)"/>`;
  if (state === "off") badge = `<path d="M1.5 14.5 14.5 1.5" stroke="${bg}" stroke-width="3.6" stroke-linecap="round"/><path d="M1.5 14.5 14.5 1.5" stroke="var(--tray-slash)" stroke-width="1.6" stroke-linecap="round"/>`;
  if (state === "paused") badge = `<circle cx="12" cy="12" r="4.4" fill="${bg}"/><path d="M14.4 13.2a3 3 0 1 1-3.6-3.6 2.4 2.4 0 0 0 3.6 3.6z" fill="var(--tray-moon)"/>`;
  return `<svg class="tray-ico" width="${size}" height="${size}" style="width:${size}px;height:${size}px" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${g}${badge}</svg>`;
}
const TRAY_TIP = {
  calm: n => `Eucas · guard on · ${n} sessions · checked 2 s ago`,
  needs: n => `Eucas · ${n} things need you`,
  off: () => "Eucas · bench isn’t guarded: no check for 40 s",
  unverified: () => `Eucas · not verified for Claude Code ${COPY.ccv} yet`,
  paused: () => "Eucas · notifications paused until 15:00 · guard on",
  setup: () => "Eucas · finishing setup",
};

/* ---------------- SessionAvatar: flat shape, white eyes, the project's hue × shape ---------------- */
const SHAPES = {
  sphere: '<circle cx="50" cy="52" r="40"/>',
  droplet: '<path d="M50 8 C60 24 84 44 84 64 C84 83 69 95 50 95 C31 95 16 83 16 64 C16 44 40 24 50 8 Z"/>',
  square: '<rect x="12" y="13" width="76" height="76" rx="22"/>',
  triangle: '<polygon points="50,16 88,82 12,82" stroke-linejoin="round" stroke-width="14"/>',
  hexagon: '<polygon points="50,12 84,31 84,71 50,90 16,71 16,31" stroke-linejoin="round" stroke-width="10"/>',
  pill: '<rect x="6" y="27" width="88" height="48" rx="24"/>',
};
const EYE_AT = { sphere: [50, 50, 13], droplet: [50, 66, 12], square: [50, 50, 13], triangle: [50, 64, 10], hexagon: [50, 52, 13], pill: [60, 51, 11] };
function SessionAvatar(s, size = 24, { badge = null, orb = false, closed = false } = {}) {
  const [ex, ey, gap] = EYE_AT[s.shape];
  const stroke = s.shape === "triangle" || s.shape === "hexagon" ? ` stroke="var(--agent-base)"` : "";
  const eyes = closed
    ? `<g fill="#fff"><rect x="${-gap / 2 - 4}" y="-1.5" width="8" height="3" rx="1.5"/><rect x="${gap / 2 - 4}" y="-1.5" width="8" height="3" rx="1.5"/></g>`
    : `<g fill="#fff"><rect x="${-gap / 2 - 3.2}" y="-8" width="6.4" height="16" rx="3.2" transform="rotate(-12 ${-gap / 2} 0)"/><rect x="${gap / 2 - 3.2}" y="-8" width="6.4" height="16" rx="3.2" transform="rotate(-12 ${gap / 2} 0)"/></g>`;
  const b = badge ? `<span class="bdg ${badge.c}">${badge.g}</span>` : orb ? `<span class="orb"></span>` : "";
  return `<span class="av" data-hue="${s.hue}" style="width:${size}px;height:${size}px" aria-hidden="true"><svg viewBox="0 0 100 100"><g fill="var(--agent-base)"${stroke}>${SHAPES[s.shape]}</g><g transform="translate(${ex} ${ey})"><g class="eyes">${eyes}</g></g></svg>${b}</span>`;
}
const BADGE = {
  needs: { c: "attn", g: '<svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 2.4v4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="9.3" r="1.2" fill="currentColor"/></svg>' },
  failed: { c: "danger", g: '<svg width="9" height="9" viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
  stopped: { c: "calm", g: '<svg width="9" height="9" viewBox="0 0 12 12"><rect x="3.4" y="3.4" width="5.2" height="5.2" rx="1" fill="currentColor"/></svg>' },
  done: { c: "ok", g: '<svg width="9" height="9" viewBox="0 0 12 12"><path d="M3.2 6.2l1.9 1.9 3.7-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  idle: { c: "calm", g: '<svg width="9" height="9" viewBox="0 0 12 12"><circle cx="6" cy="6" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' },
};
function avFor(s, size = 24) {
  const st = s.state;
  if (st === "working") return SessionAvatar(s, size, { orb: true });
  if (st === "needs") return SessionAvatar(s, size, { badge: BADGE.needs });
  if (st === "stopped") return SessionAvatar(s, size, { badge: BADGE.stopped, closed: true });
  if (st === "failed") return SessionAvatar(s, size, { badge: BADGE.failed });
  if (st === "done") return SessionAvatar(s, size, { badge: BADGE.done });
  return SessionAvatar(s, size, { badge: size >= 24 ? BADGE.idle : null });
}
/* Agent view's six states, in Eucas's voice (UX ia-and-flows §2.1) */
const STATE_WORD = { working: "Working", needs: "Needs you", idle: "Idle", done: "Done", failed: "Failed", stopped: "Stopped" };

/* ---------------- Data (believable, totals computed from rows) ---------------- */
const SESSIONS0 = [
  { id: "bench", name: "bench", path: "C:/dev/bench", hue: "lavender", shape: "sphere", state: "needs", where: "Windows Terminal · tab “bench”", tok: 182400, share: 33, since: "10:44" },
  { id: "api-docs", name: "api-docs", path: "C:/dev/api-docs", hue: "teal", shape: "droplet", state: "working", where: "Claude desktop app · Code tab", tok: 64100, share: 11, since: "12:58" },
  { id: "notes", name: "notes", path: "C:/Users/maya/notes", hue: "honey", shape: "square", state: "idle", where: "VS Code · terminal", tok: 9300, share: 2, since: "13:12", idleSince: "13:40" },
];
const SESSION4 = { id: "site", name: "bakery-site", path: "C:/dev/bakery-site", hue: "coral", shape: "triangle", state: "working", where: "Windows Terminal · tab “site”", tok: 21800, share: 4, since: "13:55" };

const NEEDS0 = [
  { id: "n1", kind: "permission", s: "bench", age: "2 min", cmd: "pnpm build", where: "bench/", cons: ["Runs in bench/", "you’ve allowed this 14 times"], suggest: { cmd: "pnpm build", scope: "bench/", n: 14 } },
  { id: "n2", kind: "question", s: "api-docs", age: "6 min", q: "Should the v2 routes keep the old /users alias for a release?", cons: ["A question for you", "the session is waiting"] },
];

const LOG0 = [
  { id: "l1", t: "13:58:07", s: "bench", k: "block", what: "git push origin main", why: "a push to your default branch", by: "Limit · push to default branch", raw: '{"decision":"deny","reason":"Eucas blocks pushes to the default branch. Ask the user to push or open a PR."}' },
  { id: "l2", t: "13:41:12", s: "api-docs", k: "warn", what: "src/router.ts", why: "two sessions editing the same file", by: "Same-file warning · 15 min window" },
  { id: "l3", t: "12:20:44", s: "notes", k: "block", what: "curl -X POST https://hooks.slack.com/services/…", why: "a send", by: "Limit · send", raw: '{"decision":"deny","reason":"Eucas blocks sends. Ask the user to send it."}' },
  { id: "l4", t: "11:03:09", s: "bench", k: "on", what: "Guarded", why: "first check from this session", by: "Heartbeat" },
  { id: "l5", t: "09:12:40", s: "Eucas", k: "on", what: `Verified for Claude Code ${COPY.ccv}`, why: "the test push was blocked after the update", by: "Canary · hook-only" },
  { id: "l6", t: "08:55:02", s: "notes", k: "block", what: "stripe payment_intents create --amount 4900", why: "a payment", by: "Limit · pay" },
  { id: "l7", t: "08:31:17", s: "bench", k: "block", what: "Remove-Item -Recurse -Force dist", why: "a delete", by: "Limit · delete" },
];
const LOG_TRIP = { id: "l0", t: "14:02:31", s: "bench", k: "trip", what: "1,240 files deleted in 20 s", why: "mass delete under bench/", by: "Tripwire · 200 files" };
const LOG_OFF = { id: "l00", t: "14:01:52", s: "bench", k: "off", what: "Not guarded", why: "tools ran with no check for 40 s", by: "Heartbeat" };

const SUGG0 = [
  { id: "s1", cmd: "git status", scope: "bench/", n: 488, ro: true, pre: true },
  { id: "s2", cmd: "git diff", scope: "bench/", n: 301, ro: true, pre: true },
  { id: "s3", cmd: "ls", scope: "api-docs/", n: 97, ro: true, pre: true },
  { id: "s4", cmd: "pnpm test", scope: "bench/", n: 212, runner: true },
  { id: "s5", cmd: "gh pr create", scope: "bench/", n: 31, conflict: true },
];
const SUGG_RULES = [
  { id: "r4", cmd: "pnpm test", scope: "bench/", n: 212, runner: true },
  { id: "r5", cmd: "pnpm lint", scope: "bench/", n: 64, runner: true },
  { id: "r6", cmd: "gh pr create", scope: "bench/", n: 31, conflict: true },
];
const RULES0 = [
  { id: "y1", cmd: "git status", scope: "bench/", n: 1204, since: "12 Oct", last: "2 min ago", on: true },
  { id: "y2", cmd: "git diff", scope: "bench/", n: 860, since: "12 Oct", last: "9 min ago", on: true },
  { id: "y3", cmd: "ls", scope: "api-docs/", n: 97, since: "19 Oct", last: "1 h ago", on: true },
];
const TEMPLATES = [
  ["Read-only git", "git status · git diff · git log", "all projects"],
  ["List and read files", "ls · cat · Get-Content", "all projects"],
  ["Your test command", "pnpm test", "one folder you pick"],
  ["Lint", "pnpm lint", "one folder you pick"],
  ["Search", "rg · grep · Select-String", "all projects"],
];

/* ---------------- HeartbeatLine: the product ----------------
   state: guarded | idle | not_guarded | not_verified | user_level | org | failing | off | untested | setup */
function hbGlyph(state) {
  const g = {
    guarded: '<circle cx="7" cy="7" r="3.6" fill="currentColor"/>',
    idle: '<circle cx="7" cy="7" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    not_guarded: '<circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.6 10.4 10.4 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    off: '<circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.6 10.4 10.4 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    failing: '<circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 5l4 4M9 5 5 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    not_verified: '<path d="M7 1.8 12.6 11.6H1.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 5.6v2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="9.9" r=".8" fill="currentColor"/>',
    untested: '<path d="M7 1.8 12.6 11.6H1.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 5.6v2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="9.9" r=".8" fill="currentColor"/>',
    user_level: '<circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 2.4a4.6 4.6 0 0 1 0 9.2z" fill="currentColor"/>',
    org: '<rect x="2.6" y="6.2" width="8.8" height="6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4.6 6.2V4.6a2.4 2.4 0 0 1 4.8 0v1.6" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    setup: '<circle cx="7" cy="7" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2"/>',
  }[state];
  const s = state === "off" ? "not_guarded" : state;
  return `<span class="hbg" data-s="${s}" data-hbg>${state === "guarded" ? '<span class="ring"></span>' : ""}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">${g}</svg></span>`;
}
/* The sentence for each state. {n} sessions, {ago} live seconds. Words before colour. */
function hbSentence(state, ctx = {}) {
  const n = ctx.n ?? 3;
  const ago = `<span data-ago class="num">${ctx.ago ?? 2}</span> s ago`;
  switch (state) {
    case "guarded": return `<b>Guard on</b> <span class="t2">· ${n} session${n === 1 ? "" : "s"} · checked ${ago}</span>`;
    case "idle": return `<b>Guard ready</b> <span class="t2">· ${ctx.noSessions ? "no sessions running" : "idle since 13:40"}</span>`;
    case "not_guarded": return `<b>bench isn’t guarded</b> <span class="t2">· no check for 40 s</span>`;
    case "not_verified": return `<b>Not verified for Claude Code ${COPY.ccv}</b> <span class="t2">· guard on, test pending</span>`;
    case "untested": return `<b>Guard on · not yet tested</b> <span class="t2">· the test couldn’t run</span>`;
    case "user_level": return `<b>Guard on · user level</b> <span class="t2">· weaker · checked ${ago}</span>`;
    case "org": return `<b>Blocked by your organisation</b> <span class="t2">· sessions aren’t guarded</span>`;
    case "failing": return `<b>Guard failing</b> <span class="t2">· blocking every tool call</span>`;
    case "off": return `<b>Protection is off</b> <span class="t2">· back on at 14:17</span>`;
    case "setup": return `<b>Finishing setup</b>`;
    default: return "";
  }
}
function HeartbeatLine(state, ctx = {}) {
  if (ctx.stack) return `<span class="hb stack" data-hb="${state}">${hbGlyph(state)}<span class="hb-txt">${hbSentence(state, ctx).replace(/<\/b> <span class="t2">· /, "</b><br><span class=\"t2\">")}</span></span>`;
  const live = state === "guarded" || state === "user_level" ? ' aria-live="off"' : "";
  return `<span class="hb${ctx.big ? " big" : ""}" data-hb="${state}"${live}>${hbGlyph(state)}<span class="hb-txt">${hbSentence(state, ctx)}</span></span>`;
}

/* ---------------- HeartbeatStrip: one bar per 10 s bucket over the last 10 minutes ---------------- */
function stripData(kind) {
  /* deterministic per kind so screenshots are stable */
  let seed = { bench: 7, "api-docs": 3, notes: 11, site: 5, all: 2 }[kind.id || kind] || 1;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const out = [];
  for (let i = 0; i < 60; i++) {
    const r = rnd();
    if (kind.mode === "first" && i < 54) out.push({ c: 0 });
    else if (kind.mode === "idle" && i > 22) out.push({ c: 0 });
    else if (kind.mode === "miss" && i > 55) out.push({ miss: true });
    else out.push({ c: r < 0.18 ? 0 : Math.ceil(r * 7) });
  }
  if (kind.mode !== "idle" && kind.mode !== "miss") out[59] = { c: 4, now: true };
  return out;
}
function HeartbeatStrip(opts = {}) {
  const data = stripData(opts);
  const max = 7;
  const bars = data.map(b => b.miss ? `<i class="miss" style="height:100%"></i>` : b.c === 0 ? `<i class="idle"></i>` : `<i class="${b.now ? "now" : ""}" style="height:${Math.round(20 + (b.c / max) * 80)}%"></i>`).join("");
  const label = opts.mode === "miss" ? "Tools ran with no check in the last 40 seconds" : opts.mode === "idle" ? "No tool calls since 13:40" : "A check landed in every busy 10-second slot in the last 10 minutes";
  return `<div class="hbs-wrap"><div class="hbs${opts.sm ? " sm" : ""}${opts.fill ? " fill" : ""}" role="img" aria-label="${label}" data-strip="${opts.id || ""}">${bars}</div>${opts.axis ? `<div class="hbs-axis"><span>13:52</span><span>now</span></div>` : ""}</div>`;
}

/* ---------------- NeedsYouCard: compact (popover) · full (Today) ---------------- */
function NeedsYouCard(n, { variant = "full", s2 = false, primary = true } = {}) {
  const s = sess(n.s);
  const compact = variant === "compact";
  const ev = n.kind === "permission"
    ? `<span>wants to run</span><code class="cmd">${esc(n.cmd)}</code>${compact ? "" : `<span>in <code>${esc(n.where)}</code></span>`}`
    : `<span style="color:var(--text-1)">Asks: ${esc(n.q)}</span>`;
  const allow = s2 && n.kind === "permission" ? `<button class="btn sec${compact ? " sm" : ""}" data-act="allow" data-id="${n.id}">Allow once</button>` : "";
  const hint = !s2 && n.kind === "permission" && !compact ? `<span class="t-meta t3">Answer in the terminal, or open it</span>` : "";
  const chip = n.suggest && !compact ? SuggestedRuleChip(n.suggest) : "";
  return `<article class="need${compact ? " compact" : ""}" data-need="${n.id}" aria-label="${esc(s.name)} needs you">
    <div class="nh">${avFor(s, compact ? 20 : 24)}<span class="who">${esc(s.name)}</span><span class="sr">needs you</span><span class="when">waiting ${esc(n.age)}</span></div>
    <div class="ev">${ev}</div>
    ${compact ? "" : `<div class="cons dots">${n.cons.map(c => `<span>${esc(c)}</span>`).join("")}</div>`}
    <div class="acts"><button class="btn ${primary ? "pri" : "sec"}${compact ? " sm" : ""}" data-act="open-session" data-id="${n.id}">Open session</button>${allow}<button class="btn ter${compact ? " sm" : ""}" data-act="snooze" data-id="${n.id}">Not now</button>${hint}<span class="sp"></span>${chip}</div>
  </article>`;
}
/* SuggestedRuleChip: after 10+ manual allows, the card offers the rule (automatic deposit, visible evidence) */
function SuggestedRuleChip(sg) {
  return `<button class="srchip" data-act="suggest-rule" data-cmd="${esc(sg.cmd)}">${ic("rules", 14)}<span>Make <b>${esc(sg.cmd)}</b> a rule</span></button>`;
}

/* ---------------- Rules ---------------- */
function SuggestedRuleRow(r, { checkable = true, checked = false, addBtn = false } = {}) {
  const line = r.conflict
    ? `<span class="t-meta" style="color:var(--text-2)">Your Claude Code settings ask for this every time. That wins; this rule would do nothing.</span>`
    : r.runner
      ? `<span class="t-meta attn">Runs code from the project. Tick only if you trust every repo here.</span>`
      : `<span class="t-meta">Would have auto-approved ${fmt(r.n)} calls in the last 7 days, all in ${esc(r.scope)}</span>`;
  const ctrl = checkable
    ? `<input type="checkbox" class="cb" id="cb-${r.id}" data-act="tick" data-id="${r.id}" ${checked ? "checked" : ""} ${r.conflict ? "disabled" : ""} aria-describedby="d-${r.id}">`
    : `<span></span>`;
  const add = addBtn ? (r.conflict ? `<button class="btn sec sm" disabled title="Your own ask rule wins">Add</button>` : `<button class="btn sec sm" data-act="preview-rule" data-id="${r.id}">Add</button>`) : `<span class="t-meta t3 num">${fmt(r.n)}×</span>`;
  return `<div class="sr-row${r.conflict ? " off" : ""}">${ctrl}<label class="srm" for="cb-${r.id}"><span><code class="cmdt">${esc(r.cmd)}</code> <span class="t2 t-sub">in ${esc(r.scope)} · you allowed it ${fmt(r.n)} times</span></span><span id="d-${r.id}">${line}</span></label>${add}</div>`;
}
function RuleCard(r) {
  return `<div class="rule"><div class="rm"><span><code>${esc(r.cmd)}</code> <span class="t2 t-sub">in ${esc(r.scope)}</span></span><span class="t-meta">Auto-approved <span class="num">${fmt(r.n)}</span> times since ${esc(r.since)} · last used ${esc(r.last)}</span></div>
    <input type="checkbox" class="sw" role="switch" ${r.on ? "checked" : ""} aria-label="Auto-approve ${esc(r.cmd)} in ${esc(r.scope)}" data-act="rule-toggle" data-id="${r.id}">
    <button class="ibtn" aria-label="More for ${esc(r.cmd)}" title="Edit scope · Delete">${ic("more", 16)}</button></div>`;
}

/* ---------------- UsageMeter and ForecastLine ---------------- */
function UsageMeter(m) {
  const close = m.pct >= m.threshold;
  return `<div class="card meter"><div class="mh"><span class="t-sub strong">${esc(m.label)}</span><span class="t-meta">updated ${esc(m.updated)}</span></div>
    <div class="mh"><span class="fig">${m.pct} %</span>${close ? `<span class="tag attn">close</span>` : ""}<span class="t-sub t2" style="margin-left:auto">resets ${esc(m.resets)}</span></div>
    <div class="mbar${close ? " close" : ""}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${m.pct}" aria-label="${esc(m.label)}: ${m.pct} percent used, resets ${esc(m.resets)}">${m.fc ? `<span class="fc" style="width:${Math.min(100, m.fc)}%"></span>` : ""}<i style="width:${m.pct}%"></i><span class="tick" style="left:${m.threshold}%" title="Your warning line: ${m.threshold} %"></span></div>
    <div class="mends"><span>0</span><span>your line ${m.threshold} %</span><span>100 %</span></div>
    ${m.forecast ? `<p class="fcast" title="${esc(m.basis || "")}">${m.forecast}</p>` : ""}</div>`;
}

/* ---------------- LogRow (one row for blocks, warnings, tripwire, guard changes) ---------------- */
const LOG_GLYPH = {
  block: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="currentColor"/><path d="M5 8h6" stroke="var(--bg-ground)" stroke-width="1.8" stroke-linecap="round"/></svg>',
  warn: ic("alert", 16),
  trip: ic("stop", 16),
  off: ic("slashc", 16),
  on: ic("check", 16),
};
const LOG_WORD = { block: "Blocked by Eucas", warn: "Warning", trip: "Tripwire stop", off: "Guard change", on: "Guard change" };
function LogRow(l, open) {
  const det = open ? `<div class="ldet" id="ld-${l.id}">
      <dl><dt>What</dt><dd><code>${esc(l.what)}</code></dd><dt>Why</dt><dd>${esc(cap(l.why))}</dd><dt>Decided by</dt><dd>${esc(l.by)}</dd><dt>Session</dt><dd>${esc(l.s)} · ${esc(sess(l.s)?.where || "Eucas")}</dd>${l.raw ? `<dt>Hook decision</dt><dd><code>${esc(l.raw)}</code></dd>` : ""}</dl>
      ${l.k === "block" ? `<p>If you meant it, run it yourself in a terminal.</p><div style="display:flex;gap:8px"><button class="btn sec sm" data-act="copy-cmd">${ic("copy", 14)} Copy command</button></div>` : ""}
    </div>` : "";
  return `<div><button class="lrow" data-act="log-toggle" data-id="${l.id}" aria-expanded="${open ? "true" : "false"}" aria-controls="ld-${l.id}"><span class="lk ${l.k}" title="${LOG_WORD[l.k]}">${LOG_GLYPH[l.k]}<span class="sr">${LOG_WORD[l.k]}</span></span><span class="lt">${esc(l.t.slice(0, 5))}</span><span class="ls">${esc(l.s)}</span><span class="lw">${esc(l.what)}</span><span class="ly">${esc(l.why)}</span><span class="chev">${ic("chev", 14)}</span></button>${det}</div>`;
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- Checklist (detection · install · diagnostic) ---------------- */
const CK = {
  ok: ic("check", 16, 2),
  warn: ic("alert", 16),
  bad: ic("slashc", 16),
  wait: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1.5a5.5 5.5 0 1 1-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  none: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="2" fill="currentColor" opacity=".5"/></svg>',
};
function Checklist(items, cls = "") {
  return `<ul class="chk ${cls}">${items.map(i => `<li data-s="${i.s}" class="${i.anim ? "in" : ""}"><span class="ci">${CK[i.s] || CK.none}</span><span>${i.t}</span>${i.v ? `<span class="dv">${i.v}</span>` : i.end ? `<span>${i.end}</span>` : "<span></span>"}</li>`).join("")}</ul>`;
}

/* ---------------- ProLine (D-2: waitlist; one Text 2 line, never in a worst moment) ---------------- */
function ProLine(key, text) {
  if (S.d.d2 === "hidden" || S.proDismissed.has(key) || S.offline) return "";
  const on = S.waitlist;
  return `<p class="pro" data-pro="${key}">${text} ${on ? `<span class="t3">You’re on the list. Eucas tells you here when it’s ready.</span>` : `<button class="link" data-act="waitlist">Get notified</button><button class="x" data-act="pro-dismiss" data-key="${key}">Not interested</button>`}</p>`;
}

/* ---------------- Banner ---------------- */
function Banner(kind, title, body, actions = "") {
  return `<div class="banner ${kind}" role="${kind === "danger" ? "alert" : "status"}"><span class="bi">${ic(kind === "danger" ? "slashc" : "alert", 18)}</span><div class="bt"><b>${title}</b>${body ? `<span class="t2">${body}</span>` : ""}</div>${actions ? `<div class="ba">${actions}</div>` : ""}</div>`;
}

/* ---------------- SameFileCard ---------------- */
function SameFileCard({ compact = false } = {}) {
  const a = sess("bench"), b = sess("api-docs");
  if (compact) return `<article class="need compact same"><div class="nh">${ic("split", 16)}<span class="who">Two sessions, one file</span><span class="when">4 min</span></div><div class="ev"><code class="cmd">src/router.ts</code><span>bench · api-docs</span></div><div class="acts"><button class="btn sec sm" data-act="go" data-to="today">Show both</button></div></article>`;
  return `<article class="need same"><div class="nh">${ic("split", 18)}<span class="who">Two sessions are editing the same file</span><span class="tag outline">Warning</span><span class="when">4 min</span></div>
    <p class="t-sub t2">api-docs changed <code>src/router.ts</code> 4 minutes after bench did. If both keep going, one may overwrite the other’s work.</p>
    <div class="pair"><div class="who2">${avFor(a, 24)}<div><b>bench</b>last edit 13:37 · 18 lines</div></div><div class="who2">${avFor(b, 24)}<div><b>api-docs</b>last edit 13:41 · 6 lines</div></div></div>
    <div class="acts"><button class="btn sec" data-act="show-both">Show both</button><button class="btn ter" data-act="open-session" data-sid="bench">Open bench</button><button class="btn ter" data-act="open-session" data-sid="api-docs">Open api-docs</button><span class="sp"></span><button class="btn ter" data-act="mute-file">Don’t warn for this file today</button></div></article>`;
}

/* ---------------- WinToast (content we design; Windows draws the frame) ---------------- */
const TOASTS = {
  needs: { t: "bench needs you", b: "Wants to run <code>pnpm build</code>", a: () => [["Open session", "pri", "open-session"], ...(S.d.s2 ? [["Allow once", "", "allow"]] : [])], stay: true },
  needs_q: { t: "api-docs needs you", b: "Asks: Should the v2 routes keep the old /users alias for a release?", a: () => [["Open session", "pri", "open-session"]], stay: true },
  done: { t: "bench is done and waiting for you", b: "It ran for 14 min.", a: () => [["Open session", "", "open-session"]] },
  blocked: { t: "Blocked in bench", b: "<code>git push origin main</code> · a push to your default branch", a: () => [["Why?", "", "why"]] },
  trip: { t: "Stopped bench: it deleted 1,240 files in 20 s", b: "Eucas checked it’s no longer running.", a: () => [["See what happened", "pri", "see-trip"]], stay: true, urgent: true },
  same: { t: "bench and api-docs are both editing a file", b: "<code>src/router.ts</code>", a: () => [["Show both", "", "show-both"]] },
  off: { t: "bench isn’t guarded", b: "Eucas hasn’t seen a check for 40 s.", a: () => [["Fix it", "pri", "fix-it"]], stay: true, urgent: true },
  limit: { t: "85 % of your 5-hour limit", b: "Resets 15:40.", a: () => [] },
  first: { t: "Guarding bench", b: "Protection checked.", a: () => [] },
  test: { t: "This is how Eucas tells you", b: "When a session needs you, a note like this appears. Nothing else interrupts.", a: () => [] },
  closed: { t: "Eucas is in the taskbar corner", b: "Click it any time.", a: () => [] },
  more: { t: "3 more things need you", b: "bench, api-docs and notes are waiting.", a: () => [["Open Eucas", "", "open-eucas"]] },
};
function WinToast(key, id) {
  const T = TOASTS[key];
  const acts = T.a();
  return `<div class="wt${T.urgent ? " urgent" : ""}" data-toast="${id}" role="status"><div class="wt-app">${appIcon(16)}<span>Eucas</span><span class="wt-time">now</span><button class="x" data-act="toast-close" data-id="${id}" aria-label="Dismiss">${ic("x", 14)}</button></div>
    <div class="wt-main"><span class="wt-title">${T.t}</span><span class="wt-body">${T.b}</span></div>
    ${acts.length ? `<div class="wt-acts">${acts.map(a => `<button data-act="${a[2]}" data-toast-id="${id}">${a[0]}</button>`).join("")}</div>` : ""}</div>`;
}

function sess(id) { return S.sessions.find(s => s.id === id) || SESSIONS0.concat(SESSION4).find(s => s.id === id); }
