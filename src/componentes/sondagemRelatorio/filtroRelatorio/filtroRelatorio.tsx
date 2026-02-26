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
import { validarTurma } from "../../../services/turmaService";

type FiltroRelatorioProps = {
  form: FormInstance;
  onDadosCarregados: (dados: DadosTabelaDinamica | null) => void;
  onFiltrosAlterados: (filtros: ValoresFiltroRelatorio | null) => void;
  onErroValidacaoTurma: (mensagem: string | null) => void;
};

const FiltroRelatorioInner: React.ForwardRefRenderFunction<
  { reset: () => void },
  FiltroRelatorioProps
> = (
  { form, onDadosCarregados, onFiltrosAlterados, onErroValidacaoTurma },
  ref,
) => {
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
    Array<{ value: number | null; label: string }>
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
    Array<{ value: number | null; label: string }>
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

  const normalizarNumero = (
    value: number | string | null | undefined,
  ): number | null => {
    if (value === null || value === undefined || value === "") return null;
    const numero = Number(value);
    return Number.isNaN(numero) ? null : numero;
  };

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

  const onChangeModalidade = async (value: number | string | null) => {
    const modalidadeSelecionada = normalizarNumero(value);
    form.setFieldsValue({
      dre: undefined,
      ue: undefined,
      turma: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaDREs([]);
    setListaUEs([]);
    setListaTurmas([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarDRE(true);
    setDesabilitarUE(true);
    setDesabilitarTurma(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);
    setSelectedModalidade(modalidadeSelecionada);
    setSelectedProficiencia(null);

    let ehEja = 5;

    if (modalidadeSelecionada === ehEja) {
      setDesabilitarSemestre(true);
    } else {
      setDesabilitarSemestre(false);
    }

    const ano = form.getFieldValue("anoLetivo");
    if (modalidadeSelecionada === null || !ano) return;

    const dres = await DreService({ token: usuario?.token, anoLetivo: ano });
    if (dres) {
      setListaDREs(dres);
      setDesabilitarDRE(false);
    }
  };

  const onChangeDRE = async (value: number) => {
    form.setFieldsValue({
      ue: undefined,
      turma: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaUEs([]);
    setListaTurmas([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarUE(true);
    setDesabilitarTurma(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);

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
    form.setFieldsValue({
      turma: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaTurmas([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarTurma(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);

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

  const onChangeTurma = async (turma: number) => {
    form.setFieldsValue({
      componenteCurricular: undefined,
      proficiencia: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);

    const resultado = await validarTurma({
      turmaId: turma,
      token: usuario?.token,
    });
    if (!resultado.valida && resultado.mensagens.length > 0) {
      setDesabilitarComponenteCurricular(true);
      setDesabilitarProficiencia(true);
      onErroValidacaoTurma(resultado.mensagens.join(" "));
      return false;
    } else {
      obterComponentesCurriculares(usuario?.token);
      setDesabilitarComponenteCurricular(false);
      setDesabilitarProficiencia(false);
      onErroValidacaoTurma(null);
      return true;
    }
  };

  const onChangeComponenteCurricular = async (value: number) => {
    form.setFieldsValue({
      proficiencia: undefined,
      semestre: undefined,
      bimestre: undefined,
    });
    setListaProficiencias([]);
    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);

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

  const onChangeProficiencia = (value: number | string | null) => {
    form.setFieldsValue({
      semestre: undefined,
      bimestre: undefined,
    });

    setListaBimestres([]);
    setListaSemestres([]);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);

    const proficienciaSelecionada = normalizarNumero(value);
    setSelectedProficiencia(proficienciaSelecionada);

    if (selectedModalidade === 5) {
      setDesabilitarBimestre(false);
      setDesabilitarSemestre(true);
      obterBimestres(usuario?.token);
    } else {
      setDesabilitarSemestre(false);
      setDesabilitarBimestre(true);
      setListaSemestres([
        { value: null, label: "Todos" },
        { value: 1, label: "1º Semestre" },
        { value: 2, label: "2º Semestre" },
      ]);
    }
  };

  const onChangeSemestre = (value: number | null) => {
    const valores = {
      ...form.getFieldsValue(),
      semestre: value,
    } as ValoresFiltroRelatorio;
    void buscarDados(valores);
  };
  const onChangeBimestre = (value: number | null) => {
    const valores = {
      ...form.getFieldsValue(),
      bimestre: value,
    } as ValoresFiltroRelatorio;
    void buscarDados(valores);
  };

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
    obterAnosLetivos(usuario?.token);
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
      setListaBimestres([{ value: null, label: "Todos" }, ...resposta]);
      setDesabilitarBimestre(false);
    } else {
      setListaBimestres([]);
      setDesabilitarBimestre(true);
    }
  };

  const buscarDados = async (valores: ValoresFiltroRelatorio) => {
    onDadosCarregados(null);

    const ano = listaTurmas.find((turma) => turma.value === valores.turma)?.ano;
    valores.ano = ano;

    const dados = await DadosRelatorioService({
      turmaId: valores.turma as number,
      proficienciaId: valores.proficiencia as number,
      componenteCurricularId: valores.componenteCurricular as number,
      modalidade: valores.modalidade as number,
      ano: ano as number,
      anoLetivo: valores.anoLetivo as number,
      bimestreId: valores.bimestre as number | null,
      semestre: valores.semestre as number | null,
      ueCodigo: String(valores.ue),
      token: usuario?.token,
    });
    onDadosCarregados(dados);
    onFiltrosAlterados(valores);
  };

  const isInfantil = selectedModalidade === 5;
  const temProficienciaSelecionada = selectedProficiencia !== null;
  const showBimestre =
    selectedModalidade !== null && isInfantil && temProficienciaSelecionada;
  const showSemestre =
    selectedModalidade !== null && !isInfantil && temProficienciaSelecionada;

  return (
    <Form form={form} layout="vertical">
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
          <Form.Item name="turma" label="Turma" className="labelSelectSondagem">
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
  );
};

export default forwardRef(FiltroRelatorioInner);
