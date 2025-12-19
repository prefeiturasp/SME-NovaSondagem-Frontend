import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SemAcesso from "./paginas/sem-acesso/SemAcesso";
import Autenticacao from "./paginas/autenticacao/autenticacao";
import Home from "./paginas/home/home";
import type { RootState } from "./types/redux";
import { useSelector } from "react-redux";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.usuario?.logado || false
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? <Navigate to="/sem-acesso" /> : <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/validar" element={<Autenticacao />} />
    <Route path="/sem-acesso" element={<SemAcesso />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
