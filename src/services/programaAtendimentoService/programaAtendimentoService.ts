import NovaSondagemServico from "../../core/servico/servico";

interface ProgramaAtendimentoParams {
  token: string;
}

interface ProgramaAtendimentoResponse {
  value: string;
  label: string;
}

const ProgramaAtendimentoService = async ({
  token,
}: ProgramaAtendimentoParams): Promise<
  ProgramaAtendimentoResponse[] | null
> => {
  try {
    const resposta = await NovaSondagemServico.get(`/ProgramaAtendimento`, {
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
    console.error("Erro ao carregar programas de atendimento:", error);
    return null;
  }
};

export default ProgramaAtendimentoService;
