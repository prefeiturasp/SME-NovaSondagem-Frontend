import React from "react";
import { Spin, Table } from "antd";
import type { DadosTabelaDinamica } from "../../../core/dto/typesRelatorio";
import "./tabelaRelatorioConsolidado.css";

interface TabelaRelatorioConsolidadoProps {
  dados: DadosTabelaDinamica | null;
  isLoading?: boolean;
}

interface LinhaConsolidada {
  descricao: string;
  estudantes: number;
  percentual: number;
  corFundo?: string;
  corTexto?: string;
}

interface BlocoConsolidado {
  titulo: string;
  linhas: LinhaConsolidada[];
}

type LinhaTabelaConsolidado = {
  key: string;
  descricao: React.ReactNode;
  estudantes: React.ReactNode;
  percentual: React.ReactNode;
  isTotal?: boolean;
};

const montarBlocos = (
  dados: DadosTabelaDinamica | null,
): BlocoConsolidado[] => {
  const questoes = dados?.questoes ?? [];

  return questoes.map((questao) => {
    const respostasOrdenadas = [...questao.respostas].sort(
      (a, b) => a.ordem - b.ordem,
    );

    const linhas: LinhaConsolidada[] = respostasOrdenadas.map((resposta) => ({
      descricao: resposta.resposta,
      estudantes: resposta.total,
      percentual: resposta.percentual,
      corFundo: resposta.corFundo,
      corTexto: resposta.corTexto,
    }));

    linhas.push({
      descricao: "Total",
      estudantes: questao.totalEstudantes,
      percentual: questao.percentualTotal,
    });

    return {
      titulo: questao.questaoNome,
      linhas,
    };
  });
};

const formatarInteiro = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(valor);

const formatarPercentual = (valor: number) => {
  const texto = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${texto}%`;
};

const TabelaRelatorioConsolidado: React.FC<TabelaRelatorioConsolidadoProps> = ({
  dados,
  isLoading = false,
}) => {
  const blocos = montarBlocos(dados);

  if (isLoading) {
    return (
      <div className="tabelaRelatorioConsolidado">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!dados) return null;

  if (!blocos.length) {
    return (
      <div className="tabelaRelatorioConsolidado">
        <div className="consolidado-vazio">
          Nenhuma informação encontrada para os filtros informados
        </div>
      </div>
    );
  }

  const renderDescricao = (linha: LinhaConsolidada) => {
    if (linha.descricao === "Total") {
      return (
        <span className="consolidado-descricao-normal">{linha.descricao}</span>
      );
    }

    if (linha.corFundo && linha.corTexto) {
      return (
        <span
          className="consolidado-pill"
          style={{ backgroundColor: linha.corFundo, color: linha.corTexto }}
        >
          {linha.descricao}
        </span>
      );
    }

    return (
      <span className="consolidado-descricao-normal">{linha.descricao}</span>
    );
  };

  const getValorClassName = (valor: number, descricao: string) => {
    if (valor === 0) return "consolidado-valor consolidado-valor--vazio";
    if (descricao === "Total")
      return "consolidado-valor consolidado-valor--total";
    return "consolidado-valor";
  };

  return (
    <div className="tabelaRelatorioConsolidado">
      {blocos.map((bloco) => (
        <div key={bloco.titulo} className="consolidado-bloco">
          <Table
            className="consolidado-ant-table"
            pagination={false}
            bordered
            size="middle"
            columns={[
              {
                title: bloco.titulo,
                dataIndex: "descricao",
                key: "descricao",
                width: "33%",
                align: "left",
              },
              {
                title: "Estudantes",
                dataIndex: "estudantes",
                key: "estudantes",
                width: "33%",
                align: "center",
              },
              {
                title: "%",
                dataIndex: "percentual",
                key: "percentual",
                width: "34%",
                align: "center",
              },
            ]}
            dataSource={bloco.linhas.map(
              (linha): LinhaTabelaConsolidado => ({
                key: `${bloco.titulo}-${linha.descricao}`,
                descricao: renderDescricao(linha),
                estudantes: (
                  <span
                    className={getValorClassName(
                      linha.estudantes,
                      linha.descricao,
                    )}
                  >
                    {formatarInteiro(linha.estudantes)}
                  </span>
                ),
                percentual: (
                  <span
                    className={getValorClassName(
                      linha.percentual,
                      linha.descricao,
                    )}
                  >
                    {formatarPercentual(linha.percentual)}
                  </span>
                ),
                isTotal: linha.descricao === "Total",
              }),
            )}
            rowClassName={(record) =>
              record.isTotal ? "consolidado-linha-total" : ""
            }
          />
        </div>
      ))}
    </div>
  );
};

export default TabelaRelatorioConsolidado;
