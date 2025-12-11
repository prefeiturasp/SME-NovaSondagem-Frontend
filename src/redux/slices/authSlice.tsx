import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  dataHoraExpiracao: string | null;
  tipoPerfil: number | null;
}

interface SetUserLoggedPayload {
  token: string;
  dataHoraExpiracao: string;
  tipoPerfil: number | null;
}

const getInitialState = (): AuthState => {
  const storedToken = localStorage.getItem("authToken");
  const storedExpiresAt = localStorage.getItem("authExpiresAt");
  const storedTipoPerfil = localStorage.getItem("tipoPerfil");

  const isTokenValid = Boolean(
    storedToken &&
    storedExpiresAt &&
    new Date(storedExpiresAt) > new Date()
  );

  return {
    isAuthenticated: isTokenValid,
    token: storedToken || null,
    dataHoraExpiracao: storedExpiresAt || null,
    tipoPerfil: storedTipoPerfil ? Number(storedTipoPerfil) : null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<SetUserLoggedPayload>) => {
      const { token, dataHoraExpiracao, tipoPerfil } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.tipoPerfil = tipoPerfil;
      state.dataHoraExpiracao = dataHoraExpiracao;
      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiresAt", dataHoraExpiracao);
      localStorage.setItem(
        "tipoPerfil",
        tipoPerfil === null ? "" : String(tipoPerfil)
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.dataHoraExpiracao = null;
      state.tipoPerfil = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiresAt");
      localStorage.removeItem("tipoPerfil");
    },
  },
});

export const { setUserLogged, logout } = authSlice.actions;
export default authSlice.reducer;
