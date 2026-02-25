import axios from "axios";
import { getSgpApiUrl } from "../../config";

interface AnoLetivoParams {
  token: string;
}

interface AnoLetivoResponse {
  value: number;
  label: string;
}

const AnoLetivoService = async ({
  token,
}: AnoLetivoParams): Promise<AnoLetivoResponse[] | null> => {
  try {
    const consideraHistorico = true;
    const anoMinimo = 2026;
    const base = getSgpApiUrl();

    const resposta = await axios.get(
      `${base}/v1/abrangencias/${consideraHistorico}/anos-letivos?anoMinimo=${anoMinimo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    console.log("Resposta AnoLetivoService:", resposta.data);

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => {
          if (item && typeof item === "object") {
            return { value: item.id, label: String(item.nome) };
          }
          return { value: item, label: String(item) };
        })
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao carregar AnoLetivos:", error);
    return null;
  }
};

export default AnoLetivoService;
