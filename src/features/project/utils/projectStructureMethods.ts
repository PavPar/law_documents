import { Dree } from "dree";
import { ProjectData, ProjectItem, ProjectItemTypes } from "../slice/types";

import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from "primereact/treenode";
import { Project } from "../Project";
import { ProductItemType } from "../slice/slice";
import {
  PROJECT_FOLDER_STUCTURE,
  PROJECT_FILE_INITAL_STATE,
} from "../../../app/constants";
import { createDirByPath, createFileByPath, readFile } from "../slice/api";
import { TreeItemIndex, TreeItem } from "react-complex-tree";

const path = window.require("path");

function getNodeItems(node: Dree) {
  const items: ProjectItem[] = [];

  node?.children?.forEach((child) => {
    if (child.type === "directory") {
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

export function imageToProjectStructure({
  relativePath,
  uid,
  name,
}: {
  relativePath: string;
  name?: string;
  uid?: string;
}): ProjectItem {
  return {
    uid: uid || uuidv4(),
    type: "image",
    path: relativePath,
    name: name || path.basename(relativePath),
  };
}

export type ProjectTreeDataNode = TreeItem<ProjectItem>;
export type ProjectTreeData = Record<TreeItemIndex, TreeItem<ProjectItem>>;

function getIcon(type: ProjectItemTypes) {
  switch (type) {
    case "root":
      return "";
    case "group":
      return "pi pi-folder";
    case "image":
      return "pi pi-image";
  }
}

function createTreeNode(props: ProjectTreeDataNode): ProjectTreeDataNode {
  const node: ProjectTreeDataNode = {
    canMove: true,
    canRename: true,
    isFolder: !(props?.data?.type === "image"),
    data: props.data,
    ...props,
  };

  return node;
}

type ParentUIDChildItemMap = {
  [parentID: string | "root"]: ProjectItem[];
};

function getParentItemMap(items: ProjectItem[]) {
  const map: ParentUIDChildItemMap = {};
  items.forEach((i) => {
    const parentUID = i?.parent_uid || "root";
    map[parentUID] = [...(map[parentUID] || []), i];
  });
  return map;
}

export function gatherItemsToDelete(tree: ProjectTreeData, uids: string[]) {
  const itemsToDelete = new Set<string>([]);

  const itemsToProcess: string[] = [];
  uids.forEach((uid) => {
    switch (tree[uid]?.data?.type) {
      case "group":
        itemsToProcess.push(uid);
        break;
      case "image":
        itemsToDelete.add(uid);
        break;
      case "root":
        break;
      default:
        itemsToDelete.add(uid);
        break;
    }
  });

  if (itemsToProcess.length === 0) {
    return Array.from(itemsToDelete);
  }

  function recursive(uid: string) {
    const children = tree[uid]?.children || [];
    itemsToDelete.add(uid);

    children.forEach((cuid) => {
      recursive(cuid.toString());
    });
  }

  itemsToProcess.forEach((i) => {
    recursive(i);
  });

  console.log(
    Array.from(itemsToDelete).map((id) => {
      return tree[id];
    })
  );
  return Array.from(itemsToDelete);
}

// export function getRootNodeChildren(
//   rootNode: ProjectTreeDataNode,
//   items: ProjectItem[]
// ) {
//   const map = getParentItemMap(items);
//   const rootItems = map["root"];
//   const rootNodes: ProjectTreeDataNode[] = [];

//   function recursionFunc(
//     parentNode: ProjectTreeDataNode,
//     item: ProjectItem,
//     index: number
//   ) {
//     const currentNode = createTreeNode({
//       data: item,
//       parentKey: parentNode.key,
//       childIndex: index,
//     });

//     const children = map[item.uid];

//     if (children) {
//       currentNode.children = [];
//       children.forEach((c, idx) => {
//         currentNode.children.push(recursionFunc(currentNode, c, idx));
//       });
//     }

//     return currentNode;
//   }

//   //TODO: recursion
//   rootItems?.forEach((item, index) => {
//     // const currentNode = createTreeNode({
//     //   data: item,
//     //   parentKey: rootNode.key,
//     //   childIndex: index,
//     // });

//     // const children = map[item.uid];

//     // if (children) {
//     //   currentNode.children = [];

//     //   children.forEach((c, idx) => {
//     //     const childNode = createTreeNode({
//     //       data: c,
//     //       parentKey: currentNode.key,
//     //       childIndex: idx,
//     //     });
//     //     currentNode.children.push(childNode);
//     //   });
//     // }

//     rootNodes.push(recursionFunc(rootNode, item, index));
//   });

//   return rootNodes;
// }

export function getProjectTreeData(projectData: ProjectData): ProjectTreeData {
  const items = projectData.items;

  const nodesMap = getParentItemMap(items);

  const treeItems: ProjectTreeData = {
    root: {
      index: "root",
      isFolder: true,
      data: {
        type: ProductItemType.root as unknown as ProjectItem["type"],
        uid: "root",
      },
      children: (nodesMap["root"] || []).map((i) => i.uid),
    },
  };

  projectData.items.map((i) => {
    treeItems[i.uid] = createTreeNode({
      data: i,
      index: i.uid,
      children: (nodesMap[i.uid] || []).map((i) => i.uid),
    });
  });

  return treeItems;
}

export async function createProjectStructure(
  projectPath: string,
  projectName: string
) {
  const createDirRes = await createDirByPath({
    dpath: projectPath,
    name: projectName,
    options: {
      recursive: true,
    },
  });

  const createSubDirRes = await createDirByPath({
    dpath: createDirRes.dirPath,
    name: PROJECT_FOLDER_STUCTURE.images,
    options: {
      recursive: true,
    },
  });

  const projectFileData = Object.assign({}, PROJECT_FILE_INITAL_STATE);
  projectFileData.name = projectName;

  const createProjectFileRes = await createFileByPath({
    fpath: createDirRes.dirPath,
    name: `${projectName}.json`,
    content: JSON.stringify(projectFileData),
  });

  console.log("created", createDirRes, createSubDirRes, createProjectFileRes);
  return {
    createDirRes,
    createSubDirRes,
    createProjectFileRes,
  };
}

export async function getProjectData(path: string) {
  const fileReadRes = await readFile({ fpath: path });
  const fileData = fileReadRes.data;
  if (!fileData) {
    throw new Error("no file data");
  }
  const project = JSON.parse(fileData);
  return project;
}

export function itemSearch(
  root: ProjectTreeDataNode,
  tree: ProjectTreeData,
  search: string | undefined
) {
  if (!search) {
    return tree;
  }

  const filteredTree: ProjectTreeData = {};
  filteredTree[root.index] = root;

  function recursiveFn(itemKey: ProjectTreeDataNode["index"]): boolean {
    const item = tree[itemKey];
    const children = item.children || [];
    const isSearchedValue = item?.data?.name
      .toLowerCase()
      .includes(search.toLowerCase());
    let hasAnyChildMatch = false;

    if (children) {
      hasAnyChildMatch = children.reduce((acc, cIdx) => {
        return recursiveFn(cIdx) || acc;
      }, false);
    }

    if (isSearchedValue || hasAnyChildMatch) {
      filteredTree[item.index] = item;
    }

    return isSearchedValue || hasAnyChildMatch;
  }

  const rootChildren = root?.children || [];

  rootChildren.forEach((indx) => {
    recursiveFn(indx);
  });

  return filteredTree;
}
