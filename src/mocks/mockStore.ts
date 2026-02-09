import { configureStore } from "@reduxjs/toolkit";

const initialState = { usuario: { logado: false } };
const mockReducer = (state = initialState) => state;

export const createMockStore = () =>
  configureStore({
    reducer: mockReducer,
  });
