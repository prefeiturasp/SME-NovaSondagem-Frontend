import React from "react";
import ListaDinamicaRelatorio from "../listaDinamicaRelatorio/listaDinamicaRelatorio";
import type { DadosTabelaDinamicaRelatorio } from "../../../core/dto/typesRelatorio";
import mockDados from "../../../mocks/MockDadosTabelaDinamica3.json";

const ConteudoRelatorio: React.FC = () => {
  const dados = mockDados as DadosTabelaDinamicaRelatorio;

  return (
    <div>
      <ListaDinamicaRelatorio dados={dados} />
    </div>
  );
};

export default ConteudoRelatorio;
