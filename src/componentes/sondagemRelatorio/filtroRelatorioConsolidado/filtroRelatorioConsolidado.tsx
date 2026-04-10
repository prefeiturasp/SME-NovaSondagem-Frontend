import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Checkbox, Col, Form, Row, Select } from "antd";
import type { FormInstance } from "antd";
import { useSelector } from "react-redux";
import type {
  DadosTabelaDinamica,
  ValoresFiltroRelatorioConsolidado,
} from "../../../core/dto/typesRelatorio";
import AnoLetivoService from "../../../services/anoLetivo/anoLetivoService";
import BimestreService from "../../../services/bimestreService/bimestreService";
import BuscarDadosRelatorioConsolidadoService from "../../../services/buscarDadosRelatorioConsolidado/buscarDadosRelatorioConsolidado";
import ComponenteCurricularService from "../../../services/componenteCurricularService/componenteCurricularService";
import DreService from "../../../services/dre/dreService";
import GeneroSexoService from "../../../services/generoSexoService/generoSexoService";
import ModalidadeService from "../../../services/modalidade/modalidadeService";
import ProficienciaService from "../../../services/proficienciaService/ProficienciaService";
import RacaCorService from "../../../services/racaCorService/racaCorService";
import UeService from "../../../services/ue/ueService";
import "./filtroRelatorioConsolidado.css";

type SelectOption = {
  value: number | string | null;
  label: string;
};

export type FiltroRelatorioConsolidadoRef = {
  reset: () => void;
};

type FiltroRelatorioConsolidadoProps = {
  form: FormInstance;
  onDadosCarregados: (dados: DadosTabelaDinamica | null) => void;
  onFiltrosAlterados: (
    filtros: ValoresFiltroRelatorioConsolidado | null,
  ) => void;
};

const opcoesAno: SelectOption[] = [
  { value: 1, label: "1º ANO" },
  { value: 2, label: "2º ANO" },
  { value: 3, label: "3º ANO" },
];

const opcoesAgrupamentoDados: SelectOption[] = [
  { value: "porQuestoes", label: "Por questões" },
];

const opcoesPrograma: SelectOption[] = [
  { value: "pap", label: "PAP" },
  { value: "aee", label: "AEE" },
  { value: "deficiente", label: "Deficiencia" },
];

const FiltroRelatorioConsolidadoInner: React.ForwardRefRenderFunction<
  FiltroRelatorioConsolidadoRef,
  FiltroRelatorioConsolidadoProps
