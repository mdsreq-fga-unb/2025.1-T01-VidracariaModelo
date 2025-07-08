import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import NovoAgendamento from '../pages/Novo_Agendamento';
import EditarAgendamento from '../pages/Editar_Agendamento';
import Agendamento from '../pages/Agendamento';
import ListarOrcamentos from '../pages/ListarOrcamentos';
import DetalhesOrcamento from '../pages/DetalhesOrcamento';
import EditarOrcamento from '../pages/EditarOrcamento';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ROTA JÁ EXISTENTE */}
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/agendamento/criar" element={<NovoAgendamento />} />
        <Route path="/agendamento/editar" element={<EditarAgendamento />} />
        
        {/* NOVAS ROTAS ADICIONADAS */}
        <Route path="/orcamentos" element={<ListarOrcamentos />} />
        <Route path="/orcamentos/detalhes/:id" element={<DetalhesOrcamento />} />
        <Route path="/orcamentos/editar/:id" element={<EditarOrcamento />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;