import type {
  LegendasProps,
  LegendaTipo,
} from "../../../core/dto/legendaProps";

const normalizar = (valor?: string) =>
  (valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const classificarTipoLegenda = (textoLegenda?: string): LegendaTipo => {
  const texto = normalizar(textoLegenda);

  if (texto.includes("localiz")) return "localizacao";
  if (texto.includes("infer")) return "inferencia";
  if (/(reflex|reflet|proposta|aprecia|replica)/.test(texto)) {
    return "reflexao";
  }

  return "geral";
};

export const pertenceAColuna = (
  descricaoColuna: string,
  item: LegendasProps,
): boolean => {
  const filtro = normalizar(descricaoColuna);
  const texto = normalizar(item.textoLegenda);
  const descricao = normalizar(item.descricaoLegenda);

  if (filtro.includes("localiz")) {
    return (
      item.tipo === "localizacao" ||
      /localiz/.test(texto) ||
      /localiz/.test(descricao)
    );
  }

  if (filtro.includes("infer")) {
    return (
      item.tipo === "inferencia" ||
      /infer/.test(texto) ||
      /infer/.test(descricao)
    );
  }

  if (filtro.includes("reflex")) {
    return (
      item.tipo === "reflexao" ||
      /(reflex|reflet|proposta|aprecia|replica)/.test(texto) ||
      /(reflex|reflet|proposta|aprecia|replica)/.test(descricao)
    );
  }

  return false;
};
