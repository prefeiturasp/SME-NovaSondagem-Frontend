const pad2 = (n: number) => String(n).padStart(2, "0");

export type EstudanteComRemanejamento = {
  estudanteRemanejado?: { data?: string } | null;
};

const formatarDataRemanejamento = (valor: string): string => {
  const trimmed = valor.trim();
  const parteData = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(parteData)) {
    const [ano, mes, dia] = parteData.split("-").map(Number);
    return `${pad2(dia)}/${pad2(mes)}/${ano}`;
  }

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return valor;
  }
  return `${pad2(data.getDate())}/${pad2(data.getMonth() + 1)}/${data.getFullYear()}`;
};

export const montarMensagemTooltipRemanejado = (
  estudante: EstudanteComRemanejamento,
): string | null => {
  if (estudante.estudanteRemanejado == null) {
    return null;
  }

  const dataIso = estudante.estudanteRemanejado.data;
  if (dataIso != null && String(dataIso).trim() !== "") {
    return `Estudante Remanejado: turma em ${formatarDataRemanejamento(String(dataIso))}`;
  }

  return "Estudante Remanejado";
};
