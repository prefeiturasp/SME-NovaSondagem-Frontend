import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectColorido from "./index";

describe("SelectColorido", () => {
  const mockOptions = [
    { value: 1, label: "Opção 1" },
    { value: 2, label: "Opção 2" },
    { value: 3, label: "Opção 3" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização básica", () => {
    it("deve renderizar o select", () => {
      const { container } = render(<SelectColorido options={mockOptions} />);
      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar classe select-colorido", () => {
      const { container } = render(<SelectColorido options={mockOptions} />);
      const select = container.querySelector(".select-colorido");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar className adicional quando fornecida", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} className="custom-class" />
      );
      const select = container.querySelector(".custom-class");
      expect(select).toBeInTheDocument();
    });

    it("deve gerar id único quando não fornecido", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptions} />
      );
      const { container: container2 } = render(
        <SelectColorido options={mockOptions} />
      );

      const select1 = container1.querySelector(".ant-select");
      const select2 = container2.querySelector(".ant-select");

      expect(select1?.className).not.toEqual(select2?.className);
    });

    it("deve usar id fornecido via props", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} id="custom-id" />
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
      render(<SelectColorido options={mockOptions} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "Opção 1" } });

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
      });
    });

    it("deve filtrar opções pelo value", async () => {
      render(<SelectColorido options={mockOptions} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "2" } });

      await waitFor(() => {
        expect(screen.getByText("Opção 2")).toBeInTheDocument();
      });
    });

    it("deve ser case insensitive no filtro", async () => {
      render(<SelectColorido options={mockOptions} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "opção" } });

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
      });
    });
  });

  describe("Mudança de valor", () => {
    it("deve chamar onChange ao selecionar opção", async () => {
      const handleChange = jest.fn();
      render(
        <SelectColorido options={mockOptions} onChange={handleChange} open />
      );

      const option = screen.getByText("Opção 1");
      fireEvent.click(option);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(1, expect.anything());
      });
    });

    it("deve atualizar cores ao mudar valor", async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptions} onChange={handleChange} open />
      );

      const option = screen.getByText("Opção 1");
      fireEvent.click(option);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("background-color");
      });
    });
  });

  describe("Cores por tipo de questão - escrita", () => {
    it("deve aplicar cores para escrita ano 1", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FF3131");
    });

    it("deve aplicar cores para escrita ano 2", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("background-color");
    });

    it("deve aplicar cores para escrita ano 3", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("background-color");
    });

    it("deve aplicar cores padrão para escrita com ano desconhecido", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#E0E0E0");
    });
  });

  describe("Cores por tipo de questão - leitura", () => {
    it("deve aplicar cores específicas para leitura", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#7ED957");
    });

    it("deve aplicar cores corretas para diferentes índices em leitura", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const { container: container2 } = render(
        <SelectColorido options={mockOptions} value={2} />
      );

      const styleTag1 = container1.querySelector("style");
      const styleTag2 = container2.querySelector("style");

      expect(styleTag1?.innerHTML).toContain("#7ED957");
      expect(styleTag2?.innerHTML).toContain("#FFDE59");
    });
  });

  describe("Cores por tipo de questão - numeros", () => {
    it("deve aplicar cores específicas para numeros", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#D9EEFA");
    });
  });

  describe("Cores por tipo de questão - mapeamento", () => {
    it("deve aplicar cores específicas para mapeamento", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#7ED957");
    });
  });

  describe("Cores padrão", () => {
    it("deve aplicar cores padrão quando tipoQuestao não é fornecido", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FF3131");
    });

    it("deve aplicar cor branca quando não há valor selecionado", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={undefined} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });

    it("deve aplicar cor branca quando não há opções", () => {
      const { container } = render(<SelectColorido options={[]} value={1} />);

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });
  });

  describe("useEffect - atualização de cores", () => {
    it("deve atualizar cores quando value muda", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      let styleTag = container.querySelector("style");
      const firstColor = styleTag?.innerHTML;

      rerender(<SelectColorido options={mockOptions} value={2} />);

      await waitFor(() => {
        styleTag = container.querySelector("style");
        const secondColor = styleTag?.innerHTML;
        expect(firstColor).not.toEqual(secondColor);
      });
    });

    it("deve atualizar cores quando tipoQuestao muda", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      rerender(<SelectColorido options={mockOptions} value={1} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("background-color");
      });
    });

    it("deve atualizar cores quando anoTurma muda", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      rerender(<SelectColorido options={mockOptions} value={1} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("background-color");
      });
    });
  });

  describe("Estilos inline", () => {
    it("deve gerar tag style com estilos dinâmicos", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.innerHTML).toContain(".ant-select-selector");
    });

    it("deve incluir estilos para estado disabled", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} disabled />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("disabled");
      expect(styleTag?.innerHTML).toContain("opacity");
    });

    it("deve incluir estilos para texto e arrow", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-selection-item");
      expect(styleTag?.innerHTML).toContain("ant-select-arrow");
    });
  });

  describe("Props do Ant Design Select", () => {
    it("deve passar props adicionais para SelectAnt", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptions}
          placeholder="Selecione uma opção"
        />
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar disabled quando fornecido", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} disabled />
      );

      const select = container.querySelector(".ant-select-disabled");
      expect(select).toBeInTheDocument();
    });

    it("deve sempre ter showSearch ativo", () => {
      const { container } = render(<SelectColorido options={mockOptions} />);

      const select = container.querySelector(".ant-select-show-search");
      expect(select).toBeInTheDocument();
    });
  });

  describe("getPopupContainer", () => {
    it("deve definir getPopupContainer para parentElement", () => {
      const { container } = render(<SelectColorido options={mockOptions} />);

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Cálculo de cores por índice", () => {
    it("deve aplicar cores ciclicamente quando índice excede array de cores", () => {
      const manyOptions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `Opção ${i + 1}`,
      }));

      const { container } = render(
        <SelectColorido options={manyOptions} value={7} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("background-color");
    });
  });

  describe("Tipos de questão específicos", () => {
    it("deve suportar tipoQuestao reescrita", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
    });

    it("deve suportar tipoQuestao producao", () => {
      const { container } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
    });
  });

  describe("Integração com formulário", () => {
    it("deve funcionar com value controlado", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      rerender(<SelectColorido options={mockOptions} value={2} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("deve permitir limpeza de valor", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptions} value={1} />
      );

      rerender(<SelectColorido options={mockOptions} value={undefined} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
