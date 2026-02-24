export interface OpcaoResposta {
  id: number;
  ordem: number;
  descricaoOpcaoResposta: string;
  corFundo: string;
  corTexto: string;
  legenda: string;
}

export interface Resposta {
  id: number;
  opcaoRespostaId: number | null;
}

export interface Coluna {
  idCiclo: number;
  descricaoColuna: string;
  PeriodoBimestreAtivo: boolean;
  questaoSubrespostaId: number | null;
  opcaoResposta: OpcaoResposta[];
  resposta: Resposta | Resposta[];
}

export interface Estudante {
  linguaPortuguesaSegundaLingua: boolean;
  numeroAlunoChamada: number;
  codigo: number;
  nome: string;
  pap: boolean;
  aee: boolean;
  possuiDeficiencia: boolean;
  codigoEol: string;
  raca: string;
  genero: string;
  coluna: Coluna[];
}

export interface DadosTabelaDinamica {
  tituloTabelaRespostas: string;
  estudantes: Estudante[];
}

export type ValoresFiltroRelatorio = {
  anoLetivo?: number;
  dre?: number;
  ue?: number;
  modalidade?: number;
  semestre?: number;
  turma?: number;
  componenteCurricular?: number;
  proficiencia?: number;
  bimestre?: number;
  ano?: number;
};
