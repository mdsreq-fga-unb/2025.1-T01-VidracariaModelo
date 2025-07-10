-- 1. Enum: tipo de usuário
CREATE TYPE tipo_usuario AS ENUM ('gerente', 'usuario');

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    endereco TEXT,
    CONSTRAINT email_valido CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    )
);

-- 3. Tabela: administrador
CREATE TABLE administrador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario tipo_usuario NOT NULL
);

-- 4. Tabela: agendamento
CREATE TABLE agendamento (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    observacoes TEXT,
    id_cliente INTEGER NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE
);

-- 5. Tabela: atividade
CREATE TABLE atividade (
    id SERIAL PRIMARY KEY,
    descricao_servico TEXT NOT NULL,
    descricao_pagamento TEXT,
    valor_total NUMERIC(10,2) NOT NULL,
    id_agendamento INTEGER NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id) ON DELETE CASCADE
);

-- 6. Tabela: orcamento
CREATE TABLE orcamento (
    id SERIAL PRIMARY KEY,
    prazo_vigente DATE NOT NULL,
    id_atividade INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id) ON DELETE CASCADE
);

-- 7. Tabela: produto
CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_m2 NUMERIC(10,2) NOT NULL
);

-- 8. Tabela: servico
CREATE TABLE servico (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    id_atividade INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id) ON DELETE CASCADE
);

-- 9. Tabela: venda
CREATE TABLE venda (
    id SERIAL PRIMARY KEY,
    data_venda DATE DEFAULT CURRENT_DATE,
    forma_pagamento VARCHAR(50),
    valor NUMERIC(10,2),
    id_admin INTEGER NOT NULL,
    id_servico INTEGER UNIQUE NOT NULL,
    id_produto INTEGER NOT NULL,
    medida VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_servico) REFERENCES servico(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);

-- 10. Tabela: despesa
CREATE TABLE despesa (
    id SERIAL PRIMARY KEY,
    tipo_despesa VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_cadastro DATE NOT NULL
);

-- 11. Tabela: administrador_despesa
CREATE TABLE administrador_despesa (
    id_admin INTEGER,
    id_despesa INTEGER,
    PRIMARY KEY (id_admin, id_despesa),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id)
);

-- 12. Tabela: realiza
CREATE TABLE realiza (
    id_admin INTEGER,
    id_agendamento INTEGER,
    PRIMARY KEY (id_admin, id_agendamento),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id) ON DELETE CASCADE
);



-- Inserir dados na tabela cliente
INSERT INTO cliente (nome, email, endereco) VALUES
('João Silva', 'joao.silva@email.com', 'Rua das Flores, 123'),
('Maria Oliveira', 'maria.oliveira@email.com', 'Av. Brasil, 456'),
('Carlos Pereira', 'carlos.pereira@email.com', 'Rua do Comércio, 789');

-- Inserir dados na tabela administrador
INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES
('Ana Gerente', 'ana.gerente@email.com', 'senhaAna123', 'gerente'),
('Pedro Usuario', 'pedro.usuario@email.com', 'senhaPedro123', 'usuario');

-- Inserir dados na tabela agendamento
INSERT INTO agendamento (data, horario, status, observacoes, id_cliente) VALUES
('2025-07-15', '09:00:00', 'agendado', 'Reunião inicial', 1),
('2025-07-16', '14:30:00', 'confirmado', 'Visita técnica', 2),
('2025-07-17', '11:00:00', 'cancelado', 'Cliente pediu cancelamento', 3);

-- Inserir dados na tabela atividade
INSERT INTO atividade (descricao_servico, descricao_pagamento, valor_total, id_agendamento) VALUES
('Instalação de vidros', 'Pagamento à vista', 1500.00, 1),
('Manutenção preventiva', 'Pagamento parcelado', 800.00, 2),
('Substituição de peças', 'Pagamento à vista', 500.00, 3);

-- Inserir dados na tabela orcamento
INSERT INTO orcamento (prazo_vigente, id_atividade) VALUES
('2025-08-01', 1),
('2025-08-15', 2),
('2025-08-10', 3);

-- Inserir dados na tabela produto
INSERT INTO produto (nome, valor_m2) VALUES
('Vidro Temperado', 120.00),
('Alumínio', 200.00),
('Fita Vedação', 15.00);

-- Inserir dados na tabela servico
INSERT INTO servico (status, id_atividade) VALUES
('em andamento', 1),
('concluído', 2),
('pendente', 3);

-- Inserir dados na tabela venda
INSERT INTO venda (data_venda, forma_pagamento, valor, id_admin, id_servico, id_produto, medida) VALUES
('2025-07-12', 'Cartão de crédito', 1800.00, 1, 1, 1, '10m²'),
('2025-07-13', 'Boleto bancário', 850.00, 2, 2, 2, '4m²'),
('2025-07-14', 'Dinheiro', 520.00, 1, 3, 3, '5m');

-- Inserir dados na tabela despesa
INSERT INTO despesa (tipo_despesa, descricao, data_cadastro) VALUES
('Material', 'Compra de vidros e alumínio', '2025-07-01'),
('Transporte', 'Frete para entrega de materiais', '2025-07-02'),
('Manutenção', 'Manutenção do maquinário', '2025-07-03');

-- Inserir dados na tabela administrador_despesa
INSERT INTO administrador_despesa (id_admin, id_despesa) VALUES
(1, 1),
(2, 2),
(1, 3);

-- Inserir dados na tabela realiza
INSERT INTO realiza (id_admin, id_agendamento) VALUES
(1, 1),
(2, 2),
(1, 3);
