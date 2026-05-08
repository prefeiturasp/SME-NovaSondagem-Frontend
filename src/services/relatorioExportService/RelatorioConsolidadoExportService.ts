import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";
import { montarParametrosRelatorioConsolidado } from "../helpers/buscarDadosRelatorioConsolidadoAgrupado";

interface RelatorioConsolidadoExportParams {
  extensaoRelatorio: 1 | 4;
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

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

    await NovaSondagemServico.get("/Relatorio/consolidado/bimestre/exportar", {
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
