/* Eucas notch prototype (CR-011). One Euca, created at setup, lives in the notch; a click opens the panel.
   Routes: ?r=<route> (see ROUTES). ?bar=0 hides the demo controls, ?freeze=1 stops motion for screenshots,
   ?theme=light, ?rm=1 (reduced motion). Copy follows BRAND §4: second person, the Euca speaks of itself by name. */
"use strict";
const Q = new URLSearchParams(location.search);
const FREEZE = Q.get("freeze") === "1";
const BAR = Q.get("bar") !== "0";
const ROOT = document.documentElement;
if (FREEZE) ROOT.classList.add("freeze");

/* ---------- identity: hues and shapes (BRAND §8, same geometry as the direction prototype) ---------- */
const HUE = {
  coral:{n:"Coral",base:"#ff5f73",light:"#ffb8c1",deep:"#e0364f"}, tangerine:{n:"Tangerine",base:"#ff8a3d",light:"#ffc9a3",deep:"#e0601a"},
  honey:{n:"Honey",base:"#f2ab1d",light:"#ffe2a0",deep:"#cf8600"}, pear:{n:"Pear",base:"#96bf2c",light:"#d6ec9a",deep:"#6c9410"},
  mint:{n:"Mint",base:"#3cc47c",light:"#aeedc9",deep:"#1f9658"}, teal:{n:"Teal",base:"#1fb5a3",light:"#9ee8dc",deep:"#0c8a7c"},
  aqua:{n:"Aqua",base:"#2db4dc",light:"#a6e6f7",deep:"#0e86b0"}, lavender:{n:"Lavender",base:"#8e6cf0",light:"#cbbcff",deep:"#5f3fd0"},
  orchid:{n:"Orchid",base:"#e05cb4",light:"#f6b6e1",deep:"#b8358d"}, cocoa:{n:"Cocoa",base:"#a66e4e",light:"#dcb59d",deep:"#7d4c31"},
  none:{n:"Unassigned",base:"#b4b7bf",light:"#dfe1e6",deep:"#8b8f99"}
};
const HUE_ORDER = ["coral","tangerine","honey","pear","mint","teal","aqua","lavender","orchid","cocoa"];
const SHAPES = {
  sphere:{n:"Sphere",d:'<circle cx="50" cy="52" r="40"/>',eye:[50,50,13],hl:[34,30],bottom:92},
  droplet:{n:"Droplet",d:'<path d="M50 8 C60 24 84 44 84 64 C84 83 69 95 50 95 C31 95 16 83 16 64 C16 44 40 24 50 8 Z"/>',eye:[50,66,12],hl:[38,50],bottom:95},
  cloud:{n:"Cloud",d:'<path d="M26 84 C12 84 6 72 10 62 C4 54 8 40 22 40 C22 26 36 18 48 24 C56 12 76 14 80 30 C92 32 98 46 92 56 C98 66 92 84 76 84 Z"/>',eye:[52,60,13],hl:[34,38],bottom:84},
  hexagon:{n:"Hexagon",d:'<polygon points="50,12 84,31 84,71 50,90 16,71 16,31"/>',round:10,eye:[50,52,13],hl:[34,32],bottom:95},
  blob:{n:"Blob",d:'<path d="M54 10 C76 12 92 30 88 52 C85 70 92 84 72 90 C54 95 34 92 20 80 C8 68 8 48 16 34 C24 18 36 9 54 10 Z"/>',eye:[50,50,13],hl:[34,28],bottom:93},
  egg:{n:"Egg",d:'<path d="M50 8 C71 8 86 38 86 60 C86 80 70 94 50 94 C30 94 14 80 14 60 C14 38 29 8 50 8 Z"/>',eye:[50,60,12],hl:[36,32],bottom:94},
  pill:{n:"Pill",d:'<rect x="6" y="27" width="88" height="48" rx="24"/>',eye:[60,51,11],hl:[26,38],bottom:75},
  triangle:{n:"Triangle",d:'<polygon points="50,16 88,82 12,82"/>',round:14,eye:[50,64,10],hl:[42,44],bottom:89},
  square:{n:"Rounded square",d:'<rect x="12" y="13" width="76" height="76" rx="22"/>',eye:[50,50,13],hl:[30,30],bottom:89}
};
function eyesFor(expr, gap){
  const L = -gap, R = gap;
  if (expr === "closed" || expr === "sleepy") return [L, R].map(x => `<path d="M${x - 5} -1 Q${x} 4 ${x + 5} -1" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`).join("");
  if (expr === "concerned") return `<rect x="${L - 3.5}" y="-6.5" width="7" height="13" rx="3.5" transform="rotate(16 ${L} 0)"/><rect x="${R - 3.5}" y="-6.5" width="7" height="13" rx="3.5" transform="rotate(-16 ${R} 0)"/>`;
  return [L, R].map(x => `<rect x="${x - 3.5}" y="-8" width="7" height="16" rx="3.5" transform="rotate(-12 ${x} 0)"/>`).join("");
}
let UID = 0;
/* One renderer: flat (lists) or soft-dimensional (hero, panel header). Eyes only, always white. */
function avatarSVG(a, o = {}){
  const P = HUE[a.hue] || HUE.none, S = SHAPES[a.shape] || SHAPES.sphere, id = "a" + (++UID);
  const [ex, ey, gap] = S.eye, expr = o.expr || (a.hue === "none" ? "closed" : "calm");
  const paint = o.soft ? `url(#${id}f)` : P.base;
  const stroke = S.round ? ` stroke="${paint}" stroke-width="${S.round}" stroke-linejoin="round"` : "";
  const body = `<g fill="${paint}"${stroke}>${S.d}</g>`;
  const eyes = `<g transform="translate(${ex} ${ey})"><g class="look"${o.follow ? ' data-follow="1"' : ""}><g class="blinker" fill="#fff">${eyesFor(expr, gap)}</g></g></g>`;
  if (!o.soft) return `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" focusable="false">${body}${eyes}</svg>`;
  const [hx, hy] = S.hl, gy = Math.min(S.bottom + 5, 101);
  return `<svg viewBox="0 0 100 106" width="100%" height="100%" aria-hidden="true" focusable="false"><defs>
    <radialGradient id="${id}f" cx="40%" cy="30%" r="80%" fx="32%" fy="20%"><stop offset="0" stop-color="${P.light}"/><stop offset=".5" stop-color="${P.base}"/><stop offset="1" stop-color="${P.deep}"/></radialGradient>
    <clipPath id="${id}c">${S.d}</clipPath>
    <filter id="${id}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
    <filter id="${id}s" x="-60%" y="-300%" width="220%" height="700%"><feGaussianBlur stdDeviation="1.8"/></filter></defs>
    <ellipse cx="50" cy="${gy}" rx="26" ry="3" fill="#000" opacity=".22" filter="url(#${id}s)"/>
    ${body}<g clip-path="url(#${id}c)">
      <ellipse cx="70" cy="90" rx="34" ry="18" fill="${P.deep}" opacity=".3" filter="url(#${id}b)"/>
      <ellipse cx="${hx}" cy="${hy}" rx="15" ry="8" transform="rotate(-30 ${hx} ${hy})" fill="#fff" opacity=".45" filter="url(#${id}b)"/>
      <ellipse cx="${hx - 3}" cy="${hy - 2}" rx="4.5" ry="2.4" transform="rotate(-30 ${hx - 3} ${hy - 2})" fill="#fff" opacity=".8"/>
    </g>${eyes}</svg>`;
}

