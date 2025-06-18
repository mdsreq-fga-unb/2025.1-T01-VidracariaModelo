import AppRoutes from './routes/appRoutes';
import logo from './assets/Logo2.png';

function App() {


  return (
    <div className="App">
      <header>

        <div className="cabecalho-section">
          <div className="logo-cabecalho-section">
            <img 
            src={logo} 
            alt="Logo Vidraçaria Modelo"
            width={300}
            height={300}
            className="logo-section"
            />
          </div>
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