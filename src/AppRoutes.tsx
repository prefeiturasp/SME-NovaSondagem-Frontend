import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SemAcesso from "./paginas/sem-acesso/SemAcesso";
import Autenticacao from "./paginas/autenticacao/autenticacao";
import Home from "./paginas/home/home";



const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;
  
  return  <>{children}</>

  //return isAuthenticated ? <>{children}</> : <Navigate to="/sem-acesso" />;
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
