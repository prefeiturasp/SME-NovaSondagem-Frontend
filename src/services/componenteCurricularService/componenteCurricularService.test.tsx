import NovaSondagemServico from "../../core/servico/servico";
import ComponenteCurricularService from "./componenteCurricularService";

jest.mock("../../core/servico/servico");

describe("ComponenteCurricularService", () => {
  const token = "token-teste";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar endpoint com headers corretos e retornar dados mapeados/ordenados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 2, nome: "Matemática" },
        { id: 1, nome: "Arte" },
      ],
    });

    const resultado = await ComponenteCurricularService({ token });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/ComponenteCurricular",
      {
        headers: { "X-Token-Principal": token },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "Arte" },
      { value: 2, label: "Matemática" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await ComponenteCurricularService({ token });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await ComponenteCurricularService({ token });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("erro de rede"),
    );

    const resultado = await ComponenteCurricularService({ token });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
