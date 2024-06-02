import { ArrowRightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Form, Input, List, Typography } from "antd";
import { useState } from "react";
import { parseStringIntoNames } from "src/features/project/utils/projectStructureMethods";

export type GroupCreationModalBodyProps = {
  onFinish: (values: { name: string[] }) => void;
};

const { Text } = Typography;

export function GroupCreationModalBody({
  onFinish,
}: GroupCreationModalBodyProps) {
  const [data, setData] = useState<string>("");

  return (
    <section
      className={css`
        height: 50vh;
      `}
    >
      <Form
        id="groupForm"
        onFinish={(values) => {
          onFinish({ name: parseStringIntoNames(data, "\n") });
        }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста введите хотя бы одно имя группы",
            },
          ]}
        >
          <div
            className={css`
              display: grid;
              grid-template-columns: 1fr 10px 1fr;
              gap: 10px;
              height: 50vh;
            `}
          >
            <Input.TextArea
              className={css`
                min-height: 50vh !important;
                max-height: 50vh !important;
                overflow: auto;
              `}
              placeholder="Введите одно или несколько имен групп (Каждая новая группа должна начинаться с новой строки)"
              onChange={(e) => setData(e.target.value)}
            />
            <ArrowRightOutlined size={10} />

            <List
              className={css`
                overflow: auto;
              `}
              size="small"
              bordered
              dataSource={parseStringIntoNames(data, "\n")}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              locale={{
                emptyText:
                  "Здесь будут отображены группы которые будут созданы",
              }}
            />
          </div>
        </Form.Item>
      </Form>
    </section>
  );
}
