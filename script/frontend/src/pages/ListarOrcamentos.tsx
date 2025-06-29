import React from 'react';
import OrcamentoItem from '../components/OrcamentoItem';
import './ListarOrcamentos.css';

// Dados de exemplo. No futuro, isso virá de uma API.
const orcamentosExemplo = [
  { id: 1, titulo: 'Fechamento de pia - Júlia Silva', subtitulo: 'Instalação de vidro temperado' },
  { id: 2, titulo: 'Janela de vidro temperado - André Santos', subtitulo: 'Orçamento para 2 janelas' },
  { id: 3, titulo: 'Fechamento de Varanda - Claudio Ferreira', subtitulo: 'Sistema Reiki' },
  // ... outros orçamentos
];

const ListarOrcamentos: React.FC = () => {
  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Lista de orçamentos solicitados</h1>
        <div className="orcamentos-list">
          {orcamentosExemplo.map(orcamento => (
            <OrcamentoItem
              key={orcamento.id}
              id={orcamento.id}
              titulo={orcamento.titulo}
              subtitulo={orcamento.subtitulo}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ListarOrcamentos;