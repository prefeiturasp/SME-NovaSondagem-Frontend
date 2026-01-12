import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Form, Select, Row, Col, message } from "antd";
import SondagemListaDinamica from "../../../componentes/sondagem/listaDinamica/sondagemListaDinamica";
import MockDadosTabelaDinamica from "../../../mocks/MockDadosTabelaDinamica.json";
import MockDadosTabelaDinamica2 from "../../../mocks/MockDadosTabelaDinamica2.json";
import type { DadosTabelaDinamica } from "../../../core/dto/types";
import "./conteudo.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Alerta from "../../../componentes/biblioteca/Alerta";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import Legendas from "../legendas/legendas";
import NovaSondagemServico from "../../../core/servico/servico";
import { Auditoria } from "../auditoria/auditoria";

const Conteudo: React.FC = () => {
  const usuario = useSelector((store: any) => store.usuario);
  const turmaSelecionada = usuario?.turmaSelecionada;
  const turma = turmaSelecionada ? turmaSelecionada.id : 0;
  const modalidade = usuario?.turmaSelecionada?.modalidade;
  const ano = usuario?.turmaSelecionada?.ano;

  console.log("Usuario no conteudo:", usuario);

  const [listaDisciplinas, setListaDisciplinas] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [listaProficiencia, setListaProficiencia] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [dadosLista, setDadosLista] = useState<DadosTabelaDinamica | null>(
    null
  );

  const [dadosLegenda, setDadosLegenda] = useState<LegendasProps[] | null>(
    null
  );

  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(true);
  const [desabilitarProficiencia, setDesabilitarProficiencia] = useState(true);

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    number | null
  >(null);
  const [proficienciaSelecionada, setProficienciaSelecionada] = useState<
    number | null
  >(null);

  const [modalidadeAnoValidos, setModalidadeAnoValidos] = useState(false);

  const [formFiltro] = Form.useForm();
  const [formListaDinamica] = Form.useForm();

  const verificarModalidadeTurma = useCallback(() => {
    if (modalidade === "3") {
      if (ano === "1") {
        return true;
      }
    }
    if (modalidade === "5") {
      if (ano === "1" || ano === "2" || ano === "3") {
        return true;
      }
    }
    return false;
  }, [modalidade, ano]);

  const obterDisciplinas = useCallback(async () => {
    try {
      const resposta = await NovaSondagemServico.get("/ComponenteCurricular", {
        headers: { "X-Token-Principal": usuario?.token },
      });

      if (resposta?.data?.length > 0) {
        setDesabilitarDisciplina(false);
        const dadosMapeados = resposta.data.map((item: any) => ({
          value: item.id,
          label: item.nome,
        }));
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
          }
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
    [formFiltro, usuario?.token]
  );

  const resetando = useCallback(() => {
    formFiltro.resetFields();
    setListaDisciplinas([]);
    setDesabilitarDisciplina(true);
    setDesabilitarProficiencia(true);
    setDadosLista(null);
    setModalidadeAnoValidos(false);
  }, [formFiltro]);

  useEffect(() => {
    const executar = async () => {
      setDadosLista(null);
      setDesabilitarDisciplina(true);
      setDesabilitarProficiencia(true);
      if (modalidade && ano) {
        const valido = verificarModalidadeTurma();
        setModalidadeAnoValidos(valido);

        if (valido && turma !== 0) {
          obterDisciplinas();
        } else {
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
  ]);

  const onChangeDisciplinas = async (disciplinaId: number) => {
    if (disciplinaId) {
      setDisciplinaSelecionada(disciplinaId);
      await obterProficiencia(disciplinaId);
    }
  };

  const onChangeProficiencia = async (proficienciaId: number) => {
    if (proficienciaId) {
      setProficienciaSelecionada(proficienciaId);
      if (proficienciaId === 4) {
        await buscarDadosLista();
      } else if (proficienciaId === 5) {
        await buscarDadosLista2();
      }
    }
  };

  const buscarDadosLista = async () => {
    try {
      const dadosMock = MockDadosTabelaDinamica;
      const dadosLegenda = dadosMock.estudantes[0].coluna[0].opcaoResposta.map(
        (legenda) => ({
          corFundo: legenda.corFundo,
          descricaoLegenda: legenda.descricaoLegenda,
          textoLegenda: legenda.descricaoOpcao,
        })
      );
      setDadosLegenda(dadosLegenda);
      setDadosLista(dadosMock);
    } catch (error: any) {
      console.error("Erro ao buscar dados da lista 2:", error);
      console.error("Erro ao buscar dados da lista:", error);
      message.error("Erro ao carregar dados da sondagem. Tente novamente.");
    }
  };

  const buscarDadosLista2 = async () => {
    try {
      const dadosMock = MockDadosTabelaDinamica2;
      const dadosLegenda = dadosMock.estudantes[0].coluna[0].opcaoResposta.map(
        (legenda) => ({
          corFundo: legenda.corFundo,
          descricaoLegenda: legenda.descricaoLegenda,
          textoLegenda: legenda.descricaoOpcao,
        })
      );
      setDadosLegenda(dadosLegenda);
      setDadosLista(dadosMock);
    } catch (error: any) {
      console.error("Erro ao buscar dados da lista 2:", error);
      message.error("Erro ao carregar dados da sondagem. Tente novamente.");
    }
  };

  const salvarDadosSondagem = () => {
    const dadosFormulario = formListaDinamica.getFieldsValue();

    const dadosParaSalvar = dadosLista?.estudantes.map(
      (estudante, estudanteIndex) => {
        const respostas = estudante.coluna.map((coluna, colunaIndex) => ({
          nomeColuna: coluna.descricaoColuna,
          respostaId:
            dadosFormulario[`respostaId_${estudanteIndex}_${colunaIndex}`] ??
            null,
          respostaSelecionada:
            dadosFormulario[`resposta_${estudanteIndex}_${colunaIndex}`] ??
            null,
        }));

        return {
          numeroEstudante: estudante.numero,
          nomeEstudante: estudante.nome,
          lp: dadosFormulario[`lp_${estudanteIndex}`] ?? false,
          respostas,
        };
      }
    );

    console.log("Dados organizados para salvar:", dadosParaSalvar);
  };

  const CancelarCadastroSondagem = async () => {
    if (proficienciaSelecionada) {
      console.log("Recarregando sondagem com os parâmetros:", {
        modalidade,
        ano,
        componenteCurricular: disciplinaSelecionada,
        proficiencia: proficienciaSelecionada,
        turmaId: turma,
      });

      if (proficienciaSelecionada === 4) {
        await buscarDadosLista();
      } else if (proficienciaSelecionada === 5) {
        await buscarDadosLista2();
      }
    }
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  return (
    <>
      <div className="grupoAlertas">
        {!turmaSelecionada?.turma ? (
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
        ) : null}
        {!modalidadeAnoValidos ? (
          <Row gutter={16} className="p-0">
            <Alerta
              alerta={{
                tipo: "warning",
                id: "SegundoAlerta",
                mensagem:
                  'Só existe sondagem para modalidade "Ensino Fundamental" do 1° a 3° ano e "Educação de Jovens Adultos" do 1° ano.',
                estiloTitulo: { fontSize: "18px" },
              }}
              className="mb-2 larguraAlerta"
            />
          </Row>
        ) : null}
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
            icon={<ArrowLeftOutlined />}
          ></Button>

          <Button
            id="sondagem-button-cancelar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              CancelarCadastroSondagem();
            }}
          >
            Cancelar
          </Button>

          <Button
            id="sondagem-button-salvar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              salvarDadosSondagem();
            }}
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
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
            </Row>
          </Form>
        </div>
        <SondagemListaDinamica
          dados={dadosLista}
          formListaDinamica={formListaDinamica}
        />
        <Legendas data={dadosLegenda || []} />

        <Auditoria
          linhas={[
            "INSERIDO por ANNE ALICE FERREIRA DE PAULA (9350276) em 07/02/2025 07:22:24",
          ]}
        />
      </Card>
    </>
  );
};
export default Conteudo;
