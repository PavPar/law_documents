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
          label="Имя проекта"
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста введите имя проекта",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </section>
  );
}
