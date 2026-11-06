import { useEffect, type ReactNode } from "react";
import { message, notification } from "antd";
import { setAntdMessage, setAntdNotification } from "./antd-static-api";

/**
 * Expõe notification/message via hooks (funcionam no React 19).
 * Necessário no MFE embutido no SGP e no modo standalone.
 */
export const AntdAppProvider = ({ children }: { children: ReactNode }) => {
  const [notificationApi, notificationHolder] = notification.useNotification({
    maxCount: 5,
    placement: "topRight",
  });
  const [messageApi, messageHolder] = message.useMessage();

  useEffect(() => {
    setAntdNotification(notificationApi);
    setAntdMessage(messageApi);

    return () => {
      setAntdNotification(null);
      setAntdMessage(null);
    };
  }, [notificationApi, messageApi]);

  return (
    <>
      {notificationHolder}
      {messageHolder}
      {children}
    </>
  );
};
