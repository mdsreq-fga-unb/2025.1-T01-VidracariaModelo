import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import NovoAgendamento from '../pages/Novo_Agendamento';
import EditarAgendamento from '../pages/Editar_Agendamento';
import Agendamento from '../pages/Agendamento';
import ListarOrcamentos from '../pages/ListarOrcamentos';
import DetalhesOrcamento from '../pages/DetalhesOrcamento';
import EditarOrcamento from '../pages/EditarOrcamento';
import Login from '../pages/Login'

const AppRoutes = () => {
  return (
    <Routes>
      {/* ROTA JÁ EXISTENTE */}
      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/agendamento/criar" element={<NovoAgendamento />} />
      <Route path="/agendamento/editar/:id" element={<EditarAgendamento />} />
      <Route path="/login" element={<Login />} />

      {/* NOVAS ROTAS ADICIONADAS */}
      <Route path="/orcamentos" element={<ListarOrcamentos />} />
      <Route path="/orcamentos/detalhes/:id" element={<DetalhesOrcamento />} />
      <Route path="/orcamentos/editar/:id" element={<EditarOrcamento />} />

    </Routes>

  );
};

export default AppRoutes;