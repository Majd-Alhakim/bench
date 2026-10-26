// Gives notch.html the same window.__TAURI__ surface it uses in Tauri, backed by Electron IPC.
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("__TAURI__", {
  event: { listen: (name, cb) => ipcRenderer.on(name, (_e, payload) => cb({ payload })) },
  core: { invoke: async () => null },
});
