const IDS_MODALIDADES_PERMITIDAS = new Set([3, 5]);

export const filtrarModalidadesPermitidas = <
  T extends { value: number | string | null },
>(
  modalidades: T[],
): T[] =>
  modalidades.filter((modalidade) =>
    IDS_MODALIDADES_PERMITIDAS.has(Number(modalidade.value)),
  );
