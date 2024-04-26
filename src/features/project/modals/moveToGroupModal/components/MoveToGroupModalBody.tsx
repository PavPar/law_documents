import { Button, Form, Input, Select, Typography } from "antd";
import { useAppSelector } from "../../../../../app/store";
import { selectProjectData } from "../../../../../features/project/slice/slice";
import { ProjectItem } from "../../../../../features/project/slice/types";

export type MoveToGroupModalBodyProps = {
  onFinish: (values: { group: string }) => void;
};
export function MoveToGroupModalBody({ onFinish }: MoveToGroupModalBodyProps) {
  const project = useAppSelector(selectProjectData);
  const { Option } = Select;
  const projectGroups = project?.items.filter((i) => i.type === "group");
  return (
    <section>
      <Form
        id="moveTogroupForm"
        onFinish={(values) => {
          console.log(values);
          onFinish(values as { group: string });
        }}
      >
        <Form.Item
          label="Имя группы"
          name="group"
          rules={[
            {
              required: true,
              message: "Пожалуйста выберите группу",
            },
          ]}
        >
          <Select placeholder="Пожалуйста выберите группу">
            {projectGroups.map((g) => {
              return (
                <Option key={g.uid} value={g.uid}>
                  {g?.name || g.uid}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </section>
  );
}
