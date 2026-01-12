import axios from "axios";
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";
import { getApiUrl } from "../../config";

const baseURL = getApiUrl();

interface TokenResponse {
  apiAToken: string;
}

interface CustomAxiosInstance extends AxiosInstance {
  CancelarRequisicoes: () => void;
}

let CancelToken = axios.CancelToken.source();
const TOKEN_KEY = "nova_sondagem_token";

const apiNovaSondagem = axios.create({ baseURL }) as CustomAxiosInstance;

const autenticar = async (tokenPrincipal: string): Promise<string> => {
  const response = await axios.post<TokenResponse>(
    `${baseURL}/Autenticacao`,
    tokenPrincipal,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const novoToken = response.data.apiAToken;

  localStorage.setItem(TOKEN_KEY, novoToken);
  return novoToken;
};

const getOuAutenticaToken = async (
  tokenPrincipal?: string
): Promise<string> => {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token && tokenPrincipal) {
    token = await autenticar(tokenPrincipal);
  }
  if (!token)
    throw new Error(
      "Token inválido - forneça X-Token-Principal na primeira chamada"
    );
  return token;
};

apiNovaSondagem.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const tokenPrincipal = config.headers["X-Token-Principal"] as string;
    const token = await getOuAutenticaToken(tokenPrincipal);
    config.headers.Authorization = `Bearer ${token}`;
    config.cancelToken = CancelToken.token;
    delete config.headers["X-Token-Principal"];
    return config;
  },
  (error) => Promise.reject(error)
);

apiNovaSondagem.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

apiNovaSondagem.CancelarRequisicoes = () => {
  CancelToken.cancel("Cancelado");
  CancelToken = axios.CancelToken.source();
};

export default apiNovaSondagem;
