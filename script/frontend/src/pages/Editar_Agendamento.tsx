import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import './Editar_Agendamento.css';
import { useNavigate, useParams } from 'react-router-dom';

registerLocale('pt-BR', ptBR);

const PaginaDeAgendamento: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const hoje = new Date();
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 30);

  const { id } = useParams(); // ← Pega o ID do agendamento da URL
  const navigate = useNavigate();

  const carregandoAgendamento = useRef(true);
  const API_URL = import.meta.env.VITE_URL_BASE;


  // --- LÓGICA DO BOTÃO "SALVAR" ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dataSelecionada || !horario) {
      alert('Por favor, selecione a data e o horário.');
      return;
    }

    const agendamento = {
      nome: cliente,
      data: dataSelecionada.toISOString().split('T')[0],
      horario,
      observacoes,
    };

    try {
      const res = await fetch(`${API_URL}/agendamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento),
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      alert('Agendamento atualizado com sucesso!');
      navigate('/agendamento');
    } catch (err) {
      alert('Erro ao salvar alterações.');
    }
  };


  // --- LÓGICA DO BOTÃO "EXCLUIR" ---
  const handleExcluirClick = async () => {
    const confirmar = window.confirm("Você tem certeza que deseja excluir este agendamento?");
    if (!confirmar || !id) return;

    try {
      const res = await fetch(`${API_URL}/agendamentos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir');

      alert("Agendamento excluído!");
      navigate('/agendamento');
    } catch (err) {
      alert('Erro ao excluir agendamento');
    }
  };


  useEffect(() => {
    const buscarHorarios = async () => {
      if (!dataSelecionada) {
        setHorariosDisponiveis([]);
        setHorario('');
        return;
      }

      const dataStr = dataSelecionada.toISOString().split('T')[0];

      try {
        const res = await fetch(`${API_URL}/horarios-disponiveis?data=${dataStr}`);
        const data = await res.json();
        setHorariosDisponiveis(data);

        // Só limpa o horário se não estiver carregando o agendamento
        if (!carregandoAgendamento.current) {
          setHorario('');
        }
      } catch (err) {
        alert('Erro ao buscar horários disponíveis');
        setHorariosDisponiveis([]);
      }
    };

    buscarHorarios();
  }, [dataSelecionada]);


  useEffect(() => {
    const buscarAgendamento = async () => {
      try {
        const res = await fetch(`${API_URL}/agendamentos/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar agendamento");

        const data = await res.json();

        setCliente(data.nome);
        setObservacoes(data.observacoes || '');

        const [ano, mes, dia] = data.data.split('T')[0].split('-').map(Number);
        const [hora, minuto, segundo] = data.horario.split(':').map(Number);
        const dataHora = new Date(ano, mes - 1, dia, hora, minuto, segundo);

        setDataSelecionada(dataHora); // Isso já vai disparar o fetch dos horários disponíveis

        // Espera um pouco até os horários serem carregados
        setTimeout(() => {
          setHorario(data.horario.substring(0, 5));
        }, 300); // pode ajustar esse delay se quiser
      } catch (err) {
        alert("Erro ao carregar agendamento.");
        console.error(err);
        navigate('/agendamento');
      }
    };

    if (id) buscarAgendamento();
  }, [id]);





  return (
    <>
      <div className="agendamento-container">
        <button
          type="button"
          className="voltar-button"
          onClick={() => navigate('/agendamento')}
        >
          ← Voltar
        </button>


        <h1 className="agendamento-titulo">Agendamentos</h1>
        <form className="agendamento-form" onSubmit={handleSubmit}>

          {/* ... Seus campos do formulário ... */}
          {/* Campo Cliente */}
          <div className="form-group">
            <label htmlFor="cliente">Cliente: </label>
            <input
              type="text"
              id="cliente"
              className="input-field"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              readOnly
            />
          </div>

          {/* Campo Data */}
          <div className="form-group">
            <label>Selecione a data</label>
            <DatePicker selected={dataSelecionada} onChange={(date) => setDataSelecionada(date)} placeholderText="Selecione a data" dateFormat="dd/MM/yyyy" locale="pt-BR" className="input-field" wrapperClassName="date-picker-wrapper" minDate={hoje} maxDate={dataMaxima} />
          </div>

          {/* Campo Horário */}
          <div className="form-group">
            <label htmlFor="horario">Selecione o horário</label>
            <select
              id="horario"
              className="input-field"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              disabled={!dataSelecionada || horariosDisponiveis.length === 0}
            >
              <option value="" disabled>Selecione o horário</option>
              {horariosDisponiveis.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Campo Observações */}
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea id="observacoes" className="textarea-field" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          </div>

          <div className="botoes-container">
            {/* Botão de Excluir com o onClick */}
            <button type="button" className="excluir-button" onClick={handleExcluirClick}>
              Excluir
            </button>

            {/* Botão de Salvar que aciona o onSubmit */}
            <button type="submit" className="salvar-button">
              Salvar
            </button>
          </div>
        </form>
      </div >

      <footer className="footerContainer1">
        <div className="redStripe1" />
      </footer>
    </>
  );
};

export default PaginaDeAgendamento;