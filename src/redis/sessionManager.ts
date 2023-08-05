import { createClient } from 'redis';

// Cria o cliente do Redis
const client = createClient({
  url: 'redis://service-redis:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

// Função para obter uma sessão do Redis
export async function getSession(key = '') {
  return await client.hGetAll(key);
}

// Função para definir uma sessão no Redis
export async function setSession(key = '', value = {}) {
  await client.hSet(key, value);
}

// Função para obter o token de autorização
export function getToken(headers: any) {
  const token = headers['authorization'].split(' ')[1];
  return token;
}

// Função para remover uma sessão do Redis
export async function removeSession(key = '') {
  await client.del(key);
  return true;
}
