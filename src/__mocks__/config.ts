export const getApiUrl = (): string => {
  return process.env.VITE_NOVA_SONDAGEM_API ?? "http://localhost:3000";
};
