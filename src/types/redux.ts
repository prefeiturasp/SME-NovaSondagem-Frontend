/**
 * Tipos do Redux que correspondem ao projeto pai (host).
 * O remote NÃO cria seu próprio store - apenas define os tipos
 * para que o TypeScript funcione corretamente com useSelector.
 * O Provider e store vêm do projeto pai.
 */

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

/**
 * RootState que corresponde à estrutura do Redux do host
 */
export interface RootState {
  usuario: UsuarioState;
  filtro: FiltroState;
  alertas: AlertasState;
  navegacao: NavegacaoState;
  [key: string]: any;
}