/* ---------- icons (16 px grid, 1.6 stroke) ---------- */
const ic = (d, fill) => `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="${fill ? "currentColor" : "none"}" stroke="${fill ? "none" : "currentColor"}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  check: ic('<path d="M3.5 8.5l3 3 6-7"/>'),
  x: ic('<path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/>'),
  lock: ic('<rect x="3.5" y="7" width="9" height="6.5" rx="1.6"/><path d="M5.5 7V5.4a2.5 2.5 0 0 1 5 0V7"/>'),
  unlock: ic('<rect x="3.5" y="7" width="9" height="6.5" rx="1.6"/><path d="M5.5 7V5.4a2.5 2.5 0 0 1 4.7-1.2"/>'),
  chev: ic('<path d="M6 3.5L10.5 8 6 12.5"/>'),
  back: ic('<path d="M10 3.5L5.5 8l4.5 4.5"/>'),
  alert: ic('<path d="M8 3.8v5"/><circle cx="8" cy="11.8" r=".4" fill="currentColor"/>'),
  stop: ic('<rect x="4.5" y="4.5" width="7" height="7" rx="1.4" fill="currentColor" stroke="none"/>', false),
  wait: ic('<path d="M8 2.5a5.5 5.5 0 1 1-5.2 3.7"/>'),
  files: ic('<rect x="3" y="4.5" width="7" height="9" rx="1.4"/><path d="M6 4.5V3.6c0-.6.5-1.1 1.1-1.1h4.8c.6 0 1.1.5 1.1 1.1v7.8c0 .6-.5 1.1-1.1 1.1H10"/>'),
  done: ic('<circle cx="8" cy="8" r="5.5"/><path d="M5.6 8.2l1.7 1.7 3.2-3.6"/>'),
  close: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1"/></svg>',
  min: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 5h8" stroke="currentColor" stroke-width="1"/></svg>',
  max: '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  quartet: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><circle cx="4.2" cy="4.2" r="3.3"/><path d="M12 .6l3.4 6.3H8.6z"/><rect x="1" y="9.1" width="6.2" height="6.2" rx="1.9"/><path d="M12 8.4c1.4 1.8 2.8 3.4 2.8 4.8a2.8 2.8 0 0 1-5.6 0c0-1.4 1.4-3 2.8-4.8z"/></svg>',
  win: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="8.4" y="1" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="1" y="8.4" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="8.4" y="8.4" width="6.6" height="6.6" fill="#4cc2ff"/></svg>'
};

/* ---------- the content: one place for every string that repeats ---------- */
const COPY = {
  promise: "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.",
  privacy: "Nothing about your work leaves this PC unless you turn it on.",
  diag: "No paths to your projects or files."
};
const NEEDS = {
  wait:{sev:"attn", t:"bench is waiting for you", e:'Wants to run <span class="mono">pnpm build</span>', pe:'wants to run <span class="mono">pnpm build</span>', a:"Open session", time:"2 min", snooze:true},
  same:{sev:"attn", t:"Two sessions are editing one file", e:'bench and api-docs both changed <span class="mono">src/router.ts</span> in the last 4 minutes.', pe:'bench and api-docs · <span class="mono">src/router.ts</span>', a:"Show both", sub:"same", time:"4 min", snooze:true},
  done:{sev:"calm", t:"api-docs finished and is waiting", e:"Ran for 14 minutes and changed 3 files.", pe:"ran 14 min · changed 3 files", a:"Open session", time:"6 min", snooze:true},
  trip:{sev:"danger", t:"$N stopped notes", e:"It deleted 1,240 files in 20 seconds. $N stopped it at 14:02:31 and checked it isn't running.", pe:"deleted 1,240 files in 20 s", a:"See what happened", sub:"trip", time:"now"},
  off:{sev:"danger", t:"bench isn't protected", e:"$N hasn't seen a check from bench for 40 seconds while it ran tools.", pe:"no check for 40 s while it ran tools", a:"Fix it", sub:"fix", time:"now"},
  unver:{sev:"attn", t:"Claude Code 2.1.315 isn't verified yet", e:"It updated at 13:58. The safety test reruns now; until it passes, $N says so.", pe:"updated 13:58 · the safety test is rerunning", a:"Run the test", time:"8 min"}
};
const LIB = [
  {id:"push", t:"Block pushes to your default branch", d:"git push to main or master", on:true, lock:true},
  {id:"force", t:"Block force-pushes", d:"git push --force, on any branch", on:true, lock:true},
  {id:"trip", t:"Stop a session that deletes 200+ files", d:"the mass-delete tripwire", on:true, lock:true},
  {id:"out", t:"Block deletes outside the project folder", d:"rm, del, Remove-Item above the project", on:true, lock:true},
  {id:"env", t:"Block reading secrets", d:".env files and private keys", on:true, lock:true},
  {id:"reset", t:"Block git reset --hard", d:"and git clean -fd", on:true, lock:false},
  {id:"pkg", t:"Ask before installing packages", d:"npm, pnpm, pip, cargo", on:false, lock:false}
];
const MINE = [
  {t:'Allow <span class="mono">pnpm test</span> in bench', d:"From your approvals · used 212 times", on:true, lock:false},
  {t:'Block edits in <span class="mono">api-docs/migrations/</span>', d:"You described it · blocked 3 times", on:true, lock:true}
];

/* ---------- state ---------- */
const BASE = () => ({
  theme: Q.get("theme") === "light" ? "light" : "dark", rm: Q.get("rm") === "1",
  scene:"desk", step:1, euca:{name:"Pip", shape:"sphere", hue:"lavender"},
  guard:"ok", working:true, doze:false, mode:"pill", needs:[], peek:false, arrive:false, born:false,
  panel:false, tab:"usage", sub:null, meter:"trial", locked:true, level:1, draft:false, coach:false,
  menu:false, fullscreen:false, wtoast:null, toast:null, uac:false, declined:false, testFail:false, sheet:null,
  where:"today", sessions:3
});
let S = BASE();

/* ---------- routes: every state is reachable from the jump menu ---------- */
const BLANK = {name:"", shape:"sphere", hue:"none"};
const ROUTES = [
  ["Setup", [
    ["s-welcome","1 · Find your sessions", {scene:"setup", step:1}],
    ["s-create","2 · Make your Euca (before)", {scene:"setup", step:2, euca:{...BLANK}}],
    ["s-create-born","2 · Make your Euca (born)", {scene:"setup", step:2}],
    ["s-retro","3 · Your week", {scene:"setup", step:3}],
    ["s-rules","4 · Choose your rules", {scene:"setup", step:4}],
    ["s-rules-draft","4 · A described rule, drafted", {scene:"setup", step:4, draft:true}],
    ["s-lock","5 · Lock your rules", {scene:"setup", step:5}],
    ["s-uac","5 · The one admin prompt", {scene:"setup", step:5, uac:true}],
    ["s-declined","5 · Admin declined: not locked", {scene:"setup", step:5, declined:true, locked:false}],
    ["s-test","6 · Watch it block a test", {scene:"setup", step:6}],
    ["s-test-fail","6 · The test wasn't blocked", {scene:"setup", step:6, testFail:true}],
    ["s-privacy","7 · Privacy (Level 1)", {scene:"setup", step:7}],
    ["s-privacy-2","7 · Privacy (Level 2 + trial)", {scene:"setup", step:7, level:2}],
    ["s-done","8 · Pip is watching", {scene:"setup", step:8}],
    ["s-coach","After setup: the notch, once", {coach:true, born:true, working:false}]
  ]],
  ["The notch", [
    ["n-rest","Resting: protected, nothing running", {working:false}],
    ["n-working","Working: sessions are running", {}],
    ["n-arrive","Something needs you: it arrives", {needs:["wait","same"], arrive:true}],
    ["n-marker","The marker stays", {needs:["wait","same"]}],
    ["n-peek","Hover: the peek", {needs:["wait","same"], peek:true}],
    ["n-peek-calm","Hover with nothing waiting", {peek:true}],
    ["n-off","Not protected", {guard:"off", working:true, needs:["off"]}],
    ["n-off-peek","Not protected: hover", {guard:"off", needs:["off"], peek:true}],
    ["n-doze","Dozing: you're away, nothing running", {working:false, doze:true}],
    ["n-trip","Tripwire stop", {needs:["trip","wait"], working:false}],
    ["n-trip-peek","Tripwire stop: hover", {needs:["trip","wait"], working:false, peek:true}],
    ["n-thin","Thin line: working", {mode:"thin"}],
    ["n-thin-needs","Thin line: something needs you", {mode:"thin", needs:["wait"]}],
    ["n-thin-off","Thin line: not protected overrides it", {mode:"thin", guard:"off", needs:["off"]}],
    ["n-fullscreen","Full-screen app: steps aside", {fullscreen:true, needs:["trip"], wtoast:"trip"}],
    ["sheet-notch","Sheet: every notch state", {sheet:"notch"}]
  ]],
  ["The panel", [
    ["p-needs","Needs you + Usage", {panel:true, needs:["wait","same","done"]}],
    ["p-usage","Usage (nothing needs you)", {panel:true}],
    ["p-rules","Rules", {panel:true, tab:"rules"}],
    ["p-rules-draft","Rules: describe one, Pip drafts it", {panel:true, tab:"rules", draft:true}],
    ["p-rules-unlocked","Rules: not locked", {panel:true, tab:"rules", locked:false}],
    ["p-settings","Settings", {panel:true, tab:"settings"}],
    ["p-edit","Settings › your Euca's name and look", {panel:true, tab:"settings", sub:"edit"}],
    ["p-retro","Usage › your week", {panel:true, sub:"retro"}],
    ["p-same","Needs you › same file", {panel:true, needs:["same"], sub:"same"}],
    ["p-trip","Needs you › tripwire stop", {panel:true, needs:["trip"], sub:"trip", working:false}],
    ["p-off","Not protected", {panel:true, guard:"off", needs:["off"]}],
    ["p-fix","Not protected › fix it", {panel:true, guard:"off", needs:["off"], sub:"fix"}],
    ["p-idle","No sessions running", {panel:true, working:false, sessions:0}]
  ]],
  ["Supervisor meter and plans", [
    ["m-trial","Trial: 12 days left", {panel:true, meter:"trial"}],
    ["m-trial-end","Trial ended: the monthly taste starts", {panel:true, meter:"trialend"}],
    ["m-taste","Free: the monthly taste", {panel:true, meter:"taste"}],
    ["m-low","Free: running low", {panel:true, meter:"low"}],
    ["m-empty","Free: empty until 1 Dec", {panel:true, meter:"empty"}],
    ["m-pro","Pro", {panel:true, meter:"pro"}],
    ["m-plan-trial","Settings › plan in the trial", {panel:true, tab:"settings", meter:"trial", scroll:"plan"}],
    ["m-plan-taste","Settings › plan on the taste", {panel:true, tab:"settings", meter:"taste", scroll:"plan"}],
    ["sheet-meter","Sheet: every meter state", {sheet:"meter"}]
  ]],
  ["Fallback", [
    ["t-menu","Tray icon menu (fallback)", {menu:true}]
  ]]
];
const ROUTE = Object.fromEntries(ROUTES.flatMap(([, list]) => list.map(([id, label, s]) => [id, {label, s}])));
let cur = Q.get("r") || "n-working";
function go(id, keep){
  const r = ROUTE[id]; if (!r) return;
  cur = id;
  const keepTheme = S.theme, keepRm = S.rm, keepMode = keep ? S.mode : null;
  S = Object.assign(BASE(), structuredClone(r.s));
  S.theme = keepTheme; S.rm = keepRm;
  if (keepMode && !("mode" in r.s)) S.mode = keepMode;
  const u = new URL(location.href); u.searchParams.set("r", id); history.replaceState(null, "", u);
  render();
  if (S.arrive) sfx("needs", 120);
  if (r.s.scroll === "plan") requestAnimationFrame(() => document.getElementById("plan")?.scrollIntoView({block:"start"}));
}

/* ---------- small helpers ---------- */
const N = () => S.euca.name || "Your Euca";
const nm = s => s.replaceAll("$N", N());
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const $ = (sel, el = document) => el.querySelector(sel);
function say(t){ const l = $("#live"); l.textContent = ""; setTimeout(() => (l.textContent = t), 30); }
function eucaVars(){
  const P = HUE[S.euca.hue] || HUE.none;
  ROOT.style.setProperty("--euca-base", P.base); ROOT.style.setProperty("--euca-light", P.light); ROOT.style.setProperty("--euca-deep", P.deep);
}
function hasDanger(){ return S.needs.some(k => NEEDS[k].sev === "danger"); }
function statusLine(){
  if (S.guard === "off") return {off:true, t:"Not protected · bench: no check for 40 s"};
  if (!S.sessions) return {t:"Protected · no sessions running"};
  return {t:`Protected · ${S.sessions} sessions · checked 2 s ago`};
}

/* ---------- the desktop ---------- */
function renderDesk(){
  const term = `<span class="p">PS C:\\dev\\bench&gt;</span> claude
