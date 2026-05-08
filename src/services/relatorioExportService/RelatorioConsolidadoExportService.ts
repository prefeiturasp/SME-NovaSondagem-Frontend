import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";

interface RelatorioConsolidadoExportParams {
  extensaoRelatorio: 1 | 4;
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const paraNumeroOpcional = (
  valor: number | string | null | undefined,
): number | undefined => {
  if (valor === undefined || valor === null || valor === "") return undefined;

  const convertido = Number(valor);
  return Number.isNaN(convertido) ? undefined : convertido;
};

const montarParametrosExportacaoConsolidado = (
  extensaoRelatorio: 1 | 4,
  filtros: ValoresFiltroRelatorioConsolidado,
) => {
  const programas = filtros.programa ?? [];
  const possuiFiltroPrograma = programas.length > 0;
  const modalidadeNumero = paraNumeroOpcional(filtros.modalidade);
  const semestreId =
    modalidadeNumero === 5 ? undefined : paraNumeroOpcional(filtros.semestreId);

  return {
    ExtensaoRelatorio: extensaoRelatorio,
    AnoLetivo: filtros.anoLetivo,
    Dre: filtros.dre,
    Ue: filtros.ue,
    Modalidade: filtros.modalidade,
    ProficienciaId: filtros.proficiencia,
    ComponenteCurricularId: filtros.componenteCurricular,
    AnoTurma: filtros.ano,
    SemestreId: semestreId,
    BimestreId: filtros.bimestre ?? undefined,
    GeneroId: paraNumeroOpcional(filtros.genero),
    RacaId: paraNumeroOpcional(filtros.raca),
    Pap: possuiFiltroPrograma ? programas.includes("pap") : undefined,
    Aee: possuiFiltroPrograma ? programas.includes("aee") : undefined,
    Deficiente: possuiFiltroPrograma
      ? programas.includes("deficiente")
      : undefined,
    PossuiLinguaPortuguesaSegundaLingua: filtros.lpSegundaLingua,
  };
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
      "/Relatorio/consolidado/bimestre/exportar",
      {
        headers: { "X-Token-Principal": token },
        paramsSerializer: {
          indexes: null,
        },
        params,
      },
    );

    return true;
  } catch (error: unknown) {
    console.error("Erro ao exportar relatório consolidado:", error);
    return false;
  }
};

export default RelatorioConsolidadoExportService;
