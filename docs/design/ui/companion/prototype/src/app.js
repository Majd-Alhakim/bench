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
  note: ic('<rect x="3.5" y="2.5" width="9" height="11" rx="1.6"/><path d="M6 6h4M6 8.5h4M6 11h2"/>'),
  look: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="3.2" y="3.4" width="2.6" height="7.2" rx="1.3" transform="rotate(-12 4.5 7)"/><rect x="8.2" y="3.4" width="2.6" height="7.2" rx="1.3" transform="rotate(-12 9.5 7)"/></g></svg>',
  cloud: ic('<path d="M4.5 12h7a2.8 2.8 0 0 0 .4-5.6A4 4 0 0 0 4.2 7a2.5 2.5 0 0 0 .3 5z"/><path d="M3 3l10 10"/>'),
  key: ic('<circle cx="5.5" cy="10.5" r="2.5"/><path d="M7.3 8.7L13 3M11 5l1.5 1.5"/>'),
  clock: ic('<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>'),
  close: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1"/></svg>',
  min: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 5h8" stroke="currentColor" stroke-width="1"/></svg>',
  max: '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  quartet: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><circle cx="4.2" cy="4.2" r="3.3"/><path d="M12 .6l3.4 6.3H8.6z"/><rect x="1" y="9.1" width="6.2" height="6.2" rx="1.9"/><path d="M12 8.4c1.4 1.8 2.8 3.4 2.8 4.8a2.8 2.8 0 0 1-5.6 0c0-1.4 1.4-3 2.8-4.8z"/></svg>',
  win: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="8.4" y="1" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="1" y="8.4" width="6.6" height="6.6" fill="#4cc2ff"/><rect x="8.4" y="8.4" width="6.6" height="6.6" fill="#4cc2ff"/></svg>'
};

/* ---------- the content: one place for every string that repeats ---------- */
const COPY = {
  promise: "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that.",
  /* CR-012 / always-on, 2026-10-26: the approved privacy line, verbatim ($N = the Euca's name). The supervisor is always on. */
  privacy: "When $N isn't sure, it sends the waiting session's last message, trimmed and with code, paths and secrets removed, to the supervisor. Nothing else about your work leaves this PC. Your account holds only your email, your plan and how much supervisor help you've used.",
  /* Founder, 2026-10-26: sign-in is mandatory, so offline setup waits at sign-in (no "Sign in later"). */
  offline: "You need to be online to sign in. Setup carries on once you're connected.",
  /* Founder, 2026-10-26 (tech lead Q9): said in setup and on the download page. */
  alwaysOn: "The supervisor is always on and can't be switched off. Your rules always decide first.",
  diag: "No paths to your projects or files."
};
const EMAIL = "sam@example.com";
/* Needs-you items. dec = a decision only you can make: the only kind that gets the blue (R1, "blue means your call").
   rc = the Receipt under anything Pip did (time · supervisor tokens · rule or reason · Why?). quiet = never counted in the notch. */
const NEEDS = {
  wait:{sev:"attn", t:"bench is waiting for you", e:'Wants to run <span class="mono">pnpm build</span>', pe:'wants to run <span class="mono">pnpm build</span>', a:"Open session", time:"14:04", snooze:true},
  same:{sev:"attn", t:"Two sessions are editing one file", e:'bench and api-docs both changed <span class="mono">src/router.ts</span> since 14:02.', pe:'bench and api-docs · <span class="mono">src/router.ts</span>', a:"Show both", sub:"same", time:"14:06", snooze:true},
  done:{sev:"calm", t:"api-docs finished and is waiting", e:"Ran for 14 minutes and changed 3 files.", pe:"ran 14 min · changed 3 files", a:"Open session", time:"14:00", snooze:true},
  trip:{sev:"danger", t:"$N stopped the notes session", e:"It deleted 1,240 files in 20 seconds. $N stopped it at 14:02:31 and checked it isn't running.", pe:"deleted 1,240 files in 20 s", a:"See what happened", sub:"trip", time:"14:02", rc:["14:02:31","no supervisor","rule: stop a session that deletes 200+ files"]},
  off:{sev:"danger", t:"bench isn't protected", e:"$N hasn't seen a check from bench for 40 seconds while it ran tools.", pe:"no check for 40 s while it ran tools", a:"See why", sub:"fix", time:"14:05", rc:["14:05","no supervisor","heartbeat: no check for 40 s"]},
  merge:{sev:"calm", t:"search is ready", e:"It finished on its branch. Update it from your default branch, run the tests and open the PR?", pe:"finished on its branch", a:"Open a PR for search · tests first", pa:"Update, test, open PR", dec:true, time:"14:05", snooze:true, then:"mergedone"},
  mergedone:{sev:"ok", t:"search: PR #71 is open", e:"Updated from your default branch, 128 tests passed, PR #71 opened. Nothing was merged.", pe:"128 tests passed · PR #71 opened", a:"Open PR #71", a2:"Close the PR", time:"14:06", rc:["14:06","no supervisor","plain commands: git rebase · pnpm test · gh pr create"]},
  budget:{sev:"attn", t:"Budget reached for this session. Continue?", e:"$N stopped bench before its next step. The session used the 4% of your week you gave it.", pe:"$N stopped bench before its next step", a:"Continue · +2% of your week", pa:"Continue", dec:true, a2:"Open session", time:"14:06", rc:["14:06","no supervisor","your budget: 4% of your week"]},
  suggest:{sev:"calm", quiet:true, t:"You've allowed pnpm test in bench 3 times this week. Make it a rule?", e:'<span class="mono">allow pnpm test · in bench/</span> Other commands still ask. It never covers the four limits.', pe:"allowed 3 times this week", a:"Allow pnpm test in bench", dec:true, no:"Keep asking", time:"14:01", rc:["learned from 3 allows","13:12 · 13:40 · 14:01"]},
  login:{sev:"attn", t:"Your Claude login has expired", e:'Your sessions can\'t reach Claude until you sign in. $N keeps guarding. Run <span class="mono">claude /login</span> in a terminal; $N never handles your login.', pe:'sessions can\'t reach Claude · run <span class="mono">claude /login</span>', a:"Copy the command", time:"14:03"},
  unver:{sev:"attn", t:"Claude Code 2.1.315 isn't verified yet", e:"It updated at 13:58. The safety test reruns now; until it passes, $N says so.", pe:"updated 13:58 · the safety test is rerunning", a:"Run the test", time:"13:58"}
};
/* The four limits are always on (founder, 26 Oct). Per limit you choose locked with admin or not; there is no off switch. */
const LIMITS = [
  {t:"Never auto-approve a delete", d:"rm, del, Remove-Item, git clean", lock:true},
  {t:"Never auto-approve a push to your default branch", d:"git push to the branch your repo builds from", lock:true},
  {t:"Never auto-approve a send", d:"mail, messages, posts", lock:true},
  {t:"Never auto-approve a payment", d:"payment and checkout tools", lock:true}
];
const LIB = [
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
  panel:false, tab:"usage", sub:null, meter:"trial", locked:true, draft:false, coach:false,
  signedIn:true, noacct:false, taste:10, auth:"email", authEmail:EMAIL, resent:false, sample:false,
  menu:false, fullscreen:false, wtoast:null, toast:null, uac:false, declined:false, testFail:false, sheet:null,
  where:"today", sessions:3, learned:false, month:false, away:false, caught:false, banner:null, writeFail:false, pleased:false, knowsEmpty:false, scroll:null
});
let S = BASE();

