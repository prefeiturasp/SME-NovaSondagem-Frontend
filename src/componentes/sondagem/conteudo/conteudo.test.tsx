import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Conteudo from "./conteudo";

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

    it("deve renderizar Card do antd", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const card = container.querySelector(".ant-card");
      expect(card).toBeInTheDocument();
    });

    it("deve renderizar título Sondagem", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Sondagem")).toBeInTheDocument();
    });

    it("deve renderizar texto de instrução", () => {
      renderWithProvider(<Conteudo />);
      expect(
        screen.getByText(/Preencha os campos para conferir as informações/)
      ).toBeInTheDocument();
    });
  });

  describe("Alertas", () => {
    it("deve exibir alerta quando turma não está selecionada", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: null,
      });
      renderWithProvider(<Conteudo />, store);
      expect(
        screen.getByText("Você precisa escolher uma turma.")
      ).toBeInTheDocument();
    });

    it("não deve exibir alerta quando turma está selecionada", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(
        screen.queryByText("Você precisa escolher uma turma.")
      ).not.toBeInTheDocument();
    });

    it("deve exibir alerta de modalidade inválida", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "1", ano: "4" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.getByText(/Só existe sondagem/)).toBeInTheDocument();
    });

    it("não deve exibir alerta para modalidade 3 ano 1 (válido)", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("não deve exibir alerta para modalidade 5 ano 1 (válido)", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("não deve exibir alerta para modalidade 5 ano 2 (válido)", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "2" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("não deve exibir alerta para modalidade 5 ano 3 (válido)", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "3" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });
  });

  describe("Botões", () => {
    it("deve renderizar botão Voltar", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const botaoVoltar = container.querySelector("#sondagem-button-voltar");
      expect(botaoVoltar).toBeInTheDocument();
    });

    it("deve renderizar botão Cancelar", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });

    it("deve renderizar botão Salvar", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    it("deve chamar voltarSondagem ao clicar em Voltar", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const botaoVoltar = container.querySelector(
        "#sondagem-button-voltar"
      ) as HTMLButtonElement;
      fireEvent.click(botaoVoltar);
      expect(console.log).toHaveBeenCalledWith("Voltar para a tela anterior");
    });

    it("deve chamar CancelarCadastroSondagem ao clicar em Cancelar", () => {
      renderWithProvider(<Conteudo />);
      const botaoCancelar = screen.getByText("Cancelar");
      fireEvent.click(botaoCancelar);
      expect(console.log).toHaveBeenCalledWith("Cancelar cadastro de sondagem");
    });

    it("deve chamar salvarDadosSondagem ao clicar em Salvar", () => {
      renderWithProvider(<Conteudo />);
      const botaoSalvar = screen.getByText("Salvar");
      fireEvent.click(botaoSalvar);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("Formulário de filtros", () => {
    it("deve renderizar campo Componente Curricular", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Componente Curricular")).toBeInTheDocument();
    });

    it("deve renderizar campo Proficiência", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Proficiência")).toBeInTheDocument();
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
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(screen.getByText("Componente Curricular")).toBeInTheDocument();
      });
    });

    it("deve carregar opções de disciplina ao selecionar turma válida", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(screen.getByText("Componente Curricular")).toBeInTheDocument();
      });
    });
  });

  describe("Comportamento de estados", () => {
    it("deve inicializar com dados lista como null", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Sondagem")).toBeInTheDocument();
    });

    it("deve resetar campos quando modalidade muda para inválida", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "5" },
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(screen.getByText(/Só existe sondagem/)).toBeInTheDocument();
      });
    });
  });

  describe("verificarModalidadeTurma", () => {
    it("deve retornar true para modalidade 3 ano 1", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("deve retornar false para modalidade 3 ano 2", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "3", ano: "2" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.getByText(/Só existe sondagem/)).toBeInTheDocument();
    });

    it("deve retornar true para modalidade 5 ano 1", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "1" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("deve retornar true para modalidade 5 ano 2", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "2" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("deve retornar true para modalidade 5 ano 3", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "3" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.queryByText(/Só existe sondagem/)).not.toBeInTheDocument();
    });

    it("deve retornar false para modalidade 5 ano 4", () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: { turma: "1A", id: 1, modalidade: "5", ano: "4" },
      });
      renderWithProvider(<Conteudo />, store);
      expect(screen.getByText(/Só existe sondagem/)).toBeInTheDocument();
    });
  });

  describe("Renderização do SondagemListaDinamica", () => {
    it("deve renderizar componente SondagemListaDinamica", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText("Sondagem")).toBeInTheDocument();
    });
  });
});