<span class="d">╭ bench · main</span>
&gt; move the router to the new matcher and keep the old routes working

  <span class="g">●</span> Read src/router.ts
  <span class="g">●</span> Edited src/router.ts <span class="d">(+42 −18)</span>
  <span class="g">●</span> Edited src/routes/legacy.ts <span class="d">(+6 −2)</span>
  <span class="g">●</span> Ran pnpm test <span class="d">· 128 passed</span>
  ◐ Updating the docs comment in src/router.ts…`;
  const code = [
    ['<span class="c">// Routes resolve through the new matcher; legacy paths map onto it.</span>'],
    ['<span class="k">import</span> { createMatcher } <span class="k">from</span> <span class="s">"./matcher"</span>;'],
    ['<span class="k">import</span> { legacy } <span class="k">from</span> <span class="s">"./routes/legacy"</span>;'], [""],
    ['<span class="k">export const</span> router = createMatcher({'], ['  routes: [...core, ...legacy],'], ['  fallback: <span class="s">"/not-found"</span>,'], ['});'], [""],
    ['<span class="k">export function</span> resolve(path: string) {'], ['  <span class="k">const</span> hit = router.match(path);'], ['  <span class="k">return</span> hit ?? router.fallback;'], ['}'], [""],
    ['<span class="c">// TODO: drop the legacy table after the 2.0 cut</span>']
  ];
  const editor = `<div class="ln">${code.map((_, i) => i + 1).join("\n")}</div><div class="code">${code.map(c => c[0]).join("\n")}</div>`;
  const badge = S.needs.length ? `<span class="tb-badge num">${S.needs.length}</span>` : "";
  $("#desk").innerHTML = `<div class="wall"></div>
  <div class="win term" aria-hidden="true"><div class="cap"><span class="t">bench — PowerShell</span><span class="cb">${I.min}</span><span class="cb">${I.max}</span><span class="cb">${I.close}</span></div><div class="body">${term}</div></div>
  <div class="win editor" aria-hidden="true"><div class="cap"><span class="t">router.ts — api-docs</span><span class="cb">${I.min}</span><span class="cb">${I.max}</span><span class="cb">${I.close}</span></div><div class="body">${editor}</div></div>
  <div class="taskbar"><div class="tb-apps">
    <span class="tb-app">${I.win.replace("<svg", '<svg width="20" height="20"')}</span>
    <span class="tb-app on"><i style="background:#2b2b2b;box-shadow:inset 0 0 0 1px #555"></i></span>
    <span class="tb-app on"><i style="background:linear-gradient(135deg,#2f80ed,#1b5fc1)"></i></span>
    <span class="tb-app"><i style="background:linear-gradient(135deg,#f2c94c,#e0a500)"></i></span>
    <span class="tb-app"><i style="background:linear-gradient(135deg,#3cc47c,#1f9658)"></i></span></div>
    <div class="tb-tray">
      <button class="tray-btn" data-act="traymenu" aria-label="Eucas (tray fallback): ${S.needs.length} need you">${I.quartet}${badge}</button>
      <span class="tray-btn" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 6.5a9 9 0 0 1 12 0M4.3 9a5.6 5.6 0 0 1 7.4 0M6.6 11.4a2.2 2.2 0 0 1 2.8 0"/></svg></span>
      <span class="tray-btn" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 6h2.5L9 3v10L5.5 10H3z"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5"/></svg></span>
      <span class="tb-clock num" aria-hidden="true"><span>14:06</span><span>26/10/2026</span></span>
    </div></div>`;
}

/* ---------- the notch ---------- */
function notchHTML(o = {}){
  const s = Object.assign({}, S, o);
  const danger = s.needs.find(k => NEEDS[k].sev === "danger");
  const markerKind = s.guard === "off" ? null : danger === "trip" ? "danger" : s.needs.length ? "attn" : null;
  const expr = s.guard === "off" || danger === "trip" ? "concerned" : s.doze ? "sleepy" : s.arrive ? "glance" : s.unborn ? "closed" : "";
  const marker = markerKind === "danger" ? `<span class="marker danger">${I.stop} Stopped notes</span>` : `<span class="marker attn num">${s.needs.length}</span>`;
  const working = s.working && s.guard !== "off" && !s.doze && !danger ? 1 : 0;
  const label = s.guard === "off"
    ? `${N()}: not protected. ${s.needs.length} need you. Open the panel.`
    : `${N()}: protected${working ? ", sessions working" : ""}${s.needs.length ? `, ${s.needs.length} need you` : ""}. Open the panel.`;
  return `<button class="notch${s.arrive ? " arrive" : ""}${s.born ? " born" : ""}${s.peek ? " peeking" : ""}" data-act="notch" aria-label="${esc(label)}" aria-expanded="${s.panel ? "true" : "false"}"
    data-guard="${s.guard}" data-working="${working}" data-mode="${s.mode}" data-doze="${s.doze ? 1 : 0}"${markerKind ? ` data-marker="${markerKind}"` : ""}>
    <span class="label">Not protected</span><span class="m-spacer"></span>
    <span class="eyes" data-x="${expr}"${o.static ? "" : " data-follow"}><i class="eye"></i><i class="eye"></i></span>
    ${marker}<span class="beam"><i></i></span><span class="glow"></span><span class="thin-dot${markerKind === "danger" ? " danger" : ""}"></span>
  </button>`;
}
function peekHTML(){
  const st = statusLine();
  const foot = `<div class="p-foot"><span>${st.off ? '<span class="offdot"></span>' : '<span class="okdot"></span>'}${esc(st.t.split(" · ").slice(0, st.off ? 1 : 2).join(" · "))}</span><button data-act="notch">Open panel ›</button></div>`;
  if (!S.needs.length) return `<div class="p-status"><span><span class="okdot"></span>${esc(st.t)}</span><span class="s2 num">5-hour 46% · week 62% · supervisor 78% left</span></div>`;
  const items = S.needs.slice(0, 3).map((k, i) => {
    const n = NEEDS[k];
    return `<div class="p-item"><span class="sev ${n.sev}">${n.sev === "danger" ? (k === "trip" ? I.stop : I.alert) : n.sev === "calm" ? I.done : I.alert}</span>
      <span style="min-width:0"><div class="t">${esc(nm(n.t))}</div><div class="e">${nm(n.pe)}</div></span>
      <button class="pbtn${i === 0 && n.sev === "danger" ? " pri" : ""}" data-act="need" data-k="${k}">${n.a}</button></div>`;
  }).join("");
  return items + foot;
}

/* ---------- the panel ---------- */
function needItem(k, pri){
  const n = NEEDS[k];
  const g = n.sev === "danger" ? (k === "trip" ? I.stop : I.alert) : n.sev === "calm" ? I.done : I.alert;
  return `<div class="need ${n.sev}"><span class="sev-p ${n.sev}">${g}</span><div>
    <div class="t"><span>${esc(nm(n.t))}</span><span class="time">${n.time}</span></div>
    <div class="e">${nm(n.e)}</div>
    <div class="acts"><button class="btn${pri ? " pri" : ""}" data-act="need" data-k="${k}">${n.a}</button>${n.snooze ? `<button class="btn ghost" data-act="snooze" data-k="${k}">Not now</button>` : ""}</div></div></div>`;
}
function panelHTML(){
  const st = statusLine();
  const lock = S.locked ? `<button class="chip" data-act="tab" data-tab="rules" title="Your rules are locked with Windows admin">${I.lock}Locked</button>`
                        : `<button class="chip attn" data-act="tab" data-tab="rules">${I.unlock}Not locked</button>`;
  const head = `<div class="ph"><span class="av">${avatarSVG(S.euca, {soft:true, follow:true, expr:S.guard === "off" ? "concerned" : undefined})}</span>
    <div class="who"><div class="nmrow"><span class="nm">${esc(N())}</span>${lock}</div><div class="st${st.off ? " off" : ""}">${st.off ? '<span class="offd"></span>' : '<span class="okd"></span>'}${esc(st.t)}</div></div></div>`;
  if (S.sub) return `<div class="panel" role="dialog" aria-label="${esc(N())}">${subHTML()}${S.toast ? toastHTML() : ""}</div>`;
  const danger = hasDanger();
  const needs = S.needs.length
    ? `<div class="sec-t"><span>Needs you · ${S.needs.length}</span></div>${S.needs.slice(0, 3).map((k, i) => needItem(k, i === 0)).join("")}${S.needs.length > 3 ? `<button class="more">Show ${S.needs.length - 3} more</button>` : ""}`
    : `<p class="quiet">Nothing needs you.</p>`;
  const tabs = [["usage","Usage"],["rules","Rules"],["settings","Settings"]];
  return `<div class="panel" role="dialog" aria-label="${esc(N())}">${head}<div class="p-body">${needs}
    <div class="tabs" role="tablist" aria-label="Panel sections">${tabs.map(([id, l]) => `<button role="tab" aria-selected="${S.tab === id}" data-act="tab" data-tab="${id}">${l}</button>`).join("")}</div>
    <div role="tabpanel">${S.tab === "usage" ? usageHTML(danger || S.needs.length) : S.tab === "rules" ? rulesHTML() : settingsHTML()}</div>
  </div>${S.toast ? toastHTML() : ""}</div>`;
}
function toastHTML(){ return `<div class="toast" role="status">${esc(S.toast)}<button data-act="undo">Undo</button></div>`; }

function supervisorHTML(){
  const M = {
    trial:{chip:'<span class="chip">Trial · 12 days left</span>', v:"78%", w:78, l:"Trial ends 9 Nov", line:"Answered your agents 41 times so far, so they didn't wait for you. It never approves a tool call."},
    trialend:{chip:'<span class="chip">Free</span>', v:"100%", w:100, l:"Resets 1 Dec", line:`Your trial ended on 9 Nov. From now on ${N()} gets a small amount of supervisor help each month.`},
    taste:{chip:'<span class="chip">Free</span>', v:"55%", w:55, l:"Resets 1 Dec", line:"Answered your agents 34 times this month, so they didn't wait for you. It never approves a tool call."},
    low:{chip:'<span class="chip">Free</span>', v:"9%", w:9, l:"Resets 1 Dec", line:`Running low. When it's empty, ${N()} asks you instead until 1 Dec.`},
    empty:{chip:'<span class="chip">Free</span>', v:"0%", w:0, l:"Resets 1 Dec", line:`<b>${esc(N())} will check with you more often until 1 Dec.</b> Your rules and protection don't change.`, pro:true},
    pro:{chip:'<span class="chip">Pro</span>', v:"64%", w:64, l:"Resets 26 Nov", line:"Answered your agents 212 times this month, so they didn't wait for you. It never approves a tool call."}
  }[S.meter];
  return `<div class="sec-t"><span>Supervisor</span>${M.chip}</div>
  <div class="group"><div class="meter"><div class="m-top"><span class="ml">Help left this month</span><span class="mr">${M.l}</span><span class="mv">${M.v}</span></div>
    <div class="bar sup" role="meter" aria-label="Supervisor help left" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${M.w}"><i style="width:${M.w}%"></i></div>
    <div class="m-line">${M.line}</div>
    ${M.pro ? `<div class="pro-line">Pro keeps it going all month: $20/month, $15 for the first 200. <button class="link" data-act="tab" data-tab="settings" data-scroll="plan">See Pro</button></div>` : ""}
  </div></div>`;
}
function usageHTML(){
  const W = S.where === "today" ? [["bench",58],["api-docs",30],["notes",12]] : [["bench",51],["api-docs",22],["notes",14],["site",9],["infra",4]];
  return `<div class="sec-t"><span>Your Claude usage</span><span class="meta">updated 20 s ago</span></div>
  <div class="group">
    <div class="meter"><div class="m-top"><span class="ml">5-hour</span><span class="mr">resets 15:40</span><span class="mv">46%</span></div>
      <div class="bar" role="meter" aria-label="5-hour limit used" aria-valuenow="46" aria-valuemin="0" aria-valuemax="100"><i style="width:46%"></i><b style="left:85%" title="Your warning line: 85%"></b></div>
      <div class="m-line">At this pace you reach it around <b>15:10</b>, 30 minutes before it resets.</div></div>
    <div class="meter"><div class="m-top"><span class="ml">Week</span><span class="mr">resets Mon 09:00</span><span class="mv">62%</span></div>
      <div class="bar" role="meter" aria-label="Weekly limit used" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><i style="width:62%"></i><b style="left:85%"></b></div>
      <div class="m-line">On pace for about <b>81%</b> by Monday.</div></div>
  </div>
  <div class="sec-t"><span>Where it went</span><span class="seg" role="group" aria-label="Period"><button aria-pressed="${S.where === "today"}" data-act="where" data-v="today">Today</button><button aria-pressed="${S.where === "week"}" data-act="where" data-v="week">7 days</button></span></div>
  <div class="group where">${W.map(([p, v]) => `<div class="wr"><span>${p}</span><span class="wb"><i style="width:${v}%"></i></span><span class="wp">${v}%</span></div>`).join("")}</div>
  ${supervisorHTML()}
  <div class="group"><button class="row" data-act="sub" data-sub="retro"><span class="rl"><div class="rt">Your week</div><div class="rd">41 sessions · 3 risky commands · 4 same-file clashes</div></span>${I.chev.replace("<svg", '<svg class="chev"')}</button></div>`;
}
function ruleRow(r, i, kind){
  return `<div class="row"><span class="rl"><div class="rt">${r.t}</div><div class="rd">${r.d}</div></span>
    ${r.lock ? `<span class="lockg" title="Locked: changing it asks for admin">${I.lock}</span>` : ""}
    <button class="sw" role="switch" aria-checked="${r.on}" aria-label="${esc(r.t.replace(/<[^>]+>/g, ""))}" ${r.lock && S.locked ? "data-locked" : ""} data-act="sw" data-kind="${kind}" data-i="${i}"></button></div>`;
}
function draftHTML(){
  return `<div class="draft" aria-live="polite"><div class="q">You wrote: “don't let agents touch the migrations in api-docs”</div>
    <div class="rule"><span class="k">block</span> Edit, Write · <span class="k">in</span> api-docs/migrations/ <span class="k">and everything in it</span></div>
    <div class="fx">Last week it would have blocked 3 calls, all from api-docs. It can't loosen a locked rule.</div>
    <div class="acts"><button class="btn pri" data-act="adddraft">Add rule</button><button class="btn ghost" data-act="nodraft">Reword</button>
    <label><span class="cb-box on">${I.check}</span>Lock it too</label></div></div>`;
}
function rulesHTML(){
  const lockrow = S.locked
    ? `<div class="lockrow">${I.lock}<span class="grow">6 rules locked with Windows admin</span><button class="link" data-act="lockchange">Change</button></div>`
    : `<div class="lockrow attn">${I.unlock}<span class="grow">Not locked: an agent could switch these off. ${esc(N())} watches for that.</span><button class="btn" data-act="relock">Lock</button></div>`;
  return `<div class="promise">${COPY.promise}</div>${lockrow}
  <div class="sec-t"><span>Safety rules</span><span class="meta">tested</span></div>
  <div class="group">${LIB.map((r, i) => ruleRow(r, i, "lib")).join("")}</div>
  <div class="sec-t"><span>Your rules</span></div>
  <div class="group">${MINE.map((r, i) => ruleRow(r, i, "mine")).join("")}</div>
  <form class="compose" data-act="draftform"><input aria-label="Describe a rule" placeholder="Describe a rule in your own words" value="${S.draft ? "don't let agents touch the migrations in api-docs" : ""}"><button class="btn" type="submit">Draft it</button></form>
  ${S.draft ? draftHTML() : ""}`;
}
function planHTML(){
  if (S.meter === "pro") return `<div class="plan"><div class="pt"><span>Pro</span><span class="num">$20/month</span></div><div class="pd">Renews 26 Nov. Supervisor help all month, every session's details, history and export.</div><button class="btn">Manage</button></div>`;
  const trial = S.meter === "trial";
  return `<div class="plan"><div class="pt"><span>${trial ? "Free · supervisor trial" : "Free"}</span><span class="${trial ? "" : "num"}">${trial ? "12 days left" : "monthly taste"}</span></div>
    <div class="pd">${trial ? "The full supervisor until 9 Nov. Then a small amount each month, free." : "A small amount of supervisor help each month. Protection, rules and usage are free for every session."}</div>
    <button class="btn">Get Pro · $20/month</button><div class="pd" style="margin:8px 0 0">The first 200 people keep $15/month for life.</div></div>`;
}
function settingsHTML(){
  return `<div class="group"><button class="row" data-act="sub" data-sub="edit"><span style="width:28px;height:28px;flex:none">${avatarSVG(S.euca)}</span><span class="rl"><div class="rt">${esc(N())}</div><div class="rd">${HUE[S.euca.hue].n} ${SHAPES[S.euca.shape].n.toLowerCase()} · name and look</div></span>${I.chev.replace("<svg", '<svg class="chev"')}</button></div>
  <div class="sec-t"><span>Protection</span></div>
  <div class="group">
    <div class="row"><span class="rl"><div class="rt">Admin lock</div><div class="rd">${S.locked ? "On · 6 rules no agent can switch off" : "Off · your rules run, not locked"}</div></span><button class="btn" data-act="tab" data-tab="rules">${S.locked ? "Rules" : "Lock"}</button></div>
    <div class="row"><span class="rl"><div class="rt">Safety test</div><div class="rd">Blocked a test push · 26 Oct, 14:03</div></span><button class="btn">Run again</button></div>
  </div>
  <div class="sec-t"><span>Privacy</span></div>
  <div class="group"><div class="radio" role="radiogroup" aria-label="Privacy level">
    <label class="${S.level === 1 ? "on" : ""}"><input type="radio" name="lvl" ${S.level === 1 ? "checked" : ""} data-act="level" data-v="1"><span><div class="rt">Level 1 · signals only</div><div class="rd">Which tool ran, where and when, and whether a rule matched. ${COPY.privacy}</div></span></label>
    <label class="${S.level === 2 ? "on" : ""}"><input type="radio" name="lvl" ${S.level === 2 ? "checked" : ""} data-act="level" data-v="2"><span><div class="rt">Level 2 · signals and the last message</div><div class="rd">When ${esc(N())} isn't sure, the waiting session's last message, trimmed, goes to the supervisor. Hosted with zero data retention.</div></span></label>
  </div></div>
  <div class="sec-t"><span>The notch</span></div>
  <div class="group">
    <div class="row"><span class="rl"><div class="rt">Look</div><div class="rd">Thin line suits screens with a thick top bezel</div></span><span class="seg" role="group" aria-label="Notch look"><button aria-pressed="${S.mode === "pill"}" data-act="mode" data-v="pill">Pill</button><button aria-pressed="${S.mode === "thin"}" data-act="mode" data-v="thin">Thin line</button></span></div>
    <div class="row"><span class="rl"><div class="rt">Sounds</div><div class="rd">Needs you and done, quiet in full-screen apps</div></span><button class="sw" role="switch" aria-checked="true" aria-label="Sounds" data-act="toggle"></button></div>
    <div class="row"><span class="rl"><div class="rt">Theme</div></span><span class="seg" role="group" aria-label="Theme"><button aria-pressed="${S.theme === "dark"}" data-act="theme" data-v="dark">Dark</button><button aria-pressed="${S.theme === "light"}" data-act="theme" data-v="light">Light</button><button aria-pressed="false">Windows</button></span></div>
  </div>
  <div class="sec-t"><span>Help</span></div>
  <div class="group"><div class="row"><span class="rl"><div class="rt">Diagnostic</div><div class="rd">A report you read before you share it. ${COPY.diag}</div></span><button class="btn">Run</button></div></div>
  <div class="sec-t" id="plan"><span>Plan</span></div>
  <div class="group">${planHTML()}</div>
  <div class="quiet" style="display:flex;justify-content:space-between;margin-top:4px"><span>Eucas 0.1.0</span><button class="link" data-act="quit">Quit Eucas</button></div>`;
}
function subHTML(){
  const back = t => `<div class="sub-h"><button data-act="back" aria-label="Back">${I.back}</button><h2>${t}</h2></div>`;
  switch (S.sub) {
    case "retro": return back("Your week") + `<div class="p-body">${retroHTML(true)}</div>`;
    case "same": return back("Two sessions, one file") + `<div class="p-body">
      <p class="lead">bench and api-docs both changed <span class="mono">src/router.ts</span> in the last 4 minutes. If both keep going, one may overwrite the other's work. ${esc(N())} doesn't block either.</p>
      <div class="cards2"><div class="rc"><div class="rh">bench</div><div class="rb">Last edit 14:02 · +42 −18<br><span class="mono">createMatcher(…)</span></div></div>
      <div class="rc"><div class="rh">api-docs</div><div class="rb">Last edit 14:06 · +3 −1<br><span class="mono">/** Routes resolve… */</span></div></div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn pri" data-act="open" data-v="bench">Open bench</button><button class="btn" data-act="open" data-v="api-docs">Open api-docs</button></div>
      <p class="quiet" style="margin-top:12px"><button class="link" data-act="back">Don't warn for this file today</button></p></div>`;
    case "trip": return back("Tripwire stop") + `<div class="p-body">
      <div class="big">${esc(N())} stopped notes at 14:02:31</div>
      <p class="lead">It deleted 1,240 files in 20 seconds, starting with <span class="mono">notes/drafts/</span>. ${esc(N())} stopped the session and checked it isn't running.</p>
      <div class="sec-t"><span>What was deleted</span><button class="link" style="font-size:12px">Export the list</button></div>
      <div class="group files"><div><span>notes/drafts/</span><span>912 files</span></div><div><span>notes/archive/2025/</span><span>301 files</span></div><div><span>notes/.obsidian/</span><span>27 files</span></div></div>
      <div class="sec-t"><span>How to get them back</span></div>
      <ol class="steps"><li>notes is a git repo: run <span class="mono">git restore .</span> in it to bring back what was committed.</li><li>File History is on: open the folder, then Home › History.</li></ol>
      <div style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap"><button class="btn pri">Open the folder</button><button class="btn ghost">This was expected</button></div></div>`;
    case "fix": return back("bench isn't protected") + `<div class="p-body">
      <p class="lead">bench ran tools for 40 seconds and ${esc(N())} saw no check. Until a real check comes through, ${esc(N())} says so here and in the notch.</p>
      <div class="group">
        <div class="check"><span class="ok">${I.check}</span><span>Guard installed<small>Plugin found in your Claude Code setup</small></span></div>
        <div class="check"><span class="ok">${I.check}</span><span>api-docs and notes are protected<small>Checked 2 s ago</small></span></div>
        <div class="check"><span class="bad">${I.x}</span><span>bench started before the guard was added<small>Sessions pick up the guard when they start</small></span></div></div>
      <p class="lead">Restart bench to protect it. Nothing it did was lost.</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn pri" data-act="open" data-v="bench">Open bench</button><button class="btn">Run the diagnostic</button></div></div>`;
    case "edit": return back("Name and look") + `<div class="p-body">${createFields(true)}</div>`;
  }
  return "";
}
function retroHTML(compact){
  const days = [32, 48, 41, 88, 60, 22, 30];
  return `${compact ? "" : ""}<div class="${compact ? "cards2" : "cards4"}">
    <div class="rc"><div class="rh">1.9 M tokens · busiest Thursday</div><div class="days" aria-hidden="true">${days.map((v, i) => `<i class="${i === 3 ? "hi" : ""}" style="height:${v}%"></i>`).join("")}</div><div class="rb">bench used 58% of it.</div></div>
    <div class="rc"><div class="rh">3 commands would have been stopped</div><div class="rb"><span class="mono">git push origin main</span> · bench · Thu 14:02<br><span class="mono">git push --force</span> · site · Tue 10:41</div></div>
    <div class="rc"><div class="rh">2 sessions edited one file 4 minutes apart</div><div class="rb"><span class="mono">src/router.ts</span>. It happened 4 times this week.</div></div>
    <div class="rc"><div class="rh">You approved <span class="mono">pnpm test</span> 212 times</div><div class="rb">${compact ? "It's a rule now: used 212 times since." : "It can become a rule in the next step."}</div></div>
  </div>`;
}

