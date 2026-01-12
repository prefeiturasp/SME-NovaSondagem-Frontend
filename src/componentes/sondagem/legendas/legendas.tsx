import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LegendasProps } from "../../../core/dto/legendaProps";
import "./legendas.css";

const Legendas: React.FC<{ data: LegendasProps[] }> = ({ data }) => {
  const columns: ColumnsType<LegendasProps> = [
    {
      title: "",
      dataIndex: "corFundo",
      key: "corFundo",
      width: 10,
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
      render: (_: any, record: LegendasProps) => (
        <span>
          <span style={{ fontWeight: "bold" }}>{record.textoLegenda}</span>:{" "}
          {record.descricaoLegenda}
        </span>
      ),
    },
  ];

  return (
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
        rowKey={(record) => `legenda-${record.corFundo}-${record.textoLegenda}`}
      />
    </div>
  );
};

export default Legendas;
