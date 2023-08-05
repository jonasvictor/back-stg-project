-- Tabela usuario
CREATE TABLE IF NOT EXISTS usuario
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela tipo_transacao
CREATE TABLE IF NOT EXISTS tipo_transacao
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipo_transacao (id, nome) VALUES
    (1, 'saque'),
    (2, 'depósito');

-- Tabela status_transacao
CREATE TABLE IF NOT EXISTS status_transacao
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO status_transacao (id, nome) VALUES
    (1, 'pendente'),
    (2, 'concluído');

-- Tabela transacao
CREATE TABLE IF NOT EXISTS transacao
(
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data TIMESTAMP NOT NULL,
    CONSTRAINT fk_transacao_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT fk_transacao_tipo_id FOREIGN KEY (tipo_id) REFERENCES tipo_transacao (id),
    CONSTRAINT fk_transacao_status_id FOREIGN KEY (status_id) REFERENCES status_transacao (id)
);