import dns from 'node:dns';
import 'dotenv/config';
import { Pool } from 'pg';

dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (error: Error) => {
  console.error('Erro inesperado no pool PostgreSQL:', error);
});

export default pool;
