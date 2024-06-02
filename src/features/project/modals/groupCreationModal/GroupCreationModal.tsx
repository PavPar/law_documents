import { Button, Modal, ModalProps } from "antd";
import {
  GroupCreationModalBody,
  GroupCreationModalBodyProps,
} from "./components/GroupCreationModalBody";
import React from "react";

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
      destroyOnClose
      cancelText={"Отменить"}
      width={"75vw"}
      footer={[
        <Button form="groupForm" key="submit" htmlType="submit" type="primary">
          Создать
        </Button>,
      ]}
    >
      <GroupCreationModalBody onFinish={onFinish} />
    </Modal>
  );
}
