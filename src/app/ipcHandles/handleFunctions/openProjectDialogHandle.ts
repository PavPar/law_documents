import { dialog } from "electron";

export type HandleOpenFileDialogResult = Electron.OpenDialogReturnValue;

export async function handleOpenProjectDialog(): Promise<HandleOpenFileDialogResult> {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ extensions: ["json"], name: "123" }],
  });

  return result;
}
