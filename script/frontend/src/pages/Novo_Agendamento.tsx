import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import './Novo_Agendamento.css';
import { useNavigate } from 'react-router-dom';

registerLocale('pt-BR', ptBR);

const PaginaDeAgendamento: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [clienteExiste, setClienteExiste] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  const hoje = new Date();
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 30);

  const navigate = useNavigate();

  // Verifica se cliente existe no banco ao digitar o nome
  useEffect(() => {
    const verificarCliente = async () => {
      if (!cliente.trim()) {
        setClienteExiste(null);
        return;
      }
      try {
        const res = await fetch('http://localhost:3000/clientes');
        const lista = await res.json();
        const clienteEncontrado = lista.find((c: any) => c.nome.toLowerCase() === cliente.toLowerCase());
        setClienteExiste(!!clienteEncontrado);
      } catch (err) {
        console.error('Erro ao verificar cliente');
        setClienteExiste(null);
      }
    };
    verificarCliente();
  }, [cliente]);

  // Buscar horários disponíveis quando a data mudar
  useEffect(() => {
    const buscarHorarios = async () => {
      if (!dataSelecionada) {
        setHorariosDisponiveis([]);
        setHorario('');
        return;
      }
      const dataStr = dataSelecionada.toISOString().split('T')[0];
      try {
        const res = await fetch(`http://localhost:3000/horarios-disponiveis?data=${dataStr}`);
        const data = await res.json();
        setHorariosDisponiveis(data);
        setHorario('');
      } catch (err) {
        alert('Erro ao buscar horários disponíveis');
        setHorariosDisponiveis([]);
      }
    };
    buscarHorarios();
  }, [dataSelecionada]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!dataSelecionada || !horario) {
      alert('Por favor, selecione a data e o horário.');
      return;
    }

    const hojeSemHora = new Date(hoje);
    hojeSemHora.setHours(0, 0, 0, 0);

    const dataMaximaSemHora = new Date(hoje);
    dataMaximaSemHora.setDate(hoje.getDate() + 30);
    dataMaximaSemHora.setHours(23, 59, 59, 999);

    if (dataSelecionada < hojeSemHora) {
      alert('A data não pode ser anterior a hoje.');
      return;
    }
    if (dataSelecionada > dataMaximaSemHora) {
      alert('A data deve estar em até 30 dias a partir de hoje.');
      return;
    }

    try {
      const agendamento: any = {
        nome_cliente: cliente,
        data: dataSelecionada.toISOString().split('T')[0],
        horario,
        observacoes,
        email: clienteExiste === false ? email : undefined,
        endereco: clienteExiste === false ? endereco : undefined,
      };

      // Remover chaves com undefined
      Object.keys(agendamento).forEach(key => agendamento[key] === undefined && delete agendamento[key]);

      const resAgendamento = await fetch('http://localhost:3000/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento),
      });

      if (!resAgendamento.ok) {
        const erro = await resAgendamento.json();
        alert(erro.error || 'Erro ao criar agendamento');
        return;
      }

      alert(`Agendamento para ${cliente} em ${agendamento.data} às ${horario} criado com sucesso!`);
      setCliente('');
      setEmail('');
      setEndereco('');
      setDataSelecionada(null);
      setHorario('');
      setObservacoes('');
      navigate('/agendamento');
    } catch (err) {
      alert('Erro ao criar agendamento');
    }
  };

  return (
    <>
      <div className="agendamento-container">
        <h1 className="agendamento-titulo">Agendamentos</h1>
        <form className="agendamento-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <input
              type="text"
              id="cliente"
              className="input-field"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>

          {cliente && clienteExiste === false && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input
                  type="text"
                  id="endereco"
                  className="input-field"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Selecione a data</label>
            <DatePicker
              selected={dataSelecionada}
              onChange={(date: Date | null) => setDataSelecionada(date)}
              placeholderText="Selecione a data"
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="input-field"
              wrapperClassName="date-picker-wrapper"
              minDate={hoje}
              maxDate={dataMaxima}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horario">Selecione o horário</label>
            <select
              id="horario"
              className="input-field"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              disabled={!dataSelecionada || horariosDisponiveis.length === 0}
              required
            >
              <option value="" disabled>Selecione o horário</option>
              {horariosDisponiveis.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              className="textarea-field"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          <button type="submit" className="agendar-button">Agendar</button>
        </form>
      </div>
      <footer className="footerContainer2">
        <div className="redStripe2" />
      </footer>
    </>
  );
};

export default PaginaDeAgendamento;
