import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ListarOrcamentos from '../pages/ListarOrcamentos';
import DetalhesOrcamento from '../pages/DetalhesOrcamento';
import EditarOrcamento from '../pages/EditarOrcamento';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ROTA JÁ EXISTENTE */}
        <Route path="/" element={<Home />} />
        
        {/* NOVAS ROTAS ADICIONADAS */}
        <Route path="/orcamentos" element={<ListarOrcamentos />} />
        <Route path="/orcamentos/detalhes/:id" element={<DetalhesOrcamento />} />
        <Route path="/orcamentos/editar/:id" element={<EditarOrcamento />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;