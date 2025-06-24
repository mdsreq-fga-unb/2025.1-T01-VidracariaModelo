import React from 'react';
import './Botao_Arredondado.css';

interface ActionButtonProps {
  text: string;
  onClick?: () => void; 
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    
    <button className="action-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default ActionButton;