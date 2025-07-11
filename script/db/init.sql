-- 1. Enum: tipo de usuário
CREATE TYPE tipo_usuario AS ENUM ('gerente', 'usuario');

-- 2. Tabela: cliente (cpf como PK)
CREATE TABLE cliente (
    cpf VARCHAR(14) PRIMARY KEY, -- formato com pontos e traço
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
    cpf_cliente VARCHAR(14) NOT NULL,
    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) ON DELETE CASCADE
);

-- 5. Tabela: realiza
CREATE TABLE realiza (
    id_admin INTEGER,
    id_agendamento INTEGER,
    PRIMARY KEY (id_admin, id_agendamento),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id) ON DELETE CASCADE
);

-- 6. Tabela: atividade
CREATE TABLE atividade (
    id SERIAL PRIMARY KEY,
    descricao_servico TEXT NOT NULL,
    descricao_pagamento TEXT,
    valor_total NUMERIC(10,2) NOT NULL,
    id_agendamento INTEGER NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES agendamento(id) ON DELETE CASCADE
);

-- 7. Tabela: orcamento
-- 7. Tabela: orcamento (agora com cpf_cliente referenciando cliente)
CREATE TABLE orcamento (
    id SERIAL PRIMARY KEY,
    prazo_vigente DATE NOT NULL,
    id_atividade INTEGER UNIQUE NOT NULL,
    cpf_cliente VARCHAR(14) NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id) ON DELETE CASCADE,
    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) ON DELETE CASCADE
);


-- 8. Tabela: produto
CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_m2 NUMERIC(10,2) NOT NULL
);

-- 9. Tabela: servico
CREATE TABLE servico (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    id_atividade INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id) ON DELETE CASCADE
);

-- 10. Tabela: venda (com origem, version, e referência ao orçamento)
CREATE TABLE venda (
    id SERIAL PRIMARY KEY,
    data_venda DATE DEFAULT CURRENT_DATE,
    forma_pagamento VARCHAR(50),
    valor NUMERIC(10,2),
    origem VARCHAR(50), -- RN55
    id_orcamento INTEGER REFERENCES orcamento(id), -- RN48
    FOREIGN KEY (id_servico) REFERENCES servico(id) ON DELETE CASCADE
);

-- 11. Tabela: venda_itens (substitui id_produto e medida)
CREATE TABLE venda_itens (
    id SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL REFERENCES venda(id) ON DELETE CASCADE,
    id_produto INTEGER NOT NULL REFERENCES produto(id),
    quantidade NUMERIC(10, 2) NOT NULL,
    valor_unitario NUMERIC(10, 2) NOT NULL,
    medida VARCHAR(100), -- Ex: "2.50x1.20"
    descricao TEXT
);

-- 12. Tabela: pagamentos (relacionado à venda)
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL REFERENCES venda(id) ON DELETE CASCADE,
    data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
    valor_pago NUMERIC(10, 2) NOT NULL,
    forma_pagamento VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Confirmado' -- Ex: Confirmado, Pendente
);



-- 14. Tabela: despesa
CREATE TABLE despesa (
    id SERIAL PRIMARY KEY,
    tipo_despesa VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_cadastro DATE NOT NULL
);

-- 15. Tabela: administrador_despesa (relação N:N entre administradores e despesas)
CREATE TABLE administrador_despesa (
    id_admin INTEGER,
    id_despesa INTEGER,
    PRIMARY KEY (id_admin, id_despesa),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id)
);

-- 1. Administradores
INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES
('Ana Gerente', 'ana@empresa.com', 'senha123', 'gerente'),
('Carlos Usuario', 'carlos@empresa.com', 'senha123', 'usuario');

-- 2. Clientes
INSERT INTO cliente (cpf, nome, email, endereco) VALUES
('123.456.789-00', 'João da Silva', 'joao@gmail.com', 'Rua A, 123'),
('987.654.321-00', 'Maria Oliveira', 'maria@gmail.com', 'Av. B, 456');

-- 3. Agendamentos
INSERT INTO agendamento (data, horario, status, observacoes, cpf_cliente) VALUES
('2025-07-15', '10:00', 'confirmado', 'Orçamento de box', '123.456.789-00'),
('2025-07-16', '14:00', 'agendado', 'Vidro temperado', '987.654.321-00');

-- 4. Relaciona administradores com agendamentos
INSERT INTO realiza (id_admin, id_agendamento) VALUES
(1, 1),
(2, 2);

-- 5. Atividades
INSERT INTO atividade (descricao_servico, descricao_pagamento, valor_total, id_agendamento) VALUES
('Instalação de box de vidro', 'Pagamento em dinheiro', 450.00, 1),
('Troca de janela', 'Parcelado no cartão', 780.00, 2);

-- 6. Orçamentos
-- 6. Orçamentos (corrigido com cpf_cliente)
INSERT INTO orcamento (prazo_vigente, id_atividade, cpf_cliente) VALUES
('2025-07-30', 1, '123.456.789-00'),
('2025-07-25', 2, '987.654.321-00');

-- 7. Produtos
INSERT INTO produto (nome, valor_m2) VALUES
('Vidro temperado 8mm', 120.00),
('Espelho 4mm bisotê', 90.00);

-- 8. Serviços
INSERT INTO servico (status, id_atividade) VALUES
('concluido', 1),
('em andamento', 2);

-- 9. Vendas
INSERT INTO venda (data_venda, forma_pagamento, valor, origem, id_servico, id_orcamento) VALUES
('2025-07-17', 'dinheiro', 450.00, 'whatsapp', 1, 1, 1, 1),
('2025-07-18', 'cartão', 780.00, 'site', 1, 2, 2, 2);

-- 10. Itens da venda
INSERT INTO venda_itens (id_venda, id_produto, quantidade, valor_unitario, medida, descricao) VALUES
(1, 1, 2.5, 120.00, '2.50x1.00', 'Box para banheiro'),
(2, 2, 3.0, 90.00, '1.50x2.00', 'Espelho para sala');

-- 11. Pagamentos
INSERT INTO pagamentos (id_venda, data_pagamento, valor_pago, forma_pagamento, status) VALUES
(1, '2025-07-17', 450.00, 'dinheiro', 'Confirmado'),
(2, '2025-07-18', 780.00, 'cartão', 'Confirmado');

-- 12. Logs de alteração de vendas
INSERT INTO venda_audit_log (id_venda, id_admin, campo_alterado, valor_antigo, valor_novo) VALUES
(1, 1, 'valor', '400.00', '450.00'),
(2, 2, 'forma_pagamento', 'boleto', 'cartão');

-- 13. Despesas
INSERT INTO despesa (tipo_despesa, descricao, data_cadastro) VALUES
('Aluguel', 'Pagamento do aluguel da loja', '2025-07-01'),
('Material', 'Compra de vidro temperado', '2025-07-03');

-- 14. Relaciona administradores com despesas
INSERT INTO administrador_despesa (id_admin, id_despesa) VALUES
(1, 1),
(2, 2);
