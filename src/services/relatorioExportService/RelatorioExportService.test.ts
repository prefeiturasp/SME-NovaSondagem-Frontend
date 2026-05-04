import NovaSondagemServico from "../../core/servico/servico";
import RelatorioExportService from "./RelatorioExportService";

jest.mock("../../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("RelatorioExportService", () => {
  const parametrosBase = {
    extensaoRelatorio: 1 as const,
    turmaId: 10,
    proficienciaId: 20,
    componenteCurricularId: 30,
    modalidade: 1,
    anoLetivo: 2026,
    ueCodigo: "000123",
    token: "token-teste",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna true e envia query string completa quando semestre e bimestre são informados", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioExportService({
      ...parametrosBase,
      semestreId: 2,
      bimestreId: 3,
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/sondagem-por-turma/exportar?extensaoRelatorio=1&turmaId=10&proficienciaId=20&componenteCurricularId=30&modalidade=1&anoLetivo=2026&ueCodigo=000123&semestreId=2&bimestreId=3",
      {
        headers: { "X-Token-Principal": "token-teste" },
      },
    );
  });

  it("não envia semestre e bimestre quando valores são null ou undefined", async () => {
    (NovaSondagemServico.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const resultado = await RelatorioExportService({
      ...parametrosBase,
      extensaoRelatorio: 4,
      semestreId: null,
      bimestreId: undefined,
    });

    expect(resultado).toBe(true);
    expect(NovaSondagemServico.get).toHaveBeenCalledWith(
      "/Relatorio/sondagem-por-turma/exportar?extensaoRelatorio=4&turmaId=10&proficienciaId=20&componenteCurricularId=30&modalidade=1&anoLetivo=2026&ueCodigo=000123",
      {
        headers: { "X-Token-Principal": "token-teste" },
      },
    );
  });

  it("retorna false quando ocorre erro no endpoint", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (NovaSondagemServico.get as jest.Mock).mockRejectedValueOnce(
      new Error("falha ao exportar"),
    );

    const resultado = await RelatorioExportService({
      ...parametrosBase,
      semestreId: 1,
      bimestreId: 4,
    });

    expect(resultado).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erro ao exportar relatório:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
