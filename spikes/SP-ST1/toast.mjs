// For the manual checklist: asks the running spike app (started with its CDP port) to show a toast with two buttons.
// Run the app with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222, then `node toast.mjs`.
import { chromium } from "./tauri-tray/node_modules/playwright-core/index.mjs";

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const page = browser.contexts().flatMap((c) => c.pages()).find((p) => !p.url().includes("flyout") && !p.url().includes("notch"));
console.log(await page.evaluate(() => window.__TAURI__.core.invoke("toast").then(() => "toast sent", (e) => `error: ${e}`)));
await browser.close();
