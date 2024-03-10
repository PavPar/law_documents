import React, { useEffect, useState } from "react";
import { Button, Layout, Spin, Tree, TreeDataNode, Typography } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { css } from "@emotion/css";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  selectData,
  selectDisplayImageStatus,
  selectFilePaths,
  selectFiles,
  selectStatus,
  setRootDir,
} from "./slice/slice";
import {
  displayImageByPathThunk,
  getDirectoryTreeThunk,
  openFileDialogThunk,
} from "./slice/thunks";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TreeNode, useTreeNodeStructure } from "./hooks/useTreeNodeStructure";

const { Text } = Typography;

export function Project() {
  const dispatch = useAppDispatch();

  //   const files = useAppSelector(selectFilePaths);
  const files = useAppSelector(selectFiles);
  const status = useAppSelector(selectStatus);
  const displayImageStatus = useAppSelector(selectDisplayImageStatus);
  const imageData = useAppSelector(selectData);

  const [treeData, setTreeData] = useState<TreeNode>();

  useEffect(() => {
    console.log(files);
    console.log(openFileDialogThunk);
    if (files) {
      setTreeData(useTreeNodeStructure(files));
      console.log(useTreeNodeStructure(files));
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
      <Sider width="25%">
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
                dispatch(displayImageByPathThunk(node.data.path));
              }}
              treeData={[treeData]}
            />
          )}
        </div>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>
          <Button
            onClick={() => {
              dispatch(openFileDialogThunk());
            }}
          >
            открыть папку
          </Button>
          <Button
            onClick={() => {
              dispatch(getDirectoryTreeThunk());
            }}
          >
            открыть папку
          </Button>
          <TransformWrapper>
            <TransformComponent>
              {imageData ? (
                <img
                  className={css`
                    width: 75vw;
                  `}
                  src={`data:image/jpg;base64,${imageData}`}
                ></img>
              ) : (
                <>
                  {displayImageStatus === "idle" && (
                    <Text>Здесь будет изображение</Text>
                  )}
                  {displayImageStatus === "pending" && (
                    <Text>Загрузка изображения</Text>
                  )}
                  {displayImageStatus === "failed" && (
                    <Text>Не удалось открыть изображение</Text>
                  )}
                </>
              )}
            </TransformComponent>
          </TransformWrapper>
        </Content>
      </Layout>
    </Layout>
  );
}
