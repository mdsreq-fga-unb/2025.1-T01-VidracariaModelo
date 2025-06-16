import LocalizacaoMapa from "../components/LocalizacaoMapa";
import Servicos from "../components/Servicos";
import "./Home.css"

const Home = () => {
  return (
    <div className="home-container">
      <div className="carrossel-section">
      </div>

      <div className="mapa-section">
        <h1>Página Inicial</h1>
        <LocalizacaoMapa />
        <Servicos />
      </div>
    </div>
  );
};

export default Home;