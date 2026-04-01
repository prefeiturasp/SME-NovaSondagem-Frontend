import { notification } from "antd";
import type {
  DadosTabelaDinamica,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";

interface BuscarDadosRelatorioConsolidadoParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoParams): Promise<DadosTabelaDinamica | null> => {
  try {
    const resposta = await NovaSondagemServico.get(
      "/sondagem/relatorio/consolidado",
      {
        headers: { "X-Token-Principal": token },
        params: {
          anoLetivo: filtros.anoLetivo,
          modalidade: filtros.modalidade,
          dre: filtros.dre,
          ue: filtros.ue,
          bimestre: filtros.bimestre,
          ano: filtros.ano,
          componenteCurricular: filtros.componenteCurricular,
          proficiencia: filtros.proficiencia,
          genero: filtros.genero,
          raca: filtros.raca,
          programasAtendimentos: filtros.programasAtendimentos,
          lpSegundaLingua: filtros.lpSegundaLingua,
        },
      },
    );

    if (resposta?.data) {
      return resposta.data as DadosTabelaDinamica;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar dados do relatório consolidado:", error);

    const errorMessage =
      error.response?.data?.title ??
      error.response?.data?.message ??
      "Erro ao carregar dados do relatório consolidado. Tente novamente.";

    const errorDetails = error.response?.data?.errors
      ? Object.entries(error.response.data.errors)
          .map(
            ([key, value]: [string, any]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
          )
          .join("\n")
      : null;

    notification.error({
      message: "Erro ao carregar dados do relatório consolidado",
      description: errorDetails ?? errorMessage,
      duration: 5,
      placement: "topRight",
    });

    return null;
  }
};

export default BuscarDadosRelatorioConsolidadoService;
