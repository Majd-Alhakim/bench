/* Eucas companion prototype · state, screens and interactions.
   One store (S), one render(). Routes are hashes so the jump menu and screenshots can land on any state. */
"use strict";

const root = document.documentElement;
const S = {
  d: { d1: "b", d2: "waitlist", d4: "admin", d5: "hook", s2: false },
  dBase: { d1: "b", d2: "waitlist", d4: "admin", d5: "hook", s2: false },
  osTheme: "dark",
  sound: true,
  guard: "guarded",           // guarded | idle | not_guarded | not_verified | user_level | org | failing | off | untested | setup
  paused: false,
  offline: false,
  sessions: SESSIONS0.map(s => ({ ...s })),
  needs: NEEDS0.map(n => ({ ...n })),
  log: LOG0.slice(),
  rules: RULES0.map(r => ({ ...r })),
  sugg: SUGG_RULES.map(r => ({ ...r })),
  frTicks: new Set(["s1", "s2", "s3"]),
  usage: "normal",            // normal | close | limit | tokens | api
  proDismissed: new Set(),
  waitlist: false,
  sameFile: false,
  v: { win: "main", route: "today", fr: null, fly: false, ctx: false, sheet: null, trip: null, max: false, logOpen: null, limitsOpen: false, sessOpen: false, preview: null, setSec: "notifications", ledger: "session", range: "today", diag: "idle", remove: false, scale: 1, empty: false, todayErr: false, ovf: false, tripCount: 0 },
};
let lastCheck = Date.now() - 2000, lastBeat = 0;

/* ---------------- Sound (DESIGN-SYSTEM §8.5): synthesised, nothing before the first gesture ---------------- */
let AC = null;
document.addEventListener("pointerdown", () => { if (!AC) try { AC = new AudioContext(); } catch (e) { /* no audio here */ } }, { once: true });
function tone(freqs, dur) {
  if (!S.sound || !AC) return;
  const t0 = AC.currentTime, g = AC.createGain(), f = AC.createBiquadFilter();
  f.type = "lowpass"; f.frequency.value = 2400; g.connect(f); f.connect(AC.destination);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.18 * 0.7, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  freqs.forEach((fr, i) => { const o = AC.createOscillator(); o.type = "sine"; o.frequency.value = fr; o.connect(g); o.start(t0 + i * (dur / freqs.length / 1.4)); o.stop(t0 + dur); });
}
const sfx = { needs: () => tone([440, 587.33], 0.32), done: () => tone([739.99], 0.38) };

/* ---------------- Derived ---------------- */
const nNeeds = () => S.needs.length + (S.v.trip ? 1 : 0);
function trayState() {
  if (S.v.win === "firstrun" && !["protected"].includes(S.v.fr)) return "setup";
  if (["not_guarded", "failing", "off", "org"].includes(S.guard)) return "off";
  if (nNeeds() > 0) return "needs";
  if (["not_verified", "untested", "user_level"].includes(S.guard)) return "unverified";
  if (S.paused) return "paused";
  return "calm";
}
const guardedCount = () => S.sessions.length;

/* ---------------- Render: the desktop ---------------- */
function render() {
  const keep = $(".layer")?.scrollTop || 0;
  const stage = $("#stage");
  stage.setAttribute("data-os-theme", S.osTheme);
  $("#desk").innerHTML = [
    S.v.sheet === "tray" ? TraySheet() : S.v.sheet === "toasts" ? ToastSheet() : "",
    S.v.win === "installer" ? Installer() : "",
    S.v.win === "firstrun" ? FirstRunWindow() : "",
    S.v.win === "main" ? MainWindow() : "",
    S.v.fly ? Flyout() : "",
    S.v.ctx ? CtxMenu() : "",
    S.v.ovf ? Overflow() : "",
  ].join("");
  $("#taskbar").innerHTML = Taskbar();
  const l = $(".layer"); if (l) l.scrollTop = keep;
  if (S.scrollTo) { const t = $(S.scrollTo); if (t && l) l.scrollTop = t.offsetTop - 140; S.scrollTo = null; }
  tickAgo();
}

function Taskbar() {
  const ts = trayState();
  const tip = TRAY_TIP[ts](ts === "needs" ? nNeeds() : guardedCount());
  return `<div class="tb-center" aria-hidden="true">
      <span class="tb-app"><svg width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity=".55"/><rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity=".55"/><rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity=".55"/><rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity=".55"/></svg></span>
      <span class="tb-app on">${ic("term", 22)}</span>
      <span class="tb-app on">${ic("folder", 22)}</span>
      ${S.v.win ? `<span class="tb-app on act">${appIcon(22)}</span>` : ""}
    </div>
    <div class="tray">
      <button class="tray-btn" data-act="overflow" aria-label="Show hidden icons" aria-expanded="${S.v.ovf}">${ic("chevu", 16)}</button>
      ${S.v.win === "installer" ? "" : `<button class="tray-btn" id="trayIcon" data-act="tray" aria-haspopup="dialog" aria-expanded="${S.v.fly}" aria-label="${esc(tip)}" title="${esc(tip)}">${TrayIcon(ts, { count: nNeeds() })}</button>`}
      <span class="tray-sys" aria-hidden="true">${ic("wifi", 16)}${ic("vol", 16)}${ic("batt", 16)}</span>
      <span class="tray-clock num" aria-hidden="true"><span>14:02</span><span>26/10/2026</span></span>
    </div>`;
}

/* ---------------- Main window ---------------- */
const NAV = [["today", "Today", "today"], ["rules", "Rules", "rules"], ["protection", "Protection", "shield"], ["usage", "Usage", "gauge"], ["retro", "Retro", "retro"]];
function MainWindow() {
  const r = S.v.route;
  const page = { today: Today, rules: Rules, protection: Protection, usage: Usage, retro: Retro, settings: Settings }[r]();
  return `<section class="win${S.v.max ? " max" : ""}" role="application" aria-label="Eucas">
    ${Caption("Eucas")}
    <div class="wbody">
      <nav class="side" aria-label="Sections">
        <button class="hbcard" data-act="go" data-to="protection" aria-label="Guard status, open Protection">${HeartbeatLine(S.guard, { n: guardedCount(), stack: true })}</button>
        ${NAV.map(([k, l, i], idx) => `<button class="nav" data-act="go" data-to="${k}" ${r === k ? 'aria-current="page"' : ""} title="${l} · Ctrl+${idx + 1}">${ic(i, 16)}<span>${l}</span>${k === "today" && nNeeds() ? `<span class="cnt attn" aria-label="${nNeeds()} need you">${nNeeds()}</span>` : ""}</button>`).join("")}
        <span class="grow"></span>
        <button class="nav" data-act="go" data-to="settings" ${r === "settings" ? 'aria-current="page"' : ""} title="Settings · Ctrl+6">${ic("gear", 16)}<span>Settings</span></button>
      </nav>
      <main class="layer" id="main">${page}${S.v.trip ? TripwireCard() : ""}${S.itoast ? `<div class="itoast" role="status">${S.itoast.msg}<button data-act="undo">Undo</button><span class="timer"></span></div>` : ""}</main>
    </div></section>`;
}
function Caption(title) {
  return `<div class="cap"><span class="cap-t">${appIcon(16)}<span>${title}</span></span><button class="cap-b" data-act="minimise" aria-label="Minimise">${ic("min", 14, 1)}</button><button class="cap-b" data-act="maximise" aria-label="Maximise">${ic("max", 12, 1)}</button><button class="cap-b x" data-act="close-win" aria-label="Close to the tray">${ic("x", 14, 1)}</button></div>`;
}
function PageHead(title, sub, action = "") {
  return `<header class="phead"><div class="ph-t"><h1 class="t-title">${title}</h1>${sub ? `<p class="t-sub t2">${sub}</p>` : ""}</div>${action}</header>`;
}

/* Today: needs you, sessions, today's events */
function guardBanner() {
  const g = S.guard;
  if (g === "not_guarded") return Banner("danger", "bench isn’t guarded", "It ran 3 tool calls in the last 40 s and Eucas didn’t see a check for any of them. Your other sessions are guarded.", `<button class="btn pri" data-act="fix-it">Fix it</button>`);
  if (g === "failing") return Banner("danger", "Eucas’s guard is failing and blocking every tool call in 3 sessions.", "Your work is safe: nothing ran that shouldn’t have. Sessions see “Eucas’s guard failed, not your command”.", `<button class="btn pri" data-act="repair">Repair</button><button class="btn ter" data-act="off15">Turn the guard off for 15 minutes</button>`);
  if (g === "off") return Banner("danger", "Protection is off until 14:17", "Your sessions aren’t checked and the limits don’t apply until then. It comes back on by itself.", `<button class="btn sec" data-act="guard-on">Turn it back on now</button>`);
  if (g === "not_verified") return Banner("attn", `Not verified for Claude Code ${COPY.ccv} yet`, "Claude Code updated at 09:10. The guard is on; the test that proves it hasn’t passed on this version yet.", `<button class="btn sec" data-act="canary">Run the test</button>`);
  if (g === "user_level") return Banner("attn", "Guard on, at user level (weaker)", "Without admin, the limits sit in your user settings, where an agent could change them. Eucas watches for that and tells you.", `<button class="btn sec" data-act="uac-again">Try again with admin</button>`);
  if (g === "org") return Banner("attn", "Your organisation’s Claude Code policy only allows its own hooks", "So Eucas can’t guard sessions on this PC. Your retro and usage still work.", `<button class="btn sec" data-act="copy-it">Copy a note for your IT team</button>`);
  return "";
}
function Today() {
  const n = nNeeds();
  const gw = { not_guarded: "2 of 3 sessions are guarded.", failing: "The guard is blocking every tool call.", off: "Protection is off until 14:17.", org: "Your organisation’s policy blocks the guard.", not_verified: "3 sessions are guarded; not verified on this version yet.", user_level: "3 sessions are guarded, at user level." }[S.guard] || `${guardedCount()} sessions are guarded.`;
  const sub = S.v.trip ? "Eucas stopped bench. 2 sessions are guarded." : S.v.empty ? "" : S.needs.length ? `${S.needs.length} thing${S.needs.length > 1 ? "s" : ""} need${S.needs.length > 1 ? "" : "s"} you. ${gw}` : `You’re all caught up. ${gw}`;
  const bannerPrimary = ["not_guarded", "failing"].includes(S.guard);
  if (S.v.empty) {
    return `<div class="page">${PageHead("Today", "")}<div class="card pad" style="display:grid;gap:8px;padding:28px"><h2 class="t-title">No sessions running</h2><p class="t-sub t2">The guard is ready. Sessions appear here a few seconds after you start or continue one in Claude Code, in a terminal, the desktop app or VS Code.</p><div>${HeartbeatLine("idle", { noSessions: true })}</div></div>
      <section class="sec"><h2 class="sech">Earlier today</h2><div class="card log">${S.log.slice(0, 3).map(l => LogRow(l, false)).join("")}</div></section></div>`;
  }
  const four = S.d.d1 === "b" && S.sessions.length > 3;
  const shown = four ? S.sessions.slice(0, 3) : S.sessions;
  const idleStopped = S.sessions.find(s => s.state === "stopped" && s.stopReason === "user");
  return `<div class="page">
    ${PageHead("Today", sub)}
    ${guardBanner()}
    ${S.needs.length || S.sameFile ? `<section class="sec" aria-labelledby="h-needs">
      <h2 class="sech" id="h-needs">What needs you${S.needs.length ? ` <span class="cnt attn">${S.needs.length}</span>` : ""}</h2>
      ${S.needs.map((x, i) => NeedsYouCard(x, { s2: S.d.s2, primary: i === 0 && !S.v.trip && !bannerPrimary })).join("")}
      ${S.sameFile ? SameFileCard() : ""}
    </section>` : ""}
    <section class="sec" aria-labelledby="h-sess">
      <h2 class="sech" id="h-sess">Sessions <span class="t3" style="font-weight:400">${S.sessions.length}</span><span class="sp"></span><button class="btn ter sm" data-act="go" data-to="protection">Guard detail</button></h2>
      <div class="card rows">${shown.map(SessionRowToday).join("")}${four ? `<div class="srow" style="grid-template-columns:28px 1fr"><span></span>${ProLine("sessions", `Showing details for 3 sessions. All ${S.sessions.length} are guarded. Pro shows every session’s details.`) || `<span class="t-sub t2">All ${S.sessions.length} sessions are guarded.</span>`}</div>` : ""}</div>
      ${idleStopped ? ProLine("supervisor", "Pro’s supervisor can nudge stopped sessions within a budget. It never nudges after a block.") : ""}
    </section>
    <section class="sec" aria-labelledby="h-ev">
      <h2 class="sech" id="h-ev">Blocks and warnings today<span class="sp"></span><button class="btn ter sm" data-act="go" data-to="protection">View the log</button></h2>
      ${S.v.todayErr ? `<div class="card pad t-sub" style="display:flex;gap:12px;align-items:center"><span class="t2">Couldn’t read today’s events. Last good at 14:02.</span><button class="btn sec sm" data-act="retry-today">Retry</button></div>` : `<div class="card log">${S.log.filter(l => l.k !== "on").slice(0, 3).map(l => LogRow(l, S.v.logOpen === l.id)).join("")}</div>`}
    </section></div>`;
}
function SessionRowToday(s) {
  const unguarded = S.guard === "not_guarded" && s.id === "bench";
  const word = STATE_WORD[s.state];
  const guard = unguarded ? `<span class="danger" style="display:flex;gap:6px;align-items:center">${hbGlyph("not_guarded")} Not guarded</span>` : S.guard === "failing" ? `<span class="danger">Blocked by a failing guard</span>` : S.guard === "off" ? `<span class="danger">Not checked until 14:17</span>` : s.state === "stopped" ? `${hbGlyph("idle")} Nothing running` : s.state === "idle" ? `${hbGlyph("idle")} Guard ready` : `${hbGlyph("guarded")} Guarded`;
  const meta = s.state === "idle" ? `idle since ${s.idleSince}` : s.state === "stopped" ? (s.stopReason === "trip" ? "stopped by the tripwire at 14:02:31" : "stopped at 13:48 · not by a block · idle 14 min") : `since ${s.since}`;
  return `<div class="srow${unguarded ? " unguarded" : ""}">${avFor(s, 28)}<span class="sname"><b>${esc(s.name)}</b><span>${s.state === "needs" ? `<span class="attn">${word}</span>` : word} · ${meta}</span></span><span class="sguard">${guard}</span><span class="stok">${fmt(s.tok)} tokens<br>${s.share} % of 5-hour</span></div>`;
}

