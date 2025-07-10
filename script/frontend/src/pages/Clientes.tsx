import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'; // importei ícone de lixeira

interface Cliente {
    cpf: string;
    nome: string;
    email: string | null;
    endereco: string | null;
}

const Clientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>({
        cpf: '',
        nome: '',
        email: '',
        endereco: ''
    });

    const buscarClientes = async () => {
        try {
            const res = await fetch('http://localhost:3000/clientes');
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    useEffect(() => {
        buscarClientes();
    }, []);

    const handleCriarNovo = () => {
        setClienteSelecionado({ cpf: '', nome: '', email: '', endereco: '' });
        setShowModal(true);
    };

    const handleEditar = (cliente: Cliente) => {
        setClienteSelecionado(cliente);
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClienteSelecionado((prev) => ({
            ...prev,
            [name]: value.toUpperCase()
        }));
    };

    const handleSalvar = async () => {
        const { cpf, nome } = clienteSelecionado;

        if (!cpf || !nome) {
            alert('CPF e Nome são obrigatórios');
            return;
        }

        try {
            const clienteExiste = clientes.find(c => c.cpf === cpf);

            if (clienteExiste) {
                // Atualizar
                await fetch(`http://localhost:3000/clientes/${cpf}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clienteSelecionado)
                });
            } else {
                // Criar novo
                await fetch('http://localhost:3000/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clienteSelecionado)
                });
            }

            setShowModal(false);
            buscarClientes();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    };

    // NOVO: função para deletar cliente
    const handleDeletar = async (cpf: string) => {
        if (!window.confirm('Tem certeza que deseja deletar este cliente?')) {
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/clientes/${cpf}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                alert('Erro ao deletar cliente');
                return;
            }
            buscarClientes();
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            alert('Erro ao deletar cliente');
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column align-items-center pt-5">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '900px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Lista de Clientes</h2>
                    <button className="btn btn-primary" onClick={handleCriarNovo}>
                        Criar Novo Cliente
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>CPF</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Endereço</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <tr key={cliente.cpf}>
                                        <td>{cliente.cpf}</td>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.email || 'N/A'}</td>
                                        <td>{cliente.endereco || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleEditar(cliente)}
                                                    title="Editar"
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeletar(cliente.cpf)}
                                                    title="Deletar"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">Nenhum cliente encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {clientes.find(c => c.cpf === clienteSelecionado.cpf)
                                        ? 'Editar Cliente'
                                        : 'Novo Cliente'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">CPF</label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        className="form-control"
                                        value={clienteSelecionado.cpf}
                                        onChange={handleInputChange}
                                        disabled={clientes.some(c => c.cpf === clienteSelecionado.cpf)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        className="form-control"
                                        value={clienteSelecionado.nome}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={clienteSelecionado.email || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Endereço</label>
                                    <input
                                        type="text"
                                        name="endereco"
                                        className="form-control"
                                        value={clienteSelecionado.endereco || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleSalvar}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;
