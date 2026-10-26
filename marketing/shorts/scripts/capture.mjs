// Captures the notch prototype's real screens for the short videos, with the boxes the camera aims at.
//   PUPPETEER_CORE=<path to puppeteer-core> node scripts/capture.mjs [routes...]
// Writes public/screens/<route>.png (3840x2160), public/screens/<route>@top.png (the notch and panel area at 4x, so
// close-ups stay sharp; both gitignored) and src/boxes.json (CSS px on a 1920x1080 desktop).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const BROWSER = process.env.BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.resolve(here, "../public/screens");
const BOXES = path.resolve(here, "../src/boxes.json");
const FILE = pathToFileURL(path.resolve(here, "../../../docs/design/ui/companion/prototype/notch.html")).href;

export const ROUTES = [
  "n-rest", "n-working", "n-arrive", "n-peek", "n-trip", "n-pleased",
  "p-needs", "p-trip", "p-rules", "p-retro", "p-suggest", "p-rules-draft", "p-learned", "p-undo",
  "p-sent", "p-sent-sample", "p-account", "p-same", "p-usage", "p-budget", "p-caught",
  "s-welcome", "s-create", "s-create-born", "s-retro", "s-lock", "s-uac", "s-test", "s-signin", "s-signin-code",
  "s-rules", "s-sent", "s-sent-sample", "s-done",
  "n-trip-quiet", "p-trip-quiet",
];
// Social images show a stop with Concerned eyes and no red "Stopped" marker, as the website does (DESIGN §13).
const QUIET = { "n-trip-quiet": "n-trip", "p-trip-quiet": "p-trip" };
// Must match TOP in src/Short.tsx.
const TOP = { x: 560, y: 0, width: 800, height: 720 };
const SEL = { notch: ".notch", peek: ".peek", panel: ".panel", setup: ".swin", body: ".s-body", uac: ".uac", hero: ".create .stage" };

const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const boxes = fs.existsSync(BOXES) ? JSON.parse(fs.readFileSync(BOXES, "utf8")) : {};
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
for (const route of ROUTES) {
  if (only.length && !only.includes(route)) continue;
  await page.goto(`${FILE}?${new URLSearchParams({ r: QUIET[route] ?? route, bar: "0", freeze: "1" })}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // The sample project is "bench", our old codename; in marketing it reads as jargon, so it's web-app (DESIGN §13.2).
  await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) n.nodeValue = n.nodeValue.replace(/\bbench\b/g, "web-app");
  });
  if (QUIET[route]) await page.addStyleTag({ content: ".notch .marker { display: none !important; } .notch { width: 124px !important; justify-content: center !important; }" });
  await new Promise(r => setTimeout(r, 600));
  const b = {};
  for (const [k, sel] of Object.entries(SEL)) {
    const el = await page.$(sel);
    const bb = el && (await el.boundingBox());
    if (bb && bb.width > 4 && bb.height > 4) b[k] = [bb.x, bb.y, bb.width, bb.height].map(v => Math.round(v));
  }
  b.face = await page.evaluate(() => document.querySelector(".notch .eyes, .eyes")?.dataset.x ?? null);
  boxes[route] = b;
  await page.screenshot({ path: path.join(OUT, `${route}.png`) });
  if (!route.startsWith("s-")) {
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 4 });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT, `${route}@top.png`), clip: TOP });
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  }
  console.log(route, JSON.stringify(b));
}
fs.writeFileSync(BOXES, JSON.stringify(boxes, null, 1) + "\n");
await browser.close();
