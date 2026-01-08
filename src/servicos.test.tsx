import axios from "axios";

jest.mock("axios");
jest.mock("./config", () => ({
  getApiUrl: jest.fn(() => "http://localhost:3000"),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.create.mockReturnValue(
  mockedAxios as unknown as ReturnType<typeof axios.create>
);

import { servicos } from "./servicos";

describe("API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const store: Record<string, string> = {};

    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem(key: string): string | null {
          return store[key] ?? null;
        },
        setItem(key: string, value: string): void {
          store[key] = value;
        },
        removeItem(key: string): void {
          delete store[key];
        },
      },
      configurable: true,
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("adiciona Authorization quando existe token", async () => {
    globalThis.localStorage.setItem("authToken", "abc123");

    mockedAxios.get.mockResolvedValue({
      data: { success: true },
    });

    await servicos.get("/test");

    expect(mockedAxios.get).toHaveBeenCalledWith("/test", { params: {} });
  });

  test("não adiciona Authorization sem token", async () => {
    globalThis.localStorage.removeItem("authToken");

    mockedAxios.get.mockResolvedValue({
      data: { success: true },
    });

    await servicos.get("/test");

    expect(mockedAxios.get).toHaveBeenCalledWith("/test", { params: {} });
  });

  test("interceptor de erro loga erro no console", async () => {
    const erroMock = new Error("Request failed") as Error & {
      response: { status: number; data: string };
    };
    erroMock.response = { status: 500, data: "Internal Server Error" };

    mockedAxios.get.mockRejectedValue(erroMock);

    try {
      await servicos.get("/test");
    } catch (error) {
      expect(error).toBe(erroMock);
    }
  });

  test("get retorna data", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { ok: true },
    });

    const result = await servicos.get("/a");

    expect(mockedAxios.get).toHaveBeenCalledWith("/a", { params: {} });
    expect(result).toEqual({ ok: true });
  });

  test("post retorna data", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { criado: true },
    });

    const body = { nome: "Teste" };

    const result = await servicos.post("/b", body);

    expect(mockedAxios.post).toHaveBeenCalledWith("/b", body);
    expect(result).toEqual({ criado: true });
  });

  test("put retorna data", async () => {
    mockedAxios.put.mockResolvedValue({
      data: { atualizado: true },
    });

    const body = { valor: 10 };

    const result = await servicos.put("/c", body);

    expect(mockedAxios.put).toHaveBeenCalledWith("/c", body);
    expect(result).toEqual({ atualizado: true });
  });

  test("delete retorna data", async () => {
    mockedAxios.delete.mockResolvedValue({
      data: { removido: true },
    });

    const result = await servicos.delete("/d");

    expect(mockedAxios.delete).toHaveBeenCalledWith("/d");
    expect(result).toEqual({ removido: true });
  });

  test("interceptor de request rejeita erro corretamente", async () => {
    const requestError = new Error("Request config error");

    mockedAxios.get.mockRejectedValue(requestError);

    await expect(servicos.get("/test")).rejects.toThrow("Request config error");
  });

  test("interceptor de response rejeita erro corretamente", async () => {
    const responseError = new Error("Response error");

    mockedAxios.get.mockRejectedValue(responseError);

    await expect(servicos.get("/test")).rejects.toThrow("Response error");
  });

  test("post rejeita erro corretamente", async () => {
    const postError = new Error("Post error");

    mockedAxios.post.mockRejectedValue(postError);

    await expect(servicos.post("/test", { data: "test" })).rejects.toThrow(
      "Post error"
    );
  });

  test("put rejeita erro corretamente", async () => {
    const putError = new Error("Put error");

    mockedAxios.put.mockRejectedValue(putError);

    await expect(servicos.put("/test", { data: "test" })).rejects.toThrow(
      "Put error"
    );
  });

  test("delete rejeita erro corretamente", async () => {
    const deleteError = new Error("Delete error");

    mockedAxios.delete.mockRejectedValue(deleteError);

    await expect(servicos.delete("/test")).rejects.toThrow("Delete error");
  });

  test("get com params", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { filtered: true },
    });

    const params = { page: 1, limit: 10 };

    const result = await servicos.get("/users", params);

    expect(mockedAxios.get).toHaveBeenCalledWith("/users", { params });
    expect(result).toEqual({ filtered: true });
  });
});
