import { Button, Modal, ModalProps } from "antd";
import {
  CreateProjectModalBody,
  CreateProjectModalBodyProps,
} from "./components/CreateProjectModalBody";

export type CreateProjectModalProps = ModalProps & {
  onFinish: CreateProjectModalBodyProps["onFinish"];
};

export function CreateProjectModal({
  onFinish,
  ...props
}: CreateProjectModalProps) {
  return (
    <Modal
      {...props}
      title={"Создать проект"}
      centered
      destroyOnClose
      cancelText={"Отменить"}
      footer={[
        <Button
          form="CreateProjectModal"
          key="submit"
          htmlType="submit"
          type="primary"
        >
          Создать
        </Button>,
      ]}
    >
      <CreateProjectModalBody onFinish={onFinish} />
    </Modal>
  );
}
