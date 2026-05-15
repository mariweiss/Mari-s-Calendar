const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 214,
    height: 268,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("resize-window", (event, width, height) => {
  if (win) {
    win.setResizable(true);
    win.setSize(width, height);
    win.setResizable(false);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
