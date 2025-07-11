-- 1. Enum: tipo de usuário
CREATE TYPE tipo_usuario AS ENUM ('gerente', 'usuario');

-- 2. Tabela: cliente
CREATE TABLE cliente (
    cpf VARCHAR(14) PRIMARY KEY,
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

-- 10. Tabela: venda (relaciona com cliente)
CREATE TABLE venda (
    id SERIAL PRIMARY KEY,
    data_venda DATE DEFAULT CURRENT_DATE,
    forma_pagamento VARCHAR(50),
    valor NUMERIC(10,2),
    origem VARCHAR(50),
    cpf_cliente VARCHAR(14) NOT NULL,
    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) ON DELETE CASCADE
);

-- 11. Tabela: venda_itens (com campos para cálculo de área)
CREATE TABLE venda_itens (
    id SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL REFERENCES venda(id) ON DELETE CASCADE,
    id_produto INTEGER NOT NULL REFERENCES produto(id),
    quantidade NUMERIC(10, 2) NOT NULL DEFAULT 1,
    valor_unitario NUMERIC(10, 2) NOT NULL,
    medida VARCHAR(100),
    descricao TEXT,
    largura NUMERIC(10, 2),
    altura NUMERIC(10, 2),
    valor_total NUMERIC(10, 2)
);

-- 12. Tabela: pagamentos
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL REFERENCES venda(id) ON DELETE CASCADE,
    data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
    valor_pago NUMERIC(10, 2) NOT NULL,
    forma_pagamento VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Confirmado'
);

-- 13. Tabela: venda_audit_log
CREATE TABLE venda_audit_log (
    id SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL REFERENCES venda(id) ON DELETE CASCADE,
    id_admin INTEGER NOT NULL REFERENCES administrador(id),
    campo_alterado VARCHAR(100) NOT NULL,
    valor_antigo TEXT,
    valor_novo TEXT
);

-- 14. Tabela: despesa
CREATE TABLE despesa (
    id SERIAL PRIMARY KEY,
    tipo_despesa VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_cadastro DATE NOT NULL
);

-- 15. Tabela: administrador_despesa
CREATE TABLE administrador_despesa (
    id_admin INTEGER,
    id_despesa INTEGER,
    PRIMARY KEY (id_admin, id_despesa),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id)
);

-- Dados iniciais
INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES
('Ana Gerente', 'ana@empresa.com', 'senha123', 'gerente'),
('Carlos Usuario', 'carlos@empresa.com', 'senha123', 'usuario');

INSERT INTO cliente (cpf, nome, email, endereco) VALUES
('123.456.789-00', 'João da Silva', 'joao@gmail.com', 'Rua A, 123'),
('987.654.321-00', 'Maria Oliveira', 'maria@gmail.com', 'Av. B, 456');

INSERT INTO produto (nome, valor_m2) VALUES
('Vidro temperado 8mm', 120.00),
('Espelho 4mm bisotê', 90.00),
('Vidro laminado 6mm', 150.00),
('Box padrão', 200.00);