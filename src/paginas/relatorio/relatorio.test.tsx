import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Relatorio from "./relatorio";

describe("Relatorio", () => {
  it("deve renderizar o texto do relatório", () => {
    render(<Relatorio />);
    expect(screen.getByText("ESTE EH O MEU RELATORIO")).toBeInTheDocument();
  });

  it("deve aplicar a classe CSS correta", () => {
    const { container } = render(<Relatorio />);
    const div = container.querySelector(".relatorio");
    expect(div).toBeInTheDocument();
  });
});
