import type {
  DadosTabelaDinamica,
  ValoresFiltroRelatorioConsolidado,
} from "../../core/dto/typesRelatorio";
import NovaSondagemServico from "../../core/servico/servico";
import { notificarErroRelatorio } from "../helpers/notificarErroRelatorio";

interface BuscarDadosRelatorioConsolidadoParams {
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

const BuscarDadosRelatorioConsolidadoService = async ({
  filtros,
  token,
}: BuscarDadosRelatorioConsolidadoParams): Promise<DadosTabelaDinamica | null> => {
  try {
    const programas = filtros.programa ?? [];
    const possuiFiltroPrograma = programas.length > 0;
    const generoId = paraNumeroOpcional(filtros.genero);
    const racaId = paraNumeroOpcional(filtros.raca);
    const modalidadeNumero = paraNumeroOpcional(filtros.modalidade);
    const semestreId =
      modalidadeNumero === 5
        ? undefined
        : paraNumeroOpcional(filtros.semestreId);

    const resposta = await NovaSondagemServico.get(
      "/Relatorio/consolidado/ano",
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
          SemestreId: semestreId,
          BimestreId: filtros.bimestre ?? undefined,
          GeneroId: generoId,
          RacaId: racaId,
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
      return resposta.data as DadosTabelaDinamica;
    }

    return null;
  } catch (error: unknown) {
    notificarErroRelatorio({
      error,
      mensagemConsole: "Erro ao carregar dados do relatório consolidado:",
      tituloNotificacao: "Erro ao carregar dados do relatório consolidado",
      mensagemPadrao:
        "Erro ao carregar dados do relatório consolidado. Tente novamente.",
    });

    return null;
  }
};

export default BuscarDadosRelatorioConsolidadoService;
