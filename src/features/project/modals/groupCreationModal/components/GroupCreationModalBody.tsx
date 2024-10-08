import { ArrowRightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  Button,
  Form,
  Input,
  List,
  Select,
  TreeSelect,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { useAppSelector } from "src/app/store";
import { selectProjectData } from "src/features/project/slice/slice";
import {
  getTreeSelectStructure,
  parseStringIntoNames,
} from "src/features/project/utils/projectStructureMethods";

export type GroupCreationModalBodyProps = {
  onFinish: (values: { name: string[]; group?: string }) => void;
};

const { Text } = Typography;

export function GroupCreationModalBody({
  onFinish,
}: GroupCreationModalBodyProps) {
  const [data, setData] = useState<string>("");
  const project = useAppSelector(selectProjectData);
  const { Option } = Select;

  const treeData = useMemo(() => getTreeSelectStructure(project), []);
  return (
    <section
      className={css`
        height: 430px;
      `}
    >
      <Form
        id="groupForm"
        onFinish={(values) => {
          onFinish({
            name: parseStringIntoNames(data, "\n"),
            group: values?.group,
          });
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
              height: 330px;
            `}
          >
            <Input.TextArea
              className={css`
                min-height: 330px !important;
                max-height: 330px !important;
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
        <Form.Item
          label="Имя группы"
          tooltip="Имя группы в которую будут добавлены новые группы (По умолчанию будет добавлено в корень проекта)"
          name="group"
        >
          <TreeSelect
            treeData={treeData}
            placeholder="Выберите группу при необходимости"
            treeNodeFilterProp="title"
            allowClear
            showSearch
          />
        </Form.Item>
      </Form>
    </section>
  );
}
