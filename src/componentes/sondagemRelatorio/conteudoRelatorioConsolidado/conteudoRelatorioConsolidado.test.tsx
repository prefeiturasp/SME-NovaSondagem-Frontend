import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { notification } from "antd";
import ConteudoRelatorioConsolidado from "./conteudoRelatorioConsolidado";
import RelatorioConsolidadoExportService from "../../../services/relatorioExportService/RelatorioConsolidadoExportService";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    notification: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

const mockReset = jest.fn();
let mockFiltroProps: any;

jest.mock("../filtroRelatorioConsolidado/filtroRelatorioConsolidado", () => {
  const ReactLib = require("react");
  return ReactLib.forwardRef((props: any, ref: any) => {
    mockFiltroProps = props;
    ReactLib.useImperativeHandle(ref, () => ({
      reset: mockReset,
    }));
    return <div data-testid="filtro-consolidado-mock" />;
  });
});

jest.mock(
  "../tabelaRelatorioConsolidado/tabelaRelatorioConsolidado",
  () =>
    function TabelaMock({ dados }: any) {
      return (
        <div data-testid="tabela-mock">{dados ? "com-dados" : "sem-dados"}</div>
      );
    },
);

jest.mock(
  "../tabelaRelatorioConsolidadoPorBimestres/tabelaRelatorioConsolidadoPorBimestres",
  () =>
    function TabelaBimestresMock({ dados }: any) {
      return (
        <div data-testid="tabela-bimestres-mock">
          {dados ? "com-dados-bimestres" : "sem-dados-bimestres"}
        </div>
      );
    },
);

jest.mock(
  "../tabelaRelatorioConsolidadoPorRacaGenero/tabelaRelatorioConsolidadoPorRacaGenero",
  () =>
    function TabelaRacaGeneroMock({ dados }: any) {
      return (
        <div data-testid="tabela-raca-genero-mock">
          {dados ? "com-dados-raca-genero" : "sem-dados-raca-genero"}
        </div>
      );
    },
);

jest.mock(
  "../cabecalhoRelatorioAcoes/cabecalhoRelatorioAcoes",
  () =>
    function CabecalhoMock(props: any) {
      return (
        <div>
          <button
            type="button"
            data-testid="acao-gerar"
            onClick={() => props.onGerar("pdf")}
          >
            Gerar
          </button>
          <button
            type="button"
            data-testid="acao-cancelar"
            onClick={props.onCancelar}
          >
            Cancelar
          </button>
        </div>
      );
    },
);

