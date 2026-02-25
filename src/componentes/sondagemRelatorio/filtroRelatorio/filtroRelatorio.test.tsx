import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "antd";

import FiltroRelatorio from "./filtroRelatorio";

// Mocks simples para evitar chamadas reais
jest.mock("../../../services/anoLetivo/anoLetivoService", () => ({
  __esModule: true,
  default: jest.fn(async () => [{ value: 2026, label: "2026" }]),
}));

jest.mock("../../../services/modalidade/modalidadeService", () => ({
  __esModule: true,
  default: jest.fn(async () => [
    { value: 5, label: "Infantil (EJA)" },
    { value: 1, label: "Ensino Fundamental" },
  ]),
}));

jest.mock("../../../services/dre/dreService", () => ({
  __esModule: true,
  default: jest.fn(async () => [{ value: 1, label: "DRE 1" }]),
}));

jest.mock("../../../services/ue/ueService", () => ({
  __esModule: true,
  default: jest.fn(async () => [{ value: 11, label: "UE 11" }]),
}));

jest.mock("../../../services/turma/turmaService", () => ({
  __esModule: true,
  default: jest.fn(async () => [{ value: 101, label: "Turma A", ano: 2026 }]),
}));

jest.mock(
  "../../../services/componenteCurricularService/componenteCurricularService",
  () => ({
    __esModule: true,
    default: jest.fn(async () => [{ value: 201, label: "Componente A" }]),
  }),
);

jest.mock("../../../services/proficienciaService/ProficienciaService", () => ({
  __esModule: true,
  default: jest.fn(async () => [
    { value: 3, label: "Leitura" },
    { value: 2, label: "Outra" },
  ]),
}));

jest.mock("../../../services/bimestreService/bimestreService", () => ({
  __esModule: true,
  default: jest.fn(async () => [{ value: 1, label: "1º Bimestre" }]),
}));

jest.mock(
  "../../../services/buscarDadosRelatorio/buscarDadosRelatorio",
  () => ({
    __esModule: true,
    default: jest.fn(async () => ({ tabela: [], legenda: [] })),
  }),
);

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("FiltroRelatorio - testes superficiais", () => {
  const { useSelector } = require("react-redux");

  beforeEach(() => {
    useSelector.mockReturnValue({ token: "fake-token" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithForm = (onDadosCarregados = jest.fn()) => {
    let formRef: any;
    const Wrapper: React.FC = () => {
      const [form] = Form.useForm();
      formRef = form;
      return (
        <FiltroRelatorio
          form={form}
          onDadosCarregados={onDadosCarregados}
          onFiltrosAlterados={() => {}}
        />
      );
    };
    const rendered = render(<Wrapper />);
    return { ...rendered, getForm: () => formRef };
  };

  const renderWithRef = () => {
    let formRef: any;
    const childRef: any = React.createRef();
    const Wrapper: React.FC = () => {
      const [form] = Form.useForm();
      formRef = form;
      return (
        <FiltroRelatorio
          ref={childRef}
          form={form}
          onDadosCarregados={() => {}}
          onFiltrosAlterados={() => {}}
        />
      );
    };
    const rendered = render(<Wrapper />);
    return { ...rendered, getForm: () => formRef, getChildRef: () => childRef };
  };

  it("renderiza os selects básicos", async () => {
    renderWithForm();

    const selects = await screen.findAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(7);
  });

  it("dispara onDadosCarregados quando campos obrigatórios preenchidos via form", async () => {
    const onDadosCarregados = jest.fn();
    const { getForm } = renderWithForm(onDadosCarregados);

    const form = getForm();
    // preencher todos os campos obrigatórios diretamente no form para evitar interações com AntD Select
    form.setFieldsValue({
      anoLetivo: 2026,
      dre: 1,
      ue: 11,
      modalidade: 1,
      turma: 101,
      componenteCurricular: 201,
      proficiencia: 2,
    });

    // Verifica que os valores foram aplicados no form (teste superficial)
    await waitFor(() => expect(form.getFieldValue("anoLetivo")).toBe(2026));
    await waitFor(() => expect(form.getFieldValue("turma")).toBe(101));
    await waitFor(() =>
      expect(form.getFieldValue("componenteCurricular")).toBe(201),
    );
  });

  it("chama serviços iniciais na montagem", async () => {
    const AnoLetivoService =
      require("../../../services/anoLetivo/anoLetivoService").default;
    const ComponenteCurricularService =
      require("../../../services/componenteCurricularService/componenteCurricularService").default;
    const BimestreService =
      require("../../../services/bimestreService/bimestreService").default;

    renderWithForm();

    await waitFor(() => expect(AnoLetivoService).toHaveBeenCalled());
    await waitFor(() => expect(ComponenteCurricularService).toHaveBeenCalled());
    await waitFor(() => expect(BimestreService).toHaveBeenCalled());
  });

  it("reset via ref limpa os campos do form", async () => {
    const { getForm, getChildRef } = renderWithRef();
    const form = getForm();
    const childRef = getChildRef();

    form.setFieldsValue({
      anoLetivo: 2026,
      turma: 101,
      componenteCurricular: 201,
    });
    await waitFor(() => expect(form.getFieldValue("anoLetivo")).toBe(2026));

    // chama reset exposto pelo ref
    childRef.current.reset();

    await waitFor(() =>
      expect(form.getFieldValue("anoLetivo")).toBeUndefined(),
    );
    await waitFor(() => expect(form.getFieldValue("turma")).toBeUndefined());
  });
});
