import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

type Venda = {
    id: number;
    data_venda: string;
    valor: string;
    forma_pagamento: string;
    cliente_nome: string;
    cliente_cpf: string;
};

type DetalhesVenda = Venda & {
    origem?: string;
    version?: number;
    itens: {
        id: number;
        id_produto: number;
        quantidade: number;
        valor_unitario: number;
        medida: string;
        descricao: string;
        produto_nome: string;
    }[];
    pagamentos: {
        id: number;
        data_pagamento: string;
        valor_pago: number;
        forma_pagamento: string;
        status: string;
    }[];
};

type Produto = {
    id: number;
    nome: string;
    valor_m2: number;
};

const Vendas: React.FC = () => {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [total, setTotal] = useState<string>('0.00');
    const [detalhes, setDetalhes] = useState<DetalhesVenda | null>(null);
    const [showDetalhesModal, setShowDetalhesModal] = useState(false);

    // Modal criar/editar
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const detalhesRef = useRef<HTMLDivElement>(null);
    const { toPDF, targetRef } = usePDF({ filename: `recibo-venda-${detalhes?.id || ''}.pdf` })

    const [formData, setFormData] = useState<{
        id?: number;
        id_orcamento?: number;
        forma_pagamento?: string;
        origem?: string;
        version?: number;
        itens: {
            id_produto?: number;
            quantidade?: number;
            valor_unitario?: number;
            medida?: string;
            descricao?: string;
        }[];
        pagamentos: {
            data_pagamento?: string;
            valor_pago?: number;
            forma_pagamento?: string;
            status?: string;
        }[];
    }>({
        itens: [],
        pagamentos: [],
    });

    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        carregarVendas();
    }, []);

    const carregarVendas = () => {
        fetch('http://localhost:3000/vendas')
            .then(res => res.json())
            .then(data => {
                setVendas(data.vendas);
                setTotal(data.total);
            })
            .catch(err => console.error("Erro ao buscar vendas:", err));
    };

    const carregarProdutos = async () => {
        try {
            const res = await fetch('http://localhost:3000/produtos');
            if (!res.ok) throw new Error("Erro ao carregar produtos");
            const data = await res.json();
            setProdutos(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            alert("Erro ao carregar lista de produtos.");
        }
    };

    const carregarDetalhes = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3000/vendas/detalhes/${id}`);
            if (!res.ok) throw new Error("Erro ao carregar detalhes");
            const data = await res.json();
            setDetalhes(data);
            setShowDetalhesModal(true);
        } catch (err) {
            console.error("Erro ao carregar detalhes da venda:", err);
            alert("Erro ao carregar detalhes da venda.");
        }
    };

    const abrirModalCriarVenda = () => {
        setFormMode('create');
        setFormData({ itens: [], pagamentos: [] });
        carregarProdutos();
        setShowFormModal(true);
    };

    const abrirModalEditarVenda = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3000/vendas/detalhes/${id}`);
            if (!res.ok) throw new Error("Venda não encontrada");
            const venda = await res.json();

            setFormMode('edit');
            setFormData({
                id: venda.id,
                id_orcamento: venda.id_orcamento,
                forma_pagamento: venda.forma_pagamento,
                origem: venda.origem,
                version: venda.version,
                itens: venda.itens.map((item: any) => ({
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    medida: item.medida,
                    descricao: item.descricao,
                })),
                pagamentos: venda.pagamentos.map((pag: any) => ({
                    data_pagamento: pag.data_pagamento.split('T')[0], // só a data para o input
                    valor_pago: pag.valor_pago,
                    forma_pagamento: pag.forma_pagamento,
                    status: pag.status,
                })),
            });

            await carregarProdutos();
            setShowFormModal(true);
        } catch (error) {
            console.error("Erro ao carregar venda para editar", error);
            alert("Erro ao carregar dados da venda para edição.");
        }
    };

    const salvarVenda = async () => {
        if (
            !formData.id_orcamento ||
            !formData.forma_pagamento ||
            !formData.itens ||
            formData.itens.length === 0
        ) {
            alert("Preencha os campos obrigatórios (id_orcamento, forma_pagamento e itens).");
            return;
        }

        if (formMode === 'create') {
            try {
                const res = await fetch('http://localhost:3000/vendas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Erro ao criar venda");
                }
                alert("Venda criada com sucesso");
                setShowFormModal(false);
                carregarVendas();
            } catch (error) {
                console.error(error);
                alert("Erro ao criar venda");
            }
        } else {
            try {
                if (!formData.id) {
                    alert("ID da venda é obrigatório para edição");
                    return;
                }

                const res = await fetch(`http://localhost:3000/vendas/detalhes/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Erro ao atualizar venda");
                }
                alert("Venda atualizada com sucesso");
                setShowFormModal(false);
                carregarVendas();
            } catch (error) {
                console.error(error);
                alert("Erro ao atualizar venda");
            }
        }
    };

    const deletarVenda = async (id: number) => {
        if (window.confirm("Deseja realmente deletar esta venda?")) {
            try {
                const res = await fetch(`http://localhost:3000/vendas/detalhes/${id}`, {
                    method: 'DELETE',
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Erro ao deletar venda");
                }
                carregarVendas();
                alert("Venda deletada com sucesso.");
            } catch (err) {
                console.error("Erro ao deletar venda:", err);
                alert("Erro ao deletar venda.");
            }
        }
    };

    return (
        <>
            <div className="bg-light min-vh-100 py-5">
                <div className="container">
                    <div className="card shadow p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="m-0">Vendas Realizadas</h2>
                            <Button variant="success" onClick={abrirModalCriarVenda}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Nova Venda
                            </Button>
                        </div>

                        <p className="text-end">
                            <strong>Total:</strong> R$ {total}
                        </p>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Valor</th>
                                        <th>Forma de Pagamento</th>
                                        <th>CPF</th>
                                        <th>Cliente</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendas.map(venda => (
                                        <tr key={venda.id}>
                                            <td>{venda.id}</td>
                                            <td>{new Date(venda.data_venda).toLocaleDateString()}</td>
                                            <td>R$ {parseFloat(venda.valor)}</td>
                                            <td>{venda.forma_pagamento}</td>
                                            <td>{venda.cliente_cpf}</td>
                                            <td>{venda.cliente_nome}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => carregarDetalhes(venda.id)}
                                                    >
                                                        Ver Detalhes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        onClick={() => abrirModalEditarVenda(venda.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => deletarVenda(venda.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes */}
            <Modal show={showDetalhesModal} onHide={() => setShowDetalhesModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        <strong>Detalhes da Venda #{detalhes?.id}</strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={targetRef} className="p-3" style={{ fontSize: '12px', maxWidth: '800px', margin: '0 auto' }}>
                        {/* Cabeçalho Compacto */}
                        <div className="text-center mb-3">
                            <h4 style={{ fontSize: '18px', marginBottom: '5px' }}>MARMORARIA LUXO</h4>
                            <p style={{ fontSize: '10px', marginBottom: '5px' }}>CNPJ: 12.345.678/0001-99 • Rua Exemplo, 123 - Centro - São Paulo/SP</p>
                            <h5 style={{ fontSize: '16px', margin: '10px 0', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 0' }}>
                                RECIBO # {detalhes?.id}
                            </h5>
                            <p style={{ fontSize: '10px' }}>
                                {detalhes && new Date(detalhes.data_venda).toLocaleDateString('pt-BR')} • {detalhes?.forma_pagamento}
                            </p>
                        </div>

                        {/* Dados do Cliente */}
                        <div className="text-center mb-3">
                            <p style={{ fontWeight: 'bold', marginBottom: '3px' }}>CLIENTE</p>
                            <p style={{ marginBottom: '3px' }}>{detalhes?.cliente_nome}</p>
                            <p style={{ fontSize: '10px' }}>CPF: {detalhes?.cliente_cpf}</p>
                        </div>

                        {/* Itens da Venda - Tabela Compacta */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #000' }}>
                                    <th style={{ width: '50%', textAlign: 'left', padding: '3px 0', fontSize: '11px' }}>PRODUTO</th>
                                    <th style={{ width: '10%', textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>QTD</th>
                                    <th style={{ width: '20%', textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>UNITÁRIO</th>
                                    <th style={{ width: '20%', textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhes?.itens.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '3px 0', fontSize: '11px' }}>
                                            {item.produto_nome}
                                            {item.descricao && (
                                                <div style={{ fontSize: '9px', color: '#666' }}>{item.descricao}</div>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>
                                            {item.quantidade} {item.medida || 'un'}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>
                                            R$ {item.valor_unitario}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>
                                            R$ {(item.quantidade * item.valor_unitario)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '1px solid #000' }}>
                                    <td colSpan={3} style={{ textAlign: 'right', padding: '5px 0', fontWeight: 'bold', fontSize: '11px' }}>
                                        TOTAL:
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '5px 0', fontWeight: 'bold', fontSize: '11px' }}>
                                        R$ {detalhes && parseFloat(detalhes.valor)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Pagamentos - Tabela Compacta */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #000' }}>
                                    <th style={{ width: '25%', textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>DATA</th>
                                    <th style={{ width: '25%', textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>VALOR</th>
                                    <th style={{ width: '25%', textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>FORMA</th>
                                    <th style={{ width: '25%', textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhes?.pagamentos.map(pagamento => (
                                    <tr key={pagamento.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>
                                            {new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontSize: '11px' }}>
                                            R$ {pagamento.valor_pago}
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>
                                            {pagamento.forma_pagamento}
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '3px 0', fontSize: '11px' }}>
                                            <span style={{
                                                backgroundColor: pagamento.status === 'Pago' ? '#28a745' :
                                                    pagamento.status === 'Pendente' ? '#ffc107' : '#dc3545',
                                                color: pagamento.status === 'Pendente' ? '#000' : '#fff',
                                                padding: '2px 5px',
                                                borderRadius: '3px',
                                                fontSize: '10px'
                                            }}>
                                                {pagamento.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Rodapé Minimalista */}
                        <div className="text-center" style={{ marginTop: '20px', fontSize: '10px' }}>
                            <p style={{ marginBottom: '3px' }}>___________________________________________</p>
                            <p style={{ marginBottom: '3px' }}>Assinatura do Responsável</p>
                            <p style={{ marginBottom: '3px' }}>Marmoraria Luxo</p>
                            <p style={{ marginBottom: '3px' }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                            <p style={{ fontStyle: 'italic' }}>Este documento não tem valor fiscal</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalhesModal(false)}>Fechar</Button>
                    {detalhes && (
                        <Button variant="success" onClick={() => toPDF()} size="sm">

                            Gerar Recibo
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal Criar / Editar Venda */}
            <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>{formMode === 'create' ? 'Nova Venda' : 'Editar Venda'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label>ID Orçamento *</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.id_orcamento || ''}
                                onChange={e => setFormData({ ...formData, id_orcamento: Number(e.target.value) })}
                                disabled={formMode === 'edit'}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Origem</label>
                            <select
                                className="form-select"
                                value={formData.origem || ''}
                                onChange={e => setFormData({ ...formData, origem: e.target.value })}
                            >
                                <option value="">Nenhum</option>
                                <option value="Site">Site</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Recomendação">Recomendação</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Forma de Pagamento *</label>
                            <select
                                className="form-select"
                                value={formData.forma_pagamento || ''}
                                onChange={e => setFormData({ ...formData, forma_pagamento: e.target.value })}
                            >
                                <option value="">-- Selecione a forma de pagamento --</option>
                                <option value="Crédito">Crédito</option>
                                <option value="Débito">Débito</option>
                                <option value="Pix">Pix</option>
                                <option value="Dinheiro">Dinheiro</option>
                            </select>
                        </div>

                        <hr />
                        <h5>Itens da Venda *</h5>
                        {formData.itens.length === 0 && <p className="text-muted">Nenhum item adicionado.</p>}
                        {formData.itens.map((item, idx) => (
                            <div key={idx} className="border p-3 mb-3">
                                <div className="mb-2">
                                    <label>Produto *</label>
                                    <select
                                        className="form-select"
                                        value={item.id_produto || ''}
                                        onChange={e => {
                                            const idProd = Number(e.target.value);
                                            const produtoSelecionado = produtos.find(p => p.id === idProd);
                                            const novosItens = [...formData.itens];
                                            novosItens[idx].id_produto = idProd;
                                            if (produtoSelecionado) {
                                                novosItens[idx].valor_unitario = produtoSelecionado.valor_m2;
                                            } else {
                                                novosItens[idx].valor_unitario = 0;
                                            }
                                            setFormData({ ...formData, itens: novosItens });
                                        }}
                                    >
                                        <option value="">-- Selecione um produto --</option>
                                        {produtos.map(produto => (
                                            <option key={produto.id} value={produto.id}>
                                                {produto.nome} (R$ {produto.valor_m2})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label>Quantidade *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.quantidade || ''}
                                        onChange={e => {
                                            const novosItens = [...formData.itens];
                                            novosItens[idx].quantidade = Number(e.target.value);
                                            setFormData({ ...formData, itens: novosItens });
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Valor Unitário *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={item.valor_unitario || ''}
                                        onChange={e => {
                                            const novosItens = [...formData.itens];
                                            novosItens[idx].valor_unitario = Number(e.target.value);
                                            setFormData({ ...formData, itens: novosItens });
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Medida</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.medida || ''}
                                        onChange={e => {
                                            const novosItens = [...formData.itens];
                                            novosItens[idx].medida = e.target.value;
                                            setFormData({ ...formData, itens: novosItens });
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Descrição</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.descricao || ''}
                                        onChange={e => {
                                            const novosItens = [...formData.itens];
                                            novosItens[idx].descricao = e.target.value;
                                            setFormData({ ...formData, itens: novosItens });
                                        }}
                                    />
                                </div>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        const novosItens = formData.itens.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, itens: novosItens });
                                    }}
                                >
                                    Remover Item
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setFormData({ ...formData, itens: [...formData.itens, {}] })}
                        >
                            Adicionar Item
                        </Button>

                        <hr />
                        <h5>Pagamentos</h5>
                        {formData.pagamentos.length === 0 && <p className="text-muted">Nenhum pagamento adicionado.</p>}
                        {formData.pagamentos.map((pagamento, idx) => (
                            <div key={idx} className="border p-3 mb-3">
                                <div className="mb-2">
                                    <label>Data do Pagamento *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={pagamento.data_pagamento || ''}
                                        onChange={e => {
                                            const novosPagamentos = [...formData.pagamentos];
                                            novosPagamentos[idx].data_pagamento = e.target.value;
                                            setFormData({ ...formData, pagamentos: novosPagamentos });
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Valor Pago *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={pagamento.valor_pago || ''}
                                        onChange={e => {
                                            const novosPagamentos = [...formData.pagamentos];
                                            novosPagamentos[idx].valor_pago = Number(e.target.value);
                                            setFormData({ ...formData, pagamentos: novosPagamentos });
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Forma de Pagamento *</label>
                                    <select
                                        className="form-select"
                                        value={pagamento.forma_pagamento || ''}
                                        onChange={e => {
                                            const novosPagamentos = [...formData.pagamentos];
                                            novosPagamentos[idx].forma_pagamento = e.target.value;
                                            setFormData({ ...formData, pagamentos: novosPagamentos });
                                        }}
                                    >
                                        <option value="">-- Selecione a forma --</option>
                                        <option value="Crédito">Crédito</option>
                                        <option value="Débito">Débito</option>
                                        <option value="Pix">Pix</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label>Status *</label>
                                    <select
                                        className="form-select"
                                        value={pagamento.status || ''}
                                        onChange={e => {
                                            const novosPagamentos = [...formData.pagamentos];
                                            novosPagamentos[idx].status = e.target.value;
                                            setFormData({ ...formData, pagamentos: novosPagamentos });
                                        }}
                                    >
                                        <option value="">-- Selecione o status --</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Pago">Pago</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        const novosPagamentos = formData.pagamentos.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, pagamentos: novosPagamentos });
                                    }}
                                >
                                    Remover Pagamento
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setFormData({ ...formData, pagamentos: [...formData.pagamentos, {}] })}
                        >
                            Adicionar Pagamento
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFormModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={salvarVenda}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Vendas;
