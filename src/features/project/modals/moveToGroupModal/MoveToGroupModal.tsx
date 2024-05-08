import { Button, Modal, ModalProps } from "antd";
import {
  MoveToGroupModalBody,
  MoveToGroupModalBodyProps,
} from "./components/MoveToGroupModalBody";

export type MoveToGroupModalProps = ModalProps & {
  onFinish: MoveToGroupModalBodyProps["onFinish"];
  target: MoveToGroupModalBodyProps["target"];
};

export function MoveToGroupModal({
  onFinish,
  target,
  ...props
}: MoveToGroupModalProps) {
  return (
    <Modal
      {...props}
      title={"Добавить в группу"}
      centered
      destroyOnClose
      cancelText={"Отменить"}
      footer={[
        <Button
          form="moveTogroupForm"
          key="submit"
          htmlType="submit"
          type="primary"
        >
          Добавить
        </Button>,
      ]}
    >
      <MoveToGroupModalBody onFinish={onFinish} target={target} />
    </Modal>
  );
}
