
import AppRoutes from './routes/appRoutes';

function App() {


  return (
    <div className="App">
      {/* Seção do cabeçalho (opcional) */}
      <header>
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