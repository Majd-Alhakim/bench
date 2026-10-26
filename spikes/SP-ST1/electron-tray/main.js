// Electron hello-tray for the SP-ST1 footprint comparison: a tray icon and the same flyout page, pre-warmed hidden.
const { app, Tray, BrowserWindow, nativeImage } = require("electron");
const path = require("node:path");
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(path.join(__dirname, "..", "tauri-tray", "src-tauri", "icons", "guarded.png"));
  const tray = new Tray(icon);
  tray.setToolTip("Eucas: guarded (Electron)");
  const flyout = new BrowserWindow({ width: 360, height: 480, show: false, frame: false, skipTaskbar: true, webPreferences: { sandbox: true, contextIsolation: true } });
  flyout.loadFile(path.join(__dirname, "..", "tauri-tray", "dist", "flyout.html"));
  tray.on("click", () => flyout.show());
  globalThis.keep = { tray, flyout };
});
app.on("window-all-closed", (e) => e.preventDefault());
