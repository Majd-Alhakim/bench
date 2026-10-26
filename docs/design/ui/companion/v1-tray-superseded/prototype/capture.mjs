// Renders every key state of companion.html with headless Edge and saves PNGs to ../screens/.
//   node docs/design/ui/companion/prototype/capture.mjs              # every shot
//   node docs/design/ui/companion/prototype/capture.mjs today usage  # only shots whose name contains a word
// Needs puppeteer-core: set PUPPETEER_CORE to its folder, or have it resolvable from here.
// Shots are taken with ?bar=0 (no demo bar) and ?freeze=1 (no live ticks), so they are stable.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const EDGE = process.env.EDGE ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = process.env.OUT ?? path.resolve(here, "../screens");
const FILE = pathToFileURL(path.join(here, "companion.html")).href;

// [name, route, {w, h, theme, os, query, wait}]
const D = { w: 1440, h: 900 };
const SHOTS = [
  ["fr-1-install-d1440", "fr-install"],
  ["fr-2-welcome-d1440", "fr-welcome"],
  ["fr-3-building-d1440", "fr-building"],
  ["fr-4-retro-d1440", "fr-retro"],
  ["fr-5-protect-d1440", "fr-protect"],
  ["fr-6-uac-d1440", "fr-uac"],
  ["fr-7-writing-d1440", "fr-writing"],
  ["fr-8-canary-d1440", "fr-canary"],
  ["fr-9-protected-d1440", "fr-protected"],
  ["fr-edge-j-canary-not-blocked-d1440", "fr-edge-j"],
  ["fr-edge-d-org-policy-d1440", "fr-edge-d"],
  ["fr-edge-h-weaker-d1440", "fr-edge-h"],
  ["fr-edge-f-thin-history-d1440", "fr-edge-f"],
  ["tray-states-d1440", "sheet-tray"],
  ["popover-needs-d1440", "popover"],
  ["popover-calm-d1440", "popover-calm"],
  ["popover-empty-d1440", "popover-empty"],
  ["popover-not-guarded-d1440", "popover-off"],
  ["popover-not-verified-d1440", "popover-unverified"],
  ["popover-paused-d1440", "popover-paused"],
  ["popover-125-d1440", "popover-125"],
  ["popover-150-d1440", "popover-150"],
  ["tray-menu-d1440", "menu"],
  ["toasts-sheet-d1440", "sheet-toasts"],
  ["today-d1440", "today"],
  ["today-d1280", "today", { w: 1280, h: 800 }],
  ["today-caught-up-d1440", "today-caught-up"],
  ["today-empty-d1440", "today-empty"],
  ["today-error-d1440", "today-error"],
  ["rules-d1440", "rules"],
  ["rules-limits-d1440", "rules-limits"],
  ["rules-add-runner-d1440", "rules-add"],
  ["protection-d1440", "protection"],
  ["protection-d1280", "protection", { w: 1280, h: 800 }],
  ["protection-receipt-d1440", "protection-row"],
  ["usage-d1440", "usage"],
  ["usage-d1280", "usage", { w: 1280, h: 800 }],
  ["usage-tokens-only-d1440", "usage-tokens"],
  ["usage-api-d1440", "usage-api"],
  ["retro-d1440", "retro"],
  ["settings-d1440", "settings"],
  ["settings-reads-d1440", "settings-reads"],
  ["settings-diagnostic-d1440", "settings-diagnostic"],
  ["settings-turn-off-d1440", "settings-protection"],
  ["settings-remove-d1440", "settings-remove"],
  ["worst-tripwire-live-d1440", "tripwire-live"],
  ["worst-tripwire-stopped-d1440", "tripwire-stopped"],
  ["worst-tripwire-toast-d1440", "tripwire-toast", { wait: 900 }],
  ["worst-not-guarded-d1440", "guard-off"],
  ["worst-not-guarded-protection-d1440", "guard-off-protection"],
  ["worst-fail-closed-d1440", "fail-closed"],
  ["worst-protection-off-d1440", "protection-off"],
  ["worst-not-verified-d1440", "not-verified"],
  ["worst-user-level-d1440", "user-level"],
  ["worst-org-blocked-d1440", "org-blocked"],
  ["worst-same-file-d1440", "same-file"],
  ["worst-usage-limit-d1440", "usage-limit"],
  ["pro-usage-forecast-d1440", "pro-usage"],
  ["pro-fourth-session-d1440", "pro-sessions"],
  ["pro-supervisor-d1440", "pro-supervisor"],
  ["pro-retro-d1440", "pro-retro"],
  ["pro-about-d1440", "pro-about"],
  // Light (app theme light, Windows light)
  ["today-l1440", "today", { theme: "light", os: "light" }],
  ["popover-needs-l1440", "popover", { theme: "light", os: "light" }],
  ["protection-l1440", "protection", { theme: "light", os: "light" }],
  ["usage-l1440", "usage", { theme: "light", os: "light" }],
  ["rules-l1440", "rules", { theme: "light", os: "light" }],
  ["fr-4-retro-l1440", "fr-retro", { theme: "light", os: "light" }],
  ["fr-9-protected-l1440", "fr-protected", { theme: "light", os: "light" }],
  ["worst-tripwire-stopped-l1440", "tripwire-stopped", { theme: "light", os: "light" }],
  ["toasts-sheet-l1440", "sheet-toasts", { theme: "light", os: "light" }],
  // Mixed: dark app on a light Windows taskbar (they follow different themes)
  ["popover-needs-d-oslight1440", "popover", { os: "light" }],
];

const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
let n = 0;
for (const [name, route, o = {}] of SHOTS) {
  if (only.length && !only.some(w => name.includes(w))) continue;
  const { w, h } = { ...D, ...o };
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const q = new URLSearchParams({ bar: "0", freeze: "1" });
  if (o.theme) q.set("theme", o.theme);
  if (o.os) q.set("os", o.os);
  await page.goto("about:blank");
  await page.goto(`${FILE}?${q}#${route}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, o.wait ?? 700));
  await page.screenshot({ path: path.join(OUT, name + ".png") });
  n++;
}
await browser.close();
console.log(`${n} screens → ${OUT}`);
if (errors.length) { console.log("Page errors:\n" + [...new Set(errors)].join("\n")); process.exitCode = 1; }
