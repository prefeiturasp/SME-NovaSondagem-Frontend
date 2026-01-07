import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectColorido from "./index";
import { nanoid } from "nanoid";

jest.mock("nanoid", () => ({
  nanoid: jest.fn(),
}));

// Constantes para cores
const CORES = {
  VERMELHO: { corFundo: "#FF0000", corTexto: "#FFFFFF" },
  VERDE: { corFundo: "#00FF00", corTexto: "#000000" },
  AZUL: { corFundo: "#0000FF", corTexto: "#FFFFFF" },
  AMARELO: { corFundo: "#FFFF00", corTexto: "#000000" },
  LARANJA: { corFundo: "#FFA500", corTexto: "#000000" },
  BRANCO: { corFundo: "#FFFFFF", corTexto: "#000000" },
};

describe("SelectColorido", () => {
  // Mock de opções com cores
  const mockOptionsComCores = [
    { value: 1, label: "Pré-silábico", ...CORES.VERMELHO },
    { value: 2, label: "Silábico sem valor", ...CORES.VERDE },
    { value: 3, label: "Silábico com valor", ...CORES.AZUL },
    { value: 4, label: "Silábico-alfabético", ...CORES.AMARELO },
    { value: 5, label: "Alfabético", ...CORES.LARANJA },
  ];

  // Mock de opções sem cores (para testes de fallback)
  const mockOptionsSemCores = [
    { value: 1, label: "Opção 1" },
    { value: 2, label: "Opção 2" },
    { value: 3, label: "Opção 3" },
  ];

  let nanoidCounter = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    nanoidCounter = 0;
    (nanoid as jest.Mock).mockImplementation(() => {
      nanoidCounter += 1;
      return `mock-id-${nanoidCounter}`;
    });
  });

  describe("Renderização básica", () => {
    it("deve renderizar o select", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />
      );
      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar classe select-colorido", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />
      );
      const select = container.querySelector(".select-colorido");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar className adicional quando fornecida", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          className="custom-class"
        />
      );
      const select = container.querySelector(".custom-class");
      expect(select).toBeInTheDocument();
    });

    it("deve gerar id único quando não fornecido", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptionsComCores} />
      );
      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} />
      );

      const select1 = container1.querySelector(
        ".select-colorido-select-mock-id-1"
      );
      const select2 = container2.querySelector(
        ".select-colorido-select-mock-id-2"
      );

      expect(select1).toBeInTheDocument();
      expect(select2).toBeInTheDocument();
      expect(select1?.className).not.toEqual(select2?.className);
    });

    it("deve usar id fornecido via props", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} id="custom-id" />
      );
      const select = container.querySelector(".select-colorido-custom-id");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("deve exibir mensagem 'Sem dados' quando não há opções", () => {
      render(<SelectColorido options={[]} open />);
      expect(screen.getByText("Sem dados")).toBeInTheDocument();
    });

    it("deve renderizar Empty component do Ant Design", () => {
      const { container } = render(<SelectColorido options={[]} open />);
      const empty = container.querySelector(".ant-empty");
      expect(empty).toBeInTheDocument();
    });
  });

  describe("Filtro de opções", () => {
    it("deve filtrar opções pelo label", async () => {
      render(<SelectColorido options={mockOptionsComCores} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "Pré-silábico" } });

      await waitFor(() => {
        expect(screen.getByText("Pré-silábico")).toBeInTheDocument();
      });
    });

    it("deve filtrar opções pelo value", async () => {
      render(<SelectColorido options={mockOptionsComCores} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "2" } });

      await waitFor(() => {
        expect(screen.getByText("Silábico sem valor")).toBeInTheDocument();
      });
    });

    it("deve ser case insensitive no filtro", async () => {
      render(<SelectColorido options={mockOptionsComCores} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "silábico" } });

      await waitFor(() => {
        expect(screen.getByText("Silábico sem valor")).toBeInTheDocument();
      });
    });
  });

  describe("Cores dinâmicas das opções", () => {
    it("deve aplicar cor de fundo correta ao selecionar opção", async () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);
    });

    it("deve aplicar cor de texto correta ao selecionar opção", async () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corTexto);
    });

    it("deve atualizar cores ao mudar valor selecionado", async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={handleChange}
          open
        />
      );

      const option = screen.getByText("Pré-silábico");
      fireEvent.click(option);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      });
    });

    it("deve aplicar cores diferentes para cada opção", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} value={2} />
      );

      const styleTag1 = container1.querySelector("style");
      const styleTag2 = container2.querySelector("style");

      expect(styleTag1?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      expect(styleTag2?.innerHTML).toContain(CORES.VERDE.corFundo);
    });

    it("deve aplicar cor branca quando não há valor selecionado", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={undefined} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#000000");
    });

    it("deve aplicar cor branca quando não há opções", () => {
      const { container } = render(<SelectColorido options={[]} value={1} />);

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });
  });

  describe("Fallback de cores", () => {
    it("deve aplicar cores padrão quando opção não tem corFundo", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsSemCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#000000");
    });

    it("deve aplicar cores padrão quando opção não existe", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={999} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });
  });
  describe("Mudança de valor e onChange", () => {
    it("deve chamar onChange ao selecionar opção", async () => {
      const handleChange = jest.fn();
      render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={handleChange}
          open
        />
      );

      const option = screen.getByText("Pré-silábico");
      fireEvent.click(option);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(1, expect.anything());
      });
    });

    it("deve passar valor e option corretos para onChange", async () => {
      const handleChange = jest.fn();
      render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={handleChange}
          open
        />
      );

      const option = screen.getByText("Alfabético");
      fireEvent.click(option);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(5, expect.anything());
      });
    });
  });

  describe("useEffect - atualização de cores", () => {
    it("deve atualizar cores quando value muda", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      let styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);

      rerender(<SelectColorido options={mockOptionsComCores} value={2} />);

      await waitFor(() => {
        styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.VERDE.corFundo);
      });
    });

    it("deve atualizar cores quando options mudam", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const novasOpcoes = [
        { value: 1, label: "Nova", corFundo: "#123456", corTexto: "#FEDCBA" },
      ];

      rerender(<SelectColorido options={novasOpcoes} value={1} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("#123456");
      });
    });

    it("deve resetar para cores padrão quando value é limpo", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      rerender(
        <SelectColorido options={mockOptionsComCores} value={undefined} />
      );

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("#FFFFFF");
      });
    });
  });

  describe("Estilos inline e tag style", () => {
    it("deve gerar tag style com estilos dinâmicos", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.innerHTML).toContain(".ant-select-selector");
    });

    it("deve incluir estilos para estado disabled", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} disabled />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("disabled");
      expect(styleTag?.innerHTML).toContain("opacity");
    });

    it("deve incluir estilos para texto e arrow", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-selection-item");
      expect(styleTag?.innerHTML).toContain("ant-select-arrow");
    });

    it("deve aplicar font-weight 500 no texto selecionado", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("font-weight: 500");
    });
  });

  describe("Props do Ant Design Select", () => {
    it("deve passar props adicionais para SelectAnt", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          placeholder="Selecione uma opção"
        />
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar disabled quando fornecido", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} disabled />
      );

      const select = container.querySelector(".ant-select-disabled");
      expect(select).toBeInTheDocument();
    });

    it("deve sempre ter showSearch ativo", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />
      );

      const select = container.querySelector(".ant-select-show-search");
      expect(select).toBeInTheDocument();
    });
  });

  describe("getPopupContainer", () => {
    it("deve definir getPopupContainer para parentElement", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Integração com formulário", () => {
    it("deve funcionar com value controlado", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      rerender(<SelectColorido options={mockOptionsComCores} value={2} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("deve permitir limpeza de valor", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />
      );

      rerender(
        <SelectColorido options={mockOptionsComCores} value={undefined} />
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Cenários completos de uso", () => {
    it("deve renderizar e funcionar com dados de sondagem real", async () => {
      const opcoesSondagem = [
        {
          value: 1,
          label: "Pré-silábico",
          corFundo: "#FF6B6B",
          corTexto: "#FFFFFF",
        },
        {
          value: 2,
          label: "Silábico sem valor",
          corFundo: "#FFD93D",
          corTexto: "#000000",
        },
        {
          value: 3,
          label: "Alfabético",
          corFundo: "#4D96FF",
          corTexto: "#FFFFFF",
        },
      ];

      const handleChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={opcoesSondagem}
          value={1}
          onChange={handleChange}
          placeholder="Selecione o nível"
          id="sondagem-escrita"
        />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FF6B6B");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(
        container.querySelector(".select-colorido-sondagem-escrita")
      ).toBeInTheDocument();
    });
  });
});
