import path from "path";
import { promisify } from "util";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleCopyFilesPayload = {
  dest: string;
  files: string[];
};

export type HandleCopyFilesResult = {
  payload: HandleCopyFilesPayload;
  success: boolean;
  dest: string;
  newFilesPaths?: string[];
};

const fs = require("fs");
const copyFilePromise = promisify(fs.copyFile);

export async function handleCopyFiles(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleCopyFilesPayload
): Promise<HandleCopyFilesResult> {
  const { dest, files } = payload;

  let status = true;
  const newFilesPaths: string[] = [];

  Promise.all(
    files.map((f) => {
      const newFilePath = path.join(dest, path.basename(f));
      newFilesPaths.push(newFilePath);
      return copyFilePromise(
        f,
        newFilePath,
        fs.constants.COPYFILE_FICLONE,
        (err: unknown) => {
          if (err) {
            status = false;
            console.error(
              "[ERROR]:",
              err,
              path.join(dest, path.basename(f)),
              f
            );
          }
        }
      );
    })
  ).catch((err: unknown) => {
    console.log(err);
    return {
      dest,
      payload,
      success: false,
    } as HandleCopyFilesResult;
  });

  return new Promise((res) => {
    res({
      dest,
      payload,
      success: status,
      newFilesPaths,
    } as HandleCopyFilesResult);
  });
}
