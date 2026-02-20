import React from "react";
import "./relatorio.css";
import ConteudoRelatorio from "~/componentes/sondagemRelatorio/conteudoRelatorio/conteudoRelatorio";

const Relatorio: React.FC = () => {
  return (
    <div className="classtudoRelatorio">
      <ConteudoRelatorio />
    </div>
  );
};

export default Relatorio;
