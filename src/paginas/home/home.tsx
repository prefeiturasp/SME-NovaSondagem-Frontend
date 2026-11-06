import React from "react";
import Conteudo from "../../componentes/sondagem/conteudo/conteudo";
import { AntdAppProvider } from "../../core/config/antd-app-provider";
import "./home.css";

const Home: React.FC = () => {
  return (
    <AntdAppProvider>
      <div className="classtudo">
        <Conteudo />
      </div>
    </AntdAppProvider>
  );
};

export default Home;
