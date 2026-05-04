import { render, screen } from "@testing-library/react";
import RelatorioConsolidado from "./relatorioConsolidado";

jest.mock(
  "../../componentes/sondagemRelatorio/conteudoRelatorioConsolidado/conteudoRelatorioConsolidado",
  () => () => (
    <div data-testid="conteudo-relatorio-consolidado-mock">
      Conteúdo Relatório Consolidado
    </div>
  ),
);

describe("RelatorioConsolidado", () => {
  it("deve renderizar o componente de conteúdo consolidado", () => {
    render(<RelatorioConsolidado />);

    expect(
      screen.getByTestId("conteudo-relatorio-consolidado-mock"),
    ).toBeInTheDocument();
  });

  it("deve ter a classe css da página", () => {
    const { container } = render(<RelatorioConsolidado />);

    const divRelatorio = container.querySelector(".classtudoRelatorio");
    expect(divRelatorio).toBeInTheDocument();
  });
});
