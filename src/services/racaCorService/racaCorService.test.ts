import NovaSondagemServico from "../../core/servico/servico";
import RacaCorService from "./racaCorService";

jest.mock("../../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("RacaCorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve mapear retorno para value/label", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: "1", descricao: "Branca" },
        { id: "2", descricao: "Preta" },
      ],
    });

    const resultado = await RacaCorService({ token: "token" });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith("/RacaCor", {
      headers: { "X-Token-Principal": "token" },
    });
    expect(resultado).toEqual([
      { value: "1", label: "Branca" },
      { value: "2", label: "Preta" },
    ]);
  });

  it("deve retornar null quando não houver dados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const resultado = await RacaCorService({ token: "token" });
    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("erro"),
    );

    const resultado = await RacaCorService({ token: "token" });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
