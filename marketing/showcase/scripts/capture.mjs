// Captures real screens from the prototype (docs/design/ui/prototype) for the showcase video.
// The prototype must be served on :4180:
//   python -m http.server 4180 --directory docs/design/ui/prototype
// Each shot is the real UI with the story's data swapped in (a bakery website), saved at 2x to
// public/screens/<name>.png, plus public/screens/<name>.json with the boxes of elements tagged data-cap.
//   node scripts/capture.mjs            # every shot
//   node scripts/capture.mjs team-1     # one shot
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const EDGE = process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const URL = "http://localhost:4180/direction.html?theme=dark";
const OUT = path.resolve("public/screens");

// In-page helpers: run once after load. Everything here uses the prototype's own data, renderers and classes.
const SETUP = () => {
  const css = document.createElement("style");
  css.textContent = `header.demo,#errBox{display:none!important} #app{top:0!important;inset-block-start:0!important;height:100vh!important}
    .tk-av.glance, .arrive{animation:none!important} *{caret-color:transparent!important}`;
  document.head.append(css);

  // The story: one project, a bakery website, built by the usual team.
  PROJ.bench.name = "Bakery site";
  PROJ.ik.name = "Catering menu";
  const board = (todo, doing, done) => (PROJ.bench.board = { todo, doing, done });
  window.__board = board;
  board(
    [["B-4", "Pickup times", "noor"], ["B-5", "Payments", "karim"], ["B-6", "Order emails", "noor"]],
    [["B-2", "Order form", "noor", "working"], ["B-3", "Menu page", "maya", "review"], ["B-7", "Checkout tests", "jade", "working"]],
    [["B-0", "Plan and pages", "maya"], ["B-1", "Site setup", "karim"]],
  );
  // What needs you holds only this story: the test, then the go-live approval. The rest count as handled.
  NEEDS0.forEach((n) => !["stoptest", "e2e"].includes(n.k) && H.done.add(n.k));
  const need = (k) => NEEDS0.find((n) => n.k === k);
  Object.assign(need("stoptest"), {
    title: "The order page is ready for you to try",
    who: "Noor · B-2 · Bakery site",
    age: "now",
    start: "Noor's order page, ready for you to try",
    d: "Order like a customer would: pick the pastries, a pickup time, and pay with a test card. About 3 minutes.",
    test: ["Open the test build of your site.", "Order 2 croissants and pick a pickup time.", "Pay with the test card and check the order email draft."],
    why: "Jade's checkout tests passed: 32 of 32. Karim reviewed every change.",
  });
  Object.assign(need("e2e"), {
    av: "karim",
    tag: { gate: "Goes live" },
    title: "Karim is ready to put the bakery site live",
    who: "Karim · B-8 · Bakery site",
    age: "now",
    start: "Karim's request to go live",
    prov: "Anything that goes live comes to you first.",
    cmd: "deploy --production",
    where: "to bakery-site.app",
    d: "You tested the order page, Jade's 32 checks pass, and Karim reviewed every change.",
    cons: ["4 pages", "32 checks passed", "one click rolls it back"],
    primary: { label: "Put it live", act: "allow" },
    sec: [["secondary", "Not yet", "deny"]],
    why: "Going live is public, so it always waits for you.",
  });

  const visibleMsgs = () => [...document.querySelectorAll(".msgs")].find((m) => m.offsetParent !== null);
  const meta = (t) =>
    `<div class="msg-meta"><span>${t}</span><span class="sp" aria-hidden="true">·</span><span>0.9k tokens</span><span class="sp" aria-hidden="true">·</span><span>0.03 % of your week</span></div>`;
  window.__cap = {
    msgs: visibleMsgs,
    clear(keep = 0) {
      const m = visibleMsgs();
      [...m.children].slice(keep).forEach((c) => c.remove());
    },
    mine(text, cap) {
      visibleMsgs().insertAdjacentHTML(
        "beforeend",
        `<div class="mine rp-msg" data-cap="${cap ?? ""}"><div class="bubble">${text}</div><div class="msg-meta"><span class="receipt">Seen · now</span></div></div>`,
      );
    },
    agent(id, html, { cap = "", title = true, acts = [], time = "now", grouped = false } = {}) {
      const a = AG[id];
      const who = grouped ? "" : `<div class="who"><b>${a.name}</b>${title ? `<span>${a.role}</span>` : ""}</div>`;
      const buttons = acts.length ? `<div class="ask-acts">${acts.map((b, i) => `<button type="button" class="btn ${i === 0 ? "secondary" : "tertiary"}" data-cap="${cap}-btn${i}">${b}</button>`).join("")}</div>` : "";
      visibleMsgs().insertAdjacentHTML(
        "beforeend",
        `<div class="msg rp-msg" data-hue="${a.hue}" data-who="${id}" data-cap="${cap}"><span class="av" aria-hidden="true" style="--s:32px;--b:14px">${avatarSVG(a)}</span><div class="stackb">${who}<div class="bubble"><p>${html}</p></div>${buttons}${meta(time)}</div></div>`,
      );
    },
    sys(text, cap) {
      visibleMsgs().insertAdjacentHTML("beforeend", `<div class="sys" data-cap="${cap ?? ""}"><span>${text}</span></div>`);
    },
    bottom() {
      const m = visibleMsgs();
      let s = m;
      while (s && s.scrollHeight <= s.clientHeight + 2) s = s.parentElement;
      if (s) s.scrollTop = s.scrollHeight;
    },
    rename(pairs) {
      const w = document.createTreeWalker(document.getElementById("app"), NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) for (const [a, b] of pairs) if (n.nodeValue.includes(a)) n.nodeValue = n.nodeValue.split(a).join(b);
    },
    // Drop prototype content that belongs to its own demo story, not ours.
    tidy() {
      document.querySelectorAll("#app .debate").forEach((e) => e.parentElement.remove());
      document.querySelectorAll("#app .sys").forEach((e) => /debating where Stop/.test(e.textContent) && e.remove());
    },
    tag(selector, cap) {
      const el = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (el) el.setAttribute("data-cap", cap);
    },
  };
};

