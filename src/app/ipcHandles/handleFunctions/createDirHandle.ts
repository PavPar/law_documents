import path from "path";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleCreateDirPayload = {
  dpath: string;
  name: string;
  options?: {
    recursive: boolean;
  };
};

export type HandleCreateDirReturnVal = {
  payload: HandleCreateDirPayload;
  success: boolean;
  dirPath: string;
};

const fs = require("fs");

export async function handleDirCreate(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleCreateDirPayload
): Promise<HandleCreateDirReturnVal> {
  const { name, dpath, options } = payload;
  const dirPath = path.join(dpath, name);
  try {
    await fs.mkdir(dirPath, options, function (err: unknown) {
      if (err) throw err;
    });
    return { dirPath, payload, success: true };
  } catch (err) {
    console.error(err);
    return { dirPath, payload, success: false };
  }
}
