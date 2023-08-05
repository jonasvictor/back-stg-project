# Use a imagem base do Node.js com uma versão específica
FROM node:16.20.1

# Crie o diretório da aplicação
RUN mkdir /app

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json para o diretório de trabalho
COPY package.json .

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta em que a aplicação está rodando
EXPOSE 3030

# Comando para iniciar a aplicação quando o contêiner for executado
CMD ["npm", "start"]


# Path: back-stg-project\docker-compose.yml
