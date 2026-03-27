import type { ValoresFiltroRelatorio } from "./typesRelatorio";

describe("typesRelatorio - ValoresFiltroRelatorio", () => {
  it("deve aceitar semestreId no contrato de filtros", () => {
    const filtros: ValoresFiltroRelatorio = {
      anoLetivo: 2026,
      modalidade: 1,
      semestreId: 2,
    };

    expect(filtros.semestreId).toBe(2);
  });

  it("deve manter semestreId opcional", () => {
    const filtros: ValoresFiltroRelatorio = {
      anoLetivo: 2026,
      modalidade: 5,
    };

    expect(filtros.semestreId).toBeUndefined();
  });
});
