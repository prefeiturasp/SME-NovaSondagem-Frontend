import NovaSondagemServico from "../../core/servico/servico";
import { mapIdNameAndSort } from "../helpers/mapToOptions";

interface ValidarComponenteCurricularParams {
  token: string;
  modalidade: string;
}

interface ValidarComponenteCurricularResponse {
  value: number;
  label: string;
}

const ComponenteCurricularService = async ({
  token,
  modalidade,
}: ValidarComponenteCurricularParams): Promise<
  ValidarComponenteCurricularResponse[] | null
> => {
  try {
    const resposta = await NovaSondagemServico.get(
      `/ComponenteCurricular?IdModalidade=${modalidade}`,
      {
        headers: { "X-Token-Principal": token },
      },
    );

    if (resposta?.data?.length > 0) {
      return mapIdNameAndSort(resposta.data, "nome");
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao carregar componentes curriculares:", error);
    return null;
  }
};

export default ComponenteCurricularService;
