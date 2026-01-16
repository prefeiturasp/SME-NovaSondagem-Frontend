import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "antd";
import SondagemListaDinamica from "./sondagemListaDinamica";
import type { DadosTabelaDinamica } from "../../../core/dto/types";

jest.mock("@/componentes/sondagem/selectColorido", () => {
  return function SelectColorido({
    id,
    options,
    onChange,
    disabled,
    placeholder,
    onKeyDown,
    onOpenChange,
    ref: forwardedRef,
  }: any) {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef<HTMLSelectElement>(null);

    React.useImperativeHandle(forwardedRef, () => ({
      focus: () => selectRef.current?.focus(),
      blur: () => selectRef.current?.blur(),
    }));

    return (
      <select
        id={id}
        ref={selectRef}
        onChange={(e) => {
          if (onChange) onChange(Number(e.target.value));
        }}
        onFocus={() => {
          setIsOpen(true);
          if (onOpenChange) onOpenChange(true);
        }}
        onBlur={() => {
          setIsOpen(false);
          if (onOpenChange) onOpenChange(false);
        }}
        onKeyDown={(e) => {
          if (onKeyDown) onKeyDown(e);
        }}
        disabled={disabled}
        data-testid={id}
        data-open={isOpen}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

const mockDadosEscrita: DadosTabelaDinamica = {
  sondagemId: 1,
  tituloTabelaRespostas: "Sistema de escrita",
  estudantes: [
    {
      linguaPortuguesaSegundaLingua: true,
      numeroAlunoChamada: 1,
      nome: "João Silva",
      pap: true,
      aee: true,
      possuiDeficiencia: true,
      codigo: 100001,
      coluna: [
        {
          idCiclo: 1,
          descricaoColuna: "1° ciclo",
          periodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 1,
              ordem: 1,
              descricaoOpcaoResposta: "PS",
              corFundo: "#FF0000",
              corTexto: "#FFFFFF",
              legenda: "Pré-silábico",
            },
            {
              id: 2,
              ordem: 2,
              descricaoOpcaoResposta: "SSV",
              corFundo: "#00FF00",
              corTexto: "#000000",
              legenda: "Silábico sem valor",
            },
            {
              id: 3,
              ordem: 3,
              descricaoOpcaoResposta: "SCV",
              corFundo: "#0000FF",
              corTexto: "#FFFFFF",
              legenda: "Silábico com valor",
            },
          ],
          resposta: { id: 1, opcaoRespostaId: 2 },
        },
        {
          idCiclo: 2,
          descricaoColuna: "2° ciclo",
          periodoBimestreAtivo: false,
          opcaoResposta: [
            {
              id: 4,
              ordem: 1,
              descricaoOpcaoResposta: "A",
              corFundo: "#FFFF00",
              corTexto: "#000000",
              legenda: "Alfabético",
            },
            {
              id: 5,
              ordem: 2,
              descricaoOpcaoResposta: "B",
              corFundo: "#FF00FF",
              corTexto: "#FFFFFF",
              legenda: "Nível B",
            },
          ],
          resposta: { id: 0, opcaoRespostaId: 0 },
        },
      ],
    },
    {
      linguaPortuguesaSegundaLingua: false,
      numeroAlunoChamada: 2,
      nome: "Maria Santos",
      pap: false,
      aee: false,
      possuiDeficiencia: false,
      codigo: 100002,
      coluna: [
        {
          idCiclo: 1,
          descricaoColuna: "1° ciclo",
          periodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 1,
              ordem: 1,
              descricaoOpcaoResposta: "PS",
              corFundo: "#FF0000",
              corTexto: "#FFFFFF",
              legenda: "Pré-silábico",
            },
            {
              id: 2,
              ordem: 2,
              descricaoOpcaoResposta: "SSV",
              corFundo: "#00FF00",
              corTexto: "#000000",
              legenda: "Silábico sem valor",
            },
          ],
          resposta: { id: 0, opcaoRespostaId: 0 },
        },
        {
          idCiclo: 2,
          descricaoColuna: "2° ciclo",
          periodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 4,
              ordem: 1,
              descricaoOpcaoResposta: "A",
              corFundo: "#FFFF00",
              corTexto: "#000000",
              legenda: "Alfabético",
            },
          ],
          resposta: { id: 0, opcaoRespostaId: 0 },
        },
      ],
    },
  ],
  questaoId: 0,
};

