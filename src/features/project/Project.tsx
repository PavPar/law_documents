import React, { useEffect, useState } from "react";
import { Button, Layout, Spin, Tree, TreeDataNode, Typography } from "antd";
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

  function createNewNode() {
    // dispatch(
    // //   createProductTreeNode({
    // //     name: "test",
    // //     uid: "1",
    // //     parent_id: "",
    // //     items: [files.children[0].path, files.children[1].path],
    // //   })
    // );
    setTreeData({
      ...treeData,
      children: [
        ...(treeData?.children || []),
        {
          key: treeData.key + "-" + treeData?.children.length,
          title: "test",
          icon: "",
        },
      ],
    });
  }

  function createProjectTest(projectName: string) {
    openDirDialog()
      .then((res: Electron.OpenDialogReturnValue) => {
        if (res.canceled) {
          throw new Error("canceled");
        }
        console.log(res);
        const projectPath = res.filePaths[0];

        return createDirByPath({
          dpath: projectPath,
          name: projectName,
          options: {
            recursive: true,
          },
        });
      })
      .then((res) => {
        console.log(res.dirPath);
        dispatch(setProjectWorkDirPath(res.dirPath));
        createFileByPath({
          fpath: res.dirPath,
          name: `${projectName}.json`,
          content: JSON.stringify(struct),
        });
        dispatch(
          scanForImagesInDirThunk({
            dpath: res.dirPath,
          })
        );
      })
      .catch((err) => console.error(err));
  }

  async function addFilesToProject() {
    try {
      const openFileDialogRes = await openFileOpenDialog();
      const cpRes = await copyFiles({
        dest: projectWorkDirPath,
        files: openFileDialogRes.filePaths,
      });
      dispatch(scanForImagesInDirThunk({ dpath: projectWorkDirPath }));
      console.log(openFileDialogRes, projectWorkDirPath, cpRes);
    } catch (err) {
      console.error(err);
    }

    // openFileOpenDialog();
    //   .then((res: Electron.OpenDialogReturnValue) => {
    //     if (res.canceled) {
    //       throw new Error("canceled");
    //     }
    //     const cpRes = copyFiles({
    //       dest: projectWorkDirPath,
    //       files: res.filePaths,
    //     }).catch((err) => console.error(err));
    //     console.log(res, projectWorkDirPath, cpRes);
    //   })
    //   .catch((err) => console.error(err));
  }

  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
      <Sider width="25%">
        <Button
          onClick={() => {
            createNewNode();
          }}
        >
          Добавить группу
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
        <Header>Заголовок</Header>
        <Content>
          <div>
            Типа меню
            <div>
              <Button
                onClick={() => {
                  dispatch(getDirectoryTreeThunk());
                }}
              >
                открыть папку
              </Button>
              <Button
                onClick={() => {
                  createProjectTest("test");
                }}
              >
                cоздать проект
              </Button>
              <Button
                onClick={() => {
                  addFilesToProject();
                }}
              >
                добавить файлы в проект
              </Button>
              <Button
                onClick={() => {
                  //   addFilesToProject();
                }}
              >
                Открыть проект
              </Button>
            </div>
          </div>
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
