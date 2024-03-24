import { Dree } from "dree";
import { IPC_HANDLES } from "../../../app/constants";
import {
  HandleCreateDirPayload,
  HandleCreateDirReturnVal,
} from "../../../app/ipcHandles/handleFunctions/createDirHandle";
import { HandleCreateFilePayload } from "../../../app/ipcHandles/handleFunctions/createFileHandle";
import { HandleOpenFileDialogResult } from "../../../app/ipcHandles/handleFunctions/openFileDialogHandle";
import {
  HandleCopyFilesPayload,
  HandleCopyFilesResult,
} from "../../../app/ipcHandles/handleFunctions/copyFilesHandle";
import {
  HandleScanDirForImagesPayload,
  HandleScanDirForImagesResult,
} from "../../../app/ipcHandles/handleFunctions/scanDirForImagesHandle";

// import { ipcRenderer } from "electron";
const { ipcRenderer } = window.require("electron");

export function openDirDialog(): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke(IPC_HANDLES.OPEN_DIRECTORY_DIALOG);
}

export function getDirectoryTree(): Promise<Dree> {
  return ipcRenderer.invoke(IPC_HANDLES.GET_DIRECTORY_TREE);
}

export function displayImageByPath(path: string): Promise<string> {
  return ipcRenderer.invoke(IPC_HANDLES.DISPLAY_IMAGE_DATA_BY_PATH, path);
}

export function createFileByPath(payload: HandleCreateFilePayload) {
  return ipcRenderer.invoke(IPC_HANDLES.CREATE_FILE, payload);
}

export function createDirByPath(payload: HandleCreateDirPayload) {
  return ipcRenderer.invoke(
    IPC_HANDLES.CREATE_DIR,
    payload
  ) as Promise<HandleCreateDirReturnVal>;
}

export function openFileOpenDialog(): Promise<HandleOpenFileDialogResult> {
  return ipcRenderer.invoke(IPC_HANDLES.FILE_OPEN_DIALOG);
}

export function copyFiles(payload: HandleCopyFilesPayload) {
  return ipcRenderer.invoke(
    IPC_HANDLES.COPY_FILES,
    payload
  ) as Promise<HandleCopyFilesResult>;
}

export function scanForImagesInDir(payload: HandleScanDirForImagesPayload) {
  return ipcRenderer.invoke(
    IPC_HANDLES.SCAN_DIR_FOR_IMAGES,
    payload
  ) as Promise<HandleScanDirForImagesResult>;
}

export function openProjectOpenDialog(): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke(IPC_HANDLES.OPEN_PROJECT_DIALOG);
}
