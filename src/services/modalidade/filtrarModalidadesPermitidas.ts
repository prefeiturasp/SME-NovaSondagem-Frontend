const IDS_MODALIDADES_PERMITIDAS = [3, 5];

export const filtrarModalidadesPermitidas = <
  T extends { value: number | string | null },
>(
  modalidades: T[],
): T[] =>
  modalidades.filter((modalidade) =>
    IDS_MODALIDADES_PERMITIDAS.includes(Number(modalidade.value)),
  );
