import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import NovoAgendamento from '../pages/Novo_Agendamento';
import EditarAgendamento from '../pages/Editar_Agendamento';
import Agendamento from '../pages/Agendamento';
import ListarOrcamentos from '../pages/ListarOrcamentos';
import DetalhesOrcamento from '../pages/DetalhesOrcamento';
import EditarOrcamento from '../pages/EditarOrcamento';
import Login from '../pages/Login'
import Clientes from '../pages/Clientes';
import Vendas from '../pages/Vendas';
import ListarDuvidas from '../pages/Listar_Duvidas';
import EditarDuvidas from '../pages/Editar_Duvidas';
import DuvidasFrequentes from '../pages/Duvidas_publico';

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/agendamento/criar" element={<NovoAgendamento />} />
      <Route path="/agendamento/editar/:id" element={<EditarAgendamento />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orcamentos" element={<ListarOrcamentos />} />
      <Route path="/orcamentos/detalhes/:id" element={<DetalhesOrcamento />} />
      <Route path="/orcamentos/editar/:id" element={<EditarOrcamento />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/vendas" element={<Vendas />} />
      <Route path="/duvidas/listar" element={<ListarDuvidas />} />
      <Route path="/duvidas/editar/:id" element={<EditarDuvidas />} />
      <Route path="/duvidas" element={<DuvidasFrequentes />} />

    </Routes>

  );
};

export default AppRoutes;