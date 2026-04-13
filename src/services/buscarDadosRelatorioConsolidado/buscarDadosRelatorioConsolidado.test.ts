import NovaSondagemServico from "../../core/servico/servico";
import BuscarDadosRelatorioConsolidadoService from "./buscarDadosRelatorioConsolidado";
import { notificarErroRelatorio } from "../helpers/notificarErroRelatorio";

jest.mock("../../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("../helpers/notificarErroRelatorio", () => ({
  notificarErroRelatorio: jest.fn(),
}));

describe("BuscarDadosRelatorioConsolidadoService", () => {
  const filtrosBase = {
    anoLetivo: 2026,
    modalidade: 1,
    dre: 10,
    ue: 20,
    bimestre: 2,
    ano: [1, 2],
    componenteCurricular: 3,
    proficiencia: 4,
    genero: "5",
    raca: "6",
    programa: ["pap", "deficiente"],
    lpSegundaLingua: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar endpoint com params corretos e retornar dados", async () => {
    const dadosMock = { titulo: "Consolidado", questoes: [] };
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: dadosMock,
    });

    const resultado = await BuscarDadosRelatorioConsolidadoService({
      filtros: filtrosBase,
      token: "token-teste",
    });

    expect(resultado).toEqual(dadosMock);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consoliado/ano",
      {
        headers: { "X-Token-Principal": "token-teste" },
        paramsSerializer: { indexes: null },
        params: {
          AnoLetivo: 2026,
          Dre: 10,
          Ue: 20,
          Modalidade: 1,
          ProficienciaId: 4,
          ComponenteCurricularId: 3,
          AnoTurma: [1, 2],
          BimestreId: 2,
          GeneroId: 5,
          RacaId: 6,
          Pap: true,
          Aee: false,
          Deficiente: true,
          PossuiLinguaPortuguesaSegundaLingua: false,
        },
      },
    );
  });

  it("deve enviar flags de programa como undefined quando programa não informado", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await BuscarDadosRelatorioConsolidadoService({
      filtros: {
        ...filtrosBase,
        programa: undefined,
        genero: "",
        raca: "",
      },
      token: "token-teste",
    });

    expect(resultado).toBeNull();
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consoliado/ano",
      expect.objectContaining({
        params: expect.objectContaining({
          Pap: undefined,
          Aee: undefined,
          Deficiente: undefined,
          GeneroId: undefined,
          RacaId: undefined,
        }),
      }),
    );
  });

  it("deve notificar erro e retornar null quando requisição falhar", async () => {
    const erro = new Error("falha");
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(erro);

    const resultado = await BuscarDadosRelatorioConsolidadoService({
      filtros: filtrosBase,
      token: "token-teste",
    });

    expect(resultado).toBeNull();
    expect(notificarErroRelatorio).toHaveBeenCalledWith(
      expect.objectContaining({
        error: erro,
        tituloNotificacao: "Erro ao carregar dados do relatório consolidado",
      }),
    );
  });
});
