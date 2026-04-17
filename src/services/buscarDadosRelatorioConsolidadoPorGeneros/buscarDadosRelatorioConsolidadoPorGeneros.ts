import type {
  DadosRelatorioConsolidadoPorGeneros,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";
import { notificarErroRelatorio } from "../helpers/notificarErroRelatorio";

interface BuscarDadosRelatorioConsolidadoPorGenerosParams {
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
}

const BuscarDadosRelatorioConsolidadoPorGenerosService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoPorGenerosParams): Promise<DadosRelatorioConsolidadoPorGeneros | null> => {
  try {
    const programas = filtros.programa ?? [];
    const possuiFiltroPrograma = programas.length > 0;
    const generoId =
      filtros.genero !== undefined &&
      filtros.genero !== null &&
      filtros.genero !== ""
        ? Number(filtros.genero)
        : undefined;
    const racaId =
      filtros.raca !== undefined && filtros.raca !== null && filtros.raca !== ""
        ? Number(filtros.raca)
        : undefined;

    const resposta = await NovaSondagemServico.get(
      "/Relatorio/consoliado/genero",
      {
        headers: { "X-Token-Principal": token },
        paramsSerializer: {
          indexes: null,
        },
        params: {
          AnoLetivo: filtros.anoLetivo,
          Dre: filtros.dre,
          Ue: filtros.ue,
          Modalidade: filtros.modalidade,
          ProficienciaId: filtros.proficiencia,
          ComponenteCurricularId: filtros.componenteCurricular,
          AnoTurma: filtros.ano,
          BimestreId: filtros.bimestre ?? undefined,
          GeneroId: Number.isNaN(generoId) ? undefined : generoId,
          RacaId: Number.isNaN(racaId) ? undefined : racaId,
          Pap: possuiFiltroPrograma ? programas.includes("pap") : undefined,
          Aee: possuiFiltroPrograma ? programas.includes("aee") : undefined,
          Deficiente: possuiFiltroPrograma
            ? programas.includes("deficiente")
            : undefined,
          PossuiLinguaPortuguesaSegundaLingua: filtros.lpSegundaLingua,
        },
      },
    );

    if (resposta?.data) {
      return resposta.data as DadosRelatorioConsolidadoPorGeneros;
    }

    return null;
  } catch (error: unknown) {
    notificarErroRelatorio({
      error,
      mensagemConsole:
        "Erro ao carregar dados do relatório consolidado por gênero:",
      tituloNotificacao:
        "Erro ao carregar dados do relatório consolidado por gênero",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado por gênero. Tente novamente.",
    });

    return null;
  }
};

export default BuscarDadosRelatorioConsolidadoPorGenerosService;
