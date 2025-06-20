import { useRef } from 'react';
import LocalizacaoMapa from "../components/LocalizacaoMapa";
import Servicos from "../components/Servicos";
import Carrossel from '../components/carrossel';
import Botao_arredondado from "../components/Botao_Arredondado";
import Botao_quadrado from "../components/Botao_Quadrado";
import "./Home.css"

const Home = () => {

  const carrosselImgs = [
    new URL("../assets/carrossel/Carro.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Box.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Churrasqueira.jpg", import.meta.url).href,
    new URL("../assets/carrossel/Escada.jpg", import.meta.url).href,
];

  const localizacaoRef = useRef<HTMLDivElement>(null);
  const handleLocalizacaoClick = () => {
    if (localizacaoRef.current) {
      localizacaoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const servicosRef = useRef<HTMLDivElement>(null);
  const handleServicosClick = () => {
    if (servicosRef.current) {
      servicosRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }; 

  /*const contatosRef = useRef<HTMLDivElement>(null);
  const handleContatosClick = () => {
    if (contatosRef.current) {
      contatosRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };*/ 

  return (
    <div className="home-container">
      <div className="carrossel-section">
        <div className="info-carrossel-section">
            <div className="quadrado-descricao">
              <h1>Vidraçaria Modelo</h1>
    
              <p>A Vidraçaria Modelo é uma empresa do setor de construção civil especializada em instalação e manutenção de vidros comuns e temperados  com mais de 15 anos de história no mercado. Prestamos serviços para pessoas jurídicas e pessoas físicas.
              </p>
            </div>
            <div className="botao-orcamento-carrossel">
              <Botao_arredondado 
                text = "Solicite um Orçamento!"/>
            </div>
        </div>
          <div className="carrosel">
            <Carrossel 
            images={carrosselImgs}
            altText="Produtos em destaque"/>
          </div>
          
      </div>
      <div className="botoes-section">
        <Botao_quadrado 
          text = "Localização"
          onClick={handleLocalizacaoClick}
          />
        <Botao_quadrado 
          text = "Serviços"
          onClick={handleServicosClick}
          />
        <Botao_quadrado 
          text = "Contato"/>    

      </div>
      <section ref={localizacaoRef}>
        <div className="mapa-section">
          <LocalizacaoMapa />
        </div>
      </section>
      <section ref={servicosRef}>
        <div className="servicos-section">
          <Servicos />
        </div>
      </section>
    </div>
  );
};

export default Home;