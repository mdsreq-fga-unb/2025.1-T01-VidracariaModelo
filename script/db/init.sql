-- 1. Enum: tipo de usuário
CREATE TYPE tipo_usuario AS ENUM ('gerente', 'usuario');

-- 2. Tabela: cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT
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
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

-- 5. Tabela: atividade
CREATE TABLE atividade (
    id SERIAL PRIMARY KEY,
    descricao_servico TEXT NOT NULL,
    descricao_pagamento TEXT,
    valor_total NUMERIC(10,2) NOT NULL,
    id_agendamento INTEGER NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id)
);

-- 6. Tabela: orcamento
CREATE TABLE orcamento (
    id SERIAL PRIMARY KEY,
    prazo_vigente DATE NOT NULL,
    id_atividade INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id)
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
    FOREIGN KEY (id_atividade) REFERENCES atividade(id)
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
    FOREIGN KEY (id_servico) REFERENCES servico(id),
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
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id)
);

-- 1. Clientes
INSERT INTO cliente (nome, telefone, endereco) VALUES
('Residencial Jardim das Acácias', '(11) 98765-4321', 'Rua das Acácias, 100'),
('Loja Espelhos & Vidros Ltda.', '(21) 99887-6543', 'Av. Principal, 500');

-- 2. Administradores (senhas devem ser bcrypt no app; aqui usamos placeholders)
INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES
('Ana Souza', 'ana@vidracaria.com', '$2a$08$admin12345678901234567890', 'gerente'),
('Carlos Lima', 'carlos@vidracaria.com', '$2a$08$admin12345678901234567890', 'usuario');

-- 3. Agendamentos
INSERT INTO agendamento (data, horario, status, observacoes, id_cliente) VALUES
('2025-07-10', '09:00', 'confirmado', 'Instalação de vidro temperado na varanda', 1),
('2025-07-12', '15:00', 'pendente', 'Orçamento para espelhos personalizados', 2);

-- 4. Atividades
INSERT INTO atividade (descricao_servico, descricao_pagamento, valor_total, id_agendamento) VALUES
('Instalação de vidro temperado 10mm', 'PIX', 1200.00, 1),
('Fornecimento e corte de espelhos sob medida', 'Cartão', 850.00, 2);

-- 5. Orçamentos
INSERT INTO orcamento (prazo_vigente, id_atividade) VALUES
('2025-07-20', 1),
('2025-07-25', 2);

-- 6. Produtos
INSERT INTO produto (nome, valor_m2) VALUES
('Vidro Temperado 10mm', 150.00),
('Espelho 6mm Lapidado', 120.00);

-- 7. Serviços
INSERT INTO servico (status, id_atividade) VALUES
('concluído', 1),
('pendente', 2);

-- 8. Vendas (valores iguais aos da atividade para exemplo)
INSERT INTO venda (data_venda, forma_pagamento, valor, id_admin, id_servico, id_produto, medida) VALUES
('2025-07-10', 'PIX', 1200.00, 1, 1, 1, '5x2m'),
('2025-07-12', 'Cartão', 850.00, 2, 2, 2, '3x2.5m');

-- 9. Despesas
INSERT INTO despesa (tipo_despesa, descricao, data_cadastro) VALUES
('Material de vidro', 'Compra de vidro temperado e espelhos', '2025-06-28'),
('Equipamentos', 'Manutenção da máquina de corte de vidro', '2025-07-02');

-- 10. administrador_despesa
INSERT INTO administrador_despesa (id_admin, id_despesa) VALUES
(1, 1),
(2, 2);

-- 11. realiza
INSERT INTO realiza (id_admin, id_agendamento) VALUES
(1, 1),
(2, 2);
