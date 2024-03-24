import { ProjectData } from "../slice/types";

export function ProjectDataTypeGuard(
  data: unknown | null | undefined
): data is ProjectData {
  if (data === null || data === undefined || Array.isArray(data)) {
    return false;
  }

  // TODO: improve add value check
  return (
    Object.prototype.hasOwnProperty.call(data, "name") &&
    Object.prototype.hasOwnProperty.call(data, "imgDirPath") &&
    Object.prototype.hasOwnProperty.call(data, "items")
  );
}
