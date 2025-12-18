import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "~/redux/modulos/reducers";
import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet, setAutoFreeze } from "immer";

// Fixes "Cannot assign to read only property" error message
// when modifying objects from Redux state directly.
setAutoFreeze(false);

const persistConfig = {
  key: "sme-sgp",
  storage,
  whitelist: ["usuario", "perfil", "filtro", "mensagens", "dashboard"],
  blacklist: ["calendarioEscolar", "calendarioProfessor"],
};

enableMapSet();

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.MODE !== "production", // TESTEAR NO NAVEGADOR
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
