import { Dree } from "dree";
import { ProjectItem } from "../slice/types";

import { v4 as uuidv4 } from "uuid";

const dree = window.require("dree");

function getNodeItems(node: Dree) {
  const items: ProjectItem[] = [];

  node?.children?.forEach((child) => {
    if (child.type === dree.Type.DIRECTORY) {
      items.push(...getNodeItems(child));
      return items;
    }

    items.push({
      uid: uuidv4(),
      type: "image",
      path: child.relativePath,
    });
  });

  return items;
}
export function filesToProjectStructure(root: Dree) {
  if (!root || !root?.children) {
    return [];
  }
  const items = getNodeItems(root);
  console.log(items);
  return items;
}

export function imageToProjectStructure(relativePath: string): ProjectItem {
  return {
    uid: uuidv4(),
    type: "image",
    path: relativePath,
  };
}

// export function projectStructureToTree() {}
