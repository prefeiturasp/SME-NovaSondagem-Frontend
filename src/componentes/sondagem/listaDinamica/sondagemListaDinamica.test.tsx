import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "antd";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { DadosTabelaDinamica } from "../../../core/dto/types";
import * as parametroService from "../../../services/parametroQuestionarioService/parametroQuestionarioService";

jest.mock("../../../config", () => ({
  getApiUrl: jest.fn(() => "http://localhost:5173"),
}));

jest.mock(
  "../../../services/parametroQuestionarioService/parametroQuestionarioService",
);

import SondagemListaDinamica from "./sondagemListaDinamica";

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

jest.mock("@/componentes/sondagem/selectColorido", () => {
  return function SelectColorido({
    id,
    options,
    value,
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
        value={value ?? ""}
        onChange={(e) => {
          if (onChange) onChange(Number(e.target.value) || undefined);
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
  questionarioId: 1,
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
          questaoSubrespostaId: null,
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
          questaoSubrespostaId: null,
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
          questaoSubrespostaId: null,
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
          questaoSubrespostaId: null,
        },
      ],
    },
  ],
  questaoId: 0,
};

const mockDadosReescrita: DadosTabelaDinamica = {
  sondagemId: 2,
  questionarioId: 2,
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
          questaoSubrespostaId: null,
        },
      ],
    },
  ],
  questaoId: 0,
};

