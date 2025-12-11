import axios from "axios";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: Error) => {
    console.error("Erro na API:", error);
    return Promise.reject(error);
  }
);

export const servicos = {
  async get<T = unknown>(endpoint: string, params: Record<string, unknown> = {}): Promise<T> {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  },

  async post<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  },

  async put<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  },

  async delete<T = unknown>(endpoint: string): Promise<T> {
    const response = await api.delete<T>(endpoint);
    return response.data;
  },
};

export default api;
