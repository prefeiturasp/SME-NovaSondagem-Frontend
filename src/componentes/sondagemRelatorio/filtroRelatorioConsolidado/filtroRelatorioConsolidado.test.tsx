import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "antd";
import FiltroRelatorioConsolidado from "./filtroRelatorioConsolidado";
import type { FiltroRelatorioConsolidadoRef } from "./filtroRelatorioConsolidado";
import AnoLetivoService from "../../../services/anoLetivo/anoLetivoService";
import ModalidadeService from "../../../services/modalidade/modalidadeService";
import DreService from "../../../services/dre/dreService";
import UeService from "../../../services/ue/ueService";
import ComponenteCurricularService from "../../../services/componenteCurricularService/componenteCurricularService";
import ProficienciaService from "../../../services/proficienciaService/ProficienciaService";
import BimestreService from "../../../services/bimestreService/bimestreService";
import GeneroSexoService from "../../../services/generoSexoService/generoSexoService";
import RacaCorService from "../../../services/racaCorService/racaCorService";
import BuscarDadosRelatorioConsolidadoService from "../../../services/buscarDadosRelatorioConsolidado/buscarDadosRelatorioConsolidado";
import BuscarDadosRelatorioConsolidadoPorBimestresService from "../../../services/buscarDadosRelatorioConsolidadoPorBimestres/buscarDadosRelatorioConsolidadoPorBimestres";
import BuscarDadosRelatorioConsolidadoPorRacaGeneroService from "../../../services/buscarDadosRelatorioConsolidadoPorRacaGenero/buscarDadosRelatorioConsolidadoPorRacaGenero";

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");

  const parseSingle = (raw: string) => {
    if (raw === "") return undefined;
    if (raw === "null") return null;
    if (/^-?\\d+(\\.\\d+)?$/.test(raw)) return Number(raw);
    return raw;
  };

  const Select = ({
    id,
    options = [],
    onChange,
    disabled,
    value,
    mode,
  }: any) => (
    <select
      data-testid={id}
      disabled={disabled}
      value={mode === "multiple" ? "" : (value ?? "")}
      onChange={(event) => {
        const raw = event.target.value;
        if (mode === "multiple") {
          const lista = raw
            ? raw.split(",").map((item) => parseSingle(item.trim()))
            : [];
          onChange?.(lista);
          return;
        }
        onChange?.(parseSingle(raw));
      }}
    >
      <option value="">Selecione</option>
      {options.map((option: any) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return {
    ...actual,
    Select,
  };
});

jest.mock("../../../services/anoLetivo/anoLetivoService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/modalidade/modalidadeService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/dre/dreService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/ue/ueService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "../../../services/componenteCurricularService/componenteCurricularService",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock("../../../services/proficienciaService/ProficienciaService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/bimestreService/bimestreService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/generoSexoService/generoSexoService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/racaCorService/racaCorService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "../../../services/buscarDadosRelatorioConsolidado/buscarDadosRelatorioConsolidado",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  "../../../services/buscarDadosRelatorioConsolidadoPorBimestres/buscarDadosRelatorioConsolidadoPorBimestres",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  "../../../services/buscarDadosRelatorioConsolidadoPorRacaGenero/buscarDadosRelatorioConsolidadoPorRacaGenero",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("FiltroRelatorioConsolidado", () => {
  const { useSelector } = require("react-redux");
  const onDadosCarregados = jest.fn();
  const onDadosPorGenerosCarregados = jest.fn();
  const onDadosPorBimestresCarregados = jest.fn();
  const onDadosPorRacasCarregados = jest.fn();
  const onDadosPorRacaGeneroCarregados = jest.fn();
  const onFiltrosAlterados = jest.fn();

  const renderComForm = () => {
    const ref = createRef<FiltroRelatorioConsolidadoRef>();

    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <>
          <FiltroRelatorioConsolidado
            ref={ref}
            form={form}
            onDadosCarregados={onDadosCarregados}
            onDadosPorGenerosCarregados={onDadosPorGenerosCarregados}
            onDadosPorBimestresCarregados={onDadosPorBimestresCarregados}
            onDadosPorRacasCarregados={onDadosPorRacasCarregados}
            onDadosPorRacaGeneroCarregados={onDadosPorRacaGeneroCarregados}
            onFiltrosAlterados={onFiltrosAlterados}
          />
          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => ref.current?.reset()}
          >
            Reset
          </button>
        </>
      );
    };

    render(<Wrapper />);
    return { ref };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue({ token: "token-teste" });

    (AnoLetivoService as jest.Mock).mockResolvedValue([
      { value: 2026, label: "2026" },
    ]);
    (GeneroSexoService as jest.Mock).mockResolvedValue([
      { value: 1, label: "Feminino" },
    ]);
    (RacaCorService as jest.Mock).mockResolvedValue([
      { value: 2, label: "Branca" },
    ]);
    (ModalidadeService as jest.Mock).mockResolvedValue([
      { value: 5, label: "Ensino Fundamental" },
    ]);
    (DreService as jest.Mock).mockResolvedValue([{ value: 10, label: "DRE" }]);
    (UeService as jest.Mock).mockResolvedValue([{ value: 20, label: "UE" }]);
    (ComponenteCurricularService as jest.Mock).mockResolvedValue([
      { value: 3, label: "Português" },
    ]);
    (ProficienciaService as jest.Mock).mockResolvedValue([
      { value: 4, label: "Leitura" },
    ]);
    (BimestreService as jest.Mock).mockResolvedValue([
      { value: 1, label: "1º Bimestre" },
    ]);
    (BuscarDadosRelatorioConsolidadoService as jest.Mock).mockResolvedValue({
      titulo: "Consolidado",
      questoes: [],
    });
    (
      BuscarDadosRelatorioConsolidadoPorRacaGeneroService as jest.Mock
    ).mockResolvedValue({
      titulo: "Consolidado por raça e gênero",
      questoes: [],
    });
    (
      BuscarDadosRelatorioConsolidadoPorBimestresService as jest.Mock
    ).mockResolvedValue({
      titulo: "Consolidado por bimestres",
      questoes: [],
    });
  });

  it("deve carregar dados iniciais na montagem", async () => {
    renderComForm();

    await waitFor(() => {
      expect(AnoLetivoService).toHaveBeenCalledWith({ token: "token-teste" });
      expect(GeneroSexoService).toHaveBeenCalledWith({ token: "token-teste" });
      expect(RacaCorService).toHaveBeenCalledWith({ token: "token-teste" });
    });

    expect(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
    ).toBeDisabled();
  });

  it("deve percorrer fluxo e buscar dados quando obrigatórios forem preenchidos", async () => {
    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "5" },
      },
    );
    await waitFor(() => {
      expect(DreService).toHaveBeenCalled();
      expect(ComponenteCurricularService).toHaveBeenCalledWith({
        token: "token-teste",
        modalidade: "5",
      });
      expect(BimestreService).toHaveBeenCalledWith({
        token: "token-teste",
        modalidade: "5",
      });
    });

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ano"), {
      target: { value: "1" },
    });

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-proficiencia"),
      {
        target: { value: "4" },
      },
    );

    await waitFor(() => {
      expect(BuscarDadosRelatorioConsolidadoService).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "token-teste",
          filtros: expect.objectContaining({
            anoLetivo: "2026",
            modalidade: "5",
            dre: "10",
            ue: "20",
            ano: ["1"],
            componenteCurricular: "3",
            proficiencia: "4",
          }),
        }),
      );
      expect(onDadosCarregados).toHaveBeenCalled();
      expect(onFiltrosAlterados).toHaveBeenCalled();
    });
  });

  it("deve resetar estados via ref.reset", async () => {
    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("sondagem-consolidado-select-modalidade"),
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId("btn-reset"));

    await waitFor(() => {
      expect(
        screen.getByTestId("sondagem-consolidado-select-modalidade"),
      ).toBeDisabled();
      expect(onDadosCarregados).toHaveBeenCalledWith(null);
      expect(onDadosPorGenerosCarregados).toHaveBeenCalledWith(null);
      expect(onDadosPorBimestresCarregados).toHaveBeenCalledWith(null);
      expect(onDadosPorRacasCarregados).toHaveBeenCalledWith(null);
      expect(onDadosPorRacaGeneroCarregados).toHaveBeenCalledWith(null);
      expect(onFiltrosAlterados).toHaveBeenCalledWith(null);
    });
  });

  it("deve buscar no serviço de raça e gênero quando agrupamento for porRacaGenero", async () => {
    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-agrupamento-dados"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-agrupamento-dados"),
      {
        target: { value: "porRacaGenero" },
      },
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "5" },
      },
    );
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ano"), {
      target: { value: "1" },
    });

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-proficiencia"),
      {
        target: { value: "4" },
      },
    );

    await waitFor(() => {
      expect(
        BuscarDadosRelatorioConsolidadoPorRacaGeneroService,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "token-teste",
          filtros: expect.objectContaining({
            agrupamentoDados: "porRacaGenero",
            anoLetivo: "2026",
            modalidade: "5",
            dre: "10",
            ue: "20",
            ano: ["1"],
            componenteCurricular: "3",
            proficiencia: "4",
          }),
        }),
      );
      expect(onDadosPorRacaGeneroCarregados).toHaveBeenCalled();
    });
  });

  it("deve buscar no serviço de bimestres quando agrupamento for porBimestres", async () => {
    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-agrupamento-dados"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-agrupamento-dados"),
      {
        target: { value: "porBimestres" },
      },
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "5" },
      },
    );
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ano"), {
      target: { value: "1" },
    });

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-proficiencia"),
      {
        target: { value: "4" },
      },
    );

    await waitFor(() => {
      expect(
        BuscarDadosRelatorioConsolidadoPorBimestresService,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "token-teste",
          filtros: expect.objectContaining({
            agrupamentoDados: "porBimestres",
            anoLetivo: "2026",
            modalidade: "5",
            dre: "10",
            ue: "20",
            ano: ["1"],
            componenteCurricular: "3",
            proficiencia: "4",
          }),
        }),
      );
      expect(onDadosPorBimestresCarregados).toHaveBeenCalled();
    });
  });

  it("deve buscar novamente ao alterar bimestre após proficiência selecionada", async () => {
    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "5" },
      },
    );
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ano"), {
      target: { value: "1" },
    });

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-proficiencia"),
      {
        target: { value: "4" },
      },
    );

    await waitFor(() => {
      expect(BuscarDadosRelatorioConsolidadoService).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-bimestre"),
      {
        target: { value: "1" },
      },
    );

    await waitFor(() => {
      expect(BuscarDadosRelatorioConsolidadoService).toHaveBeenCalledTimes(2);
      expect(BuscarDadosRelatorioConsolidadoService).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filtros: expect.objectContaining({
            bimestre: "1",
            proficiencia: "4",
          }),
        }),
      );
    });
  });

  it("deve ocultar PAP em programas quando modalidade for EJA (id 3)", async () => {
    (ModalidadeService as jest.Mock).mockResolvedValueOnce([
      { value: 3, label: "Educação de Jovens e Adultos" },
      { value: 5, label: "Ensino Fundamental" },
    ]);

    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );

    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "3" },
      },
    );

    const selectProgramas = screen.getByTestId(
      "sondagem-consolidado-select-programas-atendimentos",
    );

    expect(selectProgramas).not.toHaveTextContent("PAP");
    expect(selectProgramas).toHaveTextContent("AEE");
    expect(selectProgramas).toHaveTextContent("Deficiência");
  });

  it("deve exibir semestre e habilitar componente curricular na EJA após selecionar UE", async () => {
    (ModalidadeService as jest.Mock).mockResolvedValueOnce([
      { value: 3, label: "Educação de Jovens e Adultos" },
      { value: 5, label: "Ensino Fundamental" },
    ]);

    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );

    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("sondagem-consolidado-select-ano"),
      ).toBeNull();
      expect(
        screen.getByTestId("sondagem-consolidado-select-semestre"),
      ).toBeInTheDocument();
    });

    const selectSemestre = screen.getByTestId(
      "sondagem-consolidado-select-semestre",
    );
    expect(selectSemestre).toHaveValue("1");
    expect(selectSemestre).not.toHaveTextContent("Todos");

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });

    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      ).not.toBeDisabled();
    });
  });

  it("deve enviar semestreId quando selecionado na EJA", async () => {
    (ModalidadeService as jest.Mock).mockResolvedValueOnce([
      { value: 3, label: "Educação de Jovens e Adultos" },
      { value: 5, label: "Ensino Fundamental" },
    ]);

    renderComForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-ano-letivo"),
      {
        target: { value: "2026" },
      },
    );
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-modalidade"),
      {
        target: { value: "3" },
      },
    );

    await waitFor(() => expect(DreService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-consolidado-select-ue"), {
      target: { value: "20" },
    });

    expect(
      screen.getByTestId("sondagem-consolidado-select-semestre"),
    ).toHaveValue("1");

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-semestre"),
      {
        target: { value: "2" },
      },
    );

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-componente-curricular"),
      {
        target: { value: "3" },
      },
    );
    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    fireEvent.change(
      screen.getByTestId("sondagem-consolidado-select-proficiencia"),
      {
        target: { value: "4" },
      },
    );

    await waitFor(() => {
      expect(BuscarDadosRelatorioConsolidadoService).toHaveBeenCalledWith(
        expect.objectContaining({
          filtros: expect.objectContaining({
            modalidade: "3",
            componenteCurricular: "3",
            proficiencia: "4",
            semestreId: 2,
            ano: undefined,
          }),
        }),
      );
    });
  });
});
