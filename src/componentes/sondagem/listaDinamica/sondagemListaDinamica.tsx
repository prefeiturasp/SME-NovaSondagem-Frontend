import React, { useEffect, useState, useRef, useCallback } from "react";
import { Checkbox, Form, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileTextOutlined, TeamOutlined, EyeOutlined } from "@ant-design/icons";
import SelectColorido from "../selectColorido";
import type { DadosTabelaDinamica, Estudante } from "../../../core/dto/types";
import "./sondagemListaDinamica.css";

interface ListaSondagemEscritaProps {
  dados: DadosTabelaDinamica | null;
}

const SondagemListaDinamica: React.FC<
  ListaSondagemEscritaProps & { formListaDinamica: any }
> = ({ dados, formListaDinamica }) => {
  const mostrarColunaLP = dados?.questao === "escrita";
  const [opcoesCarregadas, setOpcoesCarregadas] = useState(false);
  const selectRefs = useRef<Map<string, any>>(new Map());
  const [selectOpenStates, setSelectOpenStates] = useState<
    Map<string, boolean>
  >(new Map());

  const setSelectRef = useCallback((key: string, ref: any) => {
    if (ref) {
      selectRefs.current.set(key, ref);
    } else {
      selectRefs.current.delete(key);
    }
  }, []);

  useEffect(() => {
    if (dados?.estudantes && dados.estudantes.length > 0) {
      setOpcoesCarregadas(true);
    }
  }, [dados]);

  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes) {
      const initialValues: any = {};

      dados.estudantes.forEach((estudante, estudanteIndex) => {
        initialValues[`lp_${estudanteIndex}`] = estudante.lp;

        estudante.coluna.forEach((coluna, colunaIndex) => {
          const respostaSelecionada = coluna.resposta?.[0];

          initialValues[`resposta_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada
              ? respostaSelecionada.opcaoRespostaId
              : undefined;

          initialValues[`respostaId_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada ? respostaSelecionada.id : "";
        });
      });

      formListaDinamica.setFieldsValue(initialValues);
    }
  }, [opcoesCarregadas, dados, formListaDinamica]);

  const getTotalColumns = useCallback(() => {
    return dados?.estudantes?.[0]?.coluna?.length || 0;
  }, [dados]);

  const isSelectOpen = useCallback(
    (row: number, col: number) => {
      const key = `${row}_${col}`;
      return selectOpenStates.get(key) || false;
    },
    [selectOpenStates]
  );

  const moveFocus = useCallback(
    (newRow: number, newCol: number) => {
      if (!dados?.estudantes) return;

      const totalRows = dados.estudantes.length;
      const totalCols = getTotalColumns();

      if (newRow < 0 || newRow >= totalRows) return;
      if (newCol < 0 || newCol >= totalCols) return;

      const targetKey = `${newRow}_${newCol}`;
      const targetRef = selectRefs.current.get(targetKey);

      if (targetRef && targetRef.focus) {
        setTimeout(() => targetRef.focus(), 0);
      }
    },
    [dados, getTotalColumns]
  );

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent, row: number, col: number) => {
      const totalCols = getTotalColumns();
      const isOpen = isSelectOpen(row, col);

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          const prevCol = col === 0 ? totalCols - 1 : col - 1;
          moveFocus(row, prevCol);
        } else {
          const nextCol = (col + 1) % totalCols;
          moveFocus(row, nextCol);
        }
      } else if (e.key === "ArrowDown") {
        if (isOpen) {
          return;
        }
        e.preventDefault();
        moveFocus(row + 1, col);
      } else if (e.key === "ArrowUp") {
        if (isOpen) {
          return;
        }
        e.preventDefault();
        moveFocus(row - 1, col);
      }
    },
    [getTotalColumns, isSelectOpen, moveFocus]
  );

  const handleSelectOpen = useCallback(
    (row: number, col: number, open: boolean) => {
      setSelectOpenStates((prev) => {
        const newMap = new Map(prev);
        const key = `${row}_${col}`;
        newMap.set(key, open);
        return newMap;
      });
    },
    []
  );

  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes && dados.estudantes.length > 0) {
      const firstKey = "0_0";
      const firstRef = selectRefs.current.get(firstKey);
      if (firstRef && firstRef.focus) {
        setTimeout(() => firstRef.focus(), 100);
      }
    }
  }, [opcoesCarregadas, dados]);

  const columns: ColumnsType<Estudante> = [];
  const columnsDinamicas: ColumnsType<Estudante> = [];

  if (mostrarColunaLP) {
    columns.push({
      title: (
        <span style={{ fontSize: "11px", whiteSpace: "normal" }}>
          LP como 2ª língua?
        </span>
      ),
      key: "lp",
      width: 110,
      align: "center",
      fixed: "left",
      render: (_, _record, index) => (
        <Form.Item
          name={`lp_${index}`}
          valuePropName="checked"
          style={{ margin: 0 }}
        >
          <Checkbox />
        </Form.Item>
      ),
    });
  }

  columns.push({
    title: "Estudante",
    key: "estudante",
    width: mostrarColunaLP ? "40%" : "50%",
    fixed: "left",
    render: (_, record) => (
      <Space direction="vertical" size={0} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {record.numero} - {record.nome}
          </span>
          <Space size={4}>
            {record.pap && (
              <Tag
                color="blue"
                icon={<FileTextOutlined />}
                style={{ margin: 0, fontSize: 10 }}
              >
                PAP
              </Tag>
            )}
            {record.aee && (
              <Tag
                color="green"
                icon={<TeamOutlined />}
                style={{ margin: 0, fontSize: 10 }}
              >
                AEE
              </Tag>
            )}
            {record.acessibilidade && (
              <Tag
                color="orange"
                icon={<EyeOutlined />}
                style={{ margin: 0, fontSize: 10 }}
              >
                Acessibilidade
              </Tag>
            )}
          </Space>
        </div>
      </Space>
    ),
  });

  const nomeQuestao = () => {
    switch (dados?.questao) {
      case "escrita":
        return "Sistema de escrita";
      case "reescrita":
        return "Reescrita";
      case "producao":
        return "Produção";
      case "leitura":
        return "Compreensão de textos";
      default:
        return "Questão";
    }
  };

  if (dados?.estudantes?.[0]?.coluna) {
    dados.estudantes[0].coluna.forEach((coluna, colunaIndex) => {
      columnsDinamicas.push({
        title: coluna.descricaoColuna,
        key: `coluna_${colunaIndex}`,
        width: 150,
        render: (_, record, estudanteIndex) => {
          const colunaEstudante = record.coluna[colunaIndex];
          const opcoesOrdenadas = [...colunaEstudante.opcaoResposta].sort(
            (a, b) => a.ordem - b.ordem
          );
          const options = opcoesOrdenadas.map((opcao) => ({
            label: opcao.descricaoOpcao,
            value: opcao.id,
            corFundo: opcao.corFundo,
            corTexto: opcao.corTexto,
          }));

          const isDisabled = !colunaEstudante.PeriodoBimestreAtivo;

          return (
            <>
              <Form.Item
                name={`respostaId_${estudanteIndex}_${colunaIndex}`}
                hidden
                initialValue=""
                style={{ margin: 0 }}
              >
                <input type="hidden" />
              </Form.Item>

              <Form.Item
                name={`resposta_${estudanteIndex}_${colunaIndex}`}
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <SelectColorido
                  id={`select_${estudanteIndex}_${colunaIndex}`}
                  options={options}
                  placeholder="Selecione"
                  disabled={isDisabled}
                  style={{ width: "100%" }}
                  getPopupContainer={() => document.body}
                  placement="bottomLeft"
                  ref={(ref: any) =>
                    setSelectRef(`${estudanteIndex}_${colunaIndex}`, ref)
                  }
                  onKeyDown={(e: React.KeyboardEvent) =>
                    handleKeyNavigation(e, estudanteIndex, colunaIndex)
                  }
                  onOpenChange={(open: boolean) =>
                    handleSelectOpen(estudanteIndex, colunaIndex, open)
                  }
                />
              </Form.Item>
            </>
          );
        },
      });
    });
    columns.push({
      title: nomeQuestao(),
      children: [...columnsDinamicas],
    });
  }

  if (!dados?.estudantes?.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Nenhum dado disponível para exibir.</p>
      </div>
    );
  }

  const dataSourceComIndice = dados.estudantes.map((estudante, index) => ({
    ...estudante,
    uniqueKey: `estudante_${index}_${estudante.numero}`,
  }));

  return (
    <div style={{ marginTop: 16, overflowX: "auto" }}>
      <Form form={formListaDinamica} component={false}>
        <Table
          columns={columns}
          dataSource={dataSourceComIndice}
          rowKey={(record: any) => record.uniqueKey}
          pagination={false}
          scroll={{ x: "max-content", y: 600 }}
          bordered
          size="small"
          sticky
          className="custom-border-table"
        />
      </Form>
    </div>
  );
};

export default SondagemListaDinamica;
