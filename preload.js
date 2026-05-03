const { contextBridge } = require("electron");
const { ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  close: () => ipcRenderer.send("close-app")
});