/* ---------- setup ---------- */
const STEPS = 8;
function createFields(inPanel){
  const e = S.euca;
  const shapes = Object.keys(SHAPES).map(k => `<button aria-pressed="${e.shape === k}" aria-label="${SHAPES[k].n}" data-act="shape" data-v="${k}">${avatarSVG({shape:k, hue:e.hue === "none" ? "none" : e.hue}, {expr:e.hue === "none" ? "closed" : "calm"})}</button>`).join("");
  const hues = HUE_ORDER.map(k => `<button aria-pressed="${e.hue === k}" aria-label="${HUE[k].n}" style="background:${HUE[k].base}" data-act="hue" data-v="${k}"></button>`).join("");
  const note = ["coral","honey","tangerine"].includes(e.hue) ? `Fine to keep: ${esc(N())}'s warnings always come with words, never colour alone.` : "";
  const preview = inPanel ? `<div style="display:flex;align-items:center;gap:12px;margin:2px 2px 14px"><span style="width:56px;height:58px" class="hero">${avatarSVG(e, {soft:true, follow:true})}</span><span class="m-line">The notch, the panel and the tray all use this look.</span></div>` : "";
  return `${preview}<div class="field-l">Name</div>
    <input class="field" data-act="name" value="${esc(e.name)}" placeholder="Name your Euca" maxlength="16" aria-label="Name">
    <div class="sugg"><span>Or</span>${["Pip","Moss","Juno","Kit"].map(n => `<button data-act="suggest" data-v="${n}">${n}</button>`).join("")}</div>
    <div class="field-l">Shape</div><div class="shapes" role="group" aria-label="Shape">${shapes}</div>
    <div class="field-l">Colour</div><div class="hues" role="group" aria-label="Colour">${hues}</div><div class="hue-note">${note}</div>`;
}
function setupHTML(){
  const st = S.step;
  const dots = Array.from({length:STEPS}, (_, i) => `<i class="${i + 1 < st ? "on" : i + 1 === st ? "cur" : ""}"></i>`).join("");
  let body = "", foot = "";
  const next = (label, dis) => `<button class="btn pri lg" data-act="next"${dis ? " disabled" : ""}>${label}</button>`;
  const backB = st > 1 && st < 6 ? `<button class="btn ghost lg" data-act="prev">Back</button>` : "";
  if (st === 1) {
    body = `<h1>First, let's find your sessions</h1><p class="lede">Eucas watches the Claude Code sessions you already run. It never writes code. It guards them, tells you what needs you, and shows where your usage goes.</p>
    <div class="checklist">${[["Claude Code 2.1.312 found","In the desktop app and in your terminal"],["41 sessions in the last 7 days","Eucas keeps counts, never the text of your prompts or files"],["Your status line stays as it is","ccstatusline keeps showing exactly as before"],["2 hooks of your own keep working","Eucas's checks run alongside them"]].map(([a, b]) => `<div class="ci">${I.check}<span>${a}<small>${b}</small></span></div>`).join("")}</div>`;
    foot = `<span class="hint">About 5 minutes. Nothing is changed until step 5.</span><span class="sp"></span>${next("Make your Euca")}`;
  } else if (st === 2) {
    const e = S.euca, unborn = e.hue === "none";
    body = `<h1>Make your Euca</h1><p class="lede">It sits at the top of your screen and minds your sessions. Pick a name and a look. You can change both later.</p>
    <div class="create"><div class="stage"><span class="hero" id="hero">${avatarSVG(e, {soft:true, follow:!unborn})}</span><span class="hn${e.name ? "" : " ph"}">${e.name ? esc(e.name) : "No name yet"}</span>
      <div class="mini-notch"><span class="n"><span class="eyes" data-x="${unborn ? "closed" : ""}"${unborn ? "" : " data-follow"}><i class="eye"></i><i class="eye"></i></span></span><span>${unborn ? "Its place at the top of your screen" : `Where ${esc(e.name || "it")} will sit`}</span></div></div>
      <div>${createFields(false)}</div></div>`;
    foot = `${backB}<span class="sp"></span>${!e.name || unborn ? `<span class="hint">${!e.name ? "Give it a name" : "Pick a shape or a colour"} to continue</span>` : ""}${next("Continue", !e.name || unborn)}`;
  } else if (st === 3) {
    body = `<div class="retro-h">Your week: 41 sessions in 6 projects, about 62% of your weekly limit.</div>${retroHTML(false)}`;
    foot = `${backB}<span class="sp"></span>${next("Choose your rules")}`;
  } else if (st === 4) {
    const sugg = [['Allow <span class="mono">pnpm test</span> in bench',"You approved it 212 times",true],['Allow <span class="mono">git status</span> everywhere',"Read-only · 540 times",true],['Allow <span class="mono">pnpm lint</span> in bench',"Runs code from the project · 96 times",false]];
    body = `<h1 style="font-size:28px">Choose your rules</h1><p class="lede" style="margin-bottom:14px">Tested rules are on. Add your own in plain words: ${esc(N())} turns them into exact rules you confirm.</p>
    <div class="rules-s"><div class="col"><div class="sec-t"><span>Safety rules</span><span class="meta">tested</span></div><div class="group">${LIB.map((r, i) => ruleRow({...r, lock:false}, i, "lib")).join("")}</div></div>
    <div class="col"><div class="sec-t"><span>Your own</span></div>
    <form class="compose" data-act="draftform"><input aria-label="Describe a rule" placeholder="Describe a rule in your own words" value="${S.draft ? "don't let agents touch the migrations in api-docs" : ""}"><button class="btn" type="submit">Draft it</button></form>${S.draft ? draftHTML() : ""}
    <div class="sec-t"><span>From your week</span></div><div class="group">${sugg.map(([t, d, on]) => `<div class="row"><span class="cb-box${on ? " on" : ""}">${on ? I.check : ""}</span><span class="rl"><div class="rt">${t}</div><div class="rd">${d}</div></span></div>`).join("")}</div></div></div>`;
    foot = `${backB}<span class="sp"></span>${next(`Continue · ${S.draft ? 9 : 8} rules`)}`;
  } else if (st === 5) {
    if (S.declined) {
      body = `<h1>Your rules are on, but not locked</h1><p class="lede">Windows didn't give permission, so the rules sit in your user settings.</p>
      <div class="notlocked"><b style="font-weight:600">Not locked</b><p>An agent or a repo could switch them off. ${esc(N())} watches for that and tells you the moment it happens. You can lock them any time from Rules.</p></div>`;
      foot = `<button class="btn ghost lg" data-act="relock">Try again</button><span class="sp"></span>${next("Continue")}`;
    } else {
      const items = LIB.filter(r => r.on).map(r => r.t).concat(S.draft ? ["Block edits in api-docs/migrations/"] : []);
      body = `<h1>Lock your rules</h1><p class="lede" style="margin-bottom:14px">Locked rules live where no agent or repo can switch them off. Changing them later asks for admin again.</p>
      <div class="group lock-list" style="max-width:560px">${items.map((t, i) => `<div class="row"><span class="cb-box${i < 5 ? " on" : ""}">${i < 5 ? I.check : ""}</span><span class="rl"><div class="rt">${esc(t)}</div></span>${i < 5 ? `<span class="lockg">${I.lock}</span>` : ""}</div>`).join("")}</div>
      <ul class="conseq"><li>${I.alert}<span>Windows asks for permission once. It will say <b style="font-weight:600;color:var(--text-1)">Unknown publisher</b>: this first version isn't signed yet.</span></li><li>${I.alert}<span>Without the lock, your rules still run, labelled Not locked.</span></li></ul>`;
      foot = `${backB}<span class="sp"></span><button class="btn ghost lg" data-act="skiplock">Skip the lock</button><button class="btn pri lg" data-act="uac"${S.uac ? " disabled" : ""}>${S.uac ? "Waiting for Windows…" : "Lock 5 rules"}</button>`;
    }
  } else if (st === 6) {
    const L = [["Starting a test session in a temporary folder", true],['It tried: <b style="font-weight:500">git push origin main</b>', true]];
    body = `<h1>Watch ${esc(N())} block a test</h1><p class="lede">A throwaway session in a temporary folder tries to push to main. Nothing touches your projects or the network.</p>
    <div class="log">${L.map(([t]) => `<div class="on"><span style="color:var(--text-3)">›</span>${t}</div>`).join("")}
      ${S.testFail ? `<div class="on res bad">${I.x} Not blocked · 0.4 s</div>` : `<div class="on res">${I.check} Blocked by ${esc(N())} · 0.3 s · logged</div>`}</div>
    ${S.testFail ? `<div class="notlocked" style="margin-top:14px;background:var(--danger-tint);color:var(--danger-ink)"><b style="font-weight:600">The test wasn't blocked.</b><p>${esc(N())} is not protecting your sessions on this PC yet. Nothing outside the test folder was touched.</p></div>` : `<p class="approved">That's what happens in your real sessions. Every block shows up in the panel with why.</p>`}`;
    foot = S.testFail ? `<button class="btn ghost lg">Show what happened</button><span class="sp"></span><button class="btn pri lg">Run the diagnostic</button>` : `<span class="sp"></span>${next("Continue")}`;
  } else if (st === 7) {
    body = `<h1>What ${esc(N())} may read</h1><p class="lede">${COPY.privacy}</p>
    <div class="levels">
      <button class="lvl" aria-pressed="${S.level === 1}" data-act="level" data-v="1"><span class="lt">Level 1 · signals only <span class="chip">Default</span></span><span class="ld">Which tool ran, where and when, and whether a rule matched. Nothing leaves this PC.</span><span class="lx">The supervisor can't help at this level, so ${esc(N())} asks you instead.</span></button>
      <button class="lvl" aria-pressed="${S.level === 2}" data-act="level" data-v="2"><span class="lt">Level 2 · and the last message</span><span class="ld">When ${esc(N())} isn't sure, the waiting session's last message, trimmed, goes to the supervisor: an open model hosted with zero data retention.</span><span class="lx">No files, no paths to your projects. Needed for the 14-day supervisor trial.</span></button>
    </div>
    ${S.level === 2 ? `<div class="trial-f"><div><div class="field-l">Email for your free trial</div><input class="field" type="email" placeholder="you@example.com" aria-label="Email for your free trial"></div><button class="btn lg">Send a code</button></div><div class="hint" style="font-size:12px;color:var(--text-3);margin-top:6px">One trial per email. No card. You can skip this and start the trial later from Usage.</div>` : ""}`;
    foot = `<span class="sp"></span>${next("Start watching")}`;
  } else if (st === 8) {
    body = `<div class="done-wrap"><span class="hero" id="hero">${avatarSVG(S.euca, {soft:true, follow:true})}</span><h1>${esc(N())} is watching</h1>
      <p class="lede">2 sessions running, both protected. ${esc(N())} lives at the top of your screen and never opens by itself.</p>
      <span class="hb"><i></i>Checked 2 s ago</span></div>`;
    foot = `<span class="sp"></span><button class="btn pri lg" data-act="fly">Send ${esc(N())} to the top</button>`;
  }
  const uac = S.uac ? `<div class="uac-scrim"><div class="uac" role="dialog" aria-label="User Account Control"><div class="bar">User Account Control</div><div class="in"><h3>Do you want to allow this app from an unknown publisher to make changes to your device?</h3>
    <div class="app"><i style="color:#eceef3">${I.quartet.replace("<svg", '<svg width="18" height="18"')}</i><b>Eucas</b></div><div class="kv">Publisher: Unknown<br>File origin: Hard drive on this computer</div></div>
    <div class="btns"><button class="y" data-act="uacyes">Yes</button><button data-act="uacno">No</button></div></div></div>` : "";
  return `<div class="setup-scrim"><div class="swin" role="dialog" aria-label="Set up Eucas"><div class="cap"><span class="t">Eucas</span><span class="cb">${I.min}</span><span class="cb">${I.close}</span></div>
    <div class="s-prog"><span class="dots" aria-hidden="true">${dots}</span><span>Step ${st} of ${STEPS}</span></div>
    <div class="s-body">${body}</div><div class="s-foot">${foot}</div></div></div>${uac}`;
}

