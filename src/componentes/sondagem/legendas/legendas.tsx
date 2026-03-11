import { Table, Tooltip, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import { Ano, Proficiencia, Modalidade } from "../../../core/dto/types";
import { pertenceAColuna } from "./legendaClassifier";
import "./legendas.css";
import { useSelector } from "react-redux";

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
  const usuario = useSelector((store: any) => store.usuario);
  const modalidade = usuario?.turmaSelecionada?.modalidade;
  const anoTurma = usuario?.turmaSelecionada?.ano;
  const exibeLegendaSemDescricao =
    modalidade === Modalidade.EJA &&
    anoTurma === Ano.PrimeiroAno &&
    proficienciaId === Proficiencia.LeituraEJA;

  const columns: ColumnsType<LegendasProps> = [
    {
      title: "",
      dataIndex: "corFundo",
      key: "corFundo",
      width: 10,
      align: "left",
      render: (corFundo: string) => (
        <div
          className="legenda-cor-box"
          style={{ backgroundColor: corFundo }}
        />
      ),
    },
    {
      title: "",
      dataIndex: "textoLegenda",
      key: "descricao",
      align: "left",
      render: (_: any, record: LegendasProps) => (
        <span className="config-texto-legenda">
          {exibeLegendaSemDescricao &&
          record.descricaoLegenda !== "Sem preenchimento" ? null : (
            <span className="fontWeightBold">
              {record.descricaoLegenda}:&nbsp;
            </span>
          )}
          <Tooltip title={record.textoLegenda}>
            <span className="legenda-texto-truncado">
              {record.textoLegenda}
            </span>
          </Tooltip>
        </span>
      ),
    },
  ];

  const isProficienciaLeitura = proficienciaId === Proficiencia.LeituraEJA;
  const anoNumero = typeof ano === "string" ? parseInt(ano, 10) : ano;
  const deveGerarMultiplasLegendas =
    isProficienciaLeitura &&
    anoNumero &&
    [Ano.SegundoAno, Ano.TerceiroAno].includes(anoNumero);

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
    <div className="marginTop2em">
      <div className="titulo-legenda">Legendas</div>
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

    const genericas = data.filter(
      (l) =>
        !pertenceAColuna("Localização", l) &&
        !pertenceAColuna("Inferência", l) &&
        !pertenceAColuna("Reflexão", l),
    );

    return (
      <div className="marginTop2em">
        <Row gutter={16}>
          {colunasParaMostrar.map((config) => {
            let legendasColuna = extrairLegendasDaColuna(config.descricao);

            legendasColuna = legendasColuna.filter((item) =>
              pertenceAColuna(config.descricao, item),
            );

            if (legendasColuna.length === 0 && data.length) {
              legendasColuna = data.filter((item) =>
                pertenceAColuna(config.descricao, item),
              );
            }

            if (genericas.length) {
              genericas.forEach((g) => {
                if (!legendasColuna.includes(g)) legendasColuna.push(g);
              });
            }

            return (
              <Col
                key={config.descricao}
                xs={24}
                sm={24}
                md={colSizes.md}
                lg={colSizes.lg}
                xl={colSizes.xl}
              >
                <div className="titulo-legenda">Legendas {config.titulo}</div>
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
