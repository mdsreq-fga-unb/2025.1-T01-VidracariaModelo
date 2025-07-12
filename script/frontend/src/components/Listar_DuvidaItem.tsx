import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Listar_Duvida.css';

interface DuvidaItemProps {
  id: number;
  duvida: string;
  resposta: string;
}

const OrcamentoItem: React.FC<DuvidaItemProps> = ({ id, duvida, resposta }) => {
  const navigate = useNavigate();

  const handleEditar = () => {
    navigate(`/duvidas/editar/${id}`);
  };

  return (
    <div className="orcamento-item-card">
      <div className="orcamento-item-info">
        <h3>{duvida}</h3>
        <p>{resposta}</p>
      </div>
      <div className="orcamento-item-actions">
        <button onClick={handleEditar} className="action-button edit-button">Editar</button>
      </div>
    </div>
  );
};

export default OrcamentoItem;