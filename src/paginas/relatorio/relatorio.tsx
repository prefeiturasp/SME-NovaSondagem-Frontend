import React from "react";
import "./relatorio.css";
import ConteudoRelatorio from "../../componentes/sondagemRelatorio/conteudoRelatorio/conteudoRelatorio";
import { AntdAppProvider } from "../../core/config/antd-app-provider";

const Relatorio: React.FC = () => {
  return (
    <AntdAppProvider>
      <div className="classtudoRelatorio">
        <ConteudoRelatorio />
      </div>
    </AntdAppProvider>
  );
};

export default Relatorio;
