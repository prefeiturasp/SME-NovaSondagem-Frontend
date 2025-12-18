export const ModalidadeEnum = {
  INFANTIL: 1,
  EJA: 3,
  CIEJA: 4,
  FUNDAMENTAL: 5,
  MEDIO: 6,
  CMCT: 7,
  MOVA: 8,
  ETEC: 9,
  CELP: 10,
} as const;

export type ModalidadeEnum =
  (typeof ModalidadeEnum)[keyof typeof ModalidadeEnum];

export const ModalidadeEnumDisplay: Record<ModalidadeEnum, string> = {
  [ModalidadeEnum.INFANTIL]: "Educação Infantil",
  [ModalidadeEnum.EJA]: "Educação de Jovens e Adultos",
  [ModalidadeEnum.CIEJA]: "CIEJA",
  [ModalidadeEnum.FUNDAMENTAL]: "Ensino Fundamental",
  [ModalidadeEnum.MEDIO]: "Ensino Médio",
  [ModalidadeEnum.CMCT]: "CMCT",
  [ModalidadeEnum.MOVA]: "MOVA",
  [ModalidadeEnum.ETEC]: "ETEC",
  [ModalidadeEnum.CELP]: "CELP",
};
