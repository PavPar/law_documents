import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPC_HANDLES } from "../../../app/constants";
import { displayImageByPath, getDirectoryTree, openFileDialog } from "./api";
import { Dree } from "dree";

export const openFileDialogThunk = createAsyncThunk(
  `project/${IPC_HANDLES.FILE_OPEN_DIALOG}`,
  async (items, thunkAPI) => {
    const response = await openFileDialog();
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
