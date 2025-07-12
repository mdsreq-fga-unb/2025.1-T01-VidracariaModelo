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
    valor NUMERIC(10, 2) NOT NULL,
    descricao TEXT,
    data_despesa DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 15. Tabela: administrador_despesa
CREATE TABLE administrador_despesa (
    id_admin INTEGER,
    id_despesa INTEGER,
    PRIMARY KEY (id_admin, id_despesa),
    FOREIGN KEY (id_admin) REFERENCES administrador(id),
    FOREIGN KEY (id_despesa) REFERENCES despesa(id)
);

-- 16. Tabela: solicitacao_orcamento (cabeçalho da solicitação)
CREATE TABLE solicitacao_orcamento (
    id SERIAL PRIMARY KEY,
    cpf_cliente VARCHAR(14) NOT NULL,
    data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente', -- Ex: Pendente, Em Análise, Concluído
    observacoes TEXT,
    valor_ofertado NUMERIC(10, 2), -- Valor final definido pelo administrador
    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) ON DELETE CASCADE
);

-- 17. Tabela: solicitacao_orcamento_itens (itens da solicitação)
CREATE TABLE solicitacao_orcamento_itens (
    id SERIAL PRIMARY KEY,
    id_solicitacao INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    largura NUMERIC(10, 2) NOT NULL,
    altura NUMERIC(10, 2) NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    observacoes TEXT,
    FOREIGN KEY (id_solicitacao) REFERENCES solicitacao_orcamento(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);

-- 18. Tabela: Dúvidas frequentes e Repostas (itens da área de Dúvidas)
CREATE TABLE duvidas_e_respostas (
    id SERIAL PRIMARY KEY,
    duvida TEXT NOT NULL,
    resposta TEXT NOT NULL
);

-- Dados iniciais
-- A senha para todos os administradores é 'senha123' (hash bcrypt)
INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES
('Ana Gerente', 'ana@empresa.com', '$2a$08$zG.i4n5F06eIelHnCqTj0.t2lJcAmVwISbA5i5gJcW2zJg5a.Yn.S', 'gerente'),
('Carlos Usuario', 'carlos@empresa.com', '$2a$08$zG.i4n5F06eIelHnCqTj0.t2lJcAmVwISbA5i5gJcW2zJg5a.Yn.S', 'usuario'),
('Beatriz Vendas', 'bia@empresa.com', '$2a$08$zG.i4n5F06eIelHnCqTj0.t2lJcAmVwISbA5i5gJcW2zJg5a.Yn.S', 'usuario');

INSERT INTO cliente (cpf, nome, email, endereco) VALUES
('123.456.789-00', 'João da Silva', 'joao@gmail.com', 'Rua A, 123, São Paulo-SP'),
('987.654.321-00', 'Maria Oliveira', 'maria@gmail.com', 'Av. B, 456, Rio de Janeiro-RJ'),
('111.222.333-44', 'Carlos Pereira', 'carlos.p@example.com', 'Rua C, 789, Brasília-DF'),
('444.555.666-77', 'Fernanda Costa', 'fernanda@outlook.com', 'Praça D, 101, Belo Horizonte-MG'),
('777.888.999-00', 'Ricardo Souza', 'ricardo.souza@yahoo.com', 'Alameda E, 202, Curitiba-PR');

INSERT INTO produto (nome, valor_m2) VALUES
('Vidro temperado 8mm', 120.00),
('Espelho 4mm bisotê', 90.00),
('Vidro laminado 6mm', 150.00),
('Box padrão', 200.00),
('Guarda-corpo de vidro', 250.00),
('Porta de vidro de correr', 300.00),
('Tampo de mesa de vidro 10mm', 180.00),
('Mão de obra (taxa)', 50.00);

-- Solicitações de Orçamento de Exemplo
INSERT INTO solicitacao_orcamento (cpf_cliente, status, observacoes, valor_ofertado, data_solicitacao) VALUES
('111.222.333-44', 'Aprovado', 'Orçamento para janela da cozinha e espelho do banheiro.', 550.80, '2024-05-20'),
('444.555.666-77', 'Pendente', 'Gostaria de um orçamento para um guarda-corpo na varanda.', null, '2024-06-10'),
('777.888.999-00', 'Concluido', 'Orçamento para porta de vidro.', 1200.00, '2024-04-15');

INSERT INTO solicitacao_orcamento_itens (id_solicitacao, id_produto, largura, altura, quantidade, observacoes) VALUES
(1, 1, 1.50, 1.00, 1, 'Janela para cozinha.'),
(1, 2, 0.80, 1.20, 1, 'Espelho para banheiro.'),
(2, 5, 3.00, 1.10, 1, 'Guarda-corpo para varanda do apartamento.'),
(3, 6, 2.0, 2.1, 1, 'Porta de correr para a sala');

-- Vendas de Exemplo
INSERT INTO venda (data_venda, forma_pagamento, valor, origem, cpf_cliente) VALUES
('2025-05-15', 'Cartão de Crédito', 1140.00, 'Loja Física', '123.456.789-00'),
('2025-06-01', 'Pix', 900.00, 'Indicação', '987.654.321-00');

INSERT INTO venda_itens (id_venda, id_produto, quantidade, valor_unitario, medida, descricao, largura, altura, valor_total) VALUES
(1, 6, 1, 300.00, 'un', 'Porta de vidro para a sala', 2.00, 2.10, 1140.00),
(2, 7, 1, 180.00, 'un', 'Tampo de mesa para sala de jantar', 1.60, 0.90, 900.00);

INSERT INTO pagamentos (id_venda, data_pagamento, valor_pago, forma_pagamento) VALUES
(1, '2025-05-15', 1140.00, 'Cartão de Crédito'),
(2, '2025-06-01', 900.00, 'Pix');

INSERT INTO duvidas_e_respostas( duvida, resposta) VALUES
('Qual o prazo de entrega?', 'O prazo de entrega varia de 7 a 15 dias úteis, dependendo do produto e da complexidade da instalação.'),
('Vocês fazem instalação?', 'Sim, todos os nossos orçamentos incluem a instalação completa realizada por nossa equipe técnica especializada.'),
('Quais formas de pagamento vocês aceitam?', 'Aceitamos Pix, cartões de crédito e débito. Para projetos maiores, oferecemos opções de parcelamento.');

-- Adicionando dados de despesas para teste do dashboard
INSERT INTO despesa (tipo_despesa, valor, descricao, data_despesa) VALUES
('Fornecedores', 1500.00, 'Compra de chapa de vidro 8mm', '2025-05-10'),
('Marketing', 350.00, 'Impulsionamento de posts em redes sociais', '2025-05-20'),
('Salários', 5500.00, 'Pagamento de salários do mês', '2025-06-05'),
('Aluguel', 2000.00, 'Aluguel da loja', '2025-06-05');

-- Agendamentos de Exemplo
INSERT INTO agendamento (data, horario, status, observacoes, cpf_cliente) VALUES
('2024-07-20', '10:00:00', 'Agendado', 'Visita técnica para medição de box.', '777.888.999-00'),
('2024-07-22', '14:00:00', 'Agendado', 'Orçamento para fechamento de varanda.', '444.555.666-77');

-- Vinculando agendamentos a administradores
INSERT INTO realiza (id_admin, id_agendamento) VALUES
(2, 1), (3, 2);