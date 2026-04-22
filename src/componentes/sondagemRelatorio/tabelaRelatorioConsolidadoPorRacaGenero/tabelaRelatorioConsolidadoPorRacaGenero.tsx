import React from "react";
import { Spin, Table } from "antd";
import type { ColumnsType, ColumnType, ColumnGroupType } from "antd/es/table";
import type {
  DadosRelatorioConsolidadoPorRacaGenero,
  GeneroConsolidadoComRacas,
  QuestaoConsolidadaPorRacaGenero,
  RacaGeneroConsolidado,
  RespostaConsolidadaPorRacaGenero,
} from "../../../core/dto/typesRelatorio";
import "./tabelaRelatorioConsolidadoPorRacaGenero.css";

type CelulaValor = {
  quantidade: number;
  percentual: number;
};

type LinhaTabelaConsolidadoRacaGenero = {
  key: string;
  descricao: React.ReactNode;
  isTotal?: boolean;
} & Record<string, React.ReactNode | string>;

interface TabelaRelatorioConsolidadoPorRacaGeneroProps {
  dados: DadosRelatorioConsolidadoPorRacaGenero | null;
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

const normalizarEspacos = (valor: string) => valor.trim().replace(/\s+/g, " ");

const removerAcentos = (valor: string) =>
  valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizarChaveTexto = (valor: string) =>
  removerAcentos(normalizarEspacos(valor)).toLowerCase();

const normalizarRacaParaChave = (raca: string) => {
  const valor = normalizarChaveTexto(raca);

  if (["nao informada", "nao informado"].includes(valor)) {
    return "nao-informada";
  }

  if (valor === "recusou informar") {
    return "preferiu-nao-informar";
  }

  return valor;
};

const normalizarRacaParaExibicao = (raca: string) => {
  const chave = normalizarRacaParaChave(raca);

  const mapaNomes: Record<string, string> = {
    amarela: "Amarela",
    branca: "Branca",
    parda: "Parda",
    preta: "Preta",
    indigena: "Indígena",
    "nao-informada": "Não informada",
    "preferiu-nao-informar": "Preferiu não informar",
  };

  return mapaNomes[chave] ?? normalizarEspacos(raca);
};

const normalizarGenerosComRacas = (
  generosComRacas: GeneroConsolidadoComRacas[],
): GeneroConsolidadoComRacas[] => {
  const mapaGeneros = new Map<
    string,
    {
      genero: string;
      totalGenero?: number;
      percentualGenero?: number;
      racas: Map<string, CelulaValor & { raca: string }>;
    }
  >();

  generosComRacas.forEach((grupoGenero) => {
    const generoNome = normalizarEspacos(grupoGenero.genero || "Não informado");
    const generoChave = normalizarChaveTexto(generoNome);

    if (!mapaGeneros.has(generoChave)) {
      mapaGeneros.set(generoChave, {
        genero: generoNome,
        totalGenero: grupoGenero.totalGenero,
        percentualGenero: grupoGenero.percentualGenero,
        racas: new Map<string, CelulaValor & { raca: string }>(),
      });
    }

    const itemGenero = mapaGeneros.get(generoChave);
    if (!itemGenero) return;

    grupoGenero.racas.forEach((itemRaca) => {
      const racaChave = normalizarRacaParaChave(itemRaca.raca);
      const racaNome = normalizarRacaParaExibicao(itemRaca.raca);
      const atual = itemGenero.racas.get(racaChave);

      itemGenero.racas.set(racaChave, {
        raca: racaNome,
        quantidade: (atual?.quantidade ?? 0) + itemRaca.quantidade,
        percentual: (atual?.percentual ?? 0) + itemRaca.percentual,
      });
    });
  });

  return Array.from(mapaGeneros.values()).map((genero) => ({
    genero: genero.genero,
    totalGenero: genero.totalGenero,
    percentualGenero: genero.percentualGenero,
    racas: Array.from(genero.racas.values()).map((raca) => ({
      raca: raca.raca,
      quantidade: raca.quantidade,
      percentual: raca.percentual,
    })),
  }));
};

const criarMapaGenerosComRacas = (
  totaisPorRacaGenero: RacaGeneroConsolidado[],
): GeneroConsolidadoComRacas[] => {
  const mapa = new Map<
    string,
    {
      genero: string;
      racas: Map<string, CelulaValor & { raca: string }>;
    }
  >();

  totaisPorRacaGenero.forEach((item) => {
    const genero = normalizarEspacos(item.genero || "Não informado");
    const generoChave = normalizarChaveTexto(genero);
    const racaChave = normalizarRacaParaChave(item.raca);
    const racaNome = normalizarRacaParaExibicao(item.raca);

    if (!mapa.has(generoChave)) {
      mapa.set(generoChave, {
        genero,
        racas: new Map<string, CelulaValor & { raca: string }>(),
      });
    }

    const itemGenero = mapa.get(generoChave);
    if (!itemGenero) return;

    const atual = itemGenero.racas.get(racaChave);

    itemGenero.racas.set(racaChave, {
      raca: racaNome,
      quantidade: (atual?.quantidade ?? 0) + item.quantidade,
      percentual: (atual?.percentual ?? 0) + item.percentual,
    });
  });

  return Array.from(mapa.values()).map((grupoGenero) => ({
    genero: grupoGenero.genero,
    racas: Array.from(grupoGenero.racas.values()).map((valor) => ({
      raca: valor.raca,
      quantidade: valor.quantidade,
      percentual: valor.percentual,
    })),
  }));
};

/** Normaliza os campos da API (generosComRacas, generos ou racasGeneros) para estrutura interna */
const normalizarGenerosDeResposta = (
  resposta: RespostaConsolidadaPorRacaGenero,
): GeneroConsolidadoComRacas[] => {
  if (resposta.generosComRacas?.length) {
    return normalizarGenerosComRacas(resposta.generosComRacas);
  }
  if (resposta.generos?.length) {
    return normalizarGenerosComRacas(resposta.generos);
  }
  if (!resposta.racasGeneros?.length) return [];
  return criarMapaGenerosComRacas(resposta.racasGeneros);
};

/** Normaliza os totais da questão para estrutura interna */
const normalizarTotaisQuestao = (
  questao: QuestaoConsolidadaPorRacaGenero,
): GeneroConsolidadoComRacas[] => {
  if (questao.totaisPorGeneroComRacas?.length) {
    return normalizarGenerosComRacas(questao.totaisPorGeneroComRacas);
  }
  if (!questao.totaisPorRacaGenero?.length) return [];
  return criarMapaGenerosComRacas(questao.totaisPorRacaGenero);
};

const chaveCelula = (genero: string, raca: string) =>
  `${normalizarChaveTexto(genero)}__${normalizarRacaParaChave(raca)}`;

const renderValor = (
  dado: CelulaValor | undefined,
  classNameValor: string,
  classNameNumero: string,
  classNamePercentual: string,
  classNameValorVazio: string,
) => {
  if (!dado?.quantidade) {
    return <span className={classNameValorVazio}>Vazio</span>;
  }

  return (
    <span className={classNameValor}>
      <span className={classNameNumero}>
        {formatarInteiro(dado.quantidade)}
      </span>
      <span className={classNamePercentual}>
        {formatarPercentual(dado.percentual)}
      </span>
    </span>
  );
};

const montarMapaResposta = (
  resposta: RespostaConsolidadaPorRacaGenero,
): Record<string, CelulaValor> => {
  const generos = normalizarGenerosDeResposta(resposta);
  const mapa: Record<string, CelulaValor> = {};

  generos.forEach((grupoGenero) => {
    grupoGenero.racas.forEach((raca) => {
      mapa[chaveCelula(grupoGenero.genero, raca.raca)] = {
        quantidade: raca.quantidade,
        percentual: raca.percentual,
      };
    });
  });

  return mapa;
};

/**
 * Deriva a estrutura de colunas (generos × racas) consolidando totais e respostas.
 * Prioriza os totais da questão; completa com dados das respostas para não perder colunas.
 */
const obterEstruturaColunas = (questao: QuestaoConsolidadaPorRacaGenero) => {
  const totaisNormalizados = normalizarTotaisQuestao(questao);

  // Mapa genero → racas (preserva ordem de inserção)
  const mapaRacasPorGenero = new Map<string, string[]>();

  totaisNormalizados.forEach((grupoGenero) => {
    mapaRacasPorGenero.set(
      grupoGenero.genero,
      grupoGenero.racas.map((r) => r.raca),
    );
  });

  // Complementa com colunas que aparecem nas respostas mas não nos totais
  questao.respostas.forEach((resposta) => {
    normalizarGenerosDeResposta(resposta).forEach((grupoGenero) => {
      const racasExistentes = mapaRacasPorGenero.get(grupoGenero.genero) ?? [];
      grupoGenero.racas.forEach((r) => {
        if (!racasExistentes.includes(r.raca)) {
          racasExistentes.push(r.raca);
        }
      });
      mapaRacasPorGenero.set(grupoGenero.genero, racasExistentes);
    });
  });

  return {
    generos: Array.from(mapaRacasPorGenero.keys()),
    racasPorGenero: mapaRacasPorGenero,
    totaisNormalizados,
  };
};

const TabelaRelatorioConsolidadoPorRacaGenero: React.FC<
  TabelaRelatorioConsolidadoPorRacaGeneroProps
> = ({ dados, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="tabelaRelatorioConsolidadoPorRacaGenero">
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
      <div className="tabelaRelatorioConsolidadoPorRacaGenero">
        <div className="consolidado-raca-genero-vazio">
          Nenhuma informação encontrada para os filtros informados
        </div>
      </div>
    );
  }

