import React from "react";
import type {
  BimestreConsolidado,
  DadosRelatorioConsolidadoPorBimestres,
  QuestaoConsolidadaPorBimestre,
  RespostaConsolidadaPorBimestre,
} from "../../../core/dto/typesRelatorio";
import { criarTabelaRelatorioConsolidadoPorAgrupamento } from "../tabelaRelatorioConsolidadoPorAgrupamento/tabelaRelatorioConsolidadoPorAgrupamentoBase";
import "./tabelaRelatorioConsolidadoPorBimestres.css";

interface TabelaRelatorioConsolidadoPorBimestresProps {
  dados: DadosRelatorioConsolidadoPorBimestres | null;
  isLoading?: boolean;
}

const TabelaRelatorioConsolidadoPorBimestres: React.FC<TabelaRelatorioConsolidadoPorBimestresProps> =
  criarTabelaRelatorioConsolidadoPorAgrupamento<
    DadosRelatorioConsolidadoPorBimestres,
    QuestaoConsolidadaPorBimestre,
    RespostaConsolidadaPorBimestre,
    BimestreConsolidado
  >({
    classNameContainer: "tabelaRelatorioConsolidadoPorBimestres",
    classNameVazio: "consolidado-bimestres-vazio",
    classNameBloco: "consolidado-bimestres-bloco",
    classNameTabela: "consolidado-bimestres-ant-table",
    classNameColunaDescricao: "consolidado-bimestres-coluna-localizacao",
    classNameDescricaoNormal: "consolidado-bimestres-descricao-normal",
    classNameDescricaoTotal: "consolidado-bimestres-total-centralizado",
    classNameLinhaTotal: "consolidado-bimestres-linha-total",
    classNamePill: "consolidado-bimestres-pill",
    classNameValor: "consolidado-bimestres-valor",
    classNameNumero: "consolidado-bimestres-numero",
    classNamePercentual: "consolidado-bimestres-percentual",
    classNameValorVazio: "consolidado-bimestres-valor--vazio",
    tituloColuna: (nome) => nome,
    obterQuestoes: (dados) => dados.questoes ?? [],
    obterRespostas: (questao) => questao.respostas,
    obterTotais: (questao) => questao.totaisPorBimestre,
    obterItensResposta: (resposta) => resposta.bimestres,
    obterNomeItem: (item) => item.bimestre,
    obterOrdemResposta: (resposta) => resposta.ordem,
    obterTextoResposta: (resposta) => resposta.resposta,
    obterCorFundo: (resposta) => resposta.corFundo,
    obterCorTexto: (resposta) => resposta.corTexto,
    obterQuestaoId: (questao) => questao.questaoId,
    obterQuestaoNome: (questao) => questao.questaoNome,
  });

export default TabelaRelatorioConsolidadoPorBimestres;
