import { TreeDataNode } from "antd";
import { Dree } from "dree";

export type TreeNode = TreeDataNode & { data: Dree };

function handleChildAdd(
  node: Dree,
  childIndex: number,
  parentKey?: TreeNode["key"]
): TreeNode {
  const key = parentKey ? `${parentKey}-${childIndex}` : `${childIndex}`;
  return {
    key,
    title: node.name,
    children: node.children?.map((child, index) =>
      handleChildAdd(child, index, key)
    ),
    data: node,
  };
}

export function useTreeNodeStructure(tree: Dree) {
  return handleChildAdd(tree, 0);
}