  return (
    <div className="tabelaRelatorioConsolidadoPorRacaGenero">
      {questoes.map((questao) => {
        const respostasOrdenadas = [...questao.respostas].sort(
          (a, b) => a.ordem - b.ordem,
        );

        const { generos, racasPorGenero, totaisNormalizados } =
          obterEstruturaColunas(questao);

        const colunas: ColumnsType<LinhaTabelaConsolidadoRacaGenero> = [
          {
            title: questao.questaoNome,
            dataIndex: "descricao",
            key: "descricao",
            width: 260,
            align: "center",
            className: "consolidado-raca-genero-coluna-localizacao",
          },
          ...generos.map((genero) => {
            const filhos: ColumnType<LinhaTabelaConsolidadoRacaGenero>[] = (
              racasPorGenero.get(genero) ?? []
            ).map((raca) => ({
              title: raca,
              dataIndex: chaveCelula(genero, raca),
              key: chaveCelula(genero, raca),
              align: "center",
              width: 180,
            }));

            return {
              title: `Gênero: ${genero}`,
              key: `genero-${genero}`,
              align: "center",
              children: filhos,
            } as ColumnGroupType<LinhaTabelaConsolidadoRacaGenero>;
          }),
        ];

        const linhas: LinhaTabelaConsolidadoRacaGenero[] =
          respostasOrdenadas.map((resposta) => {
            const linha: LinhaTabelaConsolidadoRacaGenero = {
              key: `${questao.questaoId}-${resposta.ordem}`,
              descricao:
                resposta.corFundo && resposta.corTexto ? (
                  <span
                    className="consolidado-raca-genero-pill"
                    style={{
                      backgroundColor: resposta.corFundo,
                      color: resposta.corTexto,
                    }}
                  >
                    {resposta.resposta}
                  </span>
                ) : (
                  <span className="consolidado-raca-genero-descricao-normal">
                    {resposta.resposta}
                  </span>
                ),
            };

            const mapaResposta = montarMapaResposta(resposta);

            generos.forEach((genero) => {
              const racas = racasPorGenero.get(genero) ?? [];
              racas.forEach((raca) => {
                const chave = chaveCelula(genero, raca);
                linha[chave] = renderValor(
                  mapaResposta[chave],
                  "consolidado-raca-genero-valor",
                  "consolidado-raca-genero-numero",
                  "consolidado-raca-genero-percentual",
                  "consolidado-raca-genero-valor--vazio",
                );
              });
            });

            return linha;
          });

        const linhaTotal: LinhaTabelaConsolidadoRacaGenero = {
          key: `${questao.questaoId}-total`,
          descricao: (
            <span className="consolidado-raca-genero-descricao-total">
              Total
            </span>
          ),
          isTotal: true,
        };

        const mapaTotais: Record<string, CelulaValor> = {};
        totaisNormalizados.forEach((grupoGenero) => {
          grupoGenero.racas.forEach((raca) => {
            mapaTotais[chaveCelula(grupoGenero.genero, raca.raca)] = {
              quantidade: raca.quantidade,
              percentual: raca.percentual,
            };
          });
        });

        generos.forEach((genero) => {
          const racas = racasPorGenero.get(genero) ?? [];
          racas.forEach((raca) => {
            const chave = chaveCelula(genero, raca);
            linhaTotal[chave] = renderValor(
              mapaTotais[chave],
              "consolidado-raca-genero-valor",
              "consolidado-raca-genero-numero",
              "consolidado-raca-genero-percentual",
              "consolidado-raca-genero-valor--vazio",
            );
          });
        });

        linhas.push(linhaTotal);

        return (
          <div
            key={questao.questaoId}
            className="consolidado-raca-genero-bloco"
          >
            <Table
              className="consolidado-raca-genero-ant-table"
              columns={colunas}
              dataSource={linhas}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: "max-content" }}
              rowClassName={(record) =>
                record.isTotal ? "consolidado-raca-genero-linha-total" : ""
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default TabelaRelatorioConsolidadoPorRacaGenero;
