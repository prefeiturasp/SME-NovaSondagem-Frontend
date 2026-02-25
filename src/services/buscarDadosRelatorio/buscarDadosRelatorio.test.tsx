import NovaSondagemServico from "../../core/servico/servico";
import DadosRelatorioService from "./buscarDadosRelatorio";
import { notification } from "antd";

jest.mock("../../core/servico/servico");
jest.mock("antd", () => ({
  notification: {
    error: jest.fn(),
  },
}));

describe("DadosRelatorioService", () => {
  const parametrosBase = {
    turmaId: 123,
    proficienciaId: 6,
    componenteCurricularId: 1,
    modalidade: 3,
    ano: 5,
    anoLetivo: 2026,
    semestre: 1,
    ueCodigo: "123456",
    token: "token-teste",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar endpoint com headers e params corretos e retornar os dados", async () => {
    const dadosMock = {
      tituloTabelaRespostas: "Sistema de escrita",
      estudantes: [],
      legenda: [],
    };

    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: dadosMock,
    });

    const resultado = await DadosRelatorioService({
      ...parametrosBase,
      bimestreId: null,
    });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/sondagem-por-turma",
      {
        headers: { "X-Token-Principal": parametrosBase.token },
        params: {
          turmaId: parametrosBase.turmaId,
          proficienciaId: parametrosBase.proficienciaId,
          componenteCurricularId: parametrosBase.componenteCurricularId,
          modalidade: parametrosBase.modalidade,
          ano: parametrosBase.ano,
          anoLetivo: parametrosBase.anoLetivo,
          semestre: parametrosBase.semestre,
          ueCodigo: parametrosBase.ueCodigo,
          bimestreId: null,
        },
      },
    );

    expect(resultado).toEqual(dadosMock);
  });

  it("deve retornar null quando resposta vier sem data", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await DadosRelatorioService({
      ...parametrosBase,
      bimestreId: 2,
    });

    expect(resultado).toBeNull();
  });

  it("deve aceitar chamada sem bimestreId e manter retorno com dados", async () => {
    const dadosMock = {
      tituloTabelaRespostas: "Leitura",
      estudantes: [],
      legenda: [],
    };

    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: dadosMock,
    });

    const resultado = await DadosRelatorioService(parametrosBase);

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/sondagem-por-turma",
      expect.objectContaining({
        params: expect.objectContaining({
          bimestreId: undefined,
        }),
      }),
    );
    expect(resultado).toEqual(dadosMock);
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("erro de rede"),
    );

    const resultado = await DadosRelatorioService({
      ...parametrosBase,
      bimestreId: 3,
    });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro ao carregar dados do relatório",
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it("deve exibir detalhes da API na notificação quando houver campo errors", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          title: "Falha de validação",
          errors: {
            turmaId: ["Turma inválida"],
            ueCodigo: ["UE não encontrada"],
          },
        },
      },
    });

    const resultado = await DadosRelatorioService({
      ...parametrosBase,
      bimestreId: null,
    });

    expect(resultado).toBeNull();
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro ao carregar dados do relatório",
        description: expect.stringContaining("turmaId: Turma inválida"),
      }),
    );
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.stringContaining("ueCodigo: UE não encontrada"),
      }),
    );

    consoleErrorSpy.mockRestore();
  });
});
