import React, { useRef, useState } from "react";
import { Card, Form } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorioConsolidado from "../filtroRelatorioConsolidado/filtroRelatorioConsolidado";
import type { FiltroRelatorioConsolidadoRef } from "../filtroRelatorioConsolidado/filtroRelatorioConsolidado";
import TabelaRelatorioConsolidado from "../tabelaRelatorioConsolidado/tabelaRelatorioConsolidado";
import TabelaRelatorioConsolidadoPorBimestres from "../tabelaRelatorioConsolidadoPorBimestres/tabelaRelatorioConsolidadoPorBimestres";
import TabelaRelatorioConsolidadoPorGeneros from "../tabelaRelatorioConsolidadoPorGeneros/tabelaRelatorioConsolidadoPorGeneros";
import TabelaRelatorioConsolidadoPorRacaGenero from "../tabelaRelatorioConsolidadoPorRacaGenero/tabelaRelatorioConsolidadoPorRacaGenero";
import TabelaRelatorioConsolidadoPorRacas from "../tabelaRelatorioConsolidadoPorRacas/tabelaRelatorioConsolidadoPorRacas";
import { useSelector } from "react-redux";
import type {
  DadosRelatorioConsolidadoPorBimestres,
  DadosRelatorioConsolidadoPorGeneros,
  DadosRelatorioConsolidadoPorRacaGenero,
  DadosTabelaDinamica,
  DadosRelatorioConsolidadoPorRacas,
  ValoresFiltroRelatorioConsolidado,
} from "../../../core/dto/typesRelatorio";
import RelatorioConsolidadoExportService from "../../../services/relatorioExportService/RelatorioConsolidadoExportService";
import CabecalhoRelatorioAcoes from "../cabecalhoRelatorioAcoes/cabecalhoRelatorioAcoes";
import { notifyError, notifySuccess } from "../../../core/config/antd-alerts";

