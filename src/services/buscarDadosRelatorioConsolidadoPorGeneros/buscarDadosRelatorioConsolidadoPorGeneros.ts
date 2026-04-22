import type {
  DadosRelatorioConsolidadoPorGeneros,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface BuscarDadosRelatorioConsolidadoPorGenerosParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoPorGenerosService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoPorGenerosParams): Promise<DadosRelatorioConsolidadoPorGeneros | null> => {
  return buscarDadosRelatorioConsolidadoAgrupado<DadosRelatorioConsolidadoPorGeneros>(
    {
      endpoint: "/Relatorio/consolidado/genero",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por gênero:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por gênero",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por gênero. Tente novamente.",
    },
  );
};

export default BuscarDadosRelatorioConsolidadoPorGenerosService;
