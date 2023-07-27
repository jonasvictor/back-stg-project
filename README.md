# Awesome Project Build with TypeORM

Steps to run this project:

1. Iniciar Redis - `docker run --name service-redis -d redis` | `docker start service-redis`
2. Iniciar db - `docker start postgres`
3. Run `npm i` command
4. Setup database settings inside `data-source.ts` file
5. Run `npm start` command

# Projeto Backend

CRUD de usuários e transações.
[Melhorar descrição]

## Pré-requisitos

Antes de iniciar o projeto, você precisará ter os seguintes pré-requisitos instalados:

- Docker
- Node.js (recomendado a versão 16.20.1)
- NPM (recomendado a versão 8.19.4)

## Iniciando o Projeto

Siga os passos abaixo para iniciar o projeto:

1. Instale as dependências do projeto:

   ```
   npm install
   ```

2. Inicie o banco de dados Postgres e Redis usando o Docker:

   ```
   docker start postgres
   docker start service-redis
   ```

3. Execute o projeto:

   ```
   npm start
   ```

## Tecnologias Utilizadas

- TypeScript
- Postgres
- TypeORM
- Redis
- JWT

## Endpoints

[Falta adicionar]
