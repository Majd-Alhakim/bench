// Drives the running Tauri spike over WebView2's CDP port with Playwright: finds both webviews, opens the flyout
// 20 times through the same command a tray click uses, and asks for a toast. Reads results from the spike's log.
import { chromium } from "./tauri-tray/node_modules/playwright-core/index.mjs";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const LOG = join(tmpdir(), "eucas-spikes", "st1", "log.jsonl");
const port = process.argv[2] ?? "9222";
const log = () => (existsSync(LOG) ? readFileSync(LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : []);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
const pages = browser.contexts().flatMap((c) => c.pages());
console.log("webviews:", pages.map((p) => p.url()));
const flyout = pages.find((p) => p.url().includes("flyout"));
const main = pages.find((p) => !p.url().includes("flyout"));
console.log("flyout heading via CDP:", await flyout.textContent("#h"));
console.log("main version via CDP:", await main.textContent("#v"));

const before = log().length;
for (let i = 0; i < 20; i++) {
  // Near the bottom-right of the work area, where the tray sits; the flyout's own blur hides it again.
  await main.evaluate(() => window.__TAURI__.core.invoke("show_flyout_at", { x: 1700, y: 1050 }));
  await sleep(400);
  await main.evaluate(() => window.__TAURI__.core.invoke("set_tray_state", { i: 0 }));
  await main.evaluate(() => window.__TAURI__.core.invoke("hide_flyout"));
  await sleep(300);
}
const frames = log().slice(before).filter((e) => e.kind === "flyout_first_frame").map((e) => e.ms_from_click);
frames.sort((a, b) => a - b);
console.log("flyout first frame ms (n, p50, p95, max):", frames.length, frames[Math.floor(frames.length / 2)], frames[Math.floor(frames.length * 0.95)], frames.at(-1));
console.log("placement:", log().filter((e) => e.kind === "flyout_place").at(-1));
if (process.argv.includes("--toast")) await main.evaluate(() => window.__TAURI__.core.invoke("toast"));
await browser.close();
