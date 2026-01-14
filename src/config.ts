declare global {
  interface Window {
    __ENV__?: {
      VITE_NOVA_SONDAGEM_API?: string;
    };
  }
}

export const getApiUrl = (): string => {
  const api = window.__ENV__?.VITE_NOVA_SONDAGEM_API;

  if (!api) {
    throw new Error("VITE_NOVA_SONDAGEM_API não definida em env.js");
  }

  return api;
};