const ROUTE = (h) => `location.hash = ${JSON.stringify(h)};`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const COMMON = `__cap.rename([["Eucas app","Bakery site"],["InterviewKit","Catering menu"],["PR #44 open, waiting for Karim","order page done"]]); __cap.tidy();`;

// Atlas's conversation, built up one message at a time (shots ask-0 .. ask-6).
const TALK = [
  `__cap.mine("I want a website for my bakery, so people can order online.", "u1");`,
  `__cap.agent("atlas", "love it. two quick questions, so the team builds the right thing.", {cap:"a1"});
   __cap.agent("atlas", "who will order: your regulars, new customers, or both?", {cap:"q1", acts:["Regulars","New customers","Both"], grouped:true});`,
  `__cap.mine("Both.", "u2");`,
  `__cap.agent("atlas", "should they pay online, or when they pick up?", {cap:"q2", acts:["Online","At pickup"]});`,
  `__cap.mine("Online, and let them choose a pickup time.", "u3");`,
  `__cap.agent("atlas", "got it. i'm setting up your team: <b>Maya</b> plans it, <b>Noor</b> builds it, <b>Jade</b> tests it, <b>Karim</b> reviews it. nothing goes live until you say so.", {cap:"a3", acts:["Start the team"]});`,
];
const homeFirst = `${ROUTE("home-first")}`;
const ONE_THING = `__cap.rename([["6 things need you","1 thing needs you"],["2 things need you","1 thing needs you"]]);`;
const talkPrep = `document.querySelectorAll(".msgs .ask-acts, .msgs .sugg, .msgs [class*=chips]").forEach(e => e.remove()); ${COMMON}`;

const TEAM_1 = `__cap.clear(); __cap.msgs().insertAdjacentHTML("beforeend", '<div class="day">Today</div>');
  __cap.sys("Atlas set up the Bakery site team · Maya, Noor, Jade and Karim", "sys1");
  __cap.agent("maya", "plan's ready: menu page, order form, pickup times, payments. order form first.", {cap:"maya", time:"09:02"});
  __cap.agent("noor", "on it. building the order form now.", {cap:"noor", time:"09:03"});
  __cap.agent("jade", "i'll write the checkout tests while Noor builds.", {cap:"jade", time:"09:03"});
  __cap.agent("karim", "and i review every change before it merges.", {cap:"karim", time:"09:04"});`;
const TEAM_2 = `__cap.sys("Maya handed B-2 Order form to Noor · Look inside", "sys2");
  __cap.agent("noor", "order form's done: 2 croissants, pickup at 8:30, paid. PR is open.", {cap:"noor2", time:"09:31"});
  __cap.agent("karim", "reviewed. one small fix, then merged.", {cap:"karim2", time:"09:36"});
  __cap.agent("jade", "checkout tests: 32 of 32 passed.", {cap:"jade2", time:"09:38"});`;

