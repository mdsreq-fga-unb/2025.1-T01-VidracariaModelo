import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [jaLogado, setJaLogado] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setJaLogado(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setJaLogado(false);
        // Opcional: redireciona para login para recarregar o componente
        navigate('/login');
    };

    const handleVoltar = () => {
        navigate('/');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErro(data.erro || 'Erro ao fazer login');
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            setErro('Erro de conexão com o servidor');
        }
    };

    if (jaLogado) {
        return (
            <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <h4 className="text-center mb-4">Você já está logado</h4>
                    <p className="text-center">Deseja fazer logout?</p>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Fazer logout
                        </button>
                        <button className="btn btn-secondary" onClick={handleVoltar}>
                            Voltar para a página inicial
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Se não está logado, mostra o formulário normal
    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Digite seu e-mail"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="senha" className="form-label">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="senha"
                            placeholder="Digite sua senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <button type="submit" className="btn btn-primary w-100">
                        Entrar
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger d-block mx-auto mt-3"
                        onClick={() => navigate('/')}
                    >
                        Voltar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
