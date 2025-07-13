import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Solicitar_Orçamento.css';


const SolicitarOrcamento: React.FC = () => {
  const navigate = useNavigate();

  // --- ESTADOS DO COMPONENTE ---

  // 1. Estados para os dados principais da solicitação
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [aceitaEmail, setAceitaEmail] = useState(false);
  const API_URL = import.meta.env.VITE_URL_BASE;







  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // Manipula mudanças nos campos do item que está sendo criado

  const buscarCliente = async (CPF: string) => {
    try {
      const res = await fetch(`${API_URL}/clientes/${CPF}`);

      if (!res.ok) {
        // Se o status não for 200, por exemplo 404 ou 500
        console.log("Erro na requisição:", res.status);
        return null;
      }

      const data = await res.json();
      const estaVazio = Object.keys(data).length === 0;
      if (estaVazio) {
        console.log("Cliente não encontrado.");
        return null;
      }
      console.log("Cliente encontrado:", data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return null;
    }
  };



  // Envia a solicitação completa para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf || !nome || !email) {
      alert('CPF, Nome, Email e ao menos um item são obrigatórios.');
      return;
    }

    if (!aceitaEmail) {
      alert('Você precisa concordar em receber o orçamento por e-mail para continuar.');
      return;
    }

    try {
      // 1. Verifica se o cliente existe
      const clienteExistente = await buscarCliente(cpf);

      // 2. Se não existir, cria um novo cliente
      if (!clienteExistente) {
        console.log("Cliente não encontrado, criando um novo...");
        const novoClientePayload = {
          cpf,
          nome,
          email,
          endereco: endereco || null, // Envia nulo se o endereço estiver vazio
        };

        const resCliente = await fetch(`${API_URL}/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoClientePayload),
        });

        if (!resCliente.ok) {
          const erroData = await resCliente.json();
          throw new Error(erroData.error || 'Falha ao criar novo cliente.');
        }
        console.log("Novo cliente criado com sucesso.");
      }

      // 3. Prepara e envia a solicitação de orçamento
      const orcamentoPayload = {
        cpf_cliente: cpf,
        observacoes: observacoesGerais,
        itens: [], // Remove 'nome_produto' antes de enviar
      };

      const resOrcamento = await fetch(`${API_URL}/orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orcamentoPayload),
      });

      if (!resOrcamento.ok) {
        const erroData = await resOrcamento.json();
        throw new Error(erroData.error || 'Erro no servidor ao criar orçamento');
      }

      alert('Solicitação de orçamento criada com sucesso!');
      navigate('/'); // ou para uma página de sucesso
    } catch (err: any) {
      console.error('Erro ao enviar solicitação:', err);
      alert(`Erro: ${err.message}`);
    }
  };


  return (
    <div className="page-container">
      <main className="edit-main-content">
        <h1 className="page-title">Solicitação de Orçamento</h1>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* --- DADOS GERAIS DA SOLICITAÇÃO --- */}
          <div className="form-section">
            <h3>Seus Dados</h3>
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" className="form-input" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="endereco">Endereço (Opcional)</label>
              <input type="text" id="endereco" name="endereco" className="form-input" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="observacoesGerais">Observações Gerais</label>
              <textarea id="observacoesGerais" name="observacoesGerais" className="form-input" value={observacoesGerais} onChange={(e) => setObservacoesGerais(e.target.value)} />
            </div>
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="aceitaEmail"
                checked={aceitaEmail}
                onChange={(e) => setAceitaEmail(e.target.checked)}
              />
              <label htmlFor="aceitaEmail">
                Desejo receber o orçamento por e-mail.
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={!aceitaEmail}
              >
                Enviar Solicitação
              </button>
            </div>
          </div>




        </form>
      </main>
    </div>
  );
};

export default SolicitarOrcamento;