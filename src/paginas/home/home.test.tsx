import { render, screen } from "@testing-library/react";
import Home from "./home";

jest.mock("../../componentes/sondagem/conteudo/conteudo", () => () => (
  <div data-testid="conteudo">Conteudo</div>
));

describe("Home component", () => {
  it("should render Conteudo component", () => {
    render(<Home />);

    expect(screen.getByTestId("conteudo")).toBeInTheDocument();
  });

  it("should render with correct className", () => {
    const { container } = render(<Home />);

    const mainDiv = container.querySelector(".classtudo");
    expect(mainDiv).toBeInTheDocument();
  });
});
