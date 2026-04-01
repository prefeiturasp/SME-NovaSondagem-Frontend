import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";

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
    const params = new URLSearchParams();
    params.append("extensaoRelatorio", String(extensaoRelatorio));

    if (filtros.anoLetivo !== undefined) {
      params.append("anoLetivo", String(filtros.anoLetivo));
    }
    if (filtros.modalidade !== undefined) {
      params.append("modalidade", String(filtros.modalidade));
    }
    if (filtros.dre !== undefined) {
      params.append("dre", String(filtros.dre));
    }
    if (filtros.ue !== undefined) {
      params.append("ue", String(filtros.ue));
    }
    if (filtros.bimestre !== null && filtros.bimestre !== undefined) {
      params.append("bimestre", String(filtros.bimestre));
    }
    if (filtros.ano !== undefined) {
      params.append("ano", String(filtros.ano));
    }
    if (filtros.componenteCurricular !== undefined) {
      params.append(
        "componenteCurricular",
        String(filtros.componenteCurricular),
      );
    }
    if (filtros.proficiencia !== undefined) {
      params.append("proficiencia", String(filtros.proficiencia));
    }
    if (filtros.genero) {
      params.append("genero", filtros.genero);
    }
    if (filtros.raca) {
      params.append("raca", filtros.raca);
    }
    if (filtros.programasAtendimentos) {
      params.append("programasAtendimentos", filtros.programasAtendimentos);
    }
    params.append("lpSegundaLingua", String(Boolean(filtros.lpSegundaLingua)));

    await NovaSondagemServico.get(
      `/sondagem/relatorio/consolidado/exportar?${params.toString()}`,
      {
        headers: { "X-Token-Principal": token },
      },
    );

    return true;
  } catch (error: any) {
    console.error("Erro ao exportar relatório consolidado:", error);
    return false;
  }
};

export default RelatorioConsolidadoExportService;
