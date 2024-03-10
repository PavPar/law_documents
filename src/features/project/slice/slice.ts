import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  displayImageByPathThunk,
  getDirectoryTreeThunk,
  openFileDialogThunk,
} from "./thunks";
import { FetchStatus } from "../../../app/constants";
import { RootState } from "../../../app/store";
import { getDirectoryTree } from "./api";
import { Dree } from "dree";

type State = {
  projectPath?: string;
  filePaths?: string[];
  files?: Dree;
  status: FetchStatus;
  displayImageStatus: FetchStatus;
  data?: string;
};

const initialState: State = {
  status: "idle",
  displayImageStatus: "idle",
};

type SetRootDirPayload = State["projectPath"];

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setRootDir: (state: State, action: PayloadAction<SetRootDirPayload>) => {
      state.projectPath = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openFileDialogThunk.pending, (state, action) => {
      state.status = "pending";
      state.filePaths = [];
    });
    builder.addCase(openFileDialogThunk.fulfilled, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
      state.filePaths = action.payload.filePaths;
    });
    builder.addCase(openFileDialogThunk.rejected, (state, action) => {
      state.status = "failed";
    });
    // get directory tree
    builder.addCase(getDirectoryTreeThunk.pending, (state, action) => {
      state.status = "pending";
      state.files = initialState?.files;
    });
    builder.addCase(getDirectoryTreeThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.files = action.payload;
    });
    builder.addCase(getDirectoryTreeThunk.rejected, (state, action) => {
      state.status = "failed";
    });
    // get directory tree
    builder.addCase(displayImageByPathThunk.pending, (state, action) => {
      state.displayImageStatus = "pending";
      state.data = initialState?.data;
    });
    builder.addCase(displayImageByPathThunk.fulfilled, (state, action) => {
      state.displayImageStatus = "idle";
      state.data = action.payload;
    });
    builder.addCase(displayImageByPathThunk.rejected, (state, action) => {
      state.displayImageStatus = "failed";
    });
  },
});

export const { setRootDir } = projectSlice.actions;

export const selectProjectPath = (state: RootState) =>
  state.project.projectPath;
export const selectFilePaths = (state: RootState) => state.project.filePaths;
export const selectFiles = (state: RootState) => state.project.files;
export const selectStatus = (state: RootState) => state.project.status;
export const selectDisplayImageStatus = (state: RootState) =>
  state.project.displayImageStatus;
export const selectData = (state: RootState) => state.project.data;

export default projectSlice.reducer;
