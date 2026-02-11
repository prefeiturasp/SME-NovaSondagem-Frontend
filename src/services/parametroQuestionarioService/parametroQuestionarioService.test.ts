import { parametroQuestionarioService } from "./parametroQuestionarioService";
import NovaSondagemServico from "../../core/servico/servico";

jest.mock("../../core/servico/servico");

describe("parametroQuestionarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Sucesso - Casos válidos", () => {
    it("deve retornar array de parâmetros quando chamada com sucesso", async () => {
      const mockResponseData = [
        {
          id: 1,
          idQuestionario: 100,
          tipo: "PossuiLinguaPortuguesaSegundaLingua",
          valor: "true",
        },
        {
          id: 2,
          idQuestionario: 100,
          tipo: "OutroParametro",
          valor: "false",
        },
      ];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 100,
        token: "token-123",
      });

      expect(resultado).toEqual(mockResponseData);
      expect(resultado).toHaveLength(2);
    });

    it("deve passar idQuestionario corretamente nos params", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 42,
        token: "token-teste",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/42",
        expect.objectContaining({
          headers: { "X-Token-Principal": "token-teste" },
        }),
      );
    });

    it("deve passar token corretamente nos headers", async () => {
      const mockResponseData: any[] = [];
      const token = "meu-token-secreto";

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 50,
        token,
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/50",
        expect.objectContaining({
          headers: { "X-Token-Principal": token },
        }),
      );
    });

    it("deve chamar o endpoint correto", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/1",
        expect.any(Object),
      );
    });

    it("deve retornar array vazio quando resposta não contém dados", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: [],
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
    });

    it("deve extrair corretamente os dados da resposta", async () => {
      const mockResponseData = [
        {
          id: 10,
          idQuestionario: 25,
          tipo: "TipoA",
          valor: "valorA",
        },
      ];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 25,
        token: "token-xyz",
      });

      expect(resultado[0].id).toBe(10);
      expect(resultado[0].idQuestionario).toBe(25);
      expect(resultado[0].tipo).toBe("TipoA");
      expect(resultado[0].valor).toBe("valorA");
    });
  });

  describe("Casos específicos de parâmetros", () => {
    it("deve funcionar com idQuestionario = 0", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 0,
        token: "token",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/0",
        expect.objectContaining({
          headers: { "X-Token-Principal": "token" },
        }),
      );
    });

    it("deve funcionar com idQuestionario grande", async () => {
      const mockResponseData: any[] = [];
      const largeId = 999999;

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: largeId,
        token: "token",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/999999",
        expect.objectContaining({
          headers: { "X-Token-Principal": "token" },
        }),
      );
    });

    it("deve funcionar com token vazio", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: "",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/1",
        expect.objectContaining({
          headers: { "X-Token-Principal": "" },
        }),
      );
    });

    it("deve funcionar com token longo", async () => {
      const mockResponseData: any[] = [];
      const longToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: longToken,
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/1",
        expect.objectContaining({
          headers: { "X-Token-Principal": longToken },
        }),
      );
    });
  });

  describe("Erro handling", () => {
    it("deve retornar array vazio quando há erro de rede", async () => {
      const erro = new Error("Network Error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
    });

    it("deve logar erro no console quando há exceção", async () => {
      const erro = new Error("Erro ao validar questionário");
      const consoleSpy = jest.spyOn(console, "error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao validar questionário:",
        erro,
      );
    });

    it("deve retornar array vazio quando resposta é null", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: null,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual(null);
    });

    it("deve retornar array vazio quando resposta é undefined", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: undefined,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual(undefined);
    });

    it("deve lidar com erro de tipo 401 (Não autorizado)", async () => {
      const erro = new Error("401 Unauthorized");
      const consoleSpy = jest.spyOn(console, "error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token-invalido",
      });

      expect(resultado).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("deve lidar com erro de tipo 404 (Não encontrado)", async () => {
      const erro = new Error("404 Not Found");
      const consoleSpy = jest.spyOn(console, "error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      const resultado = await parametroQuestionarioService({
        idQuestionario: 99999,
        token: "token",
      });

      expect(resultado).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("deve lidar com erro de tipo 500 (Erro no servidor)", async () => {
      const erro = new Error("500 Internal Server Error");
      const consoleSpy = jest.spyOn(console, "error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("deve lidar com erro de timeout", async () => {
      const erro = new Error("Request timeout");
      const consoleSpy = jest.spyOn(console, "error");

      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(erro);

      const resultado = await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("Casos de múltiplos parâmetros", () => {
    it("deve retornar múltiplos parâmetros do mesmo questionário", async () => {
      const mockResponseData = [
        {
          id: 1,
          idQuestionario: 50,
          tipo: "PossuiLinguaPortuguesaSegundaLingua",
          valor: "true",
        },
        {
          id: 2,
          idQuestionario: 50,
          tipo: "PossuiDeficiencia",
          valor: "false",
        },
        {
          id: 3,
          idQuestionario: 50,
          tipo: "OutroTipo",
          valor: "sim",
        },
      ];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 50,
        token: "token",
      });

      expect(resultado).toHaveLength(3);
      expect(resultado.map((p) => p.idQuestionario)).toEqual([50, 50, 50]);
    });

    it("deve preservar tipos de dados dos parâmetros", async () => {
      const mockResponseData = [
        {
          id: 123,
          idQuestionario: 456,
          tipo: "TipoParametro",
          valor: "valor-teste",
        },
      ];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      const resultado = await parametroQuestionarioService({
        idQuestionario: 456,
        token: "token",
      });

      expect(typeof resultado[0].id).toBe("number");
      expect(typeof resultado[0].idQuestionario).toBe("number");
      expect(typeof resultado[0].tipo).toBe("string");
      expect(typeof resultado[0].valor).toBe("string");
    });
  });

  describe("Comportamento assíncrono", () => {
    it("deve ser uma função assíncrona que retorna promise", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      const resultado = parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(resultado).toBeInstanceOf(Promise);

      const resolved = await resultado;
      expect(resolved).toEqual(mockResponseData);
    });

    it("deve aguardar a resposta da API antes de retornar", async () => {
      const mockResponseData = [
        {
          id: 1,
          idQuestionario: 1,
          tipo: "tipo",
          valor: "valor",
        },
      ];

      let resolvePromise: any;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (NovaSondagemServico.get as jest.Mock).mockReturnValue(delayedPromise);

      const promise = parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      // Promise não foi resolvida ainda
      let resolved = false;
      promise.then(() => {
        resolved = true;
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(resolved).toBe(false);

      // Resolver a promise do serviço
      resolvePromise({ data: mockResponseData });

      await promise;
      expect(resolved).toBe(true);
    });
  });

  describe("Integração com NovaSondagemServico", () => {
    it("deve chamar NovaSondagemServico.get exatamente uma vez", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledTimes(1);
    });

    it("deve chamar NovaSondagemServico.get com os parâmetros corretos", async () => {
      const mockResponseData: any[] = [];
      const idQuestionario = 123;
      const token = "token-abc";

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario,
        token,
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/ParametroQuestionario/questionario/123",
        {
          headers: { "X-Token-Principal": token },
        },
      );
    });

    it("deve não chamar outras funções de NovaSondagemServico", async () => {
      const mockResponseData: any[] = [];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockResponseData,
      });

      await parametroQuestionarioService({
        idQuestionario: 1,
        token: "token",
      });

      expect(NovaSondagemServico.get).toHaveBeenCalled();
    });
  });
});
