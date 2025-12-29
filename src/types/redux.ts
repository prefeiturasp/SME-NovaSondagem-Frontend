export interface UsuarioState {
  rf: string;
  token: string;
  logado: boolean;
  turmaSelecionada: {
    turma: number;
    modalidade: string;
    ano: string;
    periodo?: number;
  };
  permissoes: Record<string, any>;
  [key: string]: any;
}

export interface FiltroState {
  modalidades: any[];
  [key: string]: any;
}

export interface AlertasState {
  alertas: any[];
  confirmacao: {
    visivel: boolean;
    texto: string;
    titulo: string;
    resolve: any;
    textoOk: string;
    textoCancelar: string;
  };
}

export interface NavegacaoState {
  [key: string]: any;
}

export interface RootState {
  usuario: UsuarioState;
  filtro: FiltroState;
  alertas: AlertasState;
  navegacao: NavegacaoState;
  [key: string]: any;
}
