import { render, screen } from "@testing-library/react";
import Relatorio from "./relatorio";

jest.mock(
  "../../componentes/sondagemRelatorio/conteudoRelatorio/conteudoRelatorio",
  () => () => (
    <div data-testid="conteudo-relatorio-mock">Conteúdo Relatório</div>
  ),
);

describe("Relatorio", () => {
  it("deve renderizar o componente", () => {
    render(<Relatorio />);

    const elemento = screen.getByTestId("conteudo-relatorio-mock");
    expect(elemento).toBeInTheDocument();
  });

  it("deve ter a classe CSS da página", () => {
    const { container } = render(<Relatorio />);

    const divRelatorio = container.querySelector(".classtudoRelatorio");
    expect(divRelatorio).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo do relatório", () => {
    render(<Relatorio />);

    expect(screen.getByText("Conteúdo Relatório")).toBeInTheDocument();
  });
});
