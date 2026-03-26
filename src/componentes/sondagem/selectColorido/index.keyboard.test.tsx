import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectColorido from "./index";

jest.mock("antd", () => {
  const React = require("react");

  const Empty = ({ description }: any) => <div>{description}</div>;
  Empty.PRESENTED_IMAGE_SIMPLE = "simple";

  const Select = React.forwardRef(
    ({ onOpenChange, onInputKeyDown, className }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        focus: jest.fn(),
        blur: jest.fn(),
      }));

      return (
        <div className={className}>
          <button data-testid="open" onClick={() => onOpenChange?.(true)}>
            abrir
          </button>
          <input data-testid="input" onKeyDown={onInputKeyDown} />
        </div>
      );
    },
  );

  return { Empty, Select };
});

describe("SelectColorido - branches de teclado", () => {
  it("ignora ArrowDown/ArrowUp quando dropdown está aberto", () => {
    const onChange = jest.fn();

    render(
      <SelectColorido
        options={[{ value: 1, label: "A", ordem: 1 }]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByTestId("open"));
    fireEvent.keyDown(screen.getByTestId("input"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByTestId("input"), { key: "ArrowUp" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("seleciona por tecla numérica quando dropdown está aberto", () => {
    const onChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <SelectColorido
        options={[
          {
            value: 11,
            label: "Opção 1",
            ordem: 1,
            corFundo: "#111111",
            corTexto: "#FFFFFF",
          },
          {
            value: 22,
            label: "Opção 2",
            ordem: 2,
            corFundo: "#222222",
            corTexto: "#FFFFFF",
          },
        ]}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByTestId("open"));

    const input = screen.getByTestId("input");
    const evento = new KeyboardEvent("keydown", {
      key: "2",
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(evento);

    expect(onChange).toHaveBeenCalledWith(
      22,
      expect.objectContaining({ value: 22 }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
