import React from "react";
import { Spin, Table } from "antd";

export type LinhaTabelaConsolidado = {
  key: string;
  descricao: React.ReactNode;
  isTotal?: boolean;
} & Record<string, React.ReactNode | string>;

type ItemAgrupamento = {
  quantidade: number;
  percentual: number;
};

type ConfigTabelaPorAgrupamento<
  Dados,
  Questao,
  Resposta,
  Item extends ItemAgrupamento,
> = {
  classNameContainer: string;
  classNameVazio: string;
  classNameBloco: string;
  classNameTabela: string;
  classNameColunaDescricao: string;
  classNameDescricaoNormal: string;
  classNameDescricaoTotal: string;
  classNameLinhaTotal: string;
  classNamePill: string;
  classNameValor: string;
  classNameNumero: string;
  classNamePercentual: string;
  classNameValorVazio: string;
  tituloColuna: (nome: string) => string;
  obterQuestoes: (dados: Dados) => Questao[];
  obterRespostas: (questao: Questao) => Resposta[];
  obterTotais: (questao: Questao) => Item[];
  obterItensResposta: (resposta: Resposta) => Item[];
  obterNomeItem: (item: Item) => string;
  obterOrdemResposta: (resposta: Resposta) => number;
  obterTextoResposta: (resposta: Resposta) => string;
  obterCorFundo: (resposta: Resposta) => string;
  obterCorTexto: (resposta: Resposta) => string;
  obterQuestaoId: (questao: Questao) => number;
  obterQuestaoNome: (questao: Questao) => string;
};

interface TabelaRelatorioConsolidadoPorAgrupamentoBaseProps<Dados> {
  dados: Dados | null;
  isLoading?: boolean;
}

const formatarInteiro = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(valor);

const formatarPercentual = (valor: number) => {
  const texto = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${texto}%`;
};

const obterItensUnicos = <Resposta, Item>(
  respostas: Resposta[],
  obterItensResposta: (resposta: Resposta) => Item[],
  obterNomeItem: (item: Item) => string,
): string[] => {
  const itensSet = new Set<string>();
  respostas.forEach((resposta) => {
    obterItensResposta(resposta).forEach((item) => {
      itensSet.add(obterNomeItem(item));
    });
  });
  return Array.from(itensSet);
};

const obterItemPorNome = <Item,>(
  itens: Item[],
  nome: string,
  obterNomeItem: (item: Item) => string,
): Item | undefined => {
  return itens.find((item) => obterNomeItem(item) === nome);
};

const renderValor = (
  quantidade: number | undefined,
  percentual: number | undefined,
  classNameValor: string,
  classNameNumero: string,
  classNamePercentual: string,
  classNameValorVazio: string,
) => {
  if (!quantidade) {
    return <span className={classNameValorVazio}>Vazio</span>;
  }

  return (
    <span className={classNameValor}>
      <span className={classNameNumero}>{formatarInteiro(quantidade)}</span>
      <span className={classNamePercentual}>
        {formatarPercentual(percentual ?? 0)}
      </span>
    </span>
  );
};

export const criarTabelaRelatorioConsolidadoPorAgrupamento = <
  Dados,
  Questao,
  Resposta,
  Item extends ItemAgrupamento,
>(
  config: ConfigTabelaPorAgrupamento<Dados, Questao, Resposta, Item>,
): React.FC<TabelaRelatorioConsolidadoPorAgrupamentoBaseProps<Dados>> => {
  const TabelaRelatorioConsolidadoPorAgrupamentoBase: React.FC<
    TabelaRelatorioConsolidadoPorAgrupamentoBaseProps<Dados>
  > = ({ dados, isLoading = false }) => {
    if (isLoading) {
      return (
        <div className={config.classNameContainer}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
          </div>
        </div>
      );
    }

    if (!dados) return null;

    const questoes = config.obterQuestoes(dados);

    if (!questoes.length) {
      return (
        <div className={config.classNameContainer}>
          <div className={config.classNameVazio}>
            Nenhuma informação encontrada para os filtros informados
          </div>
        </div>
      );
    }

    return (
      <div className={config.classNameContainer}>
        {questoes.map((questao) => {
          const respostasOrdenadas = [...config.obterRespostas(questao)].sort(
            (a, b) =>
              config.obterOrdemResposta(a) - config.obterOrdemResposta(b),
          );

          const itens = [
            ...new Set<string>([
              ...config.obterTotais(questao).map(config.obterNomeItem),
              ...obterItensUnicos(
                respostasOrdenadas,
                config.obterItensResposta,
                config.obterNomeItem,
              ),
            ]),
          ].map((nome, indice) => ({
            id: `item-${indice}`,
            nome,
          }));

          const colunas = [
            {
              title: config.obterQuestaoNome(questao),
              dataIndex: "descricao",
              key: "descricao",
              width: 260,
              align: "center" as const,
              className: config.classNameColunaDescricao,
            },
            ...itens.map((item) => ({
              title: config.tituloColuna(item.nome),
              dataIndex: item.id,
              key: item.id,
              align: "center" as const,
              width: 180,
            })),
          ];

          const linhas: LinhaTabelaConsolidado[] = respostasOrdenadas.map(
            (resposta) => {
              const linhaBase: LinhaTabelaConsolidado = {
                key: `${config.obterQuestaoId(questao)}-${config.obterOrdemResposta(resposta)}`,
                descricao:
                  config.obterCorFundo(resposta) &&
                  config.obterCorTexto(resposta) ? (
                    <span
                      className={config.classNamePill}
                      style={{
                        backgroundColor: config.obterCorFundo(resposta),
                        color: config.obterCorTexto(resposta),
                      }}
                    >
                      {config.obterTextoResposta(resposta)}
                    </span>
                  ) : (
                    <span className={config.classNameDescricaoNormal}>
                      {config.obterTextoResposta(resposta)}
                    </span>
                  ),
              };

              for (const item of itens) {
                const dado = obterItemPorNome(
                  config.obterItensResposta(resposta),
                  item.nome,
                  config.obterNomeItem,
                );

                linhaBase[item.id] = renderValor(
                  dado?.quantidade,
                  dado?.percentual,
                  config.classNameValor,
                  config.classNameNumero,
                  config.classNamePercentual,
                  config.classNameValorVazio,
                );
              }

              return linhaBase;
            },
          );

          const linhaTotal: LinhaTabelaConsolidado = {
            key: `${config.obterQuestaoId(questao)}-total`,
            descricao: (
              <span
                className={`${config.classNameDescricaoNormal} ${config.classNameDescricaoTotal}`}
              >
                Total
              </span>
            ),
            isTotal: true,
          };

          for (const item of itens) {
            const total = obterItemPorNome(
              config.obterTotais(questao),
              item.nome,
              config.obterNomeItem,
            );
            linhaTotal[item.id] = renderValor(
              total?.quantidade,
              total?.percentual,
              config.classNameValor,
              config.classNameNumero,
              config.classNamePercentual,
              config.classNameValorVazio,
            );
          }

          linhas.push(linhaTotal);

          return (
            <div
              key={config.obterQuestaoId(questao)}
              className={config.classNameBloco}
            >
              <Table
                className={config.classNameTabela}
                columns={colunas}
                dataSource={linhas}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: "max-content" }}
                rowClassName={(record) =>
                  record.isTotal ? config.classNameLinhaTotal : ""
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  return TabelaRelatorioConsolidadoPorAgrupamentoBase;
};
