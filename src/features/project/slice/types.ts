// basic image item
export type ProjectItemTypes = "group" | "image";

export type ProjectItem = {
  uid: string;
  type: ProjectItemTypes;
  path?: string;
  parent_uid?: string;
  name?: string;
};

export type ProjectData = {
  name: string;
  imgDirPath: string;
  items: ProjectItem[];
};
