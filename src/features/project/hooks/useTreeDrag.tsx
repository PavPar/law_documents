import { TreeProps } from "antd";
import { ProjectTreeDataNode } from "../utils/projectStructureMethods";
import { useAppDispatch } from "../../../app/store";
import { setItemParent } from "../slice/slice";

export function useTreeDrag(
  treeData: ProjectTreeDataNode[]
  //   onDropCB: (newTreeData: ProjectTreeDataNode[]) => void
) {
  const dispatch = useAppDispatch;

  const onDragEnter = (info: Parameters<TreeProps["onDragEnter"]>[0]) => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop = (info: Parameters<TreeProps["onDrop"]>[0]) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // the drop position relative to the drop node, inside 0, top -1, bottom 1

    const loop = (
      items: ProjectTreeDataNode[],
      key: React.Key,
      callback: (
        items: ProjectTreeDataNode,
        index: number,
        item: ProjectTreeDataNode[]
      ) => void
    ) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
          return callback(items[i], i, items);
        }
        if (items[i].children) {
          loop(items[i].children, key, callback);
        }
      }
    };

    const data = [...treeData];

    // Find dragObject
    let dragObj: ProjectTreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert.
        // New item was inserted to the start of the array in this example,
        // but can be anywhere
        item.children.unshift(dragObj);
      });
    } else {
      let arrayCopy: ProjectTreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        arrayCopy = arr;
        i = index;
      });
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        arrayCopy.splice(i, 0, dragObj);
      } else {
        // Drop on the bottom of the drop node
        arrayCopy.splice(i + 1, 0, dragObj);
      }
    }
    console.log("DATA", data);
    // onDropCB(data);
    // setGData(data);
  };

  return { onDragEnter, onDrop };
}
