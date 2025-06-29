import React from 'react';
// 1. IMPORTAR o useNavigate
import { useParams, useNavigate } from 'react-router-dom';
import './DetalhesOrcamento.css';

const formatStatusClass = (status: string) => {
  return status.toLowerCase().replace(/ /g, '-');
};

const DetalhesOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // 2. INICIALIZAR o useNavigate
  const navigate = useNavigate();

  const orcamento = {
    id: id,
    nomeCompleto: 'Júlia Silva',
    servicoSolicitado: 'Fechamento de pia',
    email: 'julia.silva@email.com',
    whatsapp: '(99) 99999-8888',
    medidas: '1.50m x 0.60m',
    observacoes: 'Vidro temperado de 8mm, incolor.',
    status: 'Aprovado',
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Detalhes do orçamento</h1>

        <div className="details-content-box">
          {/* ... todo o conteúdo da caixa de detalhes ... */}
          <div className="details-internal-header">
            <div className="placeholder-icon-container">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.25 4.75H2.75C2.58424 4.75 2.42527 4.68415 2.30806 4.56694C2.19085 4.44973 2.125 4.29076 2.125 4.125V2.875C2.125 2.70924 2.19085 2.55027 2.30806 2.43306C2.42527 2.31585 2.58424 2.25 2.75 2.25H21.25C21.4158 2.25 21.5747 2.31585 21.6919 2.43306C21.8092 2.55027 21.875 2.70924 21.875 2.875V4.125C21.875 4.29076 21.8092 4.44973 21.6919 4.56694C21.5747 4.68415 21.4158 4.75 21.25 4.75ZM5.75 12.75H4.25C4.08424 12.75 3.92527 12.6842 3.80806 12.5669C3.69085 12.4497 3.625 12.2908 3.625 12.125V6.875C3.625 6.70924 3.69085 6.55027 3.80806 6.43306C3.92527 6.31585 4.08424 6.25 4.25 6.25H5.75C5.91576 6.25 6.07473 6.31585 6.19194 6.43306C6.30915 6.55027 6.375 6.70924 6.375 6.875V12.125C6.375 12.2908 6.30915 12.4497 6.19194 12.5669C6.07473 12.6842 5.91576 12.75 5.75 12.75ZM21.25 21.75H2.75C2.58424 21.75 2.42527 21.6842 2.30806 21.5669C2.19085 21.4497 2.125 21.2908 2.125 21.125V19.875C2.125 19.7092 2.19085 19.5503 2.30806 19.4331C2.42527 19.3158 2.58424 19.25 2.75 19.25H21.25C21.4158 19.25 21.5747 19.3158 21.6919 19.4331C21.8092 19.5503 21.875 19.7092 21.875 19.875V21.125C21.875 21.2908 21.8092 21.4497 21.6919 21.5669C21.5747 21.6842 21.4158 21.75 21.25 21.75ZM15.625 16.625H10.375C10.2092 16.625 10.0503 16.5592 9.93306 16.4419C9.81585 16.3247 9.75 16.1658 9.75 16V8C9.75 7.83424 9.81585 7.67527 9.93306 7.55806C10.0503 7.44085 10.2092 7.375 10.375 7.375H15.625C15.7908 7.375 15.9497 7.44085 16.0669 7.55806C16.1842 7.67527 16.25 7.83424 16.25 8V16C16.25 16.1658 16.1842 16.3247 16.0669 16.4419C15.9497 16.5592 15.7908 16.625 15.625 16.625Z" fill="#B0B0B0"/>
              </svg>
            </div>
            <div className="details-header-text">
              <h2>{orcamento.servicoSolicitado} - {orcamento.nomeCompleto}</h2>
              <p>Orçamento para {orcamento.servicoSolicitado.toLowerCase()}.</p>
            </div>
          </div>
          <div className="details-body-info">
            <p><span className="label">Nome Completo:</span> {orcamento.nomeCompleto}</p>
            <p><span className="label">Serviço Solicitado:</span> {orcamento.servicoSolicitado}</p>
            <p><span className="label">E-mail:</span> {orcamento.email}</p>
            <p><span className="label">Whatsapp:</span> {orcamento.whatsapp}</p>
            <p><span className="label">Medidas:</span> {orcamento.medidas}</p>
            <p><span className="label">Observações:</span> {orcamento.observacoes}</p>
            <p>
              <span className="label">Status do orçamento:</span>
              <span className={`status-badge ${formatStatusClass(orcamento.status)}`}>
                {orcamento.status}
              </span>
            </p>
          </div>
        </div>

        {/* 3. ADICIONAR O BOTÃO DE VOLTAR AQUI */}
        <button
          onClick={() => navigate('/orcamentos')}
          className="back-to-list-button"
        >
          Voltar
        </button>
        
      </main>
    </div>
  );
};

export default DetalhesOrcamento;