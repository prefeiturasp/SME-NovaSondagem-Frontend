import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";
import { montarParametrosRelatorioConsolidado } from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface RelatorioConsolidadoExportParams {
  extensaoRelatorio: 1 | 4;
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const obterEndpointExportConsolidado = (agrupamentoDados?: string): string => {
  if (agrupamentoDados === "porGenero") {
    return "/Relatorio/consolidado/genero/exportar";
  }

  if (agrupamentoDados === "porRacas" || agrupamentoDados === "porRaca") {
    return "/Relatorio/consolidado/raca/exportar";
  }

  if (agrupamentoDados === "porRacaGenero") {
    return "/Relatorio/consolidado/raca-genero/exportar";
  }

  if (agrupamentoDados === "porQuestoes") {
    return "/Relatorio/consolidado/ano/exportar";
  }

  return "/Relatorio/consolidado/bimestre/exportar";
};

const RelatorioConsolidadoExportService = async ({
  extensaoRelatorio,
  filtros,
  token,
}: RelatorioConsolidadoExportParams): Promise<boolean> => {
  try {
    const params = {
      ExtensaoRelatorio: extensaoRelatorio,
      ...montarParametrosRelatorioConsolidado(filtros),
    };

    const endpoint = obterEndpointExportConsolidado(filtros.agrupamentoDados);

    await NovaSondagemServico.get(endpoint, {
      headers: { "X-Token-Principal": token },
      paramsSerializer: {
        indexes: null,
      },
      params,
    });

    return true;
  } catch (error: unknown) {
    console.error("Erro ao exportar relatório consolidado:", error);
    return false;
  }
};

export default RelatorioConsolidadoExportService;
