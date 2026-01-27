import { Table, Tooltip, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import "./legendas.css";

interface LegendasComponentProps {
  data: LegendasProps[];
  ano?: number;
  proficienciaId?: number;
  dadosCompletos?: any;
}

const Legendas: React.FC<LegendasComponentProps> = ({
  data,
  ano,
  proficienciaId,
  dadosCompletos,
}) => {
  const columns: ColumnsType<LegendasProps> = [
    {
      title: "",
      dataIndex: "corFundo",
      key: "corFundo",
      width: 10,
      align: "left",
      render: (corFundo: string) => (
        <div
          style={{ backgroundColor: corFundo, width: "10px", height: "20px" }}
        />
      ),
    },
    {
      title: "",
      dataIndex: "textoLegenda",
      key: "descricao",
      align: "left",
      render: (_: any, record: LegendasProps) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{record.descricaoLegenda}</span>:{" "}
          <Tooltip title={record.textoLegenda}>
            <span className="legenda-texto-truncado">
              {record.textoLegenda}
            </span>
          </Tooltip>
        </span>
      ),
    },
  ];

  const isProficienciaLeitura = proficienciaId === 3;
  const anoNumero = typeof ano === "string" ? parseInt(ano, 10) : ano;
  const deveGerarMultiplasLegendas =
    isProficienciaLeitura && anoNumero && [2, 3].includes(anoNumero);

  const extrairLegendasDaColuna = (
    descricaoColuna: string,
  ): LegendasProps[] => {
    if (!dadosCompletos?.estudantes?.[0]?.coluna) return [];

    const coluna = dadosCompletos.estudantes[0].coluna.find(
      (col: any) =>
        col.descricaoColuna?.toLowerCase() === descricaoColuna.toLowerCase(),
    );

    if (!coluna?.opcaoResposta) return [];

    return coluna.opcaoResposta.map((opcao: any) => ({
      corFundo: opcao.corFundo,
      descricaoLegenda: opcao.descricaoOpcaoResposta,
      textoLegenda: opcao.legenda,
    }));
  };

  const renderizarLegendaUnica = () => (
    <div style={{ marginTop: "2em" }}>
      <div
        style={{
          backgroundColor: "#FAFAFA",
          padding: "8px",
        }}
      >
        Legendas
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        size="small"
        bordered
        className="tabela-legendas"
        locale={{ emptyText: "Nenhuma legenda cadastrada" }}
        rowKey={(record) =>
          `legenda-${record.corFundo}-${record.descricaoLegenda}`
        }
      />
    </div>
  );

  const renderizarMultiplasLegendas = () => {
    const configuracoes = [
      { titulo: "da localização", descricao: "Localização" },
      { titulo: "da inferência", descricao: "Inferência" },
      { titulo: "da reflexão", descricao: "Reflexão" },
    ];

    const numColunas = anoNumero === 2 ? 2 : 3;
    const colunasParaMostrar = configuracoes.slice(0, numColunas);

    const colSizes =
      anoNumero === 2 ? { md: 12, lg: 12, xl: 12 } : { md: 8, lg: 8, xl: 8 };

    return (
      <div style={{ marginTop: "2em" }}>
        <Row gutter={16}>
          {colunasParaMostrar.map((config) => {
            const legendasColuna = extrairLegendasDaColuna(config.descricao);

            return (
              <Col
                key={config.descricao}
                xs={24}
                sm={24}
                md={colSizes.md}
                lg={colSizes.lg}
                xl={colSizes.xl}
              >
                <div
                  style={{
                    backgroundColor: "#FAFAFA",
                    padding: "8px",
                  }}
                >
                  Legendas {config.titulo}
                </div>
                <Table
                  columns={columns}
                  dataSource={legendasColuna}
                  pagination={false}
                  showHeader={false}
                  size="small"
                  bordered
                  className="tabela-legendas"
                  locale={{ emptyText: "Nenhuma legenda cadastrada" }}
                  rowKey={(record) =>
                    `legenda-${config.descricao}-${record.corFundo}-${record.descricaoLegenda}`
                  }
                />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  return deveGerarMultiplasLegendas
    ? renderizarMultiplasLegendas()
    : renderizarLegendaUnica();
};

export default Legendas;
