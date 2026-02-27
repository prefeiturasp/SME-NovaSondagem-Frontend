import axios from "axios";
import { getSgpApiUrl } from "../../config";
import AnoLetivoService from "./anoLetivoService";

jest.mock("axios");
jest.mock("../../config", () => ({
  getSgpApiUrl: jest.fn(),
}));

describe("AnoLetivoService", () => {
  const token = "token-teste";
  const baseUrl = "http://sgp.api";

  beforeEach(() => {
    jest.clearAllMocks();
    (getSgpApiUrl as jest.Mock).mockReturnValue(baseUrl);
  });

  it("deve chamar endpoint com URL e headers corretos e retornar dados mapeados/ordenados", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 2, nome: "B" },
        { id: 1, nome: "a" },
      ],
    });

    const resultado = await AnoLetivoService({ token });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/true/anos-letivos?anoMinimo=2026`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "a" },
      { value: 2, label: "B" },
    ]);

    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it("deve mapear itens primitivos quando resposta não for objeto", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [2027, 2026],
    });

    const resultado = await AnoLetivoService({ token });

    expect(resultado).toEqual([
      { value: 2026, label: "2026" },
      { value: 2027, label: "2027" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await AnoLetivoService({ token });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Erro de rede"));

    const resultado = await AnoLetivoService({ token });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
