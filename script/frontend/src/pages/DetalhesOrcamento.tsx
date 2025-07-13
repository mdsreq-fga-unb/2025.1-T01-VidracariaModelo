import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalhesOrcamento.css';

// Interfaces
interface ItemOrcamento {
  id: number;
  id_solicitacao: number;
  id_produto: number;
  largura: string;
  altura: string;
  quantidade: number;
  observacoes: string;
  produto_nome: string;
  valor_m2: string;
  valor_item_calculado: string;
}

interface OrcamentoDetalhado {
  id: number;
  cpf_cliente: string;
  data_solicitacao: string;
  status: string;
  observacoes: string;
  valor_ofertado: string | null;
  cliente_nome: string;
  cliente_email: string;
  cliente_endereco: string;
  itens: ItemOrcamento[];
  valor_total_calculado: string;
}

// Função utilitária para formatar a classe CSS do status
const formatStatusClass = (status: string) => {
  if (status.toLowerCase() === 'aprovado') {
    return 'aprovado'; // Classe para cor verde
  }
  return 'negado'; // Classe para cor vermelha para todos os outros status
};

// Componente para mostrar cada item do orçamento na tabela
const ItemOrcamentoRow: React.FC<{ item: ItemOrcamento }> = ({ item }) => (
  <tr>
    <td>{item.produto_nome}</td>
    <td>{item.largura} x {item.altura} m</td>
    <td>R$ {Number(item.valor_m2).toFixed(2)}</td>
    <td>R$ {Number(item.valor_item_calculado).toFixed(2)}</td>
    <td>{item.observacoes}</td>
  </tr>
);

const DetalhesOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState<OrcamentoDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarOrcamento = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orcamento/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar o orçamento');

        const data: OrcamentoDetalhado = await res.json();
        setOrcamento(data);
      } catch (err) {
        console.error(err);
        setErro('Não foi possível carregar os detalhes do orçamento.');
      } finally {
        setCarregando(false);
      }
    };

    if (id) buscarOrcamento();
  }, [id]);

  if (carregando) return <p className="page-container">Carregando...</p>;
  if (erro || !orcamento) return <p className="page-container">{erro || 'Orçamento não encontrado.'}</p>;

  return (
    <div className="page-container">
      <main className="main-content">

        {/* Título */}
        <h1 className="page-title">Detalhes do orçamento</h1>

        {/* Caixa principal de detalhes */}
        <div className="details-content-box">

          {/* Cabeçalho com ícone e texto */}
          <div className="details-internal-header">
            <div className="placeholder-icon-container">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M21.25 4.75H2.75..." fill="#B0B0B0" />
              </svg>
            </div>
            <div className="details-header-text">
              <h2>Orçamento #{orcamento.id} - {orcamento.cliente_nome}</h2>
              <p>Solicitado em {new Date(orcamento.data_solicitacao).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Informações gerais do orçamento */}
          <div className="details-body-info">
            <p><strong>Nome Completo:</strong> {orcamento.cliente_nome}</p>
            <p><strong>CPF:</strong> {orcamento.cpf_cliente}</p>
            <p><strong>E-mail:</strong> {orcamento.cliente_email}</p>
            <p><strong>Endereço:</strong> {orcamento.cliente_endereco}</p>
            <p><strong>Observações gerais:</strong> {orcamento.observacoes}</p>
            <p>
              <strong>Status do orçamento:</strong>{' '}
              <span className={`status-badge ${formatStatusClass(orcamento.status)}`}>
                {orcamento.status}
              </span>
            </p>

            {/* Itens do orçamento */}
            <h3>Itens do Orçamento</h3>
            {orcamento.itens.length > 0 ? (
              <table className="itens-orcamento-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Medidas</th>
                    <th>Valor m²</th>
                    <th>Total</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamento.itens.map(item => (
                    <ItemOrcamentoRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Sem itens cadastrados para este orçamento.</p>
            )}

            {/* Valor total */}
            <p className="valor-total">
              <strong>Valor total calculado:</strong> R$ {Number(orcamento.valor_total_calculado).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botão voltar */}
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
