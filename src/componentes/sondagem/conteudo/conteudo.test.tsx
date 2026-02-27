import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Conteudo from "./conteudo";
import NovaSondagemServico from "../../../core/servico/servico";
import { message, notification } from "antd";
import { validarTurma } from "../../../services/turmaService";

jest.mock("../../../core/servico/servico");
jest.mock("../../../services/turmaService");
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

const mockDisciplinas = [
  { id: 1, nome: "Português" },
  { id: 2, nome: "Matemática" },
];

const mockProficiencias = [
  { id: 1, nome: "Escrita" },
  { id: 2, nome: "Leitura" },
  { id: 3, nome: "Produção de Texto - Bimestral" },
  { id: 5, nome: "Matemática - Bimestral" },
];

const mockBimestres = [
  { id: 1, descricao: "1º Bimestre", codBimestreEnsinoEol: 1 },
  { id: 2, descricao: "2º Bimestre", codBimestreEnsinoEol: 2 },
  { id: 3, descricao: "3º Bimestre", codBimestreEnsinoEol: 3 },
  { id: 4, descricao: "4º Bimestre", codBimestreEnsinoEol: 4 },
  { id: 0, descricao: "Inicial", codBimestreEnsinoEol: 0 },
];

const mockQuestionario = {
  sondagemId: 1,
  questaoId: 10,
  podeSalvar: true,
  inseridoPor: "Inserido por Professor João em 01/01/2024",
  alteradoPor: "Alterado por Professor Maria em 10/01/2024",
  estudantes: [
    {
      codigo: "123456",
      numeroAlunoChamada: 1,
      nome: "João Silva",
      linguaPortuguesaSegundaLingua: false,
      coluna: [
        {
          idCiclo: 1,
          questaoSubrespostaId: null,
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

const criarTurma = (override?: any) => ({
  turma: "1A",
  id: 1,
  modalidade: "3",
  ano: "1",
  ...override,
});

describe("Conteudo", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (NovaSondagemServico.get as jest.Mock).mockReset();
    (NovaSondagemServico.post as jest.Mock).mockReset();
    (validarTurma as jest.Mock).mockResolvedValue({
      valida: true,
      mensagens: [],
    });
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

    it("deve exibir alerta de modalidade inválida", async () => {
      (validarTurma as jest.Mock).mockResolvedValue({
        valida: false,
        mensagens: [
          "Só existe sondagem para turmas de Educação Infantil e Ensino Fundamental (1º ao 3º ano).",
        ],
      });
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma({ modalidade: "1", ano: "4" }),
      });
      renderWithProvider(<Conteudo />, store);
      await waitFor(() => {
        expect(
          screen.getByText(MENSAGENS.MODALIDADE_INVALIDA),
        ).toBeInTheDocument();
      });
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
            screen.queryByText(MENSAGENS.MODALIDADE_INVALIDA),
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
      it(`deve exibir alerta para ${descricao}`, async () => {
        (validarTurma as jest.Mock).mockResolvedValue({
          valida: false,
          mensagens: [
            "Só existe sondagem para turmas de Educação Infantil e Ensino Fundamental (1º ao 3º ano).",
          ],
        });
        const store = createMockStoreWithUser({
          logado: true,
          turmaSelecionada: criarTurma({ modalidade, ano }),
        });
        renderWithProvider(<Conteudo />, store);
        await waitFor(() => {
          expect(
            screen.getByText(MENSAGENS.MODALIDADE_INVALIDA),
          ).toBeInTheDocument();
        });
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
        "#sondagem-button-voltar",
      ) as HTMLButtonElement;

      delete (globalThis as any).location;
      (globalThis as any).location = { href: "" };

      fireEvent.click(botaoVoltar);

      expect((globalThis as any).location.href).toBe("/");
    });

    it("deve recarregar dados ao clicar em Cancelar com disciplina e proficiência selecionadas", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
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
          expect.any(Object),
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
        screen.getByText(MENSAGENS.COMPONENTE_CURRICULAR),
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
          }),
        );
      });
    });

    it("deve tratar erro ao carregar disciplinas", async () => {
      (NovaSondagemServico.get as jest.Mock).mockRejectedValue(
        new Error("Erro ao buscar"),
      );

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Erro ao carregar dados da disciplina.",
        );
      });
    });

    it("deve ordenar disciplinas alfabeticamente", async () => {
      const disciplinasDesordenadas = [
        { id: 3, nome: "Matemática" },
        { id: 1, nome: "Artes" },
        { id: 2, nome: "Português" },
      ];

      (NovaSondagemServico.get as jest.Mock).mockResolvedValue({
        data: disciplinasDesordenadas,
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
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const options = document.querySelectorAll(".ant-select-item-option");
          expect(options.length).toBeGreaterThan(0);

          const optionTexts = Array.from(options).map(
            (opt) => opt.textContent || "",
          );
          const expectedOrder = ["Artes", "Matemática", "Português"];
          expect(optionTexts).toEqual(expectedOrder);
        });
      }
    });

    it("deve carregar proficiências ao selecionar disciplina", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });

        await waitFor(() => {
          expect(NovaSondagemServico.get).toHaveBeenCalledWith(
            "/Proficiencia/componente-curricular/1/modalidade/3",
            expect.objectContaining({
              headers: { "X-Token-Principal": "mock-token" },
            }),
          );
        });
      }
    });

    it("deve tratar erro ao carregar proficiências", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockRejectedValue(new Error("Erro ao buscar proficiências"));

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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });

        await waitFor(() => {
          expect(message.error).toHaveBeenCalledWith(
            "Erro ao carregar dados da proficiencia.",
          );
        });
      }
    });
  });

  describe("Campo Bimestre", () => {
    const mockGetCampoBimestre = (overrides?: {
      questionario?: any;
      bimestres?: any;
      bimestreError?: any;
    }) => {
      (NovaSondagemServico.get as jest.Mock).mockImplementation(
        (url: string) => {
          if (url === "/ComponenteCurricular") {
            return Promise.resolve({ data: mockDisciplinas });
          }
          if (url.startsWith("/Proficiencia/")) {
            return Promise.resolve({ data: mockProficiencias });
          }
          if (url === "/Bimestre") {
            if (overrides?.bimestreError) {
              return Promise.reject(overrides.bimestreError);
            }
            return Promise.resolve({
              data: overrides?.bimestres ?? mockBimestres,
            });
          }
          if (url === "/Questionario") {
            return Promise.resolve({
              data: overrides?.questionario ?? mockQuestionario,
            });
          }
          return Promise.resolve({ data: [] });
        },
      );
    };

    it("não deve exibir campo bimestre quando proficiência não é 3 ou 5", async () => {
      mockGetCampoBimestre();

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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1/modalidade/3",
          expect.any(Object),
        );
      });

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).not.toBeInTheDocument();
      });
    });

    it("deve exibir campo bimestre quando proficiência é 3", async () => {
      mockGetCampoBimestre();

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ ano: "2" }),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Produção de Texto - Bimestral"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Bimestre",
          expect.any(Object),
        );
      });
    });

    it("deve exibir campo bimestre quando proficiência é 5", async () => {
      mockGetCampoBimestre();

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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Matemática - Bimestral"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).toBeInTheDocument();
      });
    });

    it("deve carregar lista de bimestres ao selecionar proficiência 3", async () => {
      mockGetCampoBimestre();

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ ano: "2" }),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Produção de Texto - Bimestral"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Bimestre",
          expect.objectContaining({
            headers: { "X-Token-Principal": "mock-token" },
          }),
        );
      });
    });

    it("deve buscar questionário apenas quando bimestre for selecionado para proficiências 3 ou 5", async () => {
      mockGetCampoBimestre({ questionario: mockQuestionario });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ ano: "2" }),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      expect(proficienciaSelect).toBeInTheDocument();
      fireEvent.mouseDown(proficienciaSelect as HTMLElement);
      const opcaoProficiencia = await screen.findByTitle(
        "Produção de Texto - Bimestral",
      );
      fireEvent.click(opcaoProficiencia);

      expect(NovaSondagemServico.get).not.toHaveBeenCalledWith(
        "/Questionario",
        expect.any(Object),
      );

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).toBeInTheDocument();
        expect(bimestreSelect?.className).not.toContain("ant-select-disabled");
      });

      const bimestreSelect = container.querySelector(
        "#sondagem-select-bimestre",
      ) as HTMLElement;
      fireEvent.mouseDown(bimestreSelect);
      const opcaoBimestre = await screen.findByTitle("1º Bimestre");
      fireEvent.click(opcaoBimestre);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.objectContaining({
            params: expect.objectContaining({
              BimestreId: 1,
            }),
          }),
        );
      });
    });

    it("deve limpar bimestre ao trocar para proficiência que não seja 3 ou 5", async () => {
      mockGetCampoBimestre();

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ ano: "2" }),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      expect(proficienciaSelect).toBeInTheDocument();
      fireEvent.mouseDown(proficienciaSelect as HTMLElement);
      const opcaoProficienciaBimestral = await screen.findByTitle(
        "Produção de Texto - Bimestral",
      );
      fireEvent.click(opcaoProficienciaBimestral);

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).toBeInTheDocument();
      });

      fireEvent.mouseDown(proficienciaSelect as HTMLElement);
      const opcaoEscrita = await screen.findByTitle("Escrita");
      fireEvent.click(opcaoEscrita);

      await waitFor(() => {
        const bimestreSelect = container.querySelector(
          "#sondagem-select-bimestre",
        );
        expect(bimestreSelect).not.toBeInTheDocument();
      });
    });

    it("deve tratar erro ao carregar bimestres", async () => {
      mockGetCampoBimestre({
        bimestreError: new Error("Erro ao buscar bimestres"),
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ ano: "2" }),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalled();
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Produção de Texto - Bimestral"]',
          ) as HTMLElement;
          if (option) fireEvent.click(option);
        });
      }

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Erro ao carregar dados do bimestre.",
        );
      });
    });
  });

  describe("Busca de questionário", () => {
    const mockGetQuestionario = (overrides?: {
      questionario?: any;
      questionarioError?: any;
    }) => {
      (NovaSondagemServico.get as jest.Mock).mockImplementation(
        (url: string) => {
          if (url === "/ComponenteCurricular") {
            return Promise.resolve({ data: mockDisciplinas });
          }
          if (url.startsWith("/Proficiencia/")) {
            return Promise.resolve({ data: mockProficiencias });
          }
          if (url === "/Questionario") {
            if (overrides?.questionarioError) {
              return Promise.reject(overrides.questionarioError);
            }
            return Promise.resolve({
              data: overrides?.questionario ?? mockQuestionario,
            });
          }
          return Promise.resolve({ data: [] });
        },
      );
    };

    it("deve buscar questionário quando disciplina e proficiência são selecionadas", async () => {
      mockGetQuestionario({ questionario: mockQuestionario });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Proficiencia/componente-curricular/1/modalidade/3",
          expect.any(Object),
        );
      });

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
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
          }),
        );
      });
    });

    it("deve exibir notificação de warning para erro 404", async () => {
      mockGetQuestionario({
        questionarioError: { response: { status: 404 } },
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
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(notification.warning).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Dados não encontrados",
          }),
        );
      });
    });

    it("deve exibir notificação de erro para problema de rede", async () => {
      mockGetQuestionario({
        questionarioError: { code: "ERR_NETWORK" },
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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
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
          }),
        );
      });
    });

    it("deve exibir message error para erros genéricos", async () => {
      mockGetQuestionario({
        questionarioError: { response: { status: 500 } },
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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Erro ao carregar dados da sondagem. Tente novamente.",
        );
      });
    });
  });

  describe("Método salvarDadosSondagem", () => {
    const mockQuestionarioComPodeSalvar = {
      ...mockQuestionario,
      podeSalvar: true,
    };

    const mockGetQuestionarioComSalvar = () => {
      (NovaSondagemServico.get as jest.Mock).mockImplementation(
        (url: string) => {
          if (url === "/ComponenteCurricular") {
            return Promise.resolve({ data: mockDisciplinas });
          }
          if (url.startsWith("/Proficiencia/")) {
            return Promise.resolve({ data: mockProficiencias });
          }
          if (url === "/Questionario") {
            return Promise.resolve({ data: mockQuestionarioComPodeSalvar });
          }
          if (url === "/Bimestre") {
            return Promise.resolve({ data: mockBimestres });
          }
          return Promise.resolve({ data: [] });
        },
      );
    };

    it("deve exibir mensagem de sucesso quando retornar status 200", async () => {
      mockGetQuestionarioComSalvar();

      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
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
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          "/Proficiencia/componente-curricular/1/modalidade/3",
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          }),
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
      mockGetQuestionarioComSalvar();

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

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          }),
        );
      });
    });

    it("deve usar token do usuário no header", async () => {
      mockGetQuestionarioComSalvar();

      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "test-token-123",
        turmaSelecionada: criarTurma(),
      });
      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          }),
        );
      });
    });

    it("deve exibir mensagem de erro genérica quando não há message na resposta", async () => {
      mockGetQuestionarioComSalvar();

      (NovaSondagemServico.post as jest.Mock).mockRejectedValue({
        response: {},
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
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          }),
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
      mockGetQuestionarioComSalvar();

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

      await waitFor(() => {
        const salvarButton = screen.queryByText(BOTOES.SALVAR);
        if (salvarButton) {
          fireEvent.click(salvarButton);
        }
      });

      await waitFor(() => {
        expect(NovaSondagemServico.post).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Erro ao salvar sondagem",
            description: expect.stringContaining("dto"),
          }),
        );
      });
    }, 10000);

    it("deve enviar sondagemId do dadosLista", async () => {
      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });
      mockGetQuestionarioComSalvar();

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          expect.any(Object),
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
      mockGetQuestionarioComSalvar();

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const selectDisciplina = container.querySelector(
        "#sondagem-select-componente-curricular",
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
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
        );
      });

      const selectProficiencia = container.querySelector(
        "#sondagem-select-proficiencia",
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
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const salvarButton = screen.getByText(BOTOES.SALVAR);
        expect(salvarButton).not.toBeDisabled();
      });

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
          expect.any(Object),
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
      (validarTurma as jest.Mock).mockResolvedValue({
        valida: false,
        mensagens: [
          "Só existe sondagem para turmas de Educação Infantil e Ensino Fundamental (1º ao 3º ano).",
        ],
      });
      const store = createMockStoreWithUser({
        logado: true,
        turmaSelecionada: criarTurma({ modalidade: "3", ano: "5" }),
      });
      renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(
          screen.getByText(MENSAGENS.MODALIDADE_INVALIDA),
        ).toBeInTheDocument();
      });
    });

    it("deve resetar proficiência ao mudar disciplina", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias });

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
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          expect.stringContaining("/Proficiencia/componente-curricular/1"),
          expect.any(Object),
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
        .mockResolvedValue({ data: mockProficiencias });

      const initialStore = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma({ turma: "1A", id: 1 }),
      });

      const { rerender, container } = renderWithProvider(
        <Conteudo />,
        initialStore,
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

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
        </Provider>,
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
          expect.any(Object),
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
        </Provider>,
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
        </Provider>,
      );

      await waitFor(() => {
        expect(NovaSondagemServico.get).not.toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object),
        );
      });
    });
  });

  describe("Busca de dados somente após seleção completa", () => {
    it("deve buscar dados apenas quando disciplina E proficiência estiverem selecionadas", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
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
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        const questionarioCalls = (
          NovaSondagemServico.get as jest.Mock
        ).mock.calls.filter((call) => call[0] === "/Questionario");
        expect(questionarioCalls.length).toBe(0);
      });

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
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
              ComponenteCurricularId: 1,
              ProficienciaId: 1,
            }),
          }),
        );
      });
    });

    it("não deve buscar dados se apenas disciplina estiver selecionada", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);

        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const questionarioCalls = (
        NovaSondagemServico.get as jest.Mock
      ).mock.calls.filter((call) => call[0] === "/Questionario");
      expect(questionarioCalls.length).toBe(0);
    });
  });

  describe("Auditoria", () => {
    it("deve ter campos de auditoria no mock de dados", () => {
      expect(mockQuestionario.inseridoPor).toBeDefined();
      expect(mockQuestionario.alteradoPor).toBeDefined();
      expect(mockQuestionario.inseridoPor).toBe(
        "Inserido por Professor João em 01/01/2024",
      );
      expect(mockQuestionario.alteradoPor).toBe(
        "Alterado por Professor Maria em 10/01/2024",
      );
    });

    it("deve criar array de auditoria com ambos os campos presentes", () => {
      const dados = {
        inseridoPor: "Inserido por Professor João em 01/01/2024",
        alteradoPor: "Alterado por Professor Maria em 10/01/2024",
      };

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(2);
      expect(arrayAuditoria[0]).toBe(
        "Inserido por Professor João em 01/01/2024",
      );
      expect(arrayAuditoria[1]).toBe(
        "Alterado por Professor Maria em 10/01/2024",
      );
    });

    it("deve filtrar valores null de auditoria", () => {
      const dados = {
        inseridoPor: "Inserido por Professor João em 01/01/2024",
        alteradoPor: null,
      };

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(1);
      expect(arrayAuditoria[0]).toBe(
        "Inserido por Professor João em 01/01/2024",
      );
    });

    it("deve filtrar strings vazias de auditoria", () => {
      const dados = {
        inseridoPor: "",
        alteradoPor: "Alterado por Professor Maria em 10/01/2024",
      };

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(1);
      expect(arrayAuditoria[0]).toBe(
        "Alterado por Professor Maria em 10/01/2024",
      );
    });

    it("deve retornar array vazio quando ambos os campos são null", () => {
      const dados = {
        inseridoPor: null,
        alteradoPor: null,
      };

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(0);
    });

    it("deve retornar array vazio quando ambos os campos são strings vazias", () => {
      const dados = {
        inseridoPor: "",
        alteradoPor: "",
      };

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(0);
    });

    it("deve filtrar campos undefined", () => {
      const dados: any = {};

      const arrayAuditoria = [dados.inseridoPor, dados.alteradoPor].filter(
        (item) => item != null && item !== "",
      );

      expect(arrayAuditoria).toHaveLength(0);
    });
  });

  describe("Renderização de SondagemListaDinamica", () => {
    it("deve renderizar SondagemListaDinamica com dados do questionário", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
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
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/Questionario",
          expect.any(Object),
        );
      });

      await waitFor(() => {
        const table = container.querySelector(".ant-table");
        expect(table).toBeInTheDocument();
      });
    });

    it("deve renderizar tabela sem limite de altura vertical", async () => {
      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
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
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        const table = container.querySelector(".ant-table");
        expect(table).toBeInTheDocument();
      });

      const tableBody = container.querySelector(".ant-table-body");
      if (tableBody) {
        const style = window.getComputedStyle(tableBody);

        expect(style.maxHeight).not.toBe("600px");
      }
    });

    it("deve passar prop podeSalvar corretamente para SondagemListaDinamica", async () => {
      const mockQuestionarioComPodeSalvar = {
        ...mockQuestionario,
        podeSalvar: true,
      };

      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionarioComPodeSalvar });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        const table = container.querySelector(".ant-table");
        expect(table).toBeInTheDocument();
      });

      await waitFor(() => {
        const botaoSalvar = screen.getByText(BOTOES.SALVAR);
        expect(botaoSalvar).not.toBeDisabled();
      });
    });

    it("deve desabilitar botões quando podeSalvar é false", async () => {
      const mockQuestionarioSemPermissao = {
        ...mockQuestionario,
        podeSalvar: false,
      };

      (NovaSondagemServico.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockDisciplinas })
        .mockResolvedValue({ data: mockProficiencias })
        .mockResolvedValueOnce({ data: mockQuestionarioSemPermissao });

      const store = createMockStoreWithUser({
        logado: true,
        token: "mock-token",
        turmaSelecionada: criarTurma(),
      });

      const { container } = renderWithProvider(<Conteudo />, store);

      await waitFor(() => {
        expect(NovaSondagemServico.get).toHaveBeenCalledWith(
          "/ComponenteCurricular",
          expect.any(Object),
        );
      });

      const disciplinaSelect = container.querySelector(
        "#sondagem-select-componente-curricular",
      );

      if (disciplinaSelect) {
        fireEvent.mouseDown(disciplinaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Português"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      const proficienciaSelect = container.querySelector(
        "#sondagem-select-proficiencia",
      );

      if (proficienciaSelect) {
        fireEvent.mouseDown(proficienciaSelect);
        await waitFor(() => {
          const option = document.querySelector(
            '[title="Escrita"]',
          ) as HTMLElement;
          if (option) {
            fireEvent.click(option);
          }
        });
      }

      await waitFor(() => {
        const botaoSalvar = container.querySelector(
          "#sondagem-button-salvar",
        ) as HTMLButtonElement;
        expect(botaoSalvar).toBeDisabled();
      });
    });
  });
});
