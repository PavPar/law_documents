import { Dree } from "dree";
import { IPC_HANDLES } from "../../../app/constants";
import {
  HandleCreateDirPayload,
  HandleCreateDirReturnVal,
} from "../../../app/ipcHandles/handleFunctions/createDirHandle";
import {
  HandleCreateFilePayload,
  HandleCreateFileResult,
} from "../../../app/ipcHandles/handleFunctions/createFileHandle";
import { HandleOpenFileDialogResult } from "../../../app/ipcHandles/handleFunctions/openFileDialogHandle";
import {
  HandleCopyFilesPayload,
  HandleCopyFilesResult,
} from "../../../app/ipcHandles/handleFunctions/copyFilesHandle";
import {
  HandleScanDirForImagesPayload,
  HandleScanDirForImagesResult,
} from "../../../app/ipcHandles/handleFunctions/scanDirForImagesHandle";
import {
  HandleFileReadPayload,
  HandleFileReadResult,
} from "../../../app/ipcHandles/handleFunctions/readFileHandle";
import {
  HandleFileWritePayload,
  HandleFileWriteResult,
} from "../../../app/ipcHandles/handleFunctions/writeFileHandle";

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

export function createFileByPath(
  payload: HandleCreateFilePayload
): Promise<HandleCreateFileResult> {
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

export function readFile(payload: HandleFileReadPayload) {
  return ipcRenderer.invoke(
    IPC_HANDLES.FILE_READ,
    payload
  ) as Promise<HandleFileReadResult>;
}

export function writeFile(payload: HandleFileWritePayload) {
  return ipcRenderer.invoke(
    IPC_HANDLES.FILE_WRITE,
    payload
  ) as Promise<HandleFileWriteResult>;
}

export function quitApp() {
  return ipcRenderer.invoke(IPC_HANDLES.APP_QUIT);
}
