import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import './Novo_Agendamento.css';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

registerLocale('pt-BR', ptBR);

const PaginaDeAgendamento: React.FC = () => {
  const [clientes, setClientes] = useState<{ cpf: string; nome: string }[]>([]);
  const [cpfCliente, setCpfCliente] = useState<string>('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 30);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const res = await fetch('http://localhost:3000/clientes');
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes');
      }
    };
    buscarClientes();
  }, []);

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

    if (!cpfCliente || !dataSelecionada || !horario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const agora = new Date();
    const [horaStr, minutoStr] = horario.split(':');
    const dataHoraAgendamento = new Date(dataSelecionada);
    dataHoraAgendamento.setHours(parseInt(horaStr, 10), parseInt(minutoStr, 10), 0, 0);

    const dataMaximaLimite = new Date();
    dataMaximaLimite.setDate(hoje.getDate() + 30);
    dataMaximaLimite.setHours(23, 59, 59, 999);

    if (dataHoraAgendamento < agora) {
      alert('Não é permitido criar agendamento em data e hora passadas.');
      return;
    }

    if (dataHoraAgendamento > dataMaximaLimite) {
      alert('A data e hora devem estar em até 30 dias a partir de hoje.');
      return;
    }

    try {
      const agendamento = {
        cpf_cliente: cpfCliente,
        data: dataSelecionada.toISOString().split('T')[0],
        horario,
        observacoes,
      };

      const res = await fetch('http://localhost:3000/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento),
      });

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.error || 'Erro ao criar agendamento');
        return;
      }

      alert('Agendamento criado com sucesso!');
      setCpfCliente('');
      setDataSelecionada(null);
      setHorario('');
      setObservacoes('');
      navigate('/agendamento');
    } catch (error) {
      alert('Erro ao criar agendamento');
    }
  };

  return (
    <div className="agendamento-container">
      <h1 className="agendamento-titulo">Agendamentos</h1>
      <Form className="agendamento-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cliente *</Form.Label>
          <Form.Select
            value={cpfCliente}
            onChange={(e) => setCpfCliente(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.cpf} value={cliente.cpf}>
                {cliente.nome} - {cliente.cpf}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data *</Form.Label>
          <div>
            <DatePicker
              selected={dataSelecionada}
              onChange={(date: Date | null) => setDataSelecionada(date)}
              placeholderText="Selecione a data"
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="form-control"
              wrapperClassName="date-picker-wrapper"
              minDate={hoje}
              maxDate={dataMaxima}
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Horário *</Form.Label>
          <Form.Select
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            disabled={!dataSelecionada || horariosDisponiveis.length === 0}
            required
          >
            <option value="" disabled>Selecione o horário</option>
            {horariosDisponiveis.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Observações</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="agendar-button">Agendar</Button>
      </Form>

    </div>
  );
};

export default PaginaDeAgendamento;
