import { Form, Input } from "antd";

export type CreateProjectModalBodyProps = {
  onFinish: (values: { name: string }) => void;
};
export function CreateProjectModalBody({
  onFinish,
}: CreateProjectModalBodyProps) {
  return (
    <section>
      <Form
        id="CreateProjectModal"
        onFinish={(values) => {
          onFinish(values as { name: string });
        }}
      >
        <Form.Item
          label="Имя дела"
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста введите имя дела",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </section>
  );
}
