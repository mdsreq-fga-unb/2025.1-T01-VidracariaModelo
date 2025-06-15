import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AppRoutes from './routes/appRoutes';

function App() {
  const [count, setCount] = useState(0);

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