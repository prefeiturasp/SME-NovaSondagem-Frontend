import axios from "axios";

interface AnoLetivoParams {
  token: string;
}

interface AnoLetivoResponse {
  value: number;
  label: string;
}

const novoSgpApi = axios.create({
  baseURL: "https://hom-novosgp.sme.prefeitura.sp.gov.br/api",
});

const AnoLetivoService = async ({
  token,
}: AnoLetivoParams): Promise<AnoLetivoResponse[] | null> => {
  try {
    const consideraHistorico = true;
    const anoMinimo = 2026;
    const resposta = await novoSgpApi.get(
      `/v1/abrangencias/${consideraHistorico}/anos-letivos?anoMinimo=${anoMinimo}`,
      {
      headers: { "X-Token-Principal": token },
      },
    );

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => ({
          value: item.id,
          label: item.nome,
        }))
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Erro ao carregar AnoLetivos:", error);
    return null;
  }
};

export default AnoLetivoService;
