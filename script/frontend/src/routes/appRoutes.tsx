
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NovoAgendamento from '../pages/Novo_Agendamento';
import EditarAgendamento from '../pages/Editar_Agendamento';
import Agendamento from '../pages/Agendamento';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/agendamento/criar" element={<NovoAgendamento />} />
        <Route path="/agendamento/editar" element={<EditarAgendamento />} />
        
        </Routes>
    </Router>
  );
};

export default AppRoutes;