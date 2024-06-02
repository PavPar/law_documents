import { Button, Dropdown, MenuProps, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { getDirectoryTreeThunk } from "../slice/thunks";
import { css } from "@emotion/css";
import { useState } from "react";
import { CreateProjectModal } from "../modals/createProjectModal/CreateProjectModal";
import { APP_PAGES_PATHS } from "../../App";
import { useProjectActions } from "../hooks/useProjectActions";
import { useAppDispatch, useAppSelector } from "src/app/store";
import { useNavigate } from "react-router";
import { AppLogo } from "src/features/mainPage/components/AppLogo";
import { OWL_LOGO_SIZE } from "src/features/mainPage/components/OwlLogo";
import {
  selectProjectPath,
  selectProjectRootFilePath,
  selectProjectData,
} from "../slice/slice";
import { AddFilesModal } from "../modals/addFilesModal/AddFilesModal";
import { useNotification } from "../hooks/useNotification";
import { HOTKEYS_COMBINATIONS, NOTIFICATION_MESSAGES } from "src/app/constants";
import { useHotkeys } from "react-hotkeys-hook";
import { HotkeysListModal } from "../modals/hotkeysListModal/HotkeysListModal";
import { useProjectStatusObserver } from "../hooks/useProjectStatusObserver";
import {
  AppstoreOutlined,
  FileAddOutlined,
  ProfileOutlined,
  SaveOutlined,
} from "@ant-design/icons";
const { Text } = Typography;
export function ProjectHeader() {
  const [isCreateProjectModalVisible, setCreateProjectModalVisible] =
    useState(false);
  const [isAddFileModalVisible, setAddFileModalVisible] = useState(false);
  const [isHotkeysModalVisible, setHotkeysModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projectData = useAppSelector(selectProjectData);

  const { addFilesToProject, createProject, openProject, saveProject } =
    useProjectActions();
  const { projectHasData, projectWasChanged } = useProjectStatusObserver();
  const [notificationContext, notify] = useNotification();

  function handleProjectSave() {
    if (!projectData) {
      notify("error", NOTIFICATION_MESSAGES.projectSaveFail);
      return;
    }
    saveProject()
      .then(() => {
        notify("success", NOTIFICATION_MESSAGES.projectSaveSuccess);
      })
      .catch((err) => {
        notify("error", NOTIFICATION_MESSAGES.projectSaveFail);
        console.error(err);
      });
  }

  function handleProjectOpen() {
    openProject()
      .then(() => {
        notify("success", NOTIFICATION_MESSAGES.projectOpenSuccess);
      })
      .catch((err: Error) => {
        if (err?.message === "canceled") {
          return;
        }
        notify("error", NOTIFICATION_MESSAGES.projectOpenFail);
        console.error(err);
      });
  }

  const items: MenuProps["items"] = [
    {
      key: "project-create",
      label: "Создать новое дело",
      onClick: () => {
        // createProject("new-project");
        setCreateProjectModalVisible(true);
      },
    },
    {
      key: "project-open",
      label: "Открыть дело",
      onClick: handleProjectOpen,
    },
  ];

  useHotkeys(HOTKEYS_COMBINATIONS.save, () => handleProjectSave());
  useHotkeys(HOTKEYS_COMBINATIONS.openProject, () => handleProjectOpen());

  return (
    <>
      {notificationContext}
      <CreateProjectModal
        open={isCreateProjectModalVisible}
        onCancel={() => setCreateProjectModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setCreateProjectModalVisible(false);
          createProject(values.name).catch((err) => console.error(err));
        }}
      />
      <HotkeysListModal
        open={isHotkeysModalVisible}
        onCancel={() => setHotkeysModalVisible(false)}
      />
      <AddFilesModal
        open={isAddFileModalVisible}
        onCancel={() => setAddFileModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
      />

      <Header
        className={css`
          display: grid;
          grid-template-columns: 25% auto;
          grid-auto-flow: row;
          padding: 0;
          background-color: #dcdcdc;
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
          <AppLogo size={OWL_LOGO_SIZE.xs} level={5} />
        </div>
        <div
          className={css`
            display: flex;
            margin: auto 0;
            gap: 5px;
          `}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button icon={<ProfileOutlined />}>Дело</Button>
          </Dropdown>
          <Button
            onClick={() => {
              handleProjectSave();
            }}
            icon={<SaveOutlined />}
            disabled={!projectData}
          >
            Сохранить
          </Button>
          <Button
            icon={<FileAddOutlined />}
            onClick={() => {
              setAddFileModalVisible(true);
            }}
            disabled={!projectData}
          >
            Добавить файлы в дело
          </Button>
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => {
              setHotkeysModalVisible(true);
            }}
          >
            Горячие клавиши
          </Button>
        </div>
      </Header>
      <div
        className={css`
          width: 100%;
          background-color: ${projectHasData && projectWasChanged
            ? "yellow"
            : "#dcdcdc"};
          min-height: 3ch;
          border-bottom: 1px black solid;
          text-align: center;
        `}
      >
        {projectHasData && projectWasChanged && (
          <Text>В деле есть несохраненные изменения</Text>
        )}
      </div>
    </>
  );
}
