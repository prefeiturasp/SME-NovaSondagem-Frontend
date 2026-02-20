import React from "react";
import { Form, Row, Col, Select } from "antd";
import type { FormInstance } from "antd";
import type { DadosTabelaDinamicaRelatorio } from "../../../core/dto/typesRelatorio";
import mockDados from "../../../mocks/MockDadosTabelaDinamica3.json";
import "./filtroRelatorio.css";

type ValoresFiltroRelatorio = {
  anoLetivo?: number;
  dre?: number;
  ue?: number;
  modalidade?: number;
  semestre?: number;
  turma?: number;
  componenteCurricular?: number;
  proficiencia?: number;
  bimestre?: number;
};

type FiltroRelatorioProps = {
  form: FormInstance;
  onDadosCarregados: (dados: DadosTabelaDinamicaRelatorio | null) => void;
};

const FiltroRelatorio: React.FC<FiltroRelatorioProps> = ({
  form,
  onDadosCarregados,
}) => {
  const listaAnosLetivos: Array<{ value: number; label: string }> = [];
  const listaDREs: Array<{ value: number; label: string }> = [];
  const listaUEs: Array<{ value: number; label: string }> = [];
  const listaModalidades: Array<{ value: number; label: string }> = [];
  const listaSemestres: Array<{ value: number; label: string }> = [];
  const listaTurmas: Array<{ value: number; label: string }> = [];
  const listaComponentesCurriculares: Array<{ value: number; label: string }> =
    [];
  const listaProficiencias: Array<{ value: number; label: string }> = [];
  const listaBimestres: Array<{ value: number; label: string }> = [];

  const desabilitarAnoLetivo = false;
  const desabilitarDRE = false;
  const desabilitarUE = false;
  const desabilitarModalidade = false;
  const desabilitarSemestre = false;
  const desabilitarTurma = false;
  const desabilitarComponenteCurricular = false;
  const desabilitarProficiencia = false;
  const desabilitarBimestre = false;

  const onChangeAnoLetivo = () => {};
  const onChangeDRE = () => {};
  const onChangeUE = () => {};
  const onChangeModalidade = () => {};
  const onChangeSemestre = () => {};
  const onChangeTurma = () => {};
  const onChangeComponenteCurricular = () => {};
  const onChangeProficiencia = () => {};
  const onChangeBimestre = () => {};

  const buscarDados = async () => {
    // Esse meetodo é ativado só quando os filtros são preenchidos.
    const dados = mockDados as DadosTabelaDinamicaRelatorio;
    onDadosCarregados(dados);
  };

  const camposObrigatorios: Array<keyof ValoresFiltroRelatorio> = [
    "anoLetivo",
    "dre",
    "ue",
    "modalidade",
    "semestre",
    "turma",
    "componenteCurricular",
    "proficiencia",
    "bimestre",
  ];

  const validarCamposPreenchidos = (valores: ValoresFiltroRelatorio) =>
    camposObrigatorios.every((campo) => {
      const valor = valores[campo];
      return valor !== undefined && valor !== null;
    });

  const onValuesChange = (_: unknown, allValues: ValoresFiltroRelatorio) => {
    if (validarCamposPreenchidos(allValues)) {
      void buscarDados();
      return;
    }

    onDadosCarregados(null);
  };

  return (
    <>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="anoLetivo"
              label="Ano Letivo"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-ano-letivo"
                options={listaAnosLetivos}
                placeholder="Selecione"
                onChange={onChangeAnoLetivo}
                disabled={desabilitarAnoLetivo}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="dre"
              label="Diretoria Regional de Educação (DRE)"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-dre"
                options={listaDREs}
                placeholder="Selecione"
                onChange={onChangeDRE}
                disabled={desabilitarDRE}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="ue"
              label="Unidade Educacional (UE)"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-ue"
                options={listaUEs}
                placeholder="Selecione"
                onChange={onChangeUE}
                disabled={desabilitarUE}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="modalidade"
              label="Modalidade"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-modalidade"
                options={listaModalidades}
                placeholder="Selecione"
                onChange={onChangeModalidade}
                disabled={desabilitarModalidade}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="semestre"
              label="Semestre"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-semestre"
                options={listaSemestres}
                placeholder="Selecione"
                onChange={onChangeSemestre}
                disabled={desabilitarSemestre}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="turma"
              label="Turma"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-turma"
                options={listaTurmas}
                placeholder="Selecione"
                onChange={onChangeTurma}
                disabled={desabilitarTurma}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="componenteCurricular"
              label="Componente curricular"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-componente-curricular"
                options={listaComponentesCurriculares}
                placeholder="Selecione"
                onChange={onChangeComponenteCurricular}
                disabled={desabilitarComponenteCurricular}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="proficiencia"
              label="Proficiência"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-proficiencia"
                options={listaProficiencias}
                placeholder="Selecione"
                onChange={onChangeProficiencia}
                disabled={desabilitarProficiencia}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="bimestre"
              label="Bimestre"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-select-bimestre"
                options={listaBimestres}
                placeholder="Selecione"
                onChange={onChangeBimestre}
                disabled={desabilitarBimestre}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FiltroRelatorio;
