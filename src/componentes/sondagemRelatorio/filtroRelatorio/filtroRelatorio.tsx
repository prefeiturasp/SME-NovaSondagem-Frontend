import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Row, Col, Select } from "antd";
import type { FormInstance } from "antd";
import type {
  DadosTabelaDinamica,
  ValoresFiltroRelatorio,
} from "../../../core/dto/typesRelatorio";
import "./filtroRelatorio.css";
import ComponenteCurricularService from "../../../services/componenteCurricularService/componenteCurricularService";
import { useSelector } from "react-redux";
import ProficienciaService from "../../../services/proficienciaService/ProficienciaService";
import BimestreService from "../../../services/bimestreService/bimestreService";
import AnoLetivoService from "../../../services/anoLetivo/anoLetivoService";
import DreService from "../../../services/dre/dreService";
import UeService from "../../../services/ue/ueService";
import ModalidadeService from "../../../services/modalidade/modalidadeService";
import TurmaService from "../../../services/turma/turmaService";
import DadosRelatorioService from "../../../services/buscarDadosRelatorio/buscarDadosRelatorio";

type FiltroRelatorioProps = {
  form: FormInstance;
  onDadosCarregados: (dados: DadosTabelaDinamica | null) => void;
  onFiltrosAlterados: (filtros: ValoresFiltroRelatorio | null) => void;
};

const FiltroRelatorioInner: React.ForwardRefRenderFunction<
  { reset: () => void },
  FiltroRelatorioProps