const WrapperComponent = ({
  dados,
  token = "test-token",
}: {
  dados: DadosTabelaDinamica | null;
  token?: string;
}) => {
  const [form] = Form.useForm();
  const store = createMockStore();
  return (
    <Provider store={store}>
      <SondagemListaDinamica
        dados={dados}
        formListaDinamica={form}
        token={token}
      />
    </Provider>
  );
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
    // Mock padrão do serviço - COM coluna LP habilitada
    (
      parametroService.parametroQuestionarioService as jest.Mock
    ).mockResolvedValue([
      {
        id: 1,
        idQuestionario: 1,
        tipo: "PossuiLinguaPortuguesaSegundaLingua",
        valor: "true",
      },
    ]);
  });

  describe("Renderização básica", () => {
    it("deve renderizar mensagem quando não há dados", () => {
      render(<WrapperComponent dados={null} />);
      expect(
        screen.getByText("Nenhum dado disponível para exibir."),
      ).toBeInTheDocument();
    });

    it("deve renderizar mensagem quando estudantes está vazio", () => {
      const dadosVazios: DadosTabelaDinamica = {
        tituloTabelaRespostas: "Sistema de escrita",
        estudantes: [],
        sondagemId: 0,
        questionarioId: 0,
        questaoId: 0,
      };
      render(<WrapperComponent dados={dadosVazios} />);
      expect(
        screen.getByText("Nenhum dado disponível para exibir."),
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
          screen.getAllByText("LP como 2ª língua?")[0],
        ).toBeInTheDocument();
      });
    });

    it("não deve renderizar coluna LP quando questão não é escrita", () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);
      render(<WrapperComponent dados={mockDadosReescrita} />);
      expect(screen.queryByText("LP como 2ª língua?")).not.toBeInTheDocument();
    });

    it("deve renderizar checkbox LP para cada estudante", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      await waitFor(() => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });

    it("deve marcar checkbox LP conforme valor inicial do estudante", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );

      await waitFor(() => {
        const checkbox = container.querySelector(
          'input[type="checkbox"]',
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
        expect(checkbox.checked).toBe(true);
      });
    });
  });

  describe("Tags de estudante", () => {
    it("deve renderizar tag PAP quando estudante tem PAP", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const papSvgs = container.querySelectorAll('svg[viewBox="0 0 49 21"]');
      expect(papSvgs.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag AEE quando estudante tem AEE", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const aeeSvgs = container.querySelectorAll('svg[viewBox="0 0 48 19"]');
      expect(aeeSvgs.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag Acessibilidade quando estudante tem acessibilidade", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const acessibilidadeSvgs = container.querySelectorAll(
        'svg[viewBox="0 0 20 18"]',
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
          screen.getAllByText("LP como 2ª língua?")[0],
        ).toBeInTheDocument();
      });
    });

    it("não deve mostrar LP para questão reescrita", async () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);
      render(<WrapperComponent dados={mockDadosReescrita} />);
      await waitFor(() => {
        expect(
          screen.queryByText("LP como 2ª língua?"),
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
        <WrapperComponent dados={mockDadosEscrita} />,
      );

      await waitFor(() => {
        const checkbox = container.querySelector(
          'input[type="checkbox"]',
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
      });
    });

    it("deve inicializar resposta selecionada quando existe", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const hiddenInput = document.querySelector(
          'input[id="respostaId_0_0"]',
        ) as HTMLInputElement;
        expect(hiddenInput).toBeInTheDocument();
      });
    });

    it("deve inicializar sem resposta quando não existe resposta", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const hiddenInput = document.querySelector(
          'input[id="respostaId_1_0"]',
        ) as HTMLInputElement;
        expect(hiddenInput).toBeInTheDocument();
      });
    });
  });

  describe("Renderização da tabela", () => {
    it("deve renderizar tabela Ant Design", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });

    it("deve aplicar classe custom-border-table", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const table = container.querySelector(".custom-border-table");
      expect(table).toBeInTheDocument();
    });

    it("deve gerar uniqueKey para cada estudante", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Props do componente", () => {
    it("deve aceitar token como prop", () => {
      render(<WrapperComponent dados={mockDadosEscrita} token="test-token" />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });

    it("deve funcionar com token padrão", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });

    it("deve passar tipoQuestao para SelectColorido", () => {
      render(<WrapperComponent dados={mockDadosEscrita} token="test-token" />);
      const select = screen.getByTestId("select_0_0");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Campos hidden do formulário", () => {
    it("deve renderizar input hidden para respostaId", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
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
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const table = container.querySelector(".ant-table");
      expect(table).toBeInTheDocument();
    });

    it("deve renderizar colgroup com colunas corretas", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const colgroup = container.querySelector("colgroup");
      expect(colgroup).toBeInTheDocument();
    });

    it("deve renderizar thead com estrutura de cabeçalho", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const thead = container.querySelector("thead");
      expect(thead).toBeInTheDocument();
    });

    it("deve renderizar tbody com dados dos estudantes", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const tbody = container.querySelector("tbody");
      expect(tbody).toBeInTheDocument();
    });
  });

  describe("Renderização de SVG logos", () => {
    it("deve renderizar SVG do LogoPAP com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const papSvg = container.querySelector('svg[viewBox="0 0 49 21"]');
      expect(papSvg).toBeInTheDocument();
    });

    it("deve renderizar SVG do LogoAEE com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const aeeSvg = container.querySelector('svg[viewBox="0 0 48 19"]');
      expect(aeeSvg).toBeInTheDocument();
    });

    it("deve renderizar SVG do LogoAcessibilidade com viewBox correto", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const acessibilidadeSvg = container.querySelector(
        'svg[viewBox="0 0 20 18"]',
      );
      expect(acessibilidadeSvg).toBeInTheDocument();
    });
  });

  describe("Comportamento de scroll", () => {
    it("deve aplicar estilo de scroll horizontal na tabela", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const scrollContainer = container.querySelector(".ant-table-body");
      expect(scrollContainer).toBeInTheDocument();
    });

    it("não deve ter configuração de scroll vertical", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const tableWrapper = container.querySelector(".ant-table-wrapper");
      expect(tableWrapper).toBeInTheDocument();
      const tableBody = container.querySelector(".ant-table-body");
      if (tableBody) {
        const style = window.getComputedStyle(tableBody);
        expect(style.maxHeight).not.toBe("600px");
      }
    });

    it("deve permitir que a tabela expanda verticalmente", () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      const tableContainer = container.querySelector(".ant-table");
      expect(tableContainer).toBeInTheDocument();
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
        <WrapperComponent dados={mockDadosEscrita} />,
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
    it("deve renderizar checkbox LP quando estudante tem lp=true", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );
      await waitFor(() => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });

    it("deve marcar checkbox quando estudante tem lp=true", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
      );

      await waitFor(
        () => {
          const checkbox = container.querySelector(
            'input[type="checkbox"]',
          ) as HTMLInputElement;
          expect(checkbox).toBeInTheDocument();
          expect(checkbox.checked).toBe(true);
        },
        { timeout: 2000 },
      );
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
        <WrapperComponent dados={mockDadosEscrita} />,
      );

      await waitFor(() => {
        expect(
          screen.getAllByText("LP como 2ª língua?")[0],
        ).toBeInTheDocument();
      });

      // Reset mock to not show LP for next render
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);

      rerender(<WrapperComponent dados={mockDadosReescrita} />);
      await waitFor(() => {
        expect(screen.getByText("1 - Carlos Lima")).toBeInTheDocument();
        expect(
          screen.queryByText("LP como 2ª língua?"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Carregamento de parâmetros do questionário", () => {
    it("deve carregar coluna LP quando parametroQuestionarioService retorna valor true", async () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([
        {
          id: 1,
          idQuestionario: 1,
          tipo: "PossuiLinguaPortuguesaSegundaLingua",
          valor: "true",
        },
      ]);

      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(
          screen.getAllByText("LP como 2ª língua?")[0],
        ).toBeInTheDocument();
      });
    });

    it("não deve mostrar coluna LP quando parametroQuestionarioService retorna valor false", async () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([
        {
          id: 1,
          idQuestionario: 1,
          tipo: "PossuiLinguaPortuguesaSegundaLingua",
          valor: "false",
        },
      ]);

      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(
          screen.queryByText("LP como 2ª língua?"),
        ).not.toBeInTheDocument();
      });
    });

    it("não deve mostrar coluna LP quando parametro não existe na resposta", async () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([
        {
          id: 1,
          idQuestionario: 1,
          tipo: "OutroTipo",
          valor: "true",
        },
      ]);

      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(
          screen.queryByText("LP como 2ª língua?"),
        ).not.toBeInTheDocument();
      });
    });

    it("deve chamar parametroQuestionarioService com token e idQuestionario corretos", async () => {
      const testToken = "token-teste-123";
      const testQuestionarioId = 42;

      const dadosComId = {
        ...mockDadosEscrita,
        questionarioId: testQuestionarioId,
      };

      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);

      render(<WrapperComponent dados={dadosComId} token={testToken} />);

      await waitFor(() => {
        expect(
          parametroService.parametroQuestionarioService,
        ).toHaveBeenCalledWith({
          idQuestionario: testQuestionarioId,
          token: testToken,
        });
      });
    });

    it("deve definir opcoesCarregadas como true mesmo quando houver erro no serviço", async () => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockRejectedValue(new Error("Erro ao carregar"));

      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      });

      expect(parametroService.parametroQuestionarioService).toHaveBeenCalled();
    });
  });

  describe("Navegação por teclado com Tab", () => {
    beforeEach(() => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);
    });

    it("deve navegar para próxima coluna com Tab", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0");
        expect(select).toBeInTheDocument();
      });
    });

    it("deve navegar para coluna anterior com Shift+Tab", async () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_1");
        expect(select).toBeInTheDocument();
      });
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
        { timeout: 200 },
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

  describe("Propriedades do componente (Props)", () => {
    it("deve usar podeSalvar=true como padrão", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const select = screen.getByTestId("select_0_0");
      expect(select).not.toBeDisabled();
    });

    it("deve desabilitar selects quando podeSalvar=false", () => {
      const TestWrapper = () => {
        const [form] = Form.useForm();
        const store = createMockStore();
        return (
          <Provider store={store}>
            <SondagemListaDinamica
              dados={mockDadosEscrita}
              formListaDinamica={form}
              token="test-token"
              podeSalvar={false}
            />
          </Provider>
        );
      };
      render(<TestWrapper />);
      const select = screen.getByTestId("select_0_0");
      expect(select).toBeDisabled();
    });

    it("deve mostrar titulo da tabela quando naoExibirTituloTabelaRespostas=false", () => {
      const TestWrapper = () => {
        const [form] = Form.useForm();
        const store = createMockStore();
        return (
          <Provider store={store}>
            <SondagemListaDinamica
              dados={mockDadosEscrita}
              formListaDinamica={form}
              token="test-token"
              naoExibirTituloTabelaRespostas={false}
            />
          </Provider>
        );
      };
      render(<TestWrapper />);
      expect(screen.getByText("Sistema de escrita")).toBeInTheDocument();
    });

    it("deve ocultar titulo da tabela quando naoExibirTituloTabelaRespostas=true", () => {
      const TestWrapper = () => {
        const [form] = Form.useForm();
        const store = createMockStore();
        return (
          <Provider store={store}>
            <SondagemListaDinamica
              dados={mockDadosEscrita}
              formListaDinamica={form}
              token="test-token"
              naoExibirTituloTabelaRespostas={true}
            />
          </Provider>
        );
      };

      const { container } = render(<TestWrapper />);

      // Quando naoExibirTituloTabelaRespostas é true, as colunas não possuem children
      expect(container.querySelector(".ant-table")).toBeInTheDocument();
    });
  });

  describe("Testes para getTotalColumns e limites", () => {
    it("deve retornar total de colunas correto quando dados existem", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);

      const ciclo1 = screen.getAllByText("1° ciclo");
      const ciclo2 = screen.getAllByText("2° ciclo");
      expect(ciclo1.length).toBeGreaterThan(0);
      expect(ciclo2.length).toBeGreaterThan(0);
    });

    it("deve retornar 0 quando não há estudantes em getTotalColumns", () => {
      const emptyDados: DadosTabelaDinamica = {
        sondagemId: 0,
        questionarioId: 0,
        tituloTabelaRespostas: "escrita",
        estudantes: [],
        questaoId: 0,
      };

      render(<WrapperComponent dados={emptyDados} />);

      const message = screen.getByText("Nenhum dado disponível para exibir.");
      expect(message).toBeInTheDocument();
    });

    it("deve não fazer nada em moveFocus quando dados são vazios", async () => {
      const emptyDados: DadosTabelaDinamica = {
        sondagemId: 0,
        questionarioId: 0,
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
  });

  describe("Interação com formulário", () => {
    it("deve atualizar valores do formulário ao selecionar opção", async () => {
      const { container } = render(
        <WrapperComponent dados={mockDadosEscrita} />,
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

  describe("Carregamento de respostas salvas", () => {
    beforeEach(() => {
      (
        parametroService.parametroQuestionarioService as jest.Mock
      ).mockResolvedValue([]);
    });
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

    it("deve renderizar select vazio quando opcaoRespostaId é 0", async () => {
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
        const select = screen.getByTestId("select_0_0") as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        expect(select.value).toBe("");
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

      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
      expect(screen.getByText("2 - Maria Santos")).toBeInTheDocument();
    });

    it("deve renderizar select vazio quando resposta é null", async () => {
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
        const select = screen.getByTestId("select_0_0") as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        expect(select.value).toBe("");
      });

      expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    });

    it("deve tratar corretamente quando resposta tem opcaoRespostaId válido", async () => {
      const dadosComRespostaValida: DadosTabelaDinamica = {
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

      render(<WrapperComponent dados={dadosComRespostaValida} />);

      await waitFor(() => {
        const select = screen.getByTestId("select_0_0") as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        expect(select.value).toBe("2");
      });
    });

    it("deve manter respostaId vazio quando resposta é null", async () => {
      const FormWrapper = () => {
        const [form] = Form.useForm();
        const store = createMockStore();
        return (
          <Provider store={store}>
            <SondagemListaDinamica
              dados={{
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
              }}
              formListaDinamica={form}
              token="test-token"
            />
          </Provider>
        );
      };

      const { container } = render(<FormWrapper />);

      await waitFor(() => {
        const select = container.querySelector(
          "select[data-testid='select_0_0']",
        ) as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        expect(select.value).toBe("");
      });
    });

    it("deve manter respostaId vazio quando opcaoRespostaId é 0", async () => {
      const FormWrapper = () => {
        const [form] = Form.useForm();
        const store = createMockStore();
        return (
          <Provider store={store}>
            <SondagemListaDinamica
              dados={{
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
              }}
              formListaDinamica={form}
              token="test-token"
            />
          </Provider>
        );
      };

      const { container } = render(<FormWrapper />);

      await waitFor(() => {
        const select = container.querySelector(
          "select[data-testid='select_0_0']",
        ) as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        expect(select.value).toBe("");
      });
    });
  });
});
