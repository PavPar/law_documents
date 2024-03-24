import path from "path";
import { promisify } from "util";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleFileReadPayload = {
  fpath: string;
};

export type HandleFileReadResult = {
  payload: HandleFileReadPayload;
  data?: string;
};

const fs = require("fs").promises;

export async function handleFileRead(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleFileReadPayload
): Promise<HandleFileReadResult> {
  const { fpath } = payload;
  try {
    const data = await fs.readFile(fpath, "utf8");
    return { payload, data };
  } catch (err) {
    console.error(err);
    return { payload };
  }
}
