// Renders the key states of notch.html with headless Edge and saves PNGs to ../screens/.
//   node docs/design/ui/companion/prototype/capture.mjs            # every shot
//   node docs/design/ui/companion/prototype/capture.mjs notch peek # only shots whose name contains a word
// Needs puppeteer-core: set PUPPETEER_CORE to its folder, or have it resolvable from here.
// Shots use ?bar=0 (no demo controls) and ?freeze=1 (no motion), so they are stable.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const EDGE = process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = process.env.OUT ?? path.resolve(here, "../screens");
const FILE = pathToFileURL(path.join(here, "notch.html")).href;

// [name, route, {w, h, theme, clip: [x, y, w, h] in CSS px around the top centre, scale}]
const TOP = (w, h) => ({ clipTop: [w, h], scale: 2 });
const SHOTS = [
  ["setup-1-welcome-d", "s-welcome"],
  ["setup-2-create-before-d", "s-create"],
  ["setup-2-create-born-d", "s-create-born"],
  ["setup-2-create-born-l", "s-create-born", { theme: "light" }],
  ["setup-3-retro-d", "s-retro"],
  ["setup-4-rules-d", "s-rules"],
  ["setup-4-rules-draft-d", "s-rules-draft"],
  ["setup-5-lock-d", "s-lock"],
  ["setup-5-uac-d", "s-uac"],
  ["setup-5-declined-d", "s-declined"],
  ["setup-6-test-d", "s-test"],
  ["setup-6-test-failed-d", "s-test-fail"],
  ["setup-7-privacy-d", "s-privacy"],
  ["setup-7-privacy-level2-d", "s-privacy-2"],
  ["setup-8-watching-d", "s-done"],
  ["setup-9-coach-d", "s-coach"],
  ["desk-working-d", "n-working"],
  ["desk-working-l", "n-working", { theme: "light" }],
  ["notch-sheet-d", "sheet-notch"],
  ["notch-sheet-l", "sheet-notch", { theme: "light" }],
  ["notch-rest-zoom", "n-rest", TOP(360, 70)],
  ["notch-working-zoom", "n-working", TOP(360, 70)],
  ["notch-marker-zoom", "n-marker", TOP(360, 70)],
  ["notch-off-zoom", "n-off", TOP(360, 70)],
  ["notch-trip-zoom", "n-trip", TOP(360, 70)],
  ["notch-doze-zoom", "n-doze", TOP(360, 70)],
  ["notch-thin-zoom", "n-thin", TOP(360, 70)],
  ["notch-thin-needs-zoom", "n-thin-needs", TOP(360, 70)],
  ["peek-needs-d", "n-peek", TOP(520, 300)],
  ["peek-calm-d", "n-peek-calm", TOP(520, 160)],
  ["peek-merge-d", "n-peek-merge", TOP(520, 200)],
  ["peek-off-d", "n-off-peek", TOP(520, 220)],
  ["peek-trip-d", "n-trip-peek", TOP(520, 260)],
  ["desk-peek-d", "n-peek"],
  ["desk-fullscreen-d", "n-fullscreen"],
  ["panel-needs-usage-d", "p-needs"],
  ["panel-needs-usage-l", "p-needs", { theme: "light" }],
  ["panel-needs-usage-d1280", "p-needs", { w: 1280, h: 800 }],
  ["panel-usage-d", "p-usage"],
  ["panel-merge-done-d", "p-merge-done"],
  ["panel-budget-d", "p-budget"],
  ["panel-rules-d", "p-rules"],
  ["panel-rules-l", "p-rules", { theme: "light" }],
  ["panel-rules-draft-d", "p-rules-draft"],
  ["panel-rules-unlocked-d", "p-rules-unlocked"],
  ["panel-settings-d", "p-settings"],
  ["panel-settings-l", "p-settings", { theme: "light" }],
  ["panel-edit-d", "p-edit"],
  ["panel-retro-d", "p-retro"],
  ["panel-same-file-d", "p-same"],
  ["panel-tripwire-d", "p-trip"],
  ["panel-not-protected-d", "p-off"],
  ["panel-fix-d", "p-fix"],
  ["panel-idle-d", "p-idle"],
  ["meter-sheet-d", "sheet-meter"],
  ["meter-sheet-l", "sheet-meter", { theme: "light" }],
  ["meter-empty-d", "m-empty"],
  ["plan-trial-d", "m-plan-trial"],
  ["plan-taste-d", "m-plan-taste"],
  ["tray-menu-d", "t-menu"]
];

const only = process.argv.slice(2);
const shots = only.length ? SHOTS.filter(([n]) => only.some(w => n.includes(w))) : SHOTS;
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
for (const [name, route, o = {}] of shots) {
  const w = o.w ?? 1440, h = o.h ?? 900;
  await page.setViewport({ width: w, height: h, deviceScaleFactor: o.scale ?? 1 });
  const q = new URLSearchParams({ r: route, bar: "0", freeze: "1", ...(o.theme ? { theme: o.theme } : {}) });
  await page.goto(`${FILE}?${q}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 250));
  const clip = o.clipTop ? { x: (w - o.clipTop[0]) / 2, y: 0, width: o.clipTop[0], height: o.clipTop[1] } : undefined;
  await page.screenshot({ path: path.join(OUT, `${name}.png`), clip });
  console.log(name);
}
await browser.close();
