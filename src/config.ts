export const getApiUrl = (): string => {
  return import.meta.env.VITE_NOVA_SONDAGEM_API || "http://localhost:3000";
};
