import NovaSondagemServico from "../../core/servico/servico";

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
    const resposta = await NovaSondagemServico.get(`/AnoLetivo`, {
      headers: { "X-Token-Principal": token },
    });

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
