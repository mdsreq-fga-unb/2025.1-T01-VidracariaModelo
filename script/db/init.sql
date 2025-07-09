-- Tabela: cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    endereco TEXT
);

-- Tabela: administrador
CREATE TABLE administrador (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    tipo_usuario VARCHAR(50)
);

-- Tabela: agendamento
CREATE TABLE agendamento (
    id_agendamento SERIAL PRIMARY KEY,
    data DATE,
    horario TIME,
    status VARCHAR(50),
    observacoes TEXT,
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

-- ...demais tabelas permanecem iguais...

-- 1. Clientes
INSERT INTO cliente (nome, telefone, endereco) VALUES
('João da Silva', '(11) 99999-1111', 'Rua das Flores, 123'),
('Maria Oliveira', '(21) 98888-2222', 'Av. Brasil, 456');

-- 2. Administradores
INSERT INTO administrador (cpf, nome, email, tipo_usuario) VALUES
('999.999.999-99', 'Admin Geral', 'admin@empresa.com', 'gerente'),
('888.888.888-88', 'Ana Souza', 'ana@empresa.com', 'operacional');

-- 3. Agendamentos
INSERT INTO agendamento (data, horario, status, observacoes, id_cliente) VALUES
('2025-07-01', '10:00', 'agendado', 'Cliente solicitou serviço completo', 1),
('2025-07-02', '14:00', 'confirmado', 'Agendamento confirmado via telefone', 2);

-- ...demais inserts permanecem iguais...