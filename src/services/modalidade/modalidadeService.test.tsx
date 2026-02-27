import axios from "axios";
import { getSgpApiUrl } from "../../config";
import ModalidadeService from "./modalidadeService";

jest.mock("axios");
jest.mock("../../config", () => ({
  getSgpApiUrl: jest.fn(),
}));

describe("ModalidadeService", () => {
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
        { id: 2, descricao: "Ensino Fundamental" },
        { id: 1, descricao: "Educação Infantil" },
      ],
    });

    const resultado = await ModalidadeService({ token, anoLetivo });

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/v1/abrangencias/false/modalidades/?anoLetivo=${anoLetivo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    expect(resultado).toEqual([
      { value: 1, label: "Educação Infantil" },
      { value: 2, label: "Ensino Fundamental" },
    ]);
  });

  it("deve retornar null quando API retornar lista vazia", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    const resultado = await ModalidadeService({ token, anoLetivo });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando API retornar payload inválido", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const resultado = await ModalidadeService({ token, anoLetivo });

    expect(resultado).toBeNull();
  });

  it("deve retornar null quando ocorrer erro na requisição", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("erro de rede"));

    const resultado = await ModalidadeService({ token, anoLetivo });

    expect(resultado).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
