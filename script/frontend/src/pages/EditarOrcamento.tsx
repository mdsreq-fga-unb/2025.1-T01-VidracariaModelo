import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import './EditarOrcamento.css';

// Interfaces
interface Produto {
  id: number;
  nome: string;
  valor_m2: string;
}

interface ItemOrcamento {
  id?: number;
  id_produto: number;
  produto_nome?: string;
  largura: string;
  altura: string;
  quantidade: number;
  observacoes: string;
  valor_item_calculado?: string;
}

interface OrcamentoEditavel {
  id: number;
  cpf_cliente: string;
  cliente_nome: string;
  cliente_email: string;
  status: string;
  observacoes: string;
  valor_ofertado: string | null;
  itens: ItemOrcamento[];
}

const EditarOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState<OrcamentoEditavel | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const [resOrcamento, resProdutos] = await Promise.all([
          fetch(`http://localhost:3000/orcamento/${id}`),
          fetch('http://localhost:3000/produtos')
        ]);

        if (!resOrcamento.ok) throw new Error('Falha ao carregar o orçamento.');
        if (!resProdutos.ok) throw new Error('Falha ao carregar a lista de produtos.');

        const dataOrcamento = await resOrcamento.json();
        const dataProdutos = await resProdutos.json();

        setOrcamento(dataOrcamento);
        setProdutos(dataProdutos);
      } catch (err: any) {
        setErro(err.message);
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (orcamento) {
      setOrcamento({ ...orcamento, [name]: value });
    }
  };

  const handleItemChange = (index: number, field: keyof ItemOrcamento, value: any) => {
    if (orcamento) {
      const novosItens = [...orcamento.itens];
      (novosItens[index] as any)[field] = value;
      setOrcamento({ ...orcamento, itens: novosItens });
    }
  };

  const handleAddItem = () => {
    if (orcamento) {
      const novoItem: ItemOrcamento = {
        id_produto: 0,
        largura: '0',
        altura: '0',
        quantidade: 1,
        observacoes: ''
      };
      setOrcamento({ ...orcamento, itens: [...orcamento.itens, novoItem] });
    }
  };

  const handleRemoveItem = (index: number) => {
    if (orcamento) {
      const novosItens = orcamento.itens.filter((_, i) => i !== index);
      setOrcamento({ ...orcamento, itens: novosItens });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orcamento) return;

    const payload = {
      status: orcamento.status,
      observacoes: orcamento.observacoes,
      valor_ofertado: orcamento.valor_ofertado,
      itens: orcamento.itens.map(item => ({
        id_produto: item.id_produto,
        largura: item.largura,
        altura: item.altura,
        quantidade: item.quantidade,
        observacoes: item.observacoes
      }))
    };

    try {
      const res = await fetch(`http://localhost:3000/orcamento/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData.error || 'Erro ao atualizar o orçamento.');
      }

      alert(`Orçamento #${id} atualizado com sucesso!`);
      navigate('/orcamentos');
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  if (carregando) return <Container><p>Carregando...</p></Container>;
  if (erro) return <Container><p>{erro}</p></Container>;
  if (!orcamento) return <Container><p>Orçamento não encontrado.</p></Container>;

  return (
    <div className="w-100 min-vh-100 d-flex justify-content-center align-items-start bg-light py-5">
      <Container className="bg-white text-dark rounded shadow p-4" style={{ maxWidth: '900px', width: '100%' }}>
        <h1 className="mb-3">Editar Orçamento #{orcamento.id}</h1>
        <p className="text-muted mb-4">Cliente: {orcamento.cliente_nome} ({orcamento.cpf_cliente})</p>

        <Form onSubmit={handleSubmit}>
          {/* Seus campos do formulário (mesmos que já estão) */}

          <Form.Group className="mb-3">
            <Form.Label>Valor Ofertado (R$)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="valor_ofertado"
              value={orcamento.valor_ofertado || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={orcamento.status} onChange={handleChange}>
              <option value="Aguardando aprovação">Aguardando aprovação</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Negado">Negado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Observações Gerais</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observacoes"
              value={orcamento.observacoes}
              onChange={handleChange}
            />
          </Form.Group>

          <h4 className="mb-3">Itens do Orçamento</h4>
          {orcamento.itens.map((item, index) => (
            <div key={index} className="mb-4 p-3 border rounded bg-light-subtle">
              <Row className="align-items-center mb-2">
                <Col><strong>Item {index + 1}</strong></Col>
                <Col className="text-end">
                  <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)}>Remover</Button>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Produto</Form.Label>
                    <Form.Select
                      value={item.id_produto}
                      onChange={(e) => handleItemChange(index, 'id_produto', parseInt(e.target.value))}
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Largura (m)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={item.largura}
                      onChange={(e) => handleItemChange(index, 'largura', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Altura (m)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={item.altura}
                      onChange={(e) => handleItemChange(index, 'altura', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.quantidade}
                      onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Observações do Item</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={item.observacoes}
                  onChange={(e) => handleItemChange(index, 'observacoes', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}

          <Button variant="secondary" type="button" onClick={handleAddItem} className="mb-4">
            + Adicionar Novo Item
          </Button>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" type="button" onClick={() => navigate('/orcamentos')}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Alterações
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default EditarOrcamento;