/* Rules */
function Rules() {
  const lim = S.v.limitsOpen;
  const few = S.rules.length < 3;
  return `<div class="page">
    ${PageHead("Rules", `Your rules auto-approved <span class="num">${fmt(S.rules.reduce((a, r) => a + r.n, 0))}</span> calls since 12 Oct. Suggestions come from what you allowed by hand.`)}
    <div class="card">
      <button class="limits" data-act="limits" aria-expanded="${lim}" aria-controls="limdet">${ic("lock", 18)}<span class="t-sub"><b class="strong">4 limits always on:</b> <span class="t2">delete · push to your default branch · send · pay. No rule can change them.</span></span><span class="chev">${ic("chev", 14)}</span></button>
      ${lim ? `<div class="limdet" id="limdet"><p class="promise">${COPY.promise}</p>
        <div class="lg"><b>Delete</b><span><code>rm</code>, <code>del</code>, <code>Remove-Item</code>, <code>rmdir</code>, <code>git clean</code>, and file deletes through tools</span><b>Push to default branch</b><span><code>git push</code> to the branch your repo calls default, including <code>--force</code> forms</span><b>Send</b><span>Email, chat and webhook sends through tools and common commands (<code>curl -X POST</code> to known send services)</span><b>Pay</b><span>Payment tools and known payment CLIs</span></div>
        <p class="gap">${COPY.gap} Pattern checks catch common forms of these commands; they can’t see every way a program could do the same thing.</p>
        <p class="t-meta t3">Blocked calls are never asked: Eucas tells the session to hand back to you. If you meant it, run it yourself in a terminal.</p></div>` : ""}
    </div>
    <section class="sec" aria-labelledby="h-sug"><h2 class="sech" id="h-sug">Suggestions <span class="cnt">${S.sugg.length}</span><span class="sp"></span><span class="t-meta t3" style="font-weight:400">from the last 7 days · refreshed 06:00</span></h2>
      <div class="card sugg">${S.sugg.map(r => SuggestedRuleRow(r, { checkable: false, addBtn: true }) + (S.v.preview === r.id ? RulePreview(r) : "")).join("") || `<p class="t-sub t3" style="padding:12px 0">No new suggestions. They appear when you allow the same command by hand a few times.</p>`}</div></section>
    <section class="sec" aria-labelledby="h-mine"><h2 class="sech" id="h-mine">Your rules <span class="t3" style="font-weight:400">${S.rules.length}</span><span class="sp"></span><button class="btn ter sm" data-act="export-rules">${ic("download", 14)} Export</button></h2>
      <div class="card rows">${S.rules.map(RuleCard).join("")}</div></section>
    ${few ? `<section class="sec"><h2 class="sech">Start from a template</h2><div class="card rows">${TEMPLATES.map(t => `<div class="rule"><div class="rm"><span class="t-sub strong">${t[0]}</span><span class="t-meta"><code>${t[1]}</code> · ${t[2]}</span></div><span></span><button class="btn sec sm">Add</button></div>`).join("")}</div></section>` : ""}
  </div>`;
}
function RulePreview(r) {
  if (r.runner) return `<div class="preview" role="region" aria-label="Preview of the rule"><span><b>Runs code from the project.</b> <span class="t2">A rule for <code>${esc(r.cmd)}</code> can only cover one folder. Tests can run any code a repo contains.</span></span><span class="t2">Would have auto-approved <b class="num" style="color:var(--text-1)">${fmt(r.n)}</b> calls in 7 days, all in <code>${esc(r.scope)}</code>.</span><div class="pa"><button class="btn ink sm" data-act="save-rule" data-id="${r.id}">Save · auto-approve ${esc(r.cmd)} in ${esc(r.scope)}</button><button class="btn ter sm" data-act="preview-rule" data-id="">Cancel</button></div></div>`;
  return `<div class="preview"><span class="t2">Would have auto-approved <b class="num">${fmt(r.n)}</b> calls in 7 days, all in <code>${esc(r.scope)}</code>.</span><div class="pa"><button class="btn ink sm" data-act="save-rule" data-id="${r.id}">Save</button><button class="btn ter sm" data-act="preview-rule" data-id="">Cancel</button></div></div>`;
}

/* Protection */
const PSTAT_WHY = {
  not_guarded: "bench ran 3 tool calls in the last 40 s and Eucas didn’t see a check for any of them. Your other sessions are guarded.",
  failing: "Eucas’s guard is failing and blocking every tool call in 3 sessions. Your work is safe: nothing ran that shouldn’t have.",
  off: "Your sessions aren’t checked and the limits don’t apply until 14:17. It comes back on by itself.",
  not_verified: "Claude Code updated at 09:10. The guard is on; the test that proves it hasn’t passed on this version yet.",
  user_level: "Without admin, the limits sit in your user settings, where an agent could change them. Eucas watches for that and tells you.",
  org: "So Eucas can’t guard sessions on this PC. It never writes into an organisation’s policy.",
};
const PSTAT_ACT = {
  not_guarded: `<button class="btn pri" data-act="fix-it">Fix it</button>`,
  failing: `<span style="display:flex;gap:8px"><button class="btn pri" data-act="repair">Repair</button><button class="btn ter" data-act="off15">Off for 15 minutes</button></span>`,
  off: `<button class="btn sec" data-act="guard-on">Turn it back on now</button>`,
  user_level: `<button class="btn sec" data-act="uac-again">Try again with admin</button>`,
  org: `<button class="btn sec" data-act="copy-it">Copy a note for your IT team</button>`,
};
function Protection() {
  const g = S.guard;
  const tone = ["not_guarded", "failing", "off"].includes(g) ? "danger" : ["not_verified", "user_level", "untested", "org"].includes(g) ? "attn" : "";
  const mode = g === "not_guarded" ? "miss" : g === "idle" ? "idle" : "";
  const level = g === "user_level" || S.d.d4 === "user" ? "User level (weaker): limits in your user settings" : "Limits in admin settings";
  const verified = g === "not_verified" ? `<span class="attn">Not verified for ${COPY.ccv}: test pending</span>` : `Verified for Claude Code ${COPY.ccv} · canary passed at 09:12${S.d.d5 === "turn" ? " · about 400 tokens" : ""}`;
  const filters = ["All", "Blocks", "Warnings", "Tripwire", "Guard"];
  return `<div class="page">
    ${PageHead("Protection", "", g === "org" ? "" : `<button class="btn ${tone || PSTAT_ACT[g] ? "sec" : "pri"}" data-act="canary">${ic("refresh", 14)} Run the test again</button>`)}
    <div class="card pstat ${tone}">
      <div class="ps-top"><div class="grow">${HeartbeatLine(g === "off" ? "off" : g, { n: guardedCount(), big: true })}<div class="facts dots">${g === "org" ? `<span>Your organisation’s managed policy allows only its own hooks</span><span>Retro and usage still work</span>` : `<span>${verified}</span><span>${level}</span><span>Tested with PowerShell</span>`}</div>${PSTAT_WHY[g] ? `<p class="t-sub t2" style="margin-top:4px">${PSTAT_WHY[g]}</p>` : ""}</div>${PSTAT_ACT[g] || ""}</div>
      ${g === "org" ? "" : HeartbeatStrip({ id: "all", mode, axis: true, fill: true })}
      ${g === "org" ? "" : `<p class="t-meta t3">Each bar is a 10-second slot. Its height is how many tool calls Eucas checked. A red bar means tools ran with no check.</p>`}
    </div>
    <section class="sec"><h2 class="sech">Sessions</h2><div class="card rows">${S.sessions.map(s => {
      const miss = g === "not_guarded" && s.id === "bench";
      const st = g === "org" ? "org" : miss ? "not_guarded" : s.state === "idle" ? "idle" : g === "off" ? "off" : g === "failing" ? "failing" : "guarded";
      const words = { org: "Not guarded · blocked by policy", guarded: `Guarded · checked <span data-ago class="num">2</span> s ago`, idle: "Idle since 13:40 · guard ready", not_guarded: "Not guarded · no check for 40 s", off: "Not checked until 14:17", failing: "Every call blocked by the failing guard" };
      return `<div class="srow p${miss ? " unguarded" : ""}">${avFor(s, 28)}<span class="sname"><b>${esc(s.name)}</b><span>${esc(s.where)}</span></span>${g === "org" ? "<span></span>" : HeartbeatStrip({ id: s.id, sm: true, mode: miss ? "miss" : s.state === "idle" ? "idle" : "" })}<span class="sguard">${hbGlyph(st)}<span>${words[st]}</span></span></div>`;
    }).join("")}</div></section>
    <section class="sec" aria-labelledby="h-log"><h2 class="sech" id="h-log">Log<span class="sp"></span><span class="filters" role="group" aria-label="Filter the log">${filters.map((f, i) => `<button class="chip" aria-pressed="${i === 0}">${f}</button>`).join("")}</span><button class="btn ter sm" data-act="export">${ic("download", 14)} Export</button></h2>
      <div class="card log"><div class="lhead" aria-hidden="true"><span></span><span>Time</span><span>Session</span><span>What</span><span>Why</span><span></span></div>${S.log.map(l => LogRow(l, S.v.logOpen === l.id)).join("")}</div></section>
    <details class="card cant"><summary>${ic("eyes", 18)} What Eucas can’t see<span class="chev">${ic("chev", 14)}</span></summary><ul><li>What a program does once it runs: a script can delete files without a delete command.</li><li>Anything in the cloud, including Claude’s cloud sessions.</li><li>Sessions on other computers.</li><li>Tools that bypass Claude Code’s hooks.</li><li>${COPY.gap}</li></ul></details>
  </div>`;
}

