
import { useNavigate } from 'react-router-dom';
import './SolicitaOrcamento.css'; // 1. Importar o novo arquivo CSS
import Footer from '../components/rodape';

const SolicitaOrcamento = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <main className="main-content">
        <button onClick={() => navigate('/')} className="back-button">
          ← Voltar para Home
        </button>
        <h1 className="page-title">Solicitar Orçamento</h1>
        <p style={{ color: 'white' }}>Esta é a página para solicitar um novo orçamento.</p>
        {/* Aqui você pode começar a construir seu formulário e outros elementos */}
      </main>
      <Footer showDialog={false} showSocialIcons={false} />
    </div>
  );
};

export default SolicitaOrcamento;