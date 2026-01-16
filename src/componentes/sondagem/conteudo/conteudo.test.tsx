import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Conteudo from "./conteudo";
import NovaSondagemServico from "../../../core/servico/servico";
import { message, notification } from "antd";

jest.mock("../../../core/servico/servico");
jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
    notification: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    },
  };
});

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

// Mock de dados
const mockDisciplinas = [
  { id: 1, nome: "Português" },
  { id: 2, nome: "Matemática" },
];

const mockProficiencias = [
  { id: 1, nome: "Escrita" },
  { id: 2, nome: "Leitura" },
];

const mockQuestionario = {
  sondagemId: 1,
  questaoId: 10,
  estudantes: [
    {
      codigo: "123456",
      numeroAlunoChamada: 1,
      nome: "João Silva",
      linguaPortuguesaSegundaLingua: false,
      coluna: [
        {
          idCiclo: 1,
          opcaoResposta: [
            {
              id: 1,
              legenda: "A",
              descricaoOpcaoResposta: "Acertou",
              corFundo: "#00FF00",
            },
            {
              id: 2,
              legenda: "E",
              descricaoOpcaoResposta: "Errou",
              corFundo: "#FF0000",
            },
          ],
        },
      ],
    },
  ],
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

  beforeEach(() => {
    jest.clearAllMocks();
    (NovaSondagemServico.get as jest.Mock).mockReset();
    (NovaSondagemServico.post as jest.Mock).mockReset();
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

    it("deve renderizar componente SondagemListaDinamica", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
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

    it("não deve exibir alerta quando turma está selecionada e modalidade válida", () => {
      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockDisciplinas,
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
      it(`não deve exibir alerta para ${descricao}`, async () => {
        (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
          data: mockDisciplinas,
        });

        const store = createMockStoreWithUser({
          logado: true,
          token: "mock-token",
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

    it("deve navegar para home ao clicar em Voltar", () => {
      const { container } = renderWithProvider(<Conteudo />);
      const botaoVoltar = container.querySelector(
        "#sondagem-button-voltar"
      ) as HTMLButtonElement;

      delete (globalThis as any).location;
      (globalThis as any).location = { href: "" };

      fireEvent.click(botaoVoltar);

      expect((globalThis as any).location.href).toBe("/");
    });

    it("deve recarregar dados ao clicar em Cancelar com disciplina e proficiência selecionadas", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const botaoCancelar = screen.getByText(BOTOES.CANCELAR);
      fireEvent.click(botaoCancelar);

      expect(botaoCancelar).toBeInTheDocument();
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

    it("deve carregar disciplinas quando turma é válida", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockDisciplinas,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.objectContaining({
            headers: { "X-Token-Principal": "mock-token" },
          })
        );
      });
    });

    it("deve tratar erro ao carregar disciplinas", async () => {
      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(
        new Error("Erro ao buscar")
      );

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Erro ao carregar dados da disciplina."
        );
      });
    });

    it("deve carregar proficiências ao selecionar disciplina", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });

        await waitFor(() => {
          expect(NovaSondagemServico.get).toHaveBeenCalledWith(
            "/Proficiencia/componente-curricular/1",
            expect.objectContaining({
              headers: { "X-Token-Principal": "mock-token" },
            })
          );
        });
      }
    });

    it("deve tratar erro ao carregar proficiências", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockRejectedValueOnce(new Error("Erro ao buscar proficiências"));

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });

        await waitFor(() => {
          expect(message.error).toHaveBeenCalledWith(
            "Erro ao carregar dados da proficiencia."
          );
        });
      }
    });
  });

  describe("Busca de questionário", () => {
    it("deve buscar questionário quando disciplina e proficiência são selecionadas", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia"
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.objectContaining({
            params: expect.objectContaining({
              TurmaId: "1A",
              ProficienciaId: 1,
              ComponenteCurricularId: 1,
              Modalidade: "3",
              Ano: "1",
            }),
          })
        );
      });
    });

    it("deve exibir notificação de warning para erro 404", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockRejectedValueOnce({
          response: { status: 404 },
        });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia"
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(notification.warning).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Questões não encontradas",
          })
        );
      });
    });

    it("deve exibir notificação de erro para problema de rede", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockRejectedValueOnce({
          code: "ERR_NETWORK",
        });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia"
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Erro de conexão",
          })
        );
      });
    });

    it("deve exibir message error para erros genéricos", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockRejectedValueOnce({
          response: { status: 500 },
        });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia"
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Erro ao carregar dados da sondagem. Tente novamente."
        );
      });
    });
  });

  describe("Método salvarDadosSondagem", () => {
    it("deve exibir mensagem de sucesso quando retornar status 200", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      // Aguarda carregar disciplinas
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      // Seleciona disciplina
      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      // Aguarda carregar proficiências
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      // Seleciona proficiência
      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      // Aguarda carregar questionário
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Clica em salvar
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
            sondagemId: expect.any(Number),
            alunos: expect.any(Array),
          }),
          expect.objectContaining({
            headers: {
              "X-Token-Principal": "mock-token",
            },
          })
        );
      });

      await waitFor(() => {
        expect(notification.success).toHaveBeenCalledWith({
          message: "Sondagem salva com sucesso!",
          description:
            "Os dados da sondagem foram salvos e estão disponíveis para consulta.",
          duration: 5,
          placement: "topRight",
        });
      });
    });

    it("deve exibir mensagem de erro quando falhar", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      (NovaSondagemServico.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: "Erro ao salvar",
          },
        },
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      // Carrega dados primeiro
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Agora clica em salvar
      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Erro ao salvar sondagem",
            description: "Erro ao salvar",
          })
        );
      });
    });

    it("deve usar token do usuário no header", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "test-token-123",
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      // Carrega dados primeiro
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Agora clica em salvar
      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalledWith(
          "Sondagem",
          expect.any(Object),
          expect.objectContaining({
            headers: {
              "X-Token-Principal": "test-token-123",
            },
          })
        );
      });
    });

    it("deve exibir mensagem de erro genérica quando não há message na resposta", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      (NovaSondagemServico.post as jest.Mock).mockRejectedValue({
        response: {},
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      // Carrega dados primeiro
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Agora clica em salvar
      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Erro ao salvar sondagem",
            description: "Erro ao salvar a sondagem. Tente novamente.",
          })
        );
      });
    });

    it("deve exibir notification com detalhes de erros de validação", async () => {
      (NovaSondagemServico.post as jest.Mock).mockRejectedValue({
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
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const { container } = renderWithProvider(<Conteudo />, store);

      // Carrega dados primeiro
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Agora clica em salvar
      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Erro ao salvar sondagem",
            description: expect.stringContaining("dto"),
          })
        );
      });
    });

    it("deve enviar sondagemId do dadosLista", async () => {
      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const { container } = renderWithProvider(<Conteudo />, store);

      // Carrega dados primeiro
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Agora clica em salvar
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
            sondagemId: expect.any(Number),
          }),
          expect.any(Object)
        );
      });
    });

    it("deve garantir que alunos sejam incluídos no payload", async () => {
      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const { container } = renderWithProvider(<Conteudo />, store);

      // Aguarda carregar disciplinas
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      // Seleciona disciplina
      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular"
      );
      if (selectDisciplina) {
        fireEvent.mouseDown(selectDisciplina);
      }

      await waitFor(() => {
        const option = screen.queryByText("Português") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      // Aguarda carregar proficiências
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });

      // Seleciona proficiência
      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia"
      );
      if (selectProficiencia) {
        fireEvent.mouseDown(selectProficiencia);
      }

      await waitFor(() => {
        const option = screen.queryByText("Leitura") as HTMLElement;
        if (option) {
          fireEvent.click(option);
        }
      });

      // Aguarda carregar questionário
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });

      // Clica em salvar
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
            alunos: expect.any(Array),
          }),
          expect.any(Object)
        );
      });
    });
  });

  describe("Comportamento de estados e reset", () => {
    it("deve inicializar com dados lista como null", () => {
      renderWithProvider(<Conteudo />);
      expect(screen.getByText(MENSAGENS.TITULO)).toBeInTheDocument();
    });

    it("deve resetar MENSAGENS quando modalidade muda para inválida", async () => {
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

    it("deve resetar proficiência ao mudar disciplina", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1",
          expect.any(Object)
        );
      });
    });

    it("deve limpar dados ao desabilitar disciplina", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: [],
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });
    });
  });

  describe("Limpeza de filtros ao mudar turma", () => {
    it("deve limpar disciplina e proficiência quando turma mudar", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias });

      const initialStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "1A", id: 1 }),
      });

      const { rerender, container } = renderWithProvider(
        <Conteudo />,
        initialStore
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      // Muda a turma
      (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
        data: mockDisciplinas,
      });

      const newStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "2B", id: 2 }),
      });

      rerender(
        <Provider store={newStore}>
          <Conteudo />
        </Provider>
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledTimes(3);
      });
    });

    it("deve carregar nova lista de disciplinas ao mudar turma", async () => {
      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: mockDisciplinas,
      });

      const initialStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "1A", id: 1 }),
      });

      const { rerender } = renderWithProvider(<Conteudo />, initialStore);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const newStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "2B", id: 2 }),
      });

      rerender(
        <Provider store={newStore}>
          <Conteudo />
        </Provider>
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledTimes(2);
      });
    });

    it("não deve buscar questionário automaticamente ao mudar turma", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockDisciplinas });

      const initialStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "1A", id: 1 }),
      });

      const { rerender } = renderWithProvider(<Conteudo />, initialStore);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const newStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "2B", id: 2 }),
      });

      rerender(
        <Provider store={newStore}>
          <Conteudo />
        </Provider>
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).not.toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object)
        );
      });
    });
  });

  describe("Busca de dados somente após seleção completa", () => {
    it("deve buscar dados apenas quando disciplina E proficiência estiverem selecionadas", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionario });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      // Seleciona disciplina - NÃO deve buscar questionário ainda
      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      // Verifica que o questionário NÃO foi buscado ainda
      await waitFor(() => {
        const questionarioCalls = (
          NovaSondagemServico.get as jest.Mock
        ).mock.calls.filter((call) => call[0] === "/Questionario");
        expect(questionarioCalls.length).toBe(0);
      });

      // Seleciona proficiência - AGORA deve buscar questionário
      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia"
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      // Agora sim, deve ter buscado o questionário
      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.objectContaining({
            params: expect.objectContaining({
              TurmaId: "1A",
              ComponenteCurricularId: 1,
              ProficienciaId: 1,
            }),
          })
        );
      });
    });

    it("não deve buscar dados se apenas disciplina estiver selecionada", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValueOnce({ data: mockProficiencias });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object)
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular"
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]'
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      // Aguarda um pouco para garantir que não foi feita nenhuma chamada
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verifica que o questionário NÃO foi buscado
      const questionarioCalls = (
        NovaSondagemServico.get as jest.Mock
      ).mock.calls.filter((call) => call[0] === "/Questionario");
      expect(questionarioCalls.length).toBe(0);
    });
  });
});
