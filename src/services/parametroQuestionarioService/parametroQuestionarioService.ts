import NovaSondagemServico from "../../core/servico/servico";

interface QuestionarioParams {
  idQuestionario: number;
  token: string;
}

interface QuestionarioParamsResponse {
  id: number;
  idQuestionario: number;
  valor: string;
  tipo: string;
}

export const parametroQuestionarioService = async ({
  idQuestionario,
  token,
}: QuestionarioParams): Promise<QuestionarioParamsResponse[]> => {
  try {
    const resposta = await NovaSondagemServico.get(
      `/ParametroQuestionario/questionario`,
      {
        headers: { "X-Token-Principal": token },
        params: { idQuestionario },
      },
    );
    return resposta?.data;
  } catch (error: any) {
    console.error("Erro ao validar questionário:", error);

    return [];
  }
};
