import { message, notification } from "antd";
import type { ReactNode } from "react";
import { getAntdMessage, getAntdNotification } from "./antd-static-api";

type NotificationConfig = Parameters<typeof notification.success>[0];
type MessageContent = Parameters<typeof message.error>[0] | ReactNode;

const openNotification = (
  tipo: "success" | "error" | "warning" | "info",
  config: NotificationConfig,
) => {
  const api = getAntdNotification();
  if (api?.[tipo]) {
    api[tipo](config);
    return;
  }
  notification[tipo](config);
};

const openMessage = (
  tipo: "success" | "error" | "warning" | "info",
  content: MessageContent,
) => {
  const api = getAntdMessage();
  if (api?.[tipo]) {
    api[tipo](content as never);
    return;
  }
  message[tipo](content as never);
};

export const notifySuccess = (config: NotificationConfig) =>
  openNotification("success", config);

export const notifyError = (config: NotificationConfig) =>
  openNotification("error", config);

export const notifyWarning = (config: NotificationConfig) =>
  openNotification("warning", config);

export const notifyInfo = (config: NotificationConfig) =>
  openNotification("info", config);

export const msgSuccess = (content: MessageContent) =>
  openMessage("success", content);

export const msgError = (content: MessageContent) =>
  openMessage("error", content);

export const msgWarning = (content: MessageContent) =>
  openMessage("warning", content);

export const msgInfo = (content: MessageContent) =>
  openMessage("info", content);
