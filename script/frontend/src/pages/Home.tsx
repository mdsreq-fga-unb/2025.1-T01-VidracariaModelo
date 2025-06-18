import LocalizacaoMapa from "../components/LocalizacaoMapa";
import Servicos from "../components/Servicos";
import Carrossel from '../components/carrossel';
import "./Home.css"

const Home = () => {

  const carrosselImgs = [
    new URL("../assets/carrossel/Carro.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Box.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Churrasqueira.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Escada.jpg", import.meta.url).href,
];


  return (
    <div className="home-container">
      <div className="carrossel-section">
        <div className="quadrado-descricao">
          


        </div>
        <div className="carrosel">
          <Carrossel 
          images={carrosselImgs}
          altText="Produtos em destaque"/>
        </div>
        
      </div>

      <div className="mapa-section">
        <LocalizacaoMapa />
      </div>
      <div className="servicos-section">
        <Servicos />
      </div>
    </div>
  );
};

export default Home;