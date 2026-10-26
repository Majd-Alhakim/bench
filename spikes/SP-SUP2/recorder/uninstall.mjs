// One-command uninstall of the SP-SUP2 recorder. Removes only the hook entries that point at sup2-recorder (anything
// else in settings.json, including edits made after install, stays), then deletes the recorder copy.
// Recordings stay in %LOCALAPPDATA%\Eucas\sup2-recordings\ unless you add --purge.
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const HOME = process.env.EUCAS_SUP2_HOME ?? join(process.env.LOCALAPPDATA, "Eucas", "sup2-recorder");
const RECORDINGS = process.env.EUCAS_SUP2_DIR ?? join(process.env.LOCALAPPDATA, "Eucas", "sup2-recordings");
const manifest = existsSync(join(HOME, "install.json")) ? JSON.parse(readFileSync(join(HOME, "install.json"), "utf8")) : null;
const ci = process.argv.indexOf("--config-dir");
const settingsPath = ci >= 0 ? join(process.argv[ci + 1], "settings.json") : (manifest?.settingsPath ?? join(homedir(), ".claude", "settings.json"));

const ours = (h) => JSON.stringify(h).includes("sup2-recorder");
if (existsSync(settingsPath)) {
  const s = JSON.parse(readFileSync(settingsPath, "utf8"));
  let removed = 0;
  for (const [event, groups] of Object.entries(s.hooks ?? {})) {
    const kept = [];
    for (const g of groups) {
      const hooks = (g.hooks ?? []).filter((h) => !(ours(h) && ++removed));
      if (hooks.length) kept.push({ ...g, hooks });
    }
    if (kept.length) s.hooks[event] = kept;
    else delete s.hooks[event];
  }
  if (s.hooks && Object.keys(s.hooks).length === 0) delete s.hooks;
  writeFileSync(settingsPath, JSON.stringify(s, null, 2));
  console.log(`Removed ${removed} recorder hook(s) from ${settingsPath}`);
}
const SAFE_PARENT = process.env.EUCAS_SUP2_HOME ? join(process.env.EUCAS_SUP2_HOME, "..") : join(process.env.LOCALAPPDATA, "Eucas");
if (HOME.startsWith(SAFE_PARENT + "\\") && existsSync(HOME)) rmSync(HOME, { recursive: true, force: true });
console.log(`Removed ${HOME}`);
if (process.argv.includes("--purge")) {
  if (RECORDINGS.startsWith(SAFE_PARENT + "\\")) rmSync(RECORDINGS, { recursive: true, force: true });
  console.log(`Deleted recordings in ${RECORDINGS}`);
} else console.log(`Recordings kept in ${RECORDINGS} (add --purge to delete them)`);
