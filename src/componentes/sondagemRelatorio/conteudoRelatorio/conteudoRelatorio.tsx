import React, { useState, useRef, useEffect } from "react";
import ListaDinamicaRelatorio from "../listaDinamicaRelatorio/listaDinamicaRelatorio";
import type {
  DadosTabelaDinamica,
  LegendaQuestionario,
  ValoresFiltroRelatorio,
} from "../../../core/dto/typesRelatorio";
import { Card, Spin, Form, Row } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorio from "../filtroRelatorio/filtroRelatorio";
import Legendas from "../../sondagem/legendas/legendas";
import { LEGENDA_EJA_CAPACIDADE_LEITORA } from "../../sondagem/legendas/legendaEjaCapacidadeLeitora";
import { classificarTipoLegenda } from "../../sondagem/legendas/legendaClassifier";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import { Modalidade, Proficiencia } from "../../../core/dto/types";
import Alerta from "../../biblioteca/Alerta";
import RelatorioExportService from "../../../services/relatorioExportService/RelatorioExportService";
import { useSelector } from "react-redux";
import CabecalhoRelatorioAcoes from "../cabecalhoRelatorioAcoes/cabecalhoRelatorioAcoes";
import { notifyError, notifySuccess } from "../../../core/config/antd-alerts";

const ConteudoRelatorio: React.FC = () => {
  const [formFiltro] = Form.useForm();
  const filtroRef = useRef<{ reset: () => void } | null>(null);
  const [dados, setDados] = useState<DadosTabelaDinamica | null>(null);
  const [filtros, setFiltros] = useState<ValoresFiltroRelatorio | null>(null);
  const usuario = useSelector((store: any) => store.usuario);

  const [dadosLegenda, setDadosLegenda] = useState<LegendasProps[] | null>(
    null,
  );

  const [loading] = useState(false);
  const [loadingGerar, setLoadingGerar] = useState<boolean>(false);

  const [erroValidacaoTurma, setErroValidacaoTurma] = useState<string | null>(
    null,
  );

  const GerarDados = async (formato: "pdf" | "excel") => {
    if (!filtros || !dados) return;

    setLoadingGerar(true);
    try {
      const extensaoRelatorio = formato === "pdf" ? 1 : 4;
      const sucesso = await RelatorioExportService({
        extensaoRelatorio: extensaoRelatorio,
        turmaId: filtros.turma as number,
        proficienciaId: filtros.proficiencia as number,
        componenteCurricularId: filtros.componenteCurricular as number,
        modalidade: filtros.modalidade as number,
        anoLetivo: filtros.anoLetivo as number,
        semestreId: filtros.semestreId ?? null,
        bimestreId: filtros.bimestre ?? null,
        ueCodigo: String(filtros.ue),
        token: usuario?.token,
      });

      if (sucesso) {
        notifySuccess({
          message: "Sucesso",
          description:
            "Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.",
          duration: 4,
        });
      } else {
        notifyError({
          message: "Erro",
          description: "Falha ao gerar relatório. Tente novamente.",
          duration: 4,
        });
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      notifyError({
        message: "Erro",
        description: "Ocorreu um erro ao gerar o relatório.",
        duration: 4,
      });
    } finally {
      setLoadingGerar(false);
    }
  };

  const CancelarCadastroSondagem = async () => {
    formFiltro.resetFields();
    filtroRef.current?.reset();
    setDados(null);
    setDadosLegenda(null);
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  useEffect(() => {
    if (dados) {
      const legendaQuestionario = Array.isArray(dados.legenda)
        ? dados.legenda
        : [];

      const dadosLegenda: LegendasProps[] = legendaQuestionario.map(
        (legenda: LegendaQuestionario) => {
          const tipo = classificarTipoLegenda(legenda.legenda);

          return {
            corFundo: legenda.corFundo,
            corTexto: legenda.corTexto,
            descricaoLegenda: legenda.descricaoOpcaoResposta,
            textoLegenda: legenda.legenda,
            tipo,
          };
        },
      );

      if (
        filtros?.modalidade === Modalidade.EJA &&
        filtros?.proficiencia === Proficiencia.CapacidadeLeitora
      )
        setDadosLegenda(LEGENDA_EJA_CAPACIDADE_LEITORA);
      else setDadosLegenda(dadosLegenda);
    } else {
      setDadosLegenda(null);
    }
  }, [dados, filtros?.modalidade, filtros?.proficiencia]);

  return (
    <>
      <div
        className="grupoAlertas"
        style={{ display: erroValidacaoTurma ? "block" : "none" }}
      >
        <Row gutter={16} className="p-0">
          <Alerta
            alerta={{
              tipo: "warning",
              id: "SegundoAlerta",
              mensagem: erroValidacaoTurma ?? "",
              estiloTitulo: { fontSize: "18px" },
            }}
            className="mb-2 larguraAlerta"
          />
        </Row>
      </div>
      <CabecalhoRelatorioAcoes
        titulo="Sondagem por turma"
        onVoltar={voltarSondagem}
        onCancelar={() => {
          void CancelarCadastroSondagem();
        }}
        onGerar={GerarDados}
        menuGerarDesabilitado={!dados}
        botaoGerarDesabilitado={!dados || loadingGerar}
        loadingGerar={loadingGerar}
      />
      <Card className="CardSondagemEfeitosRelatorio">
        <div className="textoSondagemEstilo">
          <p>
            Preencha os campos para conferir as informações das turmas e
            estudantes da Unidade Educacional selecionada.
          </p>
        </div>
        <FiltroRelatorio
          ref={filtroRef}
          form={formFiltro}
          onDadosCarregados={setDados}
          onFiltrosAlterados={setFiltros}
          onErroValidacaoTurma={setErroValidacaoTurma}
        />
        <Spin spinning={loading} tip="Carregando dados...">
          <ListaDinamicaRelatorio dados={dados} />
        </Spin>

        <Legendas
          data={dadosLegenda || []}
          ano={filtros?.ano ?? undefined}
          proficienciaId={filtros?.proficiencia ?? undefined}
          dadosCompletos={dados}
        />
      </Card>
    </>
  );
};

export default ConteudoRelatorio;
