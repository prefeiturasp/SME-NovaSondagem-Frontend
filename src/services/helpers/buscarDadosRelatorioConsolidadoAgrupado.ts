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

export const montarParametrosRelatorioConsolidado = (
  filtros: ValoresFiltroRelatorioConsolidado,
) => {
  const programas = filtros.programa ?? [];
  const papSelecionado = programas.includes("pap");
  const aeeSelecionado = programas.includes("aee");
  const deficienteSelecionado = programas.includes("deficiente");
  const modalidadeNumero = paraNumeroOpcional(filtros.modalidade);
  const semestreId =
    modalidadeNumero === 5 ? undefined : paraNumeroOpcional(filtros.semestreId);

  return {
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
    Pap: papSelecionado ? true : undefined,
    Aee: aeeSelecionado ? true : undefined,
    Deficiente: deficienteSelecionado ? true : undefined,
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
