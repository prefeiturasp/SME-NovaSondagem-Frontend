import type { DadosTabelaDinamica } from "../../core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";
import { notificarErroRelatorio } from "../helpers/notificarErroRelatorio";

interface ValidarDadosRelatorioParams {
  turmaId: number;
  proficienciaId: number;
  componenteCurricularId: number;
  modalidade: number;
  ano: number;
  anoLetivo: number;
  semestreId?: number | null;
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
  semestreId,
  ueCodigo,
  bimestreId = null,
  token,
}: ValidarDadosRelatorioParams): Promise<DadosTabelaDinamica | null> => {
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
          semestreId,
          ueCodigo,
          bimestreId,
        },
      },
    );

    if (resposta?.data) {
      return resposta.data as DadosTabelaDinamica;
    }

    return null;
  } catch (error: unknown) {
    notificarErroRelatorio({
      error,
      mensagemConsole: "Erro ao carregar dados do relatório:",
      tituloNotificacao: "Erro ao carregar dados do relatório",
      mensagemPadrao: "Erro ao carregar dados do relatório. Tente novamente.",
    });

    return null;
  }
};

export default DadosRelatorioService;
