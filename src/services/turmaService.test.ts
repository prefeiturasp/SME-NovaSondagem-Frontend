import NovaSondagemServico from "../core/servico/servico";
import { validarTurma } from "./turmaService";

jest.mock("../core/servico/servico");

describe("turmaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validarTurma", () => {
    it("deve retornar turma válida quando a resposta é true", async () => {
      const mockToken = "mock-token";
      const mockTurmaId = 1;

      (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
        data: true,
      });

      const resultado = await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(resultado).toEqual({
        valida: true,
        mensagens: [],
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/Turma/validar-turma",
        {
          headers: { "X-Token-Principal": mockToken },
          params: { turmaId: mockTurmaId },
        },
      );
    });

    it("deve retornar turma inválida quando a resposta é false", async () => {
      const mockToken = "mock-token";
      const mockTurmaId = 1;

      (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
        data: false,
      });

      const resultado = await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(resultado).toEqual({
        valida: false,
        mensagens: [],
      });
    });

    it("deve retornar mensagem de erro quando a requisição falha", async () => {
      const mockToken = "mock-token";
      const mockTurmaId = 1;
      const mockErrorMessage = "Turma não encontrada";

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            message: mockErrorMessage,
          },
        },
      });

      const resultado = await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(resultado).toEqual({
        valida: false,
        mensagens: [mockErrorMessage],
      });

      consoleErrorSpy.mockRestore();
    });

    it("deve retornar mensagem de erro padrão quando não há message na resposta", async () => {
      const mockToken = "mock-token";
      const mockTurmaId = 1;

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {},
        },
      });

      const resultado = await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(resultado).toEqual({
        valida: false,
        mensagens: ["Erro ao validar turma."],
      });

      consoleErrorSpy.mockRestore();
    });

    it("deve retornar mensagem de erro padrão quando não há response", async () => {
      const mockToken = "mock-token";
      const mockTurmaId = 1;

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce({
        message: "Network error",
      });

      const resultado = await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(resultado).toEqual({
        valida: false,
        mensagens: ["Erro ao validar turma."],
      });

      consoleErrorSpy.mockRestore();
    });

    it("deve fazer chamada com os parâmetros corretos", async () => {
      const mockToken = "test-token-123";
      const mockTurmaId = 42;

      (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
        data: true,
      });

      await validarTurma({
        turmaId: mockTurmaId,
        token: mockToken,
      });

      expect(NovaSondagemServico.get).toHaveBeenCalledWith(
        "/Turma/validar-turma",
        {
          headers: { "X-Token-Principal": mockToken },
          params: { turmaId: mockTurmaId },
        },
      );

      expect(NovaSondagemServico.get).toHaveBeenCalledTimes(1);
    });
  });
});
