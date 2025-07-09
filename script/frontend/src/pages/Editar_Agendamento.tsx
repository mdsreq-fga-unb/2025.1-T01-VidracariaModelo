import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import './Editar_Agendamento.css';

registerLocale('pt-BR', ptBR);

const PaginaDeAgendamento: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const hoje = new Date();
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 30);

  // --- LÓGICA DO BOTÃO "SALVAR" ---
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!dataSelecionada || !horario) {
      alert('Por favor, selecione a data e o horário.');
      return;
    }
    const agendamento = { cliente, data: dataSelecionada, horario, observacoes };
    console.log('Dados para SALVAR:', agendamento);
    alert('Agendamento salvo com sucesso!');
    // Ex: aqui você faria a chamada para a API para salvar
  };

  // --- LÓGICA DO BOTÃO "EXCLUIR" ---
  const handleExcluirClick = () => {
    // Pede confirmação ao usuário antes de prosseguir
    const confirmar = window.confirm("Você tem certeza que deseja excluir este agendamento?");

    if (confirmar) {
      console.log("Lógica de EXCLUSÃO executada aqui.");
      alert("Agendamento excluído!");
      // Ex: aqui você faria a chamada para a API para deletar
      // e depois redirecionaria o usuário para outra página.
    } else {
      console.log("Exclusão cancelada pelo usuário.");
    }
  };

  return (
    <>
      <div className="agendamento-container">
        <h1 className="agendamento-titulo">Agendamentos</h1>
        <form className="agendamento-form" onSubmit={handleSubmit}>

          {/* ... Seus campos do formulário ... */}
          {/* Campo Cliente */}
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <input type="text" id="cliente" className="input-field" value={cliente} onChange={(e) => setCliente(e.target.value)} />
          </div>

          {/* Campo Data */}
          <div className="form-group">
            <label>Selecione a data</label>
            <DatePicker selected={dataSelecionada} onChange={(date) => setDataSelecionada(date)} placeholderText="Selecione a data" dateFormat="dd/MM/yyyy" locale="pt-BR" className="input-field" wrapperClassName="date-picker-wrapper" minDate={hoje} maxDate={dataMaxima} />
          </div>

          {/* Campo Horário */}
          <div className="form-group">
            <label htmlFor="horario">Selecione o horário</label>
            <select id="horario" className="input-field" value={horario} onChange={(e) => setHorario(e.target.value)}>
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
      </div>

      <footer className="footerContainer1">
        <div className="redStripe1" />
      </footer>
    </>
  );
};

export default PaginaDeAgendamento;