import { render, waitFor } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { servicos } from "../../servicos";
import { setUserLogged, logout } from "../../redux/slices/authSlice";
import Autenticacao from "./autenticacao";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../../servicos", () => ({
  servicos: {
    post: jest.fn(),
  },
}));

const localStorageMock: unknown = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    removeItem: (key: string) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("Componente <Autenticacao />", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockSearchParams = new URLSearchParams();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("deve redirecionar quando já existe token válido", async () => {
    const futureDate = new Date(Date.now() + 60_000).toISOString();

    localStorage.setItem("authToken", "abc123");
    localStorage.setItem("authExpiresAt", futureDate);
    localStorage.setItem("tipoPerfil", "1");

    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setUserLogged({
          token: "abc123",
          dataHoraExpiracao: futureDate,
          tipoPerfil: "1",
        })
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("deve chamar logout quando token está expirado", async () => {
    const pastDate = new Date(Date.now() - 60_000).toISOString();

    localStorage.setItem("authToken", "expired");
    localStorage.setItem("authExpiresAt", pastDate);
    localStorage.setItem("tipoPerfil", "2");

    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
  });

  test("deve autenticar usando 'codigo' via API e redirecionar para /", async () => {
    mockSearchParams.set("codigo", "meuCodigo");

    (servicos.post as jest.Mock).mockResolvedValue({
      token: "tkn",
      dataHoraExpiracao: "2029-01-01",
      tipoPerfil: 2,
    });

    render(<Autenticacao />);

    await waitFor(() => {
      expect(servicos.post).toHaveBeenCalledWith(
        "/api/v1/autenticacao/validar",
        { codigo: "meuCodigo" }
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setUserLogged({
        token: "tkn",
        dataHoraExpiracao: "2029-01-01",
        tipoPerfil: 2,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });


  test("deve ir para /ues quando tipoPerfil for 4 vindo da API", async () => {
    mockSearchParams.set("codigo", "xyz");

    (servicos.post as jest.Mock).mockResolvedValue({
      token: "tkn",
      dataHoraExpiracao: "2030-01-01",
      tipoPerfil: 4,
    });

    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/ues");
    });
  });

  test("deve ir para /dres quando tipoPerfil for 5 vindo da API", async () => {
    mockSearchParams.set("codigo", "xyz");

    (servicos.post as jest.Mock).mockResolvedValue({
      token: "tkn",
      dataHoraExpiracao: "2030-01-01",
      tipoPerfil: 5,
    });

    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dres");
    });
  });

  test("deve redirecionar para /sem-acesso quando API falhar", async () => {
    mockSearchParams.set("codigo", "errado");

    (servicos.post as jest.Mock).mockRejectedValue(new Error("Ops"));

    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
    });
  });

  test("deve redirecionar para /sem-acesso quando não existe código", async () => {
    render(<Autenticacao />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sem-acesso");
    });
  });
});
