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
      "/sondagem/relatorio/consolidado/exportar?extensaoRelatorio=1&anoLetivo=2026&modalidade=1&dre=10&ue=20&bimestre=2&componenteCurricular=3&proficiencia=4&genero=5&raca=6&ano=1&ano=2&programa=pap&programa=aee&lpSegundaLingua=true",
      {
        headers: { "X-Token-Principal": "token-teste" },
      },
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
      "/sondagem/relatorio/consolidado/exportar?extensaoRelatorio=4&anoLetivo=2026",
      {
        headers: { "X-Token-Principal": "token-teste" },
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
