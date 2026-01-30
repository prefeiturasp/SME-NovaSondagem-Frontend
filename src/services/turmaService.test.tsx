import NovaSondagemServico from "../core/servico/servico";
import { validarTurma } from "./turmaService"; // ajuste o path conforme o arquivo real

jest.mock("../core/servico/servico", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedServico = NovaSondagemServico as jest.Mocked<
  typeof NovaSondagemServico
>;

describe("validarTurma", () => {
  const token = "token-teste";
  const turmaId = 123;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar valida=true e mensagens=[] quando API retornar data === true", async () => {
    mockedServico.get.mockResolvedValueOnce({ data: true } as any);

    const resultado = await validarTurma({ turmaId, token });

    expect(mockedServico.get).toHaveBeenCalledWith("/Turma/validar-turma", {
      headers: { "X-Token-Principal": token },
      params: { turmaId },
    });

    expect(resultado).toEqual({
      valida: true,
      mensagens: [],
    });
  });

  it("deve retornar valida=false e mensagem da API quando erro tiver response.data.message", async () => {
    const mensagemErro = "Turma inválida";

    mockedServico.get.mockRejectedValueOnce({
      response: { data: { message: mensagemErro } },
    });

    const resultado = await validarTurma({ turmaId, token });

    expect(resultado).toEqual({
      valida: false,
      mensagens: [mensagemErro],
    });
  });

  it("deve retornar valida=false e mensagem padrão quando erro não tiver response.data.message", async () => {
    mockedServico.get.mockRejectedValueOnce(new Error("Falha qualquer"));

    const resultado = await validarTurma({ turmaId, token });

    expect(resultado).toEqual({
      valida: false,
      mensagens: ["Erro ao validar turma."],
    });
  });
});
