import React, { useRef, useState } from "react";
import { Button, Card, Dropdown, Form, notification } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorioConsolidado from "../filtroRelatorioConsolidado/filtroRelatorioConsolidado";
import type { FiltroRelatorioConsolidadoRef } from "../filtroRelatorioConsolidado/filtroRelatorioConsolidado";
import TabelaRelatorioConsolidado from "../tabelaRelatorioConsolidado/tabelaRelatorioConsolidado";
import styled from "styled-components";
import { useSelector } from "react-redux";
import type {
  DadosTabelaDinamica,
  ValoresFiltroRelatorioConsolidado,
} from "../../../core/dto/typesRelatorio";
import RelatorioConsolidadoExportService from "../../../services/relatorioExportService/RelatorioConsolidadoExportService";

export const Icon = styled.i``;

const ConteudoRelatorioConsolidado: React.FC = () => {
  const [formFiltro] = Form.useForm();
  const filtroRef = useRef<FiltroRelatorioConsolidadoRef | null>(null);
  const [dados, setDados] = useState<DadosTabelaDinamica | null>(null);
  const [filtros, setFiltros] =
    useState<ValoresFiltroRelatorioConsolidado | null>(null);
  const [loadingGerar, setLoadingGerar] = useState(false);
  const usuario = useSelector((store: any) => store.usuario);

  const filtrosObrigatoriosPreenchidos = Boolean(
    filtros?.anoLetivo &&
    filtros?.modalidade &&
    filtros?.dre &&
    filtros?.ue &&
    filtros?.bimestre !== undefined &&
    filtros?.ano !== undefined &&
    filtros?.componenteCurricular &&
    filtros?.proficiencia,
  );

  const GerarDados = async (formato: "pdf" | "excel") => {
    if (!filtros || !filtrosObrigatoriosPreenchidos) return;

    setLoadingGerar(true);
    try {
      const extensaoRelatorio = formato === "pdf" ? 1 : 4;
      const sucesso = await RelatorioConsolidadoExportService({
        extensaoRelatorio,
        filtros,
        token: usuario?.token,
      });

      if (sucesso) {
        notification.success({
          message: "Sucesso",
          description:
            "Solicitação de geração do relatório consolidado gerada com sucesso. Em breve você receberá uma notificação com o resultado.",
          duration: 4,
        });
      } else {
        notification.error({
          message: "Erro",
          description: "Falha ao gerar relatório consolidado. Tente novamente.",
          duration: 4,
        });
      }
    } catch (error) {
      console.error("Erro ao gerar relatório consolidado:", error);
      notification.error({
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
    setFiltros(null);
  };

  const voltarSondagem = () => {
    globalThis.location.href = "/";
  };

  return (
    <>
      <div className="linhaTituloBotao">
        <div className="tituloSondagem">Sondagem Consolidado</div>
        <div>
          <Button
            id="sondagem-button-voltar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              voltarSondagem();
            }}
            icon={<Icon className={`fa fa-arrow-left iconBotaoVoltar`} />}
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

          <Dropdown
            menu={{
              items: [
                { key: "pdf", label: "Relatório em PDF" },
                { key: "excel", label: "Relatório em .xlsx (Excel)" },
              ],
              onClick: ({ key }) => void GerarDados(key as "pdf" | "excel"),
            }}
            trigger={["click"]}
            disabled={!filtrosObrigatoriosPreenchidos}
          >
            <Button
              id="sondagem-button-gerar"
              className="sondagemBotaoEstilo"
              loading={loadingGerar}
              disabled={!filtrosObrigatoriosPreenchidos || loadingGerar}
              icon={<Icon className="fa fa-print iconBotaoGerar" />}
            >
              Gerar
            </Button>
          </Dropdown>
        </div>
      </div>
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
          onFiltrosAlterados={setFiltros}
        />
        <TabelaRelatorioConsolidado dados={dados} />
      </Card>
    </>
  );
};

export default ConteudoRelatorioConsolidado;
