import apiNovaSondagem from "./api";

interface ApiOptions {
  headers?: Record<string, any>;
  params?: Record<string, any>;
}

const NovaSondagemServico = {
  get: (endpoint: string, options: ApiOptions = {}) =>
    apiNovaSondagem.get(endpoint, options),

  post: (endpoint: string, data?: any, options: ApiOptions = {}) =>
    apiNovaSondagem.post(endpoint, data, options),

  put: (endpoint: string, data?: any, options: ApiOptions = {}) =>
    apiNovaSondagem.put(endpoint, data, options),

  patch: (endpoint: string, data?: any, options: ApiOptions = {}) =>
    apiNovaSondagem.patch(endpoint, data, options),

  delete: (endpoint: string, options: ApiOptions = {}) =>
    apiNovaSondagem.delete(endpoint, options),
};

export default NovaSondagemServico;
