/* eslint-disable @typescript-eslint/no-var-requires */
import { dialog, ipcMain } from "electron";
import { DREE_IMAGE_OPTIONS, IPC_HANDLES } from "../constants";
import { Dree } from "dree";
import { handleCreateFile } from "./handleFunctions/createFileHandle";
import { handleDirCreate } from "./handleFunctions/createDirHandle";
import { handleOpenFileDialog } from "./handleFunctions/openFileDialogHandle";
import { handleCopyFiles } from "./handleFunctions/copyFilesHandle";
import { handleScanDirForImages } from "./handleFunctions/scanDirForImagesHandle";
import { handleOpenProjectDialog } from "./handleFunctions/openProjectDialogHandle";
import { handleFileRead } from "./handleFunctions/readFileHandle";
import { handleFileWrite } from "./handleFunctions/writeFileHandle";
import { handleAppQuit } from "./handleFunctions/quitAppHandle";

export type CreateDirHandlePayload = {
  path: string;
  name: string;
};

export function ipcHandlersMain() {
  const fs = require("fs");
  const dree = require("dree");
  ipcMain.handle(
    IPC_HANDLES.OPEN_DIRECTORY_DIALOG,
    async (event, someArgument) => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        buttonLabel: "Выбрать",
        title: "Выбрать папку",
      });

      return result;
    }
  );

  ipcMain.handle(
    IPC_HANDLES.GET_DIRECTORY_TREE,
    async (event, someArgument) => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      if (result.filePaths && result.filePaths[0]) {
        const tree: Dree = dree.scan(result.filePaths[0], DREE_IMAGE_OPTIONS);

        return tree;
      }

      return;
    }
  );

  //https://stackoverflow.com/questions/50781741/select-and-display-an-image-from-the-filesystem-with-electron
  ipcMain.handle(IPC_HANDLES.DISPLAY_IMAGE, (event, arg) => {
    const result = dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    return result.then(({ canceled, filePaths, bookmarks }) => {
      const base64 = fs.readFileSync(filePaths[0]).toString("base64");
      return base64;
    });
  });

  ipcMain.handle(IPC_HANDLES.DISPLAY_IMAGE_DATA_BY_PATH, (event, path) => {
    return fs.readFileSync(path).toString("base64");
  });

  ipcMain.handle(IPC_HANDLES.FILE_OPEN_DIALOG, handleOpenFileDialog);
  ipcMain.handle(IPC_HANDLES.CREATE_FILE, handleCreateFile);
  ipcMain.handle(IPC_HANDLES.CREATE_DIR, handleDirCreate);
  ipcMain.handle(IPC_HANDLES.COPY_FILES, handleCopyFiles);
  ipcMain.handle(IPC_HANDLES.SCAN_DIR_FOR_IMAGES, handleScanDirForImages);
  ipcMain.handle(IPC_HANDLES.OPEN_PROJECT_DIALOG, handleOpenProjectDialog);
  ipcMain.handle(IPC_HANDLES.FILE_READ, handleFileRead);
  ipcMain.handle(IPC_HANDLES.FILE_WRITE, handleFileWrite);
  ipcMain.handle(IPC_HANDLES.APP_QUIT, handleAppQuit);
}