/* Usage */
function usageModel() {
  const u = S.usage;
  const five = { label: "5-hour window", pct: 46, resets: "15:40", updated: "20 s ago", threshold: 85, fc: 68, forecast: "At today’s pace you’ll end this window at about <b>68 %</b>. That’s about 9 more runs like your last one in bench.", basis: "Range 61–74 %, based on the last 45 minutes" };
  if (u === "close") Object.assign(five, { pct: 86, fc: 100, forecast: "At today’s pace you’ll reach the 5-hour limit around <b>14:35</b>, 65 min before it resets.", basis: "Range 14:28–14:44, based on the last 45 minutes" });
  if (u === "limit") Object.assign(five, { pct: 100, fc: 0, forecast: "" });
  const week = { label: "Weekly", pct: u === "limit" ? 64 : 62, resets: "Mon 09:00", updated: "20 s ago", threshold: 85, fc: 79, forecast: "At this week’s pace you’ll end the week at about <b>79 %</b>.", basis: "Based on the last 5 days" };
  return { five, week };
}
function Usage() {
  const u = S.usage;
  const { five, week } = usageModel();
  const rows = S.sessions;
  const tot = rows.reduce((a, s) => a + s.tok, 0), share = rows.reduce((a, s) => a + s.share, 0);
  let top = "";
  if (u === "limit") top = `<div class="card pad" role="status" style="display:grid;gap:6px;padding:20px 22px"><h2 class="t-title">5-hour limit reached</h2><p class="t-sub t2">Claude Code pauses new requests until <b style="color:var(--text-1)">15:40</b>. Your sessions keep their work. Weekly: 64 %.</p></div>`;
  if (u === "tokens") top = `<div class="card pad t-sub t2">Tokens only: Claude Code hasn’t reported plan limits on this PC yet. Your 5-hour and weekly forecast starts after your next session.</div>`;
  if (u === "api") top = `<div class="card pad t-sub t2">Claude Code is using an API key here, so it bills per token, not your plan. Eucas shows cost instead of plan share.</div>`;
  const meters = u === "tokens" || u === "api" ? "" : `<div class="meters">${u === "limit" ? `<div class="card meter"><div class="mh"><span class="t-sub strong">5-hour window</span><span class="t-meta">updated 20 s ago</span></div><div class="mh"><span class="fig">100 %</span><span class="t-sub t2" style="margin-left:auto">resets 15:40</span></div><div class="mbar"><i style="width:100%"></i></div><p class="fcast">Paused until 15:40.</p></div>` : UsageMeter(five)}${UsageMeter(week)}</div>`;
  const pro = u === "close" ? ProLine("budget", "Pro can pause bench at a budget you set, before the limit does.") : "";
  const money = u === "api";
  return `<div class="page">
    ${PageHead("Usage", u === "limit" || u === "tokens" ? "" : u === "api" ? "Today: $2.69 across 3 sessions." : u === "close" ? "On pace to reach the 5-hour limit before it resets." : "Well within both limits.")}
    ${top}${meters}${pro}
    <section class="sec"><h2 class="sech">${S.v.ledger === "session" ? "By session" : "By project"}<span class="sp"></span><span class="seg" role="radiogroup" aria-label="Group by"><button role="radio" aria-checked="${S.v.ledger === "session"}" data-act="ledger" data-v="session">Session</button><button role="radio" aria-checked="${S.v.ledger === "project"}" data-act="ledger" data-v="project">Project</button></span><span class="seg" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="${S.v.range === "today"}" data-act="range" data-v="today">Today</button><button role="radio" aria-checked="${S.v.range === "7d"}" data-act="range" data-v="7d">7 days</button></span></h2>
      <div class="card"><table class="ledger"><thead><tr><th>${S.v.ledger === "session" ? "Session" : "Project"}</th><th class="r">Tokens</th><th class="r">${money ? "Cost" : "Share of 5-hour"}</th><th class="r">Last activity</th></tr></thead>
      <tbody>${rows.map(s => `<tr><td><span class="cellname">${avFor(s, 20)}${esc(s.name)}</span></td><td class="r">${fmt(s.tok)}</td><td class="r">${money ? "$" + (s.tok * 0.0000105).toFixed(2) : u === "tokens" ? '<span class="t3">—</span>' : s.share + " %"}</td><td class="r t3">${s.state === "idle" ? s.idleSince : "now"}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>Total</td><td class="r">${fmt(tot)}</td><td class="r">${money ? "$" + (tot * 0.0000105).toFixed(2) : u === "tokens" ? '<span class="t3">—</span>' : share + " %"}</td><td></td></tr></tfoot></table></div></section>
  </div>`;
}

/* Retro (same four cards as first run) */
function RetroCards(anim, compact = false) {
  const days = [38, 52, 61, 100, 74, 22, 31], dl = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const a = anim ? " in" : "";
  return `<div class="retro${compact ? " compact" : ""}">
    <article class="rc${a}" style="animation-delay:0ms"><h3 class="rch"><span class="num" data-count="1.9">1.9</span> M tokens · busiest on Thursday</h3><div class="days" role="img" aria-label="Tokens per day, Thursday highest">${days.map((d, i) => `<i class="${i === 3 ? "top" : ""}" style="height:${d}%"></i>`).join("")}</div><div class="daysl">${dl.map(d => `<span>${d}</span>`).join("")}</div><p class="rcb">bench used 58 % of it.</p></article>
    <article class="rc${a}" style="animation-delay:90ms"><h3 class="rch"><span class="num" data-count="3">3</span> commands this week would have been stopped</h3><div class="rcl"><div class="ri"><code class="cmd">git push origin main</code><span>bench · Thu 14:02</span></div><div class="ri"><code class="cmd">Remove-Item -Recurse dist</code><span>bench · Tue 11:20</span></div><div class="ri"><code class="cmd">curl -X POST hooks.slack.com/…</code><span>notes · Mon 16:48</span></div></div><p class="rcb">Eucas never auto-approves these. With protection on, they’re blocked and shown to you.</p></article>
    <article class="rc${a}" style="animation-delay:180ms"><h3 class="rch">2 sessions edited <code>src/router.ts</code> 4 minutes apart</h3><p class="rcb">This happened <span class="num" data-count="4">4</span> times this week. Eucas would have warned you the moment the second session touched the file.</p><div><button class="btn ter sm" style="padding-left:0">Look inside</button></div></article>
    <article class="rc${a}" style="animation-delay:270ms"><h3 class="rch">You approved these by hand most often</h3><div class="rcl"><div class="ri"><code class="cmd">git status</code><span>488 times · bench</span></div><div class="ri"><code class="cmd">git diff</code><span>301 times · bench</span></div><div class="ri"><code class="cmd">pnpm test</code><span>212 times · bench</span></div></div><p class="rcb">Each can become a rule, scoped to its folder.</p></article>
  </div>`;
}
function Retro() {
  return `<div class="page">${PageHead("Retro", "Your week: 41 sessions in 6 projects, about 62 % of your weekly limit. 2 fewer same-file clashes than last week.")}
    ${RetroCards(false)}
    ${ProLine("retro", "Older weeks are kept with Pro.")}
    <p class="t-meta t3">Rebuilt every Monday at 06:00 from Claude Code’s history on this PC. ${COPY.privacy}</p></div>`;
}

/* Settings */
const SETSECS = [["notifications", "Notifications"], ["appearance", "Appearance"], ["protection", "Protection"], ["reads", "What Eucas reads"], ["diagnostic", "Diagnostic"], ["remove", "Remove Eucas"], ["about", "About"]];
function Settings() {
  const sec = S.v.setSec;
  const body = {
    notifications: `<div class="card set">${[["Windows notifications", "Only for needs-you, blocks, the tripwire and the guard going off. Focus silences them.", true], ["Sound", "Needs you and Done, soft and short. Focus silences them.", S.sound], ["Warn me at", "85 % of the 5-hour window, once per window", true], ["Same-file window", "Warn when two sessions edit a file within 15 minutes", true]].map(r => `<div class="srw"><div class="st"><b>${r[0]}</b><span>${r[1]}</span></div><input type="checkbox" class="sw" role="switch" ${r[2] ? "checked" : ""} aria-label="${r[0]}" ${r[0] === "Sound" ? 'data-act="sound"' : ""}></div>`).join("")}<div class="srw"><div class="st"><b>Pause notifications</b><span>The guard keeps working while they’re paused.</span></div><span style="display:flex;gap:6px"><button class="btn sec sm" data-act="pause">1 hour</button><button class="btn sec sm" data-act="pause">Until tomorrow</button></span></div></div>`,
    appearance: `<div class="card set"><div class="srw"><div class="st"><b>Theme</b><span>Dark first. The tray icon and Windows notifications follow Windows, not this setting.</span></div><span class="seg" role="radiogroup" aria-label="Theme">${[["dark", "Dark"], ["light", "Light"], ["system", "Match Windows"]].map(t => `<button role="radio" aria-checked="${(root.dataset.themePref || "dark") === t[0]}" data-act="theme" data-v="${t[0]}">${t[1]}</button>`).join("")}</span></div><div class="srw"><div class="st"><b>Reduce motion</b><span>Follows Windows › Accessibility › Visual effects by default.</span></div><input type="checkbox" class="sw" role="switch" ${root.classList.contains("rm") ? "checked" : ""} data-act="rm" aria-label="Reduce motion"></div></div>`,
    protection: `<div class="card set"><div class="srw"><div class="st"><b>Guard</b><span>${S.guard === "off" ? "Off until 14:17. It comes back on by itself." : "On. Turning it off stops checks and the limits in every session until you turn it back on."}</span></div>${S.guard === "off" ? `<button class="btn sec sm" data-act="guard-on">Turn it back on</button>` : `<button class="btn qdanger sm" data-act="guard-off-ask">Turn off protection…</button>`}</div><div class="srw"><div class="st"><b>Install level</b><span>${S.d.d4 === "user" || S.guard === "user_level" ? "User level (weaker). Admin puts the limits where an agent can’t change them." : "Admin: the limits are in managed settings, out of an agent’s reach."}</span></div>${S.d.d4 === "user" || S.guard === "user_level" ? `<button class="btn sec sm" data-act="uac-again">Use admin</button>` : `<span class="tag ok">${ic("check", 12, 2)} Admin</span>`}</div><div class="srw"><div class="st"><b>Tripwire</b><span>Stop a session that deletes more than 200 files or 500 MB in 30 seconds.</span></div><span class="t-sub t2 num">200 files</span></div></div>
      ${S.v.offAsk ? `<div class="card pad" role="alertdialog" aria-labelledby="offq" style="display:grid;gap:10px"><h3 id="offq" class="t-sub strong">Turn off protection?</h3><p class="t-sub t2">Your 3 sessions stop being checked, and the 4 limits stop applying, until you turn it back on. The heartbeat shows “Protection is off” the whole time.</p><div style="display:flex;gap:8px"><button class="btn dangerfill" data-act="guard-off">Turn off protection</button><button class="btn ter" data-act="guard-off-cancel">Keep it on</button></div></div>` : ""}`,
    reads: `<div class="card pad" style="display:grid;gap:14px"><p class="t-sub">${COPY.privacy}</p><div class="reads"><div><h3 class="t-sub strong" style="margin-bottom:6px">Reads</h3><ul><li><code>%USERPROFILE%/.claude/projects/</code>: session history (counts only)</li><li><code>%USERPROFILE%/.claude/settings.json</code>: your rules and hooks</li><li>The status line’s JSON: tokens and plan limits</li><li>Hook events: tool name and command</li></ul></div><div><h3 class="t-sub strong" style="margin-bottom:6px">Never reads</h3><ul><li><code>.credentials.json</code> and OAuth tokens</li><li>The text of your prompts or files (it isn’t stored)</li><li>Anything outside Claude Code’s folders, except the tripwire’s file counts</li></ul></div></div></div>`,
    diagnostic: Diagnostic(),
    remove: `<div class="card pad" style="display:grid;gap:14px"><p class="t-sub">Removing Eucas puts Claude Code back exactly as it was on 26 Oct:</p>${Checklist([{ s: "none", t: "The Eucas plugin is removed" }, { s: "none", t: "Your status line goes back to <code>npx ccstatusline</code>" }, { s: "none", t: "The limits are removed from managed settings (Windows asks for permission once)" }, { s: "none", t: "Your 3 rules are deleted. <button class='link' data-act='export-rules'>Export them first</button>" }, { s: "none", t: "Local counts are wiped" }])}<div><button class="btn qdanger" style="box-shadow:inset 0 0 0 1px rgb(var(--ink-rgb)/.16)" data-act="remove">Remove Eucas</button></div></div>`,
    about: `<div class="card set"><div class="srw"><div class="st"><b>Eucas 0.1.0</b><span>Source available (FSL). Not affiliated with Anthropic. Works with Claude Code ${COPY.ccv}.</span></div><button class="btn ter sm">${ic("ext", 14)} Source</button></div><div class="srw"><div class="st"><b>Laptop-closed work</b><span>${ProLine("cloud", "Coming to Pro (beta): runs that continue in Claude’s cloud. Eucas’s limits don’t apply there.") || "Not available."}</span></div><span></span></div></div>`,
  }[sec];
  return `<div class="page">${PageHead("Settings", "")}<div class="setnav" role="tablist" aria-label="Settings sections">${SETSECS.map(([k, l]) => `<button class="chip" role="tab" aria-selected="${sec === k}" aria-pressed="${sec === k}" data-act="setsec" data-v="${k}">${l}</button>`).join("")}</div>${body}</div>`;
}
function Diagnostic() {
  const st = S.v.diag;
  if (st === "idle") return `<div class="card pad" style="display:grid;gap:12px;justify-items:start"><p class="t-sub t2">Checks Claude Code, your hooks, the status line and the guard in about 5 seconds, and writes a report you can read before you share it.</p><button class="btn pri" data-act="diag">Run the diagnostic</button></div>`;
  const items = [
    { s: "ok", t: "Claude Code", v: `${COPY.ccv} · native install` },
    { s: "ok", t: "Shell", v: "PowerShell 7.5" },
    { s: S.guard === "not_guarded" ? "bad" : "ok", t: "Eucas hooks fire", v: S.guard === "not_guarded" ? "No event from bench for 40 s · restart that session" : "In 3 of 3 sessions" },
    { s: "ok", t: "Status line", v: "ccstatusline, wrapped" },
    { s: S.d.d4 === "user" ? "warn" : "ok", t: "Managed settings", v: S.d.d4 === "user" ? "User level (weaker)" : "Limits present" },
    { s: "ok", t: "Canary", v: "Passed at 09:12" },
    { s: "ok", t: "Last 20 guard events", v: "14 checks · 6 blocks (program names only)" },
    { s: "ok", t: "Eucas", v: "0.1.0" },
  ];
  if (st === "running") items.forEach((i, k) => { if (k > 2) i.s = "wait"; });
  return `<div class="card pad diag" style="display:grid;gap:14px">${Checklist(items.map((i, k) => ({ ...i, anim: st === "running" && k < 3 })))}
    <p class="t-meta t3">The report has no prompts, file contents, paths outside Claude Code’s folder, or tokens. Read it before you share it.</p>
    <div style="display:flex;gap:8px">${S.guard === "not_guarded" ? `<button class="btn pri" data-act="repair">Restart bench’s guard</button>` : ""}<button class="btn sec" data-act="copy-it">${ic("copy", 14)} Copy report</button><button class="btn ter">Save as file</button><button class="btn ter">${ic("ext", 14)} Open an issue</button></div></div>`;
}

/* ---------------- Tripwire card ---------------- */
function TripwireCard() {
  const live = S.v.trip === "live";
  const c = live ? S.v.tripCount : 1240;
  return `<div class="trip-scrim"><section class="trip" role="alertdialog" aria-modal="true" aria-labelledby="trip-h" aria-describedby="trip-d">
    <div class="tr-h">${avFor({ ...sess("bench"), state: "stopped" }, 32)}<h2 class="t-title" id="trip-h">${live ? "bench is still deleting files" : "Eucas stopped bench"}</h2></div>
    <div style="display:flex;align-items:baseline;gap:14px"><span class="count num ${live ? "live" : ""}" aria-live="${live ? "off" : "polite"}" data-tripcount>${fmt(c)}</span><span class="clabel">${live ? `<span class="live-dot" style="display:inline-block;margin-right:6px"></span>files deleted · still counting` : "files deleted in 20 seconds"}</span></div>
    <p class="t-sub" id="trip-d">${live
      ? "Eucas stopped bench’s session at 14:02:31, but files are still being deleted by a process it started. Eucas is stopping every process in that tree. It says “stopped” only when the count stops moving."
      : "It started with <code>C:/Users/maya/dev/bench/node_modules</code>. Eucas stopped it at <b>14:02:31</b> and checked it’s no longer running."}</p>
    ${live ? "" : `<div><h3 class="t-sub strong" style="margin-bottom:4px">What was deleted</h3><div class="folders"><div><code>bench/node_modules/</code><span class="t-meta t2 num">1,118 files</span></div><div><code>bench/src/generated/</code><span class="t-meta t2 num">96 files</span></div><div><code>bench/docs/</code><span class="t-meta t2 num">26 files</span></div></div></div>
    <div><h3 class="t-sub strong" style="margin-bottom:6px">How to get them back</h3><ol class="steps"><li><b>Source files:</b> run <code>git restore src docs</code> in bench. 122 of the files are tracked by git.</li><li><b>node_modules:</b> run <code>pnpm install</code>. They’re downloaded again.</li><li><b>File History</b> is on for this folder: right-click bench › Restore previous versions.</li></ol></div>`}
    <div style="display:flex;gap:8px;flex-wrap:wrap">${live ? `<button class="btn sec" data-act="open-folder">${ic("folder", 14)} Open the folder</button>` : `<button class="btn pri" data-act="open-folder">${ic("folder", 14)} Open the folder</button><button class="btn ter" data-act="export">Export the list</button><span style="flex:1"></span><button class="btn ter" data-act="trip-expected">This was expected</button><button class="btn ter" data-act="trip-close">Close</button>`}</div>
    ${live ? "" : `<p class="t-meta t3">“This was expected” lets bench delete inside <code>node_modules</code> without a stop, in this project only. Everywhere else the tripwire stays at 200 files.</p>`}
  </section></div>`;
}

/* ---------------- Flyout (tray popover) ---------------- */
function Flyout() {
  const g = S.guard, n = nNeeds();
  const tone = ["not_guarded", "failing", "off", "org"].includes(g) || S.v.trip ? "danger" : ["not_verified", "user_level", "untested"].includes(g) ? "attn" : "";
  const noSess = S.v.empty;
  const st = noSess ? HeartbeatLine("idle", { noSessions: true }) : S.v.trip ? `<span class="hb">${hbGlyph("failing")}<span class="hb-txt"><b>Eucas stopped bench</b> <span class="t2">· 1,240 files deleted</span></span></span>` : HeartbeatLine(g, { n: guardedCount() });
  const attnAct = tone === "attn" ? `<div class="fly-sec" style="padding-top:12px"><div style="display:flex;gap:8px">${g === "user_level" ? `<button class="btn sec sm" data-act="uac-again">Use admin</button>` : `<button class="btn sec sm" data-act="canary">Run the test</button>`}</div></div>` : "";
  const fix = tone === "danger" && !S.v.trip ? `<div class="fly-sec" style="padding-top:12px"><p class="t-sub t2">${g === "failing" ? "Your work is safe. Repair, or turn the guard off for 15 minutes." : g === "off" ? "Sessions aren’t checked until 14:17." : g === "org" ? "Your organisation’s policy blocks Eucas’s hooks." : "Tools ran in bench with no check. Your other sessions are guarded."}</p><div style="display:flex;gap:8px">${g === "failing" ? `<button class="btn pri sm" data-act="repair">Repair</button><button class="btn ter sm" data-act="off15">Off for 15 min</button>` : g === "off" ? `<button class="btn sec sm" data-act="guard-on">Turn it back on</button>` : g === "org" ? "" : `<button class="btn pri sm" data-act="fix-it">Fix it</button>`}</div></div>` : S.v.trip ? `<div class="fly-sec" style="padding-top:12px"><button class="btn pri sm" data-act="see-trip" style="justify-self:start">See what happened</button></div>` : "";
  const sessLine = S.sessions.map(s => `${s.name} ${STATE_WORD[s.state].toLowerCase()}`).join(" · ");
  const four = S.d.d1 === "b" && S.sessions.length > 3;
  const u = S.usage, { five, week } = usageModel();
  const close = five.pct >= five.threshold;
  const usageLine = u === "limit" ? `<b style="color:var(--text-1)">5-hour limit reached</b> · resets 15:40` : u === "tokens" ? `Today: ${fmt(255800)} tokens · plan limits not reported yet` : `5-hour: <b class="num" style="color:var(--text-1)">${five.pct} %</b>${close ? ` <span class="attn">close</span>` : ""} · resets ${five.resets} · Week: <span class="num">${week.pct} %</span>`;
  return `<section class="flyout enter" role="dialog" aria-label="Eucas" style="${S.v.scale !== 1 ? `zoom:${S.v.scale};max-height:${Math.floor((innerHeight - (root.classList.contains("clean") ? 0 : 44) - 60 * S.v.scale - 12) / S.v.scale)}px` : ""}">
    <button class="fly-status ${tone}" data-act="go-win" data-to="protection">${st}<span class="chev">${ic("chev", 14)}</span></button>
    ${fix}${attnAct}
    <div class="fly-scroll">
    ${S.needs.length ? `<div class="fly-sec"><div class="fly-sech">What needs you <span class="cnt attn">${S.needs.length}</span><span class="sp"></span></div>${S.needs.slice(0, 3).map((x, i) => NeedsYouCard(x, { variant: "compact", s2: S.d.s2, primary: i === 0 && tone !== "danger" })).join("")}</div>` : ""}
    ${S.sameFile ? `<div class="fly-sec">${SameFileCard({ compact: true })}</div>` : ""}
    ${noSess ? `<p class="fly-empty">No sessions running. Start or continue one in Claude Code.</p>` : `<button class="fly-sess" data-act="sess" aria-expanded="${S.v.sessOpen}"><span class="avs">${S.sessions.map(s => SessionAvatar(s, 20)).join("")}</span><span class="txt">${S.sessions.length} sessions · ${esc(sessLine)}</span><span class="chev">${ic("chev", 14)}</span></button>
    ${S.v.sessOpen ? S.sessions.slice(0, four ? 3 : 9).map(s => `<div class="fly-srow">${avFor(s, 20)}<span>${esc(s.name)} <span class="t3 t-meta">· ${fmt(s.tok)} tokens</span></span><span class="st">${s.state === "needs" ? `<span class="attn">Needs you</span>` : STATE_WORD[s.state]} · ${S.guard === "not_guarded" && s.id === "bench" ? `<span class="danger">Not guarded</span>` : s.state === "idle" ? "ready" : "Guarded"}</span></div>`).join("") + (four ? `<p class="fly-pro">All 4 are guarded. Details for 3 on the free plan.</p>` : "") : ""}`}
    </div>
    <button class="fly-usage" data-act="go-win" data-to="usage"><span class="bar${close ? " close" : ""}"><i style="width:${u === "tokens" ? 0 : five.pct}%"></i></span><span>${usageLine}</span></button>
    <div class="fly-foot"><button class="btn ter sm" data-act="go-win" data-to="today" style="padding-left:0">Open Eucas</button><span class="sp"></span><button class="ibtn" data-act="go-win" data-to="settings" aria-label="Settings">${ic("gear", 16)}</button></div>
  </section>`;
}
function CtxMenu() {
  return `<div class="ctx" role="menu" aria-label="Eucas"><button role="menuitem" data-act="go-win" data-to="today">Open Eucas</button><div class="sepr"></div>${S.paused ? `<button role="menuitem" data-act="resume">Resume notifications</button>` : `<button role="menuitem" data-act="pause">Pause notifications for 1 hour</button><button role="menuitem" data-act="pause">Pause until tomorrow</button>`}<button role="menuitem" data-act="go-diag">Run the diagnostic</button><div class="sepr"></div><button role="menuitem" data-act="quit">Quit Eucas…</button></div>`;
}
function Overflow() {
  return `<div class="ovf" role="dialog" aria-label="Hidden icons"><span class="tray-btn">${ic("cloud", 16)}</span><span class="tray-btn">${ic("bell", 16)}</span><span class="tray-btn" title="Eucas">${TrayIcon(trayState(), { count: nNeeds(), bg: "var(--os-surface)" })}</span></div>`;
}

/* ---------------- First run ---------------- */
const FR_STEP = { welcome: 1, building: 2, retro: 2, protect: 3, uac: 3, writing: 3, canary: 4, protected: 5, "edge-j": 4, "edge-d": 1, "edge-h": 3, "edge-f": 2, "edge-k": 4 };
function FirstRunWindow() {
  const step = S.v.fr;
  const body = { welcome: FrWelcome, building: FrBuilding, retro: FrRetro, protect: FrProtect, uac: FrProtect, writing: FrWriting, canary: FrCanary, protected: FrProtected, "edge-j": FrEdgeJ, "edge-d": FrEdgeD, "edge-h": FrEdgeH, "edge-f": FrRetro, "edge-k": FrEdgeK }[step]();
  const k = FR_STEP[step];
  return `<section class="win fr enter" role="dialog" aria-label="Set up Eucas" aria-describedby="fr-step">${Caption("Eucas")}
    <div class="frbody"><div class="frsteps" id="fr-step"><span class="bars">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= k ? "on" : ""}"></i>`).join("")}</span><span>${k} of 5</span></div>${body}</div>
    ${step === "uac" ? Uac() : ""}</section>`;
}
function FrWelcome() {
  const t = S.frDetect ?? 4;
  const lines = [
    { s: "ok", t: `Claude Code ${COPY.ccv} found` },
    { s: "ok", t: "312 sessions in the last 7 days" },
    { s: "ok", t: "Your status line: ccstatusline (it stays)" },
    { s: "ok", t: "2 hooks of your own (they keep working)" },
  ].map((l, i) => i < t ? { ...l, anim: S.frAnim } : { s: "wait", t: "Still checking…" });
  return `<div class="frmain"><span class="frmark">${mark(28, "var(--mark)")}</span><h1 class="t-head">Let’s look at your week with Claude Code</h1>
    <p class="lede">Eucas reads the last 7 days of Claude Code history on this PC and shows what your sessions did. ${COPY.privacy} <button class="link" data-act="reads-pop">What Eucas reads</button></p>
    ${Checklist(lines)}</div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="protect">Skip the retro</button><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="building">Show your week</button></div>`;
}
function FrBuilding() {
  const k = S.frBuild ?? 2;
  return `<div class="frmain"><h1 class="t-head">Building your week</h1><p class="t-sub t2 num" role="status">Reading 312 sessions · ${Math.min(7, 2 + k * 2)} of 7 days</p>
    <div class="retro">${[0, 1, 2, 3].map(i => i < k ? `<div class="rc in" style="min-height:120px"><span class="skel" style="width:60%"></span><span class="skel" style="width:90%;height:40px"></span><span class="skel" style="width:40%"></span></div>` : `<div class="rc" style="min-height:120px;opacity:.5"><span class="skel" style="width:50%"></span></div>`).join("")}</div></div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="welcome">Back</button><span class="sp"></span><button class="btn pri lg" disabled>Turn on protection</button></div>`;
}
function FrRetro() {
  const thin = S.v.fr === "edge-f";
  const ticks = S.frTicks.size;
  if (thin) return `<div class="frmain"><h1 class="t-head">Not much to look back on yet</h1><p class="lede">Your retro builds itself as you work. Here are the five rules most people start with.</p><div class="card" style="padding:4px 18px">${TEMPLATES.map((t, i) => `<div class="sr-row"><input type="checkbox" class="cb" id="tp${i}" ${i < 2 ? "checked" : ""}><label class="srm" for="tp${i}"><span class="t-sub strong">${t[0]}</span><span class="t-meta"><code>${t[1]}</code> · ${t[2]}</span></label><span></span></div>`).join("")}</div></div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="welcome">Back</button><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="protect">Turn on protection · 2 rules</button></div>`;
  return `<div class="frmain"><h1 class="t-head" style="font-size:var(--fs-title);line-height:var(--lh-title)">Your week: 41 sessions in 6 projects, about 62 % of your weekly limit.</h1>
    ${RetroCards(S.frAnim, true)}
    <div class="card" style="padding:4px 18px"><div class="sech" style="padding-top:12px">Rules from your approvals</div>${SUGG0.map(r => SuggestedRuleRow(r, { checked: S.frTicks.has(r.id) })).join("")}</div></div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="welcome">Back</button><button class="btn ter" data-act="fr-skip-rules">Skip rules for now</button><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="protect">Turn on protection${ticks ? ` · ${ticks} rule${ticks > 1 ? "s" : ""}` : ""}</button></div>`;
}
function FrProtect() {
  const n = S.frTicks.size;
  const waiting = S.v.fr === "uac";
  return `<div class="frmain"><h1 class="t-head">Turn on protection</h1>
    <div><p class="t-sub t2" style="margin-bottom:6px">This adds to your Claude Code setup on this PC:</p>
    ${Checklist([{ s: "none", t: "A Eucas plugin that checks every tool call in every local session, including ones already running." }, { s: "none", t: "Your status line, wrapped so it still shows exactly as before." }, { s: "none", t: `${n} rule${n === 1 ? "" : "s"} you chose.` }, { s: "none", t: S.d.d4 === "admin" ? "The limits, written where an agent can’t switch them off. Windows asks for permission once for this." : "The limits, in your user settings." }])}</div>
    <div class="card pad" style="display:grid;gap:6px"><p class="promise">${COPY.promise}</p><p class="gap">${COPY.gap}</p></div>
    <p class="t-meta t3">Undo any time: Settings › Remove Eucas puts everything back as it was.</p>
    ${waiting ? `<p class="t-sub" role="status">Windows is asking for permission. It will name Eucas Labs.</p>` : ""}</div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="retro">Back</button>${S.d.d4 === "admin" ? `<button class="btn ter" data-act="fr-user">Without admin (weaker)</button>` : ""}<span class="sp"></span><button class="btn pri lg" data-act="${S.d.d4 === "admin" ? "fr-uac" : "fr-write"}" ${waiting ? "disabled" : ""}>${waiting ? "Waiting for Windows…" : "Turn on protection"}</button></div>`;
}
function Uac() {
  return `<div class="uac-scrim" data-os-theme="${S.osTheme}"><span class="uac-tag">Windows · User Account Control (illustration)</span><div class="uac" role="dialog" aria-label="User Account Control"><div class="uac-h">User Account Control</div><div class="uac-b"><p class="uac-q">Do you want to allow this app to make changes to your device?</p><div class="uac-app">${appIcon(32)}<b>Eucas</b></div><div class="uac-meta"><span>Verified publisher: Eucas Labs</span><span>File origin: Hard drive on this computer</span></div><button class="link" style="justify-self:start;font-weight:400;font-family:var(--os-font);font-size:13px;color:var(--os-text-2)">Show more details</button></div><div class="uac-f"><button class="pri" data-act="uac-yes">Yes</button><button data-act="uac-no">No</button></div></div></div>`;
}
function FrWriting() {
  const k = S.frWrite ?? 4, n = S.frTicks.size;
  const items = [["Plugin added", "~/.claude/plugins/eucas-guard"], ["Status line wrapped", "~/.claude/settings.json"], [S.d.d4 === "admin" ? "Limits written" : "Limits written at user level", S.d.d4 === "admin" ? "C:/ProgramData/ClaudeCode/managed-settings.json" : "~/.claude/settings.json"], [`${n} rules saved`, "~/.claude/settings.json"]];
  return `<div class="frmain"><h1 class="t-head">Turning on protection</h1>${Checklist(items.map((it, i) => ({ s: i < k ? "ok" : i === k ? "wait" : "none", t: it[0], end: i < k ? `<button class="btn ter sm" title="${it[1]}">Look inside</button>` : "", anim: i < k && S.frAnim })))}</div>
    <div class="frfoot"><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="canary" ${k < 4 ? "disabled" : ""}>Continue</button></div>`;
}
function FrCanary() {
  const k = S.frCanary ?? 3;
  return `<div class="frmain"><h1 class="t-head">Watch it work</h1><p class="lede">Eucas starts a tiny test session in a temporary folder and asks it to push to <code>main</code>. Nothing touches your projects or the network.</p>
    <div class="clog" role="log" aria-live="polite">
      ${k >= 1 ? `<div class="cl in"><span>${ic("term", 16)}</span><span>Starting a test session in a temporary folder…</span><span class="t-meta t3 num">0.0 s</span></div>` : ""}
      ${k >= 2 ? `<div class="cl in"><span>${ic("chev", 16)}</span><span>It tried: <code>git push origin main</code></span><span class="t-meta t3 num">0.2 s</span></div>` : ""}
      ${k >= 3 ? `<div class="cl blk in ${S.frAnim ? "land" : ""}"><span class="bk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span><span><b>Blocked by Eucas</b> · logged</span><span class="t-meta t3 num">0.3 s</span></div>` : ""}
    </div>
    ${k >= 3 ? `<div class="sec" style="gap:6px"><p class="t-sub t2">That’s what happens in your real sessions. Every block gets a receipt like this one in Protection.${S.d.d5 === "turn" ? " This test used about 400 tokens." : ""}</p><div class="card log ${S.frAnim ? "rc in" : ""}" style="padding:0;animation-delay:240ms">${LogRow({ id: "lc", t: "14:01:58", s: "test", k: "block", what: "git push origin main", why: "a push to your default branch", by: "Limit · push to default branch · canary" }, false)}</div></div>` : ""}</div>
    <div class="frfoot"><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="protected" ${k < 3 ? "disabled" : ""}>Done</button></div>`;
}
function FrProtected() {
  const userLvl = S.d.d4 === "user";
  return `<div class="frmain" style="gap:14px"><h1 class="t-head">You’re protected</h1>
    <div class="card pstat" style="padding:16px 18px;gap:12px">${HeartbeatLine(userLvl ? "user_level" : "guarded", { n: 2, big: true })}${HeartbeatStrip({ id: "first", fill: true, mode: "first" })}</div>
    <p class="t-sub t2">Sessions appear here within a few seconds of starting. You have 2 running now: both guarded.</p>
    <div class="pinill"><div class="tbmini" data-os-theme="${S.osTheme}"><span class="arrow">${ic("chevu", 14)}</span><span class="tray-btn hl">${TrayIcon("calm", { bg: "var(--os-taskbar)" })}</span><span class="tray-btn">${ic("wifi", 14)}</span><span class="num" style="padding:0 6px">14:02</span></div><div style="display:grid;gap:4px;flex:1"><b class="t-sub strong">Eucas lives in the taskbar corner</b><span class="t-meta t2">Windows hides new icons under the ^ arrow. Keep it next to the clock so you can see the guard at a glance.</span></div><button class="btn sec sm" data-act="pin">Keep it visible</button></div>
    <div style="display:flex;align-items:center;gap:12px"><span class="t-sub t2" style="flex:1">Eucas tells you when something needs you, with a Windows notification.</span><button class="btn ter sm" data-act="test-toast">Send a test notification</button></div></div>
    <div class="frfoot"><span class="sp"></span><button class="btn pri lg" data-act="fr-close">Close</button></div>`;
}
function FrEdgeJ() {
  return `<div class="frmain"><h1 class="t-head">The test wasn’t blocked</h1>
    <div class="clog"><div class="cl"><span>${ic("term", 16)}</span><span>Starting a test session in a temporary folder…</span><span class="t-meta t3">0.0 s</span></div><div class="cl"><span>${ic("chev", 16)}</span><span>It tried: <code>git push origin main</code></span><span class="t-meta t3">0.2 s</span></div><div class="cl" style="color:var(--text-1)"><span class="danger">${ic("slashc", 16)}</span><span><b>Not blocked.</b> The push reached the test repo.</span><span class="t-meta t3">0.4 s</span></div></div>
    ${Banner("danger", "Eucas is not protecting your sessions on this PC yet.", "Nothing outside the test folder was touched. The tray icon stays red until a test passes.")}</div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="canary">Show what happened</button><span class="sp"></span><button class="btn pri lg" data-act="fr-diag">Run the diagnostic</button></div>`;
}
function FrEdgeK() {
  return `<div class="frmain"><h1 class="t-head">The test couldn’t run</h1><p class="lede">Git isn’t installed, so Eucas couldn’t make the test repo. Your protection is on, but it hasn’t been proven on this PC yet.</p><div>${HeartbeatLine("untested", { big: true })}</div></div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="protected">Skip the test</button><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="canary">Retry</button></div>`;
}
function FrEdgeD() {
  return `<div class="frmain"><span class="frmark">${mark(28, "var(--mark)")}</span><h1 class="t-head">Let’s look at your week with Claude Code</h1>
    ${Checklist([{ s: "ok", t: `Claude Code ${COPY.ccv} found` }, { s: "ok", t: "312 sessions in the last 7 days" }, { s: "warn", t: "Your organisation’s Claude Code policy only allows its own hooks, so Eucas can’t guard sessions on this PC. You can still see your retro and usage." }])}</div>
    <div class="frfoot"><button class="btn ter" data-act="copy-it">Copy a note for your IT team</button><span class="sp"></span><button class="btn pri lg" data-act="fr" data-to="building">Show your week</button></div>`;
}
function FrEdgeH() {
  return `<div class="frmain"><h1 class="t-head">Protection is on, but weaker</h1><p class="lede">Without admin, the limits sit in your user settings, where an agent could change them. Eucas watches for that and tells you.</p><div>${HeartbeatLine("user_level", { big: true })}</div></div>
    <div class="frfoot"><button class="btn ter" data-act="fr" data-to="canary">Keep it weaker</button><span class="sp"></span><button class="btn pri lg" data-act="fr-uac">Try again with admin</button></div>`;
}
function Installer() {
  return `<section class="win enter" style="width:440px;height:240px" role="dialog" aria-label="Installing Eucas">${Caption("Eucas Setup")}<div class="frbody" style="padding:24px 28px;gap:14px;display:grid;align-content:start"><div style="display:flex;gap:12px;align-items:center">${appIcon(32)}<div><b class="t-sub strong">Installing Eucas</b><p class="t-meta t2">For you only. No admin needed.</p></div></div><div class="mbar"><i style="width:${S.instPct ?? 72}%"></i></div><p class="t-meta t3">Eucas opens when it’s done. Nothing to choose.</p></div></section>`;
}

/* ---------------- Sheets ---------------- */
function TraySheet() {
  const states = [["calm", "Guarded", "Mark only"], ["needs", "Needs you", "Amber count"], ["off", "Guard off", "Slash"], ["unverified", "Not verified", "Amber “!”"], ["paused", "Paused", "Dimmed + moon"], ["setup", "Setting up", "Dimmed"]];
  const row = (label, cls, theme, bg, scale = 1) => `<div class="rh">${label}</div>${states.map(s => `<div class="${cls} os" data-os-theme="${theme}">${TrayIcon(s[0], { count: 2, bg, size: 16 * scale })}</div>`).join("")}`;
  return `<div class="sheet"><div><h1 class="t-title">Tray icon · 6 states</h1><p class="t-sub t2">16 px at 100 %. Each state reads without colour: a count, a slash, a “!”, a moon or dimming. The icon follows the Windows theme, not Eucas’s. Priority when several are true: Guard off › Needs you › Not verified › Paused › Calm.</p></div>
    <div class="traygrid"><div class="rh"></div>${states.map(s => `<div class="ch">${s[1]}<span>${s[2]}</span></div>`).join("")}
      ${row("Dark taskbar", "cell-dark", "dark", "#1c1c1c")}${row("Light taskbar", "cell-light", "light", "#eeeeee")}${row("Dark · 200 %", "cell-dark", "dark", "#1c1c1c", 2)}${row("Light · 200 %", "cell-light", "light", "#eeeeee", 2)}${row("Detail · 400 %", "cell-dark", "dark", "#1c1c1c", 4)}
      <div class="rh">High contrast</div>${states.map(s => `<div class="cell-hc os" data-os-theme="dark" style="--tray-glyph:#fff;--tray-glyph-dim:#9a9a9a;--tray-badge-attn:#ffff00;--tray-badge-text:#000;--tray-slash:#fff;--tray-moon:#fff">${TrayIcon(s[0], { count: 2, bg: "#000" })}</div>`).join("")}
    </div>
    <div class="tips">${states.map(s => `<div class="tip"><b>${s[1]}</b><span>${esc(TRAY_TIP[s[0]](s[0] === "needs" ? 2 : 3))}</span></div>`).join("")}</div>
    <p class="t-meta t3">Shipping files: a hand-hinted ICO at 16, 20, 24, 32 and 40 px (100–250 % scaling) per state, light and dark, plus a forced-colours variant. The badge always sits bottom right with a 1.2 px cut-out in the taskbar colour.</p></div>`;
}
function ToastSheet() {
  const keys = ["needs", "blocked", "trip", "off", "same", "done", "limit", "first", "more"];
  return `<div class="sheet" data-os-theme="${S.osTheme}"><div><h1 class="t-title">Windows notifications</h1><p class="t-sub t2">Windows draws the frame in its own theme; Eucas writes the content. Titles ≤ 48 characters, bodies ≤ 200. Budget: one per event, at most one per 2 minutes per session, grouped beyond that, at most 2 on screen. Pro is never a toast.</p></div>
    <div style="display:grid;grid-template-columns:repeat(3,var(--os-toast-w));gap:16px;align-items:start">${keys.map((k, i) => `<div style="display:grid;gap:6px"><span class="t-meta t3">${["Needs you · stays", "Blocked · 6 s", "Tripwire · stays, ignores grouping", "Guard off · stays", "Same file · 10 s", "Done (runs ≥ 2 min) · 6 s", "Near the limit · once per window", "First session of a project · 6 s", "Grouped · after 2 on screen"][i]}</span>${WinToast(k, "s" + i).replace('class="wt', 'style="animation:none" class="wt')}</div>`).join("")}</div></div>`;
}

/* ---------------- Toasts (live) ---------------- */
let toastId = 0;
function toast(key) {
  const box = $("#toasts");
  const live = $$(".wt:not(.out)", box);
  if (live.length >= 2 && key !== "trip") { if (!$('[data-tk="more"]', box)) { live[0].remove(); key = "more"; } else return; }
  const id = "t" + ++toastId;
  box.insertAdjacentHTML("beforeend", WinToast(key, id).replace('class="wt', `data-tk="${key}" class="wt`));
  if (key === "needs" || key === "needs_q") sfx.needs();
  if (!TOASTS[key].stay) setTimeout(() => closeToast(id), key === "same" ? 10000 : 6000);
}
function closeToast(id) { const t = $(`[data-toast="${id}"]`); if (!t) return; t.classList.add("out"); setTimeout(() => t.remove(), 220); }
function clearToasts() { $("#toasts").innerHTML = ""; }
function undoToast(msg, undo) { S.itoast = { msg, undo }; render(); clearTimeout(undoToast.t); undoToast.t = setTimeout(() => { S.itoast = null; render(); }, 10000); }

