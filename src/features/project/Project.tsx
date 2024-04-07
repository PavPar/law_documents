import { ReactNode, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Layout, Tree, Typography } from "antd";
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
  ProjectTreeDataNode,
  filesToProjectStructure,
  getProjectTreeData,
} from "./utils/projectStructureMethods";
import { ContextMenu } from "primereact/contextmenu";
// eslint-disable-next-line import/no-unresolved
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { GroupCreationModal } from "./modals/groupCreationModal/GroupCreationModal";

// import { Type } from "dree";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dree = window.require("dree");

const { Text } = Typography;

const path = window.require("path");

export function Project() {
  const dispatch = useAppDispatch();

  const files = useAppSelector(selectFiles);
  const status = useAppSelector(selectStatus);
  const projectData = useAppSelector(selectProjectData);
  const projectWorkDir = useAppSelector(selectProjectPath);

  const displayImageStatus = useAppSelector(selectDisplayImageStatus);
  const imageData = useAppSelector(selectData);

  const [treeData, setTreeData] = useState<ProjectTreeDataNode>();
  const [isGroupCreationModalVisible, setGroupCreationModalVisible] =
    useState(false);
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
    setTreeData(getProjectTreeData(projectData));
  }, [projectData]);

  const contextMenuRef = useRef(null);
  const [contextMenuTargetNode, setContextMenuTargetNode] =
    useState<ProjectTreeDataNode | null>(null);
  const contextMenuItems: MenuItem[] = [
    {
      label: "Переименовать",
      command: () => {
        dispatch(
          setProjectItemData({
            uid: contextMenuTargetNode.data.uid,
            name: "test",
          })
        );
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
        dispatch(
          setItemParent({
            uid: contextMenuTargetNode?.data?.uid,
            parentUID: "test",
          })
        );
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
      <Layout>
        <ProjectHeader />
        <Layout>
          <Sider
            width="25%"
            className={css`
              background-color: #dcdcdc !important;
              border-right: 1px black solid;
            `}
          >
            <Button
              onClick={() => {
                setGroupCreationModalVisible(true);
              }}
            >
              Создать группу
            </Button>
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

              {treeData && (
                <Tree
                  showLine
                  showIcon
                  defaultExpandedKeys={["0"]}
                  onClick={(e, node) => {
                    if (node.data.type === "group") {
                      return;
                    }
                    dispatch(
                      displayImageByPathThunk(
                        path.join(projectWorkDir, node.data.path)
                      )
                    );
                  }}
                  treeData={[treeData]}
                  onRightClick={({ event, node }) => {
                    contextMenuRef.current.show(event);
                    setContextMenuTargetNode(node);
                  }}
                />
              )}
            </div>
          </Sider>

          <Layout>
            <Content>
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
