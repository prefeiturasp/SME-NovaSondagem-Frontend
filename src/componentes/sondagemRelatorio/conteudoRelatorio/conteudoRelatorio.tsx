import React, { useState, useRef, useEffect } from "react";
import ListaDinamicaRelatorio from "../listaDinamicaRelatorio/listaDinamicaRelatorio";
import type {
  DadosTabelaDinamica,
  LegendaQuestionario,
  ValoresFiltroRelatorio,
} from "../../../core/dto/typesRelatorio";
import { Button, Card, Spin, Form } from "antd";
import "./conteudoRelatorio.css";
import FiltroRelatorio from "../filtroRelatorio/filtroRelatorio";
import styled from "styled-components";
import Legendas from "../../sondagem/legendas/legendas";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import { Modalidade, Proficiencia } from "../../../core/dto/types";
export const Icon = styled.i``;

const ConteudoRelatorio: React.FC = () => {
  const [formFiltro] = Form.useForm();
  const filtroRef = useRef<{ reset: () => void } | null>(null);
  const [dados, setDados] = useState<DadosTabelaDinamica | null>(null);
  const [filtros, setFiltros] = useState<ValoresFiltroRelatorio | null>(null);

  const [dadosLegenda, setDadosLegenda] = useState<LegendasProps[] | null>(
    null,
  );

  const [loading] = useState(false);
  const [loadingGerar] = useState<boolean>(false);

  const GerarDados = async () => {
    // Geradados do relatorio, fica habilitado so quando tem dados na tabela.
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
        (legenda: LegendaQuestionario) => ({
          corFundo: legenda.corFundo,
          corTexto: legenda.corTexto,
          descricaoLegenda: legenda.descricaoOpcaoResposta,
          textoLegenda: legenda.legenda,
        }),
      );

      if (
        filtros?.modalidade === Modalidade.EJA &&
        filtros?.proficiencia === Proficiencia.CapacidadeLeitora
      )
        setDadosLegenda([
          {
            descricaoLegenda: "Localização",
            textoLegenda:
              "Capacidade de recuperar informações explícitas no texto",
            corTexto: "#363636",
          },
          {
            descricaoLegenda: "Inferência",
            textoLegenda:
              "Capacidade de compreender informações implícitas no texto",
            corTexto: "#363636",
          },
          {
            descricaoLegenda: "Reflexão",
            textoLegenda:
              "(Apreciação e réplica do leitor em relação ao texto) relacionadas aos aspectos discursivos da reconstituição dos sentidos do texto.",
            corTexto: "#363636",
          },
          {
            descricaoLegenda: "Adequada",
            textoLegenda:
              "Recuperou, compreendeu ou refletiu corretamente sobre a informação",
            corFundo: "#7ED957",
            corTexto: "#363636",
          },
          {
            descricaoLegenda: "Inadequada",
            textoLegenda:
              "Não recuperou, compreendeu ou refletiu corretamente sobre a informação",
            corFundo: "#FFDE59",
            corTexto: "#363636",
          },
          {
            descricaoLegenda: "Não Resolveu",
            textoLegenda:
              "Não conseguiu realizar a leitura e/ou compreensão de textos",
            corFundo: "#F18888",
            corTexto: "#FFFFFF",
          },
        ]);
      else setDadosLegenda(dadosLegenda);
    }
  }, [dados]);

  return (
    <>
      <div className="linhaTituloBotao">
        <div className="tituloSondagem">Sondagem por turma</div>
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

          <Button
            id="sondagem-button-gerar"
            className="sondagemBotaoEstilo"
            onClick={() => {
              GerarDados();
            }}
            loading={loadingGerar}
            icon={<Icon className="fa fa-print iconBotaoGerar" />}
          >
            Gerar
          </Button>
        </div>
      </div>
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
