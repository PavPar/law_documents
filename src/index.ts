/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain, dialog } from "electron";
const fs = require("fs");
// const { app, BrowserWindow, ipcMain, dialog } = require("electron");

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).

//https://github.com/ccfish86/sctalk/blob/beed9cda6fdad1641fceacde0f615826d9360a3b/clients/tt-rapido/main.js#L141
declare const MAIN_WINDOW_WEBPACK_ENTRY = "./root";
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      //https://stackoverflow.com/questions/35428639/how-can-i-use-fs-in-react-with-electron
      nodeIntegration: true,
      // enableRemoteModule: true, -- doesnt work
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
  });

  ipcMain.handle("file-dialog", async (event, someArgument) => {
    return dialog.showOpenDialog({
      properties: ["multiSelections", "openFile", "openDirectory"],
    });
  });

  //https://stackoverflow.com/questions/50781741/select-and-display-an-image-from-the-filesystem-with-electron
  ipcMain.handle("image-display", (event, arg) => {
    const result = dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    return result.then(({ canceled, filePaths, bookmarks }) => {
      const base64 = fs.readFileSync(filePaths[0]).toString("base64");
      return base64;
    });
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
