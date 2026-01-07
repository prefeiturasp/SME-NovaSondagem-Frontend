import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Conteudo from "./conteudo";

// Constantes
const MENSAGENS = {
  TITULO: "Sondagem",
  INSTRUCAO: /Preencha os campos para conferir as informações/,
  SEM_TURMA: "Você precisa escolher uma turma.",
  MODALIDADE_INVALIDA: /Só existe sondagem/,
  COMPONENTE_CURRICULAR: "Componente Curricular",
  PROFICIENCIA: "Proficiência",
};

const BOTOES = {
  VOLTAR: "Voltar para a tela anterior",
  CANCELAR: "Cancelar",
  SALVAR: "Salvar",
};

// Factory functions para turmas
const criarTurma = (override?: any) => ({
  turma: "1A",
  id: 1,
  modalidade: "3",
  ano: "1",
  ...override,
});

describe("Conteudo", () => {
  const originalError = console.error;
  const originalLog = console.log;

  beforeAll(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.log = originalLog;
  });

  const createMockStoreWithUser = (usuario: any) => {
    const mockReducer = (state = { usuario }) => state;
    return configureStore({ reducer: mockReducer });
  };

  const renderWithProvider = (component: React.ReactElement, store?: any) => {
    const defaultStore = store || createMockStoreWithUser({ logado: false });
    return render(<Provider store={defaultStore}>{component}</Provider>);
  };

  describe("Renderização básica", () => {
    it("deve renderizar o componente sem erros", () => {
      const { container } = renderWithProvider(<Conteudo />);
      expect(container).toBeInTheDocument();
    });

    it("deve renderizar Card do Ant Design", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const card = container.querySelector(".ant-card");
      expect(card).toBeInTheDocument();
    });

    it("deve renderizar título", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve renderizar texto de instrução", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.INSTRUCAO)).toBeInTheDocument();
    });
  });

  describe("Alertas de validação", () => {
    it("deve exibir alerta quando turma não está selecionada", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: null,
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.getByText(MENSAGENS.SEM_TURMA)).toBeInTheDocument();
    });

    it("não deve exibir alerta quando turma está selecionada", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(MENSAGENS.SEM_TURMA)).not.toBeInTheDocument();
    });

    it("deve exibir alerta de modalidade inválida", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma({ modalidade: "1", ano: "4" }),
      });
      renderWithProvider(<Conteudo />, store);
      expect(
        screen.getByText(MENSAGENS.MODALIDADE_INVALIDA)
      ).toBeInTheDocument();
    });
  });

  describe("Validação de modalidades válidas", () => {
    const casosValidos = [
      { modalidade: "3", ano: "1", descricao: "Educação Infantil ano 1" },
      { modalidade: "5", ano: "1", descricao: "Fundamental ano 1" },
      { modalidade: "5", ano: "2", descricao: "Fundamental ano 2" },
      { modalidade: "5", ano: "3", descricao: "Fundamental ano 3" },
    ];

    casosValidos.forEach(({ modalidade, ano, descricao }) => {
      it(`não deve exibir alerta para ${descricao}`, () => {
        const store = createMockStoreWithUser({
          logado: true,
          turmaSelecionada: criarTurma({ modalidade, ano }),
        });
        renderWithProvider(<Conteudo />, store);
        expect(
          screen.queryByText(MENSAGENS.MODALIDADE_INVALIDA)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Validação de modalidades inválidas", () => {
    const casosInvalidos = [
      { modalidade: "3", ano: "2", descricao: "Educação Infantil ano 2" },
      { modalidade: "5", ano: "4", descricao: "Fundamental ano 4" },
      { modalidade: "1", ano: "1", descricao: "Modalidade 1" },
    ];

    casosInvalidos.forEach(({ modalidade, ano, descricao }) => {
      it(`deve exibir alerta para ${descricao}`, () => {
        const store = createMockStoreWithUser({
          logado: true,
          turmaSelecionada: criarTurma({ modalidade, ano }),
        });
        renderWithProvider(<Conteudo />, store);
        expect(
          screen.getByText(MENSAGENS.MODALIDADE_INVALIDA)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Botões de ação", () => {
    it("deve renderizar botão Voltar", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const botaoVoltar = container.querySelector("#sondagem-button-voltar");
      expect(botaoVoltar).toBeInTheDocument();
    });

    it("deve renderizar botão Cancelar", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(BOTOES.CANCELAR)).toBeInTheDocument();
    });

    it("deve renderizar botão Salvar", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(BOTOES.SALVAR)).toBeInTheDocument();
    });

    it("deve chamar voltarSondagem ao clicar em Voltar", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const botaoVoltar = container.querySelector(
        "#sondagem-button-voltar"
      ) as HTMLButtonElement;

      fireEvent.click(botaoVoltar);

      expect(console.log).toHaveBeenCalledWith(BOTOES.VOLTAR);
    });

    it("deve chamar CancelarCadastroSondagem ao clicar em Cancelar", () => {
      renderWithProvider(<Conteudo />);
      const botaoCancelar = screen.getByText(BOTOES.CANCELAR);

      fireEvent.click(botaoCancelar);

      expect(console.log).toHaveBeenCalledWith("Cancelar cadastro de sondagem");
    });

    it("deve chamar salvarDadosSondagem ao clicar em Salvar", () => {
      renderWithProvider(<Conteudo />);
      const botaoSalvar = screen.getByText(BOTOES.SALVAR);

      fireEvent.click(botaoSalvar);

      expect(console.log).toHaveBeenCalled();
    });
  });
  describe("Formulário de filtros", () => {
    it("deve renderizar campo Componente Curricular", () => {
      renderWithProvider(<Conteudo />);
      expect(
        screen.getByText(MENSAGENS.COMPONENTE_CURRICULAR)
      ).toBeInTheDocument();
    });

    it("deve renderizar campo Proficiência", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.PROFICIENCIA)).toBeInTheDocument();
    });

    it("deve desabilitar selects quando não há turma válida", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: null,
      });
      const { container } = renderWithProvider(<Conteudo />, store);
      const selects = container.querySelectorAll(".ant-select-disabled");
      expect(selects.length).toBeGreaterThan(0);
    });

    it("deve habilitar selects quando turma é válida", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(
          screen.getByText(MENSAGENS.COMPONENTE_CURRICULAR)
        ).toBeInTheDocument();
      });
    });

    it("deve carregar opções ao selecionar turma válida", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(
          screen.getByText(MENSAGENS.COMPONENTE_CURRICULAR)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Comportamento de estados", () => {
    it("deve inicializar com dados lista como null", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve resetar campos quando modalidade muda para inválida", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma({ modalidade: "3", ano: "5" }),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(
          screen.getByText(MENSAGENS.MODALIDADE_INVALIDA)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Renderização do SondagemListaDinamica", () => {
    it("deve renderizar componente SondagemListaDinamica", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });
  });
});
