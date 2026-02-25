import axios from "axios";
import { getSgpApiUrl } from "../../config";
import UeService from "./ueService";

jest.mock("axios");
jest.mock("../../config", () => ({
  getSgpApiUrl: jest.fn(),
}));

describe("UeService", () => {
  const token = "token-teste";
  const dreId = 123;
  const anoLetivo = 2026;
  const modalidade = 3;
  const baseUrl = "http://sgp.api";

  beforeEach(() => {
    jest.clearAllMocks();
    (getSgpApiUrl as jest.Mock).mockReturnValue(baseUrl);
  });

  it("deve chamar endpoint sem modalidade quando modalidade não for informada", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { codigo: 2, nome: "UE B" },
        { codigo: 1, nome: "UE A" },
      ],
    });

    const resultado = await UeService({ token, dreId, anoLetivo });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/${dreId}/ues?anoLetivo=${anoLetivo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "UE A" },
      { value: 2, label: "UE B" },
    ]);
  });

  it("deve chamar endpoint com modalidade quando modalidade for informada", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ codigo: 10, nome: "UE Modalidade" }],
    });

    const resultado = await UeService({ token, dreId, anoLetivo, modalidade });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/dres/${dreId}/ues?anoLetivo=${anoLetivo}&modalidade=${modalidade}`,
      expect.any(Object),
    );
    expect(resultado).toEqual([{ value: 10, label: "UE Modalidade" }]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await UeService({ token, dreId, anoLetivo, modalidade });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await UeService({ token, dreId, anoLetivo, modalidade });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("erro de rede"));

    const resultado = await UeService({ token, dreId, anoLetivo, modalidade });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
