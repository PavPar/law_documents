import path from "path";
import { promisify } from "util";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleFileWritePayload = {
  fpath: string;
  content: string;
};

export type HandleFileWriteResult = {
  payload: HandleFileWritePayload;
};

const fs = require("fs").promises;

export async function handleFileWrite(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleFileWritePayload
): Promise<HandleFileWriteResult> {
  const { fpath, content } = payload;
  try {
    await fs.writeFile(fpath, content);
    return { payload };
  } catch (err) {
    console.error(err);
    return { payload };
  }
}
