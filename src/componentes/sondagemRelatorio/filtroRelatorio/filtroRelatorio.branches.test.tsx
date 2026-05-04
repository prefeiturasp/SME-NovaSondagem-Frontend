import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
        if (raw === "") return onChange?.(undefined);
        if (raw === "null") return onChange?.(null);
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
  useSelector: jest.fn(() => ({ token: "fake-token" })),
}));

describe("FiltroRelatorio - branches extras", () => {
  const onDadosCarregados = jest.fn();
  const onFiltrosAlterados = jest.fn();
  const onErroValidacaoTurma = jest.fn();

  const renderWithRef = () => {
    const ref = React.createRef<{ reset: () => void }>();

    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <FiltroRelatorio
          ref={ref}
          form={form}
          onDadosCarregados={onDadosCarregados}
          onFiltrosAlterados={onFiltrosAlterados}
          onErroValidacaoTurma={onErroValidacaoTurma}
        />
      );
    };

    render(<Wrapper />);
    return ref;
  };

  const changeSelect = async (testId: string, value: string | number) => {
    const select = screen.getByTestId(testId);
    await waitFor(() => expect(select).not.toBeDisabled());
    fireEvent.change(select, { target: { value: String(value) } });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (AnoLetivoService as jest.Mock).mockResolvedValue([
      { value: 2026, label: "2026" },
    ]);
    (ModalidadeService as jest.Mock).mockResolvedValue([
      { value: 1, label: "Fundamental" },
    ]);
    (DreService as jest.Mock).mockResolvedValue([{ value: 10, label: "DRE" }]);
    (UeService as jest.Mock).mockResolvedValue([{ value: 20, label: "UE" }]);
    (TurmaService as jest.Mock).mockResolvedValue([
      { value: 30, label: "Turma", ano: 3 },
    ]);
    (ProficienciaService as jest.Mock).mockResolvedValue([
      { value: 3, label: "Leitura" },
    ]);
    (BimestreService as jest.Mock).mockResolvedValue([
      { value: 1, label: "1º Bimestre" },
    ]);
    (DadosRelatorioService as jest.Mock).mockResolvedValue({
      estudantes: [],
      legenda: [],
    });
    (validarTurma as jest.Mock).mockResolvedValue({
      valida: true,
      mensagens: [],
    });
  });

  it("executa reset completo via ref.reset", async () => {
    const ref = renderWithRef();

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await waitFor(() =>
      expect(
        screen.getByTestId("sondagem-select-modalidade"),
      ).not.toBeDisabled(),
    );

    ref.current?.reset();

    await waitFor(() => {
      expect(screen.getByTestId("sondagem-select-modalidade")).toBeDisabled();
      expect(onDadosCarregados).toHaveBeenCalledWith(null);
      expect(onFiltrosAlterados).toHaveBeenCalledWith(null);
      expect(onErroValidacaoTurma).toHaveBeenCalledWith(null);
    });
  });

  it("cobre branch de componentes curriculares vazios", async () => {
    (ComponenteCurricularService as jest.Mock).mockResolvedValueOnce(null);

    renderWithRef();

    await changeSelect("sondagem-select-ano-letivo", 2026);
    await changeSelect("sondagem-select-modalidade", 1);
    await changeSelect("sondagem-select-dre", 10);
    await changeSelect("sondagem-select-ue", 20);
    await changeSelect("sondagem-select-turma", 30);

    await waitFor(() => {
      expect(ComponenteCurricularService).toHaveBeenCalledWith({
        token: "fake-token",
        modalidade: 1,
      });

      const componenteSelect = screen.getByTestId(
        "sondagem-select-componente-curricular",
      );
      expect(componenteSelect.querySelectorAll("option").length).toBe(1);
    });
  });
});
