import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const mockFiltroReset = jest.fn();

// Create a mock store for tests
const createMockStore = () => {
  return configureStore({
    reducer: {
      usuario: () => ({
        usuario: {
          token: "mock-token",
        },
      }),
    },
  });
};

// Helper to render components with Redux Provider
const renderWithProvider = (component: React.ReactElement) => {
  const mockStore = createMockStore();
  return render(<Provider store={mockStore}>{component}</Provider>);
};

jest.mock("../filtroRelatorio/filtroRelatorio", () => {
  const React = require("react");
  const { Form } = require("antd");

  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      reset: mockFiltroReset,
    }));

    return (
      <Form form={props.form}>
        <button
          data-testid="filtro-normal"
          onClick={() => {
            props.onFiltrosAlterados({
              modalidade: 1,
              proficiencia: 1,
              ano: 3,
            });
            props.onDadosCarregados({
              tituloTabelaRespostas: "Relatório teste",
              estudantes: [],
              legenda: [
                {
                  id: 1,
                  ordem: 1,
                  descricaoOpcaoResposta: "Adequada",
                  corFundo: "#7ED957",
                  corTexto: "#363636",
                  legenda: "Recuperou corretamente",
                },
              ],
            });
          }}
        >
          Carregar normal
        </button>

        <button
          data-testid="filtro-eja"
          onClick={() => {
            props.onFiltrosAlterados({
              modalidade: 3,
              proficiencia: 6,
              ano: 9,
            });
            props.onDadosCarregados({
              tituloTabelaRespostas: "Relatório EJA",
              estudantes: [],
              legenda: [
                {
                  id: 2,
                  ordem: 1,
                  descricaoOpcaoResposta: "Qualquer",
                  corFundo: "#ffffff",
                  corTexto: "#111111",
                  legenda: "Legenda qualquer",
                },
              ],
            });
          }}
        >
          Carregar EJA
        </button>

        <button
          data-testid="filtro-erro-turma"
          onClick={() => {
            props.onErroValidacaoTurma(
              "Turma inválida para geração do relatório",
            );
          }}
        >
          Disparar erro turma
        </button>

        <button
          data-testid="filtro-sem-legenda"
          onClick={() => {
            props.onFiltrosAlterados({
              modalidade: 1,
              proficiencia: 1,
              ano: 1,
            });
            props.onDadosCarregados({
              tituloTabelaRespostas: "Sem legenda",
              estudantes: [],
              legenda: undefined,
            });
          }}
        >
          Carregar sem legenda
        </button>

        <button
          data-testid="filtro-limpar-dados"
          onClick={() => {
            props.onDadosCarregados(null);
          }}
        >
          Limpar dados
        </button>
      </Form>
    );
  });
});

jest.mock(
  "../listaDinamicaRelatorio/listaDinamicaRelatorio",
  () => (props: any) => (
    <div data-testid="lista-relatorio">
      {props.dados?.tituloTabelaRespostas ?? "sem-dados"}
    </div>
  ),
);

jest.mock("~/componentes/biblioteca/Alerta", () => (props: any) => (
  <div data-testid="alerta-mock">{props.alerta?.mensagem}</div>
));

jest.mock("../../sondagem/legendas/legendas", () => (props: any) => (
  <div data-testid="legendas-relatorio">
    {JSON.stringify({
      dataLen: props.data?.length ?? 0,
      first: props.data?.[0]?.descricaoLegenda ?? null,
      ano: props.ano ?? null,
      proficienciaId: props.proficienciaId ?? null,
    })}
  </div>
));

import ConteudoRelatorio from "./conteudoRelatorio";

describe("ConteudoRelatorio", () => {
  beforeEach(() => {
    mockFiltroReset.mockClear();
  });

  it("deve renderizar título, instrução e botões principais", () => {
    renderWithProvider(<ConteudoRelatorio />);

    expect(screen.getByText("Sondagem por turma")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Preencha os campos para conferir as informações das turmas e estudantes/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gerar" })).toBeInTheDocument();
    expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
      "sem-dados",
    );
  });

  it("deve mapear legenda padrão quando não for cenário EJA + CapacidadeLeitora", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-normal"));

    await waitFor(() => {
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "Relatório teste",
      );
    });

    await waitFor(() => {
      const legendas = screen.getByTestId("legendas-relatorio");
      expect(legendas).toHaveTextContent('"dataLen":1');
      expect(legendas).toHaveTextContent('"first":"Adequada"');
      expect(legendas).toHaveTextContent('"ano":3');
      expect(legendas).toHaveTextContent('"proficienciaId":1');
    });
  });

  it("deve aplicar legenda fixa no cenário EJA com CapacidadeLeitora", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-eja"));

    await waitFor(() => {
      const legendas = screen.getByTestId("legendas-relatorio");
      expect(legendas).toHaveTextContent('"dataLen":6');
      expect(legendas).toHaveTextContent('"first":"Localização"');
      expect(legendas).toHaveTextContent('"ano":9');
      expect(legendas).toHaveTextContent('"proficienciaId":6');
    });
  });

  it("deve suportar dados sem legenda e manter lista de legendas vazia", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-sem-legenda"));

    await waitFor(() => {
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "Sem legenda",
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("legendas-relatorio")).toHaveTextContent(
        '"dataLen":0',
      );
    });
  });

  it("deve limpar dados e chamar reset do filtro ao cancelar", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-normal"));
    await waitFor(() => {
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "Relatório teste",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(mockFiltroReset).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "sem-dados",
      );
      expect(screen.getByTestId("legendas-relatorio")).toHaveTextContent(
        '"dataLen":0',
      );
    });
  });

  it("deve limpar legenda ao receber dados nulos em uma nova busca", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-normal"));
    await waitFor(() => {
      const legendas = screen.getByTestId("legendas-relatorio");
      expect(legendas).toHaveTextContent('"dataLen":1');
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "Relatório teste",
      );
    });

    fireEvent.click(screen.getByTestId("filtro-limpar-dados"));

    await waitFor(() => {
      expect(screen.getByTestId("lista-relatorio")).toHaveTextContent(
        "sem-dados",
      );
      expect(screen.getByTestId("legendas-relatorio")).toHaveTextContent(
        '"dataLen":0',
      );
    });
  });

  it("deve exibir alerta quando filtro informar erro de validação de turma", async () => {
    renderWithProvider(<ConteudoRelatorio />);

    fireEvent.click(screen.getByTestId("filtro-erro-turma"));

    await waitFor(() => {
      expect(screen.getByTestId("alerta-mock")).toHaveTextContent(
        "Turma inválida para geração do relatório",
      );
    });
  });
});