> = ({ form, onDadosCarregados, onFiltrosAlterados }, ref) => {
  const usuario = useSelector((store: any) => store.usuario);

  const [listaAnosLetivos, setListaAnosLetivos] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaDREs, setListaDREs] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaUEs, setListaUEs] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaModalidades, setListaModalidades] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaSemestres, setListaSemestres] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaTurmas, setListaTurmas] = useState<
    Array<{ value: number; label: string; ano: number }>
  >([]);

  const [listaComponentesCurriculares, setListaComponentesCurriculares] =
    useState<Array<{ value: number; label: string }>>([]);
  const [listaProficiencias, setListaProficiencias] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [listaBimestres, setListaBimestres] = useState<
    Array<{ value: number; label: string }>
  >([]);

  const [desabilitarAnoLetivo] = useState(false);
  const [desabilitarDRE, setDesabilitarDRE] = useState(true);
  const [desabilitarUE, setDesabilitarUE] = useState(true);
  const [desabilitarModalidade, setDesabilitarModalidade] = useState(true);
  const [desabilitarSemestre, setDesabilitarSemestre] = useState(false);
  const [desabilitarTurma, setDesabilitarTurma] = useState(true);
  const [desabilitarComponenteCurricular, setDesabilitarComponenteCurricular] =
    useState(false);
  const [desabilitarProficiencia, setDesabilitarProficiencia] = useState(false);
  const [desabilitarBimestre, setDesabilitarBimestre] = useState(false);

  const [selectedModalidade, setSelectedModalidade] = useState<number | null>(
    null,
  );
  const [selectedProficiencia, setSelectedProficiencia] = useState<
    number | null
  >(null);

  const onChangeAnoLetivo = async (value: number) => {
    form.setFieldsValue({
      modalidade: undefined,
      dre: undefined,
      ue: undefined,
      turma: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaModalidades([]);
    setListaDREs([]);
    setListaUEs([]);
    setListaTurmas([]);
    setDesabilitarModalidade(true);
    setDesabilitarDRE(true);
    setDesabilitarUE(true);
    setDesabilitarTurma(true);
    setSelectedModalidade(null);

    if (!value) return;

    const modalidades = await ModalidadeService({
      token: usuario?.token,
      anoLetivo: value,
    });

    if (modalidades) {
      setListaModalidades(modalidades);
      setDesabilitarModalidade(false);
    }
  };

  const onChangeModalidade = async (value: number) => {
    form.setFieldsValue({
      dre: undefined,
      ue: undefined,
      turma: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaDREs([]);
    setListaUEs([]);
    setListaTurmas([]);
    setDesabilitarDRE(true);
    setDesabilitarUE(true);
    setDesabilitarTurma(true);
    setSelectedModalidade(value ?? null);
    setSelectedProficiencia(null);

    let ehEja = 5;

    if (value === ehEja) {
      setDesabilitarSemestre(true);
    } else {
      setDesabilitarSemestre(false);
    }

    const ano = form.getFieldValue("anoLetivo");
    if (!value || !ano) return;

    const dres = await DreService({ token: usuario?.token, anoLetivo: ano });
    if (dres) {
      setListaDREs(dres);
      setDesabilitarDRE(false);
    }
  };

  const onChangeDRE = async (value: number) => {
    form.setFieldsValue({ ue: undefined, turma: undefined });
    setListaUEs([]);
    setListaTurmas([]);
    setDesabilitarUE(true);
    setDesabilitarTurma(true);

    const ano = form.getFieldValue("anoLetivo");
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !ano || !modalidade) return;

    const ues = await UeService({
      token: usuario?.token,
      dreId: value,
      anoLetivo: ano,
      modalidade,
    });
    if (ues) {
      setListaUEs(ues);
      setDesabilitarUE(false);
    }
  };

  const onChangeUE = async (value: number) => {
    form.setFieldsValue({ turma: undefined });
    setListaTurmas([]);
    setDesabilitarTurma(true);

    const ano = form.getFieldValue("anoLetivo");
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !ano || !modalidade) return;

    const turmas = await TurmaService({
      token: usuario?.token,
      urId: value,
      modalidade,
      anoLetivo: ano,
    });
    if (turmas) {
      setListaTurmas(turmas);
      setDesabilitarTurma(false);
    }
  };

  const onChangeTurma = () => {};

  const onChangeComponenteCurricular = async (value: number) => {
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !modalidade) return;

    const proficiencias = await ProficienciaService({
      token: usuario?.token,
      idDisciplina: value,
      modalidade,
    });
    if (proficiencias) {
      setListaProficiencias(proficiencias);
      setDesabilitarProficiencia(false);
    } else {
      setListaProficiencias([]);
      setDesabilitarProficiencia(true);
    }
  };

  const onChangeProficiencia = (value: number) => {
    setSelectedProficiencia(value ?? null);
    const permitir = [3, 5, 6].includes(value ?? -1);
    if (!permitir) {
      form.setFieldsValue({ bimestre: undefined, semestre: undefined });
      setDesabilitarBimestre(true);
      setDesabilitarSemestre(true);
      return;
    }

    if (selectedModalidade === 5) {
      setDesabilitarBimestre(false);
      setDesabilitarSemestre(true);
    } else {
      setDesabilitarSemestre(false);
      setDesabilitarBimestre(true);
    }
  };
  const onChangeSemestre = () => {};
  const onChangeBimestre = () => {};

  const onCancel = () => {
    form.resetFields();
    setSelectedModalidade(null);
    setSelectedProficiencia(null);
    setListaDREs([]);
    setListaUEs([]);
    setListaModalidades([]);
    setListaTurmas([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);

    setDesabilitarDRE(true);
    setDesabilitarUE(true);
    setDesabilitarModalidade(true);
    setDesabilitarTurma(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(false);
  };

  useImperativeHandle(ref, () => ({
    reset: onCancel,
  }));

  useEffect(() => {
    obterComponentesCurriculares(usuario?.token);
    obterBimestres(usuario?.token);
    obterAnosLetivos(usuario?.token);

    setListaSemestres([
      { value: 1, label: "1º Semestre" },
      { value: 2, label: "2º Semestre" },
    ]);
  }, [usuario?.token]);

  const obterComponentesCurriculares = async (token: string) => {
    const resposta = await ComponenteCurricularService({ token });
    if (resposta) {
      setListaComponentesCurriculares(resposta);
      setDesabilitarComponenteCurricular(false);
    } else {
      setListaComponentesCurriculares([]);
    }
  };

  const obterAnosLetivos = async (token: string) => {
    const resposta = await AnoLetivoService({
      token,
    });
    if (resposta) {
      setListaAnosLetivos(resposta);
    }
  };

  const obterBimestres = async (token: string) => {
    const resposta = await BimestreService({ token });
    if (resposta) {
      setListaBimestres(resposta);
      setDesabilitarBimestre(false);
    } else {
      setListaBimestres([]);
      setDesabilitarBimestre(true);
    }
  };

  const buscarDados = async (valores: ValoresFiltroRelatorio) => {
    const ano = listaTurmas.find((turma) => turma.value === valores.turma)?.ano;
    valores.ano = ano;
    const bimestrePayload =
      valores.modalidade === 5
        ? ((valores.bimestre as number | undefined) ?? null)
        : ((valores.semestre as number | undefined) ?? 1);

    const dados = await DadosRelatorioService({
      turmaId: valores.turma as number,
      proficienciaId: valores.proficiencia as number,
      componenteCurricularId: valores.componenteCurricular as number,
      modalidade: valores.modalidade as number,
      ano: ano as number,
      anoLetivo: valores.anoLetivo as number,
      bimestreId: bimestrePayload,
      ueCodigo: String(valores.ue),
      token: usuario?.token,
    });
    console.log("dados do relatorio", dados);
    console.log("valores do filtro", valores);
    onDadosCarregados(dados);
    onFiltrosAlterados(valores);
  };

  const camposObrigatorios: Array<keyof ValoresFiltroRelatorio> = [
    "anoLetivo",
    "dre",
    "ue",
    "modalidade",
    "turma",
    "componenteCurricular",
    "proficiencia",
  ];

  const validarCamposPreenchidos = (valores: ValoresFiltroRelatorio) =>
    camposObrigatorios.every((campo) => {
      const valor = valores[campo];
      return valor !== undefined && valor !== null;
    });

  const onValuesChange = (_: unknown, allValues: ValoresFiltroRelatorio) => {
    if (validarCamposPreenchidos(allValues)) {
      void buscarDados(allValues);
      return;
    }

    onDadosCarregados(null);
    onFiltrosAlterados(null);
  };

  const isInfantil = selectedModalidade === 5;
  let leitura = 3;
  let mapeamentoDosSaberes = 5;
  let capacidadeLeitora = 6;
  const permitirBimestrePorProficiencia = [
    leitura,
    mapeamentoDosSaberes,
    capacidadeLeitora,
  ];
  const showBimestre =
    selectedModalidade !== null &&
    isInfantil &&
    permitirBimestrePorProficiencia.includes(selectedProficiencia ?? -1);
  const showSemestre =
    selectedModalidade !== null &&
    !isInfantil &&
    permitirBimestrePorProficiencia.includes(selectedProficiencia ?? -1);

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
        </Row>

        <Row gutter={16}>
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
        </Row>

        <Row gutter={16}>
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

          {showBimestre && (
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
          )}

          {showSemestre && (
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
          )}
        </Row>
      </Form>
    </>
  );
};

export default forwardRef(FiltroRelatorioInner);
