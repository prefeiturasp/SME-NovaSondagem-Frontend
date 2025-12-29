import { configureStore } from "@reduxjs/toolkit";

const mockReducer = (state = { usuario: { logado: false } }) => state;

export const createMockStore = () =>
  configureStore({
    reducer: mockReducer,
  });
