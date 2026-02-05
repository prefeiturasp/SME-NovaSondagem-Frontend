import { render, screen } from "@testing-library/react";
import Relatorio from "./relatorio";

describe("Relatorio", () => {
  it("deve renderizar o componente", () => {
    render(<Relatorio />);

    const elemento = screen.getByText("ESTE EH O MEU RELATORIO");
    expect(elemento).toBeInTheDocument();
  });

  it("deve ter a classe CSS relatorio", () => {
    const { container } = render(<Relatorio />);

    const divRelatorio = container.querySelector(".relatorio");
    expect(divRelatorio).toBeInTheDocument();
  });

  it("deve renderizar uma div com o texto correto", () => {
    const { container } = render(<Relatorio />);

    const divRelatorio = container.querySelector(".relatorio");
    expect(divRelatorio).toHaveTextContent("ESTE EH O MEU RELATORIO");
  });
});
