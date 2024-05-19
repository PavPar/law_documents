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
import { ProjectData, ProjectItem } from "./types";

export enum ProductItemType {
  file = "file",
  group = "group",
  root = "root",
}

type State = {
  projectWorkDirPath?: string;
  projectRootFilePath?: string;
  project?: ProjectData;
  originalProject?: ProjectData;
  //delete later
  files?: Dree;
  status: FetchStatus;

  //image display
  displayImageStatus: FetchStatus;
  data?: string;

  //productData
};

const initialState: State = {
  status: "idle",
  displayImageStatus: "idle",
};

type SetRootDirPayload = State["projectWorkDirPath"];
type SetItemParentPayload = {
  uid: ProjectItem["uid"];
  parentUID?: ProjectItem["uid"];
};
type SetProjectItemDataPayload = Omit<Partial<ProjectItem>, "uid"> &
  Pick<ProjectItem, "uid">;

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
    setProjectName: (
      state: State,
      action: PayloadAction<ProjectData["name"]>
    ) => {
      state.project.name = action.payload;
    },
    setProject: (state: State, action: PayloadAction<ProjectData>) => {
      state.project = action.payload;
    },
    setOriginalProject: (state: State, action: PayloadAction<ProjectData>) => {
      state.originalProject = action.payload;
    },
    addItemsToProject: (
      state: State,
      action: PayloadAction<ProjectData["items"]>
    ) => {
      state.project.items = [...state.project.items, ...action.payload];
    },
    setProjectItemData: (
      state: State,
      action: PayloadAction<SetProjectItemDataPayload>
    ) => {
      const { uid, ...data } = action.payload;
      const item = state.project.items.find((i) => i.uid === uid);
      Object.keys(data).forEach((key: keyof ProjectItem) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        item[key] = data[key];
      });
    },
    setProjectItems: (
      state: State,
      action: PayloadAction<ProjectData["items"]>
    ) => {
      state.project.items = action.payload;
    },
    setItemParent: (
      state: State,
      action: PayloadAction<SetItemParentPayload>
    ) => {
      const { parentUID, uid } = action.payload;
      const item = state.project.items.find((i) => i.uid === uid);
      if (item) {
        item.parent_uid = parentUID;
      }
    },
    setProjectRootFilePath: (
      state: State,
      action: PayloadAction<State["projectRootFilePath"]>
    ) => {
      state.projectRootFilePath = action.payload;
    },
    removeItemsFromProject: (
      state: State,
      action: PayloadAction<ProjectItem["uid"][]>
    ) => {
      const itemSet = new Set(action.payload);
      state.project.items = state.project.items.filter(
        (i) => !(itemSet.has(i.uid) || itemSet.has(i?.parent_uid))
      );
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

export const {
  setProjectWorkDirPath,
  addItemsToProject,
  removeItemsFromProject,
  setProjectItems,
  setProjectName,
  setProjectRootFilePath,
  setProject,
  setItemParent,
  setProjectItemData,
  setOriginalProject,
} = projectSlice.actions;

export const selectProjectPath = (state: RootState) =>
  state.project.projectWorkDirPath;
export const selectFiles = (state: RootState) => state.project.files;
export const selectStatus = (state: RootState) => state.project.status;
export const selectDisplayImageStatus = (state: RootState) =>
  state.project.displayImageStatus;
export const selectData = (state: RootState) => state.project.data;

export const selectProjectData = (state: RootState) => state.project.project;
export const selectOriginalProjectData = (state: RootState) =>
  state.project.originalProject;
export const selectProjectRootFilePath = (state: RootState) =>
  state.project.projectRootFilePath;

export default projectSlice.reducer;