/* ---------------- Live heartbeat: evidence, not a timer ---------------- */
function tickAgo() {
  const s = Math.max(1, Math.round((Date.now() - lastCheck) / 1000));
  $$("[data-ago]").forEach(e => { e.textContent = s; });
}
function scheduleCheck() {
  const wait = 1200 + Math.random() * 2600;
  setTimeout(() => {
    if (["guarded", "user_level"].includes(S.guard) && !S.v.empty && !S.freeze) {
      lastCheck = Date.now(); tickAgo();
      if (Date.now() - lastBeat >= 2000) { lastBeat = Date.now(); $$("[data-hbg]").forEach(g => { if (g.dataset.s === "guarded" || g.dataset.s === "user_level") { g.classList.remove("beat"); void g.offsetWidth; g.classList.add("beat"); } }); }
      $$(".hbs[data-strip]").forEach(st => { const bars = $$("i", st); if (!bars.length || st.closest("[data-nolive]")) return; const last = bars[bars.length - 1]; if (last.classList.contains("miss") || last.classList.contains("idle")) return; last.style.height = Math.min(100, (parseFloat(last.style.height) || 30) + 12) + "%"; });
    }
    scheduleCheck();
  }, wait);
}
setInterval(tickAgo, 1000);
/* Every 10 s the strip shifts one slot left: the oldest bar leaves, a new slot starts on the right */
setInterval(() => {
  if (S.freeze) return;
  $$(".hbs[data-strip]").forEach(st => {
    const bars = $$("i", st); if (bars.length < 2) return;
    const last = bars[bars.length - 1]; if (last.classList.contains("miss")) return;
    const live = ["guarded", "user_level"].includes(S.guard) && !last.classList.contains("idle");
    last.classList.remove("now"); bars[0].remove();
    const n = document.createElement("i"); if (live) { n.className = "now"; n.style.height = "30%"; } else n.className = "idle";
    st.append(n);
  });
}, 10000);

