import type { DadosTabelaDinamicaRelatorio } from "~/core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";

interface ValidarDadosRelatorioParams {
  turmaId: number;
  proficienciaId: number;
  componenteCurricularId: number;
  modalidade: number;
  ano: number;
  anoLetivo: number;
  semestre: number;
  ueCodigo: string;
  bimestreId?: number | null;
  token: string;
}

const DadosRelatorioService = async ({
  turmaId,
  proficienciaId,
  componenteCurricularId,
  modalidade,
  ano,
  anoLetivo,
  semestre,
  ueCodigo,
  bimestreId,
  token,
}: ValidarDadosRelatorioParams): Promise<DadosTabelaDinamicaRelatorio | null> => {
  try {
    const resposta = await NovaSondagemServico.get(
      `/Relatorio/sondagem-por-turma`,
      {
        headers: { "X-Token-Principal": token },
        params: {
          turmaId,
          proficienciaId,
          componenteCurricularId,
          modalidade,
          ano,
          anoLetivo,
          semestre,
          ueCodigo,
          bimestreId,
        },
      },
    );

    if (resposta?.data) {
      return resposta.data as DadosTabelaDinamicaRelatorio;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar dados do relatório:", error);
    return null;
  }
};

export default DadosRelatorioService;
