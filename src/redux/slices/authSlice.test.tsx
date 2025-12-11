import authReducer, { setUserLogged, logout } from "./authSlice";

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("deve iniciar deslogado quando não há nada no localStorage", () => {
    const initialState = {
      isAuthenticated: true,
      token: "teste",
      dataHoraExpiracao: "teste",
      tipoPerfil: 1,
    };
    const state = authReducer(initialState, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBe(null);
    expect(state.dataHoraExpiracao).toBe(null);
    expect(state.tipoPerfil).toBe(null);
  });

  test("deve fazer login quando setUserLogged é chamado", () => {
    const futureDate = new Date(Date.now() + 60_000).toISOString();
    const payload = {
      token: "abc123",
      dataHoraExpiracao: futureDate,
      tipoPerfil: 2,
    };

    const initialState = {
      isAuthenticated: false,
      token: null,
      dataHoraExpiracao: null,
      tipoPerfil: null,
    };

    const state = authReducer(initialState, setUserLogged(payload));

    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("abc123");
    expect(state.dataHoraExpiracao).toBe(futureDate);
    expect(state.tipoPerfil).toBe(2);
  });

  test("setUserLogged deve atualizar o estado e salvar no localStorage", () => {
    const payload = {
      token: "meuToken",
      dataHoraExpiracao: "2030-01-01T00:00:00Z",
      tipoPerfil: 3,
    };

    const state = authReducer(undefined, setUserLogged(payload));

    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("meuToken");
    expect(state.dataHoraExpiracao).toBe("2030-01-01T00:00:00Z");
    expect(state.tipoPerfil).toBe(3);

    expect(localStorage.getItem("authToken")).toBe("meuToken");
    expect(localStorage.getItem("authExpiresAt")).toBe(
      "2030-01-01T00:00:00Z"
    );
    expect(localStorage.getItem("tipoPerfil")).toBe("3");
  });

  test("logout deve limpar o estado e remover localStorage", () => {
    const initialState = {
      isAuthenticated: true,
      token: "token123",
      dataHoraExpiracao: "2030-01-01",
      tipoPerfil: 1,
    };

    localStorage.setItem("authToken", "token123");
    localStorage.setItem("authExpiresAt", "2030-01-01");
    localStorage.setItem("tipoPerfil", "1");

    const newState = authReducer(initialState, logout());

    expect(newState.isAuthenticated).toBe(false);
    expect(newState.token).toBe(null);
    expect(newState.dataHoraExpiracao).toBe(null);
    expect(newState.tipoPerfil).toBe(null);

    expect(localStorage.getItem("authToken")).toBe(null);
    expect(localStorage.getItem("authExpiresAt")).toBe(null);
    expect(localStorage.getItem("tipoPerfil")).toBe(null);
  });
});
