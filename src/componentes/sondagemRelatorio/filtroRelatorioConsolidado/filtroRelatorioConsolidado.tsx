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
  DadosRelatorioConsolidadoPorBimestres,
  DadosRelatorioConsolidadoPorGeneros,
  DadosTabelaDinamica,
  DadosRelatorioConsolidadoPorRacaGenero,
  DadosRelatorioConsolidadoPorRacas,
  ValoresFiltroRelatorioConsolidado,
} from "../../../core/dto/typesRelatorio";
import AnoLetivoService from "../../../services/anoLetivo/anoLetivoService";
import BimestreService from "../../../services/bimestreService/bimestreService";
import BuscarDadosRelatorioConsolidadoService from "../../../services/buscarDadosRelatorioConsolidado/buscarDadosRelatorioConsolidado";
import BuscarDadosRelatorioConsolidadoPorBimestresService from "../../../services/buscarDadosRelatorioConsolidadoPorBimestres/buscarDadosRelatorioConsolidadoPorBimestres";
import BuscarDadosRelatorioConsolidadoPorGenerosService from "../../../services/buscarDadosRelatorioConsolidadoPorGeneros/buscarDadosRelatorioConsolidadoPorGeneros";
import BuscarDadosRelatorioConsolidadoPorRacaGeneroService from "../../../services/buscarDadosRelatorioConsolidadoPorRacaGenero/buscarDadosRelatorioConsolidadoPorRacaGenero";
import BuscarDadosRelatorioConsolidadoPorRacasService from "../../../services/buscarDadosRelatorioConsolidadoPorRacas/buscarDadosRelatorioConsolidadoPorRacas";
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
  onDadosPorGenerosCarregados: (
    dados: DadosRelatorioConsolidadoPorGeneros | null,
  ) => void;
  onDadosPorBimestresCarregados: (
    dados: DadosRelatorioConsolidadoPorBimestres | null,
  ) => void;
  onDadosPorRacasCarregados: (
    dados: DadosRelatorioConsolidadoPorRacas | null,
  ) => void;
  onDadosPorRacaGeneroCarregados: (
    dados: DadosRelatorioConsolidadoPorRacaGenero | null,
  ) => void;
  onFiltrosAlterados: (
    filtros: ValoresFiltroRelatorioConsolidado | null,
  ) => void;
  onLoading?: (loading: boolean) => void;
};

const opcoesAno: SelectOption[] = [
  { value: 1, label: "1º ANO" },
  { value: 2, label: "2º ANO" },
  { value: 3, label: "3º ANO" },
];

const opcoesSemestre: SelectOption[] = [
  { value: 1, label: "1º Semestre" },
  { value: 2, label: "2º Semestre" },
];

const opcoesAgrupamentoDados: SelectOption[] = [
  { value: "porQuestoes", label: "Por questão" },
  { value: "porGenero", label: "Por gênero" },
  { value: "porBimestres", label: "Por bimestre" },
  { value: "porRacas", label: "Por raça" },
  { value: "porRacaGenero", label: "Por raça e gênero" },
];

const opcoesPrograma: SelectOption[] = [
  { value: "pap", label: "PAP" },
  { value: "aee", label: "AEE" },
  { value: "deficiente", label: "Deficiência" },
];

const opcaoTodas: SelectOption = { value: "todas", label: "Todas" };
const opcaoTodosGenero: SelectOption = { value: "todas", label: "Todos" };

const FiltroRelatorioConsolidadoInner: React.ForwardRefRenderFunction<
  FiltroRelatorioConsolidadoRef,
  FiltroRelatorioConsolidadoProps