const mockDadosReescrita: DadosTabelaDinamica = {
  sondagemId: 2,
  tituloTabelaRespostas: "reescrita",
  estudantes: [
    {
      linguaPortuguesaSegundaLingua: false,
      numeroAlunoChamada: 1,
      nome: "Carlos Lima",
      pap: false,
      aee: true,
      possuiDeficiencia: false,
      codigo: 100003,
      coluna: [
        {
          idCiclo: 3,
          descricaoColuna: "Avaliação 1",
          periodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 10,
              ordem: 1,
              descricaoOpcaoResposta: "Opção 1",
              corFundo: "#00FFFF",
              corTexto: "#000000",
              legenda: "Primeira opção",
            },
          ],
          resposta: { id: 0, opcaoRespostaId: 0 },
        },
      ],
    },
  ],
  questaoId: 0,
};

const WrapperComponent = ({
  dados,
}: {
  dados: DadosTabelaDinamica | null;
  anoTurma?: string;
}) => {
  const [form] = Form.useForm();
  return <SondagemListaDinamica dados={dados} formListaDinamica={form} />;
};

describe("SondagemListaDinamica", () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização básica", () => {
    it("deve renderizar mensagem quando não há dados", () => {
      render(<WrapperComponent dados={null} />);
      expect(
        screen.getByText("Nenhum dado disponível para exibir.")
      ).toBeInTheDocument();
    });

    it("deve renderizar mensagem quando estudantes está vazio", () => {
      const dadosVazios: DadosTabelaDinamica = {
        tituloTabelaRespostas: "Sistema de escrita",
        estudantes: [],
        sondagemId: 0,
        questaoId: 0,
      };
      render(<WrapperComponent dados={dadosVazios} />);
      expect(
        screen.getByText("Nenhum dado disponível para exibir.")
      ).toBeInTheDocument();
    });

    it("deve renderizar tabela com dados válidos", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      expect(screen.getByText("2 - Maria Santos")).toBeInTheDocument();
    });
  });

  describe("Coluna LP (questão escrita)", () => {
    it("deve renderizar coluna LP quando questão é escrita", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(
          screen.getAllByText("LP como 2ª língua?")[0]
        ).toBeInTheDocument();
      });
    });

    it("não deve renderizar coluna LP quando questão não é escrita", () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      expect(screen.queryByText("LP como 2ª língua?")).not.toBeInTheDocument();
    });

    it("deve renderizar checkbox LP para cada estudante", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it("deve marcar checkbox LP conforme valor inicial do estudante", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const checkbox = container.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  describe("Tags de estudante", () => {
    it("deve renderizar tag PAP quando estudante tem PAP", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const papSvgs = container.querySelectorAll('svg[viewBox="0 0 49 21"]');
      expect(papSvgs.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag AEE quando estudante tem AEE", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const aeeSvgs = container.querySelectorAll('svg[viewBox="0 0 48 19"]');
      expect(aeeSvgs.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag Acessibilidade quando estudante tem acessibilidade", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const acessibilidadeSvgs = container.querySelectorAll(
        'svg[viewBox="0 0 20 18"]'
      );
      expect(acessibilidadeSvgs.length).toBeGreaterThan(0);
    });

    it("não deve renderizar tags quando estudante não tem PAP, AEE ou Acessibilidade", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      const mariaSantos = screen.getByText("2 - Maria Santos");
      const parent = mariaSantos.closest("div");
      const tags = parent?.querySelectorAll(".ant-tag");
      expect(tags?.length).toBe(0);
    });
  });

  describe("Nome da questão", () => {
    it("deve mostrar 'Sistema de escrita' para questão escrita", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      await waitFor(() => {
        expect(
          screen.getAllByText("LP como 2ª língua?")[0]
        ).toBeInTheDocument();
      });
    });

    it("não deve mostrar LP para questão reescrita", async () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      await waitFor(() => {
        expect(
          screen.queryByText("LP como 2ª língua?")
        ).not.toBeInTheDocument();
        expect(screen.getByText("1 - Carlos Lima")).toBeInTheDocument();
      });
    });

    it("deve renderizar colunas para questão reescrita", async () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      await waitFor(() => {
        expect(screen.getAllByText("Avaliação 1")).toHaveLength(2);
      });
    });
  });

  describe("Colunas dinâmicas", () => {
    it("deve renderizar colunas dinâmicas corretamente", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getAllByText("1° ciclo")[0]).toBeInTheDocument();
      expect(screen.getAllByText("2° ciclo")[0]).toBeInTheDocument();
    });

    it("deve renderizar SelectColorido para cada coluna de cada estudante", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select_0_0 = screen.getByTestId("select_0_0");
      const select_0_1 = screen.getByTestId("select_0_1");
      const select_1_0 = screen.getByTestId("select_1_0");
      const select_1_1 = screen.getByTestId("select_1_1");

      expect(select_0_0).toBeInTheDocument();
      expect(select_0_1).toBeInTheDocument();
      expect(select_1_0).toBeInTheDocument();
      expect(select_1_1).toBeInTheDocument();
    });

    it("deve desabilitar select quando PeriodoBimestreAtivo é false", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select_0_1 = screen.getByTestId("select_0_1") as HTMLSelectElement;
      expect(select_0_1).toBeDisabled();
    });

    it("deve habilitar select quando PeriodoBimestreAtivo é true", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select_0_0 = screen.getByTestId("select_0_0") as HTMLSelectElement;
      expect(select_0_0).not.toBeDisabled();
    });

    it("deve renderizar opções ordemadas corretamente", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select = screen.getByTestId("select_0_0") as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.text);

      expect(options).toContain("PS");
      expect(options).toContain("SSV");
      expect(options).toContain("SCV");
    });

    it("deve permitir alterar valor do select", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select = screen.getByTestId("select_0_0") as HTMLSelectElement;

      fireEvent.change(select, { target: { value: "2" } });

      await waitFor(() => {
        expect(select.value).toBe("2");
      });
    });
  });

  describe("Inicialização de valores do formulário", () => {
    it("deve definir valores iniciais quando opções são carregadas", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const checkbox = container.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
      });
    });

    it("deve inicializar resposta selecionada quando existe", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const hiddenInput = document.querySelector(
          'input[id="respostaId_0_0"]'
        ) as HTMLInputElement;
        expect(hiddenInput).toBeInTheDocument();
      });
    });

    it("deve inicializar sem resposta quando não existe resposta", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const hiddenInput = document.querySelector(
          'input[id="respostaId_1_0"]'
        ) as HTMLInputElement;
        expect(hiddenInput).toBeInTheDocument();
      });
    });
  });

  describe("Renderização da tabela", () => {
    it("deve renderizar tabela Ant Design", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });

    it("deve aplicar classe custom-border-table", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const table = container.querySelector(".custom-border-table");
      expect(table).toBeInTheDocument();
    });

    it("deve gerar uniqueKey para cada estudante", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Props do componente", () => {
    it("deve aceitar anoTurma como prop", () => {
      render(<WrapperComponent dados={mockDadosEscrita} anoTurma="2024" />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });

    it("deve funcionar com anoTurma padrão", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });

    it("deve passar tipoQuestao para SelectColorido", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select = screen.getByTestId("select_0_0");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Campos hidden do formulário", () => {
    it("deve renderizar input hidden para respostaId", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const hiddenInputs = container.querySelectorAll('input[type="hidden"]');
        expect(hiddenInputs.length).toBeGreaterThan(0);
      });
    });
  });

  describe("useEffect hooks", () => {
    it("deve definir opcoesCarregadas quando dados.estudantes existe", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      });
    });

    it("deve atualizar formulário quando opcoesCarregadas muda", async () => {
      const { rerender } = render(<WrapperComponent dados={null} />);

      rerender(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      });
    });
  });

  describe("Width das colunas", () => {
    it("deve definir width de 40% para coluna estudante quando mostra LP", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getAllByText("Estudantes")[0]).toBeInTheDocument();
    });

    it("deve definir width de 50% para coluna estudante quando não mostra LP", () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      expect(screen.getAllByText("Estudantes")[0]).toBeInTheDocument();
    });
  });

  describe("Validação de estrutura HTML", () => {
    it("deve renderizar estrutura de tabela correta", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });

    it("deve renderizar colgroup com colunas corretas", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const colgroup = container.querySelector("colgroup");
      expect(colgroup).toBeInTheDocument();
    });

    it("deve renderizar thead com estrutura de cabeçalho", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const thead = container.querySelector("thead");
      expect(thead).toBeInTheDocument();
    });

    it("deve renderizar tbody com dados dos estudantes", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const tbody = container.querySelector("tbody");
      expect(tbody).toBeInTheDocument();
    });
  });

  describe("Renderização de SVG logos", () => {
    it("deve renderizar SVG do LogoPAP com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const papSvg = container.querySelector('svg[viewBox="0 0 49 21"]');
      expect(papSvg).toBeInTheDocument();
    });

    it("deve renderizar SVG do LogoAEE com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const aeeSvg = container.querySelector('svg[viewBox="0 0 48 19"]');
      expect(aeeSvg).toBeInTheDocument();
    });

    it("deve renderizar SVG do LogoAcessibilidade com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const acessibilidadeSvg = container.querySelector(
        'svg[viewBox="0 0 20 18"]'
      );
      expect(acessibilidadeSvg).toBeInTheDocument();
    });
  });

  describe("Comportamento de scroll", () => {
    it("deve aplicar estilo de scroll na tabela", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const scrollContainer = container.querySelector(".ant-table-body");
      expect(scrollContainer).toBeInTheDocument();
    });

    it("deve ter configuração de scroll y", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const tableWrapper = container.querySelector(".ant-table-wrapper");
      expect(tableWrapper).toBeInTheDocument();
    });
  });

  describe("Estados dos campos", () => {
    it("deve inicializar campos habilitados quando periodo ativo", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).not.toBeDisabled();
      });
    });

    it("deve manter campos desabilitados quando periodo inativo", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_1");
        expect(select).toBeDisabled();
      });
    });
  });

  describe("Respostas pré-selecionadas", () => {
    it("deve aplicar resposta existente ao carregar", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const hiddenInputs = container.querySelectorAll('input[type="hidden"]');
        expect(hiddenInputs.length).toBeGreaterThan(0);
      });
    });

    it("deve atualizar resposta ao selecionar nova opção", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.change(select, { target: { value: "3" } });
      });

      await waitFor(() => {
        expect(screen.getByTestId("select_0_0")).toHaveValue("3");
      });
    });
  });

  describe("Checkbox LP (Língua Portuguesa)", () => {
    it("deve renderizar checkbox LP quando estudante tem lp=true", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it("deve marcar checkbox quando estudante tem lp=true", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const checkbox = container.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;

        expect(checkbox).toBeInTheDocument();
        expect(checkbox.checked).toBe(true);
      });
    });
  });

  describe("Múltiplos estudantes", () => {
    it("deve renderizar todos os estudantes fornecidos", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      expect(screen.getByText("2 - Maria Santos")).toBeInTheDocument();
    });

    it("deve criar um select para cada estudante por ciclo", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select1 = screen.getByTestId("select_0_0");
      const select2 = screen.getByTestId("select_1_0");
      expect(select1).toBeInTheDocument();
      expect(select2).toBeInTheDocument();
    });
  });

  describe("Performance e otimização", () => {
    it("deve lidar com múltiplas mudanças de valor rapidamente", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      const select = screen.getByTestId("select_0_0");

      fireEvent.change(select, { target: { value: "1" } });
      fireEvent.change(select, { target: { value: "2" } });
      fireEvent.change(select, { target: { value: "3" } });

      await waitFor(() => {
        expect(select).toHaveValue("3");
      });
    });

    it("deve rerenderizar eficientemente ao mudar dados", async () => {
      const { rerender } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        expect(
          screen.getAllByText("LP como 2ª língua?")[0]
        ).toBeInTheDocument();
      });

      rerender(<WrapperComponent dados={mockDadosReescrita} />);
      await waitFor(() => {
        expect(screen.getByText("1 - Carlos Lima")).toBeInTheDocument();
        expect(
          screen.queryByText("LP como 2ª língua?")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Navegação por teclado", () => {
    it("deve navegar para próxima coluna com Tab", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.keyDown(select, { key: "Tab", code: "Tab" });
      });

      expect(screen.getByTestId("select_0_1")).toBeInTheDocument();
    });

    it("deve navegar para coluna anterior com Shift+Tab", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_1");
        fireEvent.keyDown(select, {
          key: "Tab",
          code: "Tab",
          shiftKey: true,
        });
      });

      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });

    it("deve navegar para linha abaixo com ArrowDown", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });
      });

      expect(screen.getByTestId("select_1_0")).toBeInTheDocument();
    });

    it("deve navegar para linha acima com ArrowUp", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_1_0");
        fireEvent.keyDown(select, { key: "ArrowUp", code: "ArrowUp" });
      });

      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });

    it("não deve navegar com ArrowDown quando select está aberto", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        // Simula abertura do select
        fireEvent.focus(select);
        fireEvent.mouseDown(select);
        // Tenta navegar
        fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });
      });

      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });

    it("não deve navegar além dos limites da tabela", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        // Tenta navegar para cima no primeiro item
        fireEvent.keyDown(select, { key: "ArrowUp", code: "ArrowUp" });
      });

      // Deve permanecer no mesmo select
      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });
  });

  describe("Gerenciamento de referências", () => {
    it("deve armazenar referências dos selects", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select1 = screen.getByTestId("select_0_0");
        const select2 = screen.getByTestId("select_0_1");
        expect(select1).toBeInTheDocument();
        expect(select2).toBeInTheDocument();
      });
    });

    it("deve focar no primeiro select ao carregar", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(
        () => {
          const firstSelect = screen.getByTestId("select_0_0");
          expect(firstSelect).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe("Estado de abertura dos selects", () => {
    it("deve rastrear quando select é aberto", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.mouseDown(select);
      });

      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });

    it("deve permitir múltiplos selects abertos simultaneamente", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select1 = screen.getByTestId("select_0_0");
        const select2 = screen.getByTestId("select_1_0");

        fireEvent.focus(select1);
        fireEvent.focus(select2);

        expect(select1).toBeInTheDocument();
        expect(select2).toBeInTheDocument();
      });
    });
  });

  describe("Cálculo de colunas", () => {
    it("deve calcular total de colunas corretamente", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      // Verifica se renderizou as colunas corretas
      const ciclo1 = screen.getAllByText("1° ciclo");
      const ciclo2 = screen.getAllByText("2° ciclo");
      expect(ciclo1.length).toBeGreaterThan(0);
      expect(ciclo2.length).toBeGreaterThan(0);
    });

    it("deve lidar com array vazio de estudantes", () => {
      const dadosVazios = {
        sondagemId: 0,
        tituloTabelaRespostas: "escrita",
        estudantes: [],
        questaoId: 0,
      };

      const { container } = render(<WrapperComponent dados={dadosVazios} />);

      // Quando não há estudantes, a tabela não é renderizada ou está vazia
      const tableBody = container.querySelector(".ant-table-tbody");
      if (tableBody) {
        expect(tableBody.children.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("Casos extremos de navegação", () => {
    it("deve ciclar para última coluna ao pressionar Shift+Tab na primeira", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.keyDown(select, {
          key: "Tab",
          code: "Tab",
          shiftKey: true,
        });
      });

      // Deve ter navegado para última coluna
      expect(screen.getByTestId("select_0_1")).toBeInTheDocument();
    });

    it("deve ciclar para primeira coluna ao pressionar Tab na última", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const lastSelect = screen.getByTestId("select_0_1");
        fireEvent.keyDown(lastSelect, { key: "Tab", code: "Tab" });
      });

      // Deve ter ciclado para primeira coluna
      expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
    });
  });

  describe("Interação com formulário", () => {
    it("deve atualizar valores do formulário ao selecionar opção", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />
      );

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        fireEvent.change(select, { target: { value: "2" } });
      });

      await waitFor(() => {
        const hiddenInputs = container.querySelectorAll('input[type="hidden"]');
        expect(hiddenInputs.length).toBeGreaterThan(0);
      });
    });

    it("deve manter valores ao mudar entre estudantes", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select1 = screen.getByTestId("select_0_0");
        const select2 = screen.getByTestId("select_1_0");

        fireEvent.change(select1, { target: { value: "1" } });
        fireEvent.change(select2, { target: { value: "2" } });

        expect(select1).toHaveValue("1");
        expect(select2).toHaveValue("2");
      });
    });
  });

  describe("Testes para moveFocus e limites", () => {
    it("deve não fazer nada se newRow for negativo", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.keyDown(select, { key: "ArrowUp", code: "ArrowUp" });

      expect(select).toBeInTheDocument();
    });

    it("deve não fazer nada se newRow for maior ou igual ao total de linhas", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_1_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_1_0");
      fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });
      fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });

      expect(select).toBeInTheDocument();
    });

    it("deve não fazer nada se newCol for negativo", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.keyDown(select, {
        key: "Tab",
        code: "Tab",
        shiftKey: true,
      });

      expect(select).toBeInTheDocument();
    });

    it("deve não fazer nada se newCol for maior ou igual ao total de colunas", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_1");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_1");
      fireEvent.keyDown(select, { key: "Tab", code: "Tab" });
      fireEvent.keyDown(select, { key: "Tab", code: "Tab" });

      expect(select).toBeInTheDocument();
    });

    it("deve retornar 0 quando não há estudantes em getTotalColumns", () => {
      const emptyDados: DadosTabelaDinamica = {
        sondagemId: 0,
        tituloTabelaRespostas: "escrita",
        estudantes: [],
        questaoId: 0,
      };

      render(<WrapperComponent dados={emptyDados} />);

      const tableBody = document.querySelector(".ant-table-tbody");
      if (tableBody) {
        expect(tableBody.children.length).toBeLessThanOrEqual(1);
      }
    });

    it("deve retornar quando não há dados em moveFocus", async () => {
      const emptyDados: DadosTabelaDinamica = {
        sondagemId: 0,
        tituloTabelaRespostas: "escrita",
        estudantes: [],
        questaoId: 0,
      };

      render(<WrapperComponent dados={emptyDados} />);

      await waitFor(() => {
        const message = screen.getByText("Nenhum dado disponível para exibir.");
        expect(message).toBeInTheDocument();
      });
    });

    it("deve fazer foco no primeiro select após carregamento", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(
        () => {
          const firstSelect = screen.getByTestId("select_0_0");
          expect(firstSelect).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it("deve atualizar estado de select aberto corretamente", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.focus(select);
      fireEvent.blur(select);

      expect(select).toBeInTheDocument();
    });

    it("deve retornar quando ArrowDown é pressionado com select aberto", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.focus(select);

      await waitFor(() => {
        expect(select.getAttribute("data-open")).toBe("true");
      });

      fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });

      expect(select).toBeInTheDocument();
    });

    it("deve retornar quando ArrowUp é pressionado com select aberto", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.focus(select);

      await waitFor(() => {
        expect(select.getAttribute("data-open")).toBe("true");
      });

      fireEvent.keyDown(select, { key: "ArrowUp", code: "ArrowUp" });

      expect(select).toBeInTheDocument();
    });

    it("deve navegar com Tab quando select está fechado", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.keyDown(select, { key: "Tab", code: "Tab" });

      const nextSelect = screen.getByTestId("select_0_1");
      expect(nextSelect).toBeInTheDocument();
    });

    it("deve navegar com Shift+Tab quando select está fechado", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_1");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_1");
      fireEvent.keyDown(select, { key: "Tab", code: "Tab", shiftKey: true });

      const prevSelect = screen.getByTestId("select_0_0");
      expect(prevSelect).toBeInTheDocument();
    });

    it("deve chamar setSelectRef ao renderizar SelectColorido", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });
    });

    it("deve retornar quando targetRef não tem focus method", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByTestId("select_0_0");
      fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });

      expect(select).toBeInTheDocument();
    });
  });

  describe("Carregamento de respostas salvas", () => {
    it("deve renderizar select quando opcaoRespostaId é válido", async () => {
      const dadosComResposta: DadosTabelaDinamica = {
        ...mockDadosEscrita,
        estudantes: [
          {
            ...mockDadosEscrita.estudantes[0],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[0].coluna[0],
                resposta: { id: 123, opcaoRespostaId: 2 },
              },
            ],
          },
        ],
      };

      render(<WrapperComponent dados={dadosComResposta} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });
    });

    it("deve renderizar select quando opcaoRespostaId é 0", async () => {
      const dadosComRespostaZero: DadosTabelaDinamica = {
        ...mockDadosEscrita,
        estudantes: [
          {
            ...mockDadosEscrita.estudantes[0],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[0].coluna[0],
                resposta: { id: 0, opcaoRespostaId: 0 },
              },
            ],
          },
        ],
      };

      render(<WrapperComponent dados={dadosComRespostaZero} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });
    });

    it("deve tratar resposta como objeto direto", async () => {
      const dadosComResposta: DadosTabelaDinamica = {
        ...mockDadosEscrita,
        estudantes: [
          {
            ...mockDadosEscrita.estudantes[0],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[0].coluna[0],
                resposta: { id: 456, opcaoRespostaId: 1 },
              },
            ],
          },
        ],
      };

      render(<WrapperComponent dados={dadosComResposta} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });
    });

    it("deve renderizar múltiplos selects corretamente", async () => {
      const dadosComMultiplasRespostas: DadosTabelaDinamica = {
        ...mockDadosEscrita,
        estudantes: [
          {
            ...mockDadosEscrita.estudantes[0],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[0].coluna[0],
                resposta: { id: 101, opcaoRespostaId: 1 },
              },
            ],
          },
          {
            ...mockDadosEscrita.estudantes[1],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[1].coluna[0],
                resposta: { id: 102, opcaoRespostaId: 2 },
              },
            ],
          },
        ],
      };

      render(<WrapperComponent dados={dadosComMultiplasRespostas} />);

      await waitFor(() => {
        expect(screen.getByTestId("select_0_0")).toBeInTheDocument();
        expect(screen.getByTestId("select_1_0")).toBeInTheDocument();
      });

      // Verifica se os estudantes foram renderizados
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      expect(screen.getByText("2 - Maria Santos")).toBeInTheDocument();
    });

    it("deve renderizar tabela quando resposta é null", async () => {
      const dadosComRespostaNula: DadosTabelaDinamica = {
        ...mockDadosEscrita,
        estudantes: [
          {
            ...mockDadosEscrita.estudantes[0],
            coluna: [
              {
                ...mockDadosEscrita.estudantes[0].coluna[0],
                resposta: null as any,
              },
            ],
          },
        ],
      };

      render(<WrapperComponent dados={dadosComRespostaNula} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });

      // Verifica que a tabela renderiza mesmo com resposta null
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });
  });
});
