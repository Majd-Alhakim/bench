// Electron equivalent of the Tauri notch for the SP-ST1 comparison: transparent, frameless, always-on-top,
// non-focusable, top-centre, with the same page and a 30 Hz cursor feed (EL_FAKE_CURSOR circles it instead).
const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("node:path");
app.whenReady().then(() => {
  const d = screen.getPrimaryDisplay();
  const w = 260, h = 44;
  const notch = new BrowserWindow({
    width: w, height: h, x: Math.round(d.workArea.x + (d.workArea.width - w) / 2), y: d.bounds.y,
    transparent: true, frame: false, alwaysOnTop: true, skipTaskbar: true, focusable: false, resizable: false, show: false,
    webPreferences: { preload: path.join(__dirname, "notch-preload.js"), sandbox: true, contextIsolation: true },
  });
  notch.loadFile(path.join(__dirname, "..", "tauri-tray", "ui", "notch.html"));
  notch.once("ready-to-show", () => notch.showInactive());
  const panel = new BrowserWindow({ width: 380, height: 420, show: false, frame: false, alwaysOnTop: true, skipTaskbar: true });
  panel.loadFile(path.join(__dirname, "..", "tauri-tray", "ui", "panel.html"));
  let t = 0, last = "";
  setInterval(() => {
    let p = screen.getCursorScreenPoint();
    if (process.env.EL_FAKE_CURSOR) { t += 0.1; p = { x: d.bounds.width / 2 + 300 * Math.cos(t), y: 250 + 150 * Math.sin(t) }; }
    const k = `${p.x},${p.y}`;
    if (k !== last) { last = k; notch.webContents.send("cursor", [p.x - (notch.getBounds().x + w / 2), p.y - h / 2]); }
  }, 33);
  globalThis.keep = { notch, panel };
});
app.on("window-all-closed", (e) => e.preventDefault());
