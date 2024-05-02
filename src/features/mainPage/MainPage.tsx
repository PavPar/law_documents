import { css } from "@emotion/css";
import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router";
import { APP_PAGES_PATHS } from "../App";
import { Logo, LOGO_SIZE } from "./components/Logo";
import { OWL_LOGO_SIZE, OwlLogo } from "./components/OwlLogo";
import { FileAddOutlined, FolderOpenOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export function MainPage() {
  const navigate = useNavigate();
  return (
    <Layout
      className={css({
        width: "100vw",
        height: "100vh",
      })}
    >
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
        <div
          className={css`
            margin: auto;
            display: grid;
            grid-template-columns: ${OWL_LOGO_SIZE.s} 1fr;
          `}
        >
          <OwlLogo size={OWL_LOGO_SIZE.s} />
          <Title
            className={css`
              font-family: Impact, Haettenschweiler, "Arial Narrow Bold",
                sans-serif;
              text-transform: uppercase;
              font-style: italic;
            `}
          >
            Обозреватель дел
          </Title>
        </div>
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
          >
            Создать дело
          </Button>
          <Button
            className={css`
              width: 100%;
              height: 100%;
            `}
            onClick={() => navigate(APP_PAGES_PATHS.project)}
            icon={<FolderOpenOutlined />}
          >
            Открыть существующее дело
          </Button>
        </div>
      </section>
    </Layout>
  );
}
