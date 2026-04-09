import NovaSondagemServico from "../../core/servico/servico";

interface BimestreParams {
  token: string;
  modalidade?: number | string;
}

interface BimestreResponse {
  value: number;
  label: string;
}

const BimestreService = async ({
  token,
  modalidade,
}: BimestreParams): Promise<BimestreResponse[] | null> => {
  try {
    const params = modalidade !== undefined ? { modalidade } : undefined;
    const resposta = await NovaSondagemServico.get(`/Bimestre`, {
      headers: { "X-Token-Principal": token },
      params,
    });

    if (resposta?.data?.length > 0) {
      const dadosMapeados = resposta.data.map((item: any) => ({
        value: item.id,
        label: item.descricao,
      }));
      return dadosMapeados;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao carregar bimestres:", error);
    return null;
  }
};

export default BimestreService;
