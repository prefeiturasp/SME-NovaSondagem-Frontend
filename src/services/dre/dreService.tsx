import axios from "axios";
import { getSgpApiUrl } from "../../config";

interface DreParams {
  token: string;
  anoLetivo: number;
}

interface DreResponse {
  value: number;
  label: string;
}

const DreService = async ({
  token,
  anoLetivo,
}: DreParams): Promise<DreResponse[] | null> => {
  try {
    const base = getSgpApiUrl();

    const resposta = await axios.get(
      `${base}/v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`,
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
    console.error("Erro ao carregar DREs:", error);
    return null;
  }
};

export default DreService;