/* ---------- sheets ---------- */
function sheetHTML(){
  if (S.sheet === "notch") {
    const cells = [
      ["Resting", "Protected, nothing running. The eyes follow your pointer and blink.", {working:false}],
      ["Working", `Sessions are running: the glow gathers into a beam in ${N()}'s colour.`, {working:true}],
      ["Needs you", "One nudge and a marker that stays. Never opens by itself.", {needs:["wait","same"], working:true}],
      ["Not protected", "The heartbeat failed: concerned eyes, the words, a red ring. No glow.", {guard:"off", needs:["off"]}],
      ["Tripwire stop", `${N()} stopped a session. The marker says what, in words.`, {needs:["trip"], working:false}],
      ["Dozing", "You're away and nothing is running. A session starting wakes it.", {doze:true, working:false}],
      ["Thin line", "For thick bezels. Hover grows it into the pill.", {mode:"thin", working:true}],
      ["Thin line · needs you", "A dot that stays at the end of the line.", {mode:"thin", needs:["wait"], working:false}],
      ["Before setup ends", "Closed eyes in grey until you make your Euca.", {unborn:true, working:false, euca:{name:"", shape:"sphere", hue:"none"}}]
    ];
    return `<div class="sheet"><h1>Every notch state</h1><p class="sl">Shown at 160 %. The notch is always black: it belongs to the screen, not to the app. Colour never carries a state alone: each state has an eye shape, and the serious ones have words.</p>
      <div class="sgrid">${cells.map(([t, d, o]) => `<div class="scell"><div class="stop"><div class="notch-wrap" style="left:50%">${notchHTML(Object.assign({needs:[], guard:"ok", doze:false, mode:"pill", arrive:false, peek:false, born:false, static:true}, o))}</div></div><div class="cap2"><b>${t}</b><span>${d}</span></div></div>`).join("")}</div></div>`;
  }
  const keep = S.meter;
  const T = {trial:"In the 14-day trial", trialend:"The day the trial ends", taste:"Free: the monthly taste", low:"Free: running low", empty:"Free: empty", pro:"Pro"};
  const cells = Object.keys(T).map(m => { S.meter = m; return `<div class="scell" style="padding:14px 14px 4px"><div class="stype">${T[m]}</div>${supervisorHTML()}</div>`; }).join("");
  S.meter = keep;
  return `<div class="sheet"><h1>The supervisor meter</h1><p class="sl">Help left this month and the reset date. Never dollars: the limit behind it is a hidden cost budget, and each question is capped. When it runs out, ${esc(N())} goes back to asking you; protection and rules never depend on it.</p><div class="sgrid">${cells}</div></div>`;
}

