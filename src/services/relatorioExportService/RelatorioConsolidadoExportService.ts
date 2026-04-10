import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";

interface RelatorioConsolidadoExportParams {
  extensaoRelatorio: 1 | 4;
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const adicionarParametroSeDefinido = (
  params: URLSearchParams,
  chave: string,
  valor: string | number | null | undefined,
) => {
  if (valor !== undefined && valor !== null) {
    params.append(chave, String(valor));
  }
};

const adicionarArrayParametros = (
  params: URLSearchParams,
  chave: string,
  valores?: Array<string | number>,
) => {
  if (!Array.isArray(valores) || !valores.length) return;

  valores.forEach((valor) => {
    params.append(chave, String(valor));
  });
};

const montarParametrosExportacaoConsolidado = (
  extensaoRelatorio: 1 | 4,
  filtros: ValoresFiltroRelatorioConsolidado,
) => {
  const params = new URLSearchParams();
  params.append("extensaoRelatorio", String(extensaoRelatorio));

  adicionarParametroSeDefinido(params, "anoLetivo", filtros.anoLetivo);
  adicionarParametroSeDefinido(params, "modalidade", filtros.modalidade);
  adicionarParametroSeDefinido(params, "dre", filtros.dre);
  adicionarParametroSeDefinido(params, "ue", filtros.ue);
  adicionarParametroSeDefinido(params, "bimestre", filtros.bimestre);
  adicionarParametroSeDefinido(
    params,
    "componenteCurricular",
    filtros.componenteCurricular,
  );
  adicionarParametroSeDefinido(params, "proficiencia", filtros.proficiencia);
  adicionarParametroSeDefinido(params, "genero", filtros.genero);
  adicionarParametroSeDefinido(params, "raca", filtros.raca);

  adicionarArrayParametros(params, "ano", filtros.ano);
  adicionarArrayParametros(params, "programa", filtros.programa);

  params.append("lpSegundaLingua", String(Boolean(filtros.lpSegundaLingua)));

  return params;
};

const RelatorioConsolidadoExportService = async ({
  extensaoRelatorio,
  filtros,
  token,
}: RelatorioConsolidadoExportParams): Promise<boolean> => {
  try {
    const params = montarParametrosExportacaoConsolidado(
      extensaoRelatorio,
      filtros,
    );

    await NovaSondagemServico.get(
      `/sondagem/relatorio/consolidado/exportar?${params.toString()}`,
      {
        headers: { "X-Token-Principal": token },
      },
    );

    return true;
  } catch (error: unknown) {
    console.error("Erro ao exportar relatório consolidado:", error);
    return false;
  }
};

export default RelatorioConsolidadoExportService;