jest.mock(
  "../../../services/relatorioExportService/RelatorioConsolidadoExportService",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

describe("ConteudoRelatorioConsolidado", () => {
  const { useSelector } = require("react-redux");

  beforeEach(() => {
    jest.clearAllMocks();
    mockReset.mockClear();
    useSelector.mockReturnValue({ token: "token-teste" });
  });

  it("deve renderizar instrução e estado inicial sem dados", () => {
    render(<ConteudoRelatorioConsolidado />);

    expect(
      screen.getByText(
        "Preencha os campos para conferir as informações das turmas e estudantes da Unidade Educacional selecionada.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tabela-mock")).toHaveTextContent("sem-dados");
  });

  it("deve gerar relatório com sucesso quando filtros obrigatórios estiverem preenchidos", async () => {
    (RelatorioConsolidadoExportService as jest.Mock).mockResolvedValueOnce(
      true,
    );

    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosPorBimestresCarregados({
        titulo: "Consolidado por bimestres",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porBimestres",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        bimestre: 2,
        ano: [1],
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    fireEvent.click(screen.getByTestId("acao-gerar"));

    await waitFor(() => {
      expect(RelatorioConsolidadoExportService).toHaveBeenCalledWith(
        expect.objectContaining({
          extensaoRelatorio: 1,
          token: "token-teste",
        }),
      );
      expect(notification.success).toHaveBeenCalled();
    });
  });

  it("deve permitir gerar relatório sem ano preenchido", async () => {
    (RelatorioConsolidadoExportService as jest.Mock).mockResolvedValueOnce(
      true,
    );

    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosPorBimestresCarregados({
        titulo: "Consolidado por bimestres",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porBimestres",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        bimestre: 2,
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    fireEvent.click(screen.getByTestId("acao-gerar"));

    await waitFor(() => {
      expect(RelatorioConsolidadoExportService).toHaveBeenCalledWith(
        expect.objectContaining({
          extensaoRelatorio: 1,
          token: "token-teste",
          filtros: expect.not.objectContaining({
            ano: expect.anything(),
          }),
        }),
      );
    });
  });

  it("deve executar cancelamento limpando filtro e dados", async () => {
    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosCarregados({
        tituloTabelaRespostas: "x",
        estudantes: [],
        legenda: [],
        titulo: "x",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        bimestre: 2,
        ano: [1],
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    expect(screen.getByTestId("tabela-mock")).toHaveTextContent("com-dados");

    fireEvent.click(screen.getByTestId("acao-cancelar"));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
      expect(screen.getByTestId("tabela-mock")).toHaveTextContent("sem-dados");
    });
  });

  it("deve renderizar tabela de raça e gênero quando agrupamento for porRacaGenero", async () => {
    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosPorRacaGeneroCarregados({
        titulo: "Consolidado por raça e gênero",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porRacaGenero",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        bimestre: 2,
        ano: [1],
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabela-raca-genero-mock")).toHaveTextContent(
        "com-dados-raca-genero",
      );
    });
  });

  it("deve renderizar tabela de bimestres quando agrupamento for porBimestres", async () => {
    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosPorBimestresCarregados({
        titulo: "Consolidado por bimestres",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porBimestres",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabela-bimestres-mock")).toHaveTextContent(
        "com-dados-bimestres",
      );
    });
  });

  it("deve gerar relatório quando agrupamento for porRacaGenero", async () => {
    (RelatorioConsolidadoExportService as jest.Mock).mockResolvedValueOnce(
      true,
    );

    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosPorRacaGeneroCarregados({
        titulo: "Consolidado por raça e gênero",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porRacaGenero",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    fireEvent.click(screen.getByTestId("acao-gerar"));

    await waitFor(() => {
      expect(RelatorioConsolidadoExportService).toHaveBeenCalledWith(
        expect.objectContaining({
          extensaoRelatorio: 1,
          token: "token-teste",
          filtros: expect.objectContaining({
            agrupamentoDados: "porRacaGenero",
          }),
        }),
      );
      expect(notification.success).toHaveBeenCalled();
    });
  });

  it("deve gerar relatório quando agrupamento for porQuestoes", async () => {
    (RelatorioConsolidadoExportService as jest.Mock).mockResolvedValueOnce(
      true,
    );

    render(<ConteudoRelatorioConsolidado />);

    act(() => {
      mockFiltroProps.onDadosCarregados({
        tituloTabelaRespostas: "Consolidado por questões",
        estudantes: [],
        legenda: [],
        titulo: "Consolidado por questões",
        questoes: [],
      });
      mockFiltroProps.onFiltrosAlterados({
        agrupamentoDados: "porQuestoes",
        anoLetivo: 2026,
        modalidade: 1,
        dre: 10,
        ue: 20,
        componenteCurricular: 3,
        proficiencia: 4,
      });
    });

    fireEvent.click(screen.getByTestId("acao-gerar"));

    await waitFor(() => {
      expect(RelatorioConsolidadoExportService).toHaveBeenCalledWith(
        expect.objectContaining({
          extensaoRelatorio: 1,
          token: "token-teste",
          filtros: expect.objectContaining({
            agrupamentoDados: "porQuestoes",
          }),
        }),
      );
      expect(notification.success).toHaveBeenCalled();
    });
  });
});
