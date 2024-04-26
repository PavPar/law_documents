import { Form, Input } from "antd";

export type RenameItemModalBodyProps = {
  onFinish: (values: { name: string }) => void;
};
export function RenameItemModalBody({ onFinish }: RenameItemModalBodyProps) {
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
