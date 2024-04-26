import { Dree } from "dree";
import { ProjectData, ProjectItem, ProjectItemTypes } from "../slice/types";

import { v4 as uuidv4 } from "uuid";
import { TreeNode } from "primereact/treenode";
import { Project } from "../Project";
import { ProductItemType } from "../slice/slice";

const path = window.require("path");
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
    name: path.basename(relativePath),
  };
}

export type ProjectTreeDataNode = TreeNode & { data?: ProjectItem };

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

function createTreeNode(
  //   props: TreeNode,
  {
    childIndex,
    data,
    parentKey,
  }: {
    data: ProjectItem;
    childIndex: number;
    parentKey?: ProjectTreeDataNode["key"];
  }
): ProjectTreeDataNode {
  const key = parentKey ? `${parentKey}-${childIndex}` : `${childIndex}`;
  return {
    key,
    label: data?.name,
    data,
    leaf: data?.type === "image",
    icon: getIcon(data.type),
    // children: node.children?.map((child, index) =>
    //   handleChildAdd(child, index, key)
    // ),
    // data: props,
  };
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

export function getRootNodeChildren(
  rootNode: ProjectTreeDataNode,
  items: ProjectItem[]
) {
  const map = getParentItemMap(items);
  const rootItems = map["root"];
  const rootNodes: ProjectTreeDataNode[] = [];

  function recursionFunc(
    parentNode: ProjectTreeDataNode,
    item: ProjectItem,
    index: number
  ) {
    const currentNode = createTreeNode({
      data: item,
      parentKey: parentNode.key,
      childIndex: index,
    });

    const children = map[item.uid];

    if (children) {
      currentNode.children = [];
      children.forEach((c, idx) => {
        currentNode.children.push(recursionFunc(currentNode, c, idx));
      });
    }

    return currentNode;
  }

  //TODO: recursion
  rootItems?.forEach((item, index) => {
    // const currentNode = createTreeNode({
    //   data: item,
    //   parentKey: rootNode.key,
    //   childIndex: index,
    // });

    // const children = map[item.uid];

    // if (children) {
    //   currentNode.children = [];

    //   children.forEach((c, idx) => {
    //     const childNode = createTreeNode({
    //       data: c,
    //       parentKey: currentNode.key,
    //       childIndex: idx,
    //     });
    //     currentNode.children.push(childNode);
    //   });
    // }

    rootNodes.push(recursionFunc(rootNode, item, index));
  });

  return rootNodes;
}

export function getProjectTreeData(projectData: ProjectData) {
  const rootNode: ProjectTreeDataNode = {
    key: "0",
    label: projectData.name,
    data: {
      type: ProductItemType.root as unknown as ProjectItem["type"],
      uid: "root",
    },
  };

  rootNode.children = getRootNodeChildren(rootNode, projectData.items);
  return rootNode;
}
