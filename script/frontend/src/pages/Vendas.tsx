import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';
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
    itens: {
        id: number;
        id_produto: number;
        quantidade: number;
        valor_unitario: number;
        medida: string;
        descricao: string;
        produto_nome: string;
        valor_total: number;
        largura: number;  // Adicionado
        altura: number;   // Adicionado
    }[];
    pagamentos: {
        id: number;
        data_pagamento: string;
        valor_pago: number;
        forma_pagamento: string;
        status: string;
    }[];
};

type FiltrosVenda = {
    cliente_cpf?: string;
    data_inicio?: string;
    data_fim?: string;
    forma_pagamento?: string;
};
type Produto = {
    id: number;
    nome: string;
    valor_m2: string;
};

type Cliente = {
    cpf: string;
    nome: string;
};

const Vendas: React.FC = () => {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [total, setTotal] = useState<string>('0.00');
    const [detalhes, setDetalhes] = useState<DetalhesVenda | null>(null);
    const [showDetalhesModal, setShowDetalhesModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const { toPDF, targetRef } = usePDF({ filename: `recibo-venda-${detalhes?.id || ''}.pdf` });

    const API_URL = import.meta.env.VITE_URL_BASE;
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        cliente_cpf: '',
        data_inicio: '',
        data_fim: '',
        forma_pagamento: ''
    })

    const [formData, setFormData] = useState<{
        cpf_cliente?: string;
        data_venda?: string;
        forma_pagamento: string;
        origem: string;
        itens: {
            altura?: number;
            largura?: number;
            id_produto?: number;
            quantidade?: number;
            valor_unitario?: number;
            medida?: string;
            descricao?: string;
            valor_total?: number;
        }[];
        pagamentos?: {
            data_pagamento?: string;
            valor_pago?: number;
            forma_pagamento?: string;
            status?: string;
        }[];
    }>({
        forma_pagamento: '',
        origem: '',
        itens: [],
        pagamentos: []
    });

    useEffect(() => {
        carregarVendas();
        carregarProdutos();
        carregarClientes();
    }, []);


    const carregarVendas = async (filtros: FiltrosVenda = {}) => {
        try {
            // Construir query string com os filtros
            const queryParams = new URLSearchParams();
            for (const [key, value] of Object.entries(filtros)) {
                if (value) {
                    queryParams.append(key, value.toString()); // Garante que o valor é string
                }
            }

            const url = `${API_URL}/vendas?${queryParams.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            setVendas(data.vendas);
            setTotal(data.total);
        } catch (err) {
            console.error("Erro ao buscar vendas:", err);
            alert("Erro ao carregar vendas");
        }
    };

    // Função para aplicar os filtros
    const aplicarFiltros = () => {
        carregarVendas(filters);
        setShowFilters(false);
    };

    // Função para limpar os filtros
    const limparFiltros = () => {
        setFilters({
            cliente_cpf: '',
            data_inicio: '',
            data_fim: '',
            forma_pagamento: ''
        });
        carregarVendas();
        setShowFilters(false);
    }

    const carregarProdutos = async () => {
        try {
            const res = await fetch(`${API_URL}/produtos`);
            const data = await res.json();
            setProdutos(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    };

    const carregarClientes = async () => {
        try {
            const res = await fetch(`${API_URL}/clientes`);
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        }
    };

    const carregarDetalhes = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/vendas/detalhes/${id}`);
            const data = await res.json();
            setDetalhes(data);
            setShowDetalhesModal(true);
        } catch (err) {
            console.error("Erro ao carregar detalhes da venda:", err);
            alert("Erro ao carregar detalhes da venda");
        }
    };

    const abrirModalCriarVenda = () => {
        setFormMode('create');
        setFormData({
            forma_pagamento: '',
            origem: '',
            itens: [],
            pagamentos: [],
            data_venda: new Date().toISOString().split('T')[0]
        });
        setShowFormModal(true);
    };

    const abrirModalEditarVenda = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/vendas/detalhes/${id}`);
            const venda = await res.json();

            setFormMode('edit');
            setFormData({
                cpf_cliente: venda.cpf_cliente,
                forma_pagamento: venda.forma_pagamento,
                origem: venda.origem,
                data_venda: venda.data_venda.split('T')[0],
                itens: venda.itens.map((item: any) => ({
                    id_produto: item.id_produto,
                    quantidade: 1,
                    valor_unitario: item.valor_unitario,
                    medida: item.medida,
                    descricao: item.descricao,
                    largura: item.largura,  // Adicionando largura
                    altura: item.altura     // Adicionando altura
                })),
                pagamentos: venda.pagamentos.map((pag: any) => ({
                    data_pagamento: pag.data_pagamento.split('T')[0],
                    valor_pago: pag.valor_pago,
                    forma_pagamento: pag.forma_pagamento,
                    status: pag.status,
                })),
            });

            // Armazenar o ID da venda que está sendo editada
            setCurrentVendaId(id);
            setShowFormModal(true);
        } catch (error) {
            console.error("Erro ao carregar venda para editar", error);
            alert("Erro ao carregar dados da venda para edição");
        }
    };
    const calcularTotalVenda = () => {
        if (!formData.itens || formData.itens.length === 0) return 0;

        return formData.itens.reduce((total, item) => {
            const largura = item.largura || 0;
            const altura = item.altura || 0;
            const area = largura * altura;
            const valorUnitario = item.valor_unitario || 0;
            const valorItem = area * valorUnitario * 1.2; // +20% mão de obra
            return total + valorItem;
        }, 0);
    };

    // Adicione este estado no início do componente
    const [currentVendaId, setCurrentVendaId] = useState<number | null>(null);

    // Modifique a função salvarVenda para usar o currentVendaId
    const salvarVenda = async () => {
        // Validação dos campos obrigatórios
        if (!formData.cpf_cliente || !formData.forma_pagamento || !formData.itens || formData.itens.length === 0) {
            alert("Preencha os campos obrigatórios (CPF do cliente, forma de pagamento e itens).");
            return;
        }

        // Calcular o valor total da venda
        const valorTotalVenda = calcularTotalVenda();

        // Preparar os dados para enviar
        const vendaData = {
            cpf_cliente: formData.cpf_cliente,
            data_venda: formData.data_venda,
            forma_pagamento: formData.forma_pagamento,
            origem: formData.origem,
            valor: valorTotalVenda, // Adiciona o valor total calculado
            itens: formData.itens.map(item => {
                const largura = item.largura || 0;
                const altura = item.altura || 0;
                const area = largura * altura;
                const valorUnitario = item.valor_unitario || 0;
                const valorTotal = area * valorUnitario * 1.2; // +20% mão de obra

                return {
                    id_produto: item.id_produto,
                    quantidade: 1,
                    valor_unitario: item.valor_unitario,
                    medida: item.medida,
                    descricao: item.descricao,
                    largura: item.largura,
                    altura: item.altura,
                    valor_total: valorTotal
                }
            }),
            pagamentos: formData.pagamentos || []
        };

        // Restante da função permanece igual...
        try {
            let response;
            if (formMode === 'create') {
                response = await fetch(`${API_URL}/vendas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vendaData)
                });
            } else {
                if (!currentVendaId) {
                    throw new Error('ID da venda não encontrado para edição');
                }

                response = await fetch(`${API_URL}}/vendas/detalhes/${currentVendaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vendaData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar venda');
            }

            alert(`Venda ${formMode === 'create' ? 'criada' : 'atualizada'} com sucesso!`);
            setShowFormModal(false);
            carregarVendas();
        } catch (error) {
            console.error(error);
            alert(error || "Erro ao salvar venda");
        }
    };

    const deletarVenda = async (id: number) => {
        if (window.confirm("Deseja realmente deletar esta venda?")) {
            try {
                const res = await fetch(`${API_URL}/vendas/detalhes/${id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    throw new Error('Erro ao deletar venda');
                }

                alert("Venda deletada com sucesso!");
                carregarVendas();
            } catch (err) {
                console.error("Erro ao deletar venda:", err);
                alert("Erro ao deletar venda");
            }
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="card shadow p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="m-0">Vendas Realizadas</h2>
                        <div>
                            <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="me-2">
                                <FontAwesomeIcon icon={showFilters ? faTimes : faFilter} className="me-2" />
                                {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
                            </Button>
                            <Button variant="success" onClick={abrirModalCriarVenda}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Nova Venda
                            </Button>
                        </div>
                    </div>

                    {/* Filtros */}
                    {showFilters && (
                        <div className="border p-3 mb-3 rounded">
                            <h5>Filtrar Vendas</h5>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cliente</Form.Label>
                                        <Form.Select
                                            value={filters.cliente_cpf}
                                            onChange={e => setFilters({ ...filters, cliente_cpf: e.target.value })}
                                        >
                                            <option value="">Todos os clientes</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.cpf} value={cliente.cpf}>
                                                    {cliente.nome} - {cliente.cpf}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data Início</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filters.data_inicio}
                                            onChange={e => setFilters({ ...filters, data_inicio: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data Fim</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filters.data_fim}
                                            onChange={e => setFilters({ ...filters, data_fim: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Forma de Pagamento</Form.Label>
                                        <Form.Select
                                            value={filters.forma_pagamento}
                                            onChange={e => setFilters({ ...filters, forma_pagamento: e.target.value })}
                                        >
                                            <option value="">Todas</option>
                                            <option value="Dinheiro">Dinheiro</option>
                                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                                            <option value="Cartão de Débito">Cartão de Débito</option>
                                            <option value="Pix">Pix</option>
                                            <option value="Boleto">Boleto</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="outline-secondary" onClick={limparFiltros}>
                                    Limpar Filtros
                                </Button>
                                <Button variant="primary" onClick={aplicarFiltros}>
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="text-end">
                        <strong>Total:</strong> R$ {total}
                    </p>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>

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
                                                    Detalhes
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

            {/* Modal de Detalhes */}
            <Modal
                show={showDetalhesModal}
                onHide={() => setShowDetalhesModal(false)}

                centered
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes da Venda #{detalhes?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body ref={targetRef}>
                    <div className="container px-3">
                        <div className="text-center mb-4">
                            <h4>VIDRAÇARIA MODELO</h4>
                            <p className="small">CNPJ: 12.345.678/0001-99 • Rua Exemplo, 123 - Centro - GAMA/DF</p>
                            <h5 className="border-top border-bottom py-2 my-3">
                                RECIBO # {detalhes?.id}
                            </h5>
                            <p className="small">
                                {detalhes && new Date(detalhes.data_venda).toLocaleDateString('pt-BR')} • {detalhes?.forma_pagamento}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-center fw-bold">CLIENTE</h6>
                            <p className="text-center">{detalhes?.cliente_nome}</p>
                            <p className="text-center small">CPF: {detalhes?.cliente_cpf}</p>
                        </div>

                        <table className="table table-sm mb-4">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th className="small text-center">Medidas</th>
                                    <th className="text-end">Unitário</th>
                                    <th className="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhes?.itens.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.produto_nome}
                                            {item.descricao && <div className="small text-muted">{item.descricao}</div>}
                                        </td>
                                        <td className="text-center small">
                                            {item.largura}m x {item.altura}m
                                        </td>
                                        <td className="text-end small">R$ {item.valor_unitario}</td>
                                        <td className="text-end small">R$ {item.valor_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan={3} className="text-end">TOTAL:</th>
                                    <th className="text-end">R$ {detalhes?.valor}</th>
                                </tr>
                            </tfoot>
                        </table>

                        <h6 className="mb-3">Pagamentos</h6>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th className="text-end">Valor</th>
                                    <th>Forma</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhes?.pagamentos.map(pagamento => (
                                    <tr key={pagamento.id}>
                                        <td>{new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}</td>
                                        <td className="text-end">R$ {pagamento.valor_pago}</td>
                                        <td>{pagamento.forma_pagamento}</td>
                                        <td>
                                            <span className={`badge ${pagamento.status === 'Pago' ? 'bg-success' :
                                                pagamento.status === 'Pendente' ? 'bg-warning text-dark' : 'bg-danger'
                                                }`}>
                                                {pagamento.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="text-center mt-4 small">
                            <div className="border-top pt-2 mb-2">___________________________________________</div>
                            <p>Assinatura do Responsável</p>
                            <p>Vidraçaria Modelo</p>
                            <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                            <p className="fst-italic">Este documento não tem valor fiscal</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalhesModal(false)}>Fechar</Button>
                    <Button variant="success" onClick={() => toPDF()}>Gerar Recibo</Button>
                </Modal.Footer>
            </Modal>


            {/* Modal Criar/Editar Venda */}
            < Modal show={showFormModal} onHide={() => setShowFormModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>{formMode === 'create' ? 'Nova Venda' : 'Editar Venda'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente *</Form.Label>
                            <Form.Select
                                value={formData.cpf_cliente || ''}
                                onChange={e => setFormData({ ...formData, cpf_cliente: e.target.value })}
                                required
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.cpf} value={cliente.cpf}>
                                        {cliente.nome} - {cliente.cpf}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Data da Venda</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.data_venda || ''}
                                onChange={e => setFormData({ ...formData, data_venda: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Forma de Pagamento *</Form.Label>
                            <Form.Select
                                value={formData.forma_pagamento}
                                onChange={e => setFormData({ ...formData, forma_pagamento: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartão de Crédito">Cartão de Crédito</option>
                                <option value="Cartão de Débito">Cartão de Débito</option>
                                <option value="Pix">Pix</option>
                                <option value="Boleto">Boleto</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Origem</Form.Label>
                            <Form.Select
                                value={formData.origem}
                                onChange={e => setFormData({ ...formData, origem: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                <option value="Loja Física">Loja Física</option>
                                <option value="Site">Site</option>
                                <option value="Indicação">Indicação</option>
                            </Form.Select>
                        </Form.Group>

                        <h5 className="mt-4">Itens da Venda *</h5>
                        {formData.itens.map((item, index) => {
                            // Calcular área e valor total
                            const largura = item.largura || 0;
                            const altura = item.altura || 0;
                            const area = largura * altura;
                            const valorUnitario = item.valor_unitario || 0;
                            const valorTotal = area * valorUnitario * 1.2; // +20% mão de obra

                            return (
                                <div key={index} className="border p-3 mb-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Produto *</Form.Label>
                                        <Form.Select
                                            value={item.id_produto || ''}
                                            onChange={e => {
                                                const newItens = [...formData.itens];
                                                const produtoId = Number(e.target.value);
                                                const produto = produtos.find(p => p.id === produtoId);

                                                newItens[index] = {
                                                    ...newItens[index],
                                                    id_produto: produtoId,
                                                    valor_unitario: produto ? parseFloat(produto.valor_m2) : 0
                                                };
                                                setFormData({ ...formData, itens: newItens });
                                            }}
                                            required
                                        >
                                            <option value="">Selecione um produto</option>
                                            {produtos.map(produto => (
                                                <option key={produto.id} value={produto.id}>
                                                    {produto.nome} (R$ {produto.valor_m2}/m²)
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <div className="row">
                                        <Form.Group className="col-md-3 mb-3">
                                            <Form.Label>Largura (m) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.largura || ''}
                                                onChange={e => {
                                                    const newItens = [...formData.itens];
                                                    newItens[index] = {
                                                        ...newItens[index],
                                                        largura: Number(e.target.value)
                                                    };
                                                    setFormData({ ...formData, itens: newItens });
                                                }}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-md-3 mb-3">
                                            <Form.Label>Altura (m) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.altura || ''}
                                                onChange={e => {
                                                    const newItens = [...formData.itens];
                                                    newItens[index] = {
                                                        ...newItens[index],
                                                        altura: Number(e.target.value)
                                                    };
                                                    setFormData({ ...formData, itens: newItens });
                                                }}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-md-3 mb-3">
                                            <Form.Label>Área (m²)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={area}
                                                readOnly
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-md-3 mb-3">
                                            <Form.Label>Valor Unitário *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={valorUnitario}
                                                onChange={e => {
                                                    const newItens = [...formData.itens];
                                                    newItens[index] = {
                                                        ...newItens[index],
                                                        valor_unitario: Number(e.target.value)
                                                    };
                                                    setFormData({ ...formData, itens: newItens });
                                                }}
                                                required
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="row">
                                        <Form.Group className="col-md-6 mb-3">
                                            <Form.Label>Valor Total (com 20% mão de obra)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={`R$ ${valorTotal}`}
                                                readOnly
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-md-6 mb-3">
                                            <Form.Label>Descrição</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={item.descricao || ''}
                                                onChange={e => {
                                                    const newItens = [...formData.itens];
                                                    newItens[index] = {
                                                        ...newItens[index],
                                                        descricao: e.target.value
                                                    };
                                                    setFormData({ ...formData, itens: newItens });
                                                }}
                                            />
                                        </Form.Group>
                                    </div>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            const newItens = formData.itens.filter((_, i) => i !== index);
                                            setFormData({ ...formData, itens: newItens });
                                        }}
                                    >
                                        Remover Item
                                    </Button>
                                </div>
                            );
                        })}

                        <Button
                            variant="outline-primary"
                            onClick={() => setFormData({
                                ...formData,
                                itens: [...formData.itens, {
                                    id_produto: undefined,
                                    largura: undefined,
                                    altura: undefined,
                                    valor_unitario: undefined,
                                    valor_total: undefined,

                                    descricao: ''
                                }]
                            })}
                        >
                            Adicionar Item
                        </Button>
                        <div className="mt-3 p-3 bg-light rounded">
                            <h5 className="text-end">
                                Total da Venda: R$ {calcularTotalVenda()}
                            </h5>
                        </div>
                        <h5 className="mt-4">Pagamentos</h5>
                        {(formData.pagamentos || []).map((pagamento, index) => (
                            <div key={index} className="border p-3 mb-3">
                                <div className="row">
                                    <Form.Group className="col-md-6 mb-3">
                                        <Form.Label>Data do Pagamento</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={pagamento.data_pagamento || ''}
                                            onChange={e => {
                                                const newPagamentos = [...(formData.pagamentos || [])];
                                                newPagamentos[index] = {
                                                    ...newPagamentos[index],
                                                    data_pagamento: e.target.value
                                                };
                                                setFormData({ ...formData, pagamentos: newPagamentos });
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="col-md-6 mb-3">
                                        <Form.Label>Valor Pago</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={pagamento.valor_pago || ''}
                                            onChange={e => {
                                                const newPagamentos = [...(formData.pagamentos || [])];
                                                newPagamentos[index] = {
                                                    ...newPagamentos[index],
                                                    valor_pago: Number(e.target.value)
                                                };
                                                setFormData({ ...formData, pagamentos: newPagamentos });
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                <div className="row">
                                    <Form.Group className="col-md-6 mb-3">
                                        <Form.Label>Forma de Pagamento</Form.Label>
                                        <Form.Select
                                            value={pagamento.forma_pagamento || ''}
                                            onChange={e => {
                                                const newPagamentos = [...(formData.pagamentos || [])];
                                                newPagamentos[index] = {
                                                    ...newPagamentos[index],
                                                    forma_pagamento: e.target.value
                                                };
                                                setFormData({ ...formData, pagamentos: newPagamentos });
                                            }}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Dinheiro">Dinheiro</option>
                                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                                            <option value="Cartão de Débito">Cartão de Débito</option>
                                            <option value="Pix">Pix</option>
                                            <option value="Boleto">Boleto</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="col-md-6 mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={pagamento.status || ''}
                                            onChange={e => {
                                                const newPagamentos = [...(formData.pagamentos || [])];
                                                newPagamentos[index] = {
                                                    ...newPagamentos[index],
                                                    status: e.target.value
                                                };
                                                setFormData({ ...formData, pagamentos: newPagamentos });
                                            }}
                                        >
                                            <option value="Pendente">Pendente</option>
                                            <option value="Pago">Pago</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        const newPagamentos = (formData.pagamentos || []).filter((_, i) => i !== index);
                                        setFormData({ ...formData, pagamentos: newPagamentos });
                                    }}
                                >
                                    Remover Pagamento
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline-primary"
                            onClick={() => setFormData({
                                ...formData,
                                pagamentos: [...(formData.pagamentos || []), {
                                    data_pagamento: '',
                                    valor_pago: 0,
                                    forma_pagamento: '',
                                    status: 'Pendente'
                                }]
                            })}
                        >
                            Adicionar Pagamento
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFormModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={salvarVenda}>
                        Salvar Venda
                    </Button>
                </Modal.Footer>
            </Modal >
        </div >
    );
};

export default Vendas;