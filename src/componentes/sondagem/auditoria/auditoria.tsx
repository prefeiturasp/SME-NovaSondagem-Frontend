import React from "react";
import "./auditoria.css";

type Auditoria = {
  linhas: string[];
};

export const Auditoria: React.FC<Auditoria> = ({ linhas }) => {
  if (!linhas || linhas.length === 0) return null;

  return (
    <div className="historico-wrapper">
      <div className="historico-container">
        <div className="historico-title">Histórico de alterações</div>

        {linhas.map((linha, index) => (
          <div key={`auditoria-${index}-${linha}`} className="historico-linha">
            {linha}
          </div>
        ))}
      </div>
    </div>
  );
};
