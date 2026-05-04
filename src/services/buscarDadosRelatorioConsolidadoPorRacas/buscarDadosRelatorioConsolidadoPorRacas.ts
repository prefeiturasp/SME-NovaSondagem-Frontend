import type {
  DadosRelatorioConsolidadoPorRacas,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface BuscarDadosRelatorioConsolidadoPorRacasParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoPorRacasService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoPorRacasParams): Promise<DadosRelatorioConsolidadoPorRacas | null> => {
  return buscarDadosRelatorioConsolidadoAgrupado<DadosRelatorioConsolidadoPorRacas>(
    {
      endpoint: "/Relatorio/consolidado/raca",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por raças:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por raças",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por raças. Tente novamente.",
    },
  );
};

export default BuscarDadosRelatorioConsolidadoPorRacasService;
