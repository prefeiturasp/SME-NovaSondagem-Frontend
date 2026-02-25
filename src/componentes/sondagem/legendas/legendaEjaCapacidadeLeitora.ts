import type { LegendasProps } from "../../../core/dto/legendaProps";

export const LEGENDA_EJA_CAPACIDADE_LEITORA: LegendasProps[] = [
  {
    descricaoLegenda: "Localização",
    textoLegenda: "Capacidade de recuperar informações explícitas no texto",
    corTexto: "#363636",
  },
  {
    descricaoLegenda: "Inferência",
    textoLegenda: "Capacidade de compreender informações implícitas no texto",
    corTexto: "#363636",
  },
  {
    descricaoLegenda: "Reflexão",
    textoLegenda:
      "(Apreciação e réplica do leitor em relação ao texto) relacionadas aos aspectos discursivos da reconstituição dos sentidos do texto.",
    corTexto: "#363636",
  },
  {
    descricaoLegenda: "Adequada",
    textoLegenda:
      "Recuperou, compreendeu ou refletiu corretamente sobre a informação",
    corFundo: "#7ED957",
    corTexto: "#363636",
  },
  {
    descricaoLegenda: "Inadequada",
    textoLegenda:
      "Não recuperou, compreendeu ou refletiu corretamente sobre a informação",
    corFundo: "#FFDE59",
    corTexto: "#363636",
  },
  {
    descricaoLegenda: "Não Resolveu",
    textoLegenda: "Não conseguiu realizar a leitura e/ou compreensão de textos",
    corFundo: "#F18888",
    corTexto: "#FFFFFF",
  },
];
