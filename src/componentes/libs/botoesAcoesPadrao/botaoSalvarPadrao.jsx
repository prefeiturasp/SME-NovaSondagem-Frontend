import PropTypes from "prop-types";
import Button from "~/componentes/libs/button/button";
import { Colors } from "~/componentes/libs/colors/colors";
import { SGP_BUTTON_SALVAR } from "../../../constantes/ids/buttons";

const BotaoSalvarPadrao = (props) => {
  const { onClick, disabled } = props;

  return (
    <Button
      id={SGP_BUTTON_SALVAR}
      label="Salvar"
      color={Colors.Roxo}
      onClick={onClick}
      disabled={disabled}
      border
      bold
    />
  );
};

BotaoSalvarPadrao.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

BotaoSalvarPadrao.defaultProps = {
  onClick: () => {},
  disabled: false,
};

export default BotaoSalvarPadrao;