/* ---------- demo controls ---------- */
let jumpOpen = false;
function demoHTML(){
  if (!BAR) return "";
  const groups = ROUTES.map(([g, list]) => `<h4>${g}</h4>${list.map(([id, l]) => `<a href="?r=${id}" data-route="${id}" class="${id === cur ? "cur" : ""}">${l}</a>`).join("")}`).join("");
  return `<div class="demo">${jumpOpen ? `<div class="jump" role="navigation" aria-label="Jump to a state"><div class="tg">
      <button aria-pressed="${S.theme === "light"}" data-act="theme" data-v="${S.theme === "light" ? "dark" : "light"}">Light</button>
      <button aria-pressed="${S.rm}" data-act="rm">Reduced motion</button>
      <button aria-pressed="${S.mode === "thin"}" data-act="mode" data-v="${S.mode === "thin" ? "pill" : "thin"}">Thin line</button>
      <button data-act="sim-arrive">Simulate: needs you</button>
      <button data-act="sim-work">Toggle working</button>
      <button data-act="sim-doze">Toggle away</button></div>${groups}</div>` : ""}
    <button data-act="jump" aria-expanded="${jumpOpen}">States · ${esc(ROUTE[cur]?.label || "")}</button></div>`;
}

/* ---------- render ---------- */
function render(){
  ROOT.dataset.theme = S.theme; ROOT.classList.toggle("rm", S.rm);
  eucaVars(); renderDesk();
  let html = "";
  if (S.sheet) html += sheetHTML();
  else if (S.fullscreen) html += `<div class="fullscreen"><div class="vid">Full-screen video · the notch steps aside</div></div>`;
  if (S.scene === "setup") html += setupHTML();
  else if (!S.fullscreen) {
    html += `<div class="notch-wrap" id="nw"><div class="peek${S.peek ? " open" : ""}" id="peek" aria-hidden="${!S.peek}">${peekHTML()}</div>${notchHTML()}
      ${S.panel ? panelHTML() : ""}
      ${S.coach ? `<div class="coach" role="status"><p><b>${esc(N())} lives here.</b> Hover to peek at what needs you. Click to open the panel. Nothing here opens by itself.</p><button class="btn" data-act="coach">Got it</button></div>` : ""}</div>`;
  }
  if (S.menu) html += `<div class="ctx" role="menu"><button role="menuitem" data-act="m-panel">Show the panel</button><button role="menuitem" data-act="m-mode">${S.mode === "thin" ? "Show the notch as a pill" : "Show the notch as a thin line"}</button><hr><button role="menuitem" data-act="quit">Quit Eucas…</button></div>`;
  if (S.wtoast) html += `<div class="wtoast" role="status"><div class="wa">${I.quartet.replace("<svg", '<svg width="14" height="14"')}Eucas</div><b>${esc(N())} stopped notes</b>It deleted 1,240 files in 20 seconds. Stopped at 14:02:31.<div class="wb"><button>See what happened</button><button>Dismiss</button></div></div>`;
  html += demoHTML();
  $("#app").innerHTML = html;
  if (S.arrive && !FREEZE) setTimeout(() => { const n = $(".notch"); n && n.classList.remove("arrive"); $(".eyes[data-x='glance']")?.setAttribute("data-x", ""); S.arrive = false; }, 1100);
  follow();
}

