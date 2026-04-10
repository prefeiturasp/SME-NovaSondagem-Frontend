import React from "react";
import { Button, Dropdown } from "antd";

interface CabecalhoRelatorioAcoesProps {
  titulo: string;
  onVoltar: () => void;
  onCancelar: () => void;
  onGerar: (formato: "pdf" | "excel") => void;
  menuGerarDesabilitado: boolean;
  botaoGerarDesabilitado: boolean;
  loadingGerar: boolean;
}

const opcoesGeracao = [
  { key: "pdf", label: "Relatório em PDF" },
  { key: "excel", label: "Relatório em .xlsx (Excel)" },
];

const CabecalhoRelatorioAcoes: React.FC<CabecalhoRelatorioAcoesProps> = ({
  titulo,
  onVoltar,
  onCancelar,
  onGerar,
  menuGerarDesabilitado,
  botaoGerarDesabilitado,
  loadingGerar,
}) => {
  return (
    <div className="linhaTituloBotao">
      <div className="tituloSondagem">{titulo}</div>
      <div>
        <Button
          id="sondagem-button-voltar"
          className="sondagemBotaoEstilo"
          onClick={onVoltar}
          icon={<i className="fa fa-arrow-left iconBotaoVoltar" />}
        ></Button>

        <Button
          id="sondagem-button-cancelar"
          className="sondagemBotaoEstilo"
          onClick={onCancelar}
        >
          Cancelar
        </Button>

        <Dropdown
          menu={{
            items: opcoesGeracao,
            onClick: ({ key }) => {
              onGerar(key as "pdf" | "excel");
            },
          }}
          trigger={["click"]}
          disabled={menuGerarDesabilitado}
        >
          <Button
            id="sondagem-button-gerar"
            className="sondagemBotaoEstilo"
            loading={loadingGerar}
            disabled={botaoGerarDesabilitado}
            icon={<i className="fa fa-print iconBotaoGerar" />}
          >
            Gerar
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default CabecalhoRelatorioAcoes;
