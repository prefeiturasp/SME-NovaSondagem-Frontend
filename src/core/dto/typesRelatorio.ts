export interface OpcaoRespostaRelatorio {
  id: number;
  ordem: number;
  descricaoOpcaoResposta: string;
  corFundo: string;
  corTexto: string;
  legenda: string;
}

export interface RespostaRelatorio {
  id: number;
  opcaoRespostaId: number | null;
}

export interface ColunaRelatorio {
  idCiclo: number;
  descricaoColuna: string;
  PeriodoBimestreAtivo: boolean;
  questaoSubrespostaId: number | null;
  opcaoResposta: OpcaoRespostaRelatorio[];
  resposta: RespostaRelatorio | RespostaRelatorio[];
}

export interface EstudanteRelatorio {
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
  coluna: ColunaRelatorio[];
}

export interface DadosTabelaDinamicaRelatorio {
  tituloTabelaRespostas: string;
  estudantes: EstudanteRelatorio[];
}
