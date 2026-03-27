export type LegendaTipo = "localizacao" | "inferencia" | "reflexao" | "geral";

export interface LegendasProps {
  corFundo?: string;
  corTexto?: string;
  descricaoLegenda: string;
  textoLegenda: string;
  tipo?: LegendaTipo;
}
