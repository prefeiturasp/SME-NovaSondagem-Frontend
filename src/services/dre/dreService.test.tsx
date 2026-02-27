import axios from "axios";
import { getSgpApiUrl } from "../../config";
import DreService from "./dreService";

jest.mock("axios");
jest.mock("../../config", () => ({
  getSgpApiUrl: jest.fn(),
}));

describe("DreService", () => {
  const token = "token-teste";
  const anoLetivo = 2026;
  const baseUrl = "http://sgp.api";

  beforeEach(() => {
    jest.clearAllMocks();
    (getSgpApiUrl as jest.Mock).mockReturnValue(baseUrl);
  });

  it("deve chamar endpoint com URL e headers corretos e retornar dados mapeados/ordenados", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { codigo: 2, nome: "DRE Penha" },
        { codigo: 1, nome: "DRE Butantã" },
      ],
    });

    const resultado = await DreService({ token, anoLetivo });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "DRE Butantã" },
      { value: 2, label: "DRE Penha" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await DreService({ token, anoLetivo });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await DreService({ token, anoLetivo });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("erro de rede"));

    const resultado = await DreService({ token, anoLetivo });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
