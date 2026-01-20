import React from "react";
import "./auditoria.css";

type Auditoria = {
  linhas: string[];
};

export const Auditoria: React.FC<Auditoria> = ({ linhas }) => {
  if (!linhas || linhas.length === 0) return null;

  return (
    <div className="historico-wrapper">
      {linhas.map((linha, index) => (
        <div key={`auditoria-${index}-${linha}`} className="historico-linha">
          {linha}
        </div>
      ))}
    </div>
  );
};