const ConteudoRelatorioConsolidado: React.FC = () => {
  const [formFiltro] = Form.useForm();
  const filtroRef = useRef<FiltroRelatorioConsolidadoRef | null>(null);
  const [dados, setDados] = useState<DadosTabelaDinamica | null>(null);
  const [dadosPorGeneros, setDadosPorGeneros] =
    useState<DadosRelatorioConsolidadoPorGeneros | null>(null);
  const [dadosPorBimestres, setDadosPorBimestres] =
    useState<DadosRelatorioConsolidadoPorBimestres | null>(null);
  const [dadosPorRacas, setDadosPorRacas] =
    useState<DadosRelatorioConsolidadoPorRacas | null>(null);
  const [dadosPorRacaGenero, setDadosPorRacaGenero] =
    useState<DadosRelatorioConsolidadoPorRacaGenero | null>(null);
  const [filtros, setFiltros] =
    useState<ValoresFiltroRelatorioConsolidado | null>(null);
  const [loadingGerar, setLoadingGerar] = useState(false);
  const [isLoadingTabela, setIsLoadingTabela] = useState(false);
  const usuario = useSelector((store: any) => store.usuario);

  // Funções auxiliares para verificar se os dados estão vazios
  const temDados = (d: DadosTabelaDinamica | null): boolean => {
    return d ? (d.questoes?.length ?? 0) > 0 : false;
  };

  const temDadosPorGeneros = (
    d: DadosRelatorioConsolidadoPorGeneros | null,
  ): boolean => {
    return d ? (d.questoes?.length ?? 0) > 0 : false;
  };

  const temDadosPorBimestres = (
    d: DadosRelatorioConsolidadoPorBimestres | null,
  ): boolean => {
    return d ? (d.questoes?.length ?? 0) > 0 : false;
  };

  const temDadosPorRacas = (
    d: DadosRelatorioConsolidadoPorRacas | null,
  ): boolean => {
    return d ? (d.questoes?.length ?? 0) > 0 : false;
  };

  const temDadosPorRacaGenero = (
    d: DadosRelatorioConsolidadoPorRacaGenero | null,
  ): boolean => {
    return d ? (d.questoes?.length ?? 0) > 0 : false;
  };

  const podeExportarConsolidado = Boolean(
    filtros &&
    ((filtros.agrupamentoDados === "porGenero" &&
      temDadosPorGeneros(dadosPorGeneros)) ||
      (filtros.agrupamentoDados === "porBimestres" &&
        temDadosPorBimestres(dadosPorBimestres)) ||
      (filtros.agrupamentoDados === "porRacas" &&
        temDadosPorRacas(dadosPorRacas)) ||
      (filtros.agrupamentoDados === "porRacaGenero" &&
        temDadosPorRacaGenero(dadosPorRacaGenero)) ||
      ((filtros.agrupamentoDados === "porQuestoes" ||
        !filtros.agrupamentoDados) &&
        temDados(dados))),
  );

  const GerarDados = async (formato: "pdf" | "excel") => {
    if (!filtros || !podeExportarConsolidado) return;

    setLoadingGerar(true);
    try {
      const extensaoRelatorio = formato === "pdf" ? 1 : 4;
      const sucesso = await RelatorioConsolidadoExportService({
        extensaoRelatorio,
        filtros,
        token: usuario?.token,
      });

      if (sucesso) {
        notifySuccess({
          message: "Sucesso",
          description:
            "Solicitação de geração do relatório consolidado gerada com sucesso. Em breve você receberá uma notificação com o resultado.",
          duration: 4,
        });
      } else {
        notifyError({
          message: "Erro",
          description: "Falha ao gerar relatório consolidado. Tente novamente.",
          duration: 4,
        });
      }
    } catch (error) {
      console.error("Erro ao gerar relatório consolidado:", error);
      notifyError({
        message: "Erro",
        description: "Ocorreu um erro ao gerar o relatório consolidado.",
        duration: 4,
      });
    } finally {
      setLoadingGerar(false);
    }
  };

  const CancelarCadastroSondagem = () => {
    formFiltro.resetFields();
    filtroRef.current?.reset();
    setDados(null);
    setDadosPorGeneros(null);
    setDadosPorBimestres(null);
    setDadosPorRacas(null);
    setDadosPorRacaGenero(null);
    setFiltros(null);
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  let tabelaRelatorio = (
    <TabelaRelatorioConsolidado dados={dados} isLoading={isLoadingTabela} />
  );

  if (filtros?.agrupamentoDados === "porGenero") {
    tabelaRelatorio = (
      <TabelaRelatorioConsolidadoPorGeneros
        dados={dadosPorGeneros}
        isLoading={isLoadingTabela}
      />
    );
  } else if (filtros?.agrupamentoDados === "porBimestres") {
    tabelaRelatorio = (
      <TabelaRelatorioConsolidadoPorBimestres
        dados={dadosPorBimestres}
        isLoading={isLoadingTabela}
      />
    );
  } else if (filtros?.agrupamentoDados === "porRacas") {
    tabelaRelatorio = (
      <TabelaRelatorioConsolidadoPorRacas
        dados={dadosPorRacas}
        isLoading={isLoadingTabela}
      />
    );
  } else if (filtros?.agrupamentoDados === "porRacaGenero") {
    tabelaRelatorio = (
      <TabelaRelatorioConsolidadoPorRacaGenero
        dados={dadosPorRacaGenero}
        isLoading={isLoadingTabela}
      />
    );
  }

  return (
    <>
      <CabecalhoRelatorioAcoes
        titulo="Sondagem Consolidado"
        onVoltar={voltarSondagem}
        onCancelar={CancelarCadastroSondagem}
        onGerar={GerarDados}
        menuGerarDesabilitado={!podeExportarConsolidado}
        botaoGerarDesabilitado={!podeExportarConsolidado || loadingGerar}
        loadingGerar={loadingGerar}
      />
      <Card className="CardSondagemEfeitosRelatorio">
        <div className="textoSondagemEstilo">
          <p>
            Preencha os campos para conferir as informações das turmas e
            estudantes da Unidade Educacional selecionada.
          </p>
        </div>
        <FiltroRelatorioConsolidado
          ref={filtroRef}
          form={formFiltro}
          onDadosCarregados={setDados}
          onDadosPorGenerosCarregados={setDadosPorGeneros}
          onDadosPorBimestresCarregados={setDadosPorBimestres}
          onDadosPorRacasCarregados={setDadosPorRacas}
          onDadosPorRacaGeneroCarregados={setDadosPorRacaGenero}
          onFiltrosAlterados={setFiltros}
          onLoading={setIsLoadingTabela}
        />
        {tabelaRelatorio}
      </Card>
    </>
  );
};

export default ConteudoRelatorioConsolidado;
