import React from "react";
import { Checkbox, ConfigProvider, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import CelulaColorida from "../celulaColorida/celulaColorida";
import {
  LogoAcessibilidade,
  LogoAEE,
  LogoPAP,
} from "../../sondagem/shared/logos";
import type {
  DadosTabelaDinamica,
  Estudante,
} from "../../../core/dto/typesRelatorio";
import "./listaDinamicaRelatorio.css";

interface ListaDinamicaRelatorioProps {
  dados: DadosTabelaDinamica | null;
}

const ListaDinamicaRelatorio: React.FC<ListaDinamicaRelatorioProps> = ({
  dados,
}) => {
  const mostrarColunaLP = dados?.tituloTabelaRespostas === "Sistema de escrita";

  const columns: ColumnsType<Estudante> = [];
  const columnsDinamicas: ColumnsType<Estudante> = [];

  columns.push({
    title: "Número chamada",
    key: "numeroChamada",
    width: 75,
    align: "center",
    fixed: "left",
    render: (_, record) => <span>{record.numeroAlunoChamada}</span>,
  });

  columns.push({
    title: "Nome",
    key: "estudante",
    width: 350,
    fixed: "left",
    render: (_, record) => (
      <Space direction="vertical" size={0} className="width100">
        <div className="estudantes-config-relatorio">
          <span className="font-weight-500 font-size-16">{record.nome}</span>
          <Space size={4}>
            {record.pap && <LogoPAP />}
            {record.aee && <LogoAEE />}
            {record.possuiDeficiencia && <LogoAcessibilidade />}
          </Space>
        </div>
      </Space>
    ),
  });

  columns.push({
    title: "EOL",
    key: "codigoEol",
    width: 60,
    align: "center",
    fixed: "left",
    render: (_, record) => <span>{record.codigo}</span>,
  });

  columns.push({
    title: "Raça",
    key: "raca",
    width: 60,
    align: "center",
    fixed: "left",
    render: (_, record) => <span>{record.raca}</span>,
  });

  columns.push({
    title: "Gênero",
    key: "genero",
    width: 65,
    align: "center",
    fixed: "left",
    render: (_, record) => <span>{record.genero}</span>,
  });

  if (mostrarColunaLP) {
    columns.push({
      title: <span className="lp-config-relatorio">LP como 2ª língua?</span>,
      key: "lp",
      width: 70,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <Checkbox checked={record.linguaPortuguesaSegundaLingua} disabled />
      ),
    });
  }

  if (dados?.estudantes?.[0]?.coluna) {
    dados.estudantes[0].coluna.forEach((coluna, colunaIndex) => {
      columnsDinamicas.push({
        title: coluna.descricaoColuna,
        key: `coluna_${colunaIndex}`,
        width: 150,
        align: "center",
        className: "coluna-dinamica-relatorio",
        render: (_, record) => {
          const colunaEstudante = record.coluna[colunaIndex];
          return (
            <CelulaColorida
              opcaoResposta={colunaEstudante.opcaoResposta}
              resposta={colunaEstudante.resposta}
            />
          );
        },
      });
    });

    columns.push({
      title: dados.tituloTabelaRespostas,
      children: [...columnsDinamicas],
    });
  }

  if (!dados?.estudantes?.length) {
    return (
      <div className="nenhum-dado-relatorio">
        <p>Nenhum dado disponível para exibir.</p>
      </div>
    );
  }

  const dataSourceComIndice = dados.estudantes.map((estudante, index) => ({
    ...estudante,
    uniqueKey: `estudante_${index}_${estudante.numeroAlunoChamada}`,
  }));

  return (
    <div className="lista-dinamica-relatorio">
      <ConfigProvider>
        <Table
          className="custom-border-table-relatorio"
          columns={columns}
          dataSource={dataSourceComIndice}
          rowKey={(record: any) => record.uniqueKey}
          scroll={{ x: "max-content" }}
          bordered
          size="small"
          pagination={false}
          sticky
        />
      </ConfigProvider>
    </div>
  );
};

export default ListaDinamicaRelatorio;
