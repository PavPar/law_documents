import { css } from "@emotion/css";
import { OWL_LOGO_SIZE, OwlLogo, OwlLogoProps } from "./OwlLogo";
import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";
import { useNavigate } from "react-router";
import { APP_PAGES_PATHS } from "src/features/App";

const { Title } = Typography;
export type AppLogoProps = OwlLogoProps & Pick<TitleProps, "level">;
export function AppLogo({ size, level }: AppLogoProps) {
  const navigate = useNavigate();

  return (
    <div
      className={css`
        margin: auto;
        display: grid;
        align-items: center;
        grid-template-columns: ${size} 1fr;
      `}
      onClick={() => {
        navigate(APP_PAGES_PATHS.main);
      }}
    >
      <OwlLogo size={size} />
      <Title
        className={css`
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          text-transform: uppercase;
          font-style: italic;
          margin: unset !important;
        `}
        level={level}
      >
        Обозреватель дел
      </Title>
    </div>
  );
}
