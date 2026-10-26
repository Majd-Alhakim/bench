// Captures the companion prototype's real screens as 2x WebP crops for the landing page.
//   PUPPETEER_CORE=<path to puppeteer-core> node apps/landing/scripts/capture-screens.mjs [names...]
// The prototype is docs/design/ui/companion/prototype/companion.html; shots use ?bar=0&freeze=1 so they're stable.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const EDGE = process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = process.env.OUT ?? path.resolve(here, "../public/screens");
const FILE = pathToFileURL(path.resolve(here, "../../../docs/design/ui/companion/prototype/companion.html")).href;

// [file name, route, CSS selector, crop inside that element in CSS px: [x, y, w, h] or null for all of it]
// The page shows cropped fragments, not whole windows (the window is 1040 x 720).
const SHOTS = [
  ["popover", "popover", ".flyout", null],
  ["tripwire", "tripwire-stopped", ".win", [308, 87, 641, 579]],
  ["same-file", "same-file", ".win", [228, 505, 798, 215]],
  ["usage", "usage", ".win", [228, 115, 798, 235]],
  ["rules", "rules", ".win", [228, 115, 798, 350]],
  ["retro", "retro", ".win", [607, 118, 425, 290]],
];
const THEMES = (process.env.THEMES ?? "dark,light").split(",");

const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
for (const [name, route, sel, crop] of SHOTS) {
  if (only.length && !only.includes(name)) continue;
  for (const theme of THEMES) {
    const q = new URLSearchParams({ bar: "0", freeze: "1", theme, os: theme });
    await page.goto("about:blank");
    await page.goto(`${FILE}?${q}#${route}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 900));
    const el = await page.$(sel);
    if (!el) { console.warn(`no ${sel} on ${route}`); continue; }
    const file = path.join(OUT, `${name}-${theme}.webp`);
    if (crop) {
      const box = await el.boundingBox();
      const [x, y, width, height] = crop;
      await page.screenshot({ path: file, type: "webp", quality: 82, clip: { x: box.x + x, y: box.y + y, width, height } });
    } else {
      await el.screenshot({ path: file, type: "webp", quality: 82 });
    }
    console.log(file);
  }
}
await browser.close();
