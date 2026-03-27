import axios from "axios";
import { getSgpApiUrl } from "../../config";

interface ModalidadeParams {
  token: string;
  anoLetivo: number;
}

interface ModalidadeResponse {
  value: number;
  label: string;
}

const ModalidadeService = async ({
  token,
  anoLetivo,
}: ModalidadeParams): Promise<ModalidadeResponse[] | null> => {
  try {
    const base = getSgpApiUrl();

    const resposta = await axios.get(
      `${base}/v1/abrangencias/false/modalidades/?anoLetivo=${anoLetivo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => ({ value: item.id, label: item.descricao }))
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar Modalidades:", error);
    return null;
  }
};

export default ModalidadeService;
