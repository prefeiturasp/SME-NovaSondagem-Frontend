import NovaSondagemServico from "../core/servico/servico";

interface ValidarTurmaParams {
  turmaId: number;
  token: string;
}

interface ValidarTurmaResponse {
  valida: boolean;
  mensagens: string[];
}

export const validarTurma = async ({
  turmaId,
  token,
}: ValidarTurmaParams): Promise<ValidarTurmaResponse> => {
  try {
    const resposta = await NovaSondagemServico.get(`/Turma/validar-turma`, {
      headers: { "X-Token-Principal": token },
      params: { turmaId },
    });

    return {
      valida: resposta?.data === true,
      mensagens: [],
    };
  } catch (error: any) {
    console.error("Erro ao validar turma:", error);

    const mensagens: string[] =
      error.response?.data?.message ? [error.response?.data?.message] : ["Erro ao validar turma."];

    return {
      valida: false,
      mensagens,
    };
  }
};
