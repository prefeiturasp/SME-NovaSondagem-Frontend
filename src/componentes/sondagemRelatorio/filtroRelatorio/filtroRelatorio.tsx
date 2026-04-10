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

const MODALIDADE_EJA = 3;
const MODALIDADE_INFANTIL = 5;
const OPCOES_SEMESTRE = [
  { value: null, label: "Todos" },
  { value: 1, label: "1º Semestre" },
  { value: 2, label: "2º Semestre" },
];
const OPCOES_PERIODO_EJA = [
  { value: 1, label: "1º Semestre" },
  { value: 2, label: "2º Semestre" },
];

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
    useState(true);
  const [desabilitarProficiencia, setDesabilitarProficiencia] = useState(true);
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

  const limparResultadoRelatorio = () => {
    onDadosCarregados(null);
    onFiltrosAlterados(null);
    onErroValidacaoTurma(null);
  };

  const obterTurmas = async (
    ueId: number,
    modalidade: number,
    anoLetivo: number,
    periodo?: number,
  ) => {
    const turmas = await TurmaService({
      token: usuario?.token,
      urId: ueId,
      modalidade,
      anoLetivo,
      periodo,
    });

    if (turmas) {
      setListaTurmas(turmas);
      setDesabilitarTurma(false);
    } else {
      setListaTurmas([]);
      setDesabilitarTurma(true);
    }
  };

  const onChangeAnoLetivo = async (value: number) => {
    limparResultadoRelatorio();
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
    setSelectedProficiencia(null);

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
    limparResultadoRelatorio();
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

    const ano = form.getFieldValue("anoLetivo");
    if (modalidadeSelecionada === null || !ano) return;

    const dres = await DreService({ token: usuario?.token, anoLetivo: ano });
    if (dres) {
      setListaDREs(dres);
      setDesabilitarDRE(false);
    }
  };

  const onChangeDRE = async (value: number) => {
    limparResultadoRelatorio();
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
    setSelectedProficiencia(null);

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
    limparResultadoRelatorio();
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
    setSelectedProficiencia(null);

    const ano = form.getFieldValue("anoLetivo");
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !ano || !modalidade) return;

    if (modalidade === MODALIDADE_EJA) {
      setListaSemestres(OPCOES_PERIODO_EJA);
      setDesabilitarSemestre(false);
      return;
    }

    await obterTurmas(value, modalidade, ano);
  };

  const onChangeTurma = async (turma: number) => {
    limparResultadoRelatorio();
    const modalidade = form.getFieldValue("modalidade");

    form.setFieldsValue({
      componenteCurricular: undefined,
      proficiencia: undefined,
      ...(modalidade === MODALIDADE_EJA ? {} : { semestre: undefined }),
      bimestre: undefined,
    });

    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);
    if (modalidade !== MODALIDADE_EJA) {
      setListaSemestres([]);
    }
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(modalidade !== MODALIDADE_EJA);
    setSelectedProficiencia(null);

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
      obterComponentesCurriculares(usuario?.token, modalidade);
      setDesabilitarComponenteCurricular(false);
      setDesabilitarProficiencia(false);
      onErroValidacaoTurma(null);
      return true;
    }
  };

  const onChangeComponenteCurricular = async (value: number) => {
    limparResultadoRelatorio();
    const modalidade = form.getFieldValue("modalidade");

    form.setFieldsValue({
      proficiencia: undefined,
      ...(modalidade === MODALIDADE_EJA ? {} : { semestre: undefined }),
      bimestre: undefined,
    });
    setListaProficiencias([]);
    setListaBimestres([]);
    if (modalidade !== MODALIDADE_EJA) {
      setListaSemestres([]);
    }
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(modalidade !== MODALIDADE_EJA);
    setSelectedProficiencia(null);

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
    limparResultadoRelatorio();
    const proficienciaSelecionada = normalizarNumero(value);
    const isEja = selectedModalidade === MODALIDADE_EJA;

    form.setFieldsValue({
      ...(isEja ? {} : { semestre: undefined }),
      bimestre: undefined,
    });

    setListaBimestres([]);
    setDesabilitarBimestre(true);
    if (!isEja) {
      setListaSemestres([]);
      setDesabilitarSemestre(true);
    }

    setSelectedProficiencia(proficienciaSelecionada);

    if (selectedModalidade === MODALIDADE_EJA) {
      setDesabilitarBimestre(false);
      setDesabilitarSemestre(false);

      if (proficienciaSelecionada !== null) {
        obterBimestres(usuario?.token, MODALIDADE_EJA);
      }
      return;
    }

    if (selectedModalidade === MODALIDADE_INFANTIL) {
      setDesabilitarBimestre(false);
      setDesabilitarSemestre(true);
      obterBimestres(usuario?.token);
    } else {
      setDesabilitarSemestre(false);
      setDesabilitarBimestre(true);
      setListaSemestres(OPCOES_SEMESTRE);
    }
  };

  const onChangeSemestre = async (value: number | null) => {
    limparResultadoRelatorio();

    if (selectedModalidade === MODALIDADE_EJA) {
      form.setFieldsValue({
        turma: undefined,
        componenteCurricular: undefined,
        proficiencia: undefined,
        bimestre: undefined,
      });
      setListaTurmas([]);
      setListaComponentesCurriculares([]);
      setListaProficiencias([]);
      setListaBimestres([]);
      setDesabilitarTurma(true);
      setDesabilitarComponenteCurricular(true);
      setDesabilitarProficiencia(true);
      setDesabilitarBimestre(true);
      setSelectedProficiencia(null);

      const ano = form.getFieldValue("anoLetivo");
      const ue = form.getFieldValue("ue");
      const periodoSelecionado = normalizarNumero(value);

      if (!ano || !ue || periodoSelecionado === null) return;

      await obterTurmas(ue, MODALIDADE_EJA, ano, periodoSelecionado);
      return;
    }

    const valores = {
      ...form.getFieldsValue(),
      semestreId: value,
    } as ValoresFiltroRelatorio;
    void buscarDados(valores);
  };
  const onChangeBimestre = (value: number | null) => {
    limparResultadoRelatorio();
    const semestreSelecionado = normalizarNumero(
      form.getFieldValue("semestre"),
    );
    const valores = {
      ...form.getFieldsValue(),
      bimestre: value,
      semestreId:
        selectedModalidade === MODALIDADE_EJA
          ? semestreSelecionado
          : form.getFieldValue("semestreId"),
    } as ValoresFiltroRelatorio;
    void buscarDados(valores);
  };

  const onCancel = () => {
    limparResultadoRelatorio();
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
    setListaSemestres([]);

    setDesabilitarDRE(true);
    setDesabilitarUE(true);
    setDesabilitarModalidade(true);
    setDesabilitarTurma(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarBimestre(true);
    setDesabilitarSemestre(true);
  };

  useImperativeHandle(ref, () => ({
    reset: onCancel,
  }));

  useEffect(() => {
    obterAnosLetivos(usuario?.token);
  }, [usuario?.token]);

  const obterComponentesCurriculares = async (
    token: string,
    modalidade: string,
  ) => {
    const resposta = await ComponenteCurricularService({ token, modalidade });
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

  const obterBimestres = async (token: string, modalidade?: number) => {
    const resposta = await BimestreService({
      token,
      ...(modalidade === MODALIDADE_EJA ? { modalidade } : {}),
    });

    if (resposta) {
      const listaComTodos = [{ value: null, label: "Todos" }, ...resposta];
      setListaBimestres(
        modalidade === MODALIDADE_EJA ? resposta : listaComTodos,
      );
      setDesabilitarBimestre(false);
    } else {
      setListaBimestres([]);
      setDesabilitarBimestre(true);
    }
  };

  const buscarDados = async (valores: ValoresFiltroRelatorio) => {
    const ano = listaTurmas.find((turma) => turma.value === valores.turma)?.ano;
    valores.ano = ano;
    const isInfantil = valores.modalidade === 5;
    const usaBimestre =
      valores.modalidade === MODALIDADE_INFANTIL ||
      valores.modalidade === MODALIDADE_EJA;

    const dados = await DadosRelatorioService({
      turmaId: valores.turma as number,
      proficienciaId: valores.proficiencia as number,
      componenteCurricularId: valores.componenteCurricular as number,
      modalidade: valores.modalidade as number,
      ano: ano as number,
      anoLetivo: valores.anoLetivo as number,
      bimestreId: usaBimestre ? (valores.bimestre ?? null) : null,
      semestreId: isInfantil ? null : (valores.semestreId ?? null),
      ueCodigo: String(valores.ue),
      token: usuario?.token,
    });
    onDadosCarregados(dados);
    onFiltrosAlterados(valores);
  };

  const isEja = selectedModalidade === MODALIDADE_EJA;
  const isInfantil = selectedModalidade === MODALIDADE_INFANTIL;
  const temProficienciaSelecionada = selectedProficiencia !== null;
  const showSemestreAntesTurma = isEja;
  const showBimestre = (isInfantil || isEja) && temProficienciaSelecionada;
  const showSemestreDepoisProficiencia =
    selectedModalidade !== null &&
    !isInfantil &&
    !isEja &&
    temProficienciaSelecionada;

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

        {showSemestreAntesTurma && (
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

        {!showSemestreAntesTurma && (
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
        )}
      </Row>

      <Row gutter={16}>
        {showSemestreAntesTurma && (
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
        )}

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

        {showSemestreDepoisProficiencia && (
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
