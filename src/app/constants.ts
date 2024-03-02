export enum IPC_HANDLES {
  OPEN_DIRECTORY_DIALOG = "open-directory-dialog",
  GET_DIRECTORY_TREE = "get-directory-tree",
  DISPLAY_IMAGE_DATA_BY_PATH = "display-image-data-by-path",
  // === old ones
  FILE_OPEN_DIALOG = "file-dialog",
  DISPLAY_IMAGE = "image-display",
}

export type FetchStatus = "idle" | "pending" | "failed";
