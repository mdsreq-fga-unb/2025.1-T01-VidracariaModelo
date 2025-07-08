import { useState } from 'react';
import AppRoutes from './routes/appRoutes';
import logo from './assets/Logo2.png';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "./App.css";

function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <div className="App">
      <header>
        <div className="cabecalho-section">
          <AiOutlineMenu size={50} className='icone-cabecalho' onClick={toggleMenu} />
          <div className="logo-cabecalho-section">
            <img
              src={logo}
              alt="Logo Vidraçaria Modelo"
              className="logo-section"
            />
          </div>
          <AiOutlineUser size={50} className='icone-cabecalho' />
        </div>
      </header>

      {/* Menu Lateral */}
      <div className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <AiOutlineClose
          size={30}
          className="botao-fechar"
          onClick={toggleMenu}
        />
        <ul>
          <li><a href="/">Início</a></li>
          <li><a href="/orcamentos">Orçamentos</a></li>
          <li><a href="/agendamento">Agendamentos</a></li>
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
