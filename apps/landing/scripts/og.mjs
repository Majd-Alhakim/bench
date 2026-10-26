// Renders public/og.png (1200 x 630) and public/apple-touch-icon.png from the running site (pnpm dev).
//   PUPPETEER_CORE=<path to puppeteer-core> node apps/landing/scripts/og.mjs [base url]
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const EDGE = process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = process.argv[2] ?? "http://127.0.0.1:8788";
const PUB = path.resolve(here, "../public");

const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setBypassCSP(true); // the site CSP blocks the inline tweaks below
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

// The share card: the hero, tightened to fit 1200 x 630.
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `
  .nav nav, .nav-end, .hero-actions, .hero-note { display: none !important; }
  .nav { padding-top: 40px; }
  .hero { padding-top: 40px; }
  h1 { font-size: 76px; }
  .lede { font-size: 24px; margin-top: 28px; max-width: 30ch; }
  .stage { margin-top: -120px; padding-top: 48px; }
` });
await page.screenshot({ path: path.join(PUB, "og.png") });

// The touch icon: the Quartet in colour on Ink, like the app icon.
await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0;background:#15171d;display:grid;place-items:center;height:180px">
  <svg viewBox="0 0 100 100" width="104" height="104"><path fill="#ff5f73" d="M4.8 25A20.2 20.2 0 1 1 45.2 25A20.2 20.2 0 1 1 4.8 25Z"/><path fill="#f2ab1d" d="M78.9 8.75L95.64 37.75A4.5 4.5 0 0 1 91.74 44.5L58.26 44.5A4.5 4.5 0 0 1 54.36 37.75L71.1 8.75A4.5 4.5 0 0 1 78.9 8.75Z"/><path fill="#3cc47c" d="M18 57L33 57A11 11 0 0 1 44 68L44 83A11 11 0 0 1 33 94L18 94A11 11 0 0 1 7 83L7 68A11 11 0 0 1 18 57Z"/><path fill="#e05cb4" d="M74.5 52.81C79.35 60.57 90.99 70.27 90.99 79.97C90.99 89.18 83.72 95 74.5 95C65.28 95 58.01 89.18 58.01 79.97C58.01 70.27 69.65 60.57 74.5 52.81Z"/></svg></body>`);
await page.screenshot({ path: path.join(PUB, "apple-touch-icon.png") });
await browser.close();
console.log("og.png and apple-touch-icon.png written");
