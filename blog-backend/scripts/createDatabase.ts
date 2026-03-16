import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

async function createDatabase() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
  const dbName = process.env.DB_NAME || 'blog_db';

  if (!host || !user || !password) {
    console.error('❌ Variáveis DB_HOST, DB_USER e DB_PASSWORD são obrigatórias no .env');
    process.exit(1);
  }

  const client = new Client({
    host,
    user,
    password,
    port,
    database: 'postgres',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Banco '${dbName}' criado com sucesso (ou já existia).`);
  } catch (err: any) {
    if (err?.code === '42P04') {
      console.log(`ℹ️ Banco '${dbName}' já existe.`);
    } else {
      console.error('❌ Erro ao criar banco:', err.message);
      process.exitCode = 1;
    }
  } finally {
    await client.end();
  }
}

createDatabase();
