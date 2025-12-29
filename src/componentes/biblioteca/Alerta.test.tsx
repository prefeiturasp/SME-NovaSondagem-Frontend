import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alerta from "./Alerta";

describe("Componente Alerta", () => {
  const alertaMock = {
    tipo: "success",
    id: "1",
    mensagem: "Operação realizada com sucesso!",
  };

  it("deve renderizar o alerta com a mensagem correta", () => {
    render(<Alerta alerta={alertaMock} />);

    expect(
      screen.getByText("Operação realizada com sucesso!")
    ).toBeInTheDocument();
  });

  it("deve renderizar o alerta com o tipo correto", () => {
    const { container } = render(<Alerta alerta={alertaMock} />);

    const alertElement = container.querySelector(".alert-success");
    expect(alertElement).toBeInTheDocument();
  });

  it("deve renderizar alerta de diferentes tipos (danger, warning, info)", () => {
    const alertaDanger = { ...alertaMock, tipo: "danger" };
    const { container: containerDanger } = render(
      <Alerta alerta={alertaDanger} />
    );
    expect(containerDanger.querySelector(".alert-danger")).toBeInTheDocument();

    const alertaWarning = { ...alertaMock, tipo: "warning" };
    const { container: containerWarning } = render(
      <Alerta alerta={alertaWarning} />
    );
    expect(
      containerWarning.querySelector(".alert-warning")
    ).toBeInTheDocument();

    const alertaInfo = { ...alertaMock, tipo: "info" };
    const { container: containerInfo } = render(<Alerta alerta={alertaInfo} />);
    expect(containerInfo.querySelector(".alert-info")).toBeInTheDocument();
  });

  it("deve renderizar botão de fechar quando closable é true", () => {
    const onCloseMock = jest.fn();
    render(
      <Alerta alerta={alertaMock} closable={true} onClose={onCloseMock} />
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("não deve renderizar botão de fechar quando closable é false", () => {
    render(<Alerta alerta={alertaMock} closable={false} />);

    const closeButton = screen.queryByRole("button", { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it("deve chamar onClose ao clicar no botão de fechar", () => {
    const onCloseMock = jest.fn();
    render(
      <Alerta alerta={alertaMock} closable={true} onClose={onCloseMock} />
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledWith("1");
  });

  it("deve renderizar mensagemClick quando fornecida", () => {
    const alertaComClick = {
      ...alertaMock,
      mensagemClick: "Clique aqui",
    };

    render(<Alerta alerta={alertaComClick} />);

    expect(screen.getByText("Clique aqui")).toBeInTheDocument();
  });

  it("deve chamar onClickMessage ao clicar na mensagem clicável", () => {
    const onClickMessageMock = jest.fn();
    const alertaComClick = {
      ...alertaMock,
      mensagemClick: "Clique aqui",
    };

    render(
      <Alerta alerta={alertaComClick} onClickMessage={onClickMessageMock} />
    );

    const clickableMessage = screen.getByText("Clique aqui");
    fireEvent.click(clickableMessage);

    expect(onClickMessageMock).toHaveBeenCalledTimes(1);
  });

  it("deve aplicar estiloTitulo personalizado quando fornecido", () => {
    const estiloCustomizado = { fontSize: "24px", color: "red" };
    const alertaComEstilo = {
      ...alertaMock,
      estiloTitulo: estiloCustomizado,
    };

    const { container } = render(<Alerta alerta={alertaComEstilo} />);
    const boldElement = container.querySelector("b");

    expect(boldElement).toHaveStyle({ fontSize: "24px", color: "red" });
  });

  it("deve aplicar fontSize padrão quando estiloTitulo não é fornecido", () => {
    const { container } = render(<Alerta alerta={alertaMock} />);
    const boldElement = container.querySelector("b");

    expect(boldElement).toHaveStyle({ fontSize: "18px" });
  });

  it("deve aplicar marginBottom quando fornecido", () => {
    const alertaComMargin = {
      ...alertaMock,
      marginBottom: "20px",
    };

    const { container } = render(<Alerta alerta={alertaComMargin} />);
    const alertElement = container.querySelector(".alert");

    expect(alertElement).toHaveStyle({ marginBottom: "20px" });
  });

  it("deve aplicar className personalizada quando fornecida", () => {
    const { container } = render(
      <Alerta alerta={alertaMock} className="custom-class" />
    );

    const alertElement = container.querySelector(".custom-class");
    expect(alertElement).toBeInTheDocument();
  });

  it("deve renderizar com role alert", () => {
    const { container } = render(<Alerta alerta={alertaMock} />);
    const alertElement = container.querySelector('[role="alert"]');

    expect(alertElement).toBeInTheDocument();
  });

  it("deve ter as classes corretas do Bootstrap", () => {
    const { container } = render(<Alerta alerta={alertaMock} />);
    const alertElement = container.querySelector(".alert");

    expect(alertElement).toHaveClass("alert");
    expect(alertElement).toHaveClass("alert-dismissible");
    expect(alertElement).toHaveClass("fade");
    expect(alertElement).toHaveClass("show");
    expect(alertElement).toHaveClass("text-center");
  });

  it("deve funcionar com id numérico", () => {
    const onCloseMock = jest.fn();
    const alertaComIdNumerico = {
      ...alertaMock,
      id: 123,
    };

    render(
      <Alerta
        alerta={alertaComIdNumerico}
        closable={true}
        onClose={onCloseMock}
      />
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledWith(123);
  });

  it("deve ter o botão de fechar com id correto", () => {
    const onCloseMock = jest.fn();
    render(
      <Alerta alerta={alertaMock} closable={true} onClose={onCloseMock} />
    );

    const closeButton = document.getElementById(
      "sondagem-button-fechar-alerta"
    );
    expect(closeButton).toBeInTheDocument();
  });
});
