import { Button, Modal, ModalProps } from "antd";
import {
  RenameItemModalBody,
  RenameItemModalBodyProps,
} from "./components/RenameItemModalBody";
import { ProjectItem } from "../../slice/types";

export type RenameItemModalProps = ModalProps & RenameItemModalBodyProps;

export function RenameItemModal({
  onFinish,
  item,
  ...props
}: RenameItemModalProps) {
  return (
    <Modal
      {...props}
      title={"Переименовать элемент"}
      centered
      cancelText={"Отменить"}
      destroyOnClose
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
      <RenameItemModalBody onFinish={onFinish} item={item} />
    </Modal>
  );
}
