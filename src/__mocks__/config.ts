/**
 * Mock configuration for tests
 * Avoids import.meta issues in Jest
 */

export const getApiUrl = (): string => {
  if ((window as any).__ENV__?.VITE_NOVA_SONDAGEM_API) {
    return (window as any).__ENV__.VITE_NOVA_SONDAGEM_API;
  }

  return "http://localhost:5173";
};

export const getSgpApiUrl = (): string => {
  if ((window as any).__ENV__?.VITE_SGP_API) {
    return (window as any).__ENV__.VITE_SGP_API;
  }

  return "http://localhost:5173";
};
