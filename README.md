# Projeto Backend

Este projeto implementa um sistema de CRUD de usuários e funcionalidades relacionadas a transações como depósitos, saques, verificação de saldo e geração de extrato.

## Tecnologias Utilizadas

- TypeScript
- Postgres
- TypeORM
- Redis
- JWT

## Pré-requisitos

Antes de iniciar o projeto, você precisará ter instalados:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Node (recomendado a versão 16.20.1)
- NPM (recomendado a versão 8.19.4)

## Iniciando o Projeto

1. Instale as dependências do projeto:

   ```bash
   npm install
   ```

2. Inicie a aplicação utilizando o Docker Compose:

   ```bash
   docker compose up -d
   ```

3. Você pode verificar o status dos contêineres usando o seguinte comando:

   ```bash
   docker compose ps
   ```

4. Acesse a aplicação em `http://localhost:3000`.

## Endpoints

### Usuários

#### Criar um novo usuário

```http
POST localhost:3000/usuarios/
```

Body:

```json
{
  "name": "Teste1",
  "email": "Teste1@gmail.com",
  "senha": "123"
}
```

#### Listar todos os usuários

```http
GET localhost:3000/usuarios/
```

#### Buscar um usuário pelo ID

```http
GET localhost:3000/usuarios/1
```

#### Atualizar um usuário pelo ID

```http
PUT localhost:3000/usuarios/1
```

Body:

```json
{
  "name": "Teste1",
  "email": "Teste1@gmail.com"
}
```

#### Excluir um usuário pelo ID

```http
DELETE localhost:3000/usuarios/1
```

#### Autenticação de usuário

```http
POST localhost:3000/login/
```

Body:

```json
{
  "email": "Teste1@gmail.com",
  "senha": "123"
}
```

### Transações

#### Realizar um depósito

```http
POST localhost:3000/transacoes/deposito
```

Body:

```json
{
  "valor": 100.0,
  "usuario_id": 1
}
```

#### Realizar um saque

```http
POST localhost:3000/transacoes/saque
```

Body:

```json
{
  "valor": 50.0,
  "usuario_id": 1
}
```

#### Obter o saldo de um usuário

```http
GET localhost:3000/saldo/1
```

#### Obter o extrato de todas as transações de um usuário

```http
GET localhost:3000/extrato/1
```

#### Obter o extrato de transações de depósito de um usuário

```http
GET localhost:3000/extrato/deposito/1
```

#### Obter o extrato de transações de saque de um usuário

```http
GET localhost:3000/extrato/saque/1
```

#### Atualizar o status de uma transação

```http
PUT localhost:3000/transacoes/1
```

Body:

```json
{
  "status_id": 2
}
```
