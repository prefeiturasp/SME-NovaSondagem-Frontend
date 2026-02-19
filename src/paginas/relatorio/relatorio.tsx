import React from "react";
import "./relatorio.css";
import ConteudoRelatorio from "~/componentes/sondagemRelatorio/conteudoRelatorio/conteudoRelatorio";

const Relatorio: React.FC = () => {
  return (
    <div className="relatorio">
      <ConteudoRelatorio />
    </div>
  );
};

export default Relatorio;
