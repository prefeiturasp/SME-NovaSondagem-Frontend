import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUserLogged, logout } from "./slices/authSlice";
import { store, type RootState, type AppDispatch } from "./store";

describe("Redux Store", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("store é configurado corretamente com reducer auth", () => {
    const state = store.getState();

    expect(state).toHaveProperty("auth");
    expect(state.auth).toBeDefined();
  });

  test("RootState type está definido corretamente", () => {
    const state: RootState = store.getState();

    expect(state.auth).toHaveProperty("isAuthenticated");
    expect(state.auth).toHaveProperty("token");
    expect(state.auth).toHaveProperty("dataHoraExpiracao");
    expect(state.auth).toHaveProperty("tipoPerfil");
  });

  test("AppDispatch type funciona corretamente", () => {
    const dispatch: AppDispatch = store.dispatch;

    expect(typeof dispatch).toBe("function");
  });

  test("store pode despachar ação setUserLogged", () => {
    const payload = {
      token: "test-token-123",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: 1
    };

    store.dispatch(setUserLogged(payload));

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.token).toBe(payload.token);
    expect(state.auth.dataHoraExpiracao).toBe(payload.dataHoraExpiracao);
    expect(state.auth.tipoPerfil).toBe(payload.tipoPerfil);
  });

  test("store pode despachar ação logout", () => {
    // Primeiro, faz login
    const payload = {
      token: "test-token-123",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: 1
    };
    store.dispatch(setUserLogged(payload));

    // Então, faz logout
    store.dispatch(logout());

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.token).toBe(null);
    expect(state.auth.dataHoraExpiracao).toBe(null);
    expect(state.auth.tipoPerfil).toBe(null);
  });

  test("pode criar nova instância da store", () => {
    const newStore = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    expect(newStore).toBeDefined();
    expect(newStore.getState()).toHaveProperty("auth");
  });

  test("setUserLogged persiste dados no localStorage", () => {
    const payload = {
      token: "persist-token",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: 3
    };

    store.dispatch(setUserLogged(payload));

    expect(localStorage.getItem("authToken")).toBe("persist-token");
    expect(localStorage.getItem("authExpiresAt")).toBe("2025-12-31T23:59:59Z");
    expect(localStorage.getItem("tipoPerfil")).toBe("3");
  });

  test("logout remove dados do localStorage", () => {
    const payload = {
      token: "temp-token",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: 1
    };

    store.dispatch(setUserLogged(payload));
    expect(localStorage.getItem("authToken")).toBe("temp-token");

    store.dispatch(logout());

    expect(localStorage.getItem("authToken")).toBe(null);
    expect(localStorage.getItem("authExpiresAt")).toBe(null);
    expect(localStorage.getItem("tipoPerfil")).toBe(null);
  });

  test("setUserLogged com tipoPerfil null salva string vazia", () => {
    const payload = {
      token: "token-sem-perfil",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: null
    };

    store.dispatch(setUserLogged(payload));

    expect(localStorage.getItem("tipoPerfil")).toBe("");
  });

  test("múltiplas ações podem ser despachadas em sequência", () => {
    const payload1 = {
      token: "token-1",
      dataHoraExpiracao: "2025-12-31T23:59:59Z",
      tipoPerfil: 1
    };

    const payload2 = {
      token: "token-2",
      dataHoraExpiracao: "2026-01-01T00:00:00Z",
      tipoPerfil: 2
    };

    store.dispatch(setUserLogged(payload1));
    let state = store.getState();
    expect(state.auth.token).toBe("token-1");

    store.dispatch(logout());
    state = store.getState();
    expect(state.auth.token).toBe(null);

    store.dispatch(setUserLogged(payload2));
    state = store.getState();
    expect(state.auth.token).toBe("token-2");
    expect(state.auth.tipoPerfil).toBe(2);
  });
});
