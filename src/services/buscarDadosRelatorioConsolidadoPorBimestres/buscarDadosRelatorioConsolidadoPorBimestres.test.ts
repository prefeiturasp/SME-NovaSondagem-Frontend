import BuscarDadosRelatorioConsolidadoPorBimestresService from "./buscarDadosRelatorioConsolidadoPorBimestres";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

jest.mock("../helpers/buscarDadosRelatorioConsolidadoAgrupado", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("BuscarDadosRelatorioConsolidadoPorBimestresService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve delegar a busca para o helper compartilhado com endpoint de bimestre", async () => {
    const retornoMock = { titulo: "ok", questoes: [] };
    (
      buscarDadosRelatorioConsolidadoAgrupado as jest.Mock
    ).mockResolvedValueOnce(retornoMock);

    const filtros = { anoLetivo: 2026 };
    const token = "token-teste";

    const resultado = await BuscarDadosRelatorioConsolidadoPorBimestresService({
      filtros,
      token,
    });

    expect(resultado).toEqual(retornoMock);
    expect(buscarDadosRelatorioConsolidadoAgrupado).toHaveBeenCalledWith({
      endpoint: "/Relatorio/consolidado/bimestre",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por bimestres:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por bimestres",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por bimestres. Tente novamente.",
    });
  });
});
