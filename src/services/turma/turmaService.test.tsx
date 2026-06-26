import axios from "axios";
import { getSgpApiUrl } from "../../config";
import TurmaService from "./turmaService";

jest.mock("axios");
jest.mock("../../config", () => ({
  getSgpApiUrl: jest.fn(),
}));

describe("TurmaService", () => {
  const token = "token-teste";
  const urId = 100;
  const modalidade = 3;
  const anoLetivo = 2026;
  const baseUrl = "http://sgp.api";

  beforeEach(() => {
    jest.clearAllMocks();
    (getSgpApiUrl as jest.Mock).mockReturnValue(baseUrl);
  });

  it("deve chamar endpoint com URL e headers corretos usando valor padrão de consideraNovosAnosInfantil", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { codigo: 2, nome: "2ºA", ano: 2 },
        { codigo: 1, nome: "1ºA", ano: 1 },
      ],
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/ues/${urId}/turmas?anoLetivo=${anoLetivo}&modalidade=${modalidade}&consideraNovosAnosInfantil=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "1ºA", ano: 1 },
      { value: 2, label: "2ºA", ano: 2 },
    ]);
  });

  it("deve chamar endpoint com consideraNovosAnosInfantil informado", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ codigo: 10, nome: "3ºB", ano: 3 }],
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
      consideraNovosAnosInfantil: false,
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/ues/${urId}/turmas?anoLetivo=${anoLetivo}&modalidade=${modalidade}&consideraNovosAnosInfantil=false`,
      expect.any(Object),
    );
    expect(resultado).toEqual([{ value: 10, label: "3ºB", ano: 3 }]);
  });

  it("deve enviar periodo quando informado", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ codigo: 20, nome: "4ºC", ano: 4 }],
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
      periodo: 2,
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/ues/${urId}/turmas?anoLetivo=${anoLetivo}&modalidade=${modalidade}&consideraNovosAnosInfantil=true&periodo=2`,
      expect.any(Object),
    );
    expect(resultado).toEqual([{ value: 20, label: "4ºC", ano: 4 }]);
  });

  it("deve enviar anosTurma como chaves repetidas quando informado", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ codigo: 1, nome: "1ºA", ano: 1 }],
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
      anosTurma: ["1", "2", "3"],
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/ues/${urId}/turmas?anoLetivo=${anoLetivo}&modalidade=${modalidade}&consideraNovosAnosInfantil=true&anosTurma=1&anosTurma=2&anosTurma=3`,
      expect.any(Object),
    );
    expect(resultado).toEqual([{ value: 1, label: "1ºA", ano: 1 }]);
  });

  it("não deve enviar anosTurma quando não informado", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ codigo: 2, nome: "2ºA", ano: 2 }],
    });

    await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/ues/${urId}/turmas?anoLetivo=${anoLetivo}&modalidade=${modalidade}&consideraNovosAnosInfantil=true`,
      expect.any(Object),
    );
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
    });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
    });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("erro de rede"));

    const resultado = await TurmaService({
      token,
      urId,
      modalidade,
      anoLetivo,
    });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