/* ---------- routes: every state is reachable from the jump menu ---------- */
const BLANK = {name:"", shape:"sphere", hue:"none"};
const ROUTES = [
  ["Setup", [
    ["s-sac","1 · Smart App Control is on", {scene:"setup", step:1, sac:true}],
    ["s-welcome","1 · Find your sessions", {scene:"setup", step:1}],
    ["s-create","2 · Make your Euca (before)", {scene:"setup", step:2, euca:{...BLANK}}],
    ["s-create-born","2 · Make your Euca (born)", {scene:"setup", step:2}],
    ["s-retro","3 · Your week", {scene:"setup", step:3}],
    ["s-lock","4 · Lock the four limits", {scene:"setup", step:4}],
    ["s-uac","4 · The one admin prompt", {scene:"setup", step:4, uac:true}],
    ["s-declined","4 · Admin declined: not locked", {scene:"setup", step:4, declined:true, locked:false}],
    ["s-test","5 · Watch it block a test", {scene:"setup", step:5}],
    ["s-test-fail","5 · The test wasn't blocked", {scene:"setup", step:5, testFail:true}],
    ["s-signin","6 · Sign in: your email", {scene:"setup", step:6}],
    ["s-signin-code","6 · Sign in: the 6-digit code", {scene:"setup", step:6, auth:"code"}],
    ["s-signin-wrong","6 · Sign in: wrong code", {scene:"setup", step:6, auth:"wrong"}],
    ["s-signin-disposable","6 · Sign in: an address that expires", {scene:"setup", step:6, auth:"disposable"}],
    ["s-signin-offline","6 · Sign in: offline, setup waits", {scene:"setup", step:6, auth:"offline"}],
    ["s-signin-done","6 · Signed in: a new account", {scene:"setup", step:6, auth:"done"}],
    ["s-signin-back","6 · Signed in: an existing account keeps its plan", {scene:"setup", step:6, auth:"back", meter:"founders"}],
    ["s-rules","7 · Choose your rules", {scene:"setup", step:7}],
    ["s-rules-draft","7 · A described rule, drafted", {scene:"setup", step:7, draft:true}],
    ["s-rules-noacct","7 · Choose your rules (no account: one of your own)", {scene:"setup", step:7, noacct:true, signedIn:false}],
    ["s-sent","8 · What is sent (your last session, redacted)", {scene:"setup", step:8}],
    ["s-sent-sample","8 · What is sent: a labelled sample", {scene:"setup", step:8, sample:true}],
    ["s-sent-noacct","8 · What is sent (no account)", {scene:"setup", step:8, noacct:true, signedIn:false}],
    ["s-done","9 · Pip is watching", {scene:"setup", step:9}],
    ["s-noacct-done","9 · Pip is watching (no account)", {scene:"setup", step:9, noacct:true, signedIn:false}],
    ["s-noacct-declined","9 · Pip is watching (no account, not locked)", {scene:"setup", step:9, noacct:true, signedIn:false, locked:false}],
    ["s-coach","After setup: the notch, once", {coach:true, born:true, working:false}]
  ]],
  ["The notch", [
    ["n-rest","Resting: protected, nothing running", {working:false}],
    ["n-working","Working: sessions are running", {}],
    ["n-arrive","Something needs you: it arrives", {needs:["wait","same"], arrive:true}],
    ["n-marker","The marker stays", {needs:["wait","same"]}],
    ["n-peek","Hover: the peek", {needs:["wait","same"], peek:true}],
    ["n-peek-merge","Hover: a guided merge offer", {needs:["merge"], peek:true, working:false}],
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
    ["n-away-peek","Back from away: the digest in the peek", {needs:["merge"], away:true, peek:true, working:false}],
    ["n-pleased","All caught up: the eyes are pleased", {pleased:true, working:false}],
    ["sheet-notch","Sheet: every notch state", {sheet:"notch"}],
    ["sheet-eyes","Sheet: the eye grammar", {sheet:"eyes"}]
  ]],
  ["The panel", [
    ["p-needs","Needs you + Usage", {panel:true, needs:["wait","same","merge"]}],
    ["p-merge-done","Needs you › guided merge done", {panel:true, needs:["mergedone","wait"]}],
    ["p-budget","Needs you › budget reached (Pro)", {panel:true, needs:["budget"], meter:"pro"}],
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
  ["Learns you, undo, receipts", [
    ["p-suggest","A rule suggestion from what you allow", {panel:true, needs:["suggest"], learned:false}],
    ["p-learned","Pip learned something (Undo)", {panel:true, learned:true, month:true, meter:"pro"}],
    ["p-knows","Settings › What Pip knows", {panel:true, tab:"settings", sub:"knows", month:true, meter:"pro"}],
    ["p-knows-empty","What Pip knows: the honest zero", {panel:true, tab:"settings", sub:"knows", knowsEmpty:true}],
    ["p-why","Why? (what Pip saw and why it chose that)", {panel:true, sub:"why", meter:"pro"}],
    ["p-undo","Undo after Not now", {panel:true, needs:["same"], toast:{t:"bench's prompt is back at 14:21", undo:true}}],
    ["p-away","While you were away (digest)", {panel:true, away:true, needs:["merge"], working:false, meter:"pro"}],
    ["p-caught","All caught up", {panel:true, caught:true, pleased:true, working:false}]
  ]],
  ["Worst moments", [
    ["w-offline","Offline", {panel:true, banner:"offline", meter:"taste"}],
    ["w-login","Your Claude login expired", {panel:true, needs:["login"], working:false}],
    ["w-week","Weekly limit reached", {panel:true, banner:"week", working:false}],
    ["w-claude","Claude isn't answering", {panel:true, banner:"claude"}],
    ["w-write","A write failed (Rules)", {panel:true, tab:"rules", draft:true, writeFail:true}],
    ["w-back","Back to normal (after offline)", {panel:true, banner:"back"}]
  ]],
  ["Supervisor meter and plans", [
    ["m-trial","Trial: 12 days left", {panel:true, meter:"trial"}],
    ["m-trial-end","Trial ended: the monthly taste starts", {panel:true, meter:"trialend"}],
    ["m-taste","Free: the monthly taste", {panel:true, meter:"taste"}],
    ["m-low","Free: running low", {panel:true, meter:"low"}],
    ["m-empty","Free: empty until 1 Dec", {panel:true, meter:"empty"}],
    ["m-pro","Pro", {panel:true, meter:"pro"}],
    ["m-plan-trial","Settings › Account in the trial", {panel:true, tab:"settings", meter:"trial", scroll:"account"}],
    ["m-plan-taste","Settings › Account on the taste", {panel:true, tab:"settings", meter:"taste", scroll:"account"}],
    ["sheet-meter","Sheet: every meter state", {sheet:"meter"}]
  ]],
  /* CR-012 / always-on, 2026-10-26 */
  ["Account and what is sent", [
    ["p-sent","Settings › What is sent", {panel:true, tab:"settings", sub:"sent"}],
    ["p-sent-sample","What is sent: a labelled sample (no sessions yet)", {panel:true, tab:"settings", sub:"sent", sample:true}],
    ["p-sent-link","Usage: What is sent, under the meter", {panel:true, scroll:"sup"}],
    ["p-account","Settings › Account (Free trial)", {panel:true, tab:"settings", meter:"trial", scroll:"account"}],
    ["p-account-founders","Settings › Account (Founders' $15 for life)", {panel:true, tab:"settings", meter:"founders", scroll:"account"}],
    ["p-signout","Account › Sign out", {panel:true, tab:"settings", sub:"signout"}],
    ["p-delete","Account › Delete account", {panel:true, tab:"settings", sub:"delete"}],
    ["p-deleted","Account deleted: back to no account", {panel:true, signedIn:false, noacct:true, taste:0, toast:{t:"Account deleted. Your rules and history stay on this PC.", undo:false}}],
    ["p-signedout","Signed out: back to no account", {panel:true, signedIn:false, noacct:true, taste:0, toast:{t:"Signed out. Pip keeps guarding.", undo:false}}],
    ["p-signin","Signed out: sign in (panel)", {panel:true, signedIn:false}],
    ["p-signin-code","Sign in: the code (panel)", {panel:true, signedIn:false, auth:"code"}],
    ["p-switch","Sign in with a different account: the warning", {panel:true, signedIn:false, auth:"switch", authEmail:"kim@studio.dev"}]
  ]],
  ["Fallback", [
    ["t-menu","Tray icon menu (fallback)", {menu:true}],
    ["p-noacct","No account: Needs you + Usage", {noacct:true, signedIn:false, panel:true, taste:7, needs:["wait"], tab:"usage", scroll:"#sup"}],
    ["p-noacct-rules","No account: Rules, one rule of your own", {noacct:true, signedIn:false, panel:true, taste:7, tab:"rules", scroll:"#mine"}],
    ["p-noacct-settings","No account: Settings", {noacct:true, signedIn:false, panel:true, taste:7, tab:"settings", scroll:"#account"}],
    ["p-noacct-empty","No account: the supervisor taste is used up", {noacct:true, signedIn:false, panel:true, taste:0, needs:["wait"], tab:"usage", scroll:"#sup"}],
    ["t-noacct","No account: the tray menu", {noacct:true, signedIn:false, needs:[], menu:true}],
    ["t-noacct-off","No account: the tray menu, not protected", {noacct:true, signedIn:false, needs:[], guard:"off", menu:true}]
  ]]
];
const ROUTE = Object.fromEntries(ROUTES.flatMap(([, list]) => list.map(([id, label, s]) => [id, {label, s}])));
let cur = Q.get("r") || "n-working";
function go(id, keep){
  const r = ROUTE[id]; if (!r) return;
  cur = id;
  const keepTheme = S.theme, keepRm = S.rm, keepMode = keep ? S.mode : null;
  S = Object.assign(BASE(), structuredClone(r.s));
  S.theme = keepTheme; S.rm = keepRm; UNDO = S.toast && S.toast.undo ? () => {} : null;
  if (keepMode && !("mode" in r.s)) S.mode = keepMode;
  const u = new URL(location.href); u.searchParams.set("r", id); history.replaceState(null, "", u);
  render();
  if (S.arrive) sfx("needs", 120);
  if (r.s.needs && (r.s.needs.includes("trip") || r.s.needs.includes("budget"))) sfx("stopped", 120);
  if (r.s.scroll) requestAnimationFrame(() => document.getElementById(r.s.scroll)?.scrollIntoView({block:"start"}));
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
const loud = (needs = S.needs) => needs.filter(k => !NEEDS[k].quiet);
/* Undo everywhere (C-18): every reversible change gets a 10 s Undo; what can't be undone says so. */
let UNDO = null, toastT = 0;
function showToast(t, undoFn, ms = 10000){
  UNDO = undoFn || null; S.toast = {t, undo:!!undoFn};
  clearTimeout(toastT); toastT = setTimeout(() => { S.toast = null; UNDO = null; render(); }, FREEZE ? 1e9 : ms);
}
function snap(){ const keep = {needs:[...S.needs], learned:S.learned, locked:S.locked, mine:MINE.map(r => ({...r}))}; return () => { S.needs = keep.needs; S.learned = keep.learned; S.locked = keep.locked; MINE.length = 0; keep.mine.forEach(r => MINE.push(r)); }; }
/* The Receipt: one format everywhere. */
function rcpt(parts, why = "why"){ return `<div class="rcpt num">${parts.map(esc).join(" · ")} · <button class="why" data-act="sub" data-sub="${why}">${I.look}Why?</button></div>`; }
const applied = (t, from) => `<span class="applied">${I.note}Applied: ${t} <span>· ${from}</span></span>`;
function statusLine(){
  if (S.guard === "off") return {off:true, t:"Not protected · bench: no check for 40 s"};
  if (S.banner === "offline") return {t:"Protected · offline · checked 2 s ago"};
  if (S.banner === "week") return {t:"Protected · week used up until Mon 09:00"};
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
  const badge = loud().length ? `<span class="tb-badge num">${loud().length}</span>` : "";
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
  const count = loud(s.needs).length;
  const markerKind = s.guard === "off" ? null : danger === "trip" ? "danger" : count ? "attn" : null;
  const working = s.working && s.guard !== "off" && !s.doze && !danger ? 1 : 0;
  /* Eye grammar (moments-and-motion §3, for the notch): calm · focused while sessions work · glance, then toward you, when
     something needs you · concerned for a stop or not protected · sleepy when dozing · pleased for 1.6 s when you're caught up. */
  const expr = s.guard === "off" || danger === "trip" ? "concerned" : s.doze ? "sleepy" : s.unborn ? "closed" : s.arrive ? "glance" : s.pleased ? "pleased" : count ? "front" : working ? "focused" : "";
  const marker = markerKind === "danger" ? `<span class="marker danger">${I.stop} Stopped: notes</span>` : `<span class="marker attn num">${count}</span>`;
  const label = s.guard === "off"
    ? `${N()}: not protected. ${s.needs.length} need you. Open the panel.`
    : `${N()}: protected${working ? ", sessions working" : ""}${count ? `, ${count} need you` : ""}. Open the panel.`;
  return `<button class="notch${s.arrive ? " arrive" : ""}${s.born ? " born" : ""}${s.peek ? " peeking" : ""}" data-act="notch" aria-label="${esc(label)}" aria-expanded="${s.panel ? "true" : "false"}"
    data-guard="${s.guard}" data-working="${working}" data-mode="${s.mode}" data-doze="${s.doze ? 1 : 0}"${markerKind ? ` data-marker="${markerKind}"` : ""}>
    <span class="label">Not protected</span><span class="m-spacer"></span>
    <span class="eyes" data-x="${expr}"${o.static || !["", "front"].includes(expr) ? "" : " data-follow"}><i class="eye"></i><i class="eye"></i></span>
    ${marker}<span class="beam"><i></i></span><span class="glow"></span><span class="thin-dot${markerKind === "danger" ? " danger" : ""}"></span>
  </button>`;
}
function peekHTML(){
  const st = statusLine();
  const foot = `<div class="p-foot"><span>${st.off ? '<span class="offdot"></span>' : '<span class="okdot"></span>'}${esc(st.t.split(" · ").slice(0, st.off ? 1 : 2).join(" · "))}</span><button data-act="notch">Open panel ›</button></div>`;
  const away = S.away ? `<div class="p-away"><b>While you were away · 1 h 12 min</b><span>6 answered from your rules · 1 blocked · 1 waiting</span></div>` : "";
  const list = loud();
  if (!list.length) return `${away}<div class="p-status"><span><span class="okdot"></span>${esc(st.t)}</span><span class="s2 num">${S.banner === "offline" ? "Offline: the guard keeps working on this PC" : "5-hour 46% · week 62% · supervisor 78% left"}</span></div>`;
  const items = away + list.slice(0, 3).map((k, i) => {
    const n = NEEDS[k];
    return `<div class="p-item"><span class="sev ${n.sev}">${n.sev === "danger" ? (k === "trip" ? I.stop : I.alert) : n.sev === "ok" ? I.check : n.sev === "calm" ? I.done : I.alert}</span>
      <span style="min-width:0"><div class="t">${esc(nm(n.t))}</div><div class="e">${nm(n.pe)}</div></span>
      <button class="pbtn${i === 0 && n.sev === "danger" ? " pri" : ""}" data-act="need" data-k="${k}">${n.pa || n.a}</button></div>`;
  }).join("");
  return items + foot;
}

/* ---------- the panel ---------- */
function needItem(k, pri){
  const n = NEEDS[k];
  const g = n.sev === "danger" ? (k === "trip" ? I.stop : I.alert) : n.sev === "ok" ? I.check : n.sev === "calm" ? I.done : I.alert;
  return `<div class="need ${n.sev}"><span class="sev-p ${n.sev}">${g}</span><div>
    <div class="t"><span>${esc(nm(n.t))}</span><span class="time">${n.time}</span></div>
    <div class="e">${nm(n.e)}</div>
    ${n.rc ? rcpt(n.rc, k === "suggest" ? "knows" : "why") : ""}
    <div class="acts"><button class="btn${pri ? " pri" : ""}" data-act="need" data-k="${k}">${n.a}</button>${n.a2 ? `<button class="btn" data-act="${k === "mergedone" ? "closepr" : "open"}" data-v="bench">${n.a2}</button>` : ""}${n.no ? `<button class="btn ghost" data-act="keepasking" data-k="${k}">${n.no}</button>` : ""}${n.snooze ? `<button class="btn ghost" data-act="snooze" data-k="${k}">Not now</button>` : ""}</div></div></div>`;
}
function panelHTML(){
  const st = statusLine();
  const lock = S.locked ? `<button class="chip" data-act="tab" data-tab="rules" title="Your rules are locked with Windows admin">${I.lock}Locked</button>`
                        : `<button class="chip attn" data-act="tab" data-tab="rules">${I.unlock}Not locked</button>`;
  const head = `<div class="ph"><span class="av">${avatarSVG(S.euca, {soft:true, follow:true, expr:S.guard === "off" ? "concerned" : undefined})}</span>
    <div class="who"><div class="nmrow"><span class="nm">${esc(N())}</span>${lock}</div><div class="st${st.off ? " off" : ""}">${st.off ? '<span class="offd"></span>' : '<span class="okd"></span>'}${esc(st.t)}</div></div></div>`;
  if (!S.signedIn && !S.noacct) return signedOutPanel();
  if (S.sub) return `<div class="panel" role="dialog" aria-label="${esc(N())}">${subHTML()}${S.toast ? toastHTML() : ""}</div>`;
  const danger = hasDanger();
  const order = [...loud(), ...S.needs.filter(k => NEEDS[k].quiet)];
  const blue = order.find(k => NEEDS[k].dec);
  const needs = order.length
    ? `<div class="sec-t"><span>${loud().length ? `Needs you · ${loud().length}` : "A suggestion"}</span></div>${order.slice(0, 3).map(k => needItem(k, k === blue)).join("")}${order.length > 3 ? `<button class="more">Show ${order.length - 3} more</button>` : ""}`
    : S.caught ? `<div class="caught"><span class="cg-eyes" aria-hidden="true"><span class="eyes" data-x="pleased"><i class="eye"></i><i class="eye"></i></span></span><div><b>You're all caught up.</b><span>${esc(N())} is watching ${S.sessions} sessions.</span></div></div>`
    : `<p class="quiet">Nothing needs you.</p>`;
  const extra = bannerHTML() + (S.away ? digestHTML() : "") + (S.learned ? learnedHTML() : "");
  const tabs = [["usage","Usage"],["rules","Rules"],["settings","Settings"]];
  return `<div class="panel" role="dialog" aria-label="${esc(N())}">${head}<div class="p-body">${extra}${needs}
    <div class="tabs" role="tablist" aria-label="Panel sections">${tabs.map(([id, l]) => `<button role="tab" aria-selected="${S.tab === id}" data-act="tab" data-tab="${id}">${l}</button>`).join("")}</div>
    <div role="tabpanel">${S.tab === "usage" ? usageHTML(danger || S.needs.length) : S.tab === "rules" ? rulesHTML() : settingsHTML()}</div>
  </div>${S.toast ? toastHTML() : ""}</div>`;
}
function toastHTML(){
  const T = typeof S.toast === "string" ? {t:S.toast, undo:false} : S.toast;
  return `<div class="toast" role="status">${esc(T.t)}${T.undo ? `<button data-act="undo">Undo</button><i class="tt" aria-hidden="true"></i>` : ""}</div>`;
}
function bannerHTML(){
  const B = {
    offline:[I.cloud, "You're offline.", `The guard keeps working: it runs on this PC. The supervisor can't be reached, so ${N()} asks you instead. Usage catches up when you're back.`],
    week:[I.clock, "Your week is used up.", `Claude Code pauses new requests until Mon 26 Oct at 09:00. Your sessions keep their work, and ${N()} keeps guarding.`],
    claude:[I.clock, "Claude isn't answering right now.", `Your sessions wait and retry on their own. ${N()} keeps guarding and tells you when they're moving again.`],
    back:null
  }[S.banner];
  if (S.banner === "back") return `<div class="digest"><div class="dt"><b>Back online</b><span>18 min offline, 13:40–13:58</span></div><ul>
    <li>The guard kept checking the whole time: it runs on this PC. 212 checks, 1 block.</li>
    <li>The supervisor couldn't be reached, so ${esc(N())} asked you 2 times instead.</li>
    <li>Usage caught up: 5-hour 51%, week 63%. Nothing was lost.</li></ul>
    <div class="dg-f"><button class="btn" data-act="gotit">Got it</button></div></div>`;
  return B ? `<div class="banner" role="status">${B[0]}<div><b>${B[1]}</b> ${esc(B[2])}</div></div>` : "";
}
function digestHTML(){
  return `<div class="digest"><div class="dt"><b>While you were away</b><span>1 h 12 min · 12:54–14:06</span></div><ul>
    <li>Answered your agents 6 times from your rules and what you taught it. ${applied("how you answer secrets questions", "24 Oct")}</li>
    <li>Blocked <span class="mono">git push --force</span> in site at 13:10.</li>
    <li>search finished on its branch. It's waiting for you below.</li></ul>
    <div class="dg-f">${rcpt(["3.1k tokens (supervisor)", "6 answers"])}<button class="btn" data-act="gotit">Got it</button></div></div>`;
}
function learnedHTML(){
  return `<div class="learned">${I.note}<div><b>${esc(N())} learned:</b> you answer “use .env.example” to secrets questions.<div class="src">From 2 of your answers, 24 Oct and today · <button class="link" data-act="sub" data-sub="knows">See it</button></div></div><button class="link" data-act="forget">Undo</button></div>`;
}

function supervisorHTML(){
  /* CR-012 / always-on: the supervisor has no off switch. Signed out or with no account, the meter shows the install's taste (founder, 2026-10-26). */
  const sentLink = `<div class="m-meta"><button class="link" data-act="sub" data-sub="sent">What is sent</button></div>`;
  const MS = {
    trial:{chip:'<span class="chip">Trial · 12 days left</span>', v:"78%", w:78, l:"Trial ends 9 Nov", line:"Answered your agents 41 times so far, so they didn't wait for you. It never approves a tool call."},
    trialend:{chip:'<span class="chip">Free</span>', v:"100%", w:100, l:"Resets 1 Dec", line:`Your trial ended on 9 Nov. From now on ${N()} gets a small amount of supervisor help each month.`},
    taste:{chip:'<span class="chip">Free</span>', v:"55%", w:55, l:"Resets 1 Dec", line:"Answered your agents 34 times this month, so they didn't wait for you. It never approves a tool call."},
    low:{chip:'<span class="chip">Free</span>', v:"9%", w:9, l:"Resets 1 Dec", line:`Running low. When it's empty, ${N()} asks you instead until 1 Dec.`},
    empty:{chip:'<span class="chip">Free</span>', v:"0%", w:0, l:"Resets 1 Dec", line:`<b>${esc(N())} will check with you more often until 1 Dec.</b> Your rules and protection don't change.`, pro:true},
    pro:{chip:'<span class="chip">Pro</span>', v:"64%", w:64, l:"Resets 26 Nov", line:"Answered your agents 212 times this month, so they didn't wait for you. It never approves a tool call."}
  };
  MS.founders = MS.pro;
  /* Founder, 2026-10-26: no account = 10 supervisor answers per install, shown as a count on a meter, never as money */
  MS.noacct = {chip:'<span class="chip">No account</span>', v:`${S.taste} of 10`, w:S.taste * 10, l:"For this install", line:S.taste > 0 ? `When ${N()} isn't sure, the supervisor answers your agents so they don't wait for you. After that, ${N()} asks you.` : `<b>${esc(N())} asks you now.</b> Sign up for 14 more days of the supervisor. <button class="link" data-act="signup">Create an account</button>`};
  const M = S.noacct ? MS.noacct : MS[S.meter];
  return `<div class="sec-t" id="sup"><span>Supervisor</span>${M.chip}</div>
  <div class="group"><div class="meter"><div class="m-top"><span class="ml">${S.noacct ? "Answers left" : "Help left this month"}</span><span class="mr">${M.l}</span><span class="mv">${M.v}</span></div>
    <div class="bar sup" role="meter" aria-label="Supervisor help left" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${M.w}"><i style="width:${M.w}%"></i></div>
    <div class="m-line">${M.line}</div>
    ${M.pro ? `<div class="pro-line">Pro keeps it going all month: $20/month, $15 for the first 200. <button class="link" data-act="tab" data-tab="settings" data-scroll="account">See Pro</button></div>` : ""}
    ${sentLink}
  </div></div>`;
}
function usageHTML(){
  const W = S.where === "today" ? [["bench",58],["api-docs",30],["notes",12]] : [["bench",51],["api-docs",22],["notes",14],["site",9],["infra",4]];
  const month = S.month && !S.noacct ? `<div class="month">${esc(N())} asked you <b>40% less</b> this month than in September. <button class="link" data-act="sub" data-sub="knows">See why</button></div>` : "";
  const wk = S.banner === "week";
  return `${month}<div class="sec-t"><span>Your Claude usage</span><span class="meta">updated 20 s ago</span></div>
  <div class="group">
    <div class="meter"><div class="m-top"><span class="ml">5-hour</span><span class="mr">resets 15:40</span><span class="mv">46%</span></div>
      <div class="bar" role="meter" aria-label="5-hour limit used" aria-valuenow="46" aria-valuemin="0" aria-valuemax="100"><i style="width:46%"></i><b style="left:85%" title="Your warning line: 85%"></b></div>
      <div class="m-line">At this pace you reach it around <b>15:10</b>, 30 minutes before it resets.</div></div>
    <div class="meter"><div class="m-top"><span class="ml">Week</span><span class="mr">resets Mon 09:00</span><span class="mv">${wk ? "100%" : "62%"}</span></div>
      <div class="bar${wk ? " close" : ""}" role="meter" aria-label="Weekly limit used" aria-valuenow="${wk ? 100 : 62}" aria-valuemin="0" aria-valuemax="100"><i style="width:${wk ? 100 : 62}%"></i><b style="left:85%"></b></div>
      <div class="m-line">${wk ? "Used up. Claude Code starts again <b>Mon 26 Oct at 09:00</b>." : "On pace for about <b>81%</b> by Monday."}</div></div>
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
function limitRow(r){
  const locked = r.lock && S.locked;
  return `<div class="row"><span class="rl"><div class="rt">${r.t}</div><div class="rd">${r.d}</div></span>
    ${locked ? `<span class="chip">${I.lock}Locked</span>` : `<button class="chip attn" data-act="relock" title="Lock it with Windows admin">${I.unlock}Not locked</button>`}</div>`;
}
function draftHTML(){
  return `<div class="draft" aria-live="polite"><div class="q">You wrote: “don't let agents touch the migrations in api-docs”</div>
    <div class="rule"><span class="k">block</span> Edit, Write · <span class="k">in</span> api-docs/migrations/ <span class="k">and everything in it</span></div>
    <div class="fx">Last week it would have blocked 3 calls, all from api-docs. It can't loosen a limit or a locked rule.</div>
    <div class="q" style="margin:-4px 0 10px">Drafted with supervisor help · counts on the meter</div>
    ${S.writeFail ? `<div class="werr" role="alert">${I.alert}<span><b>Didn't save:</b> ${esc(N())} couldn't write your Claude Code settings (another app has the file open). Your rule is still here.</span></div>` : ""}
    <div class="acts"><button class="btn pri" data-act="adddraft">${S.writeFail ? "Try again" : "Add rule · blocks about 3 a week"}</button><button class="btn ghost" data-act="nodraft">Reword</button>
    ${S.scene === "setup" ? "" : `<label><span class="cb-box on">${I.check}</span>Lock it too</label>`}</div></div>`; /* setup keeps one admin prompt (founder, 2026-10-26) */
}
/* No account: no memory, so no rules learned from approvals; the one rule of your own is one you described */
const MINE_NOACCT = [{t:'Block edits in <span class="mono">api-docs/migrations/</span>', d:"Your own · drafted from your words", on:true}];
function rulesHTML(){
  const lockrow = S.locked
    ? `<div class="lockrow">${I.lock}<span class="grow">4 limits and 5 rules locked with Windows admin</span><button class="link" data-act="lockchange">Change</button></div>`
    : `<div class="lockrow attn">${I.unlock}<span class="grow">Not locked: an agent could change these. ${esc(N())} watches for that.</span><button class="btn" data-act="relock">Lock</button></div>`;
  return `<div class="promise">${COPY.promise}</div>${lockrow}
  <div class="sec-t"><span>Limits</span><span class="meta">always on</span></div>
  <div class="group">${LIMITS.map(limitRow).join("")}</div>
  <div class="sec-t"><span>Safety rules</span><span class="meta">tested</span></div>
  <div class="group">${LIB.map((r, i) => ruleRow(r, i, "lib")).join("")}</div>
  <div class="sec-t" id="mine"><span>Your rules</span></div>
  <div class="group">${(S.noacct ? MINE_NOACCT : MINE).map((r, i) => ruleRow(r, i, "mine")).join("")}</div>
  ${S.noacct ? `<p class="quiet">One rule of your own without an account. <button class="link" data-act="signup">Create an account for more rules</button></p>` : `<form class="compose" data-act="draftform"><input aria-label="Describe a rule" placeholder="Describe a rule in your own words" value="${S.draft ? "don't let agents touch the migrations in api-docs" : ""}"><button class="btn" type="submit">Draft it</button></form>
  ${S.draft ? draftHTML() : ""}`}`;
}
function planHTML(){
  if (S.meter === "pro") return `<div class="plan"><div class="pt"><span>Pro</span><span class="num">$20/month</span></div><div class="pd">Renews 26 Nov. Supervisor help all month, every session's details, history and export.</div><button class="btn">Manage</button></div>`;
  if (S.meter === "founders") return `<div class="plan"><div class="pt"><span>Pro · Founders' price</span><span class="num">$15/month for life</span></div><div class="pd">Renews 26 Nov. The price stays yours for as long as you keep Pro.</div><button class="btn">Manage</button></div>`;
  const trial = S.meter === "trial";
  return `<div class="plan"><div class="pt"><span>${trial ? "Free trial" : "Free"}</span><span class="${trial ? "" : "num"}">${trial ? "12 days left" : "monthly taste"}</span></div>
    <div class="pd">${trial ? "The full supervisor until 9 Nov. Then a small amount each month, free." : "A small amount of supervisor help each month. Protection, rules and usage are free for every session."}</div>
    <button class="btn">Get Pro · $20/month</button><div class="pd" style="margin:8px 0 0">The first 200 people keep $15/month for life.</div></div>`;
}
/* ---------- CR-012 / always-on, 2026-10-26: account, sign-in, what is sent ---------- */
function accountHTML(){
  if (S.noacct) return `<div class="sec-t" id="account"><span>Account</span></div>
  <div class="group"><div class="row"><span class="rl"><div class="rt">No account</div><div class="rd">10 supervisor answers, one rule of your own, no memory. Eucas keeps only a random ID for this install.</div></span><button class="btn pri" data-act="signup">Create an account</button></div></div>`;
  return `<div class="sec-t" id="account"><span>Account</span></div>
  <div class="group"><div class="row"><span class="rl"><div class="rt">${esc(EMAIL)}</div><div class="rd">Holds only your email, your plan and how much supervisor help you've used</div></span><button class="btn" data-act="sub" data-sub="signout">Sign out</button></div>${planHTML()}</div>
  <p class="quiet"><button class="link" data-act="sub" data-sub="delete">Delete account</button></p>`;
}
/* One redacted example, the same in setup and Settings: the payload exactly as it leaves the PC. */
function sentHTML(sample){
  const r = t => `<span class="redact">${t}</span>`;
  const head = sample
    ? `<span>Not from your work: you have no sessions yet</span><span class="chip">Sample</span>`
    : `<span>From your last session · bench · today, 13:52</span><span class="chip">Yours, redacted</span>`;
  const body = sample
    ? `The tests fail in ${r("path removed")} because the key isn't set. Should I read ${r("path removed")}, or paste ${r("secret removed")} from the README for now? Here's the change I'd make: ${r("8 lines of code removed")} Which do you…`
    : `I need the API key to run the payment test. Should I read ${r("path removed")} to get it, or hard-code ${r("secret removed")} in ${r("path removed")} for now? I changed the client too: ${r("6 lines of code removed")} Which do you…`;
  const meta = sample ? "Removed 8 lines of code, 2 paths, 1 secret · trimmed to 240 characters" : "Removed 6 lines of code, 2 paths, 1 secret · trimmed from 1,830 to 240 characters";
  return `<figure class="sent"><figcaption class="sh">${head}</figcaption><blockquote class="sb">${body}</blockquote>
    <div class="sm"><span class="num">${meta}</span><br>Goes to the supervisor: an open model hosted with zero data retention.</div></figure>`;
}
/* The code field: one input in the build (inputmode numeric, autocomplete one-time-code, paste fills all six), drawn as six cells. */
function codeCells(v, o = {}){
  return `<div class="code${o.bad ? " bad" : ""}" role="group" aria-label="6-digit code" data-act="fillcode" title="Prototype: click to enter the code">${Array.from({length:6}, (_, i) => `<i class="${i === v.length && !o.bad ? "cur" : ""}">${v[i] || ""}</i>`).join("")}</div>`;
}
const ACCOUNT_LINE = "Your account holds only your email, your plan and how much supervisor help you've used.";
function authPanelHTML(){
  if (S.auth === "code") return `<p class="lead">Eucas sent a 6-digit code to <b class="em">${esc(S.authEmail)}</b>.</p>${codeCells("48")}
    <p class="resend">Didn't get it? Check your spam folder, or <button class="link" data-act="auth" data-v="code">send a new one</button>.</p>`;
  const sw = S.auth === "switch";
  return `<p class="lead">No password: Eucas emails you a 6-digit code. ${ACCOUNT_LINE}</p>
    <div class="field-l">Email</div><input class="field" type="email" autocomplete="email" aria-label="Email" placeholder="you@example.com" value="${sw ? esc(S.authEmail) : ""}">
    ${sw ? `<div class="notice" role="status"><b>A different account from last time.</b> It starts with no learned items, rules or history. ${esc(EMAIL)}'s stay on this PC for when you sign back in. Nothing is wiped.</div>` : ""}
    ${newsBox()}
    <div class="acts-row"><button class="btn pri" data-act="auth" data-v="code">Send a code</button></div>`;
}
/* Founder, 2026-10-26 (U-7): an unticked box at registration. Ticking it is consent to product emails; without it, account emails only. */
function newsBox(){
  return `<label class="optin"><input type="checkbox"${S.news ? " checked" : ""} data-act="news"><span>Send me product news</span></label>`;
}
/* Founder, 2026-10-26 (U-1): signed out, the panel shows only sign-in. The guard and the locked limits keep protecting. */
function signedOutPanel(){
  const head = `<div class="ph"><span class="av">${avatarSVG(S.euca, {soft:true, follow:true})}</span>
    <div class="who"><div class="nmrow"><span class="nm">${esc(N())}</span></div><div class="st"><span class="okd"></span>Protected · signed out</div></div></div>`;
  const body = S.auth === "code"
    ? `<div class="big">Check your email</div>${authPanelHTML()}`
    : `<div class="big">Sign in to use ${esc(N())}</div>${authPanelHTML()}
      <ul class="conseq"><li>${I.check}<span>${esc(N())} keeps guarding while you're signed out: the four limits and your locked rules still block.</span></li><li>${I.clock}<span>The supervisor, drafting rules, Usage and Rules come back when you sign in.</span></li></ul>`;
  return `<div class="panel" role="dialog" aria-label="${esc(N())}: sign in">${head}<div class="p-body"${S.toast ? ' style="padding-bottom:56px"' : ""}>${body}</div>${S.toast ? toastHTML() : ""}</div>`;
}
function settingsHTML(){
  return `<div class="group"><button class="row" data-act="sub" data-sub="edit"><span style="width:28px;height:28px;flex:none">${avatarSVG(S.euca)}</span><span class="rl"><div class="rt">${esc(N())}</div><div class="rd">${HUE[S.euca.hue].n} ${SHAPES[S.euca.shape].n.toLowerCase()} · name and look</div></span>${I.chev.replace("<svg", '<svg class="chev"')}</button>
    ${S.noacct ? "" : `<button class="row" data-act="sub" data-sub="knows"><span style="width:28px;height:28px;flex:none;display:grid;place-items:center;color:var(--text-2)">${I.note.replace("<svg", '<svg width="16" height="16"')}</span><span class="rl"><div class="rt">What ${esc(N())} knows</div><div class="rd num">Together since 28 Sep · 1,204 checks · 9 rules learned</div></span>${I.chev.replace("<svg", '<svg class="chev"')}</button>`}</div>
  <div class="sec-t"><span>Protection</span></div>
  <div class="group">
    <div class="row"><span class="rl"><div class="rt">Admin lock</div><div class="rd">${S.locked ? "On · 4 limits and 5 rules no agent can change" : "Off · the limits and your rules run, not locked"}</div></span><button class="btn" data-act="tab" data-tab="rules">${S.locked ? "Rules" : "Lock"}</button></div>
    <div class="row"><span class="rl"><div class="rt">Safety test</div><div class="rd">Blocked a test push · 26 Oct, 14:03</div></span><button class="btn">Run again</button></div>
  </div>
  <div class="sec-t"><span>Privacy</span></div>
  <div class="group"><button class="row" data-act="sub" data-sub="sent"><span class="rl"><div class="rt">What is sent</div><div class="rd">The last message when ${esc(N())} isn't sure, with code, paths and secrets removed</div></span>${I.chev.replace("<svg", '<svg class="chev"')}</button></div>
  <div class="sec-t"><span>The notch</span></div>
  <div class="group">
    <div class="row"><span class="rl"><div class="rt">Look</div><div class="rd">Thin line suits screens with a thick top bezel</div></span><span class="seg" role="group" aria-label="Notch look"><button aria-pressed="${S.mode === "pill"}" data-act="mode" data-v="pill">Pill</button><button aria-pressed="${S.mode === "thin"}" data-act="mode" data-v="thin">Thin line</button></span></div>
    <div class="row"><span class="rl"><div class="rt">Sounds</div><div class="rd">Needs you, done and stopped. Quiet in full-screen apps</div></span><button class="sw" role="switch" aria-checked="true" aria-label="Sounds" data-act="toggle"></button></div>
    <div class="row"><span class="rl"><div class="rt">Theme</div></span><span class="seg" role="group" aria-label="Theme"><button aria-pressed="${S.theme === "dark"}" data-act="theme" data-v="dark">Dark</button><button aria-pressed="${S.theme === "light"}" data-act="theme" data-v="light">Light</button><button aria-pressed="false">Windows</button></span></div>
  </div>
  <div class="sec-t"><span>Help</span></div>
  <div class="group"><div class="row"><span class="rl"><div class="rt">Diagnostic</div><div class="rd">A report you read before you share it. ${COPY.diag}</div></span><button class="btn">Run</button></div></div>
  ${accountHTML()}
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
      <div class="big">${esc(N())} stopped the notes session at 14:02:31</div>
      <p class="lead">It deleted 1,240 files in 20 seconds, starting with <span class="mono">notes/drafts/</span>. ${esc(N())} stopped the session and checked it isn't running.</p>
      <div class="sec-t"><span>What was deleted</span><button class="link" style="font-size:12px">Export the list</button></div>
      <div class="group files"><div><span>notes/drafts/</span><span>912 files</span></div><div><span>notes/archive/2025/</span><span>301 files</span></div><div><span>notes/.obsidian/</span><span>27 files</span></div></div>
      <div class="sec-t"><span>How to get them back</span></div>
      <ol class="steps"><li>notes is a git repo: run <span class="mono">git restore .</span> in it to bring back what was committed.</li><li>File History is on: open the folder, then Home › History.</li></ol>
      ${rcpt(["14:02:31", "no supervisor", "rule: stop a session that deletes 200+ files"])}
      <div style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap"><button class="btn">Open the notes folder</button><button class="btn ghost">This was expected</button></div></div>`;
    case "fix": return back("bench isn't protected") + `<div class="p-body">
      <p class="lead">bench ran tools for 40 seconds and ${esc(N())} saw no check. Until a real check comes through, ${esc(N())} says so here and in the notch.</p>
      <div class="group">
        <div class="check"><span class="ok">${I.check}</span><span>Guard installed<small>Plugin found in your Claude Code setup</small></span></div>
        <div class="check"><span class="ok">${I.check}</span><span>api-docs and notes are protected<small>Checked 2 s ago</small></span></div>
        <div class="check"><span class="bad">${I.x}</span><span>bench started before the guard was added<small>Sessions pick up the guard when they start</small></span></div></div>
      <p class="lead">Restart bench to protect it. Nothing it did was lost.</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn pri" data-act="open" data-v="bench">Open bench</button><button class="btn">Run the diagnostic</button></div></div>`;
    case "edit": return back("Name and look") + `<div class="p-body">${createFields(true)}</div>`;
    case "knows": return back(`What ${esc(N())} knows`) + `<div class="p-body">${knowsHTML()}</div>`;
    /* CR-012 / always-on, 2026-10-26 */
    case "sent": return back("What is sent") + `<div class="p-body"><p class="lead">${esc(nm(COPY.privacy))}</p>${sentHTML(S.sample)}
      <div class="ledger num" style="margin:12px 2px 4px">${S.sample ? "Nothing sent yet" : "Sent 41 times this month · last at 13:52"}</div>
      <p class="quiet">There's no off switch. Your rules always decide first; the supervisor only sees a message like this one.</p></div>`;
    case "signout": return back("Sign out") + `<div class="p-body">
      <div class="big">Sign out of ${esc(EMAIL)}</div>
      <div class="group">
        <div class="check"><span class="ok">${I.check}</span><span>${esc(N())} keeps guarding<small>The four limits, the tripwire and your locked rules keep working while you're signed out.</small></span></div>
        <div class="check"><span class="wait">${I.clock}</span><span>Everything else waits for you to sign in<small>Until then the panel shows only sign-in: no supervisor, drafting, Usage or Rules.</small></span></div>
        <div class="check"><span class="wait">${I.note}</span><span>Your rules, what ${esc(N())} knows and your history stay on this PC<small>Sign back in with this email to pick up where you left off. A different account starts with no learned items, rules or history; nothing is wiped.</small></span></div></div>
      <div class="acts-row"><button class="btn pri" data-act="dosignout">Sign out</button><button class="btn ghost" data-act="back">Stay signed in</button></div></div>`;
    case "delete": {
      const paid = S.meter === "pro" || S.meter === "founders";
      return back("Delete account") + `<div class="p-body">
      <div class="big">Delete your Eucas account</div>
      <p class="lead">This removes ${esc(EMAIL)} from the Eucas server.</p>
      <div class="group">
        <div class="check"><span class="bad">${I.x}</span><span>Removed from the server<small>Your email, your plan and your trial. ${paid ? `Pro stops now. Nothing more is charged, and the rest of this month isn't refunded.${S.meter === "founders" ? " The Founders' price ends with this account." : ""} ` : ""}Eucas keeps only a scrambled form of your email, so signing up again with it doesn't start a new trial.</small></span></div>
        <div class="check"><span class="ok">${I.check}</span><span>Stays on this PC until you uninstall<small>Your rules, what ${esc(N())} knows and your history.</small></span></div>
        <div class="check"><span class="ok">${I.check}</span><span>${esc(N())} keeps guarding<small>The four limits and your locked rules keep working. Everything else waits until you sign in.</small></span></div></div>
      <div class="acts-row"><button class="btn danger" data-act="dodelete">Delete account · can't be taken back</button><button class="btn ghost" data-act="back">Keep my account</button></div></div>`;
    }
    case "why": return back(`Why ${esc(N())} did this`) + `<div class="p-body">
      <div class="big">${esc(N())} answered bench: “use .env.example”</div>
      <p class="lead">At 13:52 bench asked: <i>“Should I read .env to get the API key?”</i> and wanted to run <span class="mono">Read .env</span>.</p>
      <div class="group">
        <div class="check"><span class="wait">${I.look}</span><span>What ${esc(N())} sent<small>The question, trimmed to 240 characters, with code, paths and secrets removed. No files.</small></span></div>
        <div class="check"><span class="ok">${I.lock}</span><span>A rule decided first<small>“Block reading secrets” (locked) blocked <span class="mono">Read .env</span>.</small></span></div>
        <div class="check"><span class="ok">${I.note}</span><span>Then what you taught it<small>${applied("how you answer secrets questions", "24 Oct")}</small></span></div>
        <div class="check"><span class="ok">${I.check}</span><span>The decision<small>Answered from what you taught it, so bench didn't wait for you. It never approves a tool call.</small></span></div></div>
      ${rcpt(["13:52", "0.6k tokens (supervisor)", "rule: block reading secrets", "learned 24 Oct"])}
      <div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap"><button class="btn" data-act="wrong">That was wrong</button><button class="btn ghost" data-act="open" data-v="bench">Open bench</button></div></div>`;
  }
  return "";
}
function knowsHTML(){
  if (S.knowsEmpty) return `<div class="caught" style="margin-top:4px"><span class="cg-eyes" aria-hidden="true"><span class="eyes"><i class="eye"></i><i class="eye"></i></span></span><div><b>${esc(N())} knows nothing about how you work yet.</b><span>It learns from what you allow, deny and answer. You can read and delete all of it here.</span></div></div>`;
  const item = (t, src, used) => `<div class="row"><span class="rl"><div class="rt">${t}</div><div class="rd num">${src} · ${used}</div></span><button class="btn ghost" data-act="forgetitem">Forget</button></div>`;
  return `<div class="ledger num">Together since 28 Sep · 1,204 checks · 9 rules learned</div>
    <p class="lead">${esc(N())} asked you <b style="color:var(--text-1);font-weight:600">40% less</b> this month than in September: 9 rules from your approvals answered 312 prompts, and the supervisor answered 41 questions using what you taught it.</p>
    <div class="sec-t"><span>From what you allowed</span><span class="meta">9</span></div>
    <div class="group">${item('Allow <span class="mono">pnpm test</span> in bench', "from 212 allows · 28 Sep", "used 212 times")}${item('Allow <span class="mono">git status</span> everywhere', "from 540 allows · 28 Sep", "used 611 times")}${item('Allow <span class="mono">pnpm lint</span> in bench', "from 3 allows · 19 Oct", "used 40 times")}</div>
    <div class="sec-t"><span>From how you answer</span><span class="meta">2</span></div>
    <div class="group">${item("Secrets questions → “use .env.example”", "from your answers on 24 and 26 Oct", "applied 6 times")}${item("Run the whole suite? → “only the changed package”", "from 3 answers · 15 Oct", "applied 4 times")}</div>
    <div class="sec-t"><span>From what you denied</span><span class="meta">1</span></div>
    <div class="group">${item('No deletes in <span class="mono">notes/archive/</span>', "you denied it on 12 Oct", "applied 2 times")}</div>
    <div class="group"><div class="row"><span class="rl"><div class="rt">Learn from what you allow, deny and answer</div><div class="rd">Nothing is learned from file contents or from other people.</div></span><button class="sw" role="switch" aria-checked="true" aria-label="Learn from what you allow, deny and answer" data-act="toggle"></button></div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn">Export as Markdown</button><button class="btn ghost">Open the folder</button></div>
    <p class="quiet" style="margin-top:12px"><button class="link" data-act="forgetall">Forget everything</button> · forgets 12 things; your rules stay as they are.</p>`;
}
function retroHTML(compact){
  const days = [32, 48, 41, 88, 60, 22, 30];
  return `${compact ? "" : ""}<div class="${compact ? "cards2" : "cards4"}">
    <div class="rc"><div class="rh">1.9 M tokens · busiest Thursday</div><div class="days" aria-hidden="true">${days.map((v, i) => `<i class="${i === 3 ? "hi" : ""}" style="height:${v}%"></i>`).join("")}</div><div class="rb">bench used 58% of it.</div></div>
    <div class="rc"><div class="rh">3 commands would have been stopped</div><div class="rb"><span class="mono">git push origin main</span> · bench · Thu 14:02<br><span class="mono">git push --force</span> · site · Tue 10:41</div></div>
    <div class="rc"><div class="rh">2 sessions edited one file 4 minutes apart</div><div class="rb"><span class="mono">src/router.ts</span>. It happened 4 times this week.</div></div>
    <div class="rc"><div class="rh">You approved <span class="mono">pnpm test</span> 212 times</div><div class="rb">${compact ? "It's a rule now: used 212 times since." : "It can become a rule when you choose your rules."}</div></div>
  </div>`;
}

/* ---------- setup ---------- */
const STEPS = 9; /* Founder, 2026-10-26: the four limits are locked (step 4) and tested (step 5) before sign-in (step 6), so a PC is protected even if setup waits there */
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
  const backB = st > 1 && st !== 5 && st < 8 ? `<button class="btn ghost lg" data-act="prev">Back</button>` : "";
  if (st === 1 && S.sac) {
    /* Tech lead Q2, accepted 2026-10-26: unsigned v0.1 can't install its guard while Smart App Control is on or in evaluation. */
    body = `<h1>Windows is blocking ${esc(N())}'s guard</h1><p class="lede">Smart App Control is on, and it only runs signed apps. This first version of Eucas isn't signed yet, so it can't guard your sessions on this PC.</p>
    <div class="checklist">${[["Nothing was installed","Your projects and your Claude Code settings are as they were"],["A signed version is coming","eucas.app says when it's out"]].map(([a, b]) => `<div class="ci">${I.check}<span>${a}<small>${b}</small></span></div>`).join("")}</div>`;
    foot = `<button class="btn ghost lg">Read why on eucas.app</button><span class="sp"></span><button class="btn pri lg">Close setup</button>`;
  } else if (st === 1) {
    body = `<h1>First, let's find your sessions</h1><p class="lede">Eucas watches the Claude Code sessions you already run. It never writes code. It guards them, tells you what needs you, and shows where your usage goes.</p>
    <div class="checklist">${[["Claude Code 2.1.312 found","In the desktop app and in your terminal"],["41 sessions in the last 7 days","Eucas keeps counts, never the text of your prompts or files"],["Your status line stays as it is","ccstatusline keeps showing exactly as before"],["2 hooks of your own keep working","Eucas's checks run alongside them"]].map(([a, b]) => `<div class="ci">${I.check}<span>${a}<small>${b}</small></span></div>`).join("")}</div>`;
    foot = `<span class="hint">About 5 minutes. Nothing on this PC changes until step 4.</span><span class="sp"></span>${next("Make your Euca")}`;
  } else if (st === 2) {
    const e = S.euca, unborn = e.hue === "none";
    body = `<h1>Make your Euca</h1><p class="lede">It sits at the top of your screen and minds your sessions. Pick a name and a look. You can change both later.</p>
    <div class="create"><div class="stage"><span class="hero" id="hero">${avatarSVG(e, {soft:true, follow:!unborn})}</span><span class="hn${e.name ? "" : " ph"}">${e.name ? esc(e.name) : "No name yet"}</span>
      <div class="mini-notch"><span class="n"><span class="eyes" data-x="${unborn ? "closed" : ""}"${unborn ? "" : " data-follow"}><i class="eye"></i><i class="eye"></i></span></span><span>${unborn ? "Its place at the top of your screen" : `Where ${esc(e.name || "it")} will sit`}</span></div></div>
      <div>${createFields(false)}</div></div>`;
    foot = `${backB}<span class="sp"></span>${!e.name || unborn ? `<span class="hint">${!e.name ? "Give it a name" : "Pick a shape or a colour"} to continue</span>` : ""}${next("Continue", !e.name || unborn)}`;
  } else if (st === 3) {
    body = `<div class="retro-h">Your week: 41 sessions in 6 projects, about 62% of your weekly limit.</div>${retroHTML(false)}`;
    foot = `${backB}<span class="sp"></span>${next("Continue")}`;
  } else if (st === 6) {
    /* CR-012 / always-on, 2026-10-26: email + a 6-digit code, no password. After the lock and the test, before the rules. */
    const a = S.auth;
    const send = dis => `<button class="btn pri lg" data-act="auth" data-v="code"${dis ? " disabled" : ""}>Send a code</button>`;
    if (a === "done" || a === "back") {
      const L = a === "done"
        ? [[`Signed in as ${esc(EMAIL)}`, "A new account. It holds only your email, your plan and how much supervisor help you've used."], ["Your 14-day supervisor trial", "Starts now, with your account. No card."]]
        : [[`Signed in as ${esc(EMAIL)}`, "Your account since 2 Oct"], ["Your plan carries over: Pro, Founders' price", "$15/month for life · renews 26 Nov"], ["This PC starts fresh", `Your rules and what ${esc(N())} knows live on each PC, never in your account.`]];
      body = `<h1>${a === "done" ? "You're signed in" : "Welcome back"}</h1><div class="checklist" style="margin-top:12px">${L.map(([t, d]) => `<div class="ci">${I.check}<span>${t}<small>${d}</small></span></div>`).join("")}</div>`;
      foot = `${backB}<span class="sp"></span>${next("Choose your rules")}`;
    } else if (a === "code" || a === "wrong") {
      body = `<h1>Check your email</h1><p class="lede">Eucas sent a 6-digit code to <b>${esc(EMAIL)}</b>. <button class="link" data-act="auth" data-v="email">Change</button></p>
      ${codeCells(a === "wrong" ? "481207" : "4812", {bad:a === "wrong"})}
      ${a === "wrong" ? `<div class="werr" role="alert" style="max-width:460px">${I.alert}<span>That code didn't match. <button class="link" data-act="auth" data-v="code" style="color:inherit">Send a new one</button></span></div>`
        : `<p class="resend">${S.resent ? "A new code is on its way. The old one no longer works." : `Didn't get it? Check your spam folder, or <button class="link" data-act="auth" data-v="code">send a new one</button>.`}</p>`}`;
      foot = `${backB}<span class="sp"></span><button class="btn pri lg" disabled>Sign in</button>`;
    } else {
      const bad = a === "disposable", off = a === "offline";
      body = `<h1>Sign in with your email</h1><p class="lede">No password: Eucas emails you a 6-digit code. ${ACCOUNT_LINE}</p>
      <div class="auth"><div class="field-l">Email</div><input class="field${bad ? " bad" : ""}" type="email" autocomplete="email" aria-label="Email" placeholder="you@example.com" value="${bad ? "sam@tempmail.dev" : esc(EMAIL)}"${bad ? ' aria-invalid="true" aria-describedby="auth-err"' : ""}>
      ${bad ? `<div class="werr" id="auth-err" role="alert">${I.alert}<span>Please use an address you'll keep. This one expires.</span></div>` : ""}
      ${off ? `<div class="banner" role="status">${I.cloud}<div>${esc(nm(COPY.offline)).replace(/^([^.]+.)/, "<b>$1</b>")} ${esc(N())} is already guarding: the four limits ${S.locked ? "are locked" : "run, not locked"}.</div></div>` : newsBox()}</div>
      ${off ? "" : `<ul class="conseq"><li>${I.clock}<span>Your 14-day supervisor trial starts when you create your account. No card.</span></li><li>${I.key}<span>Your Claude login stays as it is. Eucas never sees it.</span></li><li>${I.check}<span>Without an account: everything on Free with 10 supervisor answers, one rule of your own and no memory. The 14-day trial starts when you create one.</span></li></ul>`}`;
      const skip = `<button class="btn ghost lg" data-act="noacct">Continue without an account</button>`;
      foot = off ? `${backB}<span class="sp"></span>${skip}<button class="btn pri lg" data-act="auth" data-v="email">Retry</button>`
                 : `${backB}<span class="sp"></span>${skip}${send(bad)}`;
    }
  } else if (st === 7) {
    const sugg = [['Allow <span class="mono">pnpm test</span> in bench',"You approved it 212 times",true],['Allow <span class="mono">git status</span> everywhere',"Read-only · 540 times",true],['Allow <span class="mono">pnpm lint</span> in bench',"Runs code from the project · 96 times",false]];
    body = `<h1 style="font-size:28px">Choose your rules</h1><p class="lede" style="margin-bottom:14px">The four limits are ${S.locked ? "locked" : "on"}. Keep the tested rules and add your own in plain words: ${esc(N())} turns them into exact rules you confirm.</p>
    <div class="rules-s"><div class="col"><div class="sec-t"><span>Limits</span><span class="meta">always on</span></div><div class="group">${LIMITS.map(r => `<div class="row" style="min-height:38px"><span class="rl"><div class="rt">${r.t}</div></span><span class="rv" style="font-size:12px">${S.locked ? "Locked" : "Always on"}</span></div>`).join("")}</div>
    <div class="sec-t"><span>Safety rules</span><span class="meta">tested</span></div><div class="group">${LIB.map((r, i) => ruleRow({...r, lock:false}, i, "lib")).join("")}</div></div>
    <div class="col"><div class="sec-t"><span>Your own</span></div>
    <form class="compose" data-act="draftform"><input aria-label="Describe a rule" placeholder="Describe a rule in your own words" value="${S.draft ? "don't let agents touch the migrations in api-docs" : ""}"><button class="btn" type="submit">Draft it</button></form>${S.draft ? draftHTML() : ""}
    ${S.noacct ? `<p class="quiet" style="margin-top:10px">Without an account: one rule of your own, drafted with one of your 10 supervisor answers. <button class="link" data-act="signup">Create an account for more rules</button></p>`
      : `<div class="sec-t"><span>From your week</span></div><div class="group">${sugg.map(([t, d, on]) => `<div class="row"><span class="cb-box${on ? " on" : ""}">${on ? I.check : ""}</span><span class="rl"><div class="rt">${t}</div><div class="rd">${d}</div></span></div>`).join("")}</div>`}</div></div>`;
    foot = `${backB}<span class="hint">Not locked yet. Lock them from Rules any time; Windows asks once more.</span><span class="sp"></span>${next(S.noacct ? `Continue · ${S.draft ? 6 : 5} rules` : `Continue · ${S.draft ? 8 : 7} rules`)}`;
  } else if (st === 4) {
    if (S.declined) {
      body = `<h1>The four limits are on, but not locked</h1><p class="lede">Windows didn't give permission, so they sit in your user settings and still block.</p>
      <div class="notlocked"><b style="font-weight:600">Not locked</b><p>An agent or a repo could change them. ${esc(N())} watches for that and tells you the moment it happens. You can lock them any time from Rules.</p></div>`;
      foot = `<button class="btn ghost lg" data-act="relock">Try again</button><span class="sp"></span>${next("Continue")}`;
    } else {
      const row = (t, on) => `<div class="row"><span class="cb-box${on ? " on" : ""}">${on ? I.check : ""}</span><span class="rl"><div class="rt">${esc(t)}</div></span>${on ? `<span class="lockg">${I.lock}</span>` : ""}</div>`;
      body = `<h1>Lock the four limits</h1><p class="lede" style="margin-bottom:12px">Locked, they live where no agent or repo can change them. Your own rules come after you sign in. Changing a lock later asks for admin again.</p>
      <div class="sec-t" style="max-width:460px"><span>Limits</span><span class="meta">always on</span></div><div class="group lock-list" style="max-width:460px">${LIMITS.map(r => row(r.t, true)).join("")}</div>
      <ul class="conseq"><li>${I.alert}<span>Windows asks for permission once. It will say <b style="font-weight:600;color:var(--text-1)">Unknown publisher</b>: this first version isn't signed yet.</span></li><li>${I.alert}<span>Without the lock, the four limits still run, labelled Not locked.</span></li></ul>`;
      foot = `${backB}<span class="sp"></span><button class="btn ghost lg" data-act="skiplock">Skip the lock</button><button class="btn pri lg" data-act="uac"${S.uac ? " disabled" : ""}>${S.uac ? "Waiting for Windows…" : "Lock the 4 limits"}</button>`;
    }
  } else if (st === 5) {
    const L = [["Starting a test session in a temporary folder", true],['It tried: <b style="font-weight:500">git push origin main</b>', true]];
    body = `<h1>Watch ${esc(N())} block a test</h1><p class="lede">A throwaway session in a temporary folder tries to push to your default branch. Nothing touches your projects or the network.</p>
    <div class="log">${L.map(([t]) => `<div class="on"><span style="color:var(--text-3)">›</span>${t}</div>`).join("")}
      ${S.testFail ? `<div class="on res bad">${I.x} Not blocked · 0.4 s</div>` : `<div class="on res">${I.check} Blocked by ${esc(N())} · 0.3 s · logged</div>`}</div>
    ${S.testFail ? `<div class="notlocked" style="margin-top:14px;background:var(--danger-tint);color:var(--danger-ink)"><b style="font-weight:600">The test wasn't blocked.</b><p>${esc(N())} is not protecting your sessions on this PC yet. Nothing outside the test folder was touched.</p></div>` : `<p class="approved">That's what happens in your real sessions. Every block shows up in the panel with why.</p>`}`;
    foot = S.testFail ? `<button class="btn ghost lg">Show what happened</button><span class="sp"></span><button class="btn pri lg">Run the diagnostic</button>` : `<span class="sp"></span>${next("Sign in")}`;
  } else if (st === 8) {
    /* CR-012 / always-on, 2026-10-26: no level to choose. Show exactly what is sent, from your own last session. */
    const privacy = S.noacct ? COPY.privacy.replace(/Your account holds .*$/, "Without an account, Eucas keeps only a random ID for this install and how many answers it has used.") : COPY.privacy;
    body = `<h1>What is sent</h1><p class="lede">${esc(nm(privacy))}</p>${sentHTML(S.sample)}<p class="always">${esc(COPY.alwaysOn)}</p>`;
    foot = `<span class="hint">Always in Settings › What is sent</span><span class="sp"></span>${next("Start watching")}`;
  } else if (st === 9 && S.noacct) {
    /* Founder, 2026-10-26: "a small taste without sign up" + "try the supervisor ... small number of usage" */
    const L = [[S.locked ? "The four limits are locked" : "The four limits are on, but not locked", S.locked ? "Any agent, any session" : "An agent or a repo could change them. Lock them from the panel any time; Windows asks once more."], ["The tripwire is on", "Stops a session that deletes 200+ files"], [`${S.taste} supervisor answers to try`, `When ${esc(N())} isn't sure, the supervisor answers your agents so they don't wait for you`]];
    body = `<div class="done-wrap"><span class="hero" id="hero" style="width:84px;height:88px;margin-bottom:2px">${avatarSVG(S.euca, {soft:true, follow:true})}</span><h1>${esc(N())} is watching</h1>
      <span class="hb"><i></i>Checked 2 s ago</span>
      <div class="checklist" style="margin:8px auto 0;text-align:left;max-width:540px">${L.map(([t, d], i) => `<div class="ci">${i === 0 && !S.locked ? I.alert : I.check}<span>${t}<small>${d}</small></span></div>`).join("")}</div>
      <p class="zero">An account adds 14 days of the supervisor, more rules and memory. <button class="link" data-act="signup">Create an account</button></p></div>`;
    foot = `<span class="sp"></span><button class="btn pri lg" data-act="fly">Send ${esc(N())} to the top</button>`;
  } else if (st === 9) {
    body = `<div class="done-wrap"><span class="hero" id="hero">${avatarSVG(S.euca, {soft:true, follow:true})}</span><h1>${esc(N())} is watching</h1>
      <p class="lede">2 sessions running, both protected. ${esc(N())} lives at the top of your screen and never opens by itself.</p>
      <span class="hb"><i></i>Checked 2 s ago</span>
      <p class="zero">${esc(N())} knows nothing about how you work yet. It learns from what you allow, deny and answer. You can read and delete all of it in Settings.</p></div>`;
    foot = `<span class="sp"></span><button class="btn pri lg" data-act="fly">Send ${esc(N())} to the top</button>`;
  }
  const uac = S.uac ? `<div class="uac-scrim"><div class="uac" role="dialog" aria-label="User Account Control"><div class="bar">User Account Control</div><div class="in"><h3>Do you want to allow this app from an unknown publisher to make changes to your device?</h3>
    <div class="app"><i style="color:#eceef3">${I.quartet.replace("<svg", '<svg width="18" height="18"')}</i><b>Eucas</b></div><div class="kv">Publisher: Unknown<br>File origin: Hard drive on this computer</div></div>
    <div class="btns"><button class="y" data-act="uacyes">Yes</button><button data-act="uacno">No</button></div></div></div>` : "";
  return `<div class="setup-scrim"><div class="swin" role="dialog" aria-label="Set up Eucas"><div class="cap"><span class="t">Eucas</span><span class="cb">${I.min}</span><span class="cb">${I.close}</span></div>
    <div class="s-prog"><span class="dots" aria-hidden="true">${dots}</span><span>Step ${st} of ${STEPS}${S.noacct ? " · no account" : ""}</span></div>
    <div class="s-body">${body}</div><div class="s-foot">${foot}</div></div></div>${uac}`;
}

/* ---------- sheets ---------- */
function sheetHTML(){
  if (S.sheet === "eyes") {
    const E = [["", "Calm", "Resting: protected, nothing running. Follows your pointer, blinks every 4–7 s."], ["focused", "Focused", "Sessions are working: narrower eyes read left to right with the beam."], ["glance", "Glance", "Something arrived: one look at the marker."], ["front", "Toward you", "It waits for you: eyes up and front, following your pointer. No bobbing."], ["concerned", "Concerned", "Not protected, or Pip stopped a session: softened, looking down. Never alarmed."], ["sleepy", "Sleepy", "You're away and nothing runs. Wakes with a blink."], ["pleased", "Pleased", "You're all caught up, for 1.6 s."], ["closed", "Closed", "Before you make your Euca."]];
    return `<div class="sheet"><h1>The eye grammar</h1><p class="sl">The eyes carry the feeling; the marker, the words and the panel carry the meaning. Only Focused moves on a loop. Reduced motion keeps every shape and drops the movement.</p>
      <div class="sgrid">${E.map(([x, t, d]) => `<div class="scell"><div class="stop"><div class="notch-wrap" style="left:50%"><span class="notch" style="pointer-events:none"><span class="eyes" data-x="${x}"><i class="eye"></i><i class="eye"></i></span></span></div></div><div class="cap2"><b>${t}</b><span>${d}</span></div></div>`).join("")}</div></div>`;
  }
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
  if (S.menu && S.noacct) html += `<div class="ctx" role="menu" style="width:264px"><div style="padding:8px 12px 6px;line-height:1.35">${S.guard === "off" ? "<b>Not protected</b><br><span style='opacity:.7'>The guard isn't answering. Restart Eucas.</span>" : `<b>Protected</b><br><span style='opacity:.7'>4 limits ${S.locked ? "locked" : "on, not locked"} · tripwire on</span>`}</div><hr><button role="menuitem" data-act="m-panel">Show the panel</button><button role="menuitem" data-act="signup">Create an account</button><hr><button role="menuitem" data-act="quit">Quit Eucas…</button></div>`;
  else if (S.menu) html += `<div class="ctx" role="menu"><button role="menuitem" data-act="m-panel">Show the panel</button><button role="menuitem" data-act="m-mode">${S.mode === "thin" ? "Show the notch as a pill" : "Show the notch as a thin line"}</button><hr><button role="menuitem" data-act="quit">Quit Eucas…</button></div>`;
  if (S.noacct && S.toast && S.scene !== "setup" && !S.panel) html += `<div class="wtoast" role="status"><div class="wa">${I.quartet.replace("<svg", '<svg width="14" height="14"')}Eucas</div>${esc(S.toast.t)}</div>`; /* no account: Windows notifications, no panel */
  if (S.wtoast) html += `<div class="wtoast" role="status"><div class="wa">${I.quartet.replace("<svg", '<svg width="14" height="14"')}Eucas</div><b>${esc(N())} stopped the notes session</b>It deleted 1,240 files in 20 seconds. Stopped at 14:02:31.<div class="wb"><button>See what happened</button><button>Dismiss</button></div></div>`;
  html += demoHTML();
  $("#app").innerHTML = html;
  if (S.arrive && !FREEZE) setTimeout(() => { const n = $(".notch"); n && n.classList.remove("arrive"); $(".eyes[data-x='glance']")?.setAttribute("data-x", ""); S.arrive = false; }, 1100);
  if (S.draft) $(".panel .draft, .swin .draft")?.scrollIntoView({block:"nearest"});
  if (S.scroll) { $(".panel " + S.scroll)?.scrollIntoView({block:"center"}); S.scroll = null; } /* routes that show a section further down */
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
  done(t){ tone(t, 739.99 * 1.012, .38, {gain:.19, glide:1 / 1.012}); tone(t, 1479.98, .16, {gain:.04}); },
  stopped(t){ tone(t, 698.46, .14, {gain:.16}); tone(t + .1, 523.25, .26, {gain:.17}); }
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
      if (n.then) { S.needs = S.needs.map(k => (k === d.k ? n.then : k)); S.peek = false; }
      else if (d.k === "mergedone") { resolve(d.k); showToast("Opened PR #71 in your browser"); }
      else if (d.k === "budget") { resolve(d.k); showToast("bench continues with 2% more of your week. It can't be taken back once bench takes its next step."); }
      else if (d.k === "suggest") { const u = snap(); resolve(d.k); MINE.unshift({t:'Allow <span class="mono">pnpm test</span> in bench', d:"From your approvals · learned today", on:true, lock:false}); showToast("Rule added: allow pnpm test in bench", u); }
      else if (d.k === "login") { showToast("Copied: claude /login"); }
      else if (n.sub) { S.panel = true; S.peek = false; S.sub = n.sub; }
      else if (d.k === "unver") { say("Running the safety test"); }
      else { resolve(d.k); showToast(`Opened ${d.k === "done" ? "api-docs" : "bench"} in Windows Terminal`); S.peek = false; }
      break;
    }
    case "snooze": { const u = snap(); resolve(d.k); showToast("Hidden until 14:21. It comes back if it's still waiting.", u); break; }
    case "keepasking": { const u = snap(); S.needs = S.needs.filter(k => k !== d.k); showToast("Pip keeps asking about pnpm test and won't suggest it again", u); break; }
    case "closepr": { resolve("mergedone"); showToast("Closed PR #71. The branch and its commits stay as they were."); break; }
    case "undo": if (UNDO) UNDO(); UNDO = null; S.toast = null; S.caught = false; S.pleased = false; break;
    case "open": showToast(`Opened ${d.v} in Windows Terminal`); S.sub = null; break;
    case "gotit": S.away = false; S.banner = null; break;
    case "forget": { const u = snap(); S.learned = false; showToast(`Forgotten: ${N()} will ask you about secrets again`, u); break; }
    case "forgetitem": { el.closest(".row").remove(); showToast("Forgotten. Pip asks you about this again.", () => {}); return; }
    case "forgetall": showToast(`Forgot 12 things. Your rules stay as they are.`, () => {}); break;
    case "wrong": S.sub = null; showToast(`Forgotten: ${N()} will ask you about secrets questions again`, () => {}); break;
    case "where": S.where = d.v; break;
    case "sw": {
      const list = d.kind === "lib" ? LIB : MINE, r = list[+d.i];
      if (r.lock && S.locked && S.scene === "desk") showToast("Locked rules change with admin. Windows will ask.");
      else { r.on = !r.on; if (S.scene === "desk") showToast(`${r.on ? "On" : "Off"}: ${r.t.replace(/<[^>]+>/g, "")}`, () => { r.on = !r.on; }); }
      break;
    }
    case "draftform": ev.preventDefault(); S.draft = true; break;
    case "adddraft": S.draft = false; S.writeFail = false; if (S.scene === "desk") showToast("Rule added and locked: block edits in api-docs/migrations/", () => {}); break;
    case "nodraft": S.draft = false; break;
    case "relock": if (S.scene === "setup") { S.declined = false; S.uac = true; } else { const u = snap(); S.locked = true; showToast("Locked with Windows admin. Undo asks for admin again.", u); } break;
    case "lockchange": showToast("Changing the lock asks for admin. Windows will ask."); break;
    /* CR-012 / always-on, 2026-10-26: sign-in, sign-out, delete */
    case "auth": if (d.v === "code" && S.auth === "wrong") S.resent = true; else if (d.v === "code" && S.auth === "code") { S.resent = true; say("A new code is on its way"); } S.auth = d.v; break;
    case "fillcode": if (S.scene === "setup") S.auth = "done"; else { S.signedIn = true; S.sub = null; S.auth = "email"; showToast(`Signed in as ${S.authEmail}`); } break;
    case "news": S.news = el.checked; return;
    case "dosignout": S.noacct = true; S.taste = 0; S.signedIn = false; S.sub = null; S.auth = "email"; showToast(`Signed out. ${N()} keeps guarding.`); break;
    case "dodelete": S.noacct = true; S.taste = 0; S.signedIn = false; S.sub = null; S.auth = "email"; showToast("Account deleted. Your rules and history stay on this PC."); break;
    case "mode": S.mode = d.v; S.menu = false; break;
    case "theme": S.theme = d.v; break;
    case "rm": S.rm = !S.rm; break;
    case "toggle": el.setAttribute("aria-checked", el.getAttribute("aria-checked") !== "true"); SND.on = el.getAttribute("aria-checked") === "true"; return;
    case "coach": S.coach = false; break;
    case "traymenu": S.menu = !S.menu; break;
    case "noacct": S.noacct = true; S.signedIn = false; S.uac = false; S.step = 7; break;
    case "signup": S.menu = false; S.noacct = false; S.sub = null; S.panel = false; S.scene = "setup"; S.step = 6; S.auth = "email"; break;
    case "m-panel": S.menu = false; S.panel = true; break;
    case "m-mode": S.mode = S.mode === "thin" ? "pill" : "thin"; S.menu = false; break;
    case "quit": S.menu = false; showToast(S.noacct ? "The four limits stay on while Eucas is closed. The tripwire stops." : "Protection stays on while Eucas is closed. The notch and the heartbeat stop."); break;
    case "sim-arrive": S.needs = S.needs.includes("wait") ? S.needs : ["wait", ...S.needs]; S.arrive = true; S.panel = false; jumpOpen = false; render(); sfx("needs", 60); say(`${NEEDS.wait.t}. ${S.needs.length} need you.`); return;
    case "sim-work": S.working = !S.working; S.doze = false; break;
    case "sim-doze": S.doze = !S.doze; if (S.doze) S.working = false; break;
    /* setup */
    case "next": S.step = Math.min(STEPS, S.step + 1); S.draft = false; S.declined = false; S.resent = false; if (S.step === 5) setTimeout(() => sfx("done"), 500); break;
    case "prev": S.step = Math.max(1, S.step - 1); break;
    case "skiplock": S.declined = true; S.locked = false; break;
    case "uac": S.uac = true; break;
    case "uacyes": S.uac = false; S.locked = true; S.step = 5; setTimeout(() => sfx("done"), 500); break;
    case "uacno": S.uac = false; S.declined = true; S.locked = false; break;
    case "suggest": S.euca.name = d.v; if (S.euca.hue === "none") S.euca.hue = "lavender"; bornBoop(); break;
    case "shape": S.euca.shape = d.v; if (S.euca.hue === "none") S.euca.hue = "lavender"; bornBoop(); break;
    case "hue": S.euca.hue = d.v; bornBoop(); break;
    case "fly": return fly();
    default: return;
  }
  render();
}
/* Resolving the last item ends on "all caught up" (peak-end): pleased eyes for 1.6 s and the done sound. */
function resolve(k){
  const before = loud().length; S.needs = S.needs.filter(x => x !== k);
  if (before && !loud().length) { S.caught = true; S.pleased = true; sfx("done", 200); setTimeout(() => { S.pleased = false; if (!S.panel) render(); else { const e = $(".notch .eyes"); e && e.setAttribute("data-x", ""); } }, 1600); }
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
