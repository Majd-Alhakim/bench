// One-command install of the SP-SUP2 recorder into a Claude Code profile (default: your own ~/.claude).
//   node install.mjs --dry-run        show exactly what would change, write nothing
//   node install.mjs                  install
//   node install.mjs --config-dir D   install into another profile (used for testing in a scratch profile)
// It copies the recorder to %LOCALAPPDATA%\Eucas\sup2-recorder\, backs up settings.json next to itself, and adds two
// async, observational hooks (Stop, Notification) that run `node record.mjs`. Nothing else in settings.json changes.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const ci = args.indexOf("--config-dir");
const configDir = ci >= 0 ? args[ci + 1] : (process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"));
const settingsPath = join(configDir, "settings.json");
const HOME = process.env.EUCAS_SUP2_HOME ?? join(process.env.LOCALAPPDATA, "Eucas", "sup2-recorder");
const RECORDINGS = process.env.EUCAS_SUP2_DIR ?? join(process.env.LOCALAPPDATA, "Eucas", "sup2-recordings");
const here = dirname(fileURLToPath(import.meta.url));

const hook = { type: "command", command: process.execPath, args: [join(HOME, "record.mjs")], async: true, timeout: 15 };
const added = { Stop: [{ hooks: [hook] }], Notification: [{ hooks: [hook] }] };

const before = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, "utf8")) : {};
if (JSON.stringify(before.hooks ?? {}).includes("sup2-recorder")) {
  console.log("Already installed in", settingsPath);
  process.exit(0);
}
const after = structuredClone(before);
after.hooks ??= {};
for (const [event, groups] of Object.entries(added)) after.hooks[event] = [...(after.hooks[event] ?? []), ...groups];

console.log(`Profile: ${settingsPath}`);
console.log(`Recorder copied to: ${HOME} (record.mjs, scrub.mjs)`);
console.log(`Recordings written to: ${RECORDINGS}`);
console.log(`Backup: ${settingsPath}.eucas-sup2-backup`);
console.log("Hooks added (async: Claude Code never waits for them; they never block):");
console.log(JSON.stringify(added, null, 2));
if (dry) {
  console.log("\nDry run: nothing written.");
  process.exit(0);
}
mkdirSync(HOME, { recursive: true });
mkdirSync(RECORDINGS, { recursive: true });
for (const f of ["record.mjs", "scrub.mjs", "uninstall.mjs", "status.mjs"]) copyFileSync(join(here, f), join(HOME, f));
if (existsSync(settingsPath)) copyFileSync(settingsPath, `${settingsPath}.eucas-sup2-backup`);
writeFileSync(settingsPath, JSON.stringify(after, null, 2));
writeFileSync(join(HOME, "install.json"), JSON.stringify({ settingsPath, installedAt: new Date().toISOString(), events: Object.keys(added) }, null, 2));
console.log("\nInstalled. New and resumed sessions record from now on (running sessions pick it up within a few seconds).");
console.log(`Uninstall: node "${join(HOME, "uninstall.mjs")}"`);
