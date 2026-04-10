import NovaSondagemServico from "../../core/servico/servico";

interface GeneroSexoParams {
  token: string;
}

interface GeneroSexoResponse {
  value: string;
  label: string;
}

const GeneroSexoService = async ({
  token,
}: GeneroSexoParams): Promise<GeneroSexoResponse[] | null> => {
  try {
    const resposta = await NovaSondagemServico.get(`/GeneroSexo`, {
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
    console.error("Erro ao carregar gêneros:", error);
    return null;
  }
};

export default GeneroSexoService;
