import type {
  DadosRelatorioConsolidadoPorRacaGenero,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface BuscarDadosRelatorioConsolidadoPorRacaGeneroParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoPorRacaGeneroService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoPorRacaGeneroParams): Promise<DadosRelatorioConsolidadoPorRacaGenero | null> => {
  return buscarDadosRelatorioConsolidadoAgrupado<DadosRelatorioConsolidadoPorRacaGenero>(
    {
      endpoint: "/Relatorio/consolidado/raca-genero",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por raça e gênero:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por raça e gênero",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por raça e gênero. Tente novamente.",
    },
  );
};

export default BuscarDadosRelatorioConsolidadoPorRacaGeneroService;
