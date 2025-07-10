import { useState, useRef, useEffect } from 'react';
import AppRoutes from './routes/appRoutes';
import logo from './assets/Logo2.png';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "./App.css";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  tipo_usuario: string;
  exp: number;
  iat: number;
}

function getTipoUsuarioFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.tipo_usuario;
  } catch {
    return null;
  }
}

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (menuAberto && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickFora);

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [menuAberto]);

  const tipoUsuario = getTipoUsuarioFromToken();

  return (
    <div className="App" style={{ backgroundColor: '#333' }}>
      <header>
        <div className="cabecalho-section">
          <AiOutlineMenu size={50} color="white" className='icone-cabecalho' onClick={toggleMenu} />
          <div className="logo-cabecalho-section">
            <img
              src={logo}
              alt="Logo Vidraçaria Modelo"
              className="logo-section"
            />
          </div>
          <AiOutlineUser
            size={50}
            color="white"
            className="icone-cabecalho"
            onClick={() => navigate('/login')}
          />
        </div>
      </header>

      {/* Menu Lateral */}
      <div
        ref={menuRef}
        className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}
      >
        <AiOutlineClose
          size={30}
          className="botao-fechar"
          onClick={toggleMenu}
        />
        <ul>
          <li><Link to="/" onClick={() => setMenuAberto(false)}>Início</Link></li>

          {/* Só mostrar esses links se for gerente */}
          {tipoUsuario === 'gerente' && (
            <>
              <li><Link to="/orcamentos" onClick={() => setMenuAberto(false)}>Orçamentos</Link></li>
              <li><Link to="/agendamento" onClick={() => setMenuAberto(false)}>Agendamentos</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Conteúdo principal */}
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
