import React from "react";
import Cabecalho from "../../componentes/sondagem/cabecalho/cabecalho";
import Conteudo from "../../componentes/sondagem/conteudo/conteudo";
import Rodape from "../../componentes/sondagem/rodape/rodape";

// Importar CSS do Ant Design (independente do sistema pai)
import "antd/dist/reset.css";

// Importar CSS global da aplicação
import "../../main.css";
import "../../index.css";

import "./home.css";

const Home: React.FC = () => {
  return (
    <div className="classtudo">
      <Cabecalho />
      <Conteudo />
      <Rodape />
    </div>
  );
};

export default Home;
