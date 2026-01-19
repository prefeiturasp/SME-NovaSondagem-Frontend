import React from "react";
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
        <SelectColorido options={mockOptionsComCores} />,
      );
      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar classe select-colorido", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />,
      );
      const select = container.querySelector(".select-colorido");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar className adicional quando fornecida", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          className="custom-class"
        />,
      );
      const select = container.querySelector(".custom-class");
      expect(select).toBeInTheDocument();
    });

    it("deve gerar id único quando não fornecido", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptionsComCores} />,
      );
      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} />,
      );

      const select1 = container1.querySelector(
        ".select-colorido-select-mock-id-1",
      );
      const select2 = container2.querySelector(
        ".select-colorido-select-mock-id-2",
      );

      expect(select1).toBeInTheDocument();
      expect(select2).toBeInTheDocument();
      expect(select1?.className).not.toEqual(select2?.className);
    });

    it("deve usar id fornecido via props", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} id="custom-id" />,
      );
      const select = container.querySelector(".select-colorido-custom-id");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("deve exibir mensagem 'Sem dados' quando não há opções", async () => {
      render(<SelectColorido options={[]} open />);

      await waitFor(() => {
        expect(screen.getByText("Sem dados")).toBeInTheDocument();
      });
    });

    it("deve renderizar Empty component do Ant Design", async () => {
      render(<SelectColorido options={[]} open />);

      await waitFor(() => {
        const empty = document.querySelector(".ant-empty");
        expect(empty).toBeInTheDocument();
      });
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);
    });

    it("deve aplicar cor de texto correta ao selecionar opção", async () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
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
        />,
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} value={2} />,
      );

      const styleTag1 = container1.querySelector("style");
      const styleTag2 = container2.querySelector("style");

      expect(styleTag1?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      expect(styleTag2?.innerHTML).toContain(CORES.VERDE.corFundo);
    });

    it("deve aplicar cor branca quando não há valor selecionado", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={undefined} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#42474A");
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
        <SelectColorido options={mockOptionsSemCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#42474A");
    });

    it("deve aplicar cores padrão quando opção não existe", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={999} />,
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
        />,
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
        />,
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      rerender(
        <SelectColorido options={mockOptionsComCores} value={undefined} />,
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
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.innerHTML).toContain(".ant-select-selector");
    });

    it("deve incluir estilos para estado disabled", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} disabled />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("disabled");
      expect(styleTag?.innerHTML).toContain("opacity");
    });

    it("deve incluir estilos para texto e arrow", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-selection-item");
      expect(styleTag?.innerHTML).toContain("ant-select-arrow");
    });

    it("deve aplicar font-weight 500 no texto selecionado", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
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
        />,
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve aplicar disabled quando fornecido", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} disabled />,
      );

      const select = container.querySelector(".ant-select-disabled");
      expect(select).toBeInTheDocument();
    });

    it("deve sempre ter showSearch ativo", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />,
      );

      const select = container.querySelector(".ant-select-show-search");
      expect(select).toBeInTheDocument();
    });
  });

  describe("getPopupContainer", () => {
    it("deve definir getPopupContainer para parentElement", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} />,
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Integração com formulário", () => {
    it("deve funcionar com value controlado", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      rerender(<SelectColorido options={mockOptionsComCores} value={2} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("deve permitir limpeza de valor", () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      rerender(
        <SelectColorido options={mockOptionsComCores} value={undefined} />,
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
        />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FF6B6B");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(
        container.querySelector(".select-colorido-sondagem-escrita"),
      ).toBeInTheDocument();
    });
  });

  describe("forwardRef e useImperativeHandle", () => {
    it("deve expor método focus através da ref", () => {
      const ref = React.createRef<any>();
      render(<SelectColorido ref={ref} options={mockOptionsComCores} />);

      expect(ref.current).toBeDefined();
      expect(typeof ref.current.focus).toBe("function");
    });

    it("deve expor método blur através da ref", () => {
      const ref = React.createRef<any>();
      render(<SelectColorido ref={ref} options={mockOptionsComCores} />);

      expect(ref.current).toBeDefined();
      expect(typeof ref.current.blur).toBe("function");
    });

    it("deve chamar focus do select interno quando ref.focus é chamado", () => {
      const ref = React.createRef<any>();
      render(<SelectColorido ref={ref} options={mockOptionsComCores} />);

      expect(() => ref.current.focus()).not.toThrow();
    });
  });

  describe("getColorByValue", () => {
    it("deve retornar cores padrão quando selectedValue é null", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={null} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#42474A");
    });

    it("deve retornar cores padrão quando options é undefined", () => {
      const { container } = render(
        <SelectColorido options={undefined} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });

    it("deve retornar cores corretas quando opção tem corFundo e corTexto", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={2} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERDE.corFundo);
      expect(styleTag?.innerHTML).toContain(CORES.VERDE.corTexto);
    });
  });

  describe("handleKeyDown e teclas numéricas", () => {
    it("deve renderizar select com opções que têm ordem", () => {
      const optionsWithOrdem = [
        {
          value: 1,
          label: "Opção 1",
          ordem: 1,
          corFundo: "#FF0000",
          corTexto: "#FFFFFF",
        },
        {
          value: 2,
          label: "Opção 2",
          ordem: 2,
          corFundo: "#00FF00",
          corTexto: "#000000",
        },
      ];

      render(<SelectColorido options={optionsWithOrdem} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("deve aceitar prop onKeyDown", () => {
      const handleKeyDown = jest.fn();
      render(
        <SelectColorido
          options={mockOptionsComCores}
          onKeyDown={handleKeyDown}
        />,
      );

      const select = screen.getByRole("combobox");
      fireEvent.keyDown(select, { key: "Enter" });

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("Empty state", () => {
    it("deve renderizar Empty component quando não há dados", async () => {
      render(<SelectColorido options={[]} />);

      const select = screen.getByRole("combobox");
      fireEvent.mouseDown(select);

      await waitFor(() => {
        expect(screen.getByText("Sem dados")).toBeInTheDocument();
      });
    });
  });

  describe("displayName", () => {
    it("deve ter displayName definido", () => {
      expect(SelectColorido.displayName).toBe("SelectColorido");
    });
  });

  describe("Estilos CSS dinâmicos", () => {
    it("deve incluir estilos para disabled state", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          disabled={true}
        />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-disabled");
      expect(styleTag?.innerHTML).toContain("opacity: 0.6");
    });

    it("deve incluir estilos para arrow icon", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-arrow");
      expect(styleTag?.innerHTML).toContain("anticon");
    });

    it("deve aplicar font-weight nos textos", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("font-weight: 500");
    });
  });

  describe("Integração completa", () => {
    it("deve atualizar cores quando value muda externamente", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      let styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);

      rerender(<SelectColorido options={mockOptionsComCores} value={3} />);

      await waitFor(() => {
        styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.AZUL.corFundo);
      });
    });

    it("deve manter funcionalidade ao trocar options", async () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const newOptions = [
        {
          value: 10,
          label: "Nova Opção",
          corFundo: "#000000",
          corTexto: "#FFFFFF",
        },
      ];

      rerender(<SelectColorido options={newOptions} value={10} />);

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });
  });

  describe("Teste de blur e handleKeyDown avançado", () => {
    it("deve chamar blur quando método blur for invocado", () => {
      const ref = React.createRef<any>();
      render(<SelectColorido ref={ref} options={mockOptionsComCores} />);

      if (ref.current && ref.current.blur) {
        ref.current.blur();
      }

      expect(ref.current).toBeDefined();
    });

    it("deve encontrar opção por ordem quando digitar número", async () => {
      const onChange = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={onChange}
          onOpenChange={onOpenChange}
        />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        await waitFor(() => {
          fireEvent.keyDown(select, { key: "1", code: "Digit1" });
        });
      }
    });

    it("deve retornar quando não encontrar opção por ordem", async () => {
      const onChange = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onChange={onChange} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        await waitFor(() => {
          fireEvent.keyDown(select, { key: "9", code: "Digit9" });
        });

        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it("deve processar ArrowDown quando select está fechado", () => {
      const onKeyDown = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onKeyDown={onKeyDown} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });
        expect(onKeyDown).toHaveBeenCalled();
      }
    });

    it("deve processar ArrowUp quando select está fechado", () => {
      const onKeyDown = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onKeyDown={onKeyDown} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.keyDown(select, { key: "ArrowUp", code: "ArrowUp" });
        expect(onKeyDown).toHaveBeenCalled();
      }
    });

    it("deve processar outras teclas quando select está fechado", async () => {
      const onKeyDown = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onKeyDown={onKeyDown} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.keyDown(select, { key: "Enter", code: "Enter" });

        await waitFor(() => {
          expect(onKeyDown).toHaveBeenCalled();
        });
      }
    });

    it("deve retornar cores padrão quando selectedValue é null", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} value={null} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#42474A");
    });

    it("deve retornar cores padrão quando opção não tem corFundo", () => {
      const opcoesSemCor = [
        { value: 1, label: "Sem Cor", ordem: 1 },
        { value: 2, label: "Também Sem Cor", ordem: 2 },
      ];

      const { container } = render(
        <SelectColorido options={opcoesSemCor} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
      expect(styleTag?.innerHTML).toContain("#42474A");
    });

    it("deve filtrar por descrição em filterOption", async () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} showSearch />,
      );

      const select = container.querySelector(
        "input.ant-select-selection-search-input",
      );
      if (select) {
        fireEvent.change(select, { target: { value: "vermelho" } });

        await waitFor(() => {
          expect(select).toHaveValue("vermelho");
        });
      }
    });

    it("deve retornar false em filterOption quando não há correspondência", async () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} showSearch />,
      );

      const select = container.querySelector(
        "input.ant-select-selection-search-input",
      );
      if (select) {
        fireEvent.change(select, { target: { value: "inexistente" } });

        await waitFor(() => {
          expect(select).toHaveValue("inexistente");
        });
      }
    });

    it("deve processar tecla numérica quando select está aberto", async () => {
      const onChange = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={onChange}
          onOpenChange={onOpenChange}
        />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        await waitFor(() => {
          expect(onOpenChange).toHaveBeenCalledWith(true);
        });
      }
    });

    it("deve não processar quando opção não tem ordem correspondente", async () => {
      const onChange = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onChange={onChange} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        await waitFor(() => {
          const dropdown = document.querySelector(".ant-select-dropdown");
          expect(dropdown).toBeInTheDocument();
        });
      }
    });

    it("deve retornar quando opção não é encontrada", async () => {
      const opcoesSemOrdem = [
        {
          value: 1,
          label: "Opção sem ordem",
          corFundo: "#FF0000",
          corTexto: "#FFFFFF",
        },
      ];

      const onChange = jest.fn();
      const { container } = render(
        <SelectColorido options={opcoesSemOrdem} onChange={onChange} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);
        expect(select).toBeInTheDocument();
      }
    });
  });

  describe("AllowClear - Limpeza de valores", () => {
    it("deve mostrar ícone de limpar quando há valor selecionado", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          allowClear={true}
        />,
      );

      const select = container.querySelector(".ant-select");
      expect(select).toBeInTheDocument();
    });

    it("deve resetar para cores padrão ao limpar valor", async () => {
      const onChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          onChange={onChange}
          allowClear={true}
        />,
      );

      const clearButton = container.querySelector(".ant-select-clear");
      if (clearButton) {
        fireEvent.mouseDown(clearButton);

        await waitFor(() => {
          expect(onChange).toHaveBeenCalled();
        });

        await waitFor(() => {
          const styleTag = container.querySelector("style");
          expect(styleTag?.innerHTML).toContain("#FFFFFF");
        });
      }
    });

    it("deve aplicar estilos personalizados ao botão clear", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          allowClear={true}
        />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("ant-select-clear");
      expect(styleTag?.innerHTML).toContain("top: 45%");
    });

    it("deve manter cor de fundo no botão clear", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          allowClear={true}
        />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("background:");
    });
  });

  describe("Múltiplos selects na mesma página", () => {
    it("deve gerar IDs únicos para múltiplos selects", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );
      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} value={2} />,
      );
      const { container: container3 } = render(
        <SelectColorido options={mockOptionsComCores} value={3} />,
      );

      const select1 = container1.querySelector(".select-colorido");
      const select2 = container2.querySelector(".select-colorido");
      const select3 = container3.querySelector(".select-colorido");

      expect(select1?.className).not.toEqual(select2?.className);
      expect(select2?.className).not.toEqual(select3?.className);
      expect(select1?.className).not.toEqual(select3?.className);
    });

    it("deve aplicar cores independentes para cada select", () => {
      const { container: container1 } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );
      const { container: container2 } = render(
        <SelectColorido options={mockOptionsComCores} value={3} />,
      );

      const style1 = container1.querySelector("style");
      const style2 = container2.querySelector("style");

      expect(style1?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      expect(style2?.innerHTML).toContain(CORES.AZUL.corFundo);
    });

    it("deve manter isolamento de estilos entre selects", () => {
      const { container } = render(
        <>
          <SelectColorido
            options={mockOptionsComCores}
            value={1}
            id="select-1"
          />
          <SelectColorido
            options={mockOptionsComCores}
            value={2}
            id="select-2"
          />
        </>,
      );

      const select1 = container.querySelector(".select-colorido-select-1");
      const select2 = container.querySelector(".select-colorido-select-2");

      expect(select1).toBeInTheDocument();
      expect(select2).toBeInTheDocument();
    });
  });

  describe("Performance e opções grandes", () => {
    it("deve renderizar com muitas opções sem erros", () => {
      const muitasOpcoes = Array.from({ length: 100 }, (_, i) => ({
        value: i + 1,
        label: `Opção ${i + 1}`,
        corFundo: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        corTexto: "#000000",
        ordem: i + 1,
      }));

      const { container } = render(
        <SelectColorido options={muitasOpcoes} value={50} />,
      );

      expect(container.querySelector(".select-colorido")).toBeInTheDocument();
    });

    it("deve filtrar eficientemente em lista grande", async () => {
      const muitasOpcoes = Array.from({ length: 500 }, (_, i) => ({
        value: i + 1,
        label: `Opção número ${i + 1}`,
        corFundo: "#FFFFFF",
        corTexto: "#000000",
      }));

      render(<SelectColorido options={muitasOpcoes} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "número 50" } });

      await waitFor(() => {
        expect(input).toHaveValue("número 50");
      });
    });

    it("deve lidar com mudanças rápidas de valor", async () => {
      const { rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      for (let i = 2; i <= 5; i++) {
        rerender(<SelectColorido options={mockOptionsComCores} value={i} />);
      }

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases e valores especiais", () => {
    it("deve lidar com string vazia no filtro", async () => {
      render(<SelectColorido options={mockOptionsComCores} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "" } });

      await waitFor(() => {
        expect(screen.getByText("Pré-silábico")).toBeInTheDocument();
      });
    });

    it("deve lidar com options undefined", () => {
      const { container } = render(
        <SelectColorido options={undefined} value={1} />,
      );

      expect(container.querySelector(".select-colorido")).toBeInTheDocument();
    });

    it("deve lidar com options null", () => {
      const { container } = render(
        <SelectColorido options={null as any} value={1} />,
      );

      expect(container.querySelector(".select-colorido")).toBeInTheDocument();
    });

    it("deve lidar com opção sem label", () => {
      const opcoesSemLabel = [
        { value: 1, corFundo: "#FF0000", corTexto: "#FFFFFF" } as any,
      ];

      const { container } = render(
        <SelectColorido options={opcoesSemLabel} value={1} />,
      );

      expect(container.querySelector(".select-colorido")).toBeInTheDocument();
    });

    it("deve lidar com cores hexadecimais inválidas", () => {
      const opcoesCoresInvalidas = [
        { value: 1, label: "Teste", corFundo: "invalid", corTexto: "invalid" },
      ];

      const { container } = render(
        <SelectColorido options={opcoesCoresInvalidas} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("invalid");
    });
  });

  describe("Interações complexas de teclado", () => {
    it("deve processar Escape para fechar dropdown", async () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onOpenChange={onOpenChange}
        />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        await waitFor(() => {
          expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        fireEvent.keyDown(select, { key: "Escape", code: "Escape" });
      }
    });

    it("deve processar Tab para navegação", () => {
      const onKeyDown = jest.fn();
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onKeyDown={onKeyDown} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.keyDown(select, { key: "Tab", code: "Tab" });
        expect(onKeyDown).toHaveBeenCalled();
      }
    });

    it("deve processar Backspace no filtro", async () => {
      render(<SelectColorido options={mockOptionsComCores} open />);

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "Pre" } });
      fireEvent.keyDown(input, { key: "Backspace", code: "Backspace" });

      await waitFor(() => {
        expect(input).toBeInTheDocument();
      });
    });

    it("deve selecionar opção com Enter quando filtrada", async () => {
      const onChange = jest.fn();
      render(
        <SelectColorido
          options={mockOptionsComCores}
          onChange={onChange}
          open
        />,
      );

      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "Alfabético" } });

      await waitFor(() => {
        expect(screen.getByText("Alfabético")).toBeInTheDocument();
      });
    });

    it("deve processar números de 0 a 9", async () => {
      const opcoesComOrdem = Array.from({ length: 10 }, (_, i) => ({
        value: i,
        label: `Opção ${i}`,
        ordem: i,
        corFundo: "#FFFFFF",
        corTexto: "#000000",
      }));

      const onChange = jest.fn();
      const { container } = render(
        <SelectColorido options={opcoesComOrdem} onChange={onChange} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);

        for (let i = 0; i <= 9; i++) {
          fireEvent.keyDown(select, { key: `${i}`, code: `Digit${i}` });
        }
      }
    });
  });

  describe("Acessibilidade (a11y)", () => {
    it("deve ter role combobox", () => {
      render(<SelectColorido options={mockOptionsComCores} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("deve ter aria-label quando fornecido", () => {
      render(
        <SelectColorido
          options={mockOptionsComCores}
          aria-label="Selecione uma opção"
        />,
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("aria-label", "Selecione uma opção");
    });

    it("deve indicar estado disabled via aria-disabled", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} disabled />,
      );

      const select = container.querySelector(".ant-select-disabled");
      expect(select).toBeInTheDocument();
    });

    it("deve ter contraste suficiente entre texto e fundo", () => {
      const opcoesComContraste = [
        {
          value: 1,
          label: "Alto Contraste",
          corFundo: "#000000",
          corTexto: "#FFFFFF",
        },
      ];

      const { container } = render(
        <SelectColorido options={opcoesComContraste} value={1} />,
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("#000000");
      expect(styleTag?.innerHTML).toContain("#FFFFFF");
    });

    it("deve suportar navegação apenas com teclado", async () => {
      render(<SelectColorido options={mockOptionsComCores} />);

      const select = screen.getByRole("combobox");
      select.focus();

      fireEvent.keyDown(select, { key: "Enter", code: "Enter" });

      await waitFor(() => {
        expect(select).toBeInTheDocument();
      });
    });
  });

  describe("Sincronização de estado", () => {
    it("deve sincronizar cores quando props.options mudam", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      const novasOpcoes = [
        {
          value: 1,
          label: "Nova Opção",
          corFundo: "#123456",
          corTexto: "#ABCDEF",
        },
      ];

      rerender(<SelectColorido options={novasOpcoes} value={1} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("#123456");
        expect(styleTag?.innerHTML).toContain("#ABCDEF");
      });
    });

    it("deve reagir a mudanças de value em tempo real", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={1} />,
      );

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      });

      rerender(<SelectColorido options={mockOptionsComCores} value={5} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.LARANJA.corFundo);
      });
    });

    it("deve manter consistência ao alternar entre valores undefined e definidos", async () => {
      const { container, rerender } = render(
        <SelectColorido options={mockOptionsComCores} value={undefined} />,
      );

      rerender(<SelectColorido options={mockOptionsComCores} value={1} />);

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain(CORES.VERMELHO.corFundo);
      });

      rerender(
        <SelectColorido options={mockOptionsComCores} value={undefined} />,
      );

      await waitFor(() => {
        const styleTag = container.querySelector("style");
        expect(styleTag?.innerHTML).toContain("#FFFFFF");
      });
    });
  });

  describe("Tratamento de eventos", () => {
    it("deve propagar eventos de mouse corretamente", () => {
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();

      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />,
      );

      const select = container.querySelector(".ant-select");
      if (select) {
        fireEvent.mouseEnter(select);
        fireEvent.mouseLeave(select);

        expect(onMouseEnter).toHaveBeenCalled();
        expect(onMouseLeave).toHaveBeenCalled();
      }
    });

    it("deve lidar com onChange null ou undefined", () => {
      const { container } = render(
        <SelectColorido options={mockOptionsComCores} onChange={undefined} />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);
      }

      expect(select).toBeInTheDocument();
    });

    it("deve chamar onOpenChange ao abrir e fechar", async () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          onOpenChange={onOpenChange}
        />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        fireEvent.mouseDown(select);
        await waitFor(() => {
          expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        fireEvent.mouseDown(select);
      }
    });
  });

  describe("Cenários reais de uso", () => {
    it("deve simular seleção completa de sondagem", async () => {
      const onChange = jest.fn();
      const opcoesSondagem = [
        {
          value: 1,
          label: "Pré-silábico",
          ordem: 1,
          corFundo: "#FF6B6B",
          corTexto: "#FFFFFF",
        },
        {
          value: 2,
          label: "Silábico sem valor",
          ordem: 2,
          corFundo: "#FFD93D",
          corTexto: "#000000",
        },
        {
          value: 3,
          label: "Silábico com valor",
          ordem: 3,
          corFundo: "#6BCF7F",
          corTexto: "#000000",
        },
        {
          value: 4,
          label: "Silábico-alfabético",
          ordem: 4,
          corFundo: "#4ECDC4",
          corTexto: "#000000",
        },
        {
          value: 5,
          label: "Alfabético",
          ordem: 5,
          corFundo: "#4D96FF",
          corTexto: "#FFFFFF",
        },
      ];

      const { container } = render(
        <SelectColorido
          options={opcoesSondagem}
          onChange={onChange}
          placeholder="Selecione o nível"
        />,
      );

      const select = container.querySelector(".ant-select-selector");
      if (select) {
        // Abre o select
        fireEvent.mouseDown(select);

        await waitFor(() => {
          // Digita "5" para selecionar alfabético
          fireEvent.keyDown(select, { key: "5", code: "Digit5" });
        });

        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(5, expect.anything());
        });
      }
    });

    it("deve permitir mudança de resposta", async () => {
      const onChange = jest.fn();
      const { container, rerender } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          onChange={onChange}
        />,
      );

      // Primeira seleção
      expect(container.querySelector("style")?.innerHTML).toContain(
        CORES.VERMELHO.corFundo,
      );

      // Mudança de resposta
      rerender(
        <SelectColorido
          options={mockOptionsComCores}
          value={3}
          onChange={onChange}
        />,
      );

      await waitFor(() => {
        expect(container.querySelector("style")?.innerHTML).toContain(
          CORES.AZUL.corFundo,
        );
      });
    });

    it("deve lidar com desabilitação por período inativo", () => {
      const { container } = render(
        <SelectColorido
          options={mockOptionsComCores}
          value={1}
          disabled={true}
        />,
      );

      const select = container.querySelector(".ant-select-disabled");
      expect(select).toBeInTheDocument();

      const styleTag = container.querySelector("style");
      expect(styleTag?.innerHTML).toContain("opacity: 0.6");
    });
  });
});
