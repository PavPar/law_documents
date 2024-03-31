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
  openProjectOpenDialog,
  readFile,
  writeFile,
} from "../slice/api";
import {
  addItemsToProject,
  selectProjectData,
  selectProjectPath,
  selectProjectRootFilePath,
  setProject,
  setProjectItems,
  setProjectName,
  setProjectRootFilePath,
  setProjectWorkDirPath,
} from "../slice/slice";
import {
  PROJECT_FILE_INITAL_STATE,
  PROJECT_FOLDER_STUCTURE,
} from "../../../app/constants";
import { imageToProjectStructure } from "../utils/projectStructureMethods";
import { ProjectDataTypeGuard } from "../utils/projectDataTypeGuard";
import { ProjectItem } from "../slice/types";

const path = window.require("path");

const { Text } = Typography;

export function ProjectHeader() {
  const dispatch = useAppDispatch();
  const projectWorkDirPath = useAppSelector(selectProjectPath);
  const projectRootFilePath = useAppSelector(selectProjectRootFilePath);
  const projectData = useAppSelector(selectProjectData);

  async function createProject(projectName: string) {
    try {
      const dirDialogRes = await openDirDialog();
      if (dirDialogRes.canceled) {
        throw new Error("canceled");
      }
      const projectPath = dirDialogRes.filePaths[0];

      const createDirRes = await createDirByPath({
        dpath: projectPath,
        name: projectName,
        options: {
          recursive: true,
        },
      });
      const createSubDirRes = await createDirByPath({
        dpath: createDirRes.dirPath,
        name: PROJECT_FOLDER_STUCTURE.images,
        options: {
          recursive: true,
        },
      });
      dispatch(setProjectWorkDirPath(createDirRes.dirPath));

      const projectFileData = Object.assign({}, PROJECT_FILE_INITAL_STATE);
      projectFileData.name = projectName;

      await createFileByPath({
        fpath: createDirRes.dirPath,
        name: `${projectName}.json`,
        content: JSON.stringify(projectFileData),
      });
      dispatch(
        scanForImagesInDirThunk({
          dpath: createDirRes.dirPath,
        })
      );
      dispatch(
        setProjectRootFilePath(
          path.join(createDirRes.dirPath, `${projectName}.json`)
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function addFilesToProject() {
    try {
      const openFileDialogRes = await openFileOpenDialog();
      const cpRes = await copyFiles({
        dest: path.join(projectWorkDirPath, PROJECT_FOLDER_STUCTURE.images),
        files: openFileDialogRes.filePaths,
      });

      const items: ProjectItem[] = [];
      cpRes?.newFilesPaths.forEach((fp) =>
        items.push(
          imageToProjectStructure(path.relative(projectWorkDirPath, fp))
        )
      );
      // TODO: if item was added and project not saved, the file will exist in folder but not in index file
      dispatch(addItemsToProject(items));
      dispatch(scanForImagesInDirThunk({ dpath: projectWorkDirPath }));

      console.log(openFileDialogRes, projectWorkDirPath, cpRes);
    } catch (err) {
      console.error(err);
    }
  }

  async function openProjectFile() {
    try {
      const openProjectDialogRes = await openProjectOpenDialog();
      if (openProjectDialogRes.canceled) {
        throw new Error("canceled");
      }

      const projectFilePath = openProjectDialogRes.filePaths[0];
      //   path.dirname(projectFilePath);

      dispatch(
        scanForImagesInDirThunk({ dpath: path.dirname(projectFilePath) })
      );
      dispatch(setProjectWorkDirPath(path.dirname(projectFilePath)));
      const fileReadRes = await readFile({ fpath: projectFilePath });
      const fileData = fileReadRes.data;
      if (!fileData) {
        throw new Error("no file data");
      }

      const project = JSON.parse(fileData);

      if (!ProjectDataTypeGuard(project)) {
        throw new Error("typeguard failed");
      }

      //   dispatch(setProjectItems(project.items));
      dispatch(setProject(project));
      dispatch(setProjectRootFilePath(projectFilePath));
      //   dispatch(setProjec)
    } catch (err) {
      console.error(err);
    }
  }

  async function saveProject() {
    try {
      await writeFile({
        fpath: path.join(projectRootFilePath),
        content: JSON.stringify(projectData),
      });
    } catch (err) {
      console.error(err);
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "project-create",
      label: "создать новый проект",
      onClick: () => {
        createProject("new-project");
      },
    },
    {
      key: "project-open",
      label: "открыть проект",
      onClick: () => {
        openProjectFile();
        //open project test
      },
    },
    {
      key: "project-addfiles",
      label: "добавить файлы в проект",
      onClick: () => {
        addFilesToProject();
      },
    },
    {
      key: "project-write",
      label: "Сохранить",
      onClick: () => {
        saveProject();
      },
    },
    {
      type: "divider",
    },
    {
      key: "dir-read",
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