/* ---------- eyes: follow the pointer, blink, never in screenshots ---------- */
let px = innerWidth / 2, py = 200, raf = 0;
addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(() => { raf = 0; follow(); }); });
function follow(){
  if (FREEZE || S.rm) return;
  document.querySelectorAll(".eyes[data-follow]").forEach(el => {
    if (el.dataset.x === "sleepy" || el.dataset.x === "closed") return;
    const r = el.getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
    el.style.setProperty("--ex", (dx / d * 2.5 * k).toFixed(2) + "px"); el.style.setProperty("--ey", (dy / d * 1.5 * k).toFixed(2) + "px");
  });
  document.querySelectorAll(".look[data-follow]").forEach(g => {
    const r = g.closest("svg").getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
    g.setAttribute("transform", `translate(${(dx / d * 4 * k).toFixed(2)} ${(dy / d * 3 * k).toFixed(2)})`);
  });
}
function blinkLoop(){
  if (FREEZE) return;
  setTimeout(() => {
    if (!S.rm) {
      document.querySelectorAll(".eyes").forEach(e => { if (!e.dataset.x) { e.classList.add("blink"); setTimeout(() => e.classList.remove("blink"), 160); } });
      document.querySelectorAll(".blinker").forEach(b => { b.animate([{transform:"scaleY(1)"},{transform:"scaleY(.1)"},{transform:"scaleY(1)"}], {duration:150, easing:"ease-in-out"}); });
    }
    blinkLoop();
  }, 3800 + Math.random() * 3400);
}
document.head.insertAdjacentHTML("beforeend", "<style>.blinker{transform-box:fill-box;transform-origin:center}</style>");

/* ---------- sound (BRAND §11: needs you, done; same synthesis as the direction prototype) ---------- */
const SND = {on:true, armed:false, ac:null, master:null, last:{}};
addEventListener("pointerdown", () => (SND.armed = true), true);
addEventListener("keydown", () => (SND.armed = true), true);
function sndCtx(){
  if (!SND.ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; const ac = SND.ac = new C(); SND.master = ac.createGain(); SND.master.gain.value = 0.7; SND.master.connect(ac.destination); }
  if (SND.ac.state === "suspended") SND.ac.resume();
  return SND.ac;
}
function tone(t0, f, dur, o = {}){
  const ac = SND.ac, osc = ac.createOscillator(), g = ac.createGain(); osc.type = "sine"; osc.frequency.setValueAtTime(f, t0);
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(f * o.glide, t0 + dur * .8);
  g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(o.gain ?? .16, t0 + .008); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  osc.connect(g); g.connect(SND.master); osc.start(t0); osc.stop(t0 + dur + .03);
}
const SFX = {
  needs(t){ tone(t, 440, .17, {gain:.17}); tone(t + .11, 587.33, .21, {gain:.18}); },
  done(t){ tone(t, 739.99 * 1.012, .38, {gain:.19, glide:1 / 1.012}); tone(t, 1479.98, .16, {gain:.04}); }
};
function sfx(k, delay = 0){
  if (!SND.on || !SND.armed || FREEZE) return;
  const now = performance.now(); if (now - (SND.last[k] || 0) < 600) return; SND.last[k] = now;
  try { const ac = sndCtx(); if (ac) SFX[k](ac.currentTime + .02 + delay / 1000); } catch (e) { /* no audio: carry on */ }
}

