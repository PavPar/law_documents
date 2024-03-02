import { Dree } from "dree";
import { IPC_HANDLES } from "../../../app/constants";

// import { ipcRenderer } from "electron";
const { ipcRenderer } = window.require("electron");

export function openFileDialog(): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke(IPC_HANDLES.OPEN_DIRECTORY_DIALOG);
}

export function getDirectoryTree(): Promise<Dree> {
  return ipcRenderer.invoke(IPC_HANDLES.GET_DIRECTORY_TREE);
}

export function displayImageByPath(path: string): Promise<string> {
  return ipcRenderer.invoke(IPC_HANDLES.DISPLAY_IMAGE_DATA_BY_PATH, path);
}
