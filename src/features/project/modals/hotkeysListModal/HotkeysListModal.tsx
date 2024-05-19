import { Button, Modal, ModalProps } from "antd";
import {
  HotkeysListModalBody,
  HotkeysListModalBodyProps,
} from "./components/HotkeysListModalBody";

export type HotkeysListModalProps = ModalProps;

export function HotkeysListModal({ ...props }: HotkeysListModalProps) {
  return (
    <Modal
      {...props}
      title={"Список горячих клавиш"}
      centered
      destroyOnClose
      okButtonProps={{ hidden: true }}
      cancelText={"Закрыть"}
    >
      <HotkeysListModalBody />
    </Modal>
  );
}
