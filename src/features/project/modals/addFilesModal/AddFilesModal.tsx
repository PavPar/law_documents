import { Button, Modal, ModalProps } from "antd";
import {
  AddFilesModalBody,
  AddFilesModalBodyProps,
} from "./components/AddFilesModalBody";

export type AddFilesModalProps = ModalProps;

export function AddFilesModal({ ...props }: AddFilesModalProps) {
  return (
    <Modal
      {...props}
      title={"Добавить файлы в дело"}
      centered
      destroyOnClose
      okButtonProps={{ hidden: true }}
      cancelText={"Закрыть"}
    >
      <AddFilesModalBody />
    </Modal>
  );
}
