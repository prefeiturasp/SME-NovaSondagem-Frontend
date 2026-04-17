import React from "react";
import type {
  DadosRelatorioConsolidadoPorGeneros,
  GeneroConsolidado,
  QuestaoConsolidadaPorGenero,
  RespostaConsolidadaPorGenero,
} from "../../../core/dto/typesRelatorio";
import { criarTabelaRelatorioConsolidadoPorAgrupamento } from "../tabelaRelatorioConsolidadoPorAgrupamento/tabelaRelatorioConsolidadoPorAgrupamentoBase";
import "./tabelaRelatorioConsolidadoPorGeneros.css";

interface TabelaRelatorioConsolidadoPorGenerosProps {
  dados: DadosRelatorioConsolidadoPorGeneros | null;
  isLoading?: boolean;
}
const TabelaRelatorioConsolidadoPorGeneros: React.FC<TabelaRelatorioConsolidadoPorGenerosProps> =
  criarTabelaRelatorioConsolidadoPorAgrupamento<
    DadosRelatorioConsolidadoPorGeneros,
    QuestaoConsolidadaPorGenero,
    RespostaConsolidadaPorGenero,
    GeneroConsolidado
  >({
    classNameContainer: "tabelaRelatorioConsolidadoPorGeneros",
    classNameVazio: "consolidado-generos-vazio",
    classNameBloco: "consolidado-generos-bloco",
    classNameTabela: "consolidado-generos-ant-table",
    classNameColunaDescricao: "consolidado-generos-coluna-localizacao",
    classNameDescricaoNormal: "consolidado-generos-descricao-normal",
    classNameDescricaoTotal: "consolidado-generos-total-centralizado",
    classNameLinhaTotal: "consolidado-generos-linha-total",
    classNamePill: "consolidado-generos-pill",
    classNameValor: "consolidado-generos-valor",
    classNameNumero: "consolidado-generos-numero",
    classNamePercentual: "consolidado-generos-percentual",
    classNameValorVazio: "consolidado-generos-valor--vazio",
    tituloColuna: (nome) => `Gênero: ${nome}`,
    obterQuestoes: (dados) => dados.questoes ?? [],
    obterRespostas: (questao) => questao.respostas,
    obterTotais: (questao) => questao.totaisPorGenero,
    obterItensResposta: (resposta) => resposta.generos,
    obterNomeItem: (item) => item.genero,
    obterOrdemResposta: (resposta) => resposta.ordem,
    obterTextoResposta: (resposta) => resposta.resposta,
    obterCorFundo: (resposta) => resposta.corFundo,
    obterCorTexto: (resposta) => resposta.corTexto,
    obterQuestaoId: (questao) => questao.questaoId,
    obterQuestaoNome: (questao) => questao.questaoNome,
  });

export default TabelaRelatorioConsolidadoPorGeneros;
