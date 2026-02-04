import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Legendas from "./legendas";

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
      const header = container.querySelector(
        'div[style*="background-color"]',
      ) as HTMLElement;
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
      expect(truncatedTexts.length).toBe(mockData.length);
    });
  });

  describe("Tooltip para textos longos", () => {
    it("deve renderizar Tooltip para cada texto de legenda", () => {
      const { container } = renderWithProvider(<Legendas data={mockData} />);
      const tooltips = container.querySelectorAll(
        ".ant-tooltip-disabled-compatible-wrapper, [role='tooltip'], .legenda-texto-truncado",
      );
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it("deve renderizar texto longo com tooltip", () => {
      const longTextData = [
        {
          key: "long-text",
          corFundo: "#FF0000",
          textoLegenda:
            "Este é um texto muito longo que deve ser truncado e mostrado completamente apenas quando o usuário passar o mouse por cima dele",
          descricaoLegenda: "Texto longo",
        },
      ];
      const { container } = renderWithProvider(
        <Legendas data={longTextData} />,
      );
      const truncatedText = container.querySelector(".legenda-texto-truncado");
      expect(truncatedText).toBeInTheDocument();
      expect(truncatedText?.textContent).toContain(
        "Este é um texto muito longo",
      );
    });

    it("deve renderizar texto curto normalmente com tooltip", () => {
      const shortTextData = [
        {
          key: "short-text",
          corFundo: "#00FF00",
          textoLegenda: "Curto",
          descricaoLegenda: "Texto curto",
        },
      ];
      renderWithProvider(<Legendas data={shortTextData} />);
      expect(screen.getByText("Curto")).toBeInTheDocument();
      expect(screen.getByText(/Texto curto/)).toBeInTheDocument();
    });
  });

  describe("Múltiplas legendas - Proficiência Leitura", () => {
    const mockDadosCompletos = {
      estudantes: [
        {
          codigo: "123456",
          nome: "Aluno Teste",
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

    it("deve renderizar 3 colunas de legendas quando proficienciaId=3 e ano=3", () => {
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={3}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(screen.getByText("Legendas da reflexão")).toBeInTheDocument();
    });

    it("deve renderizar 2 colunas de legendas quando proficienciaId=3 e ano=2", () => {
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={2}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(
        screen.queryByText("Legendas da reflexão"),
      ).not.toBeInTheDocument();
    });

    it("deve renderizar legenda única quando proficienciaId=3 e ano=1", () => {
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={1}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      expect(screen.getByText("Legendas")).toBeInTheDocument();
      expect(
        screen.queryByText("Legendas da localização"),
      ).not.toBeInTheDocument();
    });

    it("deve renderizar legenda única quando proficienciaId não é 3", () => {
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={1}
          ano={3}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      expect(screen.getByText("Legendas")).toBeInTheDocument();
      expect(
        screen.queryByText("Legendas da localização"),
      ).not.toBeInTheDocument();
    });

    it("deve extrair legendas corretas de cada coluna", () => {
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={3}
          dadosCompletos={mockDadosCompletos}
        />,
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
      renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={"3" as any}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      expect(screen.getByText("Legendas da localização")).toBeInTheDocument();
      expect(screen.getByText("Legendas da inferência")).toBeInTheDocument();
      expect(screen.getByText("Legendas da reflexão")).toBeInTheDocument();
    });

    it("deve renderizar Row do Ant Design quando múltiplas legendas", () => {
      const { container } = renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={3}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      const row = container.querySelector(".ant-row");
      expect(row).toBeInTheDocument();
    });

    it("deve renderizar múltiplas tabelas quando múltiplas legendas", () => {
      const { container } = renderWithProvider(
        <Legendas
          data={mockData}
          proficienciaId={3}
          ano={3}
          dadosCompletos={mockDadosCompletos}
        />,
      );

      const tables = container.querySelectorAll(".ant-table");
      expect(tables.length).toBe(3);
    });
  });
});
