import { notification } from "antd";
import type { DadosTabelaDinamica } from "../../core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";

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
  } catch (error: any) {
    console.error("Erro ao carregar dados do relatório:", error);
    const errorMessage =
      error.response?.data?.title ??
      error.response?.data?.message ??
      "Erro ao carregar dados do relatório. Tente novamente.";

    const errorDetails = error.response?.data?.errors
      ? Object.entries(error.response.data.errors)
          .map(
            ([key, value]: [string, any]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
          )
          .join("\n")
      : null;

    notification.error({
      message: "Erro ao carregar dados do relatório",
      description: errorDetails ?? errorMessage,
      duration: 5,
      placement: "topRight",
    });
    return null;
  }
};

export default DadosRelatorioService;
