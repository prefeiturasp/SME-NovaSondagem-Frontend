import PropTypes from "prop-types";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Alert from "~/componentes/libs/alert/alert";
import { ehTurmaInfantil } from "~/servicos/validacoes/validacoesInfatil";

const AlertaModalidadeInfantil = (props) => {
  const usuario = useSelector((store) => store.usuario);
  const turmaSelecionada = usuario?.turmaSelecionada;

  const filtro = useSelector((store) => store.filtro);
  const modalidadesFiltroPrincipal = useMemo(
    () => filtro?.modalidades || [],
    [filtro?.modalidades]
  );

  const { exibir, validarModalidadeFiltroPrincipal, naoPermiteTurmaInfantil } =
    props;

  const [exibirMsg, setExibirMsg] = useState(exibir);

  useEffect(() => {
    if (validarModalidadeFiltroPrincipal) {
      const turmaInfantil = ehTurmaInfantil(
        modalidadesFiltroPrincipal,
        turmaSelecionada
      );
      if (naoPermiteTurmaInfantil) {
        setExibirMsg(turmaInfantil);
      } else {
        setExibirMsg(!turmaInfantil);
      }
    } else {
      setExibirMsg(exibir);
    }
  }, [
    turmaSelecionada,
    exibir,
    validarModalidadeFiltroPrincipal,
    modalidadesFiltroPrincipal,
    naoPermiteTurmaInfantil,
  ]);

  return exibirMsg ? (
    <Alert
      alerta={{
        tipo: "warning",
        id: "alerta-modalidade-infantil",
        mensagem: `Esta interface ${
          naoPermiteTurmaInfantil
            ? "não está disponível"
            : "só pode ser utilizada"
        } para turmas da educação infantil`,
      }}
    />
  ) : (
    <></>
  );
};

AlertaModalidadeInfantil.propTypes = {
  exibir: PropTypes.bool,
  validarModalidadeFiltroPrincipal: PropTypes.bool,
  naoPermiteTurmaInfantil: PropTypes.bool,
};

AlertaModalidadeInfantil.defaultProps = {
  exibir: false,
  validarModalidadeFiltroPrincipal: true,
  naoPermiteTurmaInfantil: true,
};

export default AlertaModalidadeInfantil;
