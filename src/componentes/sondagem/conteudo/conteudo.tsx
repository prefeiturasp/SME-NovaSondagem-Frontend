import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Form,
  Select,
  Row,
  Col,
  message,
  notification,
  Spin,
} from "antd";
import SondagemListaDinamica from "../../../componentes/sondagem/listaDinamica/sondagemListaDinamica";
import type { DadosTabelaDinamica } from "../../../core/dto/types";
import "./conteudo.css";
import { useSelector } from "react-redux";
import Alerta from "../../../componentes/biblioteca/Alerta";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import Legendas from "../legendas/legendas";
import NovaSondagemServico from "../../../core/servico/servico";
import { Auditoria } from "../auditoria/auditoria";
import { validarTurma } from "../../../services/turmaService";
import styled from "styled-components";

export const Icon = styled.i``;

const Conteudo: React.FC = () => {
  const usuario = useSelector((store: any) => store.usuario);
  const turmaSelecionada = usuario?.turmaSelecionada;
  const turma = turmaSelecionada ? turmaSelecionada.turma : 0;
  const modalidade = usuario?.turmaSelecionada?.modalidade;
  const ano = usuario?.turmaSelecionada?.ano;

  const Icon = styled.i``;

  console.log("Usuario no conteudo:", usuario);

  const [listaDisciplinas, setListaDisciplinas] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [listaProficiencia, setListaProficiencia] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [listaBimestre, setListaBimestre] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [dadosLista, setDadosLista] = useState<DadosTabelaDinamica | null>(
    null,
  );

  const [dadosLegenda, setDadosLegenda] = useState<LegendasProps[] | null>(
    null,
  );

  const [dadosAuditoria, setDadosAuditoria] = useState<string[]>([]);

  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(true);
  const [desabilitarProficiencia, setDesabilitarProficiencia] = useState(true);
  const [desabilitarBimestre, setDesabilitarBimestre] = useState(true);

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    number | null
  >(null);
  const [proficienciaSelecionada, setProficienciaSelecionada] = useState<
    number | null
  >(null);

  const [bimestreSelecionado, setBimestreSelecionado] = useState<number | null>(
    null,
  );

  const [modalidadeAnoValidos, setModalidadeAnoValidos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroValidacaoTurma, setErroValidacaoTurma] = useState<string | null>(
    null,
  );
  const [desabilitarBotoes, setDesabilitarBotoes] = useState<boolean>(false);

  const [formFiltro] = Form.useForm();
  const [formListaDinamica] = Form.useForm();

  const verificarModalidadeTurma = useCallback(async () => {
    const resultado = await validarTurma({
      turmaId: turma,
      token: usuario?.token,
    });

    if (!resultado.valida && resultado.mensagens.length > 0) {
      setDesabilitarDisciplina(true);
      setDesabilitarProficiencia(true);
      setDesabilitarBotoes(true);
      setErroValidacaoTurma(resultado.mensagens.join(" "));
      return false
    } else {
      setDesabilitarBotoes(false);
      setErroValidacaoTurma(null);
      return true
    }
  }, [turma, usuario?.token]);

  const obterDisciplinas = useCallback(async () => {
    try {
      const resposta = await NovaSondagemServico.get("/ComponenteCurricular", {
        headers: { "X-Token-Principal": usuario?.token },
      });

      if (resposta?.data?.length > 0) {
        setDesabilitarDisciplina(false);
        const dadosMapeados = resposta.data
          .map((item: any) => ({
            value: item.id,
            label: item.nome,
          }))
          .sort((a: any, b: any) =>
            a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
          );
        setListaDisciplinas(dadosMapeados);
      } else {
        setDesabilitarDisciplina(true);
        setListaDisciplinas([]);
      }
    } catch (error: any) {
      console.error("Erro ao obter disciplinas:", error);
      message.error("Erro ao carregar dados da disciplina.");
    }
  }, [formFiltro]);

  const obterProficiencia = useCallback(
    async (idDisciplina: number) => {
      formFiltro.setFieldValue("proficienciaId", null);

      try {
        const resposta = await NovaSondagemServico.get(
          `/Proficiencia/componente-curricular/${idDisciplina}`,
          {
            headers: { "X-Token-Principal": usuario?.token },
          },
        );

        if (resposta?.data?.length > 0) {
          setDesabilitarProficiencia(false);
          const dadosMapeados = resposta.data.map((item: any) => ({
            value: item.id,
            label: item.nome,
          }));
          setListaProficiencia(dadosMapeados);
        } else {
          setDesabilitarProficiencia(true);
          setListaProficiencia([]);
        }
      } catch (error: any) {
        console.error("Erro ao obter proficiência:", error);
        message.error("Erro ao carregar dados da proficiencia.");
      }
    },
    [formFiltro, usuario?.token],
  );

  const obterBimestre = useCallback(async () => {
    try {
      const resposta = await NovaSondagemServico.get("/Bimestre", {
        headers: { "X-Token-Principal": usuario?.token },
      });

      if (resposta?.data?.length > 0) {
        setDesabilitarBimestre(false);
        const dadosMapeados = resposta.data
          .map((item: any) => ({
            value: item.id,
            label: item.descricao,
          }))
          .sort((a: any, b: any) =>
            a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
          );
        setListaBimestre(dadosMapeados);
      } else {
        setDesabilitarBimestre(true);
        setListaBimestre([]);
      }
    } catch (error: any) {
      console.error("Erro ao obter bimestres:", error);
      message.error("Erro ao carregar dados do bimestre.");
    }
  }, [formFiltro]);

  const resetando = useCallback(() => {
    formFiltro.resetFields();
    setListaDisciplinas([]);
    setListaProficiencia([]);
    setDesabilitarDisciplina(true);
    setDesabilitarProficiencia(true);
    setDadosLista(null);
    setDadosLegenda(null);
    setDisciplinaSelecionada(null);
    setProficienciaSelecionada(null);
    setModalidadeAnoValidos(false);
    setErroValidacaoTurma(null);
  }, [formFiltro]);

  useEffect(() => {
    const executar = async () => {
      formFiltro.resetFields(["disciplinaId", "proficienciaId", "bimestreId"]);
      setDisciplinaSelecionada(null);
      setProficienciaSelecionada(null);
      setBimestreSelecionado(null);
      setListaProficiencia([]);
      setListaBimestre([]);
      setDadosLista(null);
      setDadosLegenda(null);
      setDadosAuditoria([]);
      setDesabilitarDisciplina(true);
      setDesabilitarProficiencia(true);
      setDesabilitarBimestre(true);
      setErroValidacaoTurma(null);

      if (modalidade && ano) {
        const valido = await verificarModalidadeTurma();
        setModalidadeAnoValidos(valido);

        if (valido && turma !== 0) {
            obterDisciplinas();
        } else if (turma === 0) {
          resetando();
        }
      } else {
        resetando();
      }
    };
    executar();
  }, [
    modalidade,
    ano,
    turma,
    verificarModalidadeTurma,
    obterDisciplinas,
    resetando,
    formFiltro,
  ]);

  const onChangeDisciplinas = async (disciplinaId: number) => {
    if (disciplinaId) {
      setDisciplinaSelecionada(disciplinaId);
      setProficienciaSelecionada(null);
      setBimestreSelecionado(null);
      setDesabilitarBimestre(true);
      setDadosLista(null);
      setDadosLegenda(null);
      setDadosAuditoria([]);
      formFiltro.setFieldValue("bimestreId", null);
      await obterProficiencia(disciplinaId);
    }
  };

  const onChangeProficiencia = async (proficienciaId: number) => {
    if (proficienciaId && disciplinaSelecionada) {
      setProficienciaSelecionada(proficienciaId);
      setDadosLista(null);
      setDadosLegenda(null);
      setDadosAuditoria([]);

      if (proficienciaId === 3 || proficienciaId === 5) {
        setDesabilitarBimestre(false);
        obterBimestre();
      } else {
        setDesabilitarBimestre(true);
        setBimestreSelecionado(null);
        formFiltro.setFieldValue("bimestreId", null);
      }
    }
  };

  const onChangeBimestre = async (bimestreId: number) => {
    if (bimestreId) {
      setBimestreSelecionado(bimestreId);
    }
  };

  const executarBusca = async () => {
    if (
      proficienciaSelecionada &&
      disciplinaSelecionada &&
      turma !== 0 &&
      modalidade &&
      ano
    ) {
      if (proficienciaSelecionada === 3 || proficienciaSelecionada === 5) {
        if (bimestreSelecionado) {
          setLoading(true);
          await buscarDadosListaDoBancoDeDados(
            disciplinaSelecionada,
            proficienciaSelecionada,
            bimestreSelecionado,
          );
          setLoading(false);
        }
      } else {
        setLoading(true);
        await buscarDadosListaDoBancoDeDados(
          disciplinaSelecionada,
          proficienciaSelecionada,
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    executarBusca();
  }, [disciplinaSelecionada, proficienciaSelecionada, bimestreSelecionado]);

  const buscarDadosListaDoBancoDeDados = async (
    componenteCurricularId?: number,
    proficienciaId?: number,
    bimestreId?: number | null,
  ) => {
    const disciplinaId = componenteCurricularId ?? disciplinaSelecionada;
    const profId = proficienciaId ?? proficienciaSelecionada;

    try {
      const resposta = await NovaSondagemServico.get("/Questionario", {
        headers: { "X-Token-Principal": usuario?.token },
        params: {
          TurmaId: turma,
          ProficienciaId: profId,
          ComponenteCurricularId: disciplinaId,
          Modalidade: modalidade,
          Ano: ano,
          BimestreId: bimestreId ?? undefined,
        },
      });

      console.log("Resposta do questionario:", resposta);

      const dadosLegenda =
        resposta.data.estudantes[0].coluna[0].opcaoResposta.map(
          (legenda: any) => ({
            corFundo: legenda.corFundo,
            descricaoLegenda: legenda.descricaoOpcaoResposta,
            textoLegenda: legenda.legenda,
          }),
        );
      setDadosLegenda(dadosLegenda);
      setDadosLista(resposta.data);
      setDesabilitarBotoes(!resposta.data.podeSalvar);

      const arrayAuditoria = [
        resposta.data.inseridoPor,
        resposta.data.alteradoPor,
      ].filter((item) => item != null && item !== "");
      setDadosAuditoria(arrayAuditoria);
    } catch (error: any) {
      console.error("Erro ao buscar dados da lista:", error);
      console.log("Status do erro:", error.response?.status);
      console.log("Error code:", error.code);

      if (error.response?.status === 404) {
        notification.warning({
          message: "Questões não encontradas",
          description:
            "Por favor, cadastre as questões para esta turma antes de continuar.",
          duration: 5,
          placement: "topRight",
        });
      } else if (error.code === "ERR_NETWORK" || !error.response) {
        notification.error({
          message: "Erro de conexão",
          description:
            "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.",
          duration: 5,
          placement: "topRight",
        });
      } else {
        message.error("Erro ao carregar dados da sondagem. Tente novamente.");
      }
    }
  };

  const gerarDados = useCallback(() => {
    if (!dadosLista?.estudantes?.length) {
      return [];
    }
    const dadosFormulario = formListaDinamica.getFieldsValue();

    const dadosParaSalvar = dadosLista?.estudantes.map(
      (estudante, estudanteIndex) => {
        const respostas = estudante.coluna.map((_, colunaIndex) => {
          const respostaId =
            dadosFormulario[`respostaId_${estudanteIndex}_${colunaIndex}`];
          const opcaoRespostaId =
            dadosFormulario[`resposta_${estudanteIndex}_${colunaIndex}`];

          return {
            id: respostaId ?? 0,
            opcaoRespostaId: opcaoRespostaId ?? null,
          };
        });

        return {
          codigo: estudante.codigo,
          numeroAlunoChamada: estudante.numeroAlunoChamada,
          nomeEstudante: estudante.nome,
          linguaPortuguesaSegundaLingua:
            dadosFormulario[
              `linguaPortuguesaSegundaLingua_${estudanteIndex}`
            ] ?? estudante.linguaPortuguesaSegundaLingua,
          respostas: estudante.coluna.map((coluna, colunaIndex) => ({
            bimestreId: coluna.idCiclo,
            questaoId:
              dadosLista.estudantes[estudanteIndex].coluna[colunaIndex]
                .questaoSubrespostaId ??
              dadosLista?.questaoId ??
              0,
            opcaoRespostaId: respostas[colunaIndex].opcaoRespostaId,
          })),
        };
      },
    );

    return dadosParaSalvar;
  }, [dadosLista, formListaDinamica]);

  const salvarDadosSondagem = useCallback(async () => {
    const dadosParaSalvar = gerarDados();

    const data = {
      sondagemId: dadosLista?.sondagemId ?? 0,
      turmaId: turma,
      alunos: dadosParaSalvar,
    };
    console.log("Dados para salvar:", data);
    try {
      const resposta = await NovaSondagemServico.post("Sondagem", data, {
        headers: { "X-Token-Principal": usuario?.token },
      });

      if (resposta.status === 200) {
        notification.success({
          message: "Sondagem salva com sucesso!",
          description:
            "Os dados da sondagem foram salvos e estão disponíveis para consulta.",
          duration: 5,
          placement: "topRight",
        });
        executarBusca();
      }
    } catch (error: any) {
      console.error("ERRO:", error);

      const errorMessage =
        error.response?.data?.title ??
        error.response?.data?.message ??
        "Erro ao salvar a sondagem. Tente novamente.";

      const errorDetails = error.response?.data?.errors
        ? Object.entries(error.response.data.errors)
            .map(
              ([key, value]: [string, any]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
            )
            .join("\n")
        : null;

      notification.error({
        message: "Erro ao salvar sondagem",
        description: errorDetails ?? errorMessage,
        duration: 5,
        placement: "topRight",
      });
    }
  }, [usuario?.token, gerarDados, turma]);

  const CancelarCadastroSondagem = async () => {
    if (proficienciaSelecionada && disciplinaSelecionada) {
      console.log("Recarregando sondagem com os parâmetros:", {
        modalidade,
        ano,
        componenteCurricular: disciplinaSelecionada,
        proficiencia: proficienciaSelecionada,
        turmaId: turma,
        bimestreId: bimestreSelecionado,
      });

      await buscarDadosListaDoBancoDeDados(
        disciplinaSelecionada,
        proficienciaSelecionada,
        bimestreSelecionado,
      );
    }
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  return (
    <>
      <div className="grupoAlertas">
        {!turmaSelecionada?.turma && (
          <Row gutter={16} className="p-0">
            <Alerta
              alerta={{
                tipo: "warning",
                id: "AlertaPrincipal",
                mensagem: "Você precisa escolher uma turma.",
                estiloTitulo: { fontSize: "18px" },
              }}
              className="mb-2 larguraAlerta"
            />
          </Row>
        )}
        {turmaSelecionada?.turma && !modalidadeAnoValidos && (
          <Row gutter={16} className="p-0">
            <Alerta
              alerta={{
                tipo: "warning",
                id: "SegundoAlerta",
                mensagem: erroValidacaoTurma ?? '',
                estiloTitulo: { fontSize: "18px" },
              }}
              className="mb-2 larguraAlerta"
            />
          </Row>
        )}
      </div>

      <div className="linhaTituloBotao">
        <div className="tituloSondagem">Sondagem</div>
        <div>
          <Button
            id="sondagem-button-voltar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              voltarSondagem();
            }}
            icon={<Icon className={`fa fa-arrow-left iconBotaoVoltar`} />}
          ></Button>

          <Button
            id="sondagem-button-cancelar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              CancelarCadastroSondagem();
            }}
            disabled={desabilitarBotoes}
          >
            Cancelar
          </Button>

          <Button
            id="sondagem-button-salvar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              salvarDadosSondagem();
            }}
            disabled={desabilitarBotoes}
          >
            Salvar
          </Button>
        </div>
      </div>

      <Card className="CardSondagemEfeitos">
        <div className="textoSondagemEstilo">
          <p>
            Preencha os campos para conferir as informações das turmas e
            estudantes da Unidade Educacional selecionada.
          </p>
        </div>
        <div>
          <Form form={formFiltro} layout="vertical">
            <Row gutter={16}>
              <Col
                xs={24}
                sm={24}
                md={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
                lg={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
                xl={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
              >
                <Form.Item
                  name="disciplinaId"
                  label="Componente Curricular"
                  className="labelSelectSondagem"
                >
                  <Select
                    id="sondagem-select-componente-curricular"
                    options={listaDisciplinas}
                    placeholder="Selecione o componente curricular"
                    onChange={onChangeDisciplinas}
                    disabled={desabilitarDisciplina}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
                lg={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
                xl={
                  proficienciaSelecionada === 3 || proficienciaSelecionada === 5
                    ? 8
                    : 12
                }
              >
                <Form.Item
                  name="proficienciaId"
                  label="Proficiência"
                  className="labelSelectSondagem"
                >
                  <Select
                    id="sondagem-select-proficiencia"
                    options={listaProficiencia}
                    placeholder="Selecione a proficiência"
                    onChange={onChangeProficiencia}
                    disabled={desabilitarProficiencia}
                  />
                </Form.Item>
              </Col>
              {(proficienciaSelecionada === 3 ||
                proficienciaSelecionada === 5) && (
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                  <Form.Item
                    name="bimestreId"
                    label="Bimestre"
                    className="labelSelectSondagem"
                  >
                    <Select
                      id="sondagem-select-bimestre"
                      options={listaBimestre}
                      placeholder="Selecione o bimestre"
                      onChange={onChangeBimestre}
                      disabled={desabilitarBimestre}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </div>
        <Spin spinning={loading} tip="Carregando dados...">
          <SondagemListaDinamica
            dados={dadosLista}
            formListaDinamica={formListaDinamica}
          />
        </Spin>
        <Legendas data={dadosLegenda || []} />

        <Auditoria linhas={dadosAuditoria || []} />
      </Card>
    </>
  );
};
export default Conteudo;
