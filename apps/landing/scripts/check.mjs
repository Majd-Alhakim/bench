// Renders the running site (npm run dev) in headless Edge: full-page screenshots in both themes at desktop and phone
// width, then fills and submits the waitlist form. Fails on console errors (CSP included) or a broken flow.
//   PUPPETEER_CORE=<path to puppeteer-core> node apps/landing/scripts/check.mjs [base url] [--no-flow]
// The flow needs the test site key in index.html and the test TURNSTILE_SECRET from .dev.vars.example (no secret = sign-ups refused).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const EDGE = process.env.BROWSER ?? process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const args = process.argv.slice(2);
const BASE = args.find(a => !a.startsWith("--")) ?? "http://127.0.0.1:8787";
const OUT = process.env.OUT ?? path.resolve(here, "../review");
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const errors = [];
const watch = page => {
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
};

const sizes = { desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
for (const [name, viewport] of Object.entries(sizes)) {
  for (const theme of ["dark", "light"]) {
    const page = await browser.newPage();
    watch(page);
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); } catch {} }, theme);
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(BASE + "/", { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    // Load every lazy picture before the full-page shot.
    await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach(i => { i.loading = "eager"; }));
    await page.waitForNetworkIdle();
    await page.screenshot({ path: path.join(OUT, `${name}-${theme}-fold.png`) });
    await page.screenshot({ path: path.join(OUT, `${name}-${theme}-full.jpg`), type: "jpeg", quality: 80, fullPage: true });
    await page.close();
  }
}

// The waitlist flow, with a test address on the local server.
if (!args.includes("--no-flow")) {
const page = await browser.newPage();
watch(page);
await page.setViewport(sizes.desktop);
await page.goto(BASE + "/?ref=reddit#join", { waitUntil: "networkidle0" });
await page.click("#email");
await page.type("#email", "not-an-email");
await new Promise(r => setTimeout(r, 1700));
await page.click("[data-submit]");
const bad = await page.$eval("[data-err]", el => el.textContent);
if (!bad) errors.push("no error shown for a bad email");
await page.click("#email", { clickCount: 3 });
await page.type("#email", `check+${Date.now()}@example.com`);
await page.click('input[value="claude-code"]');
await page.click('input[value="cursor"]');
await page.waitForFunction(() => !window.turnstile || window.turnstile.getResponse(), { timeout: 15000 }).catch(() => {});
await page.click("[data-submit]");
await page.waitForSelector('[data-step="2"]:not([hidden])', { timeout: 15000 });
await (await page.$("#join")).screenshot({ path: path.join(OUT, "flow-joined.png") });
await page.click('input[value="4-6"]');
await page.click('input[value="windows"]');
await page.click("[data-details]");
await page.waitForFunction(() => document.querySelector("[data-thanks]").textContent.startsWith("Thanks"), { timeout: 10000 });
console.log("flow: joined, answered:", await page.$eval("[data-thanks]", el => el.textContent));
}

await browser.close();
if (errors.length) { console.log("Errors:\n" + [...new Set(errors)].join("\n")); process.exitCode = 1; }
else console.log(`ok · screenshots in ${OUT}`);
