import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // aqui pode ser feita a autenticação
        navigate('/'); // redireciona para a página principal
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Digite seu e-mail"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="senha" className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="senha"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Entrar
                    </button>
                    <button
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
