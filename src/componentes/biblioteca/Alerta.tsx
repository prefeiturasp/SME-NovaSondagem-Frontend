import React from "react";
import styled from "styled-components";

const MessageClick = styled.span`
  cursor: pointer;
  color: hsl(210deg 100% 62%);
`;

interface AlertaData {
  tipo: string;
  id: string | number;
  mensagem: string;
  estiloTitulo?: React.CSSProperties;
  mensagemClick?: string;
  marginBottom?: string | number;
}

interface AlertProps {
  alerta: AlertaData;
  closable?: boolean;
  className?: string;
  onClickMessage?: () => void;
  onClose?: (id: string | number) => void;
}

const Alerta: React.FC<AlertProps> = (props) => {
  const { tipo, id, mensagem, estiloTitulo, mensagemClick, marginBottom } =
    props.alerta;
  const { closable, className, onClickMessage, onClose } = props;

  const SONDAGEM_BUTTON_FECHAR_ALERTA = "sondagem-button-fechar-alerta";

  return (
    <div
      className={`alert alert-${tipo} alert-dismissible fade show text-center ${
        className ?? ""
      }`}
      role="alert"
      style={marginBottom ? { marginBottom } : {}}
    >
      <b style={estiloTitulo || { fontSize: "18px" }}>
        {mensagem}
        {mensagemClick && (
          <MessageClick onClick={onClickMessage}>{mensagemClick}</MessageClick>
        )}
      </b>
      {closable && onClose && (
        <button
          id={SONDAGEM_BUTTON_FECHAR_ALERTA}
          type="button"
          className="close"
          onClick={() => onClose(id)}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alerta;
