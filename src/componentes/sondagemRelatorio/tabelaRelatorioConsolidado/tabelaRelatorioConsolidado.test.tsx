import { render, screen } from "@testing-library/react";
import TabelaRelatorioConsolidado from "./tabelaRelatorioConsolidado";

describe("TabelaRelatorioConsolidado", () => {
  it("deve renderizar null quando dados for null", () => {
    const { container } = render(<TabelaRelatorioConsolidado dados={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("deve exibir mensagem de vazio quando questoes vier vazio", () => {
    render(
      <TabelaRelatorioConsolidado
        dados={{
          titulo: "Consolidado",
          questoes: [],
        }}
      />,
    );

    expect(
      screen.getByText(
        "Nenhuma informação encontrada para os filtros informados",
      ),
    ).toBeInTheDocument();
  });

  it("deve renderizar questão, respostas ordenadas e total", () => {
    render(
      <TabelaRelatorioConsolidado
        dados={{
          titulo: "Título Consolidado",
          questoes: [
            {
              questaoId: 1,
              questaoNome: "Questão 1",
              totalEstudantes: 10,
              percentualTotal: 100,
              totaisPorAnoTurma: [],
              respostas: [
                {
                  resposta: "Inadequada",
                  anosTurma: [1],
                  total: 2,
                  percentual: 20,
                  ordem: 2,
                  corFundo: "#ff0000",
                  corTexto: "#ffffff",
                },
                {
                  resposta: "Adequada",
                  anosTurma: [1],
                  total: 8,
                  percentual: 80,
                  ordem: 1,
                  corFundo: "#00ff00",
                  corTexto: "#000000",
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Título Consolidado")).toBeInTheDocument();
    expect(screen.getByText("Questão 1")).toBeInTheDocument();

    const adequadas = screen.getAllByText("Adequada");
    const inadequadas = screen.getAllByText("Inadequada");
    expect(adequadas.length).toBeGreaterThan(0);
    expect(inadequadas.length).toBeGreaterThan(0);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
