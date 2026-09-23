import React from "react";
import "./relatorio.css";
import ConteudoRelatorioConsolidado from "../../componentes/sondagemRelatorio/conteudoRelatorioConsolidado/conteudoRelatorioConsolidado";
import { AntdAppProvider } from "../../core/config/antd-app-provider";

const RelatorioConsolidado: React.FC = () => {
  return (
    <AntdAppProvider>
      <div className="classtudoRelatorio">
        <ConteudoRelatorioConsolidado />
      </div>
    </AntdAppProvider>
  );
};

export default RelatorioConsolidado;
