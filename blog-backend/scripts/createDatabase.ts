import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function main() {
  const dbName = process.env.DB_NAME;
  if (!dbName) {
    console.error('ERRO: variável DB_NAME não definida no .env');
    process.exit(1);
  }

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;

  const conn = await mysql.createConnection({ host, user, password, port });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Banco criado ou já existente: ${dbName}`);
  } catch (err: any) {
    console.error('❌ Erro ao criar banco:', err.message || err);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main();
