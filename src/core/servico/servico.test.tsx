import NovaSondagemServico from "./servico";
import apiNovaSondagem from "./api";

jest.mock("./api");

const mockedApi = apiNovaSondagem as jest.Mocked<typeof apiNovaSondagem>;

describe("NovaSondagemServico", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("deve chamar apiNovaSondagem.get com endpoint correto", async () => {
      mockedApi.get.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.get("/test");

      expect(mockedApi.get).toHaveBeenCalledWith("/test", {});
    });

    it("deve passar options para apiNovaSondagem.get", async () => {
      const options = { headers: { "X-Custom": "value" } };
      mockedApi.get.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.get("/test", options);

      expect(mockedApi.get).toHaveBeenCalledWith("/test", options);
    });

    it("deve retornar a resposta da API", async () => {
      const mockResponse = { data: { users: [] } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await NovaSondagemServico.get("/users");

      expect(result).toEqual(mockResponse);
    });
  });

  describe("post", () => {
    it("deve chamar apiNovaSondagem.post com endpoint e data", async () => {
      const data = { name: "Test" };
      mockedApi.post.mockResolvedValue({ data: { id: 1 } });

      await NovaSondagemServico.post("/test", data);

      expect(mockedApi.post).toHaveBeenCalledWith("/test", data, {});
    });

    it("deve passar options para apiNovaSondagem.post", async () => {
      const data = { name: "Test" };
      const options = { headers: { "Content-Type": "application/json" } };
      mockedApi.post.mockResolvedValue({ data: { id: 1 } });

      await NovaSondagemServico.post("/test", data, options);

      expect(mockedApi.post).toHaveBeenCalledWith("/test", data, options);
    });

    it("deve funcionar sem data", async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.post("/test");

      expect(mockedApi.post).toHaveBeenCalledWith("/test", undefined, {});
    });
  });

  describe("put", () => {
    it("deve chamar apiNovaSondagem.put com endpoint e data", async () => {
      const data = { id: 1, name: "Updated" };
      mockedApi.put.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.put("/test/1", data);

      expect(mockedApi.put).toHaveBeenCalledWith("/test/1", data, {});
    });

    it("deve passar options para apiNovaSondagem.put", async () => {
      const data = { name: "Updated" };
      const options = { params: { version: 2 } };
      mockedApi.put.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.put("/test/1", data, options);

      expect(mockedApi.put).toHaveBeenCalledWith("/test/1", data, options);
    });
  });

  describe("patch", () => {
    it("deve chamar apiNovaSondagem.patch com endpoint e data", async () => {
      const data = { status: "active" };
      mockedApi.patch.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.patch("/test/1", data);

      expect(mockedApi.patch).toHaveBeenCalledWith("/test/1", data, {});
    });

    it("deve passar options para apiNovaSondagem.patch", async () => {
      const data = { status: "active" };
      const options = { headers: { "X-Version": "1.0" } };
      mockedApi.patch.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.patch("/test/1", data, options);

      expect(mockedApi.patch).toHaveBeenCalledWith("/test/1", data, options);
    });
  });

  describe("delete", () => {
    it("deve chamar apiNovaSondagem.delete com endpoint", async () => {
      mockedApi.delete.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.delete("/test/1");

      expect(mockedApi.delete).toHaveBeenCalledWith("/test/1", {});
    });

    it("deve passar options para apiNovaSondagem.delete", async () => {
      const options = { params: { force: true } };
      mockedApi.delete.mockResolvedValue({ data: { success: true } });

      await NovaSondagemServico.delete("/test/1", options);

      expect(mockedApi.delete).toHaveBeenCalledWith("/test/1", options);
    });
  });

  describe("Tratamento de erros", () => {
    it("deve propagar erro do get", async () => {
      const error = new Error("Network error");
      mockedApi.get.mockRejectedValue(error);

      await expect(NovaSondagemServico.get("/test")).rejects.toThrow(
        "Network error"
      );
    });

    it("deve propagar erro do post", async () => {
      const error = new Error("Validation error");
      mockedApi.post.mockRejectedValue(error);

      await expect(
        NovaSondagemServico.post("/test", { data: "test" })
      ).rejects.toThrow("Validation error");
    });

    it("deve propagar erro do put", async () => {
      const error = new Error("Not found");
      mockedApi.put.mockRejectedValue(error);

      await expect(
        NovaSondagemServico.put("/test/1", { data: "test" })
      ).rejects.toThrow("Not found");
    });

    it("deve propagar erro do patch", async () => {
      const error = new Error("Unauthorized");
      mockedApi.patch.mockRejectedValue(error);

      await expect(
        NovaSondagemServico.patch("/test/1", { data: "test" })
      ).rejects.toThrow("Unauthorized");
    });

    it("deve propagar erro do delete", async () => {
      const error = new Error("Forbidden");
      mockedApi.delete.mockRejectedValue(error);

      await expect(NovaSondagemServico.delete("/test/1")).rejects.toThrow(
        "Forbidden"
      );
    });
  });
});
