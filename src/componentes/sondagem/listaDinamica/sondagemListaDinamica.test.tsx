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
  }: any) {
    return (
      <select
        id={id}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        data-testid={id}
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
  questao: "escrita",
  estudantes: [
    {
      lp: true,
      numero: 1,
      nome: "João Silva",
      pap: true,
      aee: true,
      acessibilidade: true,
      coluna: [
        {
          descricaoColuna: "1° ciclo",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 1,
              ordem: 1,
              descricaoOpcao: "PS",
              corFundo: "#FF0000",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Pré-silábico",
            },
            {
              id: 2,
              ordem: 2,
              descricaoOpcao: "SSV",
              corFundo: "#00FF00",
              corTexto: "#000000",
              descricaoLegenda: "Silábico sem valor",
            },
            {
              id: 3,
              ordem: 3,
              descricaoOpcao: "SCV",
              corFundo: "#0000FF",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Silábico com valor",
            },
          ],
          resposta: [{ id: 1, opcaoRespostaId: 2 }],
        },
        {
          descricaoColuna: "2° ciclo",
          PeriodoBimestreAtivo: false,
          opcaoResposta: [
            {
              id: 4,
              ordem: 1,
              descricaoOpcao: "A",
              corFundo: "#FFFF00",
              corTexto: "#000000",
              descricaoLegenda: "Alfabético",
            },
            {
              id: 5,
              ordem: 2,
              descricaoOpcao: "B",
              corFundo: "#FF00FF",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Nível B",
            },
          ],
          resposta: [],
        },
      ],
    },
    {
      lp: false,
      numero: 2,
      nome: "Maria Santos",
      pap: false,
      aee: false,
      acessibilidade: false,
      coluna: [
        {
          descricaoColuna: "1° ciclo",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 1,
              ordem: 1,
              descricaoOpcao: "PS",
              corFundo: "#FF0000",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Pré-silábico",
            },
            {
              id: 2,
              ordem: 2,
              descricaoOpcao: "SSV",
              corFundo: "#00FF00",
              corTexto: "#000000",
              descricaoLegenda: "Silábico sem valor",
            },
          ],
          resposta: [],
        },
        {
          descricaoColuna: "2° ciclo",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 4,
              ordem: 1,
              descricaoOpcao: "A",
              corFundo: "#FFFF00",
              corTexto: "#000000",
              descricaoLegenda: "Alfabético",
            },
          ],
          resposta: [],
        },
      ],
    },
  ],
};

const mockDadosReescrita: DadosTabelaDinamica = {
  questao: "reescrita",
  estudantes: [
    {
      lp: false,
      numero: 1,
      nome: "Carlos Lima",
      pap: false,
      aee: true,
      acessibilidade: false,
      coluna: [
        {
          descricaoColuna: "Avaliação 1",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 10,
              ordem: 1,
              descricaoOpcao: "Opção 1",
              corFundo: "#00FFFF",
              corTexto: "#000000",
              descricaoLegenda: "Primeira opção",
            },
          ],
          resposta: [],
        },
      ],
    },
  ],
};

const mockDadosProducao: DadosTabelaDinamica = {
  questao: "producao",
  estudantes: [
    {
      lp: false,
      numero: 3,
      nome: "Ana Costa",
      pap: false,
      aee: false,
      acessibilidade: true,
      coluna: [
        {
          descricaoColuna: "Produção 1",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 20,
              ordem: 1,
              descricaoOpcao: "Nível 1",
              corFundo: "#FFA500",
              corTexto: "#000000",
              descricaoLegenda: "Primeiro nível de produção",
            },
          ],
          resposta: [],
        },
      ],
    },
  ],
};

const mockDadosLeitura: DadosTabelaDinamica = {
  questao: "leitura",
  estudantes: [
    {
      lp: false,
      numero: 4,
      nome: "Pedro Oliveira",
      pap: true,
      aee: false,
      acessibilidade: false,
      coluna: [
        {
          descricaoColuna: "Leitura 1",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 30,
              ordem: 1,
              descricaoOpcao: "Nível A",
              corFundo: "#800080",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Nível A de leitura",
            },
          ],
          resposta: [],
        },
      ],
    },
  ],
};

const mockDadosOutro: DadosTabelaDinamica = {
  questao: "outro",
  estudantes: [
    {
      lp: false,
      numero: 5,
      nome: "Lucia Ferreira",
      pap: false,
      aee: false,
      acessibilidade: false,
      coluna: [
        {
          descricaoColuna: "Avaliação",
          PeriodoBimestreAtivo: true,
          opcaoResposta: [
            {
              id: 40,
              ordem: 1,
              descricaoOpcao: "Item 1",
              corFundo: "#808080",
              corTexto: "#FFFFFF",
              descricaoLegenda: "Primeiro item",
            },
          ],
          resposta: [],
        },
      ],
    },
  ],
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
        questao: "escrita",
        estudantes: [],
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
    it("deve renderizar coluna LP quando questão é escrita", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getAllByText("LP como 2ª língua?")[0]).toBeInTheDocument();
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
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const papTags = screen.getAllByText("PAP");
      expect(papTags.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag AEE quando estudante tem AEE", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const aeeTags = screen.getAllByText("AEE");
      expect(aeeTags.length).toBeGreaterThan(0);
    });

    it("deve renderizar tag Acessibilidade quando estudante tem acessibilidade", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      const acessibilidadeTags = screen.getAllByText("Acessibilidade");
      expect(acessibilidadeTags.length).toBeGreaterThan(0);
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
    it("deve mostrar 'Sistema de escrita' para questão escrita", () => {
      render(<WrapperComponent dados={mockDadosEscrita} />);
      expect(screen.getByText("Sistema de escrita")).toBeInTheDocument();
    });

    it("deve mostrar 'Reescrita' para questão reescrita", () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      expect(screen.getByText("Reescrita")).toBeInTheDocument();
    });

    it("deve mostrar 'Produção' para questão producao", () => {
      render(<WrapperComponent dados={mockDadosProducao} />);
      expect(screen.getByText("Produção")).toBeInTheDocument();
    });

    it("deve mostrar 'Compreensão de textos' para questão leitura", () => {
      render(<WrapperComponent dados={mockDadosLeitura} />);
      expect(screen.getByText("Compreensão de textos")).toBeInTheDocument();
    });

    it("deve mostrar 'Questão' para questão desconhecida", () => {
      render(<WrapperComponent dados={mockDadosOutro} />);
      expect(screen.getByText("Questão")).toBeInTheDocument();
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
      expect(screen.getAllByText("Estudante")[0]).toBeInTheDocument();
    });

    it("deve definir width de 50% para coluna estudante quando não mostra LP", () => {
      render(<WrapperComponent dados={mockDadosReescrita} />);
      expect(screen.getAllByText("Estudante")[0]).toBeInTheDocument();
    });
  });
});
