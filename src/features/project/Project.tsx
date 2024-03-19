import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Menu,
  Spin,
  Tree,
  TreeDataNode,
  Typography,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { css } from "@emotion/css";
import { useAppDispatch, useAppSelector } from "../../app/store";
// import { uuid } from "uuidv4";
import {
  ProductItemType,
  createProductTreeNode,
  selectData,
  selectDisplayImageStatus,
  selectFiles,
  selectProjectPath,
  selectProjectStructure,
  selectStatus,
  setProjectWorkDirPath,
} from "./slice/slice";
import {
  displayImageByPathThunk,
  getDirectoryTreeThunk,
  openFileDialogThunk,
  scanForImagesInDirThunk,
} from "./slice/thunks";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TreeNode, useTreeNodeStructure } from "./hooks/useTreeNodeStructure";
import {
  copyFiles,
  createDirByPath,
  createFileByPath,
  openDirDialog,
  openFileOpenDialog,
} from "./slice/api";
import { ProjectHeader } from "./components/ProjectHeader";
// import { Type } from "dree";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dree = window.require("dree");

const { Text } = Typography;

export function Project() {
  const dispatch = useAppDispatch();

  const files = useAppSelector(selectFiles);
  const status = useAppSelector(selectStatus);
  const struct = useAppSelector(selectProjectStructure);
  const projectWorkDirPath = useAppSelector(selectProjectPath);

  const displayImageStatus = useAppSelector(selectDisplayImageStatus);
  const imageData = useAppSelector(selectData);

  const [treeData, setTreeData] = useState<TreeNode>();

  useEffect(() => {
    if (files) {
      setTreeData(useTreeNodeStructure(files));
    }
  }, [files]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
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
            {/* <Button
              onClick={() => {
                createNewNode();
              }}
            >
              Добавить группу
            </Button> */}
            <div
              className={css`
                display: grid;
                overflow-y: scroll;
                max-height: 100vh;
                padding-bottom: 100px;
                gap: 5px;
              `}
            >
              {treeData && (
                <Tree
                  showLine={true}
                  showIcon={true}
                  defaultExpandedKeys={["0"]}
                  onClick={(e, node) => {
                    if (node.data.type === dree.Type.DIRECTORY) {
                      return;
                    }
                    dispatch(displayImageByPathThunk(node.data.path));
                  }}
                  treeData={[treeData]}
                />
              )}
            </div>
          </Sider>

          <Layout>
            <Content>
              {imageData ? (
                <TransformWrapper>
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
