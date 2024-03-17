import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  displayImageByPathThunk,
  getDirectoryTreeThunk,
  openFileDialogThunk,
  scanForImagesInDirThunk,
} from "./thunks";
import { FetchStatus } from "../../../app/constants";
import { RootState } from "../../../app/store";
import { getDirectoryTree } from "./api";
import { Dree } from "dree";

export enum ProductItemType {
  file = "FILE",
  group = "GROUP",
}

export type ProductItem = {
  uid: string;
  name: string;
  // type: ProductItemType;
  items?: string[]; // TODO: items только для групп ?
  parent_id?: string; // TODO: parent => использовать гененрацию в виде uuidv4 с проверкой на наличие дубликтов (чтобы точно нельзя было иметь дублиаката item);
};

export type Product = {
  name: string;
  items: ProductItem[];
};

type State = {
  projectWorkDirPath?: string;

  //all files in directory
  files?: Dree;
  status: FetchStatus;

  //image display
  displayImageStatus: FetchStatus;
  data?: string;

  //categories
  projectTreeData: Product;
};

const initialState: State = {
  status: "idle",
  displayImageStatus: "idle",
  projectTreeData: {
    name: "new product",
    items: [],
  },
};

type SetRootDirPayload = State["projectWorkDirPath"];
type CreateProductTreeNodePayload = ProductItem;

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectWorkDirPath: (
      state: State,
      action: PayloadAction<SetRootDirPayload>
    ) => {
      state.projectWorkDirPath = action.payload;
    },
    createProductTreeNode: (
      state: State,
      action: PayloadAction<CreateProductTreeNodePayload>
    ) => {
      state.projectTreeData.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openFileDialogThunk.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(openFileDialogThunk.fulfilled, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
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
    // scan for images
    builder.addCase(scanForImagesInDirThunk.pending, (state, action) => {
      state.status = "pending";
      state.files = initialState?.files;
    });
    builder.addCase(scanForImagesInDirThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.files = action.payload;
    });
    builder.addCase(scanForImagesInDirThunk.rejected, (state, action) => {
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

export const { setProjectWorkDirPath, createProductTreeNode } =
  projectSlice.actions;

export const selectProjectPath = (state: RootState) =>
  state.project.projectWorkDirPath;
export const selectFiles = (state: RootState) => state.project.files;
export const selectStatus = (state: RootState) => state.project.status;
export const selectDisplayImageStatus = (state: RootState) =>
  state.project.displayImageStatus;
export const selectData = (state: RootState) => state.project.data;
export const selectProjectStructure = (state: RootState) =>
  state.project.projectTreeData;

export default projectSlice.reducer;
