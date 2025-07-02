import axios from 'axios';

// --- INTERFACES (TIPOS DE DADOS) ---

// Representa um Cliente, conforme a API
export interface Cliente {
  id_cliente: number;
  nome: string;
  email: string;
  telefone: string | null;
}

// Dados para criar um novo Cliente
export interface NewClientPayload {
  nome: string;
  email: string;
  telefone?: string;
}

// Representa um Horário Disponível
export interface Horario {
  id_horario: number; 
  horario_inicio: string; 
  horario_fim: string;
}

// Representa um Agendamento complet
export interface Agendamento {
  id_agendamento: number;
  id_cliente: number;
  data: string;
  horario: string;
  observacoes: string | null;
}

// Dados para criar um novo Agendamento
export interface NewAgendamentoPayload {
  id_cliente: number;
  data: string; // Formato YYYY-MM-DD
  horario: string; // Formato HH:MM
  observacoes?: string;
}

export interface AgendamentoComCliente extends Agendamento {
  nome: string; 
}

// --- INSTÂNCIA DO AXIOS ---
const apiClient = axios.create({
  baseURL: 'http://localhost:4000', // Certifique-se de que a porta está correta
});


// --- FUNÇÕES DO SERVIÇO ---

// -- Clientes --
export const createClient = async (payload: NewClientPayload): Promise<Cliente> => {
  try {
    const response = await apiClient.post('/clientes', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

// -- Horários --
export const getHorariosDisponiveis = async (data: string): Promise<Horario[]> => {
  try {
    const response = await apiClient.get('/horarios-disponiveis', { params: { data } });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

// -- Agendamentos --
export const createAgendamento = async (payload: NewAgendamentoPayload): Promise<Agendamento> => {
  try {
    // A API de agendamentos está na raiz, conforme a documentação ('POST /')
    // mas o prefixo '/agendamentos' é definido no seu app.js principal.
    const response = await apiClient.post('/agendamentos', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export const getAgendamentos = async (dataFiltro?: string): Promise<AgendamentoComCliente[]> => {
  try {
    const params = dataFiltro ? { data: dataFiltro } : {};
    const response = await apiClient.get('/agendamentos', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    throw error;
  }
};

// Aqui poderiam entrar as outras funções (getAgendamentos, update, delete...)