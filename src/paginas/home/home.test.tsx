import { render, screen } from "@testing-library/react";
import Home from "./home";

jest.mock("../../componentes/sondagem/cabecalho/cabecalho", () => () => (
  <div data-testid="cabecalho">Cabecalho</div>
));

jest.mock("../../componentes/sondagem/conteudo/conteudo", () => () => (
  <div data-testid="conteudo">Conteudo</div>
));

jest.mock("../../componentes/sondagem/rodape/rodape", () => () => (
  <div data-testid="rodape">Rodape</div>
));

describe("Home component", () => {
  it("should render Cabecalho, Conteudo and Rodape", () => {
    render(<Home />);

    expect(screen.getByTestId("cabecalho")).toBeInTheDocument();
    expect(screen.getByTestId("conteudo")).toBeInTheDocument();
    expect(screen.getByTestId("rodape")).toBeInTheDocument();
  });
});
