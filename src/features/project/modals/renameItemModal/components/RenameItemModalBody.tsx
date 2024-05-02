import { Form, Input } from "antd";
import { ProjectItem } from "../../../../../features/project/slice/types";

export type RenameItemModalBodyProps = {
  item?: ProjectItem;
  onFinish: (values: { name: string }) => void;
};
export function RenameItemModalBody({
  onFinish,
  item,
}: RenameItemModalBodyProps) {
  return (
    <section>
      <Form
        id="renameItemForm"
        onFinish={(values) => {
          onFinish(values as { name: string });
        }}
      >
        <Form.Item
          label="Новое имя"
          name="name"
          initialValue={item?.name}
          rules={[
            {
              required: true,
              message: "Пожалуйста введите новое имя",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </section>
  );
}
