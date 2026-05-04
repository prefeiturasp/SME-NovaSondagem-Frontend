import type {
  DadosRelatorioConsolidadoPorBimestres,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import buscarDadosRelatorioConsolidadoAgrupado from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface BuscarDadosRelatorioConsolidadoPorBimestresParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoPorBimestresService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoPorBimestresParams): Promise<DadosRelatorioConsolidadoPorBimestres | null> => {
  return buscarDadosRelatorioConsolidadoAgrupado<DadosRelatorioConsolidadoPorBimestres>(
    {
      endpoint: "/Relatorio/consolidado/bimestre",
      filtros,
      token,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por bimestres:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por bimestres",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por bimestres. Tente novamente.",
    },
  );
};

export default BuscarDadosRelatorioConsolidadoPorBimestresService;
