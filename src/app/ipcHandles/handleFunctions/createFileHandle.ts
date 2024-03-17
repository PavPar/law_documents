import path from "path";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleCreateFilePayload = {
  fpath: string;
  name: string;
  content?: string;
};

const fs = require("fs");

export async function handleCreateFile(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleCreateFilePayload
) {
  const { name, fpath, content } = payload;
  try {
    fs.appendFile(
      path.join(fpath, name),
      content || "",
      function (err: unknown) {
        if (err) throw err;
      }
    );
    return;
  } catch (err) {
    console.error(err);
    return err;
  }
}
