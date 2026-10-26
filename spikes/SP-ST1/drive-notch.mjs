// Drives the CR-011 notch without touching the real mouse, keyboard or screen: Playwright over WebView2 CDP for
// hover, click and Esc inside our own webviews, and the app's own Win32 probe for focus, shape and position.
import { chromium } from "./tauri-tray/node_modules/playwright-core/index.mjs";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const LOG = join(tmpdir(), "eucas-spikes", "st1", "log.jsonl");
const log = () => (existsSync(LOG) ? readFileSync(LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : []);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const pages = browser.contexts().flatMap((c) => c.pages());
const page = (name) => pages.find((p) => p.url().includes(name));
const notch = page("notch");
const panel = page("panel");
const main = pages.find((p) => p.url().endsWith("/"));

const probe = await main.evaluate(() => window.__TAURI__.core.invoke("notch_probe"));
console.log("probe:", JSON.stringify(probe, null, 1));

await notch.hover("#pill");
console.log("hover class after CDP hover:", await notch.evaluate(() => document.getElementById("pill").className));
await notch.mouse.move(1, 40);

const before = log().length;
for (let i = 0; i < 20; i++) {
  await notch.click("#pill");
  await sleep(250);
  await panel.keyboard.press(i % 2 ? "Escape" : "Escape");
  await sleep(150);
}
// Click-away: open, then give focus to another of our windows.
await notch.click("#pill");
await sleep(300);
await main.evaluate(() => window.__TAURI__.core.invoke("focus_elsewhere"));
await sleep(400);
await main.evaluate(() => window.__TAURI__.core.invoke("hide_main"));

const ev = log().slice(before);
const frames = ev.filter((e) => e.kind === "panel_first_frame").map((e) => e.ms).sort((a, b) => a - b);
const closed = ev.filter((e) => e.kind === "panel_closed").map((e) => e.by);
console.log("panel opens:", ev.filter((e) => e.kind === "panel_opened").length, "first frame ms p50/p95/max:", frames[Math.floor(frames.length / 2)], frames[Math.floor(frames.length * 0.95)], frames.at(-1));
console.log("panel closed by:", Object.entries(closed.reduce((a, b) => ((a[b] = (a[b] ?? 0) + 1), a), {})));
console.log("panel visible now:", await panel.evaluate(() => document.visibilityState));
await browser.close();
