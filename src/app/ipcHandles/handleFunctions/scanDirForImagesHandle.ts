import result from "antd/es/result";
import { Dree } from "dree";
import path from "path";
import { DREE_IMAGE_OPTIONS } from "../../constants";

/* eslint-disable @typescript-eslint/no-var-requires */
export type HandleScanDirForImagesPayload = {
  dpath: string;
};

export type HandleScanDirForImagesResult = Dree;

const dree = require("dree");

export async function handleScanDirForImages(
  event: Electron.IpcMainInvokeEvent,
  payload: HandleScanDirForImagesPayload
): Promise<HandleScanDirForImagesResult> {
  const { dpath } = payload;

  const tree: Dree = dree.scan(dpath, DREE_IMAGE_OPTIONS);

  return tree;
}
