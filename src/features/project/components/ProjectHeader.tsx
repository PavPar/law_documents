import { Button, Dropdown, MenuProps } from "antd";
import { Header } from "antd/es/layout/layout";
import { getDirectoryTreeThunk } from "../slice/thunks";
import { css } from "@emotion/css";
import { useState } from "react";
import { CreateProjectModal } from "../modals/createProjectModal/CreateProjectModal";
import { APP_PAGES_PATHS } from "../../App";
import { useProjectActions } from "../hooks/useProjectActions";
import { useAppDispatch } from "src/app/store";
import { useNavigate } from "react-router";

export function ProjectHeader() {
  const [isCreateProjectModalVisible, setCreateProjectModalVisible] =
    useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
        openProject();
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
      label: "сохранить",
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
    <>
      <CreateProjectModal
        open={isCreateProjectModalVisible}
        onCancel={() => setCreateProjectModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setCreateProjectModalVisible(false);
          createProject(values.name);
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
            <span
              onClick={() => {
                navigate(APP_PAGES_PATHS.main);
              }}
            >
              ОРГАНАЙЗЕР ДЕЛ
            </span>
          </div>
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
