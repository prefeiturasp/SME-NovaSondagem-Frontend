import NovaSondagemServico from "../../core/servico/servico";
import GeneroSexoService from "./generoSexoService";

jest.mock("../../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("GeneroSexoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve mapear retorno para value/label", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: "1", descricao: "Feminino" },
        { id: "2", descricao: "Masculino" },
      ],
    });

    const resultado = await GeneroSexoService({ token: "token" });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith("/GeneroSexo", {
      headers: { "X-Token-Principal": "token" },
    });
    expect(resultado).toEqual([
      { value: "1", label: "Feminino" },
      { value: "2", label: "Masculino" },
    ]);
  });

  it("deve retornar null quando não houver dados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const resultado = await GeneroSexoService({ token: "token" });
    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("erro"),
    );

    const resultado = await GeneroSexoService({ token: "token" });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
