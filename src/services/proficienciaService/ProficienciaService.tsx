import NovaSondagemServico from "../../core/servico/servico";

interface ValidarProficienciaParams {
  token: string;
  idDisciplina: number;
  modalidade: number;
}

interface ValidarProficienciaResponse {
  value: number;
  label: string;
}

const ProficienciaService = async ({
  token,
  idDisciplina,
  modalidade,
}: ValidarProficienciaParams): Promise<
  ValidarProficienciaResponse[] | null
> => {
  try {
    const resposta = await NovaSondagemServico.get(
      `/Proficiencia/componente-curricular/${idDisciplina}/modalidade/${modalidade}`,
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
    console.error("Erro ao carregar proficiências:", error);
    return null;
  }
};

export default ProficienciaService;
