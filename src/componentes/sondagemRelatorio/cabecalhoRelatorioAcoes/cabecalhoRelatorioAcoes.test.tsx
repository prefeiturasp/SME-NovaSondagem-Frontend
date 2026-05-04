import { fireEvent, render, screen } from "@testing-library/react";
import CabecalhoRelatorioAcoes from "./cabecalhoRelatorioAcoes";

describe("CabecalhoRelatorioAcoes", () => {
  it("deve renderizar título e acionar voltar/cancelar", () => {
    const onVoltar = jest.fn();
    const onCancelar = jest.fn();

    render(
      <CabecalhoRelatorioAcoes
        titulo="Sondagem Consolidado"
        onVoltar={onVoltar}
        onCancelar={onCancelar}
        onGerar={jest.fn()}
        menuGerarDesabilitado={false}
        botaoGerarDesabilitado={false}
        loadingGerar={false}
      />,
    );

    expect(screen.getByText("Sondagem Consolidado")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancelar).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(onVoltar).toHaveBeenCalled();
  });
});
