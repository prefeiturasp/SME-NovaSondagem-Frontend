import axios from "axios";

//const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";
const apiUrl = import.meta.env.VITE_NOVA_SONDAGEM_API;

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response || error.message);
    return Promise.reject(error);
  }
);

export const servicos = {
  async get(endpoint: string, params = {}) {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  async post(endpoint: string, data: any) {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  async put(endpoint: string, data: any) {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  async delete(endpoint: string) {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export default api;