> = ({ form, onDadosCarregados, onFiltrosAlterados }, ref) => {
  const usuario = useSelector((store: any) => store.usuario);

  const [listaAnosLetivos, setListaAnosLetivos] = useState<SelectOption[]>([]);
  const [listaModalidades, setListaModalidades] = useState<SelectOption[]>([]);
  const [listaDres, setListaDres] = useState<SelectOption[]>([]);
  const [listaUes, setListaUes] = useState<SelectOption[]>([]);
  const [listaComponentesCurriculares, setListaComponentesCurriculares] =
    useState<SelectOption[]>([]);
  const [listaProficiencias, setListaProficiencias] = useState<SelectOption[]>(
    [],
  );
  const [listaBimestres, setListaBimestres] = useState<SelectOption[]>([]);
  const [listaGeneros, setListaGeneros] = useState<SelectOption[]>([]);
  const [listaRacas, setListaRacas] = useState<SelectOption[]>([]);

  const [desabilitarModalidade, setDesabilitarModalidade] = useState(true);
  const [desabilitarDre, setDesabilitarDre] = useState(true);
  const [desabilitarUe, setDesabilitarUe] = useState(true);
  const [desabilitarComponenteCurricular, setDesabilitarComponenteCurricular] =
    useState(true);
  const [desabilitarProficiencia, setDesabilitarProficiencia] = useState(true);
  const [desabilitarBimestre, setDesabilitarBimestre] = useState(true);
  const [desabilitarAno, setDesabilitarAno] = useState(true);

  const limparResultadoRelatorio = () => {
    onDadosCarregados(null);
    onFiltrosAlterados(null);
  };

  const mapearFiltrosFormulario = (): ValoresFiltroRelatorioConsolidado => {
    const valores = form.getFieldsValue();
    return {
      anoLetivo: valores.anoLetivo,
      modalidade: valores.modalidade,
      dre: valores.dre,
      ue: valores.ue,
      bimestre: valores.bimestre,
      ano: valores.ano,
      componenteCurricular: valores.componenteCurricular,
      proficiencia: valores.proficiencia,
      genero: valores.genero,
      raca: valores.raca,
      programa: valores.programa,
      lpSegundaLingua: Boolean(valores.lpSegundaLingua),
    };
  };

  const camposObrigatoriosPreenchidos = (
    filtros: ValoresFiltroRelatorioConsolidado,
  ) => {
    return Boolean(
      filtros.anoLetivo &&
      filtros.modalidade &&
      filtros.dre &&
      filtros.ue &&
      filtros.bimestre !== undefined &&
      Array.isArray(filtros.ano) &&
      filtros.ano.length > 0 &&
      filtros.componenteCurricular &&
      filtros.proficiencia,
    );
  };

  const tentarBuscarDadosConsolidado = async () => {
    const filtros = mapearFiltrosFormulario();

    if (!camposObrigatoriosPreenchidos(filtros)) {
      limparResultadoRelatorio();
      return;
    }

    const dados = await BuscarDadosRelatorioConsolidadoService({
      filtros,
      token: usuario?.token,
    });

    onDadosCarregados(dados);
    onFiltrosAlterados(filtros);
  };

  const obterAnosLetivos = async (token: string) => {
    const resposta = await AnoLetivoService({ token });
    setListaAnosLetivos(resposta ?? []);
  };

  const obterOpcoesFixas = async (token: string) => {
    const [generos, racas] = await Promise.all([
      GeneroSexoService({ token }),
      RacaCorService({ token }),
    ]);
    setListaGeneros(generos ?? []);
    setListaRacas(racas ?? []);
  };

  const onChangeAnoLetivo = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      modalidade: undefined,
      dre: undefined,
      ue: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      bimestre: undefined,
      ano: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaModalidades([]);
    setListaDres([]);
    setListaUes([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);

    setDesabilitarModalidade(true);
    setDesabilitarDre(true);
    setDesabilitarUe(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarAno(true);
    setDesabilitarBimestre(true);

    if (!value) return;

    const modalidades = await ModalidadeService({
      token: usuario?.token,
      anoLetivo: value,
    });

    setListaModalidades(modalidades ?? []);
    setDesabilitarModalidade(false);
  };

  const onChangeModalidade = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      dre: undefined,
      ue: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      bimestre: undefined,
      ano: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaDres([]);
    setListaUes([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);

    setDesabilitarDre(true);
    setDesabilitarUe(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarAno(true);
    setDesabilitarBimestre(true);

    const anoLetivo = form.getFieldValue("anoLetivo");
    if (!value || !anoLetivo) return;

    const [dres, componentes, bimestres] = await Promise.all([
      DreService({ token: usuario?.token, anoLetivo }),
      ComponenteCurricularService({
        token: usuario?.token,
        modalidade: String(value),
      }),
      BimestreService({ token: usuario?.token, modalidade: value }),
    ]);

    setListaDres(dres ?? []);
    setListaComponentesCurriculares(componentes ?? []);
    setListaBimestres(
      bimestres ? [{ value: null, label: "Todos" }, ...bimestres] : [],
    );
    setDesabilitarDre(false);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarAno(true);
    setDesabilitarBimestre(!bimestres || bimestres.length === 0);
  };

  const onChangeDre = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      ue: undefined,
      bimestre: undefined,
      ano: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaUes([]);
    setListaProficiencias([]);
    setDesabilitarAno(true);
    setDesabilitarUe(true);
    setDesabilitarBimestre(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);

    const anoLetivo = form.getFieldValue("anoLetivo");
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !anoLetivo || !modalidade) return;

    const ues = await UeService({
      token: usuario?.token,
      dreId: value,
      anoLetivo,
      modalidade,
    });

    setListaUes(ues ?? []);
    setDesabilitarUe(false);
  };

  const onChangeUe = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      bimestre: undefined,
      ano: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarBimestre(false);
    setDesabilitarAno(false);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
  };

  const onChangeBimestre = () => {
    limparResultadoRelatorio();
    setDesabilitarAno(false);
    void tentarBuscarDadosConsolidado();
  };

  const onChangeAno = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarComponenteCurricular(false);
    setDesabilitarProficiencia(true);
  };

  const onChangeComponenteCurricular = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      proficiencia: undefined,
      genero: undefined,
      raca: undefined,
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarProficiencia(true);

    const modalidade = form.getFieldValue("modalidade");
    if (!value || !modalidade) return;

    const proficiencias = await ProficienciaService({
      token: usuario?.token,
      idDisciplina: value,
      modalidade,
    });

    setListaProficiencias(proficiencias ?? []);
    setDesabilitarProficiencia(!proficiencias || proficiencias.length === 0);
  };

  const onChangeProficiencia = () => {
    void tentarBuscarDadosConsolidado();
  };

  const reset = () => {
    form.resetFields();

    setListaModalidades([]);
    setListaDres([]);
    setListaUes([]);
    setListaComponentesCurriculares([]);
    setListaProficiencias([]);
    setListaBimestres([]);

    setDesabilitarModalidade(true);
    setDesabilitarDre(true);
    setDesabilitarUe(true);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarProficiencia(true);
    setDesabilitarAno(true);
    setDesabilitarBimestre(true);

    limparResultadoRelatorio();
  };

  useImperativeHandle(ref, () => ({
    reset,
  }));

  useEffect(() => {
    if (usuario?.token) {
      void obterAnosLetivos(usuario.token);
      void obterOpcoesFixas(usuario.token);
    }
  }, [usuario?.token]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        lpSegundaLingua: false,
        agrupamentoDados: "porQuestoes",
      }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="agrupamentoDados"
            label="* Agrupamento de dados"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-agrupamento-dados"
              options={opcoesAgrupamentoDados}
              placeholder="Selecione"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="anoLetivo"
            label="* Ano letivo"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-ano-letivo"
              options={listaAnosLetivos}
              placeholder="Selecione"
              onChange={onChangeAnoLetivo}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="modalidade"
            label="* Etapa/Modalidade"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-modalidade"
              options={listaModalidades}
              placeholder="Selecione"
              onChange={onChangeModalidade}
              disabled={desabilitarModalidade}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="dre"
            label="Diretoria Regional de Educação (DRE)"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-dre"
              options={listaDres}
              placeholder="Selecione"
              onChange={onChangeDre}
              disabled={desabilitarDre}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="ue"
            label="Unidade Educacional (UE)"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-ue"
              options={listaUes}
              placeholder="Selecione"
              onChange={onChangeUe}
              disabled={desabilitarUe}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item name="ano" label="Ano" className="labelSelectSondagem">
            <Select
              id="sondagem-consolidado-select-ano"
              options={opcoesAno}
              placeholder="Selecione"
              onChange={onChangeAno}
              mode="multiple"
              disabled={desabilitarAno}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="componenteCurricular"
            label="* Componente curricular"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-componente-curricular"
              options={listaComponentesCurriculares}
              placeholder="Selecione"
              onChange={onChangeComponenteCurricular}
              disabled={desabilitarComponenteCurricular}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="proficiencia"
            label="* Proficiência"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-proficiencia"
              options={listaProficiencias}
              placeholder="Selecione"
              onChange={onChangeProficiencia}
              disabled={desabilitarProficiencia}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="bimestre"
            label="Bimestre"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-bimestre"
              options={listaBimestres}
              placeholder="Selecione"
              onChange={onChangeBimestre}
              disabled={desabilitarBimestre}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="genero"
            label="Gênero"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-genero"
              options={listaGeneros}
              allowClear
              placeholder="Selecione"
              onChange={() => void tentarBuscarDadosConsolidado()}
              onClear={() => void tentarBuscarDadosConsolidado()}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item name="raca" label="Raça" className="labelSelectSondagem">
            <Select
              id="sondagem-consolidado-select-raca"
              options={listaRacas}
              allowClear
              placeholder="Selecione"
              onChange={() => void tentarBuscarDadosConsolidado()}
              onClear={() => void tentarBuscarDadosConsolidado()}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item
            name="programa"
            label="Programas e Atendimentos"
            className="labelSelectSondagem"
          >
            <Select
              id="sondagem-consolidado-select-programas-atendimentos"
              options={opcoesPrograma}
              mode="multiple"
              placeholder="Selecione"
              onChange={() => void tentarBuscarDadosConsolidado()}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            name="lpSegundaLingua"
            valuePropName="checked"
            className="filtroConsolidadoLp2"
          >
            <Checkbox onChange={() => void tentarBuscarDadosConsolidado()}>
              LP como 2ª língua
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(FiltroRelatorioConsolidadoInner);
