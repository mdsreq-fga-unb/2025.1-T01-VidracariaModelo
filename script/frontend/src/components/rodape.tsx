import React from 'react';
import { useNavigate } from 'react-router-dom';
import './rodape.css';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import characterImage from '../assets/Boneco.png';
import ActionButton from './Botao_Arredondado';

interface FooterProps {
  showDialog?: boolean;
  showSocialIcons?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showDialog = true, showSocialIcons = true }) => {
  const navigate = useNavigate();
  const handleOrcamentoClick = () => {
    navigate('/solicita-orcamento');
  };

  return (
    // 2. Use 'className' para aplicar cada estilo importado
    <footer className="footerContainer">
      <div className="redStripe" />

      <img src={characterImage} alt="Personagem assistente" className="characterImage" />

      {showDialog && (
        <div className="dialogContainer">
          <div className="thinkingDots">
            {/* Os spans não precisam de classe, pois são estilizados pelo pai */}
            <span />
            <span />
            <span />
          </div>
          <ActionButton
            text="Solicite um orçamento agora!"
            onClick={handleOrcamentoClick}
          />
        </div>
      )}

      {showSocialIcons && (
        <div className="socialIconsContainer">
          <a href="https://wa.me/5561995891507" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <div className="whatsappIcon">
              <FaWhatsapp />
            </div>
          </a>
          <a href="https://www.instagram.com/vidracariamodelo7/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <div className="instagramIcon">
              <FaInstagram />
            </div>
          </a>
        </div>
      )}
    </footer>
  );
};

export default Footer;