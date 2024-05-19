import { css } from "@emotion/css";
import { Form, Input, Typography } from "antd";
import { HOTKEYS_COMBINATIONS } from "src/app/constants";
import { FileDropZone } from "src/features/project/components/FileDropZone";

const { Text } = Typography;

function HotkeyCard({
  description,
  text,
}: {
  text: string;
  description: string;
}) {
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
      `}
    >
      <Text>
        <b>{text}</b>
      </Text>
      <Text>{description}</Text>
    </div>
  );
}

export type HotkeysListModalBodyProps = {};

export function HotkeysListModalBody({}: HotkeysListModalBodyProps) {
  return (
    <section
      className={css`
        display: grid;
        gap: 5px;
      `}
    >
      <HotkeyCard
        text={HOTKEYS_COMBINATIONS.openProject}
        description="Открыть проект"
      />
      <HotkeyCard
        text={HOTKEYS_COMBINATIONS.save}
        description="Сохранить проект"
      />
      <HotkeyCard
        text={[
          HOTKEYS_COMBINATIONS.deleteElement,
          HOTKEYS_COMBINATIONS.deleteElementMac,
        ].join(",")}
        description="Удалить элемент"
      />
    </section>
  );
}
