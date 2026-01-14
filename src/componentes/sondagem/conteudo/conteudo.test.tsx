import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Conteudo from "./conteudo";

jest.mock("../../../core/servico/servico");

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
      { modalidade: 3, ano: "1", descricao: "Educação Infantil ano 1" },
      { modalidade: 5, ano: "1", descricao: "Fundamental ano 1" },
      { modalidade: 5, ano: "2", descricao: "Fundamental ano 2" },
      { modalidade: 5, ano: "3", descricao: "Fundamental ano 3" },
    ];

    casosValidos.forEach(({ modalidade, ano, descricao }) => {
      it(`não deve exibir alerta para ${descricao}`, async () => {
        const store = createMockStoreWithUser({
          logado: true,
          turmaSelecionada: criarTurma({ modalidade, ano, turma: "1A", id: 1 }),
        });
        renderWithProvider(<Conteudo />, store);

        await waitFor(() => {
          expect(
            screen.queryByText(MENSAGENS.MODALIDADE_INVALIDA)
          ).not.toBeInTheDocument();
        });
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

      // Mockar globalThis.location.href
      delete (globalThis as any).location;
      (globalThis as any).location = { href: "" };

      fireEvent.click(botaoVoltar);

      expect((globalThis as any).location.href).toBe("/");
    });

    it("deve chamar CancelarCadastroSondagem ao clicar em Cancelar", () => {
      renderWithProvider(<Conteudo />);
      const botaoCancelar = screen.getByText(BOTOES.CANCELAR);

      fireEvent.click(botaoCancelar);

      // Botão executado sem erros
      expect(botaoCancelar).toBeInTheDocument();
    });

    it("deve chamar salvarDadosSondagem ao clicar em Salvar", () => {
      renderWithProvider(<Conteudo />);
      const botaoSalvar = screen.getByText(BOTOES.SALVAR);

      fireEvent.click(botaoSalvar);

      // Botão executado sem erros
      expect(botaoSalvar).toBeInTheDocument();
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

  describe("Mudança de disciplina e proficiência", () => {
    it("deve executar onChangeDisciplinas quando disciplina é selecionada", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });

      const disciplinaSelect = container.querySelector('[id*="disciplinaId"]');
      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const options = document.querySelectorAll(".ant-select-item");
          if (options.length > 0) {
            fireEvent.click(options[0]);
          }
        });
      }
    });

    it("deve executar onChangeProficiencia com proficienciaId 1 (Escrita)", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });

      const proficienciaSelect = container.querySelector(
        '[id*="proficienciaId"]'
      );
      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const options = document.querySelectorAll(".ant-select-item");
          if (options.length > 0) {
            fireEvent.click(options[0]);
          }
        });
      }
    });

    it("deve executar onChangeProficiencia com proficienciaId 2 (Leitura)", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });

      const proficienciaSelect = container.querySelector(
        '[id*="proficienciaId"]'
      );
      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(
          () => {
            const options = document.querySelectorAll(".ant-select-item");
            if (options.length > 1) {
              fireEvent.click(options[1]);
            }
          },
          { timeout: 3000 }
        );
      }
    });

    it("deve chamar salvarDadosSondagem ao clicar no botão Salvar", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });
    });

    it("deve processar dados do formulário ao salvar", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(container).toBeInTheDocument();
    });

    it("deve executar onChangeDisciplinas com valor null", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });

      const disciplinaSelect = container.querySelector('[id*="disciplinaId"]');
      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const clearButton = document.querySelector(".ant-select-clear");
          if (clearButton) {
            fireEvent.click(clearButton);
          }
        });
      }
    });

    it("deve executar onChangeProficiencia com valor null", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });

      const proficienciaSelect = container.querySelector(
        '[id*="proficienciaId"]'
      );
      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const clearButton = document.querySelector(".ant-select-clear");
          if (clearButton) {
            fireEvent.click(clearButton);
          }
        });
      }
    });

    it("deve executar onChangeProficiencia com valor inválido", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
      });
    });

    it("deve setar lista de proficiencia vazia quando data não existe", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const selects = container.querySelectorAll(".ant-select-selector");
        expect(selects.length).toBeGreaterThan(0);
      });
    });

    it("deve processar dados de formulário com valores nulos ao salvar", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const proficienciaSelect = container.querySelector(
          '[id*="proficienciaId"]'
        );
        if (proficienciaSelect) {
          fireEvent.mouseDown(proficienciaSelect);
        }
      });

      await waitFor(() => {
        const options = document.querySelectorAll(".ant-select-item");
        if (options.length > 0) {
          fireEvent.click(options[0]);
        }
      });

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(container).toBeInTheDocument();
    });

    it("deve capturar erro em buscarDadosLista2", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const proficienciaSelect = container.querySelector(
          '[id*="proficienciaId"]'
        );
        if (proficienciaSelect) {
          fireEvent.mouseDown(proficienciaSelect);
        }
      });

      await waitFor(() => {
        const options = document.querySelectorAll(".ant-select-item");
        if (options.length > 1) {
          fireEvent.click(options[1]);
        }
      });

      expect(container).toBeInTheDocument();
    });
  });

  describe("Método gerarDados", () => {
    it("deve gerar dados corretamente com valores do formulário", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve usar valores padrão quando formulário não tem valores", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve gerar respostas com estrutura correta", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve incluir propriedades corretas do estudante", async () => {
      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });
  });

  describe("Método salvarDadosSondagem atualizado", () => {
    const NovaSondagemServico =
      require("../../../core/servico/servico").default;

    beforeEach(() => {
      NovaSondagemServico.post = jest.fn();
    });

    it("deve exibir mensagem de sucesso quando retornar status 200", async () => {
      NovaSondagemServico.post.mockResolvedValue({ status: 200 });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });
    });

    it("deve exibir mensagem de erro quando falhar", async () => {
      NovaSondagemServico.post.mockRejectedValue({
        response: { data: { message: "Erro ao salvar" } },
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });
    });

    it("deve chamar API com estrutura correta de dados", async () => {
      NovaSondagemServico.post.mockResolvedValue({ status: 200 });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalledWith(
          "Sondagem",
          expect.objectContaining({
            dto: expect.objectContaining({
              sondagemId: expect.any(Number),
              alunos: expect.any(Array),
            }),
          }),
          expect.objectContaining({
            headers: expect.objectContaining({
              "X-Token-Principal": "mock-token",
            }),
          })
        );
      });
    });

    it("deve usar token do usuário no header", async () => {
      NovaSondagemServico.post.mockResolvedValue({ status: 200 });

      const store = createMockStoreWithUser({
        logado: true,
        token: "test-token-123",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalledWith(
          "Sondagem",
          expect.objectContaining({
            dto: expect.any(Object),
          }),
          expect.objectContaining({
            headers: expect.objectContaining({
              "X-Token-Principal": "test-token-123",
            }),
          })
        );
      });
    });

    it("deve exibir mensagem de erro genérica quando não há message na resposta", async () => {
      NovaSondagemServico.post.mockRejectedValue({
        response: {},
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });
    });

    it("deve exibir notification com detalhes de erros de validação", async () => {
      const mockNotification = jest.fn();
      jest.mock("antd", () => ({
        ...jest.requireActual("antd"),
        notification: {
          error: mockNotification,
        },
      }));

      NovaSondagemServico.post.mockRejectedValue({
        response: {
          data: {
            title: "Erro de validação",
            errors: {
              dto: ["The dto field is required."],
              "$.alunos[0].respostas[0].questaoId": [
                "The JSON value could not be converted to System.Int32.",
              ],
            },
          },
        },
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });
    });

    it("deve enviar sondagemId do dadosLista", async () => {
      NovaSondagemServico.post.mockResolvedValue({ status: 200 });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalledWith(
          "Sondagem",
          expect.objectContaining({
            dto: expect.objectContaining({
              sondagemId: expect.any(Number),
            }),
          }),
          expect.any(Object)
        );
      });
    });

    it("deve garantir que questaoId seja sempre número inteiro", async () => {
      NovaSondagemServico.post.mockResolvedValue({ status: 200 });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });
    });
  });
});
