import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Cabecalho from "./components/cabecalho/cabecalho";
import Rodape from "./components/rodape/rodape";
import Conteudo from "./components/conteudo/conteudo";
import SemAcesso from "./paginas/sem-acesso/SemAcesso";
import Autenticacao from "./paginas/autenticacao/autenticacao";

const AppPadrao: React.FC = () => (
  <div className="app-container">
    <Cabecalho />
    <Conteudo />
    <Rodape />
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? <>{children}</> : <Navigate to="/sem-acesso" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/validar" element={<Autenticacao />} />
    <Route path="/sem-acesso" element={<SemAcesso />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <AppPadrao />
        </PrivateRoute>
      }
    />    
  </Routes>
);

export default AppRoutes;
