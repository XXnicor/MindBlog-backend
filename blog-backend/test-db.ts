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
  if (!hasLibpqCompat) {
    url += (url.includes('?') ? '&' : '?') + 'uselibpqcompat=true';
  }
  if (!hasSslMode) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  }

  return url;
}

const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: { rejectUnauthorized: false },
});

async function main(): Promise<void> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('DB OK:', result.rows);
  } catch (error) {
    console.error('DB ERROR:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
