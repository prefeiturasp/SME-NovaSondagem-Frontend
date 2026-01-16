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
  periodoBimestreAtivo: boolean;
  opcaoResposta: OpcaoResposta[];
  resposta: Resposta;
}

export interface Estudante {
  linguaPortuguesaSegundaLingua: boolean;
  numeroAlunoChamada: number;
  nome: string;
  pap: boolean;
  aee: boolean;
  possuiDeficiencia: boolean;
  coluna: Coluna[];
  codigo: number;
}

export interface DadosTabelaDinamica {
  sondagemId: number;
  tituloTabelaRespostas: string;
  estudantes: Estudante[];
  questaoId: number;
}
