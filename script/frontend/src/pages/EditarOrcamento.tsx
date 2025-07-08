import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarOrcamento.css';

const EditarOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Agora o estado inicial inclui o 'status'
  const [formData, setFormData] = useState({
    nomeCompleto: 'Júlia Silva',
    servicoSolicitado: 'Fechamento de pia',
    email: 'julia.silva@email.com',
    whatsapp: '(99) 99999-8888',
    observacoes: '',
    dataDeExpiracao: '2025-07-15',
    status: 'Aguardando aprovação', // Adicionar 'status' ao estado inicial
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados atualizados:', formData);
    alert(`Orçamento ${id} atualizado com sucesso!`);
    navigate('/orcamentos');
  };

  return (
    <div className="page-container">
      <main className="edit-main-content">
        <h1 className="page-title">Editar informações de orçamento</h1>
        <p className="page-subtitle">Fechamento de pia - Júlia Silva</p>
        <form onSubmit={handleSubmit} className="edit-form">
          {/* ... outros campos do formulário ... */}
          <div className="form-group">
            <label htmlFor="nomeCompleto">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="servicoSolicitado">Serviço Solicitado</label>
            <input
              type="text"
              id="servicoSolicitado"
              name="servicoSolicitado"
              value={formData.servicoSolicitado}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows={4}
              value={formData.observacoes}
              onChange={handleChange}
            ></textarea>
          </div>
           <div className="form-group">
            <label htmlFor="dataDeExpiracao">Data de Expiração</label>
            <input
              type="date"
              id="dataDeExpiracao"
              name="dataDeExpiracao"
              value={formData.dataDeExpiracao}
              onChange={handleChange}
            />
          </div>

          {/* NOVO CAMPO DE STATUS */}
          <div className="form-group">
            <label htmlFor="status">Status do Orçamento</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Aguardando aprovação">Aguardando aprovação</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Negado">Negado</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/orcamentos')} className="cancel-button">Cancelar</button>
            <button type="submit" className="submit-button">Confirmar Alterações</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditarOrcamento;