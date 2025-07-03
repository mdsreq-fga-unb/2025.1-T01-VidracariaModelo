-- Tabela: cliente
CREATE TABLE cliente (
    cpf VARCHAR(14) PRIMARY KEY,
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
    cpf_cliente VARCHAR(14),
    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf)
);

-- Tabela: atividade
CREATE TABLE atividade (
    id_atividade SERIAL PRIMARY KEY,
    descricao_servico TEXT,
    descricao_pagamento TEXT,
    valor_total NUMERIC(10,2),
    id_agendamento INT,
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id_agendamento)
);

-- Tabela: orcamento
CREATE TABLE orcamento (
    id_orcamento SERIAL PRIMARY KEY,
    prazo_vigente DATE,
    id_atividade INT,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade)
);

-- Tabela: servico
CREATE TABLE servico (
    id_servico SERIAL PRIMARY KEY,
    status VARCHAR(50),
    id_atividade INT UNIQUE,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade)
);

-- Tabela: venda
CREATE TABLE venda (
    id_venda SERIAL PRIMARY KEY,
    id_servico INT UNIQUE,
    FOREIGN KEY (id_servico) REFERENCES servico(id_servico)
);

-- Tabela: recibo
CREATE TABLE recibo (
    id_recibo SERIAL PRIMARY KEY,
    id_venda INT UNIQUE,
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda)
);

-- Tabela: despesa
CREATE TABLE despesa (
    id_despesa SERIAL PRIMARY KEY,
    tipo_despesa VARCHAR(100),
    descricao TEXT,
    data_cadastro DATE
);

-- Tabela: registro de despesa por administrador
CREATE TABLE administrador_despesa (
    cpf_admin VARCHAR(14),
    id_despesa INT,
    PRIMARY KEY (cpf_admin, id_despesa),
    FOREIGN KEY (cpf_admin) REFERENCES administrador(cpf),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id_despesa)
);

-- Tabela: realiza (administrador → agendamento)
CREATE TABLE realiza (
    cpf_admin VARCHAR(14),
    id_agendamento INT,
    PRIMARY KEY (cpf_admin, id_agendamento),
    FOREIGN KEY (cpf_admin) REFERENCES administrador(cpf),
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id_agendamento)
);


-- 1. Clientes
INSERT INTO cliente (cpf, nome, telefone, endereco) VALUES
('111.111.111-11', 'João da Silva', '(11) 99999-1111', 'Rua das Flores, 123'),
('222.222.222-22', 'Maria Oliveira', '(21) 98888-2222', 'Av. Brasil, 456');

-- 2. Administradores
INSERT INTO administrador (cpf, nome, email, tipo_usuario) VALUES
('999.999.999-99', 'Admin Geral', 'admin@empresa.com', 'gerente'),
('888.888.888-88', 'Ana Souza', 'ana@empresa.com', 'operacional');

-- 3. Agendamentos
INSERT INTO agendamento (data, horario, status, observacoes, cpf_cliente) VALUES
('2025-07-01', '10:00', 'agendado', 'Cliente solicitou serviço completo', '111.111.111-11'),
('2025-07-02', '14:00', 'confirmado', 'Agendamento confirmado via telefone', '222.222.222-22');

-- 4. Atividades
INSERT INTO atividade (descricao_servico, descricao_pagamento, valor_total, id_agendamento) VALUES
('Limpeza completa do imóvel', 'Pagamento via pix', 300.00, 1),
('Reparo elétrico', 'Pagamento em dinheiro', 150.00, 2);

-- 5. Orçamentos
INSERT INTO orcamento (prazo_vigente, id_atividade) VALUES
('2025-07-10', 1),
('2025-07-15', 2);

-- 6. Serviços
INSERT INTO servico (status, id_atividade) VALUES
('pendente', 1),
('concluído', 2);

-- 7. Vendas
INSERT INTO venda (id_servico) VALUES
(1),
(2);

-- 8. Recibos
INSERT INTO recibo (id_venda) VALUES
(1),
(2);

-- 9. Despesas
INSERT INTO despesa (tipo_despesa, descricao, data_cadastro) VALUES
('Materiais de limpeza', 'Compra de produtos de limpeza', '2025-06-30'),
('Manutenção de equipamentos', 'Reparo de ferramentas', '2025-06-25');

-- 10. administrador_despesa
INSERT INTO administrador_despesa (cpf_admin, id_despesa) VALUES
('999.999.999-99', 1),
('888.888.888-88', 2);

-- 11. realiza
INSERT INTO realiza (cpf_admin, id_agendamento) VALUES
('999.999.999-99', 1),
('888.888.888-88', 2);
