import React from "react";
import type { DadosTabelaDinamica } from "../../../core/dto/typesRelatorio";
import "./tabelaRelatorioConsolidado.css";

interface TabelaRelatorioConsolidadoProps {
  dados: DadosTabelaDinamica | null;
}

type NivelLinha = "adequada" | "inadequada" | "nao-respondeu" | "normal";

interface LinhaConsolidada {
  nivel: NivelLinha;
  descricao: string;
  estudantes: string;
  percentual: string;
}

interface BlocoConsolidado {
  titulo: string;
  linhas: LinhaConsolidada[];
}

const obterBlocosMock = (): BlocoConsolidado[] => {
  return [
    {
      titulo: "Localização",
      linhas: [
        {
          nivel: "adequada",
          descricao: "Adequada",
          estudantes: "132.000",
          percentual: "28,2%",
        },
        {
          nivel: "inadequada",
          descricao: "Inadequada",
          estudantes: "276.000",
          percentual: "38,4%",
        },
        {
          nivel: "nao-respondeu",
          descricao: "Não respondeu",
          estudantes: "Vazio",
          percentual: "Vazio",
        },
        {
          nivel: "normal",
          descricao: "Sem preenchimento",
          estudantes: "276.000",
          percentual: "38,4%",
        },
        {
          nivel: "normal",
          descricao: "Total",
          estudantes: "841.060",
          percentual: "99,15%",
        },
      ],
    },
    {
      titulo: "Inferência",
      linhas: [
        {
          nivel: "adequada",
          descricao: "Adequada",
          estudantes: "Vazio",
          percentual: "Vazio",
        },
        {
          nivel: "inadequada",
          descricao: "Inadequada",
          estudantes: "276.000",
          percentual: "38,4%",
        },
        {
          nivel: "nao-respondeu",
          descricao: "Não respondeu",
          estudantes: "240.060",
          percentual: "15,9%",
        },
        {
          nivel: "normal",
          descricao: "Sem preenchimento",
          estudantes: "276.000",
          percentual: "38,4%",
        },
        {
          nivel: "normal",
          descricao: "Total",
          estudantes: "841.060",
          percentual: "99,15%",
        },
      ],
    },
  ];
};

const montarBlocos = (
  _dados: DadosTabelaDinamica | null,
): BlocoConsolidado[] => {
  // Enquanto o endpoint definitivo nao estiver pronto, usamos mock para estruturar a tela.
  return obterBlocosMock();
};

const TabelaRelatorioConsolidado: React.FC<TabelaRelatorioConsolidadoProps> = ({
  dados,
}) => {
  const blocos = montarBlocos(dados);

  if (!blocos.length) return null;

  const renderDescricao = (linha: LinhaConsolidada) => {
    if (linha.nivel === "adequada") {
      return (
        <span className="consolidado-pill consolidado-pill--adequada">
          {linha.descricao}
        </span>
      );
    }

    if (linha.nivel === "inadequada") {
      return (
        <span className="consolidado-pill consolidado-pill--inadequada">
          {linha.descricao}
        </span>
      );
    }

    if (linha.nivel === "nao-respondeu") {
      return (
        <span className="consolidado-pill consolidado-pill--nao-respondeu">
          {linha.descricao}
        </span>
      );
    }

    return (
      <span className="consolidado-descricao-normal">{linha.descricao}</span>
    );
  };

  const getValorClassName = (valor: string, descricao: string) => {
    if (valor === "Vazio") return "consolidado-valor consolidado-valor--vazio";
    if (descricao === "Total")
      return "consolidado-valor consolidado-valor--total";
    return "consolidado-valor";
  };

  return (
    <div className="tabelaRelatorioConsolidado">
      <div className="consolidado-legenda-data">
        Data da última consolidação: 00/00/0000 às 00:00
      </div>

      {blocos.map((bloco) => (
        <div key={bloco.titulo} className="consolidado-bloco">
          <table className="consolidado-tabela">
            <thead>
              <tr>
                <th>{bloco.titulo}</th>
                <th>Estudantes</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {bloco.linhas.map((linha) => (
                <tr key={`${bloco.titulo}-${linha.descricao}`}>
                  <td>{renderDescricao(linha)}</td>
                  <td
                    className={getValorClassName(
                      linha.estudantes,
                      linha.descricao,
                    )}
                  >
                    {linha.estudantes}
                  </td>
                  <td
                    className={getValorClassName(
                      linha.percentual,
                      linha.descricao,
                    )}
                  >
                    {linha.percentual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TabelaRelatorioConsolidado;
