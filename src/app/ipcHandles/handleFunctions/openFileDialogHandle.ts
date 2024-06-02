import { dialog } from "electron";
import path from "path";
import { DREE_IMAGE_OPTIONS } from "../../../app/constants";

/* eslint-disable @typescript-eslint/no-var-requires */
// export type HandleOpenFileDialogPayload = {

// };

export type HandleOpenFileDialogResult = Electron.OpenDialogReturnValue;

const fs = require("fs");

export async function handleOpenFileDialog(): Promise<HandleOpenFileDialogResult> {
  const result = await dialog.showOpenDialog({
    properties: ["multiSelections", "openFile"],
    buttonLabel: "Выбрать",
    title: "Добавление файлов в дело",
  });

  return result;
}
