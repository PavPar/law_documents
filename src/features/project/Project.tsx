import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Dropdown, Layout, Typography } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { css } from "@emotion/css";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { v4 as uuidv4 } from "uuid";
import {
  selectData,
  selectDisplayImageStatus,
  selectFiles,
  selectProjectData,
  selectProjectPath,
  selectStatus,
  addItemsToProject,
  setItemParent,
  removeItemsFromProject,
  setProjectItemData,
} from "./slice/slice";
import { displayImageByPathThunk } from "./slice/thunks";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TreeNode, useTreeNodeStructure } from "./hooks/useTreeNodeStructure";
import { ProjectHeader } from "./components/ProjectHeader";
import {
  ProjectTreeData,
  ProjectTreeDataNode,
  filesToProjectStructure,
  getProjectTreeData,
  itemSearch,
} from "./utils/projectStructureMethods";
import { ContextMenu } from "primereact/contextmenu";
// eslint-disable-next-line import/no-unresolved
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { GroupCreationModal } from "./modals/groupCreationModal/GroupCreationModal";
import { MoveToGroupModal } from "./modals/moveToGroupModal/MoveToGroupModal";
import { RenameItemModal } from "./modals/renameItemModal/RenameItemModal";

import { FileDropZone } from "./components/FileDropZone";
import {
  ControlledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
  TreeItem,
  TreeItemIndex,
  TreeRef,
  UncontrolledTreeEnvironment,
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { FolderOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { APP_PAGES_PATHS } from "../App";
var _ = require("lodash");

// import { Type } from "dree";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dree = window.require("dree");

const { Text } = Typography;

const path = window.require("path");

function TreeIconSwitch({ item }: { item: ProjectTreeDataNode }) {
  switch (item?.data.type) {
    case "image":
      return <FileImageOutlined />;
    case "group":
      return <FolderOutlined />;
  }
}

export function Project() {
  const dispatch = useAppDispatch();

  const files = useAppSelector(selectFiles);
  const status = useAppSelector(selectStatus);
  const projectData = useAppSelector(selectProjectData);
  const projectWorkDir = useAppSelector(selectProjectPath);

  const displayImageStatus = useAppSelector(selectDisplayImageStatus);
  const imageData = useAppSelector(selectData);

  const [treeData, setTreeData] = useState<ProjectTreeData>({});
  const [isGroupCreationModalVisible, setGroupCreationModalVisible] =
    useState(false);
  const [isMoveToGroupModalVisible, setMoveToGroupModalVisible] =
    useState(false);
  const [isRenameItemModalVisible, setRenameItemModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const environment = useRef();
  const tree = useRef<TreeRef<any>>();

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex | undefined>();
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    if (files) {
      //   setTreeData(useTreeNodeStructure(files));
      filesToProjectStructure(files);
    }
  }, [files]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    if (!projectData) {
      return;
    }
    const data = getProjectTreeData(projectData);

    if (search) {
      console.log(search);
      // const filteredData = _.pickBy(
      //   data,
      //   (value: ProjectTreeDataNode, key: string) => {
      //     return (
      //       value.data?.name?.toLowerCase().includes(search.toLowerCase()) ||
      //       key === "root"
      //     );
      //   }
      // );
      const filteredData = itemSearch(data["root"], data, search);
      console.log(filteredData);
      setTreeData({ ...filteredData });
      tree.current.expandAll();
      return;
    }

    setTreeData(data);
  }, [projectData, search]);

  useEffect(() => {
    console.log("trreee - ", treeData);
  }, [treeData]);
  // tree?.current.rename
  const contextMenuRef = useRef(null);
  const [contextMenuTargetNode, setContextMenuTargetNode] =
    useState<ProjectTreeDataNode | null>(null);
  const contextMenuItems: MenuItem[] = [
    {
      label: "Переименовать",
      command: () => {
        setRenameItemModalVisible(true);
      },
    },
    {
      label: "Удалить",
      command: () => {
        dispatch(removeItemsFromProject([contextMenuTargetNode.data.uid]));
      },
    },
    {
      label: "Переместить в группу",
      command: () => {
        setMoveToGroupModalVisible(true);
      },
    },
    {
      label: "Убрать из группы",
      disabled: !contextMenuTargetNode?.data?.parent_uid,
      command: () => {
        dispatch(
          setItemParent({
            uid: contextMenuTargetNode.data.uid,
            parentUID: undefined,
          })
        );
      },
    },
  ];
  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
      <GroupCreationModal
        open={isGroupCreationModalVisible}
        onCancel={() => setGroupCreationModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={({ name }) => {
          setGroupCreationModalVisible(false);
          dispatch(addItemsToProject([{ type: "group", uid: uuidv4(), name }]));
        }}
      />
      <MoveToGroupModal
        open={isMoveToGroupModalVisible}
        onCancel={() => setMoveToGroupModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setMoveToGroupModalVisible(false);
          console.log(values);
          dispatch(
            setItemParent({
              uid: contextMenuTargetNode.data.uid,
              parentUID: values?.group,
            })
          );
        }}
      />
      <RenameItemModal
        item={contextMenuTargetNode?.data}
        open={isRenameItemModalVisible}
        onCancel={() => setRenameItemModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setRenameItemModalVisible(false);
          console.log(values);
          dispatch(
            setProjectItemData({
              uid: contextMenuTargetNode.data.uid,
              name: values.name,
            })
          );
        }}
      />
      <Layout>
        <ProjectHeader />
        <Layout>
          <Sider
            width="35%"
            className={css`
              background-color: #dcdcdc !important;
              border-right: 1px black solid;
              overflow: scroll;
            `}
          >
            <Button
              onClick={() => {
                setGroupCreationModalVisible(true);
              }}
            >
              Создать группу
            </Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />
              <button type="submit">Find item</button>
            </form>
            <div
              className={css`
                display: grid;
                overflow-y: scroll;
                max-height: 100vh;
                padding-bottom: 100px;
                gap: 5px;
              `}
            >
              <ContextMenu
                model={contextMenuItems}
                ref={contextMenuRef}
                breakpoint="767px"
              />

              <ControlledTreeEnvironment
                items={treeData}
                getItemTitle={(item: ProjectTreeDataNode) =>
                  item.data.name || item.data.uid
                }
                viewState={{
                  ["tree"]: {
                    focusedItem,
                    expandedItems,
                    selectedItems,
                  },
                }}
                canDragAndDrop={true}
                canDropOnFolder={true}
                canReorderItems={true}
                renderItemTitle={({ title, item }) => (
                  <div
                    className={css`
                      display: grid;
                      grid-auto-flow: column;
                      gap: 1ch;
                      /* border: 1px red solid; */
                    `}
                    onContextMenu={(event) => {
                      if (item.data?.type === "root") {
                        return;
                      }
                      contextMenuRef.current.show(event);
                      setContextMenuTargetNode(item);
                    }}
                  >
                    <TreeIconSwitch item={item} />
                    <span>{title}</span>
                  </div>
                )}
                onFocusItem={(node) => {
                  console.log("clicked", node);
                  if (node.data.type === "group") {
                    return;
                  }
                  if (node.data.type === "root") {
                    return;
                  }
                  dispatch(
                    displayImageByPathThunk(
                      path.join(projectWorkDir, node.data.path)
                    )
                  );
                  setFocusedItem(node.index);
                }}
                onExpandItem={(item) =>
                  setExpandedItems([...expandedItems, item.index])
                }
                onCollapseItem={(item) =>
                  setExpandedItems(
                    expandedItems.filter(
                      (expandedItemIndex) => expandedItemIndex !== item.index
                    )
                  )
                }
                onSelectItems={(items) => setSelectedItems(items)}
                canDropAt={(items, target) => {
                  if (target.targetType === "item") {
                    const item = treeData[target.targetItem];
                    // return target.targetItem !=;
                    //TODO: prevent group to group add
                  }

                  return true;
                }}
                onDrop={(items, target) => {
                  if (!items || !target) {
                    return;
                  }
                  if (target.targetType === "item") {
                    items.forEach((i) => {
                      dispatch(
                        setItemParent({
                          uid: i.index.toString(),
                          parentUID: target.targetItem.toString(),
                        })
                      );
                    });
                  }
                  if (target.targetType === "between-items") {
                    const targetParent =
                      target.parentItem === "root"
                        ? undefined
                        : target.parentItem.toString();
                    items.forEach((i) => {
                      dispatch(
                        setItemParent({
                          uid: i.index.toString(),
                          parentUID: targetParent,
                        })
                      );
                    });
                  }
                }}
              >
                <Tree
                  treeId="tree"
                  rootItem="root"
                  treeLabel="Tree Example"
                  ref={tree}
                />
              </ControlledTreeEnvironment>

              {/* {treeData && (
                <Tree
                  style={{ padding: 0 }}
                  expandedKeys={Object.assign(
                    {
                      "0": true,
                    },
                    ...treeData.children.map((c) => ({ [c.key]: true }))
                  )}
                  filter
                  selectionMode="multiple"
                  filterMode="lenient"
                  onNodeClick={({ node }) => {
                    console.log("clicked", node);
                    if (node.data.type === "group") {
                      return;
                    }
                    if (node.data.type === "root") {
                      return;
                    }
                    dispatch(
                      displayImageByPathThunk(
                        path.join(projectWorkDir, node.data.path)
                      )
                    );
                  }}
                  value={[treeData]}
                  onContextMenu={({ node }) => {
                    if (node.data?.type === "root") {
                      return;
                    }
                    contextMenuRef.current.show(event);
                    setContextMenuTargetNode(node);
                  }}
                  dragdropScope="demo"
                  onDragDrop={({ dragNode, dropNode }) => {
                    if (!dropNode || !dropNode.data) {
                      return;
                    }
                    if (dropNode.data.type === "image") {
                      return;
                    }
                    if (dropNode.data.type === "root") {
                      return;
                    }

                    dispatch(
                      setItemParent({
                        uid: dragNode.data.uid,
                        parentUID: dropNode.data.uid,
                      })
                    );
                  }}
                />
              )} */}
            </div>
          </Sider>

          <Layout>
            <Content
              className={css`
                position: relative;
              `}
            >
              {projectData && <FileDropZone />}
              {imageData ? (
                <TransformWrapper limitToBounds={false}>
                  <TransformComponent>
                    <img
                      className={css`
                        width: 75vw;
                      `}
                      src={`data:image/jpg;base64,${imageData}`}
                    ></img>
                  </TransformComponent>
                </TransformWrapper>
              ) : (
                <div
                  className={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                  `}
                >
                  {displayImageStatus === "idle" && (
                    <Text>Здесь будет изображение</Text>
                  )}
                  {displayImageStatus === "pending" && (
                    <Text>Загрузка изображения</Text>
                  )}
                  {displayImageStatus === "failed" && (
                    <Text>Не удалось открыть изображение</Text>
                  )}
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
}
