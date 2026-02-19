import React, { useMemo } from "react";
import type {
  OpcaoRespostaRelatorio,
  RespostaRelatorio,
} from "../../../core/dto/typesRelatorio";
import "./celulaColorida.css";

interface CelulaColoridaProps {
  opcaoResposta: OpcaoRespostaRelatorio[];
  resposta: RespostaRelatorio | RespostaRelatorio[];
}

const CelulaColorida: React.FC<CelulaColoridaProps> = ({
  opcaoResposta,
  resposta,
}) => {
  const opcaoSelecionada = useMemo(() => {
    const respostaAtual = Array.isArray(resposta) ? resposta[0] : resposta;

    if (!respostaAtual?.opcaoRespostaId) return null;

    return opcaoResposta.find(
      (opcao) => opcao.id === respostaAtual.opcaoRespostaId,
    );
  }, [opcaoResposta, resposta]);

  const corFundo = opcaoSelecionada ? opcaoSelecionada.corFundo : "#FFFFFF";
  const corTexto = opcaoSelecionada ? opcaoSelecionada.corTexto : "#BFBFC2";
  const texto = opcaoSelecionada
    ? opcaoSelecionada.descricaoOpcaoResposta
    : "Vazio";

  return (
    <div
      className="celula-colorida"
      style={{
        backgroundColor: corFundo,
        color: corTexto,
      }}
      title={opcaoSelecionada?.legenda ?? ""}
    >
      {texto}
    </div>
  );
};

export default CelulaColorida;
