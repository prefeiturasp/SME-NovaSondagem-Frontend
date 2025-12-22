import React, { useEffect, useState } from "react";
import { Button, Card, Form, Select, Row, Col } from "antd";
import SondagemListaDinamica from "../../../componentes/sondagem/listaDinamica/sondagemListaDinamica";
import MockDadosTabelaDinamica from "~/mocks/MockDadosTabelaDinamica.json";
import type { DadosTabelaDinamica } from "../../../core/dto/types";
import "./conteudo.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const Conteudo: React.FC = () => {
  //const [exibirLoader, setExibirLoader] = useState(false);

  const usuario = useSelector((store: any) => store.usuario);
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

  const ano = "1";

  const [formFiltro] = Form.useForm();
  const [formListaDinamica] = Form.useForm();

  useEffect(() => {
    //TODO: validar modalidade e ano antes de obter disciplinas!
    obterDisciplinas();
  }, []);

  const obterDisciplinas = async () => {
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
  };

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
    console.log("Salvar dados de sondagem");
  };

  const CancelarCadastroSondagem = () => {
    console.log("Cancelar cadastro de sondagem");
  };

  const voltarSondagem = () => {
    console.log("Voltar para a tela anterior");
  };

  return (
    <>
      <div className="linhaTituloBotao">
        <div className="tituloSondagem">Sondagem</div>
        <div>
          <Button
            className="sondagemBotaoEstilo"
            onClick={() => {
              voltarSondagem();
            }}
            icon={<ArrowLeftOutlined />}
          ></Button>

          <Button
            className="sondagemBotaoEstilo"
            onClick={() => {
              CancelarCadastroSondagem();
            }}
          >
            Cancelar
          </Button>

          <Button
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
