import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "antd";

import FiltroRelatorio from "./filtroRelatorio";
import AnoLetivoService from "../../../services/anoLetivo/anoLetivoService";
import ModalidadeService from "../../../services/modalidade/modalidadeService";
import DreService from "../../../services/dre/dreService";
import UeService from "../../../services/ue/ueService";
import TurmaService from "../../../services/turma/turmaService";
import ComponenteCurricularService from "../../../services/componenteCurricularService/componenteCurricularService";
import ProficienciaService from "../../../services/proficienciaService/ProficienciaService";
import BimestreService from "../../../services/bimestreService/bimestreService";
import DadosRelatorioService from "../../../services/buscarDadosRelatorio/buscarDadosRelatorio";
import { validarTurma } from "../../../services/turmaService";

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");

  const Select = ({ id, options = [], onChange, disabled, value }: any) => (
    <select
      data-testid={id}
      disabled={disabled}
      value={value ?? ""}
      onChange={(event) => {
        const raw = event.target.value;
        if (raw === "") {
          onChange?.(undefined);
          return;
        }
        if (raw === "null") {
          onChange?.(null);
          return;
        }
        onChange?.(Number(raw));
      }}
    >
      <option value="">Selecione</option>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
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

jest.mock("../../../services/turma/turmaService", () => ({
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

jest.mock(
  "../../../services/buscarDadosRelatorio/buscarDadosRelatorio",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock("../../../services/turmaService", () => ({
  validarTurma: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("FiltroRelatorio", () => {
  const { useSelector } = require("react-redux");

  const onDadosCarregados = jest.fn();
  const onFiltrosAlterados = jest.fn();
  const onErroValidacaoTurma = jest.fn();

  const renderWithForm = () => {
    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <FiltroRelatorio
          form={form}
          onDadosCarregados={onDadosCarregados}
          onFiltrosAlterados={onFiltrosAlterados}
          onErroValidacaoTurma={onErroValidacaoTurma}
        />
      );
    };

    return render(<Wrapper />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue({ token: "fake-token" });

    (AnoLetivoService as jest.Mock).mockResolvedValue([
      { value: 2026, label: "2026" },
    ]);
    (ModalidadeService as jest.Mock).mockResolvedValue([
      { value: 1, label: "Ensino Fundamental" },
      { value: 5, label: "Infantil" },
    ]);
    (DreService as jest.Mock).mockResolvedValue([
      { value: 10, label: "DRE 10" },
    ]);
    (UeService as jest.Mock).mockResolvedValue([{ value: 20, label: "UE 20" }]);
    (TurmaService as jest.Mock).mockResolvedValue([
      { value: 30, label: "Turma 30", ano: 3 },
    ]);
    (ComponenteCurricularService as jest.Mock).mockResolvedValue([
      { value: 40, label: "Português" },
    ]);
    (ProficienciaService as jest.Mock).mockResolvedValue([
      { value: 3, label: "Leitura" },
    ]);
    (BimestreService as jest.Mock).mockResolvedValue([
      { value: 1, label: "1º Bimestre" },
    ]);
    (DadosRelatorioService as jest.Mock).mockResolvedValue({
      tituloTabelaRespostas: "Leitura",
      estudantes: [],
      legenda: [],
    });
    (validarTurma as jest.Mock).mockResolvedValue({
      valida: true,
      mensagens: [],
    });
  });

  it("carrega apenas anos letivos na inicialização", async () => {
    renderWithForm();

    await waitFor(() => {
      expect(AnoLetivoService).toHaveBeenCalledWith({ token: "fake-token" });
    });

    expect(
      screen.getByTestId("sondagem-select-componente-curricular"),
    ).toBeDisabled();
    expect(screen.getByTestId("sondagem-select-proficiencia")).toBeDisabled();

    expect(ComponenteCurricularService).not.toHaveBeenCalled();
    expect(BimestreService).not.toHaveBeenCalled();
  });

  it("chama validação da turma e propaga erro quando turma inválida", async () => {
    (validarTurma as jest.Mock).mockResolvedValueOnce({
      valida: false,
      mensagens: ["Turma inválida"],
    });

    renderWithForm();

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByTestId("sondagem-select-ano-letivo"), {
      target: { value: "2026" },
    });
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-select-modalidade"), {
      target: { value: "1" },
    });
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-select-dre"), {
      target: { value: "10" },
    });
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-select-ue"), {
      target: { value: "20" },
    });
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    fireEvent.change(screen.getByTestId("sondagem-select-turma"), {
      target: { value: "30" },
    });

    await waitFor(() => {
      expect(validarTurma).toHaveBeenCalledWith({
        turmaId: 30,
        token: "fake-token",
      });
      expect(onErroValidacaoTurma).toHaveBeenCalledWith("Turma inválida");
      // serviço não deve ser chamado quando turma inválida
      expect(ComponenteCurricularService).not.toHaveBeenCalled();
    });
  });

  it("executa busca de dados quando campos obrigatórios são preenchidos", async () => {
    renderWithForm();

    const changeSelect = async (testId: string, value: string | number) => {
      const select = screen.getByTestId(testId);
      await waitFor(() => expect(select).not.toBeDisabled());
      fireEvent.change(select, { target: { value: String(value) } });
    };

    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-select-ano-letivo"),
      ).toBeInTheDocument(),
    );

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-modalidade", 1);
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    await changeSelect("sondagem-select-dre", 10);
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-ue", 20);
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-turma", 30);
    await waitFor(() => expect(validarTurma).toHaveBeenCalled());
    expect(ComponenteCurricularService).toHaveBeenCalledWith({
      token: "fake-token",
      modalidade: 1,
    });

    await changeSelect("sondagem-select-componente-curricular", 40);
    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-proficiencia", 3);
    await waitFor(() => expect(BimestreService).toHaveBeenCalled());
    await changeSelect("sondagem-select-bimestre", "null");

    await waitFor(() => {
      expect(DadosRelatorioService).toHaveBeenCalledWith(
        expect.objectContaining({
          turmaId: 30,
          proficienciaId: 3,
          componenteCurricularId: 40,
          modalidade: 1,
          anoLetivo: 2026,
          ano: 3,
          ueCodigo: "20",
          bimestreId: null,
          semestreId: null,
          token: "fake-token",
        }),
      );
      expect(onDadosCarregados).toHaveBeenCalled();
      expect(onDadosCarregados).toHaveBeenCalledWith(null);
      expect(onDadosCarregados).toHaveBeenLastCalledWith(
        expect.objectContaining({
          tituloTabelaRespostas: "Leitura",
        }),
      );
      expect(onFiltrosAlterados).toHaveBeenCalled();
      expect(onErroValidacaoTurma).toHaveBeenCalledWith(null);
    });
  });

  it("exibe bimestre para modalidade 5 e envia null ao selecionar 'Todos'", async () => {
    renderWithForm();

    const changeSelect = async (testId: string, value: string | number) => {
      const select = screen.getByTestId(testId);
      await waitFor(() => expect(select).not.toBeDisabled());
      fireEvent.change(select, { target: { value: String(value) } });
    };

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-modalidade", 5);
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    await changeSelect("sondagem-select-dre", 10);
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-ue", 20);
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-turma", 30);
    await waitFor(() => expect(validarTurma).toHaveBeenCalled());

    await changeSelect("sondagem-select-componente-curricular", 40);
    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-proficiencia", 3);
    await waitFor(() => expect(BimestreService).toHaveBeenCalled());

    await waitFor(() => {
      expect(
        screen.getByTestId("sondagem-select-bimestre"),
      ).toBeInTheDocument();
    });

    const selectBimestre = screen.getByTestId(
      "sondagem-select-bimestre",
    ) as HTMLSelectElement;
    expect(selectBimestre.value).toBe("");
    expect(screen.getByText("Todos")).toBeInTheDocument();

    fireEvent.change(selectBimestre, { target: { value: "null" } });

    await waitFor(() => {
      expect(DadosRelatorioService).toHaveBeenCalledWith(
        expect.objectContaining({
          modalidade: 5,
          bimestreId: null,
          token: "fake-token",
        }),
      );
    });
  });

  it("exibe bimestre para modalidade diferente de 5", async () => {
    renderWithForm();

    const changeSelect = async (testId: string, value: string | number) => {
      const select = screen.getByTestId(testId);
      await waitFor(() => expect(select).not.toBeDisabled());
      fireEvent.change(select, { target: { value: String(value) } });
    };

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-modalidade", 1);
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    await changeSelect("sondagem-select-dre", 10);
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-ue", 20);
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-turma", 30);
    await waitFor(() => expect(validarTurma).toHaveBeenCalled());

    await changeSelect("sondagem-select-componente-curricular", 40);
    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-proficiencia", 3);
    await waitFor(() => expect(BimestreService).toHaveBeenCalled());

    await waitFor(() => {
      expect(
        screen.getByTestId("sondagem-select-bimestre"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Todos" })).toHaveValue("Todos");
    expect(screen.getByRole("option", { name: "1º Bimestre" })).toHaveValue(
      "1",
    );
  });

  it("mantém proficiência desabilitada quando serviço de proficiência retorna vazio", async () => {
    (ProficienciaService as jest.Mock).mockResolvedValueOnce(null);

    renderWithForm();

    const changeSelect = async (testId: string, value: string | number) => {
      const select = screen.getByTestId(testId);
      await waitFor(() => expect(select).not.toBeDisabled());
      fireEvent.change(select, { target: { value: String(value) } });
    };

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-modalidade", 1);
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    await changeSelect("sondagem-select-dre", 10);
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-ue", 20);
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-turma", 30);
    await waitFor(() => expect(validarTurma).toHaveBeenCalled());

    await changeSelect("sondagem-select-componente-curricular", 40);

    await waitFor(() => {
      expect(ProficienciaService).toHaveBeenCalled();
      expect(screen.getByTestId("sondagem-select-proficiencia")).toBeDisabled();
      expect(BimestreService).not.toHaveBeenCalled();
    });
  });

  it("mantém bimestre desabilitado quando serviço de bimestre retorna vazio", async () => {
    (BimestreService as jest.Mock).mockResolvedValueOnce(null);

    renderWithForm();

    const changeSelect = async (testId: string, value: string | number) => {
      const select = screen.getByTestId(testId);
      await waitFor(() => expect(select).not.toBeDisabled());
      fireEvent.change(select, { target: { value: String(value) } });
    };

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() => expect(ModalidadeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-modalidade", 1);
    await waitFor(() => expect(DreService).toHaveBeenCalled());

    await changeSelect("sondagem-select-dre", 10);
    await waitFor(() => expect(UeService).toHaveBeenCalled());

    await changeSelect("sondagem-select-ue", 20);
    await waitFor(() => expect(TurmaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-turma", 30);
    await waitFor(() => expect(validarTurma).toHaveBeenCalled());

    await changeSelect("sondagem-select-componente-curricular", 40);
    await waitFor(() => expect(ProficienciaService).toHaveBeenCalled());

    await changeSelect("sondagem-select-proficiencia", 3);

    await waitFor(() => {
      expect(BimestreService).toHaveBeenCalled();
      expect(screen.getByTestId("sondagem-select-bimestre")).toBeDisabled();
      expect(DadosRelatorioService).not.toHaveBeenCalled();
    });
  });
});
