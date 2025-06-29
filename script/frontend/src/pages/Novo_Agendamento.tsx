import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR'; 
import "react-datepicker/dist/react-datepicker.css";
import './Novo_Agendamento.css';

registerLocale('pt-BR', ptBR);
const PaginaDeAgendamento: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const hoje = new Date();
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 30);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!dataSelecionada || !horario) {
      alert('Por favor, selecione a data e o horário.');
      return;
    }

    const agendamento = {
      cliente,
      data: dataSelecionada.toLocaleDateString('pt-BR'),
      horario,
      observacoes,
    };

    console.log('Dados do Agendamento:', agendamento);
    alert(`Agendamento para ${cliente} em ${agendamento.data} às ${horario} foi criado com sucesso!`);
  };

  return (
    // Usamos um Fragmento (<>) para agrupar os elementos sem adicionar uma div extra
    <>
      {/* O container do agendamento agora só tem o título e o formulário */}
      <div className="agendamento-container">
        <h1 className="agendamento-titulo">Agendamentos</h1>

        <form className="agendamento-form" onSubmit={handleSubmit}>
          {/* ... todo o seu formulário continua aqui, sem alterações ... */}
          
          {/* Campo Cliente */}
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <input
              type="text"
              id="cliente"
              className="input-field"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>

          {/* Campo Data */}
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
            />
          </div>

          {/* Campo Horário */}
          <div className="form-group">
            <label htmlFor="horario">Selecione o horário</label>
            <select
              id="horario"
              className="input-field"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            >
              <option value="" disabled>Selecione o horário</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
            </select>
          </div>

          {/* Campo Observações */}
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              className="textarea-field"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          {/* Botão de Agendamento */}
          <button type="submit" className="agendar-button">
            Agendar
          </button>
        </form>
      </div>

      {/* O footer agora está FORA do container do agendamento, como um irmão */}
      <footer className="footerContainer">
        <div className="redStripe" />
      </footer>
    </>
  );
};

export default PaginaDeAgendamento;