import { ProjectData } from "../features/project/slice/types";

export enum IPC_HANDLES {
  OPEN_DIRECTORY_DIALOG = "open-directory-dialog",
  GET_DIRECTORY_TREE = "get-directory-tree",
  DISPLAY_IMAGE_DATA_BY_PATH = "display-image-data-by-path",
  CREATE_FILE = "create-file",
  CREATE_DIR = "create-dir",
  COPY_FILES = "copy-files",
  SCAN_DIR_FOR_IMAGES = "scan-dir-for-images",
  OPEN_PROJECT_DIALOG = "open-project-dialog",
  FILE_READ = "file_read",
  FILE_WRITE = "file_write",
  // === old ones
  FILE_OPEN_DIALOG = "file-dialog",
  DISPLAY_IMAGE = "image-display",
}

export type FetchStatus = "idle" | "pending" | "failed";
export const ACCEPTED_FILE_TYPES = [".jpeg", ".jpg", ".png", ".gif"];
export const DREE_IMAGE_OPTIONS = {
  stat: false,
  normalize: true,
  followLinks: true,
  size: true,
  hash: true,
  extensions: ["jpeg", "jpg", "png", "gif"],
};

export const PROJECT_FOLDER_STUCTURE = Object.freeze({
  root: ".",
  images: "img",
});

export const PROJECT_FILE_INITAL_STATE: ProjectData = Object.seal({
  imgDirPath: PROJECT_FOLDER_STUCTURE.images,
  items: [],
  name: "new-project",
} as ProjectData);

export enum NOTIFICATION_MESSAGES {
  fileAddSuccess = "Файлы добавлены успешно",
  fileAddFail = "Не удалось добавить файлы",
  projectOpenSuccess = "Проект открыт успешно",
  projectOpenFail = "Не удалось открыть проект",
  projectSaveSuccess = "Проект сохранен успешно",
  projectSaveFail = "Не удалось сохранить проект",
}
