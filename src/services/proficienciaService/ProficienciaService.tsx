import NovaSondagemServico from "../../core/servico/servico";
import { mapIdNameAndSort } from "../helpers/mapToOptions";

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
      return mapIdNameAndSort(resposta.data, "nome");
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao carregar proficiências:", error);
    return null;
  }
};

export default ProficienciaService;
