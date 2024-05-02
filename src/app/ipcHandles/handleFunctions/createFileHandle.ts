import path from "path";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleCreateFilePayload = {
  fpath: string;
  name: string;
  content?: string;
};

export type HandleCreateFileResult = {
  fpath?: string;
};

const fs = require("fs");

export async function handleCreateFile(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleCreateFilePayload
): Promise<HandleCreateFileResult> {
  const { name, fpath, content } = payload;
  const filePath = path.join(fpath, name);
  try {
    fs.appendFile(filePath, content || "", function (err: unknown) {
      if (err) throw err;
    });
    return { fpath: filePath };
  } catch (err) {
    console.error(err);
    return err;
  }
}
