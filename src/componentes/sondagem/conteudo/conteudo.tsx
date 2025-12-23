import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Form, Select, Row, Col } from "antd";
import SondagemListaDinamica from "../../../componentes/sondagem/listaDinamica/sondagemListaDinamica";
import MockDadosTabelaDinamica from "~/mocks/MockDadosTabelaDinamica.json";
import type { DadosTabelaDinamica } from "../../../core/dto/types";
import "./conteudo.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Alerta from "~/componentes/biblioteca/Alerta";

const Conteudo: React.FC = () => {
  //const [exibirLoader, setExibirLoader] = useState(false);

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

  const [dadoslista, setDadosLista] = useState<DadosTabelaDinamica | null>(
    null
  );

  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(true);

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
    // const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
    //   turmaId
    // );
    formFiltro.resetFields();
    const disciplinas = MockDisciplina();

    if (disciplinas?.data?.length > 0) {
      setDesabilitarDisciplina(false);
      setListaDisciplinas(disciplinas.data);
    } else {
      setDesabilitarDisciplina(true);
      setListaDisciplinas([]);
    }
  }, [formFiltro]);

  const resetando = useCallback(() => {
    formFiltro.resetFields();
    setListaDisciplinas([]);
    setDesabilitarDisciplina(true);
    setDadosLista(null);
    setModalidadeAnoValidos(false);
  }, [formFiltro]);

  useEffect(() => {
    setDadosLista(null);
    setDesabilitarDisciplina(true);
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
  }, [
    modalidade,
    ano,
    turma,
    verificarModalidadeTurma,
    obterDisciplinas,
    resetando,
  ]);

  const onChangeDisciplinas = async (disciplinaId: any) => {
    if (disciplinaId) {
      const valorSelecionado = formFiltro.getFieldValue("disciplinaId");
      console.log("ID:", valorSelecionado);
      // await buscarDados(valorSelecionado);

      const listaProficiencia = MockProficiencia();
      if (listaProficiencia?.data?.length > 0) {
        setListaProficiencia(listaProficiencia.data);
      } else {
        setListaProficiencia([]);
      }
    }
  };

  const onChangeProficiencia = async (proficienciaId: any) => {
    if (proficienciaId) {
      const valorSelecionado = formFiltro.getFieldValue("proficienciaId");
      console.log("ID proficiencia:", valorSelecionado);
      await buscarDadosLista();
    }
  };

  const buscarDadosLista = async () => {
    try {
      //setExibirLoader(true);
      //TODO: Chamar API para buscar os dados da lista

      const dadosMock = MockDadosTabelaDinamica;
      setDadosLista(dadosMock);
    } catch (error) {
      // Tratar erro caso necessário
    } finally {
      //setExibirLoader(false);
    }
  };

  const salvarDadosSondagem = () => {
    const dadosFormulario = formListaDinamica.getFieldsValue();

    const dadosParaSalvar = dadoslista?.estudantes.map(
      (estudante, estudanteIndex) => {
        const respostas = estudante.coluna.map((coluna, colunaIndex) => ({
          nomeColuna: coluna.descricaoColuna,
          respostaId:
            dadosFormulario[`respostaId_${estudanteIndex}_${colunaIndex}`] ||
            null,
          respostaSelecionada:
            dadosFormulario[`resposta_${estudanteIndex}_${colunaIndex}`] ||
            null,
        }));

        return {
          numeroEstudante: estudante.numero,
          nomeEstudante: estudante.nome,
          lp: dadosFormulario[`lp_${estudanteIndex}`] || false,
          respostas,
        };
      }
    );

    console.log("Dados organizados para salvar:", dadosParaSalvar);
  };

  const CancelarCadastroSondagem = () => {
    console.log("Cancelar cadastro de sondagem");
  };

  const voltarSondagem = () => {
    console.log("Voltar para a tela anterior");
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
                  name="componenteCurricular"
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
                  name="proficiencia"
                  label="Proficiência"
                  className="labelSelectSondagem"
                >
                  <Select
                    id="sondagem-select-proficiencia"
                    options={listaProficiencia}
                    placeholder="Selecione a proficiência"
                    onChange={onChangeProficiencia}
                    disabled={desabilitarDisciplina}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <SondagemListaDinamica
          dados={dadoslista}
          formListaDinamica={formListaDinamica}
          anoTurma={ano}
        />
      </Card>
    </>
  );
};
export default Conteudo;

const MockDisciplina = () => {
  const disciplina = {
    data: [
      { value: 1, label: "Língua Portuguesa" },
      { value: 2, label: "Matemática" },
    ],
  };

  return disciplina;
};

const MockProficiencia = () => {
  const proficiencia = {
    data: [
      { value: 1, label: "Escrita" },
      { value: 2, label: "Leitura" },
    ],
  };

  return proficiencia;
};
