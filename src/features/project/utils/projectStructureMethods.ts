import { Dree } from "dree";
import { ProjectData, ProjectItem } from "../slice/types";

import { v4 as uuidv4 } from "uuid";

import { TreeNodeNormal } from "antd/es/tree/Tree";
import { TreeDataNode } from "antd";

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

export type ProjectTreeDataNode = TreeDataNode & { data?: ProjectItem };

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
    title: data?.name,
    data,
    isLeaf: data?.type === "image",
    // children: node.children?.map((child, index) =>
    //   handleChildAdd(child, index, key)
    // ),
    // data: props,
  } as ProjectTreeDataNode;
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
    title: projectData.name,
  };

  rootNode.children = getRootNodeChildren(rootNode, projectData.items);
  return rootNode;
}
