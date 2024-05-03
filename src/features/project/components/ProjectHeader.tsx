import { Button, Dropdown, MenuProps } from "antd";
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

export function ProjectHeader() {
  const [isCreateProjectModalVisible, setCreateProjectModalVisible] =
    useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projectData = useAppSelector(selectProjectData);

  const { addFilesToProject, createProject, openProject, saveProject } =
    useProjectActions();

  const items: MenuProps["items"] = [
    {
      key: "project-create",
      label: "создать новый проект",
      onClick: () => {
        // createProject("new-project");
        setCreateProjectModalVisible(true);
      },
    },
    {
      key: "project-open",
      label: "открыть проект",
      onClick: () => {
        openProject().catch((err) => console.error(err));
        //open project test
      },
    },
    {
      key: "project-addfiles",
      label: "добавить файлы в проект",
      disabled: !projectData,
      onClick: () => {
        addFilesToProject().catch((err) => console.error(err));
      },
    },
    {
      key: "project-write",
      label: "сохранить",
      disabled: !projectData,
      onClick: () => {
        saveProject().catch((err) => console.error(err));
      },
    },
  ];

  return (
    <>
      <CreateProjectModal
        open={isCreateProjectModalVisible}
        onCancel={() => setCreateProjectModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setCreateProjectModalVisible(false);
          createProject(values.name).catch((err) => console.error(err));
        }}
      />
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
          <AppLogo size={OWL_LOGO_SIZE.xs} level={5} />
        </div>
        <div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button>Проект</Button>
          </Dropdown>
        </div>
      </Header>
    </>
  );
}
