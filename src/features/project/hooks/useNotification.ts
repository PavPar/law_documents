import { notification } from "antd";
import { ReactElement, JSXElementConstructor } from "react";

type NotificationType = "success" | "info" | "warning" | "error";

export function useNotification(): [
  ReactElement<any, string | JSXElementConstructor<any>>,
  (type: NotificationType, message: string, description?: string) => void
] {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  return [contextHolder, openNotificationWithIcon];
}
