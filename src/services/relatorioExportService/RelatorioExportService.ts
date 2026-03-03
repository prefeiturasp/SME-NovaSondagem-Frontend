import NovaSondagemServico from "../../core/servico/servico";

interface RelatorioExportParams {
  extensaoRelatorio: 1 | 4; // 1 = PDF, 4 = Excel
  turmaId: number;
  proficienciaId: number;
  componenteCurricularId: number;
  modalidade: number;
  anoLetivo: number;
  semestreId?: number | null;
  bimestreId?: number | null;
  ueCodigo: string;
  token: string;
}

const RelatorioExportService = async ({
  extensaoRelatorio,
  turmaId,
  proficienciaId,
  componenteCurricularId,
  modalidade,
  anoLetivo,
  semestreId,
  bimestreId,
  ueCodigo,
  token,
}: RelatorioExportParams): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    params.append("extensaoRelatorio", String(extensaoRelatorio));
    params.append("turmaId", String(turmaId));
    params.append("proficienciaId", String(proficienciaId));
    params.append("componenteCurricularId", String(componenteCurricularId));
    params.append("modalidade", String(modalidade));
    params.append("anoLetivo", String(anoLetivo));
    params.append("ueCodigo", String(ueCodigo));

    if (semestreId !== null && semestreId !== undefined) {
      params.append("semestreId", String(semestreId));
    }
    if (bimestreId !== null && bimestreId !== undefined) {
      params.append("bimestreId", String(bimestreId));
    }

    await NovaSondagemServico.get(
      `/Relatorio/sondagem-por-turma/exportar?${params.toString()}`,
      {
        headers: { "X-Token-Principal": token },
      },
    );

    return true;
  } catch (error: any) {
    console.error("Erro ao exportar relatório:", error);
    return false;
  }
};

export default RelatorioExportService;
