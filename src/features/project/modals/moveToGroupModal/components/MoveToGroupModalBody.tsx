import { Button, Form, Input, Select, TreeSelect, Typography } from "antd";
import { useAppSelector } from "../../../../../app/store";
import { selectProjectData } from "../../../../../features/project/slice/slice";
import { ProjectItem } from "../../../../../features/project/slice/types";
import {
  getTreeSelectStructure,
  ProjectTreeDataNode,
} from "src/features/project/utils/projectStructureMethods";
import { useMemo } from "react";

export type MoveToGroupModalBodyProps = {
  onFinish: (values: { group: string }) => void;
  target: ProjectTreeDataNode;
};
export function MoveToGroupModalBody({
  onFinish,
  target,
}: MoveToGroupModalBodyProps) {
  const project = useAppSelector(selectProjectData);
  const { Option } = Select;

  const treeData = useMemo(() => getTreeSelectStructure(project), []);
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
          <TreeSelect
            treeData={treeData}
            placeholder="Пожалуйста выберите группу"
            showSearch
            treeNodeFilterProp="title"
          />
        </Form.Item>
      </Form>
    </section>
  );
}
