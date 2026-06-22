import axios from "axios";
import { getSgpApiUrl } from "../../config";

interface UeParams {
  token: string;
  dreId: number;
  anoLetivo: number;
  modalidade?: number;
  anosTurma?: string[];
}

interface UeResponse {
  value: number;
  label: string;
}

const UeService = async ({
  token,
  dreId,
  anoLetivo,
  modalidade,
  anosTurma,
}: UeParams): Promise<UeResponse[] | null> => {
  try {
    let url = `/v1/abrangencias/false/dres/${dreId}/ues?anoLetivo=${anoLetivo}`;

    if (modalidade) url += `&modalidade=${modalidade}`;

    if (anosTurma?.length)
      url += anosTurma.map((ano) => `&anosTurma=${ano}`).join("");

    const base = getSgpApiUrl();

    const resposta = await axios.get(`${base}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => ({ value: item.codigo, label: item.nome }))
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar UEs:", error);
    return null;
  }
};

export default UeService;
