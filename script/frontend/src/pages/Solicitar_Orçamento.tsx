import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Solicitar_Orçamento.css'; // Você pode adicionar os novos estilos aqui

// Interface para os produtos buscados da API
interface Produto {
  id: number;
  nome: string;
}

// Interface para um item na nossa lista de orçamento
interface ItemOrcamento {
  id_produto: number;
  nome_produto: string; // Guardamos o nome para exibir na lista
  largura: number;
  altura: number;
  quantidade: number;
}

const SolicitarOrcamento: React.FC = () => {
  const navigate = useNavigate();

  // --- ESTADOS DO COMPONENTE ---

  // 1. Estados para os dados principais da solicitação
  const [cpf, setCpf] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');

  // 2. Estado para a lista de itens que o usuário adiciona
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  
  // 3. Estado para controlar os campos do item que está sendo adicionado no momento
  const [itemAtual, setItemAtual] = useState({
    id_produto: '',
    largura: '',
    altura: '',
    quantidade: 1,
  });

  // 4. Estado para a lista de produtos que vem da API
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  // Busca os produtos da API quando o componente é montado
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const res = await fetch('http://localhost:3000/produtos');
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        alert('Não foi possível carregar a lista de produtos.');
      } finally {
        setCarregandoProdutos(false);
      }
    };
    buscarProdutos();
  }, []);

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // Manipula mudanças nos campos do item que está sendo criado
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valorFinal = value === '' ? '' : Number(value);
    setItemAtual(prev => ({ ...prev, [name]: valorFinal }));
  };
  
  // Adiciona o item atual à lista de orçamento
  const handleAddItem = () => {
    // Validação
    if (!itemAtual.id_produto || !itemAtual.largura || !itemAtual.altura) {
      alert('Por favor, selecione um produto e preencha a largura e altura.');
      return;
    }

    const produtoSelecionado = produtos.find(p => p.id === parseInt(itemAtual.id_produto));
    if (!produtoSelecionado) return;

    const novoItem: ItemOrcamento = {
      id_produto: parseInt(itemAtual.id_produto),
      nome_produto: produtoSelecionado.nome,
      largura: parseFloat(itemAtual.largura),
      altura: parseFloat(itemAtual.altura),
      quantidade: parseInt(String(itemAtual.quantidade), 10),
    };

    setItens(prevItens => [...prevItens, novoItem]);

    // Limpa os campos para o próximo item
    setItemAtual({
      id_produto: '',
      largura: '',
      altura: '',
      quantidade: 1,
    });
  };

  // Remove um item da lista
  const handleRemoveItem = (indexToRemove: number) => {
    setItens(prevItens => prevItens.filter((_, index) => index !== indexToRemove));
  };
  
  // Envia a solicitação completa para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf || itens.length === 0) {
      alert('CPF do cliente e ao menos um item são obrigatórios.');
      return;
    }

    // Prepara o corpo da requisição exatamente como o backend espera
    const payload = {
      cpf_cliente: cpf,
      observacoes: observacoesGerais,
      itens: itens.map(({ nome_produto, ...item }) => item), // Remove 'nome_produto' antes de enviar
    };

    try {
      const res = await fetch('http://localhost:3000/solicitacao_orcamento_routes', { // <-- AJUSTE A ROTA AQUI
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData.error || 'Erro no servidor');
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
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
            </div>
          </div>
          
          {/* --- FORMULÁRIO PARA ADICIONAR UM ITEM --- */}
<div className="form-section item-adder">
            <h3>Adicionar Item ao Orçamento</h3>

            {/* O 'form-group' agora serve para agrupar label e input verticalmente */}
            <div className="form-group">
              <label htmlFor="id_produto">Produto</label>
              <select 
                name="id_produto" 
                value={itemAtual.id_produto} 
                onChange={handleItemChange} 
                disabled={carregandoProdutos}
                className="form-input" // <-- APLIQUE A CLASSE AQUI
              >
                <option value="" disabled>{carregandoProdutos ? 'Carregando...' : 'Selecione'}</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>

            <div className="form-group-medidas">
              <div className="form-group">
                <label htmlFor="largura">Largura (cm)</label>
                <input 
                  type="number" 
                  name="largura" 
                  value={itemAtual.largura} 
                  onChange={handleItemChange} 
                  className="form-input" // <-- APLIQUE A CLASSE AQUI
                />
              </div>
              <div className="form-group">
                <label htmlFor="altura">Altura (cm)</label>
                <input 
                  type="number" 
                  name="altura" 
                  value={itemAtual.altura} 
                  onChange={handleItemChange} 
                  className="form-input" // <-- APLIQUE A CLASSE AQUI
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input 
                  type="number" 
                  name="quantidade" 
                  value={itemAtual.quantidade} 
                  onChange={handleItemChange} 
                  min="1" 
                  className="form-input" // <-- APLIQUE A CLASSE AQUI
                />
              </div>
            </div>
            <button type="button" onClick={handleAddItem} className="add-item-button">Adicionar Item</button>
          </div>

          {/* --- LISTA DE ITENS ADICIONADOS --- */}
          {itens.length > 0 && (
            <div className="form-section items-list">
              <h3>Itens do Orçamento</h3>
              <ul>
                {itens.map((item, index) => (
                  <li key={index}>
                    <span>{item.quantidade}x {item.nome_produto} ({item.largura}cm x {item.altura}cm)</span>
                    <button type="button" onClick={() => handleRemoveItem(index)} className="remove-item-button">Remover</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- OBSERVAÇÕES E BOTÃO FINAL --- */}
          <div className="form-section">
             <div className="form-group">
                <label htmlFor="observacoesGerais">Observações Gerais</label>
                <textarea id="observacoesGerais" value={observacoesGerais} onChange={(e) => setObservacoesGerais(e.target.value)} />
             </div>
             <div className="form-actions">
                <button type="submit" className="submit-button" disabled={itens.length === 0}>Enviar Solicitação Completa</button>
             </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SolicitarOrcamento;