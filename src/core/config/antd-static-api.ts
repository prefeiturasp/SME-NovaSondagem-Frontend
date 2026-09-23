// Registro global das APIs hook-based do antd (compatível com React 19).
// Métodos estáticos (notification.error / message.error) não renderizam no React 19.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let notificationApi: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let messageApi: any = null;

export const setAntdNotification = (api: typeof notificationApi): void => {
  notificationApi = api;
};

export const setAntdMessage = (api: typeof messageApi): void => {
  messageApi = api;
};

export const getAntdNotification = () => notificationApi;
export const getAntdMessage = () => messageApi;
