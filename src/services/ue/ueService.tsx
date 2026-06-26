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
    const base = getSgpApiUrl();
    const params = new URLSearchParams({
      anoLetivo: String(anoLetivo),
    });

    if (modalidade) {
      params.append("modalidade", String(modalidade));
    }

    anosTurma?.forEach((ano) => params.append("anosTurma", ano));

    const resposta = await axios.get(
      `${base}/v1/abrangencias/false/dres/${dreId}/ues?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

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
