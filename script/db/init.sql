-- Tabela: cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT
);

-- Tabela: administrador
CREATE TABLE administrador (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL
);

-- Tabela: agendamento
CREATE TABLE agendamento (
    id_agendamento SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    observacoes TEXT,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

-- Tabela: atividade
CREATE TABLE atividade (
    id_atividade SERIAL PRIMARY KEY,
    descricao_servico TEXT NOT NULL,
    descricao_pagamento TEXT,
    valor_total NUMERIC(10,2) NOT NULL,
    id_agendamento INT NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id_agendamento)
);

-- Tabela: orcamento
CREATE TABLE orcamento (
    id_orcamento SERIAL PRIMARY KEY,
    prazo_vigente DATE NOT NULL,
    id_atividade INT UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade)
);

-- Tabela: produto
CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_m2 NUMERIC(10,2) NOT NULL
);

-- Tabela: servico
CREATE TABLE servico (
    id_servico SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    id_atividade INT UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade)
);

-- Tabela: venda
CREATE TABLE venda (
    id_venda SERIAL PRIMARY KEY,
    data_venda DATE DEFAULT CURRENT_DATE,
    forma_pagamento VARCHAR(50),
    valor NUMERIC(10,2),
    cpf_admin VARCHAR(14),
    id_servico INT UNIQUE NOT NULL,
    id_produto INT NOT NULL,
    medida VARCHAR(20) NOT NULL,  -- mudou para VARCHAR
    FOREIGN KEY (cpf_admin) REFERENCES administrador(cpf),
    FOREIGN KEY (id_servico) REFERENCES servico(id_servico),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);


-- Tabela: despesa
CREATE TABLE despesa (
    id_despesa SERIAL PRIMARY KEY,
    tipo_despesa VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_cadastro DATE NOT NULL
);

-- Tabela: administrador_despesa
CREATE TABLE administrador_despesa (
    cpf_admin VARCHAR(14),
    id_despesa INT,
    PRIMARY KEY (cpf_admin, id_despesa),
    FOREIGN KEY (cpf_admin) REFERENCES administrador(cpf),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id_despesa)
);

-- Tabela: realiza
CREATE TABLE realiza (
    cpf_admin VARCHAR(14),
    id_agendamento INT,
    PRIMARY KEY (cpf_admin, id_agendamento),
    FOREIGN KEY (cpf_admin) REFERENCES administrador(cpf),
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id_agendamento)
);

-- Inserções

-- 1. Clientes
-- 1. Clientes (ex: residências e empresas que compram vidros)
INSERT INTO cliente (nome, telefone, endereco) VALUES
('Residencial Jardim das Acácias', '(11) 98765-4321', 'Rua das Acácias, 100'),
('Loja Espelhos & Vidros Ltda.', '(21) 99887-6543', 'Av. Principal, 500');

-- 2. Administradores (funcionários da vidraçaria)
INSERT INTO administrador (cpf, nome, email, tipo_usuario) VALUES
('123.456.789-00', 'Ana Souza', 'ana@vidracaria.com', 'gerente'),
('987.654.321-00', 'Carlos Lima', 'carlos@vidracaria.com', 'operacional');

-- 3. Agendamentos (datas para instalação ou orçamento)
INSERT INTO agendamento (data, horario, status, observacoes, id_cliente) VALUES
('2025-07-10', '09:00', 'confirmado', 'Instalação de vidro temperado na varanda', 1),
('2025-07-12', '15:00', 'pendente', 'Orçamento para espelhos personalizados', 2);

-- 4. Atividades (serviços prestados)
INSERT INTO atividade (descricao_servico, descricao_pagamento, valor_total, id_agendamento) VALUES
('Instalação de vidro temperado 10mm', 'PIX', 1200.00, 1),
('Fornecimento e corte de espelhos sob medida', 'Cartão', 850.00, 2);

-- 5. Orçamentos (prazo de validade para o serviço)
INSERT INTO orcamento (prazo_vigente, id_atividade) VALUES
('2025-07-20', 1),
('2025-07-25', 2);

-- 6. Produtos (tipos de vidro, espelho, etc)
INSERT INTO produto (nome, valor_m2) VALUES
('Vidro Temperado 10mm', 150.00),
('Espelho 6mm Lapidado', 120.00);

-- 7. Serviços (status do serviço vinculado à atividade)
INSERT INTO servico (status, id_atividade) VALUES
('concluído', 1),
('pendente', 2);

-- 8. Vendas (registro final com medidas reais)
INSERT INTO venda (data_venda, forma_pagamento, valor, cpf_admin, id_servico, id_produto, medida) VALUES
('2025-07-10', 'PIX', NULL, '123.456.789-00', 1, 1, '5x2m'),
('2025-07-12', 'Cartão', NULL, '987.654.321-00', 2, 2, '3x2.5m');

-- 9. Despesas (materiais e manutenção)
INSERT INTO despesa (tipo_despesa, descricao, data_cadastro) VALUES
('Material de vidro', 'Compra de vidro temperado e espelhos', '2025-06-28'),
('Equipamentos', 'Manutenção da máquina de corte de vidro', '2025-07-02');

-- 10. administrador_despesa (quem registrou a despesa)
INSERT INTO administrador_despesa (cpf_admin, id_despesa) VALUES
('123.456.789-00', 1),
('987.654.321-00', 2);

-- 11. realiza (quem gerenciou qual agendamento)
INSERT INTO realiza (cpf_admin, id_agendamento) VALUES
('123.456.789-00', 1),
('987.654.321-00', 2);
