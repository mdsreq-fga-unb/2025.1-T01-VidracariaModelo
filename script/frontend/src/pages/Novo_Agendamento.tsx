import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import './Novo_Agendamento.css';

import { createClient, createAgendamento, getHorariosDisponiveis, type Horario } from '../services/agendamentoService';

registerLocale('pt-BR', ptBR);

const PaginaDeAgendamento: React.FC = () => {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(new Date());
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  // Estados de controle
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // EFEITO PARA BUSCAR HORÁRIOS DISPONÍVEIS QUANDO A DATA MUDA
  useEffect(() => {
    // Limpa horários antigos e o horário selecionado quando a data muda
    setHorariosDisponiveis([]);
    setHorario('');

    if (dataSelecionada) {
      const dataFormatada = dataSelecionada.toISOString().split('T')[0];
      
      // Mostra um feedback de carregamento para os horários
      setIsLoading(true);

      getHorariosDisponiveis(dataFormatada)
        .then(data => {
          setHorariosDisponiveis(data);
        })
        .catch(err => {
          console.error(err);
          setError("Não foi possível carregar os horários para esta data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dataSelecionada]); // Dependência: roda sempre que 'dataSelecionada' mudar

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!dataSelecionada || !horario || !nome || !email) {
      alert('Por favor, preencha nome, email, data e horário.');
      return;
    }

    setIsLoading(true);

    try {
      const clientPayload = { nome, email, telefone };
      const novoCliente = await createClient(clientPayload);
      console.log('Cliente criado com sucesso:', novoCliente);

      const agendamentoPayload = {
        id_cliente: novoCliente.id_cliente,
        data: dataSelecionada.toISOString().split('T')[0],
        horario: horario.substring(0, 5), // Envia apenas "HH:MM"
        observacoes: observacoes,
      };
      
      await createAgendamento(agendamentoPayload);

      alert(`Agendamento para ${nome} criado com sucesso!`);
      navigate('/agendamentos'); // Redireciona para a lista de agendamentos

    } catch (err: any) {
      console.error("Erro no processo de agendamento:", err);
      const errorMessage = err.response?.data?.error || "Ocorreu um erro. Tente novamente.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="agendamento-container">
        <h1 className="agendamento-titulo">Novo Agendamento</h1>
        <form className="agendamento-form" onSubmit={handleSubmit}>
          {/* Seção de Dados do Cliente */}
          <fieldset>
            <legend>Dados do Cliente</legend>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="input-field" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone (Opcional)</label>
              <input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="input-field" />
            </div>
          </fieldset>

          {/* Seção de Dados do Agendamento */}
          <fieldset>
            <legend>Dados do Agendamento</legend>
            <div className="form-group">
              <label>Selecione a data</label>
              <DatePicker selected={dataSelecionada} onChange={(date) => setDataSelecionada(date)} dateFormat="dd/MM/yyyy" locale="pt-BR" className="input-field" minDate={new Date()} required />
            </div>
            <div className="form-group">
              <label htmlFor="horario">Selecione o horário</label>
              <select id="horario" value={horario} onChange={(e) => setHorario(e.target.value)} required className="input-field" disabled={!dataSelecionada || horariosDisponiveis.length === 0}>
                <option value="" disabled>
                  {dataSelecionada ? 'Selecione um horário' : 'Selecione uma data primeiro'}
                </option>
                {horariosDisponiveis.map(h => (
                  <option key={h.id_horario} value={h.horario_inicio}>
                    {h.horario_inicio.substring(0, 5)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="textarea-field" />
            </div>
          </fieldset>
          
          <button type="submit" className="agendar-button" disabled={isLoading}>
            {isLoading ? 'Agendando...' : 'Agendar'}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default PaginaDeAgendamento;