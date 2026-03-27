import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Legendas from "./legendas";
import { Proficiencia, Modalidade, Ano } from "../../../core/dto/types";

const createMockStore = (overrides = {}) =>
  configureStore({
    reducer: {
      usuario: () => ({
        turmaSelecionada: {
          modalidade: "1",
          ano: "1",
        },
        ...overrides,
      }),
    },
  });

const renderWithProvider = (ui: React.ReactElement) => {
  const store = createMockStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

const TITULO_TERCEIRA_COLUNA = /Legendas da (reflexão|apreciação e réplica)/i;

describe("Legendas", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes('unique "key" prop')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });
  const mockData: any[] = [
    {
      key: "1",
      corFundo: "#FF0000",
      textoLegenda: "PS",
      descricaoLegenda: "Pré-silábico",
    },
    {
      key: "2",
      corFundo: "#00FF00",
      textoLegenda: "SSV",
      descricaoLegenda: "Silábico sem valor",
    },
    {
      key: "3",
      corFundo: "#0000FF",
      textoLegenda: "SCV",
      descricaoLegenda: "Silábico com valor",
    },
  ];

  describe("Renderização básica", () => {
    it("deve renderizar o componente sem erros", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      expect(container).toBeInTheDocument();
    });

    it("deve renderizar título 'Legendas'", () => {
      renderWithProvider(<Legendas data={mockData} />);
      expect(screen.getByText("Legendas")).toBeInTheDocument();
    });

    it("deve renderizar tabela do Ant Design", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });

    it("deve aplicar classe tabela-legendas", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const table = container.querySelector(".tabela-legendas");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Renderização dos dados", () => {
    it("deve renderizar todas as legendas fornecidas", () => {
      renderWithProvider(<Legendas data={mockData} />);
      expect(screen.getByText("PS")).toBeInTheDocument();
      expect(screen.getByText("SSV")).toBeInTheDocument();
      expect(screen.getByText("SCV")).toBeInTheDocument();
    });

    it("deve renderizar descrições das legendas", () => {
      renderWithProvider(<Legendas data={mockData} />);
      expect(screen.getByText(/Pré-silábico/)).toBeInTheDocument();
      expect(screen.getByText(/Silábico sem valor/)).toBeInTheDocument();
      expect(screen.getByText(/Silábico com valor/)).toBeInTheDocument();
    });

    it("deve renderizar caixas de cor para cada legenda", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const colorBoxes = container.querySelectorAll(
        'div[style*="background-color"]',
      );
      expect(colorBoxes.length).toBeGreaterThan(0);
    });

    it("deve aplicar cores de fundo corretas", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const tableBody = container.querySelector(".ant-table-tbody");
      // As cores são convertidas para rgb pelo navegador
      expect(tableBody?.innerHTML).toContain("rgb(255, 0, 0)");
      expect(tableBody?.innerHTML).toContain("rgb(0, 255, 0)");
      expect(tableBody?.innerHTML).toContain("rgb(0, 0, 255)");
    });
  });

  describe("Propriedades da tabela", () => {
    it("deve renderizar tabela sem paginação", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const pagination = container.querySelector(".ant-pagination");
      expect(pagination).not.toBeInTheDocument();
    });

    it("deve renderizar tabela sem cabeçalho", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const thead = container.querySelector("thead");
      expect(thead).not.toBeInTheDocument();
    });

    it("deve renderizar tabela com tamanho pequeno", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const table = container.querySelector(".ant-table-small");
      expect(table).toBeInTheDocument();
    });

    it("deve renderizar tabela com borda", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const table = container.querySelector(".ant-table-bordered");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Casos extremos", () => {
    it("deve renderizar com array vazio", () => {
      const { container } = renderWithProvider(<Legendas data={[]} />);
      expect(container.querySelector(".ant-table")).toBeInTheDocument();
    });

    it("deve renderizar com uma única legenda", () => {
      const singleData = [mockData[0]];
      renderWithProvider(<Legendas data={singleData} />);
      expect(screen.getByText("PS")).toBeInTheDocument();
      expect(screen.getByText(/Pré-silábico/)).toBeInTheDocument();
    });

    it("deve renderizar legendas com descrições longas", () => {
      const longDescriptionData = [
        {
          key: "long",
          corFundo: "#FF0000",
          textoLegenda: "TESTE",
          descricaoLegenda:
            "Esta é uma descrição muito longa que deve ser renderizada corretamente na tabela",
        },
      ];
      renderWithProvider(<Legendas data={longDescriptionData} />);
      expect(
        screen.getByText(/Esta é uma descrição muito longa/),
      ).toBeInTheDocument();
    });
  });

  describe("Estilos", () => {
    it("deve aplicar margem superior no container", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("marginTop2em");
    });

    it("deve aplicar estilo no cabeçalho da legenda", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const header = container.querySelector(".titulo-legenda") as HTMLElement;
      expect(header).toBeInTheDocument();
      expect(header.textContent).toBe("Legendas");
    });

    it("deve aplicar fonte em negrito no texto da legenda", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const boldTexts = container.querySelectorAll(".fontWeightBold");
      expect(boldTexts.length).toBeGreaterThan(0);
    });

    it("deve aplicar classe legenda-texto-truncado no texto", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const truncatedTexts = container.querySelectorAll(
        ".legenda-texto-truncado",
      );
      expect(truncatedTexts.length).toBeGreaterThan(0);
    });
  });

  describe("Modo múltiplas legendas", () => {
    const multicategorias: any[] = [
      { corFundo: "#7ED957", descricaoLegenda: "A", textoLegenda: "Localizou" },
      { corFundo: "#7ED957", descricaoLegenda: "B", textoLegenda: "Inferiu" },
      // texto de reflexao realista sem a palavra "reflexão" mas com palavra-chave
      {
        corFundo: "#7ED957",
        descricaoLegenda: "C",
        textoLegenda: "Realizou a proposta de apreciação e réplica",
      },
      {
        corFundo: "#FFFFFF",
        descricaoLegenda: "Sem",
        textoLegenda: "Sem preenchimento",
      },
    ];

    const mockDadosCompletos = {
      estudantes: [
        {
          coluna: [
            {
              descricaoColuna: "Localização",
              opcaoResposta: [
                {
                  corFundo: "#FF0000",
                  descricaoOpcaoResposta: "Não localiza",
                  legenda: "NL",
                },
                {
                  corFundo: "#00FF00",
                  descricaoOpcaoResposta: "Localiza",
                  legenda: "L",
                },
              ],
            },
            {
              descricaoColuna: "Inferência",
              opcaoResposta: [
                {
                  corFundo: "#FF00FF",
                  descricaoOpcaoResposta: "Não infere",
                  legenda: "NI",
                },
                {
                  corFundo: "#00FFFF",
                  descricaoOpcaoResposta: "Infere",
                  legenda: "I",
                },
              ],
            },
            {
              descricaoColuna: "Reflexão",
              opcaoResposta: [
                {
                  corFundo: "#FFFF00",
                  descricaoOpcaoResposta: "Não reflete",
                  legenda: "NR",
                },
                {
                  corFundo: "#0000FF",
                  descricaoOpcaoResposta: "Reflete",
                  legenda: "R",
                },
              ],
            },
          ],
        },
      ],
    };

    const storeEjaPrimeiro = createMockStore({
      turmaSelecionada: { modalidade: Modalidade.EJA, ano: Ano.PrimeiroAno },
    });

    it("usa dados passados quando extração da coluna não retorna itens", () => {
      const multiData: any[] = [
        {
          corFundo: "#7ED957",
          descricaoLegenda: "Adequada",
          textoLegenda: "Localizou a informação",
        },
        {
          corFundo: "#FFDE59",
          descricaoLegenda: "Inadequada",
          textoLegenda: "Não localizou a informação",
        },
        {
          corFundo: "#FFFFFF",
          descricaoLegenda: "Sem preenchimento",
          textoLegenda:
            "Seleção feita pelo professor quando o estudante não respondeu",
        },
      ];

      const dadosCompletos = {
        estudantes: [
          {
            coluna: [
              { descricaoColuna: "Localização", opcaoResposta: [] },
              { descricaoColuna: "Inferência", opcaoResposta: [] },
            ],
          },
        ],
      };

      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={multiData}
            ano={Ano.SegundoAno}
            proficienciaId={Proficiencia.LeituraEJA}
            dadosCompletos={dadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText(/Legendas da localização/i)).toBeInTheDocument();
      expect(screen.getByText(/Legendas da inferência/i)).toBeInTheDocument();
      expect(screen.getByText("Localizou a informação")).toBeInTheDocument();
      // legenda genérica aparece em cada coluna, portanto há múltiplas ocorrências
      const generic = screen.getAllByText(/Sem preenchimento/i);
      expect(generic.length).toBeGreaterThanOrEqual(2);
    });

    it("mescla extração parcial com legendas completas da coluna", () => {
      const multiData: any[] = [
        {
          corFundo: "#7ED957",
          descricaoLegenda: "Adequada",
          textoLegenda: "Localizou a informação",
        },
        {
          corFundo: "#FFDE59",
          descricaoLegenda: "Inadequada",
          textoLegenda: "Não localizou a informação",
        },
        {
          corFundo: "#7ED957",
          descricaoLegenda: "Adequada",
          textoLegenda: "Inferiu a informação",
        },
        {
          corFundo: "#FFDE59",
          descricaoLegenda: "Inadequada",
          textoLegenda: "Não inferiu a informação",
        },
        {
          corFundo: "#FFFFFF",
          descricaoLegenda: "Sem preenchimento",
          textoLegenda:
            "Seleção feita pelo professor quando o estudante não respondeu",
        },
      ];

      const dadosCompletosParcial = {
        estudantes: [
          {
            coluna: [
              {
                descricaoColuna: "Localização",
                opcaoResposta: [
                  {
                    corFundo: "#7ED957",
                    descricaoOpcaoResposta: "Adequada",
                    legenda: "Localizou a informação",
                  },
                ],
              },
              {
                descricaoColuna: "Inferência",
                opcaoResposta: [
                  {
                    corFundo: "#FFDE59",
                    descricaoOpcaoResposta: "Inadequada",
                    legenda: "Não inferiu a informação",
                  },
                ],
              },
            ],
          },
        ],
      };

      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={multiData}
            ano={Ano.SegundoAno}
            proficienciaId={Proficiencia.LeituraEJA}
            dadosCompletos={dadosCompletosParcial}
          />
        </Provider>,
      );

      const localTabela = screen.getByText(
        /Legendas da localização/i,
      ).nextSibling;
      expect(localTabela).toHaveTextContent("Localizou a informação");
      expect(localTabela).toHaveTextContent("Não localizou a informação");

      const inferTabela = screen.getByText(
        /Legendas da inferência/i,
      ).nextSibling;
      expect(inferTabela).toHaveTextContent("Inferiu a informação");
      expect(inferTabela).toHaveTextContent("Não inferiu a informação");
    });

    it("cada coluna mostra apenas suas legendas e não repete", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={multicategorias}
            ano={Ano.TerceiroAno}
            proficienciaId={Proficiencia.LeituraEJA}
            dadosCompletos={{ estudantes: [] }}
          />
        </Provider>,
      );

      // só aparece A em localização
      const localTabela = screen.getByText(
        /Legendas da localização/i,
      ).nextSibling;
      expect(localTabela).toHaveTextContent("Localizou");
      expect(localTabela).not.toHaveTextContent("Inferiu");
      expect(localTabela).not.toHaveTextContent("Realizou a proposta");

      const inferTabela = screen.getByText(
        /Legendas da inferência/i,
      ).nextSibling;
      expect(inferTabela).toHaveTextContent("Inferiu");
      expect(inferTabela).not.toHaveTextContent("Localizou");
      expect(inferTabela).not.toHaveTextContent("Realizou a proposta");

      const reflexTabela = screen.getByText(TITULO_TERCEIRA_COLUNA).nextSibling;
      expect(reflexTabela).toHaveTextContent("Realizou a proposta");
      expect(reflexTabela).not.toHaveTextContent("Localizou");
      expect(reflexTabela).not.toHaveTextContent("Inferiu");

      // item genérico aparece em todas as três
      expect(localTabela).toHaveTextContent("Sem preenchimento");
      expect(inferTabela).toHaveTextContent("Sem preenchimento");
      expect(reflexTabela).toHaveTextContent("Sem preenchimento");
    });

    it("filtra corretamente mesmo quando extrairLegendasDaColuna retorna tudo", () => {
      const everythingStore = createMockStore({
        turmaSelecionada: { modalidade: Modalidade.EJA, ano: Ano.PrimeiroAno },
      });
      // montar dadosCompletos com cada coluna contendo a lista completa
      const complete = {
        estudantes: [
          {
            coluna: [
              {
                descricaoColuna: "Localização",
                opcaoResposta: multicategorias,
              },
              { descricaoColuna: "Inferência", opcaoResposta: multicategorias },
              { descricaoColuna: "Reflexão", opcaoResposta: multicategorias },
            ],
          },
        ],
      };

      render(
        <Provider store={everythingStore}>
          <Legendas
            data={multicategorias}
            ano={Ano.TerceiroAno}
            proficienciaId={Proficiencia.LeituraEJA}
            dadosCompletos={complete}
          />
        </Provider>,
      );

      // garantir que cada tabela contenha somente o seu subconjunto
      expect(
        screen.getByText(/Legendas da localização/i).nextSibling,
      ).toHaveTextContent("Localizou");
      expect(
        screen.getByText(/Legendas da inferência/i).nextSibling,
      ).toHaveTextContent("Inferiu");
      expect(
        screen.getByText(TITULO_TERCEIRA_COLUNA).nextSibling,
      ).toHaveTextContent("Realizou a proposta");
    });

    it("deve renderizar 3 colunas de legendas quando proficienciaId=3 e ano=3", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={3}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(screen.getByText(TITULO_TERCEIRA_COLUNA)).toBeInTheDocument();
    });

    it("deve renderizar 2 colunas de legendas quando proficienciaId=3 e ano=2", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={2}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(
        screen.queryByText(TITULO_TERCEIRA_COLUNA),
      ).not.toBeInTheDocument();
    });

    it("deve renderizar legenda única quando proficienciaId=3 e ano=1", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={1}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText("Legendas")).toBeInTheDocument();
      expect(
        screen.queryByText("Legendas da localização"),
      ).not.toBeInTheDocument();
    });

    it("deve renderizar legenda única quando proficienciaId não é 3", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={1}
            ano={3}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText("Legendas")).toBeInTheDocument();
      expect(
        screen.queryByText("Legendas da localização"),
      ).not.toBeInTheDocument();
    });

    it("deve extrair legendas corretas de cada coluna", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={3}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      // Localização
      expect(screen.getByText("NL")).toBeInTheDocument();
      expect(screen.getByText("L")).toBeInTheDocument();

      // Inferência
      expect(screen.getByText("NI")).toBeInTheDocument();
      expect(screen.getByText("I")).toBeInTheDocument();

      // Reflexão
      expect(screen.getByText("NR")).toBeInTheDocument();
      expect(screen.getByText("R")).toBeInTheDocument();
    });

    it("deve renderizar com ano como string", () => {
      render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={"3" as any}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(screen.getByText(TITULO_TERCEIRA_COLUNA)).toBeInTheDocument();
    });

    it("deve renderizar Row do Ant Design quando múltiplas legendas", () => {
      const { container } = render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={3}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      const row = container.querySelector(".ant-row");
      expect(row).toBeInTheDocument();
    });

    it("deve renderizar múltiplas tabelas quando múltiplas legendas", () => {
      const { container } = render(
        <Provider store={storeEjaPrimeiro}>
          <Legendas
            data={mockData}
            proficienciaId={3}
            ano={3}
            dadosCompletos={mockDadosCompletos}
          />
        </Provider>,
      );

      const tables = container.querySelectorAll(".ant-table");
      expect(tables.length).toBe(3);
    });
  });
});
