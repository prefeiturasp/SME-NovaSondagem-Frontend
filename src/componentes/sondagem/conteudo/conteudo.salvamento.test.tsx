import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { notification } from "antd";
import Conteudo from "./conteudo";
import NovaSondagemServico from "../../../core/servico/servico";
import { validarTurma } from "../../../services/turmaService";

jest.mock("../../../core/servico/servico");
jest.mock("../../../services/turmaService");
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  notification: { success: jest.fn(), info: jest.fn(), warning: jest.fn(), error: jest.fn() },
}));
jest.mock("../listaDinamica/sondagemListaDinamica", () => ({
  __esModule: true,
  default: ({ dados, formListaDinamica, podeSalvar }: any) => {
    const { Form, Input } = jest.requireActual("antd");
    const { useEffect } = jest.requireActual("react");
    useEffect(() => {
      if (dados) formListaDinamica.setFieldsValue({ resposta_0_0: "1" });
    }, [dados, formListaDinamica]);
    return <Form form={formListaDinamica}>
      {dados && <Form.Item name="resposta_0_0">
        <Input aria-label="Resposta" disabled={!podeSalvar} />
      </Form.Item>}
    </Form>;
  },
}));

const questionario = {
  sondagemId: 1, questaoId: 52, questionarioId: 19, podeSalvar: true,
  estudantes: [{ codigo: 101, nome: "Estudante", numeroAlunoChamada: 1,
    coluna: [{ idCiclo: 2, opcaoResposta: [{ id: 1, legenda: "N1", descricaoOpcaoResposta: "Nível 1" }] }],
  }],
};

const contarConsultas = () => (NovaSondagemServico.get as jest.Mock).mock.calls
  .filter(([url]) => url === "/Questionario").length;

async function prepararTela() {
  const usuario = { logado: true, token: "token-teste", turmaSelecionada: {
    turma: "3037571", modalidade: "5", ano: "2", anoLetivo: 2026,
    unidadeEscolar: "019660", dre: "1",
  } };
  const store = configureStore({ reducer: (state = { usuario }) => state });
  const { container } = render(<Provider store={store}><Conteudo /></Provider>);
  const disciplina = container.querySelector("#sondagem-select-componente-curricular")!;
  await waitFor(() => expect(disciplina).not.toBeDisabled());
  fireEvent.mouseDown(disciplina);
  fireEvent.click(await screen.findByTitle("Matemática"));
  const proficiencia = container.querySelector("#sondagem-select-proficiencia")!;
  await waitFor(() => expect(proficiencia).not.toBeDisabled());
  fireEvent.mouseDown(proficiencia);
  fireEvent.click(await screen.findByTitle("Números"));
  const resposta = await screen.findByLabelText("Resposta");
  fireEvent.change(resposta, { target: { value: "2" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Salvar" })).not.toBeDisabled());
  return resposta;
}

describe("Confirmação do salvamento da sondagem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (validarTurma as jest.Mock).mockResolvedValue({ valida: true, mensagens: [] });
    (NovaSondagemServico.get as jest.Mock).mockReset().mockImplementation((url: string) => {
      if (url.startsWith("/ComponenteCurricular")) return Promise.resolve({ data: [{ id: 2, nome: "Matemática" }] });
      if (url.startsWith("/Proficiencia")) return Promise.resolve({ data: [{ id: 2, nome: "Números" }] });
      if (url === "/Questionario") return Promise.resolve({ data: questionario });
      return Promise.resolve({ data: [] });
    });
    (NovaSondagemServico.post as jest.Mock).mockReset();
  });

  it.each([
    ["SemAlteracoes", 0, "info", "Nenhuma alteração para salvar."],
    ["NaoProcessado", 1, "warning", "Nenhuma resposta foi gravada."],
    ["Gravado", 1, "warning", "Salvamento concluído somente para os estudantes ativos."],
    ["SemAlteracoes", 1, "warning", "Nenhuma alteração para salvar nos estudantes ativos."],
  ])("informa %s com %i estudante não processado e preserva o preenchimento", async (resultado, quantidade, tipo, mensagem) => {
    const campo = await prepararTela();
    const consultas = contarConsultas();
    (NovaSondagemServico.post as jest.Mock).mockResolvedValue({ status: 200,
      data: { resultado, quantidadeEstudantesNaoProcessados: quantidade } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect((notification as any)[tipo]).toHaveBeenCalledWith(
      expect.objectContaining({ message: mensagem })));
    expect(notification.success).not.toHaveBeenCalled();
    expect(campo).toHaveValue("2");
    expect(contarConsultas()).toBe(consultas);
  });

  it.each([true, false, {}, { resultado: "Desconhecido", quantidadeEstudantesNaoProcessados: 0 }])(
    "não confirma sucesso para resposta inesperada %j", async (data) => {
      const campo = await prepararTela();
      (NovaSondagemServico.post as jest.Mock).mockResolvedValue({ status: 200, data });
      fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
      await waitFor(() => expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Não foi possível confirmar o salvamento." })));
      expect(notification.success).not.toHaveBeenCalled();
      expect(campo).toHaveValue("2");
    },
  );

  it("aguarda a atualização da tela e bloqueia novos envios", async () => {
    await prepararTela();
    (NovaSondagemServico.post as jest.Mock).mockResolvedValue({ status: 200,
      data: { resultado: "Gravado", quantidadeEstudantesNaoProcessados: 0 } });
    let concluirConsulta!: (value: any) => void;
    const consulta = new Promise(resolve => { concluirConsulta = resolve; });
    (NovaSondagemServico.get as jest.Mock).mockImplementation(() => consulta);
    const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(botaoSalvar);
    await waitFor(() => expect(botaoSalvar).toBeDisabled());
    expect(screen.getByLabelText("Resposta")).toBeDisabled();
    fireEvent.click(botaoSalvar);
    expect(notification.success).not.toHaveBeenCalled();
    await act(async () => concluirConsulta({ data: questionario }));
    await waitFor(() => expect(notification.success).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Salvar" })).not.toBeDisabled();
    expect(NovaSondagemServico.post).toHaveBeenCalledTimes(1);
  });

  it("distingue gravação confirmada de falha ao atualizar a tela", async () => {
    const campo = await prepararTela();
    (NovaSondagemServico.post as jest.Mock).mockResolvedValue({ status: 200,
      data: { resultado: "Gravado", quantidadeEstudantesNaoProcessados: 0 } });
    (NovaSondagemServico.get as jest.Mock).mockRejectedValue({ code: "ERR_NETWORK" });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(notification.warning).toHaveBeenCalledWith(expect.objectContaining({
      message: "Sondagem salva, mas não foi possível atualizar a tela.",
    })));
    expect(notification.success).not.toHaveBeenCalled();
    expect(notification.error).not.toHaveBeenCalled();
    expect(campo).toHaveValue("2");
  });

  it.each([
    [{ code: "ERR_NETWORK" }, "Não foi possível confirmar o salvamento."],
    [{ response: { status: 500 } }, "Não foi possível confirmar o salvamento."],
    [{ response: { status: 400, data: { mensagem: "Período encerrado" } } }, "Erro ao salvar sondagem"],
  ])("preserva o preenchimento após falha %j", async (erro, mensagem) => {
    const campo = await prepararTela();
    const consultas = contarConsultas();
    (NovaSondagemServico.post as jest.Mock).mockRejectedValue(erro);
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: mensagem })));
    if ("response" in erro && erro.response.status === 400) expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Período encerrado" }));
    expect(notification.success).not.toHaveBeenCalled();
    expect(campo).toHaveValue("2");
    expect(contarConsultas()).toBe(consultas);
  });
});
