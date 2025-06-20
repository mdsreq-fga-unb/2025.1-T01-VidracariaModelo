import AppRoutes from './routes/appRoutes';
import logo from './assets/Logo2.png';
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";
import "./App.css";

function App() {


  return (
    <div className="App">
      <header>

        <div className="cabecalho-section">
          <AiOutlineMenu size={80}/>
          <div className="logo-cabecalho-section">
            <img 
            src={logo} 
            alt="Logo Vidraçaria Modelo"
            className="logo-section"
            />
          </div>
          <AiOutlineUser size={80}/>
        </div>


      </header>

      {/* Sistema de rotas */}
      <main>
        <AppRoutes />
      </main>

      {/* Rodapé (opcional) */}
    </div>
  );
}

export default App;