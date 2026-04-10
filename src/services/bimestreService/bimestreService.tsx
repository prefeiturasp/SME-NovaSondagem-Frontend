import NovaSondagemServico from "../../core/servico/servico";

interface BimestreParams {
  token: string;
  modalidade?: number;
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
    const requestConfig: {
      headers: { "X-Token-Principal": string };
      params?: { modalidade: number };
    } = {
      headers: { "X-Token-Principal": token },
    };

    if (modalidade !== undefined) {
      requestConfig.params = { modalidade };
    }

    const resposta = await NovaSondagemServico.get(`/Bimestre`, requestConfig);

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
