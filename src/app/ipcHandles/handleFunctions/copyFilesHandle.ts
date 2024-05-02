import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

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
  newFileNamesMap?: { [uid: string]: string };
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
  const newFileNamesMap: HandleCopyFilesResult["newFileNamesMap"] = {};
  Promise.all(
    files.map((f) => {
      const newName = uuidv4() + path.extname(f);
      const originalName = path.basename(f);
      const newFilePath = path.join(dest, newName);
      newFileNamesMap[newName] = originalName;
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
      newFileNamesMap,
    } as HandleCopyFilesResult);
  });
}