/* ---------- hover peek: intent delay, leave grace, never opens by itself ---------- */
let hT = 0, lT = 0;
function setPeek(open){
  if (S.panel || S.scene !== "desk") open = false;
  S.peek = open;
  const p = $("#peek"), n = $(".notch");
  if (!p || !n) return;
  p.classList.toggle("open", open); p.setAttribute("aria-hidden", String(!open)); n.classList.toggle("peeking", open);
  if (open) p.innerHTML = peekHTML();
}
document.addEventListener("pointerover", e => {
  const inN = e.target.closest?.(".notch"), inP = e.target.closest?.("#peek.open");
  if (inN || inP) { clearTimeout(lT); if (!S.peek && inN) { clearTimeout(hT); hT = setTimeout(() => setPeek(true), 280); } }
});
document.addEventListener("pointerout", e => {
  const from = e.target.closest?.(".notch, #peek"), to = e.relatedTarget?.closest?.(".notch, #peek");
  if (from && !to) { clearTimeout(hT); clearTimeout(lT); lT = setTimeout(() => setPeek(false), 360); }
});
document.addEventListener("focusin", e => { if (e.target.closest?.(".notch") && !S.panel) setPeek(true); });

/* ---------- actions ---------- */
function act(a, el, ev){
  const d = el.dataset;
  switch (a) {
    case "jump": jumpOpen = !jumpOpen; break;
    case "notch": S.panel = !S.panel; S.peek = false; S.coach = false; S.sub = null; break;
    case "tab": S.tab = d.tab; S.sub = null; if (!S.panel) S.panel = true; if (d.scroll) setTimeout(() => document.getElementById(d.scroll)?.scrollIntoView({block:"start"}), 30); break;
    case "sub": S.sub = d.sub; break;
    case "back": S.sub = null; break;
    case "need": {
      const n = NEEDS[d.k];
      if (n.sub) { S.panel = true; S.peek = false; S.sub = n.sub; }
      else if (d.k === "unver") { say("Running the safety test"); }
      else { S.needs = S.needs.filter(k => k !== d.k); S.toast = `Opened ${d.k === "done" ? "api-docs" : "bench"} in Windows Terminal`; S.peek = false; setTimeout(() => { S.toast = null; render(); }, 4000); }
      break;
    }
    case "snooze": S.needs = S.needs.filter(k => k !== d.k); S.toast = "Back at 14:21"; setTimeout(() => { S.toast = null; render(); }, 4000); break;
    case "undo": S.toast = null; break;
    case "open": S.toast = `Opened ${d.v} in Windows Terminal`; S.sub = null; setTimeout(() => { S.toast = null; render(); }, 4000); break;
    case "where": S.where = d.v; break;
    case "sw": {
      const list = d.kind === "lib" ? LIB : MINE, r = list[+d.i];
      if (r.lock && S.locked && S.scene === "desk") { S.toast = "Locked rules change with admin. Windows will ask."; setTimeout(() => { S.toast = null; render(); }, 4000); }
      else r.on = !r.on;
      break;
    }
    case "draftform": ev.preventDefault(); S.draft = true; break;
    case "adddraft": S.draft = false; if (S.scene === "desk") { S.toast = "Rule added and locked"; setTimeout(() => { S.toast = null; render(); }, 4000); } break;
    case "nodraft": S.draft = false; break;
    case "relock": if (S.scene === "setup") { S.declined = false; S.uac = true; } else { S.locked = true; S.toast = "Locked with Windows admin"; setTimeout(() => { S.toast = null; render(); }, 4000); } break;
    case "lockchange": S.toast = "Changing the lock asks for admin. Windows will ask."; setTimeout(() => { S.toast = null; render(); }, 4000); break;
    case "level": S.level = +d.v; break;
    case "mode": S.mode = d.v; S.menu = false; break;
    case "theme": S.theme = d.v; break;
    case "rm": S.rm = !S.rm; break;
    case "toggle": el.setAttribute("aria-checked", el.getAttribute("aria-checked") !== "true"); SND.on = el.getAttribute("aria-checked") === "true"; return;
    case "coach": S.coach = false; break;
    case "traymenu": S.menu = !S.menu; break;
    case "m-panel": S.menu = false; S.panel = true; break;
    case "m-mode": S.mode = S.mode === "thin" ? "pill" : "thin"; S.menu = false; break;
    case "quit": S.menu = false; S.toast = "Protection stays on while Eucas is closed. The notch and the heartbeat stop."; setTimeout(() => { S.toast = null; render(); }, 5000); break;
    case "sim-arrive": S.needs = S.needs.includes("wait") ? S.needs : ["wait", ...S.needs]; S.arrive = true; S.panel = false; jumpOpen = false; render(); sfx("needs", 60); say(`${NEEDS.wait.t}. ${S.needs.length} need you.`); return;
    case "sim-work": S.working = !S.working; S.doze = false; break;
    case "sim-doze": S.doze = !S.doze; if (S.doze) S.working = false; break;
    /* setup */
    case "next": S.step = Math.min(STEPS, S.step + 1); S.draft = false; S.declined = false; if (S.step === 6) setTimeout(() => sfx("done"), 500); break;
    case "prev": S.step = Math.max(1, S.step - 1); break;
    case "skiplock": S.declined = true; S.locked = false; break;
    case "uac": S.uac = true; break;
    case "uacyes": S.uac = false; S.locked = true; S.step = 6; setTimeout(() => sfx("done"), 500); break;
    case "uacno": S.uac = false; S.declined = true; S.locked = false; break;
    case "suggest": S.euca.name = d.v; if (S.euca.hue === "none") S.euca.hue = "lavender"; bornBoop(); break;
    case "shape": S.euca.shape = d.v; if (S.euca.hue === "none") S.euca.hue = "lavender"; bornBoop(); break;
    case "hue": S.euca.hue = d.v; bornBoop(); break;
    case "fly": return fly();
    default: return;
  }
  render();
}
function bornBoop(){ setTimeout(() => { const h = $("#hero"); if (h) { h.classList.remove("boop"); void h.offsetWidth; h.classList.add("boop"); } $(".blinker")?.animate([{transform:"scaleY(1)"},{transform:"scaleY(.1)"},{transform:"scaleY(1)"}], {duration:180}); }, 0); }
function fly(){
  const h = $("#hero");
  if (!h || FREEZE || S.rm) { Object.assign(S, {scene:"desk", coach:true, born:true, working:false}); render(); return; }
  const r = h.getBoundingClientRect(), f = h.cloneNode(true);
  f.className = "flyer"; f.style.cssText += `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
  document.body.appendChild(f);
  $(".swin").style.transition = "opacity 300ms ease, transform 300ms ease"; $(".swin").style.opacity = "0"; $(".swin").style.transform = "scale(.98)";
  requestAnimationFrame(() => { const tx = innerWidth / 2 - (r.left + r.width / 2), ty = 16 - (r.top + r.height / 2); f.style.transform = `translate(${tx}px, ${ty}px) scale(.12)`; f.style.opacity = "0"; });
  setTimeout(() => { f.remove(); Object.assign(S, {scene:"desk", coach:true, born:true, working:false}); render(); sfx("done"); }, 820);
}
document.addEventListener("click", e => {
  const r = e.target.closest("[data-route]");
  if (r) { e.preventDefault(); jumpOpen = false; go(r.dataset.route, true); return; }
  const a = e.target.closest("[data-act]");
  if (a && a.tagName !== "FORM" && a.tagName !== "INPUT") { const wasTab = a.getAttribute("role") === "tab"; act(a.dataset.act, a, e); if (wasTab) setTimeout(() => $('[role="tab"][aria-selected="true"]')?.focus(), 0); return; }
  if (S.panel && !e.target.closest(".panel, .notch, .demo, .ctx")) { S.panel = false; render(); }
  else if (S.menu && !e.target.closest(".ctx, .tray-btn")) { S.menu = false; render(); }
  else if (jumpOpen && !e.target.closest(".demo")) { jumpOpen = false; render(); }
});
document.addEventListener("change", e => { const a = e.target.closest("[data-act='level']"); if (a) act("level", a, e); });
document.addEventListener("submit", e => { const f = e.target.closest("[data-act='draftform']"); if (f) act("draftform", f, e); });
document.addEventListener("input", e => {
  if (e.target.dataset.act !== "name") return;
  S.euca.name = e.target.value.trim();
  const hn = $(".stage .hn"); if (hn) { hn.textContent = S.euca.name || "No name yet"; hn.classList.toggle("ph", !S.euca.name); }
  const nx = $(".s-foot [data-act='next']"); if (nx) { const ok = S.euca.name && S.euca.hue !== "none"; nx.disabled = !ok; const hint = $(".s-foot .hint"); if (hint) hint.textContent = ok ? "" : (!S.euca.name ? "Give it a name to continue" : "Pick a shape or a colour to continue"); }
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (S.sub) S.sub = null; else if (S.panel) { S.panel = false; setTimeout(() => $(".notch")?.focus(), 0); } else if (S.peek) { setPeek(false); return; } else if (jumpOpen) jumpOpen = false; else return;
  render();
});
/* arrow keys move between tabs (WAI-ARIA tabs pattern) */
document.addEventListener("keydown", e => {
  const t = e.target.closest?.('[role="tab"]'); if (!t || !["ArrowLeft","ArrowRight"].includes(e.key)) return;
  const order = ["usage","rules","settings"], i = order.indexOf(S.tab);
  S.tab = order[(i + (e.key === "ArrowRight" ? 1 : 2)) % 3]; render(); $('[role="tab"][aria-selected="true"]')?.focus();
});

go(ROUTE[cur] ? cur : "n-working");
blinkLoop();
