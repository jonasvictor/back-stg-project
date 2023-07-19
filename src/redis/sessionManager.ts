import { createClient } from 'redis';

const client = createClient({
    url: 'redis://localhost:6379'
});
  
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export async function getSession(key = '') {
    return await client.hGetAll(key);
}

export async function setSession(key = '', value = {}) {
    await client.hSet(key, value)
}

export function getToken(headers: any) {
    const token = headers['authorization'].split(' ')[1];
    return token
}

export async function removeSession(key = '') {
    await client.del(key);

    return true;
}