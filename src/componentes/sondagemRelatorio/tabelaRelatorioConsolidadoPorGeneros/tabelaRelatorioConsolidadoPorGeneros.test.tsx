import { render, screen } from "@testing-library/react";
import TabelaRelatorioConsolidadoPorGeneros from "./tabelaRelatorioConsolidadoPorGeneros";

describe("TabelaRelatorioConsolidadoPorGeneros", () => {
  it("deve renderizar null quando dados for null", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorGeneros dados={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve exibir loading quando isLoading for true", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorGeneros dados={null} isLoading />,
    );

    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando questoes vier vazio", () => {
    render(
      <TabelaRelatorioConsolidadoPorGeneros
        dados={{
          titulo: "Consolidado por Gêneros",
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

  it("deve renderizar colunas por gênero, respostas ordenadas e total", () => {
    render(
      <TabelaRelatorioConsolidadoPorGeneros
        dados={{
          titulo: "Consolidado por Gêneros",
          questoes: [
            {
              questaoId: 1,
              questaoNome: "Questão 1",
              totalEstudantes: 10,
              percentualTotal: 100,
              totaisPorGenero: [
                { genero: "Feminino", quantidade: 6, percentual: 60 },
                { genero: "Masculino", quantidade: 4, percentual: 40 },
              ],
              respostas: [
                {
                  resposta: "Inadequada",
                  generos: [
                    { genero: "Feminino", quantidade: 1, percentual: 10 },
                  ],
                  total: 1,
                  percentual: 10,
                  ordem: 2,
                  corFundo: "#ff0000",
                  corTexto: "#ffffff",
                },
                {
                  resposta: "Adequada",
                  generos: [
                    { genero: "Feminino", quantidade: 5, percentual: 50 },
                    { genero: "Masculino", quantidade: 4, percentual: 40 },
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
    expect(screen.getAllByText("Gênero: Feminino").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gênero: Masculino").length).toBeGreaterThan(0);

    const textoTela = document.body.textContent ?? "";
    expect(textoTela.indexOf("Adequada")).toBeLessThan(
      textoTela.indexOf("Inadequada"),
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("60%").length).toBeGreaterThan(0);
  });

  it("deve exibir Vazio quando não houver quantidade para gênero", () => {
    render(
      <TabelaRelatorioConsolidadoPorGeneros
        dados={{
          titulo: "Consolidado por Gêneros",
          questoes: [
            {
              questaoId: 2,
              questaoNome: "Questão 2",
              totalEstudantes: 5,
              percentualTotal: 100,
              totaisPorGenero: [
                { genero: "Feminino", quantidade: 5, percentual: 100 },
                { genero: "Masculino", quantidade: 0, percentual: 0 },
              ],
              respostas: [
                {
                  resposta: "Sim",
                  generos: [
                    { genero: "Feminino", quantidade: 5, percentual: 100 },
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
