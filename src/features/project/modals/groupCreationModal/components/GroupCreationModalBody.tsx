import { Button, Form, Input, Typography } from "antd";

export type GroupCreationModalBodyProps = {
  onFinish: (values: { name: string }) => void;
};
export function GroupCreationModalBody({
  onFinish,
}: GroupCreationModalBodyProps) {
  return (
    <section>
      <Form
        id="groupForm"
        onFinish={(values) => {
          onFinish(values as { name: string });
        }}
      >
        <Form.Item
          label="Имя группы"
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста введите имя группы",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </section>
  );
}
