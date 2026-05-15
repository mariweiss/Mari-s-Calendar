const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  close: () => ipcRenderer.send("close-app"),
  resizeWindow: (w, h) => ipcRenderer.send("resize-window", w, h)
});
