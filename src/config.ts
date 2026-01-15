export const getApiUrl = (): string => {
  if ((window as any).__ENV__?.VITE_NOVA_SONDAGEM_API) {
    return (window as any).__ENV__.VITE_NOVA_SONDAGEM_API;
  }

  if (import.meta.env.VITE_NOVA_SONDAGEM_API) {
    return import.meta.env.VITE_NOVA_SONDAGEM_API;
  }

  return window.__ENV__!.VITE_NOVA_SONDAGEM_API!;
};