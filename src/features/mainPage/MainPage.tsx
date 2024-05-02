import { css } from "@emotion/css";
import { Button, Layout } from "antd";
import { useNavigate } from "react-router";
import { APP_PAGES_PATHS } from "../App";
import { Logo } from "./components/Logo";

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
        <Logo />
        <div>
          <Button type="primary">Создать</Button>
          <Button onClick={() => navigate(APP_PAGES_PATHS.project)}>
            Открыть
          </Button>
        </div>
      </section>
    </Layout>
  );
}
