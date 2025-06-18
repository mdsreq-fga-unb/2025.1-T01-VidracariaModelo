import Cabecalho from "../components/Cabecalho";
import LocalizacaoMapa from "../components/LocalizacaoMapa";
import Rodape from "../components/Rodape";
import Servicos from "../components/Servicos";
import "./Home.css"

const Home = () => {
  return (
    <div className="home-container">
      <Cabecalho/>
      <div className="carrossel-section">
      </div>

      <div className="mapa-section">
        <h1>Página Inicial</h1>
        <LocalizacaoMapa />
        <Servicos />
      </div>
        <Rodape/>
    </div>
  );
};

export default Home;