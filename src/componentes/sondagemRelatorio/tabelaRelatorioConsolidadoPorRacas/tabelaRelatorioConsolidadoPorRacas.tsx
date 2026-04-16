import React from "react";
import { Spin } from "antd";
import type {
  DadosRelatorioConsolidadoPorRacas,
  QuestaoConsolidadaPorRaca,
  RacaConsolidada,
} from "../../../core/dto/typesRelatorio";
import "./tabelaRelatorioConsolidadoPorRacas.css";

interface TabelaRelatorioConsolidadoPorRacasProps {
  dados: DadosRelatorioConsolidadoPorRacas | null;
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

const obterRacasUnicas = (questao: QuestaoConsolidadaPorRaca): string[] => {
  const racasSet = new Set<string>();
  questao.totaisPorRaca.forEach((t) => racasSet.add(t.raca));
  questao.respostas.forEach((r) =>
    r.racas.forEach((rc) => racasSet.add(rc.raca)),
  );
  return Array.from(racasSet);
};

const obterQuantidadePorRaca = (
  racas: RacaConsolidada[],
  nomRaca: string,
): RacaConsolidada | undefined => {
  return racas.find((r) => r.raca === nomRaca);
};

const TabelaRelatorioConsolidadoPorRacas: React.FC<
  TabelaRelatorioConsolidadoPorRacasProps
> = ({ dados, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="tabelaRelatorioConsolidadoPorRacas">
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
      <div className="tabelaRelatorioConsolidadoPorRacas">
        <div className="consolidado-racas-vazio">
          Nenhuma informação encontrada para os filtros informados
        </div>
      </div>
    );
  }

  return (
    <div className="tabelaRelatorioConsolidadoPorRacas">
      {questoes.map((questao) => {
        const racas = obterRacasUnicas(questao);
        const respostasOrdenadas = [...questao.respostas].sort(
          (a, b) => a.ordem - b.ordem,
        );

        return (
          <div key={questao.questaoId} className="consolidado-racas-bloco">
            <div className="consolidado-racas-wrapper">
              <table className="consolidado-racas-tabela">
                <thead>
                  <tr>
                    <th className="consolidado-racas-th-localizacao">
                      {questao.questaoNome}
                    </th>
                    {racas.map((raca) => (
                      <th key={raca}>{raca}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {respostasOrdenadas.map((resposta) => (
                    <tr key={resposta.resposta}>
                      <td>
                        {resposta.corFundo && resposta.corTexto ? (
                          <span
                            className="consolidado-racas-pill"
                            style={{
                              backgroundColor: resposta.corFundo,
                              color: resposta.corTexto,
                            }}
                          >
                            {resposta.resposta}
                          </span>
                        ) : (
                          <span className="consolidado-racas-descricao-normal">
                            {resposta.resposta}
                          </span>
                        )}
                      </td>
                      {racas.map((raca) => {
                        const dado = obterQuantidadePorRaca(
                          resposta.racas,
                          raca,
                        );
                        if (!dado || dado.quantidade === 0) {
                          return (
                            <td
                              key={raca}
                              className="consolidado-racas-valor--vazio"
                            >
                              Vazio
                            </td>
                          );
                        }
                        return (
                          <td key={raca} className="consolidado-racas-valor">
                            <span className="consolidado-racas-numero">
                              {formatarInteiro(dado.quantidade)}
                            </span>
                            <span className="consolidado-racas-percentual">
                              {formatarPercentual(dado.percentual)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="consolidado-racas-linha-total">
                    <td>
                      <span className="consolidado-racas-descricao-normal">
                        Total
                      </span>
                    </td>
                    {racas.map((raca) => {
                      const total = obterQuantidadePorRaca(
                        questao.totaisPorRaca,
                        raca,
                      );
                      if (!total || total.quantidade === 0) {
                        return (
                          <td
                            key={raca}
                            className="consolidado-racas-valor--vazio"
                          >
                            Vazio
                          </td>
                        );
                      }
                      return (
                        <td
                          key={raca}
                          className="consolidado-racas-valor consolidado-racas-valor--total"
                        >
                          <span className="consolidado-racas-numero">
                            {formatarInteiro(total.quantidade)}
                          </span>
                          <span className="consolidado-racas-percentual">
                            {formatarPercentual(total.percentual)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TabelaRelatorioConsolidadoPorRacas;
