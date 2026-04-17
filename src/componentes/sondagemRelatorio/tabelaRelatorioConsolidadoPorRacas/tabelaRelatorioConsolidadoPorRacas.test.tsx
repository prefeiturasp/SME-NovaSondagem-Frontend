import { render, screen } from "@testing-library/react";
import TabelaRelatorioConsolidadoPorRacas from "./tabelaRelatorioConsolidadoPorRacas";

describe("TabelaRelatorioConsolidadoPorRacas", () => {
  it("deve renderizar null quando dados for null", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorRacas dados={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve exibir loading quando isLoading for true", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorRacas dados={null} isLoading />,
    );

    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando questoes vier vazio", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacas
        dados={{
          titulo: "Consolidado por Raças",
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

  it("deve renderizar colunas por raça, respostas ordenadas e total", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacas
        dados={{
          titulo: "Consolidado por Raças",
          questoes: [
            {
              questaoId: 1,
              questaoNome: "Questão 1",
              totalEstudantes: 10,
              percentualTotal: 100,
              totaisPorRaca: [
                { raca: "Branca", quantidade: 6, percentual: 60 },
                { raca: "Preta", quantidade: 4, percentual: 40 },
              ],
              respostas: [
                {
                  resposta: "Inadequada",
                  racas: [{ raca: "Branca", quantidade: 1, percentual: 10 }],
                  total: 1,
                  percentual: 10,
                  ordem: 2,
                  corFundo: "#ff0000",
                  corTexto: "#ffffff",
                },
                {
                  resposta: "Adequada",
                  racas: [
                    { raca: "Branca", quantidade: 5, percentual: 50 },
                    { raca: "Preta", quantidade: 4, percentual: 40 },
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
    expect(screen.getAllByText("Branca").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preta").length).toBeGreaterThan(0);

    const textoTela = document.body.textContent ?? "";
    expect(textoTela.indexOf("Adequada")).toBeLessThan(
      textoTela.indexOf("Inadequada"),
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("60%").length).toBeGreaterThan(0);
  });

  it("deve exibir Vazio quando não houver quantidade para raça", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacas
        dados={{
          titulo: "Consolidado por Raças",
          questoes: [
            {
              questaoId: 2,
              questaoNome: "Questão 2",
              totalEstudantes: 5,
              percentualTotal: 100,
              totaisPorRaca: [
                { raca: "Branca", quantidade: 5, percentual: 100 },
                { raca: "Preta", quantidade: 0, percentual: 0 },
              ],
              respostas: [
                {
                  resposta: "Sim",
                  racas: [{ raca: "Branca", quantidade: 5, percentual: 100 }],
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
