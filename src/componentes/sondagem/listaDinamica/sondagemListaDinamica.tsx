import React, { useEffect, useState, useRef, useCallback } from "react";
import { Checkbox, ConfigProvider, Form, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import SelectColorido from "../selectColorido";
import { LogoAcessibilidade, LogoAEE, LogoPAP } from "../shared/logos";
import type { DadosTabelaDinamica, Estudante } from "../../../core/dto/types";
import "./sondagemListaDinamica.css";

interface ListaSondagemEscritaProps {
  dados: DadosTabelaDinamica | null;
  podeSalvar?: boolean;
  naoExibirTituloTabelaRespostas?: boolean;
}

const SondagemListaDinamica: React.FC<
  ListaSondagemEscritaProps & { formListaDinamica: any }
> = ({
  dados,
  formListaDinamica,
  podeSalvar = true,
  naoExibirTituloTabelaRespostas,
}) => {
  const mostrarColunaLP = dados?.tituloTabelaRespostas === "Sistema de escrita";
  const [opcoesCarregadas, setOpcoesCarregadas] = useState(false);
  const selectRefs = useRef<Map<string, any>>(new Map());
  const selectOpenStatesRef = useRef<Map<string, boolean>>(new Map());

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
        initialValues[`linguaPortuguesaSegundaLingua_${estudanteIndex}`] =
          estudante.linguaPortuguesaSegundaLingua;

        estudante.coluna.forEach((coluna, colunaIndex) => {
          const respostaSelecionada = coluna.resposta;

          initialValues[`resposta_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada?.opcaoRespostaId &&
            respostaSelecionada.opcaoRespostaId !== 0
              ? respostaSelecionada.opcaoRespostaId
              : undefined;

          initialValues[`respostaId_${estudanteIndex}_${colunaIndex}`] =
            respostaSelecionada?.id ?? "";
        });
      });

      formListaDinamica.setFieldsValue(initialValues);
    }
  }, [opcoesCarregadas, dados, formListaDinamica]);

  const getTotalColumns = useCallback(() => {
    return dados?.estudantes?.[0]?.coluna?.length ?? 0;
  }, [dados]);

  const moveFocus = useCallback(
    (newRow: number, newCol: number) => {
      if (!dados?.estudantes) return;

      const totalRows = dados.estudantes.length;
      const totalCols = getTotalColumns();

      if (newRow < 0 || newRow >= totalRows) return;
      if (newCol < 0 || newCol >= totalCols) return;

      const targetKey = `${newRow}_${newCol}`;
      const targetRef = selectRefs.current.get(targetKey);

      if (targetRef?.focus) {
        setTimeout(() => targetRef.focus(), 0);
      }
    },
    [dados, getTotalColumns],
  );

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent, row: number, col: number) => {
      const totalCols = getTotalColumns();

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          const prevCol = col === 0 ? totalCols - 1 : col - 1;
          moveFocus(row, prevCol);
        } else {
          const nextCol = (col + 1) % totalCols;
          moveFocus(row, nextCol);
        }
      }
    },
    [getTotalColumns, moveFocus],
  );

  const handleSelectOpen = useCallback(
    (row: number, col: number, open: boolean) => {
      const key = `${row}_${col}`;
      selectOpenStatesRef.current.set(key, open);
    },
    [],
  );

  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes && dados.estudantes.length > 0) {
      const firstKey = "0_0";
      const firstRef = selectRefs.current.get(firstKey);
      if (firstRef?.focus) {
        setTimeout(() => firstRef.focus(), 100);
      }
    }
  }, [opcoesCarregadas, dados]);

  const columns: ColumnsType<Estudante> = [];
  const columnsDinamicas: ColumnsType<Estudante> = [];

  if (mostrarColunaLP) {
    columns.push({
      title: <span className="lpConfig">LP como 2ª língua?</span>,
      key: "lp",
      width: 110,
      align: "center",
      fixed: "left",
      render: (_, _record, index) => (
        <Form.Item
          name={`linguaPortuguesaSegundaLingua_${index}`}
          valuePropName="checked"
          className="marginZero"
        >
          <Checkbox disabled={!podeSalvar} />
        </Form.Item>
      ),
    });
  }

  columns.push({
    title: "Estudantes",
    key: "estudante",
    width: mostrarColunaLP ? "40%" : "50%",
    fixed: "left",
    render: (_, record) => (
      <Space direction="vertical" size={0} className="width100">
        <div className="estudantesConfig">
          <span className="fontWeight500">
            {record.numeroAlunoChamada} - {record.nome}
          </span>
          <Space size={4}>
            {record.pap && <LogoPAP />}
            {record.aee && <LogoAEE />}
            {record.possuiDeficiencia && <LogoAcessibilidade />}
          </Space>
        </div>
      </Space>
    ),
  });

  if (dados?.estudantes?.[0]?.coluna) {
    dados.estudantes[0].coluna.forEach((coluna, colunaIndex) => {
      columnsDinamicas.push({
        title: coluna.descricaoColuna,
        key: `coluna_${colunaIndex}`,
        width: 150,
        render: (_, record, estudanteIndex) => {
          const colunaEstudante = record.coluna[colunaIndex];
          const opcoesOrdenadas = [...colunaEstudante.opcaoResposta].sort(
            (a, b) => a.ordem - b.ordem,
          );
          const options = opcoesOrdenadas.map((opcao) => ({
            label: opcao.descricaoOpcaoResposta,
            value: opcao.id,
            corFundo: opcao.corFundo,
            corTexto: opcao.corTexto,
            ordem: opcao.ordem,
          }));

          const isDisabled =
            !podeSalvar || !colunaEstudante.periodoBimestreAtivo;

          return (
            <>
              <Form.Item
                name={`respostaId_${estudanteIndex}_${colunaIndex}`}
                hidden
                initialValue=""
                className="marginZero"
              >
                <input type="hidden" />
              </Form.Item>

              <Form.Item
                name={`resposta_${estudanteIndex}_${colunaIndex}`}
                className="marginZero"
                rules={[{ required: false }]}
              >
                <SelectColorido
                  id={`select_${estudanteIndex}_${colunaIndex}`}
                  options={options}
                  placeholder="Selecione"
                  disabled={isDisabled}
                  className="width100"
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

    if (naoExibirTituloTabelaRespostas) {
      columns.push(...columnsDinamicas);
    } else {
      columns.push({
        title: dados.tituloTabelaRespostas,
        children: [...columnsDinamicas],
      });
    }
  }

  if (!dados?.estudantes?.length) {
    return (
      <div className="nenhumDado">
        <p>Nenhum dado disponível para exibir.</p>
      </div>
    );
  }

  const dataSourceComIndice = dados.estudantes.map((estudante, index) => ({
    ...estudante,
    uniqueKey: `estudante_${index}_${estudante.numeroAlunoChamada}`,
  }));

  return (
    <div className="listaDinamicaConfig">
      <ConfigProvider componentDisabled={!podeSalvar}>
        <Form form={formListaDinamica} component={false}>
          <Table
            key={`table-${podeSalvar}`}
            columns={columns}
            dataSource={dataSourceComIndice}
            rowKey={(record: any) => record.uniqueKey}
            pagination={false}
            scroll={{ x: "max-content" }}
            bordered
            size="small"
            sticky
            className="custom-border-table"
          />
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default SondagemListaDinamica;
