import type { ValoresFiltroRelatorio } from "./typesRelatorio";

describe("typesRelatorio - ValoresFiltroRelatorio", () => {
  it("deve aceitar bimestre no contrato de filtros", () => {
    const filtros: ValoresFiltroRelatorio = {
      anoLetivo: 2026,
      modalidade: 1,
      bimestre: 2,
    };

    expect(filtros.bimestre).toBe(2);
  });

  it("deve manter bimestre opcional", () => {
    const filtros: ValoresFiltroRelatorio = {
      anoLetivo: 2026,
      modalidade: 5,
    };

    expect(filtros.bimestre).toBeUndefined();
  });
});