> = (
  {
    form,
    onDadosCarregados,
    onDadosPorGenerosCarregados,
    onDadosPorBimestresCarregados,
    onDadosPorRacasCarregados,
    onDadosPorRacaGeneroCarregados,
    onFiltrosAlterados,
    onLoading,
  },
  ref,
) => {
  const usuario = useSelector((store: any) => store.usuario);
  const perfil = useSelector((store: any) => store.perfil?.perfilSelecionado);

  const usuarioEhProfessorOuCJ = () => {
    const nomePerfil = perfil?.nomePerfil ?? "";
    return nomePerfil === "Professor" || nomePerfil === "Professor CJ";
  };

  const obterListaDresComFiltro = (dres: SelectOption[] | null) => {
    if (usuarioEhProfessorOuCJ()) {
      return dres ?? [];
    }
    return dres ? [{ value: "todas", label: "Todas" }, ...dres] : [];
  };

  const obterListaUesComFiltro = (ues: SelectOption[] | null) => {
    if (usuarioEhProfessorOuCJ()) {
      return ues ?? [];
    }
    return ues ? [{ value: "todas", label: "Todas" }, ...ues] : [];
  };

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
    onDadosPorGenerosCarregados(null);
    onDadosPorBimestresCarregados(null);
    onDadosPorRacasCarregados(null);
    onDadosPorRacaGeneroCarregados(null);
    onFiltrosAlterados(null);
  };

  const modalidadeSelecionada = () => Number(form.getFieldValue("modalidade"));
  const modalidadeEhEja = () => modalidadeSelecionada() === 3;

  const anoDeveFicarDesabilitado = () => modalidadeEhEja();

  const opcoesProgramaDisponiveis =
    modalidadeSelecionada() === 3
      ? opcoesPrograma.filter((opcao) => opcao.value !== "pap")
      : opcoesPrograma;

  const filtrarModalidadesPermitidas = (modalidades: SelectOption[]) =>
    modalidades.filter((modalidade) => {
      const id = Number(modalidade.value);
      return id === 3 || id === 5;
    });

  const mapearFiltrosFormulario = (): ValoresFiltroRelatorioConsolidado => {
    const valores = form.getFieldsValue();
    const semestreId = Number(valores.semestreId);

    const filtros: ValoresFiltroRelatorioConsolidado = {
      anoLetivo: valores.anoLetivo,
      modalidade: valores.modalidade,
      dre: valores.dre === "todas" ? undefined : valores.dre,
      ue: valores.ue === "todas" ? undefined : valores.ue,
      bimestre: valores.bimestre,
      ano: modalidadeEhEja() ? undefined : valores.ano,
      semestreId,
      componenteCurricular: valores.componenteCurricular,
      proficiencia: valores.proficiencia,
      genero: valores.genero === "todas" ? undefined : valores.genero,
      raca: valores.raca === "todas" ? undefined : valores.raca,
      programa: valores.programa,
      agrupamentoDados: valores.agrupamentoDados,
    };

    if (valores.lpSegundaLingua) {
      filtros.lpSegundaLingua = true;
    }

    return filtros;
  };

  const camposObrigatoriosPreenchidos = (
    filtros: ValoresFiltroRelatorioConsolidado,
  ) => {
    return Boolean(
      filtros.anoLetivo &&
      filtros.modalidade &&
      filtros.componenteCurricular &&
      filtros.proficiencia,
    );
  };

  const tentarBuscarDadosConsolidado = async () => {
    onLoading?.(true);
    try {
      onDadosCarregados(null);
      onDadosPorGenerosCarregados(null);
      onDadosPorBimestresCarregados(null);
      onDadosPorRacasCarregados(null);
      onDadosPorRacaGeneroCarregados(null);

      const filtros = mapearFiltrosFormulario();

      if (!camposObrigatoriosPreenchidos(filtros)) {
        onFiltrosAlterados(null);
        return;
      }

      if (filtros.agrupamentoDados === "porGenero") {
        const dados = await BuscarDadosRelatorioConsolidadoPorGenerosService({
          filtros,
          token: usuario?.token,
        });
        onDadosPorGenerosCarregados(dados);
      } else if (filtros.agrupamentoDados === "porBimestres") {
        const dados = await BuscarDadosRelatorioConsolidadoPorBimestresService({
          filtros,
          token: usuario?.token,
        });
        onDadosPorBimestresCarregados(dados);
      } else if (filtros.agrupamentoDados === "porRacas") {
        const dados = await BuscarDadosRelatorioConsolidadoPorRacasService({
          filtros,
          token: usuario?.token,
        });
        onDadosPorRacasCarregados(dados);
      } else if (filtros.agrupamentoDados === "porRacaGenero") {
        const dados = await BuscarDadosRelatorioConsolidadoPorRacaGeneroService(
          {
            filtros,
            token: usuario?.token,
          },
        );
        onDadosPorRacaGeneroCarregados(dados);
      } else {
        const dados = await BuscarDadosRelatorioConsolidadoService({
          filtros,
          token: usuario?.token,
        });
        onDadosCarregados(dados);
      }

      onFiltrosAlterados(filtros);
    } finally {
      onLoading?.(false);
    }
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
    setListaGeneros([opcaoTodosGenero, ...(generos ?? [])]);
    setListaRacas([opcaoTodas, ...(racas ?? [])]);
  };

  const onChangeAgrupamentoDados = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      anoLetivo: undefined,
      modalidade: undefined,
      dre: undefined,
      ue: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      bimestre: null,
      ano: undefined,
      semestreId: 1,
      genero: "todas",
      raca: "todas",
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
  };

  const onChangeAnoLetivo = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      modalidade: undefined,
      dre: undefined,
      ue: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      bimestre: null,
      ano: undefined,
      semestreId: 1,
      genero: "todas",
      raca: "todas",
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

    const modalidadesPermitidas = filtrarModalidadesPermitidas(
      modalidades ?? [],
    );
    setListaModalidades(modalidadesPermitidas);
    setDesabilitarModalidade(modalidadesPermitidas.length === 0);
  };

  const onChangeModalidade = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      dre: undefined,
      ue: undefined,
      componenteCurricular: undefined,
      proficiencia: undefined,
      bimestre: null,
      ano: undefined,
      semestreId: 1,
      genero: "todas",
      raca: "todas",
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

    setListaDres(obterListaDresComFiltro(dres));
    setListaComponentesCurriculares(componentes ?? []);
    setListaBimestres(
      bimestres ? [{ value: null, label: "Todos" }, ...bimestres] : [],
    );
    setDesabilitarDre(false);
    setDesabilitarComponenteCurricular(true);
    setDesabilitarAno(anoDeveFicarDesabilitado());
    setDesabilitarBimestre(!bimestres || bimestres.length === 0);
  };

  const onChangeDre = async (value: number | string) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      ue: value === "todas" ? "todas" : undefined,
      bimestre: null,
      ano: undefined,
      semestreId: 1,
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: "todas",
      raca: "todas",
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

    // Se "todas" foi selecionado, não busca UEs e habilita campos seguintes
    if (value === "todas" && !usuarioEhProfessorOuCJ()) {
      setListaUes([{ value: "todas", label: "Todas" }]);
      setDesabilitarUe(false);
      setDesabilitarBimestre(false);
      setDesabilitarAno(anoDeveFicarDesabilitado());
      setDesabilitarComponenteCurricular(false);
      return;
    }

    const anoLetivo = form.getFieldValue("anoLetivo");
    const modalidade = form.getFieldValue("modalidade");
    if (!value || !anoLetivo || !modalidade) return;

    const ues = await UeService({
      token: usuario?.token,
      dreId: value as number,
      anoLetivo,
      modalidade,
    });

    setListaUes(obterListaUesComFiltro(ues));
    setDesabilitarUe(false);
  };

  const onChangeUe = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      bimestre: null,
      ano: undefined,
      semestreId: 1,
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: "todas",
      raca: "todas",
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarBimestre(false);
    setDesabilitarAno(anoDeveFicarDesabilitado());
    setDesabilitarComponenteCurricular(!modalidadeEhEja());
    setDesabilitarProficiencia(true);
  };

  const onChangeBimestre = () => {
    limparResultadoRelatorio();
    setDesabilitarAno(anoDeveFicarDesabilitado());
    void tentarBuscarDadosConsolidado();
  };

  const onChangeAno = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      componenteCurricular: undefined,
      proficiencia: undefined,
      genero: "todas",
      raca: "todas",
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarComponenteCurricular(false);
    setDesabilitarProficiencia(true);
  };

  const onChangeSemestre = () => {
    limparResultadoRelatorio();
    void tentarBuscarDadosConsolidado();
  };

  const onChangeComponenteCurricular = async (value: number) => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      bimestre: null,
      proficiencia: undefined,
      genero: "todas",
      raca: "todas",
      programa: undefined,
      lpSegundaLingua: false,
    });

    setListaProficiencias([]);
    setDesabilitarProficiencia(true);
    setListaBimestres([]);
    setDesabilitarBimestre(true);

    const modalidade = form.getFieldValue("modalidade");
    if (!value || !modalidade) return;

    const [proficiencias, bimestres] = await Promise.all([
      ProficienciaService({
        token: usuario?.token,
        idDisciplina: value,
        modalidade,
      }),
      BimestreService({ token: usuario?.token, modalidade }),
    ]);

    setListaProficiencias(proficiencias ?? []);
    setDesabilitarProficiencia(!proficiencias || proficiencias.length === 0);
    setListaBimestres(
      bimestres ? [{ value: null, label: "Todos" }, ...bimestres] : [],
    );
    setDesabilitarBimestre(!bimestres || bimestres.length === 0);
  };

  const onChangeProficiencia = () => {
    limparResultadoRelatorio();
    form.setFieldsValue({
      bimestre: null,
      genero: "todas",
      raca: "todas",
      programa: undefined,
      lpSegundaLingua: false,
    });

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
        bimestre: null,
        semestreId: 1,
        genero: "todas",
        raca: "todas",
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
              onChange={onChangeAgrupamentoDados}
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
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        {modalidadeEhEja() ? (
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Form.Item
              name="semestreId"
              label="Semestre"
              className="labelSelectSondagem"
            >
              <Select
                id="sondagem-consolidado-select-semestre"
                options={opcoesSemestre}
                placeholder="Selecione"
                onChange={onChangeSemestre}
              />
            </Form.Item>
          </Col>
        ) : (
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
        )}

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
              placeholder="Selecione"
              onChange={() => void tentarBuscarDadosConsolidado()}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Form.Item name="raca" label="Raça" className="labelSelectSondagem">
            <Select
              id="sondagem-consolidado-select-raca"
              options={listaRacas}
              placeholder="Selecione"
              onChange={() => void tentarBuscarDadosConsolidado()}
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
              options={opcoesProgramaDisponiveis}
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
