import BuscarDadosRelatorioConsolidadoPorGenerosService from "./buscarDadosRelatorioConsolidadoPorGeneros";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

jest.mock("../helpers/buscarDadosRelatorioConsolidadoAgrupado", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("BuscarDadosRelatorioConsolidadoPorGenerosService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve delegar a busca para o helper compartilhado com endpoint de gênero", async () => {
    const retornoMock = { titulo: "ok", questoes: [] };
    (
      buscarDadosRelatorioConsolidadoAgrupado as jest.Mock
    ).mockResolvedValueOnce(retornoMock);

    const filtros = { anoLetivo: 2026 };
    const token = "token-teste";

    const resultado = await BuscarDadosRelatorioConsolidadoPorGenerosService({
      filtros,
      token,
    });

    expect(resultado).toEqual(retornoMock);
    expect(buscarDadosRelatorioConsolidadoAgrupado).toHaveBeenCalledWith({
      endpoint: "/Relatorio/consoliado/genero",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por gênero:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por gênero",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por gênero. Tente novamente.",
    });
  });
});
