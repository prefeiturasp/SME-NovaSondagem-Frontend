import NovaSondagemServico from "../../core/servico/servico";
import type { ValoresFiltroRelatorioConsolidado } from "../../core/dto/typesRelatorio";
import { notificarErroRelatorio } from "./notificarErroRelatorio";

interface BuscarDadosRelatorioConsolidadoAgrupadoParams {
  endpoint: string;
  filtros: ValoresFiltroRelatorioConsolidado;
  token: string;
  mensagemConsole: string;
  tituloNotificacao: string;
  mensagemPadrao: string;
}

const paraNumeroOpcional = (
  valor: number | string | null | undefined,
): number | undefined => {
  if (valor === undefined || valor === null || valor === "") return undefined;

  const convertido = Number(valor);
  return Number.isNaN(convertido) ? undefined : convertido;
};

const montarParametrosRelatorioConsolidado = (
  filtros: ValoresFiltroRelatorioConsolidado,
) => {
  const programas = filtros.programa ?? [];
  const possuiFiltroPrograma = programas.length > 0;

  return {
    AnoLetivo: filtros.anoLetivo,
    Dre: filtros.dre,
    Ue: filtros.ue,
    Modalidade: filtros.modalidade,
    ProficienciaId: filtros.proficiencia,
    ComponenteCurricularId: filtros.componenteCurricular,
    AnoTurma: filtros.ano,
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

const buscarDadosRelatorioConsolidadoAgrupado = async <T>({
  endpoint,
  filtros,
  token,
  mensagemConsole,
  tituloNotificacao,
  mensagemPadrao,
}: BuscarDadosRelatorioConsolidadoAgrupadoParams): Promise<T | null> => {
  try {
    const resposta = await NovaSondagemServico.get(endpoint, {
      headers: { "X-Token-Principal": token },
      paramsSerializer: {
        indexes: null,
      },
      params: montarParametrosRelatorioConsolidado(filtros),
    });

    if (resposta?.data) {
      return resposta.data as T;
    }

    return null;
  } catch (error: unknown) {
    notificarErroRelatorio({
      error,
      mensagemConsole,
      tituloNotificacao,
      mensagemPadrao,
    });

    return null;
  }
};

export default buscarDadosRelatorioConsolidadoAgrupado;