const SHOTS = {
  "talk-0": [homeFirst, talkPrep, `__cap.tag("#askIn", "composer"); __cap.tag(document.querySelector(".msgs .msg"), "greet");`],
  "talk-1": [homeFirst, talkPrep, `const t=document.querySelector("#askIn"); t.value="I want a website for my bakery, so people can order online."; t.dispatchEvent(new Event("input",{bubbles:true})); __cap.tag("#askIn","composer");`],
  ...Object.fromEntries(
    TALK.map((_, i) => [`ask-${i + 1}`, [homeFirst, talkPrep, TALK.slice(0, i + 1).join("\n"), `__cap.bottom();`]]),
  ),
  "team-1": [ROUTE("team"), COMMON, TEAM_1, `__cap.bottom();`],
  "team-2": [ROUTE("team"), COMMON, TEAM_1, TEAM_2, `__cap.bottom();`],
  "board-1": [ROUTE("project-bench"), COMMON],
  "board-2": [
    `__board([["B-6","Order emails","noor"]], [["B-5","Payments","karim","review"],["B-4","Pickup times","noor","working"]], [["B-0","Plan and pages","maya"],["B-1","Site setup","karim"],["B-3","Menu page","maya"],["B-2","Order form","noor"],["B-7","Checkout tests","jade"]]);`,
    ROUTE("project-bench"),
    COMMON,
  ],
  "test-1": [ROUTE("home"), `H.done.add("e2e"); H.openKey = "stoptest"; openNeeds();`, COMMON, ONE_THING, `__cap.tag('#needsList .tk[data-k="stoptest"]', "card"); __cap.tag([...document.querySelectorAll("#needsList button")].find(b => /Start testing/.test(b.textContent)), "start");`],
  "test-2": [ROUTE("home"), `H.done.add("e2e"); H.openKey = "stoptest"; openNeeds();`, COMMON, `[...document.querySelectorAll("#needsList button")].find(b => /Start testing/.test(b.textContent)).click();`, 900, `__cap.tag('#needsList .tk[data-k="stoptest"]', "card");`],
  green: [ROUTE("agent-green"), COMMON, `__cap.clear(); __cap.msgs().insertAdjacentHTML("beforeend", '<div class="day">Today</div>');
    __cap.mine("Tested it: ordered 2 croissants for 8:30 and paid with the test card. Works.", "u1");
    __cap.agent("noor", "thanks. that's the flow end to end. i kept your order as a sample on the menu page.", {cap:"noor", time:"09:44"});
    __cap.sys("All green · your test, Jade's 32 checks, Karim's review", "green");`, `__cap.bottom();`],
  "deploy-1": [ROUTE("home"), `H.done.add("stoptest"); H.openKey = "e2e"; openNeeds();`, COMMON, ONE_THING, `__cap.tag('#needsList .tk[data-k="e2e"]', "card"); __cap.tag([...document.querySelectorAll("#needsList button")].find(b => /Put it live/.test(b.textContent)), "golive");`],
  "deploy-2": [ROUTE("home"), `H.done.add("stoptest"); H.openKey = "e2e"; openNeeds();`, COMMON, `resolveTicket(document.querySelector("#needsList"), "e2e", "allow", "<b>Live.</b> The bakery site is live at bakery-site.app. One click rolls it back.", null);`, 900, COMMON],
  live: [homeFirst, talkPrep, `__cap.clear(1); __cap.agent("atlas", "the bakery site is live at <b>bakery-site.app</b>. you approved it at 09:47. first order came in at 09:52.", {cap:"live", time:"09:52"});`, `__cap.bottom();`],
};

async function main() {
  const only = process.argv[2];
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--hide-scrollbars"] });
  try {
    for (const [name, steps] of Object.entries(SHOTS)) {
      if (only && name !== only) continue;
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
      await page.goto(URL, { waitUntil: "networkidle0" });
      await page.evaluate(SETUP);
      for (const step of steps) {
        if (typeof step === "number") await wait(step);
        else {
          await page.evaluate(step);
          await wait(500);
        }
      }
      await page.evaluate(() => document.fonts.ready);
      await wait(700);
      const boxes = await page.evaluate(() =>
        Object.fromEntries(
          [...document.querySelectorAll("[data-cap]")]
            .filter((e) => e.getAttribute("data-cap") && e.offsetParent !== null)
            .map((e) => {
              const r = e.getBoundingClientRect();
              return [e.getAttribute("data-cap"), { x: r.x, y: r.y, w: r.width, h: r.height }];
            }),
        ),
      );
      await page.screenshot({ path: path.join(OUT, `${name}.png`) });
      fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(boxes, null, 1));
      console.log(name, Object.keys(boxes).join(" "));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  // Every shot's boxes as one typed module, so the video can aim the camera, cursor and labels at real elements.
  const all = Object.fromEntries(
    fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).sort().map((f) => [f.slice(0, -5), JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8"))]),
  );
  fs.writeFileSync(
    path.resolve("src/boxes.ts"),
    `// Generated by scripts/capture.mjs: element boxes (CSS px on a 1920x1080 screen) per captured shot.
export const BOXES = ${JSON.stringify(all, null, 1)} as const;
`,
  );
}

main();
