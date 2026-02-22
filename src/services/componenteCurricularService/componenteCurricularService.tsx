import NovaSondagemServico from "../../core/servico/servico";

interface ValidarComponenteCurricularParams {
  //turmaId: number;
  token: string;
}

interface ValidarComponenteCurricularResponse {
  value: number;
  label: string;
}

const ComponenteCurricularService = async ({
  //turmaId,
  token,
}: ValidarComponenteCurricularParams): Promise<
  ValidarComponenteCurricularResponse[] | null
> => {
  try {
    const resposta = await NovaSondagemServico.get(`/ComponenteCurricular`, {
      headers: { "X-Token-Principal": token },
      //params: { turmaId },
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
    console.error("Erro ao carregar componentes curriculares:", error);
    return null;
  }
};

export default ComponenteCurricularService;