/* ---------------- Eye-follow (from PR #52's pinned Eucas): eyes look toward the pointer ---------------- */
document.addEventListener("pointermove", e => {
  if (root.classList.contains("rm") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  $$(".flyout .av .eyes, .need .av .eyes, .srow .av .eyes").forEach(g => {
    const r = g.closest(".av").getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 240) * 5;
    g.setAttribute("transform", `translate(${(dx / d * k).toFixed(1)} ${(dy / d * k * 0.7).toFixed(1)})`);
  });
}, { passive: true });

/* ---------------- Actions ---------------- */
function go(route) { S.v.win = "main"; S.v.route = route; S.v.fly = false; S.v.ctx = false; S.v.preview = null; render(); }
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (!b) { if (S.v.fly && !e.target.closest(".flyout,#trayIcon")) { S.v.fly = false; render(); } if (S.v.ctx && !e.target.closest(".ctx")) { S.v.ctx = false; render(); } if (S.v.ovf && !e.target.closest(".ovf,[data-act=overflow]")) { S.v.ovf = false; render(); } return; }
  const a = b.dataset.act, id = b.dataset.id;
  const A = {
    tray: () => { S.v.fly = !S.v.fly; S.v.ctx = false; render(); if (S.v.fly) setTimeout(() => $(".flyout button")?.focus({ preventScroll: true }), 30); },
    overflow: () => { S.v.ovf = !S.v.ovf; render(); },
    go: () => go(b.dataset.to),
    "go-win": () => go(b.dataset.to),
    "go-diag": () => { S.v.setSec = "diagnostic"; go("settings"); },
    "open-eucas": () => go("today"),
    "open-session": () => { const n = S.needs.find(x => x.id === id || x.id === b.closest("[data-toast]")?.dataset.need); resolveNeed(id || "n1", "Opened bench · it’s the Windows Terminal tab titled “bench”"); },
    allow: () => resolveNeed(id || "n1", "Allowed <code>pnpm build</code> once in bench"),
    snooze: () => resolveNeed(id, "Snoozed until 14:17"),
    undo: () => { if (S.itoast?.undo) S.itoast.undo(); S.itoast = null; render(); },
    "suggest-rule": () => { S.sugg.unshift({ id: "rb", cmd: "pnpm build", scope: "bench/", n: 14, runner: true }); go("rules"); S.v.preview = "rb"; render(); },
    "preview-rule": () => { S.v.preview = id || null; render(); },
    "save-rule": () => { const r = S.sugg.find(x => x.id === id); S.sugg = S.sugg.filter(x => x.id !== id); S.rules.unshift({ id: "y" + id, cmd: r.cmd, scope: r.scope, n: 0, since: "26 Oct", last: "not yet", on: true }); S.v.preview = null; undoToast(`Saved · auto-approve <code>${esc(r.cmd)}</code> in ${esc(r.scope)}`, () => { S.rules = S.rules.filter(x => x.id !== "y" + id); S.sugg.unshift(r); }); },
    limits: () => { S.v.limitsOpen = !S.v.limitsOpen; render(); },
    "log-toggle": () => { S.v.logOpen = S.v.logOpen === id ? null : id; render(); },
    sess: () => { S.v.sessOpen = !S.v.sessOpen; render(); },
    ledger: () => { S.v.ledger = b.dataset.v; render(); },
    range: () => { S.v.range = b.dataset.v; render(); },
    setsec: () => { S.v.setSec = b.dataset.v; render(); },
    diag: () => { S.v.diag = "running"; render(); setTimeout(() => { S.v.diag = "done"; render(); }, 1600); },
    "fix-it": () => { S.v.setSec = "diagnostic"; S.v.diag = "done"; go("settings"); },
    repair: () => { S.guard = "guarded"; lastCheck = Date.now(); undoToast("Repaired. bench is guarded again · checked just now"); },
    off15: () => { S.guard = "off"; render(); },
    "guard-on": () => { S.guard = "guarded"; lastCheck = Date.now(); render(); },
    "guard-off-ask": () => { S.v.offAsk = true; render(); },
    "guard-off-cancel": () => { S.v.offAsk = false; render(); },
    "guard-off": () => { S.v.offAsk = false; S.guard = "off"; render(); },
    canary: () => { S.guard = S.guard === "not_verified" ? "guarded" : S.guard; undoToast(`Test passed · verified for Claude Code ${COPY.ccv}`); },
    "copy-cmd": () => undoToast("Copied. Run it yourself in a terminal if you meant it."),
    "copy-it": () => undoToast("Copied to the clipboard"),
    export: () => undoToast("Saved as eucas-log-2026-10-26.md"),
    "export-rules": () => undoToast("Saved as eucas-rules.json"),
    "see-trip": () => { S.v.trip = "stopped"; go("today"); },
    why: () => { S.v.logOpen = "l1"; go("protection"); },
    "show-both": () => { S.sameFile = true; go("today"); },
    "trip-close": () => { S.v.trip = null; render(); },
    "trip-expected": () => { S.v.trip = null; undoToast("bench may delete inside node_modules without a stop"); },
    "open-folder": () => undoToast("Opened C:/Users/maya/dev/bench"),
    maximise: () => { S.v.max = !S.v.max; render(); },
    minimise: () => { S.v.win = null; render(); },
    "close-win": () => { if (S.v.win === "firstrun") { S.v.win = null; render(); toast("closed"); } else { S.v.win = null; render(); } },
    "toast-close": () => closeToast(id),
    waitlist: () => { S.waitlist = true; render(); },
    "pro-dismiss": () => { S.proDismissed.add(b.dataset.key); render(); },
    pause: () => { S.paused = true; S.v.ctx = false; render(); },
    resume: () => { S.paused = false; S.v.ctx = false; render(); },
    quit: () => { S.v.ctx = false; render(); alert("Quit Eucas?\n\nProtection stays on while Eucas is closed. The heartbeat and notifications stop until you open it again."); },
    theme: () => setTheme(b.dataset.v),
    rm: () => { root.classList.toggle("rm"); syncDemo(); },
    sound: () => { S.sound = !S.sound; syncDemo(); },
    tick: () => { b.checked ? S.frTicks.add(id) : S.frTicks.delete(id); S.frAnim = false; render(); },
    fr: () => frGo(b.dataset.to),
    "fr-skip-rules": () => { S.frTicks.clear(); frGo("protect"); },
    "fr-uac": () => frGo("uac"),
    "uac-yes": () => { S.d.d4 = "admin"; frGo("writing"); },
    "uac-no": () => frGo("edge-h"),
    "uac-again": () => { S.v.win = "firstrun"; frGo("uac"); },
    "fr-user": () => { S.d.d4 = "user"; frGo("edge-h"); },
    "fr-write": () => frGo("writing"),
    "fr-close": () => { S.v.win = null; S.guard = S.d.d4 === "user" ? "user_level" : "guarded"; render(); toast("closed"); },
    "fr-diag": () => { S.v.setSec = "diagnostic"; S.v.diag = "done"; S.guard = "not_guarded"; go("settings"); },
    "test-toast": () => toast("test"),
    pin: () => undoToast("Opened Windows Settings › Taskbar › Other system tray icons"),
    "reads-pop": () => { S.v.setSec = "reads"; go("settings"); },
    "retry-today": () => { S.v.todayErr = false; render(); },
    remove: () => undoToast("Removed. Claude Code is exactly as it was on 26 Oct."),
    "mute-file": () => { S.sameFile = false; undoToast("No more warnings for src/router.ts today"); },
  };
  if (A[a]) { e.preventDefault(); A[a](); }
});
document.addEventListener("contextmenu", e => { if (e.target.closest("#trayIcon")) { e.preventDefault(); S.v.ctx = true; S.v.fly = false; render(); } });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if (S.v.fly || S.v.ctx || S.v.ovf) { S.v.fly = S.v.ctx = S.v.ovf = false; render(); $("#trayIcon")?.focus(); } else if (S.v.trip === "stopped") { S.v.trip = null; render(); } }
  if (e.ctrlKey && /^[1-6]$/.test(e.key) && S.v.win === "main") { e.preventDefault(); go(["today", "rules", "protection", "usage", "retro", "settings"][+e.key - 1]); }
  if (S.v.fly && (e.key === "ArrowDown" || e.key === "ArrowUp")) { const f = $$(".flyout button"); const i = f.indexOf(document.activeElement); const n = f[(i + (e.key === "ArrowDown" ? 1 : -1) + f.length) % f.length]; n?.focus(); e.preventDefault(); }
});
function resolveNeed(id, msg) {
  const n = S.needs.find(x => x.id === id); if (!n) return;
  S.needs = S.needs.filter(x => x !== n);
  if (n.s === "bench") sess("bench").state = "working";
  undoToast(msg, () => { S.needs.unshift(n); sess(n.s).state = "needs"; });
}

