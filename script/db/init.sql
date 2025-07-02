-- Tabela de Clientes
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- Tabela de Horários Disponíveis
CREATE TABLE horarios_disponiveis (
    id_horario SERIAL PRIMARY KEY,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL
);

-- Tabela de Agendamentos
CREATE TABLE agendamentos (
    id_agendamento SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT unq_agendamento UNIQUE (data, horario)
);

-- Inserção de horários disponíveis
INSERT INTO horarios_disponiveis (horario_inicio, horario_fim) VALUES
('11:00:00', '11:30:00'),
('12:00:00', '12:30:00'),
('13:00:00', '13:30:00');

-- Inserção de cliente de exemplo
INSERT INTO clientes (nome, telefone, email) VALUES
('Cliente Silva Aaaaaa Bbbbb', '(99) 99999-9999', 'cliente@email.com');

-- Inserção de agendamento de exemplo
INSERT INTO agendamentos (id_cliente, data, horario, observacoes) VALUES
(1, '2025-03-24', '11:00:00', 'Cliente deseja vidro temperado');