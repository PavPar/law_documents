import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPC_HANDLES } from "../../../app/constants";
import {
  createDirByPath,
  createFileByPath,
  displayImageByPath,
  getDirectoryTree,
  openFileOpenDialog,
  scanForImagesInDir,
} from "./api";
import { Dree } from "dree";
import { HandleCreateDirPayload } from "../../../app/ipcHandles/handleFunctions/createDirHandle";
import { HandleCreateFilePayload } from "../../../app/ipcHandles/handleFunctions/createFileHandle";
import { HandleScanDirForImagesPayload } from "../../../app/ipcHandles/handleFunctions/scanDirForImagesHandle";

export const openFileDialogThunk = createAsyncThunk(
  `project/${IPC_HANDLES.FILE_OPEN_DIALOG}`,
  async (items, thunkAPI) => {
    const response = await openFileOpenDialog();
    return response as Electron.OpenDialogReturnValue;
  }
);

export const getDirectoryTreeThunk = createAsyncThunk(
  `project/${IPC_HANDLES.GET_DIRECTORY_TREE}`,
  async (items, thunkAPI) => {
    const response = await getDirectoryTree();
    return response as Dree;
  }
);

export const displayImageByPathThunk = createAsyncThunk(
  `project/${IPC_HANDLES.DISPLAY_IMAGE_DATA_BY_PATH}`,
  async (path: string, thunkAPI) => {
    const response = await displayImageByPath(path);
    return response;
  }
);

export const createFileByPathThunk = createAsyncThunk(
  `project/${IPC_HANDLES.CREATE_FILE}`,
  async (payload: HandleCreateFilePayload) => {
    const response = await createFileByPath(payload);
    return response;
  }
);

export const createDirByPathThunk = createAsyncThunk(
  `project/${IPC_HANDLES.CREATE_DIR}`,
  async (payload: HandleCreateDirPayload) => {
    const response = await createDirByPath(payload);
    return response;
  }
);

export const scanForImagesInDirThunk = createAsyncThunk(
  `project/${IPC_HANDLES.SCAN_DIR_FOR_IMAGES}`,
  async (payload: HandleScanDirForImagesPayload) => {
    const response = await scanForImagesInDir(payload);
    return response;
  }
);
