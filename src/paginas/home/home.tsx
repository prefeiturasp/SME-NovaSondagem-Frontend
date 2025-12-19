import React from "react";
import Cabecalho from "../../componentes/sondagem/cabecalho/cabecalho";
import Conteudo from "../../componentes/sondagem/conteudo/conteudo";
import Rodape from "../../componentes/sondagem/rodape/rodape";

const Home: React.FC = () => {
  return (
    <div>
      <Cabecalho />
      <Conteudo />
      <Rodape />
    </div>
  );
};

export default Home;
