import React from "react";
import type { DadosTabelaDinamica } from "../../../core/dto/typesRelatorio";

interface TabelaRelatorioConsolidadoProps {
  dados: DadosTabelaDinamica | null;
}

const TabelaRelatorioConsolidado: React.FC<TabelaRelatorioConsolidadoProps> = ({
  dados,
}) => {
  if (!dados) return null;

  return <div className="tabelaRelatorioConsolidado" />;
};

export default TabelaRelatorioConsolidado;
