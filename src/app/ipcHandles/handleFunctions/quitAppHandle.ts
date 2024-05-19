import { app } from "electron";

export type HandleOpenFileDialogResult = Electron.OpenDialogReturnValue;

export async function handleAppQuit() {
  app.quit();
}
