import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrcamentoItem.css';

interface OrcamentoItemProps {
  id: number;
  titulo: string;
  subtitulo: string;
}

const OrcamentoItem: React.FC<OrcamentoItemProps> = ({ id, titulo, subtitulo }) => {
  const navigate = useNavigate();

  const handleDetalhes = () => {
    navigate(`/orcamentos/detalhes/${id}`);
  };

  const handleEditar = () => {
    navigate(`/orcamentos/editar/${id}`);
  };

  return (
    <div className="orcamento-item-card">
      <div className="orcamento-item-info">
        <h3>{titulo}</h3>
        <p>{subtitulo}</p>
      </div>
      <div className="orcamento-item-actions">
        <button onClick={handleDetalhes} className="action-button details-button">Ver Detalhes</button>
        <button onClick={handleEditar} className="action-button edit-button">Editar</button>
      </div>
    </div>
  );
};

export default OrcamentoItem;