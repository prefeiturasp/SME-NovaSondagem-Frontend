import BuscarDadosRelatorioConsolidadoPorRacasService from "./buscarDadosRelatorioConsolidadoPorRacas";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

jest.mock("../helpers/buscarDadosRelatorioConsolidadoAgrupado", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("BuscarDadosRelatorioConsolidadoPorRacasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve delegar a busca para o helper compartilhado com endpoint de raça", async () => {
    const retornoMock = { titulo: "ok", questoes: [] };
    (
      buscarDadosRelatorioConsolidadoAgrupado as jest.Mock
    ).mockResolvedValueOnce(retornoMock);

    const filtros = { anoLetivo: 2026 };
    const token = "token-teste";

    const resultado = await BuscarDadosRelatorioConsolidadoPorRacasService({
      filtros,
      token,
    });

    expect(resultado).toEqual(retornoMock);
    expect(buscarDadosRelatorioConsolidadoAgrupado).toHaveBeenCalledWith({
      endpoint: "/Relatorio/consoliado/raca",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por raças:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por raças",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por raças. Tente novamente.",
    });
  });
});
