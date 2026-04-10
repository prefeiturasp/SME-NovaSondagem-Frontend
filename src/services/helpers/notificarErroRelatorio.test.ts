import { notification } from "antd";
import { notificarErroRelatorio } from "./notificarErroRelatorio";

jest.mock("antd", () => ({
  notification: {
    error: jest.fn(),
  },
}));

describe("notificarErroRelatorio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve usar detalhes de errors quando disponíveis", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    notificarErroRelatorio({
      error: {
        response: {
          data: {
            title: "Falha validação",
            errors: {
              campoA: ["Obrigatório"],
              campoB: "Inválido",
            },
          },
        },
      },
      mensagemConsole: "Erro teste:",
      tituloNotificacao: "Erro notificação",
      mensagemPadrao: "Mensagem padrão",
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro notificação",
        description: expect.stringContaining("campoA: Obrigatório"),
      }),
    );
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.stringContaining("campoB: Inválido"),
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it("deve usar mensagem padrão quando não houver response.data", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    notificarErroRelatorio({
      error: new Error("rede"),
      mensagemConsole: "Erro teste:",
      tituloNotificacao: "Erro notificação",
      mensagemPadrao: "Mensagem padrão",
    });

    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Mensagem padrão",
      }),
    );

    consoleErrorSpy.mockRestore();
  });
});
