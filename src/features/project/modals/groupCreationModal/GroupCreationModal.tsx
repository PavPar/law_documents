import { Button, Modal, ModalProps } from "antd";
import {
  GroupCreationModalBody,
  GroupCreationModalBodyProps,
} from "./components/GroupCreationModalBody";

export type GroupCreationModalProps = ModalProps & {
  onFinish: GroupCreationModalBodyProps["onFinish"];
};

export function GroupCreationModal({
  onFinish,
  ...props
}: GroupCreationModalProps) {
  return (
    <Modal
      {...props}
      title={"Создание группы"}
      centered
      cancelText={"Отменить"}
      footer={[
        <Button form="groupForm" key="submit" htmlType="submit">
          Создать
        </Button>,
      ]}
    >
      <GroupCreationModalBody onFinish={onFinish} />
    </Modal>
  );
}
