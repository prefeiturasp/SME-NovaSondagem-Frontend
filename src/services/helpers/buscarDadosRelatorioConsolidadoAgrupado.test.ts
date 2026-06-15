import NovaSondagemServico from "../../core/servico/servico";
import buscarDadosRelatorioConsolidadoAgrupado from "./buscarDadosRelatorioConsolidadoAgrupado";
import { notificarErroRelatorio } from "./notificarErroRelatorio";

jest.mock("../../core/servico/servico");
jest.mock("./notificarErroRelatorio", () => ({
  notificarErroRelatorio: jest.fn(),
}));

describe("buscarDadosRelatorioConsolidadoAgrupado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar os dados quando a API responder com data", async () => {
    const retornoApi = { titulo: "Consolidado", questoes: [] };
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: retornoApi,
    });

    const resultado = await buscarDadosRelatorioConsolidadoAgrupado({
      endpoint: "/Relatorio/consolidado/genero",
      filtros: {
        anoLetivo: 2026,
        dre: "1",
        ue: "2",
        modalidade: "3",
        proficiencia: 4,
        componenteCurricular: 5,
        ano: [1, 2],
        semestreId: 2,
        bimestre: 2,
        genero: "10",
        raca: "11",
        programa: ["pap", "deficiente"],
        lpSegundaLingua: true,
      },
      token: "token-teste",
      mensagemConsole: "erro console",
      tituloNotificacao: "erro titulo",
      mensagemPadrao: "erro padrao",
    });

    expect(resultado).toEqual(retornoApi);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/genero",
      {
        headers: { "X-Token-Principal": "token-teste" },
        paramsSerializer: {
          indexes: null,
        },
        params: {
          AnoLetivo: 2026,
          Dre: "1",
          Ue: "2",
          Modalidade: "3",
          ProficienciaId: 4,
          ComponenteCurricularId: 5,
          AnoTurma: [1, 2],
          SemestreId: 2,
          BimestreId: 2,
          GeneroId: 10,
          RacaId: 11,
          Pap: true,
          Aee: undefined,
          Deficiente: true,
          PossuiLinguaPortuguesaSegundaLingua: true,
        },
      },
    );
  });

  it("deve normalizar campos numéricos inválidos para undefined", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    await buscarDadosRelatorioConsolidadoAgrupado({
      endpoint: "/Relatorio/consolidado/raca",
      filtros: {
        genero: "abc",
        raca: "",
      },
      token: "token-teste",
      mensagemConsole: "erro console",
      tituloNotificacao: "erro titulo",
      mensagemPadrao: "erro padrao",
    });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/raca",
      expect.objectContaining({
        params: expect.objectContaining({
          GeneroId: undefined,
          RacaId: undefined,
        }),
      }),
    );
  });

  it("não deve enviar SemestreId quando modalidade for 5", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    await buscarDadosRelatorioConsolidadoAgrupado({
      endpoint: "/Relatorio/consolidado/raca",
      filtros: {
        modalidade: 5,
        semestreId: Number.NaN,
      },
      token: "token-teste",
      mensagemConsole: "erro console",
      tituloNotificacao: "erro titulo",
      mensagemPadrao: "erro padrao",
    });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/raca",
      expect.objectContaining({
        params: expect.objectContaining({
          Modalidade: 5,
          SemestreId: undefined,
        }),
      }),
    );
  });

  it("deve notificar erro e retornar null quando ocorrer exceção", async () => {
    const erroMock = new Error("falha");
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(erroMock);

    const resultado = await buscarDadosRelatorioConsolidadoAgrupado({
      endpoint: "/Relatorio/consolidado/raca",
      filtros: {
        programa: [],
      },
      token: "token-teste",
      mensagemConsole: "console erro",
      tituloNotificacao: "titulo erro",
      mensagemPadrao: "padrao erro",
    });

    expect(resultado).toBeNull();
    expect(notificarErroRelatorio).toHaveBeenCalledWith({
      error: erroMock,
      mensagemConsole: "console erro",
      tituloNotificacao: "titulo erro",
      mensagemPadrao: "padrao erro",
    });
  });
});
