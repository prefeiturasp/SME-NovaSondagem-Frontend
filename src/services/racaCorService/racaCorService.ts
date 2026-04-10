import NovaSondagemServico from "../../core/servico/servico";

interface RacaCorParams {
  token: string;
}

interface RacaCorResponse {
  value: string;
  label: string;
}

const RacaCorService = async ({
  token,
}: RacaCorParams): Promise<RacaCorResponse[] | null> => {
  try {
    const resposta = await NovaSondagemServico.get(`/RacaCor`, {
      headers: { "X-Token-Principal": token },
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
    console.error("Erro ao carregar raças/cores:", error);
    return null;
  }
};

export default RacaCorService;
