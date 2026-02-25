import { render, screen } from "@testing-library/react";
import ListaDinamicaRelatorio from "./listaDinamicaRelatorio";

jest.mock("../celulaColorida/celulaColorida", () => (props: any) => {
  const respostaAtual = Array.isArray(props.resposta)
    ? props.resposta[0]
    : props.resposta;

  const opcaoSelecionada = props.opcaoResposta.find(
    (opcao: any) => opcao.id === respostaAtual?.opcaoRespostaId,
  );

  return (
    <div data-testid="celula-colorida-mock">
      {opcaoSelecionada?.descricaoOpcaoResposta ?? "Vazio"}
    </div>
  );
});

const criarDados = (tituloTabelaRespostas: string) => ({
  tituloTabelaRespostas,
  legenda: [],
  estudantes: [
    {
      linguaPortuguesaSegundaLingua: true,
      numeroAlunoChamada: 1,
      codigo: 123,
      nome: "Aluno 1",
      pap: true,
      aee: true,
      possuiDeficiencia: true,
      codigoEol: "000123",
      raca: "Branca",
      genero: "F",
      coluna: [
        {
          idCiclo: 1,
          descricaoColuna: "B1",
          PeriodoBimestreAtivo: true,
          questaoSubrespostaId: null,
          opcaoResposta: [
            {
              id: 10,
              ordem: 1,
              descricaoOpcaoResposta: "Adequada",
              corFundo: "#7ED957",
              corTexto: "#363636",
              legenda: "Recuperou corretamente",
            },
          ],
          resposta: {
            id: 99,
            opcaoRespostaId: 10,
          },
        },
      ],
    },
  ],
});

describe("ListaDinamicaRelatorio", () => {
  it("deve renderizar mensagem quando dados for null", () => {
    render(<ListaDinamicaRelatorio dados={null} />);

    expect(
      screen.getByText("Nenhum dado disponível para exibir."),
    ).toBeInTheDocument();
  });

  it("deve renderizar mensagem quando lista de estudantes estiver vazia", () => {
    render(
      <ListaDinamicaRelatorio
        dados={{
          tituloTabelaRespostas: "Leitura",
          estudantes: [],
          legenda: [],
        }}
      />,
    );

    expect(
      screen.getByText("Nenhum dado disponível para exibir."),
    ).toBeInTheDocument();
  });

  it("deve renderizar tabela com colunas fixas e dinâmicas", () => {
    render(<ListaDinamicaRelatorio dados={criarDados("Leitura")} />);

    expect(screen.getAllByText("Número chamada").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nome").length).toBeGreaterThan(0);
    expect(screen.getAllByText("EOL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Raça").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gênero").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Leitura").length).toBeGreaterThan(0);
    expect(screen.getAllByText("B1").length).toBeGreaterThan(0);

    expect(screen.getByText("Aluno 1")).toBeInTheDocument();
    expect(screen.getByText("Branca")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();

    expect(screen.getByTestId("celula-colorida-mock")).toHaveTextContent(
      "Adequada",
    );
  });

  it("deve exibir coluna de LP quando título for Sistema de escrita", () => {
    render(<ListaDinamicaRelatorio dados={criarDados("Sistema de escrita")} />);

    expect(screen.getAllByText("LP como 2ª língua?").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
  });

  it("não deve exibir coluna de LP para outros títulos", () => {
    render(<ListaDinamicaRelatorio dados={criarDados("Leitura")} />);

    expect(screen.queryAllByText("LP como 2ª língua?")).toHaveLength(0);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
