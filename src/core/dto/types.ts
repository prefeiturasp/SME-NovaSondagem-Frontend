export const Ano = {
  PrimeiroAno: 1,
  SegundoAno: 2,
  TerceiroAno: 3,
};

export const Proficiencia = {
  Leitura: 1,
  Escrita: 2,
  CapacidadeLeitora: 6,
  LeituraEJA: 3,
  MapeamentoDosSaberes: 5,
};

export const Modalidade = {
  NaoCadastrado: 0,
  EducacaoInfantil: 1,
  EJA: 3,
  CIEJA: 4,
  EnsinoFundamental: 5,
  EnsinoMedio: 6,
  CMCT: 7,
  MOVA: 8,
  ETEC: 9,
};

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
  questaoSubrespostaId: number | null;
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
