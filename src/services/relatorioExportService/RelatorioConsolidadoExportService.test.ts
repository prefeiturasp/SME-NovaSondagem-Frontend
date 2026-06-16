import NovaSondagemServico from "../../core/servico/servico";
import RelatorioConsolidadoExportService from "./RelatorioConsolidadoExportService";

jest.mock("../../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("RelatorioConsolidadoExportService", () => {
  const filtrosBase = {
    anoLetivo: 2026,
    modalidade: 1,
    dre: 10,
    ue: 20,
    bimestre: 2,
    ano: [1, 2],
    componenteCurricular: 3,
    proficiencia: 4,
    genero: 5,
    raca: 6,
    programa: ["pap", "aee"],
    lpSegundaLingua: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar true e enviar todos os parâmetros quando preenchidos", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 1,
      filtros: filtrosBase,
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/bimestre/exportar",
      {
        headers: { "X-Token-Principal": "token-teste" },
        paramsSerializer: {
          indexes: null,
        },
        params: {
          ExtensaoRelatorio: 1,
          AnoLetivo: 2026,
          Dre: 10,
          Ue: 20,
          Modalidade: 1,
          ProficienciaId: 4,
          ComponenteCurricularId: 3,
          AnoTurma: [1, 2],
          SemestreId: undefined,
          BimestreId: 2,
          GeneroId: 5,
          RacaId: 6,
          Pap: true,
          Aee: true,
          Deficiente: undefined,
          PossuiLinguaPortuguesaSegundaLingua: true,
        },
      },
    );
  });

  it("deve usar endpoint de gênero quando agrupamento for porGenero", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 1,
      filtros: {
        ...filtrosBase,
        agrupamentoDados: "porGenero",
      },
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/genero/exportar",
      expect.any(Object),
    );
  });

  it("deve usar endpoint de raça quando agrupamento for porRacas", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 4,
      filtros: {
        ...filtrosBase,
        agrupamentoDados: "porRacas",
      },
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/raca/exportar",
      expect.any(Object),
    );
  });

  it("deve usar endpoint de raça e gênero quando agrupamento for porRacaGenero", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 1,
      filtros: {
        ...filtrosBase,
        agrupamentoDados: "porRacaGenero",
      },
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/raca-genero/exportar",
      expect.any(Object),
    );
  });

  it("deve usar endpoint de ano quando agrupamento for porQuestoes", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 4,
      filtros: {
        ...filtrosBase,
        agrupamentoDados: "porQuestoes",
      },
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/ano/exportar",
      expect.any(Object),
    );
  });

  it("deve omitir campos opcionais nulos/undefined e manter lpSegundaLingua", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 4,
      filtros: {
        anoLetivo: 2026,
        modalidade: undefined,
        dre: undefined,
        ue: undefined,
        bimestre: null,
        ano: [],
        componenteCurricular: undefined,
        proficiencia: undefined,
        genero: undefined,
        raca: undefined,
        programa: [],
        lpSegundaLingua: false,
      },
      token: "token-teste",
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/consolidado/bimestre/exportar",
      {
        headers: { "X-Token-Principal": "token-teste" },
        paramsSerializer: {
          indexes: null,
        },
        params: {
          ExtensaoRelatorio: 4,
          AnoLetivo: 2026,
          Dre: undefined,
          Ue: undefined,
          Modalidade: undefined,
          ProficienciaId: undefined,
          ComponenteCurricularId: undefined,
          AnoTurma: [],
          SemestreId: undefined,
          BimestreId: undefined,
          GeneroId: undefined,
          RacaId: undefined,
          Pap: undefined,
          Aee: undefined,
          Deficiente: undefined,
          PossuiLinguaPortuguesaSegundaLingua: false,
        },
      },
    );
  });

  it("deve retornar false quando ocorrer erro no endpoint", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("falha ao exportar consolidado"),
    );

    const resultado = await RelatorioConsolidadoExportService({
      extensaoRelatorio: 1,
      filtros: filtrosBase,
      token: "token-teste",
    });

    expect(resultado).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erro ao exportar relatório consolidado:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