/* ---------------- First-run player ---------------- */
let frTimers = [];
function frGo(step) { frTimers.forEach(clearTimeout); frTimers = []; S.v.win = "firstrun"; S.v.fr = step; S.frAnim = true; S.v.fly = false; S.needs = [];
  if (step === "welcome") { S.frDetect = 0; [300, 700, 1100, 1500].forEach((t, i) => frTimers.push(setTimeout(() => { S.frDetect = i + 1; render(); }, t))); }
  if (step === "building") { S.frBuild = 0; [500, 1200, 1900, 2600].forEach((t, i) => frTimers.push(setTimeout(() => { S.frBuild = i + 1; render(); }, t))); frTimers.push(setTimeout(() => frGo("retro"), 3200)); }
  if (step === "writing") { S.frWrite = 0; [400, 900, 1400, 1900].forEach((t, i) => frTimers.push(setTimeout(() => { S.frWrite = i + 1; render(); }, t))); }
  if (step === "canary") { S.frCanary = 0; [300, 1200, 2100].forEach((t, i) => frTimers.push(setTimeout(() => { S.frCanary = i + 1; render(); if (i === 2) sfx.done(); }, t))); }
  render(); setTimeout(() => { S.frAnim = false; }, 600);
}
function playFirstRun() {
  reset(); S.v.win = "installer"; S.instPct = 10; render();
  const T = (ms, f) => frTimers.push(setTimeout(f, ms));
  T(400, () => { S.instPct = 60; render(); }); T(900, () => { S.instPct = 100; render(); });
  T(1400, () => frGo("welcome"));
  setTimeout(() => {
    const seq = [[3400, "building"], [7400, "retro"], [12400, "protect"], [15400, "uac"], [17400, "writing"], [20400, "canary"], [24200, "protected"]];
    seq.forEach(([t, s]) => setTimeout(() => { if (S.playing) frGo(s); }, t - 1400));
  }, 1400);
  S.playing = true; setTimeout(() => { S.playing = false; }, 26000);
}

