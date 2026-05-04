import BuscarDadosRelatorioConsolidadoPorRacaGeneroService from "./buscarDadosRelatorioConsolidadoPorRacaGenero";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

jest.mock("../helpers/buscarDadosRelatorioConsolidadoAgrupado", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("BuscarDadosRelatorioConsolidadoPorRacaGeneroService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve delegar a busca para o helper compartilhado com endpoint de raça e gênero", async () => {
    const retornoMock = { titulo: "ok", questoes: [] };
    (
      buscarDadosRelatorioConsolidadoAgrupado as jest.Mock
    ).mockResolvedValueOnce(retornoMock);

    const filtros = { anoLetivo: 2026 };
    const token = "token-teste";

    const resultado = await BuscarDadosRelatorioConsolidadoPorRacaGeneroService(
      {
        filtros,
        token,
      },
    );

    expect(resultado).toEqual(retornoMock);
    expect(buscarDadosRelatorioConsolidadoAgrupado).toHaveBeenCalledWith({
      endpoint: "/Relatorio/consolidado/raca-genero",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por raça e gênero:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por raça e gênero",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por raça e gênero. Tente novamente.",
    });
  });
});
