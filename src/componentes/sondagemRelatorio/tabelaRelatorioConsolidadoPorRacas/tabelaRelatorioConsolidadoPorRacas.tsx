import React from "react";
import type {
  DadosRelatorioConsolidadoPorRacas,
  QuestaoConsolidadaPorRaca,
  RacaConsolidada,
  RespostaConsolidadaPorRaca,
} from "../../../core/dto/typesRelatorio";
import { criarTabelaRelatorioConsolidadoPorAgrupamento } from "../tabelaRelatorioConsolidadoPorAgrupamento/tabelaRelatorioConsolidadoPorAgrupamentoBase";
import "./tabelaRelatorioConsolidadoPorRacas.css";

interface TabelaRelatorioConsolidadoPorRacasProps {
  dados: DadosRelatorioConsolidadoPorRacas | null;
  isLoading?: boolean;
}

const formatarTituloRaca = (nome: string) => {
  const nomeNormalizado = nome?.trim();
  return nomeNormalizado ? (
    nomeNormalizado
  ) : (
    <span aria-hidden="true">&nbsp;</span>
  );
};

const TabelaRelatorioConsolidadoPorRacas: React.FC<TabelaRelatorioConsolidadoPorRacasProps> =
  criarTabelaRelatorioConsolidadoPorAgrupamento<
    DadosRelatorioConsolidadoPorRacas,
    QuestaoConsolidadaPorRaca,
    RespostaConsolidadaPorRaca,
    RacaConsolidada
  >({
    classNameContainer: "tabelaRelatorioConsolidadoPorRacas",
    classNameVazio: "consolidado-racas-vazio",
    classNameBloco: "consolidado-racas-bloco",
    classNameTabela: "consolidado-racas-ant-table",
    classNameColunaDescricao: "consolidado-racas-coluna-localizacao",
    classNameDescricaoNormal: "consolidado-racas-descricao-normal",
    classNameDescricaoTotal: "consolidado-racas-total-centralizado",
    classNameLinhaTotal: "consolidado-racas-linha-total",
    classNamePill: "consolidado-racas-pill",
    classNameValor: "consolidado-racas-valor",
    classNameNumero: "consolidado-racas-numero",
    classNamePercentual: "consolidado-racas-percentual",
    classNameValorVazio: "consolidado-racas-valor--vazio",
    tituloColuna: formatarTituloRaca,
    obterQuestoes: (dados) => dados.questoes ?? [],
    obterRespostas: (questao) => questao.respostas,
    obterTotais: (questao) => questao.totaisPorRaca,
    obterItensResposta: (resposta) => resposta.racas,
    obterNomeItem: (item) => item.raca,
    obterOrdemResposta: (resposta) => resposta.ordem,
    obterTextoResposta: (resposta) => resposta.resposta,
    obterCorFundo: (resposta) => resposta.corFundo,
    obterCorTexto: (resposta) => resposta.corTexto,
    obterQuestaoId: (questao) => questao.questaoId,
    obterQuestaoNome: (questao) => questao.questaoNome,
  });

export default TabelaRelatorioConsolidadoPorRacas;
