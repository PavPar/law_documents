import { Button, Modal, ModalProps } from "antd";
import {
  RenameItemModalBody,
  RenameItemModalBodyProps,
} from "./components/RenameItemModalBody";

export type RenameItemModalProps = ModalProps & {
  onFinish: RenameItemModalBodyProps["onFinish"];
};

export function RenameItemModal({ onFinish, ...props }: RenameItemModalProps) {
  return (
    <Modal
      {...props}
      title={"Переименовать элемент"}
      centered
      cancelText={"Отменить"}
      footer={[
        <Button
          form="renameItemForm"
          key="submit"
          htmlType="submit"
          type="primary"
        >
          Переименовать
        </Button>,
      ]}
    >
      <RenameItemModalBody onFinish={onFinish} />
    </Modal>
  );
}
