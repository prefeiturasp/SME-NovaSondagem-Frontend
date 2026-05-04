import axios from "axios";
import { getSgpApiUrl } from "../../config";

interface TurmaParams {
  token: string;
  urId: number;
  modalidade: number;
  anoLetivo: number;
  periodo?: number;
  consideraNovosAnosInfantil?: boolean;
}

interface TurmaResponse {
  value: number;
  label: string;
  ano: number;
}

const TurmaService = async ({
  token,
  urId,
  modalidade,
  anoLetivo,
  periodo,
  consideraNovosAnosInfantil = true,
}: TurmaParams): Promise<TurmaResponse[] | null> => {
  try {
    const base = getSgpApiUrl();
    const params = new URLSearchParams({
      anoLetivo: String(anoLetivo),
      modalidade: String(modalidade),
      consideraNovosAnosInfantil: String(consideraNovosAnosInfantil),
    });

    if (periodo !== undefined) {
      params.append("periodo", String(periodo));
    }

    const resposta = await axios.get(
      `${base}/v1/abrangencias/false/dres/ues/${urId}/turmas?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => ({
          value: item.codigo,
          label: item.nome,
          ano: item.ano,
        }))
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar Turmas:", error);
    return null;
  }
};

export default TurmaService;
