import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Listar_Duvida.css';

interface DuvidaItemProps {
  id: number;
  duvida: string;
  resposta: string;
}
const getUsuarioFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    return JSON.parse(atob(payloadBase64)) as { id: number; tipo_usuario: string };
  } catch {
    return null;
  }
};

const OrcamentoItem: React.FC<DuvidaItemProps> = ({ id, duvida, resposta }) => {
  const navigate = useNavigate();

  const usuarioLogado = getUsuarioFromToken();
  const isGerente = usuarioLogado?.tipo_usuario === 'gerente';




  const handleEditar = () => {
    navigate(`/duvidas/editar/${id}`);
  };

  return (
    <div className="orcamento-item-card">
      <div className="orcamento-item-info">
        <h3>{duvida}</h3>
        <p>{resposta}</p>
      </div>
      {isGerente &&
        <div className="orcamento-item-actions">
          <button onClick={handleEditar} className="action-button edit-button">Editar</button>
        </div>}

    </div>
  );
};

export default OrcamentoItem;