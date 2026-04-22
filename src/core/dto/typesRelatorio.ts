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

export interface EstudanteRemanejadoInfo {
  data?: string;
}

export interface Estudante {
  linguaPortuguesaSegundaLingua: boolean;
  numeroAlunoChamada: number | string;
  codigo: number;
  nome: string;
  pap: boolean;
  aee: boolean;
  possuiDeficiencia: boolean;
  codigoEol: string;
  raca: string;
  genero: string;
  coluna: Coluna[];
  estudanteRemanejado?: EstudanteRemanejadoInfo | null;
}

export interface DadosTabelaDinamica {
  tituloTabelaRespostas: string;
  estudantes: Estudante[];
  legenda: LegendaQuestionario[];
  titulo?: string;
  questoes?: QuestaoConsolidada[];
}

export interface RespostaConsolidada {
  resposta: string;
  anosTurma: number[];
  total: number;
  percentual: number;
  ordem: number;
  corFundo: string;
  corTexto: string;
}

export interface TotalPorAnoTurmaConsolidado {
  anoTurma: number;
  total: number;
  percentual: number;
}

export interface QuestaoConsolidada {
  questaoId: number;
  questaoNome: string;
  respostas: RespostaConsolidada[];
  totaisPorAnoTurma: TotalPorAnoTurmaConsolidado[];
  totalEstudantes: number;
  percentualTotal: number;
}

export type ValoresFiltroRelatorio = {
  anoLetivo?: number;
  dre?: number;
  ue?: number;
  modalidade?: number;
  semestreId?: number;
  turma?: number;
  componenteCurricular?: number;
  proficiencia?: number;
  bimestre?: number;
  ano?: number;
};

export type ValoresFiltroRelatorioConsolidado = {
  anoLetivo?: number;
  modalidade?: number | string;
  dre?: number | string;
  ue?: number | string;
  bimestre?: number | null;
  ano?: number[];
  componenteCurricular?: number;
  proficiencia?: number;
  genero?: number | string;
  raca?: number | string;
  programa?: string[];
  lpSegundaLingua?: boolean;
  agrupamentoDados?: string;
};

export interface RacaConsolidada {
  raca: string;
  quantidade: number;
  percentual: number;
}

export interface RespostaConsolidadaPorRaca {
  resposta: string;
  racas: RacaConsolidada[];
  total: number;
  percentual: number;
  ordem: number;
  corFundo: string;
  corTexto: string;
}

export interface QuestaoConsolidadaPorRaca {
  questaoId: number;
  questaoNome: string;
  respostas: RespostaConsolidadaPorRaca[];
  totaisPorRaca: RacaConsolidada[];
  totalEstudantes: number;
  percentualTotal: number;
}

export interface DadosRelatorioConsolidadoPorRacas {
  titulo: string;
  questoes: QuestaoConsolidadaPorRaca[];
}

export interface GeneroConsolidado {
  genero: string;
  quantidade: number;
  percentual: number;
}

export interface RespostaConsolidadaPorGenero {
  resposta: string;
  generos: GeneroConsolidado[];
  total: number;
  percentual: number;
  ordem: number;
  corFundo: string;
  corTexto: string;
}

export interface QuestaoConsolidadaPorGenero {
  questaoId: number;
  questaoNome: string;
  respostas: RespostaConsolidadaPorGenero[];
  totaisPorGenero: GeneroConsolidado[];
  totalEstudantes: number;
  percentualTotal: number;
}

export interface DadosRelatorioConsolidadoPorGeneros {
  titulo: string;
  questoes: QuestaoConsolidadaPorGenero[];
}

export interface RacaConsolidadaPorGenero {
  raca: string;
  quantidade: number;
  percentual: number;
}

export interface GeneroConsolidadoComRacas {
  genero: string;
  totalGenero?: number;
  percentualGenero?: number;
  racas: RacaConsolidadaPorGenero[];
}

export interface TotalGeneroConsolidado {
  genero: string;
  sigla?: string;
  quantidade: number;
  percentual: number;
}

export interface RacaGeneroConsolidado {
  genero: string;
  raca: string;
  quantidade: number;
  percentual: number;
}

export interface RespostaConsolidadaPorRacaGenero {
  resposta: string;
  generosComRacas?: GeneroConsolidadoComRacas[];
  generos?: GeneroConsolidadoComRacas[];
  racasGeneros?: RacaGeneroConsolidado[];
  total: number;
  percentual: number;
  ordem: number;
  corFundo: string;
  corTexto: string;
}

export interface QuestaoConsolidadaPorRacaGenero {
  questaoId: number;
  questaoNome: string;
  respostas: RespostaConsolidadaPorRacaGenero[];
  totaisPorGenero?: TotalGeneroConsolidado[];
  totaisPorRaca?: RacaConsolidadaPorGenero[];
  totaisPorGeneroComRacas?: GeneroConsolidadoComRacas[];
  totaisPorRacaGenero?: RacaGeneroConsolidado[];
  totalEstudantes: number;
  percentualTotal: number;
}

export interface DadosRelatorioConsolidadoPorRacaGenero {
  titulo: string;
  questoes: QuestaoConsolidadaPorRacaGenero[];
}

export interface LegendaQuestionario {
  id: number;
  ordem: number;
  descricaoOpcaoResposta: string;
  corFundo: string;
  corTexto: string;
  legenda: string;
}
