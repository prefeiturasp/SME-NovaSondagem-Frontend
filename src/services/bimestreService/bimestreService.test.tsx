import NovaSondagemServico from "../../core/servico/servico";
import BimestreService from "./bimestreService";

jest.mock("../../core/servico/servico");

describe("BimestreService", () => {
  const token = "token-teste";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar endpoint com headers corretos e retornar dados mapeados/ordenados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 2, descricao: "2º Bimestre" },
        { id: 1, descricao: "1º Bimestre" },
      ],
    });

    const resultado = await BimestreService({ token });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith("/Bimestre", {
      headers: { "X-Token-Principal": token },
    });

    // Deve preservar a ordem recebida da API
    expect(resultado).toEqual([
      { value: 2, label: "2º Bimestre" },
      { value: 1, label: "1º Bimestre" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await BimestreService({ token });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await BimestreService({ token });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("Erro de rede"),
    );

    const resultado = await BimestreService({ token });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
