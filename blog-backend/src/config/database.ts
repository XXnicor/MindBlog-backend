import 'dotenv/config';
import { Pool } from 'pg';

function getConnectionString(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não definida. Configure DATABASE_URL no arquivo .env');
  }

  const hasSslMode = /[?&]sslmode=/.test(databaseUrl);
  const hasLibpqCompat = /[?&]uselibpqcompat=/.test(databaseUrl);

  let url = databaseUrl;
  
  if (!hasSslMode) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  }

  return url;
}

const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (error: Error) => {
  console.error('Erro inesperado no pool PostgreSQL:', error);
});

export default pool;
