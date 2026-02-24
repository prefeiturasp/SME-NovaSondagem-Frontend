import NovaSondagemServico from "../../core/servico/servico";

interface BimestreParams {
  token: string;
}

interface BimestreResponse {
  value: number;
  label: string;
}

const BimestreService = async ({
  token,
}: BimestreParams): Promise<BimestreResponse[] | null> => {
  try {
    const resposta = await NovaSondagemServico.get(`/Bimestre`, {
      headers: { "X-Token-Principal": token },
    });

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data
        .map((item: any) => ({
          value: item.id,
          label: item.descricao,
        }))
        .sort((a: any, b: any) =>
          a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
        );
      return dadosMapeados;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Erro ao carregar bimestres:", error);
    return null;
  }
};

export default BimestreService;
