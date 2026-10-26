// Updater round trip on loopback: installs 0.1.0 per-user, serves a signed manifest for 0.1.1, asks the running app
// to check (through CDP), and waits for 0.1.1 to start. `node updater.mjs tamper` serves a wrong signature instead,
// which must be refused. Uninstalls at the end.
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, existsSync, createReadStream, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "./tauri-tray/node_modules/playwright-core/index.mjs";

const ST = join(tmpdir(), "eucas-spikes", "st1");
const LOG = join(ST, "log.jsonl");
const tamper = process.argv[2] === "tamper";
const setup = (v) => join(ST, "rel", v, `Eucas ST1_${v}_x64-setup.exe`);
const sig = readFileSync(setup(tamper ? "0.1.0" : "0.1.1") + ".sig", "utf8");
const manifest = {
  version: "0.1.1",
  notes: "spike",
  pub_date: new Date().toISOString(),
  platforms: { "windows-x86_64": { signature: sig, url: "http://127.0.0.1:47120/setup-0.1.1.exe" } },
};
const hits = [];
const server = createServer((req, res) => {
  hits.push(req.url);
  if (req.url === "/latest.json") return res.end(JSON.stringify(manifest));
  if (req.url === "/setup-0.1.1.exe") return createReadStream(setup("0.1.1")).pipe(res);
  res.writeHead(404).end();
}).listen(47120, "127.0.0.1");

const installDir = join(process.env.LOCALAPPDATA, "Eucas ST1");
const exe = join(installDir, "eucas-st1.exe");
spawnSync("taskkill", ["/IM", "eucas-st1.exe", "/F"]);
rmSync(LOG, { force: true });
console.log("install 0.1.0:", spawnSync(setup("0.1.0"), ["/S"]).status, existsSync(exe));
spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: "--remote-debugging-port=9223" }, detached: true, stdio: "ignore" }).unref();
await new Promise((r) => setTimeout(r, 5000));
const t0 = Date.now();
const browser = await chromium.connectOverCDP("http://127.0.0.1:9223");
const page = browser.contexts().flatMap((c) => c.pages()).find((p) => !p.url().includes("flyout"));
const answer = await page.evaluate(() => window.__TAURI__.core.invoke("check_update").then((v) => `ok: ${v}`, (e) => `error: ${e}`)).catch((e) => `page gone (restarting?): ${e.message.split("\n")[0]}`);
console.log("check_update:", answer);
await browser.close().catch(() => {});
// Wait up to 60 s for a process to log start at 0.1.1.
let started = null;
for (let i = 0; i < 120 && !started; i++) {
  await new Promise((r) => setTimeout(r, 500));
  const log = existsSync(LOG) ? readFileSync(LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
  started = log.find((e) => e.kind === "start" && e.version === "0.1.1");
}
console.log({ tamper, served: hits, restartedAt011: Boolean(started), secondsToNewVersion: started ? ((Date.now() - t0) / 1000).toFixed(1) : null });
console.log("events:", existsSync(LOG) ? readFileSync(LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l).kind + (JSON.parse(l).version ? "@" + JSON.parse(l).version : "")).join(" ") : "");
spawnSync("taskkill", ["/IM", "eucas-st1.exe", "/F"]);
const un = join(installDir, "uninstall.exe");
console.log("uninstall:", existsSync(un) ? spawnSync(un, ["/S"]).status : "no uninstaller");
server.close();
