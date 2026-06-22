const MODALIDADE_INFANTIL = 5;

const ANOS_TURMA_INFANTIL = ["1", "2", "3"];

export const obterAnosTurmaPorModalidade = (
  modalidade?: number | string,
): string[] | undefined => {
  if (Number(modalidade) === MODALIDADE_INFANTIL) return ANOS_TURMA_INFANTIL;
  return undefined;
};
