import { render, screen } from "@testing-library/react";
import TabelaRelatorioConsolidadoPorRacaGenero from "./tabelaRelatorioConsolidadoPorRacaGenero";

describe("TabelaRelatorioConsolidadoPorRacaGenero", () => {
  it("deve renderizar null quando dados for null", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorRacaGenero dados={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve exibir loading quando isLoading for true", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorRacaGenero dados={null} isLoading />,
    );

    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando questoes vier vazio", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={{
          titulo: "Consolidado por Raça e Gênero",
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

  it("deve renderizar colunas agrupadas por gênero e linhas por resposta", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={{
          titulo: "Consolidado por Raça e Gênero",
          questoes: [
            {
              questaoId: 1,
              questaoNome: "Sistema de Escrita (1º ano)",
              totalEstudantes: 100,
              percentualTotal: 100,
              totaisPorGenero: [
                {
                  genero: "Feminino",
                  sigla: "F",
                  quantidade: 50,
                  percentual: 50,
                },
                {
                  genero: "Masculino",
                  sigla: "M",
                  quantidade: 50,
                  percentual: 50,
                },
              ],
              totaisPorGeneroComRacas: [
                {
                  genero: "Feminino",
                  racas: [
                    { raca: "BRANCA", quantidade: 60, percentual: 60 },
                    { raca: "PRETA", quantidade: 40, percentual: 40 },
                  ],
                },
                {
                  genero: "Masculino",
                  racas: [
                    { raca: "BRANCA", quantidade: 55, percentual: 55 },
                    { raca: "Preta", quantidade: 45, percentual: 45 },
                  ],
                },
              ],
              respostas: [
                {
                  resposta: "Escrita pré-silábica",
                  ordem: 2,
                  total: 20,
                  percentual: 20,
                  corFundo: "#ff4d4f",
                  corTexto: "#ffffff",
                  generosComRacas: [
                    {
                      genero: "Feminino",
                      racas: [
                        { raca: "Branca", quantidade: 12, percentual: 12 },
                      ],
                    },
                    {
                      genero: "Masculino",
                      racas: [{ raca: "Preta", quantidade: 8, percentual: 8 }],
                    },
                  ],
                },
                {
                  resposta: "Escrita Alfabética",
                  ordem: 1,
                  total: 80,
                  percentual: 80,
                  corFundo: "#52c41a",
                  corTexto: "#000000",
                  generosComRacas: [
                    {
                      genero: "Feminino",
                      racas: [
                        { raca: "Branca", quantidade: 48, percentual: 48 },
                        { raca: "Preta", quantidade: 32, percentual: 32 },
                      ],
                    },
                    {
                      genero: "Masculino",
                      racas: [
                        { raca: "Branca", quantidade: 55, percentual: 55 },
                        { raca: "Preta", quantidade: 0, percentual: 0 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(
      screen.getAllByText("Sistema de Escrita (1º ano)").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Gênero: Feminino").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gênero: Masculino").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Branca").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preta").length).toBeGreaterThan(0);

    const textoTela = document.body.textContent ?? "";
    expect(textoTela.indexOf("Escrita Alfabética")).toBeLessThan(
      textoTela.indexOf("Escrita pré-silábica"),
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("Vazio").length).toBeGreaterThan(0);
  });

  it("deve montar colunas a partir das respostas quando totais não vierem detalhados por raça", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={{
          titulo: "Consolidado por Raça e Gênero",
          questoes: [
            {
              questaoId: 2,
              questaoNome: "Escrita (2º ano)",
              totalEstudantes: 20,
              percentualTotal: 100,
              totaisPorGenero: [
                {
                  genero: "Feminino",
                  sigla: "F",
                  quantidade: 10,
                  percentual: 50,
                },
                {
                  genero: "Masculino",
                  sigla: "M",
                  quantidade: 10,
                  percentual: 50,
                },
              ],
              respostas: [
                {
                  resposta: "PS",
                  ordem: 1,
                  total: 10,
                  percentual: 50,
                  corFundo: "#ff4d4f",
                  corTexto: "#ffffff",
                  generosComRacas: [
                    {
                      genero: "Feminino",
                      racas: [{ raca: "PARDA", quantidade: 6, percentual: 60 }],
                    },
                    {
                      genero: "Masculino",
                      racas: [{ raca: "PRETA", quantidade: 4, percentual: 40 }],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.getAllByText("Gênero: Feminino").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gênero: Masculino").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Parda").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preta").length).toBeGreaterThan(0);
  });

  it("deve normalizar os rótulos de raça conforme o protótipo", () => {
    render(
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={{
          titulo: "Consolidado por Raça e Gênero",
          questoes: [
            {
              questaoId: 3,
              questaoNome: "Produção de Texto (3º ano)",
              totalEstudantes: 10,
              percentualTotal: 100,
              totaisPorGeneroComRacas: [
                {
                  genero: "Não informado",
                  racas: [
                    { raca: "NAO INFORMADA", quantidade: 2, percentual: 50 },
                    { raca: "Não informado", quantidade: 2, percentual: 50 },
                    {
                      raca: "RECUSOU INFORMAR",
                      quantidade: 1,
                      percentual: 25,
                    },
                  ],
                },
              ],
              respostas: [
                {
                  resposta: "Sem preenchimento",
                  ordem: 1,
                  total: 5,
                  percentual: 50,
                  corFundo: "#ffffff",
                  corTexto: "#363636",
                  generosComRacas: [
                    {
                      genero: "Não informado",
                      racas: [
                        {
                          raca: "RECUSOU INFORMAR",
                          quantidade: 1,
                          percentual: 20,
                        },
                        {
                          raca: "NAO INFORMADA",
                          quantidade: 4,
                          percentual: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.getAllByText("Não informada").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Não informado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preferiu não informar").length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText("NAO INFORMADA")).not.toBeInTheDocument();
    expect(screen.queryByText("RECUSOU INFORMAR")).not.toBeInTheDocument();
  });

  it("deve manter header vazio para raça vazia", () => {
    const { container } = render(
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={{
          titulo: "Consolidado por Raça e Gênero",
          questoes: [
            {
              questaoId: 4,
              questaoNome: "Questão 4",
              totalEstudantes: 6,
              percentualTotal: 100,
              totaisPorGeneroComRacas: [
                {
                  genero: "Não informado",
                  racas: [{ raca: "", quantidade: 6, percentual: 100 }],
                },
              ],
              respostas: [
                {
                  resposta: "PS",
                  ordem: 1,
                  total: 6,
                  percentual: 100,
                  corFundo: "#ff3131",
                  corTexto: "#ffffff",
                  generosComRacas: [
                    {
                      genero: "Não informado",
                      racas: [{ raca: "", quantidade: 6, percentual: 100 }],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.queryByText("Não informada")).not.toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("th")).some(
        (coluna) => coluna.textContent?.trim() === "",
      ),
    ).toBe(true);
  });
});
