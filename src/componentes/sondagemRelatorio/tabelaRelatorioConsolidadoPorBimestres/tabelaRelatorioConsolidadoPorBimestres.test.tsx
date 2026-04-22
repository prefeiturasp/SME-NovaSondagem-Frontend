import { render, screen } from "@testing-library/react";
import TabelaRelatorioConsolidadoPorBimestres from "./tabelaRelatorioConsolidadoPorBimestres";

describe("TabelaRelatorioConsolidadoPorBimestres", () => {
  it("deve renderizar null quando dados for null", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorBimestres dados={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve exibir loading quando isLoading for true", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorBimestres dados={null} isLoading />,
    );

    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando questoes vier vazio", () => {
    render(
      <TabelaRelatorioConsolidadoPorBimestres
        dados={{
          titulo: "Consolidado por Bimestres",
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

  it("deve renderizar colunas por bimestre, respostas ordenadas e total", () => {
    render(
      <TabelaRelatorioConsolidadoPorBimestres
        dados={{
          titulo: "Consolidado por Bimestres",
          questoes: [
            {
              questaoId: 1,
              questaoNome: "Questão 1",
              totalEstudantes: 10,
              percentualTotal: 100,
              totaisPorBimestre: [
                { bimestre: "Inicial", quantidade: 6, percentual: 60 },
                { bimestre: "1° bimestre", quantidade: 4, percentual: 40 },
              ],
              respostas: [
                {
                  resposta: "Inadequada",
                  bimestres: [
                    { bimestre: "Inicial", quantidade: 1, percentual: 10 },
                  ],
                  total: 1,
                  percentual: 10,
                  ordem: 2,
                  corFundo: "#ff0000",
                  corTexto: "#ffffff",
                },
                {
                  resposta: "Adequada",
                  bimestres: [
                    { bimestre: "Inicial", quantidade: 5, percentual: 50 },
                    { bimestre: "1° bimestre", quantidade: 4, percentual: 40 },
                  ],
                  total: 9,
                  percentual: 90,
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

    expect(screen.getAllByText("Questão 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Inicial").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1° bimestre").length).toBeGreaterThan(0);

    const textoTela = document.body.textContent ?? "";
    expect(textoTela.indexOf("Adequada")).toBeLessThan(
      textoTela.indexOf("Inadequada"),
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("60%").length).toBeGreaterThan(0);
  });

  it("deve exibir Vazio quando não houver quantidade para bimestre", () => {
    render(
      <TabelaRelatorioConsolidadoPorBimestres
        dados={{
          titulo: "Consolidado por Bimestres",
          questoes: [
            {
              questaoId: 2,
              questaoNome: "Questão 2",
              totalEstudantes: 5,
              percentualTotal: 100,
              totaisPorBimestre: [
                { bimestre: "Inicial", quantidade: 5, percentual: 100 },
                { bimestre: "1° bimestre", quantidade: 0, percentual: 0 },
              ],
              respostas: [
                {
                  resposta: "Sim",
                  bimestres: [
                    { bimestre: "Inicial", quantidade: 5, percentual: 100 },
                  ],
                  total: 5,
                  percentual: 100,
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

    expect(screen.getAllByText("Vazio").length).toBeGreaterThan(0);
  });
});
