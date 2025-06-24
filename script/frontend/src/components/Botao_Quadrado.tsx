import React, { useState, type CSSProperties } from 'react';

interface ActionButtonProps {
  text: string;
  onClick?: () => void; 
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  // Hook de estado para controlar se o mouse está sobre o botão.
  const [isHovered, setIsHovered] = useState(false);

  // Estilos base do botão
  const buttonStyle: CSSProperties = {
    backgroundColor: '#FF7514', 
    color: '#FFFFFF',           
    fontWeight: 'bold',
    fontSize: '20px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid black',
    borderRadius: '20px',       
    padding: '20px 50px',      
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Sombra 
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Transição 
    outline: 'none',
  };

  // Estilos aplicados quando o mouse está sobre o botão
  const hoverStyle: CSSProperties = {
    backgroundColor: '#E57D00', 
    transform: 'scale(1.03)',   
  };

  const combinedStyle = isHovered ? { ...buttonStyle, ...hoverStyle } : buttonStyle;

  return (
    <button
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} 
    >
      {text}
    </button>
  );
};

export default ActionButton;