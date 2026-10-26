// Captures the notch prototype's real screens as 2x WebP cut-outs for the landing page.
//   PUPPETEER_CORE=<path to puppeteer-core> node apps/landing/scripts/capture-screens.mjs [names...]
// The prototype is docs/design/ui/companion/prototype/notch.html; shots use ?bar=0&freeze=1 so they're stable.
// The wallpaper and the windows behind are hidden, so every cut-out has a transparent background.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const BROWSER = process.env.BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = process.env.OUT ?? path.resolve(here, "../public/screens");
const FILE = pathToFileURL(path.resolve(here, "../../../docs/design/ui/companion/prototype/notch.html")).href;

// [file name, route, what to capture, themes]. A selector captures that element; `top: [w, h]` captures a box of
// that size at the top centre of the screen. The notch states on the page are drawn in CSS to the eye grammar.
const SHOTS = [
  ["needs", "p-needs", { sel: ".panel" }],
  ["usage", "p-usage", { sel: ".panel" }],
  ["rules", "p-rules", { sel: ".panel" }],
  ["tripwire", "p-trip", { sel: ".panel" }],
  ["same-file", "p-same", { sel: ".panel" }],
  ["sent", "s-sent", { sel: "figure.sent" }],
  ["founders", "p-account-founders", { sel: ".plan" }],
];
const HIDE = ".wall, .win, .setup-scrim, .taskbar, .tb { visibility: hidden !important; } .swin { visibility: visible !important; } html, body { background: transparent !important; }"
  // The shoulders and the ring join the notch to a black screen bezel; on the page there is none, so they read as hooks.
  + " .notch::before, .notch::after, .peek::before, .peek::after { display: none !important; } .notch, .peek { box-shadow: none !important; } .glow { display: none !important; }";

const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
for (const [name, route, what, themes = ["dark", "light"]] of SHOTS) {
  if (only.length && !only.includes(name)) continue;
  for (const theme of themes) {
    const q = new URLSearchParams({ r: route, bar: "0", freeze: "1", theme });
    await page.goto(`${FILE}?${q}`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: HIDE });
    await new Promise(r => setTimeout(r, 500));
    let clip;
    if (what.top) clip = { x: (1440 - what.top[0]) / 2, y: 0, width: what.top[0], height: what.top[1] };
    else {
      const el = await page.$(what.sel);
      if (!el) { console.warn(`no ${what.sel} on ${route}`); continue; }
      const b = await el.boundingBox();
      clip = { x: b.x, y: b.y, width: b.width, height: b.height };
    }
    const file = path.join(OUT, themes.length > 1 ? `${name}-${theme}.webp` : `${name}.webp`);
    await page.screenshot({ path: file, type: "webp", quality: 84, clip, omitBackground: true });
    console.log(path.relative(process.cwd(), file), `${Math.round(clip.width * 2)}x${Math.round(clip.height * 2)}`);
  }
}
await browser.close();
