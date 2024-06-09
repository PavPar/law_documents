import { css } from "@emotion/css";
import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router";
import { APP_PAGES_PATHS } from "../App";
import { Logo, LOGO_SIZE } from "./components/Logo";
import { OWL_LOGO_SIZE, OwlLogo } from "./components/OwlLogo";
import { FileAddOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useProjectActions } from "../project/hooks/useProjectActions";
import { CreateProjectModal } from "../project/modals/createProjectModal/CreateProjectModal";
import { useState } from "react";
import { AppLogo } from "./components/AppLogo";
import { useNotification } from "../project/hooks/useNotification";
import { NOTIFICATION_MESSAGES } from "src/app/constants";

const { Text, Title } = Typography;

export function MainPage() {
  const navigate = useNavigate();
  const [notificationContext, notify] = useNotification();

  const [isCreateProjectModalVisible, setCreateProjectModalVisible] =
    useState(false);

  const { createProject, openProject } = useProjectActions();
  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
      {notificationContext}
      <CreateProjectModal
        destroyOnClose
        open={isCreateProjectModalVisible}
        onCancel={() => setCreateProjectModalVisible(false)}
        // onOk={() => setGroupCreationModalVisible(false)}
        onFinish={(values) => {
          setCreateProjectModalVisible(false);
          createProject(values.name)
            .then(() => navigate(APP_PAGES_PATHS.project))
            .catch((err) => console.error(err));
        }}
      />
      <section>
        <Logo size={LOGO_SIZE.s} />
      </section>
      <section
        className={css`
          margin: auto;
          display: grid;
          justify-content: center;
          gap: 5px;
        `}
      >
        <AppLogo size={OWL_LOGO_SIZE.s} level={2} />
        <div
          className={css`
            margin: auto;
            display: grid;
            width: 80%;
            height: 50px;
            gap: 5px;
            grid-template-columns: 1fr 1fr;
          `}
        >
          <Button
            type="primary"
            className={css`
              width: 100%;
              height: 100%;
            `}
            icon={<FileAddOutlined />}
            onClick={() => {
              setCreateProjectModalVisible(true);
            }}
          >
            Создать дело
          </Button>
          <Button
            className={css`
              width: 100%;
              height: 100%;
            `}
            icon={<FolderOpenOutlined />}
            onClick={() => {
              openProject()
                .then(() => navigate(APP_PAGES_PATHS.project))
                .catch((err: Error) => {
                  if (err?.message === "canceled") {
                    return;
                  }
                  notify("error", NOTIFICATION_MESSAGES.projectOpenFail);
                  console.error(err);
                });
            }}
          >
            Открыть существующее дело
          </Button>
        </div>
      </section>
      <span
        className={css`
          position: absolute;
          right: 0;
          bottom: 0;
        `}
      >
        v 1.0.1
      </span>
    </Layout>
  );
}
