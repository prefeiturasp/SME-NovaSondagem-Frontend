import NovaSondagemServico from "../../core/servico/servico";
import ProficienciaService from "./ProficienciaService";

jest.mock("../../core/servico/servico");

describe("ProficienciaService", () => {
  const token = "token-teste";
  const idDisciplina = 4;
  const modalidade = 3;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar endpoint com caminho e headers corretos e retornar dados mapeados/ordenados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 2, nome: "Leitura" },
        { id: 1, nome: "Capacidade Leitora" },
      ],
    });

    const resultado = await ProficienciaService({
      token,
      idDisciplina,
      modalidade,
    });

    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      `/Proficiencia/componente-curricular/${idDisciplina}/modalidade/${modalidade}`,
      {
        headers: { "X-Token-Principal": token },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "Capacidade Leitora" },
      { value: 2, label: "Leitura" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await ProficienciaService({
      token,
      idDisciplina,
      modalidade,
    });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await ProficienciaService({
      token,
      idDisciplina,
      modalidade,
    });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("erro de rede"),
    );

    const resultado = await ProficienciaService({
      token,
      idDisciplina,
      modalidade,
    });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
