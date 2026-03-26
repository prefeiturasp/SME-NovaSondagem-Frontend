import { classificarTipoLegenda, pertenceAColuna } from "./legendaClassifier";

describe("legendaClassifier", () => {
  describe("classificarTipoLegenda", () => {
    it("classifica localização, inferência, reflexão e geral", () => {
      expect(classificarTipoLegenda("Localização de informação")).toBe(
        "localizacao",
      );
      expect(classificarTipoLegenda("Inferência textual")).toBe("inferencia");
      expect(
        classificarTipoLegenda("Realizou proposta de apreciação e réplica"),
      ).toBe("reflexao");
      expect(classificarTipoLegenda("Legenda genérica")).toBe("geral");
    });
  });

  describe("pertenceAColuna", () => {
    it("usa tipo, texto e descrição para localizar correspondência", () => {
      expect(
        pertenceAColuna("Localização", {
          corFundo: "#fff",
          corTexto: "#000",
          descricaoLegenda: "Aluno localizou a resposta",
          textoLegenda: "L",
          tipo: "geral",
        }),
      ).toBe(true);

      expect(
        pertenceAColuna("Inferência", {
          corFundo: "#fff",
          corTexto: "#000",
          descricaoLegenda: "Descrição qualquer",
          textoLegenda: "Inferiu corretamente",
          tipo: "geral",
        }),
      ).toBe(true);

      expect(
        pertenceAColuna("Reflexão", {
          corFundo: "#fff",
          corTexto: "#000",
          descricaoLegenda: "Descrição qualquer",
          textoLegenda: "Texto qualquer",
          tipo: "reflexao",
        }),
      ).toBe(true);
    });

    it("retorna false quando a legenda não pertence à coluna", () => {
      expect(
        pertenceAColuna("Outra coluna", {
          corFundo: "#fff",
          corTexto: "#000",
          descricaoLegenda: "Sem relação",
          textoLegenda: "Neutra",
          tipo: "geral",
        }),
      ).toBe(false);
    });
  });
});
