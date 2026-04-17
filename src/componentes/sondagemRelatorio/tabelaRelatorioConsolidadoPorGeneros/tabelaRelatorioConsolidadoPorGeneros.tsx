import React from "react";
import { Spin, Table } from "antd";
import type {
  DadosRelatorioConsolidadoPorGeneros,
  GeneroConsolidado,
  QuestaoConsolidadaPorGenero,
} from "../../../core/dto/typesRelatorio";
import "./tabelaRelatorioConsolidadoPorGeneros.css";

interface TabelaRelatorioConsolidadoPorGenerosProps {
  dados: DadosRelatorioConsolidadoPorGeneros | null;
  isLoading?: boolean;
}

type LinhaTabelaConsolidado = {
  key: string;
  descricao: React.ReactNode;
  isTotal?: boolean;
} & Record<string, React.ReactNode | boolean | string>;

const formatarInteiro = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(valor);

const formatarPercentual = (valor: number) => {
  const texto = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${texto}%`;
};

const obterGenerosUnicos = (questao: QuestaoConsolidadaPorGenero): string[] => {
  const generosSet = new Set<string>();
  questao.totaisPorGenero.forEach((t) => generosSet.add(t.genero));
  questao.respostas.forEach((r) =>
    r.generos.forEach((g) => generosSet.add(g.genero)),
  );
  return Array.from(generosSet);
};

const obterQuantidadePorGenero = (
  generos: GeneroConsolidado[],
  nomGenero: string,
): GeneroConsolidado | undefined => {
  return generos.find((g) => g.genero === nomGenero);
};

const renderValor = (quantidade?: number, percentual?: number) => {
  if (!quantidade) {
    return <span className="consolidado-generos-valor--vazio">Vazio</span>;
  }

  return (
    <span className="consolidado-generos-valor">
      <span className="consolidado-generos-numero">
        {formatarInteiro(quantidade)}
      </span>
      <span className="consolidado-generos-percentual">
        {formatarPercentual(percentual ?? 0)}
      </span>
    </span>
  );
};

const TabelaRelatorioConsolidadoPorGeneros: React.FC<
  TabelaRelatorioConsolidadoPorGenerosProps
> = ({ dados, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="tabelaRelatorioConsolidadoPorGeneros">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!dados) return null;

  const questoes = dados.questoes ?? [];

  if (!questoes.length) {
    return (
      <div className="tabelaRelatorioConsolidadoPorGeneros">
        <div className="consolidado-generos-vazio">
          Nenhuma informação encontrada para os filtros informados
        </div>
      </div>
    );
  }

  return (
    <div className="tabelaRelatorioConsolidadoPorGeneros">
      {questoes.map((questao) => {
        const generos = obterGenerosUnicos(questao).map((genero, indice) => ({
          id: `genero-${indice}`,
          nome: genero,
        }));
        const respostasOrdenadas = [...questao.respostas].sort(
          (a, b) => a.ordem - b.ordem,
        );

        const colunas = [
          {
            title: questao.questaoNome,
            dataIndex: "descricao",
            key: "descricao",
            width: 260,
            align: "center" as const,
            className: "consolidado-generos-coluna-localizacao",
          },
          ...generos.map((genero) => ({
            title: `Gênero: ${genero.nome}`,
            dataIndex: genero.id,
            key: genero.id,
            align: "center" as const,
            width: 180,
          })),
        ];

        const linhas: LinhaTabelaConsolidado[] = respostasOrdenadas.map(
          (resposta) => {
            const linhaBase: LinhaTabelaConsolidado = {
              key: `${questao.questaoId}-${resposta.ordem}`,
              descricao:
                resposta.corFundo && resposta.corTexto ? (
                  <span
                    className="consolidado-generos-pill"
                    style={{
                      backgroundColor: resposta.corFundo,
                      color: resposta.corTexto,
                    }}
                  >
                    {resposta.resposta}
                  </span>
                ) : (
                  <span className="consolidado-generos-descricao-normal">
                    {resposta.resposta}
                  </span>
                ),
            };

            generos.forEach((genero) => {
              const dado = obterQuantidadePorGenero(
                resposta.generos,
                genero.nome,
              );
              linhaBase[genero.id] = renderValor(
                dado?.quantidade,
                dado?.percentual,
              );
            });

            return linhaBase;
          },
        );

        const linhaTotal: LinhaTabelaConsolidado = {
          key: `${questao.questaoId}-total`,
          descricao: (
            <span className="consolidado-generos-descricao-normal consolidado-generos-total-centralizado">
              Total
            </span>
          ),
          isTotal: true,
        };

        generos.forEach((genero) => {
          const total = obterQuantidadePorGenero(
            questao.totaisPorGenero,
            genero.nome,
          );
          linhaTotal[genero.id] = renderValor(
            total?.quantidade,
            total?.percentual,
          );
        });

        linhas.push(linhaTotal);

        return (
          <div key={questao.questaoId} className="consolidado-generos-bloco">
            <Table
              className="consolidado-generos-ant-table"
              columns={colunas}
              dataSource={linhas}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: "max-content" }}
              rowClassName={(record) =>
                record.isTotal ? "consolidado-generos-linha-total" : ""
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default TabelaRelatorioConsolidadoPorGeneros;