/* ---------------- Theme ---------------- */
function setTheme(p) {
  const t = p === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p;
  const st = document.createElement("style"); st.textContent = "*{transition:none!important}"; document.head.append(st);
  root.setAttribute("data-theme", t); root.dataset.themePref = p;
  render(); syncDemo(); requestAnimationFrame(() => requestAnimationFrame(() => st.remove()));
}

/* ---------------- Routes (the jump menu) ---------------- */
function reset() {
  frTimers.forEach(clearTimeout); frTimers = []; clearToasts(); S.playing = false;
  Object.assign(S, { guard: "guarded", paused: false, offline: false, usage: "normal", sameFile: false, itoast: null, sessions: SESSIONS0.map(s => ({ ...s })), needs: NEEDS0.map(n => ({ ...n })), log: LOG0.slice(), rules: RULES0.map(r => ({ ...r })), sugg: SUGG_RULES.map(r => ({ ...r })), waitlist: false, proDismissed: new Set() });
  S.frTicks = new Set(["s1", "s2", "s3"]);
  Object.assign(S.v, { win: "main", route: "today", fr: null, fly: false, ctx: false, sheet: null, trip: null, logOpen: null, limitsOpen: false, sessOpen: false, preview: null, setSec: "notifications", diag: "idle", empty: false, todayErr: false, ovf: false, scale: 1, offAsk: false });
}
const ROUTES = {
  /* First run */
  "fr-install": () => { S.v.win = "installer"; S.instPct = 72; },
  "fr-welcome": () => { frGo("welcome"); S.frDetect = 4; S.frAnim = false; frTimers.forEach(clearTimeout); },
  "fr-building": () => { frGo("building"); frTimers.forEach(clearTimeout); S.frBuild = 2; },
  "fr-retro": () => { frGo("retro"); S.frAnim = false; },
  "fr-protect": () => frGo("protect"),
  "fr-uac": () => frGo("uac"),
  "fr-writing": () => { frGo("writing"); frTimers.forEach(clearTimeout); S.frWrite = 4; },
  "fr-canary": () => { frGo("canary"); frTimers.forEach(clearTimeout); S.frCanary = 3; S.frAnim = false; },
  "fr-protected": () => frGo("protected"),
  "fr-edge-j": () => { frGo("edge-j"); S.guard = "not_guarded"; },
  "fr-edge-k": () => frGo("edge-k"),
  "fr-edge-d": () => frGo("edge-d"),
  "fr-edge-h": () => { S.d.d4 = "user"; frGo("edge-h"); },
  "fr-edge-f": () => frGo("edge-f"),
  /* Tray */
  "sheet-tray": () => { S.v.win = null; S.v.sheet = "tray"; },
  popover: () => { S.v.win = null; S.v.fly = true; },
  "popover-calm": () => { S.v.win = null; S.needs = []; S.sessions.forEach(s => { if (s.state === "needs") s.state = "working"; }); S.v.fly = true; S.v.sessOpen = true; },
  "popover-empty": () => { S.v.win = null; S.needs = []; S.v.empty = true; S.guard = "idle"; S.v.fly = true; },
  "popover-off": () => { S.v.win = null; S.guard = "not_guarded"; S.v.fly = true; },
  "popover-paused": () => { S.v.win = null; S.needs = []; S.sessions.forEach(s => { if (s.state === "needs") s.state = "working"; }); S.paused = true; S.v.fly = true; },
  "popover-unverified": () => { S.v.win = null; S.needs = []; S.sessions.forEach(s => { if (s.state === "needs") s.state = "working"; }); S.guard = "not_verified"; S.v.fly = true; },
  "popover-125": () => { S.v.fly = true; S.v.scale = 1.25; S.v.win = null; },
  "popover-150": () => { S.v.fly = true; S.v.scale = 1.5; S.v.win = null; },
  menu: () => { S.v.win = null; S.v.ctx = true; },
  /* Toasts */
  "sheet-toasts": () => { S.v.win = null; S.v.sheet = "toasts"; },
  "toast-live": () => { setTimeout(() => toast("needs"), 200); setTimeout(() => toast("blocked"), 1400); setTimeout(() => toast("same"), 2600); },
  /* Main window */
  today: () => {},
  "today-empty": () => { S.needs = []; S.v.empty = true; S.guard = "idle"; },
  "today-caught-up": () => { S.needs = []; S.sessions.forEach(s => { if (s.state === "needs") s.state = "working"; }); },
  "today-error": () => { S.v.todayErr = true; },
  rules: () => { S.v.route = "rules"; },
  "rules-limits": () => { S.v.route = "rules"; S.v.limitsOpen = true; },
  "rules-add": () => { S.v.route = "rules"; S.v.preview = "r4"; },
  protection: () => { S.v.route = "protection"; },
  "protection-row": () => { S.v.route = "protection"; S.v.logOpen = "l1"; S.scrollTo = "#ld-l1"; },
  usage: () => { S.v.route = "usage"; },
  "usage-limit": () => { S.v.route = "usage"; S.usage = "limit"; },
  "usage-tokens": () => { S.v.route = "usage"; S.usage = "tokens"; },
  "usage-api": () => { S.v.route = "usage"; S.usage = "api"; },
  retro: () => { S.v.route = "retro"; },
  settings: () => { S.v.route = "settings"; },
  "settings-protection": () => { S.v.route = "settings"; S.v.setSec = "protection"; S.v.offAsk = true; },
  "settings-reads": () => { S.v.route = "settings"; S.v.setSec = "reads"; },
  "settings-diagnostic": () => { S.v.route = "settings"; S.v.setSec = "diagnostic"; S.v.diag = "done"; },
  "settings-remove": () => { S.v.route = "settings"; S.v.setSec = "remove"; },
  /* Worst moments */
  "tripwire-live": () => { S.v.trip = "live"; S.v.tripCount = 1384; S.needs = []; Object.assign(sess("bench"), { state: "stopped", stopReason: "trip" }); tripRun(); },
  "tripwire-stopped": () => { S.v.trip = "stopped"; S.needs = []; Object.assign(sess("bench"), { state: "stopped", stopReason: "trip" }); S.log.unshift(LOG_TRIP); },
  "tripwire-toast": () => { S.v.win = null; setTimeout(() => toast("trip"), 200); },
  "guard-off": () => { S.guard = "not_guarded"; S.log.unshift(LOG_OFF); },
  "guard-off-protection": () => { S.guard = "not_guarded"; S.v.route = "protection"; S.log.unshift(LOG_OFF); },
  "fail-closed": () => { S.guard = "failing"; },
  "protection-off": () => { S.guard = "off"; },
  "not-verified": () => { S.guard = "not_verified"; S.v.route = "protection"; },
  "user-level": () => { S.guard = "user_level"; S.d.d4 = "user"; S.v.route = "protection"; },
  "org-blocked": () => { S.guard = "org"; S.v.route = "protection"; },
  "same-file": () => { S.sameFile = true; },
  /* Pro (D-2 waitlist) */
  "pro-usage": () => { S.v.route = "usage"; S.usage = "close"; },
  "pro-sessions": () => { S.d.d1 = "b"; S.sessions.push({ ...SESSION4 }); },
  "pro-supervisor": () => { S.needs = []; Object.assign(sess("bench"), { state: "stopped", stopReason: "user" }); },
  "pro-retro": () => { S.v.route = "retro"; },
  "pro-about": () => { S.v.route = "settings"; S.v.setSec = "about"; },
};
const JUMP = [
  ["First run (about 4:30)", [["fr-install", "0 · Installing (no admin)"], ["fr-welcome", "1 · Welcome + detection"], ["fr-building", "2 · Building your week"], ["fr-retro", "3 · Your week (the retro)"], ["fr-protect", "4 · Turn on protection"], ["fr-uac", "4 · The one admin prompt (UAC)"], ["fr-writing", "4 · Writing, with Look inside"], ["fr-canary", "5 · Watch it work (canary blocked)"], ["fr-protected", "6 · You’re protected"]]],
  ["First run: edges", [["fr-edge-j", "J · Canary not blocked (worst)"], ["fr-edge-k", "K · Canary couldn’t run"], ["fr-edge-d", "D · Organisation policy blocks hooks"], ["fr-edge-h", "H · Admin declined (weaker)"], ["fr-edge-f", "F · Thin history: templates"]]],
  ["Tray", [["sheet-tray", "Tray icon · 6 states, light, dark, HC"], ["popover", "Popover · 2 things need you"], ["popover-calm", "Popover · calm, sessions open"], ["popover-empty", "Popover · no sessions"], ["popover-off", "Popover · not guarded"], ["popover-unverified", "Popover · not verified"], ["popover-paused", "Popover · notifications paused"], ["popover-125", "Popover at 125 %"], ["popover-150", "Popover at 150 %"], ["menu", "Right-click menu"]]],
  ["Notifications", [["sheet-toasts", "Every toast, spec sheet"], ["toast-live", "Live: toasts arrive (budget 2)"], ["tripwire-toast", "Tripwire toast"]]],
  ["Main window", [["today", "Today · needs you + sessions"], ["today-caught-up", "Today · all caught up"], ["today-empty", "Today · no sessions (empty)"], ["today-error", "Today · events couldn’t load"], ["rules", "Rules"], ["rules-limits", "Rules · the limits opened"], ["rules-add", "Rules · adding a runner (preview)"], ["protection", "Protection · heartbeat + log"], ["protection-row", "Protection · a block’s receipt"], ["usage", "Usage · meters + forecast"], ["usage-tokens", "Usage · tokens only (no plan data)"], ["usage-api", "Usage · API key mode"], ["retro", "Retro"], ["settings", "Settings · notifications"], ["settings-reads", "Settings · what Eucas reads"], ["settings-diagnostic", "Settings · diagnostic report"], ["settings-protection", "Settings · turn off protection"], ["settings-remove", "Settings · remove Eucas"]]],
  ["Worst moments", [["tripwire-live", "Tripwire · still deleting (live)"], ["tripwire-stopped", "Tripwire · stopped, how to recover"], ["guard-off", "Not guarded · Today"], ["guard-off-protection", "Not guarded · Protection"], ["fail-closed", "Guard failing closed (blocks all)"], ["protection-off", "Protection is off (15 min)"], ["not-verified", "Not verified after an update"], ["user-level", "User level (weaker)"], ["org-blocked", "Blocked by your organisation"], ["same-file", "Same-file warning"], ["usage-limit", "5-hour limit reached (no upsell)"]]],
  ["Pro, as a waitlist (D-2)", [["pro-usage", "Usage · on pace for the limit"], ["pro-sessions", "4th session (D-1 b)"], ["pro-supervisor", "Stopped, idle session"], ["pro-retro", "Retro · older weeks"], ["pro-about", "Settings › About · cloud beta"]]],
];
function route(hash, keepDecisions = true) {
  const k = (hash || "").replace(/^#/, "") || "today";
  reset(); S.d = { ...S.dBase };
  (ROUTES[k] || ROUTES.today)();
  render(); syncDemo(k);
}
let tripTimer;
function tripRun() {
  clearInterval(tripTimer);
  tripTimer = setInterval(() => {
    if (S.v.trip !== "live") return clearInterval(tripTimer);
    if (S.freeze) return;
    S.v.tripCount += Math.round(3 + Math.random() * 9);
    const c = $("[data-tripcount]"); if (c) c.textContent = fmt(S.v.tripCount);
  }, 260);
}

/* ---------------- Demo bar ---------------- */
function syncDemo(k) {
  const sel = $("#jump");
  if (k !== undefined) { sel.value = ROUTES[k] ? k : ""; if (location.hash.slice(1) !== k) history.replaceState(null, "", location.pathname + location.search + "#" + k); }
  $("#dTheme").setAttribute("aria-pressed", root.getAttribute("data-theme") === "light");
  $("#dTheme").textContent = root.getAttribute("data-theme") === "light" ? "Light" : "Dark";
  $("#dOs").textContent = "Windows: " + (S.osTheme === "light" ? "light" : "dark");
  $("#dRm").setAttribute("aria-pressed", root.classList.contains("rm"));
  $("#dSound").setAttribute("aria-pressed", S.sound);
  ["d1", "d2", "d4", "d5", "s2"].forEach(x => { const el = $("#" + x); if (el) el.value = String(S.dBase[x]); });
}
function initDemo() {
  $("#jump").innerHTML = '<option value="">Jump to a state or moment</option>' + JUMP.map(g => `<optgroup label="${g[0]}">${g[1].map(o => `<option value="${o[0]}">${esc(o[1])}</option>`).join("")}</optgroup>`).join("");
  $("#jump").addEventListener("change", e => { if (e.target.value) route(e.target.value); });
  $("#dTheme").addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light"));
  $("#dOs").addEventListener("click", () => { S.osTheme = S.osTheme === "light" ? "dark" : "light"; render(); syncDemo(); });
  $("#dRm").addEventListener("click", () => { root.classList.toggle("rm"); syncDemo(); });
  $("#dSound").addEventListener("click", () => { S.sound = !S.sound; syncDemo(); });
  $("#dPlay").addEventListener("click", playFirstRun);
  ["d1", "d2", "d4", "d5", "s2"].forEach(x => $("#" + x).addEventListener("change", e => { S.d[x] = S.dBase[x] = x === "s2" ? e.target.value === "true" : e.target.value; render(); }));
}

/* ---------------- Boot ---------------- */
(function boot() {
  const q = new URLSearchParams(location.search);
  if (q.get("bar") === "0") root.classList.add("clean");
  if (q.get("theme") === "light") root.setAttribute("data-theme", "light");
  if (q.get("os") === "light") S.osTheme = "light";
  if (q.get("rm") === "1") root.classList.add("rm");
  if (q.get("freeze") === "1") S.freeze = true;
  ["d1", "d2", "d4", "d5"].forEach(x => { if (q.get(x)) S.dBase[x] = q.get(x); });
  if (q.get("s2")) S.dBase.s2 = q.get("s2") === "1";
  initDemo();
  route(location.hash);
  scheduleCheck();
  window.addEventListener("hashchange", () => route(location.hash));
})();
