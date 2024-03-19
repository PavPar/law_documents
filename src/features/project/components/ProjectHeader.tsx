import { Button, Dropdown, MenuProps, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import {
  getDirectoryTreeThunk,
  scanForImagesInDirThunk,
} from "../slice/thunks";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { css } from "@emotion/css";
import {
  openDirDialog,
  createDirByPath,
  createFileByPath,
  openFileOpenDialog,
  copyFiles,
} from "../slice/api";
import { selectProjectPath, setProjectWorkDirPath } from "../slice/slice";

const { Text } = Typography;

export function ProjectHeader() {
  const dispatch = useAppDispatch();
  const projectWorkDirPath = useAppSelector(selectProjectPath);

  function createProject(projectName: string) {
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
          content: JSON.stringify(""),
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

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: "создать новый проект",
      onClick: () => {
        createProject("test");
      },
    },
    {
      key: "1",
      label: "открыть проект",
      onClick: () => {
        //open project test
      },
    },
    {
      key: "2",
      label: "добавить файлы в проект",
      onClick: () => {
        addFilesToProject();
      },
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "открыть папку с файлами",

      onClick: () => {
        dispatch(getDirectoryTreeThunk());
      },
    },
  ];

  return (
    <Header
      className={css`
        display: grid;
        grid-template-columns: 25% auto;
        grid-auto-flow: column;
        padding: 0;
        background-color: #dcdcdc;
        border-bottom: 1px black solid;
      `}
    >
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
          box-sizing: border-box;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: black;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            width: 100%;
            height: 3em;
          `}
        >
          <span>ОРГАНАЙЗЕР ДЕЛ</span>
        </div>
      </div>
      <div>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button>Проект</Button>
        </Dropdown>
      </div>
    </Header>
  );
}
