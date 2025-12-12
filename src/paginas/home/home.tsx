import Cabecalho from "../../componentes/sondagem/cabecalho/cabecalho";
import Conteudo from "../../componentes/sondagem/conteudo/conteudo";
import Rodape from "../../componentes/sondagem/rodape/rodape";

const Home: React.FC = () => (
  <div className="app-container">
    <Cabecalho />
    <Conteudo />
    <Rodape />
  </div>
);

export default Home