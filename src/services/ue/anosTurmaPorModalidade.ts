const MODALIDADE_FUNDAMENTAL = 5;

const ANOS_TURMA_FUNDAMENTAL = ["1", "2", "3"];

export const obterAnosTurmaPorModalidade = (
  modalidade?: number | string,
): string[] | undefined => {
  if (Number(modalidade) === MODALIDADE_FUNDAMENTAL) return ANOS_TURMA_FUNDAMENTAL;
  return undefined;
};
